-- =============================================================================
-- Blood Bank Management System — Supabase schema
-- Run this whole file once in your project's SQL Editor.
-- Idempotent-ish: safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE / drops
-- policies before recreating). It will NOT delete existing row data.
-- =============================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

-- Mirrors auth.users; role drives authorization + routing.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'donor' check (role in ('admin','donor','patient')),
  donor_id   uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.donors (
  id                 uuid primary key default gen_random_uuid(),
  full_name          text not null,
  gender             text default 'Unspecified',
  address            text default '',
  email              text,
  dob                date,
  blood_type         text,
  phone_no           text,
  is_deferred        boolean not null default false,
  deferral_reason    text default '',
  last_donation_date date,
  created_at         timestamptz not null default now()
);

create table if not exists public.donations (
  id           uuid primary key default gen_random_uuid(),
  donor_id     uuid references public.donors(id) on delete cascade,
  blood_type   text,
  collected_at timestamptz,
  volume_ml    int default 450,
  status       text not null default 'quarantined'
                 check (status in ('quarantined','released','expired','transfused')),
  notes        text,
  created_at   timestamptz not null default now()
);

create table if not exists public.blood_inventory (
  blood_type      text primary key,
  units_available int not null default 0
);

create table if not exists public.blood_requests (
  id              uuid primary key default gen_random_uuid(),
  patient_name    text,
  blood_type      text,
  units_requested int not null default 1,
  urgency         text not null default 'normal',
  hospital_name   text,
  contact_phone   text,
  status          text not null default 'pending'
                    check (status in ('pending','approved','fulfilled','rejected')),
  requested_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- Link profiles.donor_id -> donors.id (added after donors exists).
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'profiles_donor_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_donor_id_fkey
      foreign key (donor_id) references public.donors(id) on delete set null;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Helper: is the current user an admin?  (SECURITY DEFINER avoids RLS recursion)
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Trigger: create profile (+ donor row for donors) on signup
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role      text := coalesce(new.raw_user_meta_data->>'role', 'donor');
  v_full_name text := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  v_donor_id  uuid := null;
begin
  if v_role = 'donor' then
    -- reuse an existing donor row for this email if one was already seeded,
    -- otherwise create a fresh one
    select id into v_donor_id from public.donors where email = new.email limit 1;
    if v_donor_id is null then
      insert into public.donors (full_name, email, blood_type, phone_no)
      values (v_full_name, new.email, 'O+', 'Not provided')
      returning id into v_donor_id;
    end if;
  end if;

  insert into public.profiles (id, email, full_name, role, donor_id)
  values (new.id, new.email, v_full_name, v_role, v_donor_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Trigger: decrement inventory when a request is fulfilled
-- (mirrors the mock's side effect so App.jsx fulfillment works unchanged)
-- -----------------------------------------------------------------------------
create or replace function public.handle_request_fulfilled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'fulfilled' and coalesce(old.status, '') <> 'fulfilled' then
    update public.blood_inventory
      set units_available = greatest(0, units_available - coalesce(new.units_requested, 0))
      where blood_type = new.blood_type;
  end if;
  return new;
end;
$$;

drop trigger if exists on_request_fulfilled on public.blood_requests;
create trigger on_request_fulfilled
  after update on public.blood_requests
  for each row execute function public.handle_request_fulfilled();

-- -----------------------------------------------------------------------------
-- Trigger: adjust inventory when a donation changes to/from 'released'
-- -----------------------------------------------------------------------------
create or replace function public.handle_donation_inventory()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'released' then
      insert into public.blood_inventory (blood_type, units_available)
      values (new.blood_type, 1)
      on conflict (blood_type)
        do update set units_available = public.blood_inventory.units_available + 1;
    end if;
  elsif tg_op = 'UPDATE' then
    if new.status = 'released' and old.status <> 'released' then
      insert into public.blood_inventory (blood_type, units_available)
      values (new.blood_type, 1)
      on conflict (blood_type)
        do update set units_available = public.blood_inventory.units_available + 1;
    elsif old.status = 'released' and new.status <> 'released' then
      update public.blood_inventory
        set units_available = greatest(0, units_available - 1)
        where blood_type = new.blood_type;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists on_donation_inventory on public.donations;
create trigger on_donation_inventory
  after insert or update on public.donations
  for each row execute function public.handle_donation_inventory();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.donors          enable row level security;
alter table public.donations       enable row level security;
alter table public.blood_inventory enable row level security;
alter table public.blood_requests  enable row level security;

-- profiles: a user sees/edits only their own row
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);

-- donors: all authenticated read; only admins write
drop policy if exists donors_select on public.donors;
create policy donors_select on public.donors
  for select to authenticated using (true);

drop policy if exists donors_admin_write on public.donors;
create policy donors_admin_write on public.donors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- donations: all authenticated read; only admins write
drop policy if exists donations_select on public.donations;
create policy donations_select on public.donations
  for select to authenticated using (true);

drop policy if exists donations_admin_write on public.donations;
create policy donations_admin_write on public.donations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- blood_inventory: all authenticated users may READ stock levels (patients need
-- to see availability); only admins may write (see inventory_admin_write below)
drop policy if exists inventory_select on public.blood_inventory;
create policy inventory_select on public.blood_inventory
  for select to authenticated using (true);

drop policy if exists inventory_admin_write on public.blood_inventory;
create policy inventory_admin_write on public.blood_inventory
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- blood_requests: all authenticated read; any authenticated user may create;
-- only admins may update/delete (approve / fulfill / reject)
drop policy if exists requests_select on public.blood_requests;
create policy requests_select on public.blood_requests
  for select to authenticated using (true);

drop policy if exists requests_insert on public.blood_requests;
create policy requests_insert on public.blood_requests
  for insert to authenticated with check (true);

drop policy if exists requests_admin_update on public.blood_requests;
create policy requests_admin_update on public.blood_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists requests_admin_delete on public.blood_requests;
create policy requests_admin_delete on public.blood_requests
  for delete to authenticated using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Seed data (so dashboards aren't empty). ON CONFLICT keeps re-runs safe.
-- -----------------------------------------------------------------------------

-- 8 standard blood types
insert into public.blood_inventory (blood_type, units_available) values
  ('A+', 12), ('A-', 4), ('B+', 8), ('B-', 2),
  ('AB+', 5), ('AB-', 1), ('O+', 15), ('O-', 6)
on conflict (blood_type) do nothing;

-- Sample donors (fixed UUIDs so donations can reference them; re-run safe)
insert into public.donors
  (id, full_name, gender, address, email, dob, blood_type, phone_no, is_deferred, deferral_reason, last_donation_date)
values
  ('00000000-0000-0000-0000-0000000d0001', 'John Doe',      'Male',   '123 Main St, Springfield', 'donor@example.com',    '1990-05-15', 'O+',  '+237675123456', false, '', '2026-03-10'),
  ('00000000-0000-0000-0000-0000000d0002', 'Jane Smith',    'Female', '456 Elm St, Metropolis',   'jane.smith@example.com','1995-09-20', 'A-',  '+237698765432', false, '', '2026-04-12'),
  ('00000000-0000-0000-0000-0000000d0003', 'Robert Johnson','Male',   '789 Pine Rd, Riverdale',   'robert.j@example.com',  '1988-11-02', 'AB+', '+237677889900', false, '', null),
  ('00000000-0000-0000-0000-0000000d0004', 'Emily Davis',   'Female', '101 Cedar Ln, Oakridge',   'emily.d@example.com',   '2000-01-25', 'O-',  '+237690112233', true,  'Temporary deferral: Recent travel to malaria-endemic region.', '2026-05-20')
on conflict (id) do nothing;

-- Sample blood requests
insert into public.blood_requests
  (id, patient_name, blood_type, units_requested, urgency, hospital_name, contact_phone, status)
values
  ('00000000-0000-0000-0000-0000000f0001', 'Alice Brown',    'B+', 2, 'critical', 'City General Hospital',    '+237678998888', 'pending'),
  ('00000000-0000-0000-0000-0000000f0002', 'Michael Wilson', 'O+', 3, 'normal',   'St. Jude Hospital',        '+237699776666', 'approved'),
  ('00000000-0000-0000-0000-0000000f0003', 'Sarah Connor',   'A-', 1, 'urgent',   'County Memorial Hospital', '+237682883333', 'fulfilled')
on conflict (id) do nothing;

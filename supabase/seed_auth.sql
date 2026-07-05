-- =============================================================================
-- OPTIONAL: seed the 3 demo accounts the Login screen's "autofill" buttons use.
--   admin@bloodbank.org   / password123   (role: admin)
--   donor@example.com     / password123   (role: donor)
--   patient@example.com   / password123   (role: patient)
--
-- Run this AFTER schema.sql. The on_auth_user_created trigger will automatically
-- create the matching public.profiles row (and a donors row for the donor).
--
-- NOTE: writing directly into auth.users/auth.identities is version-sensitive.
-- If a demo login fails after running this, just delete these 3 users in
-- Authentication -> Users and sign them up through the app UI instead.
-- =============================================================================

do $$
declare
  r record;
  v_uid uuid;
begin
  for r in
    select * from (values
      ('admin@bloodbank.org', 'Dr. Sarah Jenkins', 'admin'),
      ('donor@example.com',   'John Doe',          'donor'),
      ('patient@example.com', 'Patient Maya Lane', 'patient')
    ) as t(email, full_name, role)
  loop
    -- skip if the user already exists
    if exists (select 1 from auth.users u where u.email = r.email) then
      continue;
    end if;

    v_uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_uid,
      'authenticated',
      'authenticated',
      r.email,
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', r.full_name, 'role', r.role),
      now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(),
      v_uid,
      v_uid::text,
      jsonb_build_object('sub', v_uid::text, 'email', r.email, 'email_verified', true),
      'email',
      now(), now(), now()
    );
  end loop;
end $$;

# Test Users

Credentials used while testing the Supabase backend. **All test passwords are `password123`.**
These are for development/testing only — do not reuse in production, and delete them before go-live.

## Accounts I created live (exist in your Supabase project now)

Created through the app's signup form during end-to-end testing. Real `auth.users`
rows, each with a matching `profiles` row (and a `donors` row for the donor).

| Role    | Email                     | Password      | Full name       |
|---------|---------------------------|---------------|-----------------|
| Admin   | testadmin1@example.com    | password123   | Test Admin      |
| Donor   | testdonor1@example.com    | password123   | Test Donor One  |
| Patient | testpatient1@example.com  | password123   | Test Patient    |

## Demo accounts (only exist if you run `supabase/seed_auth.sql`)

These are the accounts the Login screen's "Admin / Donor / Patient demo" autofill
buttons expect. They do **not** exist until you run `supabase/seed_auth.sql`.

| Role    | Email                  | Password    | Full name          |
|---------|------------------------|-------------|--------------------|
| Admin   | admin@bloodbank.org    | password123 | Dr. Sarah Jenkins  |
| Donor   | donor@example.com      | password123 | John Doe           |
| Patient | patient@example.com    | password123 | Patient Maya Lane  |

## Cleanup

To remove the test login accounts (cascades to their `profiles`/`donors` rows),
run in the Supabase SQL Editor:

```sql
delete from auth.users where email in (
  'testadmin1@example.com',
  'testdonor1@example.com',
  'testpatient1@example.com'
);
```

> Note: `donor@example.com` is also referenced by a seeded `donors` row (John Doe).
> Removing the auth user does not delete that donor record.

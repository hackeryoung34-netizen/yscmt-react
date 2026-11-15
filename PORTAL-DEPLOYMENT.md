# YSCMT Student Portal frontend (VPS-free)

This branch adds a separate portal entry at `/portal/` and an administrator entry at `/portal/admin`.

## Hosting

The intended preview host is Cloudflare Pages/Workers Static Assets. No VPS, SSH server, or always-on Django process is required for this React frontend. Supabase Auth and secured RPC functions provide the portal backend.

## Build environment

Configure these build-time variables in the Cloudflare project:

- `VITE_SUPABASE_URL`: `https://wzpkfjnymsxczbkiukrp.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the Supabase publishable key from the project API settings

The publishable key is intended for browser use. Never add a Supabase service-role key, database password, or Paystack secret to a `VITE_*` variable.

## Current limitations

- Public self-registration is intentionally disabled; YSCMT issues student accounts.
- Admin route verifies the trusted role but management actions are disabled until admin RPCs and audit logging are completed.
- Course catalogue and pending-enrolment requests require Supabase migrations 005–007. Those migrations are staged in the backend repository and have not yet been applied to the Supabase project.
- No production domain or DNS routing is configured by this branch.

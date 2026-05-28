# FreePDFFlow MVP

This workspace contains the MVP routes from the PRD:
- `/` homepage
- `/edit` browser-based PDF editor
- `/login` Supabase auth
- `/dashboard` plan and usage summary
- `/pricing` Stripe checkout entry points
- `/privacy`, `/terms`, `/support`

To install and build locally:

```bash
npm install
npm run build
npm start
```

## Required services

1. Create a Supabase project and add the values from `.env.example` to `.env.local`.
2. Run the SQL migration in `supabase/migrations`.
3. Create Stripe Basic and Pro recurring prices and add their price IDs.
4. Configure Stripe webhook delivery to `/api/stripe/webhook` for subscription created, updated, and deleted events.

PDF files are processed in the browser during MVP. The server stores account, subscription, export usage, and AI usage records only.

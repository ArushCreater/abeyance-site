# Abeyance site

The marketing site. Next.js, mostly static. One route handler sends partner form email; its key stays on the server.

```bash
npm install
cp .env.example .env.local   # then fill in the email settings
npm run dev        # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONSOLE_URL` | Where "Sign in" goes (the console's URL). Default `http://localhost:3001`. |
| `NEXT_PUBLIC_DOCS_URL` | The documentation site. Default `https://abeyance-docs.vercel.app`. |
| `RESEND_API_KEY` | Resend API key for partner form email. Server only. |
| `ABEYANCE_LEADS_TO` | Comma-separated team addresses that receive design partner requests. |
| `EMAIL_FROM` | Sender. Default `Abeyance <onboarding@resend.dev>`. |

Every number on the site is example data from a simulated deployment, and says so. Deploy: `vercel deploy --prod` from this folder, with the variables above set in the Vercel project.

## Partner form email

The form on `/partners` posts JSON to `app/api/partners/route.ts`. The route checks a honeypot field, validates with the same rules as the form (`lib/partners.ts`), and rate limits to 5 requests per IP every 10 minutes. The limit is best-effort and per serverless instance. It then sends through Resend (`lib/email.ts`):

- **A team notification** goes to `ABEYANCE_LEADS_TO`, with the subject `Design partner request: <company>`. Reply-to is the submitter. If the send fails, the route returns an error and logs the lead details, so check the logs.
- **A confirmation** goes to the submitter, but only when `EMAIL_FROM` is on your own verified domain. If that send fails, it is logged and the request still succeeds.

Without a verified domain, Resend only sends from `onboarding@resend.dev`, and only to the Resend account owner's address. Until then, set `ABEYANCE_LEADS_TO` to that address. With no `RESEND_API_KEY` or `ABEYANCE_LEADS_TO`, the route logs an error and returns 503, and the form asks people to try again.

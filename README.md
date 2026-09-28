# Abeyance site

The marketing site. Static Next.js, no server-side secrets.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONSOLE_URL` | Where "Sign in" goes (the console's URL). Default `http://localhost:3001`. |

Every number on the site is example data from a simulated deployment, and says so. Deploy: `vercel deploy --prod` from this folder, with `NEXT_PUBLIC_CONSOLE_URL` set in the Vercel project.

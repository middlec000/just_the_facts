This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Update Steps

1. Apply schema to the new Neon branch — Run the migration script locally, pointed at the new Neon branch connection string (found in the Neon console under your branch).
   1. Verify success by checking the Neon console's table browser, or running a quick query. If the new branch already has the schema applied, skip this step.
1. Update DATABASE_URL in Vercel — In the Vercel dashboard → Project Settings → Environment Variables, update DATABASE_URL (for the Production environment) to the new Neon branch's connection string. Do not redeploy yet — save it and wait.
1. Update the production branch in Vercel — This depends on your Git workflow:
   1. Option A (recommended — merge to main): Merge your new code branch into main. Vercel will auto-detect the push and trigger a production deploy using the updated env var.
   1. Option B (point Vercel at a different branch): In Vercel → Settings → Git → Production Branch, change it to your new branch name, then trigger a manual redeploy.
1. Monitor the deploy — Watch the Vercel deployment logs. The site will be briefly unavailable during the build/deploy window (~1-2 min). Once the new deploy goes live, both the new code and new DB branch are active simultaneously.
1. Smoke test — Visit the live site and verify key functionality: login, statement listing (app/statements/[id]/page.tsx), arguments (app/arguments/[id]/page.tsx), and any features that use the new schema columns.

## Deploy with Tunnel

```bash
# Start local server
npm run dev

# Deploy in a tunnel
cloudflared tunnel --url http://localhost:3000

# Share URL with friends
```

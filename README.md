# Just the Facts

A platform for exploring controversial topics by presenting both sides of an argument on equal footing — no algorithmic amplification, no hidden bias, just structured debate.

Visit the published website at https://just-the-facts.vercel.app/

## About

Just the Facts allows users to:
- **Create Statements** — objective, falsifiable claims about any topic
- **Add Arguments** — supporting or opposing the statement, displayed side by side
- **Attach Evidence** — sources and data to support arguments
- **Engage transparently** — all contributions are attributed and timestamped

Every topic presents arguments for and against a statement with equal visibility, fostering balanced discussion and informed decision-making.

## Tech Stack

This is a [Next.js](https://nextjs.org) project built with:
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon (PostgreSQL)
- **Testing**: Jest with Testing Library

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/middlec000/just_the_facts.git
   cd just_the_facts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create a .env.local file with your database connection
   DATABASE_URL=your_neon_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` — Start development server with Turbopack
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm test` — Run Jest tests
- `npm run test:watch` — Run tests in watch mode
- `npm run type-check` — Run TypeScript type checking

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

#### Update Steps

1. Apply schema to the new Neon branch — Run the migration script locally, pointed at the new Neon branch connection string (found in the Neon console under your branch).
   1. Verify success by checking the Neon console's table browser, or running a quick query. If the new branch already has the schema applied, skip this step.
1. Update DATABASE_URL in Vercel — In the Vercel dashboard → Project Settings → Environment Variables, update DATABASE_URL (for the Production environment) to the new Neon branch's connection string. Do not redeploy yet — save it and wait.
1. Update the production branch in Vercel — This depends on your Git workflow:
   1. Option A (recommended — merge to main): Merge your new code branch into main. Vercel will auto-detect the push and trigger a production deploy using the updated env var.
   1. Option B (point Vercel at a different branch): In Vercel → Settings → Git → Production Branch, change it to your new branch name, then trigger a manual redeploy.
1. Monitor the deploy — Watch the Vercel deployment logs. The site will be briefly unavailable during the build/deploy window (~1-2 min). Once the new deploy goes live, both the new code and new DB branch are active simultaneously.
1. Smoke test — Visit the live site and verify key functionality: login, statement listing (app/statements/[id]/page.tsx), arguments (app/arguments/[id]/page.tsx), and any features that use the new schema columns.

### Deploy with Tunnel

```bash
# Start local server
npm run dev

# Deploy in a tunnel
cloudflared tunnel --url http://localhost:3000

# Share URL with friends
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Neon Documentation](https://neon.tech/docs) - serverless PostgreSQL

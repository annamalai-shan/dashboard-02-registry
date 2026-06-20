# dashboard-02 — standalone shadcn registry

A SaaS dashboard starter (stat cards, revenue chart, activity feed, and a filterable
TanStack data table) distributed as a [shadcn](https://ui.shadcn.com) registry item.

Built to be installed into any shadcn/ui project with a single command — you own the
code once it lands in your repo.

## Install

```bash
npx shadcn@latest add https://<your-deployment-url>/r/dashboard-02.json
```

This pulls in the block and automatically installs its shadcn dependencies
(`sidebar`, `card`, `chart`, `table`, …) from the official shadcn registry, plus the
npm packages it needs (`@tabler/icons-react`, `@tanstack/react-table`, `recharts`,
`zod`).

Files land in your project as:

| File | Target |
| --- | --- |
| Page | `app/dashboard/page.tsx` |
| Sample data | `app/dashboard/data.json` |
| Components | `components/dashboard-02/*.tsx` |

## Develop this registry

```bash
npm install
npm run registry:build     # runs `shadcn build` -> writes public/r/dashboard-02.json
npm run preview            # build + serve public/ locally to test the install URL
```

Source lives under `registry/dashboard-02/`. The manifest is `registry.json`.

## Publish

`shadcn build` emits static JSON under `public/r/`. Host that directory anywhere that
serves static files (Vercel, Netlify, GitHub Pages, Cloudflare Pages). The install URL
is `<host>/r/dashboard-02.json`.

## License

MIT

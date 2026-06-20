# dashboard-02

A **SaaS dashboard starter** distributed as a [shadcn](https://ui.shadcn.com)
registry item — install it into any shadcn/ui project with one command, then own
and customize the code.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![shadcn registry](https://img.shields.io/badge/shadcn-registry-black)

## What's inside

- **Stat cards** — KPI summary row
- **Revenue chart** — area chart built on `recharts`
- **Recent activity** — feed panel
- **Data table** — sortable / filterable, powered by `@tanstack/react-table`
- **App sidebar + nav + site header** — full inset dashboard shell

## Install

Run this in any project that already has [shadcn initialized](https://ui.shadcn.com/docs/installation)
(`npx shadcn@latest init`):

```bash
# Works immediately — served straight from the repo
npx shadcn@latest add https://raw.githubusercontent.com/annamalai-shan/dashboard-02-registry/main/public/r/dashboard-02.json
```

Once GitHub Pages is enabled (see below), this cleaner URL also works:

```bash
npx shadcn@latest add https://annamalai-shan.github.io/dashboard-02-registry/r/dashboard-02.json
```

The CLI pulls in the block plus its shadcn dependencies (`sidebar`, `card`,
`chart`, `table`, …) from the official registry, and installs the npm packages it
needs (`@tabler/icons-react`, `@tanstack/react-table`, `recharts`, `zod`).

Files land in your project as:

| What | Where |
| --- | --- |
| Page | `app/dashboard/page.tsx` |
| Sample data | `app/dashboard/data.json` |
| Components | `components/dashboard-02/*.tsx` |

## Preview

> _Add a screenshot of the rendered dashboard here (e.g. `docs/preview.png`)._
> Run the block inside any shadcn app and capture `/dashboard`.

## Develop this registry

Source lives under `registry/dashboard-02/`; the manifest is `registry.json`.

```bash
npm install
npm run registry:build     # shadcn build -> writes public/r/dashboard-02.json
npm run preview            # build + serve public/ locally to test the install URL
```

After editing the block, **re-run the build and commit `public/r/`** — installs
serve that generated JSON, so stale output ships stale code.

## Publish

`public/r/` is static JSON, hostable anywhere. This repo ships a GitHub Actions
workflow (`.github/workflows/deploy.yml`) that rebuilds and deploys to **GitHub
Pages** on every push to `main`.

To turn it on (one time): **Repo → Settings → Pages → Build and deployment →
Source: GitHub Actions**. The next push publishes to
`https://annamalai-shan.github.io/dashboard-02-registry/`.

## License

[MIT](./LICENSE) © Annamalai Shanmugam

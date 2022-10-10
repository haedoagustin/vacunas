# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```
## Supabase local development

Documentation

https://supabase.com/docs/guides/cli/local-development

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

Apply unapplied migrations to local database

```bash
supabase db diff -f <nombre>
```

Make migrations from local database

```bash
supabase db diff -f <nombre>
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

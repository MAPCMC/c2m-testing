# C2M Testing

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

## Development

### DB updates

Add local migration files by running `npx drizzle-kit generate`.
Apply migrations to connected db with `npx drizzle-kit migrate`.

## Production

### Prerequisites

- Add a google auth client to allow sign in [console](https://console.cloud.google.com). Follow instructions from [next-auth](https://next-auth.js.org/providers/google).

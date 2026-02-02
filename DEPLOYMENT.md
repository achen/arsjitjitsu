# Deployment Guide

## Setup Vercel Postgres

1. Copy the environment variables from your Vercel Postgres database:
   ```bash
   cp .env.example .env
   ```

2. Fill in the `.env` file with your Vercel Postgres connection strings from:
   Vercel Dashboard > Your Project > Storage > Your Database > .env.local tab

3. Push the database schema to Postgres:
   ```bash
   npx prisma db push
   ```

4. Seed the database with BJJ techniques:
   ```bash
   npm run seed
   ```

5. Generate Prisma Client (if not already done):
   ```bash
   npx prisma generate
   ```

## Deploy to Vercel

1. Push your code to GitHub (already done)

2. In Vercel Dashboard:
   - Connect your GitHub repository
   - Add environment variables from your .env file to Vercel project settings
   - Deploy

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up `.env` file with Vercel Postgres credentials

3. Push schema and seed database (see above)

4. Run development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:
- `POSTGRES_PRISMA_URL` - Prisma connection string (from Vercel)
- `JWT_SECRET` - Secret key for JWT authentication

See `.env.example` for the complete list.

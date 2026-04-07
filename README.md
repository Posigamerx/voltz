# VOLTZ

An electronics storefront portfolio project.

**Stack:** React 18, TypeScript, Tailwind CSS, Zustand, TanStack Query, Supabase, Stripe, React Router v6, Vite, React Hook Form, Zod, Sonner

## Features

- **Product Listing:** Filter by category, price, and stock
- **Checkout:** Stripe Payments via Supabase Edge Functions
- **Cart:** Persistent cart using Zustand and localStorage
- **Authentication:** Sign up, sign in, and protected routes via Supabase Auth
- **Product Details:** Image galleries and technical specifications
- **Performance:** Skeleton loading states and TanStack Query caching
- **Notifications:** Toast alerts using Sonner
- **Responsive Design:** Tailwind CSS implementation

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo>
cd voltz
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run `supabase/schema.sql`
3. Run `supabase/seed.sql` to populate sample products
4. Copy your Project URL and anon key from Settings → API

### 3. Set up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Enable "Test Mode" to get test keys
3. Copy your Publishable key
4. Deploy the Supabase Edge Function for payment intents

### 4. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and configure variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_APP_NAME=VOLTZ
```

### 5. Run Development Server

```bash
npm run dev
```

## Deployment (Vercel)

1. **Deploy via GitHub:**
   - Push repository to GitHub.
   - Import repository in Vercel.
   - Configure Environment Variables based on `.env`.
   - Vercel automatically detects the Vite framework.
   - Deploy.

2. **Deploy via CLI:**
   - Run `npx vercel` in the project directory.
   - Configure Environment Variables in the Vercel dashboard.
   - Run `npx vercel --prod` to deploy.

*(Note: Update the Site URL in Supabase Auth settings to the Vercel domain after deployment)*

## Project Structure

```
src/
├── assets/            # Static assets
├── components/
│   ├── ui/            # Reusable UI elements
│   ├── layout/        # Navbar, Footer, Page Layouts
│   ├── product/       # Product grids and details
│   ├── cart/          # Cart components
│   ├── auth/          # Authentication forms
│   └── checkout/      # Stripe payment form
├── pages/             # Route components
├── store/             # Zustand stores
├── hooks/             # Custom React hooks
├── lib/               # Utility functions, clients
├── types/             # TypeScript interfaces
└── styles/            # Global CSS styles
supabase/
├── schema.sql         # Database tables and RLS policies
├── seed.sql           # Test data
└── functions/         # Edge functions
```

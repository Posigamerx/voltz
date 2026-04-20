# VOLTZ

A premium electronics storefront portfolio project built with a modern React stack.

**Stack:** React 18 · TypeScript · Tailwind CSS · Zustand · TanStack Query · Supabase · Stripe · React Router v6 · Vite · React Hook Form · Zod · Sonner

---

## Features

- **Product Listing** — Filter by category, price range, and stock availability
- **Product Details** — Image galleries and full technical specifications
- **Wishlist** — Persist saved items across sessions via Zustand + localStorage
- **Cart** — Persistent cart with quantity management (Zustand + localStorage)
- **Authentication** — Sign up, sign in, sign out, and protected routes via Supabase Auth
- **Checkout** — Multi-step checkout: Shipping form → Stripe Payment via Supabase Edge Functions
- **Order Tracking** — Full order status pipeline: `pending → confirmed → processing → shipped → delivered`
- **Account Page** — Order history, wishlist summary, and session-aware sign-out
- **Admin Panel** — Product management and order status updates (`/admin`, `/admin/orders`)
- **Performance** — Skeleton loading states and TanStack Query caching
- **Notifications** — Toast alerts using Sonner

---

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
4. Copy your Project URL and anon key from **Settings → API**

### 3. Set up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Enable **Test Mode** to get test keys
3. Copy your Publishable key
4. Deploy the Supabase Edge Functions for payment processing

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

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

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home / landing page |
| `/products` | Public | Product listing with filters |
| `/products/:slug` | Public | Product detail page |
| `/wishlist` | Public | Saved / wishlist items |
| `/checkout` | Protected | Multi-step checkout |
| `/account` | Protected | Account overview & order history |
| `/orders` | Protected | Full order list |
| `/admin` | Admin | Product management |
| `/admin/orders` | Admin | Order status management |

---

## Order Status Pipeline

Orders move through the following statuses (in sequence):

```
pending → confirmed → processing → shipped → delivered
```

Cancellation (`cancelled`) can be applied at any stage. Each status has a distinct colour indicator in the UI:

| Status | Colour |
|--------|--------|
| Pending | Amber |
| Confirmed | Blue |
| Processing | Indigo |
| Shipped | Purple |
| Delivered | Emerald |
| Cancelled | Red |

---

## Project Structure

```
src/
├── assets/            # Static assets
├── components/
│   ├── ui/            # Reusable UI elements (Button, Badge, Skeleton, …)
│   ├── layout/        # Navbar, Footer, page layout wrapper
│   ├── product/       # Product grids, cards, and detail views
│   ├── cart/          # Cart drawer and cart items
│   ├── auth/          # Auth forms and ProtectedRoute guard
│   ├── checkout/      # ShippingForm, PaymentForm (Stripe Elements)
│   ├── user/          # OrderCard and user-facing components
│   └── admin/         # OrdersTable, ProductFormModal, RevenueStats
├── pages/
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CheckoutPage.tsx
│   ├── AccountPage.tsx
│   ├── NotFoundPage.tsx
│   ├── admin/         # AdminPage, AdminOrdersPage
│   └── user/          # OrdersPage, WishlistPage
├── store/             # Zustand stores (cart, auth, ui, admin, wishlist)
├── hooks/             # Custom React hooks (useAuth, useOrders, useProducts, …)
├── lib/               # Clients and utilities (supabase, stripe, utils, queryClient)
├── types/             # TypeScript interfaces (Product, Order, User, Cart)
└── styles/            # Global CSS styles
supabase/
├── schema.sql         # Database tables and RLS policies
├── seed.sql           # Sample product data
└── functions/         # Edge Functions (create-payment-intent, confirm-order)
```

---

## Utility Functions (`src/lib/utils.ts`)

| Export | Description |
|--------|-------------|
| `cn(...inputs)` | Merges Tailwind class names safely via `clsx` + `tailwind-merge` |
| `formatPrice(amount, currency?)` | Formats a number as a currency string (default USD) |
| `formatDollars` | Alias for `formatPrice` |
| `formatDiscount(original, sale)` | Returns integer discount percentage |
| `discountPercent` | Alias for `formatDiscount` |
| `slugify(text)` | Converts a string to a URL-safe slug |
| `truncate(text, length)` | Truncates text with an ellipsis |
| `formatDate(dateStr)` | Formats a date string as `Apr 20, 2026` |
| `formatDateTime(dateStr)` | Formats a date string with time |
| `ORDER_STATUS_LABELS` | Human-readable label per `OrderStatus` |
| `ORDER_STATUS_COLORS` | Tailwind class string per `OrderStatus` |
| `ORDER_STATUS_STEPS` | Ordered array of statuses for progress indicators |

---

## Deployment (Vercel)

**Via GitHub:**
1. Push the repository to GitHub
2. Import it in [vercel.com](https://vercel.com)
3. Add the environment variables from `.env`
4. Vercel auto-detects Vite — click **Deploy**

**Via CLI:**
```bash
npx vercel          # preview deploy
npx vercel --prod   # production deploy
```

> After deploying, update the **Site URL** in Supabase → Authentication → URL Configuration to your Vercel domain.

---

## Test Cards (Stripe Test Mode)

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 9995` | Card declined |
| `4000 0025 0000 3155` | 3D Secure authentication |

Use any future expiry date and any 3-digit CVC.

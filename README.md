# Plus500 Futures — Trading Platform

A full-featured web-based futures trading platform built with React, TypeScript, and Lovable Cloud.

---

## 🚀 Features

### Landing Page
- Responsive marketing page with hero section, benefits, market overview, platform showcase, and security highlights
- All CTAs route to the authentication page
- Mobile-friendly navigation with hamburger menu

### Authentication
- Email/password signup and login
- Email verification required before sign-in
- Session-based auth with automatic redirect for unauthenticated users

### User Dashboard

| Feature | Description |
|---|---|
| **Dashboard Home** | Portfolio summary, market overview with category filters (Crypto, Metals, Energy, Agriculture), and quick trade panel |
| **Markets** | Browse all available trading instruments with live prices, spreads, and categories |
| **Watchlist** | Save/favorite instruments for quick access and monitoring |
| **Trade** | Place buy/sell orders with configurable leverage, stop-loss, and take-profit |
| **Charts** | Live price charts for watchlisted instruments with trend visualization |
| **Open Positions** | View active trades with real-time P/L calculations |
| **Orders** | Manage pending/limit orders |
| **Portfolio History** | Historical record of all closed trades |
| **Deposit / Withdraw** | Fund your account via crypto or request withdrawals |
| **Alerts** | Set price alerts on any instrument (e.g., "BTC hits $100k") |
| **Settings** | Profile management, display name, and two-factor authentication (phone-based) |
| **Support** | Submit support tickets |

### Account Metrics

- **Balance** — Cash on hand. Updated on deposits, withdrawals, and closed positions.
- **Equity** — Real-time net worth: `Balance + Open P/L`.
- **Margin Used** — Total capital tied up in open positions.
- **Free Margin** — Available capital for new trades: `Equity - Margin Used`.
- **Open P/L** — Unrealized profit/loss across all open positions, calculated live using entry prices, leverage, and trade direction.
- **Portfolio Value** — Sum of cash balance, held asset value, and open position market value. Includes interactive breakdown on click.

### Admin Panel

- User management (view profiles, balances, KYC status, 2FA status)
- Order and transaction review/approval
- Market instrument management
- KYC document review
- Site settings (enable/disable site)
- Email and support ticket management

### Two-Factor Authentication (2FA)

- Users select country code and enter mobile number
- 3-second verification loading state
- Phone number and 2FA status saved to profile and visible to admins

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Routing | React Router v6 |
| Backend | Lovable Cloud |
| Auth | Email/password with session management |
| Database | PostgreSQL |
| Edge Functions | Deno-based serverless functions |
| Icons | Lucide React |
| Notifications | Sonner toast library |

---

## 📁 Project Structure

```
src/
├── assets/              # Images and static assets
├── components/
│   ├── dashboard/       # Dashboard UI components (sidebar, header, charts, trade panel)
│   ├── landing/         # Landing page sections (hero, navbar, footer, benefits)
│   ├── admin/           # Admin layout and guards
│   └── ui/              # shadcn/ui component library
├── contexts/            # React contexts (PriceContext, WatchlistContext)
├── hooks/               # Custom hooks (useOrders, useHeldAssets, useAdminAuth, etc.)
├── integrations/        # Backend client and types
├── pages/
│   ├── dashboard/       # Dashboard sub-pages
│   └── admin/           # Admin sub-pages
└── lib/                 # Utility functions
```

---

## 🗄 Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profiles with balance, KYC status, 2FA, phone number |
| `orders` | Trade orders with entry price, leverage, stop-loss, take-profit |
| `held_assets` | User's held crypto/asset positions |
| `transactions` | Deposit/withdrawal records with admin review |
| `watchlist` | User's saved instruments |
| `price_alerts` | User-configured price alert rules |
| `notifications` | In-app notification messages |
| `support_tickets` | User support requests |
| `market_instruments` | Available trading instruments |
| `wallet_addresses` | Crypto wallet addresses for deposits |
| `site_settings` | Global site configuration |
| `user_roles` | Role-based access control (admin, moderator, user) |

---

## 🔐 Security

- Row-Level Security (RLS) on all database tables
- Role-based access via `user_roles` table with `has_role()` security definer function
- Admin actions validated server-side
- Session-based authentication with automatic redirect for unauthenticated users

---

## 🏃 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

---

## 📝 License

Private — All rights reserved.

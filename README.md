# TableFlow

A restaurant ordering system built with Turborepo, Next.js, and Express.

## Monorepo Structure

```
tableflow/
├── apps/
│   ├── web/              # Next.js 14 frontend (App Router, TypeScript, Tailwind)
│   └── api/              # Express REST API (TypeScript)
├── packages/
│   ├── types/            # Shared TypeScript interfaces (MenuItem, Order, OrderItem)
│   └── utils/            # Shared utility functions (formatPrice, calculateOrderTotal)
├── turbo.json            # Turborepo pipeline configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package with dev/build/lint scripts
```

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8

Install pnpm if you haven't:
```bash
npm install -g pnpm
```

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables (optional):**
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.local.example apps/web/.env.local
   ```

3. **Start development servers:**
   ```bash
   pnpm dev
   ```

## App URLs

- **Web (Frontend)**: http://localhost:3000
- **API (Backend)**: http://localhost:3001

## Pages

### Menu Page (`/`)
- View all menu items grouped by category (Mains, Drinks)
- Toggle item availability (Available/Unavailable)
- Each item displays name, description, price, and availability status
- Navigate to Orders page

### Orders Page (`/orders`)
- View all orders sorted by creation time (newest first)
- Each order shows: Order ID, table number, items, total, and status
- Advance order status through workflow: Pending → Preparing → Ready → Delivered
- Navigate back to Menu

## Development

### Run all apps in parallel:
```bash
pnpm dev
```

This starts:
- Next.js web app on http://localhost:3000
- Express API on http://localhost:3001

### Build all apps:
```bash
pnpm build
```

### Lint all packages:
```bash
pnpm lint
```

## Packages

### `@repo/types`
Shared TypeScript interfaces:
- `MenuItem` - Restaurant menu item with id, name, description, price, category, available
- `Order` - Customer order with id, tableNumber, items, status, createdAt
- `OrderItem` - Order line item with menuItemId, name, quantity, unitPrice

### `@repo/utils`
Shared utility functions:
- `formatPrice(price: number)` - Format price as currency string ($X.XX)
- `calculateOrderTotal(items)` - Calculate total from order items

## Technology Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Express, TypeScript, ts-node-dev
- **Data**: In-memory storage (no database)

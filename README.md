# Turborepo Monorepo

A monorepo setup using Turborepo and pnpm workspaces.

## Structure

```
├── apps/
│   ├── web/          # Next.js 14 (App Router, TypeScript)
│   └── api/          # Express + TypeScript API
├── packages/
│   ├── types/        # Shared TypeScript interfaces
│   └── utils/        # Shared helper functions
├── turbo.json        # Turborepo pipeline configuration
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

Install pnpm if you haven't:
```bash
npm install -g pnpm
```

### Installation

```bash
pnpm install
```

### Development

Run all apps in parallel:
```bash
pnpm dev
```

This will start:
- Next.js web app on http://localhost:3000
- Express API on http://localhost:3001

### Build

Build all apps:
```bash
pnpm build
```

### Lint

Run linting across all packages:
```bash
pnpm lint
```

## Packages

### @repo/types
Shared TypeScript interfaces:
- `MenuItem` - Restaurant menu item
- `Order` - Customer order
- `OrderItem` - Individual order line item

### @repo/utils
Shared utility functions:
- `formatPrice()` - Format price as currency
- `calculateOrderTotal()` - Calculate order total

## Apps

### web
Next.js 14 application with App Router and TypeScript.

### api
Express API server with TypeScript support and hot reload via ts-node-dev.

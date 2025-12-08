# Warehouse Inventory Client

## Description

This is the frontend application for the **Warehouse Inventory System**. It is a modern web application built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, designed to provide an intuitive interface for managing warehouse operations.

The application connects to the [Warehouse Inventory Server](https://github.com/fathirachmann/warehouse-inventory-server) to perform inventory management tasks.

## Features

- **Dashboard**: Overview of recent activities, transaction summaries, and key metrics.
- **Barang (Items)**: Manage product master data.
- **Stok (Stock)**: Monitor real-time stock levels and view stock history.
- **Pembelian (Purchases)**: Record and manage incoming stock transactions.
- **Penjualan (Sales)**: Record and manage outgoing stock transactions.
- **User Management**: Manage system users (Admin/Staff).
- **Authentication**: Secure login with JWT-based authentication.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI + Tailwind)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**, **yarn**, **pnpm**, or **bun**.

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd warehouse-inventory-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory and configure the API endpoint:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
warehouse-inventory-client/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication components
│   │   ├── barang/     # Barang feature components
│   │   ├── dashboard/  # Dashboard widgets
│   │   ├── layout/     # Sidebar, Header, etc.
│   │   ├── pembelian/  # Pembelian feature components
│   │   ├── penjualan/  # Penjualan feature components
│   │   └── ui/         # Shadcn UI base components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities (Axios, formatting, etc.)
│   ├── services/       # API service functions
│   └── types/          # TypeScript type definitions
├── .env.local          # Environment variables
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies and scripts
└── tailwind.config.ts  # Tailwind CSS configuration
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/docs)

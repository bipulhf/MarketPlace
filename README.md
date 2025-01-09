# Marketplace

A modern e-commerce platform built specifically for the SUST community. Live at [sust-marketplace.vercel.app](https://sust-marketplace.vercel.app)

## Features

- **Multi-User Roles**
  - Buyers can browse and purchase products
  - Sellers can manage their product listings
  - Delivery personnel can manage orders and deliveries

- **Product Management**
  - Add products with automatic image generation using Unsplash API
  - Edit product details including name, price, and description
  - Delete products with confirmation
  - Real-time product image updates based on product names

- **Shopping Experience**
  - Intuitive product browsing
  - Shopping cart functionality
  - Secure checkout process
  - Order tracking

- **Dashboard**
  - Seller dashboard for product management
  - Buyer dashboard for order history
  - Delivery dashboard for managing deliveries

## Tech Stack

- **Frontend**
  - Next.js 13+ with App Router
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Zustand for state management

- **APIs**
  - Unsplash API for product images

- **Deployment**
  - Vercel

## Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd MarketPlace
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Unsplash API key:
```
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Accounts

For testing purposes, you can use these demo accounts:

- **Buyer Account**
  - Email: bipulhf@gmail.com
  - Password: 1234

- **Seller Account**
  - Email: shifat@gmail.com
  - Password: 1234

- **Delivery Account**
  - Email: delivery@gmail.com
  - Password: 1234

## Live Demo

Visit [sust-marketplace.vercel.app](https://sust-marketplace.vercel.app) to see the live application.


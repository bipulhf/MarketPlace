# Marketplace

A modern e-commerce platform built specifically for the SUST community. Live at [sust-marketplace.vercel.app](https://sust-marketplace.vercel.app)

## Features

- **Multi-User Roles**
  - Buyers can browse and purchase products
  - Sellers can manage their product listings and inventory
  - Delivery personnel can manage orders and deliveries

- **Product Management**
  - Add products with automatic image generation using Unsplash API
  - Edit product details including name, price, description, and stock amount
  - Delete products with confirmation
  - Real-time product image updates based on product names
  - Inventory management with stock tracking
  - Low stock alerts and out-of-stock indicators

- **Shopping Experience**
  - Intuitive product browsing
  - Real-time stock availability check
  - Shopping cart with stock validation
  - Secure checkout process
  - Order tracking
  - Out-of-stock notifications
  - Low stock warnings

- **Dashboard**
  - Seller dashboard for product and inventory management
  - Responsive design for all screen sizes
  - Real-time analytics and sales tracking
  - Order management system
  - Stock level monitoring
  - Buyer dashboard for order history
  - Delivery dashboard for managing deliveries

## Tech Stack

- **Frontend**
  - Next.js 13+ with App Router
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Zustand for state management
  - Responsive design principles

- **Backend**
  - Prisma ORM
  - PostgreSQL database
  - RESTful APIs
  - Transaction support for order processing

- **APIs**
  - Unsplash API for product images
  - Custom API endpoints for inventory management

- **Deployment**
  - Vercel for frontend
  - Supabase for database

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

3. Create a `.env` file in the root directory with the following:
```env
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_database_url"
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features in Detail

### Inventory Management
- Real-time stock tracking
- Automatic stock updates on order placement
- Stock validation during checkout
- Low stock alerts (5 or fewer items)
- Out-of-stock indicators
- Separate stock update interface

### Order Processing
- Stock validation before order placement
- Transaction-based order processing
- Automatic stock deduction
- Order status tracking
- Multiple order statuses (pending, accepted, shipping, delivered)

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interfaces
- Responsive images and cards
- Optimized navigation for mobile devices

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

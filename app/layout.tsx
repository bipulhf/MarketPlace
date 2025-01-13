'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/navbar';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Toaster position="top-center" richColors />
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
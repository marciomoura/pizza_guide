import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] }); // Configure Inter font

export const metadata: Metadata = {
  title: 'Pizza Dough Pal - AI Dough Calculator',
  description: 'Generate custom pizza dough recipes with precise ingredients and steps.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <main className="flex-grow">{children}</main>
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}

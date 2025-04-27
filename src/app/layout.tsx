
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] }); // Configure Inter font

export const metadata: Metadata = {
  title: 'Dough Guide do Marshut - Pizza & Focaccia Recipes', // Updated Title
  description: 'Calculate precise pizza and focaccia dough recipes with ingredients and steps, inspired by Brazilian and Italian traditions.', // Updated Description
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

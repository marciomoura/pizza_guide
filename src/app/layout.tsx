
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] }); // Configure Inter font

export const metadata: Metadata = {
  title: 'Pizza Guide', // Updated Title
  description: 'Calculate precise pizza and focaccia dough recipes with ingredients and steps, inspired by Brazilian and Italian traditions.', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Body already has background image styles from globals.css */}
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        {/* Wrap main content in a div to apply background and centered layout */}
        <main className="flex-grow">
           {/* This div will have the white background and be centered */}
           <div className="main-content-area">
              {children}
           </div>
        </main>
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}

import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] }); // Configure Inter font

export const metadata: Metadata = {
  title: 'Pizza Pal - Delicious Pizza Recipes',
  description: 'Find the best homemade pizza recipes on Pizza Pal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <main>{children}</main>
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Vyoma Intelligence | AI Newsroom Operating System',
  description: 'Premium Enterprise-Grade Agentic AI Content Sourcing Platform for Media & Newsrooms',
  keywords: ['AI', 'Newsroom', 'Content', 'Media', 'Intelligence', 'Automation'],
  authors: [{ name: 'Vyoma Intelligence' }],
  openGraph: {
    title: 'Vyoma Intelligence',
    description: 'AI-Powered Content Intelligence Operating System',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Devotel Smart Insurance Portal',
  description: 'An evaluation project for Devotel by Abolfazl Chaman @ abolfazlchaman.com',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

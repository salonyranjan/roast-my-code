import type { Metadata } from 'next';
import { Anton, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Roast My Code — Gordon Ramsay reviews your repo',
  description:
    "Paste a GitHub repo. Get inspected, insulted, and (rarely) complimented by an AI chef with zero patience for spaghetti code.",
  openGraph: {
    title: 'Roast My Code',
    description: "It's RAW. An AI kitchen inspection for your GitHub repo.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roast My Code',
    description: "It's RAW. An AI kitchen inspection for your GitHub repo.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${plexMono.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

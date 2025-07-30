import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { AppearanceProvider } from '@/context/appearance-context';
import { ThemeProvider } from '@/context/theme-context';

export const metadata: Metadata = {
  title: 'NQSalam',
  description: 'A secure messaging app for the Muslim community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppearanceProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </AppearanceProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

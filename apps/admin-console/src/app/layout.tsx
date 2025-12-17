import { AuthProvider } from '@assetforce/auth/react';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { CssBaseline, ThemeProvider } from '@assetforce/material';
import { AppRouterCacheProvider } from '@assetforce/material/nextjs';
import { theme } from '@assetforce/material/theme';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AssetForce Admin Console',
  description: 'Admin Console for AssetForce Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AuthProvider>
            <ApolloClientProvider endpoint="/api/graphql/imc">
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
              </ThemeProvider>
            </ApolloClientProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

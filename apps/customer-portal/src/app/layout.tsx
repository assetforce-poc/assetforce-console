import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@assetforce/material/nextjs';
import { ThemeProvider, CssBaseline } from '@assetforce/material';
import { theme } from '@assetforce/material/theme';
import { ApolloClientProvider } from '@assetforce/graphql/provider';

export const metadata: Metadata = {
  title: 'AssetForce Customer Portal',
  description: 'Customer Portal for AssetForce Platform',
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
          <ApolloClientProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ApolloClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

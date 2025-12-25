import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import Link from 'next/link';

import { DeprecationNotificationsPageWrapper } from './DeprecationNotificationsPageWrapper';

type DeprecationNotificationsPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Service Deprecation Notifications Page Route - Admin Console
 *
 * Displays contract deprecation notifications for a service.
 */
export default async function Page({ params }: DeprecationNotificationsPageProps) {
  const { slug } = await params;

  return (
    <ApolloClientProvider endpoint="/api/graphql/sgc">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/services">Services</Link>
            <Link href={`/services/${slug}`}>{slug}</Link>
            <Typography component="span" color="text.primary">
              Deprecations
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Contract Deprecation Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View and acknowledge deprecation notifications for contracts used by this service
          </Typography>

          {/* Deprecation Notifications Content */}
          <DeprecationNotificationsPageWrapper slug={slug} />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}

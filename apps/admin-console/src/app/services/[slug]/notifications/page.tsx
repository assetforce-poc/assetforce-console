import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import Link from 'next/link';

import { NotificationsPageWrapper } from './NotificationsPageWrapper';

type NotificationsPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Service Notifications Page Route - Admin Console
 *
 * Displays schema change notifications for a service.
 */
export default async function Page({ params }: NotificationsPageProps) {
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
              Notifications
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Schema Change Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View and acknowledge schema changes that may affect this service
          </Typography>

          {/* Notifications Content */}
          <NotificationsPageWrapper slug={slug} />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}

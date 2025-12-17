import { ServiceDetailPage } from '@assetforce/service/detail';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import Link from 'next/link';

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Service Detail Page Route - Admin Console
 *
 * This is the page router entry point for service details.
 * All actual content is in @assetforce/service/detail/components
 */
export default async function Page({ params }: ServiceDetailPageProps) {
  const { slug } = await params;

  return (
    <ApolloClientProvider endpoint="/api/graphql/sgc">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/services">Services</Link>
            <Typography component="span" color="text.primary">
              {slug}
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Service Detail
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View service information, health status, and instances
          </Typography>

          {/* Service Detail Content from Feature Package */}
          <ServiceDetailPage slug={slug} />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}

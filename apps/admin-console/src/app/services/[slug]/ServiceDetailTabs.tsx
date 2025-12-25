'use client';

import { Box, Tab, Tabs } from '@assetforce/material';
import { usePathname, useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

interface ServiceDetailTabsProps {
  slug: string;
}

interface TabConfig {
  label: string;
  path: string;
}

/**
 * Tabs navigation for service detail pages
 */
export const ServiceDetailTabs: FC<ServiceDetailTabsProps> = ({ slug }) => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabConfig[] = useMemo(
    () => [
      { label: 'Overview', path: `/services/${slug}` },
      { label: 'Contracts', path: `/services/${slug}/contracts` },
      { label: 'Dependencies', path: `/services/${slug}/dependencies` },
      { label: 'Notifications', path: `/services/${slug}/notifications` },
    ],
    [slug]
  );

  // Determine current tab index based on pathname
  const currentTabIndex = useMemo(() => {
    // Check for exact match first, then partial match
    const exactIndex = tabs.findIndex((tab) => tab.path === pathname);
    if (exactIndex !== -1) return exactIndex;

    // For subpaths, find the matching parent
    const partialIndex = tabs.findIndex((tab, idx) => idx > 0 && pathname.startsWith(tab.path));
    return partialIndex !== -1 ? partialIndex : 0;
  }, [tabs, pathname]);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      router.push(tabs[newValue].path);
    },
    [router, tabs]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={currentTabIndex} onChange={handleTabChange}>
        {tabs.map((tab) => (
          <Tab key={tab.path} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  );
};

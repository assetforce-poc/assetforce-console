'use client';

import { Box, Tab, Tabs } from '@assetforce/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface AuthTab {
  /** Tab label */
  label: string;
  /** Tab href */
  href: string;
}

export interface AuthTabBarProps {
  /** Array of tabs */
  tabs: AuthTab[];
  /** Active tab identifier (optional, auto-detected from pathname) */
  activeTab?: string;
}

/**
 * AuthTabBar - Tab navigation for authentication pages (Login ↔ Register)
 *
 * @example
 * <AuthTabBar
 *   tabs={[
 *     { label: 'Sign In', href: '/auth/login' },
 *     { label: 'Sign Up', href: '/auth/register' }
 *   ]}
 *   activeTab="login"
 * />
 */
export function AuthTabBar({ tabs, activeTab }: AuthTabBarProps) {
  const pathname = usePathname();

  // Determine active tab index
  let currentTabIndex = 0;

  if (activeTab) {
    // Find by activeTab string match (e.g., "login" matches href ending with "/login")
    currentTabIndex = tabs.findIndex((tab) => tab.href.endsWith(`/${activeTab}`) || tab.href === `/${activeTab}`);
  } else {
    // Auto-detect from pathname
    currentTabIndex = tabs.findIndex((tab) => pathname === tab.href);
  }

  // Default to first tab if no match
  if (currentTabIndex === -1) {
    currentTabIndex = 0;
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={currentTabIndex} centered>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.href}
            label={tab.label}
            component={Link}
            href={tab.href}
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

/**
 * Brand configuration types
 */

export interface BrandConfig {
  /** Brand name (default: "AssetForce") */
  name?: string;

  /** Logo image URL or React element */
  logo?: string | React.ReactNode;

  /** Logo size */
  logoSize?: 'sm' | 'md' | 'lg';

  /** Show "Powered by {name}" footer */
  showPoweredBy?: boolean;

  /** Custom powered by text */
  poweredByText?: string;

  /** Custom link for powered by text */
  poweredByLink?: string;
}

/**
 * Default brand configuration
 */
export const defaultBrandConfig: Required<BrandConfig> = {
  name: 'AssetForce',
  logo: '🔐',
  logoSize: 'md',
  showPoweredBy: true,
  poweredByText: 'Powered by AssetForce',
  poweredByLink: 'https://assetforce.io',
};

/**
 * Site configuration — this file is yours. Velocity upgrades never overwrite it.
 *
 * Built with Velocity by Southwell Media: https://github.com/southwellmedia/velocity
 */
import { SITE_URL, GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION } from 'astro:env/server';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  defaultTheme?: 'system' | 'light' | 'dark';
  speculation?: 'off' | 'prerender';
  branding: {
    logo: {
      alt: string;
    };
    favicon: {
      svg: string;
    };
    colors: {
      themeColor: string;
      backgroundColor: string;
    };
  };
}

const siteConfig: SiteConfig = {
  name: 'NegoNEX AI',
  description:
    'Agente conversacional multilingüe con inteligencia artificial y etiqueta intercultural para negociaciones B2B internacionales.',
  url: SITE_URL || 'https://example.com',
  author: 'Intercultural Intelligence Technologies S.A.S. (IIT S.A.S.)',
  email: 'info@negonex.ia',
  defaultTheme: 'light',
  socialLinks: [],
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  branding: {
    logo: {
      alt: 'NegoNEX AI',
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      themeColor: '#0F2A44',
      backgroundColor: '#f8fafc',
    },
  },
};

export default siteConfig;

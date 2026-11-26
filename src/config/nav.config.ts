/**
 * Navigation & route configuration — NegoNEX AI (IIT S.A.S.)
 */

export interface RouteDefinition {
  /** URL path for the default locale (es), without slashes ('' = home). */
  path: string;
  /** Translated slugs for non-default locales (en). */
  slugs?: Partial<Record<string, string>>;
  /** Set false for pages that only exist in the default locale. */
  localized?: boolean;
}

export const routes = {
  home: { path: '' },
  platform: { path: 'plataforma', slugs: { en: 'platform' } },
  pricing: { path: 'precios', slugs: { en: 'pricing' } },
  about: { path: 'nosotros', slugs: { en: 'about' } },
  blog: { path: 'blog' },
  contact: { path: 'contacto', slugs: { en: 'contact' } },
  search: { path: 'search' },
} satisfies Record<string, RouteDefinition>;

export type RouteId = keyof typeof routes;

export interface NavItem {
  /** Translation key or plain text */
  label: string;
  order: number;
  /** Internal route (localized automatically) */
  route?: RouteId;
  /** Any other link: an absolute path, a #hash or an external URL */
  href?: string;
  external?: boolean;
}

export const navItems: NavItem[] = [
  { label: 'nav.platform', route: 'platform', order: 1 },
  { label: 'nav.pricing', route: 'pricing', order: 2 },
  { label: 'nav.about', route: 'about', order: 3 },
  { label: 'nav.guides', route: 'blog', order: 4 },
  { label: 'nav.contact', route: 'contact', order: 5 },
];

export interface HeaderAction {
  icon: string;
  href: string;
  label: string;
  iconOnly?: boolean;
  target?: string;
}

/** Defaults for <Header />. Props passed to Header still win. */
export const headerConfig: {
  cta?: { label: string; href: string };
  actions: HeaderAction[];
  extraNav: NavItem[];
  breakpoint?: 'md' | 'lg' | 'xl';
} = {
  cta: { label: 'nav.demoCta', href: '/contacto' },
  actions: [],
  extraNav: [],
  breakpoint: 'lg',
};

/** Defaults for <Footer />. */
export const footerConfig: { extraLinks: NavItem[] } = {
  extraLinks: [],
};

/** Navigation items sorted by order. */
export function getNavItems(): NavItem[] {
  return [...navItems].sort((a, b) => a.order - b.order);
}

import { prisma } from '@/lib/db/client';

export const HERO_TILE_COUNT = 3;

export interface HeroTile {
  imageKey: string | null;
  hue: number;
}

export interface HomepageContentData {
  badgeText: string;
  heading: string;
  subheading: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  heroTiles: HeroTile[];
}

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContentData = {
  badgeText: 'Modern Art & Creative Assets',
  heading: 'Original art, ready-to-use assets, one gallery.',
  subheading:
    'Digital paintings, stock imagery, and templates for decor, branding, and content — curated like a gallery, delivered like a library.',
  primaryButtonText: 'Explore the Shop',
  primaryButtonHref: '/shop/all',
  secondaryButtonText: 'My Veedibox',
  secondaryButtonHref: '/dashboard',
  heroTiles: [
    { imageKey: null, hue: 32 },
    { imageKey: null, hue: 212 },
    { imageKey: null, hue: 142 }
  ]
};

export async function getHomepageContent(): Promise<HomepageContentData> {
  const row = await prisma.homepageContent.findUnique({ where: { id: 'homepage' } });
  if (!row) return DEFAULT_HOMEPAGE_CONTENT;
  return {
    badgeText: row.badgeText,
    heading: row.heading,
    subheading: row.subheading,
    primaryButtonText: row.primaryButtonText,
    primaryButtonHref: row.primaryButtonHref,
    secondaryButtonText: row.secondaryButtonText,
    secondaryButtonHref: row.secondaryButtonHref,
    heroTiles: row.heroTiles as unknown as HeroTile[]
  };
}

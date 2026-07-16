import { prisma } from '@/lib/db/client';

export interface AboutPageContentData {
  badgeText: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  storyVisualHue: number;
  storyVisualTitle: string;
  storyVisualSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  ctaHeading: string;
  ctaSubheading: string;
  ctaButtonText: string;
  ctaButtonHref: string;
}

export const DEFAULT_ABOUT_CONTENT: AboutPageContentData = {
  badgeText: 'About Veedibox',
  heading: 'Modern art and usable visuals, in one place.',
  paragraph1:
    'Veedibox is an online marketplace for modern art and creative assets — digital paintings, stock imagery, and templates, with room to grow into wallpapers, merch-ready designs, and brand kits. We built it for founders, creatives, and everyday buyers who want high-quality visual content they can actually use, not just admire.',
  paragraph2:
    'Most platforms make you choose: a curated gallery for beautiful work, or a practical stock library for downloads you can drop into real projects. Veedibox combines both, so you can discover original art and grab the assets you need for decor, branding, and content — all in the same place.',
  storyVisualHue: 32,
  storyVisualTitle: 'The Design Gallery',
  storyVisualSubtitle: 'Curated visuals with soul',
  pillar1Title: 'Curated Art',
  pillar1Desc:
    'Museum-grade digital paintings and print-ready poster templates designed to style living rooms, offices, and creative studio walls.',
  pillar2Title: 'Stock with Soul',
  pillar2Desc:
    'Authentic, high-res lifestyle photography and textures to elevate landing pages, social accounts, and commercial branding.',
  pillar3Title: 'Usable Layouts',
  pillar3Desc:
    'Vector brand lockups, LinkedIn carousels, and Canva/Photoshop wireframes structured for fast drag-and-drop customization.',
  ctaHeading: 'Ready to find your style?',
  ctaSubheading:
    'Discover curated stocks, artistic canvas layouts, and vector templates built to give your designs distinct character.',
  ctaButtonText: 'Explore the Gallery',
  ctaButtonHref: '/shop/all'
};

export async function getAboutContent(): Promise<AboutPageContentData> {
  const row = await (prisma as any).aboutPageContent.findUnique({ where: { id: 'about' } });
  if (!row) return DEFAULT_ABOUT_CONTENT;
  return {
    badgeText: row.badgeText,
    heading: row.heading,
    paragraph1: row.paragraph1,
    paragraph2: row.paragraph2,
    storyVisualHue: row.storyVisualHue,
    storyVisualTitle: row.storyVisualTitle,
    storyVisualSubtitle: row.storyVisualSubtitle,
    pillar1Title: row.pillar1Title,
    pillar1Desc: row.pillar1Desc,
    pillar2Title: row.pillar2Title,
    pillar2Desc: row.pillar2Desc,
    pillar3Title: row.pillar3Title,
    pillar3Desc: row.pillar3Desc,
    ctaHeading: row.ctaHeading,
    ctaSubheading: row.ctaSubheading,
    ctaButtonText: row.ctaButtonText,
    ctaButtonHref: row.ctaButtonHref
  };
}

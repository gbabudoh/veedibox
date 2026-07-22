import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@veedibox.com';
const ADMIN_PASSWORD = 'admin12345';
const STAFF_EMAIL = 'staff@veedibox.com';
const STAFF_PASSWORD = 'staff12345';
const CUSTOMER_EMAIL = 'customer@veedibox.com';
const CUSTOMER_PASSWORD = 'customer12345';

interface SeedFile {
  label: string;
  kind: 'DIGITAL' | 'PRINT';
  fileSizeMb: number;
}

// Ported from src/lib/mock-data.ts PRODUCTS_SEED. previewKey/file keys are placeholders
// (real objects don't exist in MinIO) until an admin re-uploads real files via /admin/catalog.
// formats is no longer seeded here — it's derived from the uploaded files (see deriveFormats in
// product-mapper.ts); metadata below matches each category's fields in category-fields.ts.
const PRODUCTS: {
  slug: string;
  title: string;
  category: string;
  style: string;
  priceUsd: number;
  desc: string;
  metadata: Record<string, string | number | string[]>;
  files: SeedFile[];
}[] = [
  {
    slug: 'ochre-fields-abstract',
    title: 'Ochre Fields Abstract',
    category: 'WALL_ART',
    style: 'Abstract',
    priceUsd: 24,
    desc: 'A warm abstract composition of layered ochre and rust tones, printed on museum-grade paper. Great for living rooms and creative studios.',
    metadata: { orientation: 'Landscape', printSizes: '3 sizes, up to 24x36in' },
    files: [
      { label: 'JPG', kind: 'DIGITAL', fileSizeMb: 18 },
      { label: 'PNG', kind: 'DIGITAL', fileSizeMb: 22 },
      { label: 'Print-ready PDF', kind: 'PRINT', fileSizeMb: 8 }
    ]
  },
  { slug: 'line-study-no-3', title: 'Line Study No.3', category: 'WALL_ART', style: 'Minimalist', priceUsd: 18, desc: 'A single continuous line rendered in cool blue-greys. Minimalist wall art for calm, modern interiors.', metadata: { orientation: 'Portrait', printSizes: '4 sizes, up to 30x40in' }, files: [{ label: 'JPG + PNG bundle', kind: 'DIGITAL', fileSizeMb: 32 }] },
  {
    slug: 'monstera-botanical-set',
    title: 'Monstera Botanical Set',
    category: 'WALL_ART',
    style: 'Botanical',
    priceUsd: 22,
    desc: 'A set of three botanical studies in deep greens, ideal for gallery walls and biophilic office decor.',
    metadata: { orientation: 'Portrait', printSizes: 'Set of 3, 18x24in' },
    files: [
      { label: 'JPG', kind: 'DIGITAL', fileSizeMb: 24 },
      { label: 'Print-ready PDF', kind: 'PRINT', fileSizeMb: 12 }
    ]
  },
  { slug: 'rise-and-build-quote-print', title: 'Rise & Build Quote Print', category: 'WALL_ART', style: 'Typography', priceUsd: 16, desc: 'Bold motivational typography in warm coral, designed for founder desks and startup offices.', metadata: { orientation: 'Landscape', printSizes: '3 sizes, up to 20x30in' }, files: [{ label: 'JPG + PNG bundle', kind: 'DIGITAL', fileSizeMb: 24 }] },
  { slug: 'african-market-stock-pack', title: 'African Market Stock Pack', category: 'STOCK', style: 'Lifestyle', priceUsd: 39, desc: '40 original lifestyle photographs from African markets and street scenes, licensed for commercial use.', metadata: { imageCount: 40, resolution: '4000x6000px' }, files: [{ label: 'JPG pack (40 images)', kind: 'DIGITAL', fileSizeMb: 1200 }] },
  { slug: 'founder-desk-tech-pack', title: 'Founder Desk Tech Pack', category: 'STOCK', style: 'Tech', priceUsd: 34, desc: '25 clean workspace and tech-product shots for SaaS landing pages and pitch decks.', metadata: { imageCount: 25, resolution: '4000x6000px' }, files: [{ label: 'JPG pack (25 images)', kind: 'DIGITAL', fileSizeMb: 860 }] },
  { slug: 'texture-and-grain-backgrounds', title: 'Texture & Grain Backgrounds', category: 'STOCK', style: 'Texture', priceUsd: 19, desc: 'A pack of paper, fabric, and concrete textures for backgrounds and overlays.', metadata: { imageCount: 30, resolution: '3000x3000px' }, files: [{ label: 'JPG + PNG pack', kind: 'DIGITAL', fileSizeMb: 640 }] },
  { slug: 'social-carousel-kit', title: 'Social Carousel Kit', category: 'TEMPLATES', style: 'Social', priceUsd: 14, desc: '12 editable carousel templates for Instagram and LinkedIn, built for fast branded posting.', metadata: { software: 'Canva, Photoshop', editableLayers: 12 }, files: [{ label: 'Canva + PSD bundle', kind: 'DIGITAL', fileSizeMb: 140 }] },
  { slug: 'minimal-brand-sheet', title: 'Minimal Brand Sheet', category: 'TEMPLATES', style: 'Branding', priceUsd: 12, desc: 'A simple one-page brand sheet template: logo lockup, palette, and type scale placeholders.', metadata: { software: 'Photoshop', editableLayers: 6 }, files: [{ label: 'PSD + PDF bundle', kind: 'DIGITAL', fileSizeMb: 18 }] },
  {
    slug: 'founder-office-bundle',
    title: 'Founder Office Bundle',
    category: 'BUNDLES',
    style: 'Bundle',
    priceUsd: 59,
    desc: "A curated bundle of wall art and quote prints for the modern founder's office.",
    metadata: { includedItems: ['3 Wall Art Prints (JPG + PNG)', '1 Quote Print', 'Print-ready PDF pack'] },
    files: [
      { label: 'JPG', kind: 'DIGITAL', fileSizeMb: 60 },
      { label: 'PNG', kind: 'DIGITAL', fileSizeMb: 70 },
      { label: 'Print-ready PDF', kind: 'PRINT', fileSizeMb: 50 }
    ]
  }
];

async function main() {
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: 'SUPER_ADMIN' },
    create: { email: ADMIN_EMAIL, name: 'Veedibox Admin', passwordHash: adminHash, role: 'SUPER_ADMIN' }
  });

  const staffHash = await bcrypt.hash(STAFF_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: STAFF_EMAIL },
    update: { role: 'ADMIN' },
    create: { email: STAFF_EMAIL, name: 'Veedibox Staff', passwordHash: staffHash, role: 'ADMIN' }
  });

  const homepageContent = {
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
  await prisma.homepageContent.upsert({
    where: { id: 'homepage' },
    update: {},
    create: { id: 'homepage', ...homepageContent }
  });

  const customerHash = await bcrypt.hash(CUSTOMER_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: CUSTOMER_EMAIL },
    update: {},
    create: { email: CUSTOMER_EMAIL, name: 'Test Customer', passwordHash: customerHash, role: 'CUSTOMER' }
  });

  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { metadata: p.metadata },
      create: {
        title: p.title,
        slug: p.slug,
        description: p.desc,
        category: p.category as any,
        style: p.style,
        tags: [],
        price: p.priceUsd * 100,
        metadata: p.metadata,
        previewKey: `seed/${p.slug}/preview.jpg`,
        status: 'published',
        creatorId: admin.id
      }
    });

    // Re-seedable: replace this product's files with the current seed definition each run.
    await prisma.productFile.deleteMany({ where: { productId: product.id } });
    await prisma.productFile.createMany({
      data: p.files.map((f, i) => ({
        productId: product.id,
        label: f.label,
        kind: f.kind,
        fileKey: `seed/${p.slug}/${f.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        fileSizeMb: f.fileSizeMb,
        sortOrder: i
      }))
    });
  }

  console.log('Seeded:');
  console.log(`  Super admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`  Basic admin login: ${STAFF_EMAIL} / ${STAFF_PASSWORD}`);
  console.log(`  Customer login:    ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`);
  console.log(`  Products: ${PRODUCTS.length}`);
  console.log(`  Files: ${PRODUCTS.reduce((sum, p) => sum + p.files.length, 0)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

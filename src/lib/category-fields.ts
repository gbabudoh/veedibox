import { UrlCategory } from '@/lib/product-mapper';

export interface CategoryField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  placeholder?: string;
}

// Category-specific extra attributes, rendered dynamically in the admin ProductModal
// and stored in Product.metadata (Json). Add/remove fields here without a migration.
export const CATEGORY_METADATA_FIELDS: Record<UrlCategory, CategoryField[]> = {
  'wall-art': [
    { key: 'orientation', label: 'Orientation', type: 'select', options: ['Portrait', 'Landscape', 'Square'] },
    { key: 'printSizes', label: 'Available print sizes', type: 'text', placeholder: 'e.g. 12x16in, 18x24in, 24x36in' }
  ],
  stock: [
    { key: 'imageCount', label: 'Number of images', type: 'number' },
    { key: 'resolution', label: 'Resolution', type: 'text', placeholder: 'e.g. 4000x6000px' }
  ],
  templates: [
    { key: 'software', label: 'Software required', type: 'text', placeholder: 'e.g. Canva, Photoshop' },
    { key: 'editableLayers', label: 'Editable layers', type: 'number' }
  ],
  bundles: [
    { key: 'itemCount', label: 'Items included', type: 'number' },
    { key: 'discountPct', label: 'Bundle discount %', type: 'number' }
  ]
};

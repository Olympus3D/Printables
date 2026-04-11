import type { Product } from '../types/product';

export function parseTags(tagValue: string): string[] {
  if (!tagValue) return [];
  return tagValue
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function extractUniqueTags(products: Product[]): string[] {
  const all = products.flatMap((product) => parseTags(product.tag));
  return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
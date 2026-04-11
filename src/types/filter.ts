export type SortField = 'name' | 'price' | 'salesCount';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  sortField: SortField;
  sortDirection: SortDirection;
  minPrice: string;
  maxPrice: string;
}
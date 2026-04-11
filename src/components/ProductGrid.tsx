import { useState, useMemo } from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { FilterBar } from './FilterBar';
import type { FilterState } from '../types/filter';
import { Pagination } from './Pagination';
import { parseTags } from '../utils/tags';

const ITEMS_PER_PAGE = 30;

const defaultFilters: FilterState = {
  search: '',
  sortField: 'name',
  sortDirection: 'asc',
  minPrice: '',
  maxPrice: '',
};

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  selectedTag?: string;
  onClearSelectedTag?: () => void;
}

export function ProductGrid({
  products,
  loading,
  selectedTag = '',
  onClearSelectedTag,
}: ProductGridProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevTag, setPrevTag] = useState(selectedTag);

  // When selectedTag prop changes, reset to page 1 (React "adjusting state during render"
  // pattern: one comparison variable + two coordinated setState calls; React aborts and
  // immediately re-renders with the new state, so no extra effect or ref is needed).
  if (prevTag !== selectedTag) {
    setPrevTag(selectedTag);
    setCurrentPage(1);
  }

  // Wrap setFilters so filter changes also reset pagination in the event handler.
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    const min = filters.minPrice ? parseFloat(filters.minPrice) : NaN;
    const max = filters.maxPrice ? parseFloat(filters.maxPrice) : NaN;
    const hasInvalidPriceRange = !isNaN(min) && !isNaN(max) && max < min;

    if (selectedTag) {
      result = result.filter((p) =>
        parseTags(p.tag).includes(selectedTag)
      );
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (filters.minPrice) {
      if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    }

    if (filters.maxPrice && !hasInvalidPriceRange) {
      if (!isNaN(max)) result = result.filter((p) => p.price <= max);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortField === 'name') {
        cmp = a.name.localeCompare(b.name, 'pt-BR');
      } else if (filters.sortField === 'price') {
        cmp = a.price - b.price;
      } else if (filters.sortField === 'salesCount') {
        cmp = a.salesCount - b.salesCount;
      }
      return filters.sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [products, filters, selectedTag]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasSearch = filters.search.trim().length > 0;
  const hasPriceFilter = Boolean(filters.minPrice || filters.maxPrice);
  const hasActiveFilters = Boolean(selectedTag || hasSearch || hasPriceFilter);
  const resetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const clearSelectedTag = () => {
    onClearSelectedTag?.();
    setCurrentPage(1);
  };

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 md:px-8 py-12 scroll-mt-32">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Catálogo de Produtos</h2>
        <p className="text-gray-500 mt-1">
          {selectedTag ? `Categoria: ${selectedTag}` : 'Explore nossos produtos impressos em 3D'}
        </p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        totalCount={filtered.length}
      />

      {hasActiveFilters && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {selectedTag && (
            <button
              onClick={clearSelectedTag}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              title="Remover categoria ativa"
              aria-label="Remover categoria ativa"
            >
              Categoria: {selectedTag}
              <span className="text-[10px]">✕</span>
            </button>
          )}
          {hasSearch && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Busca: "{filters.search.trim()}"
            </span>
          )}
          {hasPriceFilter && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Preço: {filters.minPrice || '0'} até {filters.maxPrice || 'sem limite'}
            </span>
          )}
          <button
            onClick={resetFilters}
            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-12 text-center text-gray-500 sm:px-8 sm:py-16">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">Nenhum produto encontrado</p>
          {selectedTag ? (
            <p className="text-sm mt-1">Não há itens disponíveis na categoria "{selectedTag}".</p>
          ) : hasSearch ? (
            <p className="text-sm mt-1">Nenhum resultado para "{filters.search.trim()}".</p>
          ) : (
            <p className="text-sm mt-1">Tente ajustar ou limpar os filtros aplicados.</p>
          )}

          <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            {(hasSearch || hasPriceFilter) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
              >
                Limpar filtros
              </button>
            )}
            {selectedTag && (
              <button
                onClick={clearSelectedTag}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Ver todas as categorias
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}

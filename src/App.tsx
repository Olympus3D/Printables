import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { SplashScreen } from './components/SplashScreen';
import type { Product } from './types/product';
import { fetchProducts } from './services/appSheetService';
import { extractUniqueTags } from './utils/tags';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError('');
    fetchProducts()
      .then(({ products }) => setProducts(products))
      .catch(() => {
        setProducts([]);
        setError('Não foi possível carregar o catálogo. Verifique sua conexão e tente novamente.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const tags = useMemo(() => extractUniqueTags(products), [products]);

  const clearTag = () => setSelectedTag('');

  return (
    <div className="min-h-screen bg-white">
      {showSplash && <SplashScreen onHide={() => setShowSplash(false)} />}

      <Header tags={tags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />

      <main>
        <HeroSection />
        {error ? (
          <section className="max-w-4xl mx-auto px-4 md:px-8 py-12">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <h2 className="text-xl font-semibold text-red-700">Falha ao carregar produtos</h2>
              <p className="mt-2 text-sm text-red-600">{error}</p>
              <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={loadProducts}
                  className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Tentar novamente
                </button>
                <button
                  onClick={clearTag}
                  className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                >
                  Limpar categoria ativa
                </button>
              </div>
            </div>
          </section>
        ) : (
          <ProductGrid
            products={products}
            loading={loading}
            selectedTag={selectedTag}
            onClearSelectedTag={clearTag}
          />
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm">
          <p>© 2026 Olympus 3D — Impressão 3D Personalizada</p>
          <p className="mt-1 text-gray-500">Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

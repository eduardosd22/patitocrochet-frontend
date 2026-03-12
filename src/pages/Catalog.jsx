import { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, Search, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Productos de respaldo si la API está vacía (imágenes locales)
const FALLBACK_PRODUCTS = [
  { _id: 'f1', name: 'Amigurumi Hello Kitty', category: 'amigurumis', price: 25, description: 'Hello Kitty con mini ramo de rosas, en caja de regalo. Hecho a mano con hilos premium.', imageUrl: '/images/hello_kitty.png', badge: 'Más vendido' },
  { _id: 'f2', name: 'Ramo Hollow Knight',    category: 'ramos',      price: 35, description: 'Personaje de Hollow Knight en ramo de tulipanes tejidos. El regalo gamer perfecto.',   imageUrl: '/images/hollow_knight.png', badge: 'Nuevo' },
  { _id: 'f3', name: 'Llaveros Mini',         category: 'llaveros',   price: 6,  description: 'Llaveros amigurumi de animalitos y personajes. Elige tu favorito.',                   imageUrl: '/images/llaveros.png',     badge: null },
  { _id: 'f4', name: 'Gorro Crochet',         category: 'gorros',     price: 18, description: 'Gorros tejidos a mano en colores pasteles. Tallas disponibles.',                      imageUrl: '/images/gorros.png',       badge: null },
];

const CATEGORIES = [
  { id: 'todos',      label: 'Todos' },
  { id: 'amigurumis', label: 'Amigurumis' },
  { id: 'ramos',      label: 'Ramos' },
  { id: 'llaveros',   label: 'Llaveros' },
  { id: 'gorros',     label: 'Gorros' },
];

const Catalog = () => {
  const navigate = useNavigate();
  const { addItem, count } = useCart();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastItem, setToastItem] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch productos desde la API con paginación y búsqueda
  useEffect(() => {
    document.title = "Catálogo | Patito Crochet";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Explora nuestro catálogo de productos tejidos a mano. Amigurumis, ramos, llaveros y más.");
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '12' // 12 items por página
        });
        
        if (activeCategory && activeCategory !== 'todos') queryParams.append('category', activeCategory);
        if (searchQuery) queryParams.append('search', searchQuery);

        const res = await fetch(`${API_URL}/api/products?${queryParams.toString()}`);
        const data = await res.json();
        
        if (data && data.products) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch {
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para no hacer fetch con cada letra escrita de golpe
    const timeoutId = setTimeout(() => {
        fetchProducts();
    }, 300);
    return () => clearTimeout(timeoutId);

  }, [activeCategory, searchQuery, page]);

  // Al cambiar categoría o buscar, volver a página 1
  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  const filtered = products; // El backend ya filtra y excluye inactivos/no-disponibles



  const handleAddToCart = (product) => {
    addItem({ ...product, id: product._id });
    setToastItem(product.name);
    setTimeout(() => setToastItem(null), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>

      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, var(--color-pastel-yellow) 100%)',
        padding: '4rem 1.5rem 3rem',
        textAlign: 'center',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', color: 'var(--color-brand-dark)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Catálogo
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.75rem' }}>
          Cada pieza es única, tejida a mano. Elige la tuya o crea algo completamente personalizado.
        </p>

        {/* Barra de búsqueda */}
        <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar amigurumis, ramos..."
            style={{
              width: '100%', backgroundColor: 'white',
              border: '1px solid #e5e7eb', borderRadius: '9999px',
              padding: '0.75rem 2.75rem 0.75rem 3rem',
              fontSize: '0.9rem', color: 'var(--color-brand-dark)',
              outline: 'none', boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          />
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
              <X size={15} />
            </button>
          )}
        </div>
      </section>

      {/* Filtros de categoría */}
      <div style={{ position: 'sticky', top: '72px', zIndex: 40, backgroundColor: 'rgba(247,250,252,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f3f4f6', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '0.25rem', overflowX: 'auto', padding: '0.75rem 0', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
              padding: '0.5rem 1.25rem', borderRadius: '9999px', border: '1px solid',
              borderColor: activeCategory === cat.id ? 'transparent' : '#e5e7eb',
              backgroundColor: activeCategory === cat.id ? 'var(--color-brand-dark)' : 'white',
              color: activeCategory === cat.id ? 'white' : '#6b7280',
              fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0
            }}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Resultado de búsqueda */}
        {searchQuery && (
          <div style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
            {filtered.length === 0
              ? `Sin resultados para "${searchQuery}"`
              : `${filtered.length} resultado${filtered.length > 1 ? 's' : ''} para "${searchQuery}"`}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Cargando productos...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>

            {filtered.map(product => (
              <div 
                key={product._id} 
                className="card-pastel" 
                style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => navigate(`/producto/${product._id}`)}
              >
                {/* Imagen */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden', backgroundColor: '#f9f0f3' }}>
                  {product.imageUrl || product.image ? (
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      onError={e => {
                        // Si la imagen falla, ocultarla y mostrar el placeholder de abajo
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.setAttribute('data-broken', 'true');
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#fdf2f8' }}>
                      <span style={{ fontSize: '3rem' }}>🧶</span>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sin foto</span>
                    </div>
                  )}
                  {product.badge && (
                    <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', backgroundColor: 'var(--color-brand-dark)', color: 'white', fontSize: '0.7rem', fontWeight: '600', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>
                      {product.badge}
                    </span>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    {product.category}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '0.5rem' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.5', flex: 1, marginBottom: '1rem' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '700', color: 'var(--color-brand-dark)' }}>
                      ${Number(product.price).toFixed(2)} <span style={{ fontSize: '0.7rem', fontWeight: '400', color: '#9ca3af' }}>USD</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--color-pastel-yellow)', color: 'var(--color-brand-dark)', border: 'none', borderRadius: '9999px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                      onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
                    >
                      <ShoppingBag size={14} /> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Tarjeta Próximamente */}
            <div style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px' }}>
              <div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Sparkles size={24} color="rgba(255,255,255,0.4)" />
                </div>
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', padding: '0.25rem 0.75rem', borderRadius: '9999px', marginBottom: '0.875rem', textTransform: 'uppercase' }}>
                  Próximamente
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '700', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Pedido Personalizado IA</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  Pronto podrás describir tu idea y nuestra IA te dará un precio estimado en segundos.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>Mientras tanto, escríbenos por WhatsApp</div>
              </div>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: page === 1 ? '#f9fafb' : 'white', color: page === 1 ? '#9ca3af' : 'var(--color-brand-dark)', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Anterior
                </button>
                <span style={{ padding: '0.5rem 1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: page === totalPages ? '#f9fafb' : 'white', color: page === totalPages ? '#9ca3af' : 'var(--color-brand-dark)', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast de éxito al agregar */}
      {toastItem && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          backgroundColor: 'white', border: '1px solid #d1fae5',
          color: 'var(--color-brand-dark)', padding: '1rem 1.5rem',
          borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 100,
          animation: 'slideUp 0.3s ease'
        }}>
          <CheckCircle size={18} color="#10b981" />
          <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>
            <strong>{toastItem}</strong> agregado al carrito
          </span>
          {count > 0 && (
            <span style={{ backgroundColor: 'var(--color-brand-dark)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700' }}>
              {count} {count === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Catalog;

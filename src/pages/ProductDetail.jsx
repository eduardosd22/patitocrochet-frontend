import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, count } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastItem, setToastItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.imageUrl || data.image || '');
        
        // SEO
        document.title = `${data.name} | Patito Crochet`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute("content", data.description);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.available || product.stock <= 0) return;
    addItem({ ...product, id: product._id });
    setToastItem(product.name);
    setTimeout(() => setToastItem(null), 2500);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Cargando producto...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: '#dc2626' }}>{error}</div>;
  if (!product) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginBottom: '2rem', fontWeight: '500' }}>
          <ArrowLeft size={18} /> Volver
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.2fr)', gap: '3rem', backgroundColor: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
          
          {/* Imágenes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#f9f0f3', borderRadius: '1rem', overflow: 'hidden' }}>
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🧶</div>
              )}
            </div>
            {product.images && product.images.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <img 
                  src={product.imageUrl} 
                  alt="Principal" 
                  onClick={() => setSelectedImage(product.imageUrl)}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer', border: selectedImage === product.imageUrl ? '2px solid var(--color-brand-dark)' : '2px solid transparent' }} 
                />
                {product.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Extra ${idx}`} 
                    onClick={() => setSelectedImage(img)}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer', border: selectedImage === img ? '2px solid var(--color-brand-dark)' : '2px solid transparent' }} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              {product.category}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-brand-dark)', marginBottom: '1rem', lineHeight: 1.1 }}>
              {product.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-brand-dark)', marginBottom: '1.5rem' }}>
              ${Number(product.price).toFixed(2)} <span style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: '500' }}>USD</span>
            </div>

            <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.7', marginBottom: '2rem' }}>
              {product.description}
            </p>

            {product.customizationOptions && product.customizationOptions.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '0.75rem' }}>Opciones de personalización:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.customizationOptions.map((opt, i) => (
                    <span key={i} style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '500' }}>
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #f3f4f6' }}>
              {product.available && product.stock > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <CheckCircle size={16} /> En stock ({product.stock} disponibles)
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--color-brand-dark)', color: 'white', border: 'none', borderRadius: '9999px', padding: '1rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(44,47,58,0.15)' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <ShoppingBag size={18} /> Agregar al Carrito
                  </button>
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <AlertTriangle size={20} /> Producto Agotado
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {toastItem && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', backgroundColor: 'white', border: '1px solid #d1fae5', color: 'var(--color-brand-dark)', padding: '1rem 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 100 }}>
          <CheckCircle size={18} color="#10b981" />
          <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>
            <strong>{toastItem}</strong> agregado
          </span>
          {count > 0 && <span style={{ backgroundColor: 'var(--color-brand-dark)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700' }}>{count} items</span>}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

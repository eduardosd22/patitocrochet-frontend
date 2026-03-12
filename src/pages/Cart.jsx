import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeItem, total, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <Package size={56} color="#e5e7eb" style={{ marginBottom: '1.25rem' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '0.5rem' }}>
          Tu carrito está vacío
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Agrega productos desde el catálogo para continuar.
        </p>
        <button
          onClick={() => navigate('/catalogo')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-brand-dark)', color: 'white', border: 'none', borderRadius: '9999px', padding: '0.75rem 1.75rem', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <ShoppingBag size={16} /> Ver catálogo
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => navigate('/catalogo')} style={{ padding: '0.5rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', color: '#6b7280' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-brand-dark)', margin: 0 }}>
            Carrito de compras
          </h1>
          <span style={{ backgroundColor: 'var(--color-brand-dark)', color: 'white', borderRadius: '9999px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
            {cartItems.length}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>

          {/* Lista de items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cartItems.map(item => (
              <div key={item.cartId} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #f3f4f6', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Imagen */}
                <div style={{ width: '72px', height: '72px', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: '#f9fafb', flexShrink: 0 }}>
                  <img src={item.imageUrl || item.image || '/images/placeholder.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} />
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: 'var(--color-brand-dark)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'capitalize' }}>{item.category}</div>
                </div>
                {/* Precio */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--color-brand-dark)', fontSize: '1rem' }}>
                    ${Number(item.price).toFixed(2)} USD
                  </div>
                  <button onClick={() => removeItem(item.cartId)} style={{ marginTop: '0.5rem', padding: '0.3rem', borderRadius: '0.5rem', border: '1px solid #fee2e2', backgroundColor: '#fff5f5', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            <button onClick={clearCart} style={{ alignSelf: 'flex-start', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#6b7280', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.25rem' }}>
              Vaciar carrito
            </button>
          </div>

          {/* Resumen */}
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #f3f4f6', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Resumen del pedido
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {cartItems.map(item => (
                <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280' }}>
                  <span style={{ flex: 1, marginRight: '0.5rem' }}>{item.name}</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-brand-dark)', flexShrink: 0 }}>${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-brand-dark)' }}>
                ${total.toFixed(2)} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af' }}>USD</span>
              </span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--color-brand-dark)', color: 'white', border: 'none', borderRadius: '9999px', padding: '0.875rem', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              Proceder al pago <ArrowRight size={16} />
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.75rem' }}>
              Pago coordinado por WhatsApp tras confirmar el pedido
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

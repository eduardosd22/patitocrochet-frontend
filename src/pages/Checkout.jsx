import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingBag, User, Mail, Phone, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    name:  currentUser?.displayName || '',
    email: currentUser?.email || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Pre-llenar desde el perfil guardado
  useEffect(() => {
    if (!currentUser) return;
    fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${currentUser.token}` } })
      .then(r => r.json())
      .then(data => {
        setForm(prev => ({
          ...prev,
          name:  data.name  || currentUser.displayName || '',
          email: data.email || currentUser.email || '',
          notes: data.address || ''
        }));
        if (data.name || data.address) setProfileLoaded(true); // muestra el aviso solo si hay datos
      })
      .catch(() => {});
  }, [currentUser]);

  // Variable para evitar redirección si recién confirmamos
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Si el carrito está vacío, redirigir de forma segura
  useEffect(() => {
    if (!cartItems.length && !orderConfirmed) {
      navigate('/catalogo');
    }
  }, [cartItems.length, orderConfirmed, navigate]);

  if (!cartItems.length && !orderConfirmed) {
    return null;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        clientData: {
          name:    form.name,
          email:   form.email,
          address: form.notes || ''
        },
        items: cartItems.map(item => ({
          product:    item._id || item.id || null,
          name:       item.name,
          price:      Number(item.price),
          quantity:   item.quantity || 1,
          category:   item.category || '',
          isAIGenerated: item.isAIGenerated || false,
          customDetails: item.customDetails || ''
        })),
        totalAmount: total
      };

      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al procesar el pedido');

      // Guardar datos en el perfil automáticamente si hay token
      if (currentUser?.token) {
        fetch(`${API_URL}/api/users/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
          body: JSON.stringify({ name: form.name, address: form.notes })
        }).catch(() => {}); // silencioso, no bloqueante
      }

      // Redirigir siempre a confirmación para que guarden su código
      setOrderConfirmed(true);
      clearCart();
      navigate('/confirmacion', { state: { orderCode: data.orderCode, email: form.email, name: form.name } });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.4rem' };
  const inputStyle = { width: '100%', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.9rem', color: 'var(--color-brand-dark)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button onClick={() => navigate('/carrito')} style={{ padding: '0.5rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', color: '#6b7280' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-brand-dark)', margin: 0 }}>
            Finalizar pedido
          </h1>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '1.5rem', alignItems: 'flex-start' }}>

          {/* Formulario */}
          <div style={{ flex: '1 1 350px', backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #f3f4f6' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '1.5rem' }}>
              Tus datos de contacto
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Banner de datos precargados */}
              {profileLoaded && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                  <CheckCircle size={15} color="#059669" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem', color: '#166534' }}>
                    Datos cargados desde tu perfil. Verifica que sean correctos antes de confirmar.
                  </span>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Nombre completo *</label>
                  <div style={{ position: 'relative' }}>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre" style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                      onFocus={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 0 0 3px rgba(255,243,199,0.5)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    <User size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Correo electrónico *</label>
                  <div style={{ position: 'relative' }}>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@correo.com" style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                      onFocus={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 0 0 3px rgba(255,243,199,0.5)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>



              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Notas adicionales (opcional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Colores especiales, detalles del personaje, fecha deseada..." style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 0 0 3px rgba(255,243,199,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {error && (
                <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  {error}
                </div>
              )}



              <button type="submit" disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: loading ? '#e5e7eb' : 'var(--color-brand-dark)', color: loading ? '#9ca3af' : 'white', border: 'none', borderRadius: '9999px', padding: '0.875rem', fontWeight: '700', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                <ShoppingBag size={18} />
                {loading ? 'Enviando pedido...' : 'Confirmar pedido'}
              </button>
            </form>
          </div>

          {/* Resumen lateral */}
          <div style={{ flex: '1 1 300px', width: '100%', backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #f3f4f6', position: 'sticky', top: '90px', alignSelf: 'flex-start' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Resumen ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
              {cartItems.map(item => (
                <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#6b7280', flex: 1, marginRight: '0.5rem' }}>{item.name}</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-brand-dark)', flexShrink: 0 }}>${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: '800', color: 'var(--color-brand-dark)' }}>
                ${total.toFixed(2)} <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>USD</span>
              </span>
            </div>
            <div style={{ marginTop: '1.25rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '0.875rem', fontSize: '0.75rem', color: '#166534', lineHeight: '1.6' }}>
              El pago se coordina por WhatsApp una vez que confirmemos tu pedido. No se requiere pago online.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

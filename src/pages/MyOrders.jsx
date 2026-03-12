import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  pending:     { label: 'Pendiente',      color: '#d97706', bg: '#fffbeb' },
  accepted:    { label: 'Aceptado',       color: '#059669', bg: '#f0fdf4' },
  in_progress: { label: 'En elaboración', color: '#2563eb', bg: '#eff6ff' },
  on_hold:     { label: 'En espera',      color: '#7c3aed', bg: '#faf5ff' },
  completed:   { label: 'Completado',     color: '#059669', bg: '#f0fdf4' },
  rejected:    { label: 'Rechazado',      color: '#dc2626', bg: '#fff5f5' },
};

const MyOrders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    fetchMyOrders();
  }, [currentUser]);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-brand-dark)', marginBottom: '0.4rem' }}>
            Mis pedidos
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Hola, <strong>{currentUser?.displayName?.split(' ')[0]}</strong>. Aquí están todos tus pedidos.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #f3f4f6' }}>
            <Package size={48} color="#e5e7eb" style={{ marginBottom: '1.25rem' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '0.5rem' }}>
              Aún no tienes pedidos
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Explora el catálogo y haz tu primer pedido.
            </p>
            <button
              onClick={() => navigate('/catalogo')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-brand-dark)', color: 'white', border: 'none', borderRadius: '9999px', padding: '0.75rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              <ShoppingBag size={15} /> Ver catálogo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = order.status === 'completed' ? CheckCircle : order.status === 'rejected' ? AlertCircle : Clock;
              return (
                <div key={order._id} style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  {/* Header */}
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <code style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-brand-dark)', backgroundColor: '#f3f4f6', padding: '0.2rem 0.625rem', borderRadius: '6px', letterSpacing: '0.04em' }}>
                          {order.orderCode}
                        </code>
                        <span style={{ fontSize: '0.72rem', fontWeight: '600', color: st.color, backgroundColor: st.bg, padding: '0.2rem 0.625rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <StatusIcon size={11} /> {st.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                        {new Date(order.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.25rem', color: 'var(--color-brand-dark)' }}>
                        ${Number(order.totalAmount || 0).toFixed(2)} <span style={{ fontSize: '0.7rem', fontWeight: '400', color: '#9ca3af' }}>USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  {order.items && order.items.length > 0 && (
                    <div style={{ borderTop: '1px solid #f9fafb', padding: '0.875rem 1.5rem', backgroundColor: '#fafafa' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#4b5563', padding: '0.35rem 0', borderBottom: i < order.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                          <span>{item.name} {item.quantity > 1 ? `×${item.quantity}` : ''}</span>
                          <span style={{ fontWeight: '600' }}>${Number(item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Acciones */}
                  <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigate('/rastrear', { state: { code: order.orderCode } })}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 1rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#4b5563', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      <Search size={12} /> Rastrear
                    </button>
                    {(order.status === 'pending' || order.status === 'on_hold') && (
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                        La administradora revisará tu pedido pronto.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

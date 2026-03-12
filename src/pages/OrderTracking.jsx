import { useState } from 'react';
import { Search, Package, CheckCircle, Clock, XCircle, ArrowRight, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  pending:     { label: 'Pendiente de revisión', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Clock,        step: 1 },
  accepted:    { label: 'Aceptado',               color: '#059669', bg: '#f0fdf4', border: '#6ee7b7', icon: CheckCircle, step: 2 },
  in_progress: { label: 'En elaboración',          color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', icon: Package,     step: 3 },
  on_hold:     { label: 'En espera',               color: '#7c3aed', bg: '#faf5ff', border: '#c4b5fd', icon: Clock,       step: 2 },
  completed:   { label: 'Completado',              color: '#059669', bg: '#f0fdf4', border: '#6ee7b7', icon: CheckCircle, step: 4 },
  rejected:    { label: 'Rechazado',               color: '#dc2626', bg: '#fff5f5', border: '#fca5a5', icon: XCircle,     step: 0 },
};

const STEPS = ['Solicitado', 'Revisado', 'En elaboración', 'Completado'];

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const performSearch = async (searchCode) => {
    if (!searchCode.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      // Limpiar el código: quitar # iniciales y espacios
      const cleanCode = searchCode.trim().replace(/^#+/, '').toUpperCase();
      const res = await fetch(`${API_URL}/api/orders/track/${cleanCode}`);
      if (!res.ok) throw new Error('not_found');
      const data = await res.json();
      setOrder(data);
    } catch {
      setError('No encontramos ningún pedido con ese código. Verifica que sea el código correcto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryCode = params.get('codigo');
    const stateCode = location.state?.code;
    const initialCode = queryCode || stateCode;

    if (initialCode && !searched) {
      setCode(initialCode);
      performSearch(initialCode);
    }
  }, [location, searched]);

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(code);
  };

  const status = order ? (STATUS_CONFIG[order.status] || STATUS_CONFIG.pending) : null;
  const StatusIcon = status?.icon;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>

      {/* Hero del tracker */}
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, var(--color-pastel-blue) 100%)',
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: '800',
          color: 'var(--color-brand-dark)',
          marginBottom: '0.75rem',
          letterSpacing: '-0.02em'
        }}>
          Rastrea tu pedido
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '460px', margin: '0 auto 2.5rem' }}>
          Ingresa el código único que recibiste al confirmar tu pedido para ver su estado actual.
        </p>

        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '480px', margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: PC-2024-ABCD"
              style={{
                width: '100%',
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '9999px',
                padding: '0.875rem 1.25rem 0.875rem 3rem',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                fontWeight: '600',
                color: 'var(--color-brand-dark)',
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: '0.05em',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--color-brand-dark)'; e.target.style.boxShadow = '0 0 0 3px rgba(44,47,58,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button
            type="submit"
            disabled={!code.trim() || loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: code.trim() ? 'var(--color-brand-dark)' : '#e5e7eb',
              color: code.trim() ? 'white' : '#9ca3af',
              border: 'none', borderRadius: '9999px',
              padding: '0.875rem 1.75rem',
              fontSize: '0.9rem', fontWeight: '600',
              cursor: code.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', flexShrink: 0
            }}
          >
            {loading ? 'Buscando...' : <><Search size={15} /> Buscar</>}
          </button>
        </form>
      </section>

      {/* Resultado */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fff5f5', border: '1px solid #fca5a5',
            borderRadius: '1rem', padding: '1.5rem',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
          }}>
            <XCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <div style={{ fontWeight: '600', color: '#991b1b', marginBottom: '0.25rem' }}>Pedido no encontrado</div>
              <div style={{ fontSize: '0.875rem', color: '#b91c1c' }}>{error}</div>
            </div>
          </div>
        )}

        {/* Resultado del pedido */}
        {order && status && (
          <div>
            {/* Estado principal */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.25rem',
              padding: '2rem',
              border: `1px solid ${status.border}`,
              marginBottom: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  backgroundColor: status.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <StatusIcon size={26} color={status.color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Estado del pedido
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '700', color: status.color }}>
                    {status.label}
                  </div>
                </div>
              </div>

              {/* Info básica */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Código</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--color-brand-dark)', fontSize: '1rem', letterSpacing: '0.05em' }}>
                    {order.orderCode}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Total</div>
                  <div style={{ fontWeight: '700', color: 'var(--color-brand-dark)', fontSize: '1rem' }}>
                    ${(order.totalPrice || 0).toFixed(2)} USD
                  </div>
                </div>
              </div>

              {order.description && (
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.6' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Descripción</div>
                  {order.description}
                </div>
              )}
            </div>

            {/* Timeline de pasos */}
            {order.status !== 'rejected' && (
              <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '1.75rem 2rem', border: '1px solid #f3f4f6', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>
                  Progreso
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {STEPS.map((step, i) => {
                    const done = status.step > i;
                    const current = status.step === i + 1;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '9999px',
                            backgroundColor: done || current ? 'var(--color-brand-dark)' : '#f3f4f6',
                            border: current ? '3px solid var(--color-pastel-yellow)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s',
                            boxShadow: current ? '0 0 0 3px rgba(255,243,199,0.5)' : 'none'
                          }}>
                            {done || current
                              ? <CheckCircle size={16} color="white" />
                              : <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#d1d5db' }} />
                            }
                          </div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '600', color: done || current ? 'var(--color-brand-dark)' : '#9ca3af', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {step}
                          </div>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div style={{ flex: 1, height: '2px', backgroundColor: done ? 'var(--color-brand-dark)' : '#f3f4f6', margin: '0 0.35rem', marginBottom: '1.4rem', transition: 'background-color 0.3s' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botones finales */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => { setOrder(null); setCode(''); setSearched(false); }} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: '9999px',
                border: '1px solid #e5e7eb', backgroundColor: 'white',
                color: '#4b5563', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer'
              }}>
                <Search size={14} /> Buscar otro pedido
              </button>
              <button onClick={() => navigate('/catalogo')} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: '9999px',
                border: 'none', backgroundColor: 'var(--color-brand-dark)',
                color: 'white', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer'
              }}>
                Ver catálogo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Estado vacío inicial */}
        {!searched && !order && !error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Package size={48} color="#e5e7eb" style={{ marginBottom: '1rem' }} />
            <div style={{ color: '#9ca3af', fontWeight: '500' }}>Ingresa tu código para ver el estado del pedido</div>
            <div style={{ color: '#d1d5db', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Lo recibiste por correo al confirmar tu pedido
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

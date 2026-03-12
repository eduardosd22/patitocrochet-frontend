import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, ShoppingBag, Search, Mail } from 'lucide-react';
import { useState } from 'react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderCode, email, name } = location.state || {};
  const [copied, setCopied] = useState(false);

  if (!orderCode) {
    navigate('/');
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>

        {/* Check animado */}
        <div style={{ width: '80px', height: '80px', borderRadius: '9999px', backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem' }}>
          <CheckCircle size={40} color="#10b981" />
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--color-brand-dark)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          ¡Pedido recibido!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
          Gracias <strong>{name}</strong>, tu pedido fue registrado con éxito.
        </p>

        {/* Banner revisa tu correo */}
        <div style={{
          backgroundColor: '#eff6ff', border: '1px solid #93c5fd',
          borderRadius: '1rem', padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          textAlign: 'left', marginBottom: '1.75rem'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={20} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontWeight: '700', color: '#1d4ed8', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
              📬 Revisa tu correo electrónico
            </div>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6', lineHeight: '1.5' }}>
              Enviamos la confirmación a <strong>{email}</strong>.<br />
              Incluye tu código de pedido y los próximos pasos.
            </div>
          </div>
        </div>

        {/* Código de pedido */}
        <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '2rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Tu código de seguimiento
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-brand-dark)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            {orderCode}
          </div>
          <button
            onClick={handleCopy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.125rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: copied ? '#f0fdf4' : 'white', color: copied ? '#059669' : '#6b7280', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Copy size={13} />
            {copied ? '¡Copiado!' : 'Copiar código'}
          </button>
        </div>

        {/* Info de próximos pasos */}
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '1rem', padding: '1.25rem 1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ fontWeight: '700', color: '#92400e', fontSize: '0.875rem', marginBottom: '0.75rem' }}>¿Qué sigue?</div>
          {[
            'Revisa tu correo — te enviamos los detalles del pedido.',
            'La administradora revisará tu pedido pronto.',
            'Recibirás otra notificación cuando sea aceptado.',
            'El pago se coordina por WhatsApp al confirmar.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: i < 3 ? '0.5rem' : 0 }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '9999px', backgroundColor: '#fde68a', color: '#92400e', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
              <span style={{ fontSize: '0.82rem', color: '#b45309', lineHeight: '1.5' }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/rastrear', { state: { code: orderCode } })}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', backgroundColor: 'var(--color-brand-dark)', color: 'white', border: 'none', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            <Search size={15} /> Rastrear pedido
          </button>
          <button
            onClick={() => navigate('/catalogo')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', backgroundColor: 'white', color: '#4b5563', border: '1px solid #e5e7eb', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            <ShoppingBag size={15} /> Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

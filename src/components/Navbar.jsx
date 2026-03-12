import { ShoppingBag, User, Store, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const { count } = useCart();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      backgroundColor: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #f3f4f6',
      boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>

          {/* Logo — clic lleva al inicio */}
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{
              backgroundColor: 'var(--color-pastel-yellow)',
              padding: '0.625rem',
              borderRadius: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Store size={22} color="var(--color-brand-dark)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-brand-dark)', letterSpacing: '-0.02em' }}>
                Patito Crochet
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '500', letterSpacing: '0.05em' }}>
                Tejidos con diseño
              </div>
            </div>
          </div>

          {/* Nav links centrales */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {[
              { label: 'Inicio',      path: '/' },
              { label: 'Catálogo',    path: '/catalogo' },
              { label: 'Rastrear',   path: '/rastrear' },
              ...(currentUser ? [{ label: 'Mis pedidos', path: '/mis-pedidos' }] : [])
            ].map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = 'var(--color-brand-dark)'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Carrito */}
            <button
              onClick={() => navigate('/carrito')}
              title="Ver carrito"
              style={{ padding: '0.6rem', borderRadius: '9999px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', position: 'relative', color: '#6b7280', transition: 'all 0.2s' }}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', backgroundColor: 'var(--color-brand-dark)', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
              {count === 0 && (
                <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: 'var(--color-pastel-pink)', borderRadius: '9999px', border: '2px solid white' }} />
              )}
            </button>

            {/* Botón Admin — solo visible para admins */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                title="Panel de administración"
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--color-pastel-yellow)',
                  backgroundColor: 'rgba(255,243,199,0.4)',
                  cursor: 'pointer',
                  color: 'var(--color-brand-dark)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,243,199,0.8)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,243,199,0.4)'}
              >
                <LayoutDashboard size={14} /> Admin
              </button>
            )}

            {/* Login / Perfil */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.375rem 0.625rem', borderRadius: '9999px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                {/* Foto + nombre → ir al perfil */}
                <button
                  onClick={() => navigate('/perfil')}
                  title="Mi perfil"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <img
                    src={currentUser.photoURL}
                    alt="Perfil"
                    referrerPolicy="no-referrer"
                    style={{ width: '28px', height: '28px', borderRadius: '9999px' }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Hola, {currentUser.displayName?.split(' ')[0]}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  style={{ padding: '0.25rem', borderRadius: '9999px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#9ca3af', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.25rem', borderRadius: '9999px',
                  backgroundColor: 'transparent', border: '1px solid #e5e7eb',
                  cursor: 'pointer', color: '#4b5563',
                  fontSize: '0.875rem', fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.borderColor = 'var(--color-pastel-pink)'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
              >
                <User size={15} />
                <span>Acceder</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

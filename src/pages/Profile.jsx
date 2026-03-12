import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, CheckCircle, ShoppingBag, Edit3 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      setProfile({
        name:    data.name    || currentUser.displayName || '',
        email:   data.email   || currentUser.email || '',
        phone:   data.phone   || '',
        address: data.address || ''
      });
    } catch {
      setProfile({
        name:  currentUser?.displayName || '',
        email: currentUser?.email || '',
        phone: '', address: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
        body: JSON.stringify({ name: profile.name, phone: profile.phone, address: profile.address })
      });
      if (!res.ok) throw new Error('Error al guardar');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  const labelStyle = {
    display: 'block', fontSize: '0.8rem', fontWeight: '600',
    color: '#4b5563', marginBottom: '0.4rem', letterSpacing: '0.01em'
  };
  const inputStyle = {
    width: '100%', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
    borderRadius: '0.75rem', padding: '0.75rem 1rem 0.75rem 2.75rem',
    fontSize: '0.9rem', color: 'var(--color-brand-dark)', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-brand-dark)', marginBottom: '0.4rem' }}>
            Mi perfil
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Guarda tus datos para no tener que ingresarlos en cada pedido.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Cargando...</div>
        ) : (
          <>
            {/* Avatar */}
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #f3f4f6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '9999px', backgroundColor: 'var(--color-brand-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem', fontWeight: '700', color: 'white', fontFamily: 'var(--font-display)' }}>
                {profile.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-brand-dark)' }}>{profile.name || 'Sin nombre'}</div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.15rem' }}>{profile.email}</div>
              </div>
            </div>

            {/* Form */}
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '1.75rem', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Edit3 size={16} color="var(--color-brand-dark)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', color: 'var(--color-brand-dark)', margin: 0 }}>
                  Datos de contacto
                </h2>
              </div>

              <form onSubmit={handleSave}>
                {/* Nombre */}
                <div style={{ marginBottom: '1.125rem' }}>
                  <label style={labelStyle}>Nombre completo</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={inputStyle}
                      value={profile.name}
                      onChange={e => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Tu nombre"
                      required
                      onFocus={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 0 0 3px rgba(255,243,199,0.5)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    <User size={15} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Email (solo lectura) */}
                <div style={{ marginBottom: '1.125rem' }}>
                  <label style={labelStyle}>Correo electrónico</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={{ ...inputStyle, backgroundColor: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }}
                      value={profile.email}
                      readOnly
                    />
                    <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.3rem' }}>No se puede cambiar el correo.</div>
                </div>

                {/* Teléfono */}
                <div style={{ marginBottom: '1.125rem' }}>
                  <label style={labelStyle}>Teléfono / WhatsApp</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={inputStyle}
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+593 99 999 9999"
                      onFocus={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 0 0 3px rgba(255,243,199,0.5)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    <Phone size={15} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Dirección */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Referencia o dirección (opcional)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={inputStyle}
                      value={profile.address}
                      onChange={e => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Barrio, ciudad..."
                      onFocus={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 0 0 3px rgba(255,243,199,0.5)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    <MapPin size={15} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {error && (
                  <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.825rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                {saved && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#166534', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={15} /> Datos guardados correctamente
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: saving ? '#e5e7eb' : 'var(--color-brand-dark)', color: saving ? '#9ca3af' : 'white', border: 'none', borderRadius: '9999px', padding: '0.875rem', fontWeight: '700', fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                >
                  <Save size={16} />
                  {saving ? 'Guardando...' : 'Guardar datos'}
                </button>
              </form>
            </div>

            {/* Acceso rápido a pedidos */}
            <button
              onClick={() => navigate('/mis-pedidos')}
              style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'white', color: 'var(--color-brand-dark)', border: '1px solid #e5e7eb', borderRadius: '9999px', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ShoppingBag size={15} /> Ver mis pedidos
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

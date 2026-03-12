import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Settings,
  Plus, Edit2, Trash2, CheckCircle, XCircle, Clock,
  TrendingUp, Users, LogOut, ChevronRight, AlertCircle, Upload, ToggleLeft, ToggleRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Sub-componente: Sidebar ────────────────────────────────────────────────
const Sidebar = ({ active, setActive, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products',  label: 'Productos',  icon: Package },
    { id: 'orders',    label: 'Pedidos',    icon: ShoppingBag },
    { id: 'settings',  label: 'Configuración', icon: Settings },
  ];

  return (
    <aside style={{
      width: '240px', flexShrink: 0,
      backgroundColor: 'var(--color-brand-dark)',
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', color: 'white', fontSize: '1.1rem' }}>
          Patito Crochet
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem', letterSpacing: '0.06em' }}>
          PANEL ADMIN
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: '0.625rem', border: 'none',
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontSize: '0.875rem', fontWeight: isActive ? '600' : '400',
                marginBottom: '0.25rem', textAlign: 'left', transition: 'all 0.2s'
              }}
              onMouseOver={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
              onMouseOut={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1rem', borderRadius: '0.625rem', border: 'none',
            backgroundColor: 'transparent', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.08)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

// ─── Sub-componente: Dashboard ──────────────────────────────────────────────
const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STATUS_LABELS = {
    pending:     { label: 'Pendiente',      color: '#d97706', bg: '#fffbeb' },
    accepted:    { label: 'Aceptado',       color: '#059669', bg: '#f0fdf4' },
    in_progress: { label: 'En elaboración', color: '#2563eb', bg: '#eff6ff' },
    on_hold:     { label: 'En espera',      color: '#7c3aed', bg: '#faf5ff' },
    completed:   { label: 'Completado',     color: '#059669', bg: '#f0fdf4' },
    rejected:    { label: 'Rechazado',      color: '#dc2626', bg: '#fff5f5' },
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Cargando...</div>;

  const cards = [
    { label: 'Pedidos activos',  value: stats?.orders?.active ?? 0,            icon: ShoppingBag, color: 'var(--color-pastel-blue)' },
    { label: 'Productos',        value: stats?.products?.total ?? 0,            icon: Package,     color: 'var(--color-pastel-yellow)' },
    { label: 'Completados',      value: stats?.orders?.completed ?? 0,          icon: CheckCircle, color: '#d2e3c6' },
    { label: 'Ingresos (USD)',   value: `$${(stats?.revenue?.total ?? 0).toFixed(2)}`, icon: TrendingUp, color: 'var(--color-pastel-pink)' },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '1.75rem' }}>
        Resumen
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</div>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="var(--color-brand-dark)" />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '700', color: 'var(--color-brand-dark)' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Estado de pedidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { key: 'pending',     label: 'Pendientes'     },
          { key: 'accepted',    label: 'Aceptados'      },
          { key: 'in_progress', label: 'En elaboración' },
          { key: 'on_hold',     label: 'En espera'      },
          { key: 'completed',   label: 'Completados'    },
          { key: 'rejected',    label: 'Rechazados'     },
        ].map(({ key, label }) => {
          const st = STATUS_LABELS[key];
          return (
            <div key={key} style={{ backgroundColor: st.bg, borderRadius: '0.75rem', padding: '0.875rem 1rem', border: `1px solid ${st.color}22` }}>
              <div style={{ fontSize: '0.7rem', color: st.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '800', color: st.color }}>{stats?.orders?.[key] ?? 0}</div>
            </div>
          );
        })}
      </div>

      {/* Últimos pedidos */}
      {stats?.recentOrders?.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-brand-dark)' }}>
            Últimos pedidos
          </div>
          {stats.recentOrders.map((order, i) => {
            const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            return (
              <div key={i} style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < stats.recentOrders.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                <div>
                  <code style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-brand-dark)', backgroundColor: '#f3f4f6', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>{order.orderCode}</code>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>{order.clientData?.name || '—'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600', color: st.color, backgroundColor: st.bg, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>{st.label}</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-brand-dark)', fontSize: '0.875rem' }}>${Number(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Sub-componente: Gestión de Productos ───────────────────────────────────
const ProductsPanel = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'amigurumis', price: '', description: '', imageUrl: '', stock: 99, available: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const categories = ['amigurumis', 'ramos', 'llaveros', 'gorros', 'otros'];

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imageUrl;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', imageFile);
    try {
      const res = await fetch(`${API_URL}/api/uploads/product-image`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd
      });
      const data = await res.json();
      return data.imageUrl ? `${API_URL}${data.imageUrl}` : form.imageUrl;
    } catch { return form.imageUrl; }
    finally { setUploading(false); }
  };

  const fetchProducts = async () => {
    try {
      // Usar el endpoint de admin para ver TODOS los productos (activos e inactivos)
      const res = await fetch(`${API_URL}/api/products/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  // ← Este useEffect estaba faltando — carga los productos al entrar a la sección
  useEffect(() => { fetchProducts(); }, []);

  const openNew = () => {
    setForm({ name: '', category: 'amigurumis', price: '', description: '', imageUrl: '', stock: 99, available: true });
    setImageFile(null); setImagePreview('');
    setEditProduct(null); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: p.price, description: p.description, imageUrl: p.imageUrl || '', stock: p.stock ?? 99, available: p.available ?? true });
    setImageFile(null); setImagePreview(p.imageUrl || '');
    setEditProduct(p); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalImageUrl = await uploadImage();
      const method = editProduct ? 'PUT' : 'POST';
      const url = editProduct ? `${API_URL}/api/products/${editProduct._id}` : `${API_URL}/api/products`;
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), imageUrl: finalImageUrl })
      });
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setShowForm(false);
      fetchProducts();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchProducts();
  };

  const toggleAvailable = async (p) => {
    await fetch(`${API_URL}/api/products/${p._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...p, available: !p.available })
    });
    fetchProducts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-brand-dark)' }}>
          Productos
        </h2>
        <button onClick={openNew} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--color-brand-dark)', color: 'white',
          border: 'none', borderRadius: '9999px', padding: '0.625rem 1.25rem',
          fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer'
        }}>
          <Plus size={15} /> Nuevo producto
        </button>
      </div>

      {/* Formulario inline */}
      {showForm && (
        <div style={{
          backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem',
          border: '1px solid #f3f4f6', marginBottom: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--color-brand-dark)' }}>
            {editProduct ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <form onSubmit={handleSubmit}>
            {/* Upload imagen */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Imagen del producto</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden', backgroundColor: '#f9fafb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {imagePreview ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} /> : <Upload size={20} color="#9ca3af" />}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>
                    <Upload size={13} /> Subir foto desde mi equipo
                    <input type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
                  </label>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.5rem' }}>JPG, PNG o WebP · máx. 5MB</div>
                  <input style={{ ...inputStyle, fontSize: '0.78rem' }} value={form.imageUrl} onChange={e => { setForm({ ...form, imageUrl: e.target.value }); setImagePreview(e.target.value); }} placeholder="O pega una URL de imagen..." />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><label style={labelStyle}>Nombre</label><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ej: Amigurumi Pikachu" /></div>
              <div><label style={labelStyle}>Categoría</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Precio (USD)</label><input style={inputStyle} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="25" /></div>
              <div><label style={labelStyle}>Stock (unidades)</label><input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Descripción</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe el producto..." />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <button type="button" onClick={() => setForm({ ...form, available: !form.available })} style={{ padding: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {form.available ? <ToggleRight size={28} color="#059669" /> : <ToggleLeft size={28} color="#9ca3af" />}
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: form.available ? '#059669' : '#9ca3af' }}>{form.available ? 'Disponible para ordenar' : 'No disponible'}</span>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={btnSecStyle}>Cancelar</button>
              <button type="submit" disabled={uploading} style={{ ...btnPrimStyle, opacity: uploading ? 0.7 : 1 }}>
                {uploading ? 'Subiendo imagen...' : editProduct ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de productos */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem' }}>Cargando...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f3f4f6' }}>No hay productos aún. Crea el primero.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {products.map(p => (
            <div key={p._id} style={{ backgroundColor: 'white', borderRadius: '0.875rem', padding: '1rem 1.25rem', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '0.625rem', border: '1px solid #f3f4f6', overflow: 'hidden', backgroundColor: '#f9fafb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} /> : <Package size={18} color="#d1d5db" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'var(--color-brand-dark)', fontSize: '0.9rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.3rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ textTransform: 'capitalize' }}>{p.category}</span> · <span>${p.price} USD</span> · <span>Stock: {p.stock ?? '∞'}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: '600', color: p.available !== false ? '#059669' : '#dc2626', backgroundColor: p.available !== false ? '#f0fdf4' : '#fff5f5', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                    {p.available !== false ? 'Disponible' : 'Agotado'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => toggleAvailable(p)} title="Cambiar disponibilidad" style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', color: p.available !== false ? '#059669' : '#9ca3af' }}>
                  {p.available !== false ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => openEdit(p)} style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', color: '#6b7280', display: 'flex' }}><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(p._id)} style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #fee2e2', backgroundColor: '#fff5f5', cursor: 'pointer', color: '#ef4444', display: 'flex' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Sub-componente: Gestión de Pedidos ─────────────────────────────────────
const OrdersPanel = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const STATUS_LABELS = {
    pending:     { label: 'Pendiente',      color: '#f59e0b', bg: '#fffbeb' },
    accepted:    { label: 'Aceptado',       color: '#10b981', bg: '#f0fdf4' },
    rejected:    { label: 'Rechazado',      color: '#ef4444', bg: '#fff5f5' },
    in_progress: { label: 'En elaboración', color: '#3b82f6', bg: '#eff6ff' },
    completed:   { label: 'Completado',     color: '#6b7280', bg: '#f9fafb' },
    on_hold:     { label: 'En espera',      color: '#8b5cf6', bg: '#faf5ff' },
  };

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders?limit=100`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : (Array.isArray(data) ? data : []));
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const data = await res.json();
        alert('Error al actualizar: ' + data.error);
      }
    } catch (err) {
      alert('Error de red al actualizar estado');
    }
  };

  const btnAction = (label, color, bg, border, onClick) => (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', borderRadius: '9999px', border: `1px solid ${border}`, backgroundColor: bg, color, fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' }}>
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-brand-dark)' }}>
          Pedidos
        </h2>
        <button onClick={fetchOrders} style={{ ...btnSecStyle, fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Actualizar</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem' }}>Cargando...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f3f4f6' }}>
          <ShoppingBag size={40} color="#e5e7eb" style={{ marginBottom: '1rem' }} />
          <div style={{ color: '#9ca3af', fontWeight: '500' }}>No hay pedidos todavía</div>
          <div style={{ color: '#d1d5db', fontSize: '0.8rem', marginTop: '0.5rem' }}>Los pedidos de tus clientes aparecerán aquí</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            const isExpanded = expanded === order._id;
            const client = order.clientData || {};
            const finalStates = ['completed', 'rejected'];
            const isFinal = finalStates.includes(order.status);

            return (
              <div key={order._id} style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                {/* Cabecera del pedido */}
                <div
                  style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}
                  onClick={() => setExpanded(isExpanded ? null : order._id)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <code style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-brand-dark)', backgroundColor: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '6px', letterSpacing: '0.04em' }}>
                        {order.orderCode}
                      </code>
                      <span style={{ fontSize: '0.72rem', fontWeight: '600', color: st.color, backgroundColor: st.bg, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                        {st.label}
                      </span>
                      {order.requiresAdminValidation && (
                        <span style={{ fontSize: '0.7rem', color: '#d97706', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: '600' }}>
                          Validación requerida
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                      <strong style={{ color: '#374151' }}>{client.name || 'Sin nombre'}</strong>
                      {client.email && <> · {client.email}</>}
                      {client.phone && <> · {client.phone}</>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-brand-dark)' }}>
                      ${Number(order.totalAmount || 0).toFixed(2)} USD
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{isExpanded ? '▲ Ocultar' : '▼ Ver detalle'}</div>
                  </div>
                </div>

                {/* Detalle expandido */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '1.25rem 1.5rem', backgroundColor: '#fafafa' }}>
                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>Productos del pedido</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {order.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', border: '1px solid #f3f4f6' }}>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-brand-dark)' }}>{item.name}</div>
                                {item.customDetails && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.customDetails}</div>}
                              </div>
                              <div style={{ fontWeight: '700', color: 'var(--color-brand-dark)', fontSize: '0.875rem', flexShrink: 0 }}>
                                ${Number(item.price).toFixed(2)} × {item.quantity || 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notas del cliente */}
                    {client.address && (
                      <div style={{ marginBottom: '1.25rem', backgroundColor: 'white', borderRadius: '0.625rem', padding: '0.75rem', border: '1px solid #f3f4f6', fontSize: '0.825rem', color: '#4b5563' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Notas del cliente</div>
                        {client.address}
                      </div>
                    )}

                    {/* Botones de acción */}
                    {!isFinal && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {order.status === 'pending' && <>
                          {btnAction('✓ Aceptar',     '#059669', '#f0fdf4', '#6ee7b7', () => updateStatus(order._id, 'accepted'))}
                          {btnAction('⏸ En espera',   '#7c3aed', '#faf5ff', '#c4b5fd', () => updateStatus(order._id, 'on_hold'))}
                          {btnAction('✕ Rechazar',    '#dc2626', '#fff5f5', '#fca5a5', () => updateStatus(order._id, 'rejected'))}
                        </>}
                        {order.status === 'accepted' && <>
                          {btnAction('🧶 En elaboración', '#2563eb', '#eff6ff', '#93c5fd', () => updateStatus(order._id, 'in_progress'))}
                          {btnAction('✕ Rechazar',        '#dc2626', '#fff5f5', '#fca5a5', () => updateStatus(order._id, 'rejected'))}
                        </>}
                        {order.status === 'in_progress' && <>
                          {btnAction('✓ Completar', '#059669', '#f0fdf4', '#6ee7b7', () => updateStatus(order._id, 'completed'))}
                        </>}
                        {order.status === 'on_hold' && <>
                          {btnAction('✓ Aceptar',  '#059669', '#f0fdf4', '#6ee7b7', () => updateStatus(order._id, 'accepted'))}
                          {btnAction('✕ Rechazar', '#dc2626', '#fff5f5', '#fca5a5', () => updateStatus(order._id, 'rejected'))}
                        </>}
                      </div>
                    )}
                    {isFinal && (
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>Este pedido está en estado final.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Sub-componente: Configuración ──────────────────────────────────────────
const SettingsPanel = ({ token }) => {
  const [config, setConfig] = useState({ hourlyRate: 100, baseMaterialCost: 50, weeklyCapacityHours: 40 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/config`).then(r => r.json()).then(d => { if (d.hourlyRate) setConfig(d); }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(config)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-brand-dark)', marginBottom: '1.75rem' }}>
        Configuración del Cotizador IA
      </h2>

      <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #f3f4f6', maxWidth: '540px' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.75rem', lineHeight: '1.6' }}>
          Estos valores son los que usa el cotizador de IA para calcular el precio de los pedidos personalizados. Todos en <strong>dólares americanos (USD)</strong>.
        </p>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Tarifa por hora (USD)</label>
            <input style={inputStyle} type="number" value={config.hourlyRate} onChange={e => setConfig({ ...config, hourlyRate: Number(e.target.value) })} required />
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>Cuánto cobras por cada hora de trabajo</div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Costo base de materiales (USD)</label>
            <input style={inputStyle} type="number" value={config.baseMaterialCost} onChange={e => setConfig({ ...config, baseMaterialCost: Number(e.target.value) })} required />
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>Costo mínimo de hilos y materiales por pedido</div>
          </div>
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={labelStyle}>Capacidad semanal (horas disponibles)</label>
            <input style={inputStyle} type="number" value={config.weeklyCapacityHours} onChange={e => setConfig({ ...config, weeklyCapacityHours: Number(e.target.value) })} required />
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>Cuántas horas por semana puedes dedicar a pedidos</div>
          </div>
          <button type="submit" style={btnPrimStyle}>
            {saved ? '¡Guardado!' : 'Guardar configuración'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Estilos reutilizables ───────────────────────────────────────────────────
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.4rem', letterSpacing: '0.02em' };
const inputStyle = {
  width: '100%', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '0.625rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem',
  color: 'var(--color-brand-dark)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
};
const btnPrimStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
  backgroundColor: 'var(--color-brand-dark)', color: 'white',
  border: 'none', borderRadius: '9999px', padding: '0.625rem 1.5rem',
  fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer'
};
const btnSecStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
  backgroundColor: 'white', color: '#4b5563',
  border: '1px solid #e5e7eb', borderRadius: '9999px', padding: '0.625rem 1.5rem',
  fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer'
};

// ─── Componente Principal: AdminPanel ───────────────────────────────────────
const AdminPanel = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Redirigir si no es admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/');
    } else if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard token={currentUser.token} />;
      case 'products':  return <ProductsPanel token={currentUser.token} />;
      case 'orders':    return <OrdersPanel token={currentUser.token} />;
      case 'settings':  return <SettingsPanel token={currentUser.token} />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar active={activeSection} setActive={setActiveSection} onLogout={logout} />

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Admin <ChevronRight size={13} /> {activeSection}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={currentUser.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: '32px', height: '32px', borderRadius: '9999px' }} />
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ fontWeight: '600', color: 'var(--color-brand-dark)' }}>{currentUser.displayName?.split(' ')[0]}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.72rem' }}>Administradora</div>
            </div>
          </div>
        </div>

        {renderSection()}
      </main>
    </div>
  );
};

export default AdminPanel;

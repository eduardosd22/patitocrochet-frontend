import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import QuoteChat from './pages/QuoteChat';
import AdminPanel from './pages/AdminPanel';
import OrderTracking from './pages/OrderTracking';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Número de WhatsApp (con código de país, sin +)
const WA_NUMBER = '593992869283';
const WA_MESSAGE = encodeURIComponent('¡Hola! Vi sus productos en la tienda online y me gustaría hacer una consulta 🧶');

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="font-sans text-brand-text bg-brand-light min-h-screen">
            <Navbar />
            <main>
              <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/catalogo"     element={<Catalog />} />
                <Route path="/cotizar"      element={<QuoteChat />} />
                <Route path="/admin"        element={<AdminPanel />} />
                <Route path="/rastrear"     element={<OrderTracking />} />
                <Route path="/carrito"      element={<Cart />} />
                <Route path="/confirmacion" element={<OrderConfirmation />} />
                <Route path="/mis-pedidos"  element={<MyOrders />} />
                <Route path="/perfil"       element={<Profile />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
              </Routes>
            </main>

            {/* ── Botón flotante de WhatsApp ── */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Escríbenos por WhatsApp"
              style={{
                position: 'fixed',
                bottom: '1.75rem',
                right: '1.75rem',
                width: '56px',
                height: '56px',
                borderRadius: '9999px',
                backgroundColor: '#25d366',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
                zIndex: 9999,
                transition: 'transform 0.2s, box-shadow 0.2s',
                textDecoration: 'none',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.6)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)'; }}
            >
              {/* Ícono SVG de WhatsApp */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="white">
                <path d="M16.003 2.667C8.639 2.667 2.667 8.639 2.667 16c0 2.359.618 4.573 1.697 6.503L2.667 29.333l6.997-1.672A13.267 13.267 0 0 0 16.003 29.333C23.361 29.333 29.333 23.361 29.333 16S23.361 2.667 16.003 2.667zm0 24C13.9 26.667 11.94 26.08 10.293 25.08l-.4-.24-4.147.99.99-4.04-.267-.413A10.593 10.593 0 0 1 5.333 16c0-5.88 4.787-10.667 10.667-10.667S26.667 10.12 26.667 16 21.88 26.667 16 26.667zm5.853-7.96c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.347-.493-2.573-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.387.48-.58.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.253-.613-.52-.52-.72-.533-.187-.013-.4-.013-.613-.013-.214 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.453 4.827.76.333 1.36.533 1.827.68.76.24 1.453.213 2 .133.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
              </svg>
            </a>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

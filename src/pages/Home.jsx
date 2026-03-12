import { useEffect } from 'react';
import { ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Inicio | Patito Crochet";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Descubre nuestro catálogo de amigurumis y ramos creados con dedicación, o utiliza nuestro cotizador inteligente para personalizar tu pedido en segundos.");
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-brand-light)' }}>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        padding: '6rem 1.5rem 8rem'
      }}>
        {/* Decoración circular pastel */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-150px',
          width: '600px', height: '600px',
          backgroundColor: 'var(--color-pastel-yellow)',
          borderRadius: '9999px',
          filter: 'blur(80px)',
          opacity: 0.35,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-150px',
          width: '400px', height: '400px',
          backgroundColor: 'var(--color-pastel-blue)',
          borderRadius: '9999px',
          filter: 'blur(80px)',
          opacity: 0.35,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(254,199,215,0.2)',
            border: '1px solid rgba(254,199,215,0.6)',
            fontSize: '0.8rem', fontWeight: '600',
            color: 'var(--color-brand-dark)',
            marginBottom: '2rem'
          }}>
            <Sparkles size={14} color="#db2777" />
            Nueva experiencia de cotización inteligente
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
            color: 'var(--color-brand-dark)',
            marginBottom: '1.5rem'
          }}>
            Tejidos artesanales<br />
            <span style={{
              background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              hechos a tu medida
            </span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            maxWidth: '580px',
            margin: '0 auto 2.5rem',
            fontSize: '1.1rem',
            color: '#6b7280',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            Descubre nuestro catálogo de amigurumis y ramos creados con dedicación,
            o utiliza nuestro cotizador inteligente para personalizar tu pedido en segundos.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ fontSize: '1rem' }} onClick={() => navigate('/catalogo')}>
              Ver Catálogo
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" style={{ fontSize: '1rem' }} onClick={() => navigate('/rastrear')}>
              Rastrear Pedido
            </button>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section style={{
        padding: '4rem 1.5rem',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>

          {/* Feature 1 */}
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(210,227,198,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <ShieldCheck size={24} color="#059669" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-brand-dark)' }}>
              Pago Seguro
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
              Anticipos protegidos para garantizar tu obra de arte.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ textAlign: 'center', padding: '2rem', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255,243,199,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Sparkles size={24} color="#b45309" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-brand-dark)' }}>
              Pedidos Personalizados
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
              Diseña con nuestro cotizador inteligente y visualiza estimaciones al vuelo.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(254,199,215,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Clock size={24} color="#be185d" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-brand-dark)' }}>
              Gestión de Tiempos
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
              Bloqueo de agenda inteligente para cumplir puntualmente con cada pedido.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;

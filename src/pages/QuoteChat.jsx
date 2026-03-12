import { useState, useRef, useEffect } from 'react';
import { Send, ShoppingBag, ArrowLeft, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Ejemplos de preguntas para guiar al usuario
const SUGGESTIONS = [
  'Quiero un amigurumi de Pikachu de 20cm',
  'Ramo de 5 flores tejidas en colores pasteles',
  'Llavero de un oso pequeño con nombre',
  'Gorro tejido con orejas de gato',
];

const QuoteChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: '¡Hola! Soy el cotizador de Patito Crochet. Cuéntame qué tienes en mente: el personaje, tamaño aproximado, colores o cualquier detalle especial, y te daré un precio estimado al instante.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput('');
    setQuoteResult(null);

    // Añadir mensaje del usuario
    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: userText })
      });

      const data = await res.json();

      if (data.estimatedPrice) {
        // Respuesta exitosa del cotizador
        const assistantMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          text: data.justification || 'Aquí está tu cotización estimada:',
          quote: {
            price: data.estimatedPrice,
            hours: data.estimatedHours,
            requiresValidation: data.requiresAdminValidation
          }
        };
        setMessages(prev => [...prev, assistantMsg]);
        setQuoteResult(data);
      } else {
        throw new Error('Respuesta inesperada');
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Lo siento, hubo un problema al procesar tu solicitud. Por favor intenta de nuevo con más detalles sobre lo que deseas.',
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-brand-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* Header del Chat */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #f3f4f6',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        position: 'sticky',
        top: '72px',
        zIndex: 30
      }}>
        <button
          onClick={() => navigate('/catalogo')}
          style={{
            padding: '0.5rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#6b7280'
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{
          width: '40px', height: '40px',
          backgroundColor: 'var(--color-brand-dark)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Bot size={20} color="var(--color-pastel-yellow)" />
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '0.95rem',
            color: 'var(--color-brand-dark)'
          }}>
            Cotizador Patito Crochet
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{
              width: '7px', height: '7px',
              borderRadius: '9999px',
              backgroundColor: '#10b981',
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>En línea</span>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div style={{
        flex: 1,
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '1.5rem 1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>

        {/* Sugerencias de inicio */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#4b5563',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '500'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-pastel-pink)'; e.currentTarget.style.backgroundColor = '#fff5f8'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = 'white'; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Mensajes */}
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '32px', height: '32px', flexShrink: 0,
              borderRadius: '9999px',
              backgroundColor: msg.role === 'user' ? 'var(--color-pastel-pink)' : 'var(--color-brand-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {msg.role === 'user'
                ? <User size={16} color="var(--color-brand-dark)" />
                : <Bot size={16} color="var(--color-pastel-yellow)" />
              }
            </div>

            {/* Burbuja */}
            <div style={{ maxWidth: '75%' }}>
              <div style={{
                backgroundColor: msg.role === 'user' ? 'var(--color-brand-dark)' : 'white',
                color: msg.role === 'user' ? 'white' : 'var(--color-brand-dark)',
                padding: '0.875rem 1.125rem',
                borderRadius: msg.role === 'user' ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                border: msg.role === 'user' ? 'none' : '1px solid #f3f4f6',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                {msg.text}
              </div>

              {/* Tarjeta de cotización */}
              {msg.quote && (
                <div style={{ marginTop: '0.75rem', backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Cotización estimada
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-brand-dark)' }}>
                      ${Number(msg.quote.price).toFixed(2)}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600' }}>USD</span>
                  </div>
                  {msg.quote.requiresValidation && (
                    <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', fontSize: '0.78rem', color: '#92400e', marginBottom: '1rem' }}>
                      Este precio es una estimación. La administradora confirmará el costo final antes de iniciar tu pedido.
                    </div>
                  )}
                  <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--color-pastel-yellow)', color: 'var(--color-brand-dark)', border: 'none', borderRadius: '9999px', padding: '0.75rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ShoppingBag size={15} /> Agregar cotización al carrito
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Indicador de "escribiendo..." */}
        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{
              width: '32px', height: '32px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-brand-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bot size={16} color="var(--color-pastel-yellow)" />
            </div>
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
              padding: '0.875rem 1.25rem',
              display: 'flex', gap: '0.35rem', alignItems: 'center'
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: '7px', height: '7px',
                  borderRadius: '9999px',
                  backgroundColor: '#d1d5db',
                  display: 'inline-block',
                  animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} style={{ paddingBottom: '1.5rem' }} />
      </div>

      {/* Input del chat — fijo en la parte inferior */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'rgba(247,250,252,0.95)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #f3f4f6',
        padding: '1rem 1.5rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe lo que quieres... (Ej: amigurumi de Kirby de 15cm en colores pasteles)"
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '0.875rem 1.125rem',
              fontSize: '0.9rem',
              color: 'var(--color-brand-dark)',
              outline: 'none',
              resize: 'none',
              overflowY: 'hidden',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.5'
            }}
            onFocus={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 0 0 3px rgba(255,243,199,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: '44px', height: '44px', flexShrink: 0,
              borderRadius: '12px',
              backgroundColor: input.trim() && !loading ? 'var(--color-brand-dark)' : '#e5e7eb',
              color: input.trim() && !loading ? 'white' : '#9ca3af',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </div>
        <div style={{ maxWidth: '800px', margin: '0.5rem auto 0', fontSize: '0.72rem', color: '#9ca3af', textAlign: 'center' }}>
          El precio es una estimación. La administradora confirmará el costo final antes de iniciar tu pedido.
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default QuoteChat;

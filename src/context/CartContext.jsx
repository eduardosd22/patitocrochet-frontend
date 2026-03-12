import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => {
    setCartItems(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
  };

  const removeItem = (cartId) => {
    setCartItems(prev => prev.filter(i => i.cartId !== cartId));
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const count = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

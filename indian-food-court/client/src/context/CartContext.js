import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [restaurantId, setRestaurantId] = useState(() => localStorage.getItem('cartRestaurant'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (restaurantId) localStorage.setItem('cartRestaurant', restaurantId);
    else localStorage.removeItem('cartRestaurant');
  }, [restaurantId]);

  const addToCart = (item, rId) => {
    if (restaurantId && restaurantId !== rId) {
      if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) return;
      setCartItems([{ ...item, quantity: 1 }]);
      setRestaurantId(rId);
      return;
    }
    setRestaurantId(rId);
    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const updated = prev.map(i => i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      if (updated.length === 0) setRestaurantId(null);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');
  };

  const getItemQuantity = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryCharge + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, restaurantId, addToCart, removeFromCart, clearCart,
      getItemQuantity, subtotal, deliveryCharge, tax, total, totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

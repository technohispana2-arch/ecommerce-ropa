import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === action.payload._id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
              ? { ...item, qty: item.qty + action.payload.qty }
              : item
          ),
          total: state.total + action.payload.price * action.payload.qty,
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price * action.payload.qty,
      };
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find((i) => i.cartId === action.payload);
      return {
        ...state,
        items: state.items.filter((i) => i.cartId !== action.payload),
        total: state.total - item.price * item.qty,
      };
    }
    case 'UPDATE_QTY': {
      const items = state.items.map((item) => {
        if (item.cartId === action.payload.cartId) {
          const diff = action.payload.qty - item.qty;
          return { ...item, qty: action.payload.qty };
        }
        return item;
      });
      const item = state.items.find((i) => i.cartId === action.payload.cartId);
      const diff = action.payload.qty - item.qty;
      return {
        ...state,
        items,
        total: state.total + item.price * diff,
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, qty, size, color) => {
    const cartId = `${product._id}-${size}-${color}`;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        cartId,
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        color,
        qty,
      },
    });
  };

  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartId });
  };

  const updateQty = (cartId, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { cartId, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

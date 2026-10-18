import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  Product,
  ProductVariant,
  SelectedAddOn,
  FulfillmentType,
  DeliveryZone,
} from '../types/index.ts';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    product: Product,
    variant: ProductVariant | undefined,
    selectedAddOns: SelectedAddOn[],
    quantity: number,
    specialInstructions?: string
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'daddys_kitchen_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (
    product: Product,
    variant: ProductVariant | undefined,
    selectedAddOns: SelectedAddOn[],
    quantity: number,
    specialInstructions?: string
  ) => {
    let unitPrice = Number(product.base_price);
    if (variant) {
      unitPrice += Number(variant.price_adjustment);
    }
    for (const addon of selectedAddOns) {
      unitPrice += Number(addon.price_adjustment);
    }

    const qty = Math.max(1, quantity);
    const lineTotal = unitPrice * qty;

    // Generate unique composite key
    const addOnIds = selectedAddOns.map((a) => a.optionId).sort().join(',');
    const itemKey = `${product.id}_${variant?.id || 'none'}_${addOnIds}_${specialInstructions || ''}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => {
        const itemAddOnIds = item.selectedAddOns.map((a) => a.optionId).sort().join(',');
        const existingKey = `${item.product.id}_${item.variant?.id || 'none'}_${itemAddOnIds}_${item.specialInstructions || ''}`;
        return existingKey === itemKey;
      });

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + qty;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          lineTotal: updated[existingIdx].unitPrice * newQty,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        product,
        variant,
        selectedAddOns,
        specialInstructions,
        quantity: qty,
        unitPrice,
        lineTotal,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              lineTotal: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const deliveryFee =
    fulfillmentType === 'delivery' && selectedZone ? selectedZone.delivery_fee : 0;

  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        totalAmount,
        fulfillmentType,
        setFulfillmentType,
        selectedZone,
        setSelectedZone,
        tableNumber,
        setTableNumber,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

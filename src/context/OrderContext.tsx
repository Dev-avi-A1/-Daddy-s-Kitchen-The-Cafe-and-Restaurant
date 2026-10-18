import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types/index.ts';

interface OrderContextType {
  recentTrackingTokens: string[];
  addTrackingToken: (token: string) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  isTrackingModalOpen: boolean;
  openTrackingModal: (token?: string) => void;
  closeTrackingModal: () => void;
  activeTokenToTrack: string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const TRACKING_TOKENS_STORAGE_KEY = 'daddys_kitchen_tracking_tokens';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentTrackingTokens, setRecentTrackingTokens] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(TRACKING_TOKENS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [activeTokenToTrack, setActiveTokenToTrack] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(TRACKING_TOKENS_STORAGE_KEY, JSON.stringify(recentTrackingTokens));
    } catch (e) {
      console.warn('Failed to store tracking tokens:', e);
    }
  }, [recentTrackingTokens]);

  const addTrackingToken = (token: string) => {
    if (!token) return;
    setRecentTrackingTokens((prev) => {
      const filtered = prev.filter((t) => t !== token);
      return [token, ...filtered].slice(0, 5); // store last 5
    });
  };

  const openTrackingModal = (token?: string) => {
    if (token) {
      setActiveTokenToTrack(token);
    } else if (recentTrackingTokens.length > 0) {
      setActiveTokenToTrack(recentTrackingTokens[0]);
    }
    setIsTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setIsTrackingModalOpen(false);
  };

  return (
    <OrderContext.Provider
      value={{
        recentTrackingTokens,
        addTrackingToken,
        activeOrder,
        setActiveOrder,
        isTrackingModalOpen,
        openTrackingModal,
        closeTrackingModal,
        activeTokenToTrack,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

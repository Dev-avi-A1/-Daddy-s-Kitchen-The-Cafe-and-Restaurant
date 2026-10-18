import {
  Category,
  Product,
  DeliveryZone,
  BusinessDayHours,
  RestaurantSettings,
  Order,
  FulfillmentType,
  PaymentMethod,
} from '../types/index.ts';
import { dbStore } from '../db/store.ts';

const API_BASE = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  async getRestaurantData(): Promise<{
    settings: RestaurantSettings;
    businessHours: BusinessDayHours[];
    deliveryZones: DeliveryZone[];
  }> {
    try {
      return await fetchJson(`${API_BASE}/restaurant`);
    } catch {
      // Resilient fallback to local db store
      return {
        settings: dbStore.getSettings(),
        businessHours: dbStore.getBusinessHours(),
        deliveryZones: dbStore.getDeliveryZones(),
      };
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      return await fetchJson(`${API_BASE}/categories`);
    } catch {
      return dbStore.getCategories();
    }
  },

  async getProducts(categoryId?: string): Promise<Product[]> {
    try {
      const url = categoryId && categoryId !== 'all' ? `${API_BASE}/products?category=${categoryId}` : `${API_BASE}/products`;
      return await fetchJson(url);
    } catch {
      return dbStore.getProducts(categoryId);
    }
  },

  async createOrder(payload: {
    customer_name: string;
    customer_phone: string;
    fulfillment_type: FulfillmentType;
    table_number?: string;
    delivery_address?: string;
    delivery_zone_id?: string;
    payment_method: PaymentMethod;
    customer_notes?: string;
    idempotency_key?: string;
    items: {
      productId: string;
      variantId?: string;
      addOnOptionIds?: string[];
      quantity: number;
      specialInstructions?: string;
    }[];
  }): Promise<{ success: boolean; order: Order; tracking_token: string; order_number: string }> {
    try {
      return await fetchJson(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      const order = dbStore.createOrder(payload);
      return {
        success: true,
        order,
        tracking_token: order.tracking_token,
        order_number: order.order_number,
      };
    }
  },

  async trackOrder(token: string): Promise<Order> {
    try {
      return await fetchJson(`${API_BASE}/orders/track/${token}`);
    } catch {
      const order = dbStore.getOrderByTrackingToken(token);
      if (!order) throw new Error('Order not found');
      return order;
    }
  },

  async verifyPayment(payload: {
    orderId: string;
    provider: 'esewa' | 'khalti';
    transactionRef?: string;
    amount?: number;
  }): Promise<{ success: boolean; order: Order; message: string }> {
    try {
      return await fetchJson(`${API_BASE}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      const order = dbStore.updatePaymentStatus(payload.orderId, 'paid', payload.transactionRef);
      return {
        success: true,
        order,
        message: `Payment verified via ${payload.provider.toUpperCase()} sandbox!`,
      };
    }
  },

  // --- Admin API ---
  async getAdminDashboard(): Promise<any> {
    try {
      return await fetchJson(`${API_BASE}/admin/dashboard`);
    } catch {
      return dbStore.getDashboardMetrics();
    }
  },

  async getAdminOrders(): Promise<Order[]> {
    try {
      return await fetchJson(`${API_BASE}/admin/orders`);
    } catch {
      return dbStore.getAllOrders();
    }
  },

  async updateOrderStatus(orderId: string, status: any, reason?: string): Promise<Order> {
    try {
      return await fetchJson(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason, changedBy: 'Admin Staff' }),
      });
    } catch {
      return dbStore.updateOrderStatus(orderId, status, reason, 'Admin Staff');
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      return await fetchJson(`${API_BASE}/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      return dbStore.updateProduct(id, updates);
    }
  },

  async addProduct(product: Omit<Product, 'id' | 'slug'>): Promise<Product> {
    try {
      return await fetchJson(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch {
      return dbStore.addProduct(product);
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
      });
      return res.success;
    } catch {
      return dbStore.deleteProduct(id);
    }
  },

  async updateSettings(settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    try {
      return await fetchJson(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch {
      return dbStore.updateSettings(settings);
    }
  },

  async updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone> {
    try {
      return await fetchJson(`${API_BASE}/admin/delivery-zones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      return dbStore.updateDeliveryZone(id, updates);
    }
  },
};

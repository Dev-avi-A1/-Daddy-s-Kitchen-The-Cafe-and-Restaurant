export type FulfillmentType = 'delivery' | 'takeaway' | 'dine_in';

export type PaymentMethod = 'cash_on_delivery' | 'cash_on_pickup' | 'esewa' | 'khalti';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price_adjustment: number;
  is_available: boolean;
}

export interface AddOnOption {
  id: string;
  groupId: string;
  name: string;
  price_adjustment: number;
  is_available: boolean;
}

export interface AddOnGroup {
  id: string;
  name: string;
  min_selections: number;
  max_selections: number;
  is_required: boolean;
  options: AddOnOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  image_url: string;
  is_vegetarian: boolean;
  allergen_information?: string;
  preparation_time_minutes: number;
  is_available: boolean;
  is_featured: boolean;
  spice_level?: 'Mild' | 'Medium' | 'Spicy' | 'Nepali Fire';
  variants?: ProductVariant[];
  addOnGroups?: AddOnGroup[];
}

export interface SelectedAddOn {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price_adjustment: number;
}

export interface CartItem {
  id: string; // unique item id in cart
  product: Product;
  variant?: ProductVariant;
  selectedAddOns: SelectedAddOn[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  delivery_fee: number;
  minimum_order_amount: number;
  estimated_delivery_minutes: number;
  is_active: boolean;
}

export interface BusinessDayHours {
  day_of_week: string; // 'Monday', 'Tuesday', etc.
  opening_time: string; // '10:00 AM'
  closing_time: string; // '10:00 PM'
  is_closed: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  currency: string;
  timezone: string;
  minimum_order_general: number;
  tax_rate_percent: number;
  is_online_ordering_enabled: boolean;
  payment_gateways: {
    cash_enabled: boolean;
    esewa_enabled: boolean;
    khalti_enabled: boolean;
    esewa_sandbox_mode: boolean;
    khalti_sandbox_mode: boolean;
    esewa_merchant_code?: string;
    khalti_public_key?: string;
  };
  announcement?: string;
}

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  specialInstructions?: string;
  addOns: SelectedAddOn[];
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  changed_at: string;
  reason?: string;
  changed_by?: string;
}

export interface Order {
  id: string;
  order_number: string;
  tracking_token: string;
  customer_name: string;
  customer_phone: string;
  fulfillment_type: FulfillmentType;
  table_number?: string;
  delivery_address?: string;
  delivery_zone_id?: string;
  delivery_zone_name?: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  customer_notes?: string;
  items: OrderItemSnapshot[];
  status_history: OrderStatusHistoryItem[];
  created_at: string;
  updated_at: string;
  idempotency_key?: string;
}

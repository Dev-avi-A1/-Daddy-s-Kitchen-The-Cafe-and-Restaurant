import {
  Category,
  Product,
  DeliveryZone,
  BusinessDayHours,
  RestaurantSettings,
  Order,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  FulfillmentType,
  OrderItemSnapshot,
  SelectedAddOn,
} from '../types/index.ts';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_BUSINESS_HOURS,
  INITIAL_SETTINGS,
} from './initialData.ts';

// In-memory persistent database engine (server authoritative with transactional integrity)
class RestaurantDatabase {
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private deliveryZones: DeliveryZone[] = [...INITIAL_DELIVERY_ZONES];
  private businessHours: BusinessDayHours[] = [...INITIAL_BUSINESS_HOURS];
  private settings: RestaurantSettings = { ...INITIAL_SETTINGS };
  private orders: Order[] = [];
  private idempotencyStore = new Map<string, Order>();
  private orderSequence = 1040;

  constructor() {
    this.seedDemoOrders();
  }

  private seedDemoOrders() {
    // Seed 2 initial recent orders so admin dashboard is active upon first launch
    const demoOrder1Id = 'ord_' + Math.random().toString(36).substring(2, 9);
    const demoOrder1: Order = {
      id: demoOrder1Id,
      order_number: '#DK-1038',
      tracking_token: 'trk_demo_kalikanagar_882',
      customer_name: 'Bikash Shrestha',
      customer_phone: '+977 9847012345',
      fulfillment_type: 'delivery',
      delivery_address: 'Opposite Horizon College, Kalikanagar',
      delivery_zone_id: 'zone_kalikanagar',
      delivery_zone_name: 'Kalikanagar & 12 Teacher’s Path',
      order_status: 'preparing',
      payment_status: 'paid',
      payment_method: 'esewa',
      subtotal: 600,
      delivery_fee: 50,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 650,
      currency: 'NPR',
      customer_notes: 'Please bring extra spicy achar with momos.',
      items: [
        {
          id: 'item_1',
          productId: 'prod_chicken_momo',
          productName: "Daddy's Signature Chicken Momo",
          variantName: 'Steamed (10 pcs)',
          unitPrice: 240,
          quantity: 1,
          lineTotal: 240,
          addOns: [
            {
              groupId: 'grp_momo_sauces',
              groupName: 'Extra Dips & Sauces',
              optionId: 'opt_extra_achar',
              optionName: 'Extra Sesame Tomato Achar',
              price_adjustment: 30,
            },
          ],
        },
        {
          id: 'item_2',
          productId: 'prod_crispy_burger',
          productName: "Daddy's Crispy Chicken Burger",
          variantName: 'Classic Single Burger',
          unitPrice: 360,
          quantity: 1,
          lineTotal: 360,
          addOns: [],
        },
      ],
      status_history: [
        { status: 'pending', changed_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(), reason: 'Order placed via Web App' },
        { status: 'confirmed', changed_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(), reason: 'Confirmed by kitchen dispatch' },
        { status: 'preparing', changed_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), reason: 'Chef started preparation' },
      ],
      created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    };

    const demoOrder2Id = 'ord_' + Math.random().toString(36).substring(2, 9);
    const demoOrder2: Order = {
      id: demoOrder2Id,
      order_number: '#DK-1039',
      tracking_token: 'trk_demo_table_771',
      customer_name: 'Sunita Gurung',
      customer_phone: '+977 9812345678',
      fulfillment_type: 'dine_in',
      table_number: 'Table 4',
      order_status: 'ready',
      payment_status: 'paid',
      payment_method: 'khalti',
      subtotal: 520,
      delivery_fee: 0,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 520,
      currency: 'NPR',
      items: [
        {
          id: 'item_3',
          productId: 'prod_chicken_chowmein',
          productName: 'Nepali Street Chicken Chowmein',
          variantName: 'Regular Portion',
          unitPrice: 260,
          quantity: 2,
          lineTotal: 520,
          addOns: [],
        },
      ],
      status_history: [
        { status: 'pending', changed_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), reason: 'Dine-In QR scanned order' },
        { status: 'confirmed', changed_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(), reason: 'Kitchen confirmed' },
        { status: 'preparing', changed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), reason: 'Wok cooking' },
        { status: 'ready', changed_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), reason: 'Plated for Table 4' },
      ],
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    };

    this.orders.push(demoOrder1, demoOrder2);
  }

  // --- Public Read Operations ---
  public getCategories(): Category[] {
    return [...this.categories].sort((a, b) => a.display_order - b.display_order);
  }

  public getProducts(categoryId?: string): Product[] {
    if (categoryId && categoryId !== 'all') {
      return this.products.filter((p) => p.categoryId === categoryId);
    }
    return [...this.products];
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getDeliveryZones(): DeliveryZone[] {
    return this.deliveryZones.filter((z) => z.is_active);
  }

  public getAllDeliveryZones(): DeliveryZone[] {
    return [...this.deliveryZones];
  }

  public getBusinessHours(): BusinessDayHours[] {
    return [...this.businessHours];
  }

  public getSettings(): RestaurantSettings {
    return { ...this.settings };
  }

  public getOrderByTrackingToken(token: string): Order | undefined {
    return this.orders.find((o) => o.tracking_token === token);
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  public getAllOrders(): Order[] {
    return [...this.orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // --- Transactional Order Processing ---
  public createOrder(payload: {
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
  }): Order {
    // 1. Idempotency Check
    if (payload.idempotency_key && this.idempotencyStore.has(payload.idempotency_key)) {
      return this.idempotencyStore.get(payload.idempotency_key)!;
    }

    if (!payload.items || payload.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    if (!payload.customer_name?.trim()) {
      throw new Error('Customer name is required');
    }

    if (!payload.customer_phone?.trim()) {
      throw new Error('Customer phone number is required');
    }

    // 2. Validate Items & Snapshot Prices
    let computedSubtotal = 0;
    const snapshottedItems: OrderItemSnapshot[] = [];

    for (const rawItem of payload.items) {
      const product = this.products.find((p) => p.id === rawItem.productId);
      if (!product) {
        throw new Error(`Product with ID "${rawItem.productId}" not found.`);
      }
      if (!product.is_available) {
        throw new Error(`Product "${product.name}" is currently sold out.`);
      }

      let unitPrice = Number(product.base_price);
      let variantName: string | undefined = undefined;

      if (rawItem.variantId) {
        const variant = product.variants?.find((v) => v.id === rawItem.variantId);
        if (variant) {
          if (!variant.is_available) {
            throw new Error(`Variant "${variant.name}" for "${product.name}" is unavailable.`);
          }
          variantName = variant.name;
          unitPrice += Number(variant.price_adjustment);
        }
      }

      const selectedAddOns: SelectedAddOn[] = [];
      if (rawItem.addOnOptionIds && rawItem.addOnOptionIds.length > 0 && product.addOnGroups) {
        for (const optId of rawItem.addOnOptionIds) {
          for (const grp of product.addOnGroups) {
            const foundOpt = grp.options.find((o) => o.id === optId);
            if (foundOpt) {
              selectedAddOns.push({
                groupId: grp.id,
                groupName: grp.name,
                optionId: foundOpt.id,
                optionName: foundOpt.name,
                price_adjustment: Number(foundOpt.price_adjustment),
              });
              unitPrice += Number(foundOpt.price_adjustment);
            }
          }
        }
      }

      const qty = Math.max(1, Math.floor(rawItem.quantity || 1));
      const lineTotal = unitPrice * qty;
      computedSubtotal += lineTotal;

      snapshottedItems.push({
        id: 'item_' + Math.random().toString(36).substring(2, 9),
        productId: product.id,
        productName: product.name,
        variantName,
        unitPrice,
        quantity: qty,
        lineTotal,
        specialInstructions: rawItem.specialInstructions?.trim() || undefined,
        addOns: selectedAddOns,
      });
    }

    // 3. Delivery Fee and Zone Validation
    let deliveryFee = 0;
    let zoneName: string | undefined = undefined;

    if (payload.fulfillment_type === 'delivery') {
      if (!payload.delivery_zone_id) {
        throw new Error('Please select a Butwal delivery zone.');
      }
      const zone = this.deliveryZones.find((z) => z.id === payload.delivery_zone_id);
      if (!zone || !zone.is_active) {
        throw new Error('Selected delivery zone is currently unavailable.');
      }
      if (computedSubtotal < zone.minimum_order_amount) {
        throw new Error(
          `Minimum order for ${zone.name} is NPR ${zone.minimum_order_amount}. Your current subtotal is NPR ${computedSubtotal}.`
        );
      }
      deliveryFee = zone.delivery_fee;
      zoneName = zone.name;
    } else if (payload.fulfillment_type === 'dine_in') {
      if (!payload.table_number?.trim()) {
        throw new Error('Please specify your table number for Dine-In ordering.');
      }
    }

    const discountAmount = 0;
    const taxAmount = 0; // Menu prices in Nepal are gross inclusive
    const totalAmount = computedSubtotal + deliveryFee - discountAmount + taxAmount;

    // 4. Generate Unique Identifiers
    this.orderSequence += 1;
    const orderNumber = `#DK-${this.orderSequence}`;
    const randomHex = Math.random().toString(36).substring(2, 10);
    const trackingToken = `trk_${Date.now()}_${randomHex}`;
    const newOrderId = 'ord_' + Math.random().toString(36).substring(2, 10);

    const initialPaymentStatus: PaymentStatus =
      payload.payment_method === 'cash_on_delivery' || payload.payment_method === 'cash_on_pickup'
        ? 'pending'
        : 'pending'; // digital wallets are marked paid via sandbox callback/endpoint

    const nowIso = new Date().toISOString();

    const newOrder: Order = {
      id: newOrderId,
      order_number: orderNumber,
      tracking_token: trackingToken,
      customer_name: payload.customer_name.trim(),
      customer_phone: payload.customer_phone.trim(),
      fulfillment_type: payload.fulfillment_type,
      table_number: payload.table_number?.trim(),
      delivery_address: payload.delivery_address?.trim(),
      delivery_zone_id: payload.delivery_zone_id,
      delivery_zone_name: zoneName,
      order_status: 'pending',
      payment_status: initialPaymentStatus,
      payment_method: payload.payment_method,
      subtotal: computedSubtotal,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      currency: 'NPR',
      customer_notes: payload.customer_notes?.trim() || undefined,
      items: snapshottedItems,
      status_history: [
        {
          status: 'pending',
          changed_at: nowIso,
          reason: `Order placed via Web App (${payload.fulfillment_type.toUpperCase()})`,
        },
      ],
      created_at: nowIso,
      updated_at: nowIso,
      idempotency_key: payload.idempotency_key,
    };

    this.orders.unshift(newOrder);

    if (payload.idempotency_key) {
      this.idempotencyStore.set(payload.idempotency_key, newOrder);
    }

    return newOrder;
  }

  // --- Order Status & Payment Updates ---
  public updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    reason?: string,
    changedBy: string = 'Staff'
  ): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.order_status = newStatus;
    order.updated_at = new Date().toISOString();
    order.status_history.push({
      status: newStatus,
      changed_at: order.updated_at,
      reason: reason || `Status updated to ${newStatus}`,
      changed_by: changedBy,
    });

    return order;
  }

  public updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    transactionRef?: string
  ): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.payment_status = paymentStatus;
    order.updated_at = new Date().toISOString();
    order.status_history.push({
      status: order.order_status,
      changed_at: order.updated_at,
      reason: `Payment marked as ${paymentStatus.toUpperCase()} (Ref: ${transactionRef || 'Sandbox'})`,
      changed_by: 'Payment Gateway',
    });

    return order;
  }

  // --- Admin Menu CRUD Operations ---
  public addProduct(product: Omit<Product, 'id' | 'slug'>): Product {
    const id = 'prod_' + Math.random().toString(36).substring(2, 9);
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + id.slice(-4);

    const newProd: Product = {
      ...product,
      id,
      slug,
      base_price: Number(product.base_price),
      preparation_time_minutes: Number(product.preparation_time_minutes || 15),
    };

    this.products.unshift(newProd);
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Product ${id} not found`);
    }

    this.products[idx] = {
      ...this.products[idx],
      ...updates,
      base_price: updates.base_price !== undefined ? Number(updates.base_price) : this.products[idx].base_price,
    };
    return this.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.products.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- Admin Settings & Delivery Zones ---
  public updateSettings(updates: Partial<RestaurantSettings>): RestaurantSettings {
    this.settings = {
      ...this.settings,
      ...updates,
      payment_gateways: {
        ...this.settings.payment_gateways,
        ...(updates.payment_gateways || {}),
      },
    };
    return { ...this.settings };
  }

  public updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): DeliveryZone {
    const idx = this.deliveryZones.findIndex((z) => z.id === id);
    if (idx === -1) {
      throw new Error(`Delivery zone ${id} not found`);
    }
    this.deliveryZones[idx] = { ...this.deliveryZones[idx], ...updates };
    return this.deliveryZones[idx];
  }

  public addDeliveryZone(zone: Omit<DeliveryZone, 'id'>): DeliveryZone {
    const id = 'zone_' + Math.random().toString(36).substring(2, 9);
    const newZone: DeliveryZone = { ...zone, id };
    this.deliveryZones.push(newZone);
    return newZone;
  }

  // --- Admin Operational KPIs ---
  public getDashboardMetrics() {
    const allOrders = this.orders;
    const grossSales = allOrders
      .filter((o) => o.order_status !== 'cancelled')
      .reduce((acc, o) => acc + o.total_amount, 0);

    const paidOrders = allOrders.filter((o) => o.payment_status === 'paid');
    const netSales = paidOrders.reduce((acc, o) => acc + o.total_amount, 0);

    const pendingOrdersCount = allOrders.filter((o) => o.order_status === 'pending').length;
    const preparingOrdersCount = allOrders.filter((o) => o.order_status === 'preparing').length;
    const completedOrdersCount = allOrders.filter((o) => o.order_status === 'delivered').length;

    const averageOrderValue =
      allOrders.length > 0 ? Math.round(grossSales / Math.max(1, allOrders.length)) : 0;

    return {
      totalOrders: allOrders.length,
      pendingOrdersCount,
      preparingOrdersCount,
      completedOrdersCount,
      grossSales,
      netSales,
      averageOrderValue,
      currency: 'NPR',
    };
  }
}

export const dbStore = new RestaurantDatabase();

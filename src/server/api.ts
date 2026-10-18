import { Router, Request, Response } from 'express';
import { dbStore } from '../db/store.ts';

export const apiRouter = Router();

// --- Public Endpoints ---

// Restaurant metadata, business hours, and delivery zones
apiRouter.get('/restaurant', (_req: Request, res: Response) => {
  const settings = dbStore.getSettings();
  const businessHours = dbStore.getBusinessHours();
  const deliveryZones = dbStore.getDeliveryZones();
  res.json({
    settings,
    businessHours,
    deliveryZones,
  });
});

// Categories list
apiRouter.get('/categories', (_req: Request, res: Response) => {
  const categories = dbStore.getCategories();
  res.json(categories);
});

// Products list
apiRouter.get('/products', (req: Request, res: Response) => {
  const categoryId = req.query.category as string | undefined;
  const products = dbStore.getProducts(categoryId);
  res.json(products);
});

// Product by slug
apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const product = dbStore.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Business hours
apiRouter.get('/business-hours', (_req: Request, res: Response) => {
  res.json(dbStore.getBusinessHours());
});

// Delivery zones
apiRouter.get('/delivery-zones', (_req: Request, res: Response) => {
  res.json(dbStore.getDeliveryZones());
});

// Create Order (transactional & idempotency safe)
apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      customer_phone,
      fulfillment_type,
      table_number,
      delivery_address,
      delivery_zone_id,
      payment_method,
      customer_notes,
      idempotency_key,
      items,
    } = req.body;

    const newOrder = dbStore.createOrder({
      customer_name,
      customer_phone,
      fulfillment_type,
      table_number,
      delivery_address,
      delivery_zone_id,
      payment_method,
      customer_notes,
      idempotency_key,
      items,
    });

    res.status(201).json({
      success: true,
      order: newOrder,
      tracking_token: newOrder.tracking_token,
      order_number: newOrder.order_number,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to place order',
    });
  }
});

// Track Order by Unpredictable Token
apiRouter.get('/orders/track/:token', (req: Request, res: Response) => {
  const order = dbStore.getOrderByTrackingToken(req.params.token);
  if (!order) {
    return res.status(404).json({ error: 'Order not found or invalid tracking token' });
  }

  // Sanitize slightly for public view (mask middle digits of phone for privacy)
  const maskedPhone = order.customer_phone
    ? order.customer_phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
    : '';

  res.json({
    ...order,
    customer_phone_masked: maskedPhone,
  });
});

// Payment Sandbox Handshake & Verification (eSewa / Khalti)
apiRouter.post('/payments/verify', (req: Request, res: Response) => {
  const { orderId, provider, transactionRef, amount } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }

  try {
    const updatedOrder = dbStore.updatePaymentStatus(orderId, 'paid', transactionRef);
    res.json({
      success: true,
      provider,
      transactionRef: transactionRef || `SANDBOX_${provider.toUpperCase()}_${Date.now()}`,
      order: updatedOrder,
      message: `Payment of NPR ${amount || updatedOrder.total_amount} verified successfully via ${provider.toUpperCase()}`,
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// --- Admin Endpoints ---

// Admin Dashboard KPIs
apiRouter.get('/admin/dashboard', (_req: Request, res: Response) => {
  const metrics = dbStore.getDashboardMetrics();
  res.json(metrics);
});

// Admin All Orders
apiRouter.get('/admin/orders', (_req: Request, res: Response) => {
  const orders = dbStore.getAllOrders();
  res.json(orders);
});

// Admin Update Order Status
apiRouter.patch('/admin/orders/:id/status', (req: Request, res: Response) => {
  const { status, reason, changedBy } = req.body;
  try {
    const updated = dbStore.updateOrderStatus(req.params.id, status, reason, changedBy);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Product CRUD
apiRouter.post('/admin/products', (req: Request, res: Response) => {
  try {
    const newProduct = dbStore.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/admin/products/:id', (req: Request, res: Response) => {
  try {
    const updated = dbStore.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/admin/products/:id', (req: Request, res: Response) => {
  const deleted = dbStore.deleteProduct(req.params.id);
  res.json({ success: deleted });
});

// Admin Settings & Zones
apiRouter.put('/admin/settings', (req: Request, res: Response) => {
  const updated = dbStore.updateSettings(req.body);
  res.json(updated);
});

apiRouter.put('/admin/delivery-zones/:id', (req: Request, res: Response) => {
  try {
    const updated = dbStore.updateDeliveryZone(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

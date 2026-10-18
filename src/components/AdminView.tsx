import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sliders,
  DollarSign,
  Clock,
  Printer,
  CheckCircle2,
  ChefHat,
  XCircle,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Search,
  Bike,
  QrCode,
  AlertCircle,
  Shield,
  Save,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Lock,
  Users,
  Key,
  Mail,
} from 'lucide-react';
import {
  Order,
  OrderStatus,
  Product,
  Category,
  DeliveryZone,
  RestaurantSettings,
  BusinessDayHours,
} from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdminViewProps {
  onBackToStore: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBackToStore }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'zones' | 'settings' | 'guide'>('orders');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Order Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedTicketOrder, setSelectedTicketOrder] = useState<Order | null>(null);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(250);
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdPrepTime, setNewProdPrepTime] = useState(15);
  const [newProdIsVeg, setNewProdIsVeg] = useState(false);
  const [newProdSpiceLevel, setNewProdSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy' | 'Nepali Fire'>('Medium');
  const [newProdImageUrl, setNewProdImageUrl] = useState('/src/assets/images/signature_steamed_momos_1791791178718.jpg');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, categoriesData, productsData, restaurantData, metricsData] =
        await Promise.all([
          api.getAdminOrders(),
          api.getCategories(),
          api.getProducts('all'),
          api.getRestaurantData(),
          api.getAdminDashboard(),
        ]);

      setOrders(ordersData);
      setCategories(categoriesData);
      setProducts(productsData);
      setDeliveryZones(restaurantData.deliveryZones);
      setSettings(restaurantData.settings);
      setDashboardMetrics(metricsData);
      if (categoriesData.length > 0 && !newProdCategory) {
        setNewProdCategory(categoriesData[0].id);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Status Updater
  const handleUpdateStatus = async (orderId: string, status: OrderStatus, reason?: string) => {
    try {
      await api.updateOrderStatus(orderId, status, reason);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // Product Creator
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdCategory) return;

    try {
      await api.addProduct({
        categoryId: newProdCategory,
        name: newProdName.trim(),
        description: newProdDescription.trim() || 'Freshly prepared at Daddy’s Kitchen.',
        base_price: Number(newProdPrice),
        image_url: newProdImageUrl,
        is_vegetarian: newProdIsVeg,
        preparation_time_minutes: Number(newProdPrepTime),
        is_available: true,
        is_featured: false,
        spice_level: newProdSpiceLevel,
      });

      setIsAddProductOpen(false);
      setNewProdName('');
      setNewProdDescription('');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  // Product Toggle
  const handleToggleProductAvailability = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { is_available: !product.is_available });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_available: !p.is_available } : p))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    }
  };

  // Product Deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Delivery Zone Fee Update
  const handleUpdateZone = async (zone: DeliveryZone, newFee: number, newMin: number) => {
    try {
      await api.updateDeliveryZone(zone.id, {
        delivery_fee: newFee,
        minimum_order_amount: newMin,
      });
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update delivery zone');
    }
  };

  // Settings Save
  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      alert('Business settings updated successfully!');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    const matchesSearch =
      !orderSearchQuery ||
      o.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer_phone.includes(orderSearchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16">
      {/* Admin Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-700 text-white flex items-center justify-center font-bold text-sm">
              DK
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base block leading-tight">
                Daddy's Kitchen · Admin Operations
              </span>
              <span className="text-[10px] text-amber-400 block font-mono">
                Butwal, Nepal · Asia/Kathmandu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* KPI Strip */}
        {dashboardMetrics && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Total Orders
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
                {dashboardMetrics.totalOrders}
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">Recorded in DB</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                Pending Dispatch
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 mt-1">
                {dashboardMetrics.pendingOrdersCount}
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">Awaiting confirmation</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wider block">
                Kitchen Active
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-orange-700 mt-1">
                {dashboardMetrics.preparingOrdersCount}
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">Currently cooking</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Gross Volume (NPR)
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
                NPR {dashboardMetrics.grossSales}
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">Net Paid: NPR {dashboardMetrics.netSales}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Avg Order Value
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
                NPR {dashboardMetrics.averageOrderValue}
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">Calculated per ticket</span>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-stone-200 w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'menu'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Menu & Pricing ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'zones'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Butwal Delivery Zones</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'settings'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hours & Gateway Config</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'guide'
                ? 'bg-orange-700 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Staff Manual & PDF Guide</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search order #, customer or phone..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                        statusFilter === st
                          ? 'bg-orange-700 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Orders Table / Cards */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500 text-xs">
                  No orders match the current filter.
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3 hover:border-stone-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-stone-950 text-base">
                          {ord.order_number}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            ord.order_status === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : ord.order_status === 'preparing'
                              ? 'bg-orange-100 text-orange-900'
                              : ord.order_status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-900'
                              : ord.order_status === 'cancelled'
                              ? 'bg-red-100 text-red-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {ord.order_status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {new Date(ord.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTicketOrder(ord)}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Kitchen Ticket</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Meta details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                          Customer
                        </span>
                        <span className="font-bold text-stone-900">{ord.customer_name}</span>
                        <span className="text-stone-600 block">{ord.customer_phone}</span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                          Fulfillment & Location
                        </span>
                        <span className="font-bold text-stone-900 capitalize">
                          {ord.fulfillment_type === 'delivery'
                            ? `Delivery: ${ord.delivery_zone_name || 'Butwal'}`
                            : ord.fulfillment_type === 'dine_in'
                            ? `Dine-In (${ord.table_number || 'Table'})`
                            : 'Takeaway Counter Pickup'}
                        </span>
                        {ord.delivery_address && (
                          <span className="text-stone-600 block truncate">{ord.delivery_address}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                          Payment & Total
                        </span>
                        <span className="font-mono font-bold text-stone-950 text-sm">
                          NPR {ord.total_amount}
                        </span>
                        <span className="text-stone-600 block uppercase font-mono text-[11px]">
                          {ord.payment_status} via {ord.payment_method.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Order Items snapshot list */}
                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/80 text-xs space-y-1">
                      {ord.items.map((it) => (
                        <div key={it.id} className="flex justify-between text-stone-800">
                          <span>
                            <strong>{it.quantity}x</strong> {it.productName}{' '}
                            {it.variantName && (
                              <span className="text-stone-500 text-[11px]">({it.variantName})</span>
                            )}
                            {it.addOns && it.addOns.length > 0 && (
                              <span className="text-stone-500 text-[10px] ml-1">
                                [+{it.addOns.map((a) => a.optionName).join(', ')}]
                              </span>
                            )}
                            {it.specialInstructions && (
                              <span className="text-stone-500 italic text-[10px] block">
                                "{it.specialInstructions}"
                              </span>
                            )}
                          </span>
                          <span className="font-mono tabular-nums font-semibold">
                            NPR {it.lineTotal}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
                      <span className="text-stone-400 text-[11px] font-semibold">Change Status:</span>

                      {ord.order_status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'confirmed', 'Accepted by kitchen')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                        >
                          Confirm Order
                        </button>
                      )}

                      {(ord.order_status === 'pending' || ord.order_status === 'confirmed') && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'preparing', 'Chef started preparation')}
                          className="px-3 py-1.5 bg-orange-700 hover:bg-orange-800 text-white rounded-lg font-bold flex items-center gap-1"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Start Cooking</span>
                        </button>
                      )}

                      {ord.order_status === 'preparing' && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              ord.id,
                              ord.fulfillment_type === 'delivery' ? 'out_for_delivery' : 'ready',
                              'Food ready for dispatch'
                            )
                          }
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>
                            {ord.fulfillment_type === 'delivery' ? 'Dispatch Rider' : 'Mark Ready'}
                          </span>
                        </button>
                      )}

                      {(ord.order_status === 'ready' || ord.order_status === 'out_for_delivery') && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'delivered', 'Order fulfilled to customer')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete Order</span>
                        </button>
                      )}

                      {ord.order_status !== 'delivered' && ord.order_status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            const reason = prompt('Enter cancellation reason:');
                            if (reason) handleUpdateStatus(ord.id, 'cancelled', reason);
                          }}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-red-50 text-red-600 rounded-lg font-semibold ml-auto"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MENU & PRICING */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Menu Items & Offerings</h3>
                <p className="text-xs text-stone-500">
                  Manage dishes, base pricing (NPR), prep times, and availability tags.
                </p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className={`bg-white rounded-xl border p-4 space-y-3 ${
                    prod.is_available ? 'border-stone-200' : 'border-stone-200 bg-stone-50/80 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-stone-900 truncate">{prod.name}</h4>
                      <span className="text-[11px] text-stone-500 block">
                        Category: {categories.find((c) => c.id === prod.categoryId)?.name || 'General'}
                      </span>
                      <div className="text-sm font-mono font-bold text-stone-950 mt-1">
                        NPR {prod.base_price}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2">{prod.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <button
                      onClick={() => handleToggleProductAvailability(prod)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                        prod.is_available
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {prod.is_available ? 'Available (In Stock)' : 'Unavailable (Sold Out)'}
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BUTWAL DELIVERY ZONES */}
        {activeTab === 'zones' && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Butwal Delivery Zones & Tariffs</h3>
              <p className="text-xs text-stone-500">
                Configure delivery fees and minimum order amounts per neighborhood.
              </p>
            </div>

            <div className="divide-y divide-stone-200">
              {deliveryZones.map((zone) => (
                <div key={zone.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{zone.name}</h4>
                    <span className="text-stone-500 text-[11px] block">{zone.description}</span>
                    <span className="text-stone-400 text-[10px] block font-mono">
                      Estimated Delivery: {zone.estimated_delivery_minutes} minutes
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-[10px] text-stone-500 block uppercase font-semibold">
                        Fee (NPR)
                      </label>
                      <input
                        type="number"
                        value={zone.delivery_fee}
                        onChange={(e) =>
                          handleUpdateZone(zone, Number(e.target.value), zone.minimum_order_amount)
                        }
                        className="w-20 p-1.5 border border-stone-300 rounded font-mono text-center font-bold text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block uppercase font-semibold">
                        Min. Order (NPR)
                      </label>
                      <input
                        type="number"
                        value={zone.minimum_order_amount}
                        onChange={(e) =>
                          handleUpdateZone(zone, zone.delivery_fee, Number(e.target.value))
                        }
                        className="w-24 p-1.5 border border-stone-300 rounded font-mono text-center font-bold text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS & PAYMENT CONFIG */}
        {activeTab === 'settings' && settings && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-6">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Restaurant & Payment Operations</h3>
              <p className="text-xs text-stone-500">
                Configure business metadata, payment provider sandboxes, and announcements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">
                  Promotional Banner Announcement
                </label>
                <input
                  type="text"
                  value={settings.announcement || ''}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
            </div>

            {/* Payment Gateway Toggles */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                Payment Gateways & Wallets
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Cash on Delivery</span>
                    <input
                      type="checkbox"
                      checked={settings.payment_gateways.cash_enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment_gateways: {
                            ...settings.payment_gateways,
                            cash_enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">Allow customers to pay physical cash</p>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">eSewa Wallet</span>
                    <input
                      type="checkbox"
                      checked={settings.payment_gateways.esewa_enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment_gateways: {
                            ...settings.payment_gateways,
                            esewa_enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-[#60BB46] rounded"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-700 block font-semibold">
                    Sandbox Test Mode: Active (EPAYTEST)
                  </span>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">Khalti Wallet</span>
                    <input
                      type="checkbox"
                      checked={settings.payment_gateways.khalti_enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment_gateways: {
                            ...settings.payment_gateways,
                            khalti_enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-[#5C2D91] rounded"
                    />
                  </div>
                  <span className="text-[10px] text-purple-700 block font-semibold">
                    Sandbox Test Mode: Active
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="py-2.5 px-5 bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>
          </div>
        )}

        {/* TAB 5: STAFF MANUAL & PDF GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            {/* Guide Header Banner */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-800">
                  <FileText className="w-4 h-4" />
                  <span>Official Operations Manual & System Guide</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  Daddy’s Kitchen Staff Operations & Account Setup
                </h3>
                <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                  Comprehensive documentation for setting up Google/Gmail authentication, role permissions, eSewa/Khalti digital wallets, and daily kitchen shift procedures.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-98"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print / Save as PDF Guide</span>
                </button>
              </div>
            </div>

            {/* Print-Ready Content Wrapper */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8 text-stone-900 leading-relaxed shadow-2xs">
              {/* Document Header for Print */}
              <div className="border-b border-stone-200 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-stone-950">
                      DADDY’S KITCHEN — THE CAFE & RESTAURANT
                    </h2>
                    <p className="text-xs text-stone-600 mt-0.5">
                      12 Teacher’s Path, Kalikanagar, Butwal 32907, Nepal · Tel: +977 980-2672008
                    </p>
                  </div>
                  <div className="text-right text-xs text-stone-500 font-mono">
                    <div>Doc Ref: DK-MANUAL-v1.0</div>
                    <div>Owner: kingavibk@gmail.com</div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: GMAIL & GOOGLE AUTHENTICATION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-orange-800 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                  <Key className="w-4 h-4" />
                  <span>1. How to Link Gmail & Configure Google Sign-In</span>
                </div>

                <p className="text-xs text-stone-600">
                  Google authentication allows authorized administrators and staff to sign in securely with their official Gmail accounts without remembering separate passwords.
                </p>

                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3 text-xs">
                  <h4 className="font-bold text-stone-900">Step 1: Set Up Google Cloud OAuth Client</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-stone-700">
                    <li>Go to the <strong>Google Cloud Console</strong> (<span className="font-mono text-orange-800">console.cloud.google.com</span>).</li>
                    <li>Create or select your project: <strong>Daddy's Kitchen Platform</strong>.</li>
                    <li>Navigate to <strong>APIs & Services &gt; Credentials</strong>.</li>
                    <li>Click <strong>Create Credentials &gt; OAuth client ID</strong>.</li>
                    <li>Select <strong>Web application</strong>.</li>
                  </ol>

                  <h4 className="font-bold text-stone-900 pt-2">Step 2: Add Authorized Origins & Redirects</h4>
                  <div className="p-3 bg-white rounded-lg border border-stone-300 font-mono text-[11px] space-y-1 text-stone-800">
                    <div><strong>Authorized JavaScript Origins:</strong></div>
                    <div className="text-stone-600">https://ais-dev-mqgvzrecwcfutafijsyzb2-15554198730.europe-west1.run.app</div>
                    <div className="text-stone-600">https://ais-pre-mqgvzrecwcfutafijsyzb2-15554198730.europe-west1.run.app</div>
                    <div className="text-stone-600">https://daddyskitchen.com.np</div>
                  </div>

                  <h4 className="font-bold text-stone-900 pt-2">Step 3: Whitelist the Owner Email</h4>
                  <p className="text-stone-700">
                    Your account (<span className="font-mono font-bold text-stone-900">kingavibk@gmail.com</span>) is designated as the Primary Restaurant Super Administrator with unconditional access to financial reports, menu editing, and gateway keys.
                  </p>
                </div>
              </div>

              {/* SECTION 2: STAFF ROLES & PERMISSIONS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-orange-800 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                  <Users className="w-4 h-4" />
                  <span>2. Creating & Managing Admin & Staff Accounts (RBAC)</span>
                </div>

                <p className="text-xs text-stone-600">
                  Role-Based Access Control protects customer information and prevents unauthorized modifications to completed transactions.
                </p>

                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="p-3">Staff Role</th>
                        <th className="p-3">Target Device / User</th>
                        <th className="p-3">Permitted Operations</th>
                        <th className="p-3">Restrictions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-800">
                      <tr className="bg-white">
                        <td className="p-3 font-bold text-orange-950">Owner (Admin)</td>
                        <td className="p-3 text-stone-600">kingavibk@gmail.com</td>
                        <td className="p-3">Full system control, financial sales ledger, menu pricing, eSewa/Khalti keys, delivery zones.</td>
                        <td className="p-3 text-emerald-700 font-semibold">Unrestricted</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="p-3 font-bold text-stone-900">Floor Manager</td>
                        <td className="p-3 text-stone-600">Manager Tablet / Front Desk</td>
                        <td className="p-3">Confirming orders, dispatching riders, customer inquiries, toggling 86'd sold out items.</td>
                        <td className="p-3 text-stone-500">Cannot alter gateway secrets or delete core catalog categories.</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-bold text-stone-900">Kitchen Chef</td>
                        <td className="p-3 text-stone-600">Wok & Steamer Line Screen</td>
                        <td className="p-3">Live kitchen queue, marking items "Cooking & Assembling", printing thermal kitchen tickets.</td>
                        <td className="p-3 text-stone-500">No access to sales revenue or customer phone database.</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="p-3 font-bold text-stone-900">Delivery Rider</td>
                        <td className="p-3 text-stone-600">Rider Mobile Phone</td>
                        <td className="p-3">Viewing destination address, customer phone, collecting COD cash, marking "Delivered".</td>
                        <td className="p-3 text-stone-500">Only assigned orders visible. Cannot modify pricing.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: KITCHEN DISPATCH & ORDER WORKFLOW */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-orange-800 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                  <ChefHat className="w-4 h-4" />
                  <span>3. Kitchen Dispatch, Kitchen Tickets & Status Progression</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900 block">1. Pending Order</span>
                    <span className="text-amber-800 text-[11px] mt-0.5 block">
                      Audio chime rings on counter tablet. Click "Confirm Order".
                    </span>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                    <span className="font-bold text-orange-900 block">2. Start Cooking</span>
                    <span className="text-orange-800 text-[11px] mt-0.5 block">
                      Click "Start Cooking". Kitchen ticket prints at steamer station.
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900 block">3. Dispatch / Ready</span>
                    <span className="text-blue-800 text-[11px] mt-0.5 block">
                      Hand food to rider or table runner. Click "Dispatch Rider" or "Mark Ready".
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">4. Order Complete</span>
                    <span className="text-emerald-800 text-[11px] mt-0.5 block">
                      Food delivered & cash collected. Click "Complete Order" to close ticket.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: DIGITAL WALLETS & TARIFFS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-orange-800 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>4. Digital Wallets (eSewa & Khalti) and Tariff Management</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                    <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>eSewa Merchant Setup</span>
                    </h4>
                    <p className="text-emerald-900 text-[11px]">
                      Currently running in <strong>Interactive Sandbox Mode</strong> with test code <span className="font-mono">EPAYTEST</span>. To switch to live payments, enter your official merchant code in the <strong>Hours & Gateway Config</strong> tab.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                    <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
                      <span>Khalti Merchant Setup</span>
                    </h4>
                    <p className="text-purple-900 text-[11px]">
                      Currently running in <strong>Interactive Sandbox Mode</strong>. When live merchant keys are issued from <span className="font-mono">admin.khalti.com</span>, paste your Public Key into the Admin Gateway settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 5: DAILY SHIFT CHECKLIST */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-orange-800 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                  <Clock className="w-4 h-4" />
                  <span>5. Manager Shift Checklist (Opening, Peak & Night Closing)</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2.5 bg-stone-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>10:00 AM Morning Opening:</strong> Turn on counter tablet, log in to Admin Portal, check daily announcement, verify receipt printer paper roll.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 bg-stone-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Peak Rush (1:00 PM – 3:00 PM & 6:00 PM – 9:00 PM):</strong> Keep Live Orders queue active. Confirm orders within 2 minutes. Group deliveries by Butwal zones.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 bg-stone-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>10:00 PM – 2:00 AM Late-Night Service:</strong> Switch to takeaway and delivery dispatch. Keep phone line (+977 980-2672008) active.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 bg-stone-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>2:00 AM Closing & Tally:</strong> Compare physical Cash on Delivery receipts against the Net Paid ledger. Mark all pending tickets completed.
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-6 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                <span>Daddy’s Kitchen — The Cafe and Restaurant (Butwal, Nepal)</span>
                <span>Authorized Owner: kingavibk@gmail.com</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Printable Kitchen Ticket Modal */}
      {selectedTicketOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-stone-300 font-mono text-xs">
            <div className="text-center border-b border-dashed border-stone-300 pb-3">
              <h2 className="font-bold text-base text-stone-950">DADDY'S KITCHEN</h2>
              <p className="text-[11px] text-stone-600">Kalikanagar, Butwal · +977 980-2672008</p>
              <div className="mt-2 text-sm font-bold bg-stone-100 p-1 rounded">
                KITCHEN TICKET: {selectedTicketOrder.order_number}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {new Date(selectedTicketOrder.created_at).toLocaleString()}
              </div>
            </div>

            <div className="space-y-1 text-stone-800">
              <div>
                <strong>Customer:</strong> {selectedTicketOrder.customer_name}
              </div>
              <div>
                <strong>Phone:</strong> {selectedTicketOrder.customer_phone}
              </div>
              <div>
                <strong>Mode:</strong> {selectedTicketOrder.fulfillment_type.toUpperCase()}
                {selectedTicketOrder.table_number && ` (${selectedTicketOrder.table_number})`}
              </div>
              {selectedTicketOrder.delivery_address && (
                <div>
                  <strong>Address:</strong> {selectedTicketOrder.delivery_address} (
                  {selectedTicketOrder.delivery_zone_name})
                </div>
              )}
            </div>

            <div className="border-t border-b border-dashed border-stone-300 py-2 space-y-2">
              {selectedTicketOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <span className="font-bold">{it.quantity}x</span> {it.productName}
                    {it.variantName && <div className="text-[10px] text-stone-500">[{it.variantName}]</div>}
                    {it.addOns && it.addOns.length > 0 && (
                      <div className="text-[10px] text-stone-500">
                        +{it.addOns.map((a) => a.optionName).join(', ')}
                      </div>
                    )}
                    {it.specialInstructions && (
                      <div className="text-[10px] italic text-red-600">"{it.specialInstructions}"</div>
                    )}
                  </div>
                  <span className="tabular-nums">NPR {it.lineTotal}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-sm">
              <span>TOTAL (NPR)</span>
              <span>NPR {selectedTicketOrder.total_amount}</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-stone-900 text-white rounded font-sans text-xs font-bold"
              >
                Print Ticket
              </button>
              <button
                onClick={() => setSelectedTicketOrder(null)}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-sans text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-bold text-base text-stone-900">Add New Dish to Menu</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Nepali Fried Chicken Wings"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Base Price (NPR) *</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  placeholder="Ingredients and culinary style..."
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={newProdPrepTime}
                    onChange={(e) => setNewProdPrepTime(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dietary</label>
                  <select
                    value={newProdIsVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setNewProdIsVeg(e.target.value === 'veg')}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  >
                    <option value="nonveg">Non-Vegetarian</option>
                    <option value="veg">Vegetarian</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl transition-all shadow-xs"
              >
                Add Dish to Live Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

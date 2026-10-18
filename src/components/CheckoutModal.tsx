import React, { useState } from 'react';
import { X, Bike, Utensils, QrCode, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useOrder } from '../context/OrderContext.tsx';
import { DeliveryZone, PaymentMethod } from '../types/index.ts';
import { api } from '../services/api.ts';
import { EsewaModal } from './EsewaModal.tsx';
import { KhaltiModal } from './KhaltiModal.tsx';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryZones: DeliveryZone[];
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  deliveryZones,
}) => {
  const {
    items,
    subtotal,
    deliveryFee,
    totalAmount,
    fulfillmentType,
    setFulfillmentType,
    selectedZone,
    setSelectedZone,
    tableNumber,
    setTableNumber,
    clearCart,
  } = useCart();

  const { addTrackingToken, openTrackingModal } = useOrder();

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    fulfillmentType === 'delivery' ? 'cash_on_delivery' : 'cash_on_pickup'
  );

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Digital Wallet Sandboxes
  const [pendingWalletOrder, setPendingWalletOrder] = useState<{
    id: string;
    number: string;
    token: string;
    amount: number;
    method: 'esewa' | 'khalti';
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMessage('Please provide a valid Nepal contact phone number.');
      return;
    }
    if (fulfillmentType === 'delivery') {
      if (!selectedZone) {
        setErrorMessage('Please choose a Butwal delivery neighborhood/zone.');
        return;
      }
      if (!deliveryAddress.trim()) {
        setErrorMessage('Please provide your street or landmark delivery address.');
        return;
      }
    }
    if (fulfillmentType === 'dine_in' && !tableNumber.trim()) {
      setErrorMessage('Please enter your Dine-In table number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        fulfillment_type: fulfillmentType,
        table_number: fulfillmentType === 'dine_in' ? tableNumber : undefined,
        delivery_address: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
        delivery_zone_id: fulfillmentType === 'delivery' ? selectedZone?.id : undefined,
        payment_method: paymentMethod,
        customer_notes: customerNotes,
        idempotency_key: `IDEMP_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant?.id,
          addOnOptionIds: item.selectedAddOns.map((a) => a.optionId),
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
      };

      const result = await api.createOrder(orderPayload);

      if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
        // Hold order and open wallet sandbox modal for server-verified callback
        setPendingWalletOrder({
          id: result.order.id,
          number: result.order_number,
          token: result.tracking_token,
          amount: result.order.total_amount,
          method: paymentMethod,
        });
        setIsSubmitting(false);
      } else {
        // Cash payment flow: order is immediately submitted
        addTrackingToken(result.tracking_token);
        clearCart();
        setIsSubmitting(false);
        onClose();
        openTrackingModal(result.tracking_token);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to place order. Please check availability.');
    }
  };

  const handleWalletSuccess = async (txRef: string) => {
    if (!pendingWalletOrder) return;

    try {
      await api.verifyPayment({
        orderId: pendingWalletOrder.id,
        provider: pendingWalletOrder.method,
        transactionRef: txRef,
        amount: pendingWalletOrder.amount,
      });

      addTrackingToken(pendingWalletOrder.token);
      clearCart();
      const token = pendingWalletOrder.token;
      setPendingWalletOrder(null);
      onClose();
      openTrackingModal(token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed');
      setPendingWalletOrder(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base">Complete Your Order</h2>
              <span className="text-xs text-stone-300">
                Daddy's Kitchen – The Cafe & Restaurant (Butwal)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-white"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitOrder} className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-900 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Fulfillment Switch */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Fulfillment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentType('delivery');
                    if (paymentMethod === 'cash_on_pickup') setPaymentMethod('cash_on_delivery');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    fulfillmentType === 'delivery'
                      ? 'border-orange-700 bg-orange-50 text-orange-950 shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentType('takeaway');
                    if (paymentMethod === 'cash_on_delivery') setPaymentMethod('cash_on_pickup');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    fulfillmentType === 'takeaway'
                      ? 'border-orange-700 bg-orange-50 text-orange-950 shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Takeaway</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentType('dine_in');
                    if (paymentMethod === 'cash_on_delivery') setPaymentMethod('cash_on_pickup');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    fulfillmentType === 'dine_in'
                      ? 'border-orange-700 bg-orange-50 text-orange-950 shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Dine-In</span>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Aayush Thapa"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:bg-white text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Phone (+977) *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9802672008"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:bg-white text-stone-900"
                  required
                />
              </div>
            </div>

            {/* Fulfillment Specific Fields */}
            {fulfillmentType === 'delivery' && (
              <div className="space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Select Butwal Neighborhood Zone *
                  </label>
                  <select
                    value={selectedZone?.id || ''}
                    onChange={(e) => {
                      const found = deliveryZones.find((z) => z.id === e.target.value);
                      setSelectedZone(found || null);
                    }}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-medium"
                    required
                  >
                    <option value="">Select Delivery Zone...</option>
                    {deliveryZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} — Fee NPR {z.delivery_fee} ({z.estimated_delivery_minutes} mins)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g., House 42, Opposite Horizon College, Kalikanagar"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900"
                    required
                  />
                </div>
              </div>
            )}

            {fulfillmentType === 'dine_in' && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Table Number (from QR code on your table) *
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g., Table 5 or Rooftop 2"
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-medium"
                  required
                />
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Cash option */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      fulfillmentType === 'delivery' ? 'cash_on_delivery' : 'cash_on_pickup'
                    )
                  }
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    paymentMethod === 'cash_on_delivery' || paymentMethod === 'cash_on_pickup'
                      ? 'border-orange-700 bg-orange-50/70 text-orange-950 font-semibold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-bold">
                    {fulfillmentType === 'delivery' ? 'Cash on Delivery' : 'Cash at Counter'}
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    Pay with physical cash
                  </span>
                </button>

                {/* eSewa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('esewa')}
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    paymentMethod === 'esewa'
                      ? 'border-[#60BB46] bg-emerald-50 text-emerald-950 font-semibold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-bold text-emerald-800">eSewa Wallet</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    Instant sandbox test
                  </span>
                </button>

                {/* Khalti */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('khalti')}
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    paymentMethod === 'khalti'
                      ? 'border-[#5C2D91] bg-purple-50 text-purple-950 font-semibold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-bold text-purple-900">Khalti Wallet</span>
                  <span className="text-[10px] text-purple-600 block mt-0.5">
                    Instant sandbox test
                  </span>
                </button>
              </div>
            </div>

            {/* Optional Kitchen Notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Order Notes for Kitchen (Optional)
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Extra napkins, contact upon arrival..."
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            {/* Order Price Summary */}
            <div className="p-3 bg-stone-100/90 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({items.length} dishes)</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  NPR {subtotal}
                </span>
              </div>
              {fulfillmentType === 'delivery' && (
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    NPR {deliveryFee}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-stone-950 font-bold text-sm pt-1 border-t border-stone-200">
                <span>Total Amount Due</span>
                <span className="font-mono tabular-nums text-orange-800 text-base">
                  NPR {totalAmount}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'esewa'
                      ? `Pay NPR ${totalAmount} with eSewa`
                      : paymentMethod === 'khalti'
                      ? `Pay NPR ${totalAmount} with Khalti`
                      : `Place Order (NPR ${totalAmount})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Render eSewa Sandbox Modal if waiting for digital payment */}
      {pendingWalletOrder && pendingWalletOrder.method === 'esewa' && (
        <EsewaModal
          orderId={pendingWalletOrder.id}
          orderNumber={pendingWalletOrder.number}
          amount={pendingWalletOrder.amount}
          onSuccess={handleWalletSuccess}
          onCancel={() => setPendingWalletOrder(null)}
        />
      )}

      {/* Render Khalti Sandbox Modal if waiting for digital payment */}
      {pendingWalletOrder && pendingWalletOrder.method === 'khalti' && (
        <KhaltiModal
          orderId={pendingWalletOrder.id}
          orderNumber={pendingWalletOrder.number}
          amount={pendingWalletOrder.amount}
          onSuccess={handleWalletSuccess}
          onCancel={() => setPendingWalletOrder(null)}
        />
      )}
    </>
  );
};

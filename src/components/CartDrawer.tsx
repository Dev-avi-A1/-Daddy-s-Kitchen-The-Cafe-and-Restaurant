import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Utensils, QrCode, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { DeliveryZone } from '../types/index.ts';

interface CartDrawerProps {
  deliveryZones: DeliveryZone[];
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  deliveryZones,
  onOpenCheckout,
}) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    totalAmount,
    fulfillmentType,
    setFulfillmentType,
    selectedZone,
    setSelectedZone,
    tableNumber,
    setTableNumber,
  } = useCart();

  if (!isCartOpen) return null;

  const minOrder =
    fulfillmentType === 'delivery' && selectedZone
      ? selectedZone.minimum_order_amount
      : 300;

  const isBelowMin = fulfillmentType === 'delivery' && subtotal < minOrder;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="px-5 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-700" />
              <h2 className="font-bold text-base text-stone-900">Your Food Order</h2>
              <span className="text-xs font-mono tabular-nums text-stone-500 font-medium">
                ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfillment Mode Selector */}
          <div className="p-3 bg-stone-100 border-b border-stone-200">
            <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setFulfillmentType('delivery')}
                className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-colors ${
                  fulfillmentType === 'delivery'
                    ? 'bg-orange-700 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
              <button
                onClick={() => setFulfillmentType('takeaway')}
                className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-colors ${
                  fulfillmentType === 'takeaway'
                    ? 'bg-orange-700 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Takeaway</span>
              </button>
              <button
                onClick={() => setFulfillmentType('dine_in')}
                className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-colors ${
                  fulfillmentType === 'dine_in'
                    ? 'bg-orange-700 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Dine-In</span>
              </button>
            </div>

            {/* Quick Context Inputs */}
            {fulfillmentType === 'delivery' && (
              <div className="mt-2.5">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Delivery Zone in Butwal:
                </label>
                <select
                  value={selectedZone?.id || ''}
                  onChange={(e) => {
                    const found = deliveryZones.find((z) => z.id === e.target.value);
                    setSelectedZone(found || null);
                  }}
                  className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-600 font-medium"
                >
                  <option value="">Select your area (e.g., Kalikanagar, Golpark)...</option>
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — Fee NPR {z.delivery_fee} (Min NPR {z.minimum_order_amount})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {fulfillmentType === 'dine_in' && (
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Enter Table # (e.g. Table 4)"
                  className="flex-1 text-xs p-2 bg-white border border-stone-300 rounded-lg text-stone-800 focus:ring-1 focus:ring-orange-600"
                />
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
                <div className="w-14 h-14 rounded-full bg-stone-200/70 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-sm">Your order is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore handcrafted Momos, Burgers, and freshly tossed Chowmein from our menu.
                  </p>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-stone-200/90 shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-stone-900 leading-tight">
                        {item.product.name}
                      </h4>
                      {item.variant && (
                        <span className="text-xs text-orange-800 font-medium block">
                          Style: {item.variant.name}
                        </span>
                      )}
                      {item.selectedAddOns.length > 0 && (
                        <div className="text-[11px] text-stone-500 space-y-0.5">
                          {item.selectedAddOns.map((a) => (
                            <div key={a.optionId}>
                              + {a.optionName} (NPR {a.price_adjustment})
                            </div>
                          ))}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-stone-500 italic">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-stone-200 text-stone-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-mono font-bold tabular-nums text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-stone-200 text-stone-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-sm font-bold font-mono tabular-nums text-stone-900">
                      NPR {item.lineTotal}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t border-stone-200 space-y-3">
              {/* Order Minimum Warning */}
              {isBelowMin && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-900 text-xs rounded-lg border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Min. delivery order is NPR {minOrder} (Add NPR {minOrder - subtotal} more).
                  </span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-900 font-semibold">
                    NPR {subtotal}
                  </span>
                </div>
                {fulfillmentType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee ({selectedZone?.name || 'Standard'})</span>
                    <span className="font-mono tabular-nums text-stone-900 font-semibold">
                      {selectedZone ? `NPR ${deliveryFee}` : 'Calculated at checkout'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-1 border-t border-stone-100">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-orange-800 text-base">
                    NPR {totalAmount}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                disabled={isBelowMin}
                onClick={() => {
                  closeCart();
                  onOpenCheckout();
                }}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isBelowMin
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-orange-700 hover:bg-orange-800 text-white active:scale-98'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-stone-400 hover:text-stone-700"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

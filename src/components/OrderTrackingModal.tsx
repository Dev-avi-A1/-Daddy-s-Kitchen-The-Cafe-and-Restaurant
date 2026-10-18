import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  RefreshCw,
  Phone,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useOrder } from '../context/OrderContext.tsx';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    closeTrackingModal,
    activeTokenToTrack,
    recentTrackingTokens,
  } = useOrder();

  const [currentToken, setCurrentToken] = useState(activeTokenToTrack);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTokenToTrack) {
      setCurrentToken(activeTokenToTrack);
    }
  }, [activeTokenToTrack]);

  const fetchOrder = async (token: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.trackOrder(token);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Unable to track order with this token');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isTrackingModalOpen && currentToken) {
      fetchOrder(currentToken);
    }
  }, [isTrackingModalOpen, currentToken]);

  if (!isTrackingModalOpen) return null;

  const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'pending', label: 'Order Received', desc: 'Waiting for kitchen dispatch confirmation' },
    { status: 'confirmed', label: 'Confirmed', desc: 'Accepted by kitchen staff' },
    { status: 'preparing', label: 'Cooking & Assembling', desc: 'Chef preparing fresh in the wok/fryer' },
    {
      status: order?.fulfillment_type === 'delivery' ? 'out_for_delivery' : 'ready',
      label: order?.fulfillment_type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup / Table',
      desc: order?.fulfillment_type === 'delivery' ? 'Rider heading to your address' : 'Prepared for serving',
    },
    { status: 'delivered', label: 'Completed', desc: 'Order fulfilled and enjoyed' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.order_status) : 0;
  const isCancelled = order?.order_status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <h2 className="font-bold text-base">Live Order Tracking</h2>
            </div>
            <span className="text-xs text-stone-300">
              {order ? `Order ${order.order_number}` : 'Look up your active order'}
            </span>
          </div>
          <button
            onClick={closeTrackingModal}
            className="p-1 rounded-full text-stone-400 hover:text-white"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Token Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentToken}
              onChange={(e) => setCurrentToken(e.target.value)}
              placeholder="Paste tracking token (trk_...)"
              className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono"
            />
            <button
              onClick={() => fetchOrder(currentToken)}
              disabled={isLoading || !currentToken}
              className="px-4 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Lookup</span>
            </button>
          </div>

          {/* Recent Orders Quick Buttons */}
          {recentTrackingTokens.length > 1 && (
            <div className="text-[11px] text-stone-500">
              <span className="font-semibold text-stone-700 mr-1.5">Recent tokens:</span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {recentTrackingTokens.map((tok) => (
                  <button
                    key={tok}
                    onClick={() => {
                      setCurrentToken(tok);
                      fetchOrder(tok);
                    }}
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                      currentToken === tok
                        ? 'bg-orange-100 border-orange-300 text-orange-950 font-bold'
                        : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {tok.slice(0, 16)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-900 text-xs rounded-xl border border-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Active Order Details */}
          {order && (
            <div className="space-y-5">
              {/* Status Header Banner */}
              <div
                className={`p-4 rounded-xl border ${
                  isCancelled
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-orange-50/70 border-orange-200 text-orange-950'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="uppercase tracking-wider">
                    {order.fulfillment_type === 'delivery'
                      ? 'Home Delivery'
                      : order.fulfillment_type === 'takeaway'
                      ? 'Takeaway Pickup'
                      : `Dine-In (${order.table_number || 'Table'})`}
                  </span>
                  <span className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                    {order.order_number}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold capitalize">
                      {isCancelled ? 'Order Cancelled' : order.order_status.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Customer: {order.customer_name} · Payment:{' '}
                      <strong className="uppercase font-mono">{order.payment_status}</strong> (
                      {order.payment_method.replace(/_/g, ' ')})
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              {!isCancelled && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Kitchen & Delivery Progress
                  </span>
                  <div className="space-y-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const isDone = currentStepIdx > idx;
                      const isCurrent = currentStepIdx === idx;
                      return (
                        <div
                          key={step.status}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isCurrent
                              ? 'bg-orange-50 border border-orange-200'
                              : isDone
                              ? 'bg-stone-50 text-stone-700'
                              : 'text-stone-400 opacity-60'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-orange-700 text-white font-bold'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span className="text-[10px] font-mono">{idx + 1}</span>
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-stone-900">
                              {step.label}
                            </span>
                            <span className="text-[11px] text-stone-500 block leading-tight">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items Snapshot */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Items in this Ticket
                </span>
                <div className="bg-stone-50 rounded-xl border border-stone-200 divide-y divide-stone-200/80 p-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900">
                          {item.quantity}x {item.productName}
                        </span>
                        {item.variantName && (
                          <span className="text-stone-500 block text-[11px]">
                            ({item.variantName})
                          </span>
                        )}
                        {item.addOns && item.addOns.length > 0 && (
                          <span className="text-stone-500 block text-[10px]">
                            + {item.addOns.map((a) => a.optionName).join(', ')}
                          </span>
                        )}
                        {item.specialInstructions && (
                          <span className="text-stone-500 italic block text-[10px]">
                            Note: "{item.specialInstructions}"
                          </span>
                        )}
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-stone-900">
                        NPR {item.lineTotal}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-between text-xs font-bold text-stone-950">
                    <span>Final Amount (NPR)</span>
                    <span className="font-mono tabular-nums text-sm text-orange-800">
                      NPR {order.total_amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address or Location info */}
              {order.fulfillment_type === 'delivery' && (
                <div className="p-3 bg-stone-100/70 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-stone-800 block">Delivery Destination:</span>
                  <p className="text-stone-600">
                    {order.delivery_address} ({order.delivery_zone_name || 'Butwal Zone'})
                  </p>
                </div>
              )}

              {/* Support & WhatsApp Helpline */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`https://wa.me/9779802672008?text=Hello%20Daddy's%20Kitchen,%20I%20am%20inquiring%20about%20my%20Order%20${encodeURIComponent(
                    order.order_number
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Kitchen Helpline</span>
                </a>
                <a
                  href="tel:+9779802672008"
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

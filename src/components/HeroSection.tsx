import React from 'react';
import { ArrowRight, Utensils, Bike, QrCode, Sparkles, MapPin, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { FulfillmentType } from '../types/index.ts';

interface HeroSectionProps {
  onScrollToMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToMenu }) => {
  const { setFulfillmentType, fulfillmentType } = useCart();

  const handleSelectFulfillment = (type: FulfillmentType) => {
    setFulfillmentType(type);
    onScrollToMenu();
  };

  return (
    <section className="relative overflow-hidden bg-stone-100/60 border-b border-stone-200 pt-8 pb-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Split Hero: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & Order Initiation */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quiet text kicker - zero pill box */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-800">
              <span>Daddy's Kitchen</span>
              <span aria-hidden="true">·</span>
              <span>Kalikanagar, Butwal</span>
              <span aria-hidden="true">·</span>
              <span>Est. 2013</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] text-balance">
              Butwal’s Favorite Bistro for Handcrafted Momos & Gourmet Burgers.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Freshly folded dumplings, wok-tossed chowmein, sizzling burgers, and barista espresso. Prepared with authentic Himalayan spices and delivered hot to your doorstep or served fresh at your table.
            </p>

            {/* Quick Fulfillment Mode Switcher */}
            <div className="bg-white p-2 rounded-xl border border-stone-200/90 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-2 block">
                Choose How You’d Like To Order:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleSelectFulfillment('delivery')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    fulfillmentType === 'delivery'
                      ? 'bg-orange-700 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Bike className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Home Delivery</span>
                </button>
                <button
                  onClick={() => handleSelectFulfillment('takeaway')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    fulfillmentType === 'takeaway'
                      ? 'bg-orange-700 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Utensils className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Takeaway Pickup</span>
                </button>
                <button
                  onClick={() => handleSelectFulfillment('dine_in')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    fulfillmentType === 'dine_in'
                      ? 'bg-orange-700 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Dine-In Table</span>
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToMenu}
                className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow active:scale-98"
              >
                <span>Browse Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/9779802672008?text=Hello%20Daddy's%20Kitchen,%20I%20would%20like%20to%20place%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Location verified note */}
            <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Delivering across Kalikanagar, Golpark, Traffic Chowk, Tilottama & Manigram</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/90 bg-stone-200 aspect-[16/10] sm:aspect-[16/10]">
              <img
                src="/src/assets/images/hero_restaurant_feast_1791791168680.jpg"
                alt="Daddy's Kitchen feast with momos, burger, chowmein, and iced lattes"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Quiet overlay label */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-sm block">Authentic Butwal Kitchen</span>
                  <span className="text-stone-300 text-[11px]">12 Teacher’s Path, Kalikanagar</span>
                </div>
                <div className="text-right font-mono tabular-nums bg-stone-900/80 px-2.5 py-1 rounded backdrop-blur-sm text-amber-300 font-semibold border border-stone-700">
                  Daily 10 AM – 10 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Operations Strip (Full-width row below hero split) */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-800">
          <div>
            <span className="block text-xl font-bold font-mono tabular-nums text-stone-900">
              15–30 min
            </span>
            <span className="text-xs text-stone-500 font-medium mt-0.5 block">
              Average Prep & Cook Time
            </span>
          </div>
          <div>
            <span className="block text-xl font-bold font-mono tabular-nums text-stone-900">
              Till 2:00 AM
            </span>
            <span className="text-xs text-stone-500 font-medium mt-0.5 block">
              Extended Butwal Night Delivery
            </span>
          </div>
          <div>
            <span className="block text-xl font-bold text-stone-900">
              eSewa & Khalti
            </span>
            <span className="text-xs text-stone-500 font-medium mt-0.5 block">
              Digital Wallets + Cash on Delivery
            </span>
          </div>
          <div>
            <span className="block text-xl font-bold text-stone-900">
              Dine-In QR
            </span>
            <span className="text-xs text-stone-500 font-medium mt-0.5 block">
              Instant Table Ordering
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

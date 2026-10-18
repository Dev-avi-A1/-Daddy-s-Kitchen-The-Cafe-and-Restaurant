import React, { useState } from 'react';
import { ShoppingBag, Search, Clock, MapPin, Phone, Shield, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useOrder } from '../context/OrderContext.tsx';

interface NavbarProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdminView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateSection,
  onOpenAdmin,
  isAdminView,
}) => {
  const { itemCount, subtotal, openCart } = useCart();
  const { openTrackingModal, recentTrackingTokens } = useOrder();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Slim Top Announcement / Trust Line (at most 36px high) */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-3 truncate">
            <span className="flex items-center gap-1 shrink-0 text-amber-400 font-medium">
              <MapPin className="w-3 h-3" />
              12 Teacher’s Path, Kalikanagar, Butwal
            </span>
            <span className="hidden md:inline text-stone-500">·</span>
            <span className="hidden md:inline truncate">
              Open Daily 10:00 AM – 10:00 PM (Night Delivery till 2:00 AM)
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="tel:+9779802672008"
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>+977 980-2672008</span>
            </a>
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                isAdminView
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{isAdminView ? 'Customer Store' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strict 1-Row 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigateSection('hero')}
            className="text-left whitespace-nowrap shrink-0 group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-700 text-stone-50 flex items-center justify-center font-bold text-lg tracking-wider shadow-sm group-hover:bg-orange-800 transition-colors">
              DK
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 block leading-tight">
                Daddy's Kitchen
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">
                The Cafe & Restaurant · Butwal
              </span>
            </div>
          </button>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
            <button
              onClick={() => onNavigateSection('menu')}
              className="hover:text-orange-700 transition-colors whitespace-nowrap shrink-0"
            >
              Menu & Specialties
            </button>
            <button
              onClick={() => onNavigateSection('fulfillment')}
              className="hover:text-orange-700 transition-colors whitespace-nowrap shrink-0"
            >
              Delivery & Takeaway
            </button>
            <button
              onClick={() => onNavigateSection('about')}
              className="hover:text-orange-700 transition-colors whitespace-nowrap shrink-0"
            >
              About Our Kitchen
            </button>
            <button
              onClick={() => onNavigateSection('contact')}
              className="hover:text-orange-700 transition-colors whitespace-nowrap shrink-0"
            >
              Contact & Hours
            </button>
            <button
              onClick={() => openTrackingModal()}
              className="text-stone-600 hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Track Order</span>
              {recentTrackingTokens.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-600" title="Active order" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action (Cart & Checkout) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openCart}
              className="relative flex items-center gap-2.5 bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="whitespace-nowrap">Cart</span>
              {itemCount > 0 && (
                <span className="bg-stone-900 text-stone-50 text-xs px-2 py-0.5 rounded-full font-mono tabular-nums font-bold">
                  {itemCount} · NPR {subtotal}
                </span>
              )}
            </button>

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-400 rounded-lg"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 py-4 space-y-3">
            <button
              onClick={() => {
                onNavigateSection('menu');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 border-b border-stone-200/60"
            >
              Menu & Specialties
            </button>
            <button
              onClick={() => {
                onNavigateSection('fulfillment');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 border-b border-stone-200/60"
            >
              Delivery & Takeaway
            </button>
            <button
              onClick={() => {
                onNavigateSection('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 border-b border-stone-200/60"
            >
              About Our Kitchen
            </button>
            <button
              onClick={() => {
                onNavigateSection('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 border-b border-stone-200/60"
            >
              Contact & Hours
            </button>
            <button
              onClick={() => {
                openTrackingModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-orange-800"
            >
              <span>Track Existing Order</span>
              <Clock className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>
    </>
  );
};

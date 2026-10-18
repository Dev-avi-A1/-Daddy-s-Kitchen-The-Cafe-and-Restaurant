/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { OrderProvider, useOrder } from './context/OrderContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CategoryNav } from './components/CategoryNav.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductCustomizerModal } from './components/ProductCustomizerModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderTrackingModal } from './components/OrderTrackingModal.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminView } from './components/AdminView.tsx';
import { Category, Product, DeliveryZone, RestaurantSettings } from './types/index.ts';
import { api } from './services/api.ts';
import { Bike, Utensils, QrCode, Sparkles, Loader2 } from 'lucide-react';

function RestaurantApp() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'prep-time'>('featured');

  // Modals State
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const fulfillmentRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cats, prods, restData] = await Promise.all([
          api.getCategories(),
          api.getProducts('all'),
          api.getRestaurantData(),
        ]);
        setCategories(cats);
        setProducts(prods);
        setDeliveryZones(restData.deliveryZones);
        setSettings(restData.settings);
      } catch (err) {
        console.error('Failed to load restaurant data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    const scrollToTarget = () => {
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (sectionId === 'menu') {
        menuRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'fulfillment') {
        fulfillmentRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'about') {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'contact') {
        contactRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (isAdminView) {
      setIsAdminView(false);
      setTimeout(scrollToTarget, 60);
    } else {
      scrollToTarget();
    }
  };

  // Filtered & Sorted Products
  const displayedProducts = products
    .filter((product) => {
      // Category filter
      if (selectedCategoryId !== 'all' && product.categoryId !== selectedCategoryId) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && !product.is_vegetarian) {
        return false;
      }
      if (dietaryFilter === 'non-veg' && product.is_vegetarian) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        return matchesName || matchesDesc;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.base_price - b.base_price;
      if (sortBy === 'price-desc') return b.base_price - a.base_price;
      if (sortBy === 'prep-time') return a.preparation_time_minutes - b.preparation_time_minutes;
      // Default: featured first
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });

  if (isAdminView) {
    return <AdminView onBackToStore={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setIsAdminView(true)}
        isAdminView={isAdminView}
      />

      {/* Hero Section */}
      <HeroSection onScrollToMenu={() => handleNavigateSection('menu')} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Menu Section */}
        <section ref={menuRef} id="menu" className="scroll-mt-16 py-14 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-800">
              <span>Chef Handcrafted</span>
              <span aria-hidden="true">·</span>
              <span>Kalikanagar Kitchen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Explore Our Restaurant & Cafe Menu
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              From our famous momos and street-style noodles to juicy double-patty burgers and rich curries. Custom portions, spice levels, and add-ons available on every dish.
            </p>
          </div>

          {/* Category Filter Tabs, Search & Sorter */}
          <CategoryNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dietaryFilter={dietaryFilter}
            onDietaryFilterChange={setDietaryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Product Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-stone-500 space-y-2">
              <Loader2 className="w-7 h-7 animate-spin text-orange-700" />
              <span className="text-xs font-medium">Loading delicious offerings...</span>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-2">
              <span className="text-sm font-bold text-stone-800 block">No dishes found</span>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No items match your active search or dietary filter. Try clearing the search term.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDietaryFilter('all');
                  setSelectedCategoryId('all');
                }}
                className="mt-3 px-4 py-1.5 bg-orange-700 text-white text-xs font-semibold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProductForModal(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Fulfillment Explainer Section */}
        <section
          ref={fulfillmentRef}
          id="fulfillment"
          className="scroll-mt-16 py-14 bg-stone-100/70 border-t border-b border-stone-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-orange-800">
                Convenient Dining in Butwal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Three Easy Ways to Enjoy Daddy's Kitchen
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm">
                Whether staying at home, passing by Kalikanagar, or dining at our cozy tables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900">1. Fast Neighborhood Delivery</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Thermal-insulated delivery across Butwal (Kalikanagar, Golpark, Traffic Chowk, Tilottama & Manigram). Night orders serviced until 2:00 AM.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900">2. Takeaway Counter Pickup</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Order ahead online to skip the waiting line. Stop by 12 Teacher’s Path in Kalikanagar and pick up your piping hot food in 15–20 minutes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900">3. Dine-In QR Table Ordering</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Take a seat, enter your table number at checkout, and order directly from your mobile phone. Kitchen tickets print instantly at the pass.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <div ref={aboutRef}>
          <AboutSection onExploreMenu={() => handleNavigateSection('menu')} />
        </div>

        {/* Contact Section & FAQs */}
        <div ref={contactRef}>
          <ContactSection />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminView(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Modals & Drawers */}
      <ProductCustomizerModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      <CartDrawer
        deliveryZones={deliveryZones}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        deliveryZones={deliveryZones}
      />

      <OrderTrackingModal />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <RestaurantApp />
      </OrderProvider>
    </CartProvider>
  );
}

import React, { useState } from 'react';
import {
  Award,
  Clock,
  HeartHandshake,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  Flame,
  CheckCircle2,
  ArrowRight,
  Coffee,
  ShieldCheck,
} from 'lucide-react';

interface AboutSectionProps {
  onExploreMenu?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreMenu }) => {
  const [activeGalleryTab, setActiveGalleryTab] = useState<'momos' | 'ambience' | 'wok' | 'burgers'>('momos');

  const galleryImages = {
    momos: {
      url: '/src/assets/images/signature_steamed_momos_1791791178718.jpg',
      title: 'Hand-Folded Steam & Kothey Momos',
      subtitle: 'Folded fresh daily with house sesame-tomato achar',
      tag: 'Fresh Dumpling Station',
    },
    ambience: {
      url: '/src/assets/images/hero_restaurant_feast_1791791168680.jpg',
      title: 'Warm Kalikanagar Dining Ambience',
      subtitle: 'Cozy wooden interiors, high-speed WiFi, and friendly hospitality',
      tag: 'Bistro & Cafe Space',
    },
    wok: {
      url: '/src/assets/images/nepali_chicken_chowmein_1791791204238.jpg',
      title: 'High-Heat Wok Chowmein & Thukpa',
      subtitle: 'Street-style tossing with authentic mountain spices',
      tag: 'Live Wok Station',
    },
    burgers: {
      url: '/src/assets/images/crispy_chicken_burger_1791791187588.jpg',
      title: 'Artisanal Brioche Crispy Burgers',
      subtitle: 'Double-battered golden chicken with melted cheese',
      tag: 'Fast Food Favorites',
    },
  };

  const currentGallery = galleryImages[activeGalleryTab];

  return (
    <section id="about" className="scroll-mt-16 py-18 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Top Story Header & Visual Collage Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Interactive Image Gallery & Visual Spotlight */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Interactive Showcase Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/90 aspect-[4/3] bg-stone-100 group">
              <img
                src={currentGallery.url}
                alt={currentGallery.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

              {/* Tag / Category overlay */}
              <div className="absolute top-3.5 left-3.5 bg-stone-900/85 backdrop-blur-xs text-amber-300 text-xs font-semibold px-2.5 py-1 rounded">
                {currentGallery.tag}
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-stone-300 block font-mono">Daddy’s Kitchen Butwal</span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mt-0.5">
                  {currentGallery.title}
                </h3>
                <p className="text-xs text-stone-300 mt-0.5 leading-snug">
                  {currentGallery.subtitle}
                </p>
              </div>
            </div>

            {/* Gallery Thumbnail Selector Tabs */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveGalleryTab('momos')}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  activeGalleryTab === 'momos'
                    ? 'border-orange-700 bg-orange-50/80 ring-1 ring-orange-700'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <span className="block text-[11px] font-bold text-stone-900 truncate">
                  Momos
                </span>
                <span className="text-[10px] text-stone-500 block truncate">Hand-Folded</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGalleryTab('ambience')}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  activeGalleryTab === 'ambience'
                    ? 'border-orange-700 bg-orange-50/80 ring-1 ring-orange-700'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <span className="block text-[11px] font-bold text-stone-900 truncate">
                  Ambience
                </span>
                <span className="text-[10px] text-stone-500 block truncate">Cafe & Seating</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGalleryTab('wok')}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  activeGalleryTab === 'wok'
                    ? 'border-orange-700 bg-orange-50/80 ring-1 ring-orange-700'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <span className="block text-[11px] font-bold text-stone-900 truncate">
                  Wok Station
                </span>
                <span className="text-[10px] text-stone-500 block truncate">Noodles & Chilly</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGalleryTab('burgers')}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  activeGalleryTab === 'burgers'
                    ? 'border-orange-700 bg-orange-50/80 ring-1 ring-orange-700'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <span className="block text-[11px] font-bold text-stone-900 truncate">
                  Burgers
                </span>
                <span className="text-[10px] text-stone-500 block truncate">Crispy Patty</span>
              </button>
            </div>
          </div>

          {/* Right Column: Culinary Heritage & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-800">
              <span>Our Culinary Heritage</span>
              <span aria-hidden="true">·</span>
              <span>12 Teacher’s Path, Butwal</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              A Decade of Honest Food, Mountain Spices, and Welcoming Nepali Hospitality.
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Founded in 2013, Daddy’s Kitchen emerged as one of the very first food truck and fast-casual pioneers in Western Nepal. What started as a passion project to elevate Nepali street food into clean, hygienic, and crave-worthy bistro dining has grown into a landmark culinary destination in Butwal.
            </p>

            <p className="text-stone-600 text-sm leading-relaxed">
              From dawn to well past midnight, our chefs prepare every dumpling wrapper from scratch, simmer aromatic gravies with whole roasted spices, and serve customers with the warmth of a family kitchen.
            </p>

            {/* Key Trust Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xl font-bold font-mono text-stone-900 block tabular-nums">
                  2013
                </span>
                <span className="text-xs text-stone-500 font-medium block mt-0.5">
                  Serving Butwal Since
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xl font-bold font-mono text-stone-900 block tabular-nums">
                  100%
                </span>
                <span className="text-xs text-stone-500 font-medium block mt-0.5">
                  Fresh Daily Prep
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
                <span className="text-xl font-bold font-mono text-orange-800 block tabular-nums">
                  2:00 AM
                </span>
                <span className="text-xs text-stone-500 font-medium block mt-0.5">
                  Night Delivery Till
                </span>
              </div>
            </div>

            {/* Direct Menu Navigation Action */}
            {onExploreMenu && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onExploreMenu}
                  className="px-5 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm active:scale-98"
                >
                  <span>Taste Our Specialties</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Four Kitchen Pillars */}
        <div className="pt-6 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-orange-800">
              The Daddy’s Kitchen Standard
            </span>
            <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Our Four Commitments to Every Guest
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">Never Pre-Frozen Momos</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our dough is kneaded fresh daily and dumplings are hand-folded before every rush. Never frozen in factory batches.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">Hygienic Kitchen Stations</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sanitized stainless-steel cookware, RO purified drinking water, and strict temperature control for chicken and dairy.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">Local Himalayan Spices</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hand-crushed Timur, roasted cumin, raw mustard oil, and mountain chillies source-crafted right here in Lumbini province.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">Late-Night Care for Butwal</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Because good food should not stop at 10 PM. Our night delivery team stays awake until 2 AM to deliver hot meals to your door.
              </p>
            </div>
          </div>
        </div>

        {/* Chef & Founder Note Quote */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 max-w-2xl text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              From Our Kitchen to Your Table
            </span>
            <p className="text-sm sm:text-base text-stone-200 italic leading-relaxed">
              "We built Daddy’s Kitchen on a simple promise: food that makes people smile, served with genuine warmth and uncompromised cleanliness. Whether you are grabbing a quick chowmein box on your way home or celebrating with friends over jhol momos, you are always welcome here."
            </p>
            <span className="text-xs text-stone-400 block font-medium">
              — The Kitchen & Management Team · Daddy’s Kitchen Butwal
            </span>
          </div>

          <div className="shrink-0 text-center sm:text-right">
            <div className="text-xs text-stone-400 font-mono">Order Direct Hotline</div>
            <a
              href="tel:+9779802672008"
              className="text-lg font-bold font-mono text-amber-300 hover:underline block mt-0.5"
            >
              +977 980-2672008
            </a>
            <span className="text-[11px] text-stone-500 block mt-1">
              Kalikanagar, Butwal
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { MapPin, Phone, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateSection }) => {
  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-700 text-white flex items-center justify-center font-bold text-sm">
                DK
              </div>
              <span className="font-bold text-base text-white">Daddy's Kitchen</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              The Cafe & Restaurant. Serving Butwal with handcrafted momos, gourmet fast food, and barista coffee since 2013.
            </p>
            <div className="text-[11px] text-stone-500 font-mono">
              Currency: NPR · Timezone: Asia/Kathmandu
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigateSection('menu')}
                  className="hover:text-white transition-colors"
                >
                  Full Menu & Specialties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('fulfillment')}
                  className="hover:text-white transition-colors"
                >
                  Fulfillment & Delivery Zones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Kitchen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Delivery Hub */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Butwal Service Areas</h4>
            <ul className="space-y-1 text-stone-400 text-[11px]">
              <li>· Kalikanagar & 12 Teacher’s Path</li>
              <li>· Golpark & Hospital Line</li>
              <li>· Traffic Chowk & Amarpath</li>
              <li>· Deepnagar & Ramnagar</li>
              <li>· Tilottama & Driver Tole</li>
              <li>· Manigram & Shankarnagar</li>
            </ul>
          </div>

          {/* Col 4: Contact & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Direct Hotline</h4>
            <div className="space-y-1 text-xs">
              <a
                href="tel:+9779802672008"
                className="flex items-center gap-1.5 text-stone-200 hover:text-white font-mono font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>+977 980-2672008</span>
              </a>
              <p className="text-stone-400 text-[11px]">12 Teacher’s Path, Kalikanagar, Butwal</p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors border border-stone-700"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Staff & Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Copyright Line */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} Daddy’s Kitchen – The Cafe and Restaurant. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Kalikanagar, Butwal 32907, Nepal</span>
            <span>·</span>
            <span>eSewa & Khalti Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

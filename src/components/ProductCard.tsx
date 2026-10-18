import React from 'react';
import { Plus, Flame, Clock, Leaf } from 'lucide-react';
import { Product } from '../types/index.ts';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const hasVariantsOrAddons =
    (product.variants && product.variants.length > 0) ||
    (product.addOnGroups && product.addOnGroups.length > 0);

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Minimal text indicator - no pill badge clusters */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {product.is_featured && (
            <span className="bg-stone-900/85 backdrop-blur-xs text-amber-300 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded">
              Signature
            </span>
          )}
          {product.is_vegetarian && (
            <span className="bg-emerald-900/80 backdrop-blur-xs text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5" />
              Veg
            </span>
          )}
        </div>

        {/* Prep Time unboxed badge */}
        <div className="absolute bottom-2 right-2 bg-stone-950/75 backdrop-blur-xs text-stone-200 text-[11px] font-mono tabular-nums px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-3 h-3 text-stone-400" />
          <span>{product.preparation_time_minutes}m</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Metadata line with dot separators */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
            <span>{product.is_vegetarian ? 'Vegetarian' : 'Non-Veg'}</span>
            {product.spice_level && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-orange-800 font-semibold">
                  <Flame className="w-3 h-3" />
                  {product.spice_level}
                </span>
              </>
            )}
          </div>

          <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-800 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA Line */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Price</span>
            <div className="text-base font-bold font-mono tabular-nums text-stone-900">
              NPR {product.base_price}
              {hasVariantsOrAddons && (
                <span className="text-xs font-normal text-stone-500 font-sans ml-1">+</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-700 text-orange-800 hover:text-white rounded-lg text-xs font-bold transition-all border border-orange-200 hover:border-orange-700 active:scale-97"
            aria-label={`Customize or add ${product.name}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{hasVariantsOrAddons ? 'Customize' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

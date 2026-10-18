import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Flame, Clock, Leaf, AlertCircle, Check } from 'lucide-react';
import { Product, ProductVariant, SelectedAddOn } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductCustomizerModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  onClose,
}) => {
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (product) {
      // Default to first variant if available
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setSelectedAddOns([]);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [product]);

  if (!product) return null;

  // Calculate live unit price & total
  let currentUnitPrice = Number(product.base_price);
  if (selectedVariant) {
    currentUnitPrice += Number(selectedVariant.price_adjustment);
  }
  for (const addon of selectedAddOns) {
    currentUnitPrice += Number(addon.price_adjustment);
  }
  const currentTotal = currentUnitPrice * quantity;

  const handleToggleAddOn = (groupId: string, groupName: string, optionId: string, optionName: string, price: number) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.optionId === optionId);
      if (exists) {
        return prev.filter((a) => a.optionId !== optionId);
      } else {
        return [
          ...prev,
          {
            groupId,
            groupName,
            optionId,
            optionName,
            price_adjustment: price,
          },
        ];
      }
    });
  };

  const handleAddToCart = () => {
    addItem(product, selectedVariant, selectedAddOns, quantity, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-stone-900/60 text-white flex items-center justify-center hover:bg-stone-900 transition-colors"
          aria-label="Close customizer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Image */}
        <div className="relative aspect-[16/9] bg-stone-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              {product.is_vegetarian ? (
                <span className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  Vegetarian
                </span>
              ) : (
                <span>Non-Vegetarian</span>
              )}
              {product.spice_level && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {product.spice_level}
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {product.preparation_time_minutes} min prep
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">{product.name}</h2>
          </div>
        </div>

        {/* Customization Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {product.allergen_information && (
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg text-amber-900 text-xs border border-amber-200/80">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <span>{product.allergen_information}</span>
            </div>
          )}

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900 uppercase tracking-wider">
                <span>Select Style or Size</span>
                <span className="text-stone-400 font-normal">Required</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-orange-700 bg-orange-50/70 text-orange-950 font-semibold'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-orange-700 bg-orange-700' : 'border-stone-400 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{v.name}</span>
                      </div>
                      <span className="font-mono tabular-nums text-stone-900">
                        {v.price_adjustment > 0
                          ? `+ NPR ${v.price_adjustment}`
                          : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-on Groups */}
          {product.addOnGroups &&
            product.addOnGroups.map((grp) => (
              <div key={grp.id} className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900 uppercase tracking-wider">
                  <span>{grp.name}</span>
                  <span className="text-stone-400 font-normal">Optional</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {grp.options.map((opt) => {
                    const isChecked = selectedAddOns.some((a) => a.optionId === opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          handleToggleAddOn(
                            grp.id,
                            grp.name,
                            opt.id,
                            opt.name,
                            Number(opt.price_adjustment)
                          )
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                          isChecked
                            ? 'border-orange-700 bg-orange-50/70 text-orange-950 font-semibold'
                            : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? 'border-orange-700 bg-orange-700 text-white' : 'border-stone-400 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        <span className="font-mono tabular-nums text-stone-900 font-medium">
                          + NPR {opt.price_adjustment}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special Instructions */}
          <div className="space-y-1.5 pt-2 border-t border-stone-200">
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
              Special Instructions
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Less spicy, no coriander, extra hot chutney..."
              className="w-full text-xs sm:text-sm p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Footer Purchase Actions */}
        <div className="p-4 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-mono tabular-nums font-bold text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all shadow-sm active:scale-98"
          >
            <span>Add to Order</span>
            <span className="font-mono tabular-nums">NPR {currentTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

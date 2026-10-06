import React from 'react';
import { Leaf, Droplets, Sparkles, HeartHandshake, Mic2, ArrowRight } from 'lucide-react';
import { DarcoProduct } from '../types';
import { DARCO_PRODUCTS } from '../data/presets';

interface ProductCatalogProps {
  onGenerateProductSpot: (product: DarcoProduct) => void;
  isLoading: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onGenerateProductSpot,
  isLoading,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-stone-900 to-amber-950/60 border border-emerald-800/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5" />
            <span>Farmacopeia Popular & Fitoterápicos Naturais</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Linha Botânica <span className="text-amber-400">D'ARCO</span>
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            Nascidos da riqueza da Caatinga e da sabedoria dos raizeiros nordestinos.
            Escolha um produto para gerar uma locução personalizada com o calor do sertão.
          </p>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DARCO_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="flex flex-col justify-between bg-stone-900/90 border border-stone-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-lg transition-all hover:shadow-emerald-950/20 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 group-hover:border-emerald-500/40 transition-colors">
                    {getIcon(prod.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {prod.badge}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white mt-1">
                      {prod.name}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs font-medium text-amber-200/80 italic">
                "{prod.tagline}"
              </p>

              <p className="text-sm text-stone-300 leading-relaxed">
                {prod.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Destaques Naturais:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {prod.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-[11px] text-emerald-300/90 font-medium"
                    >
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action to create tailored spot */}
            <div className="pt-5 mt-4 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => onGenerateProductSpot(prod)}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Mic2 className="w-4 h-4 text-stone-950" />
                <span>Gravar Spot com Locutor D'ARCO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

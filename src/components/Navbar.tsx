import React from 'react';
import { Radio, Sparkles, Volume2, Music, Mic2, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  isOnAir: boolean;
  ambienceActive: boolean;
  onToggleAmbience: () => void;
  activeTab: 'studio' | 'presets' | 'products' | 'history';
  onTabChange: (tab: 'studio' | 'presets' | 'products' | 'history') => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isOnAir,
  ambienceActive,
  onToggleAmbience,
  activeTab,
  onTabChange,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-amber-700 shadow-lg shadow-emerald-950/50 border border-emerald-500/30">
              <span className="font-serif font-black text-2xl text-amber-100 tracking-tighter">
                D'
              </span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-stone-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-tight text-white">
                  D'ARCO
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300">
                  Voz do Nordeste
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-medium tracking-wide">
                Deixe a Natureza Cuidar de Você
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-900/80 p-1.5 rounded-xl border border-stone-800">
            <button
              onClick={() => onTabChange('studio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'studio'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Mic2 className="w-4 h-4" />
              Estúdio de Locução
            </button>
            <button
              onClick={() => onTabChange('presets')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'presets'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              Spots Prontos
            </button>
            <button
              onClick={() => onTabChange('products')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Linha de Produtos
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              Gravações ({historyCount})
            </button>
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center gap-3">
            {/* Ambient Cordel Music Toggle */}
            <button
              onClick={onToggleAmbience}
              title={
                ambienceActive
                  ? 'Desativar trilha acústica de fundo'
                  : 'Ativar trilha acústica regional de fundo'
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                ambienceActive
                  ? 'bg-amber-600/20 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${ambienceActive ? 'animate-bounce text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Trilha de Fundo</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  ambienceActive ? 'bg-amber-500/30 text-amber-200' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {ambienceActive ? 'LIGADA' : 'OFF'}
              </span>
            </button>

            {/* "No Ar" Radio Studio Light */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold tracking-wider transition-all ${
                isOnAir
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-lg shadow-rose-950/50 animate-pulse'
                  : 'bg-stone-900/90 border-stone-800 text-stone-400'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnAir ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-stone-600'
                }`}
              />
              <span>{isOnAir ? 'NO AR' : 'ESTÚDIO'}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-800/60">
          <button
            onClick={() => onTabChange('studio')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'studio' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            Estúdio
          </button>
          <button
            onClick={() => onTabChange('presets')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'presets' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            Spots Prontos
          </button>
          <button
            onClick={() => onTabChange('products')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'products' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'history' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            Gravações ({historyCount})
          </button>
        </div>
      </div>
    </header>
  );
};

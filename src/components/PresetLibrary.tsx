import React from 'react';
import { Radio, Play, Edit3, Clock, Sparkles, User, Tag } from 'lucide-react';
import { PresetSpot } from '../types';
import { PRESET_SPOTS, VOICES } from '../data/presets';

interface PresetLibraryProps {
  onSelectSpot: (spot: PresetSpot, autoPlay: boolean) => void;
  isLoading: boolean;
}

export const PresetLibrary: React.FC<PresetLibraryProps> = ({
  onSelectSpot,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Radio className="w-3.5 h-3.5" />
              <span>Spots & Jingles Clássicos D'ARCO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Biblioteca de Locuções Prontas
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Roteiros consagrados com métrica perfeita para rádio, redes sociais e carros de som.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRESET_SPOTS.map((spot) => {
          const voiceObj = VOICES.find((v) => v.voiceName === spot.suggestedVoice);

          return (
            <div
              key={spot.id}
              className="group flex flex-col justify-between bg-stone-900/80 hover:bg-stone-900 border border-stone-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all hover:shadow-emerald-950/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                    {spot.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{spot.durationEst}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {spot.description}
                  </p>
                </div>

                {/* Script text preview */}
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-xs text-stone-300/90 leading-relaxed italic line-clamp-4 font-sans">
                  "{spot.script}"
                </div>

                {/* Suggested Voice */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Voz sugerida:</span>
                  <strong className="text-stone-200">
                    {voiceObj ? voiceObj.name : spot.suggestedVoice}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-stone-800/80 flex items-center gap-2">
                <button
                  onClick={() => onSelectSpot(spot, true)}
                  disabled={isLoading}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  title="Sintetizar e tocar imediatamente"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ouvir Locução</span>
                </button>

                <button
                  onClick={() => onSelectSpot(spot, false)}
                  className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs transition-colors"
                  title="Editar no Estúdio"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

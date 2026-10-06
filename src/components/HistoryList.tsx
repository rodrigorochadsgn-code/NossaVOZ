import React from 'react';
import { Play, Pause, Download, Trash2, Copy, Check, Radio, Clock } from 'lucide-react';
import { AudioRecord } from '../types';
import { downloadWav } from '../utils/audioPlayer';

interface HistoryListProps {
  history: AudioRecord[];
  currentRecord: AudioRecord | null;
  isPlaying: boolean;
  onPlayRecord: (record: AudioRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  currentRecord,
  isPlaying,
  onPlayRecord,
  onDeleteRecord,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (history.length === 0) {
    return (
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-950 border border-stone-800 mx-auto flex items-center justify-center text-stone-600">
          <Radio className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-serif font-bold text-white">
          Nenhuma Gravação no Arquivo
        </h3>
        <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
          Gere uma locução na aba "Estúdio" ou teste um dos "Spots Prontos" para que o áudio sintetizado apareça nesta lista.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">
            Arquivo de Gravações do Estúdio
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            {history.length} {history.length === 1 ? 'áudio gerado' : 'áudios gerados'} com o modelo gemini-3.8-flash-tts
          </p>
        </div>

        <button
          onClick={onClearHistory}
          className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-500/40 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar Arquivo</span>
        </button>
      </div>

      {/* Recordings List */}
      <div className="space-y-3">
        {history.map((item) => {
          const isCurrent = currentRecord?.id === item.id;
          const isItemPlaying = isCurrent && isPlaying;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-stone-900/95 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onPlayRecord(item)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all ${
                      isItemPlaying
                        ? 'bg-amber-400 text-stone-950 scale-105'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                    }`}
                    title={isItemPlaying ? 'Pausar' : 'Tocar áudio'}
                  >
                    {isItemPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                        Voz: {item.voiceName}
                      </span>
                      <span className="text-[10px] text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 italic font-sans">
                      "{item.script}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleCopy(item.id, item.script)}
                    title="Copiar texto do roteiro"
                    className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-colors"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      downloadWav(
                        item.audioBase64,
                        `darco-${item.voiceName.toLowerCase()}-${item.id}.wav`
                      )
                    }
                    title="Baixar arquivo WAV"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WAV</span>
                  </button>

                  <button
                    onClick={() => onDeleteRecord(item.id)}
                    title="Excluir gravação"
                    className="p-2 rounded-lg bg-stone-950 hover:bg-rose-950/40 border border-stone-800 text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

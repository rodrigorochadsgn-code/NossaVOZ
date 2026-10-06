import React, { useState } from 'react';
import {
  Mic2,
  Sparkles,
  Radio,
  Sliders,
  Send,
  Wand2,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  Volume2,
  Feather,
  Info,
} from 'lucide-react';
import { VoiceOption, AudioRecord } from '../types';
import { VOICES, STYLE_PRESETS, REGIONAL_EXPRESSIONS } from '../data/presets';
import { WaveformVisualizer } from './WaveformVisualizer';

interface StudioConsoleProps {
  onGenerateTTS: (
    text: string,
    voiceName: string,
    styleModifier: string,
    title?: string
  ) => Promise<void>;
  isLoading: boolean;
  isPlaying: boolean;
  lastRecord: AudioRecord | null;
  onPlayRecord: (record: AudioRecord) => void;
  initialText?: string;
}

export const StudioConsole: React.FC<StudioConsoleProps> = ({
  onGenerateTTS,
  isLoading,
  isPlaying,
  lastRecord,
  onPlayRecord,
  initialText = '',
}) => {
  const [text, setText] = useState<string>(
    initialText ||
      "Oxente meu povo! Cansado da correria do dia a dia? Venha cá, deixe o aperreio de lado e escute o que eu tô lhe dizendo: a força verdadeira tá na terra, na casca sagrada e nas ervas puras do nosso sertão! D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!"
  );
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_PRESETS[0].prompt);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptFormat, setScriptFormat] = useState('spot_radio');
  const [showAiModal, setShowAiModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick phrase insertion
  const handleInsertPhrase = (phrase: string) => {
    setText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return phrase;
      return `${trimmed} ${phrase}`;
    });
  };

  // Trigger TTS generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMsg('Por favor, digite ou selecione um texto para a locução.');
      return;
    }
    setErrorMsg(null);
    try {
      await onGenerateTTS(
        text,
        selectedVoice.voiceName,
        selectedStyle,
        `Locução: ${selectedVoice.name}`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao sintetizar o áudio. Tente novamente.');
    }
  };

  // AI Script generation via server endpoint
  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: scriptTopic || "Pau D'Arco, chás da terra e bem-estar natural",
          format: scriptFormat,
          tone: 'vibrante e acolhedor nordestino',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao gerar roteiro publicitário.');
      }

      const data = await res.json();
      if (data.script) {
        setText(data.script);
        setShowAiModal(false);
        setScriptTopic('');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao comunicar com a IA para criar roteiro.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Estimate speech duration based on ~130 words per minute
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-emerald-950/60 to-stone-900 border border-emerald-800/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Mic2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Locutor Brasileiro Nato da Região Nordeste</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Cabine de Locução <span className="text-amber-400">D'ARCO</span>
            </h1>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              Dê vida ao lema <strong className="text-amber-200">"Deixe a Natureza Cuidar de Você"</strong>{' '}
              com o ritmo cadenciado, a entonação acolhedora e as expressões autênticas da terra.
              Alimentado pelo modelo <code className="text-emerald-300 text-xs bg-stone-950 px-1.5 py-0.5 rounded border border-emerald-800/60">gemini-3.8-flash-tts</code>.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition-all border border-amber-400/30 hover:scale-102"
            >
              <Wand2 className="w-4 h-4" />
              <span>Roteirista Nordestino (IA)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-sm flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Aviso do Estúdio</p>
            <p className="text-rose-300/90 text-xs mt-0.5">{errorMsg}</p>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-rose-200 text-xs underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Editor & Expression Chips */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                <Feather className="w-4 h-4 text-amber-400" />
                <span>Texto do Roteiro para Locução</span>
              </label>

              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span>
                  Palavras: <strong className="text-stone-200">{wordCount}</strong>
                </span>
                <span>•</span>
                <span>
                  Tempo est.:{' '}
                  <strong className="text-emerald-400">~{estimatedSeconds}s</strong>
                </span>
              </div>
            </div>

            {/* Script Textarea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder="Escreva a fala do locutor ou clique nos botões abaixo para montar seu spot..."
                className="w-full bg-stone-950 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-4 text-stone-100 text-base leading-relaxed placeholder:text-stone-600 resize-none font-sans outline-none transition-colors"
              />
            </div>

            {/* Quick Regional Expression Badges */}
            <div className="space-y-2 pt-1 border-t border-stone-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Inserir Expressões Típicas Nordestinas:
                </span>
                <span className="text-[11px] text-stone-500">Clique para adicionar</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {REGIONAL_EXPRESSIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertPhrase(item.insert)}
                    className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-emerald-950/60 border border-stone-800 hover:border-emerald-500/50 text-xs font-medium text-amber-200/90 hover:text-emerald-300 transition-all hover:scale-105 active:scale-95"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Modifiers & Tone */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-3">
            <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Entonação & Estilo de Interpretação</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.prompt)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    selectedStyle === style.prompt
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-sm'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-300'
                  }`}
                >
                  <p className="font-semibold">{style.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Voice Selection & Action Trigger */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Escolha o Locutor D'ARCO</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400">
                {VOICES.length} Talentos
              </span>
            </div>

            <div className="space-y-2.5">
              {VOICES.map((voice) => {
                const isSelected = selectedVoice.id === voice.id;
                return (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-950/80 to-stone-900 border-emerald-500 text-white shadow-md'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200">
                        {voice.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
                        {voice.gender}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
                      {voice.tag}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {voice.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button & Live Visualizer */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
            <WaveformVisualizer isPlaying={isPlaying} isLoading={isLoading} />

            <button
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Sintetizando Voz Nordestina...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 fill-current" />
                  <span>SINTETIZAR VOZ NO AR</span>
                </>
              )}
            </button>

            {lastRecord && (
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400">Última locução gerada:</span>
                <button
                  onClick={() => onPlayRecord(lastRecord)}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ouvir Novamente</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Scriptwriter Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-stone-900 border border-emerald-800/60 rounded-2xl p-6 shadow-2xl space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    Roteirista Nordestino D'ARCO
                  </h3>
                  <p className="text-xs text-stone-400">
                    Crie spots e cordéis automáticos com alma sertaneja
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-stone-500 hover:text-stone-300 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Tema ou Produto Específico:
                </label>
                <input
                  type="text"
                  value={scriptTopic}
                  onChange={(e) => setScriptTopic(e.target.value)}
                  placeholder="Ex: Pau D'Arco para imunidade, alívio de dores, chá matinal..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Formato do Comercial:
                </label>
                <select
                  value={scriptFormat}
                  onChange={(e) => setScriptFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm focus:border-amber-500 outline-none"
                >
                  <option value="spot_radio">Spot de Rádio Popular (20-30 seg)</option>
                  <option value="cordel">Literatura de Cordel Rimada</option>
                  <option value="conversa_compadre">Conversa Acolhedora de Compadre e Comadre</option>
                  <option value="chamada_oferta">Chamada Promocional de Farmácia Natural</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300/90 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  O roteiro gerado incluirá expressões consagradas do Nordeste e finalizará
                  com o slogan clássico: <strong>"D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!"</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 disabled:opacity-50"
              >
                {isGeneratingScript ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Redigindo no Sertão...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gerar Roteiro Agora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

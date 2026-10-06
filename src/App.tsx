/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { StudioConsole } from './components/StudioConsole';
import { PresetLibrary } from './components/PresetLibrary';
import { ProductCatalog } from './components/ProductCatalog';
import { HistoryList } from './components/HistoryList';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AudioRecord, PresetSpot, DarcoProduct } from './types';
import { StudioAmbience } from './utils/audioPlayer';
import { PRESET_SPOTS } from './data/presets';

const STORAGE_KEY = 'darco_audio_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'presets' | 'products' | 'history'>('studio');
  const [history, setHistory] = useState<AudioRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<AudioRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ambienceActive, setAmbienceActive] = useState(false);
  const [studioInitialText, setStudioInitialText] = useState<string>('');

  const ambienceRef = useRef<StudioAmbience | null>(null);

  // Initialize background ambience controller
  useEffect(() => {
    ambienceRef.current = new StudioAmbience();
    return () => {
      ambienceRef.current?.stop();
    };
  }, []);

  // Toggle ambient acoustic chords
  const handleToggleAmbience = () => {
    if (!ambienceRef.current) return;
    if (ambienceActive) {
      ambienceRef.current.stop();
      setAmbienceActive(false);
    } else {
      ambienceRef.current.start(0.12);
      setAmbienceActive(true);
    }
  };

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AudioRecord[] = JSON.parse(stored);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentRecord(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage:', e);
    }
  }, []);

  // Save history to localStorage
  const saveRecordToHistory = (newRec: AudioRecord) => {
    setHistory((prev) => {
      const updated = [newRec, ...prev.filter((r) => r.id !== newRec.id)].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  // Core TTS invocation
  const handleGenerateTTS = async (
    text: string,
    voiceName: string,
    styleModifier: string,
    title = "Locução D'ARCO"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName,
          styleModifier,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Falha na requisição TTS (Status ${response.status})`
        );
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('Nenhum dado de áudio retornado pelo modelo gemini-3.8-flash-tts.');
      }

      const newRecord: AudioRecord = {
        id: `rec-${Date.now()}`,
        title,
        script: text,
        voiceName,
        styleModifier,
        audioBase64: data.audioBase64,
        mimeType: data.mimeType || 'audio/wav',
        createdAt: Date.now(),
      };

      saveRecordToHistory(newRecord);
      setCurrentRecord(newRecord);
      setIsPlaying(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Select spot from library
  const handleSelectSpot = (spot: PresetSpot, autoPlay: boolean) => {
    if (autoPlay) {
      handleGenerateTTS(
        spot.script,
        spot.suggestedVoice,
        spot.styleModifier,
        spot.title
      );
    } else {
      setStudioInitialText(spot.script);
      setActiveTab('studio');
    }
  };

  // Select product to create spot
  const handleGenerateProductSpot = (product: DarcoProduct) => {
    const tailoredScript = `Oxente meu povo! Você já conhece o poder do ${product.name} da D'ARCO? É o verdadeiro ${product.tagline}. Com ${product.benefits[0].toLowerCase()} e a pureza que só as ervas da nossa terra oferecem. D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!`;
    setStudioInitialText(tailoredScript);
    setActiveTab('studio');
  };

  // Audio player bar play/pause toggle
  const handlePlayToggle = () => {
    if (!currentRecord) return;
    setIsPlaying(!isPlaying);
  };

  const handlePlayRecord = (record: AudioRecord) => {
    if (currentRecord?.id === record.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentRecord(record);
      setIsPlaying(true);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (currentRecord?.id === id) {
      setCurrentRecord(null);
      setIsPlaying(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setCurrentRecord(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950 pb-28">
      {/* Navbar with brand identity and controls */}
      <Navbar
        isOnAir={isPlaying || isLoading}
        ambienceActive={ambienceActive}
        onToggleAmbience={handleToggleAmbience}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'studio' && (
          <StudioConsole
            onGenerateTTS={handleGenerateTTS}
            isLoading={isLoading}
            isPlaying={isPlaying}
            lastRecord={currentRecord}
            onPlayRecord={handlePlayRecord}
            initialText={studioInitialText}
          />
        )}

        {activeTab === 'presets' && (
          <PresetLibrary
            onSelectSpot={handleSelectSpot}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'products' && (
          <ProductCatalog
            onGenerateProductSpot={handleGenerateProductSpot}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'history' && (
          <HistoryList
            history={history}
            currentRecord={currentRecord}
            isPlaying={isPlaying}
            onPlayRecord={handlePlayRecord}
            onDeleteRecord={handleDeleteRecord}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-16 border-t border-stone-800/80 bg-stone-950/60 py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif font-bold text-stone-300 text-sm tracking-wide">
            D'ARCO — Deixe a Natureza Cuidar de Você
          </p>
          <p className="text-stone-400">
            Estúdio de Locução com Sotaque e Ritmo Cadenciado do Nordeste Brasileiro • Modelo Gemini 3.8 Flash TTS
          </p>
        </div>
      </footer>

      {/* Fixed Studio Audio Player */}
      <AudioPlayerBar
        currentRecord={currentRecord}
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}

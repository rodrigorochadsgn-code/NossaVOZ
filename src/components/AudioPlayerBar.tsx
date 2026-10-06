import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Gauge,
  Repeat,
  Radio,
  FileAudio,
} from 'lucide-react';
import { AudioRecord } from '../types';
import { downloadWav } from '../utils/audioPlayer';

interface AudioPlayerBarProps {
  currentRecord: AudioRecord | null;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onEnded: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentRecord,
  isPlaying,
  onPlayToggle,
  onEnded,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync audio source when currentRecord changes
  useEffect(() => {
    if (!currentRecord) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    const src = `data:${currentRecord.mimeType || 'audio/wav'};base64,${currentRecord.audioBase64}`;
    audio.src = src;
    audio.playbackRate = playbackRate;
    audio.volume = isMuted ? 0 : volume;
    audio.loop = isLoop;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(0);
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (!isLoop) {
        onEnded();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentRecord]);

  // Handle play/pause state change from parent
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Playback prevented:', err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle rate change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle loop change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  // Handle volume / mute change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch(console.error);
    }
  };

  const cycleRate = () => {
    const rates = [0.85, 1.0, 1.15, 1.25];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentRecord) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 border-t border-emerald-900/60 backdrop-blur-xl shadow-2xl text-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 md:max-w-xs">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-amber-700 flex items-center justify-center shrink-0 border border-emerald-500/40 shadow-inner">
              <Radio className="w-5 h-5 text-amber-200" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold truncate text-white">
                {currentRecord.title}
              </h4>
              <p className="text-xs text-amber-300/80 truncate">
                Voz: {currentRecord.voiceName} • Nordeste Brasileiro
              </p>
            </div>
          </div>

          {/* Center Playback Controls & Progress Bar */}
          <div className="flex-1 max-w-2xl flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-4">
              <button
                onClick={handleRestart}
                title="Reiniciar locução"
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onPlayToggle}
                className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                title={isPlaying ? 'Pausar' : 'Ouvir Locução'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setIsLoop(!isLoop)}
                title={isLoop ? 'Repetição ativada' : 'Repetir'}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLoop
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>

              <button
                onClick={cycleRate}
                title="Velocidade da voz"
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono font-medium text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-800"
              >
                <Gauge className="w-3 h-3 text-amber-400" />
                {playbackRate}x
              </button>
            </div>

            {/* Timeline Progress Bar */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[11px] font-mono text-stone-400 min-w-10 text-right">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 group flex items-center h-4">
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="text-[11px] font-mono text-stone-400 min-w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right Action Controls: Volume & Download */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            {/* Volume control */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-stone-400 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 accent-emerald-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Download WAV button */}
            <button
              onClick={() =>
                downloadWav(
                  currentRecord.audioBase64,
                  `darco-${currentRecord.voiceName.toLowerCase()}-${Date.now()}.wav`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-stone-200 text-xs font-medium transition-all"
              title="Baixar áudio da locução (.wav 24kHz)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baixar WAV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

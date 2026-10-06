export interface VoiceOption {
  id: string;
  name: string;
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  gender: 'Masc' | 'Fem';
  tag: string;
  description: string;
}

export interface PresetSpot {
  id: string;
  title: string;
  category: 'Institucional' | 'Sertanejo' | 'Cordel' | 'Promocional' | 'Saúde & Bem-Estar';
  durationEst: string;
  script: string;
  suggestedVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  styleModifier: string;
  description: string;
}

export interface DarcoProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  spotSeed: string;
  iconName: string;
  badge: string;
}

export interface AudioRecord {
  id: string;
  title: string;
  script: string;
  voiceName: string;
  styleModifier: string;
  audioBase64: string;
  mimeType: string;
  createdAt: number;
  duration?: number;
}

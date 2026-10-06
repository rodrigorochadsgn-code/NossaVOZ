import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for retrying transient errors (e.g. 503 / 429)
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1200): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isTransient =
        err?.status === 503 ||
        err?.code === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');
      if (attempt < retries && isTransient) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// TTS Endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Puck', styleModifier } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'O texto para locução é obrigatório.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no ambiente.',
      });
    }

    // Build the style directive embodying the northeastern announcer
    const defaultStyle =
      'Locutor de rádio brasileiro nato da região Nordeste. Fala em português do Brasil com entonação acolhedora, ritmo cadenciado, expressões e sotaque característicos do Nordeste brasileiro. Voz fluida, natural, carismática e envolvente.';

    const finalStyle = styleModifier
      ? `${defaultStyle} Variação de estilo: ${styleModifier}`
      : defaultStyle;

    // Call gemini-3.8-flash-tts with unary generation and automatic transient retry
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: finalStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
            },
          },
        },
      })
    );

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(
      (part: any) => part.inlineData && part.inlineData.data
    );

    const base64Audio = audioPart?.inlineData?.data;

    if (!base64Audio) {
      console.error('No audio returned in response:', JSON.stringify(response, null, 2));
      return res.status(502).json({
        error: 'Não foi possível sintetizar o áudio. Tente novamente em instantes.',
      });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: audioPart?.inlineData?.mimeType || 'audio/wav',
      voiceName,
      text: text.trim(),
    });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    const msg = error?.message || 'Erro ao processar síntese de voz com gemini-3.8-flash-tts.';
    res.status(500).json({
      error: msg.includes('high demand')
        ? 'O serviço de voz está com alta demanda momentânea. Por favor, tente novamente em alguns segundos.'
        : msg,
    });
  }
});

// Endpoint to generate scripts/spots for D'ARCO with Northeastern flavor
app.post('/api/generate-script', async (req, res) => {
  try {
    const { topic, format = 'spot_radio', tone = 'vibrante' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no ambiente.',
      });
    }

    const prompt = `Você é um redator publicitário e locutor tradicional do Nordeste brasileiro para a marca de fitoterápicos e produtos naturais "D'ARCO - Deixe a Natureza Cuidar de Você".

Crie um texto de locução em português do Brasil pronto para ser falado no rádio ou comercial.
Regras:
1. Sotaque, ritmo cadenciado e expressões nordestinas genuínas (ex.: "Oxente", "Vixe Maria", "Meu povo e minha gente", "Olhe praí", "Compadre", "Comadre", "Remédio puro da terra", "Deixe a natureza cuidar de você").
2. Termine ou destaque o slogan oficial com entusiasmo: "D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!"
3. Formato: ${format} (ex: spot de 15 a 30 segundos, cordel poético rimado, conversa de compadre acolhedora).
4. Tom desejado: ${tone}.
5. Tema/Produto: ${topic || 'Pau D\'Arco, chás da terra, pomadas e bem-estar natural'}.
6. Retorne APENAS o texto falado que o locutor lerá, sem rubricas de sonoplastia ou instruções entre parênteses, para que o leitor de voz sintetizada (TTS) leia perfeitamente.`;

    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      })
    );

    const scriptText = response.text || '';
    res.json({ script: scriptText.trim() });
  } catch (error: any) {
    console.error('Script generation error:', error);
    // Provide an authentic creative fallback script if AI text generation is temporarily unavailable
    const fallbackScript =
      `Oxente meu povo! O segredo pra viver com saúde tá na pura força da terra. O Pau D'Arco legítimo limpa o corpo, renova as energias e traz a tranquilidade que você merece. Venha conferir! D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!`;
    res.json({ script: fallbackScript });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`D'ARCO Radio & Voice Studio server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

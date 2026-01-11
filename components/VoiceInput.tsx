'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranscriptionTurn {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const encode = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const decode = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const createBlob = (data: Float32Array): { data: string; mimeType: string } => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
};

export default function VoiceInput({ onTranscript, isProcessing }: VoiceInputProps) {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionTurn[]>([]);

  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const startSession = async () => {
    try {
      const { GoogleGenAI, Modality, LiveServerMessage } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      let currentInput = '';
      let currentOutput = '';

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);

            sourceRef.current = source;
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const session = sessionRef.current;
              if (!session) return;
              try {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                session.sendRealtimeInput({ media: pcmBlob });
              } catch (err) {
                // Ignore errors when session is closed
              }
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              currentInput += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentOutput += message.serverContent.outputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const newTurns: TranscriptionTurn[] = [];
              if (currentInput) {
                newTurns.push({ role: 'user', text: currentInput, timestamp: Date.now() });
                onTranscript(currentInput);
                currentInput = '';
              }
              if (currentOutput) {
                newTurns.push({ role: 'assistant', text: currentOutput, timestamp: Date.now() });
                currentOutput = '';
              }
              if (newTurns.length > 0) {
                setTranscription(prev => [...prev, ...newTurns]);
              }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextOutRef.current) {
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => console.error("Live Error:", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'Vous êtes un assistant cognitif. Soyez bref et structuré.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  const stopSession = () => {
    // CRITICAL: Clear callback FIRST, then null session, then disconnect
    if (processorRef.current) {
      processorRef.current.onaudioprocess = null;
    }

    // Null session immediately to stop any pending callbacks
    const session = sessionRef.current;
    sessionRef.current = null;

    // Now safe to disconnect
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Stop media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close the session
    if (session) {
      session.close();
    }

    // Stop output audio sources
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();

    setIsActive(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isProcessing}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isActive
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isActive ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </button>
      </div>

      {transcription.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-60 overflow-y-auto space-y-2">
          {transcription.map((turn, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                turn.role === 'user'
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-xs font-semibold mb-1 text-gray-600">
                {turn.role === 'user' ? 'Vous' : 'Assistant'}
              </div>
              <p className="text-sm text-gray-900">{turn.text}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-gray-500">
        {isActive ? t.app.listening : t.app.startVoice}
      </p>
    </div>
  );
}

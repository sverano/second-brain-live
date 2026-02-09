'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Download, Trash2, Copy, Check, Clock, ChevronDown, ChevronUp, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData } from "@/utils/audioUtils";

interface TranscriptionTurn {
    role: 'user' | 'assistant';
    text: string;
    timestamp: number;
}

interface TranscriptionSession {
    id: string;
    title: string;
    turns: TranscriptionTurn[];
    createdAt: number;
    updatedAt: number;
}

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    isProcessing: boolean;
}

const STORAGE_KEY = 'voice-transcription-sessions';

export default function VoiceInput({ onTranscript, isProcessing }: VoiceInputProps) {
    const { t, locale } = useLanguage();
    const [isActive, setIsActive] = useState(false);
    const [transcription, setTranscription] = useState<TranscriptionTurn[]>([]);
    const [copied, setCopied] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [sessions, setSessions] = useState<TranscriptionSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>('');
    const [showHistory, setShowHistory] = useState(false);
    const [transcriptionOnly, setTranscriptionOnly] = useState(true); // Mode transcription par défaut

    // Refs pour gérer le lifecycle
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isClosingRef = useRef(false);
    const audioContextInRef = useRef<AudioContext | null>(null);
    const audioContextOutRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const sessionRef = useRef<any>(null);
    const currentInputRef = useRef<string>('');
    const currentOutputRef = useRef<string>('');
    const animationFrameRef = useRef<number | null>(null);

    const cleanup = useCallback(() => {
        isClosingRef.current = true;

        // Annuler l'animation de visualisation
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        setAudioLevel(0);

        // Sauvegarder la transcription partielle
        const newTurns: TranscriptionTurn[] = [];
        if (currentInputRef.current) {
            newTurns.push({
                role: 'user',
                text: currentInputRef.current,
                timestamp: Date.now()
            });
            onTranscript(currentInputRef.current);
            currentInputRef.current = '';
        }
        if (currentOutputRef.current) {
            newTurns.push({
                role: 'assistant',
                text: currentOutputRef.current,
                timestamp: Date.now()
            });
            currentOutputRef.current = '';
        }
        if (newTurns.length > 0) {
            setTranscription(prev => [...prev, ...newTurns]);
        }

        const session = sessionRef.current;
        const processor = processorRef.current;
        const source = sourceRef.current;
        const audioContextIn = audioContextInRef.current;
        const audioContextOut = audioContextOutRef.current;
        const stream = streamRef.current;

        sourcesRef.current.forEach(s => {
            try { s.stop(); } catch { /* ignore */ }
        });
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        sessionRef.current = null;

        setTimeout(() => {
            if (processor) {
                processor.onaudioprocess = null;
                try { processor.disconnect(); } catch { /* ignore */ }
                processorRef.current = null;
            }

            if (source) {
                try { source.disconnect(); } catch { /* ignore */ }
                sourceRef.current = null;
            }

            if (stream) {
                stream.getTracks().forEach(track => {
                    try { track.stop(); } catch { /* ignore */ }
                });
                streamRef.current = null;
            }

            if (audioContextIn && audioContextIn.state !== 'closed') {
                try { audioContextIn.close(); } catch { /* ignore */ }
                audioContextInRef.current = null;
            }

            if (audioContextOut && audioContextOut.state !== 'closed') {
                try { audioContextOut.close(); } catch { /* ignore */ }
                audioContextOutRef.current = null;
            }

            if (session) {
                try { session.close(); } catch { /* ignore */ }
            }

            setTimeout(() => {
                isClosingRef.current = false;
            }, 50);
        }, 100);
    }, [onTranscript]);

    const transcriptionOnlyRef = useRef(transcriptionOnly);

    // Synchroniser la ref avec le state
    useEffect(() => {
        transcriptionOnlyRef.current = transcriptionOnly;
    }, [transcriptionOnly]);

    const startSession = async () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            currentInputRef.current = '';
            currentOutputRef.current = '';

            // Configuration selon le mode
            const isTranscriptionMode = transcriptionOnlyRef.current;

            const systemInstruction = isTranscriptionMode
                ? (locale === 'fr'
                    ? 'Tu es un transcripteur silencieux. Tu écoutes et transcris ce qui est dit. Ne réponds JAMAIS vocalement. Ne fais aucun commentaire. Reste complètement silencieux.'
                    : 'You are a silent transcriber. You listen and transcribe what is said. NEVER respond vocally. Make no comments. Stay completely silent.')
                : (locale === 'fr'
                    ? 'Vous êtes un assistant cognitif. Soyez bref et structuré.'
                    : 'You are a cognitive assistant. Be brief and structured.');

            const session = await ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setIsActive(true);
                        const source = audioContextInRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);

                        sourceRef.current = source;
                        processorRef.current = scriptProcessor;
                        streamRef.current = stream;

                        scriptProcessor.onaudioprocess = (e) => {
                            if (isClosingRef.current || !sessionRef.current) {
                                return;
                            }

                            try {
                                const inputData = e.inputBuffer.getChannelData(0);

                                // Calculer le niveau audio pour la visualisation
                                let sum = 0;
                                for (let i = 0; i < inputData.length; i++) {
                                    sum += inputData[i] * inputData[i];
                                }
                                const rms = Math.sqrt(sum / inputData.length);
                                setAudioLevel(Math.min(rms * 10, 1));

                                const pcmBlob = createBlob(inputData);

                                if (!isClosingRef.current && sessionRef.current) {
                                    sessionRef.current.sendRealtimeInput({ media: pcmBlob });
                                }
                            } catch {
                                // Ignorer les erreurs
                            }
                        };

                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextInRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputRef.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const newTurns: TranscriptionTurn[] = [];
                            if (currentInputRef.current) {
                                newTurns.push({
                                    role: 'user',
                                    text: currentInputRef.current,
                                    timestamp: Date.now()
                                });
                                onTranscript(currentInputRef.current);
                                currentInputRef.current = '';
                            }
                            // En mode transcription, ignorer les réponses de l'assistant
                            if (currentOutputRef.current && !transcriptionOnlyRef.current) {
                                newTurns.push({
                                    role: 'assistant',
                                    text: currentOutputRef.current,
                                    timestamp: Date.now()
                                });
                            }
                            currentOutputRef.current = '';

                            if (newTurns.length > 0) {
                                setTranscription(prev => [...prev, ...newTurns]);
                            }
                        }

                        // Ne jouer l'audio que si on n'est PAS en mode transcription
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio && audioContextOutRef.current && !transcriptionOnlyRef.current) {
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
                    onerror: (e) => console.error("Live Error:", e),
                    onclose: () => setIsActive(false),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                    },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: systemInstruction
                }
            });

            sessionRef.current = session;
        } catch (err) {
            console.error("Failed to start session:", err);
            cleanup();
        }
    };

    const stopSession = () => {
        setIsActive(false);
        cleanup();
    };

    const clearTranscription = () => {
        setTranscription([]);
    };

    const copyToClipboard = async () => {
        const text = transcription.map(turn => `${turn.role === 'user' ? 'Vous' : 'Assistant'}: ${turn.text}`).join('\n\n');
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadTranscription = () => {
        const text = transcription.map(turn => `${turn.role === 'user' ? 'Vous' : 'Assistant'}: ${turn.text}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcription-${new Date().toISOString()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Gestion de la persistance
    const loadSessions = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const loadedSessions: TranscriptionSession[] = JSON.parse(stored);
                setSessions(loadedSessions);

                // Charger la dernière session active
                if (loadedSessions.length > 0) {
                    const lastSession = loadedSessions[0];
                    setCurrentSessionId(lastSession.id);
                    setTranscription(lastSession.turns);
                }
            } else {
                // Créer une nouvelle session par défaut
                createNewSession();
            }
        } catch (err) {
            console.error('Failed to load sessions:', err);
            createNewSession();
        }
    }, []);

    const saveSessions = useCallback((updatedSessions: TranscriptionSession[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
        } catch (err) {
            console.error('Failed to save sessions:', err);
        }
    }, []);

    const createNewSession = useCallback(() => {
        const newSession: TranscriptionSession = {
            id: `session-${Date.now()}`,
            title: `Session ${new Date().toLocaleString('fr-FR')}`,
            turns: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setTranscription([]);
        saveSessions([newSession, ...sessions]);
    }, [sessions, saveSessions]);

    const loadSession = useCallback((sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSessionId(sessionId);
            setTranscription(session.turns);
        }
    }, [sessions]);

    const deleteSession = useCallback((sessionId: string) => {
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        setSessions(updatedSessions);
        saveSessions(updatedSessions);

        if (sessionId === currentSessionId) {
            if (updatedSessions.length > 0) {
                loadSession(updatedSessions[0].id);
            } else {
                createNewSession();
            }
        }
    }, [sessions, currentSessionId, saveSessions, loadSession, createNewSession]);

    // Sauvegarder automatiquement la session courante
    useEffect(() => {
        if (currentSessionId && transcription.length > 0) {
            const updatedSessions = sessions.map(s =>
                s.id === currentSessionId
                    ? { ...s, turns: transcription, updatedAt: Date.now() }
                    : s
            );
            setSessions(updatedSessions);
            saveSessions(updatedSessions);
        }
    }, [transcription, currentSessionId]);

    // Charger les sessions au montage
    useEffect(() => {
        loadSessions();
    }, []);

    return (
        <div className="space-y-6">
            {/* Toggle Mode Transcription / Conversation */}
            <div className="flex justify-center">
                <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                    <button
                        onClick={() => setTranscriptionOnly(true)}
                        disabled={isActive}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                            ${transcriptionOnly
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                            }
                            ${isActive ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <VolumeX className="w-4 h-4" />
                        {locale === 'fr' ? 'Transcription' : 'Transcription'}
                    </button>
                    <button
                        onClick={() => setTranscriptionOnly(false)}
                        disabled={isActive}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                            ${!transcriptionOnly
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                            }
                            ${isActive ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <MessageSquare className="w-4 h-4" />
                        {locale === 'fr' ? 'Conversation' : 'Conversation'}
                    </button>
                </div>
            </div>

            {/* Description du mode */}
            <p className="text-center text-xs text-gray-500">
                {transcriptionOnly
                    ? (locale === 'fr'
                        ? "L'IA écoute silencieusement et transcrit (idéal pour réunions)"
                        : "AI listens silently and transcribes (ideal for meetings)")
                    : (locale === 'fr'
                        ? "L'IA répond vocalement à vos questions"
                        : "AI responds vocally to your questions")
                }
            </p>

            {/* Bouton principal avec visualisation audio */}
            <div className="relative flex flex-col items-center">
                <div className="relative">
                    {/* Cercles de visualisation audio */}
                    {isActive && (
                        <>
                            <div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-400 animate-pulse"
                                style={{
                                    transform: `scale(${1 + audioLevel * 0.3})`,
                                    opacity: audioLevel * 0.3,
                                    transition: 'transform 0.1s ease-out'
                                }}
                            />
                            <div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500"
                                style={{
                                    transform: `scale(${1 + audioLevel * 0.15})`,
                                    opacity: 0.2,
                                    transition: 'transform 0.1s ease-out'
                                }}
                            />
                        </>
                    )}

                    {/* Bouton micro */}
                    <button
                        onClick={isActive ? stopSession : startSession}
                        disabled={isProcessing}
                        className={`
                            relative w-32 h-32 rounded-full flex items-center justify-center
                            transition-all duration-300 shadow-2xl z-10
                            ${isActive
                                ? 'bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 scale-105'
                                : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                            active:scale-95
                        `}
                    >
                        {isActive ? (
                            <MicOff className="w-14 h-14 text-white drop-shadow-lg" />
                        ) : (
                            <Mic className="w-14 h-14 text-white drop-shadow-lg" />
                        )}
                    </button>
                </div>

                {/* Statut */}
                <p className={`
                    mt-6 text-sm font-medium transition-all duration-300
                    ${isActive ? 'text-red-600 animate-pulse' : 'text-gray-500'}
                `}>
                    {isActive ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {t.app.listening}
                        </span>
                    ) : (
                        t.app.startVoice
                    )}
                </p>
            </div>

            {/* Transcription avec actions */}
            {transcription.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* En-tête avec actions */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Transcription ({transcription.length})
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 rounded-lg hover:bg-white/60 transition-colors group"
                                title="Copier"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                                )}
                            </button>
                            <button
                                onClick={downloadTranscription}
                                className="p-2 rounded-lg hover:bg-white/60 transition-colors group"
                                title="Télécharger"
                            >
                                <Download className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                            </button>
                            <button
                                onClick={clearTranscription}
                                className="p-2 rounded-lg hover:bg-white/60 transition-colors group"
                                title="Effacer"
                            >
                                <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                            </button>
                        </div>
                    </div>

                    {/* Liste des messages */}
                    <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                        {transcription.map((turn, i) => (
                            <div
                                key={i}
                                className={`
                                    p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                                    ${turn.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200 ml-8'
                                        : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 mr-8'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`
                                        w-2 h-2 rounded-full
                                        ${turn.role === 'user' ? 'bg-indigo-500' : 'bg-purple-500'}
                                    `} />
                                    <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                                        {turn.role === 'user' ? 'Vous' : 'Assistant'}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {new Date(turn.timestamp).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-800">
                                    {turn.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

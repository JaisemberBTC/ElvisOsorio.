import React, { useState, useRef, useEffect } from 'react';
import { 
  HeartHandshake, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  BookOpen, 
  Flame,
  RotateCcw
} from 'lucide-react';
import { ChatMessage } from '../types';
import { DevotionalReader } from '../utils/audioSynth';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: '¡Paz y gracia de Dios para tu vida! Soy tu Consejero Bíblico y Acompañante de Oración. Cuéntame qué hay en tu corazón hoy o qué situación estás atravesando. Estoy aquí para escucharte, compartir versículos de esperanza y orar contigo.',
    timestamp: 'Ahora'
  }
];

const SUGGESTIONS = [
  "Siento mucha ansiedad por el futuro, ¿qué me dice la Biblia?",
  "Necesito una oración de sanidad para un familiar enfermo",
  "¿Cómo puedo perdonar a alguien que me lastimó profundamente?",
  "Me siento desanimado espiritualmente, ¿cómo renovar mi fe?",
  "Una oración de agradecimiento y bendición para mi hogar"
];

export const BiblicalCounselor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/biblical-counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error("Error en el consejero espiritual");
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Que la paz de Dios que sobrepasa todo entendimiento guarde tu corazón en Cristo Jesús.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...newHistory, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: 'Hubo una dificultad de conexión temporal, pero recuerda: "Jehová es mi pastor; nada me faltará" (Salmo 23:1). Por favor intenta de nuevo en unos segundos.',
        timestamp: 'Ahora'
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeakMessage = (msgId: string, text: string) => {
    if (readingId === msgId) {
      DevotionalReader.stop();
      setReadingId(null);
    } else {
      setReadingId(msgId);
      DevotionalReader.speak(text, {
        onEnd: () => setReadingId(null)
      });
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    DevotionalReader.stop();
    setReadingId(null);
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Counselor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shadow-inner">
            🕊️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-cinzel">
                Consejero Pastoral & Acompañante de Fe
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Escucha empática, guía fundamentada en las Sagradas Escrituras y oraciones personalizadas.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reiniciar conversación"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Nueva Consulta</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl min-h-[420px] max-h-[560px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  isUser
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 border border-white/10 text-amber-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 sm:p-5 rounded-2xl max-w-lg space-y-2 leading-relaxed text-sm backdrop-blur-sm ${
                  isUser
                    ? 'bg-amber-500/15 text-slate-100 border border-amber-500/30 rounded-tr-none shadow-sm'
                    : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line font-sans text-xs sm:text-sm">
                  {msg.content}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSpeakMessage(msg.id, msg.content)}
                        className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Escuchar locución"
                      >
                        {readingId === msg.id ? (
                          <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
                        ) : (
                          <VolumeX className="w-3 h-3" />
                        )}
                        <span>{readingId === msg.id ? 'Pausar' : 'Escuchar'}</span>
                      </button>

                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="hover:text-amber-300 transition-colors cursor-pointer"
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Buscando en la sabiduría de las Escrituras y orando por ti...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiries */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400">
          💡 Preguntas u oraciones frecuentes:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-900/40 hover:bg-amber-400/15 text-slate-300 hover:text-amber-200 border border-white/5 hover:border-amber-400/30 transition-all text-left disabled:opacity-50 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-xl flex items-center gap-2">
        <textarea
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Escribe tu motivo de oración, pregunta bíblica o inquietud..."
          className="flex-1 px-4 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none font-sans"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
          className="p-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
          title="Enviar mensaje"
        >
          <Send className="w-4 h-4 text-slate-950" />
        </button>
      </div>

    </div>
  );
};

import { useState, useRef, useEffect } from 'react';
import { sound } from '@/lib/audioEngine';
import {
  Send,
  Terminal,
  Bot,
  User,
  Sparkles,
  Volume2,
  Download,
  Trash2,
  Check,
  Copy,
  Cpu,
  Shield,
  Palette,
  Layers
} from 'lucide-react';

interface AgentPersona {
  id: string;
  name: string;
  role: string;
  avatar: typeof Bot;
  color: string;
  systemGreeting: string;
}

const AGENT_PERSONAS: AgentPersona[] = [
  {
    id: 'architect',
    name: 'Architect Prime',
    role: 'Autonomous System Architect',
    avatar: Layers,
    color: '#6366f1',
    systemGreeting: 'Architect Prime online. Neural cluster topology verified. Ready to synthesize next-generation spatial computing systems.'
  },
  {
    id: 'coder',
    name: 'Quantum Coder',
    role: 'Compiler & Shader Engineer',
    avatar: Cpu,
    color: '#06b6d4',
    systemGreeting: 'Quantum Coder active. Zero-latency TypeScript/React compilers primed. Ready for AST generation.'
  },
  {
    id: 'creative',
    name: 'Creative Synthesizer',
    role: 'Generative UI & Sonic Designer',
    avatar: Palette,
    color: '#ec4899',
    systemGreeting: 'Creative Synthesizer initialized. Spatial color fields and procedural Web Audio buffers synchronized.'
  },
  {
    id: 'sentinel',
    name: 'Security Sentinel',
    role: 'Zero-Trust Auditor',
    avatar: Shield,
    color: '#10b981',
    systemGreeting: 'Security Sentinel watching. Threat vector scans running at 0ms overhead. All memory pipelines secured.'
  }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentId?: string;
  text: string;
  timestamp: string;
  tokens?: number;
}

export function AgentTerminal() {
  const [selectedAgent, setSelectedAgent] = useState<AgentPersona>(AGENT_PERSONAS[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      agentId: AGENT_PERSONAS[0].id,
      text: AGENT_PERSONAS[0].systemGreeting,
      timestamp: '20:00:00',
      tokens: 22
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'Synthesize a 3D glassmorphic HUD component',
    'Benchmark neural pipeline token latency',
    'Generate procedural audio synth algorithm',
    'Audit zero-trust memory boundary security'
  ];

  // Speech synthesis speaker
  const speakText = (text: string) => {
    sound.playClick(800);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isStreaming) return;

    sound.playLaser();
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // Simulate Agent Thinking & Streaming Response
    const responsePayloads: Record<string, string> = {
      architect: `[ARCHITECTURAL SYNTHESIS]\nAnalyzing requirements: "${query}"...\n\n1. **Core Topology**: Micro-frontend pipeline with reactive state isolation.\n2. **Performance Target**: sub-16ms render loop with GPU hardware acceleration.\n3. **Scalability**: Distributed state sync using WebSockets & SharedArrayBuffer.\n\n*System recommendation: Pipeline deployment ready on Edge Cluster.*`,
      coder: `\`\`\`typescript\n// Generated optimized kernel\nexport function computeQuantumMesh(vertices: Float32Array, alpha: number) {\n  'use simd';\n  for (let i = 0; i < vertices.length; i += 3) {\n    vertices[i] += Math.sin(vertices[i + 1] * 0.05) * alpha;\n    vertices[i + 2] += Math.cos(vertices[i] * 0.05) * alpha;\n  }\n  return vertices;\n}\n\`\`\`\n*AST Compilation complete. 0 lint issues detected.*`,
      creative: `[CREATIVE SPECIFICATION]\n• **Color Field**: Deep Void (#090a0f) with Quantum Violet accents (#6366f1)\n• **Motion Physics**: Spring dampening (stiffness: 280, damping: 24)\n• **Sonic Envelope**: Procedural 520Hz triangle oscillator with subtle 0.3s reverb tail.`,
      sentinel: `[SECURITY AUDIT REPORT]\n✓ Zero-trust envelope verified.\n✓ CSP headers enforced: strict-dynamic.\n✓ Memory buffer leak test: PASSED (0 bytes residual).\n✓ Vulnerability count: 0 (All dependencies pinned & validated).`
    };

    const fullResponse =
      responsePayloads[selectedAgent.id] ||
      `Synthesized response for query: "${query}". Neural weights optimized at 99.4% confidence.`;

    // Stream the response character by character
    const agentMsgId = `agent-${Date.now()}`;
    const initialAgentMsg: ChatMessage = {
      id: agentMsgId,
      sender: 'agent',
      agentId: selectedAgent.id,
      text: '',
      timestamp: new Date().toLocaleTimeString(),
      tokens: Math.round(fullResponse.length / 4)
    };

    setMessages((prev) => [...prev, initialAgentMsg]);

    let charIdx = 0;
    const streamInterval = setInterval(() => {
      charIdx += 4;
      if (charIdx <= fullResponse.length) {
        const partial = fullResponse.slice(0, charIdx);
        setMessages((prev) =>
          prev.map((m) => (m.id === agentMsgId ? { ...m, text: partial } : m))
        );
        sound.playClick(750, 0.02);
      } else {
        clearInterval(streamInterval);
        setMessages((prev) =>
          prev.map((m) => (m.id === agentMsgId ? { ...m, text: fullResponse } : m))
        );
        setIsStreaming(false);
        sound.playChime(600);
      }
    }, 25);
  };

  const handleCopyMessage = (id: string, text: string) => {
    sound.playClick(600);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportChat = () => {
    sound.playChime(500);
    const content = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.sender.toUpperCase()} (${m.agentId || 'User'}):\n${m.text}\n`
      )
      .join('\n---\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-terminal-session-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearChat = () => {
    sound.playClick(300);
    setMessages([]);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Autonomous Intelligence Core
            </span>
            <span className="text-xs text-muted-foreground font-mono">4 Active Agent Personas</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            AETHER Multi-Agent Command Terminal
          </h2>
          <p className="text-sm text-muted-foreground">
            Collaborate with specialized autonomous agents, execute prompts, stream token responses, and listen via speech synthesis.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportChat}
            className="p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-white/10 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export Markdown Transcript"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-white/10 text-xs transition-all cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Persona Selector + Chat View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Agent Personas List (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
            <Bot className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Select Active Persona</h3>
          </div>

          {AGENT_PERSONAS.map((persona) => {
            const Icon = persona.avatar;
            const isSelected = selectedAgent.id === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  sound.playClick(600);
                  setSelectedAgent(persona);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-card border-primary ring-2 ring-primary/30 shadow-lg'
                    : 'bg-card/50 border-white/5 hover:border-white/20 hover:bg-card/80'
                }`}
              >
                <div
                  style={{ backgroundColor: `${persona.color}20`, borderColor: `${persona.color}50` }}
                  className="p-2 rounded-lg border text-foreground"
                >
                  <Icon style={{ color: persona.color }} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground truncate">
                      {persona.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground block truncate">
                    {persona.role}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Quick Preset Prompts */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
            <span className="text-xs font-mono text-muted-foreground">Quick Action Directives:</span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-muted-foreground hover:text-foreground border border-white/5 transition-all cursor-pointer flex items-center justify-between group"
              >
                <span className="truncate">{prompt}</span>
                <Sparkles className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Feed & Input Area (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between min-h-[550px]">
          
          {/* Top Bar with selected persona info */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-primary" />
              <div>
                <span className="text-xs font-bold text-foreground">
                  {selectedAgent.name}
                </span>
                <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                  Channel: #live-stream
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Online
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 max-h-[380px] custom-scrollbar mb-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const persona = AGENT_PERSONAS.find((p) => p.id === msg.agentId) || selectedAgent;
              const Icon = isUser ? User : persona.avatar;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    style={{
                      backgroundColor: isUser ? '#3b82f620' : `${persona.color}20`,
                      borderColor: isUser ? '#3b82f650' : `${persona.color}50`
                    }}
                    className="p-2 rounded-xl border flex-shrink-0"
                  >
                    <Icon
                      style={{ color: isUser ? '#60a5fa' : persona.color }}
                      className="w-4 h-4"
                    />
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border ${
                      isUser
                        ? 'bg-primary/20 border-primary/30 text-foreground rounded-tr-none'
                        : 'bg-card/90 border-white/10 text-foreground rounded-tl-none shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] font-mono text-muted-foreground border-b border-white/5 pb-1">
                      <span className="font-bold">
                        {isUser ? 'You' : persona.name}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {!isUser && msg.text && (
                      <div className="flex items-center justify-end gap-2 mt-2 pt-1.5 border-t border-white/5 text-[10px]">
                        <button
                          onClick={() => speakText(msg.text)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                          title="Read Aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Speak</span>
                        </button>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              type="text"
              placeholder={`Send directive to ${selectedAgent.name}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isStreaming}
              className="flex-1 px-4 py-3 rounded-xl bg-background/60 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-xs"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isStreaming || !inputMessage.trim()}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isStreaming || !inputMessage.trim()
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary hover:opacity-90 text-primary-foreground shadow-lg'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { sound } from '@/lib/audioEngine';
import {
  Play,
  RotateCcw,
  Plus,
  Sliders,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Shield,
  Volume2,
  CheckCircle2,
  Share2,
  Loader2
} from 'lucide-react';

export interface WorkflowNode {
  id: string;
  title: string;
  type: 'input' | 'llm' | 'tool' | 'audio' | 'guardrail' | 'output';
  x: number;
  y: number;
  status: 'idle' | 'running' | 'success' | 'error';
  params: {
    model?: string;
    temperature?: number;
    prompt?: string;
    latencyMs?: number;
    audioFreq?: number;
    threshold?: number;
  };
  outputPreview?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

const DEFAULT_NODES: WorkflowNode[] = [
  {
    id: 'node-1',
    title: 'User Prompt Intent',
    type: 'input',
    x: 40,
    y: 120,
    status: 'idle',
    params: {
      prompt: 'Synthesize an interactive 3D spatial interface with audio synthesis.'
    },
    outputPreview: 'Query payload prepared [Tokens: 24]'
  },
  {
    id: 'node-2',
    title: 'Gemini 3.7 Reasoning Core',
    type: 'llm',
    x: 320,
    y: 60,
    status: 'idle',
    params: {
      model: 'gemini-3.7-flash',
      temperature: 0.7,
      latencyMs: 140
    },
    outputPreview: 'Generated neural architecture blueprint & shaders.'
  },
  {
    id: 'node-3',
    title: 'Audio Synth Weaver',
    type: 'audio',
    x: 320,
    y: 280,
    status: 'idle',
    params: {
      audioFreq: 440,
      latencyMs: 65
    },
    outputPreview: 'Oscillator buffers & harmonic envelopes loaded.'
  },
  {
    id: 'node-4',
    title: 'Autonomous Code Synthesizer',
    type: 'tool',
    x: 620,
    y: 80,
    status: 'idle',
    params: {
      model: 'TypeScript / React AST Engine',
      latencyMs: 220
    },
    outputPreview: 'Compiled 4 UI components & zero-latency canvas.'
  },
  {
    id: 'node-5',
    title: 'Quantum Guardrail & Audit',
    type: 'guardrail',
    x: 620,
    y: 290,
    status: 'idle',
    params: {
      threshold: 0.99,
      latencyMs: 45
    },
    outputPreview: 'Audit score: 100% (0 vulnerabilities, 0 memory leaks)'
  },
  {
    id: 'node-6',
    title: 'Spatial Canvas Render Output',
    type: 'output',
    x: 920,
    y: 180,
    status: 'idle',
    params: {
      latencyMs: 20
    },
    outputPreview: 'Pipeline stream finalized. 60 FPS live viewport active.'
  }
];

const DEFAULT_CONNECTIONS: Connection[] = [
  { id: 'c1', from: 'node-1', to: 'node-2' },
  { id: 'c2', from: 'node-1', to: 'node-3' },
  { id: 'c3', from: 'node-2', to: 'node-4' },
  { id: 'c4', from: 'node-3', to: 'node-5' },
  { id: 'c5', from: 'node-4', to: 'node-6' },
  { id: 'c6', from: 'node-5', to: 'node-6' }
];

export function WorkflowStudio() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(DEFAULT_NODES);
  const [connections] = useState<Connection[]>(DEFAULT_CONNECTIONS);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(nodes[1]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Workflow pipeline loaded with 6 neural nodes.',
    '[SYSTEM] Ready for execution stream.'
  ]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Run pipeline simulation step by step
  const handleRunPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    sound.playLaser();
    setLogs((prev) => [...prev, `[PIPELINE] Starting execution at ${new Date().toLocaleTimeString()}...`]);

    // Reset node states
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));

    const executionOrder = ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6'];

    for (let i = 0; i < executionOrder.length; i++) {
      const nodeId = executionOrder[i];
      setActiveStep(i);

      // Set node to running
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'running' } : n))
      );
      sound.playClick(400 + i * 100);

      // Simulate node processing latency
      await new Promise((res) => setTimeout(res, 600));

      // Set node to success
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'success' } : n))
      );
      sound.playChime(500 + i * 80);

      const target = nodes.find((n) => n.id === nodeId);
      setLogs((prev) => [
        ...prev,
        `[✓ SUCCESS] ${target?.title}: ${target?.outputPreview || 'Processed successfully.'}`
      ]);
    }

    sound.playDrum('synth');
    setLogs((prev) => [...prev, `[PIPELINE] All nodes executed successfully in 3.6s.`]);
    setIsRunning(false);
    setActiveStep(-1);
  };

  const handleReset = () => {
    sound.playClick(300);
    setNodes(DEFAULT_NODES);
    setLogs(['[SYSTEM] Pipeline reset to default state.']);
    setActiveStep(-1);
  };

  // Node Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
    e.stopPropagation();
    setSelectedNode(node);
    sound.playClick(700);
    setDraggingNodeId(node.id);
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(1000, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(10, Math.min(480, e.clientY - rect.top - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
    }
  };

  // Add custom node
  const handleAddNode = () => {
    sound.playClick(600);
    const id = `node-${Date.now().toString().slice(-4)}`;
    const newNode: WorkflowNode = {
      id,
      title: 'Neural Transformer Branch',
      type: 'llm',
      x: 450 + (Math.random() - 0.5) * 100,
      y: 200 + (Math.random() - 0.5) * 80,
      status: 'idle',
      params: {
        model: 'gemini-3.7-flash',
        temperature: 0.5
      },
      outputPreview: 'Branch payload synthesized.'
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode);
    setLogs((prev) => [...prev, `[NODE ADDED] Created new node: ${newNode.title}`]);
  };

  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'input':
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'llm':
        return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'tool':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'audio':
        return <Volume2 className="w-4 h-4 text-emerald-400" />;
      case 'guardrail':
        return <Shield className="w-4 h-4 text-cyan-400" />;
      case 'output':
        return <Layers className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20">
              Interactive Node Canvas
            </span>
            <span className="text-xs text-muted-foreground font-mono">6 Nodes Connected</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Neural Workflow &amp; Pipeline Studio
          </h2>
          <p className="text-sm text-muted-foreground">
            Drag nodes to rearrange, adjust hyper-parameters, and simulate real-time AI execution pipelines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddNode}
            className="px-3.5 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>Add Node</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs border border-white/10 transition-all cursor-pointer"
            title="Reset Pipeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isRunning
                ? 'bg-primary/50 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Canvas + Parameter Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Node Graph Visualizer (8 cols) */}
        <div
          ref={canvasContainerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-8 relative min-h-[520px] rounded-2xl glass-panel border border-white/10 overflow-hidden select-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]"
        >
          {/* SVG Connection Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {connections.map((c) => {
              const fromNode = nodes.find((n) => n.id === c.from);
              const toNode = nodes.find((n) => n.id === c.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 180;
              const y1 = fromNode.y + 40;
              const x2 = toNode.x;
              const y2 = toNode.y + 40;
              const dx = Math.abs(x2 - x1) * 0.5;

              const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <g key={c.id}>
                  {/* Background link line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="2"
                  />
                  {/* Active animated curve */}
                  {isRunning && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="url(#curveGradient)"
                      strokeWidth="3"
                      strokeDasharray="6, 6"
                      className="animate-[dash_1s_linear_infinite]"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render draggable Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute w-52 p-3.5 rounded-xl border backdrop-blur-xl cursor-grab active:cursor-grabbing transition-shadow z-10 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 shadow-xl bg-card/90'
                    : 'border-white/10 hover:border-white/30 bg-card/70'
                } ${
                  node.status === 'running'
                    ? 'border-amber-400 ring-2 ring-amber-400/50 animate-pulse'
                    : node.status === 'success'
                    ? 'border-emerald-500/80 shadow-emerald-500/20'
                    : ''
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {getNodeIcon(node.type)}
                    <span className="text-xs font-bold truncate text-foreground">
                      {node.title}
                    </span>
                  </div>
                  {node.status === 'running' && (
                    <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                  )}
                  {node.status === 'success' && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  )}
                </div>

                {/* Node Sub-text / Output */}
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-mono">
                  {node.outputPreview || 'Node configured.'}
                </p>

                {/* Port Sockets */}
                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/5 text-[10px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> IN
                  </span>
                  <span className="flex items-center gap-1">
                    OUT <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Parameter Inspector & Live Terminal (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Selected Node Inspector */}
          {selectedNode ? (
            <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Node Hyper-Parameters</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {selectedNode.id}
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Node Title</label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedNode({ ...selectedNode, title: val });
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, title: val } : n))
                      );
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                {selectedNode.params.temperature !== undefined && (
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>Temperature</span>
                      <span className="font-mono text-foreground font-bold">{selectedNode.params.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={selectedNode.params.temperature}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSelectedNode({
                          ...selectedNode,
                          params: { ...selectedNode.params, temperature: val }
                        });
                      }}
                      className="w-full accent-primary"
                    />
                  </div>
                )}

                {selectedNode.params.prompt !== undefined && (
                  <div>
                    <label className="text-muted-foreground block mb-1 font-medium">Prompt Payload</label>
                    <textarea
                      rows={3}
                      value={selectedNode.params.prompt}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedNode({
                          ...selectedNode,
                          params: { ...selectedNode.params, prompt: val }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-primary text-xs resize-none"
                    />
                  </div>
                )}

                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-[11px] font-mono text-primary font-semibold mb-1">
                    Output Snapshot:
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {selectedNode.outputPreview || 'No output recorded.'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl glass-panel border border-white/10 text-center text-muted-foreground text-xs">
              Click a node on the canvas to inspect parameters.
            </div>
          )}

          {/* Live Execution Stream */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-foreground">Execution Telemetry</h3>
              </div>
              <div className="flex items-center gap-2">
                {activeStep >= 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                    Step {activeStep + 1}/6
                  </span>
                )}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            <div className="h-44 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 pr-2 custom-scrollbar text-muted-foreground">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-1 rounded ${
                    log.includes('SUCCESS')
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : log.includes('PIPELINE')
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Search,
  Server,
  CheckCircle,
  Code,
  Cpu,
  Moon,
  Sun,
  RefreshCw,
  Terminal,
  Database,
  ArrowRight,
  Sparkles
} from "lucide-react"

interface MCPTool {
  name: string;
  description: string;
  parameters: string[];
  category: "Discovery" | "Inspection" | "Integration" | "Verification";
}

const MCP_TOOLS: MCPTool[] = [
  {
    name: "get_project_registries",
    description: "Get configured registry names from components.json. Returns error if no components.json exists.",
    parameters: [],
    category: "Discovery"
  },
  {
    name: "list_items_in_registries",
    description: "List items/components from configured registries (e.g., @shadcn, @acme). Filters by item type.",
    parameters: ["registries (optional)", "types (optional)", "limit (optional)", "offset (optional)"],
    category: "Discovery"
  },
  {
    name: "search_items_in_registries",
    description: "Search for components in registries using fuzzy matching against names and descriptions.",
    parameters: ["query (required)", "registries (optional)", "types (optional)", "limit (optional)"],
    category: "Discovery"
  },
  {
    name: "view_items_in_registries",
    description: "View detailed information about specific registry items including their name, description, type, and source file content.",
    parameters: ["items (required - prefixed with registry name, e.g., @shadcn/button)"],
    category: "Inspection"
  },
  {
    name: "get_item_examples_from_registries",
    description: "Find usage examples and demos with their complete code (e.g., accordion-demo, button-demo).",
    parameters: ["query (required)", "registries (optional)"],
    category: "Inspection"
  },
  {
    name: "get_add_command_for_items",
    description: "Get the shadcn CLI add command for specific items in a registry.",
    parameters: ["items (required - prefixed with registry name, e.g., @shadcn/card)"],
    category: "Integration"
  },
  {
    name: "get_audit_checklist",
    description: "Run a quick checklist verification to ensure all newly created components are working as expected.",
    parameters: [],
    category: "Verification"
  }
];

export function TestComponent() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTool, setSelectedTool] = useState<MCPTool>(MCP_TOOLS[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    "MCP server initialized on port 3000...",
    "Found 61 items in registry @shadcn",
    "Loaded components.json successfully."
  ])

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setLogs((prev) => [...prev, "Syncing with shadcn registry..."])
    setTimeout(() => {
      setIsRefreshing(false)
      setLogs((prev) => [...prev, `Successfully synced. 61 items cached.`])
    }, 1500)
  }

  const runSimulatedTool = (toolName: string) => {
    setLogs((prev) => [...prev, `Executing tool: ${toolName}...`])
    setTimeout(() => {
      if (toolName === "get_project_registries") {
        setLogs((prev) => [...prev, `Response: ["@shadcn"]`])
      } else if (toolName === "get_add_command_for_items") {
        setLogs((prev) => [...prev, `Response: "npx shadcn@latest add card"`])
      } else if (toolName === "get_audit_checklist") {
        setLogs((prev) => [
          ...prev,
          `Response: ✓ button.tsx valid, ✓ card.tsx valid. Build succeeded.`
        ])
      } else {
        setLogs((prev) => [...prev, `Response: Success. (Simulated return values)`])
      }
    }, 800)
  }

  const filteredTools = MCP_TOOLS.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryIcon = (category: MCPTool["category"]) => {
    switch (category) {
      case "Discovery":
        return <Search className="w-4 h-4 text-violet-500" />
      case "Inspection":
        return <Code className="w-4 h-4 text-indigo-500" />
      case "Integration":
        return <Database className="w-4 h-4 text-pink-500" />
      case "Verification":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 antialiased p-6 sm:p-12 font-sans selection:bg-violet-500/30">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-3xl -z-10 animate-pulse duration-[10s]"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full filter blur-3xl -z-10 animate-pulse duration-[8s]"></div>

      {/* Header section */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-border/40 pb-8 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Shadcn &amp; MCP Integration
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Model Context Protocol Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Exploring exposed registry tools and shadcn/ui components in your local workspace.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 font-medium border-border/60 hover:bg-accent/40"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-violet-500" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sync MCP</span>
          </Button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Server Status & Tool Explorer */}
        <section className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Server Status Card */}
          <Card className="border-border/40 backdrop-blur-md bg-card/40 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-teal-500"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Server className="w-5 h-5 text-emerald-500" />
                  <span>shadcn-mcp-server</span>
                </CardTitle>
                <CardDescription className="mt-1">
                  Local process running on `npx shadcn@latest mcp`
                </CardDescription>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Active
              </span>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 dark:bg-black/40 rounded-lg p-3.5 border border-border/30 font-mono text-[13px] leading-relaxed text-muted-foreground">
                <div className="flex justify-between border-b border-border/20 pb-1.5 mb-1.5">
                  <span className="text-violet-400 font-semibold">Command:</span>
                  <span>npx shadcn@latest mcp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-400 font-semibold">Client:</span>
                  <span>VS Code (.vscode/mcp.json)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools List Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">Exposed MCP Tools</h2>
              
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-full rounded-md border border-border/60 bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Scrollable Tools Grid */}
            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <div
                    key={tool.name}
                    onClick={() => setSelectedTool(tool)}
                    className={`group/item text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedTool.name === tool.name
                        ? "bg-violet-500/5 border-violet-500 dark:border-violet-500/70 shadow-sm"
                        : "bg-card hover:bg-accent/40 border-border/40 hover:border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="font-semibold text-sm group-hover/item:text-violet-500 transition-colors flex items-center gap-2">
                        <Cpu className={`w-4 h-4 ${selectedTool.name === tool.name ? "text-violet-500" : "text-muted-foreground"}`} />
                        {tool.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/20">
                        {getCategoryIcon(tool.category)}
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-border/60 rounded-xl bg-card/20">
                  <Cpu className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No MCP tools match your query.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Tool Details & Console Log */}
        <section className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Detailed View Card */}
          <Card className="border-border/40 backdrop-blur-md bg-card/40 shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-border/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-violet-500 uppercase tracking-widest flex items-center gap-1.5">
                    {getCategoryIcon(selectedTool.category)}
                    {selectedTool.category} Tool
                  </span>
                </div>
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                  {selectedTool.name}
                </CardTitle>
                <CardDescription className="text-xs mt-1.5 leading-relaxed">
                  {selectedTool.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-5 flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-500" /> Input Parameters
                  </h4>
                  {selectedTool.parameters.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {selectedTool.parameters.map((param) => {
                        const isRequired = param.includes("required");
                        return (
                          <li
                            key={param}
                            className="text-xs font-mono bg-muted/60 dark:bg-black/30 border border-border/20 px-2.5 py-1.5 rounded flex justify-between items-center"
                          >
                            <span>{param.split(" ")[0]}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.25 rounded font-sans font-bold ${
                                isRequired
                                  ? "bg-pink-500/10 text-pink-500 border border-pink-500/20"
                                  : "bg-muted text-muted-foreground border border-border"
                              }`}
                            >
                              {isRequired ? "required" : "optional"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No input parameters required.</p>
                  )}
                </div>
              </CardContent>
            </div>

            <CardFooter className="border-t border-border/30 bg-muted/30 dark:bg-black/10 flex items-center justify-between gap-4 py-3">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-violet-500" />
                Response is standard JSON-RPC
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={() => runSimulatedTool(selectedTool.name)}
                className="bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-1.5 h-8 text-xs font-medium"
              >
                <span>Run Query</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Console Log Simulator */}
          <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                <Terminal className="w-4 h-4 text-violet-400" />
                <span>Console Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/90 dark:bg-black/60 text-slate-300 font-mono text-xs rounded-lg p-4 border border-border/20 h-44 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-slate-500 select-none">[{i + 1}]</span>
                    <span className={log.startsWith("Response:") ? "text-emerald-400" : log.startsWith("Error:") ? "text-pink-400" : "text-slate-300"}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </main>

      {/* Footer info about Installed components */}
      <footer className="max-w-7xl mx-auto border-t border-border/40 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/80">
        <p className="flex items-center gap-2">
          <span>Component Registries:</span>
          <span className="font-semibold text-foreground px-2 py-0.5 bg-muted rounded">@shadcn</span>
        </p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10">
            ✓ button.tsx installed
          </span>
          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10">
            ✓ card.tsx installed
          </span>
        </div>
      </footer>
    </div>
  )
}

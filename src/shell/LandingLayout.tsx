import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Settings,
  MessageSquare,
  FileText,
  Workflow,
  Play,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DUMMY_WORKSPACES, workspaceToSlug, type Workspace } from './components/WorkspaceSelector'
import logo from '@/assets/logo.png'

export default function LandingLayout() {
  const navigate = useNavigate()
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false)
  const [targetApp, setTargetApp] = useState<'studio' | 'chat'>('studio')

  const openWorkspaceModal = (app: 'studio' | 'chat') => {
    setTargetApp(app)
    setIsWorkspaceModalOpen(true)
  }

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setIsWorkspaceModalOpen(false)
    navigate(`/workspace/${workspaceToSlug(workspace.name)}/${targetApp}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="lmthing" className="size-8" />
            <h1 className="text-xl font-semibold">lmthing</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Your expertise, amplified by AI</span>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Turn Knowledge into AI Agents
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No code required. Transform your knowledge into powerful AI agents.
            Organize them into knowledge areas, design workflows visually, and deploy
            intelligent solutions — all without writing a single line of code.
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {/* Studio Card */}
          <Card className="group cursor-pointer border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Settings className="size-6" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => openWorkspaceModal('studio')}
                >
                  <ArrowRight className="size-5" />
                </Button>
              </div>
              <CardTitle className="mt-4 text-2xl">Studio</CardTitle>
              <CardDescription className="text-base">
                Where your knowledge becomes AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build agents that embody your expertise. Configure behaviors through
                intuitive forms, organize into knowledge, and visually design workflows —
                all without code.
              </p>
              <Button
                className="mt-4 w-full sm:w-auto"
                onClick={() => openWorkspaceModal('studio')}
              >
                Open Studio
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Chat Card */}
          <Card className="group cursor-pointer border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MessageSquare className="size-6" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => openWorkspaceModal('chat')}
                >
                  <ArrowRight className="size-5" />
                </Button>
              </div>
              <CardTitle className="mt-4 text-2xl">Chat</CardTitle>
              <CardDescription className="text-base">
                Put your agents to the test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Interact with your AI agents naturally. Validate their responses,
                refine their behavior through conversation, and build confidence
                in your LLM engineering skills.
              </p>
              <Button
                className="mt-4 w-full sm:w-auto"
                onClick={() => openWorkspaceModal('chat')}
              >
                Open Chat
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        
        {/* How It Works Section */}
        <div className="mt-20">
          <h3 className="text-center text-2xl font-semibold">How It Works</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Build AI agents in four simple steps — from knowledge to action
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="size-8" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">Step 1</span>
                </div>
                <h4 className="mt-2 text-lg font-semibold">Organize Your Knowledge</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Structure your knowledge into markdown files in a file tree. Create
                  folders, documents, and links that mirror your field's natural organization.
                </p>
              </div>
              <div className="hidden lg:block absolute right-0 top-8 -translate-y-1/2 translate-x-1/2 text-muted-foreground/30">
                <ArrowRight className="size-6" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="size-8" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">Step 2</span>
                </div>
                <h4 className="mt-2 text-lg font-semibold">Build Your Agent</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the Agent Builder to create a configurable AI agent. Connect it to your
                  knowledge, set its personality, and define how it should respond.
                </p>
              </div>
              <div className="hidden lg:block absolute right-0 top-8 -translate-y-1/2 translate-x-1/2 text-muted-foreground/30">
                <ArrowRight className="size-6" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Workflow className="size-8" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">Step 3</span>
                </div>
                <h4 className="mt-2 text-lg font-semibold">Add Task Flows</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create commands as task flows that your agent can execute. Define step-by-step
                  actions using the visual flow editor — no coding required.
                </p>
              </div>
              <div className="hidden lg:block absolute right-0 top-8 -translate-y-1/2 translate-x-1/2 text-muted-foreground/30">
                <ArrowRight className="size-6" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Play className="size-8" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary-foreground">Step 4</span>
                </div>
                <h4 className="mt-2 text-lg font-semibold">Chat & Execute</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Interact with your agent through natural conversation. Watch it run commands,
                  perform tasks, and leverage your knowledge in real-time.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile connector arrows */}
          <div className="mt-8 flex justify-center lg:hidden">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
              <ArrowRight className="size-6 rotate-90" />
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-20 rounded-2xl bg-muted/50 px-8 py-12 text-center">
          <h3 className="text-2xl font-semibold">Start Building Your AI Agents</h3>
          <p className="mt-2 text-muted-foreground">
            Your knowledge is all you need — no coding required
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => openWorkspaceModal('studio')}>
              <Settings className="mr-2 size-5" />
              Build in Studio
            </Button>
            <Button size="lg" variant="outline" onClick={() => openWorkspaceModal('chat')}>
              <MessageSquare className="mr-2 size-5" />
              Try Chat First
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isWorkspaceModalOpen} onOpenChange={setIsWorkspaceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Demo Workspace</DialogTitle>
            <DialogDescription>
              Choose a workspace to open {targetApp === 'studio' ? 'Studio' : 'Chat'}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {DUMMY_WORKSPACES.map((workspace) => (
              <button
                key={workspace.id}
                type="button"
                onClick={() => handleWorkspaceSelect(workspace)}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-8 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${workspace.color}20` }}
                  >
                    <Building2 className="size-4" style={{ color: workspace.color }} />
                  </div>
                  <div>
                    <p className="font-medium">{workspace.name}</p>
                    <p className="text-xs text-muted-foreground">/{workspaceToSlug(workspace.name)}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="mt-20 border-t py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>lmthing — Turn Knowledge into LLM Engineers</p>
        </div>
      </footer>
    </div>
  )
}

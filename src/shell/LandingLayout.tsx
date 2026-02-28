import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Settings,
  MessageSquare,
  FolderTree,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import logo from '@/assets/logo.png'

export default function LandingLayout() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Bot,
      title: 'Agent Builder',
      description: 'Create and configure AI agents with custom prompts and flows.',
    },
    {
      icon: FolderTree,
      title: 'Domain Management',
      description: 'Organize your agents into domains for better structure.',
    },
    {
      icon: MessageSquare,
      title: 'Interactive Chat',
      description: 'Chat with your agents in real-time with context awareness.',
    },
    {
      icon: Zap,
      title: 'Flow Editor',
      description: 'Design complex agent workflows with visual flow editor.',
    },
  ]

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
            <span className="text-sm text-muted-foreground">Welcome back</span>
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
            Build AI Agents with Confidence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Design, configure, and interact with powerful AI agents. Organize them into
            domains, create complex workflows, and bring your ideas to life.
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
                  onClick={() => navigate('/studio')}
                >
                  <ArrowRight className="size-5" />
                </Button>
              </div>
              <CardTitle className="mt-4 text-2xl">Studio</CardTitle>
              <CardDescription className="text-base">
                Design and manage your AI agents and domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create new agents, configure their behaviors, organize them into domains,
                and build complex flows with the visual editor.
              </p>
              <Button
                className="mt-4 w-full sm:w-auto"
                onClick={() => navigate('/studio')}
              >
                Open Studio
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Shell Card */}
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
                  onClick={() => navigate('/shell')}
                >
                  <ArrowRight className="size-5" />
                </Button>
              </div>
              <CardTitle className="mt-4 text-2xl">Shell</CardTitle>
              <CardDescription className="text-base">
                Interact with your AI agents in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Chat with your agents, view conversation history, and manage multiple
                conversations across different workspaces.
              </p>
              <Button
                className="mt-4 w-full sm:w-auto"
                onClick={() => navigate('/shell')}
              >
                Open Shell
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h3 className="text-center text-2xl font-semibold">Everything You Need</h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <feature.icon className="size-6" />
                  </div>
                  <h4 className="mt-4 font-semibold">{feature.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-20 rounded-2xl bg-muted/50 px-8 py-12 text-center">
          <h3 className="text-2xl font-semibold">Getting Started</h3>
          <p className="mt-2 text-muted-foreground">
            Choose your path: build in Studio or interact in Shell
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/studio')}>
              <Settings className="mr-2 size-5" />
              Go to Studio
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/shell')}>
              <MessageSquare className="mr-2 size-5" />
              Go to Shell
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>lmthing — Build AI Agents with Confidence</p>
        </div>
      </footer>
    </div>
  )
}

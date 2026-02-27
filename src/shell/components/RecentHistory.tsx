import type { ChatItem } from './ChatSidebar'
import { MessageSquare } from 'lucide-react'

export interface RecentHistoryProps {
  chats: ChatItem[]
  activeChatId?: string
  onOpenChat?: (chatId: string) => void
}

export function RecentHistory({ chats, activeChatId, onOpenChat }: RecentHistoryProps) {
  if (chats.length === 0) {
    return (
      <div className="px-3 py-4 text-sm text-slate-400 dark:text-slate-500 text-center">
        No recent chats
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onOpenChat?.(chat.id)}
          className={`
            flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors text-left
            ${chat.id === activeChatId
              ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }
          `}
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
          <span className="truncate flex-1">{chat.title}</span>
        </button>
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Task } from '@/types/task'

interface TaskCardProps {
  task: Task
  statusConfig: {
    label: string
    icon: string
    color: string
    dotColor: string
  }
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export default function TaskCard({
  task,
  statusConfig,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const getNextStatus = (current: string) => {
    const statusFlow = {
      pending: 'in-progress',
      'in-progress': 'completed',
      completed: 'pending',
    }
    return statusFlow[current as keyof typeof statusFlow]
  }

  const formattedDate = task.createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      className="card-elevated group relative overflow-hidden bg-card transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>

            <h3 className="break-words text-lg font-semibold text-foreground mb-1">
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 z-10 w-48 rounded-lg border border-border bg-card shadow-lg">
                <button
                  onClick={() => {
                    onUpdate(task.id, { status: getNextStatus(task.status) as any })
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary first:rounded-t-lg"
                >
                  Move to {getNextStatus(task.status) === 'in-progress' ? 'In Progress' : getNextStatus(task.status) === 'completed' ? 'Completed' : 'Pending'}
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-secondary last:rounded-b-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {isHovered && (
          <div className="mt-4 flex gap-2 border-t border-border pt-4">
            <button
              onClick={() => {
                onUpdate(task.id, { status: getNextStatus(task.status) as any })
              }}
              className="flex-1 rounded-lg bg-primary/10 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {task.status === 'completed' ? 'Reset' : 'Next Step'}
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

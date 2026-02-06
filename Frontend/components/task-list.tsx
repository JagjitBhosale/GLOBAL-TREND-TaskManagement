'use client'

import { Task } from '@/types/task'
import TaskCard from './task-card'

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  }

  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: '⏱',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      dotColor: 'bg-purple-500',
    },
    'in-progress': {
      label: 'In Progress',
      icon: '⚡',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      dotColor: 'bg-amber-500',
    },
    completed: {
      label: 'Completed',
      icon: '✓',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      dotColor: 'bg-green-500',
    },
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedTasks).map(([status, taskList]) => {
        const config = statusConfig[status as keyof typeof statusConfig]
        return (
          <div key={status}>
            <div className="mb-4 flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${config.dotColor}`} />
              <h2 className="text-lg font-semibold text-foreground">
                {config.label}
              </h2>
              <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                {taskList.length}
              </span>
            </div>

            {taskList.length > 0 ? (
              <div className="space-y-3">
                {taskList.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    statusConfig={config}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-border bg-background/50 py-8 text-center">
                <p className="text-muted-foreground">
                  No {status === 'in-progress' ? 'in-progress' : status} tasks yet
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

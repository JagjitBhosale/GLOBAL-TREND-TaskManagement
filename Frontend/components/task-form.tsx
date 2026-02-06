'use client'

import React from "react"

import { useState } from 'react'
import { Task } from '@/types/task'

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
    })

    setTitle('')
    setDescription('')
    setIsExpanded(false)
  }

  return (
    <div className="card-elevated bg-card">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {isExpanded && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description (optional)</label>
                <textarea
                  placeholder="Add more details about your task..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="flex-1 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false)
                    setTitle('')
                    setDescription('')
                  }}
                  className="rounded-lg border border-border bg-background px-6 py-2.5 font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import TaskForm from '@/components/task-form'
import TaskList from '@/components/task-list'
import TaskStats from '@/components/task-stats'
import { Task } from '@/types/task'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to load tasks')
        setLoading(false)
        return
      }

      const mappedTasks: Task[] = (data.data.tasks || []).map((t: any) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        status: t.status,
        createdAt: new Date(t.createdAt),
      }))

      setTasks(mappedTasks)
      setLoading(false)
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      setLoading(false)
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchTasks(token)
  }, [router])

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to create task')
        return
      }

      const t = data.data.task
      const newTask: Task = {
        id: t._id,
        title: t.title,
        description: t.description,
        status: t.status,
        createdAt: new Date(t.createdAt),
      }

      setTasks(prev => [newTask, ...prev])
    } catch (err) {
      setError('Failed to create task. Please try again.')
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to update task')
        return
      }

      const t = data.data.task
      const updatedTask: Task = {
        id: t._id,
        title: t.title,
        description: t.description,
        status: t.status,
        createdAt: new Date(t.createdAt),
      }

      setTasks(prev => prev.map(task => (task.id === id ? updatedTask : task)))
    } catch (err) {
      setError('Failed to update task. Please try again.')
    }
  }

  const deleteTask = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to delete task')
        return
      }

      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError('Failed to delete task. Please try again.')
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Stay organized and manage your tasks efficiently
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TaskStats stats={stats} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TaskForm onAddTask={addTask} />
            <TaskList
              tasks={tasks}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

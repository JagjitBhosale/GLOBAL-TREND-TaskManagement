'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Target, Zap, Calendar } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://global-trend-taskmanagement.onrender.com'

interface Task {
  _id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  completedAt?: string
}

interface ConsistencyStats {
  totalMonths: number
  averageCompletionRate: number
  totalTasks: number
  totalCompletedTasks: number
  longestStreak: number
  currentStreak: number
  monthlyData: any[]
}

export default function ConsistencyAnalysis() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<ConsistencyStats | null>(null)
  const [userCreatedAt, setUserCreatedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (!token || !userData) {
        router.push('/login')
        return
      }

      try {
        // Get user creation date
        const user = JSON.parse(userData)
        if (user.createdAt) {
          setUserCreatedAt(new Date(user.createdAt))
        }

        // Fetch all tasks
        const tasksResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!tasksResponse.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const tasksData = await tasksResponse.json()
        if (tasksData.success) {
          setTasks(tasksData.data.tasks || [])
        }

        // Fetch consistency stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/consistency/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch consistency stats')
        }

        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats(statsData.data)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching consistency data:', err)
        setError(err.message || 'Failed to load consistency data')
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Calculate daily data from actual tasks
  const dailyData = useMemo(() => {
    if (!tasks.length || !userCreatedAt) return []

    const now = new Date()
    const startDate = new Date(userCreatedAt)
    startDate.setHours(0, 0, 0, 0)

    // Get last 30 days or since registration, whichever is shorter
    const daysToShow = Math.min(30, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    
    const data: any[] = []
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      // Only include dates from registration onwards
      if (date < startDate) continue

      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      // Filter tasks for this day
      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt)
        return taskDate >= date && taskDate < nextDay
      })

      const completedTasks = dayTasks.filter((t) => t.status === 'completed')
      const totalTasks = dayTasks.length
      const consistency = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasksCompleted: completedTasks.length,
        taskCreated: totalTasks,
        consistency: consistency,
      })
    }

    return data
  }, [tasks, userCreatedAt])

  // Calculate weekly data from actual tasks
  const weeklyData = useMemo(() => {
    if (!tasks.length || !userCreatedAt) return []

    const now = new Date()
    const startDate = new Date(userCreatedAt)
    startDate.setHours(0, 0, 0, 0)

    // Get weeks since registration (max 4 weeks)
    const weeksSinceRegistration = Math.min(4, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)))
    
    const weeklyDataArray: any[] = []

    for (let week = 0; week < weeksSinceRegistration; week++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(weekStart.getDate() + week * 7)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      // Filter tasks for this week
      const weekTasks = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt)
        return taskDate >= weekStart && taskDate < weekEnd
      })

      const completed = weekTasks.filter((t) => t.status === 'completed').length
      const target = 35 // Target tasks per week
      const consistency = weekTasks.length > 0 ? Math.round((completed / weekTasks.length) * 100) : 0

      weeklyDataArray.push({
        week: `Week ${week + 1}`,
        completed: completed,
        target: target,
        consistency: consistency,
      })
    }

    return weeklyDataArray
  }, [tasks, userCreatedAt])

  const consistencyScore = useMemo(() => {
    if (!stats) {
      if (dailyData.length === 0) return 0
      const avg = Math.round(dailyData.reduce((sum, d) => sum + d.consistency, 0) / dailyData.length)
      return avg
    }
    return Math.round(stats.averageCompletionRate)
  }, [dailyData, stats])

  const totalCompleted = useMemo(() => {
    if (stats) {
      return stats.totalCompletedTasks
    }
    return dailyData.reduce((sum, d) => sum + d.tasksCompleted, 0)
  }, [dailyData, stats])

  const bestStreak = useMemo(() => {
    if (stats) {
      return `${stats.longestStreak} days`
    }
    // Calculate streak from daily data
    let maxStreak = 0
    let currentStreak = 0
    for (const day of dailyData) {
      if (day.tasksCompleted > 0) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    return `${maxStreak} days`
  }, [dailyData, stats])

  const statsCards = [
    {
      label: 'Consistency Score',
      value: `${consistencyScore}%`,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: `Tasks Completed${dailyData.length > 0 ? ` (${dailyData.length}d)` : ''}`,
      value: totalCompleted,
      icon: Target,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Avg Daily Tasks',
      value: dailyData.length > 0 ? (totalCompleted / dailyData.length).toFixed(1) : '0',
      icon: Zap,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Best Streak',
      value: bestStreak,
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  const pieData = [
    { name: 'Completed', value: consistencyScore },
    { name: 'Remaining', value: 100 - consistencyScore },
  ]

  const COLORS = ['hsl(var(--primary))', '#e5e7eb']

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Loading consistency data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="card-elevated bg-white rounded-xl p-6">
          <div className="text-center text-red-600">
            <p className="font-semibold mb-2">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card-elevated bg-white rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Consistency Line Chart */}
        <div className="lg:col-span-2 card-elevated bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Daily Consistency Trend</h3>
          {dailyData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p>No data available yet. Start creating tasks to see your consistency trend!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  interval={Math.max(1, Math.floor(dailyData.length / 8))}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="consistency" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  name="Consistency %"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Consistency Score Pie Chart */}
        <div className="card-elevated bg-white rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-4">Current Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-4xl font-bold text-primary">{consistencyScore}%</p>
            <p className="text-sm text-muted-foreground">Overall Performance</p>
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="card-elevated bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Performance</h3>
        {weeklyData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No weekly data available yet. Complete tasks to see your weekly performance!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="hsl(var(--secondary))" name="Target" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Insights */}
      {dailyData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-elevated bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Key Insights</h3>
            <ul className="space-y-3">
              {dailyData.length >= 7 && (
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-muted-foreground">
                    You've completed {totalCompleted} task{totalCompleted !== 1 ? 's' : ''} since registration
                  </span>
                </li>
              )}
              {dailyData.length > 0 && (
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-muted-foreground">
                    Your current consistency score is {consistencyScore}%
                  </span>
                </li>
              )}
              {bestStreak !== '0 days' && (
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-muted-foreground">
                    Best streak: {bestStreak}
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div className="card-elevated bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Recommendations</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-accent font-bold">→</span>
                <span className="text-sm text-muted-foreground">
                  {dailyData.length < 7 ? 'Keep creating tasks daily to build your consistency!' : 'Maintain your daily task creation habit'}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">→</span>
                <span className="text-sm text-muted-foreground">
                  Try to complete at least one task per day to maintain your streak
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">→</span>
                <span className="text-sm text-muted-foreground">
                  Aim for a consistency score above 70% for optimal productivity
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

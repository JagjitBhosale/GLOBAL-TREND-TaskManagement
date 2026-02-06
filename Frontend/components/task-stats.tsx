interface TaskStatsProps {
  stats: {
    total: number
    completed: number
    inProgress: number
    pending: number
  }
}

export default function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: '📋',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: '⚡',
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: '✓',
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: '⏱',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="card-elevated bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="space-y-3">
          <p className="text-sm font-medium opacity-90">Completion Rate</p>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold">{completionRate}%</div>
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs opacity-75">of {stats.total} tasks</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {statCards.map((stat, index) => (
          <div key={index} className="card-elevated overflow-hidden bg-card p-4 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

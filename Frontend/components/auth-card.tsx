'use client'

import React from "react"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8 card-elevated">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">{title}</h1>
          <p className="text-center text-muted-foreground">{description}</p>
        </div>

        {children}
      </div>

      <div className="text-center mt-6 text-xs text-muted-foreground">
        <p>TaskFlow • Secure Authentication</p>
      </div>
    </div>
  )
}

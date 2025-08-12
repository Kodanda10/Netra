import React from 'react'

export const EmptyFallback: React.FC<{ message: string }> = ({ message }) => (
  <div className="glass-card p-6 text-center text-white/65">{message}</div>
)


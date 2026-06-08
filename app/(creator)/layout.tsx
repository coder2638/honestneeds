'use client'

import React from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      {children}
    </ProtectedRoute>
  )
}

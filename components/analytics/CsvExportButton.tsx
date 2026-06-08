'use client'

import React from 'react'
import styled from 'styled-components'
import { Download } from 'lucide-react'
import { Button } from '@/components/Button'
import { useToast } from '@/hooks/useToast'

/**
 * CSV Export Button
 * Export transaction/activity history as CSV
 */

const IconedButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

interface TransactionData {
  date: string
  type: 'donation' | 'share' | 'other'
  description: string
  amount?: number
  status: string
  [key: string]: any
}

interface CsvExportButtonProps {
  data: TransactionData[]
  filename?: string
  label?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function CsvExportButton({
  data,
  filename = 'transactions.csv',
  label = 'Export CSV',
  variant = 'outline',
  size = 'md',
  disabled = false,
}: CsvExportButtonProps) {
  const { showToast } = useToast()

  const handleExport = () => {
    try {
      if (data.length === 0) {
        showToast({
          type: 'warning',
          title: 'No Data',
          message: 'No transactions to export',
          duration: 3000,
        })
        return
      }

      // Get all unique keys from all objects (headers)
      const headers = Array.from(
        new Set(
          data.flatMap((item) => Object.keys(item))
        )
      )

      // Create CSV headers
      const csvHeaders = headers.join(',')

      // Create CSV rows
      const csvRows = data
        .map((item) =>
          headers
            .map((header) => {
              const value = item[header]
              // Escape quotes and wrap in quotes if contains comma
              if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"` 
              }
              return value ?? ''
            })
            .join(',')
        )
        .join('\n')

      // Combine headers and rows
      const csv = `${csvHeaders}\n${csvRows}`

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showToast({
        type: 'success',
        title: 'Export Successful',
        message: `${data.length} records exported to ${filename}`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to export CSV:', error)
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export data. Please try again.',
        duration: 3000,
      })
    }
  }

  return (
    <IconedButton
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={disabled}
      title="Export all transactions to CSV"
    >
      <Download size={16} />
      {label}
    </IconedButton>
  )
}

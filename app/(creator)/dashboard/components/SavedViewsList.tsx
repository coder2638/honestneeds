'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Star, Trash2, Edit2, Plus, GripVertical } from 'lucide-react'

export interface SavedView {
  id: string
  name: string
  filters: Record<string, any>
  isDefault?: boolean
  isPreset?: boolean
  createdAt?: string
}

interface SavedViewsListProps {
  views: SavedView[]
  onSelectView: (id: string) => void
  onDeleteView: (id: string) => void
  onSetDefault?: (id: string) => void
  onRenameView?: (id: string, newName: string) => void
  onCreateView?: () => void
  selectedViewId?: string
}

const ViewsContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ViewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const CreateButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`

const ViewsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ViewCard = styled.div<{ isSelected?: boolean; isDefault?: boolean }>`
  border: 2px solid ${(props) => (props.isSelected ? '#3b82f6' : '#e5e7eb')};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: ${(props) => (props.isSelected ? '#eff6ff' : 'white')};

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  ${(props) => props.isDefault && 'background: #fef3c7; border-color: #fbbf24;'}
`

const ViewCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
`

const ViewName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  word-break: break-word;
`

const ViewLabel = styled.span<{ type: 'preset' | 'custom' | 'default' }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => {
    switch (props.type) {
      case 'preset':
        return '#dbeafe'
      case 'default':
        return '#fefce8'
      default:
        return '#f0fdf4'
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'preset':
        return '#1e40af'
      case 'default':
        return '#92400e'
      default:
        return '#15803d'
    }
  }};
  white-space: nowrap;
  flex-shrink: 0;
`

const ViewActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
`

const ActionButton = styled.button`
  flex: 1;
  padding: 6px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const DefaultStar = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #fbbf24;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
`

const EditingInput = styled.input`
  width: 100%;
  padding: 6px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 4px rgba(59, 130, 246, 0.2);
  }
`

const PresetViews: SavedView[] = [
  { id: 'all', name: 'All Campaigns', filters: {}, isPreset: true },
  { id: 'active', name: 'Active Only', filters: { status: ['active'] }, isPreset: true },
  { id: 'drafts', name: 'Drafts', filters: { status: ['draft'] }, isPreset: true },
  { id: 'completed', name: 'Completed', filters: { status: ['completed'] }, isPreset: true },
]

export const SavedViewsList: React.FC<SavedViewsListProps> = ({
  views,
  onSelectView,
  onDeleteView,
  onSetDefault,
  onRenameView,
  onCreateView,
  selectedViewId = 'all',
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>('')
  const [allViews, setAllViews] = useState<SavedView[]>([])

  useEffect(() => {
    // Merge preset views with custom views, with presets first
    const merged = [...PresetViews, ...views.filter((v) => !v.isPreset)]
    setAllViews(merged)
  }, [views])

  const handleRename = (id: string) => {
    const view = allViews.find((v) => v.id === id)
    if (view && !view.isPreset) {
      setEditingId(id)
      setEditingName(view.name)
    }
  }

  const handleSaveRename = (id: string) => {
    if (editingName.trim() && onRenameView) {
      onRenameView(id, editingName.trim())
    }
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(id)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  return (
    <ViewsContainer>
      <ViewsHeader>
        <Title>Saved Views</Title>
        <CreateButton onClick={onCreateView}>
          <Plus size={16} />
          New View
        </CreateButton>
      </ViewsHeader>

      <ViewsList>
        {allViews.map((view) => (
          <ViewCard
            key={view.id}
            isSelected={selectedViewId === view.id}
            isDefault={view.isDefault}
            onClick={() => onSelectView(view.id)}
          >
            {view.isDefault && <DefaultStar>⭐</DefaultStar>}

            {editingId === view.id ? (
              <EditingInput
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleSaveRename(view.id)}
                onKeyDown={(e) => handleKeyDown(e, view.id)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <ViewCardHeader>
                <ViewName>{view.name}</ViewName>
                {view.isPreset && <ViewLabel type="preset">Preset</ViewLabel>}
                {view.isDefault && !view.isPreset && <ViewLabel type="default">Default</ViewLabel>}
              </ViewCardHeader>
            )}

            {editingId !== view.id && (
              <ViewActions>
                {!view.isPreset && (
                  <>
                    <ActionButton
                      title="Set as default"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSetDefault?.(view.id)
                      }}
                      disabled={view.isDefault}
                    >
                      <Star size={14} />
                    </ActionButton>
                    <ActionButton
                      title="Rename"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRename(view.id)
                      }}
                    >
                      <Edit2 size={14} />
                    </ActionButton>
                    <ActionButton
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteView(view.id)
                      }}
                    >
                      <Trash2 size={14} />
                    </ActionButton>
                  </>
                )}
              </ViewActions>
            )}
          </ViewCard>
        ))}
      </ViewsList>
    </ViewsContainer>
  )
}

export default SavedViewsList

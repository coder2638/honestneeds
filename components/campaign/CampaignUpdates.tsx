'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Trash2, Plus, Calendar, User, MessageSquare } from 'lucide-react'
import { useCampaignUpdates, useCreateCampaignUpdate, useDeleteCampaignUpdate } from '@/api/hooks/useCampaignUpdates'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useAuthStore } from '@/store/authStore'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Title = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const UpdatesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const UpdateCard = styled(Card)`
  padding: 20px;
  border-left: 4px solid #3b82f6;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const UpdateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`

const UpdateTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: #fee2e2;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const UpdateMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #6b7280;
  flex-wrap: wrap;
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
  }
`

const UpdateContent = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
`

const UpdateImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 6px;
  margin-top: 12px;
`

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  background: #f9fafb;
  border-radius: 8px;
`

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`

const EmptyText = styled.p`
  font-size: 14px;
  margin: 0;
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const Textarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`

interface CampaignUpdatesProps {
  campaignId: string
  isCreator?: boolean
}

/**
 * Campaign Updates Component (Production-Ready)
 * Displays campaign progress updates and allows creators to post new updates
 */
export const CampaignUpdates: React.FC<CampaignUpdatesProps> = ({
  campaignId,
  isCreator = false,
}) => {
  const { user } = useAuthStore()
  const { data: updates, isLoading, error } = useCampaignUpdates(campaignId)
  const createUpdate = useCreateCampaignUpdate(campaignId)
  const deleteUpdate = useDeleteCampaignUpdate(campaignId)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' })

  // Ensure updates is always an array, handling various response formats
  const updatesArray = (() => {
    console.log('🔍 CampaignUpdates - updates data:', { updates, isArray: Array.isArray(updates), type: typeof updates })
    
    if (Array.isArray(updates)) {
      return updates
    }
    
    if (updates && typeof updates === 'object' && 'updates' in updates && Array.isArray(updates.updates)) {
      return updates.updates
    }
    
    if (updates && typeof updates === 'object' && 'data' in updates && Array.isArray(updates.data)) {
      return updates.data
    }
    
    return []
  })()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content')
      return
    }

    try {
      await createUpdate.mutateAsync({
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
      })
      setFormData({ title: '', content: '', imageUrl: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create update:', error)
      alert('Failed to create update')
    }
  }

  const handleDelete = async (updateId: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      try {
        await deleteUpdate.mutateAsync(updateId)
      } catch (error) {
        console.error('Failed to delete update:', error)
        alert('Failed to delete update')
      }
    }
  }

  const sortedUpdates = Array.isArray(updatesArray) 
    ? [...updatesArray].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : []

  return (
    <Container>
      <Header>
        <Title>📝 Progress Updates</Title>
        {isCreator && (
          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus style={{ width: 16, height: 16 }} />
            {showForm ? 'Cancel' : 'Post Update'}
          </Button>
        )}
      </Header>

      {showForm && isCreator && (
        <FormSection>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FormGroup>
              <Label>Update Title</Label>
              <Input
                type="text"
                placeholder="e.g., Campaign Update #1"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={100}
              />
              <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: 4 }}>
                {formData.title.length}/100
              </span>
            </FormGroup>

            <FormGroup>
              <Label>Update Content</Label>
              <Textarea
                placeholder="Share what's happening with your campaign..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                maxLength={2000}
              />
              <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: 4 }}>
                {formData.content.length}/2000
              </span>
            </FormGroup>

            <FormGroup>
              <Label>Image URL (Optional)</Label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                variant="primary"
                type="submit"
                disabled={createUpdate.isPending}
              >
                {createUpdate.isPending ? 'Posting...' : 'Post Update'}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </FormSection>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : sortedUpdates && sortedUpdates.length > 0 ? (
        <UpdatesList>
          {sortedUpdates.map((update) => (
            <UpdateCard key={update.id}>
              <UpdateHeader>
                <UpdateTitle>{update.title}</UpdateTitle>
                {isCreator && (
                  <DeleteButton
                    onClick={() => handleDelete(update.id)}
                    disabled={deleteUpdate.isPending}
                    title="Delete update"
                  >
                    <Trash2 />
                  </DeleteButton>
                )}
              </UpdateHeader>

              <UpdateMeta>
                <MetaItem>
                  <Calendar />
                  {new Date(update.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </MetaItem>
                <MetaItem>
                  <MessageSquare />
                  {update.content.split('\n').length} lines
                </MetaItem>
              </UpdateMeta>

              <UpdateContent>{update.content}</UpdateContent>

              {update.imageUrl && <UpdateImage src={update.imageUrl} alt={update.title} />}
            </UpdateCard>
          ))}
        </UpdatesList>
      ) : (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyText>
            {isCreator
              ? 'No updates yet. Share progress with your supporters!'
              : 'No updates from the creator yet.'}
          </EmptyText>
        </EmptyState>
      )}
    </Container>
  )
}

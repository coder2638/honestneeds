'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Plus, Edit2, Trash2, GripVertical, Save, X } from 'lucide-react'
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from '@/api/hooks/useAdminOperations'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Modal } from '@/components/Modal'
import { AdminCategory } from '@/api/services/adminContentService'

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
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const GroupsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`

const GroupCard = styled(Card)`
  padding: 20px;
  border: 2px solid #e5e7eb;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
  }
`

const CategoriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CategoryItem = styled.div<{ isDragging?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`

const DragHandle = styled.div`
  cursor: move;
  display: flex;
  align-items: center;
  color: #9ca3af;

  &:hover {
    color: #6b7280;
  }
`

const CategoryInfo = styled.div`
  flex: 1;
`

const CategoryName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
`

const CategoryMeta = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`

const CategoryActions = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled(Button)`
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
`

const FormGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`

interface CategoryFormData {
  name: string
  group: string
  description: string
  icon?: string
  order: number
}

/**
 * Category Manager Component
 * Manage campaign categories with create, edit, delete, and reorder
 */
export const CategoryManager: React.FC = () => {
  const { data: categories, isLoading } = useAdminCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const reorderCategories = useReorderCategories()

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    group: '',
    description: '',
    icon: '',
    order: 0,
  })

  const groupedCategories = React.useMemo(() => {
    if (!categories) return {}
    return categories.reduce(
      (acc, cat) => {
        if (!acc[cat.group]) acc[cat.group] = []
        acc[cat.group].push(cat)
        return acc
      },
      {} as Record<string, AdminCategory[]>
    )
  }, [categories])

  const handleOpenModal = (category?: AdminCategory) => {
    if (category) {
      setEditingId(category.id)
      setFormData({
        name: category.name,
        group: category.group,
        description: category.description,
        icon: category.icon,
        order: category.order,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        group: '',
        description: '',
        icon: '',
        order: categories ? categories.length : 0,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.group) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      updateCategory.mutate(
        { categoryId: editingId, data: formData },
        {
          onSuccess: () => {
            handleCloseModal()
          },
        }
      )
    } else {
      createCategory.mutate(formData, {
        onSuccess: () => {
          handleCloseModal()
        },
      })
    }
  }

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(categoryId)
    }
  }

  const handleReorder = (categoryId: string, direction: 'up' | 'down') => {
    if (!categories) return

    const currentIndex = categories.findIndex((c) => c.id === categoryId)
    if (direction === 'up' && currentIndex > 0) {
      const newCategories = [...categories]
      ;[newCategories[currentIndex], newCategories[currentIndex - 1]] = [
        newCategories[currentIndex - 1],
        newCategories[currentIndex],
      ]
      reorderCategories.mutate(
        newCategories.map((c, idx) => ({ id: c.id, order: idx }))
      )
    } else if (direction === 'down' && currentIndex < categories.length - 1) {
      const newCategories = [...categories]
      ;[newCategories[currentIndex], newCategories[currentIndex + 1]] = [
        newCategories[currentIndex + 1],
        newCategories[currentIndex],
      ]
      reorderCategories.mutate(
        newCategories.map((c, idx) => ({ id: c.id, order: idx }))
      )
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Container>
      <Header>
        <Title>📚 Category Management</Title>
        <AddButton variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Category
        </AddButton>
      </Header>

      {categories && categories.length > 0 ? (
        <GroupsContainer>
          {Object.entries(groupedCategories).map(([group, groupCategories]) => (
            <GroupCard key={group}>
              <h3>{group}</h3>
              <CategoriesList>
                {(groupCategories as AdminCategory[]).map((category) => (
                  <CategoryItem key={category.id}>
                    <DragHandle>
                      <GripVertical size={16} />
                    </DragHandle>

                    <CategoryInfo>
                      <CategoryName>{category.name}</CategoryName>
                      <CategoryMeta>
                        {category.campaignCount} campaigns • Order: {category.order}
                      </CategoryMeta>
                    </CategoryInfo>

                    <CategoryActions>
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(category)}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </ActionButton>
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        title="Delete"
                        disabled={deleteCategory.isPending}
                      >
                        <Trash2 size={14} />
                      </ActionButton>
                    </CategoryActions>
                  </CategoryItem>
                ))}
              </CategoriesList>
            </GroupCard>
          ))}
        </GroupsContainer>
      ) : (
        <EmptyState>
          <p>No categories found. Create your first category to get started.</p>
        </EmptyState>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingId ? 'Edit Category' : 'Add Category'}>
        <FormGroup>
          <Label>Category Name *</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Medical Emergency"
          />
        </FormGroup>

        <FormGroup>
          <Label>Group *</Label>
          <Select
            value={formData.group}
            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
          >
            <option value="">Select a group...</option>
            <option value="Health & Medical">Health & Medical</option>
            <option value="Education & Learning">Education & Learning</option>
            <option value="Housing & Living">Housing & Living</option>
            <option value="Food & Nutrition">Food & Nutrition</option>
            <option value="Family & Personal">Family & Personal</option>
            <option value="Community & Social">Community & Social</option>
            <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
            <option value="Creative & Arts">Creative & Arts</option>
            <option value="Environment & Causes">Environment & Causes</option>
            <option value="Technology & Innovation">Technology & Innovation</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What is this category about?"
          />
        </FormGroup>

        <FormGroup>
          <Label>Icon (emoji or URL)</Label>
          <Input
            type="text"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g., 🏥 or /icons/medical.png"
          />
        </FormGroup>

        <ModalFooter>
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={createCategory.isPending || updateCategory.isPending}
          >
            {editingId ? 'Update' : 'Create'} Category
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

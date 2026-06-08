'use client'

import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { CAMPAIGN_CATEGORY_GROUPS } from '@/utils/validationSchemas'
import * as LucideIcons from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #E2E8F0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366F1;
    background-color: #F8FAFC;
  }

  &::placeholder {
    color: #94A3B8;
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  display: flex;
  align-items: center;
  pointer-events: none;
`

const GroupsContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  max-height: 600px;
  overflow-y: auto;

  @media (max-width: 768px) {
    max-height: 500px;
  }
`

const GroupCard = styled.div`
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #FFFFFF;
  transition: all 0.2s ease;

  &:hover {
    border-color: #CBD5E1;
  }
`

const GroupHeader = styled.button<{ isExpanded: boolean }>`
  width: 100%;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: none;
  background-color: #F8FAFC;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #F1F5F9;
  }

  &:focus-visible {
    outline: 2px solid #6366F1;
    outline-offset: -2px;
  }
`

const GroupIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background-color: #EEF2FF;
  color: #6366F1;
  flex-shrink: 0;
`

const GroupTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
`

const GroupTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
`

const GroupDescription = styled.p`
  font-size: 0.75rem;
  color: #64748B;
  margin: 0.25rem 0 0 0;
`

const ExpandIcon = styled.div<{ isExpanded: boolean }>`
  display: flex;
  align-items: center;
  color: #94A3B8;
  transition: all 0.2s ease;
  transform: ${(props) => (props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const CategoriesGrid = styled.div<{ isExpanded: boolean }>`
  display: ${(props) => (props.isExpanded ? 'grid' : 'none')};
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  background-color: #F8FAFC;
  border-top: 1px solid #E2E8F0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const CategoryButton = styled.button<{ isSelected: boolean }>`
  padding: 0.875rem 1rem;
  text-align: left;
  border: 2px solid ${(props) => (props.isSelected ? '#6366F1' : '#E2E8F0')};
  border-radius: 8px;
  background-color: ${(props) => (props.isSelected ? '#EEF2FF' : '#FFFFFF')};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.isSelected ? '600' : '500')};
  color: ${(props) => (props.isSelected ? '#6366F1' : '#0F172A')};

  &:hover {
    border-color: #6366F1;
    background-color: #EEF2FF;
  }

  &:focus-visible {
    outline: 2px solid #6366F1;
    outline-offset: -2px;
  }
`

const CategoryName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`

const CategoryDescription = styled.div`
  font-size: 0.75rem;
  color: #64748B;
  opacity: 0.8;
`

const SelectedCategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #EEF2FF;
  border: 1px solid #6366F1;
  border-radius: 20px;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6366F1;
`

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #6366F1;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`

const NoResultsMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #64748B;
  font-size: 0.875rem;
`

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #E2E8F0;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0F172A;
`

interface CategoryBrowserProps {
  selectedCategory: string | null
  onSelectCategory: (categoryId: string, categoryName: string) => void
  onClear?: () => void
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({
  selectedCategory,
  onSelectCategory,
  onClear,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Get the icon component for a group
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName]
    return IconComponent ? <IconComponent size={20} /> : null
  }

  // Get category name from ID
  const getCategoryName = (categoryId: string): string => {
    for (const group of CAMPAIGN_CATEGORY_GROUPS) {
      const category = group.categories.find((cat) => cat.id === categoryId)
      if (category) return category.name
    }
    return ''
  }

  // Filter categories based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return CAMPAIGN_CATEGORY_GROUPS
    }

    const query = searchQuery.toLowerCase()
    return CAMPAIGN_CATEGORY_GROUPS.map((group) => ({
      ...group,
      categories: group.categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) || cat.description.toLowerCase().includes(query)
      ),
    })).filter((group) => group.categories.length > 0)
  }, [searchQuery])

  // Auto-expand groups on search
  useMemo(() => {
    if (searchQuery.trim()) {
      const groupIds = new Set(filteredGroups.map((g) => g.id))
      setExpandedGroups(groupIds)
    }
  }, [searchQuery, filteredGroups])

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const selectedCategoryName = getCategoryName(selectedCategory || '')

  return (
    <Container>
      <SearchContainer>
        <SearchIcon>
          <Search size={20} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search categories... (e.g., 'medical', 'business', 'education')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search categories"
        />
      </SearchContainer>

      {filteredGroups.length > 0 ? (
        <GroupsContainer>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id}>
              <GroupHeader
                isExpanded={expandedGroups.has(group.id)}
                onClick={() => toggleGroup(group.id)}
                type="button"
                aria-expanded={expandedGroups.has(group.id)}
                aria-label={`${group.name}, ${group.categories.length} categories`}
              >
                <GroupIconWrapper>{getIcon(group.icon)}</GroupIconWrapper>
                <GroupTitleContainer>
                  <GroupTitle>{group.name}</GroupTitle>
                  <GroupDescription>{group.description}</GroupDescription>
                </GroupTitleContainer>
                <CountBadge>{group.categories.length}</CountBadge>
                <ExpandIcon isExpanded={expandedGroups.has(group.id)}>
                  <ChevronDown size={20} />
                </ExpandIcon>
              </GroupHeader>

              <CategoriesGrid isExpanded={expandedGroups.has(group.id)}>
                {group.categories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    isSelected={selectedCategory === category.id}
                    onClick={() => onSelectCategory(category.id, category.name)}
                    type="button"
                    aria-pressed={selectedCategory === category.id}
                  >
                    <CategoryName>{category.name}</CategoryName>
                    <CategoryDescription>{category.description}</CategoryDescription>
                  </CategoryButton>
                ))}
              </CategoriesGrid>
            </GroupCard>
          ))}
        </GroupsContainer>
      ) : (
        <NoResultsMessage>
          No categories found matching "{searchQuery}". Try searching for something else.
        </NoResultsMessage>
      )}

      {selectedCategory && (
        <SelectedCategoryTag>
          <span>Selected: <strong>{selectedCategoryName}</strong></span>
          {onClear && (
            <ClearButton onClick={onClear} type="button">
              Clear
            </ClearButton>
          )}
        </SelectedCategoryTag>
      )}
    </Container>
  )
}

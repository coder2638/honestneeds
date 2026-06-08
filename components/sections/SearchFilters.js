'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiFilter, FiChevronDown } from 'react-icons/fi';
import Container from '../ui/Container';
import StyledInput, { InputIcon } from '../ui/Input';
import Tag from '../ui/Tag';

const FilterSection = styled.section`
  padding: ${({ theme }) => theme?.spacing?.xl || '24px'} 0;
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
  position: sticky;
  top: 64px;
  z-index: 50;
`;

const FilterContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    flex-direction: row;
    align-items: center;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  position: relative;

  svg {
    position: absolute;
    left: ${({ theme }) => theme?.spacing?.md || '12px'};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
    width: 20px;
    height: 20px;
    z-index: 1;
  }
`;

const SearchInput = styled(StyledInput)`
  padding-left: ${({ theme }) => theme?.spacing?.['3xl'] || '40px'};
  width: 100%;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
  flex-wrap: wrap;
`;

const FilterDropdown = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  padding: ${({ theme }) => theme?.spacing?.md || '12px'} ${({ theme }) => theme?.spacing?.lg || '16px'};
  background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  transition: all ${({ theme }) => theme?.transitions?.fast || '100ms ease'};

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme?.spacing?.sm || '8px'});
  left: 0;
  min-width: 200px;
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  box-shadow: ${({ theme }) => theme?.shadows?.elevation3 || '0 12px 24px rgba(0,0,0,0.15)'};
  padding: ${({ theme }) => theme?.spacing?.md || '12px'};
  z-index: 100;
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme?.spacing?.sm || '8px'} ${({ theme }) => theme?.spacing?.md || '12px'};
  text-align: left;
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  border-radius: ${({ theme }) => theme?.radii?.small || '6px'};
  transition: background-color ${({ theme }) => theme?.transitions?.fast || '100ms ease'};

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
  }
`;

const UrgencyTags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  flex-wrap: wrap;
`;

const urgencyOptions = [
  { label: 'Emergency', variant: 'urgent' },
  { label: 'Soon', variant: 'primary' },
  { label: 'Flexible', variant: 'default' },
];

const sortOptions = ['Random', 'Newest', 'Boosted', 'Near Me'];
const categoryOptions = ['All Types', 'Money', 'Services', 'Items', 'Health', 'Education', 'Community'];

export default function SearchFilters() {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Random');
  const [selectedCategory, setSelectedCategory] = useState('All Types');
  const [selectedUrgency, setSelectedUrgency] = useState(null);

  return (
    <FilterSection>
      <FilterContainer>
        <SearchWrapper>
          <FiSearch />
          <SearchInput 
            type="text" 
            placeholder="Search title, description or need type..."
          />
        </SearchWrapper>

        <FilterGroup>
          <FilterDropdown>
            <FilterButton onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
              <FiFilter />
              {selectedCategory}
              <FiChevronDown />
            </FilterButton>
            {showCategoryDropdown && (
              <DropdownMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {categoryOptions.map((option) => (
                  <DropdownItem
                    key={option}
                    onClick={() => {
                      setSelectedCategory(option);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </FilterDropdown>

          <FilterDropdown>
            <FilterButton onClick={() => setShowSortDropdown(!showSortDropdown)}>
              <FiMapPin />
              {selectedSort}
              <FiChevronDown />
            </FilterButton>
            {showSortDropdown && (
              <DropdownMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {sortOptions.map((option) => (
                  <DropdownItem
                    key={option}
                    onClick={() => {
                      setSelectedSort(option);
                      setShowSortDropdown(false);
                    }}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </FilterDropdown>
        </FilterGroup>

        <UrgencyTags>
          {urgencyOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => setSelectedUrgency(
                selectedUrgency === option.label ? null : option.label
              )}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <Tag 
                variant={selectedUrgency === option.label ? option.variant : 'default'}
                size="small"
              >
                {option.label}
              </Tag>
            </button>
          ))}
        </UrgencyTags>
      </FilterContainer>
    </FilterSection>
  );
}

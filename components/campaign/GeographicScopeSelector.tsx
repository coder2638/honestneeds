'use client'

import React from 'react'
import styled from 'styled-components'
import { MapPin, Globe } from 'lucide-react'

export type GeographicScope = 'local' | 'state' | 'country' | 'global'

interface GeographicScopeSelectorProps {
  value: GeographicScope
  onChange: (scope: GeographicScope) => void
  location?: string // For local/state context
  disabled?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const InfoBox = styled.div`
  background-color: #e0f2fe;
  border-left: 4px solid #0284c7;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #0c4a6e;
  line-height: 1.5;
`

const ScopeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ScopeCard = styled.div<{ selected: boolean; disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 2px solid ${(props) => (props.selected ? '#3b82f6' : '#e2e8f0')};
  border-radius: 12px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${(props) => {
    if (props.disabled) return '#f8fafc'
    return props.selected ? '#eff6ff' : 'white'
  }};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`

const ScopeIcon = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${(props) => (props.selected ? '#3b82f6' : '#e2e8f0')};
  border-radius: 8px;
  color: white;
  transition: all 0.2s ease;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`

const ScopeTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  text-align: center;
`

const ScopeDescription = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  text-align: center;
  line-height: 1.4;
`

const RadioInput = styled.input`
  display: none;
`

const scopes: Record<
  GeographicScope,
  {
    title: string
    description: string
    icon: React.ReactNode
    benefit: string
  }
> = {
  local: {
    title: '📍 Local',
    description: 'Specific city or neighborhood',
    icon: <MapPin size={20} />,
    benefit: 'Ideal for community-focused causes',
  },
  state: {
    title: '🗺️ Statewide',
    description: 'Entire state or region',
    icon: <MapPin size={20} />,
    benefit: 'Reach supporters across the state',
  },
  country: {
    title: '🇺🇸 Nationwide',
    description: 'Across the entire country',
    icon: <Globe size={20} />,
    benefit: 'Maximum reach within the US',
  },
  global: {
    title: '🌍 Global',
    description: 'Worldwide reach',
    icon: <Globe size={20} />,
    benefit: 'International audience',
  },
}

/**
 * GeographicScopeSelector Component
 * Production-ready selector for campaign geographic scope
 * Allows creators to choose: Local, Statewide, Nationwide, Global
 */
export const GeographicScopeSelector: React.FC<GeographicScopeSelectorProps> = ({
  value,
  onChange,
  location,
  disabled = false,
}) => {
  return (
    <Container>
      <Label>
        <MapPin size={18} />
        Geographic Scope
      </Label>

      <InfoBox>
        ℹ️ <strong>Geographic scope</strong> controls where your campaign can be shared and who
        can see it. Local campaigns are limited to your area, while global campaigns reach
        worldwide supporters.
      </InfoBox>

      <ScopeGrid>
        {(Object.keys(scopes) as GeographicScope[]).map((scope) => {
          const config = scopes[scope]
          const isSelected = value === scope
          const isDisabled = disabled

          return (
            <label key={scope}>
              <RadioInput
                type="radio"
                name="geographicScope"
                value={scope}
                checked={isSelected}
                onChange={() => onChange(scope)}
                disabled={isDisabled}
              />
              <ScopeCard selected={isSelected} disabled={isDisabled}>
                <ScopeIcon selected={isSelected}>{config.icon}</ScopeIcon>
                <ScopeTitle>{config.title}</ScopeTitle>
                <ScopeDescription>{config.description}</ScopeDescription>
                {location && scope === 'local' && (
                  <ScopeDescription style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                    {location}
                  </ScopeDescription>
                )}
              </ScopeCard>
            </label>
          )
        })}
      </ScopeGrid>

      <InfoBox style={{ backgroundColor: '#f0fdf4', borderLeftColor: '#22c55e' }}>
        💡 <strong>Tip:</strong> Choose local or statewide to build community support first,
        then expand globally as your campaign grows!
      </InfoBox>
    </Container>
  )
}

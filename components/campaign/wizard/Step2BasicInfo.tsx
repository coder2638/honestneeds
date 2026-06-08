'use client'

import React, { useCallback, useRef, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Upload, X, MapPin, Map, Globe, Zap } from 'lucide-react'
import { CAMPAIGN_CATEGORIES, GEOGRAPHIC_SCOPES } from '@/utils/validationSchemas'

// ── Tokens ────────────────────────────────────────────────────────────────────
const t = {
  indigo: '#4F46E5', indigoLight: '#EEF2FF', indigoMid: '#818CF8', indigoDark: '#4338CA',
  slate900: '#0F172A', slate700: '#334155', slate600: '#475569',
  slate400: '#94A3B8', slate200: '#E2E8F0', slate100: '#F1F5F9', slate50: '#F8FAFC',
  white: '#fff', red: '#EF4444', amber: '#D97706',
  r: '12px', rs: '8px', tr: '0.18s cubic-bezier(.4,0,.2,1)',
}

const fadeUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`

// ── Layout ────────────────────────────────────────────────────────────────────
const FormStack = styled.div`display:flex;flex-direction:column;gap:1.25rem`
const FormRow = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;
  @media(max-width:560px){grid-template-columns:1fr}
`

// ── Section blocks ────────────────────────────────────────────────────────────
const SectionBlock = styled.div`
  background:${t.white};border:1.5px solid ${t.slate200};
  border-radius:${t.r};padding:1.5rem;
  animation:${fadeUp} 0.3s ease both;
`
const BlockTitle = styled.h3`
  font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;
  color:${t.slate900};margin:0 0 1rem;letter-spacing:-0.01em;
`

// ── Field ─────────────────────────────────────────────────────────────────────
const Field = styled.div`display:flex;flex-direction:column;gap:0.4rem`
const FieldLabel = styled.label`
  font-size:0.8rem;font-weight:500;color:${t.slate700};
  display:flex;align-items:center;gap:4px;
  span.req{color:${t.red}}
`
const FieldHint = styled.span`font-size:0.75rem;color:${t.slate400}`
const FieldError = styled.div`font-size:0.75rem;color:${t.red}`
const CharCount = styled.span<{ $warn: boolean }>`
  font-size:0.72rem;
  color:${({ $warn }) => ($warn ? t.amber : t.slate400)};
  text-align:right;
`
const inputBase = css<{ $error?: boolean }>`
  width:100%;padding:10px 12px;
  border:1.5px solid ${({ $error }) => ($error ? t.red : t.slate200)};
  border-radius:${t.rs};font-family:inherit;font-size:0.875rem;
  color:${t.slate900};background:${t.white};outline:none;
  transition:border-color ${t.tr},box-shadow ${t.tr};
  &:focus{border-color:${t.indigo};box-shadow:0 0 0 3px rgba(79,70,229,.12)}
`
const Input = styled.input<{ $error?: boolean }>`${inputBase}`
const Textarea = styled.textarea<{ $error?: boolean }>`
  ${inputBase};resize:vertical;line-height:1.6;
`
const Select = styled.select<{ $error?: boolean }>`
  ${inputBase};
  appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 12px center;padding-right:36px;
`

// ── Drop zone ─────────────────────────────────────────────────────────────────
const DropZone = styled.div<{ $active: boolean }>`
  border:2px dashed ${({ $active }) => ($active ? t.indigo : t.slate200)};
  border-radius:${t.r};padding:2rem 1.5rem;text-align:center;cursor:pointer;
  background:${({ $active }) => ($active ? t.indigoLight : t.slate50)};
  display:flex;flex-direction:column;align-items:center;gap:0.75rem;
  transition:all ${t.tr};
  &:hover{border-color:${t.indigo};background:${t.indigoLight}}
`
const DropZoneIcon = styled.div`
  width:44px;height:44px;border-radius:10px;
  background:${t.slate100};color:${t.slate400};
  display:flex;align-items:center;justify-content:center;
`
const DropZoneTitle = styled.p`font-weight:500;color:${t.slate700};font-size:0.875rem;margin:0`
const DropZoneSub = styled.p`font-size:0.775rem;color:${t.slate400};margin:0`
const ImagePreviewWrap = styled.div`
  position:relative;max-width:280px;border-radius:${t.rs};overflow:hidden;margin-top:0.75rem;
`
const ImagePreviewImg = styled.img`width:100%;display:block;max-height:200px;object-fit:cover`
const RemoveBtn = styled.button`
  position:absolute;top:6px;right:6px;
  background:rgba(0,0,0,.55);border:none;border-radius:6px;
  color:white;padding:5px 7px;cursor:pointer;
  display:flex;align-items:center;
  &:hover{background:rgba(0,0,0,.75)}
  &:focus-visible{outline:2px solid white;outline-offset:2px}
`

// ── Scope ─────────────────────────────────────────────────────────────────────
const ScopeGrid = styled.div`
  display:grid;grid-template-columns:repeat(4,1fr);gap:8px;
  @media(max-width:500px){grid-template-columns:repeat(2,1fr)}
`
const ScopeBtn = styled.button<{ $sel: boolean }>`
  padding:12px 8px;border-radius:${t.rs};cursor:pointer;
  display:flex;flex-direction:column;align-items:center;gap:6px;
  font-family:inherit;font-size:0.775rem;font-weight:500;text-align:center;line-height:1.3;
  border:1.5px solid ${({ $sel }) => ($sel ? t.indigo : t.slate200)};
  background:${({ $sel }) => ($sel ? t.indigoLight : t.white)};
  color:${({ $sel }) => ($sel ? t.indigo : t.slate600)};
  transition:all ${t.tr};
  &:hover{border-color:${t.indigoMid};background:${t.indigoLight};color:${t.indigo}}
  &:focus-visible{box-shadow:0 0 0 3px rgba(79,70,229,.25)}
`
const ScopeLabel = styled.span`font-weight:700;font-size:0.8rem`
const ScopeSub = styled.span<{ $sel: boolean }>`
  font-size:0.7rem;line-height:1.2;
  color:${({ $sel }) => ($sel ? t.indigoMid : t.slate400)};
`

// ── CTA ───────────────────────────────────────────────────────────────────────
const CtaRow = styled.div`display:flex;justify-content:flex-end;gap:10px;margin-top:1.5rem`
const BtnSecondary = styled.button`
  padding:10px 20px;border:1.5px solid ${t.slate200};border-radius:${t.rs};
  background:${t.white};font-family:inherit;font-size:0.875rem;font-weight:500;
  color:${t.slate700};cursor:pointer;transition:all ${t.tr};
  &:hover{border-color:${t.slate400}}
`
const BtnPrimary = styled.button`
  padding:10px 22px;border:none;border-radius:${t.rs};
  background:${t.indigo};font-family:'Syne',sans-serif;font-size:0.875rem;
  font-weight:700;color:white;cursor:pointer;
  display:flex;align-items:center;gap:6px;transition:all ${t.tr};
  &:hover{background:${t.indigoDark}}
  &:focus-visible{box-shadow:0 0 0 3px rgba(79,70,229,.35)}
`

// ── Component ─────────────────────────────────────────────────────────────────
const SCOPE_ICONS: Record<string, React.ReactNode> = {
  local: <MapPin size={18} />,
  regional: <Map size={18} />,
  national: <Globe size={18} />,
  global: <Zap size={18} />,
}

interface Step2BasicInfoProps {
  formData: {
    title: string
    description: string
    category: string
    location: string
    geographicScope: string | null
    scopeDescription: string
    imagePreview: string | null
  }
  errors: Record<string, string>
  onChange: (field: string, value: any) => void
  onImageSelect: (file: File | null, preview: string | null) => void
  onBack?: () => void
  onNext?: () => void
}

export const Step2BasicInfo: React.FC<Step2BasicInfoProps> = ({
  formData, errors, onChange, onImageSelect, onBack, onNext,
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) return
    const reader = new FileReader()
    reader.onload = (e) => onImageSelect(file, e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false)
    const f = e.dataTransfer.files[0]; if (f) processFile(f)
  }, [])

  const titleLen = formData.title.length
  const descLen = formData.description.length
  const scopeLen = formData.scopeDescription.length

  return (
    <FormStack>
      {/* Core details */}
      <SectionBlock>
        <BlockTitle>Core details</BlockTitle>
        <FormStack>
          <Field>
            <FieldLabel htmlFor="title">Campaign title <span className="req">*</span></FieldLabel>
            <Input
              id="title" type="text" maxLength={200}
              value={formData.title} $error={!!errors.title}
              placeholder="Give your campaign a compelling title…"
              onChange={(e) => onChange('title', e.target.value)}
              aria-invalid={!!errors.title}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <FieldHint>Make it clear, specific, and emotive</FieldHint>
              <CharCount $warn={titleLen > 170}>{titleLen}/200</CharCount>
            </div>
            {errors.title && <FieldError>{errors.title}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description <span className="req">*</span></FieldLabel>
            <Textarea
              id="description" rows={5} maxLength={2000}
              value={formData.description} $error={!!errors.description}
              placeholder="Tell your story. What is this campaign about and why do you need support?…"
              onChange={(e) => onChange('description', e.target.value)}
              aria-invalid={!!errors.description}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <FieldHint>Be personal — donors connect with stories, not stats</FieldHint>
              <CharCount $warn={descLen > 1800}>{descLen}/2000</CharCount>
            </div>
            {errors.description && <FieldError>{errors.description}</FieldError>}
          </Field>
        </FormStack>
      </SectionBlock>

      {/* Category & location */}
      <SectionBlock>
        <BlockTitle>Category & location</BlockTitle>
        <FormRow>
          <Field>
            <FieldLabel htmlFor="cat">Category <span className="req">*</span></FieldLabel>
            <Select
              id="cat" value={formData.category} $error={!!errors.category}
              onChange={(e) => onChange('category', e.target.value)}
              aria-invalid={!!errors.category}
            >
              <option value="">Select a category…</option>
              {CAMPAIGN_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            {errors.category && <FieldError>{errors.category}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="location">
              Location <span style={{ fontWeight: 300, color: t.slate400 }}>(optional)</span>
            </FieldLabel>
            <Input
              id="location" type="text"
              value={formData.location} $error={!!errors.location}
              placeholder="City, State or Zip code"
              onChange={(e) => onChange('location', e.target.value)}
            />
            <FieldHint>Helps local supporters find you</FieldHint>
            {errors.location && <FieldError>{errors.location}</FieldError>}
          </Field>
        </FormRow>
      </SectionBlock>

      {/* Geographic scope */}
      <SectionBlock>
        <BlockTitle>Geographic reach</BlockTitle>
        <ScopeGrid role="radiogroup" aria-label="Geographic scope">
          {GEOGRAPHIC_SCOPES.map((scope) => (
            <ScopeBtn
              key={scope.id} type="button"
              $sel={formData.geographicScope === scope.id}
              onClick={() => onChange('geographicScope', scope.id)}
              aria-pressed={formData.geographicScope === scope.id}
            >
              {SCOPE_ICONS[scope.id]}
              <ScopeLabel>{scope.label}</ScopeLabel>
              <ScopeSub $sel={formData.geographicScope === scope.id}>
                {scope.description}
              </ScopeSub>
            </ScopeBtn>
          ))}
        </ScopeGrid>

        <Field style={{ marginTop: '1rem' }}>
          <FieldLabel htmlFor="scope-desc">
            Scope details <span style={{ fontWeight: 300, color: t.slate400 }}>(optional)</span>
          </FieldLabel>
          <Textarea
            id="scope-desc" rows={2} maxLength={200}
            value={formData.scopeDescription}
            disabled={!formData.geographicScope}
            placeholder="E.g. 'Serving downtown Chicago and neighboring suburbs'"
            onChange={(e) => onChange('scopeDescription', e.target.value)}
            style={{ opacity: formData.geographicScope ? 1 : 0.5 }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CharCount $warn={scopeLen > 180}>{scopeLen}/200</CharCount>
          </div>
          {errors.scopeDescription && <FieldError>{errors.scopeDescription}</FieldError>}
        </Field>
      </SectionBlock>

      {/* Image upload */}
      <SectionBlock>
        <BlockTitle>
          Campaign image{' '}
          <span style={{ fontWeight: 300, color: t.slate400, fontSize: '0.8rem' }}>(optional)</span>
        </BlockTitle>

        {!formData.imagePreview ? (
          <DropZone
            $active={isDragActive}
            onDragEnter={handleDrag} onDragLeave={handleDrag}
            onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button" tabIndex={0} aria-label="Upload campaign image"
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <DropZoneIcon><Upload size={20} /></DropZoneIcon>
            <div>
              <DropZoneTitle>Drag & drop your image here</DropZoneTitle>
              <DropZoneSub>or click to browse — max 10MB, JPEG / PNG / WebP</DropZoneSub>
            </div>
            <input
              ref={fileInputRef} type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }}
              aria-label="Upload campaign image"
            />
          </DropZone>
        ) : (
          <ImagePreviewWrap>
            <ImagePreviewImg src={formData.imagePreview} alt="Campaign preview" />
            <RemoveBtn
              type="button" aria-label="Remove image"
              onClick={() => { onImageSelect(null, null); if (fileInputRef.current) fileInputRef.current.value = '' }}
            >
              <X size={14} />
            </RemoveBtn>
          </ImagePreviewWrap>
        )}
      </SectionBlock>
    </FormStack>
  )
}
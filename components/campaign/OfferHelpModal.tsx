'use client'

import { useState, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import styled from 'styled-components'
import { Modal } from '@/components/Modal'
import Button from '@/components/ui/Button'
import { useCreateVolunteerOffer } from '@/api/hooks/useVolunteer'
import { volunteerOfferSchema, type VolunteerOfferFormData } from '@/utils/validationSchemas'
import { Plus, Trash2 } from 'lucide-react'

/**
 * Volunteer Offer Modal Form
 */

interface OfferHelpModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  campaignTitle: string
}

const StyledContent = styled.div`
  padding: 0;
  min-width: 500px;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }

  form {
    padding: 1.5rem;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;

    @media (max-width: 640px) {
      padding: 0.75rem;
    }

    @media (max-width: 480px) {
      padding: 0.5rem;
    }
  }
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #1f2937;
    font-size: 0.95rem;
    word-break: break-word;

    .required {
      color: #dc2626;
    }

    @media (max-width: 640px) {
      margin-bottom: 0.25rem;
    }

    @media (max-width: 480px) {
      font-size: 0.8rem;
      margin-bottom: 0.15rem;
    }
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.2s ease;
    box-sizing: border-box;

    @media (max-width: 640px) {
      padding: 0.5rem;
      font-size: 0.85rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
      padding: 0.4rem;
    }

    &:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    &:disabled {
      background-color: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }

    &.error {
      border-color: #dc2626;

      &:focus {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
      }
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;

    @media (max-width: 640px) {
      min-height: 70px;
    }

    @media (max-width: 480px) {
      min-height: 60px;
    }
  }
`

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`

const SkillItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr auto;
    gap: 0.25rem;
    padding: 0.35rem;

    button {
      width: auto;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input {
      width: 100%;
      box-sizing: border-box;
    }
  }

  @media (max-width: 480px) {
    gap: 0.2rem;
    padding: 0.25rem;
  }

  input {
    box-sizing: border-box;

    @media (max-width: 640px) {
      width: 100% !important;
    }
  }
`

const AvailabilityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  > div {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;

    label {
      margin-bottom: 0.15rem;
      font-size: 0.7rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      box-sizing: border-box;
    }
  }
`



const ErrorMessage = styled.span`
  display: block;
  margin-top: 0.25rem;
  color: #dc2626;
  font-size: 0.875rem;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    margin-top: 0.125rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-top: 1rem;
  }

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 0.375rem;
    margin-top: 0.75rem;

    button {
      width: 100%;
    }
  }
`

const InfoBox = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 640px) {
    padding: 0.4rem;
    gap: 0.25rem;
    font-size: 0.7rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
    gap: 0.2rem;
    font-size: 0.65rem;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  p {
    margin: 0;
    word-break: break-word;

    strong {
      display: inline;
    }
  }
`

const AddSkillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f0f9ff;
  border: 2px dashed #0ea5e9;
  border-radius: 0.375rem;
  color: #0369a1;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.35rem;
    font-size: 0.7rem;
  }

  &:hover {
    background-color: #e0f2fe;
    border-color: #0284c7;
    color: #0c4a6e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`

export function OfferHelpModal({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
}: OfferHelpModalProps) {
  const { mutate: createOffer, isPending } = useCreateVolunteerOffer()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<VolunteerOfferFormData>({
    resolver: zodResolver(volunteerOfferSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      offerType: 'community_support',
      skillsOffered: [{ name: '', yearsOfExperience: 0 }],
      availability: {
        startDate: '',
        endDate: '',
        hoursPerWeek: 5,
      },
      estimatedHours: 20,
      experienceLevel: 'beginner',
      contactDetails: {
        email: '',
        phone: '',
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skillsOffered',
  })

  const onSubmit = useCallback(
    async (data: VolunteerOfferFormData) => {
      setIsSubmitting(true)
      try {
        // Transform frontend data structure to match backend schema
        const typedData = data as Required<typeof data>
        
        // Convert datetime strings for backend
        const startDateISO = new Date(typedData.availability.startDate).toISOString()
        const endDateISO = new Date(typedData.availability.endDate).toISOString()
        
        createOffer(
          {
            campaignId,
            offerType: typedData.offerType,
            title: typedData.title,
            description: typedData.description,
            skills: typedData.skillsOffered.map((s) => s.name),
            availabilityStartDate: startDateISO,
            availabilityEndDate: endDateISO,
            hoursPerWeek: Number(typedData.availability.hoursPerWeek),
            estimatedHours: Number(typedData.estimatedHours),
            experienceLevel: typedData.experienceLevel,
            contactEmail: typedData.contactDetails.email,
            contactPhone: typedData.contactDetails.phone,
          },
          {
            onSuccess: () => {
              reset()
              onClose()
            },
            onError: () => {
              // Error handled by hook
            },
          }
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [campaignId, createOffer, onClose, reset]
  )

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }, [isSubmitting, onClose, reset])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Offer to Help">
      <StyledContent>

      <InfoBox>
        <p>
          <strong>Campaign:</strong> {campaignTitle}
        </p>
        <p>
          Share your skills and availability. Campaign creators will review your offer and
          contact you if interested.
        </p>
      </InfoBox>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <FormGroup>
          <label>
            What are you offering to help with?{' '}
            <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="E.g., Construction work, meal preparation, tutoring..."
            {...register('title')}
            className={errors.title ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.title && <ErrorMessage>{String(errors.title.message)}</ErrorMessage>}
        </FormGroup>

        {/* Description */}
        <FormGroup>
          <label>
            Tell us more about what you can do <span className="required">*</span>
          </label>
          <textarea
            placeholder="Describe your experience, what tasks you can take on, any special knowledge..."
            {...register('description')}
            className={errors.description ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.description && <ErrorMessage>{String(errors.description.message)}</ErrorMessage>}
        </FormGroup>

        {/* Offer Type */}
        <FormGroup>
          <label>
            What type of help are you offering? <span className="required">*</span>
          </label>
          <select
            {...register('offerType')}
            className={errors.offerType ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Select offer type</option>
            <option value="fundraising">Fundraising Help</option>
            <option value="community_support">Community Support</option>
            <option value="direct_assistance">Direct Assistance</option>
            <option value="other">Other</option>
          </select>
          {errors.offerType && <ErrorMessage>{String(errors.offerType.message)}</ErrorMessage>}
        </FormGroup>

        {/* Experience Level */}
        <FormGroup>
          <label>
            What&rsquo;s your experience level? <span className="required">*</span>
          </label>
          <select
            {...register('experienceLevel')}
            className={errors.experienceLevel ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          {errors.experienceLevel && (
            <ErrorMessage>{String(errors.experienceLevel.message)}</ErrorMessage>
          )}
        </FormGroup>

        {/* Skills */}
        <FormGroup>
          <label>
            Skills & Experience <span className="required">*</span>
          </label>
          <SkillsContainer>
            {fields.map((field, index) => (
              <SkillItem key={field.id}>
                <div>
                  <input
                    type="text"
                    placeholder="Skill name (e.g., carpentry, cooking)"
                    {...register(`skillsOffered.${index}.name`)}
                    className={
                      errors.skillsOffered?.[index]?.name ? 'error' : ''
                    }
                    disabled={isSubmitting}
                  />
                  {errors.skillsOffered?.[index]?.name && (
                    <ErrorMessage>
                      {String(errors.skillsOffered[index]?.name?.message)}
                    </ErrorMessage>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Years"
                    min="0"
                    max="70"
                    {...register(`skillsOffered.${index}.yearsOfExperience`)}
                    disabled={isSubmitting}
                    style={{ width: '80px' }}
                  />
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </SkillItem>
            ))}

            <AddSkillButton
              type="button"
              onClick={() => append({ name: '', yearsOfExperience: 0 })}
              disabled={isSubmitting || fields.length >= 10}
            >
              <Plus size={18} />
              Add Skill
            </AddSkillButton>
          </SkillsContainer>

          {errors.skillsOffered && (
            <ErrorMessage>{String(errors.skillsOffered.message)}</ErrorMessage>
          )}
        </FormGroup>

        {/* Availability */}
        <FormGroup>
          <label>Availability <span className="required">*</span></label>
          <AvailabilityGrid>
            <div>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Start Date</label>
              <input
                type="date"
                {...register('availability.startDate')}
                className={errors.availability?.startDate ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.availability?.startDate && (
                <ErrorMessage>{String(errors.availability.startDate.message)}</ErrorMessage>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>End Date</label>
              <input
                type="date"
                {...register('availability.endDate')}
                className={errors.availability?.endDate ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.availability?.endDate && (
                <ErrorMessage>{String(errors.availability.endDate.message)}</ErrorMessage>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Hours/Week
              </label>
              <input
                type="number"
                placeholder="5"
                min="1"
                max="168"
                {...register('availability.hoursPerWeek')}
                className={errors.availability?.hoursPerWeek ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.availability?.hoursPerWeek?.message && (
                <ErrorMessage>{String(errors.availability.hoursPerWeek.message)}</ErrorMessage>
              )}
            </div>
          </AvailabilityGrid>
        </FormGroup>

        {/* Estimated Hours */}
        <FormGroup>
          <label>
            Estimated total hours you can contribute <span className="required">*</span>
          </label>
          <input
            type="number"
            placeholder="20"
            min="0.5"
            max="500"
            step="0.5"
            {...register('estimatedHours')}
            className={errors.estimatedHours ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.estimatedHours && (
            <ErrorMessage>{String(errors.estimatedHours.message)}</ErrorMessage>
          )}
        </FormGroup>

        {/* Contact Details */}
        <FormGroup>
          <label>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            {...register('contactDetails.email')}
            className={errors.contactDetails?.email ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.contactDetails?.email && (
            <ErrorMessage>{String(errors.contactDetails.email.message)}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <label>
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 123-4567"
            {...register('contactDetails.phone')}
            className={errors.contactDetails?.phone ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.contactDetails?.phone && (
            <ErrorMessage>{String(errors.contactDetails.phone.message)}</ErrorMessage>
          )}
        </FormGroup>

        {/* Submit Buttons */}
        <ButtonGroup>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting || isPending}
          >
            {isSubmitting || isPending ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </ButtonGroup>
      </form>
      </StyledContent>
    </Modal>
  )
}

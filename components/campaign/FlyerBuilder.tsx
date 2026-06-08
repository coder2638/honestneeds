'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Download, Loader, QrCode } from 'lucide-react'
import Button from '@/components/ui/Button'
import { generateQRCodeDataUrl, generateCampaignUrl } from '@/api/services/qrFlyerService'
import { useDownloadFlyer } from '@/api/hooks/useQRAnalytics'

interface FlyerBuilderProps {
  campaignId: string
  campaignTitle?: string
  campaignDescription?: string
  creatorName?: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  
  @media (max-width: 640px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #3b82f6;
    flex-shrink: 0;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    
    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
`

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  
  @media (max-width: 640px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`

const Description = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.6;
  
  @media (max-width: 640px) {
    font-size: 0.8125rem;
    margin: 0 0 0.75rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
  }
`

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
`

const PreviewBox = styled.div`
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  
  @media (max-width: 640px) {
    padding: 1.25rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 8px;
  }
`

const PreviewTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  
  @media (max-width: 640px) {
    font-size: 0.875rem;
    margin: 0 0 0.75rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
    margin: 0 0 0.75rem 0;
  }
`

const QRCodePreview = styled.img`
  max-width: 180px;
  width: 100%;
  height: auto;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  margin: 0 auto 0.75rem auto;
  display: block;
  
  @media (max-width: 640px) {
    max-width: 160px;
    border-radius: 6px;
    margin: 0 auto 0.5rem auto;
  }
  
  @media (max-width: 480px) {
    max-width: 140px;
    border: 2px solid #3b82f6;
    margin: 0 auto 0.5rem auto;
  }
`

const URLDisplay = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.8rem;
  color: #4b5563;
  word-break: break-all;
  font-family: monospace;
  margin-top: 0.75rem;
  line-height: 1.4;
  
  @media (max-width: 640px) {
    padding: 0.6rem;
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.7rem;
    border-radius: 4px;
    margin-top: 0.5rem;
  }
`

const InfoBox = styled.div`
  background: #dbeafe;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    padding: 0.875rem;
    margin-bottom: 1rem;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    border-left-width: 3px;
    border-radius: 4px;
  }
`

const InfoTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 640px) {
    font-size: 0.8125rem;
    margin: 0 0 0.4rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin: 0 0 0.4rem 0;
  }
`

const InfoText = styled.p`
  font-size: 0.8rem;
  color: #0369a1;
  margin: 0;
  line-height: 1.5;
  
  @media (max-width: 640px) {
    font-size: 0.75rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.4;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;

    button {
      width: 100%;
      padding: 0.625rem 1rem !important;
      font-size: 0.9rem !important;
    }
  }
`

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
  font-size: 0.95rem;
  padding: 0.75rem 1.25rem;

  @media (max-width: 640px) {
    flex: none;
    min-width: 140px;
    font-size: 0.875rem;
    padding: 0.65rem 1rem;
  }

  @media (max-width: 480px) {
    flex: 1;
    min-width: unset;
    font-size: 0.85rem;
    padding: 0.625rem 1rem;
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
  
  @media (max-width: 480px) {
    svg {
      width: 0.9rem;
      height: 0.9rem;
    }
  }
`

const LoadingSpinner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;

  li {
    font-size: 0.875rem;
    color: #4b5563;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:before {
      content: '✓';
      color: #16a34a;
      font-weight: bold;
      margin-right: 0.25rem;
      flex-shrink: 0;
    }
  }
  
  @media (max-width: 640px) {
    gap: 0.4rem;
    
    li {
      font-size: 0.8125rem;
    }
  }
  
  @media (max-width: 480px) {
    gap: 0.35rem;
    
    li {
      font-size: 0.8rem;
    }
  }
`

const PlaceholderQR = styled.div`
  width: 180px;
  height: 180px;
  background: #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: #999;
  font-size: 0.875rem;
  flex-shrink: 0;
  
  @media (max-width: 640px) {
    width: 160px;
    height: 160px;
    border-radius: 6px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    width: 140px;
    height: 140px;
    border-radius: 6px;
    font-size: 0.75rem;
  }
`

const CampaignDetailsText = styled.div`
  text-align: left;
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
  
  strong {
    color: #0f172a;
    font-weight: 600;
  }
  
  p {
    margin: 0.5rem 0;
    font-size: 0.8rem;
  }
  
  @media (max-width: 640px) {
    font-size: 0.8125rem;
    line-height: 1.5;
    
    p {
      font-size: 0.75rem;
      margin: 0.4rem 0;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    line-height: 1.4;
    
    p {
      font-size: 0.75rem;
      margin: 0.3rem 0;
    }
  }
`

/**
 * FlyerBuilder Component - Mobile Responsive Edition
 * Allows creators to build and download flyers with embedded QR codes
 * 
 * Responsive Design:
 * - Desktop (> 768px): 2-column grid for previews
 * - Tablet (641-768px): 2-column grid with reduced spacing
 * - Mobile (481-640px): 1-column grid
 * - Small Mobile (< 480px): Full-width single column with optimized spacing
 */
export const FlyerBuilder: React.FC<FlyerBuilderProps> = ({
  campaignId,
  campaignTitle = 'Untitled Campaign',
  campaignDescription = 'Help us make a difference in our community.',
  creatorName = 'Creator',
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isLoadingQR, setIsLoadingQR] = useState(false)
  const downloadFlyer = useDownloadFlyer()

  // Generate QR code
  const handleGenerateQR = async () => {
    try {
      setIsLoadingQR(true)
      const campaignUrl = generateCampaignUrl(campaignId)
      const qrDataUrl = await generateQRCodeDataUrl(campaignUrl)
      setQrCodeUrl(qrDataUrl)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
      alert('Failed to generate QR code. Please try again.')
    } finally {
      setIsLoadingQR(false)
    }
  }

  // Download flyer
  const handleDownloadFlyer = async () => {
    try {
      if (!qrCodeUrl) {
        alert('Please generate QR code first')
        return
      }

      const campaignUrl = generateCampaignUrl(campaignId)
      
      await downloadFlyer.mutateAsync({
        campaignId,
        campaignTitle,
        campaignDescription,
        creatorName,
        qrCodeDataUrl: qrCodeUrl,
        donateUrl: campaignUrl,
        fileName: `${campaignTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-flyer.pdf`,
      })
    } catch (error) {
      console.error('Failed to download flyer:', error)
      alert('Failed to download flyer. Please try again.')
    }
  }

  const campaignUrl = generateCampaignUrl(campaignId)

  return (
    <Container>
      <Header>
        <QrCode />
        <Title>Create Campaign Flyer</Title>
      </Header>

      <Description>
        Generate a professional flyer with an embedded QR code that supporters can scan to donate. Perfect for printing and hanging in stores, community centers, and other public spaces.
      </Description>

      <InfoBox>
        <InfoTitle>💡 How It Works</InfoTitle>
        <InfoText>
          1. Generate a QR code that links to your campaign
          <br />
          2. Download a professional PDF flyer with the QR code
          <br />
          3. Print and post in community locations
          <br />
          4. Track scans and donations from each location
        </InfoText>
      </InfoBox>

      <PreviewContainer>
        <PreviewBox>
          <PreviewTitle>Scan Code Preview</PreviewTitle>
          {qrCodeUrl ? (
            <>
              <QRCodePreview src={qrCodeUrl} alt="Campaign QR Code" />
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.5rem 0 0 0', lineHeight: '1.3' }}>
                Leads to: {campaignUrl}
              </p>
            </>
          ) : (
            <PlaceholderQR>QR Preview</PlaceholderQR>
          )}
        </PreviewBox>

        <PreviewBox>
          <PreviewTitle>Campaign Details</PreviewTitle>
          <CampaignDetailsText>
            <strong>{campaignTitle || 'Untitled Campaign'}</strong>
            <p>
              {campaignDescription && campaignDescription.length > 0
                ? campaignDescription.substring(0, 150)
                : 'Help us make a difference in our community.'}
              {campaignDescription && campaignDescription.length > 150 ? '...' : ''}
            </p>
            <p>
              <strong>By:</strong> {creatorName || 'Creator'}
            </p>
          </CampaignDetailsText>
          <FeaturesList style={{ marginTop: '1rem' }}>
            <li>Standard 8.5" × 11" flyer</li>
            <li>Print-ready PDF format</li>
            <li>Trackable QR code</li>
            <li>Professional design</li>
          </FeaturesList>
        </PreviewBox>
      </PreviewContainer>

      <ActionButtons>
        <ActionButton
          onClick={handleGenerateQR}
          disabled={isLoadingQR || !!qrCodeUrl}
          variant={qrCodeUrl ? 'secondary' : 'primary'}
        >
          {isLoadingQR ? (
            <>
              <LoadingSpinner>
                <Loader />
              </LoadingSpinner>
              <span style={{ display: 'inline' }}>Generating...</span>
            </>
          ) : qrCodeUrl ? (
            <>
              <QrCode />
              <span style={{ display: 'inline' }}>QR Ready</span>
            </>
          ) : (
            <>
              <QrCode />
              <span style={{ display: 'inline' }}>Generate QR</span>
            </>
          )}
        </ActionButton>

        <ActionButton
          onClick={handleDownloadFlyer}
          disabled={!qrCodeUrl || downloadFlyer.isPending}
          variant="primary"
        >
          {downloadFlyer.isPending ? (
            <>
              <LoadingSpinner>
                <Loader />
              </LoadingSpinner>
              <span style={{ display: 'inline' }}>Downloading...</span>
            </>
          ) : (
            <>
              <Download />
              <span style={{ display: 'inline' }}>Download PDF</span>
            </>
          )}
        </ActionButton>
      </ActionButtons>

      <InfoBox>
        <InfoTitle>📊 Track Your Outreach</InfoTitle>
        <InfoText>
          After supporters scan the QR code, you'll be able to track: How many scans from each location, total donations received, supporter engagement, and campaign performance metrics by location.
        </InfoText>
      </InfoBox>
    </Container>
  )
}

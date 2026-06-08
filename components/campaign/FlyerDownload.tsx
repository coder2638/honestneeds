'use client'

import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Download, Printer } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/Button'
import { downloadFlyerPDF, generateCampaignQRUrl } from '@/lib/qrcode'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  padding: 0;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    padding: 0;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
  box-sizing: border-box;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  span {
    padding: 4px 8px;
    background: #e0e7ff;
    color: #4f46e5;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    h3 {
      font-size: 16px;
    }

    span {
      font-size: 11px;
      padding: 3px 6px;
    }
  }
`

const Description = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 1.4;
  }
`

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`

const PreviewLabel = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  box-sizing: border-box;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`

/**
 * 8.5" x 11" flyer template (A4 sized for printing)
 * Dimensions in pixels (assuming 96 DPI): 816px × 1056px
 */
const FlyerTemplate = styled.div`
  width: 100%;
  max-width: 100%;
  aspect-ratio: 816/1056;
  padding: 40px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px;
    gap: 16px;
    aspect-ratio: 816/1056;
  }

  @media (max-width: 640px) {
    padding: 20px;
    gap: 14px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
    aspect-ratio: 816/1056;
    border-radius: 6px;
  }

  /* Print styles */
  @media print {
    max-width: 100%;
    padding: 0.5in;
    box-shadow: none;
    border: none;
    margin: 0;
  }
`

const FlyerHeader = styled.div`
  text-align: center;
  border-bottom: 3px solid #6366f1;
  padding-bottom: 12px;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;

  .brand {
    font-size: 24px;
    font-weight: 700;
    color: #6366f1;
    letter-spacing: -0.5px;
  }

  .tagline {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
  }

  @media (max-width: 640px) {
    padding-bottom: 10px;
    border-bottom: 2px solid #6366f1;

    .brand {
      font-size: 20px;
    }

    .tagline {
      font-size: 10px;
    }
  }

  @media (max-width: 480px) {
    padding-bottom: 8px;

    .brand {
      font-size: 18px;
      letter-spacing: 0;
    }

    .tagline {
      font-size: 9px;
      margin-top: 1px;
    }
  }
`

const FlyerContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
  justify-content: center;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }

  .description {
    font-size: 12px;
    color: #475569;
    line-height: 1.4;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .cta {
    font-size: 13px;
    font-weight: 600;
    color: #6366f1;
    margin-top: 4px;
  }

  @media (max-width: 640px) {
    gap: 10px;

    .title {
      font-size: 16px;
      line-height: 1.25;
    }

    .description {
      font-size: 11px;
      line-height: 1.35;
    }

    .cta {
      font-size: 12px;
      margin-top: 3px;
    }
  }

  @media (max-width: 480px) {
    gap: 8px;

    .title {
      font-size: 14px;
      line-height: 1.2;
    }

    .description {
      font-size: 10px;
      line-height: 1.3;
    }

    .cta {
      font-size: 11px;
      margin-top: 2px;
    }
  }
`

const FlyerQRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 2px solid #f1f5f9;
  box-sizing: border-box;

  .qr-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
  }

  @media (max-width: 640px) {
    padding-top: 10px;
    gap: 6px;

    .qr-label {
      font-size: 10px;
    }
  }

  @media (max-width: 480px) {
    padding-top: 8px;
    gap: 5px;

    .qr-label {
      font-size: 9px;
    }
  }
`

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: white;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  min-height: 108px;

  canvas {
    width: 100px !important;
    height: 100px !important;
    max-width: 100%;
  }

  @media (max-width: 640px) {
    min-height: 90px;
    padding: 3px;

    canvas {
      width: 80px !important;
      height: 80px !important;
    }
  }

  @media (max-width: 480px) {
    min-height: 75px;
    padding: 2px;

    canvas {
      width: 65px !important;
      height: 65px !important;
    }
  }
`

const FlyerFooter = styled.div`
  text-align: center;
  font-size: 10px;
  color: #94a3b8;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 640px) {
    font-size: 9px;
    padding-top: 6px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    padding-top: 4px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;

    button {
      width: 100%;
      box-sizing: border-box;
    }
  }

  @media (max-width: 640px) {
    gap: 8px;

    button {
      width: 100%;
      box-sizing: border-box;
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 6px;

    button {
      width: 100%;
      box-sizing: border-box;
      font-size: 13px;
    }
  }
`

interface FlyerDownloadProps {
  campaignId: string
  campaignTitle: string
  campaignDescription?: string
  creatorName?: string
  category?: string
}

/**
 * FlyerDownload Component
 * Generates 8x11 flyer template with QR code and allows PDF download/print
 */
export const FlyerDownload: React.FC<FlyerDownloadProps> = ({
  campaignId,
  campaignTitle,
  campaignDescription = 'Help make a difference. Support this campaign today.',
  creatorName = 'Creator',
  category = 'Campaign',
}) => {
  const flyerRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string>('')

  const qrUrl = generateCampaignQRUrl(campaignId)

  const handleDownloadPDF = async () => {
    setDownloading(true)
    setError('')
    try {
      if (!flyerRef.current) {
        throw new Error('Flyer element not found')
      }
      await downloadFlyerPDF(flyerRef.current, campaignTitle)
    } catch (err) {
      setError('Failed to download flyer. Please try again.')
      console.error('Error downloading flyer:', err)
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <Container>
      <div>
        <Header>
          <h3>Print Flyer</h3>
          <span>PDF</span>
        </Header>
        <Description>
          Download an 8x11" flyer with your campaign QR code. Perfect for printing and sharing in
          stores, libraries, or community centers.
        </Description>
      </div>

      <PreviewContainer>
        <PreviewLabel>Flyer Preview:</PreviewLabel>

        <FlyerTemplate ref={flyerRef} id="flyer-template">
          <FlyerHeader>
            <div className="brand">HonestNeed</div>
            <div className="tagline">Community Support Platform</div>
          </FlyerHeader>

          <FlyerContent>
            <div className="title">{campaignTitle}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              {category} • By {creatorName}
            </div>
            <div className="description">{campaignDescription}</div>
            <div className="cta">👉 Scan QR code to donate or support</div>
          </FlyerContent>

          <FlyerQRSection>
            <div className="qr-label">SCAN TO DONATE</div>
            <QRCodeContainer>
              <QRCodeSVG
                value={qrUrl}
                size={100}
                level="H"
                includeMargin={false}
              />
            </QRCodeContainer>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              {process.env.NEXT_PUBLIC_APP_URL || 'www.honestneed.com'}
            </div>
          </FlyerQRSection>

          <FlyerFooter>
            © HonestNeed. A transparent platform for community support and fundraising.
          </FlyerFooter>
        </FlyerTemplate>
      </PreviewContainer>

      <ActionButtons>
        <Button
          variant="primary"
          size="md"
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          <Download size={18} />
          {downloading ? 'Generating PDF...' : 'Download as PDF'}
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={handlePrint}
        >
          <Printer size={18} />
          Print Flyer
        </Button>
      </ActionButtons>

      {error && (
        <div
          style={{
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      {/* Print styles - hidden from screen */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          #flyer-template {
            max-width: 100%;
            margin: 0;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </Container>
  )
}

export default FlyerDownload

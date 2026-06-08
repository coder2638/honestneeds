'use client'

import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Download, Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/Button'
import {
  generateCampaignQRUrl,
  downloadQRCodePNG,
  downloadQRCodeSVG,
  getQRDisplayUrl,
} from '@/lib/qrcode'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    gap: 16px;
    padding: 16px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

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
  }
`

const Description = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 16px;
    gap: 12px;
  }
`

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;

  svg, canvas {
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    max-width: 100%;
    height: auto;
    width: 100%;
    min-width: 0;
    max-height: 256px;
  }

  @media (max-width: 480px) {
    svg, canvas {
      max-width: 180px;
      max-height: 180px;
    }
  }
`

const URLDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;

  code {
    flex: 1;
    font-size: 12px;
    color: #475569;
    word-break: break-all;
    font-family: 'Courier New', monospace;
    min-width: 0;
    overflow-wrap: break-word;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    padding: 4px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    
    &:hover {
      color: #1e293b;
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`

interface QRCodeDisplayProps {
  campaignId: string
  campaignTitle: string
  size?: number
}

/**
 * QRCodeDisplay Component
 * Displays campaign QR code with download options (PNG/SVG)
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  campaignId,
  campaignTitle,
  size = 256,
}) => {
  const qrRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState<'png' | 'svg' | null>(null)
  const [error, setError] = useState<string>('')

  const qrUrl = generateCampaignQRUrl(campaignId)
  const displayUrl = getQRDisplayUrl(campaignId)

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy URL')
    }
  }

  const handleDownloadPNG = async () => {
    setDownloading('png')
    setError('')
    try {
      await downloadQRCodePNG(qrRef.current, campaignId)
    } catch (err) {
      setError('Failed to download PNG')
    } finally {
      setDownloading(null)
    }
  }

  const handleDownloadSVG = async () => {
    setDownloading('svg')
    setError('')
    try {
      await downloadQRCodeSVG(qrRef.current, campaignId)
    } catch (err) {
      setError('Failed to download SVG')
    } finally {
      setDownloading(null)
    }
  }

  const handlePrintFlyer = () => {
    // This will be handled by the parent component
    window.print()
  }

  return (
    <Container>
      <div>
        <Header>
          <h3>Campaign QR Code</h3>
          <span>NEW</span>
        </Header>
        <Description>
          Share this QR code on flyers, social media, or in-store displays. Supporters can scan to
          visit your campaign.
        </Description>
      </div>

      <QRContainer>
        <QRCodeWrapper ref={qrRef}>
          <QRCodeSVG
            value={qrUrl}
            size={size}
            level="H"
            includeMargin
            id={`qrcode-${campaignId}`}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '220px',
              minWidth: 0,
              display: 'block',
              margin: '0 auto',
            }}
          />
        </QRCodeWrapper>

        <URLDisplay>
          <code>{displayUrl}</code>
          <button title="Copy URL to clipboard" onClick={handleCopyURL}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </URLDisplay>

        <ActionButtons>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPNG}
            disabled={downloading === 'png'}
          >
            <Download size={16} />
            {downloading === 'png' ? 'Downloading...' : 'Download PNG'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSVG}
            disabled={downloading === 'svg'}
          >
            <Download size={16} />
            {downloading === 'svg' ? 'Downloading...' : 'Download SVG'}
          </Button>
        </ActionButtons>

        {error && (
          <div style={{ color: '#dc2626', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
      </QRContainer>

      <div
        style={{
          padding: '12px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#166534',
          lineHeight: '1.5',
        }}
      >
        <strong>💡 Tip:</strong> Use the PNG version for printing (8x11 flyers, posters). Use SVG
        for digital displays or if you need to resize without quality loss.
      </div>
    </Container>
  )
}

export default QRCodeDisplay

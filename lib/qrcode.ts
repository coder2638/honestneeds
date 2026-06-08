/**
 * QR Code & Flyer Generation Utilities
 * Handles campaign QR code generation and flyer PDF creation
 */

/**
 * Generate campaign QR code URL
 * @param campaignId - Campaign ID
 * @returns Full campaign URL suitable for QR encoding
 */
export const generateCampaignQRUrl = (campaignId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://honestneed.com'
  return `${baseUrl}/campaigns/${campaignId}`
}

/**
 * Download QR code as PNG
 * @param qrElement - QR code canvas element or SVG element
 * @param campaignId - Campaign ID for filename
 */
export const downloadQRCodePNG = async (
  qrElement: HTMLDivElement | null,
  campaignId: string
): Promise<void> => {
  if (!qrElement) {
    throw new Error('QR code element not found')
  }

  try {
    // Find canvas element within the QR code container
    const canvas = qrElement.querySelector('canvas') as HTMLCanvasElement
    if (!canvas) {
      throw new Error('Canvas element not found in QR code')
    }

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${campaignId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 'image/png')
  } catch (error) {
    console.error('Error downloading QR code:', error)
    throw error
  }
}

/**
 * Download QR code as SVG
 * @param qrElement - QR code container element
 * @param campaignId - Campaign ID for filename
 */
export const downloadQRCodeSVG = async (
  qrElement: HTMLDivElement | null,
  campaignId: string
): Promise<void> => {
  if (!qrElement) {
    throw new Error('QR code element not found')
  }

  try {
    // SVG is already in the DOM, we can directly serialize it
    const svg = qrElement.querySelector('svg') as SVGElement
    if (!svg) {
      throw new Error('SVG element not found in QR code')
    }

    // Clone and serialize SVG
    const svgClone = svg.cloneNode(true) as SVGElement
    const serialized = new XMLSerializer().serializeToString(svgClone)
    const blob = new Blob([serialized], { type: 'image/svg+xml' })

    // Download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `qrcode-${campaignId}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading SVG QR code:', error)
    throw error
  }
}

/**
 * Generate flyer PDF from HTML element
 * @param flyerElement - Flyer container HTML element
 * @param campaignTitle - Campaign title for filename
 */
export const downloadFlyerPDF = async (
  flyerElement: HTMLDivElement | null,
  campaignTitle: string
): Promise<void> => {
  if (!flyerElement) {
    throw new Error('Flyer element not found')
  }

  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    // Generate canvas from flyer HTML
    const canvas = await html2canvas(flyerElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // A4 dimensions: 210mm x 297mm
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const pageHeight = 297

    let heightLeft = imgHeight
    let position = 0

    // Handle multi-page if necessary
    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      if (heightLeft > 0) {
        pdf.addPage()
        position = heightLeft - imgHeight
      }
    }

    // Download PDF
    const sanitizedTitle = campaignTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    pdf.save(`flyer-${sanitizedTitle}.pdf`)
  } catch (error) {
    console.error('Error generating flyer PDF:', error)
    throw error
  }
}

/**
 * Format campaign URL for QR display
 * @param campaignId - Campaign ID
 * @returns Display-friendly URL
 */
export const getQRDisplayUrl = (campaignId: string): string => {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'honestneed.com'}/campaigns/${campaignId}`
}

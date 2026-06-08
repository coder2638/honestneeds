/**
 * PDF Export Service for Flyer Generation
 * Generates flyer PDFs with QR codes using jsPDF and html2canvas
 */

export interface PDFGenerationConfig {
  fileName: string
  campaignTitle: string
  campaignDescription: string
  creatorName: string
  qrCodeDataUrl: string
  donateUrl: string
  primaryColor?: string
  secondaryColor?: string
}

/**
 * Generate Flyer PDF
 * Creates a professional flyer PDF with QR code and campaign details
 */
export const generateFlyerPDF = async (config: PDFGenerationConfig): Promise<Blob> => {
  try {
    // Dynamically import jsPDF and html2canvas only when needed
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    // Create a temporary container for rendering
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.width = '816px' // 8.5" at 96 DPI
    container.style.height = '1056px' // 11" at 96 DPI
    container.style.backgroundColor = 'white'
    container.style.padding = '48px' // 0.5" margins
    container.style.fontFamily = 'Arial, sans-serif'
    container.innerHTML = `
      <div style="text-align: center; height: 100%;">
        <!-- Header -->
        <div style="margin-bottom: 20px;">
          <h1 style="font-size: 28px; margin: 0; color: ${config.primaryColor || '#3b82f6'}; font-weight: bold;">
            Help Us Reach Our Goal
          </h1>
          <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Campaign by ${config.creatorName}</p>
        </div>

        <!-- Campaign Title and Description -->
        <div style="background: ${config.secondaryColor || '#f3f4f6'}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="font-size: 20px; margin: 0 0 10px 0; color: #1f2937;">
            ${config.campaignTitle}
          </h2>
          <p style="font-size: 12px; color: #4b5563; margin: 0; line-height: 1.5;">
            ${config.campaignDescription.substring(0, 200)}${config.campaignDescription.length > 200 ? '...' : ''}
          </p>
        </div>

        <!-- QR Code Section -->
        <div style="margin: 30px 0; display: flex; flex-direction: column; align-items: center;">
          <p style="font-size: 12px; color: #666; margin: 0 0 10px 0; font-weight: bold;">Scan to Donate Now:</p>
          <img src="${config.qrCodeDataUrl}" style="width: 150px; height: 150px; border: 2px solid ${config.primaryColor || '#3b82f6'}; border-radius: 4px;" alt="QR Code" />
        </div>

        <!-- Call to Action -->
        <div style="background: ${config.primaryColor || '#3b82f6'}; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 14px; font-weight: bold; margin: 0;">
            Visit: ${config.donateUrl}
          </p>
          <p style="font-size: 11px; margin: 5px 0 0 0;">Every donation helps. Thank you!</p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 10px; color: #999;">
          <p style="margin: 0;">HonestNeed Platform | Scan to Make a Difference</p>
          <p style="margin: 5px 0 0 0;">honestneed.com</p>
        </div>
      </div>
    `

    document.body.appendChild(container)

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: 'white',
    })

    // Clean up
    document.body.removeChild(container)

    // Create PDF from canvas
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter',
    })

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11)

    // Return as Blob
    return pdf.output('blob')
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    throw new Error('Failed to generate flyer PDF')
  }
}

/**
 * Download file helper
 */
export const downloadFile = (blob: Blob, fileName: string): void => {
  if (typeof window === 'undefined') return

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download flyer as PDF
 */
export const downloadFlyer = async (config: PDFGenerationConfig): Promise<void> => {
  try {
    const blob = await generateFlyerPDF(config)
    downloadFile(blob, config.fileName)
  } catch (error) {
    console.error('Failed to download flyer:', error)
    throw error
  }
}

/**
 * Generate multiple flyers (bulk)
 */
export const generateBulkFlyers = async (configs: PDFGenerationConfig[]): Promise<Map<string, Blob>> => {
  const flyers = new Map<string, Blob>()

  for (const config of configs) {
    try {
      const blob = await generateFlyerPDF(config)
      flyers.set(config.fileName, blob)
    } catch (error) {
      console.error(`Failed to generate flyer for ${config.fileName}:`, error)
    }
  }

  return flyers
}

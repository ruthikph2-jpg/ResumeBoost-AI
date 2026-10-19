import Tesseract from 'tesseract.js';

/**
 * Extracts text from an image file (PNG, JPG, WEBP, etc.) using Tesseract OCR.
 * Also serves as an automatic OCR fallback if a PDF is a scanned image.
 */
export async function extractTextFromImage(
  imageSource: File | Blob | string,
  onProgress?: (progress: number, status: string) => void
): Promise<string> {
  try {
    const result = await Tesseract.recognize(
      imageSource,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            onProgress?.(pct, `OCR Scanning: ${pct}%`);
          } else {
            onProgress?.(20, `OCR Engine: ${m.status}...`);
          }
        }
      }
    );

    const extracted = result.data.text?.trim() || '';
    return extracted;
  } catch (error) {
    console.error('Tesseract OCR extraction error:', error);
    throw new Error('Failed to extract text using Tesseract OCR.');
  }
}

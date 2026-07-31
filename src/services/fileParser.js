import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts plain text from an uploaded File object (PDF, TXT, MD, etc.)
 * @param {File} file 
 * @returns {Promise<string>} Extracted resume text
 */
export async function parseUploadedResumeFile(file) {
  if (!file) throw new Error('No file provided.');

  const fileName = file.name.toLowerCase();

  // 1. If PDF file
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      if (!fullText.trim()) {
        throw new Error('PDF file appears to be empty or contains scanned images without text layer.');
      }

      return fullText.trim();
    } catch (err) {
      console.warn('PDF.js extraction error, falling back to basic text reader:', err);
      return await readTextFile(file);
    }
  }

  // 2. Default Text File Reader (TXT, MD, etc.)
  return await readTextFile(file);
}

/**
 * Batch parses multiple uploaded resume files in parallel.
 * @param {Array<File>} files 
 * @returns {Promise<Array<Object>>} Extracted items
 */
export async function parseMultipleUploadedResumeFiles(files) {
  const fileArray = Array.from(files);
  const results = await Promise.all(
    fileArray.map(async (file) => {
      try {
        const text = await parseUploadedResumeFile(file);
        return {
          fileName: file.name,
          text,
          status: 'SUCCESS'
        };
      } catch (err) {
        return {
          fileName: file.name,
          text: '',
          error: err.message,
          status: 'FAILED'
        };
      }
    })
  );
  return results;
}

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = (e) => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

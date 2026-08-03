import * as pdfjsLib from 'pdfjs-dist';

// Use UNPKG CDN or inline worker workerSrc with version fallback
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
}

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
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      if (!fullText.trim()) {
        return await readTextFile(file);
      }

      return fullText.trim();
    } catch (err) {
      console.warn('PDF parsing fallback to FileReader:', err);
      return await readTextFile(file);
    }
  }

  // 2. Default Text File Reader (TXT, MD, DOCX text layer, etc.)
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
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

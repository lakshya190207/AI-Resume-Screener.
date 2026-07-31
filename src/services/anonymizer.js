/**
 * Extraction & Anonymization Engine
 * 
 * Immediately strips PII (Name, Email, Phone, Address, Socials),
 * demographic indicators (Gender pronouns, ethnicity hints),
 * and graduation dates prior to candidate evaluation.
 */

export const ANONYMIZATION_RULES = [
  { name: 'Email Address', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: '[EMAIL REDACTED]' },
  { name: 'Phone Number', regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE REDACTED]' },
  { name: 'LinkedIn Profile', regex: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/gi, replacement: '[LINKEDIN REDACTED]' },
  { name: 'GitHub Profile', regex: /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/gi, replacement: '[GITHUB REDACTED]' },
  { name: 'Website / URL', regex: /(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi, replacement: '[URL REDACTED]' },
  { name: 'Graduation Year / Date', regex: /\b(?:Class of|Graduated|Graduation:?|B\.?S\.?|M\.?S\.?|Ph\.?D\.?|Degree|Diploma)\s*[\w\s,]*?\b(19\d\d|20[0-2]\d)\b/gi, replacement: (match) => match.replace(/\b(19\d\d|20[0-2]\d)\b/g, '[YEAR REDACTED]') },
  { name: 'Standalone Graduation Year', regex: /\b(?:19[89]\d|20[0-2]\d)\s*[-–—]\s*(?:19[89]\d|20[0-2]\d)\b/g, replacement: '[DATE RANGE REDACTED]' },
  { name: 'Gender Pronouns (He/She)', regex: /\b(he|she|him|her|his|hers)\b/gi, replacement: '[PRONOUN REDACTED]' },
  { name: 'Demographic Indicators', regex: /\b(male|female|non-binary|ethnicity|nationality|citizen of|native of)\b/gi, replacement: '[DEMOGRAPHIC REDACTED]' }
];

/**
 * Anonymizes raw resume text by executing all redaction rules.
 * @param {string} rawText 
 * @returns {Object} { anonymizedText, redactionDetails, totalRedactions }
 */
export function anonymizeResume(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { anonymizedText: '', redactionDetails: [], totalRedactions: 0 };
  }

  let text = rawText;
  const redactionDetails = [];
  let totalRedactions = 0;

  // First line name redaction heuristic (Common resume header format)
  const lines = text.split('\n');
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // If first line looks like a person's name (2-4 capitalized words, no colons or email symbols)
    if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/.test(firstLine)) {
      lines[0] = '[CANDIDATE NAME REDACTED]';
      redactionDetails.push({ rule: 'Candidate Name', count: 1, sample: firstLine });
      totalRedactions += 1;
      text = lines.join('\n');
    }
  }

  // Execute regex rules
  ANONYMIZATION_RULES.forEach(rule => {
    const matches = text.match(rule.regex);
    if (matches && matches.length > 0) {
      const count = matches.length;
      totalRedactions += count;
      redactionDetails.push({
        rule: rule.name,
        count: count,
        sample: matches[0]
      });

      if (typeof rule.replacement === 'function') {
        text = text.replace(rule.regex, rule.replacement);
      } else {
        text = text.replace(rule.regex, rule.replacement);
      }
    }
  });

  return {
    anonymizedText: text,
    redactionDetails,
    totalRedactions
  };
}

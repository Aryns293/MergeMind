/**
 * Sanitize a string by stripping HTML tags and trimming whitespace.
 * Prevents basic XSS vectors in user-supplied text fields.
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
};

/**
 * Sanitize code diff content before injecting it into an AI prompt.
 * Strips common prompt injection patterns that an attacker might embed in code.
 *
 * This is a defense-in-depth measure. The AI system prompt will also
 * instruct the model to ignore any instructions found inside user code.
 */
export const sanitizeDiffForPrompt = (diffText) => {
  if (typeof diffText !== 'string') return '';

  // Remove common prompt injection delimiters
  const patterns = [
    /```system/gi,
    /```assistant/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /<<SYS>>/gi,
    /<<\/SYS>>/gi,
    /IGNORE PREVIOUS INSTRUCTIONS/gi,
    /IGNORE ALL PREVIOUS/gi,
    /DISREGARD PREVIOUS/gi,
  ];

  let sanitized = diffText;
  for (const pattern of patterns) {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  }

  return sanitized;
};

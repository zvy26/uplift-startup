/**
 * Utility functions for sentence parsing and highlighting
 */

export interface Sentence {
  id: string;
  text: string;
  index: number;
}

/**
 * Parse text into individual sentences
 * Splits on periods, question marks, and exclamation marks
 */
export const parseSentences = (text: string): Sentence[] => {
  if (!text || typeof text !== 'string') return [];
  
  // Split on sentence endings, but preserve the punctuation
  const sentenceRegex = /[.!?]+/g;
  const sentences: Sentence[] = [];
  let lastIndex = 0;
  let match;
  let sentenceIndex = 0;
  
  while ((match = sentenceRegex.exec(text)) !== null) {
    const sentenceText = text.slice(lastIndex, match.index + match[0].length).trim();
    if (sentenceText) {
      sentences.push({
        id: `sentence-${sentenceIndex}`,
        text: sentenceText,
        index: sentenceIndex
      });
      sentenceIndex++;
    }
    lastIndex = match.index + match[0].length;
  }
  
  // Handle any remaining text after the last sentence ending
  const remainingText = text.slice(lastIndex).trim();
  if (remainingText) {
    sentences.push({
      id: `sentence-${sentenceIndex}`,
      text: remainingText,
      index: sentenceIndex
    });
  }
  
  return sentences;
};

/**
 * Create a mapping between sentences in original and improved text
 * Maps sentences by their position/index within the paragraph
 */
export const createSentenceMapping = (
  originalSentences: Sentence[],
  improvedSentences: Sentence[]
): Map<string, string> => {
  const mapping = new Map<string, string>();
  
  // Map sentences by their index position
  const maxLength = Math.max(originalSentences.length, improvedSentences.length);
  
  for (let i = 0; i < maxLength; i++) {
    const originalSentence = originalSentences[i];
    const improvedSentence = improvedSentences[i];
    
    if (originalSentence && improvedSentence) {
      // Create bidirectional mapping
      mapping.set(originalSentence.id, improvedSentence.id);
      mapping.set(improvedSentence.id, originalSentence.id);
    }
  }
  
  return mapping;
};

/**
 * Get the corresponding sentence ID for cross-panel highlighting
 */
export const getCorrespondingSentenceId = (
  sentenceId: string,
  paragraphId: string,
  isOriginal: boolean
): string | null => {
  // Extract sentence index from the sentence ID
  const sentenceIndex = extractSentenceIndex(sentenceId);
  if (sentenceIndex === -1) return null;
  
  // Determine the target paragraph type
  const targetType = isOriginal ? 'improved' : 'original';
  
  // Extract the paragraph type and name from paragraphId
  const paragraphType = paragraphId.includes('intro') ? 'intro' :
                       paragraphId.includes('body') ? 'body' :
                       paragraphId.includes('conclusion') ? 'conclusion' : '';
  
  // Extract body paragraph number if it's a body paragraph
  let bodyNumber = '';
  if (paragraphType === 'body') {
    const bodyMatch = paragraphId.match(/body-(\d+)/);
    bodyNumber = bodyMatch ? bodyMatch[1] : '';
  }
  
  // Construct the corresponding sentence ID
  const targetParagraphId = `${targetType}-${paragraphType}${bodyNumber}`;
  return `${targetParagraphId}-sentence-${sentenceIndex}`;
};

/**
 * Extract sentence index from sentence ID
 */
const extractSentenceIndex = (sentenceId: string): number => {
  const match = sentenceId.match(/sentence-(\d+)/);
  return match ? parseInt(match[1], 10) : -1;
};

/**
 * Generate sentence colors for highlighting
 */
export const getSentenceColors = (index: number): string => {
  const colors = [
    'bg-blue-50 hover:bg-blue-100 border-blue-200',
    'bg-green-50 hover:bg-green-100 border-green-200',
    'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    'bg-purple-50 hover:bg-purple-100 border-purple-200',
    'bg-pink-50 hover:bg-pink-100 border-pink-200',
    'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    'bg-orange-50 hover:bg-orange-100 border-orange-200',
    'bg-teal-50 hover:bg-teal-100 border-teal-200',
  ];
  
  return colors[index % colors.length];
};

/**
 * Get highlight color for active sentence
 */
export const getActiveSentenceColor = (index: number): string => {
  const colors = [
    'bg-blue-100 border-blue-300',
    'bg-green-100 border-green-300',
    'bg-yellow-100 border-yellow-300',
    'bg-purple-100 border-purple-300',
    'bg-pink-100 border-pink-300',
    'bg-indigo-100 border-indigo-300',
    'bg-orange-100 border-orange-300',
    'bg-teal-100 border-teal-300',
  ];
  
  return colors[index % colors.length];
};

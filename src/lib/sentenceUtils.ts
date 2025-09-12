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
 * This function maps sentences by their position (index) within the same paragraph type
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
  let paragraphType = '';
  let bodyNumber = '';
  
  if (paragraphId.includes('intro')) {
    paragraphType = 'intro';
  } else if (paragraphId.includes('conclusion')) {
    paragraphType = 'conclusion';
  } else if (paragraphId.includes('body')) {
    paragraphType = 'body';
    const bodyMatch = paragraphId.match(/body-(\d+)/);
    bodyNumber = bodyMatch ? bodyMatch[1] : '';
  }
  
  // Construct the corresponding sentence ID with the same sentence index
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
    'bg-blue-200 hover:bg-blue-300 border-2 border-blue-400 text-blue-900 shadow-sm',
    'bg-green-200 hover:bg-green-300 border-2 border-green-400 text-green-900 shadow-sm',
    'bg-yellow-200 hover:bg-yellow-300 border-2 border-yellow-400 text-yellow-900 shadow-sm',
    'bg-purple-200 hover:bg-purple-300 border-2 border-purple-400 text-purple-900 shadow-sm',
    'bg-pink-200 hover:bg-pink-300 border-2 border-pink-400 text-pink-900 shadow-sm',
    'bg-indigo-200 hover:bg-indigo-300 border-2 border-indigo-400 text-indigo-900 shadow-sm',
    'bg-orange-200 hover:bg-orange-300 border-2 border-orange-400 text-orange-900 shadow-sm',
    'bg-teal-200 hover:bg-teal-300 border-2 border-teal-400 text-teal-900 shadow-sm',
  ];
  
  return colors[index % colors.length];
};

/**
 * Get highlight color for active sentence
 */
export const getActiveSentenceColor = (index: number): string => {
  const colors = [
    'bg-blue-500 border-4 border-blue-700 text-white shadow-xl transform scale-110 font-bold',
    'bg-green-500 border-4 border-green-700 text-white shadow-xl transform scale-110 font-bold',
    'bg-yellow-500 border-4 border-yellow-700 text-white shadow-xl transform scale-110 font-bold',
    'bg-purple-500 border-4 border-purple-700 text-white shadow-xl transform scale-110 font-bold',
    'bg-pink-500 border-4 border-pink-700 text-white shadow-xl transform scale-110 font-bold',
    'bg-indigo-500 border-4 border-indigo-700 text-white shadow-xl transform scale-110 font-bold',
    'bg-orange-500 border-4 border-orange-700 text-white shadow-xl transform scale-110 font-bold',
    'bg-teal-500 border-4 border-teal-700 text-white shadow-xl transform scale-110 font-bold',
  ];
  
  return colors[index % colors.length];
};

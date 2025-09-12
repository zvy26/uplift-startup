import React from 'react';
import { getSentenceColors, getActiveSentenceColor } from '@/lib/sentenceUtils';

interface SentenceWrapperProps {
  sentence: {
    id: string;
    text: string;
    index: number;
  };
  dataId: string;
  isActive: boolean;
  onHover: (sentenceId: string | null) => void;
  onFocus: (sentenceId: string | null) => void;
  className?: string;
}

export const SentenceWrapper: React.FC<SentenceWrapperProps> = ({
  sentence,
  dataId,
  isActive,
  onHover,
  onFocus,
  className = ''
}) => {
  const baseColors = getSentenceColors(sentence.index);
  const activeColors = getActiveSentenceColor(sentence.index);
  
  const handleMouseEnter = () => {
    // Highlight all elements with the same data-id
    const elements = document.querySelectorAll(`[data-sentence-id="${dataId}"]`);
    elements.forEach(el => {
      el.classList.add('sentence-highlighted');
    });
    onHover(sentence.id);
  };
  
  const handleMouseLeave = () => {
    // Remove highlight from all elements with the same data-id
    const elements = document.querySelectorAll(`[data-sentence-id="${dataId}"]`);
    elements.forEach(el => {
      el.classList.remove('sentence-highlighted');
    });
    onHover(null);
  };
  
  const handleFocus = () => {
    onFocus(sentence.id);
  };
  
  const handleBlur = () => {
    onFocus(null);
  };
  
  return (
    <span
      data-sentence-id={dataId}
      className={`
        inline-block px-2 py-1 rounded-md transition-all duration-300 cursor-pointer
        ${isActive ? activeColors : baseColors}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="button"
      aria-label={`Sentence ${sentence.index + 1}`}
    >
      {sentence.text}
    </span>
  );
};

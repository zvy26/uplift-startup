import React from 'react';
import { getSentenceColors, getActiveSentenceColor } from '@/lib/sentenceUtils';

interface SentenceWrapperProps {
  sentence: {
    id: string;
    text: string;
    index: number;
  };
  isActive: boolean;
  onHover: (sentenceId: string | null) => void;
  onFocus: (sentenceId: string | null) => void;
  className?: string;
}

export const SentenceWrapper: React.FC<SentenceWrapperProps> = ({
  sentence,
  isActive,
  onHover,
  onFocus,
  className = ''
}) => {
  const baseColors = getSentenceColors(sentence.index);
  const activeColors = getActiveSentenceColor(sentence.index);
  
  const handleMouseEnter = () => {
    onHover(sentence.id);
  };
  
  const handleMouseLeave = () => {
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
      className={`
        inline-block px-1 py-0.5 rounded transition-all duration-200 cursor-pointer
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

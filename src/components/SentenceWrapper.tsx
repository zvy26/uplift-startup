import React, { useCallback, memo } from 'react';
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

export const SentenceWrapper: React.FC<SentenceWrapperProps> = memo(({
  sentence,
  dataId,
  isActive,
  onHover,
  onFocus,
  className = ''
}) => {
  const baseColors = getSentenceColors(sentence.index);
  const activeColors = getActiveSentenceColor(sentence.index);
  
  const handleMouseEnter = useCallback(() => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll(`[data-sentence-id="${dataId}"]`);
      elements.forEach(el => {
        el.classList.add('sentence-highlighted');
      });
    });
    onHover(sentence.id);
  }, [dataId, onHover, sentence.id]);
  
  const handleMouseLeave = useCallback(() => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll(`[data-sentence-id="${dataId}"]`);
      elements.forEach(el => {
        el.classList.remove('sentence-highlighted');
      });
    });
    onHover(null);
  }, [dataId, onHover]);
  
  const handleFocus = useCallback(() => {
    onFocus(sentence.id);
  }, [onFocus, sentence.id]);
  
  const handleBlur = useCallback(() => {
    onFocus(null);
  }, [onFocus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMouseEnter();
    } else if (e.key === 'Escape') {
      handleMouseLeave();
    }
  }, [handleMouseEnter, handleMouseLeave]);
  
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
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Sentence ${sentence.index + 1}: ${sentence.text.substring(0, 50)}${sentence.text.length > 50 ? '...' : ''}`}
      aria-describedby={`sentence-${sentence.id}-description`}
    >
      {sentence.text}
    </span>
  );
});

import React, { useMemo } from 'react';
import { parseSentences, getCorrespondingSentenceId } from '@/lib/sentenceUtils';
import { SentenceWrapper } from './SentenceWrapper';

interface SentenceTextProps {
  text: string;
  paragraphId: string;
  activeSentenceId: string | null;
  onSentenceHover: (sentenceId: string | null) => void;
  onSentenceFocus: (sentenceId: string | null) => void;
  className?: string;
}

export const SentenceText: React.FC<SentenceTextProps> = ({
  text,
  paragraphId,
  activeSentenceId,
  onSentenceHover,
  onSentenceFocus,
  className = ''
}) => {
  const sentences = useMemo(() => {
    return parseSentences(text);
  }, [text]);
  
  if (sentences.length === 0) {
    return <span className={className}>{text}</span>;
  }
  
  return (
    <span className={className}>
      {sentences.map((sentence, index) => {
        const sentenceId = `${paragraphId}-${sentence.id}`;
        
        // Check if this sentence should be highlighted
        const isActive = activeSentenceId === sentenceId;
        
        // Check if this sentence should be highlighted due to cross-panel highlighting
        const isCurrentOriginal = paragraphId.includes('original-');
        const correspondingSentenceId = activeSentenceId ? 
          getCorrespondingSentenceId(activeSentenceId, paragraphId, isCurrentOriginal) : null;
        const isCrossHighlighted = correspondingSentenceId === sentenceId;
        
        return (
          <React.Fragment key={sentenceId}>
            <SentenceWrapper
              sentence={{
                ...sentence,
                id: sentenceId
              }}
              isActive={isActive || isCrossHighlighted}
              onHover={onSentenceHover}
              onFocus={onSentenceFocus}
            />
            {index < sentences.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </span>
  );
};


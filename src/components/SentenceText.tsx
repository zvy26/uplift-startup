import React, { useMemo, memo } from 'react';
import { parseSentences } from '@/lib/sentenceUtils';
import { SentenceWrapper } from './SentenceWrapper';
import { SuggestionHighlighter } from './SuggestionHighlighter';

interface SentenceTextProps {
  text: string;
  paragraphId: string;
  activeSentenceId: string | null;
  onSentenceHover: (sentenceId: string | null) => void;
  onSentenceFocus: (sentenceId: string | null) => void;
  className?: string;
  mistakes?: string[];
  suggestions?: string[];
  showErrors?: boolean;
}

export const SentenceText: React.FC<SentenceTextProps> = memo(({
  text,
  paragraphId,
  activeSentenceId,
  onSentenceHover,
  onSentenceFocus,
  className = '',
  mistakes = [],
  suggestions = [],
  showErrors = false
}) => {
  const sentences = useMemo(() => {
    return parseSentences(text);
  }, [text]);
  
  if (sentences.length === 0) {
    if (showErrors && (mistakes.length > 0 || suggestions.length > 0)) {
      return (
        <span className={className}>
          <SuggestionHighlighter
            text={text}
            mistakes={mistakes}
            suggestions={suggestions}
          />
        </span>
      );
    }
    return <span className={className}>{text}</span>;
  }
  
  return (
    <span className={className}>
      {sentences.map((sentence, index) => {
        let paragraphType = '';
        if (paragraphId.includes('intro')) {
          paragraphType = 'intro';
        } else if (paragraphId.includes('conclusion')) {
          paragraphType = 'conclusion';
        } else if (paragraphId.includes('body')) {
          const bodyMatch = paragraphId.match(/body-(\d+)/);
          paragraphType = bodyMatch ? `body${bodyMatch[1]}` : 'body';
        } else {
          paragraphType = 'unknown';
        }
        
        const dataId = `${paragraphType}-${sentence.index}`;
        
        return (
          <React.Fragment key={`${paragraphId}-${sentence.id}`}>
            <SentenceWrapper
              sentence={{
                ...sentence,
                id: `${paragraphId}-${sentence.id}`
              }}
              dataId={dataId}
              isActive={activeSentenceId === `${paragraphId}-${sentence.id}`}
              onHover={onSentenceHover}
              onFocus={onSentenceFocus}
              mistakes={mistakes}
              suggestions={suggestions}
              showErrors={showErrors}
            />
            {index < sentences.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </span>
  );
});


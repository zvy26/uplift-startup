import React, { useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Lightbulb } from 'lucide-react';

interface SuggestionHighlight {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'mistake' | 'suggestion';
  description: string;
  suggestion?: string;
  category: 'vocabulary' | 'grammar' | 'coherence' | 'task';
}

interface SuggestionHighlighterProps {
  text: string;
  mistakes: string[];
  suggestions: string[];
  className?: string;
}

/**
 * Advanced suggestion highlighting that maps AI feedback to specific text segments
 * Shows both mistakes and suggestions with different colors
 */
const parseSuggestionHighlights = (text: string, mistakes: string[], suggestions: string[]): SuggestionHighlight[] => {
  const highlights: SuggestionHighlight[] = [];
  
  // Enhanced patterns based on the provided feedback
  const mistakePatterns = [
    // Vocabulary issues from feedback
    { 
      pattern: /\b(integral part|numerous benefits)\b/gi, 
      type: 'mistake' as const, 
      description: 'Common vocabulary choices that lack precision',
      suggestion: 'Use more sophisticated alternatives like "fundamental component" or "substantial advantages"',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(daily lives|daily routines)\b/gi, 
      type: 'mistake' as const, 
      description: 'Repetitive phrasing - same words used frequently',
      suggestion: 'Vary your vocabulary: "everyday existence", "quotidian activities", "routine practices"',
      category: 'vocabulary' as const
    },
    
    // Additional patterns from AI feedback - Positive examples
    { 
      pattern: /\b(rapidly evolving|streamlined|simplified)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good use of sophisticated vocabulary',
      suggestion: 'These words show good lexical range and precision',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(technological advancements|innovations)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Academic vocabulary usage',
      suggestion: 'Excellent use of formal academic language',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(integral part|fundamental|essential)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good academic vocabulary choice',
      suggestion: 'These words demonstrate appropriate academic tone',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(explore|examine|analyze|investigate)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Strong academic verbs',
      suggestion: 'Excellent use of formal academic language',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(perspectives|viewpoints|arguments)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good use of academic nouns',
      suggestion: 'These words show sophisticated vocabulary range',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(furthermore|moreover|additionally|consequently)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Excellent cohesive devices',
      suggestion: 'Great use of sophisticated linking words',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(in conclusion|to summarize|ultimately)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good conclusion phrases',
      suggestion: 'These are appropriate academic conclusion starters',
      category: 'coherence' as const
    },
    
    // Coherence issues
    { 
      pattern: /\b(on the other hand|on one hand)\b/gi, 
      type: 'mistake' as const, 
      description: 'Overuse of basic cohesive devices',
      suggestion: 'Try: "conversely", "in contrast", "alternatively", "nevertheless", "moreover"',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(firstly|secondly|thirdly|fourthly)\b/gi, 
      type: 'mistake' as const, 
      description: 'Basic enumeration - lacks sophistication',
      suggestion: 'Try: "initially", "subsequently", "furthermore", "moreover", "additionally"',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(and|but|so)\s*[,.]/gi, 
      type: 'mistake' as const, 
      description: 'Incorrect punctuation with basic conjunctions',
      suggestion: 'Use more sophisticated linking words or correct punctuation',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(also|too|as well)\b/gi, 
      type: 'mistake' as const, 
      description: 'Overuse of basic addition words',
      suggestion: 'Try: "furthermore", "moreover", "additionally", "in addition"',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(because|since|as)\b/gi, 
      type: 'mistake' as const, 
      description: 'Repetitive cause-effect connectors',
      suggestion: 'Vary with: "due to", "owing to", "as a result of", "consequently"',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(then|next|after that)\b/gi, 
      type: 'mistake' as const, 
      description: 'Basic sequence connectors',
      suggestion: 'Use: "subsequently", "thereafter", "following this", "in the next phase"',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(very|really|quite|so)\s+(important|good|bad|big|small)\b/gi, 
      type: 'mistake' as const, 
      description: 'Weak intensifier + basic adjective combinations',
      suggestion: 'Use stronger adjectives: "crucial", "significant", "substantial", "minimal"',
      category: 'coherence' as const
    },
    
    
    // General vocabulary issues
    { 
      pattern: /\b(very|really|quite|so)\s+\w+/gi, 
      type: 'mistake' as const, 
      description: 'Overuse of intensifiers',
      suggestion: 'Use more precise vocabulary instead of intensifiers',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(good|bad|nice|great|awesome|terrible|horrible)\b/gi, 
      type: 'mistake' as const, 
      description: 'Basic vocabulary - use more academic alternatives',
      suggestion: 'Consider: excellent, poor, beneficial, detrimental, remarkable, etc.',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(thing|stuff|things|something|anything)\b/gi, 
      type: 'mistake' as const, 
      description: 'Vague vocabulary - be more specific',
      suggestion: 'Replace with precise nouns that clearly convey your meaning',
      category: 'vocabulary' as const
    },
    
    // Grammar issues
    { 
      pattern: /\b(its|it's)\b/gi, 
      type: 'mistake' as const, 
      description: 'Check apostrophe usage',
      suggestion: 'its = possessive, it\'s = it is',
      category: 'grammar' as const
    },
    { 
      pattern: /\b(there|their|they're)\b/gi, 
      type: 'mistake' as const, 
      description: 'Check homophone usage',
      suggestion: 'there = location, their = possessive, they\'re = they are',
      category: 'grammar' as const
    },
  ];

    // Suggestion patterns (positive improvements)
  const suggestionPatterns = [
    { 
      pattern: /\b(lexical range|precise synonyms|idiomatic expressions)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Vocabulary improvement suggestions',
      suggestion: 'Focus on expanding your vocabulary with more sophisticated terms',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(cohesive devices|linking words|sophisticated flow)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Coherence improvement suggestions',
      suggestion: 'Use varied connecting words to improve essay flow',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(complex sentence structures|participial phrases|noun clauses)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Grammar improvement suggestions',
      suggestion: 'Practice using different types of sentence structures',
      category: 'grammar' as const
    },
    
    // Additional positive patterns for essay content
    { 
      pattern: /\b(contemporary|modern|current|present-day)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good use of time-related vocabulary',
      suggestion: 'Excellent choice of contemporary academic language',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(significantly|substantially|considerably|notably)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good use of degree adverbs',
      suggestion: 'These words show sophisticated vocabulary range',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(comprehensive|thorough|extensive|detailed)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Excellent descriptive vocabulary',
      suggestion: 'Great use of academic descriptive language',
      category: 'vocabulary' as const
    },
    { 
      pattern: /\b(consequently|therefore|thus|hence)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good logical connectors',
      suggestion: 'Excellent use of cause-effect linking words',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(nevertheless|nonetheless|however|although)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good contrast connectors',
      suggestion: 'Great use of sophisticated contrast linking words',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(initially|subsequently|furthermore|moreover|additionally)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Excellent enumeration connectors',
      suggestion: 'Perfect use of sophisticated sequence and addition words',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(in contrast|conversely|alternatively|on the contrary)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good contrast and comparison connectors',
      suggestion: 'Excellent use of sophisticated contrast linking words',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(due to|owing to|as a result of|consequently|therefore)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good cause-effect connectors',
      suggestion: 'Great use of sophisticated cause-effect linking words',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(subsequently|thereafter|following this|in the next phase)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good sequence connectors',
      suggestion: 'Excellent use of sophisticated sequence linking words',
      category: 'coherence' as const
    },
    { 
      pattern: /\b(in addition|furthermore|moreover|additionally)\b/gi, 
      type: 'suggestion' as const, 
      description: 'Good addition connectors',
      suggestion: 'Perfect use of sophisticated addition linking words',
      category: 'coherence' as const
    },
  ];

  // Find matches for mistake patterns
  mistakePatterns.forEach(({ pattern, type, description, suggestion, category }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      highlights.push({
        text: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        type,
        description,
        suggestion,
        category
      });
    }
  });

  // Find matches for suggestion patterns
  suggestionPatterns.forEach(({ pattern, type, description, suggestion, category }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      highlights.push({
        text: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        type,
        description,
        suggestion,
        category
      });
    }
  });

  // Sort by start index to avoid conflicts
  highlights.sort((a, b) => a.startIndex - b.startIndex);

  // Remove overlapping highlights (keep the first one)
  const filteredHighlights: SuggestionHighlight[] = [];
  let lastEndIndex = 0;

  highlights.forEach(highlight => {
    if (highlight.startIndex >= lastEndIndex) {
      filteredHighlights.push(highlight);
      lastEndIndex = highlight.endIndex;
    }
  });

  return filteredHighlights;
};

const getColorForType = (type: string, category: string) => {
  if (type === 'mistake') {
    switch (category) {
      case 'vocabulary': return 'bg-red-100 text-red-900 border-red-400 hover:bg-red-200 hover:border-red-500 underline decoration-red-500 decoration-2 underline-offset-2';
      case 'grammar': return 'bg-red-100 text-red-900 border-red-400 hover:bg-red-200 hover:border-red-500 underline decoration-red-500 decoration-2 underline-offset-2';
      case 'coherence': return 'bg-red-100 text-red-900 border-red-400 hover:bg-red-200 hover:border-red-500 underline decoration-red-500 decoration-2 underline-offset-2';
      default: return 'bg-red-100 text-red-900 border-red-400 hover:bg-red-200 hover:border-red-500 underline decoration-red-500 decoration-2 underline-offset-2';
    }
  } else {
    // Positive suggestions with different colors
    switch (category) {
      case 'coherence': return 'bg-blue-200 text-blue-900 border-blue-500 hover:bg-blue-300 hover:border-blue-600 underline decoration-blue-600 decoration-2 underline-offset-2';
      case 'vocabulary': return 'bg-purple-200 text-purple-900 border-purple-500 hover:bg-purple-300 hover:border-purple-600 underline decoration-purple-600 decoration-2 underline-offset-2';
      case 'grammar': return 'bg-purple-200 text-purple-900 border-purple-500 hover:bg-purple-300 hover:border-purple-600 underline decoration-purple-600 decoration-2 underline-offset-2';
      default: return 'bg-purple-200 text-purple-900 border-purple-500 hover:bg-purple-300 hover:border-purple-600 underline decoration-purple-600 decoration-2 underline-offset-2';
    }
  }
};

const getIconForType = (type: string) => {
  return type === 'mistake' ? AlertCircle : Lightbulb;
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'vocabulary': return 'Lexical Resource';
    case 'grammar': return 'Grammar & Accuracy';
    case 'coherence': return 'Coherence & Cohesion';
    case 'task': return 'Task Achievement';
    default: return 'General';
  }
};

export const SuggestionHighlighter: React.FC<SuggestionHighlighterProps> = ({
  text,
  mistakes,
  suggestions,
  className = ''
}) => {
  const [hoveredHighlight, setHoveredHighlight] = useState<SuggestionHighlight | null>(null);
  
  const suggestionHighlights = useMemo(() => {
    return parseSuggestionHighlights(text, mistakes, suggestions);
  }, [text, mistakes, suggestions]);

  if (suggestionHighlights.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Split text into parts with highlighted suggestions/errors
  const renderTextWithHighlights = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    suggestionHighlights.forEach((highlight, index) => {
      // Add text before the highlight
      if (highlight.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.startIndex)}
          </span>
        );
      }

      // Add the highlighted suggestion/error
      const IconComponent = getIconForType(highlight.type);
      const colorClasses = getColorForType(highlight.type, highlight.category);
      const categoryLabel = getCategoryLabel(highlight.category);
      
      parts.push(
        <TooltipProvider key={`highlight-${index}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`
                  ${colorClasses} border rounded px-1.5 py-0.5 cursor-help
                  transition-all duration-200 text-sm font-medium
                  ${hoveredHighlight === highlight ? 'shadow-lg scale-105' : 'hover:shadow-md'}
                `}
                onMouseEnter={() => setHoveredHighlight(highlight)}
                onMouseLeave={() => setHoveredHighlight(null)}
              >
                {highlight.text}
              </span>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className={`max-w-sm p-3 bg-white border shadow-lg z-50 rounded-lg ${
                highlight.type === 'mistake' 
                  ? 'border-red-200' 
                  : 'border-blue-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-4 w-4 ${
                    highlight.type === 'mistake' 
                      ? 'text-red-500' 
                      : 'text-blue-500'
                  }`} />
                  <span className={`font-semibold text-sm ${
                    highlight.type === 'mistake' 
                      ? 'text-red-800' 
                      : 'text-blue-800'
                  }`}>
                    {highlight.type === 'mistake' ? 'Error' : 'Positive Tip'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    highlight.type === 'mistake' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {categoryLabel}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700">
                  {highlight.description}
                </p>
                
                {highlight.suggestion && (
                  <div className={`p-2 rounded border-l-2 ${
                    highlight.type === 'mistake' 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-blue-50 border-blue-300'
                  }`}>
                    <div className="flex items-center gap-1 mb-1">
                      <Lightbulb className={`h-3 w-3 ${
                        highlight.type === 'mistake' 
                          ? 'text-yellow-600' 
                          : 'text-blue-600'
                      }`} />
                      <p className={`text-xs font-medium ${
                        highlight.type === 'mistake' 
                          ? 'text-red-700' 
                          : 'text-blue-700'
                      }`}>
                        {highlight.type === 'mistake' ? 'Suggestion:' : 'Why good:'}
                      </p>
                    </div>
                    <p className={`text-xs ${
                      highlight.type === 'mistake' 
                        ? 'text-red-600' 
                        : 'text-blue-600'
                    }`}>{highlight.suggestion}</p>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      lastIndex = highlight.endIndex;
    });

    // Add remaining text after the last highlight
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <span className={className}>
      {renderTextWithHighlights()}
    </span>
  );
};

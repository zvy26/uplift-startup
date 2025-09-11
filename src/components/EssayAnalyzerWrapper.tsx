import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSubmitEssay, useLatestSubmission, useSubmissionById } from '@/services/essayMutations';
import { SendSubmission } from '@/modules/essay/types/SendSubmission';
import { EssayCreator } from './EssayCreator';
import { EssayResults } from './EssayResults';
import { IELTSWritingSubmissionStatus } from '@/modules/essay/types/Submission';
import {
  getEssayFromStorage,
  clearEssayFromStorage,
  SavedEssayData,
} from '@/lib/essayStorage';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import { toast } from 'sonner';

interface AnalysisOptions {
  colorAlignment: boolean;
  showExplanations: boolean;
  minimalEdits: boolean;
}

interface UiBandVersion {
  band: number;
  sections: {
    introduction: string;
    body: string[];
    conclusion: string;
  };
  improvements: string[];
  paragraphs: ParagraphMap[];
}

interface ParagraphMap {
  original: string;
  improved: string;
  color: string;
  id: string;
}

interface EssayAnalyzerWrapperProps {
  submissionId?: string | null;
  onScoreUpdate: (band: number | null, hasAnalyzed: boolean) => void;
}

export const EssayAnalyzerWrapper = ({
  submissionId,
  onScoreUpdate,
}: EssayAnalyzerWrapperProps) => {
  const { authenticated } = useAuthContext();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [currentBand, setCurrentBand] = useState<number | null>(null);
  const [bandVersions, setBandVersions] = useState<UiBandVersion[]>([]);
  const [hoveredSentence, setHoveredSentence] = useState<string | null>(null);
  const [selectedBand, setSelectedBand] = useState<number>(9);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);
  const [targetScore, setTargetScore] = useState<
    'BAND_SEVEN' | 'BAND_EIGHT' | 'BAND_NINE'
  >('BAND_NINE');
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTipVisible, setIsTipVisible] = useState(true);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  // Auto-analysis disabled per requirements. Keep flag removed.

  // Clear any previous results when component mounts (user navigates to the page)
  useEffect(() => {
    clearCurrentResults();
  }, []);

  // Function to clear current results when starting new analysis
  const clearCurrentResults = () => {
    setCurrentSubmissionId(null);
    setHasAnalyzed(false);
    setBandVersions([]);
    setCurrentBand(null);
    setIsAnalyzed(false);
    onScoreUpdate(null, false);
  };

  const ieltsTips = [
    "If you don't know a word, don't panic. Look at the sentence around it and guess the meaning. Time is limited, so keep moving.",
    "Don't copy the task statement word-for-word. Use synonyms and change sentence structure.",
    'Plan your essay for 3–5 minutes before writing. Write down key ideas, examples, and your opinion. A clear plan saves time later.',
    'Support every main idea with an example.',
    'Use linking devices naturally. Examples: On the other hand, therefore, as a result, in contrast.',
  ];

  // Use specific submission if provided, otherwise use latest
  const {
    data: specificSubmission,
    isLoading: isLoadingSpecific,
  } = useSubmissionById(submissionId);

  const {
    data: latestSubmission,
    isProcessing,
    isFailed,
    isLoading: submissionsLoading,
    isPendingAnalysed,
  } = useLatestSubmission(authenticated && !submissionId); // Only fetch latest if no specific submission ID

  // Determine which submission to use
  const activeSubmission = submissionId ? specificSubmission : latestSubmission;
  const isLoadingSubmission = submissionId ? isLoadingSpecific : submissionsLoading;

  const submitEssayMutation = useSubmitEssay();

  const [options, setOptions] = useState<AnalysisOptions>({
    colorAlignment: true,
    showExplanations: true,
    minimalEdits: false,
  });

  // Auto-analysis after login is disabled; user must click Analyze manually.

  // Rotate tips every 4 seconds
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setIsTipVisible(false);
        setTimeout(() => {
          setCurrentTipIndex(prev => (prev + 1) % ieltsTips.length);
          setIsTipVisible(true);
        }, 300);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [ieltsTips.length, isProcessing]);

  const splitIntoParagraphs = (text: string): string[] => {
    return text.split('\n').filter(paragraph => paragraph.trim().length > 0);
  };

  const createParagraphMapping = useCallback(
    (
      originalText: string,
      improvedSections: {
        introduction: string;
        body_one?: string;
        body_two?: string;
        body?: string[];
        conclusion: string;
      }
    ): ParagraphMap[] => {
      const sentenceColors = [
        'bg-blue-100 text-blue-800 border-blue-200',
        'bg-green-100 text-green-800 border-green-200',
        'bg-yellow-100 text-yellow-800 border-yellow-200',
        'bg-purple-100 text-purple-800 border-purple-200',
        'bg-pink-100 text-pink-800 border-pink-200',
        'bg-indigo-100 text-indigo-800 border-indigo-200',
      ];

      const originalParagraphs = splitIntoParagraphs(originalText);
      
      // Handle both body array format and body_one/body_two format
      const bodyParagraphs = improvedSections.body 
        ? improvedSections.body 
        : [improvedSections.body_one, improvedSections.body_two].filter(Boolean);
      
      const improvedParagraphs = [
        improvedSections.introduction,
        ...bodyParagraphs,
        improvedSections.conclusion,
      ].filter(Boolean);

      const mapping: ParagraphMap[] = [];
      const maxLength = Math.max(
        originalParagraphs.length,
        improvedParagraphs.length
      );

      for (let i = 0; i < maxLength; i++) {
        const id = `paragraph-${i}`;
        mapping.push({
          original: originalParagraphs[i]?.trim() || '',
          improved: improvedParagraphs[i]?.trim() || '',
          color: sentenceColors[i % sentenceColors.length],
          id,
        });
      }

      return mapping;
    },
    []
  );

  // Handle latest submission data - only show results for current submission
  useEffect(() => {
    console.log('EssayAnalyzerWrapper useEffect triggered:', {
      activeSubmission: activeSubmission ? { id: activeSubmission._id, status: activeSubmission.status } : null,
      currentSubmissionId,
      hasAiFeedback: !!activeSubmission?.aiFeedback,
      hasImprovedVersions: !!activeSubmission?.aiFeedback?.improvedVersions
    });
    
    if (activeSubmission && (!currentSubmissionId || activeSubmission._id === currentSubmissionId)) {
      setHasAnalyzed(true);

      // Convert API data to UiBandVersion format
      if (activeSubmission.aiFeedback?.improvedVersions) {
        console.log('Processing AI feedback:', activeSubmission.aiFeedback);
        const versions: UiBandVersion[] = [];

        if (activeSubmission.aiFeedback.improvedVersions.band7) {
          const band7Data = activeSubmission.aiFeedback.improvedVersions.band7;
          versions.push({
            band: 7,
            sections: {
              introduction: band7Data.introduction,
              body: Array.isArray(band7Data.body) ? band7Data.body : [
                band7Data.body_one || '',
                band7Data.body_two || '',
              ].filter(Boolean),
              conclusion: band7Data.conclusion,
            },
            paragraphs: createParagraphMapping(
              activeSubmission.body,
              {
                introduction: band7Data.introduction,
                body_one: Array.isArray(band7Data.body) ? band7Data.body[0] || '' : band7Data.body_one || '',
                body_two: Array.isArray(band7Data.body) ? band7Data.body[1] || '' : band7Data.body_two || '',
                conclusion: band7Data.conclusion,
              }
            ),
            improvements: activeSubmission.aiFeedback.suggestions || [],
          });
        }

        if (activeSubmission.aiFeedback.improvedVersions.band8) {
          const band8Data = activeSubmission.aiFeedback.improvedVersions.band8;
          versions.push({
            band: 8,
            sections: {
              introduction: band8Data.introduction,
              body: Array.isArray(band8Data.body) ? band8Data.body : [
                band8Data.body_one || '',
                band8Data.body_two || '',
              ].filter(Boolean),
              conclusion: band8Data.conclusion,
            },
            paragraphs: createParagraphMapping(
              activeSubmission.body,
              {
                introduction: band8Data.introduction,
                body_one: Array.isArray(band8Data.body) ? band8Data.body[0] || '' : band8Data.body_one || '',
                body_two: Array.isArray(band8Data.body) ? band8Data.body[1] || '' : band8Data.body_two || '',
                conclusion: band8Data.conclusion,
              }
            ),
            improvements: activeSubmission.aiFeedback.suggestions || [],
          });
        }

        if (activeSubmission.aiFeedback.improvedVersions.band9) {
          const band9Data = activeSubmission.aiFeedback.improvedVersions.band9;
          versions.push({
            band: 9,
            sections: {
              introduction: band9Data.introduction,
              body: Array.isArray(band9Data.body) ? band9Data.body : [
                band9Data.body_one || '',
                band9Data.body_two || '',
              ].filter(Boolean),
              conclusion: band9Data.conclusion,
            },
            paragraphs: createParagraphMapping(
              activeSubmission.body,
              {
                introduction: band9Data.introduction,
                body_one: Array.isArray(band9Data.body) ? band9Data.body[0] || '' : band9Data.body_one || '',
                body_two: Array.isArray(band9Data.body) ? band9Data.body[1] || '' : band9Data.body_two || '',
                conclusion: band9Data.conclusion,
              }
            ),
            improvements: activeSubmission.aiFeedback.suggestions || [],
          });
        }

        console.log('Created versions:', versions);
        setBandVersions(versions);

        // Set current band based on target score
        const targetBandMap = {
          BAND_SEVEN: 7,
          BAND_EIGHT: 8,
          BAND_NINE: 9,
        };
        setCurrentBand(targetBandMap[targetScore]);
        setSelectedBand(targetBandMap[targetScore]);

        // Notify parent component with actual score from API
        onScoreUpdate(activeSubmission.score, true);
      }
    }
  }, [
    activeSubmission,
    isAnalyzed,
    targetScore,
    onScoreUpdate,
    createParagraphMapping,
    currentSubmissionId,
  ]);

  // Determine which component to render - show results for current submission or specific submission from URL
  const shouldShowResults =
    activeSubmission &&
    (currentSubmissionId ? activeSubmission._id === currentSubmissionId : true) && // If currentSubmissionId exists, match it; otherwise show any active submission
    (activeSubmission.status === IELTSWritingSubmissionStatus.IN_PROGRESS ||
      activeSubmission.status === IELTSWritingSubmissionStatus.IDLE ||
      activeSubmission.status === IELTSWritingSubmissionStatus.ANALYZED);

  console.log('EssayAnalyzerWrapper Debug:', {
    activeSubmission: activeSubmission ? { id: activeSubmission._id, status: activeSubmission.status } : null,
    currentSubmissionId,
    shouldShowResults,
    isAnalyzed,
    isPendingAnalysed,
    bandVersions: bandVersions.length,
    hasAnalyzed
  });

  const shouldShowProcessing = isProcessing && (!currentSubmissionId || activeSubmission?._id === currentSubmissionId) && !submissionId;

  // Show loading state when fetching specific submission
  if (isLoadingSubmission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="p-4 bg-accent/10 rounded-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Loading Essay Analysis</h3>
          <p className="text-muted-foreground">Please wait while we load your essay analysis...</p>
        </div>
      </div>
    );
  }

  if (shouldShowProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="p-4 bg-accent/10 rounded-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Analyzing Your Essay</h3>
          <div className="text-muted-foreground mb-6">
            <p className="mb-2">
              Our AI is analyzing your essay and generating improved versions.
            </p>
            <p className="mb-4">This may take a few moments.</p>
            <div className="bg-accent/20 p-4 rounded-lg border-l-4 border-primary w-[600px]">
              <p className="text-xl font-medium text-primary mb-2 text-center">
                💡 IELTS Writing Tip:
              </p>
              <p
                className={`text-xl transition-all duration-300 ease-in-out text-center ${
                  isTipVisible
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform -translate-y-2'
                }`}
              >
                {ieltsTips[currentTipIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (shouldShowResults && activeSubmission) {
    return (
      <EssayResults
        latestSubmission={activeSubmission}
        bandVersions={bandVersions}
        selectedBand={selectedBand}
        setSelectedBand={setSelectedBand}
        hoveredSentence={hoveredSentence}
        setHoveredSentence={setHoveredSentence}
        expandedCriteria={expandedCriteria}
        setExpandedCriteria={setExpandedCriteria}
        options={options}
        setOptions={setOptions}
      />
    );
  }

  return (
    <EssayCreator
      isAnalyzing={isProcessing}
      onCreated={(submissionId?: string) => {
        setIsAnalyzed(true);
        if (submissionId) {
          setCurrentSubmissionId(submissionId);
        }
      }}
      onStartNewAnalysis={clearCurrentResults}
    />
  );
};

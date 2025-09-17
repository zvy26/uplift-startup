import { EssayAnalyzerWrapper } from './EssayAnalyzerWrapper';

interface EssayAnalyzerWithAuthProps {
  submissionId?: string | null;
  onScoreUpdate: (band: number | null, hasAnalyzed: boolean) => void;
}

export const EssayAnalyzerWithAuth = ({
  submissionId,
  onScoreUpdate,
}: EssayAnalyzerWithAuthProps) => {
  // Since this component is now only used within AuthGuard,
  // we can directly show the analyzer wrapper
  return <EssayAnalyzerWrapper submissionId={submissionId} onScoreUpdate={onScoreUpdate} />;
};

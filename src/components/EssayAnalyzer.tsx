import { EssayAnalyzerWrapper } from './EssayAnalyzerWrapper';
import { EssayAnalyzerWithAuth } from './EssayAnalyzerWithAuth';

interface EssayAnalyzerProps {
  submissionId?: string | null;
  onScoreUpdate: (band: number | null, hasAnalyzed: boolean) => void;
}

export const EssayAnalyzer = ({ submissionId, onScoreUpdate }: EssayAnalyzerProps) => {
  return <EssayAnalyzerWithAuth submissionId={submissionId} onScoreUpdate={onScoreUpdate} />;
};

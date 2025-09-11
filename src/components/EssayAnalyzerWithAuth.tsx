import { useAuthContext } from '@/auth/hooks/useAuthContext';
import { EssayAnalyzerWrapper } from './EssayAnalyzerWrapper';
import { EssayCreator } from './EssayCreator';

interface EssayAnalyzerWithAuthProps {
  submissionId?: string | null;
  onScoreUpdate: (band: number | null, hasAnalyzed: boolean) => void;
}

export const EssayAnalyzerWithAuth = ({
  submissionId,
  onScoreUpdate,
}: EssayAnalyzerWithAuthProps) => {
  const { authenticated } = useAuthContext();

  // If user is authenticated, show the normal analyzer
  if (authenticated) {
    return <EssayAnalyzerWrapper submissionId={submissionId} onScoreUpdate={onScoreUpdate} />;
  }

  // For non-authenticated users, show the EssayCreator component
  // This allows them to write essays without login
  return <EssayCreator isAnalyzing={false} onCreated={() => {}} />;
};

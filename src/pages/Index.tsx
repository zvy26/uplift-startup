import { useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { EssayAnalyzer } from '@/components/EssayAnalyzer';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/auth/hooks/useAuthContext';

const Index = () => {
  const { logout, authenticated } = useAuthContext();
  const [displayedScore, setDisplayedScore] = useState<number>(0.0);
  const [currentBand, setCurrentBand] = useState<number | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Animate score display when analysis completes
  useEffect(() => {
    if (currentBand !== null && hasAnalyzed) {
      let startTime: number;
      const duration = 1500;

      const animateScore = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease out animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScore = easeOut * currentBand;

        setDisplayedScore(Number(currentScore.toFixed(1)));

        if (progress < 1) {
          requestAnimationFrame(animateScore);
        }
      };

      requestAnimationFrame(animateScore);
    }
  }, [currentBand, hasAnalyzed]);

  return (
    <div className="bg-background">
      <Navigation />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex justify-end">
            {authenticated && (
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              IELTS Essay Band Uplift
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your IELTS essays with AI-powered analysis and get
              improved versions for Band 7, 8, and 9.
            </p>
          </div>
          <EssayAnalyzer
            onScoreUpdate={(band, analyzed) => {
              setCurrentBand(band);
              setHasAnalyzed(analyzed);
              if (!analyzed) setDisplayedScore(0.0);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;

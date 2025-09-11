import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Shuffle, Lock } from 'lucide-react';
import { useTopics } from '@/services/topicQueries';
import { Separator } from '@radix-ui/react-separator';
import { toast } from 'sonner';
import { SendSubmission } from '@/modules/essay/types/SendSubmission';
import { useSubmitEssay, useAnalyzeSubmission } from '@/services/essayMutations';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import { paths } from '@/routes/paths';
import { useGetTrial } from './hooks/useGetTrial';
import {
  saveEssayToStorage,
  getEssayFromStorage,
  SavedEssayData,
} from '@/lib/essayStorage';

interface EssayCreatorProps {
  isAnalyzing: boolean;
  onCreated: (submissionId?: string) => void;
  onStartNewAnalysis?: () => void;
}

export const EssayCreator = ({ isAnalyzing, onCreated, onStartNewAnalysis }: EssayCreatorProps) => {
  const navigate = useNavigate();
  const { data } = useGetTrial();
  const {
    data: topics,
    isLoading: topicsLoading,
    error: topicsError,
  } = useTopics();

  const { user, authenticated } = useAuthContext();

  const hasPaidPlan = data?.hasPaidPlan || false;
  const freeTrialCount = data?.freeTrialCount || 0;
  const premiumTrialCount = data?.premiumTrialCount || 0;
  const remainingSubmissions = data?.remainingSubmissions || 0;
  const submissionsLimit = data?.submissionsLimit || 0;
  const maxFreeTrialCount = 3;
  const maxPremiumTrialCount = 10;

  const canAnalyzeWithPlan = hasPaidPlan
    ? remainingSubmissions > 0
    : freeTrialCount > 0;
  const finalCanAnalyze = authenticated ? canAnalyzeWithPlan : true; // Allow non-authenticated users to write essays

  const submitEssayMutation = useSubmitEssay();
  const analyzeSubmissionMutation = useAnalyzeSubmission();

  const [essay, setEssay] = useState('');
  const [topicSource, setTopicSource] = useState<'generated' | 'custom'>(
    'custom'
  );
  const [customTopic, setCustomTopic] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');

  // Load saved essay data on component mount
  useEffect(() => {
    const savedData = getEssayFromStorage();
    if (savedData) {
      setEssay(savedData.essay);
      setTopicSource(savedData.topicSource);
      setCustomTopic(savedData.customTopic);
      setTopic(savedData.topic);
      setSelectedTopicId(savedData.selectedTopicId);
    }
  }, []);

  // Save essay data to localStorage whenever it changes (for non-authenticated users)
  useEffect(() => {
    if (!authenticated && (essay.trim() || topic || customTopic)) {
      saveEssayToStorage({
        essay,
        topicSource,
        customTopic,
        topic,
        selectedTopicId,
      });
    }
  }, [essay, topicSource, customTopic, topic, selectedTopicId, authenticated]);

  const wordCount = essay
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  const charCount = essay.length;

  const handleTopicChange = (topicId: string) => {
    const topic = topics?.find(t => t._id === topicId);
    if (topic) {
      setTopic(topic.question);
      setSelectedTopicId(topicId);
    }
  };

  const generateRandomTopic = () => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      navigate(`${paths.auth.jwt.login}?${searchParams}`);
      return;
    }

    if (topics && topics.length > 0) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      setTopic(randomTopic.question);
      setSelectedTopicId(randomTopic._id);
    }
  };

  const analyzeEssay = async () => {
    // Clear previous results when starting new analysis
    if (onStartNewAnalysis) {
      onStartNewAnalysis();
    }

    if (!essay.trim()) {
      toast.error('Please enter an essay to analyze.');
      return;
    }

    if (!topic && topicSource === 'generated') {
      toast.error('Please select a topic.');
      return;
    }

    if (!customTopic && topicSource === 'custom') {
      toast.error('Please enter a custom topic.');
      return;
    }

    // If user is not authenticated, save essay and redirect to login
    if (!authenticated) {
      saveEssayToStorage({
        essay,
        topicSource,
        customTopic,
        topic,
        selectedTopicId,
      });

      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      navigate(`${paths.auth.jwt.login}?${searchParams}`);
      return;
    }

    // Check if authenticated user can analyze
    if (!finalCanAnalyze) {
      toast.error('You have reached the maximum number of essay checks.');
      return;
    }

    let submissionData: SendSubmission;

    if (topicSource === 'generated') {
      submissionData = {
        body: essay,
        targetScore: 'BAND_NINE', // Default target score
        topic: 'GENERATED',
        writing: selectedTopicId,
      };
    } else {
      submissionData = {
        body: essay,
        targetScore: 'BAND_NINE', // Default target score
        topic: 'CUSTOM',
        customWritingQuestion: customTopic,
      };
    }

    try {
      console.log('Submitting essay with data:', submissionData);
      
      // First submit the essay
      const response = await submitEssayMutation.mutateAsync(submissionData);
      console.log('Submission response:', response);
      
      // Extract submission ID from response
      const submissionId = response?.data?._id ?? response?._id ?? response?.data?.id ?? response?.id;
      console.log('Extracted submission ID:', submissionId);

      if (submissionId) {
        console.log('Triggering analysis for submission ID:', submissionId);
        
        // Add a small delay to ensure submission is fully processed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Then trigger analysis
        await analyzeSubmissionMutation.mutateAsync(submissionId);
        
        console.log('Analysis completed successfully');
        onCreated(submissionId);
      } else {
        console.error('No submission ID found in response:', response);
        throw new Error('No submission ID received');
      }
    } catch (error) {
      console.error('Error analyzing essay:', error);
      
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check if it's an Axios error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Axios error response:', axiosError.response?.data);
        console.error('Axios error status:', axiosError.response?.status);
        console.error('Axios error headers:', axiosError.response?.headers);
      }
      
      toast.error('Failed to analyze essay. Please try again.');
    }
  };

  const handleGetPremium = () => {
    navigate(paths.pricing);
  };

  const handleAnalyzeEssay = () => {
    if (!authenticated) {
      navigate('/auth/login?returnTo=%2F');
    } else if (!finalCanAnalyze) {
      navigate('/pricing');
    } else {
      return;
    }
  };

  return (
    <div className="min-h-screen px-2 lg:px-4 py-2 space-y-6 max-w-none">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Essay Input */}
        <Card className="shadow-medium">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Topic Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Essay Topic</h3>

                <div className="flex items-center gap-4">
                  <Select
                    value={topicSource}
                    onValueChange={(value: 'generated' | 'custom') =>
                      setTopicSource(value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generated">
                        Use Generated Topic
                      </SelectItem>
                      <SelectItem value="custom">Write Custom Topic</SelectItem>
                    </SelectContent>
                  </Select>

                  {topicSource === 'generated' && (
                    <Button
                      variant="outline"
                      onClick={generateRandomTopic}
                      className="flex items-center gap-2"
                    >
                      <Shuffle className="h-4 w-4" />
                      Generate Topic
                    </Button>
                  )}
                </div>

                {topicSource === 'generated' ? (
                  <div className="space-y-3">
                    {topicsLoading ? (
                      <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                        <p className="text-sm text-muted-foreground">
                          Loading topics...
                        </p>
                      </div>
                    ) : topicsError ? (
                      <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                        <p className="text-sm text-destructive">
                          Failed to load topics. Please try again later.
                        </p>
                      </div>
                    ) : (
                      <>
                        {topic && (
                          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                            <p className="text-sm font-medium">{topic}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Enter your custom essay topic here..."
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Original Essay</h2>
                <div className="text-sm text-muted-foreground">
                  {wordCount} words
                </div>
              </div>

              <Textarea
                placeholder={'Write your essay here...'}
                value={essay}
                onChange={e => setEssay(e.target.value)}
                className="min-h-[500px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex items-center gap-5">
              <h2 className="text-xl font-semibold">Improved Version</h2>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-100 text-green-800 border-green-200"
                  disabled={true}
                >
                  Band 7
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                  disabled={true}
                >
                  Band 8
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-purple-100 text-purple-800 border-purple-200"
                  disabled={true}
                >
                  Band 9
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="p-4 bg-accent/10 rounded-full">
                  <BookOpen className="h-12 w-12 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {!authenticated
                      ? 'Login Required to Analyze'
                      : finalCanAnalyze
                      ? 'Ready to Analyze'
                      : 'Upgrade Required'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {!authenticated
                      ? 'Write your essay and click "Analyze Essay" to save it and login for analysis.'
                      : finalCanAnalyze
                      ? 'Enter your IELTS Task 2 essay on the left and click "Analyze Essay" to get started.'
                      : "You've used all your essay submissions. Upgrade to continue analyzing essays."}
                  </p>

                  {/* Free trial progress indicator - only show for authenticated users */}
                  {authenticated && !hasPaidPlan && (
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Free Submissions
                        </span>
                        <Badge
                          variant={
                            freeTrialCount > 0 ? 'secondary' : 'destructive'
                          }
                        >
                          {freeTrialCount}
                        </Badge>
                      </div>
                      <Progress
                        value={
                          ((maxFreeTrialCount - freeTrialCount) /
                            maxFreeTrialCount) *
                          100
                        }
                        className={`h-2 ${
                          freeTrialCount === 0 ? 'bg-green-200' : ''
                        }`}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {freeTrialCount > 0
                          ? `You have ${freeTrialCount} free analysis${
                              freeTrialCount === 1 ? '' : 'es'
                            } left`
                          : 'Upgrade to get 10 essay analysis'}
                      </p>
                    </div>
                  )}

                  {/* Premium trial progress indicator - only show for authenticated users */}
                  {authenticated && hasPaidPlan && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-700">
                          Premium Submissions
                        </span>
                        <Badge
                          variant={
                            remainingSubmissions > 0 ? 'secondary' : 'destructive'
                          }
                        >
                          {remainingSubmissions}
                        </Badge>
                      </div>
                      <Progress
                        value={
                          submissionsLimit > 0
                            ? ((submissionsLimit - remainingSubmissions) / submissionsLimit) * 100
                            : 100
                        }
                        className={`h-2 bg-purple-200`}
                      />
                      <p className="text-xs text-purple-600 mt-2">
                        {remainingSubmissions > 0
                          ? `You have ${remainingSubmissions} submission${
                              remainingSubmissions === 1 ? '' : 's'
                            } left out of ${submissionsLimit}`
                          : `You have used all ${submissionsLimit} submissions`}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={
                      !authenticated
                        ? analyzeEssay
                        : finalCanAnalyze
                        ? analyzeEssay
                        : handleGetPremium
                    }
                    disabled={isAnalyzing || submitEssayMutation.isPending || analyzeSubmissionMutation.isPending}
                    className={
                      !authenticated || finalCanAnalyze
                        ? 'bg-gradient-primary hover:opacity-90'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'
                    }
                    variant="default"
                  >
                    {!authenticated ? (
                      'Analyze Essay & Login'
                    ) : !finalCanAnalyze ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Get Premium
                      </>
                    ) : (submitEssayMutation.isPending || analyzeSubmissionMutation.isPending) ? (
                      'Analyzing...'
                    ) : (
                      'Analyze Essay'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

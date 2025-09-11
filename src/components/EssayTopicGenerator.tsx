import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Copy, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ESSAY_TOPICS = [
  {
    topic: "Some people believe that online learning is more effective than traditional classroom learning, while others think face-to-face education is better. Discuss both views and give your opinion.",
    category: "Education",
    difficulty: "Medium"
  },
  {
    topic: "Many governments around the world spend large amounts of money on space exploration. Some people believe this money should be spent on addressing problems on Earth instead. Discuss both views and give your opinion.",
    category: "Government & Society",
    difficulty: "Hard"
  },
  {
    topic: "Some people think that social media has a negative impact on society, while others believe it brings people together. Discuss both views and give your opinion.",
    category: "Technology",
    difficulty: "Medium"
  },
  {
    topic: "In many countries, the number of people choosing to live alone is increasing rapidly. What are the causes of this trend? Is it a positive or negative development?",
    category: "Social Issues",
    difficulty: "Medium"
  },
  {
    topic: "Some people believe that international sports events bring nations together, while others think they create unnecessary competition between countries. Discuss both views and give your opinion.",
    category: "Sports & Culture",
    difficulty: "Easy"
  },
  {
    topic: "Many people argue that climate change is the most pressing issue of our time, while others believe economic growth should be prioritized. Discuss both views and give your opinion.",
    category: "Environment",
    difficulty: "Hard"
  },
  {
    topic: "Some employers believe that having employees work from home is more productive, while others think office work is essential. Discuss both views and give your opinion.",
    category: "Work & Career",
    difficulty: "Medium"
  },
  {
    topic: "In some countries, the average age of the population is increasing due to longer life expectancy and lower birth rates. Is this a positive or negative development?",
    category: "Demographics",
    difficulty: "Hard"
  }
];

interface EssayTopicGeneratorProps {
  onTopicSelect: (topic: string) => void;
}

export const EssayTopicGenerator = ({ onTopicSelect }: EssayTopicGeneratorProps) => {
  const [currentTopic, setCurrentTopic] = useState(ESSAY_TOPICS[0]);
  const { toast } = useToast();

  const generateNewTopic = () => {
    const randomIndex = Math.floor(Math.random() * ESSAY_TOPICS.length);
    setCurrentTopic(ESSAY_TOPICS[randomIndex]);
  };

  const copyTopic = () => {
    navigator.clipboard.writeText(currentTopic.topic);
    toast({
      title: "Copied",
      description: "Essay topic copied to clipboard.",
    });
  };

  const useTopic = () => {
    onTopicSelect(currentTopic.topic);
    toast({
      title: "Topic Applied",
      description: "Topic has been set for your essay.",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success text-success-foreground";
      case "Medium":
        return "bg-warning text-warning-foreground";
      case "Hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Essay Topic Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{currentTopic.category}</Badge>
            <Badge className={getDifficultyColor(currentTopic.difficulty)}>
              {currentTopic.difficulty}
            </Badge>
          </div>
          
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <p className="text-sm leading-relaxed">{currentTopic.topic}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={generateNewTopic} variant="outline">
            <Shuffle className="h-4 w-4 mr-2" />
            Generate New Topic
          </Button>
          
          <Button onClick={copyTopic} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy Topic
          </Button>
          
          <Button onClick={useTopic} className="bg-gradient-primary hover:opacity-90">
            Use This Topic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
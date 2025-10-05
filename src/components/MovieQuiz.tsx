import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const QUIZ_QUESTIONS = [
  {
    id: "mood",
    question: "What mood are you in?",
    options: ["Action-packed", "Emotional", "Thrilling", "Lighthearted", "Thought-provoking"]
  },
  {
    id: "genre",
    question: "Pick your favorite genres (select all that apply)",
    options: ["Action", "Drama", "Comedy", "Horror", "Sci-Fi", "Romance", "Thriller"],
    multiple: true
  },
  {
    id: "era",
    question: "Which era do you prefer?",
    options: ["Classic (pre-1980)", "Golden Age (1980-2000)", "Modern (2000-2015)", "Contemporary (2015+)", "No preference"]
  },
  {
    id: "language",
    question: "Language preference?",
    options: ["English", "Spanish", "French", "Korean", "Japanese", "Any language"]
  },
  {
    id: "actor",
    question: "Favorite type of lead actor?",
    options: ["Action hero", "Dramatic actor", "Comedian", "Character actor", "No preference"]
  }
];

interface MovieQuizProps {
  onComplete: () => void;
}

export const MovieQuiz = ({ onComplete }: MovieQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (question.multiple) {
      const currentAnswers = (answers[question.id] as string[]) || [];
      const newAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter(a => a !== answer)
        : [...currentAnswers, answer];
      setAnswers({ ...answers, [question.id]: newAnswers });
    } else {
      setAnswers({ ...answers, [question.id]: answer });
    }
  };

  const handleNext = async () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save quiz responses
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        user_id: user.id,
        question_id: questionId,
        answer: Array.isArray(answer) ? answer.join(", ") : answer
      }));

      const { error } = await supabase.from("quiz_responses").insert(responses);
      if (error) throw error;

      // Update profile with preferences
      const genres = answers.genre as string[];
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          favorite_genres: genres,
          preferred_languages: [answers.language as string]
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Quiz Complete!",
        description: "Your preferences have been saved. Getting your personalized recommendations...",
      });

      onComplete();
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to save your responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnswered = question.multiple
    ? (answers[question.id] as string[])?.length > 0
    : answers[question.id] !== undefined;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Movie Personality Quiz</h2>
          </div>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
        
        <div className="grid gap-3 mb-8">
          {question.options.map((option) => {
            const isSelected = question.multiple
              ? (answers[question.id] as string[])?.includes(option)
              : answers[question.id] === option;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered || isSubmitting}
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Question } from "@shared/schema";
import { useQuiz } from "@/context/QuizContext";

interface QuestionDisplayProps {
  question: Question;
  onSubmit: (answer: string) => void;
  currentIndex: number;
  totalQuestions: number;
  disabled?: boolean;
}

export default function QuestionDisplay({
  question,
  onSubmit,
  currentIndex,
  totalQuestions,
  disabled
}: QuestionDisplayProps) {
  const { userAnswers, completed } = useQuiz();
  const isDisabled = disabled || completed;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Set initial answer from userAnswers if it exists
  useEffect(() => {
    const existingAnswer = userAnswers.get(question.id);
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer);
    } else {
      setSelectedAnswer(null);
    }
  }, [question.id, userAnswers]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onSubmit(value);
  };

  return (
    <Card className="p-4 bg-white/90 backdrop-blur shadow-md">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Question {currentIndex + 1}</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">{question.questionText}</h3>
      </div>

      <RadioGroup
        value={selectedAnswer || ""}
        onValueChange={handleAnswerChange}
        className="space-y-2"
        disabled={isDisabled}
      >
        {[
          { value: "A", text: question.optionA },
          { value: "B", text: question.optionB },
          { value: "C", text: question.optionC },
          { value: "D", text: question.optionD }
        ].map(({ value, text }) => (
          <Label
            key={value}
            className={`flex items-start p-3 border rounded-md cursor-pointer transition-all
              ${selectedAnswer === value 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <RadioGroupItem value={value} className="mt-1" />
            <span className="ml-3 text-gray-700">{text}</span>
          </Label>
        ))}
      </RadioGroup>
    </Card>
  );
}

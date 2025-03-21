
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Question } from "@shared/schema";

interface QuestionDisplayProps {
  question: Question;
  onSubmit: (answer: "A" | "B" | "C" | "D") => void;
  onNext: () => void;
  currentIndex: number;
  totalQuestions: number;
  disabled?: boolean;
}

export default function QuestionDisplay({
  question,
  onSubmit,
  onNext,
  currentIndex,
  totalQuestions,
  disabled
}: QuestionDisplayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  
  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  const getQuestionPosition = () => {
    const position = currentIndex % 5;
    if (position < 2) return "top";
    if (position < 4) return "middle";
    return "bottom";
  };

  const questionPosition = getQuestionPosition();
  
  return (
    <div className="flex flex-col min-h-[600px]">
      <div className={`question-container ${questionPosition} p-6 rounded-lg border bg-white shadow-sm ${
        questionPosition === "top" ? "mb-4" :
        questionPosition === "middle" ? "my-4" : "mt-4"
      }`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Question {currentIndex + 1}: {question.text}</h2>
        
        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={(value) => setSelectedAnswer(value as "A" | "B" | "C" | "D")}
          className="space-y-3"
          disabled={disabled}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label className="flex items-start p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <RadioGroupItem value="A" className="mt-1" />
              <span className="ml-3">{question.optionA}</span>
            </Label>

            <Label className="flex items-start p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <RadioGroupItem value="B" className="mt-1" />
              <span className="ml-3">{question.optionB}</span>
            </Label>

            <Label className="flex items-start p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <RadioGroupItem value="C" className="mt-1" />
              <span className="ml-3">{question.optionC}</span>
            </Label>

            <Label className="flex items-start p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <RadioGroupItem value="D" className="mt-1" />
              <span className="ml-3">{question.optionD}</span>
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div className="space-x-2">
            <Button onClick={handleSubmit} disabled={!selectedAnswer || disabled}>
              Submit Answer
            </Button>
            {disabled && (
              <Button onClick={onNext} variant="outline">
                Next Question
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

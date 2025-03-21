import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Quiz() {
  const { user } = useAuth();
  const { 
    quizState, 
    questions, 
    currentQuestionIndex, 
    userAnswers, 
    timeRemaining, 
    submitAnswer, 
    nextQuestion,
    loading 
  } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (quizState !== "started") {
      if (quizState === "waiting") {
        navigate("/waiting-room");
      } else if (quizState === "completed") {
        navigate("/leaderboard");
      }
    }
  }, [user, quizState, navigate]);

  // Set selected answer when loading a new question
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const existingAnswer = userAnswers.get(currentQuestion.id);
      setSelectedAnswer(existingAnswer || null);
    }
  }, [currentQuestionIndex, questions, userAnswers]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = async () => {
    if (questions.length === 0 || currentQuestionIndex >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // Save the answer first
    await submitAnswer(currentQuestion.id, selectedAnswer);
    
    // Then move to next question
    nextQuestion();
    setSelectedAnswer(null);
  };

  // Enhanced debugging for quiz state issues
  useEffect(() => {
    console.log("Quiz page debug:", {
      user: !!user,
      questionsLength: questions.length,
      loading,
      quizState,
      isAuthenticated: !!user,
      userRole: user?.role
    });

    // Explicitly try to fetch questions when quiz is started
    if (quizState === 'started' && questions.length === 0 && !loading) {
      console.log("Attempting to fetch questions directly...");
      fetch('/api/questions')
        .then(res => res.json())
        .then(data => {
          console.log("Direct fetch results:", data);
          if (Array.isArray(data) && data.length > 0) {
            console.log("Questions are available but not loaded in context");
          }
        })
        .catch(err => console.error("Error in direct fetch:", err));
    }
  }, [user, questions.length, loading, quizState]);

  // If we're in started state but have no questions,
  // display a more informative message with troubleshooting tips
  if (quizState === 'started' && questions.length === 0 && !loading) {
    console.log("Quiz started but no questions available");
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-primary-600 font-semibold text-xl">
          Quiz is ready but no questions are available
        </div>
        <p className="text-gray-600 max-w-md text-center">
          The quiz has been started by the admin, but there are no questions available.
          This might be due to a data loading issue.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Troubleshooting: Please try refreshing the page or logging out and back in.
        </div>
      </div>
    );
  }

  // Regular loading state with improved feedback
  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 flex-col">
        <div className="animate-pulse text-primary-600 font-semibold mb-4">
          Loading quiz...
        </div>
        <div className="text-sm text-gray-500 max-w-md text-center">
          Please wait while we prepare the quiz questions for you.
        </div>
      </div>
    );
  }
  
  // Handle the case where loading is complete but we still have no questions
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 flex-col">
        <div className="text-primary-600 font-semibold text-xl mb-4">
          Waiting for questions...
        </div>
        <div className="text-gray-600 max-w-md text-center mb-4">
          The quiz has started but we're having trouble loading the questions.
          This could be due to a temporary connectivity issue.
        </div>
        <Button 
          onClick={() => {
            // Force refetch quiz settings and questions without page reload
            queryClient.invalidateQueries({ queryKey: ['/api/quiz/settings'] });
            queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
            toast({
              title: "Refreshing data",
              description: "Attempting to reload quiz data...",
            });
          }}
          variant="outline"
          className="mt-2"
        >
          Refresh Data
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  const timerPercentage = (timeRemaining / 300) * 100;
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-gray-800">NSBM MathsMaster Quiz</h1>
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Q</span>
                </div>
                <span className="ml-2 font-bold text-primary-700">
                  {currentQuestionIndex + 1}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-500">
                  {questions.length}
                </span>
              </div>
            </div>

            {/* Timer Component */}
            <div className="mb-6">
              <Progress value={timerPercentage} className="h-2.5" />
              <div className="mt-1 text-right text-sm text-gray-500">
                {timeRemaining} seconds remaining
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {currentQuestion.questionText}
              </h2>

              {/* Answer Options */}
              <RadioGroup 
                value={selectedAnswer || ""} 
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                <label className="flex items-start p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="A" id="option-a" className="mt-1" />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">A. </span>
                    <span className="text-gray-700">{currentQuestion.optionA}</span>
                  </div>
                </label>
                
                <label className="flex items-start p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="B" id="option-b" className="mt-1" />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">B. </span>
                    <span className="text-gray-700">{currentQuestion.optionB}</span>
                  </div>
                </label>
                
                <label className="flex items-start p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="C" id="option-c" className="mt-1" />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">C. </span>
                    <span className="text-gray-700">{currentQuestion.optionC}</span>
                  </div>
                </label>
                
                <label className="flex items-start p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="D" id="option-d" className="mt-1" />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">D. </span>
                    <span className="text-gray-700">{currentQuestion.optionD}</span>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleNextQuestion}
                disabled={loading}
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Progress */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Progress</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((question, index) => {
                const answer = userAnswers.get(question.id);
                let bgColor = "bg-gray-300 text-gray-500"; // Unanswered
                
                if (answer !== undefined) {
                  if (answer === question.correctAnswer) {
                    bgColor = "bg-green-500 text-white opacity-70"; // Correct
                  } else {
                    bgColor = "bg-red-500 text-white opacity-70"; // Incorrect
                  }
                }
                
                if (index === currentQuestionIndex) {
                  bgColor = "bg-primary-600 text-white"; // Current question
                }
                
                return (
                  <div 
                    key={question.id}
                    className={`h-8 w-full flex items-center justify-center rounded-md text-xs font-medium ${bgColor}`}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

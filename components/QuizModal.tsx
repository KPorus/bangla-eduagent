import React, { useState } from 'react';
import { Quiz } from '../types';
import { Check, X, Award, RefreshCcw } from 'lucide-react';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onPass: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onPass }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      if (score >= quiz.questions.length - 1) { // Pass if mostly correct
          // Delay call to allow UI to show score first
          setTimeout(() => onPass(), 2000); 
      }
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  if (showResult) {
    const passed = score >= Math.ceil(quiz.questions.length / 2);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Award size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2 font-bengali">{passed ? 'অভিনন্দন! (Congratulations!)' : 'আবার চেষ্টা করুন (Try Again)'}</h2>
            <p className="text-gray-600 mb-6 font-bengali">
                আপনি {quiz.questions.length} টির মধ্যে {score} টি প্রশ্নের সঠিক উত্তর দিয়েছেন।
            </p>
            
            <div className="flex gap-4 justify-center">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium font-bengali"
                >
                    বন্ধ করুন
                </button>
                {!passed && (
                    <button 
                        onClick={() => {
                            setScore(0);
                            setCurrentQuestionIdx(0);
                            setShowResult(false);
                            setSelectedOption(null);
                            setIsAnswered(false);
                        }}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 font-bengali"
                    >
                        <RefreshCcw size={16} />
                        আবার শুরু করুন
                    </button>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Question {currentQuestionIdx + 1}/{quiz.questions.length}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 font-bengali leading-relaxed">
                {currentQuestion.question}
            </h3>

            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    let statusClass = "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                    if (isAnswered) {
                        if (idx === currentQuestion.correctIndex) {
                            statusClass = "border-green-500 bg-green-50 text-green-800";
                        } else if (idx === selectedOption) {
                            statusClass = "border-red-300 bg-red-50 text-red-800";
                        } else {
                            statusClass = "border-gray-100 text-gray-400 opacity-60";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleOptionClick(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bengali relative ${statusClass}`}
                        >
                            <span className="mr-6 block">{option}</span>
                            {isAnswered && idx === currentQuestion.correctIndex && (
                                <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                            )}
                            {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                                <X className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                            )}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                    <p className="text-sm text-blue-800 font-bengali">
                        <span className="font-bold block mb-1">ব্যাখ্যা (Explanation):</span>
                        {currentQuestion.explanation}
                    </p>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all font-bengali ${
                    isAnswered 
                        ? 'bg-primary text-white shadow-lg hover:bg-green-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                {isLastQuestion ? 'ফলাফল দেখুন (Finish)' : 'পরবর্তী প্রশ্ন (Next)'}
            </button>
        </div>
      </div>
    </div>
  );
};

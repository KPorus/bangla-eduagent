import React, { useState } from 'react';
import { Quiz } from '../types';
import { X, Check, AlertCircle, Award } from 'lucide-react';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onPass: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onPass }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex) / quiz.questions.length) * 100;

  const handleOptionClick = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleFinish = () => {
    onPass(); // Mark module as done
    onClose();
  };

  if (isCompleted) {
    const passed = score >= Math.ceil(quiz.questions.length / 2);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {passed ? <Award size={40} /> : <AlertCircle size={40} />}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Great Job!' : 'Keep Practicing'}
          </h2>
          <p className="text-gray-600 mb-8">
            You scored <span className="font-bold text-gray-900">{score}</span> out of {quiz.questions.length}.
          </p>
          
          <button 
            onClick={handleFinish}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            {passed ? 'Complete Lesson' : 'Try Again Later'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Quiz Mode</span>
             <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-mono">Q{currentIndex + 1}/{quiz.questions.length}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 w-full">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-bengali leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let stateStyles = "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
              const isSelected = selectedOption === idx;
              const isCorrect = currentQuestion.correctIndex === idx;

              if (showExplanation) {
                if (isCorrect) stateStyles = "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500";
                else if (isSelected) stateStyles = "border-red-500 bg-red-50 text-red-800";
                else stateStyles = "border-gray-100 opacity-50";
              } else if (isSelected) {
                stateStyles = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between group ${stateStyles}`}
                >
                  <span className="font-bengali">{option}</span>
                  {showExplanation && isCorrect && <Check size={20} className="text-green-600" />}
                  {showExplanation && isSelected && !isCorrect && <X size={20} className="text-red-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
              <div className="flex gap-2 items-start">
                 <div className="mt-0.5 text-blue-600"><AlertCircle size={18} /></div>
                 <div>
                   <p className="text-sm font-bold text-blue-900 mb-1">Explanation</p>
                   <p className="text-sm text-blue-800 font-bengali">{currentQuestion.explanation}</p>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!showExplanation}
            className="bg-primary hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      onComplete();
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 font-bengali">Quiz Completed!</h3>
        <p className="text-slate-600">You scored {score} out of {questions.length}</p>
        <button 
          onClick={() => {
            setIsFinished(false);
            setCurrentIndex(0);
            setScore(0);
            setSelectedOption(null);
            setShowExplanation(false);
          }}
          className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 mt-2"
        >
          <RefreshCw size={18} />
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <span className="font-semibold text-slate-700">Question {currentIndex + 1} of {questions.length}</span>
        <span className="text-sm text-slate-500">Score: {score}</span>
      </div>
      
      <div className="p-6 md:p-8">
        <h4 className="text-xl font-bengali font-semibold text-slate-800 mb-6">{currentQuestion.question}</h4>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let itemClass = "w-full p-4 rounded-xl text-left border-2 transition-all font-bengali ";
            
            if (showExplanation) {
              if (idx === currentQuestion.correctAnswerIndex) {
                itemClass += "border-primary-500 bg-primary-50 text-primary-800";
              } else if (idx === selectedOption) {
                itemClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                itemClass += "border-slate-200 text-slate-400 opacity-50";
              }
            } else {
              itemClass += "border-slate-200 hover:border-primary-500 hover:bg-primary-50 text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={showExplanation}
                className={itemClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showExplanation && idx === currentQuestion.correctAnswerIndex && <CheckCircle size={20} className="text-primary-600" />}
                  {showExplanation && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <XCircle size={20} className="text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
            <p className="font-semibold text-sm uppercase tracking-wide opacity-70 mb-1">Explanation</p>
            <p className="font-bengali">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!showExplanation}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              showExplanation 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};
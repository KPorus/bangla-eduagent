import React, { useState } from 'react';
import { Quiz } from '../types';

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete, onBack }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quiz.questions[currentQIndex];

  const handleOptionSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      onComplete(score + (selectedOption === currentQ.correctIndex ? 0 : 0)); // Score already updated
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
        <p className="text-slate-600 text-lg mb-8">You scored <span className="font-bold text-indigo-600">{score}</span> out of {quiz.questions.length}</p>
        <button 
          onClick={onBack}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all w-full"
        >
          Return to Syllabus
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm font-medium">Cancel Quiz</button>
        <div className="text-slate-400 font-medium text-sm">Question {currentQIndex + 1} of {quiz.questions.length}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let stateClass = "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
              if (showExplanation) {
                if (idx === currentQ.correctIndex) stateClass = "border-green-500 bg-green-50 text-green-800";
                else if (idx === selectedOption) stateClass = "border-red-500 bg-red-50 text-red-800";
                else stateClass = "border-slate-100 opacity-50";
              } else if (selectedOption === idx) {
                stateClass = "border-indigo-600 bg-indigo-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${stateClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-fade-in">
              <p className="text-indigo-900 font-medium text-sm">
                <span className="font-bold">Explanation:</span> {currentQ.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-4 flex justify-end border-t border-slate-100">
          <button
            onClick={handleNext}
            disabled={!showExplanation}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQIndex === quiz.questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;

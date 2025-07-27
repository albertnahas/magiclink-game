'use client';

import { useState } from 'react';
import { GameHeaderProps } from '@/types/game';

export const GameHeader: React.FC<GameHeaderProps> = ({
  startWord,
  endWord,
  isLoading,
  currentStep,
  onNewGame,
  onGetHint,
  onGetSolution,
  onUndo,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleButtonClick = (action: () => void) => {
    action();
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative text-center space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          MagicLink
        </h1>
        <p className="text-lg text-gray-600">
          Connect these words in exactly 5 steps
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center space-x-4 py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Generating word pair...</span>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 py-8">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600 bg-blue-50 px-4 md:px-6 py-3 md:py-4 rounded-lg border-2 border-blue-200">
              {startWord.toUpperCase()}
            </div>
            <div className="text-sm text-gray-500 mt-2">Start</div>
          </div>
          
          <div className="flex items-center space-x-2">
            {[0, 1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  step < currentStep 
                    ? 'bg-purple-500' 
                    : step === currentStep 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-green-600 bg-green-50 px-4 md:px-6 py-3 md:py-4 rounded-lg border-2 border-green-200">
              {endWord.toUpperCase()}
            </div>
            <div className="text-sm text-gray-500 mt-2">Target</div>
          </div>
        </div>
      )}

      {/* Desktop buttons */}
      <div className="hidden md:flex absolute top-0 right-0 flex-col space-y-2">
        <button
          onClick={onNewGame}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300"
        >
          New Game
        </button>
        <button
          onClick={onGetHint}
          disabled={isLoading || !startWord || !endWord}
          className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-purple-300"
        >
          Hint
        </button>
        <button
          onClick={onUndo}
          disabled={isLoading || currentStep <= 0}
          className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-yellow-300"
        >
          Undo
        </button>
        <button
          onClick={onGetSolution}
          disabled={isLoading || !startWord || !endWord}
          className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-orange-300"
        >
          Solve
        </button>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden absolute top-0 right-0">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200 border border-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsDrawerOpen(false)} />
        
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Game Options</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleButtonClick(onNewGame)}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300"
              >
                🎮 New Game
              </button>
              <button
                onClick={() => handleButtonClick(onGetHint)}
                disabled={isLoading || !startWord || !endWord}
                className="w-full px-4 py-3 text-left bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-purple-300"
              >
                💡 Get Hint
              </button>
              <button
                onClick={() => handleButtonClick(onUndo)}
                disabled={isLoading || currentStep <= 0}
                className="w-full px-4 py-3 text-left bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-yellow-300"
              >
                ↩️ Undo Step
              </button>
              <button
                onClick={() => handleButtonClick(onGetSolution)}
                disabled={isLoading || !startWord || !endWord}
                className="w-full px-4 py-3 text-left bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-orange-300"
              >
                🔧 Show Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
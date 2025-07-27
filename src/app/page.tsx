'use client';

import React from 'react';
import { useGame } from '@/hooks/useGame';
import { HopInput } from '@/components/HopInput';
import { GameComplete } from '@/components/GameComplete';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  const {
    gameState,
    validationLoading,
    hintLoading,
    generateSeedWords,
    validateHop,
    getHint,
    getSolution,
    resetGame,
    startNextLevel,
    updateHop,
    undoLastStep,
  } = useGame();

  const {
    startWord,
    endWord,
    currentStep,
    hops,
    isComplete,
    isLoading,
    error,
    level,
    maxSteps,
    score,
    lives,
    streak,
  } = gameState;

  const handleNewGame = () => {
    resetGame(true); // Full reset to level 1
    generateSeedWords();
  };

  const handleNextLevel = () => {
    startNextLevel();
  };

  const handleSubmit = () => {
    const currentHop = hops[currentStep];
    if (currentHop.trim() && lives > 0) {
      validateHop(currentStep, currentHop);
    }
  };

  // Game Over screen
  if (lives === 0) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
          <div className="container mx-auto px-4 py-8 max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-red-500/20 p-8 shadow-2xl text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">💀</div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over!</h2>
                <p className="text-white/80">You ran out of lives.</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-white/60 text-sm">Final Score</div>
                  <div className="text-2xl font-bold text-yellow-400">{score}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-white/60 text-sm">Level Reached</div>
                    <div className="text-xl font-bold text-white">{level}</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-white/60 text-sm">Best Streak</div>
                    <div className="text-xl font-bold text-green-400">🔥 {streak}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNewGame}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (isComplete) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="container mx-auto px-4 py-8 max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">Level {level} Complete!</h2>
                <p className="text-white/80">Amazing work connecting the words!</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-white/60 text-sm">Score Earned</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    +{Math.max(0, score - (level - 1) * 100)} points
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-white/60 text-sm">Total Score</div>
                    <div className="text-xl font-bold text-white">{score}</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-white/60 text-sm">Streak</div>
                    <div className="text-xl font-bold text-green-400">🔥 {streak}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {level < 6 ? (
                  <button
                    onClick={handleNextLevel}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Next Level ({level + 1} steps) →
                  </button>
                ) : (
                  <div className="text-yellow-400 font-bold text-lg mb-4">🏆 All Levels Complete!</div>
                )}
                
                <button
                  onClick={handleNewGame}
                  className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-md">
          
          {/* Modern Header with Stats */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔗</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                MagicLink
              </h1>
            </div>
            
            {/* Game Stats */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {/* Level */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <div className="text-white/60 text-xs">Level</div>
                <div className="text-lg font-bold text-blue-300">{level}</div>
              </div>
              {/* Score */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <div className="text-white/60 text-xs">Score</div>
                <div className="text-lg font-bold text-yellow-300">{score}</div>
              </div>
              {/* Lives */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <div className="text-white/60 text-xs">Lives</div>
                <div className="text-lg font-bold text-red-300">
                  {'❤️'.repeat(lives)}
                </div>
              </div>
              {/* Streak */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <div className="text-white/60 text-xs">Streak</div>
                <div className="text-lg font-bold text-green-300">🔥{streak}</div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3 py-6">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300">Generating puzzle...</span>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {startWord.toUpperCase()}
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-70"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-80"></div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {endWord.toUpperCase()}
                  </div>
                </div>
                
                {/* Modern Action Buttons */}
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleNewGame}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/20 disabled:opacity-50 border border-white/20 transition-all"
                  >
                    ✨ New
                  </button>
                  <button
                    onClick={getHint}
                    disabled={isLoading || hintLoading || !startWord}
                    className="px-3 py-1.5 bg-purple-500/20 backdrop-blur-sm text-purple-200 rounded-full text-sm hover:bg-purple-500/30 disabled:opacity-50 border border-purple-400/30 transition-all flex items-center space-x-1"
                  >
                    {hintLoading ? (
                      <>
                        <div className="w-3 h-3 border border-purple-200 border-t-transparent rounded-full animate-spin"></div>
                        <span>...</span>
                      </>
                    ) : (
                      <>💡 Hint</>
                    )}
                  </button>
                  <button
                    onClick={undoLastStep}
                    disabled={isLoading || currentStep <= 0}
                    className="px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm text-yellow-200 rounded-full text-sm hover:bg-yellow-500/30 disabled:opacity-50 border border-yellow-400/30 transition-all"
                  >
                    ↩️ Undo
                  </button>
                  <button
                    onClick={getSolution}
                    disabled={isLoading || !startWord}
                    className="px-3 py-1.5 bg-orange-500/20 backdrop-blur-sm text-orange-200 rounded-full text-sm hover:bg-orange-500/30 disabled:opacity-50 border border-orange-400/30 transition-all"
                  >
                    🔧 Solve
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-4 mb-6 text-center">
              <span className="text-red-300 text-sm">⚠️ {error}</span>
            </div>
          )}

          {/* Modern Game Input */}
          {!isLoading && !isComplete && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {currentStep + 1}
                  </div>
                  <span className="text-white/90 text-sm font-medium">of {maxSteps}</span>
                </div>
                <div className="text-white/80 text-sm mb-4">
                  Connect <span className="font-bold text-blue-300">{currentStep === 0 ? startWord : hops[currentStep - 1]}</span> to something...
                </div>
              </div>
              
              <HopInput
                value={hops[currentStep] || ''}
                onChange={(value) => updateHop(currentStep, value)}
                onSubmit={handleSubmit}
                placeholder="Enter your word..."
                disabled={isLoading || currentStep >= maxSteps || lives === 0}
                isValidating={validationLoading === currentStep}
              />

              <button
                onClick={handleSubmit}
                disabled={!hops[currentStep]?.trim() || isLoading || validationLoading === currentStep || lives === 0}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {validationLoading === currentStep ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking...</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          )}

          {/* Modern Progress Path */}
          {!isLoading && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                  {/* Start */}
                  <div className="flex flex-col items-center min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      S
                    </div>
                    <div className="text-xs mt-2 text-center font-medium text-blue-300 truncate max-w-16">
                      {startWord}
                    </div>
                  </div>

                  {/* Steps */}
                  {hops.slice(0, maxSteps).map((hop, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center">
                        <div className="w-8 h-px bg-gradient-to-r from-white/20 to-white/40"></div>
                      </div>
                      <div className="flex flex-col items-center min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 ${
                          index < currentStep 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                            : index === currentStep 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-2 ring-blue-400/50' 
                            : 'bg-white/10 text-white/60 backdrop-blur-sm'
                        }`}>
                          {index + 1}
                        </div>
                        <div className={`text-xs mt-2 text-center truncate max-w-16 transition-colors duration-300 ${
                          index < currentStep ? 'text-purple-300 font-medium' : 
                          index === currentStep ? 'text-blue-300 font-medium' : 
                          'text-white/40'
                        }`}>
                          {hop || '?'}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}

                  {/* End */}
                  <div className="flex items-center">
                    <div className="w-8 h-px bg-gradient-to-r from-white/20 to-white/40"></div>
                  </div>
                  <div className="flex flex-col items-center min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      T
                    </div>
                    <div className="text-xs mt-2 text-center font-medium text-green-300 truncate max-w-16">
                      {endWord}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
'use client';

import { useGame } from '@/hooks/useGame';
import { GameHeader } from '@/components/GameHeader';
import { HopInput } from '@/components/HopInput';
import { GameComplete } from '@/components/GameComplete';
import { VisualizationCanvas } from '@/components/VisualizationCanvas';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  const {
    gameState,
    validationLoading,
    generateSeedWords,
    validateHop,
    getHint,
    getSolution,
    resetGame,
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
  } = gameState;

  const handleNewGame = () => {
    resetGame();
    generateSeedWords();
  };

  const handleSubmit = () => {
    const currentHop = hops[currentStep];
    if (currentHop.trim()) {
      validateHop(currentStep, currentHop);
    }
  };

  if (isComplete) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <GameComplete
                startWord={startWord}
                endWord={endWord}
                hops={hops}
                onNewGame={handleNewGame}
              />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Game Header */}
            <GameHeader
              startWord={startWord}
              endWord={endWord}
              isLoading={isLoading}
              currentStep={currentStep}
              onNewGame={handleNewGame}
              onGetHint={getHint}
              onGetSolution={getSolution}
              onUndo={undoLastStep}
            />

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="text-red-500 text-xl">⚠️</div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Main Game Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Game Input */}
              <div className="space-y-6">
                
                {/* Current Input */}
                {!isLoading && !isComplete && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Step {currentStep + 1} of 5
                        </h3>
                        <p className="text-gray-600">
                          What connects to "{currentStep === 0 ? startWord : hops[currentStep - 1]}"?
                        </p>
                      </div>
                      
                      <HopInput
                        value={hops[currentStep] || ''}
                        onChange={(value) => updateHop(currentStep, value)}
                        onSubmit={handleSubmit}
                        placeholder={`What connects to "${currentStep === 0 ? startWord : hops[currentStep - 1]}"?`}
                        disabled={isLoading || currentStep >= 5}
                        isValidating={validationLoading === currentStep}
                      />

                      <button
                        onClick={handleSubmit}
                        disabled={!hops[currentStep]?.trim() || isLoading || validationLoading === currentStep}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {validationLoading === currentStep ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Checking...</span>
                          </div>
                        ) : (
                          'Submit Word'
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress Summary */}
                {!isLoading && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
                    <div className="space-y-3">
                      
                      {/* Start Word */}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-medium text-blue-600">{startWord.toUpperCase()}</span>
                      </div>

                      {/* Hops */}
                      {hops.map((hop, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index < currentStep 
                              ? 'bg-purple-500 text-white' 
                              : index === currentStep 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            <span className="font-bold text-sm">{index + 1}</span>
                          </div>
                          <span className={`${
                            index < currentStep ? 'text-purple-600 font-medium' : 
                            index === currentStep ? 'text-blue-600 font-medium' : 
                            'text-gray-400'
                          }`}>
                            {hop ? hop.toUpperCase() : `Step ${index + 1}`}
                          </span>
                        </div>
                      ))}

                      {/* End Word */}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="font-medium text-green-600">{endWord.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seed Words Display on Mobile */}
                <div className="lg:hidden bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 bg-blue-50 px-4 py-3 rounded-lg border-2 border-blue-200">
                        {startWord.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">Start</div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 bg-green-50 px-4 py-3 rounded-lg border-2 border-green-200">
                        {endWord.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">Target</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visualization */}
              <div className="space-y-6">
                <VisualizationCanvas
                  startWord={startWord}
                  endWord={endWord}
                  hops={hops}
                  currentStep={currentStep}
                  isComplete={isComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
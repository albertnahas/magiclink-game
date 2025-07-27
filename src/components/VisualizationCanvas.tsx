'use client';

import React from 'react';
import { VisualizationCanvasProps } from '@/types/game';

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  startWord,
  endWord,
  hops,
  currentStep,
  isComplete,
}) => {
  const getNodeColor = (index: number) => {
    if (index === 0) return 'bg-blue-500 text-white'; // Start - blue
    if (index === 6) return 'bg-green-500 text-white'; // End - green
    if (index - 1 < currentStep) return 'bg-purple-500 text-white'; // Completed hops - purple
    if (index - 1 === currentStep) return 'bg-blue-500 text-white'; // Current hop - blue
    return 'bg-gray-300 text-gray-600'; // Future hops - gray
  };


  const getConnectionColor = (index: number) => {
    return index < currentStep || isComplete ? 'bg-purple-400' : 'bg-gray-300';
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Connection Path</h3>
        
        {/* Visual connection path */}
        <div className="flex flex-col items-center space-y-4">
          {/* Start word */}
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold ${getNodeColor(0)}`}>
              {startWord.charAt(0).toUpperCase()}
            </div>
            <div className="mt-2 text-center">
              <div className="font-medium text-blue-600">{startWord.toUpperCase()}</div>
              <div className="text-xs text-gray-500">Start</div>
            </div>
          </div>

          {/* Connection lines and hops */}
          {[0, 1, 2, 3, 4].map((hopIndex) => (
            <div key={hopIndex} className="flex flex-col items-center">
              {/* Connection line */}
              <div className={`w-1 h-8 rounded-full transition-colors duration-300 ${getConnectionColor(hopIndex)}`}></div>
              
              {/* Hop node */}
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${getNodeColor(hopIndex + 1)}`}>
                  {hops[hopIndex] ? hops[hopIndex].charAt(0).toUpperCase() : (hopIndex + 1)}
                </div>
                <div className="mt-2 text-center">
                  <div className={`font-medium transition-colors duration-300 ${
                    hopIndex < currentStep ? 'text-purple-600' : 
                    hopIndex === currentStep ? 'text-blue-600' : 
                    'text-gray-400'
                  }`}>
                    {hops[hopIndex] ? hops[hopIndex].toUpperCase() : `STEP ${hopIndex + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {hopIndex < currentStep ? 'Completed' : 
                     hopIndex === currentStep ? 'Current' : 
                     'Pending'}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Final connection to end word */}
          <div className="flex flex-col items-center">
            <div className={`w-1 h-8 rounded-full transition-colors duration-300 ${getConnectionColor(5)}`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold ${getNodeColor(6)}`}>
                {endWord.charAt(0).toUpperCase()}
              </div>
              <div className="mt-2 text-center">
                <div className="font-medium text-green-600">{endWord.toUpperCase()}</div>
                <div className="text-xs text-gray-500">Target</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="px-6 pb-6">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentStep} / 5 steps</span>
        </div>
        <div className="flex items-center space-x-2">
          {[0, 1, 2, 3, 4].map((step) => (
            <div 
              key={step}
              className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                step < currentStep 
                  ? 'bg-purple-500' 
                  : step === currentStep 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
'use client';

import { GameCompleteProps } from '@/types/game';

export const GameComplete: React.FC<GameCompleteProps> = ({
  startWord,
  endWord,
  hops,
  onNewGame,
}) => {
  return (
    <div className="text-center space-y-6 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
      <div className="space-y-2">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-bold text-green-700">Congratulations!</h2>
        <p className="text-lg text-gray-600">
          You successfully connected <span className="font-semibold text-blue-600">{startWord}</span> to{' '}
          <span className="font-semibold text-green-600">{endWord}</span>!
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Path:</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-600">{startWord.toUpperCase()}</span>
          </div>
          {hops.map((hop, index) => (
            <div key={index} className="flex items-center space-x-2 ml-2">
              <div className="w-2 h-8 border-l-2 border-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">{hop.toUpperCase()}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center space-x-2 ml-2">
            <div className="w-2 h-8 border-l-2 border-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-600">{endWord.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNewGame}
        className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
      >
        Play Again
      </button>
    </div>
  );
};
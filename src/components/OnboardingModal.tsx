'use client';

import React from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to MagicLink!</h2>
          <p className="text-white/80 text-sm">Connect words through logical steps</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white/10 rounded-2xl p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              🎯 <span className="ml-2">How to Play</span>
            </h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Connect the start word to the target word</li>
              <li>• Each step must logically relate to the previous word</li>
              <li>• You have 3 lives to complete each level</li>
            </ul>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              💡 <span className="ml-2">Tips</span>
            </h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Use hints (costs 1 life)</li>
              <li>• Think about categories, associations, and word meanings</li>
              <li>• Final step must directly connect to the target</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Let's Play!
        </button>
      </div>
    </div>
  );
};
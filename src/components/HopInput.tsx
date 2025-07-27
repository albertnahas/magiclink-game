'use client';

import { KeyboardEvent } from 'react';
import { HopInputProps } from '@/types/game';

export const HopInput: React.FC<HopInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  isValidating,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() && !disabled && !isValidating) {
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isValidating}
        placeholder={disabled ? '' : placeholder}
        className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:border-blue-400/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-white placeholder-white/60"
        autoComplete="off"
        spellCheck="false"
      />
      {isValidating && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
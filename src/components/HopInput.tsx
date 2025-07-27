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
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
        autoComplete="off"
        spellCheck="false"
      />
      {isValidating && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, ValidationResponse, SeedResponse, SolveResponse } from '@/types/game';

const initialGameState: GameState = {
  startWord: '',
  endWord: '',
  currentStep: 0,
  hops: ['', '', '', '', ''],
  isComplete: false,
  isLoading: false,
  error: null,
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [validationLoading, setValidationLoading] = useState<number | null>(null);
  const [hintLoading, setHintLoading] = useState(false);

  const generateSeedWords = useCallback(async (seedWord?: string) => {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/generate-seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedWord }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate seed words');
      }
      
      const data: SeedResponse = await response.json();
      
      setGameState(prev => ({
        ...prev,
        startWord: data.start,
        endWord: data.end,
        currentStep: 0,
        hops: ['', '', '', '', ''],
        isComplete: false,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate seed words',
      }));
    }
  }, []);

  const validateHop = useCallback(async (index: number, guess: string) => {
    if (!guess.trim()) return;
    
    setValidationLoading(index);
    
    try {
      const previous = index === 0 ? gameState.startWord : gameState.hops[index - 1];
      
      const response = await fetch('/api/validate-hop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previous,
          guess: guess.trim(),
          target: gameState.endWord,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to validate hop');
      }
      
      const data: ValidationResponse = await response.json();
      
      if (data.valid) {
        setGameState(prev => {
          const newHops = [...prev.hops];
          newHops[index] = guess.trim().toLowerCase();
          
          const newCurrentStep = index + 1;
          const isComplete = newCurrentStep >= 5;
          
          return {
            ...prev,
            hops: newHops,
            currentStep: newCurrentStep,
            isComplete,
            error: null,
          };
        });
      } else {
        setGameState(prev => ({
          ...prev,
          error: data.message || 'Invalid hop',
        }));
      }
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to validate hop',
      }));
    } finally {
      setValidationLoading(null);
    }
  }, [gameState.startWord, gameState.endWord, gameState.hops]);

  const getHint = useCallback(async () => {
    if (!gameState.startWord || !gameState.endWord || gameState.currentStep >= 5) return;
    
    setHintLoading(true);
    setGameState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: gameState.startWord,
          end: gameState.endWord,
          currentHops: gameState.hops,
          currentStep: gameState.currentStep,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get hint');
      }
      
      const data = await response.json();
      
      if (data.hint) {
        setGameState(prev => {
          const newHops = [...prev.hops];
          newHops[prev.currentStep] = data.hint;
          
          const newCurrentStep = prev.currentStep + 1;
          const isComplete = newCurrentStep >= 5;
          
          return {
            ...prev,
            hops: newHops,
            currentStep: newCurrentStep,
            isComplete,
            error: null,
          };
        });
      } else {
        throw new Error(data.error || 'No hint provided');
      }
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to get hint',
      }));
    } finally {
      setHintLoading(false);
    }
  }, [gameState.startWord, gameState.endWord, gameState.hops, gameState.currentStep]);

  const getSolution = useCallback(async () => {
    if (!gameState.startWord || !gameState.endWord) return;
    
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: gameState.startWord,
          end: gameState.endWord,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get solution');
      }
      
      const data: SolveResponse = await response.json();
      
      if (data.chain) {
        setGameState(prev => ({
          ...prev,
          hops: data.chain!,
          currentStep: 5,
          isComplete: true,
          isLoading: false,
          error: null,
        }));
      } else {
        throw new Error(data.error || 'No solution provided');
      }
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get solution',
      }));
    }
  }, [gameState.startWord, gameState.endWord]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setValidationLoading(null);
    setHintLoading(false);
  }, []);

  const updateHop = useCallback((index: number, value: string) => {
    setGameState(prev => {
      const newHops = [...prev.hops];
      newHops[index] = value;
      return {
        ...prev,
        hops: newHops,
        error: null,
      };
    });
  }, []);

  const undoLastStep = useCallback(() => {
    setGameState(prev => {
      if (prev.currentStep <= 0) return prev;
      
      const newCurrentStep = prev.currentStep - 1;
      const newHops = [...prev.hops];
      
      for (let i = newCurrentStep; i < newHops.length; i++) {
        newHops[i] = '';
      }
      
      return {
        ...prev,
        currentStep: newCurrentStep,
        hops: newHops,
        isComplete: false,
        error: null,
      };
    });
  }, []);

  useEffect(() => {
    generateSeedWords();
  }, [generateSeedWords]);

  return {
    gameState,
    validationLoading,
    hintLoading,
    generateSeedWords,
    validateHop,
    getHint,
    getSolution,
    resetGame,
    updateHop,
    undoLastStep,
  };
};
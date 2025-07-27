'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, ValidationResponse, SeedResponse, SolveResponse } from '@/types/game';

const initialGameState: GameState = {
  startWord: '',
  endWord: '',
  currentStep: 0,
  hops: ['', '', '', '', '', ''],
  isComplete: false,
  isLoading: false,
  error: null,
  // Level system
  level: 1,
  maxSteps: 1, // Level 1 = 1 step
  score: 0,
  lives: 2,
  streak: 0,
  totalGamesWon: 0,
};

// Helper functions for level system
const getMaxStepsForLevel = (level: number): number => {
  return level; // Level 1=1 step, Level 2=2 steps, ..., Level 6=6 steps
};

const getLivesForLevel = (level: number): number => {
  return 1 + level; // Level 1=2 lives, Level 2=3 lives, etc.
};

const calculateScore = (level: number, stepsUsed: number, maxSteps: number): number => {
  // Base score increases with level, bonus for using fewer steps
  const baseScore = level * 100;
  const stepBonus = (maxSteps - stepsUsed) * 20;
  return baseScore + stepBonus;
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
        body: JSON.stringify({ seedWord, level: gameState.level }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate seed words');
      }
      
      const data: SeedResponse = await response.json();
      
      setGameState(prev => {
        const maxSteps = getMaxStepsForLevel(prev.level);
        const newHops = Array(6).fill(''); // Always 6 for display, but only use maxSteps
        return {
          ...prev,
          startWord: data.start,
          endWord: data.end,
          currentStep: 0,
          hops: newHops,
          maxSteps,
          isComplete: false,
          isLoading: false,
          error: null,
        };
      });
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
          const isComplete = newCurrentStep >= prev.maxSteps;
          
          let newScore = prev.score;
          let newLevel = prev.level;
          let newStreak = prev.streak;
          let newTotalGamesWon = prev.totalGamesWon;
          let newLives = prev.lives;
          
          // If puzzle completed
          if (isComplete) {
            const levelScore = calculateScore(prev.level, newCurrentStep, prev.maxSteps);
            newScore += levelScore;
            newStreak += 1;
            newTotalGamesWon += 1;
            
            // Level up logic
            if (prev.level < 6) {
              newLevel = prev.level + 1;
              newLives = getLivesForLevel(newLevel);
            }
          }
          
          return {
            ...prev,
            hops: newHops,
            currentStep: newCurrentStep,
            isComplete,
            score: newScore,
            level: newLevel,
            streak: newStreak,
            totalGamesWon: newTotalGamesWon,
            lives: newLives,
            error: null,
          };
        });
      } else {
        // Invalid hop - lose a life
        setGameState(prev => {
          const newLives = Math.max(0, prev.lives - 1);
          let newStreak = prev.streak;
          
          // Reset streak if no lives left
          if (newLives === 0) {
            newStreak = 0;
          }
          
          return {
            ...prev,
            lives: newLives,
            streak: newStreak,
            error: data.message || 'Invalid hop - Lost a life!',
          };
        });
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
    if (!gameState.startWord || !gameState.endWord || gameState.currentStep >= gameState.maxSteps || gameState.lives <= 0) return;
    
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
          const isComplete = newCurrentStep >= prev.maxSteps;
          const newLives = Math.max(0, prev.lives - 1); // Lose a life for hint
          
          let newStreak = prev.streak;
          // Reset streak if no lives left
          if (newLives === 0) {
            newStreak = 0;
          }
          
          return {
            ...prev,
            hops: newHops,
            currentStep: newCurrentStep,
            isComplete,
            lives: newLives,
            streak: newStreak,
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

  const resetGame = useCallback((fullReset: boolean = false) => {
    if (fullReset) {
      // Complete reset to level 1
      setGameState(initialGameState);
    } else {
      // Just reset current puzzle, keep level progress
      setGameState(prev => ({
        ...prev,
        startWord: '',
        endWord: '',
        currentStep: 0,
        hops: ['', '', '', '', '', ''],
        isComplete: false,
        isLoading: false,
        error: null,
      }));
    }
    setValidationLoading(null);
    setHintLoading(false);
  }, []);

  // Add a function to start next level
  const startNextLevel = useCallback(() => {
    if (gameState.level < 6) {
      resetGame(false);
      generateSeedWords();
    }
  }, [gameState.level, generateSeedWords]);

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
    startNextLevel,
    updateHop,
    undoLastStep,
  };
};
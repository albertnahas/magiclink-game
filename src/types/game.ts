export interface GameState {
  startWord: string;
  endWord: string;
  currentStep: number;
  hops: string[];
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationResponse {
  valid: boolean;
  message?: string;
  error?: string;
}

export interface SeedResponse {
  start: string;
  end: string;
  error?: string;
}

export interface SolveResponse {
  chain?: string[];
  error?: string;
}

export interface HintResponse {
  hint?: string;
  error?: string;
}

export interface HopInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled: boolean;
  isValidating: boolean;
}

export interface GameHeaderProps {
  startWord: string;
  endWord: string;
  isLoading: boolean;
  currentStep: number;
  onNewGame: () => void;
  onGetHint: () => void;
  onGetSolution: () => void;
  onUndo: () => void;
}

export interface VisualizationCanvasProps {
  startWord: string;
  endWord: string;
  hops: string[];
  currentStep: number;
  isComplete: boolean;
}

export interface GameCompleteProps {
  startWord: string;
  endWord: string;
  hops: string[];
  onNewGame: () => void;
}
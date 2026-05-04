export type DiceSystem = "duality" | "yze" | "step" | "2d20";
export type RollModifier = 'advantage' | 'disadvantage' | 'none';

export interface RollOptions {
  target?: number; // Usado en 2d20
  modifier?: 'advantage' | 'disadvantage' | 'none'; // Usado en Duality
  bonus?: number // Para sumas/restas directas (+2, -4, etc.)
  yzeClusters?: {
    attribute: number[];
    skill: number[];
    gear: number[];
    artifacts: number[];
  };
}

export interface RollResult {
  system: DiceSystem;
  rawValues: number[];
  bonus?: number;
  interpreted: {
    total?: number;
    successes?: number;
    outcome: string; // "Éxito con Esperanza", "3 Éxitos", etc.
    isCritical: boolean;
    metadata: Record<string, any>;
  };
}

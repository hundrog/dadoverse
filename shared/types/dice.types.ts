export type DiceSystem = "duality" | "yze" | "step" | "2d20";

export interface RollOptions {
  target?: number; // Usado en 2d20
  modifier?: 'advantage' | 'disadvantage' | 'none'; // Usado en Duality
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
  interpreted: {
    total?: number;
    successes?: number;
    outcome: string; // "Éxito con Esperanza", "3 Éxitos", etc.
    isCritical: boolean;
    metadata: Record<string, any>;
  };
}

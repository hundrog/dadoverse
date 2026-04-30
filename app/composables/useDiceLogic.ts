export type DiceSystem = "duality" | "yze" | "step" | "2d20";

interface RollOptions {
  target?: number; // Usado en 2d20
  modifier?: 'advantage' | 'disadvantage' | 'none'; // Usado en Duality
  yzeClusters?: {
    attribute: number[];
    skill: number[];
    gear: number[];
    artifacts: number[];
  };
}

interface RollResult {
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

interface DualityMetadata {
  hope: number;
  fear: number;
  modifierDice?: number;
  modifierType?: "advantage" | "disadvantage" | "none";
}

interface YzeMetadata {
  attributeSuccesses: number;
  skillSuccesses: number;
  gearSuccesses: number;
  artifactSuccesses: number;
  attributeBanes: number;
  gearBanes: number;
}

export const useDiceLogic = () => {
  // Procesa la tirada según el sistema
  const parseRoll = (system: DiceSystem, dice: number[], options: RollOptions = {}): RollResult => {
    switch (system) {
      case 'duality':
        return solveDuality(dice, options.modifier || 'none');

      case 'yze':
        if (!options.yzeClusters) {
          // Fallback por si se pasan los dados en un solo array plano
          return solveYze(dice, [], [], []);
        }
        return solveYze(
          options.yzeClusters.attribute,
          options.yzeClusters.skill,
          options.yzeClusters.gear,
          options.yzeClusters.artifacts
        );

      case '2d20':
        return solve2d20(dice, options.target || 0);

      case 'step':
        return solveStep(dice);

      default:
        throw new Error('Sistema no soportado');
    }
  };

  // --- Lógicas Específicas ---

  const solveDuality = (
    dice: number[],
    modifier: "advantage" | "disadvantage" | "none" = "none",
  ): RollResult => {
    const [hope = 0, fear = 0, modDice = 0] = dice;
    const isCritical = hope === fear;
    let total = hope + fear;
    let outcome = "";

    // Aplicar lógica de ventaja/desventaja al total
    if (modifier === "advantage" && modDice) {
      total += modDice;
    } else if (modifier === "disadvantage" && modDice) {
      total -= modDice;
    }

    if (isCritical) {
      outcome = "Crítico";
    } else {
      outcome = hope > fear ? "Con Esperanza" : "Con Miedo";
    }

    return {
      system: "duality",
      rawValues: dice,
      interpreted: {
        total,
        outcome,
        isCritical,
        metadata: {
          hope,
          fear,
          modifierDice: modDice || 0,
          modifier,
        } as DualityMetadata,
      },
    };
  };

const solveYze = (
  attribute: number[],
  skill: number[],
  gear: number[],
  artifacts: number[] = []
): RollResult => {

  // En YZE estándar: 6 es un éxito en d6.
  // En dados de artefacto: 6-7 (1 éxito), 8-9 (2 éxitos), 10-11 (3 éxitos), 12 (4 éxitos).
  const calculateArtifactSuccesses = (val: number) => {
    if (val >= 12) return 4;
    if (val >= 10) return 3;
    if (val >= 8) return 2;
    if (val >= 6) return 1;
    return 0;
  };

  const attributeSuccesses = attribute.filter(v => v >= 6).length;
  const skillSuccesses = skill.filter(v => v >= 6).length;
  const gearSuccesses = gear.filter(v => v >= 6).length;

  let artifactSuccesses = 0;
  artifacts.forEach(v => { artifactSuccesses += calculateArtifactSuccesses(v); });

  const totalSuccesses = attributeSuccesses + skillSuccesses + gearSuccesses + artifactSuccesses;

  // Trackeo de "1s" (Banes) para la mecánica de Push
  // Nota: Los dados de Skill usualmente no pifian en YZE
  const attributeBanes = attribute.filter(v => v === 1).length;
  const gearBanes = gear.filter(v => v === 1).length;

  return {
    system: 'yze', // o 'yze'
    rawValues: [...attribute, ...skill, ...gear, ...artifacts],
    interpreted: {
      successes: totalSuccesses,
      outcome: `${totalSuccesses} Éxitos`,
      isCritical: totalSuccesses >= 3,
      metadata: {
        attributeSuccesses,
        skillSuccesses,
        gearSuccesses,
        artifactSuccesses,
        attributeBanes,
        gearBanes,
        details: { attribute, skill, gear, artifacts }
      } as YzeMetadata
    }
  };
};

  const solve2d20 = (dice: number[], tn: number): RollResult => {
    // En 2d20, éxito es sacar <= TN. 1 es doble éxito, 20 es complicación.
    let successes = 0;
    let complications = 0;

    dice.forEach((d) => {
      if (d === 1) successes += 2;
      else if (d <= tn) successes += 1;
      else if (d === 20) complications += 1;
    });

    return {
      system: "2d20",
      rawValues: dice,
      interpreted: {
        successes,
        outcome:
          complications > 0
            ? `${successes} Éxitos / ${complications} Complicación`
            : `${successes} Éxitos`,
        isCritical: successes >= 2,
        metadata: { tn, complications },
      },
    };
  };

  const solveStep = (dice: number[]): RollResult => {
    const total = dice.reduce((a, b) => a + b, 0);
    const highRoll = Math.max(...dice); // Fabula Ultima usa el mayor para el daño

    return {
      system: "step",
      rawValues: dice,
      interpreted: {
        total,
        outcome: `Total: ${total} (HR: ${highRoll})`,
        isCritical: dice.every((d) => d >= 6) && dice[0] === dice[1], // Simplificación de pifia/crítico
        metadata: { highRoll },
      },
    };
  };

  return {
    parseRoll,
  };
};

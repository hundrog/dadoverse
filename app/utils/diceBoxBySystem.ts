import type { DiceSystem } from '#shared/types/dice.types'

/** Dice-box scale/mass per RPG system — tune so rolls fit the viewport and feel right */
export const DICE_BOX_PHYSICS: Record<DiceSystem, { scale: number, mass: number }> = {
  'duality': { scale: 15, mass: 1.3 },
  'step': { scale: 14, mass: 1.25 },
  'yze': { scale: 11, mass: 1.05 },
  '2d20': { scale: 14, mass: 1.3 },
  'agnostic': { scale: 14, mass: 1.3 }
}

export function getDiceBoxPhysics(system?: DiceSystem): { scale: number, mass: number } {
  const key = system ?? 'agnostic'
  return DICE_BOX_PHYSICS[key] ?? DICE_BOX_PHYSICS.agnostic
}

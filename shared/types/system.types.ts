export interface DualityMetadata {
  hope: number
  fear: number
  modifierDice?: number
  modifierType?: 'advantage' | 'disadvantage' | 'none'
  bonus?: number
}

export interface YzeMetadata {
  attributeSuccesses: number
  skillSuccesses: number
  gearSuccesses: number
  artifactSuccesses: number
  attributeBanes: number
  gearBanes: number
}

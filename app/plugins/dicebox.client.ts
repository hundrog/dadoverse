// plugins/dicebox.client.ts
// @ts-expect-error - @3d-dice/dice-box does not provide type definitions
import DiceBox from '@3d-dice/dice-box'
import type { DiceSystem } from '#shared/types/dice.types'

import { getDiceBoxPhysics } from '~/utils/diceBoxBySystem'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      createDiceBox: (selector: string, systemType?: DiceSystem) => {
        const { scale, mass } = getDiceBoxPhysics(systemType)
        return new DiceBox({
          container: selector,
          assetPath: '/dice-box/',
          theme: 'default',
          scale,
          mass,
          offscreen: true,
          settleTimeout: 5000
        })
      }
    }
  }
})

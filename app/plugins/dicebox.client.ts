// plugins/dicebox.client.ts
// @ts-expect-error - @3d-dice/dice-box does not provide type definitions
import DiceBox from "@3d-dice/dice-box";

export default defineNuxtPlugin(() => {
  // Solo devolvemos la clase o una función constructora
  return {
    provide: {
      createDiceBox: (selector: string) => {
        return new DiceBox({
          container: selector,
          assetPath: '/dice-box/',
          theme: 'default',
          scale: 9,
          offscreen: true,
          settleTimeout: 3500
        })
      }
    }
  }
})

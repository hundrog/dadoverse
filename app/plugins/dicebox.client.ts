// plugins/dicebox.client.ts
import DiceBox from '@3d-dice/dice-box'

export default defineNuxtPlugin(() => {
  // Solo devolvemos la clase o una función constructora
  return {
    provide: {
      createDiceBox: (selector: string) => {
        return new DiceBox({
          container: selector,
          assetPath: '/dice-box/',
          theme: "default",
          scale: 9,
          offscreen: true,
        })
      }
    }
  }
})

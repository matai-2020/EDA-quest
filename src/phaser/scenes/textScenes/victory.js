import Phaser from 'phaser'

/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */

// ASSIGNMENTS
let currentSceneScore

export default class VictoryScene extends Phaser.Scene {
  constructor () {
    super('victory-scene')
  }

  preload () {
    // ENVIRONMENT
    this.load.image('crest', '/assets/Victory/victory-crest.png')
    this.load.image('credits', '/assets/Victory/credits-sword.png')
    this.load.image('skyscraper', '/assets/Victory/skyscraper.jpg')
    this.load.image('horizon', '/assets/Victory/horizon.jpg')
  }

  create (prevScore) {
    currentSceneScore = prevScore
    const width = this.scale.width
    const height = this.scale.height

    //  ------ ENVIRONMENT ------
    this.add.image(width * 0.5, height * 0.5, 'skyscraper').setScale(1).setScrollFactor(0)
    setTimeout(() => {
      this.add.image(width * 0.5, 300, 'crest').setScale(0.6).setScrollFactor(0)
    }, 500)
    setTimeout(() => {
      this.add.image(width * 0.5, 650, 'credits').setScale(0.4).setScrollFactor(0)
    }, 1800)

    this.input.once(
      'pointerdown',
      function () {
        this.scene.start('credit-scene', currentSceneScore)
      },
      this
    )
  }

  // update () {
  //   setTimeout(() => {
  //     this.scene.start('credit-scene', currentSceneScore)
  //   }, 2000)
  // }
}

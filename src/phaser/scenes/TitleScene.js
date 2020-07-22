import Phaser from 'phaser'

/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('title-scene')
  }

  preload () {
    // this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('dark-forest', '/assets/Game/dark-forest.png')
    this.load.image('start', '/assets/Game/start.png')
    this.load.image('click-here', '/assets/Game/click-here.png')
  }

  create () {
    this.add.image(this.scale.width / 2, 300, 'dark-forest').setScale(2.5)
    this.add.image(this.scale.width / 2, 400, 'click-here').setScale(0.5)

    this.input.once(
      'pointerdown',
      function () {
        this.scene.start('tut-level')
      },
      this
    )
  }
}

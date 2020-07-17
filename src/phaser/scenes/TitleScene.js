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
    this.load.image('sky', 'src/assets/Jungle/sky.png')
    this.load.image('quest-logo', 'src/assets/Game/quest-logo.png')
  }

  create () {
    this.add.image(400, 300, 'sky')
    this.add.image(400, 300, 'quest-logo').setScale(0.5)

    this.input.once('pointerdown', function () {
      console.log('From Title to Level 1')

      this.scene.start('title-scene')
    }, this)
  }
}

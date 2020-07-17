import Phaser from 'phaser'

/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */
const createAligned = (scene, totalWidth, texture, scrollFactor) => {
  const getWidth = scene.textures.get(texture).getSourceImage().width
  const count = Math.ceil(totalWidth / getWidth) * scrollFactor
  let x = 0
  for (let i = 0; i < count; ++i) {
    const m = scene.add.image(x, scene.scale.height, texture)
      .setOrigin(0, 1)
      .setScrollFactor(scrollFactor)

    x += m.width
  }
}

export default class ParallaxScene extends Phaser.Scene {
  constructor () {
    super('parallax-scene')
  }

  preload () {
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Jungle/ground.png')
    this.load.image('plants', '/assets/Jungle/plant.png')

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    const width = this.scale.width
    const height = this.scale.height
    const totalWidth = width * 10

    this.add.image(width * 0.5, height * 0.5, 'sky')
      .setScrollFactor(0)

    createAligned(this, totalWidth, 'mountain', 0.15)
    createAligned(this, totalWidth, 'plateau', 0.5)
    createAligned(this, totalWidth, 'ground', 1)
    createAligned(this, totalWidth, 'plants', 1.25)

    this.cameras.main.setBounds(0, 0, width * 10, height * 10)
  }

  update () {
    const cam = this.cameras.main
    const speed = 15
    if (this.cursors.left.isDown) {
      // move left
      cam.scrollX -= speed
    } else if (this.cursors.right.isDown) {
      // move right
      cam.scrollX += speed
    }

    // if (this.cursors.down.isDown)
    // {
    //   cam.scrollY += speed
    // }
    // if (this.cursors.up.isDown)
    // {
    //   cam.scrollY -= speed
    // }
  }
}

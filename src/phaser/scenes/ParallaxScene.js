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
    const m = scene.add
      .image(x, scene.scale.height, texture)
      .setOrigin(0, 1)
      .setScrollFactor(scrollFactor)

    x += m.width
  }
}

let coin
let tutor
let player
let platforms
let cursors
let stars
let score = 0
let scoreText
let ground
let block

let keyText
let keyAmount = 0

export default class ParallaxScene extends Phaser.Scene {
  constructor() {
    super('parallax-scene')
  }

  preload() {
    this.load.image('block', '/assets/man/base.png')
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Jungle/ground.png')
    this.load.image('plants', '/assets/Jungle/plant.png')
    this.load.spritesheet('jumpRight', '/assets/man/jumpRight.png', {
      frameWidth: 20,
      frameHeight: 35,
    })
    this.load.spritesheet('jumpLeft', '/assets/man/jumpLeft.png', {
      frameWidth: 20,
      frameHeight: 35,
    })
    this.load.spritesheet('runLeft', '/assets/man/runLeft.png', {
      frameWidth: 21,
      frameHeight: 33,
    })
    this.load.spritesheet('runRight', '/assets/man/runRight.png', {
      frameWidth: 21,
      frameHeight: 33,
    })
    this.load.spritesheet('idle', '/assets/man/idle.png', {
      frameWidth: 19,
      frameHeight: 34,
    })

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const width = this.scale.width
    const height = this.scale.height
    const totalWidth = width * 10

    this.add.image(width * 0.5, height * 0.5, 'sky').setScrollFactor(0)

    createAligned(this, totalWidth, 'mountain', 0.15)
    createAligned(this, totalWidth, 'plateau', 0.5)
    createAligned(this, totalWidth, 'ground', 1)
    createAligned(this, totalWidth, 'plants', 1.25)

    // Collider floor

    platforms = this.physics.add.staticGroup()

    platforms.create(2010, 648, 'block').setScale()

    // Character sprites

    // tutor = this.physics.add.sprite(1100, 535, 'idle')
    // tutor.setScale(3)
    // tutor.setCollideWorldBounds(true)

    // Player sprite

    player = this.physics.add.sprite(100, 500, 'idle')
    player.setScale(3)
    player.body.setGravityY(100)

    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.physics.add.collider(platforms, player)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('runLeft', {
        start: 7,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jumpLeft', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('runRight', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })

    // text
    this.cameras.main.setBounds(0, 0, 3000, 0)
    this.cameras.main.startFollow(player)

    scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000',
    })

    keyText = this.add.text(950, 16, 'Trello: 0', {
      fontSize: '32px',
      fill: '#000',
    })
  }

  update() {
    const cam = this.cameras.main
    const speed = 15
    if (this.cursors.left.isDown) {
      player.setVelocityX(-180)
      player.anims.play('left', true)
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
    else if (this.cursors.right.isDown) {
      player.setVelocityX(180)
      player.anims.play('right', true)
      // move right
      cam.scrollX += speed
    } else if (!player.body.touching.down) {
      player.anims.play('jump', true)
    } else {
      player.setVelocityX(0)
      player.anims.play('turn', true)
    }
    if (this.cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-300)
      player.anims.play('jump', true)
    }
  }
}

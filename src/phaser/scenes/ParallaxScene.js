import Phaser from 'phaser'
import { scoreChanged, gameOver } from '../score'

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

const collectScore = (player, react) => {
  react.disableBody(true, true)
  score += 120
  scoreText.setText('Score: ' + score)
  scoreChanged(score)
}

const loseHp = () => {
  badReact.disableBody(true, true)
  health = health + 1
  healthBar.anims.play(`health${health}`, true)
  if (health === 4) {
    isAlive = false
    healthBar.anims.play(`health${health}`, true)
    gameOver(isAlive)
  } console.log(health)
}

let react
let badReact
let tutor
let player
let platforms
let platform
let cursors
let score = 0
let healthBar
let health = 3
let scoreText
let ground
let block
let floor
let isAlive = true

let keyText
let keyAmount = 0

export default class ParallaxScene extends Phaser.Scene {
  constructor () {
    super('parallax-scene')
  }

  preload () {
    this.load.image('react', '/assets/react.svg')
    this.load.image('platform', '/assets/Jungle/platform.png')
    this.load.image('block', '/assets/man/base.png')
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Jungle/ground.png')
    this.load.image('platform', '/assets/airpack/PNG/Environment/ground_grass.png')
    this.load.image('plants', '/assets/Jungle/plant.png')
    this.load.image('arrow-keys', '/assets/Jungle/arrow-keys.png')
    this.load.spritesheet('jumpRight', '/assets/man/jumpRight.png', {
      frameWidth: 20,
      frameHeight: 35
    })
    this.load.spritesheet('jumpLeft', '/assets/man/jumpLeft.png', {
      frameWidth: 20,
      frameHeight: 35
    })
    this.load.spritesheet('runLeft', '/assets/man/runLeft.png', {
      frameWidth: 21,
      frameHeight: 33
    })
    this.load.spritesheet('runRight', '/assets/man/runRight.png', {
      frameWidth: 21,
      frameHeight: 33
    })
    this.load.spritesheet('idle', '/assets/man/idle.png', {
      frameWidth: 19,
      frameHeight: 34
    })

    this.load.spritesheet('heart', '/assets/Game/Hearts/PNG/animated/border/heart_animated_2.png', {
      frameHeight: 17,
      frameWidth: 17
    })

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    const width = this.scale.width
    const height = this.scale.height
    const totalWidth = width * 10

    this.add.image(width * 0.5, height * 0.5, 'sky').setScrollFactor(0)

    createAligned(this, totalWidth, 'mountain', 0.15)
    createAligned(this, totalWidth, 'plateau', 0.5)
    createAligned(this, totalWidth, 'ground', 1)
    createAligned(this, totalWidth, 'plants', 1.25)
    // this.add.image(width * 0.5, height * 1, 'platform')
    //   .setScrollFactor(0)

    // // CREATE PLAFORM GROUP
    // const platforms = this.physics.add.staticGroup()

    // // How many platforms
    // for (let i = 0; i < 5; ++i) {
    //   const x = Phaser.Math.Between(80, 400)
    //   const y = 150 * i

    //   const platform = platforms.create(x, y, 'platform')
    //   platform.scale = 0.5

    //   const body = platform.body
    //   body.updateFromGameObject()
    // }

    // Collider floor & platforms

    floor = this.physics.add.staticGroup()
    floor.create(2010, 648, 'block')

    platforms = this.physics.add.staticGroup()
    platforms.create(800, 450, 'platform').setScale(0.4).refreshBody()

    // Character sprites

    // tutor = this.physics.add.sprite(1100, 535, 'idle')
    // tutor.setScale(3)
    // tutor.setCollideWorldBounds(true)

    // Arrow Keys Instructions
    this.add.image(300, 580, 'arrow-keys').setScale(0.2)

    // Player sprite

    player = this.physics.add.sprite(100, 500, 'idle')
    player.setScale(3)
    player.body.setGravityY(-100)

    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('runLeft', {
        start: 7,
        end: 0
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jumpLeft', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('runRight', {
        start: 0,
        end: 7
      }),
      frameRate: 10,
      repeat: -1
    })

    // HEALTH BAR

    healthBar = this.add.sprite(275, 40, 'heart')
    healthBar.setScale(3)

    this.anims.create({
      key: 'health1',
      frames: this.anims.generateFrameNumbers('heart', {
        start: 0,
        end: 1
      }),
      frameRate: 10

    })

    this.anims.create({
      key: 'health2',
      frames: this.anims.generateFrameNumbers('heart', {
        start: 1,
        end: 2
      }),
      frameRate: 10

    })
    this.anims.create({
      key: 'health3',
      frames: this.anims.generateFrameNumbers('heart', {
        start: 2,
        end: 3
      }),
      frameRate: 10

    })
    this.anims.create({
      key: 'health4',
      frames: this.anims.generateFrameNumbers('heart', {
        start: 3,
        end: 4
      }),
      frameRate: 10

    })
    this.anims.create({
      key: 'health5',
      frames: this.anims.generateFrameNumbers('heart', {
        start: 4,
        end: 5
      }),
      frameRate: 10

    })

    // coin and collection

    react = this.physics.add.sprite(550, 600, 'react')
    react.setScale(0.2)

    badReact = this.physics.add.sprite(700, 600, 'react')
    badReact.setScale(0.2)

    this.physics.add.overlap(player, react, collectScore, null, this)
    this.physics.add.overlap(player, badReact, loseHp, null, this)

    // text
    this.cameras.main.setBounds(0, 0, 3000, 0)
    this.cameras.main.startFollow(player)

    scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#000'
    })

    keyText = this.add.text(950, 16, 'Trello: 0', {
      fontSize: '32px',
      fill: '#000'
    })

    // colliders
    this.physics.add.collider(floor, [player, react, badReact])
    this.physics.add.collider(player, [platforms])
  }

  update () {
    const cam = this.cameras.main
    const speed = 15
    if (this.cursors.left.isDown) {
      player.setVelocityX(-300)
      player.anims.play('left', true)
      // move left
      cam.scrollX -= speed
    } else if (this.cursors.right.isDown) {
      player.setVelocityX(300)
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

  // if (this.cursors.down.isDown)
  // {
  //   cam.scrollY += speed
  // }
  // if (this.cursors.up.isDown)
  // {
  //   cam.scrollY -= speed
  // }
}

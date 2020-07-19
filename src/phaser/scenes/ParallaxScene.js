import Phaser from 'phaser'
import { scoreChanged, gameOver, victoryCheck } from '../score'

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

let scorePara = 0
let scoreText

let checkText
let checkAmount = 0
const checksToPass = 1
let currentSceneScore

const collectScore = (player, type) => {
  if (type.texture.key === 'react') {
    type.disableBody(true, true)
    currentSceneScore += 10
    scoreText.setText('Score: ' + currentSceneScore)
    scoreChanged(currentSceneScore)
  } else {
    type.disableBody(true, true)
    currentSceneScore += 20
    checkAmount += 1
    scoreText.setText('Score: ' + currentSceneScore)
    scoreChanged(currentSceneScore)
    checkText.setText('Trello: ' + checkAmount + ' / ' + checksToPass)
    if (checkAmount === checksToPass) {
      canAsk = true
    }
  }
}

let canAsk = false
let noQuestion
let paraLevelComplete = false

const askQuestion = () => {
  if (canAsk) {
    noQuestion.setText('Congrats, you have completed your trello card!')
    setTimeout(() => {
      paraLevelComplete = true
    }, 1000)
  } else {
    noQuestion.setText('Please come back with a complete trello card')
  }
}

const loseHp = () => {
  badReact.disableBody(true, true)
  health = health + 1
  healthBar.anims.play(`health${health}`, true)
  if (health === 4) {
    death()
  }
}

const death = () => {
  isAlive = false
  healthBar.anims.play(`health${health}`, true)
  explode.anims.play('death', true)
  setTimeout(() => {
    player.disableBody(true, true)
    healthBar.disableBody(true, true)
  }, 100)
  setTimeout(() => { gameOver({ isAlive, wonGame }) }, 2000)
}

const victory = () => {
  wonGame = true
  setTimeout(() => { gameOver({ isAlive, wonGame }) }, 2000)
}

let wall
let facing = ''
let react
let badReact
let winReact
let player
let platforms
let healthBar
let health = 3
let wonGame = false
let floor
let isAlive = true
let explode
let trigger
let tutor
let check

const worldWidth = 2000

export default class ParallaxScene extends Phaser.Scene {
  constructor () {
    super('parallax-scene')
  }

  preload () {
    // invis walls/triggers
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')

    // assets
    this.load.image('react', '/assets/reactCoinP.png')
    this.load.image('check', '/assets/check.png')
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
    this.load.spritesheet('idleRight', '/assets/man/idleRight.png', {
      frameWidth: 19,
      frameHeight: 34
    })
    this.load.spritesheet('idleLeft', '/assets/man/idleLeft.png', {
      frameWidth: 19,
      frameHeight: 34
    })

    this.load.spritesheet('heart', '/assets/Game/Hearts/PNG/animated/border/heart_animated_2.png', {
      frameHeight: 17,
      frameWidth: 17
    })

    this.load.spritesheet('explode', '/assets/Game/explosion.png', {
      frameWidth: 125.4,
      frameHeight: 107
    })
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create (prevScore) {
    currentSceneScore = prevScore
    this.input.keyboard.on('keydown-' + 'LEFT', function (event) {
      facing = 'left'
    })
    this.input.keyboard.on('keydown-' + 'RIGHT', function (event) {
      facing = 'right'
    })
    const width = this.scale.width
    const height = this.scale.height
    const totalWidth = width * 10

    this.add.image(width * 0.5, height * 0.5, 'sky').setScrollFactor(0)

    createAligned(this, totalWidth, 'mountain', 0.15)
    createAligned(this, totalWidth, 'plateau', 0.5)
    createAligned(this, totalWidth, 'ground', 1)
    createAligned(this, totalWidth, 'plants', 1.25)

    // Collider floor & platforms

    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    floor = this.physics.add.staticGroup()
    floor.create(2010, 648, 'base').setScrollFactor(0)

    platforms = this.physics.add.staticGroup()
    platforms.create(800, 450, 'platform').setScale(0.4).refreshBody()

    // Arrow Keys Instructions
    this.add.image(300, 580, 'arrow-keys').setScale(0.2)

    // Player sprite

    // Tutor
    tutor = this.physics.add.sprite(1700, 535, 'idleLeft')
    tutor.setScale(3)

    // Tutor trigger

    const spot = tutor.body.position

    trigger = this.physics.add.sprite(spot.x, spot.y, 'triggerBlock')

    // player sprite

    player = this.physics.add.sprite(100, 580, 'idleRight')
    player.setScale(3)
    player.body.setGravityY(80)
    player.setCollideWorldBounds(false)
    // player.onWorldBounds = true
    player.body.checkCollision.up = false

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
      key: 'right',
      frames: this.anims.generateFrameNumbers('runRight', {
        start: 0,
        end: 7
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'idleRight',
      frames: this.anims.generateFrameNumbers('idleRight', {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'idleLeft',
      frames: this.anims.generateFrameNumbers('idleLeft', {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'jumpLeft',
      frames: this.anims.generateFrameNumbers('jumpLeft', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'jumpRight',
      frames: this.anims.generateFrameNumbers('jumpRight', {
        start: 0,
        end: 2
      }),
      frameRate: 5,
      repeat: -1
    })

    // HEALTH BAR
    healthBar = this.physics.add.sprite(player.body.position.x + 15, player.body.position.y - 40, 'heart')
    healthBar.setScale(2)

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

    react = this.physics.add.staticGroup()
    react.create(550, 600, 'react').setScale(0.05).refreshBody()

    check = this.physics.add.staticGroup()
    check.create(1400, 550, 'check').setScale(0.08).refreshBody()

    this.physics.add.overlap(player, check, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)

    badReact = this.physics.add.staticImage(700, 600, 'react').setScale(0.05).refreshBody()
    winReact = this.physics.add.staticImage(850, 600, 'react').setScale(0.05).refreshBody()

    this.physics.add.overlap(player, react, collectScore, null, this)
    this.physics.add.overlap(player, badReact, loseHp, null, this)
    this.physics.add.overlap(player, winReact, victory, null, this)

    // text
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)

    scoreText = this.add
      .text(16, 16, 'Score: ' + currentSceneScore, {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '20px',
        fill: '#000'
      })
      .setScrollFactor(0)

    checkText = this.add
      .text(width - 300, 16, 'Trello: 0 / ' + checksToPass, {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '20px',
        fill: '#000'
      })
      .setScrollFactor(0)
    noQuestion = this.add.text(spot.x - 250, spot.y - 10, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '12px',
      fill: '#000'
    })

    // colliders
    this.physics.add.collider(floor, [player, react, badReact])
    this.physics.add.collider(player, [platforms, wall])
  }

  update () {
    const cam = this.cameras.main
    const speed = 15

    if (this.cursors.left.isDown) {
      // facing = 'left'
      player.setVelocityX(-300)
      cam.scrollX -= speed
      if (!player.body.touching.down) {
        player.anims.play('jumpLeft', true)
      } else {
        player.anims.play('left', true)
      }
    } else if (this.cursors.right.isDown) {
      // facing = 'right'
      player.setVelocityX(300)
      cam.scrollX += speed
      if (!player.body.touching.down) {
        player.anims.play('jumpRight', true)
      } else {
        player.anims.play('right', true)
      }
    } else if (!player.body.touching.down && facing === 'left') {
      player.anims.play('jumpLeft', true)
    } else if (!player.body.touching.down && facing === 'right') {
      player.anims.play('jumpRight', true)
    } else if (facing === 'left') {
      player.setVelocityX(0)
      player.anims.play('idleLeft', true)
    } else {
      player.setVelocityX(0)
      player.anims.play('idleRight', true)
    }
    if (this.cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-300)
      if (facing === 'left') {
        player.anims.play('jumpLeft', true)
      } else player.anims.play('jumpRight', true)
    }

    // HEALTHBAR ABOVE PLAYER

    healthBar.body.position.x = player.body.position.x + 15
    healthBar.body.position.y = player.body.position.y - 40

    // DEATH ANIMATION

    explode = this.add.sprite(player.body.position.x + 50, player.body.position.y + 45, 'explode')
    explode.setScale(1.4)

    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNumbers('explode', {
        start: 0,
        end: 16
      }),
      frameRate: 24

    })
    if (paraLevelComplete) {
      this.scene.start('jump-scene', scorePara)
    }
  }
}

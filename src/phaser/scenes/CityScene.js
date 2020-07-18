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

let score = 0
let scoreText

const collectScore = (player, react) => {
  react.disableBody(true, true)
  score += 1
  scoreText.setText('Score: ' + score)
  if (score === 1) {
    canAsk = true
  }
}

let canAsk = false
let popUp = 0
let notYet
let noQuestion

const askQuestion = () => {
  if (canAsk) {
    popUp = 2
  } else {
    noQuestion.setText('Please come back with a complete trello card')
  }
}

let facing = ''

let react
let tutor
let player
let platforms
let platform
let cursors

let ground
let base
let floor
let wall
let trigger

let game

let keyText
let keyAmount = 0

let worldWidth = window.innerWidth - 100

export default class CityScene extends Phaser.Scene {
  constructor () {
    super('city-scene')
  }

  preload () {
    // invis walls/triggers
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')

    // city assets
    this.load.image('react', '/assets/react.svg')
    this.load.image('street', '/assets/City/street.png')
    this.load.image('near-buildings', '/assets/City/near-buildings.png')
    this.load.image('far-buildings', '/assets/City/far-buildings.png')
    // assets
    this.load.image('react', '/assets/react.svg')
    this.load.image('platform', '/assets/Jungle/platform.png')
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Jungle/ground.png')
    this.load.image('arrow-keys', '/assets/Jungle/arrow-keys.png')
    this.load.image(
      'platform',
      '/assets/airpack/PNG/Environment/ground_grass.png'
    )
    this.load.image('plants', '/assets/Jungle/plant.png')

    // player assets
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
    this.load.spritesheet('idleLeft', '/assets/man/idleLeft.png', {
      frameWidth: 19,
      frameHeight: 34
    })

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    this.input.keyboard.on('keydown-' + 'LEFT', function (event) {
      facing = 'left'
    })
    this.input.keyboard.on('keydown-' + 'RIGHT', function (event) {
      facing = 'right'
    })

    const width = this.scale.width

    this.add.image(670, 505, 'far-buildings').setScale(5.3).setScrollFactor(0)
    this.add.image(220, 500, 'near-buildings').setScale(5).setScrollFactor(0)
    this.add.image(600, 475, 'street').setScale(3.5).setScrollFactor(0)
    this.add.image(1830, 475, 'street').setScale(3.5).setScrollFactor(0)

    // Collider floor

    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    floor = this.physics.add.staticGroup()
    floor.create(2010, 800, 'base').setScrollFactor(0)

    // Platforms

    // let platforms = this.physics.add.staticGroup()
    // platforms.create(500, 510, 'platform').setScale(0.4).refreshBody()
    // platforms.create(600, 600, 'platform').setScale(0.4).refreshBody()

    // platforms.children.entries.forEach(platform => {
    //   platform.body.checkCollision.left = false
    //   platform.body.checkCollision.right = false
    //   platform.body.checkCollision.down = false
    // })

    // let platform3 = this.physics.add.staticGroup()
    // platform3.create(800, 450, 'platform').setScale(0.4).refreshBody()

    // Character sprites

    // Tutor
    // let tutorAxisX = 2900
    // let tutorAxisY = 535

    // tutor = this.physics.add.sprite(tutorAxisX, tutorAxisY, 'idleLeft')
    // tutor.setScale(3)

    // Tutor trigger

    // trigger = this.physics.add.sprite(tutorAxisX, tutorAxisY, 'triggerBlock')

    // Player sprite

    player = this.physics.add.sprite(100, 500, 'idle')
    player.setScale(3)
    player.body.setGravityY(60)

    // player.setBounce(0.05)
    player.setCollideWorldBounds(false)
    player.onWorldBounds = true
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
      key: 'idle',
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 11 }),
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

    // coin and collection

    react = this.physics.add.sprite(550, 200, 'react')
    react.setScale(0.2)

    this.physics.add.overlap(player, react, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)

    // camera follow
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)

    // text
    scoreText = this.add
      .text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000'
      })
      .setScrollFactor(0)

    keyText = this.add
      .text(width - 200, 16, 'Trello: 0', {
        fontSize: '32px',
        fill: '#000'
      })
      .setScrollFactor(0)

    // noQuestion = this.add.text(tutorAxisX - 480, tutorAxisY - 250, '', {
    //   fontSize: '18px',
    //   fill: '#000'
    // })

    // colliders
    this.physics.add.collider(floor, [player, react, tutor, trigger])
    this.physics.add.collider(react, [platforms])
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
      player.anims.play('idle', true)
    }
    if (this.cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-300)
      if (facing === 'left') {
        player.anims.play('jumpLeft', true)
      } else player.anims.play('jumpRight', true)
    }
  }
}

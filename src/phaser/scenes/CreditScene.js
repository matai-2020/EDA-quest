import Phaser from 'phaser'

/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */

// ASSIGNMENTS
let facing = ''
let wall
let floor
let tutors
let player
const worldWidth = 3000

export default class CreditScene extends Phaser.Scene {
  constructor () {
    super('credit-scene')
  }

  preload () {
    // WALLS & TRIGGERS
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')

    // ENVIRONMENT
    this.load.image('background', '/assets/Credits/sunset.jpg')
    this.load.image('curtain', '/assets/Theatre/theatre-curtain.png')
    this.load.image('lighting', '/assets/Theatre/theatre-lighting.png')
    this.load.image('floor', '/assets/Theatre/theatre-floor.png')
    this.load.image('stage', '/assets/Theatre/theatre-stage.png')

    // TOKENS

    // TUTOR SPRITE
    this.load.image('lache', '/assets/man/lache.png')
    this.load.image('lane', '/assets/man/lane.png')
    this.load.image('emily', '/assets/man/emily.png')
    this.load.image('don', '/assets/man/don.png')

    // PLAYER SPRITESHEETS
    this.load.spritesheet('jumpRight', '/assets/man/jumpRight.png', {
      frameWidth: 60,
      frameHeight: 105
    })
    this.load.spritesheet('jumpLeft', '/assets/man/jumpLeft.png', {
      frameWidth: 60,
      frameHeight: 105
    })
    this.load.spritesheet('runLeft', '/assets/man/runLeft.png', {
      frameWidth: 63,
      frameHeight: 99
    })
    this.load.spritesheet('runRight', '/assets/man/runRight.png', {
      frameWidth: 63,
      frameHeight: 99
    })
    this.load.spritesheet('idleRight', '/assets/man/idleRight.png', {
      frameWidth: 57,
      frameHeight: 102
    })
    this.load.spritesheet('idleLeft', '/assets/man/idleLeft.png', {
      frameWidth: 57,
      frameHeight: 102
    })
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    const width = this.scale.width
    const height = this.scale.height

    // PLAYER ORIENTATION
    this.input.keyboard.on('keydown-' + 'LEFT', function (event) {
      facing = 'left'
    })
    this.input.keyboard.on('keydown-' + 'RIGHT', function (event) {
      facing = 'right'
    })

    //  ------ ENVIRONMENT ------
    this.add.image((width * 0.5) + 20, (height * 0.5) - 100, 'background').setScale(1.3).setScrollFactor(0.01)

    // STAGE
    // this.add.image(2000, 460, 'stage').setScale(2.8).setScrollFactor(0.35)

    // GROUND
    this.add.image(500, 830, 'floor').setScale(1).setScrollFactor(1)
    this.add.image(1500, 830, 'floor').setScale(1).setScrollFactor(1)

    // WALLS
    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    // FLOOR
    floor = this.physics.add.staticGroup()
    floor.create(700, 700, 'base').setScrollFactor(0)
    floor.create(1400, 700, 'base').setScrollFactor(0)

    //  ------ CHARACTERS ------

    // TUTOR SPRITE & TRIGGER
    tutors = this.physics.add.staticGroup()
    tutors.create(1500, 620, 'lache').setScale(0.28)
    tutors.create(1450, 620, 'lane').setScale(0.3)
    tutors.create(1400, 620, 'emily').setScale(0.28)
    tutors.create(1550, 620, 'don').setScale(1)
    // const spot = tutor.body.position
    // trigger = this.physics.add.sprite(spot.x, spot.y, 'triggerBlock')

    // PLAYER SPRITE & MECHANICS
    player = this.physics.add.sprite(100, 580, 'idleRight')
    player.body.setGravityY(1000)
    player.setCollideWorldBounds(false)
    player.body.checkCollision.up = false

    // ANIMATIONS
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

    //  ------ TOKENS ------

    // REACT
    // react = this.physics.add.staticGroup()
    // react.create(550, 600, 'react').setScale(0.05).refreshBody()
    // react.create(850, 600, 'react').setScale(0.05).refreshBody()
    // this.physics.add.overlap(player, react, collectScore, null, this)

    // PLAYER CAMERA MECHANICS
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)

    // credit1 = this.add.text(spot.x - 250, spot.y + 100, '', {
    //   fontFamily: "'Press Start 2P', cursive",
    //   fontSize: '12px',
    //   fill: 'white'
    // })

    // FRONT IMAGES - CURTAIN
    this.add.image(680, 350, 'curtain').setScale(1.3).setScrollFactor(0)
    // FRONT IMAGES - LIGHTING
    this.add.image(480, 90, 'lighting').setScrollFactor(1)
    this.add.image(1430, 90, 'lighting').setScrollFactor(1)
    this.add.image(2380, 90, 'lighting').setScrollFactor(1)
    this.add.image(3330, 90, 'lighting').setScrollFactor(1)

    // COLLIDERS
    this.physics.add.collider([floor], [player, tutors])
    this.physics.add.collider(player, [wall])
  }

  update () {
    // ANIMATIONS
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
      player.setVelocityY(-600)
      if (facing === 'left') {
        player.anims.play('jumpLeft', true)
      } else player.anims.play('jumpRight', true)
    }
  }
}
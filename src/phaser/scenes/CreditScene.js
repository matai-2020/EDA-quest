import Phaser from 'phaser'
import { gameOver } from '../score'

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
let creditTrigger
let floor
let tutors
let player
let diploma
let credits
let credit1
let specialThanks
let credit2
let credit3
let credit4
let broughtToYouBy
let edaQuest
let team
let currentSceneScore
let graduate = false
const isAlive = true
let wonGame = false
const worldWidth = 3000

// COLLECT DIPLOMA
const collectDiploma = (player, type) => {
  type.disableBody(true, true)
  graduate = true
}

// DISPLAY CREDITS
const displayCredit = (player, type) => {
  type.disableBody(true, true)
  const axis = type.body.center.x
  if (axis === 250) credits.setText('\nC\nR\nE\nD\nI\nT\nS\n')
  if (axis === 500) credit1.setText('\nDEVELOPERS:\n\nIsaac Bell\nJake Hurley\nKeenen Leyson\nLouis Fowler')
  if (axis === 800) specialThanks.setText('\nSPECIAL\nTHANKS\nto:')
  if (axis === 1000) credit2.setText('\nHUMAN SKILLS:\n\nCarolyn Stott\nDougal Stott')
  if (axis === 1400) credit3.setText('\nTECH TEAM:\n\nDon Smith\nEmily Parkes\nLane Le Prevost-Smith\nLaché Melvin\nPhoenix Zerin')
  if (axis === 1800) {
    credit4.setText('\nThe 2020\n  MATAI\n Cohort')
    broughtToYouBy.setText('\nbrought to you by:')
    edaQuest.setText('\nTHE EDA\n QUEST')
    team.setText('\n team')
  }
}

export default class CreditScene extends Phaser.Scene {
  constructor () {
    super('credit-scene')
  }

  preload () {
    // WALLS & TRIGGERS
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')
    this.load.image('creditTrigger', '/assets/blocksTriggers/wallBlock.png')

    // ENVIRONMENT
    this.load.image('sunset', '/assets/Credits/sunset.jpg')
    this.load.image('curtain', '/assets/Theatre/theatre-curtain.png')
    this.load.image('lighting', '/assets/Theatre/theatre-lighting.png')
    this.load.image('floor', '/assets/Theatre/theatre-floor.png')
    this.load.image('stage', '/assets/Theatre/theatre-stage.png')

    // TOKENS
    this.load.image('diploma', '/assets/Credits/diploma.png')

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

  create (prevScore) {
    currentSceneScore = prevScore
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
    this.add.image((width * 0.5) + 20, (height * 0.5) - 100, 'sunset').setScale(1.3).setScrollFactor(0.09)

    // GROUND
    this.add.image(500, 830, 'floor').setScale(1).setScrollFactor(1)
    this.add.image(1500, 830, 'floor').setScale(1).setScrollFactor(1)
    this.add.image(2500, 830, 'floor').setScale(1).setScrollFactor(1)

    // STAGE
    this.add.image(2350, 650, 'stage').setScale(0.4).setScrollFactor(1)

    // WALLS
    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    // FLOOR
    floor = this.physics.add.staticGroup()
    floor.create(700, 700, 'base').setScrollFactor(0)
    floor.create(1400, 700, 'base').setScrollFactor(0)
    floor.create(2350, 600, 'base').setScale(0.1).refreshBody().setScrollFactor(1)

    //  ------ CHARACTERS ------

    // TUTOR SPRITE & TRIGGER
    tutors = this.physics.add.staticGroup()
    tutors.create(2220, 550, 'lache').setScale(0.25)
    tutors.create(2270, 550, 'lane').setScale(0.3)
    tutors.create(2440, 550, 'emily').setScale(0.25)
    tutors.create(2490, 550, 'don').setScale(1)
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

    // DIPLOMA
    diploma = this.physics.add.staticGroup()
    diploma.create(2350, 400, 'diploma').setScale(0.2).refreshBody()
    this.physics.add.overlap(player, diploma, collectDiploma, null, this)

    // PLAYER CAMERA MECHANICS
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)

    // CREDIT TRIGGER
    creditTrigger = this.physics.add.staticGroup()
    creditTrigger.create(250, 200, 'creditTrigger')
    creditTrigger.create(500, 200, 'creditTrigger')
    creditTrigger.create(800, 200, 'creditTrigger')
    creditTrigger.create(1000, 200, 'creditTrigger')
    creditTrigger.create(1400, 200, 'creditTrigger')
    creditTrigger.create(1800, 200, 'creditTrigger')
    this.physics.add.overlap(player, creditTrigger, displayCredit, null, this)

    credits = this.add.text(250, 280, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '25px',
      fill: 'white'
    })

    credit1 = this.add.text(350, 300, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '20px',
      fill: 'white'
    })

    specialThanks = this.add.text(670, 340, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '15px',
      fill: 'white'
    })

    credit2 = this.add.text(850, 320, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '20px',
      fill: 'white'
    })

    credit3 = this.add.text(1200, 300, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '20px',
      fill: 'white'
    })

    credit4 = this.add.text(1800, 320, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '25px',
      fill: 'white'
    })

    broughtToYouBy = this.add.text(2600, 320, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '18px',
      fill: 'white'
    })

    edaQuest = this.add.text(2660, 350, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '30px',
      fill: 'green'
    })

    team = this.add.text(2700, 460, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '18px',
      fill: 'white'
    })

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

    // VICTORY => HIGHSCHORE
    if (graduate) {
      player.setScale(2)
      this.victory()
    }
  }

  victory = () => {
    wonGame = true
    setTimeout(() => { gameOver({ isAlive, wonGame, currentSceneScore }) }, 2000)
  }
}

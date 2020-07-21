import Phaser from 'phaser'
import { scoreChanged } from '../score'

/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */

// ASSIGNMENTS
let currentSceneScore = 0
let startingScore
let scoreText
let checkAmount = 0
let checkText
const checksToPass = '3'
let canAsk = false
let noQuestion
let duskSceneComplete = false
let facing = ''
let react
let upskill
let check
let tutor
let player
let platforms
let floor
let wall
let trigger
let healthBar
let health = 0
const life = []
let lives
let bump
let gravityBoost = false
const worldWidth = 4000

// GROUND LAYOUT
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

// SCORE & TRELLO COLLECTOR
const collectScore = (player, type) => {
  if (type.texture.key === 'react') {
    type.disableBody(true, true)
    currentSceneScore += 10
    scoreChanged(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
    /*eslint-disable */
    if (checkAmount == checksToPass) {
      canAsk = true
    }
  } else {
    type.disableBody(true, true)
    currentSceneScore += 20
    checkAmount += 1
    scoreChanged(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
    checkText.setText('Trello: ' + checkAmount + ' / ' + checksToPass)
    /*eslint-disable */
    if (checkAmount == checksToPass) {
      canAsk = true
    }
  }
}

// TUTOR TRIGGER
const askQuestion = () => {
  if (canAsk) {
    noQuestion.setText('Congrats, you have completed your trello card!')
    setTimeout(() => {
      duskSceneComplete = true
    }, 2000)
  } else {
    noQuestion.setText('I can help you with that! \n\nHere, pick up the UpSkill token')
  }
}

// SKILL COLLECTOR
const collectSkill = (player, type) => {
  type.disableBody(true, true)
  gravityBoost = true
}

export default class DuskScene extends Phaser.Scene {
  constructor () {
    super('dusk-scene')
  }

  preload () {
    // WALLS & TRIGGERS
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')

    // ENVIRONMENT
    this.load.image('background', '/assets/Dusk/dusk-bg.png')
    this.load.image('far-mount', '/assets/Dusk/dusk-far-mount.png')
    this.load.image('near-mount', '/assets/Dusk/dusk-near-mount.png')
    this.load.image('far-trees', '/assets/Dusk/dusk-far-trees.png')
    this.load.image('near-trees', '/assets/Dusk/dusk-near-trees.png')
    this.load.image('near-buildings', '/assets/City/near-buildings.png')

    // GROUND & PLATFORMS
    this.load.image('dusk-ground', '/assets/Dusk/duskGround.png')
    this.load.image('platformLrg', '/assets/Dusk/platform.png')
    this.load.image('platformSml1', '/assets/Dusk/platformSml1.png')
    this.load.image('platformSml2', '/assets/Dusk/platformSml2.png')
    this.load.image('platformMed1', '/assets/Dusk/platformMed1.png')
    this.load.image('platformMed2', '/assets/Dusk/platformMed2.png')

    // TOKENS
    this.load.image('upskill', '/assets/Dusk/upskill.png')
    this.load.image('check', '/assets/check.png')
    this.load.image('react', '/assets/reactCoinP.png')
    this.load.image('lives', '/assets/Game/lives-icon.png')

    // TUTOR SPRITE
    this.load.image('emily', '/assets/man/emily.png')

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

  create (prevLevel) {
    const width = this.scale.width
    const height = this.scale.height
    const totalWidth = width * 10

    // PLAYER ORIENTATION
    this.input.keyboard.on('keydown-' + 'LEFT', function (event) {
      facing = 'left'
    })
    this.input.keyboard.on('keydown-' + 'RIGHT', function (event) {
      facing = 'right'
    })

    // CARRY OVER PREVIOUS SCORE
    currentSceneScore = prevLevel.currentSceneScore
    startingScore = currentSceneScore
    lives = prevLevel.lives

    //  ------ ENVIRONMENT ------
    this.add.image(width * 0.5, height * 0.5, 'background').setScale(5).setScrollFactor(0)
    this.add.image(800, 300, 'far-mount').setScale(4).setScrollFactor(0.01)
    this.add.image(700, 400, 'near-mount').setScale(3).setScrollFactor(0.05)
    this.add.image(2000, 460, 'near-buildings').setScale(2.8).setScrollFactor(0.35)
    this.add.image(800, 300, 'far-trees').setScale(4.5).setScrollFactor(0.4)
    this.add.image(3000, 300, 'far-trees').setScale(4.5).setScrollFactor(0.4)
    this.add.image(1200, 250, 'near-trees').setScale(5).setScrollFactor(0.7)
    this.add.image(3000, 250, 'near-trees').setScale(5).setScrollFactor(0.7)

    // GROUND
    createAligned(this, totalWidth, 'dusk-ground', 1)

    // WALLS
    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    // FLOOR
    floor = this.physics.add.staticGroup()
    floor.create(2010, 650, 'base').setScrollFactor(0)

    // PLATFORMS
    platforms = this.physics.add.staticGroup()
    platforms.create(800, 380, 'platformLrg').setScale(0.4).refreshBody()
    platforms.create(100, 250, 'platformSml1').setScale(0.4).refreshBody()
    platforms.create(2500, 600, 'platformMed1').setScale(0.4).refreshBody()
    platforms.children.entries.forEach(platform => {
      return (
        (platform.body.checkCollision.left = false),
        (platform.body.checkCollision.right = false),
        (platform.body.checkCollision.down = false))
    })

    //  ------ CHARACTERS ------

    // TUTOR SPRITE & TRIGGER
    tutor = this.physics.add.sprite(3600, 535, 'emily')
    tutor.setScale(0.3)
    const spot = tutor.body.position
    trigger = this.physics.add.sprite(spot.x, spot.y, 'triggerBlock')

    // PLAYER SPRITE & MECHANICS
    player = this.physics.add.sprite(100, 580, 'idleRight')
    player.body.setGravityY(1000)
    player.setCollideWorldBounds(false)
    player.body.checkCollision.up = false

    // Amount of Lives display
    for (let i = 1; i < lives; i++) {
      let x = 400
      x = x + (i * 80)
      life[i] = this.add.image(x, 30, 'lives').setScale(0.5).setScrollFactor(0)
    }

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

    // UPSKILL
    upskill = this.physics.add.staticGroup()
    upskill.create(3800, 575, 'upskill').setScale(0.18).refreshBody()
    this.physics.add.overlap(player, upskill, collectSkill, null, this)

    // REACT
    react = this.physics.add.staticGroup()
    react.create(550, 600, 'react').setScale(0.05).refreshBody()
    react.create(850, 600, 'react').setScale(0.05).refreshBody()
    this.physics.add.overlap(player, react, collectScore, null, this)

    // TRELLO
    check = this.physics.add.staticGroup()
    react.create(100, 180, 'check').setScale(0.08).refreshBody()
    check.create(2500, 530, 'check').setScale(0.08).refreshBody()
    this.physics.add.overlap(player, check, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)
    check = this.physics.add.staticGroup()
    check.create(1400, 600, 'check').setScale(0.08).refreshBody()
    this.physics.add.overlap(player, check, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)

    // PLAYER CAMERA MECHANICS
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)

    // TEXTS
    scoreText = this.add
      .text(16, 16, 'Score: ' + currentSceneScore, {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '20px',
        fill: 'white'
      })
      .setScrollFactor(0)
    checkText = this.add
      .text(width - 300, 16, 'Trello: 0 / ' + checksToPass, {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '20px',
        fill: 'white'
      })
      .setScrollFactor(0)
    noQuestion = this.add.text(spot.x - 250, spot.y + 100, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '12px',
      fill: 'white'
    })

    // FRONT IMAGES - TREES
    this.add.image(1400, 400, 'near-trees').setScale(5).setScrollFactor(1.5)
    this.add.image(2500, 400, 'near-trees').setScale(5).setScrollFactor(1.5)
    this.add.image(4000, 400, 'near-trees').setScale(5).setScrollFactor(1.5)

    // COLLIDERS
    this.physics.add.collider([floor, bump], [player, react, tutor, trigger])
    this.physics.add.collider(player, [platforms, wall, bump])
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

    // GRAVITY BOOST
    if (gravityBoost) {
      player.body.setGravityY(100)
    }

    // CHANGE SCENE
    if (duskSceneComplete) {
      this.scene.start('question-four', { currentSceneScore, lives })
    }
  }

  loseHp = () => {
    health = health + 4
    if (health === 4) {
      this.death()
    }
  }

  death = () => {
    lives = lives - 1
    isAlive = false
    checkAmount = 0
    setTimeout(() => {
      player.disableBody(true, true)
      healthBar.disableBody(true, true)
    }, 100)
    setTimeout(() => {
      if (lives > 0) {
        health = 0
        life[lives].destroy()
        this.scene.restart({ currentSceneScore: startingScore, lives })
      } else if (lives === 0) {
        gameOver({ isAlive, wonGame, currentSceneScore, level: 'Dusk' })
      }
    }, 2000)
}
}

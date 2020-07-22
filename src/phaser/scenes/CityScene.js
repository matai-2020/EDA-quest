import Phaser from 'phaser'
import { scoreChanged } from '../score'

/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */

let currentSceneScore = 0
let checkAmount = 0
let check
let checkText
const checksToPass = 4
const collectScore = (player, type) => {
  if (type.texture.key === 'react') {
    type.disableBody(true, true)
    currentSceneScore += 10
    scoreChanged(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
  } else {
    type.disableBody(true, true)
    currentSceneScore += 20
    checkAmount += 1
    scoreChanged(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
    checkText.setText('Trello: ' + checkAmount + ' / ' + checksToPass)
    if (checkAmount === checksToPass) {
      canAsk = true
    }
  }
}

let canAsk = false
let noQuestion

const askQuestion = () => {
  if (canAsk) {
    noQuestion.setText('Congrats, you have \n\ncompleted your trello card!')
    setTimeout(() => {
      cityLevelComplete = true
    }, 2000)
  } else {
    noQuestion.setText('Please come back with \n\na complete trello card')
  }
}

let facing = ''
let react
let tutor
let player
let floor
let wall
let trigger
let bombCreate
let bomb
let bombInterval
let scoreText
const bombTimer = 1200
let platforms
let secondPlatforms

let cityLevelComplete = false

const worldWidth = 1600

export default class CityScene extends Phaser.Scene {
  constructor () {
    super('city-scene')
  }

  preload () {
    // invis walls/triggers
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')
    // tutor
    this.load.image('don', '/assets/man/don.png')
    // city assets
    this.load.image('bomb', '/assets/blocksTriggers/triggerBlockC.png')
    this.load.image('react', '/assets/reactCoinP.png')
    this.load.image('street', '/assets/City/street.png')
    this.load.image('near-buildings', '/assets/City/near-buildings.png')
    this.load.image('far-buildings', '/assets/City/far-buildings.png')
    // assets
    this.load.image('react', '/assets/react.svg')
    this.load.image('check', '/assets/check.png')
    this.load.image('platform', '/assets/Jungle/platform.png')
    this.load.image('platformMed', '/assets/Jungle/platformMed1.png')
    this.load.image('platformSml', '/assets/Jungle/platformSml1.png')
    this.load.image('outline', '/assets/Jungle/outline.png')
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Jungle/ground.png')
    this.load.image('arrow-keys', '/assets/Jungle/arrow-keys.png')
    this.load.image(
      'platform',
      '/assets/airpack/PNG/Environment/ground_grass.png'
    )

    // player assets
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
    // currentSceneScore = prevLevel.currentSceneScore
    // lives = prevLevel.lives
    this.input.keyboard.on('keydown-' + 'LEFT', function (event) {
      facing = 'left'
    })
    this.input.keyboard.on('keydown-' + 'RIGHT', function (event) {
      facing = 'right'
    })

    const width = this.scale.width
    const height = this.scale.height

    this.add.image(worldWidth / 2, height / 2, 'far-buildings').setDisplaySize(worldWidth, height)
    this.add.image(420, 500, 'near-buildings').setScale(2)
    this.add.image(600, 475, 'street').setScale(3.5)
    this.add.image(1830, 475, 'street').setScale(3.5)

    // Collider floor

    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    floor = this.physics.add.staticGroup()
    floor.create(2010, 770, 'base').setScrollFactor(0)

    // Platforms

    this.add.image(400, 375, 'outline').setScale(0.4)
    this.add.image(100, 270, 'outline').setScale(0.4)

    platforms = this.physics.add.staticGroup()
    platforms.create(900, 680, 'platform').setScale(0.4).refreshBody()
    platforms.create(950, 570, 'platformMed').setScale(0.4).refreshBody()
    platforms.create(620, 480, 'platformSml').setScale(0.4).refreshBody()
    platforms.create(620, 375, 'platformSml').setScale(0.4).refreshBody()
    platforms.create(950, 280, 'platformMed').setScale(0.4).refreshBody()
    platforms.create(1300, 200, 'platformSml').setScale(0.4).refreshBody()

    secondPlatforms = this.physics.add.staticGroup()
    secondPlatforms.create(1300, 680, 'platformSml').setScale(0.4).refreshBody()
    secondPlatforms.create(1000, 570, 'platformSml').setScale(0.4).refreshBody()
    secondPlatforms.create(700, 480, 'platformSml').setScale(0.4).refreshBody()
    secondPlatforms.create(400, 375, 'platformSml').setScale(0.4).refreshBody()
    secondPlatforms.create(100, 270, 'platformSml').setScale(0.4).refreshBody()

    secondPlatforms.children.entries.forEach(platform => {
      platform.disableBody(true, true)
    })

    platforms.children.entries.forEach(platform => {
      platform.body.checkCollision.left = false
      platform.body.checkCollision.right = false
      platform.body.checkCollision.down = false
    })
    secondPlatforms.children.entries.forEach(platform => {
      platform.body.checkCollision.left = false
      platform.body.checkCollision.right = false
      platform.body.checkCollision.down = false
    })

    // Character sprites

    // Tutor
    const tutorAxisX = 1500
    const tutorAxisY = 690

    tutor = this.physics.add.sprite(tutorAxisX, tutorAxisY, 'don')

    // Tutor trigger

    trigger = this.physics.add.sprite(tutorAxisX, tutorAxisY, 'triggerBlock')

    // Player sprite

    player = this.physics.add.sprite(100, 670, 'idleRight')
    player.body.setGravityY(80)
    player.setCollideWorldBounds(false)
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
      frames: this.anims.generateFrameNumbers('idleRight', { start: 0, end: 11 }),
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

    // Bombs
    bombCreate = (x) => {
      bomb = this.physics.add.image(x, -50, 'bomb')
      this.physics.add.overlap(player, bomb, this.death, null, this)
    }
    bombInterval = setInterval(function () {
      const randomNum = Math.floor(Math.random() * 1340)
      bombCreate(randomNum)
    }, bombTimer)

    // coin and collection

    react = this.physics.add.staticGroup()
    react.create(950, 615, 'react').setScale(0.05).refreshBody()
    react.create(950, 505, 'react').setScale(0.05).refreshBody()
    react.create(950, 405, 'react').setScale(0.05).refreshBody()
    react.create(620, 300, 'react').setScale(0.05).refreshBody()
    react.create(620, 300, 'react').setScale(0.05).refreshBody()
    react.create(890, 200, 'react').setScale(0.05).refreshBody()
    react.create(1000, 200, 'react').setScale(0.05).refreshBody()

    check = this.physics.add.staticGroup()
    check.create(800, 615, 'check').setScale(0.08).refreshBody()
    check.create(620, 150, 'check').setScale(0.08).refreshBody()
    check.create(1300, 100, 'check').setScale(0.08).refreshBody()
    check.create(100, 100, 'check').setScale(0.08).refreshBody()

    this.physics.add.overlap(player, react, collectScore, null, this)
    this.physics.add.overlap(player, check, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)

    // camera follow
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)

    // text
    scoreText = this.add
      .text(16, 16, 'Score: 0', {
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
    noQuestion = this.add.text(tutorAxisX - 250, tutorAxisY - 65, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '14px',
      fill: 'white'
    })

    // colliders
    this.physics.add.collider(floor, [player, react, tutor, trigger])
    this.physics.add.collider(react, [platforms])
    this.physics.add.collider(player, [platforms, wall, floor, secondPlatforms])
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
      player.setVelocityY(-340)
      if (facing === 'left') {
        player.anims.play('jumpLeft', true)
      } else player.anims.play('jumpRight', true)
    }
    if (checkAmount === 3) {
      platforms.children.entries.forEach(platform => {
        platform.disableBody(true, true)
      })
      for (let x = 0; x < platformsLocal.length; x++) {
        secondPlatforms.children.entries[x].enableBody(false, platformsLocal[x].x, platformsLocal[x].y, true, true)
      }
    }
    if (cityLevelComplete) {
      clearInterval(bombInterval)
      this.scene.start('victory-scene', currentSceneScore)
    }
  }

  death = (player, type) => {
    console.log('ded')
    // player.disableBody(true, true)
  }
}
const platformsLocal = [
  { x: 1300, y: 680 },
  { x: 1000, y: 570 },
  { x: 700, y: 480 },
  { x: 400, y: 375 },
  { x: 100, y: 270 }
]

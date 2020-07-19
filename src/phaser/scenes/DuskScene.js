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

let scoreDusk = 0
let scoreText

let checkText
let checkAmount = 0
const checksToPass = 1

const collectScore = (player, type) => {
  if (type.texture.key === 'react') {
    type.disableBody(true, true)
    scoreDusk += 10
    scoreText.setText('Score: ' + scoreDusk)
  } else {
    type.disableBody(true, true)
    scoreDusk += 20
    checkAmount += 1
    scoreText.setText('Score: ' + scoreDusk)
    checkText.setText('Trello: ' + checkAmount + ' / ' + checksToPass)
    if (checkAmount === checksToPass) {
      canAsk = true
    }
  }
}

let canAsk = false
let noQuestion
let duskLevelComplete = false

const askQuestion = () => {
  if (canAsk) {
    noQuestion.setText('Congrats, you have completed your trello card!')
    setTimeout(() => {
      duskLevelComplete = true
    }, 1000)
  } else {
    noQuestion.setText('Please come back with a complete trello card')
  }
}

let facing = ''
let react
let tutor
let player
let floor
let wall
let trigger

const worldWidth = 3000

export default class TutLevel extends Phaser.Scene {
  constructor () {
    super('dusk-scene')
  }

  preload () {
    // invis walls/triggers
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')

    // dusk assets
    this.load.image('react', '/assets/react.svg')
    this.load.image('background', '/assets/Dusk/dusk-bg.png')
    this.load.image('far-mount', '/assets/Dusk/dusk-far-mount.png')
    this.load.image('near-mount', '/assets/Dusk/dusk-near-mount.png')
    this.load.image('far-trees', '/assets/Dusk/dusk-far-trees.png')
    this.load.image('near-trees', '/assets/Dusk/dusk-near-trees.png')
    // assets
    this.load.image('react', '/assets/react.svg')
    this.load.image('platform', '/assets/Dusk/platform.png')
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Dusk/duskGround.png')
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
    this.load.spritesheet('idleRight', '/assets/man/idleRight.png', {
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
    const height = this.scale.height
    const totalWidth = width * 10

    this.add
      .image(width * 0.5, height * 0.5, 'background')
      .setScale(5)
      .setScrollFactor(0)
    this.add.image(800, 300, 'far-mount').setScale(4).setScrollFactor(0)
    this.add.image(700, 400, 'near-mount').setScale(3).setScrollFactor(0.05)
    this.add.image(800, 300, 'far-trees').setScale(4.5).setScrollFactor(0.4)
    this.add.image(1200, 230, 'near-trees').setScale(5).setScrollFactor(0.7)

    // createAligned(this, totalWidth, 'mountain', 0.15)
    // createAligned(this, totalWidth, 'plateau', 0.5)
    createAligned(this, totalWidth, 'ground', 1)
    // createAligned(this, totalWidth, 'plants', 1.25)
    // this.add.image(width * 0.5, height * 1, 'platform').setScrollFactor(0)

    // Collider floor

    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    floor = this.physics.add.staticGroup()
    floor.create(2010, 648, 'base').setScrollFactor(0)

    // Platforms

    const platforms = this.physics.add.staticGroup()
    platforms.create(500, 510, 'platform').setScale(0.4).refreshBody()
    platforms.create(600, 600, 'platform').setScale(0.4).refreshBody()

    platforms.children.entries.forEach(platform => {
      platform.body.checkCollision.left = false
      platform.body.checkCollision.right = false
      platform.body.checkCollision.down = false
    })

    // let platform3 = this.physics.add.staticGroup()
    // platform3.create(800, 450, 'platform').setScale(0.4).refreshBody()

    // Character sprites

    // Tutor
    const tutorAxisX = 2900
    const tutorAxisY = 535

    tutor = this.physics.add.sprite(tutorAxisX, tutorAxisY, 'idleLeft')
    tutor.setScale(3)

    // Tutor trigger

    const spot = tutor.body.position

    trigger = this.physics.add.sprite(spot.x, spot.y, 'triggerBlock')

    // Player sprite

    player = this.physics.add.sprite(100, 500, 'idlRight')
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
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '20px',
        fill: '#000'
      })
      .setScrollFactor(0)

    checkText = this.add
      .text(width - 200, 16, 'Trello: 0', {
        fontSize: '32px',
        fill: '#000'
      })
      .setScrollFactor(0)

    noQuestion = this.add.text(tutorAxisX - 480, tutorAxisY - 250, '', {
      fontSize: '18px',
      fill: '#000'
    })

    this.add.image(1500, 400, 'near-trees').setScale(5.5).setScrollFactor(2.5)
    this.add.image(3500, 400, 'near-trees').setScale(5.5).setScrollFactor(2.5)
    this.add.image(5000, 400, 'near-trees').setScale(5.5).setScrollFactor(2.5)

    // colliders
    this.physics.add.collider([floor], [player, react, tutor, trigger])
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
    if (duskLevelComplete) {
      this.scene.start('jump-scene', scoreDusk)
    }
  }
}

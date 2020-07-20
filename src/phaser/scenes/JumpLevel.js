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

const wonGame = false
let lives = 4
const life = []
let tornado
let health = 0
let isAlive = true
let explode
let healthBar
let right = true
let jumpUp = false
let tornadoHit = false

let scoreText
let canAsk = false
let noQuestion
let jumpSceneComplete = false
let facing = ''
let react
let check
let tutor
let player
let platforms
let floor
let wall
let enemyWall
let trigger
let ent
let game
const worldWidth = 2000

const airUp = () => {
  if (!jumpUp) {
    jumpUp = true
    tornadoHit = true
  }
}

const airDown = () => {
  jumpUp = false
}

const bounce = () => {
  airUp()
  setTimeout(airDown, 500)
  setTimeout(() => {
    tornadoHit = false
  }, 2500)
}

let checkText
let checkAmount = 0
const checksToPass = 2
let currentSceneScore

const collectScore = (player, type) => {
  if (type.texture.key === 'react') {
    type.disableBody(true, true)
    currentSceneScore += 10
    scoreChanged(currentSceneScore)
    console.log(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
  } else {
    type.disableBody(true, true)
    currentSceneScore += 20
    checkAmount += 1
    scoreChanged(currentSceneScore)
    console.log(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
    checkText.setText('Trello: ' + checkAmount + ' / ' + checksToPass)
    if (checkAmount === checksToPass) {
      canAsk = true
    }
  }
}

// const explosion = () => {

// }

const askQuestion = () => {
  if (canAsk) {
    noQuestion.setText('Congrats, you have completed your trello card!')
    setTimeout(() => {
      jumpSceneComplete = true
    }, 2000)
  } else {
    noQuestion.setText('Please come back with a complete trello card')
  }
}

export default class JumpLevel extends Phaser.Scene {
  constructor () {
    super('jump-scene')
  }

  preload () {
    // invis walls/triggers
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')
    this.load.image('wallBlockEnemy', '/assets/blocksTriggers/wallBlock.png')

    // tutor
    this.load.image('lane', '/assets/man/lane.png')
    // assets
    this.load.image('reactText', '/assets/coinsText.png')
    this.load.image('checkText', '/assets/checkText.png')
    this.load.image('check', '/assets/check.png')
    this.load.image('react', '/assets/reactCoinP.png')
    this.load.image('platform', '/assets/Jungle/platform.png')
    this.load.image('bump', '/assets/Jungle/bump.png')
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Jungle/ground.png')
    this.load.image('arrow-keys', '/assets/left-right-keys.png')
    this.load.image('up-key', '/assets/up-key.png')
    this.load.image('lives', '/assets/Game/lives-icon.png')
    this.load.image('tutor', '/assets/man/lane.png')
    this.load.image(
      'platform',
      '/assets/airpack/PNG/Environment/ground_grass.png'
    )
    this.load.image('plants', '/assets/Jungle/plant.png')
    this.load.image('information', '/assets/PNG/tornado_text.png')

    // Tornado load
    this.load.spritesheet('tornado', '/assets/PNG/tornado.png', {
      frameWidth: 28.8333,
      frameHeight: 42
    })

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
    this.load.spritesheet('heart', '/assets/Game/Hearts/PNG/animated/border/heart_animated_2.png', {
      frameHeight: 17,
      frameWidth: 17
    })
    this.load.spritesheet('explode', '/assets/Game/explosion.png', {
      frameWidth: 125.4,
      frameHeight: 107
    })

    // ent enemy assets
    this.load.spritesheet('walkRight', '/assets/PNG/ent/walk-right.png', {
      frameWidth: 99,
      frameHeight: 103
    })
    this.load.spritesheet('walkLeft', '/assets/PNG/ent/walk-left.png', {
      frameWidth: 99,
      frameHeight: 103
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

    this.add.image(width * 0.5, height * 0.5, 'sky').setScrollFactor(0).setScale(2)

    createAligned(this, totalWidth, 'mountain', 0.15)
    createAligned(this, totalWidth, 'plateau', 0.5)
    createAligned(this, totalWidth, 'ground', 1)
    createAligned(this, totalWidth, 'plants', 1.25)
    // this.add.image(width * 0.5, height * 1, 'platform').setScrollFactor(0)

    // Collider floor & platforms

    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')

    enemyWall = this.physics.add.staticGroup()
    enemyWall.create(1500, 400, 'wallBlockEnemy')
    enemyWall.create(500, 400, 'wallBlockEnemy')

    floor = this.physics.add.staticGroup()
    floor.create(2010, 648, 'base').setScrollFactor(0)

    // platforms = this.physics.add.staticGroup()
    // platforms.create(800, 500, 'platform').setScale(0.4).refreshBody()

    // platforms.children.entries.forEach(platform => {
    //   ;(platform.body.checkCollision.left = false),
    //     (platform.body.checkCollision.right = false),
    //     (platform.body.checkCollision.down = false)
    // })
    // background images
    this.add.image(250, 275, 'information').setScale(0.4)
    // Character sprites

    // Tutor
    tutor = this.physics.add.staticImage(1700, 588, 'lane').setScale(0.3).refreshBody()

    // Tutor trigger

    const spot = tutor.body.position

    trigger = this.physics.add.sprite(spot.x, spot.y, 'triggerBlock')

    // Player sprite

    player = this.physics.add.sprite(100, 580, 'idleRight')
    player.body.setGravityY(30)
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
    // Amount of Lives display
    for (let i = 1; i < lives; i++) {
      let x = 400
      x = x + (i * 80)
      life[i] = this.add.image(x, 30, 'lives').setScale(0.5).setScrollFactor(0)
    }
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

    // Explosion animation

    // Enemy Sprites
    ent = this.physics.add.sprite(800, 400, 'walkRight')
    ent.setScale(3)
    ent.body.setGravityY(80)
    // ent.setCollideWorldBounds(true)
    ent.onWorldBounds = true
    ent.body.checkCollision.up = true
    ent.body.checkCollision.left = true
    ent.body.checkCollision.right = true
    // this.physics.add.overlap(ent, player, bounce, null, this)
    this.physics.add.overlap(ent, player, this.loseHp, null, this)

    this.anims.create({
      key: 'entLeft',
      frames: this.anims.generateFrameNumbers('walkLeft', {
        start: 0,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'entRight',
      frames: this.anims.generateFrameNumbers('walkRight', {
        start: 0,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    })
    // Interactive Sprites

    // Tornado create

    tornado = this.physics.add.sprite(40, 200, 'tornado')
    tornado.setScale(2.5)
    tornado.setImmovable = true
    tornado.onWorldBounds = true
    tornado.body.checkCollision.up = true
    tornado.body.checkCollision.left = true
    tornado.body.checkCollision.right = true
    tornado.body.checkCollision.down = true
    // whirlwind
    this.anims.create({
      key: 'whirl',
      frames: this.anims.generateFrameNumbers('tornado', {
        start: 6,
        end: 0
      }),
      frameRate: 10,
      repeat: -1
    })

    this.physics.add.overlap(player, tornado, bounce, null, this)
    // this.physics.add.overlap(spring, player, bounce, null, this)
    // console.log(spring)

    // coin and collection

    react = this.physics.add.staticGroup()
    react.create(360, 600, 'react').setScale(0.05).refreshBody()
    react.create(536, 150, 'react').setScale(0.05).refreshBody()
    react.create(536, 200, 'react').setScale(0.05).refreshBody()
    react.create(536, 250, 'react').setScale(0.05).refreshBody()
    react.create(536, 300, 'react').setScale(0.05).refreshBody()
    react.create(536, 350, 'react').setScale(0.05).refreshBody()
    react.create(536, 400, 'react').setScale(0.05).refreshBody()
    react.create(536, 450, 'react').setScale(0.05).refreshBody()
    // react.create(395, 342, 'react').setScale(0.05).refreshBody()
    react.create(1000, 550, 'react').setScale(0.05).refreshBody()
    react.create(1200, 550, 'react').setScale(0.05).refreshBody()
    react.create(1400, 550, 'react').setScale(0.05).refreshBody()

    react.create(1800, -100, 'react').setScale(0.05).refreshBody()
    react.create(1600, 0, 'react').setScale(0.05).refreshBody()
    react.create(1600, 100, 'react').setScale(0.05).refreshBody()
    react.create(1600, 200, 'react').setScale(0.05).refreshBody()
    react.create(1600, 300, 'react').setScale(0.05).refreshBody()
    react.create(1600, 400, 'react').setScale(0.05).refreshBody()

    this.physics.add.overlap(player, react, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)

    check = this.physics.add.staticGroup()
    check.create(1400, 550, 'check').setScale(0.08).refreshBody()
    check.create(800, 550, 'check').setScale(0.08).refreshBody()

    this.physics.add.overlap(player, check, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)

    // camera follow
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)

    // text
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

    noQuestion = this.add.text(spot.x - 250, spot.y - 10, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '12px',
      fill: 'white'
    })

    // colliders
    this.physics.add.collider(floor, [player, ent, react, tutor, trigger, tornado])
    this.physics.add.collider(player, [platforms, ent, wall, tornado, player])
    this.physics.add.collider(ent, [platforms, ent, enemyWall, wall])
    this.physics.add.collider(tornado, [platforms, enemyWall, wall, tornado])
  }

  update () {
    const gps = player.body.position

    const cam = this.cameras.main
    const speed = 15

    // Player
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
    // console.log('y', gps.y, 'x', gps.x)
    // Tornado
    if (jumpUp) {
      player.setVelocityY(-500)
      if (facing === 'left') {
        player.anims.play('jumpLeft', true)
      } else player.anims.play('jumpRight', true)
    }
    if (tornado) {
      tornado.anims.play('whirl', true)
      tornado.setVelocityX(100)
    }

    if (tornado.body.y > 1600) {
      tornado.setY(500)
      tornado.setX(40)
    }
    // next level
    if (jumpSceneComplete) {
      this.scene.start('question-two', currentSceneScore)
    }
    // enemy ENT
    if (ent.body.touching.right || ent.body.blocked.right) {
      right = false 
      ent.body.velocity.x = -100
      ent.anims.play('entLeft', true)
    }

    if (ent.body.touching.left || ent.body.blocked.left || right) {
      ent.body.velocity.x = 100
      ent.anims.play('entRight', true)
    }
    // HEALTHBAR ABOVE PLAYER

    healthBar.body.position.x = player.body.position.x + 15
    healthBar.body.position.y = player.body.position.y - 40
  }

      loseHp = () => {
        health = health + 1
        healthBar.anims.play(`health${health}`, true)
        if (health === 4) {
          this.death()
        }
      }

    // DEATH
    death = () => {
      lives = lives - 1
      isAlive = false
      right = true
      checkAmount = 0
      setTimeout(() => {
        player.disableBody(true, true)
        healthBar.disableBody(true, true)
      }, 100)
      setTimeout(() => {
        if (lives > 0) {
          health = 0
          life[lives].destroy()
          this.scene.restart()
        } else if (lives === 0) {
          gameOver({ isAlive, wonGame, currentSceneScore })
        }
      }, 2000)
    }
}

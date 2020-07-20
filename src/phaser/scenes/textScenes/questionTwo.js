import Phaser from 'phaser'

let qCorrect = false
let currentSceneScore = 0

export default class questionTwo extends Phaser.Scene {
  constructor () {
    super('question-two')
  }

  preload () {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    })
    this.load.script('rexdialogquest', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdialogquest.min.js')
  }

  create (prevScore) {
    currentSceneScore = prevScore
    const print = this.add.text(0, 0, '')

    const dialog = CreateDialog(this)
      .layout()
    dialog.clearChoices = function () {
      dialog.forEachChoice(function (choice) {
        choice.getElement('background').setStrokeStyle()
      })
      return dialog
    }

    const quest = new rexdialogquest({
      dialog: dialog,
      questions: Questions
    })
      .on('update-choice', function (choice, option, quest) {
        choice
          .setText(option.key)
          .setData('option', option)
      })
      .on('update-dialog', function (dialog, question, quest) {
        dialog.getElement('title').setText(`${tutor} asks:`)
        dialog.getElement('actions')[0].setText((question.end) ? 'End' : 'Next')
        quest.setData('nextKey', null)
        dialog
          .clearChoices()
          .layout()

        if (question.end) {
          print.text += ' (End)\n'
        }
      })
      .on('click-choice', function (choice, dialog, quest) {
        dialog.clearChoices()
        choice.getElement('background').setStrokeStyle(1, 0xffffff)
        quest.setData('option', choice.getData('option'))
      })
      .on('click-action', function (action, dialog, quest) {
        if (action.text === 'Next') {
          const option = quest.getData('option')
          const nextKey = option.next
          const optionKey = option.key
          // print.text += ` --> |${optionKey}| ${nextKey}\n`;

          if (nextKey === true) {
            dialog.getElement('title').setText('Correct! +50 points')
            currentSceneScore += 50
            setTimeout(() => {
              qCorrect = true
            }, 1500)
          } else {
            dialog.getElement('title').setText('Try again, -20 points :(')
            currentSceneScore -= 20
            setTimeout(() => {
              qCorrect = 'again'
            }, 1500)
          }
        }
      })
      .start()
  }

  update () {
    if (qCorrect === true) {
      this.scene.start('dusk-scene', currentSceneScore)
    } else if (qCorrect === 'again') {
      qCorrect = false
      this.scene.start('question-two', currentSceneScore)
    }
  }
}

const COLOR_PRIMARY = 0x4e3b18
const COLOR_LIGHT = 0x2f3906
const COLOR_DARK = 0x260e04

var CreateDialog = function (scene) {
  return scene.rexUI.add.dialog({
    x: scene.cameras.main.width / 2,
    y: scene.cameras.main.height / 2,
    width: 360,

    background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, COLOR_PRIMARY),

    title: CreateTitle(scene, ' ', COLOR_DARK),

    content: scene.add.text(0, 0, sceneQuestion, {
      fontSize: '24px',
      color: '#e9f459'
    }),

    choices: [
      CreateButton(scene, ' ', COLOR_LIGHT),
      CreateButton(scene, ' ', COLOR_LIGHT),
      CreateButton(scene, ' ', COLOR_LIGHT),
      CreateButton(scene, ' ', COLOR_LIGHT),
      CreateButton(scene, ' ', COLOR_LIGHT)
    ], // Support 5 choices

    actions: [
      CreateButton(scene, 'Next', COLOR_DARK)
    ],

    space: {
      title: 25,
      content: 25,
      choices: 20,
      choice: 15,
      action: 15,

      left: 25,
      right: 25,
      top: 25,
      bottom: 25
    },

    expand: {
      content: false // Content is a pure text object
    }
  })
}

var CreateTitle = function (scene, text, backgroundColor) {
  return scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, backgroundColor),
    text: scene.add.text(0, 0, '', {
      fontSize: '24px'
    }),
    space: {
      left: 15,
      right: 15,
      top: 10,
      bottom: 10
    }
  })
}

var CreateButton = function (scene, text, backgroundColor) {
  return scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, backgroundColor),

    text: scene.add.text(0, 0, 'Next', {
      fontSize: '24px'
    }),

    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  })
}

/*
A --> |Z| B
A --> |X| C
B --> |Z| D
B --> |X| E
C --> |Z| F
C --> |X| G
D --> |Z| H
D --> |X| I
E --> |Z| J
E --> |X| K
F --> |Z| L
F --> |X| M
*/

const sceneQuestion = 'How cool is Louis?'
const tutor = 'Lane'

const Questions = `type,key,next,end
q,Question,,
,Not at all,false,
,Just a little bit,false,
,EXTREMELY,true`

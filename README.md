## EDA Quest

A simple side scrolling platform game built with phaser.

https://eda-quest.netlify.app/

Built by Isaac Bell, Jake Hurley, Keenen Leyson and Louis Fowler

## Create level

1. Create .js file in src/phaser, name it something unique (your name and level would be great)
2. Copy staring code form boilerplate.js
3. Head to src/index.js and import your level (import { youLevelNameHere } from './phaser/scene')
4. In the config object change the scene key value to your level name

## Available Commands

| Command         | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `npm install`   | Install project dependencies                                                    |
| `npm start`     | Build project and open web server running project                               |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |
| `npm run lint` | Run eslint config to find linting errors|
| `npm run format` | Formats all .js and .jsx files based on eslint config|
| `npm test` | Run all jest tests |



## Customizing Template

### Babel

You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

```
"browsers": [
  ">0.25%",
  "not ie 11",
  "not op_mini all"
]
```

## Deploying Code

After you run the `npm run build` command, your code will be built into a single bundle located at
`dist/bundle.min.js` along with any other assets you project depended.

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`),
you should be able to open `http://mycoolserver.com/index.html` and play your game.

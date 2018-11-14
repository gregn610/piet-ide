import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Controls from './controls.js';
import Grid from './grid.js';
import { DebugTab } from './debugTab.js';
import Debugger from './debugger.js';

import interpret from './interpreter.js';

import { commands } from './orderedCommands.js';
import { colours, WHITE, BLACK } from './colours.js';

const HEIGHT = 10, // initial height
  WIDTH = 10; // initial width

const appState = {
  listeners: [],

  height: HEIGHT,
  width: WIDTH,
  cellDim: Math.min(30, (window.innerWidth - 40) / WIDTH), ///// NEEDS RESIZING - ALSO MAKE SURE CELLS ARE SQUARE

  grid: Array(HEIGHT)
    .fill(0)
    .map(_ => Array(WIDTH).fill(WHITE)), // fill grid with white initially

  blocks: Array(HEIGHT)
    .fill(0)
    .map(_ => Array(WIDTH).fill(0)),

  blockSizes: Array(HEIGHT)
    .fill(0)
    .map(_ => Array(WIDTH).fill(HEIGHT * WIDTH)),

  selectedColour: 0,

  commands: commands[0],

  paintMode: 'BRUSH', // BRUSH, BUCKET, or BP; use brush paint mode initially

  cellInFocus: null,
  displayBS: false, // initially do not show block sizes

  paintDragging: false, // is paint dragging?

  // add listener
  subscribe: (listener => appState.listeners.push(listener)).bind(this),
  // notify listeners
  notify: (() => appState.listeners.forEach(listener => listener())).bind(this),

  resize: (({ height, width, clear }) => {
    appState.height = height;
    appState.width = width;

    const previous_grid = appState.grid;
    const old_height = previous_grid.length;
    const old_width = previous_grid[0].length;
    // console.log(previous_grid);

    appState.grid = Array(height)
      .fill(0)
      .map(_ => Array(width).fill(WHITE));

    if (!clear) {
      for (let i = 0; i < Math.min(height, old_height); i++) {
        for (let j = 0; j < Math.min(width, old_width); j++) {
          appState.grid[i][j] = previous_grid[i][j];
        }
      }
    }

    appState.blockSizes = Array(height)
      .fill(0)
      .map(_ => Array(width).fill(height * width));

    appState.blocks = Array(height)
      .fill(0)
      .map(_ => Array(width).fill(0));

    appState.notify();
  }).bind(this),

  selectColour: (colour => {
    appState.selectedColour = colour;

    // reorder commands
    if (colour == WHITE || colour == BLACK) {
      // colour is white or black
      appState.commands = [];
    } else {
      appState.commands = commands[colour];
    }

    appState.notify();
  }).bind(this),

  // select paint mode (BRUSH, BUCKET, BP)
  selectPaintMode: (mode => {
    appState.paintMode = mode;
    appState.notify();
  }).bind(this),

  // delegate this cell click to the appropriate function, depending on the paint mode
  handleCellClick: ((row, col) => {
    switch (appState.paintMode) {
      case 'BRUSH':
        appState.brushPaint(row, col);
        break;
      case 'BUCKET':
        appState.bucketPaint(row, col);
        break;
      case 'BP':
        appState.debug.toggleBP(row, col);
        break;
    }
  }).bind(this),

  // paint this cell the currently-selected colour
  brushPaint: ((row, col) => {
    appState.grid[row][col] = appState.selectedColour;

    // recompute blocks and block sizes
    let blocks = appState.computeBlocks();
    appState.blocks = blocks.blockMap;
    appState.blockSizes = blocks.blockSizes;

    appState.notify();
  }).bind(this),

  // paint this block the currently-selected colour
  bucketPaint: ((row, col) => {
    if (appState.grid[row][col] != appState.selectedColour) {
      (function paintBlock(row, col, origColour) {
        appState.grid[row][col] = appState.selectedColour;

        // above
        if (row - 1 >= 0 && appState.grid[row - 1][col] == origColour) {
          paintBlock(row - 1, col, origColour);
        }
        // below
        if (
          row + 1 < appState.height &&
          appState.grid[row + 1][col] == origColour
        ) {
          paintBlock(row + 1, col, origColour);
        }
        // left
        if (col - 1 >= 0 && appState.grid[row][col - 1] == origColour) {
          paintBlock(row, col - 1, origColour);
        }
        // right
        if (
          col + 1 < appState.width &&
          appState.grid[row][col + 1] == origColour
        ) {
          paintBlock(row, col + 1, origColour);
        }
      })(row, col, appState.grid[row][col]);
    }

    // recompute blocks and block sizes
    let blocks = appState.computeBlocks();
    appState.blocks = blocks.blockMap;
    appState.blockSizes = blocks.blockSizes;

    appState.notify();
  }).bind(this),

  setCellInFocus: ((row, cell) => {
    if (row == null) {
      appState.cellInFocus = null;
    } else {
      appState.cellInFocus = [row, cell];
      if (appState.paintDragging) {
        appState.brushPaint(row, cell);
      }
    }
    appState.notify();
  }).bind(this),

  endDraggingEventHandler: (() => {
    appState.paintDragging = false;
    // console.log('release');
    window.removeEventListener('mouseup', appState.endDraggingEventHandler);
  }).bind(this),

  setMouseDown: ((row, cell) => {
    if (appState.paintMode === 'BRUSH') {
      appState.paintDragging = true;
      appState.brushPaint(row, cell);
      window.addEventListener('mouseup', appState.endDraggingEventHandler);
    }
    appState.notify();
  }).bind(this),

  // toggle block size display mode
  toggleDisplayBS: (() => {
    appState.displayBS = !appState.displayBS;

    appState.notify();
  }).bind(this),

  exportPng: (scale => {
    // create a new image
    let image = new Jimp(appState.width, appState.height);

    // map colour strings to hex values
    let colourMap = colours.map(colour => +('0x' + colour.slice(1) + 'FF'));

    // set each pixel to its corresponding colour in the grid
    image.scan(0, 0, appState.width, appState.height, (x, y) => {
      image.setPixelColour(colourMap[appState.grid[y][x]], x, y);
    });

    // scale the image
    image.resize(
      scale * appState.width,
      scale * appState.height,
      Jimp.RESIZE_NEAREST_NEIGHBOR
    );

    image.getBase64(Jimp.MIME_PNG, (_, uri) => {
      const imageData = atob(uri.split(',')[1]);
      const arraybuffer = new ArrayBuffer(imageData.length);
      let view = new Uint8Array(arraybuffer);
      for (var i = 0; i < imageData.length; i++) {
        view[i] = imageData.charCodeAt(i) & 0xff;
      }
      const blob = new Blob([arraybuffer], {
        type: 'application/octet-stream'
      });
      window.location.href = (window.webkitURL || window.URL).createObjectURL(
        blob
      );
    });
  }).bind(this),

  importImg: file => {
    let reader = new FileReader();

    // map hex values to colour indices
    let colourMap = {};
    colours.forEach(
      (colour, i) => (colourMap[+('0x' + colour.slice(1) + 'FF')] = i)
    );

    reader.onload = event => {
      Jimp.read(Buffer.from(event.target.result), function(err, img) {
        appState.height = img.bitmap.height;
        appState.width = img.bitmap.width;
        appState.cellDim = Math.min(
          30,
          (window.innerWidth - 40) / img.bitmap.width
        );

        appState.grid = Array(img.bitmap.height)
          .fill(0)
          .map(_ => Array(img.bitmap.width));

        img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y) => {
          var colour = img.getPixelColor(x, y);
          // treat non-standard colour as white
          if (colourMap[colour] == undefined) {
            appState.grid[y][x] = WHITE;
          } else {
            appState.grid[y][x] = colourMap[colour];
          }
        });

        // compute blocks and block sizes
        let blocks = appState.computeBlocks();
        appState.blocks = blocks.blockMap;
        appState.blockSizes = blocks.blockSizes;

        appState.notify();
      });
    };
    reader.readAsArrayBuffer(file);
  },

  // return the colour blocks in the current grid, with arbitrary unique labels, and the number
  // of cells in each colour block
  computeBlocks: (() => {
    let blockMap = Array(appState.height)
        .fill(0)
        .map(_ => Array(appState.width).fill(-1)),
      blockSizes = Array(appState.height)
        .fill(0)
        .map(_ => Array(appState.width));

    function labelBlock(row, col, blockColour, label) {
      // cell has not yet been examined and is part of the current block
      if (blockMap[row][col] == -1 && appState.grid[row][col] == blockColour) {
        blockMap[row][col] = label;

        return (
          1 +
          (row - 1 >= 0 && labelBlock(row - 1, col, blockColour, label)) + // left
          (row + 1 < appState.height &&
            labelBlock(row + 1, col, blockColour, label)) + // right
          (col - 1 >= 0 && labelBlock(row, col - 1, blockColour, label)) + // above
          (col + 1 < appState.width &&
            labelBlock(row, col + 1, blockColour, label)) // below
        );
      }

      return 0;
    }

    // label each cell
    let labelMap = [];
    for (var i = 0; i < appState.height; i++) {
      for (var j = 0; j < appState.width; j++) {
        // cell has not yet been labeled
        if (blockMap[i][j] == -1) {
          labelMap.push(labelBlock(i, j, appState.grid[i][j], labelMap.length));
        }
      }
    }

    // map block labels to block sizes
    for (var i = 0; i < appState.height; i++) {
      for (var j = 0; j < appState.width; j++) {
        blockSizes[i][j] = labelMap[blockMap[i][j]];
      }
    }

    return { blockMap, blockSizes };
  }).bind(this),

  // toggle debugger visibility
  toggleDebugger: (() => {
    appState.debug.debugIsVisible = !appState.debug.debugIsVisible;

    appState.notify();
  }).bind(this),

  debug: {
    debugIsVisible: true, // initially, debugger is not visible

    commandList: [],
    interpreter: null,
    runner: null, // intervalId used for automatically stepping through program
    runSpeed: 400, // delay between steps while running, in ms
    breakpoints: [],

    DP: 0, // index into [right, down, left, up], direction pointer initially points right
    CC: 0, // index into [left, right], codel chooser initially points left
    stack: [],
    output: '',

    block: null, // current block
    currCommand: null, // current command

    setRunSpeed: (speed => {
      appState.debug.runSpeed = speed;

      appState.notify();
    }).bind(this),

    selectBlock: (block => {
      appState.debug.block = block;

      appState.notify();
    }).bind(this),

    // initialize the debugger
    initDebugger: (() => {
      // reset debugger values
      appState.debug.commandList = [];
      appState.debug.DP = 0;
      appState.debug.CC = 0;
      appState.debug.stack = [];
      appState.debug.output = '';
      appState.debug.block = null;
      appState.debug.currCommand = null;
      appState.debug.interpreter = null;
      clearInterval(appState.debug.runner);
      appState.debug.runner = null;

      appState.notify();

      // create generator
      appState.debug.interpreter = interpret(
        appState.grid,
        appState.blocks,
        appState.blockSizes,
        appState.debug.getInputNum,
        appState.debug.getInputChar
      );
    }).bind(this),

    // get one input number (could be multiple characters) from "input stream"
    // (then increment pointer into stream)
    getInputNum: (() => {
      const num = window.prompt('Please enter a number', '');
      if (isNaN(num)) {
        return 0;
      }
      return parseInt(num);
    }).bind(this),

    // get one input character from "input stream" (then increment pointer into stream)
    getInputChar: (() => {
      const chars = window.prompt('Please enter a char', '');

      if (chars) {
        return chars[0];
      }
      return null;
    }).bind(this),

    // toggle the paint mode between BP and not BP
    toggleSetBP: (() => {
      if (appState.paintMode == 'BP') {
        appState.paintMode = 'BRUSH';
      } else {
        appState.paintMode = 'BP';
      }

      appState.notify();
    }).bind(this),

    // add/remove a breakpoint
    toggleBP: ((row, col) => {
      let block = appState.blocks[row][col];
      let i = appState.debug.breakpoints.indexOf(block);

      if (i == -1) {
        // add breakpoint
        appState.debug.breakpoints.push(block);
      } else {
        appState.debug.breakpoints.splice(i, 1);
      }

      appState.notify();
    }).bind(this),

    // start running program
    start: (() => {
      appState.debug.initDebugger();
      appState.debug.cont(); // "continue" from the starting point
    }).bind(this),

    // step through program
    step: (() => {
      // if generator does not already exist (i.e. we have not already started stepping
      // through program), initialize debugger
      if (!appState.debug.interpreter) {
        appState.debug.initDebugger();
      }

      // get next step from generator
      let step = appState.debug.interpreter.next();
      if (!step.done) {
        // update state of debugger based on result of current step
        for (var prop in step.value) {
          appState.debug[prop] = step.value[prop];
        }
        appState.notify();
      } else {
        appState.debug.interpreter = null; // finished running so clear interpreter
        appState.notify();
      }
    }).bind(this),

    // continue running after stepping through the program (run the rest of the program
    // starting from the current step)
    // if we were not already running/stepping through the program, this function does nothing
    cont: (() => {
      // update state of debugger
      function updateDebugger() {
        let step;
        // if the generator has been cleared or is finished, clear the timer
        if (!appState.debug.interpreter) {
          clearInterval(appState.debug.runner);
          appState.debug.runner = null;
        } else if ((step = appState.debug.interpreter.next()).done) {
          // if the generator is finished, clear the interpreter
          clearInterval(appState.debug.runner);
          appState.debug.interpreter = null;
          appState.debug.runner = null;
          appState.notify();
        } else {
          for (var prop in step.value) {
            appState.debug[prop] = step.value[prop];
          }
          appState.notify();

          // stop running if breakpoint reached
          if (appState.debug.breakpoints.includes(step.value.block)) {
            clearInterval(appState.debug.runner);
          }
        }
      }

      // call generator and update state of debugger at interval
      clearTimeout(appState.debug.runner);
      appState.debug.runner = window.setInterval(
        updateDebugger,
        appState.debug.runSpeed
      );
    }).bind(this),

    // stop interpreting
    stop: (() => {
      // if we are running, this will cause the timer to be cleared
      appState.debug.interpreter = null;
      appState.debug.block = null;
      appState.debug.currCommand = null;
      clearInterval(appState.debug.runner);
      appState.debug.runner = null;
      appState.notify();
    }).bind(this),

    // pause running
    pause: (() => {
      clearInterval(appState.debug.runner);
      appState.debug.runner = null;
      appState.notify();
    }).bind(this)
  }
};

class App extends React.Component {
  componentDidMount() {
    this.props.appState.subscribe(this.forceUpdate.bind(this, null));
    window.addEventListener('keypress', e => {
      const { appState } = this.props;
      if (e.key === 'p') {
        appState.selectPaintMode('BRUSH');
      } else if (e.key === 'b') {
        appState.selectPaintMode('BUCKET');
      } else if (e.key === 's') {
        appState.toggleDisplayBS();
      } else if (e.keyCode === 61 || e.keyCode === 43) {
        const newSpeed = Math.max(200, appState.debug.runSpeed - 200);
        appState.debug.setRunSpeed(newSpeed);
        appState.debug.pause();
        appState.debug.cont();
      } else if (e.keyCode === 45 || e.keyCode === 95) {
        const newSpeed = Math.min(2000, appState.debug.runSpeed + 200);
        appState.debug.setRunSpeed(newSpeed);
        appState.debug.pause();
        appState.debug.cont();
      } else if (e.altKey && e.charCode === 160) {
        if (appState.debug.interpreter) {
          if (appState.debug.runner) {
            // has runner -> paused
            console.log('paused');
            appState.debug.pause();
          } else {
            console.log('cont');
            appState.debug.cont();
          }
        } else {
          // else start
          console.log('start');
          appState.debug.start();
        }
      }
    });
  }

  render() {
    let isInterpreting = this.props.appState.debug.interpreter != null;

    return (
      <div
        style={{
          width: '100%',
          marginBottom: '1vh'
        }}
      >
        <Controls isInterpreting={isInterpreting} {...this.props.appState} />
        <Grid {...this.props.appState} />
        {this.props.appState.debug.debugIsVisible ? (
          <Debugger isInterpreting={isInterpreting} {...this.props.appState} />
        ) : (
          <DebugTab {...this.props.appState} />
        )}
        <HotKeyInfo />
      </div>
    );
  }
}

const HotKeyInfo = () => (
  <div
    style={{
      marginTop: 10,
      padding: '5px',
      width: 300,
      border: '1px solid #ddd',
      borderRadius: '5px',
      background: '#fafafa'
    }}
  >
    <div>
      <b>Hot Key</b>
    </div>
    <div>
      <b>p</b>: <span>brush Mode</span>
    </div>
    <div>
      <b>b</b>: <span>bucket Mode</span>
    </div>
    <div>
      <b>s</b>: <span>toggle display block size</span>
    </div>
    <div>
      <b>alt+space</b>: <span>run / paused</span>
    </div>
    <div>
      <b>+</b>: <span>increase run speed</span>
    </div>
    <div>
      <b>-</b>: <span>decrease run speed</span>
    </div>
  </div>
);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
});

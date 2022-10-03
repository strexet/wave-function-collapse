const DO_SAVE = false;
const DO_PRECALCULATE = false;

const c_width = 1000;
const c_height = 1000;

const TILES_COUNT = 6;
const TILES_COUNT2 = 10;
let tiles = [];
const tileImages = [];
const tileImages2 = [];

const DIM = 10;
let w;
let h;
let dim_w;
let dim_h;
let i_dim;
let j_dim;
let cellSize;
let grid = [];

let STOP = false;
let SAVED = false;
let canvas0;

function preload() {
  const path = "assets/tiles/loza1";
  const path2 = "assets/tiles/loza0";

  for (let i = 0; i < TILES_COUNT; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }

  for (let i = 0; i < TILES_COUNT2; i++) {
    tileImages2[i] = loadImage(`${path2}/${i}.png`);
  }
}

// <SETUP>
function setup() {
  // randomSeed(1);

  const minDimension = min(c_width, c_height);
  dim_w = DIM * c_width / minDimension;
  dim_h = DIM * c_height / minDimension;
  w = c_width / dim_w;
  h = c_height / dim_h;
  cellSize = min(w, h);


  canvas0 = createCanvas(c_width, c_height);

  // Loaded and created tiles.
  const _b0 = new TileSocket([0,0,0,0,0]);
  const _c2 = new TileSocket([0,0,1,0,0]);
  const _01 = new TileSocket([1,1,0,0,0]);
  const _34= new TileSocket([0,0,0,1,1]);

  // const _blank0 = new Tile(tileImages[0], [_b0, _b0, _b0, _b0]);
  // const _blank1 = new Tile(tileImages[1], [_b0, _b0, _b0, _b0]);
  // const _2Tile = new Tile(tileImages[2], [_c2, _b0, _b0, _b0]);
  const _3Tile = new Tile(tileImages[3], [_b0, _b0, _c2, _b0]);
  const _4Tile = new Tile(tileImages[4], [_c2, _b0, _b0, _c2]);
  const _5Tile = new Tile(tileImages[5], [_c2, _c2, _c2, _b0]);

  // addTileAndRotate(_blank0, tiles);
  // addTileAndRotate(_blank1, tiles);
  // addTileAndRotate(_2Tile, tiles);
  addTileAndRotate(_3Tile, tiles);
  addTileAndRotate(_4Tile, tiles);
  addTileAndRotate(_5Tile, tiles);

  // const _blank01 = new Tile(tileImages2[0], [_b0, _b0, _b0, _b0]);
  // const _1Tile1 = new Tile(tileImages2[1], [_c2, _b0, _b0, _b0]);
  const _2Tile1 = new Tile(tileImages2[2], [_b0, _b0, _c2, _b0]);
  const _3Tile1 = new Tile(tileImages2[3], [_c2, _b0, _b0, _c2]);
  const _4Tile1 = new Tile(tileImages2[4], [_c2, _c2, _c2, _b0]);
  const _5Tile1 = new Tile(tileImages2[5], [_01, _b0, _b0, _b0]);
  const _6Tile1 = new Tile(tileImages2[6], [_01, _b0, _b0, _34]);
  const _7Tile1 = new Tile(tileImages2[7], [_01, _b0, _c2, _b0]);
  const _8Tile1 = new Tile(tileImages2[8], [_01, _c2, _c2, _34]);
  const _9Tile1 = new Tile(tileImages2[9], [_b0, _b0, _b0, _34]);

  // addTileAndRotate(_blank01, tiles);
  // addTileAndRotate(_1Tile1, tiles);
  addTileAndRotate(_2Tile1, tiles);
  addTileAndRotate(_3Tile1, tiles);
  addTileAndRotate(_4Tile1, tiles);
  addTileAndRotate(_5Tile1, tiles);
  addTileAndRotate(_6Tile1, tiles);
  addTileAndRotate(_7Tile1, tiles);
  addTileAndRotate(_8Tile1, tiles);
  addTileAndRotate(_9Tile1, tiles);

  // Generate adjacency rules based on edges.
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyzeRules(tiles);
  }

  // Create cell for each spot on the grid.
  for (let i = 0; i < dim_h * dim_w; i++) {
    grid[i] = new Cell(tiles.length);
  }

  precalculate();
}
// </SETUP>

function addTileAndRotate(tile, tiles) {
  tiles.push(tile);
  for (let i = 0; i <= 3; i++) {
    tiles.push(tile.rotate(i));
  }
}

function precalculate() {
  if (!DO_PRECALCULATE) return;

  while(!STOP) {
    doCollapseIteration();
  }
}

function checkValid(options, valid) {
  for (let j = options.length - 1; j >= 0; j--) {
    const option = options[j];

    if (!valid.includes(option)){
      options.splice(j, 1);
    }
  }
}

function checkNeighbor(x, y, relativeDirection, options) {
  const index =  x + dim_w * y;
  const neighbor = grid[index];

  if (neighbor.options.length != tiles.length) {
    let validOptions = [];

    for (let option of neighbor.options){
      const valid = tiles[option][relativeDirection];
      validOptions = validOptions.concat(valid);
    }

    checkValid(options, validOptions);
  }

  return options;
}

function checkNeighborsLooped(i, j, index, result) {
  let options = new Array(tiles.length).fill(0).map((_, i) => i);

  // Look up
  const x_up = i % dim_w;
  const y_up =  (j - 1 + dim_h) % dim_h;
  options = checkNeighbor(x_up, y_up, "down", options);

  // const upIndex =  upX + dim_w * upY;
  // const up = grid[upIndex];

  // if (up.options.length != tiles.length) {
  //   let validOptions = [];

  //   for (let option of up.options){
  //     const valid = tiles[option].down;
  //     validOptions = validOptions.concat(valid);
  //   }

  //   checkValid(options, validOptions);
  // }

  // Look right
  const x_right = (i + 1) % dim_w;
  const y_right =  j % dim_h;
  options = checkNeighbor(x_right, y_right, "left", options);

  // const right = grid[((i + 1) % dim_w) + (dim_w * (j % dim_h))];
  // if (right.options.length != tiles.length) {
  //   let validOptions = [];

  //   for (let option of right.options){
  //     const valid = tiles[option].left;
  //     validOptions = validOptions.concat(valid);
  //   }

  //   checkValid(options, validOptions);
  // }

  // Look down
  const x_down = i % dim_w;
  const y_down =  (j + 1) % dim_h;
  options = checkNeighbor(x_down, y_down, "up", options);

  // const down = grid[(i % dim_w) + (dim_w * ((j + 1) % dim_h)) ];
  // if (down.options.length != tiles.length) {
  //   let validOptions = [];

  //   for (let option of down.options){
  //     const valid = tiles[option].up;
  //     validOptions = validOptions.concat(valid);
  //   }

  //   checkValid(options, validOptions);
  // }

  // Look left
  const x_left = (i - 1 + dim_w) % dim_w;
  const y_left =  j % dim_h;
  options = checkNeighbor(x_left, y_left, "right", options);

  // const left = grid[((i - 1 + dim_w) % dim_w) + (dim_w * (j % dim_h))];
  // if (left.options.length != tiles.length) {
  //   let validOptions = [];

  //   for (let option of left.options){
  //     const valid = tiles[option].right;
  //     validOptions = validOptions.concat(valid);
  //   }

  //   checkValid(options, validOptions);
  // }

  result[index] = new Cell(options);
}


function recalculateGridOptions() {
  const nextGrid = [];

  for (let j = 0; j < dim_h; j++) {
    for (let i = 0; i < dim_w; i++) {
      let index = i + j * dim_w;
      let cell = grid[index];

      if (cell.collapsed) {
        nextGrid[index] = cell;
      } else {
        checkNeighborsLooped(i, j, index, nextGrid);
      }
    }
  }

  grid = nextGrid;
}

function drawGrid() {




  for (let j = 0; j < dim_h; j++) {
    for (let i = 0; i < dim_w; i++) {
      const cellIndex = i + j * dim_w;
      const cell = grid[cellIndex];

      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, w * i, h * j, cellSize, cellSize);
      } else {
        fill(0);
        stroke(255);
        rect(w * i, h * j, cellSize, cellSize);
      }
    }
  }
}

function collapseCellWithLeastOptions() {
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter(cell => !cell.collapsed);
  gridCopy = gridCopy.sort((a, b) => a.options.length - b.options.length);

  if (gridCopy.length == 0) {
    STOP = true;
    noLoop();
    return;
  }

  const minLength = gridCopy[0].options.length;
  gridCopy = gridCopy.filter(cell => cell.options.length == minLength);

  const cell = random(gridCopy);
  const pick = random(cell.options);
  cell.options = [pick];
  cell.collapsed = true;
}

// function mouseClicked() {
//   redraw(100);
// }

function doCollapseIteration() {
  if (STOP) return;

  collapseCellWithLeastOptions();
  recalculateGridOptions();
}

function draw() {
  background(128);
  // noLoop();

  drawGrid(c_width, c_height);
  doCollapseIteration();

  if (DO_SAVE && STOP && !SAVED) {
    saveCanvas(canvas0, 'collapse', 'jpg');
    SAVED = true;
  }
}
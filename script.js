
var cols, rows;
var TOTAL_ROWS = 30;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
//var grid = [];
var current;
const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;
stack = [];
var start = 0;



function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  cols = floor(width / TOTAL_ROWS);
  rows = floor(height / TOTAL_ROWS);

  //frameRate(5);

  for (var j=0; j < rows; j++){
    for (var i = 0; i < cols; i++){
      var cell = new Cell(grid,i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
  
}

function draw(){
  background(255);
  for (cell of grid) {
    cell.show();
  }
  if (start == 0) {
    return;
  }

  //frameRate(3);

  //createMazeDFS();




}













function h(pos1, pos2) {
  const { x1, y1 } = pos1;
  const { x2, y2 } = pos2;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  // manhattan: function(pos0, pos1) {
  //   var d1 = Math.abs(pos1.x - pos0.x);
  //   var d2 = Math.abs(pos1.y - pos0.y);
  //   return d1 + d2;
  // },
  // diagonal: function(pos0, pos1) {
  //   var D = 1;
  //   var D2 = Math.sqrt(2);
  //   var d1 = Math.abs(pos1.x - pos0.x);
  //   var d2 = Math.abs(pos1.y - pos0.y);
  //   return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
  // }
}

function make_grid(rows, width) {
  grid = []
  cell_width = Math.floor(width / rows);
  for (var i = 0; i < rows; i++){
    grid.push([]);
    for (var i = 0; i < rows; i++){
      cell = new Cell(i, j, cell_width, rows);
      grid[i].push(cell);
    }
  }
  return grid;
}

function draw_grid_lines(rows, width) {
  cell_width = width//rows
    for i in range(rows):
        pygame.draw.line(win,GREY,(0,i*cell_width),(width,i*cell_width))
    for j in range(rows):
        pygame.draw.line(win, GREY, (j * cell_width,0), (j * cell_width, width))
}

function draw_all(grid, rows, width) {
  win.fill(WHITE)
    for row in grid:
        for node in row:
            node.draw(win)
    draw_grid(win,rows,width)
    pygame.display.update()
}

function get_clicked_pos(pos, rows, width) {
  cell_width = width//rows
    y,x = pos
    row = y//cell_width
    col = x//cell_width
    return row,col
}



function reconstruct_path(came_from, current, draw_func) {
  while (came_from.includes(current)) {
    current = came_from[current];
    current.make_path();
    draw_func();
  }
}

function grid_from(grid, value) {
  result = { ...grid };
  for (row of grid) {
    for (cell of row) {
      cell = value;
    }
  }
  return result;
}

function a_algorithm(draw_func,grid,start,end){
        
  count = 0
  open_set = PriorityQueue() //Get the smallest element efficiently
  open_set.put((0,count,start))
  open_set_hash = {start} //For lookup
  came_from = {}
  g_score = grid_from(grid, 'inf');
  g_score[start] = 0
  f_score = grid_from(grid, 'inf');
  f_score[start] = h(start.get_pos(),end.get_pos())
        // Algorithm
        while not open_set.empty():
            
            current = open_set.get()[2] // get the node with minimal f_score
            open_set_hash.remove(current) // sync
            // If we've done-
            if current == end:
                reconstruct_path(came_from, end, draw_func)
                end.make_end()
                start.make_start()
                return True
            // Else:
            for neighbor in current.neighbors:
                temp_g_score = g_score[current] + 1
                if temp_g_score < g_score[neighbor]: // better path
                    came_from[neighbor] = current
                    g_score[neighbor] = temp_g_score
                    f_score[neighbor] = temp_g_score + h(neighbor.get_pos(),end.get_pos())
                    if neighbor not in open_set_hash:
                        count+=1
                        open_set.put((f_score[neighbor],count,neighbor))
                        open_set_hash.add(neighbor)
                        neighbor.make_open()
            draw_func()
            if current != start:
                current.make_close()
        return False
}

function astart_search(graph, start, end, options) {
  graph.cleanDirty();
  options = options || {};
  var heuristic = options.heuristic || astar.heuristics.manhattan;
  var closest = options.closest || false;

  var openHeap = getHeap();
  var closestNode = start; // set the start node to be the closest if required

  start.h = heuristic(start, end);
  graph.markDirty(start);

  openHeap.push(start);

  while (openHeap.size() > 0) {

    // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
    var currentNode = openHeap.pop();

    // End case -- result has been found, return the traced path.
    if (currentNode === end) {
      return pathTo(currentNode);
    }

    // Normal case -- move currentNode from open to closed, process each of its neighbors.
    currentNode.closed = true;

    // Find all neighbors for the current node.
    var neighbors = graph.neighbors(currentNode);

    for (var i = 0, il = neighbors.length; i < il; ++i) {
      var neighbor = neighbors[i];

      if (neighbor.closed || neighbor.isWall()) {
        // Not a valid node to process, skip to next neighbor.
        continue;
      }

      // The g score is the shortest distance from start to current node.
      // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
      var gScore = currentNode.g + neighbor.getCost(currentNode);
      var beenVisited = neighbor.visited;

      if (!beenVisited || gScore < neighbor.g) {

        // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
        neighbor.visited = true;
        neighbor.parent = currentNode;
        neighbor.h = neighbor.h || heuristic(neighbor, end);
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
        graph.markDirty(neighbor);
        if (closest) {
          // If the neighbour is closer than the current closestNode or if it's equally close but has
          // a cheaper path than the current closest node then it becomes the closest node
          if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
            closestNode = neighbor;
          }
        }

        if (!beenVisited) {
          // Pushing to heap will put it in proper place based on the 'f' value.
          openHeap.push(neighbor);
        } else {
          // Already seen the node, but since it has been rescored we need to reorder it in the heap
          openHeap.rescoreElement(neighbor);
        }
      }
    }
  }

  if (closest) {
    return pathTo(closestNode);
  }

  // No result was found - empty array signifies failure to find path.
  return [];
}





function createMazeDFS() {
  
  current.visited = true;
  current.highlight();
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if(stack.length > 0){
    current = stack.pop();
  } else {
    //console.log(" DONE :) ");
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[LEFT] = false;
    b.walls[RIGHT] = false;
  } else if (x === -1) {
    a.walls[RIGHT] = false;
    b.walls[LEFT] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[TOP] = false;
    b.walls[BOTTOM] = false;
  } else if (y === -1) {
    a.walls[BOTTOM] = false;
    b.walls[TOP] = false;
  }
  
}

function startMaze() {
  start = !start;
  if(start)
    document.getElementById('btn_Start').innerText = 'PAUSE';
  else
    document.getElementById('btn_Start').innerText = 'RESUME';
}

function getClickedCell(x, y) {
  return {
    x: (x*TOTAL_ROWS) ,
    y: (x*TOTAL_ROWS) 
  }
}
document.addEventListener('mousedown', reactToMouseDown);
function reactToMouseDown() {
  
}
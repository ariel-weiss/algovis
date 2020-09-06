
CellColors = {
    RED: (255,0,0,200),
    GREEN: (0,255,0,200),
    BLACK: (0,0,0,200),
    ORANGE: (255,165,0,200),
    TURQUOISE: (64,224,208,200),
    PURPLE: (128,0,128,200),
    WHITE: (255,255,255,255)
}

class Cell {

    
    constructor(row, col,width,total_rows) {
        
        this.row = row;
        this.col = col;
        this.width = width;
        this.x = row * width;
        this.y = col * width;
        this.color = CellColors.WHITE;
        this.total_rows = total_rows;

        this.neighbors = [];
    }
  
    getGridPos() {
        return { row: this.row, col: this.col };
    }

    draw() {
        noStroke();
        fill(this.color);
        rect(x, y, this.width, this.width);
    }

    updateNeighbors(grid) {
        this.neighbors = [];
        //DOWN
        if ((this.row < this.total_rows - 1) && (!grid[this.row + 1][this.col].is_barrier())) {
            this.neighbors.push(grid[this.row + 1][this.col]);
        }
        //UP
        if ((this.row > 0) && (!grid[this.row - 1][this.col].is_barrier())) {
            this.neighbors.push(grid[this.row - 1][this.col]);
        }
        //RIGHT
        if ((this.col < this.total_rows - 1) && (!grid[this.row][this.col + 1].is_barrier())) {
            this.neighbors.push(grid[this.row][this.col + 1]);
        }
        //LEFT
        if ((this.col > 0) && (!grid[this.row][this.col - 1].is_barrier())) {
            this.neighbors.push(grid[this.row][this.col - 1]);
        }

        return this.neighbors;
    }
  
    checkNeighbors() {
        var neighbors = [];
  
        var top = (index(this.i, this.j - 1) != -1) ? this.grid[index(this.i, this.j - 1)] : undefined;
        var right = (index(this.i + 1, this.j) != -1) ? this.grid[index(this.i + 1, this.j)] : undefined;
        var bottom = (index(this.i, this.j + 1) != -1) ? this.grid[index(this.i, this.j + 1)] : undefined;
        var left = (index(this.i - 1, this.j) != -1) ? this.grid[index(this.i - 1, this.j)] : undefined;
      
        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }
  
        if (neighbors.length > 0) {
            var chosen = floor(random(0, neighbors.length));
            return neighbors[chosen];
        } else {
            return undefined;
        }
    }

    is_closed() {
        return this.color === CellColors.RED;
    }
    is_open() {
        return this.color === CellColors.GREEN;
    }
    is_barrier() {
        return this.color === CellColors.BLACK;
    }
    is_start() {
        return this.color === CellColors.ORANGE;
    }
    is_end() {
        return this.color === CellColors.TURQUOISE;
    }

    reset() {
        this.color = CellColors.WHITE;
    }
    make_closed() {
        this.color = CellColors.RED;
    }
    make_open() {
        this.color = CellColors.GREEN;
    }
    make_barrier() {
        this.color = CellColors.BLACK;
    }
    make_start() {
        this.color = CellColors.ORANGE;
    }
    make_end() {
        this.color = CellColors.TURQUOISE;
    }
    make_path() {
        this.color = CellColors.PURPLE;
    }

}
  
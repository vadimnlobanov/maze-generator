export const WALL = 0;
export const PATH = 1;
export const START = 3;

export type Cell = typeof WALL | typeof PATH | typeof START;

export type Point = {
  x: number;
  y: number;
};

export type MazeStep = {
  from: Point;
  to: Point;
};

export type MazeState = {
  size: number;
  cells: Uint8Array;
  visited: Uint8Array;
  stack: Point[];
  current: Point;
  finished: boolean;
};

const directions: Point[] = [
  { x: 2, y: 0 },
  { x: 0, y: 2 },
  { x: -2, y: 0 },
  { x: 0, y: -2 },
];

export const normalizeMazeSize = (value: number): number => {
  const integer = Math.max(5, Math.min(401, Math.floor(value)));
  return integer % 2 === 1 ? integer : integer - 1;
};

export const createMaze = (requestedSize: number): MazeState => {
  const size = normalizeMazeSize(requestedSize);
  const cells = new Uint8Array(size * size);
  const visited = new Uint8Array(size * size);

  for (let y = 1; y < size; y += 2) {
    for (let x = 1; x < size; x += 2) {
      cells[indexOf(size, x, y)] = PATH;
    }
  }

  cells[indexOf(size, 1, 1)] = START;
  visited[indexOf(size, 1, 1)] = 1;

  return {
    size,
    cells,
    visited,
    stack: [{ x: 1, y: 1 }],
    current: { x: 1, y: 1 },
    finished: false,
  };
};

export const stepMaze = (maze: MazeState): MazeStep | null => {
  if (maze.finished) return null;

  const neighbors = getUnvisitedNeighbors(maze);

  if (neighbors.length === 0) {
    maze.stack.pop();
    const previous = maze.stack[maze.stack.length - 1];

    if (!previous) {
      maze.finished = true;
      return null;
    }

    maze.current = previous;
    return null;
  }

  const next = neighbors[Math.floor(Math.random() * neighbors.length)];
  const wallX = maze.current.x + (next.x - maze.current.x) / 2;
  const wallY = maze.current.y + (next.y - maze.current.y) / 2;

  maze.cells[indexOf(maze.size, wallX, wallY)] = PATH;
  maze.cells[indexOf(maze.size, next.x, next.y)] = PATH;
  maze.visited[indexOf(maze.size, next.x, next.y)] = 1;

  const step = {
    from: maze.current,
    to: next,
  };

  maze.current = next;
  maze.stack.push(next);

  return step;
};

export const indexOf = (size: number, x: number, y: number): number => y * size + x;

const getUnvisitedNeighbors = (maze: MazeState): Point[] => {
  const result: Point[] = [];

  for (const direction of directions) {
    const x = maze.current.x + direction.x;
    const y = maze.current.y + direction.y;

    if (x > 0 && y > 0 && x < maze.size && y < maze.size && maze.visited[indexOf(maze.size, x, y)] === 0) {
      result.push({ x, y });
    }
  }

  return result;
};

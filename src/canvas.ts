import { indexOf, MazeState, PATH, START, WALL } from "./maze";

const colors = {
  wall: "#111827",
  path: "#f8fafc",
  start: "#15803d",
};

export const drawMaze = (canvas: HTMLCanvasElement, maze: MazeState): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cellSize = getCellSize(canvas, maze.size);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < maze.size; y += 1) {
    for (let x = 0; x < maze.size; x += 1) {
      drawCell(ctx, x, y, cellSize, maze.cells[indexOf(maze.size, x, y)]);
    }
  }
};

export const drawStep = (
  canvas: HTMLCanvasElement,
  maze: MazeState,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cellSize = getCellSize(canvas, maze.size);
  const wallX = fromX + (toX - fromX) / 2;
  const wallY = fromY + (toY - fromY) / 2;

  drawCell(ctx, wallX, wallY, cellSize, PATH);
  drawCell(ctx, toX, toY, cellSize, PATH);
};

export const resizeCanvas = (canvas: HTMLCanvasElement, mazeSize: number): void => {
  const parent = canvas.parentElement;
  const parentWidth = parent?.clientWidth ?? 800;
  const parentHeight = parent?.clientHeight ?? 800;
  const size = Math.max(mazeSize, Math.min(parentWidth, parentHeight));
  const ratio = window.devicePixelRatio || 1;

  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.width = Math.round(size * ratio);
  canvas.height = Math.round(size * ratio);
};

export const saveCanvasAsImage = (canvas: HTMLCanvasElement): void => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "maze.png";
  link.click();
};

const getCellSize = (canvas: HTMLCanvasElement, mazeSize: number): number => canvas.width / mazeSize;

const drawCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  state: number,
): void => {
  if (state === START) {
    ctx.fillStyle = colors.start;
  } else if (state === WALL) {
    ctx.fillStyle = colors.wall;
  } else {
    ctx.fillStyle = colors.path;
  }

  ctx.fillRect(x * size, y * size, Math.ceil(size), Math.ceil(size));
};

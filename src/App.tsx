import { useCallback, useEffect, useRef, useState } from "react";
import { createMaze, MazeState, stepMaze } from "./maze";
import { drawMaze, drawStep, resizeCanvas, saveCanvasAsImage } from "./canvas";

const defaultSize = 101;
const defaultStepsPerFrame = 25;

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mazeRef = useRef<MazeState>(createMaze(defaultSize));
  const animationRef = useRef<number | null>(null);
  const [mazeSize, setMazeSize] = useState(defaultSize);
  const [stepsPerFrame, setStepsPerFrame] = useState(defaultStepsPerFrame);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const resetMaze = useCallback((size = mazeSize) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    mazeRef.current = createMaze(size);
    resizeCanvas(canvas, mazeRef.current.size);
    drawMaze(canvas, mazeRef.current);
    setIsRunning(false);
    setIsFinished(false);
  }, [mazeSize]);

  const runFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const maze = mazeRef.current;
    if (!canvas) return;

    for (let i = 0; i < stepsPerFrame && !maze.finished; i += 1) {
      const step = stepMaze(maze);
      if (step) {
        drawStep(canvas, maze, step.from.x, step.from.y, step.to.x, step.to.y);
      }
    }

    if (maze.finished) {
      setIsRunning(false);
      setIsFinished(true);
      animationRef.current = null;
      return;
    }

    animationRef.current = requestAnimationFrame(runFrame);
  }, [stepsPerFrame]);

  const regenerate = () => {
    resetMaze();
    setIsRunning(true);
    animationRef.current = requestAnimationFrame(runFrame);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) saveCanvasAsImage(canvas);
  };

  useEffect(() => {
    resetMaze(mazeSize);
  }, [mazeSize, resetMaze]);

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      resizeCanvas(canvas, mazeRef.current.size);
      drawMaze(canvas, mazeRef.current);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <main className="app">
      <section className="toolbar" aria-label="Настройки лабиринта">
        <label className="field">
          <span>Размер</span>
          <input
            type="number"
            min={5}
            max={401}
            step={1}
            value={mazeSize}
            disabled={isRunning}
            onChange={(event) => setMazeSize(Number(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Шагов за кадр</span>
          <input
            type="range"
            min={1}
            max={250}
            value={stepsPerFrame}
            onChange={(event) => setStepsPerFrame(Number(event.target.value))}
          />
          <strong>{stepsPerFrame}</strong>
        </label>

        <div className="actions">
          <button type="button" onClick={regenerate}>
            Сгенерировать
          </button>
          <button type="button" onClick={saveImage}>
            Сохранить PNG
          </button>
        </div>
      </section>

      <section className="canvasArea" aria-label="Лабиринт">
        <canvas ref={canvasRef} />
      </section>
    </main>
  );
};

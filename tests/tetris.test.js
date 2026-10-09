// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { Tetris } from "../tetris.js";

describe("Tetris line clearing and scoring", () => {
  let game;

  beforeEach(() => {
    document.body.innerHTML = `
      <canvas id="gameCanvas"></canvas>
      <canvas id="nextCanvas"></canvas>
      <button id="startBtn"></button>
      <button id="pauseBtn"></button>
      <div id="gameOverlay"></div>
      <div id="score"></div>
      <div id="lines"></div>
      <div id="level"></div>
      <div id="highScore"></div>
    `;

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({});

    vi.stubGlobal("sessionStorage", {
      getItem: () => null,
      setItem: () => {},
    });

    game = new Tetris();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function fillBottomLines(count) {
    for (let i = 0; i < count; i++) {
      const y = game.BOARD_HEIGHT - 1 - i;
      game.board[y] = Array(game.BOARD_WIDTH).fill("red");
    }
  }

  it("clears two lines and awards 300 points", () => {
    fillBottomLines(2);

    game.clearLines();

    expect(game.score).toBe(300);
    expect(game.lines).toBe(2);

    expect(
      game.board.slice(-2).every((row) => row.every((cell) => cell === 0)),
    ).toBe(true);
  });

  it("clears three lines and awards 500 points", () => {
    fillBottomLines(3);

    game.clearLines();

    expect(game.score).toBe(500);
    expect(game.lines).toBe(3);

    expect(
      game.board.slice(-3).every((row) => row.every((cell) => cell === 0)),
    ).toBe(true);
  });

  it("clears four lines and awards 800 points", () => {
    fillBottomLines(4);

    game.clearLines();

    expect(game.score).toBe(800);
    expect(game.lines).toBe(4);

    expect(
      game.board.slice(-4).every((row) => row.every((cell) => cell === 0)),
    ).toBe(true);
  });

  it("multiplies line-clear points by the current level", () => {
    game.level = 2;
    fillBottomLines(2);

    game.clearLines();

    expect(game.score).toBe(600);
    expect(game.lines).toBe(2);
  });
});

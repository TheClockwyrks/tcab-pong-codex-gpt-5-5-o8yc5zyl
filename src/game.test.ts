import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { describe, expect, it } from "vitest";
import {
  BALL_R,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  OBSTACLE_CENTERS,
  OBSTACLE_SPIN_RATE,
  P1_X1,
  PADDLE_SPEED,
  SERVE_SPEED,
  SPIN_CLAMP,
} from "./constants";
import { BACKGROUND, game } from "./game";

import type { Engine, SurfaceMetrics } from "@clockwyrks/simple-2d";
import type { CaromDebugApi, CaromState } from "./game";

function makeEngine(stepMs = 1000 / 60): Engine<CaromState, CaromDebugApi> {
  const events = new EventTarget();
  const surface: SurfaceMetrics = {
    cssWidth: () => FIELD_W,
    cssHeight: () => FIELD_H,
    dpr: () => 1,
    events: () => events,
  };

  return createEngine({
    canvas: createCanvas(FIELD_W, FIELD_H) as unknown as HTMLCanvasElement,
    width: FIELD_W,
    height: FIELD_H,
    game,
    background: BACKGROUND,
    clock: new ConstantClock(stepMs),
    surface,
  });
}

async function initialized(
  stepMs?: number,
): Promise<Engine<CaromState, CaromDebugApi>> {
  const engine = makeEngine(stepMs);
  await engine.initialize();
  return engine;
}

describe("Carom simulation", () => {
  it("starts at the title with a complete debug snapshot", async () => {
    const engine = await initialized();
    const snapshot = engine.debug.snapshot(engine.state);

    expect(snapshot.screen).toBe("title");
    expect(snapshot.mode).toBe("solo");
    expect(snapshot.score).toEqual({ p1: 0, p2: 0 });
    expect(snapshot.ball?.x).toBe(FIELD_CX);
    expect(snapshot.ball?.y).toBe(FIELD_CY);
    expect(snapshot.ball?.speed).toBe(0);
    expect(snapshot.obstacles).toHaveLength(2);
    expect(engine.debug.menuItemRect(engine.state, 0)).toMatchObject({
      w: 360,
      h: 58,
    });

    engine.destroy();
  });

  it("serves after the countdown without advancing the ball on the serve frame", async () => {
    const engine = await initialized(1000);
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));

    await engine.advance(1);
    const snapshot = engine.debug.snapshot(engine.state);

    expect(snapshot.screen).toBe("playing");
    expect(snapshot.ball?.held).toBe(false);
    expect(snapshot.ball?.holdTimer).toBe(0);
    expect(snapshot.ball?.x).toBe(FIELD_CX);
    expect(snapshot.ball?.y).toBe(FIELD_CY);
    expect(snapshot.ball?.speed).toBeCloseTo(SERVE_SPEED);

    engine.destroy();
  });

  it("adds paddle spin from the integrated paddle velocity", async () => {
    const engine = await initialized(1000 / 120);
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R + 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -520, 0));
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    engine.apply((state) =>
      engine.debug.setPaddleVy(state, "left", PADDLE_SPEED),
    );

    await engine.advance(2);
    const snapshot = engine.debug.snapshot(engine.state);

    expect(snapshot.ball?.vx).toBeGreaterThan(0);
    expect(snapshot.ball?.spin).toBeGreaterThan(0);
    expect(snapshot.ball?.spin).toBeLessThanOrEqual(SPIN_CLAMP);

    engine.destroy();
  });

  it("scores points, parks the next serve, and ends the match by two", async () => {
    const engine = await initialized();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) => engine.debug.setScore(state, 10, 9));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 1, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 50, 0));

    await engine.advance(1);
    const snapshot = engine.debug.snapshot(engine.state);

    expect(snapshot.screen).toBe("matchover");
    expect(snapshot.score).toEqual({ p1: 11, p2: 9 });
    expect(snapshot.winner).toBe("left");
    expect(snapshot.menuIndex).toBe(0);

    engine.destroy();
  });

  it("poses obstacles from the debug clock and renders a frame", async () => {
    const engine = await initialized();
    engine.apply((state) => engine.debug.setObstacleClock(state, 0.9));
    engine.apply((state) => engine.debug.setObstacleClockRunning(state, false));

    await engine.advance(1);
    const snapshot = engine.debug.snapshot(engine.state);
    const sway = 80 * Math.sin((2 * Math.PI * 0.9) / 3.6);

    expect(snapshot.obstacleClock).toBe(0.9);
    expect(snapshot.obstacles[0]).toMatchObject({
      cx: OBSTACLE_CENTERS[0].x,
      cy: OBSTACLE_CENTERS[0].y + sway,
      theta: OBSTACLE_SPIN_RATE * 0.9,
    });

    engine.destroy();
  });

  it("reset restores title state while preserving mute", async () => {
    const engine = await initialized();
    engine.apply((state) => engine.debug.setMuted(state, true));
    engine.apply((state) => engine.debug.setScreen(state, "matchover"));
    engine.apply((state) => engine.debug.setScore(state, 7, 4));
    engine.apply((state) => engine.debug.reset(state));
    const snapshot = engine.debug.snapshot(engine.state);

    expect(snapshot.screen).toBe("title");
    expect(snapshot.score).toEqual({ p1: 0, p2: 0 });
    expect(snapshot.ball?.held).toBe(true);
    expect(snapshot.ball?.holdTimer).toBe(HOLD_TIME);
    expect(snapshot.muted).toBe(true);

    engine.destroy();
  });
});

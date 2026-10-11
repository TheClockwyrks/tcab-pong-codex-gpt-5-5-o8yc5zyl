import type {
  Game,
  InitApi,
  PointerSample,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_HW,
  OBSTACLE_SPIN_RATE,
  OBSTACLE_SWAY_AMP,
  OBSTACLE_SWAY_PERIOD,
  OBSTACLE_W,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_HALF,
  PADDLE_H,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
  readonly theta: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;

  readonly simTime: number;
  readonly muted: boolean;

  readonly pointerPressItem: number | null;
}

export interface MenuItemRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CaromSnapshot extends Omit<
  CaromState,
  "ball" | "pointerPressItem"
> {
  readonly version: number;
  readonly ball:
    | (BallState & {
        readonly speed: number;
      })
    | null;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  setObstacleClock(state: DeepReadonly<CaromState>, t: number): CaromState;
  setObstacleClockRunning(
    state: DeepReadonly<CaromState>,
    running: boolean,
  ): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(
    state: DeepReadonly<CaromState>,
    index: number,
  ): MenuItemRect | null;
}

export const BACKGROUND = "#081018";

const LEFT_COLOR = "#33d6ff";
const RIGHT_COLOR = "#ff4f8b";
const BALL_COLOR = "#fff06a";
const OBSTACLE_COLOR = "#69f0ae";
const TEXT_COLOR = "#eef8ff";
const DIM_TEXT = "rgba(238, 248, 255, 0.56)";
const PANEL = "rgba(5, 10, 20, 0.72)";
const MENU_W = 360;
const MENU_H = 58;
const MENU_GAP = 14;
const MENU_X = FIELD_CX - MENU_W / 2;
const TITLE_MENU_Y = 390;
const HOWTO_MENU_Y = 575;
const PAUSE_MENU_Y = 318;
const MATCH_MENU_Y = 432;

interface Rect {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

interface CollisionEvents {
  paddleHit: boolean;
  wallBounce: boolean;
  obstacleBounce: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function signChoice(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function obstaclePose(index: number, clock: number): ObstacleState {
  const base = OBSTACLE_CENTERS[index];
  if (!base) throw new Error(`unknown obstacle index ${index}`);
  const sway =
    OBSTACLE_SWAY_AMP * Math.sin((2 * Math.PI * clock) / OBSTACLE_SWAY_PERIOD);
  return {
    index,
    cx: base.x,
    cy: base.y + (index === 0 ? sway : -sway),
    theta: OBSTACLE_SPIN_RATE * clock,
  };
}

function obstaclePoses(clock: number): readonly ObstacleState[] {
  return OBSTACLE_CENTERS.map((_, index) => obstaclePose(index, clock));
}

function spawnBallState(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: signChoice(),
    trail: [],
  };
}

function titleState(muted: boolean): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: 0,
    titleIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: {
      left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
      right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: spawnBallState(),
    obstacles: obstaclePoses(0),
    obstacleClock: 0,
    obstacleClockRunning: true,
    simTime: 0,
    muted,
    pointerPressItem: null,
  };
}

function cloneState(state: DeepReadonly<CaromState>): CaromState {
  return {
    ...state,
    score: { ...state.score },
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    ball: state.ball ? { ...state.ball, trail: [...state.ball.trail] } : null,
    obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
  };
}

function withObstaclesAtClock(state: CaromState): CaromState {
  const present = new Set(state.obstacles.map((obstacle) => obstacle.index));
  return {
    ...state,
    obstacles: [...present]
      .sort()
      .map((index) => obstaclePose(index, state.obstacleClock)),
  };
}

function integratePaddle(
  paddle: PaddleState,
  desiredVy: number,
  dt: number,
): PaddleState {
  if (dt <= 0) return { ...paddle, vy: 0 };
  const nextCy = clamp(
    paddle.cy + desiredVy * dt,
    PADDLE_MIN_CY,
    PADDLE_MAX_CY,
  );
  const actualVy = nextCy === paddle.cy ? 0 : (nextCy - paddle.cy) / dt;
  return { ...paddle, cy: nextCy, vy: actualVy };
}

function inputAxis(api: UpdateApi, upName: string, downName: string): number {
  return api.input.value(downName) - api.input.value(upName);
}

function clonePaddle(paddle: DeepReadonly<PaddleState>): PaddleState {
  return { ...paddle };
}

function movePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState["paddles"] {
  const leftInput =
    state.mode === "solo"
      ? Math.sign(
          inputAxis(api, "p1-up", "p1-down") +
            inputAxis(api, "p2-up", "p2-down"),
        )
      : inputAxis(api, "p1-up", "p1-down");
  const rightInput =
    state.mode === "versus" ? inputAxis(api, "p2-up", "p2-down") : 0;
  const leftVy = state.paddles.left.driven
    ? state.paddles.left.drivenVy
    : leftInput * PADDLE_SPEED;
  let rightVy = state.paddles.right.driven
    ? state.paddles.right.drivenVy
    : rightInput * PADDLE_SPEED;

  if (!state.paddles.right.driven && state.mode === "solo") {
    if (!state.ai.movement) {
      rightVy = 0;
    } else {
      let target = AI_HOME_Y;
      let deadzone = AI_HOME_DEADZONE;
      if (
        state.ai.tracking &&
        state.screen === "playing" &&
        state.ball &&
        state.ball.vx > 0
      ) {
        target = state.ball.y - state.ball.vy * AI_REACT;
        deadzone = AI_DEADZONE;
      }
      const diff = target - state.paddles.right.cy;
      rightVy =
        Math.abs(diff) <= deadzone || dt <= 0
          ? 0
          : Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
    }
  }

  return {
    left: integratePaddle(clonePaddle(state.paddles.left), leftVy, dt),
    right: integratePaddle(clonePaddle(state.paddles.right), rightVy, dt),
  };
}

function paddleRect(side: Side, cy: number): Rect {
  return {
    x0: side === "left" ? P1_X0 : P2_X0,
    x1: side === "left" ? P1_X1 : P2_X1,
    y0: cy - PADDLE_HALF,
    y1: cy + PADDLE_HALF,
  };
}

function resolvePaddle(
  ball: BallState,
  rect: Rect,
  side: Side,
  paddleCy: number,
  paddleVy: number,
  events: CollisionEvents,
): BallState {
  if (
    ball.x <= rect.x0 - BALL_R ||
    ball.x >= rect.x1 + BALL_R ||
    ball.y <= rect.y0 - BALL_R ||
    ball.y >= rect.y1 + BALL_R
  ) {
    return ball;
  }

  const depths = [
    ball.x - (rect.x0 - BALL_R),
    rect.x1 + BALL_R - ball.x,
    ball.y - (rect.y0 - BALL_R),
    rect.y1 + BALL_R - ball.y,
  ];
  let face = 0;
  for (let i = 1; i < depths.length; i += 1) {
    if (depths[i] < depths[face]) face = i;
  }

  if (face === 0 || face === 1) {
    const speed = Math.min(
      Math.hypot(ball.vx, ball.vy) * SPEED_MULT,
      SPEED_CAP,
    );
    const offset = clamp((ball.y - paddleCy) / PADDLE_HALF, -1, 1);
    const theta = offset * MAX_BOUNCE_ANGLE;
    const dir = side === "left" ? 1 : -1;
    events.paddleHit = true;
    return {
      ...ball,
      x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
      vx: dir * speed * Math.cos(theta),
      vy: speed * Math.sin(theta),
      spin: clamp(
        ball.spin + paddleVy * SPIN_FROM_PADDLE,
        -SPIN_CLAMP,
        SPIN_CLAMP,
      ),
    };
  }

  if (face === 2) {
    events.wallBounce = events.wallBounce || ball.vy > 0;
    return {
      ...ball,
      y: rect.y0 - BALL_R,
      vy: ball.vy > 0 ? -ball.vy : ball.vy,
    };
  }

  events.wallBounce = events.wallBounce || ball.vy < 0;
  return {
    ...ball,
    y: rect.y1 + BALL_R,
    vy: ball.vy < 0 ? -ball.vy : ball.vy,
  };
}

function resolveObstacle(
  ball: BallState,
  obstacle: DeepReadonly<ObstacleState>,
  events: CollisionEvents,
): BallState {
  const cos = Math.cos(obstacle.theta);
  const sin = Math.sin(obstacle.theta);
  const dx = ball.x - obstacle.cx;
  const dy = ball.y - obstacle.cy;
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;
  const qx = clamp(lx, -OBSTACLE_HW, OBSTACLE_HW);
  const qy = clamp(ly, -OBSTACLE_HH, OBSTACLE_HH);
  const ox = lx - qx;
  const oy = ly - qy;
  const distSq = ox * ox + oy * oy;
  const inside =
    lx >= -OBSTACLE_HW &&
    lx <= OBSTACLE_HW &&
    ly >= -OBSTACLE_HH &&
    ly <= OBSTACLE_HH;
  if (!inside && distSq >= BALL_R * BALL_R) return ball;

  let nlx = 0;
  let nly = 0;
  let push: number;
  if (inside) {
    const penX = OBSTACLE_HW - Math.abs(lx);
    const penY = OBSTACLE_HH - Math.abs(ly);
    if (penX <= penY) {
      nlx = lx >= 0 ? 1 : -1;
      push = BALL_R + penX;
    } else {
      nly = ly >= 0 ? 1 : -1;
      push = BALL_R + penY;
    }
  } else {
    const dist = Math.max(Math.sqrt(distSq), 0.000001);
    nlx = ox / dist;
    nly = oy / dist;
    push = BALL_R - dist;
  }

  const nx = nlx * cos - nly * sin;
  const ny = nlx * sin + nly * cos;
  const dot = ball.vx * nx + ball.vy * ny;
  events.obstacleBounce = events.obstacleBounce || dot < 0;
  return {
    ...ball,
    x: ball.x + nx * Math.max(push, 0),
    y: ball.y + ny * Math.max(push, 0),
    vx: dot < 0 ? ball.vx - 2 * dot * nx : ball.vx,
    vy: dot < 0 ? ball.vy - 2 * dot * ny : ball.vy,
  };
}

function advanceBall(
  ball: BallState,
  paddles: CaromState["paddles"],
  obstacles: readonly DeepReadonly<ObstacleState>[],
  dt: number,
  events: CollisionEvents,
): BallState {
  if (ball.held || dt <= 0) return ball;
  let next = ball;
  const startSpeed = Math.hypot(ball.vx, ball.vy);
  const steps = Math.max(1, Math.ceil((startSpeed * dt) / MAX_SUBSTEP));
  const h = dt / steps;

  for (let i = 0; i < steps; i += 1) {
    const speed = Math.hypot(next.vx, next.vy);
    if (speed > 0) {
      const angle = (next.spin / speed) * h;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      next = {
        ...next,
        vx: next.vx * cos - next.vy * sin,
        vy: next.vx * sin + next.vy * cos,
      };
    }
    next = {
      ...next,
      spin: next.spin * Math.pow(0.5, h / SPIN_HALFLIFE),
      x: next.x + next.vx * h,
      y: next.y + next.vy * h,
    };

    if (next.y - BALL_R < 0 && next.vy < 0) {
      next = { ...next, y: BALL_R, vy: -next.vy };
      events.wallBounce = true;
    } else if (next.y + BALL_R > FIELD_H && next.vy > 0) {
      next = { ...next, y: FIELD_H - BALL_R, vy: -next.vy };
      events.wallBounce = true;
    }

    next = resolvePaddle(
      next,
      paddleRect("left", paddles.left.cy),
      "left",
      paddles.left.cy,
      paddles.left.vy,
      events,
    );
    next = resolvePaddle(
      next,
      paddleRect("right", paddles.right.cy),
      "right",
      paddles.right.cy,
      paddles.right.vy,
      events,
    );
    for (const obstacle of obstacles) {
      next = resolveObstacle(next, obstacle, events);
    }
  }

  return next;
}

function addTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function serveBall(ball: BallState, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    held: false,
    holdTimer: 0,
    trail: [],
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
  };
}

function matchWinner(score: {
  readonly p1: number;
  readonly p2: number;
}): Side | null {
  if (score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD) return "left";
  if (score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD) return "right";
  return null;
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  return {
    ...cloneState(state),
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: spawnBallState(),
    paddles: {
      left: {
        cy: FIELD_CY,
        vy: 0,
        driven: state.paddles.left.driven,
        drivenVy: state.paddles.left.drivenVy,
      },
      right: {
        cy: FIELD_CY,
        vy: 0,
        driven: state.paddles.right.driven,
        drivenVy: state.paddles.right.drivenVy,
      },
    },
    obstacles: obstaclePoses(0),
    obstacleClock: 0,
    obstacleClockRunning: true,
    pointerPressItem: null,
  };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return {
    ...titleState(state.muted),
    titleIndex: state.titleIndex,
    menuIndex: state.titleIndex,
    simTime: state.simTime,
  };
}

function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "paused") return PAUSE_ITEMS;
  if (screen === "matchover") return MATCHOVER_ITEMS;
  if (screen === "howto") return ["BACK"];
  return [];
}

function menuBaseY(screen: Screen): number {
  if (screen === "title") return TITLE_MENU_Y;
  if (screen === "paused") return PAUSE_MENU_Y;
  if (screen === "matchover") return MATCH_MENU_Y;
  return HOWTO_MENU_Y;
}

function menuRectFor(screen: Screen, index: number): MenuItemRect | null {
  const items = menuItems(screen);
  if (index < 0 || index >= items.length) return null;
  return {
    x: MENU_X,
    y: menuBaseY(screen) + index * (MENU_H + MENU_GAP),
    w: MENU_W,
    h: MENU_H,
  };
}

function hitMenu(screen: Screen, x: number, y: number): number | null {
  const items = menuItems(screen);
  for (let index = 0; index < items.length; index += 1) {
    const rect = menuRectFor(screen, index);
    if (
      rect &&
      x >= rect.x &&
      x <= rect.x + rect.w &&
      y >= rect.y &&
      y <= rect.y + rect.h
    ) {
      return index;
    }
  }
  return null;
}

function confirmMenuItem(state: CaromState): CaromState {
  if (state.screen === "title") {
    const titleIndex = state.menuIndex;
    if (state.menuIndex === 0)
      return { ...startMatch(state, "solo"), titleIndex };
    if (state.menuIndex === 1)
      return { ...startMatch(state, "versus"), titleIndex };
    return { ...state, titleIndex, screen: "howto", menuIndex: 0 };
  }
  if (state.screen === "howto") return returnToTitle(state);
  if (state.screen === "paused") {
    if (state.menuIndex === 0) return { ...state, screen: state.resumeScreen };
    if (state.menuIndex === 1) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  if (state.screen === "matchover") {
    if (state.menuIndex === 0) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  return state;
}

function moveMenu(state: CaromState, dir: -1 | 1): CaromState {
  const count = menuItems(state.screen).length;
  if (count === 0) return state;
  return { ...state, menuIndex: (state.menuIndex + dir + count) % count };
}

function readMenuInput(
  state: CaromState,
  api: UpdateApi,
): { state: CaromState; keyboardConfirmed: boolean } {
  let next = state;
  let keyboardConfirmed = false;
  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const back = api.input.pressed("back");
  const pause = api.input.pressed("pause");

  if (state.screen === "title") {
    if (up) next = moveMenu(next, -1);
    else if (down) next = moveMenu(next, 1);
    else if (confirm) {
      keyboardConfirmed = true;
      next = confirmMenuItem(next);
    }
  } else if (state.screen === "howto") {
    if (confirm || back) {
      keyboardConfirmed = true;
      next = returnToTitle(next);
    }
  } else if (state.screen === "paused") {
    if (pause || back) {
      return {
        state: { ...next, screen: next.resumeScreen },
        keyboardConfirmed: false,
      };
    }
    if (up) next = moveMenu(next, -1);
    else if (down) next = moveMenu(next, 1);
    else if (confirm) {
      keyboardConfirmed = true;
      next = confirmMenuItem(next);
    }
  } else if (state.screen === "matchover") {
    if (up) next = moveMenu(next, -1);
    else if (down) next = moveMenu(next, 1);
    else if (confirm) {
      keyboardConfirmed = true;
      next = confirmMenuItem(next);
    } else if (back) {
      next = returnToTitle(next);
    }
  }

  return { state: next, keyboardConfirmed };
}

function isPrimaryPress(sample: PointerSample): boolean {
  return sample.primary && sample.buttons.includes("primary");
}

function isPrimaryRelease(sample: PointerSample): boolean {
  return sample.primary && sample.button === "primary";
}

function readPointerMenuInput(
  state: CaromState,
  api: UpdateApi,
  keyboardConfirmed: boolean,
): CaromState {
  if (keyboardConfirmed || menuItems(state.screen).length === 0) return state;
  let next = state;
  let pressItem = state.pointerPressItem;
  const pointer = api.input.pointer();
  const hover = hitMenu(state.screen, pointer.x, pointer.y);
  if (hover !== null) next = { ...next, menuIndex: hover };

  for (const sample of api.input.pointerSamples()) {
    const hit = hitMenu(state.screen, sample.x, sample.y);
    if (hit !== null) next = { ...next, menuIndex: hit };
    if (sample.type === "down" && isPrimaryPress(sample)) pressItem = hit;
    if (sample.type === "up" && isPrimaryRelease(sample)) {
      if (pressItem !== null && hit === pressItem) {
        next = { ...next, menuIndex: pressItem, pointerPressItem: null };
        if (state.screen === "title") next = { ...next, titleIndex: pressItem };
        return confirmMenuItem(next);
      }
      pressItem = null;
    }
  }

  return { ...next, pointerPressItem: pressItem };
}

function applyScreenInput(state: CaromState, api: UpdateApi): CaromState {
  if (api.input.pressed("mute")) {
    api.audio.setMuted(!api.audio.muted());
  }

  if (state.screen === "countdown" || state.screen === "playing") {
    if (api.input.pressed("pause")) {
      return {
        ...state,
        screen: "paused",
        resumeScreen: state.screen,
        menuIndex: 0,
      };
    }
    return state;
  }

  const { state: afterKeyboard, keyboardConfirmed } = readMenuInput(state, api);
  return readPointerMenuInput(afterKeyboard, api, keyboardConfirmed);
}

function playFrameCues(
  api: UpdateApi,
  events: CollisionEvents & { score?: boolean },
): void {
  if (events.paddleHit) api.audio.play(CUES.paddleHit);
  if (events.wallBounce) api.audio.play(CUES.wallBounce);
  if (events.obstacleBounce) api.audio.play(CUES.obstacleBounce);
  if (events.score) api.audio.play(CUES.score);
}

function stepActiveScreen(
  state: CaromState,
  api: UpdateApi,
  dt: number,
  simTime: number,
): CaromState {
  if (state.screen !== "countdown" && state.screen !== "playing") return state;

  const paddles = movePaddles(state, api, dt);
  const obstacleClock = state.obstacleClockRunning
    ? state.obstacleClock + dt
    : state.obstacleClock;
  let next: CaromState = { ...state, paddles };

  if (state.screen === "countdown" && state.ball) {
    const holdTimer = Math.max(0, state.ball.holdTimer - dt);
    const ball =
      holdTimer <= 0
        ? serveBall({ ...state.ball, holdTimer }, state.receiver)
        : { ...state.ball, x: FIELD_CX, y: FIELD_CY, holdTimer };
    next = {
      ...next,
      screen: holdTimer <= 0 ? "playing" : "countdown",
      ball: addTrail(ball, simTime),
    };
  } else if (state.screen === "playing" && state.ball) {
    const events: CollisionEvents & { score?: boolean } = {
      paddleHit: false,
      wallBounce: false,
      obstacleBounce: false,
    };
    let ball = advanceBall(state.ball, paddles, state.obstacles, dt, events);
    let score = state.score;
    let receiver = state.receiver;
    let winner = state.winner;
    let screen: Screen = "playing";

    if (ball.x - BALL_R > FIELD_W) {
      score = { ...score, p1: score.p1 + 1 };
      receiver = "right";
      winner = matchWinner(score);
      screen = winner ? "matchover" : "countdown";
      events.score = true;
    } else if (ball.x + BALL_R < 0) {
      score = { ...score, p2: score.p2 + 1 };
      receiver = "left";
      winner = matchWinner(score);
      screen = winner ? "matchover" : "countdown";
      events.score = true;
    }

    playFrameCues(api, events);
    if (screen === "countdown") ball = spawnBallState();
    else if (screen === "playing") ball = addTrail(ball, simTime);

    next = {
      ...next,
      screen,
      score,
      receiver,
      winner,
      menuIndex: screen === "matchover" ? 0 : next.menuIndex,
      ball,
    };
  }

  return withObstaclesAtClock({ ...next, obstacleClock });
}

function ballOrThrow(state: DeepReadonly<CaromState>): BallState {
  if (!state.ball) throw new Error("Carom debug: no ball is present");
  return { ...state.ball, trail: [...state.ball.trail] };
}

function snapshot(state: DeepReadonly<CaromState>): CaromSnapshot {
  const cloned = cloneState(state);
  const { pointerPressItem: _pointerPressItem, ...rest } = cloned;
  return {
    ...rest,
    version: CAROM_DEBUG_VERSION,
    ball: cloned.ball
      ? { ...cloned.ball, speed: Math.hypot(cloned.ball.vx, cloned.ball.vy) }
      : null,
  };
}

function createDebug(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({
      ...cloneState(state),
      ball: null,
      obstacles: [],
    }),
    spawnBall: (state) => ({ ...cloneState(state), ball: spawnBallState() }),
    spawnObstacle: (state, index) => {
      if (!OBSTACLE_CENTERS[index])
        throw new Error(`unknown obstacle index ${index}`);
      const next = cloneState(state);
      const obstacles = next.obstacles.filter(
        (obstacle) => obstacle.index !== index,
      );
      return {
        ...next,
        obstacles: [...obstacles, obstaclePose(index, next.obstacleClock)].sort(
          (a, b) => a.index - b.index,
        ),
      };
    },
    reset: (state) => titleState(state.muted),
    reconcile: (state) => withObstaclesAtClock(cloneState(state)),
    setScreen: (state, screen) => ({ ...cloneState(state), screen }),
    setMode: (state, mode) => ({ ...cloneState(state), mode }),
    setMenuIndex: (state, menuIndex) => ({ ...cloneState(state), menuIndex }),
    setTitleIndex: (state, titleIndex) => ({
      ...cloneState(state),
      titleIndex,
    }),
    setResumeScreen: (state, resumeScreen) => ({
      ...cloneState(state),
      resumeScreen,
    }),
    setScore: (state, p1, p2) => ({ ...cloneState(state), score: { p1, p2 } }),
    setWinner: (state, winner) => ({ ...cloneState(state), winner }),
    setReceiver: (state, receiver) => ({ ...cloneState(state), receiver }),
    setPaddleCy: (state, side, cy) => {
      const next = cloneState(state);
      return {
        ...next,
        paddles: { ...next.paddles, [side]: { ...next.paddles[side], cy } },
      };
    },
    setPaddleVy: (state, side, drivenVy) => {
      const next = cloneState(state);
      return {
        ...next,
        paddles: {
          ...next.paddles,
          [side]: { ...next.paddles[side], drivenVy },
        },
      };
    },
    setPaddleDriven: (state, side, driven) => {
      const next = cloneState(state);
      return {
        ...next,
        paddles: {
          ...next.paddles,
          [side]: { ...next.paddles[side], driven },
        },
      };
    },
    setBallPosition: (state, x, y) => ({
      ...cloneState(state),
      ball: { ...ballOrThrow(state), x, y },
    }),
    setBallVelocity: (state, vx, vy) => ({
      ...cloneState(state),
      ball: { ...ballOrThrow(state), vx, vy },
    }),
    setBallSpin: (state, spin) => ({
      ...cloneState(state),
      ball: { ...ballOrThrow(state), spin },
    }),
    setBallHeld: (state, held) => ({
      ...cloneState(state),
      ball: { ...ballOrThrow(state), held },
    }),
    setBallHoldTimer: (state, holdTimer) => ({
      ...cloneState(state),
      ball: { ...ballOrThrow(state), holdTimer },
    }),
    setBallServeSign: (state, serveSign) => ({
      ...cloneState(state),
      ball: { ...ballOrThrow(state), serveSign },
    }),
    drawBallServeSign: (state) => ({
      ...cloneState(state),
      ball: { ...ballOrThrow(state), serveSign: signChoice() },
    }),
    setAiTracking: (state, tracking) => ({
      ...cloneState(state),
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...cloneState(state),
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...cloneState(state), muted }),
    setObstacleClock: (state, obstacleClock) =>
      withObstaclesAtClock({ ...cloneState(state), obstacleClock }),
    setObstacleClockRunning: (state, obstacleClockRunning) => ({
      ...cloneState(state),
      obstacleClockRunning,
    }),
    snapshot,
    menuItemRect: (state, index) => menuRectFor(state.screen, index),
  };
}

function registerDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("mode", (s) => s.mode);
  api.diagnostics.register("score", (s) => `${s.score.p1}-${s.score.p2}`);
  api.diagnostics.register("ball", (s) =>
    s.ball ? `${s.ball.x.toFixed(1)},${s.ball.y.toFixed(1)}` : "none",
  );
  api.diagnostics.register("ball v", (s) =>
    s.ball ? `${s.ball.vx.toFixed(1)},${s.ball.vy.toFixed(1)}` : "none",
  );
  api.diagnostics.register("ball speed", (s) =>
    s.ball ? Math.hypot(s.ball.vx, s.ball.vy) : 0,
  );
  api.diagnostics.register("spin", (s) => s.ball?.spin ?? 0);
  api.diagnostics.register(
    "left",
    (s) => `${s.paddles.left.cy.toFixed(1)} ${s.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "right",
    (s) => `${s.paddles.right.cy.toFixed(1)} ${s.paddles.right.vy.toFixed(1)}`,
  );
}

function defineAudio(api: InitApi<CaromState>): void {
  api.audio.define(CUES.paddleHit, {
    wave: "triangle",
    freq: 360,
    freqTo: 640,
    gain: 0.16,
    durationMs: 60,
  });
  api.audio.define(CUES.wallBounce, {
    wave: "sine",
    freq: 220,
    freqTo: 320,
    gain: 0.13,
    durationMs: 45,
  });
  api.audio.define(CUES.obstacleBounce, {
    wave: "square",
    freq: 520,
    freqTo: 260,
    gain: 0.11,
    durationMs: 70,
  });
  api.audio.define(CUES.score, {
    wave: "sawtooth",
    freq: 180,
    freqTo: 720,
    gain: 0.12,
    durationMs: 150,
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawFieldFurniture(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
  dim = false,
): void {
  ctx.save();
  ctx.globalAlpha = dim ? 0.42 : 1;
  ctx.strokeStyle = "rgba(238,248,255,0.22)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 20]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 28);
  ctx.lineTo(NET_X, FIELD_H - 28);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const obstacle of state.obstacles) {
    ctx.save();
    ctx.translate(obstacle.cx, obstacle.cy);
    ctx.rotate(obstacle.theta);
    ctx.fillStyle = OBSTACLE_COLOR;
    ctx.shadowColor = OBSTACLE_COLOR;
    ctx.shadowBlur = 18;
    drawRoundedRect(
      ctx,
      -OBSTACLE_W / 2,
      -OBSTACLE_H / 2,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
    ctx.restore();
  }

  ctx.fillStyle = LEFT_COLOR;
  ctx.shadowColor = LEFT_COLOR;
  ctx.shadowBlur = 16;
  drawRoundedRect(
    ctx,
    P1_X0,
    state.paddles.left.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );
  ctx.fillStyle = RIGHT_COLOR;
  ctx.shadowColor = RIGHT_COLOR;
  drawRoundedRect(
    ctx,
    P2_X0,
    state.paddles.right.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );

  if (state.ball) {
    ctx.shadowBlur = 0;
    const trail = state.ball.trail;
    if (trail.length > 1) {
      ctx.lineWidth = BALL_R * 1.3;
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i += 1) {
        ctx.strokeStyle = `rgba(255, 240, 106, ${i / trail.length / 2})`;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
    }
    ctx.fillStyle = BALL_COLOR;
    ctx.shadowColor = BALL_COLOR;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  ctx.save();
  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 54px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(String(state.score.p1), FIELD_CX - 115, 62);
  ctx.fillText(String(state.score.p2), FIELD_CX + 115, 62);
  ctx.font = "700 16px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    92,
  );
  if (state.screen === "countdown" && state.ball) {
    ctx.font = "800 76px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(
      Math.ceil(state.ball.holdTimer).toString(),
      FIELD_CX,
      FIELD_CY - 110,
    );
  }
  ctx.restore();
}

function drawMenu(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
  title: string,
  subtitle: readonly string[],
): void {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = title === TITLE_TEXT ? TEXT_COLOR : "rgba(238,248,255,0.95)";
  ctx.font =
    title === TITLE_TEXT
      ? "900 104px ui-sans-serif, system-ui, sans-serif"
      : "800 56px ui-sans-serif, system-ui, sans-serif";
  ctx.shadowColor = "rgba(51,214,255,0.45)";
  ctx.shadowBlur = 22;
  ctx.fillText(title, FIELD_CX, title === TITLE_TEXT ? 220 : 175);
  ctx.shadowBlur = 0;
  ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  subtitle.forEach((line, index) =>
    ctx.fillText(line, FIELD_CX, 272 + index * 32),
  );

  const items = menuItems(state.screen);
  items.forEach((item, index) => {
    const rect = menuRectFor(state.screen, index);
    if (!rect) return;
    const selected = index === state.menuIndex;
    ctx.fillStyle = selected ? "rgba(255,240,106,0.96)" : PANEL;
    ctx.shadowColor = selected ? "rgba(255,240,106,0.42)" : "transparent";
    ctx.shadowBlur = selected ? 18 : 0;
    drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.shadowBlur = 0;
    ctx.fillStyle = selected ? "#111827" : TEXT_COLOR;
    ctx.font = "800 22px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(item, rect.x + rect.w / 2, rect.y + rect.h / 2);
  });
  ctx.restore();
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS) {
      api.input.register(action, { keys: [...BINDINGS[action]] });
    }
    defineAudio(api);
    registerDiagnostics(api);
    return [titleState(false), createDebug()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    const simTime = state.simTime + dt;
    let next = { ...cloneState(state), simTime };
    next = applyScreenInput(next, api);
    next = stepActiveScreen(next, api, dt, simTime);
    return { ...next, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const ctx = api.ctx;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    drawFieldFurniture(
      ctx,
      state,
      state.screen === "title" || state.screen === "howto",
    );

    if (
      state.screen === "playing" ||
      state.screen === "countdown" ||
      state.screen === "paused" ||
      state.screen === "matchover"
    ) {
      drawHud(ctx, state);
    }

    if (state.screen === "title") {
      drawMenu(ctx, state, TITLE_TEXT, [
        "Curve the rally. Bank the impossible.",
      ]);
    } else if (state.screen === "howto") {
      drawMenu(ctx, state, "HOW TO PLAY", [
        "W/S or arrows move. In Solo either side of the keyboard drives you.",
        "Strike while moving to bend the ball. Use the rotating bars for bank shots.",
      ]);
    } else if (state.screen === "paused") {
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.fillRect(0, 0, FIELD_W, FIELD_H);
      drawMenu(ctx, state, "PAUSED", []);
    } else if (state.screen === "matchover") {
      const winner = state.winner === "left" ? "LEFT WINS" : "RIGHT WINS";
      drawMenu(ctx, state, winner, [
        `Final score ${state.score.p1}-${state.score.p2}`,
      ]);
    }
  },
};

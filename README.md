# Carom

Carom is a top-down paddle duel for the browser. Two paddles fight across a dark
field while the ball bends with spin, banks off the walls, and ricochets through
two swaying, rotating obstacles in midfield.

## Install

```sh
npm ci
```

## Run In Development

```sh
npm run dev
```

Open the Vite URL in a browser. The game runs entirely on the page canvas and
does not need a backend.

## Production Build

```sh
npm run build
```

The static site is emitted to `dist/` with `dist/index.html` as its entry point.

## Controls

- Player 1: `W` and `S`
- Player 2 in Versus: `ArrowUp` and `ArrowDown`
- Solo mode: either `W`/`S` or arrow keys move the left paddle
- Confirm: `Enter` or `Space`
- Pause or resume: `P` or `Escape`
- Back: `Escape`
- Mute: `M`

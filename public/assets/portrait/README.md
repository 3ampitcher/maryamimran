# Portrait assets

Two files. Nothing else in the codebase needs to change.

| File | Used by | What it should be |
|---|---|---|
| `maryam-portrait.jpg` | **Hero** — full-bleed | A **landscape** environmental shot, roughly 16:9. The photo fills the whole opening screen, so give it room around you. Export ~2400px wide. |
| `maryam-about.jpg` | About page | A second, more candid image. Portrait or square. Optional. |

## The focal point

The hero crops hard — on a phone a 16:9 photo is cut to a tall slice. What keeps
you in frame is one line in `src/data/site.ts`:

```ts
portrait: {
  focus: '62% 30%',   // x% y% — where your face sits in the frame
}
```

`62% 30%` suits a shot where you're right of centre with your face in the upper
third. If a future photo is framed differently, nudge those two numbers and
check it at both a wide and a narrow window. Nothing else needs touching.

## Legibility

The hero lays white type over the photograph, using two gradient scrims — one
across the top behind the navigation, one across the bottom behind your name.
They're calibrated against a pure-white frame, so even a very bright photo keeps
the type above WCAG AA (nav 4.6:1, name 7.8:1, bottom rail 12:1). A darker photo
only improves that.

The middle of the frame is left clean on purpose — that's where your face sits.

Until a file exists here, a composed stand-in renders instead, so the layout can
be judged before the photography arrives.

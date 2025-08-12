## SLAB DASH

An endless, minimalist platformer built with Kaboom.js. Bounce an orange ball across slabs, rack up points by passing platforms, and avoid the green ground—after the first touch, the next one ends the run.

### Features
- Auto-bounce after your first jump
- Score increases when you pass slabs (with a playful "hippie" sfx)
- Game Over screen with final score and persistent high score
- Continuous green ground under an extended set of slabs
- Title and HUD (score left, high score top-right)

### Controls
- Move: A / D or Left / Right
- Jump: W / Up / Space (first jump enables auto-bounce)
- Restart after Game Over: R

### Run locally
1. Open `index.html` in any modern browser (Chrome, Edge, Firefox).
2. The game will start immediately. If sounds are blocked initially, press any key once to allow audio.

### High score
- Stored in `localStorage` under key `kaboom_platformer_highscore_v1`.
- To reset: open DevTools → Application/Storage → Local Storage → remove that key, or run in console:
  ```js
  localStorage.removeItem('kaboom_platformer_highscore_v1')
  ```

### Customization
- Edit `main.js` to tweak:
  - Gravity, speeds: `setGravity`, `MOVE_SPEED`, `JUMP_FORCE`
  - Colors: `COLOR_GROUND`, `COLOR_PLATFORM`, ball color in player component
  - Slab generation: search for "Add more slabs" and adjust gap/width ranges

### Tech
- Built with Kaboom.js via CDN
- Plain HTML + JavaScript, no build step required



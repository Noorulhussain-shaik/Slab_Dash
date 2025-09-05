## SLAB DASH

In the era of AI-assisted development, a new paradigm of rapid and efficient coding is emerging. This project, SLAB DASH, stands as my first step into this transformative world. It's a testament to the boundless applications of AI-powered coding assistants and their ability to accelerate the creative process.

Using a tool like Cursor, I was able to translate a game concept into a fully functional prototype in a fraction of the time it would have traditionally taken. The synergy between human creativity and AI efficiency is profound; it allowed me to focus on the core game logic and creative elements rather than getting bogged down in boilerplate code or syntax.

This is more than just a simple game it’s a demonstration of how AI is democratizing software development, enabling developers to build sophisticated, working projects with unprecedented speed. The future of coding is collaborative, and this project is a clear preview of that reality.

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
  localStorage.removeItem("kaboom_platformer_highscore_v1");
  ```

### Customization

- Edit `main.js` to tweak:
  - Gravity, speeds: `setGravity`, `MOVE_SPEED`, `JUMP_FORCE`
  - Colors: `COLOR_GROUND`, `COLOR_PLATFORM`, ball color in player component
  - Slab generation: search for "Add more slabs" and adjust gap/width ranges

### Tech

- Built with Kaboom.js via CDN
- Plain HTML + JavaScript, no build step required

# Alexandra Kuturga — Producer Snake

A standalone 16×16 browser Snake game styled for a 1920×1080 desktop presentation.

## Run

No build step is required.

1. Unzip the folder.
2. Open `index.html` in a browser.

For local hosting, any static server works, e.g.:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Before publishing

Open `game.js` and edit:

```js
const CONTACT_EMAIL = "YOUR_EMAIL_HERE";
const CONTACT_URL = "";
```

You can use either:
- an email address, or
- a portfolio / LinkedIn / contact-page URL.

## Game

- Arrow keys or WASD
- 16×16 field
- 5 red milestone dots are placed at the start
- Every collected dot unlocks one production milestone
- Wall/self collision opens a retry + producer-contact modal
- Collecting all 5 opens the "Shipped" state

## Files

- `index.html` — page structure
- `styles.css` — visual design
- `game.js` — all game logic

## Main copy

Milestones:
1. Got the brief from the client
2. Aligned the team
3. Turned feedback into direction
4. Kept it on track
5. Shipped it

The page header is `Alexandra Kuturga`; there is no top-right navigation and no "Best Story Wins" mark.

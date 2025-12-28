# tv.ze.gs

This is a small web page to control a TV through SwitchBot.
The page has a simple table of buttons.

## Files

- `src/index.html` : the HTML page
- `src/styles.css` : the styles
- `src/app.js` : the JavaScript logic
- `test/app.test.js` : unit tests for the JavaScript
- `build.js` : builds one `dist/index.html` with inlined CSS and JS

## How to use

Open `src/index.html` in a browser, or build and use `dist/index.html`.

## Build

```bash
npm install
npm run build
```

The build creates `dist/index.html`.

## Test

```bash
npm test
```

## Deploy

GitHub Actions deploys `dist/index.html` to GitHub Pages on `main`.

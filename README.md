# NK Luxury site

Mobile-first marketing site for NK Luxury, rebuilt with Tailwind CSS and minimal JavaScript.

## Files
- `index.html` - site markup and Tailwind utility classes
- `src/tailwind.css` - Tailwind source, theme tokens, and custom motion styles
- `styles.css` - compiled Tailwind output used by the page
- `script.js` - reveal transitions, sticky header state, and WhatsApp order form logic
- `assets/` - local product and gallery images

## Run locally
Open `index.html` in a browser.

For Tailwind rebuilds:
```powershell
npm install
npm run build
```

For live Tailwind rebuilds while editing:
```powershell
npm run dev
```

## Notes
- The hero now uses a researched editorial background image instead of the local reference texture.
- Additional researched editorial images are stored in `assets/` as local WebP files.
- Update product copy directly in `index.html`.

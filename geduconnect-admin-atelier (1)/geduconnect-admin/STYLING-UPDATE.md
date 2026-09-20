# G Educonnect admin — Atelier styling update

## Run locally

1. Extract this project folder.
2. Run `npm install` from that folder.
3. Start your existing backend as usual.
4. Run `npm run dev`.

The API address remains `http://localhost:5000/api`. Authentication still uses the existing backend cookies.

## Applying to your existing project

Copy these five files into the same locations in your existing admin project:

- `src/premium.css` (new shared visual theme)
- `src/main.jsx` (imports the theme)
- `src/layouts/AdminLayout.jsx` (layout styling classes)
- `src/pages/Login.jsx` (login styling class)
- `src/pages/Dashboard.jsx` (dashboard styling classes)

No dependency or configuration changes are required. All remaining original project files are included unchanged. The generated dependency folder and build output are excluded; npm installs the correct packages for your operating system.

## Design changes

Floating midnight sidebar, amethyst gradient actions, translucent header, pearl-toned panels, decorative dashboard cards, refined tables, responsive forms, scrollable dialogs, gallery cards, keyboard focus styling, and reduced-motion support. The Atelier refinement changes only src/premium.css relative to the first premium version.

The original routes, state, event handlers, API calls, authentication, data rendering and content are preserved. Every original JavaScript/JSX file was compared structurally, excluding only className attributes and the new stylesheet import: 43 files passed. The new CSS parses successfully and the production build passes (with Vite's bundle-size advisory).

Live backend operations require your running backend and were not tested against production data. Browser visual verification was not completed in this environment.

To revert, remove the premium.css import from src/main.jsx. The added classes have no effects on application logic.

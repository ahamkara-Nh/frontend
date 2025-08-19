# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Environment Variables

The application uses environment variables for configuration. The following files are used:

- `.env.development` - Used during development with `npm run dev`
- `.env.production` - Used during production builds with `npm run build`
- `.env.local` - Optional local overrides (not committed to git)

Required variables:

- `VITE_API_BASE_URL` - The base URL for API calls (e.g., `http://localhost:8000`)

You can copy `.env.local.example` to `.env.local` to set up your local environment.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Render Static Site deployment

Quick checklist
- Build command: `npm ci && npm run build`
- Publish directory: `build/client`
- Start command: (leave empty)

Steps to deploy on Render (UI)
1. Go to Render dashboard and create a new "Static Site".
2. Connect your repo and choose the branch (e.g. `main`).
3. Set the **Build Command** to:

   ```bash
   npm ci && npm run build
   ```

4. Set the **Publish Directory** to:

   ```text
   build/client
   ```

5. (Optional) Add any environment variables if your app requires them.
6. Create the site and wait for the first build to finish. If build succeeds the site will be published.

Notes about your app
- The app uses a small `postbuild` helper (`scripts/fix-index.js`) to ensure `build/client/index.html` exists for static hosting.
- The app depends on `Puter` (loaded from `https://js.puter.com/v2/`). In the browser console you may see a 401 from `api.puter.com/whoami` when not signed in — this is expected until you log in via the auth UI.
- We added `hydrateFallback` exports for routes to improve perceived load UX while client modules initialize.

Optional `render.yaml` (infra-as-code)
If you want repository-declared configuration you can add a `render.yaml` file to the repo. Example (optional):

```yaml
services:
  - type: web
    name: ai-cv-analyser
    env: static
    plan: free
    buildCommand: npm ci && npm run build
    publishPath: build/client
```

If you want, I can add `render.yaml` to the repo for you. Otherwise, follow the UI steps above.

Local verification
1. Install deps and build:

```powershell
npm ci
npm run build
```

2. Preview the static site locally:

```powershell
npm run preview:static
# then open http://localhost:3000 in your browser (do not use file://)
```

If you still see blank content after these steps, open DevTools → Console and paste any errors here (notably 401s are expected when not authenticated).
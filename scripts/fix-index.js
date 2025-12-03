import fs from "fs";
import path from "path";

const root = process.cwd();
const buildDir = path.join(root, "build");
const clientDir = path.join(buildDir, "client");
const rootIndex = path.join(buildDir, "index.html");
const clientIndex = path.join(clientDir, "index.html");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function findFirstJs(dir) {
  if (!fs.existsSync(dir)) return null;
  // Prefer entry.client or entry files (these bootstrap the app)
  try {
    const assets = fs.readdirSync(dir);
    const prefer = assets.find((n) => /entry(\.client)?-.*\.(mjs|js)$/.test(n));
    if (prefer) return path.join(dir, prefer);
  } catch (e) {
    // fallthrough
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const found = findFirstJs(full);
      if (found) return found;
    } else if (/\.(mjs|js)$/.test(e.name)) {
      return full;
    }
  }
  return null;
}

try {
  ensureDir(clientDir);

  if (fs.existsSync(clientIndex)) {
    console.log("build/client/index.html already exists");
    process.exit(0);
  }

  if (fs.existsSync(rootIndex)) {
    fs.copyFileSync(rootIndex, clientIndex);
    console.log("Copied build/index.html -> build/client/index.html");
    process.exit(0);
  }

  // Try to generate a minimal index.html that loads the first client JS asset
  const firstJs = findFirstJs(clientDir);
  let scriptSrc = "";
  if (firstJs) {
    scriptSrc = path.relative(clientDir, firstJs).replace(/\\/g, "/");
  }

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>AI CV Analyser</title>
  </head>
  <body>
    <div id="root"></div>
    ${scriptSrc ? `<script type="module" src="./${scriptSrc}"></script>` : ""}
  </body>
</html>`;

  fs.writeFileSync(clientIndex, html, "utf8");
  console.log("Generated minimal build/client/index.html");
} catch (err) {
  console.error("Error ensuring client index:", err);
  process.exit(1);
}

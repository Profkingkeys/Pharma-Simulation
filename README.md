# Pharma Simulation

A complete browser campaign for learning the decisions in nonsterile extemporaneous dispensing.

[Download the offline game](https://github.com/Profkingkeys/Pharma-Simulation/releases/latest/download/Pharma-Simulation.html) · [Build status](https://github.com/Profkingkeys/Pharma-Simulation/actions/workflows/ci.yml) · [Collection](https://github.com/Profkingkeys/Simulation-Games)

## Play without a server

Download **Pharma-Simulation.html** from [Releases](https://github.com/Profkingkeys/Pharma-Simulation/releases), save it on your device, and open it in a modern browser. Three.js, game code and styling are bundled inside that one file. There is no account, API key, backend, CDN, font download or multiplayer service. If a mobile file manager only previews the document, use its “Open with browser” option or the hosted version after Pages is enabled.

The `index.html` at the repository root is the **development template**. Downloading that file alone will not run the game. The release file is the self-contained playable build.

## One continuous campaign

**Suspension chamber → ointment studio → solution suite.** Complete a mission and continue inside the same game. Make decisions using touch-friendly buttons or keyboard Tab/Enter. Every gameplay decision is available outside the canvas. The scene includes recognizable furniture/equipment, labels and an animated character. Reduced motion, pause, a teaching card, retry and downloadable attempt reports are built in. Completed missions are saved locally; no data is uploaded.

The three preparation methods have different teaching sequences. Wrong choices stop release; an unknown material must be quarantined. A symbolic virtual-patient failure animation explains the consequence without claiming to model pharmacology. Self-administration is never a quality check. Floating holograms represent inventory categories, not chemical synthesis. There are no real doses, concentrations, recipes or universal beyond-use dates.

## Build from source

Install Node.js 22 LTS or later and npm. From this directory:

```bash
npm ci
npm test
npm run build
```

Open **dist/index.html** directly in your browser. Alternatively:

```bash
npm start
```

Then open http://localhost:4173. This optional local HTTP server only serves files. It does not calculate gameplay, store patient records or run AI. A future multiplayer or securely authenticated AI service would need a backend; this release does not.

## Put the game online with GitHub Pages

1. Open [this repository’s Pages settings](https://github.com/Profkingkeys/Pharma-Simulation/settings/pages), not your personal profile settings.
2. Under **Build and deployment**, choose **GitHub Actions** as Source.
3. Open Actions → **Deploy game to Pages** → **Run workflow**.
4. Use the URL reported by the deployment job. The expected project path is `https://profkingkeys.github.io/Pharma-Simulation/` unless you configure a custom domain.

Pages serves the exact static bundle. No application server is required. See [GitHub’s publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## What has been checked

The CI gate runs the domain tests, JavaScript syntax checks and production bundling. Tests cover campaign completion, blocked invalid transitions, retry behavior and duplicate-scoring prevention. A successful build produces an offline artifact and a versioned downloadable release.

This is an educational prototype. A licensed pharmacist and local curriculum reviewer must validate the content before assessment or formal teaching. It is not a compounding standard, a clinical decision tool or a treatment simulator. Graphics use original procedural geometry. Three.js is MIT licensed; its license is retained in the distribution.

See [architecture](ARCHITECTURE.md), [teacher notes](TEACHER_NOTES.md) and [contributing](CONTRIBUTING.md).

If this has impacted you in any way, follow [Kingsley on GitHub](https://github.com/Profkingkeys), [X (Twitter)](https://x.com/Profkingkeys), and [LinkedIn](https://www.linkedin.com/in/prof-king-keys-110a24229).

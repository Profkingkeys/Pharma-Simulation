# Architecture

The domain engine holds plain, serializable campaign state. It accepts only actions offered by the current step and rejects terminal or out-of-order actions. UI buttons use the same transition function, so canvas rendering cannot bypass a rule. A mission can be retried without reloading the page.

The Three.js scene uses procedural meshes and canvas-text labels. It has no remote models, textures or font dependencies. If WebGL fails, the decision interface remains usable. Progress writes are best-effort localStorage; the journal is local and exports only on request. The application makes no fetch requests.

`src/domain/` contains scenario content and transitions. `src/web/` contains the interface and scene. `scripts/build.js` bundles Three.js and app code into a single HTML file. `scripts/serve.js` is an optional development file server. `test/` checks the state machine rather than asserting incidental CSS or mesh details.

All scenarios are deterministic. There is no live AI model in this release. Adding an AI coach later requires a separate reviewed content corpus, explicit uncertainty, evaluation against teacher rubrics, and server-side credentials. A model must not authorize clinical preparation or invent lesson rules.

Future graphics work can explore a separate native Filament renderer against the same scenario format. Filament is not implemented here and is not required to play the browser game.

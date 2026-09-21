import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };

createServer((request, response) => {
  const requested = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const path = normalize(join(process.cwd(), requested));
  if (!path.startsWith(process.cwd())) { response.writeHead(403).end(); return; }
  try {
    if (!statSync(path).isFile()) throw new Error("not a file");
    response.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream" });
    createReadStream(path).pipe(response);
  } catch {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("Not found");
  }
}).listen(port, () => console.log(`Pharma Simulation: http://localhost:${port}`));

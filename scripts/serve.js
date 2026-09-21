import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root=resolve('dist');
const port=Number(process.env.PORT||4173);
try { await stat(root+'/index.html'); } catch { console.error('Run npm run build first.');process.exit(1); }
createServer(async(req,res)=>{
 try {
  const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}
  const file=path===root?root+'/index.html':path;
  const data=await readFile(file);
  res.writeHead(200,{'content-type':extname(file)==='.html'?'text/html; charset=utf-8':'text/plain','x-content-type-options':'nosniff'});res.end(data);
 }catch{res.writeHead(404).end('Not found');}
}).listen(port,'0.0.0.0',()=>console.log('Pharma Simulation: http://localhost:'+port));

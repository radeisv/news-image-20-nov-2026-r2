// render.mjs — round 2f. Renders poster/poster.html in headless Chrome
// at exactly 1024x1024 through the DevTools protocol, probes the layout
// for overflow, then encodes entry.png as truecolour RGB with Pillow
// (no palette step). The byte target is the 700,000–760,000 band; the
// script prints the RGB size so the grain/art density can be tuned
// between runs. Chrome is found via $CHROME_PATH, the Playwright
// cache, then the system Chromium. Node stdlib only here (fetch +
// WebSocket); the Python side is one Pillow script.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const posterDir = dirname(fileURLToPath(import.meta.url));
const repoDir = dirname(posterDir);
const htmlPath = join(posterDir, 'poster.html');
const rawPath = join(tmpdir(), 'news20-r2f-raw.png');
const outPath = join(repoDir, 'entry.png');

function locateChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const cache = join(homedir(), '.cache', 'ms-playwright');
  if (existsSync(cache)) {
    for (const entry of readdirSync(cache).sort()) {
      const cand = join(cache, entry, 'chrome-linux', 'chrome');
      if (existsSync(cand)) return cand;
    }
  }
  if (existsSync('/opt/meta-chromium/chrome')) return '/opt/meta-chromium/chrome';
  throw new Error('no Chrome binary found; set CHROME_PATH');
}

class DevTools {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.seq = 0;
    this.pending = new Map();
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };
    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }
  async call(method, params = {}) {
    await this.ready;
    const id = ++this.seq;
    const done = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.ws.send(JSON.stringify({ id, method, params }));
    return done;
  }
  async evalJs(expr) {
    const r = await this.call('Runtime.evaluate', { expression: expr, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
}

async function main() {
  const chrome = locateChrome();
  const port = 9500 + (process.pid % 100);
  const child = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=' + join(tmpdir(), `news20-r2f-profile-${process.pid}`),
    'about:blank',
  ], { stdio: 'ignore' });
  try {
    let targets;
    for (let i = 0; i < 50; i++) {
      try {
        targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
    if (!targets) throw new Error('Chrome DevTools did not come up');
    const page = targets.find((t) => t.type === 'page');
    const dt = new DevTools(page.webSocketDebuggerUrl);
    await dt.call('Page.enable');
    await dt.call('Emulation.setDeviceMetricsOverride', { width: 1024, height: 1024, deviceScaleFactor: 1, mobile: false });
    await dt.call('Page.navigate', { url: 'file://' + htmlPath });
    await new Promise((r) => setTimeout(r, 1500));
    const probe = await dt.evalJs(`(() => {
      const res = { sheet: document.querySelector('.sheet').scrollHeight, overflow: [] };
      const check = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return;
        if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
          res.overflow.push(sel + ' sh=' + el.scrollHeight + ' ch=' + el.clientHeight + ' sw=' + el.scrollWidth + ' cw=' + el.clientWidth);
        }
      };
      ['.top', '.figures', '.regions', '.leads', '.grid', '.lower', '.datecheck', '.foot',
       '.lead:nth-child(1)', '.lead:nth-child(2)', '.lead:nth-child(3)',
       '.atlas', '.more'].forEach(check);
      document.querySelectorAll('.cell').forEach((el, i) => {
        if (el.scrollHeight > el.clientHeight + 1) res.overflow.push('.cell[' + i + '] sh=' + el.scrollHeight + ' ch=' + el.clientHeight);
      });
      return res;
    })()`);
    console.log('layout probe:', JSON.stringify(probe));
    const shot = await dt.call('Page.captureScreenshot', { format: 'png' });
    writeFileSync(rawPath, Buffer.from(shot.data, 'base64'));
    console.log('raw screenshot:', statSync(rawPath).size, 'bytes');
  } finally {
    child.kill();
  }

  const py = `
from PIL import Image
import os
raw = Image.open(${JSON.stringify(rawPath)}).convert('RGB')
assert raw.size == (1024, 1024), raw.size
raw.save(${JSON.stringify(outPath)}, optimize=True)
print('entry.png RGB bytes:', os.path.getsize(${JSON.stringify(outPath)}))
`;
  execFileSync('python3', ['-c', py], { stdio: 'inherit' });
}

main().catch((e) => { console.error(e); process.exit(1); });

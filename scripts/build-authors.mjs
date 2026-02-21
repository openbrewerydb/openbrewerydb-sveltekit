import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const postsDir = path.join(projectRoot, 'src', 'lib', 'data', 'posts');
const outFile = path.join(
  projectRoot,
  'src',
  'lib',
  'data',
  'github-authors.json'
);

function extractFrontmatter(content) {
  const start = content.indexOf('---');
  if (start !== 0) return '';
  const end = content.indexOf('\n---', 3);
  if (end === -1) return '';
  return content.slice(3, end + 1).trim();
}

function parseUsernamesFromFrontmatter(fm) {
  const usernames = new Set();
  if (!fm) return usernames;

  const lines = fm.split(/\r?\n/);
  let m;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    // author: foo
    m = line.match(/^author:\s*(.+)$/i);
    if (m) {
      usernames.add(m[1].replace(/^["']|["']$/g, ''));
      continue;
    }

    // authors: [a, b]
    m = line.match(/^authors:\s*\[(.*)\]\s*$/i);
    if (m) {
      m[1]
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
        .forEach((u) => usernames.add(u));
      continue;
    }

    // Multi-line arrays (very simple: expect lines like "- item")
    if (/^(authors):\s*$/i.test(line)) {
      i++;
      while (i < lines.length) {
        const li = lines[i];
        if (!/^\s*-\s+/.test(li)) {
          i--;
          break;
        }
        const val = li
          .replace(/^\s*-\s+/, '')
          .trim()
          .replace(/^["']|["']$/g, '');
        if (val) usernames.add(val);
        i++;
      }
    }
  }
  return usernames;
}

async function walk(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        files.push(...(await walk(full)));
      } else if (/\.(svx|md)$/.test(e.name)) {
        files.push(full);
      }
    }
    return files;
  } catch (err) {
    if (err && err.code === 'ENOENT') return [];
    throw err;
  }
}

async function fetchGithubUser(username, token) {
  const u = username.toLowerCase();
  const headers = { 'User-Agent': 'openbrewerydb-sveltekit' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(u)}`,
    { headers }
  );
  if (!res.ok) {
    console.warn(`[authors] Failed ${u}: ${res.status} ${res.statusText}`);
    return null;
  }
  const data = await res.json();
  return {
    login: data.login,
    name: data.name ?? null,
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    bio: data.bio ?? null,
  };
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const files = await walk(postsDir);
  const all = new Set();

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const fm = extractFrontmatter(content);
    const names = parseUsernamesFromFrontmatter(fm);
    for (const n of names) if (n) all.add(String(n).trim());
  }

  const uniq = [...all].map((s) => s.toLowerCase()).filter(Boolean);
  if (!uniq.length) {
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, JSON.stringify({}, null, 2) + '\n');
    console.log(
      `[authors] No usernames found. Wrote empty cache at ${path.relative(projectRoot, outFile)}`
    );
    return;
  }

  console.log(`[authors] Found ${uniq.length} usernames. Fetching profiles...`);
  const pairs = await Promise.all(
    uniq.map(async (u) => [u, await fetchGithubUser(u, token)])
  );
  const out = {};
  for (const [u, data] of pairs) if (data) out[u] = data;

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `[authors] Wrote ${Object.keys(out).length} profiles to ${path.relative(projectRoot, outFile)}`
  );
}

main().catch((err) => {
  console.error('[authors] Error:', err);
  process.exitCode = 1;
});

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outFile = path.join(
  projectRoot,
  'src',
  'lib',
  'data',
  'contributors.json'
);

const REPO = {
  owner: 'openbrewerydb',
  repo: 'openbrewerydb',
};

async function ghGet(url, token) {
  const headers = { 'User-Agent': 'openbrewerydb-sveltekit' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(
      `[contributors] GET ${url} -> ${res.status} ${res.statusText}`
    );
    return null;
  }
  return await res.json();
}

async function fetchContributors(owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
  const data = await ghGet(url, token);
  if (!Array.isArray(data)) return [];
  
  return data
    .sort((a, b) => b.contributions - a.contributions)
    .map((contributor) => ({
      login: contributor.login,
      id: contributor.id,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
      contributions: contributor.contributions,
    }));
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const { owner, repo } = REPO;
  const key = `${owner}/${repo}`;

  console.log(`[contributors] Fetching contributors for ${key} ...`);
  const contributors = await fetchContributors(owner, repo, token);

  const out = {
    generated_at: new Date().toISOString(),
    repository: key,
    source_url: `https://github.com/${owner}/${repo}`,
    count: contributors.length,
    contributors,
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `[contributors] Wrote ${contributors.length} contributors to ${path.relative(projectRoot, outFile)}`
  );
}

main().catch((err) => {
  console.error('[contributors] Error:', err);
  process.exitCode = 1;
});

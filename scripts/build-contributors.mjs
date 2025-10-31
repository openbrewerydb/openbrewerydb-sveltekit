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

const REPOS = [
  { owner: 'openbrewerydb', repo: 'openbrewerydb', type: 'dataset' },
  { owner: 'openbrewerydb', repo: 'openbrewerydb-laravel-api', type: 'api' },
  { owner: 'openbrewerydb', repo: 'openbrewerydb-sveltekit', type: 'website' },
];

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

async function fetchContributors(owner, repo, type, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
  const data = await ghGet(url, token);
  if (!Array.isArray(data)) return [];

  return data.map((contributor) => ({
    login: contributor.login,
    id: contributor.id,
    avatar_url: contributor.avatar_url,
    html_url: contributor.html_url,
    contributions: contributor.contributions,
    repo: type,
    repoUrl: `https://github.com/${owner}/${repo}`,
  }));
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const allContributors = new Map();

  for (const { owner, repo, type } of REPOS) {
    const key = `${owner}/${repo}`;
    console.log(`[contributors] Fetching contributors for ${key} ...`);
    const repoContributors = await fetchContributors(owner, repo, type, token);

    for (const contributor of repoContributors) {
      // Skip bots (including dependabot)
      if (contributor.login.includes('[bot]')) {
        continue;
      }

      const login = contributor.login.toLowerCase();
      if (allContributors.has(login)) {
        // Aggregate contributions for existing contributor
        const existing = allContributors.get(login);
        existing.totalContributions += contributor.contributions;
        existing.repos.push({
          type: contributor.repo,
          contributions: contributor.contributions,
          url: contributor.repoUrl,
        });
      } else {
        // Add new contributor
        allContributors.set(login, {
          login: contributor.login,
          id: contributor.id,
          avatar_url: contributor.avatar_url,
          html_url: contributor.html_url,
          totalContributions: contributor.contributions,
          repos: [
            {
              type: contributor.repo,
              contributions: contributor.contributions,
              url: contributor.repoUrl,
            },
          ],
        });
      }
    }
  }

  // Convert to array and sort by total contributions
  const aggregatedContributors = Array.from(allContributors.values()).sort(
    (a, b) => b.totalContributions - a.totalContributions
  );

  const out = {
    generated_at: new Date().toISOString(),
    repositories: REPOS.map((r) => `${r.owner}/${r.repo}`),
    count: aggregatedContributors.length,
    contributors: aggregatedContributors.map((c) => ({
      login: c.login,
      id: c.id,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
      contributions: c.totalContributions,
      repos: c.repos,
    })),
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `[contributors] Wrote ${aggregatedContributors.length} contributors from ${REPOS.length} repositories to ${path.relative(projectRoot, outFile)}`
  );
}

main().catch((err) => {
  console.error('[contributors] Error:', err);
  process.exitCode = 1;
});

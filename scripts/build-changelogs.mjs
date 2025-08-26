import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outFile = path.join(projectRoot, 'src', 'lib', 'data', 'changelogs.json');

const REPOS = [
  { owner: 'openbrewerydb', repo: 'openbrewerydb', type: 'dataset' },
  { owner: 'openbrewerydb', repo: 'openbrewerydb-laravel-api', type: 'api' },
];

// TODO:
function stripMarkdown(md = '') {
  // Very lightweight markdown to plain text: remove code blocks, images/links, headings, emphasis
  return (
    String(md)
      // code fences
      .replace(/```[\s\S]*?```/g, '')
      // inline code
      .replace(/`([^`]+)`/g, '$1')
      // images ![alt](url)
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, '')
      // links [text](url)
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // headings
      .replace(/^#{1,6}\s*/gm, '')
      // emphasis
      .replace(/([*_]{1,3})(\S.*?\S)\1/g, '$2')
      // blockquotes
      .replace(/^>\s?/gm, '')
      // horizontal rules
      .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '')
      // extra spaces
      .replace(/[\t ]+/g, ' ')
      .replace(/\s+$/gm, '')
      .trim()
  );
}

async function ghGet(url, token) {
  const headers = { 'User-Agent': 'openbrewerydb-sveltekit' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(`[changelogs] GET ${url} -> ${res.status} ${res.statusText}`);
    return null;
  }
  return await res.json();
}

async function fetchReleases(owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=30`;
  const data = await ghGet(url, token);
  if (!Array.isArray(data)) return [];
  return data
    .filter((r) => !r.draft) // exclude drafts; keep prereleases
    .map((r) => {
      const body = stripMarkdown(r.body || '');
      const previewMax = 600;
      const preview =
        body.length > previewMax ? body.slice(0, previewMax) : body;
      return {
        tag: r.tag_name || null,
        title: r.name || r.tag_name || '(untitled release)',
        date: r.published_at || r.created_at || null,
        url: r.html_url,
        notes: preview || null,
        notes_truncated: body.length > previewMax,
      };
    });
}

async function fetchClosedPRs(owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=20&sort=updated&direction=desc`;
  const data = await ghGet(url, token);
  if (!Array.isArray(data)) return [];
  return data.map((pr) => ({
    number: pr.number,
    title: pr.title,
    url: pr.html_url,
    state: pr.state, 
    merged_at: pr.merged_at,
    closed_at: pr.closed_at,
    user: pr.user
      ? {
          login: pr.user.login,
          html_url: pr.user.html_url,
          avatar_url: pr.user.avatar_url,
        }
      : null,
  }));
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const out = {
    generated_at: new Date().toISOString(),
    repos: {},
  };

  for (const { owner, repo, type } of REPOS) {
    const key = `${owner}/${repo}`;
    const source_url = `https://github.com/${owner}/${repo}`;

    console.log(`[changelogs] Fetching releases for ${key} ...`);
    const releases = await fetchReleases(owner, repo, token);

    let fallback = null;
    if (!releases.length) {
      console.log(
        `[changelogs] No releases for ${key}. Fetching recent closed PRs as fallback ...`
      );
      const prs = await fetchClosedPRs(owner, repo, token);
      fallback = { kind: 'pull_requests', items: prs };
    }

    out.repos[key] = { type, source_url, releases, fallback };
  }

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `[changelogs] Wrote changelogs to ${path.relative(projectRoot, outFile)}`
  );
}

main().catch((err) => {
  console.error('[changelogs] Error:', err);
  process.exitCode = 1;
});

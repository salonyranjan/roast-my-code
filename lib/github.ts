// Fetches a representative, budget-capped slice of a public GitHub repo:
// README + manifest files + a sample of source files, weighted toward
// files that are likely to be revealing (large, top-level, common entrypoints).

const CODE_EXTENSIONS = new Set([
  'js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rb', 'java', 'kt', 'c', 'cpp', 'cc',
  'h', 'hpp', 'cs', 'php', 'rs', 'swift', 'm', 'scala', 'sql', 'sh', 'vue',
  'svelte',
]);

const MANIFEST_FILES = new Set([
  'package.json', 'requirements.txt', 'pyproject.toml', 'Cargo.toml',
  'go.mod', 'pom.xml', 'build.gradle', 'Gemfile', 'composer.json',
]);

const IGNORE_DIR_SEGMENTS = [
  'node_modules/', 'dist/', 'build/', '.next/', 'vendor/', 'venv/',
  '.venv/', '__pycache__/', 'target/', '.git/', 'coverage/', 'out/',
  'lock', // catches package-lock.json etc loosely below via extension check too
];

const MAX_TOTAL_CHARS = 18000; // Reduced to keep tokens safely under ~4,500
const MAX_FILES = 6;           // Fewer files to prevent bundle bloat
const MAX_FILE_CHARS = 3000;   // Truncate large individual files earlier

export interface RepoFile {
  path: string;
  content: string;
}

export interface RepoBundle {
  owner: string;
  repo: string;
  description: string | null;
  stars: number;
  language: string | null;
  defaultBranch: string;
  files: RepoFile[];
  fileCountTotal: number;
  truncated: boolean;
}

export class GithubFetchError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function parseRepoUrl(input: string): { owner: string; repo: string } {
  const trimmed = input.trim().replace(/\.git$/, '').replace(/\/$/, '');
  const match = trimmed.match(
    /(?:github\.com[/:])([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/
  );
  if (!match) {
    throw new GithubFetchError(
      "That doesn't look like a GitHub repo URL. Try something like https://github.com/owner/repo",
      422
    );
  }
  return { owner: match[1], repo: match[2] };
}

async function ghFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'roast-my-code-app',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers, next: { revalidate: 0 } });
  return res;
}

function isIgnored(path: string): boolean {
  const lower = path.toLowerCase();
  if (IGNORE_DIR_SEGMENTS.some((seg) => lower.includes(seg))) return true;
  if (lower.endsWith('.lock') || lower.endsWith('-lock.json')) return true;
  if (lower.endsWith('.min.js') || lower.endsWith('.map')) return true;
  return false;
}

function fileWeight(path: string, size: number): number {
  const lower = path.toLowerCase();
  const depth = path.split('/').length;
  let score = Math.min(size, 20000) / 1000; // bigger files are juicier, capped
  score -= depth * 3; // prefer shallow files (more likely to be "the point")
  if (/^(src|app|lib|api|server|main)\//.test(path)) score += 8;
  if (/index\.|main\.|app\./.test(lower)) score += 6;
  if (MANIFEST_FILES.has(path.split('/').pop() || '')) score += 15;
  return score;
}

export async function fetchRepoBundle(owner: string, repo: string): Promise<RepoBundle> {
  const metaRes = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (metaRes.status === 404) {
    throw new GithubFetchError('Repo not found — check the URL and make sure the repo is public.', 404);
  }
  if (metaRes.status === 403) {
    throw new GithubFetchError('GitHub rate-limited this app. Try again in a few minutes.', 429);
  }
  if (!metaRes.ok) {
    throw new GithubFetchError('Could not reach GitHub for that repo.', 502);
  }
  const meta = await metaRes.json();
  const defaultBranch = meta.default_branch || 'main';

  const treeRes = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
  );
  if (!treeRes.ok) {
    throw new GithubFetchError('Could not read the file tree for that repo.', 502);
  }
  const tree = await treeRes.json();
  const allFiles: { path: string; size: number }[] = (tree.tree || [])
    .filter((n: any) => n.type === 'blob')
    .map((n: any) => ({ path: n.path as string, size: (n.size as number) || 0 }));

  const candidates = allFiles.filter((f) => {
    if (isIgnored(f.path)) return false;
    const ext = f.path.split('.').pop()?.toLowerCase() || '';
    const base = f.path.split('/').pop() || '';
    return CODE_EXTENSIONS.has(ext) || MANIFEST_FILES.has(base);
  });

  candidates.sort((a, b) => fileWeight(b.path, b.size) - fileWeight(a.path, a.size));
  const selected = candidates.slice(0, MAX_FILES);

  const readmeEntry = allFiles.find((f) => /^readme\.(md|txt)$/i.test(f.path));

  const files: RepoFile[] = [];
  let totalChars = 0;

  async function pullFile(path: string) {
    if (totalChars >= MAX_TOTAL_CHARS) return;
    const res = await ghFetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${path}`
    );
    if (!res.ok) return;
    let text = await res.text();
    if (text.length > MAX_FILE_CHARS) {
      text = text.slice(0, MAX_FILE_CHARS) + '\n... [truncated for the chef\'s sanity]';
    }
    if (totalChars + text.length > MAX_TOTAL_CHARS) {
      text = text.slice(0, Math.max(0, MAX_TOTAL_CHARS - totalChars));
    }
    if (!text.trim()) return;
    files.push({ path, content: text });
    totalChars += text.length;
  }

  if (readmeEntry) await pullFile(readmeEntry.path);
  for (const c of selected) {
    if (totalChars >= MAX_TOTAL_CHARS) break;
    await pullFile(c.path);
  }

  if (files.length === 0) {
    throw new GithubFetchError(
      "Couldn't find any recognizable source files to roast. Is this repo empty or all binaries?",
      422
    );
  }

  return {
    owner,
    repo,
    description: meta.description || null,
    stars: meta.stargazers_count || 0,
    language: meta.language || null,
    defaultBranch,
    files,
    fileCountTotal: allFiles.length,
    truncated: candidates.length > selected.length,
  };
}

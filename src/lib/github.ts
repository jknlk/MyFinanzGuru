const API_BASE = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    throw new GitHubConfigError(
      "GITHUB_TOKEN and GITHUB_REPO must be set to save content. Add them to your environment variables."
    );
  }

  return { token, repo, branch };
}

export class GitHubConfigError extends Error {}
export class GitHubConflictError extends Error {}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface GitHubFile {
  content: string; // decoded UTF-8 content
  sha: string;
}

/** Fetch a single file's content and sha from the repo. Returns null if not found. */
export async function getFile(path: string): Promise<GitHubFile | null> {
  const { token, repo, branch } = getConfig();
  const res = await fetch(
    `${API_BASE}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`,
    { headers: headers(token), cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub API error fetching ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

/** List files in a directory. Returns [] if the directory doesn't exist. */
export async function listDirectory(path: string): Promise<{ name: string; sha: string }[]> {
  const { token, repo, branch } = getConfig();
  const res = await fetch(
    `${API_BASE}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`,
    { headers: headers(token), cache: "no-store" }
  );

  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`GitHub API error listing ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((item: { name: string; sha: string }) => ({ name: item.name, sha: item.sha }));
}

/**
 * Create or update a file. Pass `sha` when updating an existing file (omit
 * to create a new one). Throws GitHubConflictError on a 409 sha mismatch so
 * callers can refetch and retry.
 */
export async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const { token, repo, branch } = getConfig();

  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (res.status === 409) {
    throw new GitHubConflictError(`Conflict saving ${path} — file changed since it was loaded.`);
  }
  if (!res.ok) {
    throw new Error(`GitHub API error saving ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { sha: data.content.sha };
}

/** Upload a binary file (base64 already encoded) — for images/PDFs. */
export async function putBinaryFile(
  path: string,
  base64Content: string,
  message: string
): Promise<{ sha: string }> {
  const { token, repo, branch } = getConfig();

  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: base64Content, branch }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error uploading ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { sha: data.content.sha };
}

export async function deleteFile(path: string, message: string, sha: string): Promise<void> {
  const { token, repo, branch } = getConfig();

  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${encodeURIComponent(path)}`, {
    method: "DELETE",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error deleting ${path}: ${res.status} ${await res.text()}`);
  }
}

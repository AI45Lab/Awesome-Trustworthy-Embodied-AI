// scripts/fetch-metrics.mjs
import { writeFile, mkdir } from "fs/promises";

const repos = [
  "AI45Lab/Safe-Trustworthy-EAI",
  "AI45Lab/Awesome-Trustworthy-Embodied-AI",
];

async function gh(url) {
  const res = await fetch(url, {
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`, // Actions 注入
      "User-Agent": "impact-metrics-bot",
    },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${t}`);
  }
  return res.json();
}

const out = {};
for (const repo of repos) {
  const d = await gh(`https://api.github.com/repos/${repo}`);
  out[repo] = {
    stargazers_count: d.stargazers_count,
    pushed_at: d.pushed_at,
    updated_at: d.updated_at,
    created_at: d.created_at,
    last_checked: new Date().toISOString(),
  };
}

await mkdir("public", { recursive: true }); // Vue CLI 会把 public 原样拷到 dist 根
await writeFile("public/impact_metrics.json", JSON.stringify(out, null, 2));
console.log("✔ wrote public/impact_metrics.json");

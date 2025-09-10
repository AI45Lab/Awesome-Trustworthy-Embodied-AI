// scripts/fetch-metrics.mjs
import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";

const repos = [
  "AI45Lab/Safe-Trustworthy-EAI",
  "AI45Lab/Awesome-Trustworthy-Embodied-AI",
];

const OUT_DIR = resolve(process.env.OUTPUT_DIR || ".");
const GH_TOKEN = process.env.GITHUB_TOKEN || "";

async function gh(url) {
  const res = await fetch(url, {
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(GH_TOKEN ? { "Authorization": `Bearer ${GH_TOKEN}` } : {}),
      "User-Agent": "impact-metrics-bot",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${res.status}] ${res.statusText} ${text}`.trim());
  }
  return res.json();
}

async function run() {
  console.log("OUTPUT_DIR:", OUT_DIR);
  const out = {};
  for (const repo of repos) {
    const url = `https://api.github.com/repos/${repo}`;
    const d = await gh(url);
    console.log(`→ ${repo}: stars=${d.stargazers_count}, pushed=${d.pushed_at}, updated=${d.updated_at}`);
    out[repo] = {
      stargazers_count: d.stargazers_count,
      pushed_at: d.pushed_at,
      updated_at: d.updated_at,
      created_at: d.created_at,
      last_checked: new Date().toISOString(),
    };
  }
  await mkdir(OUT_DIR, { recursive: true });
  const file = resolve(OUT_DIR, "impact_metrics.json");
  await writeFile(file, JSON.stringify(out, null, 2));
  console.log("✅ wrote:", file);
}

run().catch((e) => {
  console.error("❌ fetch-metrics failed:", e.message || e);
  process.exit(1);
});

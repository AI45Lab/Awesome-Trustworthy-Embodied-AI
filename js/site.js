const STAGES = [
  "Instruction Understanding",
  "Environment Perception",
  "Action Planning",
  "Physical Interaction",
];

const FACETS = [
  "Accuracy",
  "Reliability",
  "Controllability",
  "Explainability",
  "Auditability",
  "Attack Resistance",
  "Abuse Prevention",
  "Identifiability",
  "Privacy Protection",
  "Value Alignment",
];

const STATUS = [
  ["all", "All primary"],
  ["cited", "Cited in the manuscript"],
  ["repository", "Repository only"],
  ["coded", "Coded studies"],
  ["benchmark", "Benchmark or simulator"],
];

const state = {
  query: "",
  status: "all",
  cell: null,
  primary: [],
  contextual: [],
  other: [],
  counts: null,
};

const els = {
  counts: document.querySelector("#counts"),
  query: document.querySelector("#q"),
  status: document.querySelector("#status"),
  resultCount: document.querySelector("#result-count"),
  matrix: document.querySelector("#matrix"),
  clearCell: document.querySelector("#clear-cell"),
  results: document.querySelector("#results"),
  contextual: document.querySelector("#contextual"),
  contextualCount: document.querySelector("#contextual-count"),
  other: document.querySelector("#other"),
};

function haystack(record) {
  return [
    record.title,
    record.authors,
    record.year,
    record.venue,
    record.bibtex_key,
    record.study_id,
    record.supplement_label,
    record.doi,
    record.arxiv,
    ...(record.stages || []),
    ...(record.facets || []),
  ].join(" ").toLowerCase();
}

function matchesQuery(record) {
  if (!state.query) return true;
  return haystack(record).includes(state.query);
}

function matchesPrimary(record) {
  if (state.status === "cited" && !record.cited_in_manuscript) return false;
  if (state.status === "repository" && record.cited_in_manuscript) return false;
  if (state.status === "coded" && record.benchmark_or_simulator_only) return false;
  if (state.status === "benchmark" && !record.benchmark_or_simulator_only) return false;
  if (state.cell) {
    if (!record.stages.includes(state.cell.stage) || !record.facets.includes(state.cell.facet)) return false;
  }
  return matchesQuery(record);
}

function cellCount(stage, facet) {
  return state.primary.filter((record) => (
    !record.benchmark_or_simulator_only
    && record.stages.includes(stage)
    && record.facets.includes(facet)
  )).length;
}

function link(href, text) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.textContent = text;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  return anchor;
}

function badge(className, text) {
  const span = document.createElement("span");
  span.className = `badge ${className}`;
  span.textContent = text;
  return span;
}

function renderEntry(record) {
  const article = document.createElement("article");
  article.className = "entry";
  const heading = document.createElement("h3");
  if (record.url) heading.append(link(record.url, record.title));
  else heading.textContent = record.title;
  article.append(heading);

  if (record.authors) {
    const authors = document.createElement("p");
    authors.className = "authors";
    authors.textContent = record.authors;
    article.append(authors);
  }

  const meta = document.createElement("p");
  meta.className = "meta";
  const bits = [record.year || "n.d."];
  if (record.venue) bits.push(record.venue);
  meta.textContent = bits.join(" · ");
  if (record.arxiv && record.url && !record.url.includes(record.arxiv)) {
    meta.append(" · ");
    meta.append(link(`https://arxiv.org/abs/${record.arxiv}`, "arXiv"));
  }
  article.append(meta);

  const badges = document.createElement("div");
  badges.className = "badges";
  if (record.cited_in_manuscript === true) {
    badges.append(badge("badge-cited", `Cited · ref. ${record.manuscript_reference}`));
  } else if (record.cited_in_manuscript === false) {
    badges.append(badge("badge-repo", "Repository only"));
  }
  if (record.benchmark_or_simulator_only) badges.append(badge("badge-bench", "Benchmark or simulator"));
  if (record.in_bibliography === true) {
    badges.append(badge("badge-cited", `Cited · ref. ${record.manuscript_reference}`));
  } else if (record.in_bibliography === false) {
    badges.append(badge("badge-repo", "Not in the bibliography"));
  } else if (record.group) {
    badges.append(badge("badge-plain", record.group));
    if (record.manuscript_reference) badges.append(badge("badge-plain", `Ref. ${record.manuscript_reference}`));
  }
  if (record.bibtex_key) badges.append(badge("badge-plain", record.bibtex_key));
  article.append(badges);

  const tags = document.createElement("div");
  tags.className = "tag-row";
  for (const label of [...(record.stages || []), ...(record.facets || [])]) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = label;
    tags.append(tag);
  }
  if (tags.childNodes.length) article.append(tags);
  return article;
}

function renderList(container, records, emptyText) {
  container.replaceChildren();
  if (!records.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }
  for (const record of records) container.append(renderEntry(record));
}

function renderCounts() {
  const items = [
    [state.counts.primary, "Primary studies"],
    [state.counts.cited_primary, "Cited in the manuscript"],
    [state.counts.repository_only, "Listed only here"],
    [state.counts.coded, "Coded studies"],
    [state.counts.benchmark_only, "Benchmark or simulator"],
    [state.counts.contextual_sources, "Contextual sources"],
  ];
  els.counts.replaceChildren();
  for (const [value, label] of items) {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    const span = document.createElement("span");
    span.textContent = label;
    item.append(strong, span);
    els.counts.append(item);
  }
}

function renderStatus() {
  els.status.replaceChildren();
  for (const [value, label] of STATUS) {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "radio";
    button.setAttribute("aria-checked", String(state.status === value));
    button.textContent = label;
    button.addEventListener("click", () => {
      state.status = value;
      if (value === "benchmark") state.cell = null;
      render();
    });
    els.status.append(button);
  }
}

function renderMatrix() {
  const max = Math.max(1, ...STAGES.flatMap((stage) => FACETS.map((facet) => cellCount(stage, facet))));
  const table = document.createElement("table");
  table.className = "matrix";
  const head = document.createElement("tr");
  const corner = document.createElement("th");
  corner.textContent = "Stage \\ facet";
  head.append(corner);
  for (const facet of FACETS) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = facet;
    head.append(cell);
  }
  table.append(head);
  for (const stage of STAGES) {
    const row = document.createElement("tr");
    const label = document.createElement("th");
    label.className = "row-label";
    label.scope = "row";
    label.textContent = stage;
    row.append(label);
    for (const facet of FACETS) {
      const count = cellCount(stage, facet);
      const td = document.createElement("td");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(count);
      button.style.setProperty("--ink-alpha", (0.07 + 0.38 * (count / max)).toFixed(3));
      button.classList.toggle("is-zero", count === 0);
      const selected = state.cell && state.cell.stage === stage && state.cell.facet === facet;
      button.setAttribute("aria-pressed", String(Boolean(selected)));
      button.setAttribute("aria-label", `${stage} and ${facet}, ${count} studies`);
      button.addEventListener("click", () => {
        if (selected) state.cell = null;
        else {
          state.cell = { stage, facet };
          if (state.status === "benchmark") state.status = "coded";
        }
        render();
      });
      td.append(button);
      row.append(td);
    }
    table.append(row);
  }
  els.matrix.replaceChildren(table);
  const selected = Boolean(state.cell);
  els.clearCell.hidden = !selected;
}

function render() {
  renderStatus();
  renderMatrix();
  const primary = state.primary.filter(matchesPrimary);
  const contextual = state.contextual.filter(matchesQuery);
  const other = state.other.filter(matchesQuery);
  const cellText = state.cell ? ` in ${state.cell.stage} × ${state.cell.facet}` : "";
  els.resultCount.textContent = `Showing ${primary.length} of ${state.primary.length} primary studies${cellText}.`;
  renderList(els.results, primary, "No primary study matches these filters.");
  els.contextualCount.textContent = `(${contextual.length})`;
  renderList(els.contextual, contextual, "No contextual source matches this search.");
  renderList(els.other, other, "No other bibliography record matches this search.");
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

async function init() {
  try {
    const [primary, contextual, other, counts] = await Promise.all([
      loadJson("data/primary_studies.json"),
      loadJson("data/contextual_sources.json"),
      loadJson("data/bibliography_other.json"),
      loadJson("data/counts.json"),
    ]);
    state.primary = primary;
    state.contextual = contextual;
    state.other = other;
    state.counts = counts;
    renderCounts();
    render();
  } catch (error) {
    els.resultCount.textContent = `The study list could not be loaded. Open this page through a local web server or GitHub Pages. ${error.message}`;
  }
}

els.query.addEventListener("input", () => {
  state.query = els.query.value.trim().toLowerCase();
  render();
});

els.clearCell.addEventListener("click", () => {
  state.cell = null;
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== els.query) {
    event.preventDefault();
    els.query.focus();
  }
});

init();

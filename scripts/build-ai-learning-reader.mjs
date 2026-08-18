import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const LEVEL_META = {
  must: { label: "必学", order: 0 },
  optional: { label: "选学", order: 1 },
  lookup: { label: "回查", order: 2 },
};

function readArguments(argv) {
  const values = new Map();

  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];

    if (!key?.startsWith("--") || !value) {
      throw new Error(`Invalid argument near ${key || "<empty>"}`);
    }

    values.set(key.slice(2), value);
  }

  const materialsRoot = values.get("materials-root");
  const workspaceRoot = values.get("workspace-root");
  const output = values.get("output");

  if (!materialsRoot || !workspaceRoot || !output) {
    throw new Error(
      "Usage: node scripts/build-ai-learning-reader.mjs --materials-root <path> --workspace-root <path> --output <path>"
    );
  }

  return {
    materialsRoot: path.resolve(materialsRoot),
    workspaceRoot: path.resolve(workspaceRoot),
    output: path.resolve(output),
  };
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex").toUpperCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function stripMarkdown(value) {
  return value
    .replace(/^\s*[-*]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "")
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInlineMarkdown(value) {
  const links = [];
  let source = value.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_, label, href) => {
    const token = `__INLINE_LINK_${links.length}__`;
    links.push(
      `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`
    );
    return token;
  });

  source = escapeHtml(source)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  links.forEach((link, index) => {
    source = source.replace(`__INLINE_LINK_${index}__`, link);
  });

  return source;
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  const paragraph = [];
  let listType = "";
  let inCode = false;
  let codeLines = [];
  let inQuote = false;

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) output.push(`<p>${renderInlineMarkdown(text)}</p>`);
    paragraph.length = 0;
  };

  const closeList = () => {
    if (listType) output.push(`</${listType}>`);
    listType = "";
  };

  const closeQuote = () => {
    if (inQuote) output.push("</blockquote>");
    inQuote = false;
  };

  for (const line of lines) {
    if (/^```/.test(line)) {
      flushParagraph();
      closeList();
      closeQuote();
      if (inCode) {
        output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      closeQuote();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      closeQuote();
      const level = heading[1].length;
      output.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const quote = line.match(/^\s*>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      closeList();
      if (!inQuote) {
        output.push("<blockquote>");
        inQuote = true;
      }
      output.push(`<p>${renderInlineMarkdown(quote[1])}</p>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      closeQuote();
      if (listType !== "ul") {
        closeList();
        output.push("<ul>");
        listType = "ul";
      }
      output.push(`<li>${renderInlineMarkdown(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      closeQuote();
      if (listType !== "ol") {
        closeList();
        output.push("<ol>");
        listType = "ol";
      }
      output.push(`<li>${renderInlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    closeList();
    closeQuote();
    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  closeQuote();
  if (inCode) output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  return output.join("\n");
}

function parseNumberRanges(value) {
  const ranges = [];

  for (const part of value.split(/[、,，]/)) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) continue;

    ranges.push({
      startLine: Number(match[1]),
      endLine: Number(match[2] || match[1]),
    });
  }

  return ranges;
}

function parseStudyRanges(line) {
  const ranges = [];
  const explicitPattern =
    /第\s*(\d+(?:\s*-\s*\d+)?(?:\s*[、,，]\s*\d+(?:\s*-\s*\d+)?)*)\s*行/g;
  const pathPattern =
    /:(\d+(?:\s*-\s*\d+)?(?:\s*[,，]\s*\d+(?:\s*-\s*\d+)?)*)/g;

  for (const match of line.matchAll(explicitPattern)) {
    ranges.push(...parseNumberRanges(match[1]));
  }

  for (const match of line.matchAll(pathPattern)) {
    ranges.push(...parseNumberRanges(match[1]));
  }

  const seen = new Set();
  return ranges.filter((range) => {
    const key = `${range.startLine}-${range.endLine}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parsePageRanges(line) {
  const ranges = [];
  const patterns = [
    /Page\s*(\d+)(?:\s*-\s*(\d+))?/gi,
    /页面?\s*(\d+)(?:\s*(?:-|至)\s*(\d+))?\s*页?/g,
    /第\s*(\d+)(?:\s*(?:-|至)\s*(\d+))?\s*页/g,
  ];

  for (const pattern of patterns) {
    for (const match of line.matchAll(pattern)) {
      ranges.push({
        startPage: Number(match[1]),
        endPage: Number(match[2] || match[1]),
      });
    }
  }

  const seen = new Set();
  return ranges.filter((range) => {
    const key = `${range.startPage}-${range.endPage}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sourceCandidates(document) {
  const localFile = document.localFile || "";
  const localBase = localFile ? path.basename(localFile, path.extname(localFile)) : "";
  const title = document.title || "";

  return unique([
    localFile,
    localFile ? path.basename(localFile) : "",
    localBase,
    title,
    title ? `${title}.md` : "",
    title ? `${title}.pdf` : "",
    title ? `${title}.txt` : "",
  ]).filter((candidate) => candidate.length >= 6);
}

function findSourceBody(document, materialsRoot, workspaceRoot) {
  if (document.localFile && /\.md$/i.test(document.localFile)) {
    const markdownPath = path.join(materialsRoot, document.localFile);
    if (existsSync(markdownPath)) {
      return {
        body: readFileSync(markdownPath, "utf8"),
        sourceKind: "markdown",
        sourcePath: document.localFile,
      };
    }
  }

  const textCandidates = [];

  if (document.ocrTextFile) {
    textCandidates.push(
      path.isAbsolute(document.ocrTextFile)
        ? document.ocrTextFile
        : path.join(workspaceRoot, document.ocrTextFile.replaceAll("/", path.sep))
    );
  }

  if (document.localFile && /\.pdf$/i.test(document.localFile)) {
    textCandidates.push(
      path.join(
        workspaceRoot,
        "work",
        "pdf-text",
        `${path.basename(document.localFile, ".pdf")}.txt`
      )
    );
  }

  for (const textPath of unique(textCandidates)) {
    if (existsSync(textPath)) {
      return {
        body: readFileSync(textPath, "utf8"),
        sourceKind: "pdf-text",
        sourcePath: path.relative(workspaceRoot, textPath).replaceAll(path.sep, "/"),
      };
    }
  }

  return {
    body: "",
    sourceKind: "unavailable",
    sourcePath: document.localFile || "",
  };
}

function findSourceSection(lines) {
  const start = lines.findIndex(
    (line) => /^##\s+/.test(line) && /(逐条)?来源(定位|索引)/.test(line)
  );

  if (start === -1) {
    return { start: -1, end: -1 };
  }

  const relativeEnd = lines
    .slice(start + 1)
    .findIndex((line) => /^##\s+/.test(line));

  return {
    start,
    end: relativeEnd === -1 ? lines.length : start + 1 + relativeEnd,
  };
}

function lineRiskLevel(line) {
  if (/\[(原文不足|待核验|条件核验|外部核验)\]/.test(line)) {
    return "lookup";
  }

  return "must";
}

function collectStudyMetadata(document, themes) {
  const candidates = sourceCandidates(document);
  const topics = [];
  const hints = [];
  const studyRanges = [];
  const pageRanges = [];
  let mentionedOutsideSourceMap = false;
  let sourceMapLevel = null;

  for (const theme of themes) {
    let mentionedInTheme = false;

    theme.lines.forEach((line, lineIndex) => {
      const matched = candidates.some((candidate) => line.includes(candidate));
      if (!matched) return;

      mentionedInTheme = true;
      const cleanHint = stripMarkdown(line);
      if (cleanHint) hints.push(cleanHint);
      studyRanges.push(...parseStudyRanges(line));
      pageRanges.push(...parsePageRanges(line));

      const inSourceMap =
        theme.sourceSection.start !== -1 &&
        lineIndex > theme.sourceSection.start &&
        lineIndex < theme.sourceSection.end;

      if (inSourceMap) {
        const nextLevel = lineRiskLevel(line);
        if (nextLevel === "must") {
          sourceMapLevel = "must";
        } else if (!sourceMapLevel) {
          sourceMapLevel = "lookup";
        }
      } else {
        mentionedOutsideSourceMap = true;
      }
    });

    if (mentionedInTheme) {
      topics.push(theme.sectionId);
    }
  }

  let studyLevel = sourceMapLevel || (mentionedOutsideSourceMap ? "optional" : "optional");

  if (
    !document.body ||
    /unavailable|empty_or_no_content/i.test(document.status || "") ||
    /(核验|验收|报告)/.test(document.title || "")
  ) {
    studyLevel = "lookup";
  }

  return {
    studyLevel,
    topics: unique(topics),
    learningHints: unique(hints).slice(0, 12),
    studyRanges: unique(
      studyRanges.map((range) => `${range.startLine}-${range.endLine}`)
    ).map((range) => {
      const [startLine, endLine] = range.split("-").map(Number);
      return { startLine, endLine };
    }),
    pageRanges: unique(
      pageRanges.map((range) => `${range.startPage}-${range.endPage}`)
    ).map((range) => {
      const [startPage, endPage] = range.split("-").map(Number);
      return { startPage, endPage };
    }),
  };
}

function loadThemes(materialsRoot) {
  const themeRoot = path.join(materialsRoot, "细化学习", "主题");
  const themeFiles = [
    "01-基础与Transformer-细化稿.md",
    "04-Prompt上下文对话记忆-细化稿.md",
    "05-06-RAG文档工程优化评测-细化稿.md",
    "07-08-Agent-MCP-Skill-细化稿.md",
    "09-预训练微调对齐-细化稿.md",
    "10-分布式训练推理部署-细化稿.md",
    "11-应用框架低代码落地-细化稿.md",
    "12-13-后端生产治理安全-细化稿.md",
    "14-综合项目与口头复述-细化稿.md",
  ];

  return themeFiles.map((fileName, index) => {
    const source = readFileSync(path.join(themeRoot, fileName), "utf8");
    const lines = source.split(/\r?\n/);

    return {
      fileName,
      sectionId: `section-${index + 2}`,
      lines,
      sourceSection: findSourceSection(lines),
    };
  });
}

function loadConversationSupplement(repoRoot) {
  const sourceThreadId = "01a008fe-af2e-7c63-9c56-ac65f887315b";
  const transcriptPath = path.join(
    repoRoot,
    "data",
    "ai-learning",
    "conversation-01a008fe-transcript.md"
  );
  const guidePath = path.join(
    repoRoot,
    "data",
    "ai-learning",
    "conversation-01a008fe-study-guide.md"
  );
  const transcriptBody = readFileSync(transcriptPath, "utf8");
  const guideBody = readFileSync(guidePath, "utf8");

  return {
    sectionId: "section-11",
    title: "从 Transformer 论文到现代 LLM、扩散模型与 RAG",
    articleHtml: renderMarkdown(guideBody.replace(/^#\s+[^\r\n]+(\r?\n|$)/, "")),
    documents: [
      {
        id: "conversation-01a008fe-study-guide",
        title: "对话补充：论文驱动的现代 AI 学习路线",
        slug: "",
        localFile: "data/ai-learning/conversation-01a008fe-study-guide.md",
        status: "conversation_supplement",
        reviewStatus: "conversation_supplement",
        reviewSummary: "根据指定对话整理的学习路线，不属于语雀原文。",
        sourceKind: "conversation-note",
        sourcePath: "data/ai-learning/conversation-01a008fe-study-guide.md",
        sourceThreadId,
        body: guideBody,
        bodySha256: sha256(guideBody),
        studyLevel: "must",
        topics: ["section-11"],
        learningHints: [
          "必学：论文精读、原始 Transformer 实现、Decoder-Only GPT、GPT-2 训练、现代 LLaMA Block。",
          "必做：PostgreSQL + pgvector + BM25 + 混合检索 + Reranker + RAG Evaluation。",
        ],
        studyRanges: [{ startLine: 1, endLine: guideBody.split(/\r?\n/).length }],
        pageRanges: [],
      },
      {
        id: "conversation-01a008fe-transcript",
        title: "对话摘录：课程选择与 Transformer 学习路线",
        slug: "",
        localFile: "data/ai-learning/conversation-01a008fe-transcript.md",
        status: "conversation_excerpt",
        reviewStatus: "conversation_excerpt",
        reviewSummary: "指定对话中的用户问题与最终回答要点，用于回查讨论语境。",
        sourceKind: "conversation-transcript",
        sourcePath: "data/ai-learning/conversation-01a008fe-transcript.md",
        sourceThreadId,
        body: transcriptBody,
        bodySha256: sha256(transcriptBody),
        studyLevel: "lookup",
        topics: ["section-11"],
        learningHints: [
          "回查：用户已有基础、课程选择理由、视频定位、论文脚注符号解释。",
        ],
        studyRanges: [],
        pageRanges: [],
      },
    ],
  };
}

function buildSourceData(
  manifest,
  materialsRoot,
  workspaceRoot,
  themes,
  supplementalDocuments
) {
  const documents = manifest.documents.map((document, index) => {
    const source = findSourceBody(document, materialsRoot, workspaceRoot);
    const withBody = {
      ...document,
      id: `source-${String(index + 1).padStart(4, "0")}`,
      localFile: document.localFile || "",
      body: source.body,
      bodySha256: source.body ? sha256(source.body) : "",
      sourceKind: source.sourceKind,
      sourcePath: source.sourcePath,
    };
    const study = collectStudyMetadata(withBody, themes);

    return {
      id: withBody.id,
      title: withBody.title || withBody.localFile || `资料 ${index + 1}`,
      slug: withBody.slug || "",
      localFile: withBody.localFile,
      status: withBody.status || "",
      reviewStatus: withBody.reviewStatus || "",
      reviewSummary: withBody.reviewSummary || "",
      sourceKind: withBody.sourceKind,
      sourcePath: withBody.sourcePath,
      body: withBody.body,
      bodySha256: withBody.bodySha256,
      studyLevel: study.studyLevel,
      topics: study.topics,
      learningHints: study.learningHints,
      studyRanges: study.studyRanges,
      pageRanges: study.pageRanges,
    };
  });

  documents.push(...supplementalDocuments);

  documents.sort((left, right) => {
    const levelDifference =
      LEVEL_META[left.studyLevel].order - LEVEL_META[right.studyLevel].order;
    return levelDifference || left.title.localeCompare(right.title, "zh-CN");
  });

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceKnowledgeBase: manifest.sourceKnowledgeBase,
    counts: {
      total: documents.length,
      readable: documents.filter((document) => document.body).length,
      unavailable: documents.filter((document) => !document.body).length,
      must: documents.filter((document) => document.studyLevel === "must").length,
      optional: documents.filter((document) => document.studyLevel === "optional").length,
      lookup: documents.filter((document) => document.studyLevel === "lookup").length,
    },
    documents,
  };
}

function removeGeneratedBlock(source, startMarker, endMarker) {
  const pattern = new RegExp(
    `${startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${endMarker.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}`,
    "g"
  );
  return source.replace(pattern, "");
}

function injectBefore(source, marker, content) {
  const index = source.indexOf(marker);
  if (index === -1) {
    throw new Error(`Unable to find injection marker: ${marker}`);
  }
  return `${source.slice(0, index)}${content}${source.slice(index)}`;
}

function buildStyles() {
  return `
/* AI_SOURCE_LAYER_START */
:root {
  --canvas: #f6f4ef;
  --paper: #fffefa;
  --ink: #1d1b18;
  --muted: #6e675f;
  --line: #ddd7cc;
  --blue: #a65312;
  --blue-soft: #f8eadc;
  --green: #2f6b52;
  --quote: #eef5ef;
}
body { background: var(--canvas); font-family: "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; }
aside { background: #252925; }
.reading-progress span { background: #d97706; }
.topbar,
.reading-section { box-shadow: none; border: 1px solid var(--line); }
.topbar { border-left: 5px solid #d97706; }
.reader-toolbar .source-library-button { margin-left: 4px; color: #fff; border-color: #b85f11; background: #b85f11; }
.reader-toolbar .source-library-button:hover,
.reader-toolbar .source-library-button:focus-visible { color: #fff; border-color: #8f4309; background: #8f4309; }
.reader-back-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  background: var(--paper);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}
.reader-back-link:hover,
.reader-back-link:focus-visible {
  color: #9a4b0c;
  border-color: #d97706;
  outline: 2px solid rgba(217, 119, 6, .16);
  outline-offset: 2px;
}
.source-shelf {
  max-width: var(--reading-width);
  margin: -8px 0 30px;
  padding: 18px 0 20px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.source-shelf-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.source-shelf-heading strong { font-size: 16px; }
.source-shelf-heading span { color: var(--muted); font-size: 13px; }
.source-shelf-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.source-shelf button,
.source-filter,
.source-close,
.source-document-button {
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  background: var(--paper);
  font: inherit;
  cursor: pointer;
}
.source-shelf button { padding: 8px 12px; font-weight: 700; }
.source-shelf button[data-level="must"] { color: #9a3f08; border-color: #e8b889; background: #fff4e7; }
.source-shelf button[data-level="optional"] { color: #285c47; border-color: #afd0bf; background: #eff7f2; }
.source-shelf button[data-level="lookup"] { color: #5c556c; border-color: #cbc3d8; background: #f5f2f8; }
.source-shelf button:hover,
.source-shelf button:focus-visible,
.source-filter:hover,
.source-filter:focus-visible,
.source-document-button:hover,
.source-document-button:focus-visible {
  border-color: #d97706;
  outline: 2px solid rgba(217, 119, 6, .16);
  outline-offset: 2px;
}
.source-viewer[hidden] { display: none; }
.source-viewer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  color: #1d1b18;
  background: #f6f4ef;
}
body.source-viewer-open { overflow: hidden; }
.source-viewer-header {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 68px;
  padding: max(12px, env(safe-area-inset-top)) 18px 12px;
  border-bottom: 1px solid #d8d1c6;
  background: #fffefa;
}
.source-viewer-header-copy { min-width: 0; flex: 1; }
.source-viewer-header h2 { margin: 0; color: #1d1b18; font-size: 20px; }
.source-viewer-header p { margin: 2px 0 0; color: #6e675f; font-size: 13px; }
.source-close { width: 44px; padding: 0; font-size: 28px; line-height: 1; }
.source-viewer-layout { min-height: 0; display: grid; grid-template-columns: minmax(270px, 340px) minmax(0, 1fr); }
.source-browser {
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  border-right: 1px solid #d8d1c6;
  background: #f0ede7;
}
.source-search-wrap { padding: 14px 14px 10px; }
.source-search {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #cfc7bb;
  border-radius: 6px;
  color: #1d1b18;
  background: #fffefa;
  font: inherit;
}
.source-filters { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 0 14px 12px; }
.source-filter { min-width: 0; padding: 7px 4px; color: #5e574f; font-size: 12px; }
.source-filter[aria-pressed="true"] { color: #fff; border-color: #9a4b0c; background: #9a4b0c; }
.source-list { min-height: 0; overflow: auto; padding: 0 10px calc(14px + env(safe-area-inset-bottom)); }
.source-document-button {
  width: 100%;
  min-height: 0;
  margin: 0 0 7px;
  padding: 11px 12px;
  text-align: left;
}
.source-document-button[aria-current="true"] { border-color: #d97706; background: #fff7ed; }
.source-document-title { display: block; color: #1d1b18; font-size: 14px; font-weight: 700; line-height: 1.45; }
.source-document-meta { display: block; margin-top: 5px; color: #766f66; font-size: 11px; }
.source-reader {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 26px clamp(18px, 4vw, 58px) calc(56px + env(safe-area-inset-bottom));
  background: #fffefa;
}
.source-reader-inner { width: min(100%, 92ch); margin: 0 auto; }
.source-reader-kicker { color: #9a4b0c; font-size: 12px; font-weight: 800; }
.source-reader h3 { max-width: none; margin: 5px 0 8px; color: #1d1b18; font-size: clamp(24px, 3vw, 36px); }
.source-reader-meta { color: #6e675f; font-size: 13px; }
.source-hints { margin: 22px 0; padding: 16px 18px; border-left: 4px solid #d97706; background: #fff7ed; }
.source-hints h4 { margin: 0 0 8px; color: #1d1b18; font-size: 15px; }
.source-hints ul { margin: 0; padding-left: 20px; }
.source-hints li { max-width: none; margin: 5px 0; color: #514b44; font-size: 14px; }
.source-body-note { margin: 18px 0; color: #6e675f; font-size: 13px; }
.source-lines {
  overflow: hidden;
  border-top: 1px solid #ded7cc;
  border-bottom: 1px solid #ded7cc;
  background: #fffefa;
  counter-reset: source-line;
}
.source-line {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  min-height: 29px;
  color: #37322d;
  font-family: "Noto Sans Mono CJK SC", "Sarasa Mono SC", Consolas, monospace;
  font-size: 15px;
  line-height: 1.75;
}
.source-line::before {
  counter-increment: source-line;
  content: counter(source-line);
  padding: 2px 12px 2px 0;
  color: #a1998f;
  border-right: 1px solid #eee8df;
  text-align: right;
  user-select: none;
}
.source-line-text { min-width: 0; padding: 2px 0 2px 15px; white-space: pre-wrap; overflow-wrap: anywhere; }
.source-line.is-study { background: #fff0d9; }
.source-line.is-page-marker { color: #2f6b52; border-top: 1px solid #c9ddcf; border-bottom: 1px solid #c9ddcf; background: #eef5ef; font-weight: 800; }
.source-empty { padding: 22px; border: 1px solid #d8d1c6; color: #6e675f; background: #f7f4ef; }
.level-chip { display: inline-flex; align-items: center; min-height: 24px; padding: 2px 7px; border: 1px solid currentColor; border-radius: 4px; font-size: 11px; font-weight: 800; }
.level-chip[data-level="must"] { color: #9a3f08; }
.level-chip[data-level="optional"] { color: #2f6b52; }
.level-chip[data-level="lookup"] { color: #655978; }
.ask-ai-action[hidden],
.feynman-panel[hidden] { display: none; }
.ask-ai-action {
  position: fixed;
  z-index: 130;
  min-width: 82px;
  min-height: 44px;
  padding: 9px 14px;
  border: 1px solid #9a4b0c;
  border-radius: 6px;
  color: #fff;
  background: #b85f11;
  box-shadow: 0 8px 22px rgba(54, 36, 18, .22);
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.ask-ai-action:hover,
.ask-ai-action:focus-visible {
  border-color: #713507;
  background: #8f4309;
  outline: 3px solid rgba(217, 119, 6, .2);
  outline-offset: 2px;
}
.ask-ai-action[data-invalid="true"] {
  color: #7a271a;
  border-color: #f0a79b;
  background: #fff1ef;
}
.feynman-panel {
  position: fixed;
  z-index: 140;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom));
  width: min(430px, calc(100vw - 40px));
  max-height: calc(100vh - 40px - env(safe-area-inset-top));
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border: 1px solid #cfc7bb;
  border-radius: 8px;
  color: #1d1b18;
  background: #fffefa;
  box-shadow: 0 18px 48px rgba(40, 35, 29, .28);
}
.feynman-panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 68px;
  padding: 12px 14px 12px 18px;
  border-bottom: 1px solid #ded7cc;
  background: #f7f3ec;
}
.feynman-panel-heading { min-width: 0; flex: 1; }
.feynman-panel-kicker { color: #9a4b0c; font-size: 11px; font-weight: 900; }
.feynman-panel h2 {
  margin: 2px 0 0;
  overflow-wrap: anywhere;
  color: #1d1b18;
  font-size: 18px;
}
.feynman-close {
  width: 44px;
  min-width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid #cfc7bb;
  border-radius: 6px;
  color: #4b443d;
  background: #fffefa;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
}
.feynman-panel-body {
  min-height: 0;
  overflow: auto;
  padding: 18px;
}
.feynman-privacy {
  margin: 0 0 12px;
  color: #6e675f;
  font-size: 12px;
  line-height: 1.55;
}
.feynman-selection-preview {
  margin: 0 0 16px;
  padding: 11px 13px;
  border-left: 3px solid #2f6b52;
  color: #3d4943;
  background: #eef5ef;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-wrap;
}
.feynman-status {
  min-height: 24px;
  margin: 0 0 14px;
  color: #6e675f;
  font-size: 13px;
}
.feynman-status[data-state="loading"] {
  color: #8f4309;
  font-weight: 800;
}
.feynman-status[data-state="loading"]::before {
  content: "";
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-right: 8px;
  border: 2px solid #e8b889;
  border-top-color: #9a4b0c;
  border-radius: 50%;
  animation: feynman-spin .8s linear infinite;
}
@keyframes feynman-spin { to { transform: rotate(360deg); } }
.feynman-answer {
  margin: 0;
  padding: 0;
  overflow: visible;
  color: #28231f;
  background: transparent;
  font-family: "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.feynman-error {
  padding: 14px;
  border-left: 4px solid #b42318;
  color: #7a271a;
  background: #fff1ef;
}
.feynman-error p { margin: 0 0 12px; font-size: 14px; }
.feynman-retry {
  min-height: 44px;
  padding: 8px 13px;
  border: 1px solid #b42318;
  border-radius: 6px;
  color: #7a271a;
  background: #fff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}
body[data-theme="dark"] .source-shelf button { color: var(--ink); background: var(--paper); }
@media (max-width: 850px) {
  .source-viewer-header { min-height: 60px; }
  .source-viewer-header h2 { font-size: 17px; }
  .source-viewer-layout { display: grid; grid-template-columns: 1fr; grid-template-rows: minmax(190px, 34vh) minmax(0, 1fr); }
  .source-browser { border-right: 0; border-bottom: 1px solid #d8d1c6; }
  .source-filters { gap: 4px; }
  .source-list { display: flex; align-items: flex-start; gap: 7px; overflow-x: auto; overflow-y: hidden; padding: 0 12px 12px; }
  .source-document-button { flex: 0 0 72vw; max-width: 310px; margin: 0; }
  .source-reader { padding: 20px 14px calc(54px + env(safe-area-inset-bottom)); }
  .source-reader h3 { font-size: 25px; }
  .source-line { grid-template-columns: 42px minmax(0, 1fr); font-size: 14px; line-height: 1.7; }
  .source-line::before { padding-right: 8px; }
  .source-line-text { padding-left: 10px; }
  .ask-ai-action {
    top: auto !important;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    left: 12px !important;
    width: auto;
  }
  .feynman-panel {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: min(74vh, 680px);
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 8px 8px 0 0;
  }
  .feynman-panel-header { padding-top: max(12px, env(safe-area-inset-top)); }
  .feynman-panel-body { padding-bottom: calc(20px + env(safe-area-inset-bottom)); }
}
/* AI_SOURCE_LAYER_END */
`;
}

function buildViewerMarkup(sourceData) {
  return `
<!-- AI_SOURCE_VIEWER_START -->
<section id="sourceViewer" class="source-viewer" hidden aria-modal="true" role="dialog" aria-labelledby="sourceViewerTitle">
  <header class="source-viewer-header">
    <div class="source-viewer-header-copy">
      <h2 id="sourceViewerTitle">原文学习台</h2>
      <p>${sourceData.counts.total} 条资料 · ${sourceData.counts.readable} 条可读正文 · 全部留在当前网页</p>
    </div>
    <button id="sourceViewerClose" class="source-close" type="button" aria-label="关闭原文学习台" title="关闭">&times;</button>
  </header>
  <div class="source-viewer-layout">
    <aside class="source-browser" aria-label="原文目录">
      <div class="source-search-wrap">
        <input id="sourceSearch" class="source-search" type="search" placeholder="搜索原文标题、定位或正文" autocomplete="off">
      </div>
      <div class="source-filters" aria-label="学习级别">
        <button class="source-filter" type="button" data-source-filter="all" aria-pressed="true">全部</button>
        <button class="source-filter" type="button" data-source-filter="must" aria-pressed="false">必学</button>
        <button class="source-filter" type="button" data-source-filter="optional" aria-pressed="false">选学</button>
        <button class="source-filter" type="button" data-source-filter="lookup" aria-pressed="false">回查</button>
      </div>
      <div id="sourceDocumentList" class="source-list"></div>
    </aside>
    <article class="source-reader">
      <div class="source-reader-inner">
        <div id="sourceViewerLevel" class="source-reader-kicker">原文</div>
        <h3 id="sourceViewerDocumentTitle">请选择一份原文</h3>
        <div id="sourceViewerMeta" class="source-reader-meta"></div>
        <section id="sourceViewerHints" class="source-hints" hidden>
          <h4>应该学习哪里</h4>
          <ul id="sourceViewerHintList"></ul>
        </section>
        <p id="sourceViewerBodyNote" class="source-body-note"></p>
        <div id="sourceViewerBody" class="source-lines"></div>
      </div>
    </article>
  </div>
</section>
<button id="askAiAction" class="ask-ai-action" type="button" hidden aria-haspopup="dialog" title="用费曼学习法解释选中文字">问 AI</button>
<section id="feynmanPanel" class="feynman-panel" hidden role="dialog" aria-labelledby="feynmanPanelTitle" aria-busy="false">
  <header class="feynman-panel-header">
    <div class="feynman-panel-heading">
      <div class="feynman-panel-kicker">FEYNMAN EXPLAINER</div>
      <h2 id="feynmanPanelTitle">解释这段话</h2>
    </div>
    <button id="feynmanPanelClose" class="feynman-close" type="button" aria-label="关闭费曼解释" title="关闭">&times;</button>
  </header>
  <div class="feynman-panel-body">
    <p class="feynman-privacy">点击后只发送你选中的文字和当前标题，不发送整篇资料。</p>
    <blockquote id="feynmanSelectionPreview" class="feynman-selection-preview"></blockquote>
    <p id="feynmanStatus" class="feynman-status" role="status" aria-live="polite"></p>
    <pre id="feynmanAnswer" class="feynman-answer" hidden></pre>
    <div id="feynmanError" class="feynman-error" hidden>
      <p id="feynmanErrorText"></p>
      <button id="feynmanRetry" class="feynman-retry" type="button">重试</button>
    </div>
  </div>
</section>
<!-- AI_SOURCE_VIEWER_END -->
`;
}

function buildClientScript() {
  return `
/* AI_SOURCE_CLIENT_START */
const sourceCorpus = JSON.parse(document.getElementById('aiLearningSourceData').textContent);
const sourceDocuments = sourceCorpus.documents;
const sourceDocumentById = new Map(sourceDocuments.map((document) => [document.id, document]));
const sourceLevelLabels = { must: '必学', optional: '选学', lookup: '回查' };
const sourceViewer = document.getElementById('sourceViewer');
const sourceViewerClose = document.getElementById('sourceViewerClose');
const sourceSearch = document.getElementById('sourceSearch');
const sourceDocumentList = document.getElementById('sourceDocumentList');
const sourceViewerDocumentTitle = document.getElementById('sourceViewerDocumentTitle');
const sourceViewerLevel = document.getElementById('sourceViewerLevel');
const sourceViewerMeta = document.getElementById('sourceViewerMeta');
const sourceViewerHints = document.getElementById('sourceViewerHints');
const sourceViewerHintList = document.getElementById('sourceViewerHintList');
const sourceViewerBodyNote = document.getElementById('sourceViewerBodyNote');
const sourceViewerBody = document.getElementById('sourceViewerBody');
const sourceFilterButtons = [...document.querySelectorAll('[data-source-filter]')];
const sourceReader = document.querySelector('.source-reader');
const askAiAction = document.getElementById('askAiAction');
const feynmanPanel = document.getElementById('feynmanPanel');
const feynmanPanelTitle = document.getElementById('feynmanPanelTitle');
const feynmanPanelClose = document.getElementById('feynmanPanelClose');
const feynmanSelectionPreview = document.getElementById('feynmanSelectionPreview');
const feynmanStatus = document.getElementById('feynmanStatus');
const feynmanAnswer = document.getElementById('feynmanAnswer');
const feynmanError = document.getElementById('feynmanError');
const feynmanErrorText = document.getElementById('feynmanErrorText');
const feynmanRetry = document.getElementById('feynmanRetry');
let sourceLibraryTopic = null;
let sourceLibraryLevel = 'all';
let activeSourceDocumentId = null;
let sourceReturnFocus = null;
let pendingFeynmanSelection = null;
let cachedFeynmanSelection = null;
let feynmanSelectionFrame = 0;
let feynmanRequestId = 0;
let feynmanAbortController = null;

function nodeElement(node) {
  if (!node) return null;
  return node.nodeType === 1 ? node : node.parentElement;
}

function allowedSelectionRoot(node) {
  return nodeElement(node)?.closest('.reading-section, #sourceViewerBody') || null;
}

function hideAskAiAction() {
  askAiAction.hidden = true;
  askAiAction.dataset.invalid = 'false';
  pendingFeynmanSelection = null;
}

function closeFeynmanPanel() {
  feynmanRequestId += 1;
  feynmanAbortController?.abort();
  feynmanAbortController = null;
  feynmanPanel.hidden = true;
  feynmanPanel.setAttribute('aria-busy', 'false');
}

function clearFeynmanSelection(closePanel) {
  hideAskAiAction();
  window.getSelection()?.removeAllRanges();
  if (closePanel) closeFeynmanPanel();
}

function setFeynmanLoading() {
  feynmanPanel.setAttribute('aria-busy', 'true');
  feynmanStatus.dataset.state = 'loading';
  feynmanStatus.textContent = '正在按费曼学习法拆解…';
  feynmanAnswer.hidden = true;
  feynmanAnswer.textContent = '';
  feynmanError.hidden = true;
}

function setFeynmanError(message) {
  feynmanPanel.setAttribute('aria-busy', 'false');
  feynmanStatus.dataset.state = 'error';
  feynmanStatus.textContent = '解释未完成';
  feynmanAnswer.hidden = true;
  feynmanErrorText.textContent = message;
  feynmanError.hidden = false;
}

function setFeynmanSuccess(explanation) {
  feynmanPanel.setAttribute('aria-busy', 'false');
  feynmanStatus.dataset.state = 'success';
  feynmanStatus.textContent = '解释完成 · 只基于你选中的文字';
  feynmanError.hidden = true;
  feynmanAnswer.textContent = explanation;
  feynmanAnswer.hidden = false;
}

function openFeynmanPanel(selection) {
  cachedFeynmanSelection = selection;
  feynmanPanelTitle.textContent = selection.contextTitle
    ? '解释 · ' + selection.contextTitle
    : '解释这段话';
  feynmanSelectionPreview.textContent = selection.text;
  feynmanPanel.hidden = false;
}

async function requestFeynmanExplanation(selection) {
  openFeynmanPanel(selection);

  if (selection.text.length > 4000) {
    setFeynmanError('单次最多解释 4000 个字符，请缩短选区后重试。');
    return;
  }

  feynmanAbortController?.abort();
  feynmanAbortController = new AbortController();
  const requestId = ++feynmanRequestId;
  setFeynmanLoading();

  try {
    const response = await fetch('/api/learning/feynman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selection: selection.text,
        contextTitle: selection.contextTitle,
        sourceKind: selection.sourceKind,
      }),
      signal: feynmanAbortController.signal,
    });
    let payload = {};

    try {
      payload = await response.json();
    } catch (_) {}

    if (requestId !== feynmanRequestId) return;

    if (!response.ok) {
      throw new Error(
        typeof payload.message === 'string'
          ? payload.message
          : 'AI 解释服务暂时不可用，请稍后重试。'
      );
    }

    const explanation =
      typeof payload.explanation === 'string' ? payload.explanation.trim() : '';
    if (!explanation) {
      throw new Error('AI 没有返回可用解释，请重试。');
    }

    setFeynmanSuccess(explanation);
  } catch (error) {
    if (requestId !== feynmanRequestId || error?.name === 'AbortError') return;
    setFeynmanError(
      error instanceof Error
        ? error.message
        : 'AI 解释服务暂时不可用，请稍后重试。'
    );
  }
}

function updateAskAiAction() {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount !== 1 || selection.isCollapsed) {
    hideAskAiAction();
    return;
  }

  const text = selection.toString().trim();
  const startRoot = allowedSelectionRoot(selection.anchorNode);
  const endRoot = allowedSelectionRoot(selection.focusNode);

  if (!text || !startRoot || startRoot !== endRoot) {
    hideAskAiAction();
    return;
  }

  const sourceKind = startRoot.id === 'sourceViewerBody' ? 'source' : 'study';
  const contextTitle =
    sourceKind === 'source'
      ? sourceViewerDocumentTitle.textContent.trim()
      : startRoot.querySelector('h1, h2')?.textContent.trim() || '';
  const rangeRect = selection.getRangeAt(0).getBoundingClientRect();
  const actionLeft = Math.min(
    Math.max(12, rangeRect.right + 10),
    Math.max(12, window.innerWidth - 112)
  );
  const actionTop = Math.min(
    Math.max(12, rangeRect.top - 52),
    Math.max(12, window.innerHeight - 56)
  );

  pendingFeynmanSelection = { text, contextTitle, sourceKind };
  askAiAction.textContent = text.length > 4000 ? '选区过长' : '问 AI';
  askAiAction.dataset.invalid = String(text.length > 4000);
  askAiAction.style.left = actionLeft + 'px';
  askAiAction.style.top = actionTop + 'px';
  askAiAction.hidden = false;
}

function scheduleAskAiActionUpdate() {
  if (feynmanSelectionFrame) cancelAnimationFrame(feynmanSelectionFrame);
  feynmanSelectionFrame = requestAnimationFrame(() => {
    feynmanSelectionFrame = 0;
    updateAskAiAction();
  });
}

function sourceMatchesRange(value, ranges, startKey, endKey) {
  return ranges.some((range) => value >= range[startKey] && value <= range[endKey]);
}

function renderSourceBody(sourceDocument) {
  sourceViewerBody.replaceChildren();

  if (!sourceDocument.body) {
    const empty = document.createElement('div');
    empty.className = 'source-empty';
    empty.textContent = '这条记录在原始下载中没有可用正文。记录仍保留，不能根据标题补写内容。';
    sourceViewerBody.append(empty);
    sourceViewerBodyNote.textContent = '原文不足 · 保留原始清单状态';
    return;
  }

  if (sourceDocument.sourceKind === 'pdf-text') {
    sourceViewerBodyNote.textContent =
      'PDF 文字抽取层：文字来自原 PDF 的本地抽取/OCR，方便同页学习，但不替代 PDF 的图片、表格版式与页内位置。';
  } else if (sourceDocument.sourceKind === 'conversation-transcript') {
    sourceViewerBodyNote.textContent =
      '对话摘录：保留指定线程中的用户问题与最终回答要点，省略系统指令、工具日志和重复进度消息。';
  } else if (sourceDocument.sourceKind === 'conversation-note') {
    sourceViewerBodyNote.textContent =
      '对话整理：根据指定线程形成的新增学习层，不属于语雀原文。';
  } else {
    sourceViewerBodyNote.textContent =
      'Markdown 原文：页面按原始字符串逐行显示，未删减、未改写。';
  }

  const fragment = document.createDocumentFragment();
  const normalizedLines = sourceDocument.body.replaceAll('\\r\\n', '\\n').split('\\n');
  let currentPage = 0;

  normalizedLines.forEach((lineText, index) => {
    const pageMatch = lineText.match(/^--- Page (\\d+) ---$/);
    if (pageMatch) currentPage = Number(pageMatch[1]);

    const line = document.createElement('div');
    const isStudyLine =
      sourceMatchesRange(index + 1, sourceDocument.studyRanges, 'startLine', 'endLine') ||
      (currentPage > 0 &&
        sourceMatchesRange(currentPage, sourceDocument.pageRanges, 'startPage', 'endPage'));
    line.className =
      'source-line' +
      (isStudyLine ? ' is-study' : '') +
      (pageMatch ? ' is-page-marker' : '');
    const text = document.createElement('span');
    text.className = 'source-line-text';
    text.textContent = lineText || ' ';
    line.append(text);
    fragment.append(line);
  });

  sourceViewerBody.append(fragment);
  requestAnimationFrame(() => sourceReader.scrollTo({ top: 0, left: 0 }));
}

function openSourceDocument(sourceId) {
  const sourceDocument = sourceDocumentById.get(sourceId);
  if (!sourceDocument) return;

  clearFeynmanSelection(true);
  activeSourceDocumentId = sourceId;
  sourceViewerLevel.textContent = sourceLevelLabels[sourceDocument.studyLevel] + '原文';
  sourceViewerDocumentTitle.textContent = sourceDocument.title;
  sourceViewerMeta.textContent = [
    sourceDocument.localFile || sourceDocument.sourcePath || '无本地文件名',
    sourceDocument.body
      ? sourceDocument.body.length.toLocaleString('zh-CN') + ' 字符'
      : '无可用正文',
    sourceDocument.bodySha256
      ? 'SHA-256 ' + sourceDocument.bodySha256.slice(0, 12) + '…'
      : '',
  ].filter(Boolean).join(' · ');

  sourceViewerHintList.replaceChildren();
  const hints = sourceDocument.learningHints.length
    ? sourceDocument.learningHints
    : ['这份资料未进入九份主题稿的核心来源定位，可按需要全文选读。'];
  hints.forEach((hint) => {
    const item = document.createElement('li');
    item.textContent = hint;
    sourceViewerHintList.append(item);
  });
  sourceViewerHints.hidden = false;
  renderSourceBody(sourceDocument);

  [...sourceDocumentList.querySelectorAll('.source-document-button')].forEach((button) => {
    button.setAttribute('aria-current', String(button.dataset.sourceId === sourceId));
  });
}

function filteredSourceDocuments() {
  const query = sourceSearch.value.trim().toLowerCase();

  return sourceDocuments.filter((document) => {
    if (sourceLibraryTopic && !document.topics.includes(sourceLibraryTopic)) return false;
    if (sourceLibraryLevel !== 'all' && document.studyLevel !== sourceLibraryLevel) return false;
    if (!query) return true;

    const searchable = [
      document.title,
      document.localFile,
      document.learningHints.join(' '),
      query.length >= 2 ? document.body : '',
    ].join(' ').toLowerCase();
    return searchable.includes(query);
  });
}

function renderSourceList() {
  const documents = filteredSourceDocuments();
  sourceDocumentList.replaceChildren();
  const fragment = document.createDocumentFragment();

  documents.forEach((sourceDocument) => {
    const button = document.createElement('button');
    button.className = 'source-document-button';
    button.type = 'button';
    button.dataset.sourceId = sourceDocument.id;
    button.setAttribute(
      'aria-current',
      String(sourceDocument.id === activeSourceDocumentId)
    );

    const title = document.createElement('span');
    title.className = 'source-document-title';
    title.textContent = sourceDocument.title;
    const meta = document.createElement('span');
    meta.className = 'source-document-meta';
    const kindLabel = {
      markdown: 'Markdown 原文',
      'pdf-text': 'PDF 文字',
      'conversation-note': '对话整理',
      'conversation-transcript': '对话摘录',
    }[sourceDocument.sourceKind] || '原文不足';
    meta.textContent =
      sourceLevelLabels[sourceDocument.studyLevel] +
      ' · ' +
      (sourceDocument.body ? kindLabel : '原文不足');
    button.append(title, meta);
    button.addEventListener('click', () => openSourceDocument(sourceDocument.id));
    fragment.append(button);
  });

  sourceDocumentList.append(fragment);

  if (!documents.length) {
    const empty = document.createElement('div');
    empty.className = 'source-empty';
    empty.textContent = '当前筛选下没有资料。';
    sourceDocumentList.append(empty);
    return;
  }

  if (!documents.some((document) => document.id === activeSourceDocumentId)) {
    openSourceDocument(documents[0].id);
  }
}

function setSourceFilter(level) {
  sourceLibraryLevel = level;
  sourceFilterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.sourceFilter === level));
  });
  renderSourceList();
}

function openSourceLibrary(topicId = null, level = 'all') {
  clearFeynmanSelection(true);
  sourceReturnFocus = document.activeElement;
  sourceLibraryTopic = topicId;
  sourceSearch.value = '';
  sourceViewer.hidden = false;
  body.classList.add('source-viewer-open');
  setSourceFilter(level);
  sourceViewerClose.focus();
}

function closeSourceLibrary() {
  clearFeynmanSelection(true);
  sourceViewer.hidden = true;
  body.classList.remove('source-viewer-open');
  sourceReturnFocus?.focus();
}

function buildSourceShelf(section) {
  const topicDocuments =
    section.id === 'section-1'
      ? sourceDocuments
      : sourceDocuments.filter((document) => document.topics.includes(section.id));
  if (!topicDocuments.length) return;

  const counts = {
    must: topicDocuments.filter((document) => document.studyLevel === 'must').length,
    optional: topicDocuments.filter((document) => document.studyLevel === 'optional').length,
    lookup: topicDocuments.filter((document) => document.studyLevel === 'lookup').length,
  };
  const shelf = document.createElement('section');
  shelf.className = 'source-shelf';
  shelf.setAttribute('aria-label', '本章原文');
  const heading = document.createElement('div');
  heading.className = 'source-shelf-heading';
  const title = document.createElement('strong');
  title.textContent = section.id === 'section-1' ? '完整原文库' : '本章原文学习区';
  const summary = document.createElement('span');
  summary.textContent = topicDocuments.length + ' 份资料 · 点击后仍在当前网页阅读';
  heading.append(title, summary);
  const actions = document.createElement('div');
  actions.className = 'source-shelf-actions';

  [
    ['must', '必学'],
    ['optional', '选学'],
    ['lookup', '回查'],
  ].forEach(([level, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.level = level;
    button.textContent = label + ' ' + counts[level];
    button.disabled = counts[level] === 0;
    button.addEventListener('click', () =>
      openSourceLibrary(section.id === 'section-1' ? null : section.id, level)
    );
    actions.append(button);
  });

  shelf.append(heading, actions);
  section.querySelector('h1')?.insertAdjacentElement('afterend', shelf);
}

sections.forEach(buildSourceShelf);
document.getElementById('sourceLibraryButton').addEventListener('click', () => openSourceLibrary());
sourceViewerClose.addEventListener('click', closeSourceLibrary);
askAiAction.addEventListener('pointerdown', (event) => event.preventDefault());
askAiAction.addEventListener('click', () => {
  const selection = pendingFeynmanSelection;
  if (!selection) return;

  cachedFeynmanSelection = selection;
  askAiAction.hidden = true;
  window.getSelection()?.removeAllRanges();
  requestFeynmanExplanation(selection);
});
feynmanPanelClose.addEventListener('click', closeFeynmanPanel);
feynmanRetry.addEventListener('click', () => {
  if (cachedFeynmanSelection) requestFeynmanExplanation(cachedFeynmanSelection);
});
sourceFilterButtons.forEach((button) =>
  button.addEventListener('click', () => setSourceFilter(button.dataset.sourceFilter))
);
sourceSearch.addEventListener('input', renderSourceList);
document.addEventListener('selectionchange', scheduleAskAiActionUpdate);
document.addEventListener('pointerup', scheduleAskAiActionUpdate);
window.addEventListener('scroll', hideAskAiAction, { passive: true });
window.addEventListener('resize', hideAskAiAction);
sourceReader.addEventListener('scroll', hideAskAiAction, { passive: true });
sourceViewer.addEventListener('click', (event) => {
  if (event.target === sourceViewer) closeSourceLibrary();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!feynmanPanel.hidden) {
    closeFeynmanPanel();
    return;
  }
  if (!sourceViewer.hidden) closeSourceLibrary();
});
/* AI_SOURCE_CLIENT_END */
`;
}

function buildReader(baseReader, sourceData, conversationSupplement) {
  let html = baseReader;
  html = removeGeneratedBlock(
    html,
    "/* AI_SOURCE_LAYER_START */",
    "/* AI_SOURCE_LAYER_END */"
  );
  html = removeGeneratedBlock(
    html,
    "<!-- AI_SOURCE_VIEWER_START -->",
    "<!-- AI_SOURCE_VIEWER_END -->"
  );
  html = removeGeneratedBlock(
    html,
    "/* AI_SOURCE_CLIENT_START */",
    "/* AI_SOURCE_CLIENT_END */"
  );
  html = html.replace(
    /<script id="aiLearningSourceData" type="application\/json">[\s\S]*?<\/script>\s*/g,
    ""
  );
  html = removeGeneratedBlock(
    html,
    "<!-- AI_CONVERSATION_SUPPLEMENT_START -->",
    "<!-- AI_CONVERSATION_SUPPLEMENT_END -->"
  );
  html = html.replace(/\s*<button id="sourceLibraryButton"[\s\S]*?<\/button>/g, "");

  html = html.replace(
    "<p>14 themes, 9 detailed study documents, organized by problem, mechanism, observation, boundaries, and self-test.</p>",
    "<p>14 个主题、9 份语雀细化学习稿和 1 份对话补充，以及完整原始资料清单。学习稿、原文与核验定位都在当前网页完成。</p>"
  );
  html = html.replace(
    '<p class="notice">The original Markdown, PDF, image, attachment, and manifest files are preserved. This page is an added study layer.</p>',
    `<p class="notice">原文未删减、未改写：${sourceData.counts.readable} 条资料可直接阅读，${sourceData.counts.unavailable} 条原始记录本身无正文并保留说明。PDF 以文字抽取层呈现。</p>`
  );
  html = html.replace(
    '<span id="progressCopy" class="progress-copy">0% read</span>',
    `<span id="progressCopy" class="progress-copy">0% read</span>
        <button id="sourceLibraryButton" class="source-library-button" type="button" aria-label="打开完整原文库">原文库 ${sourceData.counts.total}</button>
        <a class="reader-back-link" href="/fde/materials">返回 FDE 资料库</a>`
  );

  html = html.replace(
    "</nav>\n  </aside>",
    `<a href="#${conversationSupplement.sectionId}">对话补充：论文驱动学习路线</a>
    </nav>
  </aside>`
  );
  html = injectBefore(
    html,
    "\n  </main>",
    `
<!-- AI_CONVERSATION_SUPPLEMENT_START -->
<article id="${conversationSupplement.sectionId}" class="reading-section conversation-supplement">
  <div class="section-label">Conversation supplement</div>
  <h1>${escapeHtml(conversationSupplement.title)}</h1>
  ${conversationSupplement.articleHtml}
</article>
<!-- AI_CONVERSATION_SUPPLEMENT_END -->
`
  );

  html = injectBefore(html, "</style>", `${buildStyles()}\n`);
  html = injectBefore(
    html,
    '<button id="backToTop"',
    `${buildViewerMarkup(sourceData)}\n`
  );

  const encodedSourceData = JSON.stringify(sourceData)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
  html = injectBefore(
    html,
    "<script>\nconst search",
    `<script id="aiLearningSourceData" type="application/json">${encodedSourceData}</script>\n`
  );
  html = injectBefore(html, "\n</script>\n</body>", `\n${buildClientScript()}`);

  return html;
}

const options = readArguments(process.argv.slice(2));
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(options.materialsRoot, "manifest.json");
const baseReaderPath = path.join(options.materialsRoot, "ai-learning-collection.html");

if (!existsSync(manifestPath) || !existsSync(baseReaderPath)) {
  throw new Error("Materials root must contain manifest.json and ai-learning-collection.html");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const themes = loadThemes(options.materialsRoot);
const conversationSupplement = loadConversationSupplement(repoRoot);
const sourceData = buildSourceData(
  manifest,
  options.materialsRoot,
  options.workspaceRoot,
  themes,
  conversationSupplement.documents
);
const reader = buildReader(
  readFileSync(baseReaderPath, "utf8"),
  sourceData,
  conversationSupplement
);

writeFileSync(options.output, reader, "utf8");
console.log(
  JSON.stringify(
    {
      output: options.output,
      bytes: Buffer.byteLength(reader, "utf8"),
      counts: sourceData.counts,
    },
    null,
    2
  )
);

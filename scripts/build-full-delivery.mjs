import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "assets");
const distDir = join(root, "full-delivery");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const sourceImages = readdirSync(assetsDir)
  .filter((file) => file.endsWith(".png"))
  .sort();

const sets = [
  {
    id: "a",
    label: "A",
    title: "戶外散步防護版",
    subtitle: "把產品放進日常遛狗場景，主打出門前一噴、陪毛孩安心走一圈。",
    image: sourceImages.find((file) => file.includes("db51")) ?? sourceImages[0],
    angle: "日常散步",
    headline: "出門散步前，先替毛孩加一道植萃防護",
    bullets: ["適合 Facebook 首波導購貼文", "視覺重點放在草地、牽繩、毛孩互動", "文案語氣溫和，強調天然植萃與日常使用"],
    post: "天氣好，毛孩最期待的就是出門走走。出門前先用毛天使戶外防護噴霧，讓散步多一層天然植萃守護。"
  },
  {
    id: "b",
    label: "B",
    title: "自然生活導購版",
    subtitle: "保留明亮自然光與居家外出銜接感，適合作為網站主視覺與商品導購頁。",
    image: sourceImages.find((file) => file.includes("b6d")) ?? sourceImages[1],
    angle: "導購主視覺",
    headline: "從家門口到草地，毛天使陪毛孩安心出發",
    bullets: ["適合 Landing Page 首屏", "商品與生活感平衡，較適合長期投放", "可延伸成輪播圖、短影音封面與官網 banner"],
    post: "每一次出門，都是毛孩的小冒險。毛天使以天然植萃配方，陪你把戶外防護變成日常習慣。"
  },
  {
    id: "c",
    label: "C",
    title: "旅行露營情境版",
    subtitle: "把產品延伸到出遊、露營、草地休息，適合週末活動與節慶檔期使用。",
    image: sourceImages.find((file) => file.includes("a045")) ?? sourceImages[2],
    angle: "戶外旅行",
    headline: "週末出遊，也別忘了毛孩的戶外防護",
    bullets: ["適合露營、郊遊、連假主題", "畫面情緒更活潑，利於社群互動", "可做成活動貼文、促銷圖卡與短影音開場"],
    post: "露營、郊遊、草地奔跑，毛孩開心玩也需要被好好守護。帶上毛天使戶外防護噴霧，讓每趟出遊更安心。"
  }
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function page(set, imageName) {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>毛天使戶外防護噴霧｜方案 ${set.label}｜${esc(set.title)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #172016;
      --muted: #596556;
      --line: #dce7d7;
      --leaf: #527446;
      --mint: #eef5e7;
      --paper: #ffffff;
      --accent: #9b6a3d;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: #f6f8f2;
      font-family: -apple-system, BlinkMacSystemFont, "Noto Sans TC", "PingFang TC", "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
    .wrap { width: min(1120px, calc(100vw - 32px)); margin: 0 auto; }
    header {
      background: linear-gradient(180deg, #ffffff 0%, var(--mint) 100%);
      border-bottom: 1px solid var(--line);
      padding: 26px 0 20px;
    }
    .eyebrow {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      color: var(--leaf);
      font-size: 14px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    h1 { margin: 0; font-size: clamp(28px, 5vw, 52px); line-height: 1.08; }
    .sub { margin: 12px 0 0; color: var(--muted); font-size: 17px; line-height: 1.65; max-width: 760px; }
    main { padding: 22px 0 42px; }
    .hero {
      display: grid;
      gap: 22px;
      align-items: start;
    }
    .visual {
      background: #edf3e8;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
    }
    .visual img { display: block; width: 100%; }
    .panel {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
    }
    h2 { margin: 0 0 10px; font-size: 24px; line-height: 1.25; }
    .tag {
      display: inline-block;
      color: #fff;
      background: var(--leaf);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    ul { margin: 10px 0 0; padding-left: 20px; color: var(--muted); line-height: 1.7; }
    .copy {
      margin-top: 16px;
      padding: 14px;
      border-left: 4px solid var(--accent);
      background: #fffaf3;
      color: #3c3328;
      line-height: 1.72;
    }
    .deliverables {
      display: grid;
      gap: 12px;
      margin-top: 18px;
    }
    .item {
      padding: 12px 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcf8;
      color: var(--muted);
      line-height: 1.55;
    }
    .item strong { color: var(--ink); display: block; margin-bottom: 2px; }
    footer {
      border-top: 1px solid var(--line);
      color: var(--muted);
      padding: 18px 0;
      font-size: 13px;
    }
    @media (min-width: 920px) {
      .hero { grid-template-columns: 1.18fr .82fr; }
      .panel { position: sticky; top: 20px; }
    }
    @media print {
      body { background: #fff; }
      header { padding: 18px 0 12px; }
      main { padding: 14px 0 20px; }
      .hero { grid-template-columns: 1fr; }
      .panel { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <div class="eyebrow">毛天使 PetAngel ｜方案 ${set.label} ｜${esc(set.angle)}</div>
      <h1>${esc(set.headline)}</h1>
      <p class="sub">${esc(set.subtitle)}</p>
    </div>
  </header>
  <main>
    <div class="wrap hero">
      <section class="visual" aria-label="主視覺">
        <img src="assets/${esc(imageName)}" alt="毛天使戶外防護噴霧方案 ${set.label} 主視覺">
      </section>
      <aside class="panel">
        <span class="tag">完整交付方案 ${set.label}</span>
        <h2>${esc(set.title)}</h2>
        <ul>
          ${set.bullets.map((item) => `<li>${esc(item)}</li>`).join("\n          ")}
        </ul>
        <div class="copy"><strong>FB 貼文草稿：</strong><br>${esc(set.post)}</div>
        <div class="deliverables">
          <div class="item"><strong>主視覺</strong>可直接交給 Neko / 張董審稿。</div>
          <div class="item"><strong>HTML</strong>可作為網頁預覽與素材留存。</div>
          <div class="item"><strong>PDF</strong>可直接打開審稿與轉傳。</div>
          <div class="item"><strong>ZIP</strong>包含此方案全部素材。</div>
        </div>
      </aside>
    </div>
  </main>
  <footer>
    <div class="wrap">產出日期：2026-06-04。正式發布前仍需富盛豐行銷群審稿確認。</div>
  </footer>
</body>
</html>`;
}

function indexPage() {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>毛天使戶外防護噴霧｜三套完整交付</title>
  <style>
    :root { --ink:#172016; --muted:#596556; --line:#dce7d7; --leaf:#527446; --paper:#fff; --soft:#f6f8f2; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--soft); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC","PingFang TC","Segoe UI",sans-serif; letter-spacing:0; }
    .wrap { width:min(1120px, calc(100vw - 32px)); margin:0 auto; }
    header { padding:28px 0 18px; background:#fff; border-bottom:1px solid var(--line); }
    h1 { margin:0 0 10px; font-size:clamp(28px,5vw,50px); line-height:1.1; }
    p { color:var(--muted); line-height:1.65; }
    main { padding:22px 0 40px; }
    .grid { display:grid; gap:16px; }
    .card { background:var(--paper); border:1px solid var(--line); border-radius:8px; overflow:hidden; }
    img { display:block; width:100%; background:#eef4e8; }
    .body { padding:14px 16px 16px; }
    h2 { margin:0 0 8px; font-size:22px; }
    a { color:var(--leaf); font-weight:800; text-decoration:none; }
    .links { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; }
    .links a { border:1px solid var(--line); border-radius:999px; padding:7px 10px; background:#fbfcf8; font-size:14px; }
    @media (min-width:900px) { .grid { grid-template-columns:repeat(3, 1fr); } }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <h1>毛天使戶外防護噴霧｜三套完整交付</h1>
      <p>本次已從單一候選圖總覽，改成 A/B/C 三套完整交付。每套都包含獨立主視覺、HTML、PDF、ZIP 與 FB 文案方向。</p>
    </div>
  </header>
  <main>
    <div class="wrap grid">
      ${sets.map((set) => `<article class="card">
        <img src="full-set-${set.id}/assets/${esc(set.image)}" alt="方案 ${set.label}">
        <div class="body">
          <h2>方案 ${set.label}｜${esc(set.title)}</h2>
          <p>${esc(set.subtitle)}</p>
          <div class="links">
            <a href="full-set-${set.id}/index.html">HTML</a>
            <a href="full-set-${set.id}/petangel-full-set-${set.id}.pdf">PDF</a>
            <a href="petangel-full-set-${set.id}.zip">ZIP</a>
          </div>
        </div>
      </article>`).join("\n      ")}
    </div>
  </main>
</body>
</html>`;
}

function printPdf(htmlPath, pdfPath) {
  if (!existsSync(chrome)) {
    throw new Error(`Chrome not found: ${chrome}`);
  }
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`
  ], { stdio: "ignore" });
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const set of sets) {
  const setDir = join(root, `full-set-${set.id}`);
  const setAssets = join(setDir, "assets");
  rmSync(setDir, { recursive: true, force: true });
  mkdirSync(setAssets, { recursive: true });
  copyFileSync(join(assetsDir, set.image), join(setAssets, set.image));
  const htmlPath = join(setDir, "index.html");
  const pdfPath = join(setDir, `petangel-full-set-${set.id}.pdf`);
  writeFileSync(htmlPath, page(set, set.image));
  printPdf(htmlPath, pdfPath);
  execFileSync("zip", ["-qr", join(root, `petangel-full-set-${set.id}.zip`), basename(setDir)], { cwd: root });
}

writeFileSync(join(root, "index.html"), indexPage());
printPdf(join(root, "index.html"), join(root, "petangel-outdoor-spray-v2-20260604-full-delivery.pdf"));
execFileSync("zip", ["-qr", join(root, "petangel-outdoor-spray-v2-20260604-full-delivery.zip"), "index.html", "full-set-a", "full-set-b", "full-set-c"], { cwd: root });

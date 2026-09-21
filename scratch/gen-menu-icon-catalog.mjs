/**
 * Codegen: sinh lại `menuIconCatalog.ts` với DANH SÁCH TINH TUYỂN (named import) thay cho
 * `import * as X + Object.keys(X)`.
 *
 * Vì sao: `Object.keys(namespace)` buộc Rollup giữ MỌI export của bộ icon. Các bộ đó còn được
 * nhiều module khác dùng ⇒ module ĐẦY ĐỦ bị đưa vào chunk dùng chung ⇒ MỌI page phải tải
 * (đo: mở 1 page +2.503 KB icon: react-icons/md 1.789 KB + 714 KB).
 *
 * Chạy: node scratch/gen-menu-icon-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = "src/pages/nocodelowcode/MenuManager/menuIconCatalog.ts";

const readNames = (set) => {
  const src = fs.readFileSync(path.join(ROOT, "node_modules/react-icons", set, "index.esm.js"), "utf8");
  return src
    .split("\n")
    .filter((l) => l.startsWith("export function "))
    .map((l) => l.slice("export function ".length, l.indexOf(" (props) {")));
};

/** Nhóm chủ đề: chọn round-robin giữa các nhóm ⇒ picker đa dạng, không lệch về 1 nhóm. */
const GROUPS = [
  ["folder", "directory"],
  ["document", "file", "template", "library", "book", "newspaper", "certificate", "diploma"],
  ["chart", "graph", "pie", "bar", "statistics", "data", "analytics", "dashboard", "calculator"],
  ["user", "person", "people", "group", "team", "customer", "contact", "manager", "conference", "collaboration", "handshake"],
  ["cart", "shop", "store", "product", "package", "box", "stack", "layers", "warehouse", "truck", "shipping", "delivery", "industry", "factory"],
  ["money", "wallet", "credit", "price", "tag", "sales", "trade"],
  ["calendar", "clock", "alarm", "overtime", "timeline", "schedule"],
  ["settings", "tools", "wrench", "puzzle", "services", "process", "workflow", "flow", "parallel", "engineering", "bug", "code"],
  ["database", "server", "cloud", "network", "wifi", "monitor", "terminal"],
  ["check", "approval", "approve", "award", "medal", "trophy", "goal", "target", "flag", "star", "rating", "gift", "idea", "lightbulb", "rocket", "flash", "bee", "seedling", "leaf"],
  ["warning", "alert", "info", "help", "support", "question", "survey", "feedback", "privacy", "rules"],
  ["message", "chat", "comment", "mail", "phone", "share", "link", "bookmark", "pin"],
  ["home", "building", "apartment", "address", "organization", "org", "department", "tree", "business", "briefcase"],
  ["lock", "key", "security", "shield"],
  ["search", "filter", "find", "sorted", "list", "grid", "table", "view", "details", "overview"],
  ["edit", "add", "plus", "minus", "delete", "cancel", "download", "upload", "print", "scanner", "barcode", "qr", "camera", "image", "photo", "video", "media", "audio", "map", "location", "navigation", "globe", "compass"],
];

/** Tên thương hiệu / sản phẩm: vô nghĩa với menu ERP -> loại. */
const BRANDS = [
  "appstore", "codepen", "codiepie", "cloudflare", "cloudscale", "cloudsmith", "centercode", "angellist", "mapleleaf", "creativecommons",
  "angular", "react", "vuejs", "nodedotjs", "npm", "yarn", "github", "gitlab", "bitbucket", "facebook", "twitter", "google", "goog", "gmail",
  "amazon", "aws", "apple", "microsoft", "windows", "linux", "ubuntu", "docker", "kubernetes", "figma", "sketch", "slack", "trello", "jira",
  "wordpress", "wix", "stripe", "paypal", "visa", "mastercard", "steam", "spotify", "uber", "airbnb", "behance", "dribbble", "flickr",
  "foursquare", "medium", "reddit", "skype", "snapchat", "soundcloud", "telegram", "tumblr", "twitch", "vimeo", "vine", "weibo", "whatsapp",
  "yahoo", "yelp", "youtube", "ycombinator", "xing", "zhihu", "android", "chrome", "firefox", "safari", "edge", "opera", "sass", "less",
  "bootstrap", "tailwind", "python", "java", "php", "ruby", "golang", "swift", "kotlin", "rust", "scala", "perl", "laravel", "django",
  "blockchain", "bitcoin", "ethereum", "ccPaypal", "payPal",
  "piper", "teamspeak", "speakap", "salesforce", "hubspot", "shopify", "rocketchat", "researchgate", "producthunt", "simplybuilt",
  "stackoverflow", "stackexchange", "stumbleupon", "superpowers", "themeisle", "tripadvisor", "viadeo", "weixin", "wpexplorer", "xbox",
  "yandex", "zillow", "deviantart", "discord", "ello", "empire", "envira", "etsy", "evernote", "forumbee", "goodreads", "houzz",
  "instagram", "joomla", "keybase", "linode", "linkedin", "lyft", "mailchimp", "meetup", "mixcloud", "modx", "napster", "neos",
  "palfed", "patreon", "periscope", "pinterest", "playstation", "quora", "raspberry", "rebel", "redhat", "renren", "rockrms", "scribd",
  "sellsy", "skyatlas", "slideshare", "speaker", "squarespace", "strava", "studiovinari", "suse", "symfony", "tencent", "themeco",
  "typo3", "uikit", "umbraco", "untappd", "viacoin", "viber", "virgin", "yammer", "yoast", "joget", "bity", "angrycreative",
];

const pick = (set, max) => {
  const all = readNames(set);
  const lower = all.map((n) => n.toLowerCase());
  const ok = (i) => !BRANDS.some((b) => lower[i].includes(b.toLowerCase()));

  // Round-robin giữa các nhóm chủ đề: mỗi vòng lấy 3 icon mới/nhóm ⇒ phân bố đều.
  const PER_GROUP_PER_ROUND = 3;
  const chosen = [];
  const taken = new Set();
  for (let round = 0; round < 60 && chosen.length < max; round += 1) {
    for (const group of GROUPS) {
      if (chosen.length >= max) break;
      let n = 0;
      for (let i = 0; i < all.length && n < PER_GROUP_PER_ROUND; i += 1) {
        if (taken.has(all[i]) || !ok(i)) continue;
        if (!group.some((k) => lower[i].includes(k))) continue;
        taken.add(all[i]);
        chosen.push(all[i]);
        n += 1;
      }
    }
  }
  return chosen.length ? chosen.slice(0, max) : all.slice(0, max);
};

const chosen = {
  // fc = Flat Color Icons: icon nhiều màu sẵn -> nguồn chính cho "màu mè".
  fc: pick("fc", 110),
  // md = Material, bi = Bootstrap: bổ sung icon đơn sắc, ít tên thương hiệu.
  md: pick("md", 30),
  bi: pick("bi", 20),
};
// KHÔNG đưa `fa`/`ai` vào catalog: `fa` có rất nhiều icon thương hiệu (Dropbox, Kickstarter…)
// vô nghĩa với menu ERP. Các module khác vẫn dùng fa/ai qua named import -> tree-shake bình thường.

const total = Object.values(chosen).reduce((a, l) => a + l.length, 0);
const allSets = Object.keys(chosen);

const header = `/**
 * menuIconCatalog — danh mục icon cho dropdown chọn icon của MenuManager (màn hình admin).
 *
 * ⚠️ LỊCH SỬ + LÝ DO (đo ngày 2026-09-21):
 * Bản cũ dùng \`import * as FcIcons from "react-icons/fc"\` rồi \`Object.keys(FcIcons)\` để liệt kê
 * MỌI icon. Namespace + Object.keys khiến Rollup KHÔNG thể tree-shake ⇒ phải giữ TOÀN BỘ các bộ
 * (md 4.341 + bi 1.634 + fa 1.611 + ai 789 + fc 329 icon). Vì các bộ này còn được nhiều module
 * khác dùng, module ĐẦY ĐỦ bị đưa vào chunk dùng chung ⇒ mọi page phải tải thêm ~2,5 MB icon
 * (react-icons/md 1.789 KB + 714 KB) và trước đó là 4,9 MB nằm thẳng trong entry chunk.
 *
 * Bản này dùng DANH SÁCH TINH TUYỂN + NAMED IMPORT ⇒ tree-shake hoạt động bình thường,
 * chunk chỉ còn những icon thực sự dùng. Picker vẫn đủ nhiều icon MÀU (Flat Color) và có nghĩa;
 * đổi lại không còn 9.860 icon trộn lẫn (thực tế gần như không dùng hết).
 *
 * 👉 Muốn thêm icon: thêm tên vào mảng tương ứng (tên phải tồn tại trong \`react-icons/<bộ>\`).
 *    Hoặc chạy lại \`node scratch/gen-menu-icon-catalog.mjs\` (file này được sinh tự động).
 */
import type { ComponentType } from "react";
`;

let body = "";
for (const set of Object.keys(chosen)) {
  const names = chosen[set];
  body += `import {\n  ${names.join(",\n  ")},\n} from "react-icons/${set}";\n`;
}

body += `\nexport interface MenuIconItem {\n  name: string;\n  library: string;\n  IconComponent: ComponentType<any>;\n}\n\n`;

const rows = [];
for (const set of Object.keys(chosen)) {
  for (const n of chosen[set]) rows.push(`  { name: "${n}", library: "${set}", IconComponent: ${n} },`);
}
body += `/** Danh mục icon tinh tuyển (giữ nguyên shape cũ để MenuManager không phải sửa). */\nexport const MENU_ICON_ENTRIES: MenuIconItem[] = [\n${rows.join("\n")}\n];\n\n`;
body += `export const getAllIcons = (): MenuIconItem[] => MENU_ICON_ENTRIES;\n`;

fs.writeFileSync(path.join(ROOT, OUT), header + body, "utf8");
console.log(`✅ ${OUT}: ${total} icon tinh tuyển`);
for (const set of allSets) {
  console.log(`   ${set} (${chosen[set].length}): ${chosen[set].slice(0, 12).join(", ")}${chosen[set].length > 12 ? " …" : ""}`);
}

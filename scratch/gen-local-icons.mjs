/**
 * Codegen 1 lần: nội tuyến (inline) đúng các icon react-icons đang dùng ở sidebar/header
 * vào src/components/icons/localIconSet.tsx  => các file đó KHÔNG còn import react-icons,
 * nhờ vậy react-icons chỉ còn nằm trong async chunk của icon picker (admin).
 *
 * Chạy: node scratch/gen-local-icons.mjs
 * Sau khi chạy xong có thể xoá file này (giữ lại cũng được, không ảnh hưởng bundle).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGETS = [
  "src/components/NavMenu/menu/NavMenuCMS.tsx",
  "src/components/NavMenu/menu/NavMenuPVN.tsx",
  "src/components/NavMenu/menu/NavMenuNHATHAN.tsx",
  "src/components/NavMenu/NavMenuNew.tsx",
  "src/components/NotificationPanel/Notification.tsx",
  "src/components/NotificationPanel/NotificationPanel.tsx",
];
const OUT_FILE = "src/components/icons/localIconSet.tsx";

const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*['"]react-icons\/([\w-]+)['"];?/g;

/** 1) Thu thập (set, name) từ các file đích */
const wanted = new Map(); // set -> Set(names)
for (const rel of TARGETS) {
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(src))) {
    const set = m[2];
    const names = m[1].split(",").map((s) => s.trim()).filter(Boolean);
    if (!wanted.has(set)) wanted.set(set, new Set());
    for (const n of names) wanted.get(set).add(n);
  }
}

/** 2) Trích payload GenIcon(...) từ index.esm.js của từng set */
const payloads = new Map(); // name -> json
const missing = [];
for (const [set, names] of wanted) {
  const file = path.join(ROOT, "node_modules/react-icons", set, "index.esm.js");
  const lines = fs.readFileSync(file, "utf8").split("\n");
  for (const name of names) {
    const idx = lines.findIndex((l) => l.startsWith(`export function ${name} (props) {`));
    if (idx === -1) { missing.push(`${set}/${name}`); continue; }
    const ret = lines[idx + 1] || "";
    const s = ret.indexOf("GenIcon(");
    const e = ret.lastIndexOf(")(props);");
    if (s === -1 || e === -1) { missing.push(`${set}/${name} (parse)`); continue; }
    payloads.set(name, ret.slice(s + "GenIcon(".length, e));
  }
}
if (missing.length) {
  console.error("KHÔNG tìm thấy icon:", missing.join(", "));
  process.exit(1);
}

/** 3) Ghi file module icon */
const header = `/**
 * localIconSet — icon nội tuyến (inline) cho sidebar / header / thông báo.
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG react-icons Ở ĐÂY (đo ngày 2026-09-21):
 * Icon picker của MenuManager dùng \`Object.keys(iconSet)\` (liệt kê MỌI icon) nên Rollup phải giữ
 * TOÀN BỘ các bộ icon. Vì sidebar (NavMenuCMS/PVN/NHATHAN) cũng import react-icons, Rollup gom
 * module ĐẦY ĐỦ đó vào chunk dùng chung ⇒ mở drawer phải tải ~2,5 MB icon
 * (react-icons/md 1.789 KB + 714 KB bộ khác).
 *
 * File này chứa ĐÚNG những icon mà sidebar/header/thông báo đang dùng, lấy nguyên path data từ
 * react-icons (các bộ sau đều MIT):
 *   - Flat Color Icons (fc) — CC BY 4.0 / MIT (xem react-icons)
 *   - Font Awesome Free (fa) — CC BY 4.0
 *   - Material Design (md) / Bootstrap Icons (bi) / Ant Design (ai) / Feather (fi) / Weather (wi) / Simple Icons (si) / Game Icons (gi) — MIT/CC0
 * ⇒ sidebar không còn phụ thuộc react-icons nữa.
 *
 * ⚠️ FILE NÀY ĐƯỢC SINH TỰ ĐỘNG bằng \`scratch/gen-local-icons.mjs\` — đừng sửa tay cho lệch.
 * Cần thêm icon: thêm tên vào \`ICON_DATA\` (copy payload GenIcon tương ứng) hoặc chạy lại script
 * sau khi thêm import ở file nguồn.
 */
import React from "react";

type IconNode = { tag: string; attr?: Record<string, any>; child?: IconNode[] };

const tree2Element = (tree?: IconNode[]): any =>
  tree &&
  tree.map((node, i) =>
    React.createElement(node.tag, { key: i, ...node.attr }, tree2Element(node.child))
  );

/** Tương đương GenIcon/IconBase của react-icons (bỏ IconContext vì repo không dùng). */
const genIcon = (data: IconNode) =>
  function LocalIcon(props: any) {
    const { attr, size, title, color, style, className, ...svgProps } = props || {};
    const computedSize = size || "1em";
    return React.createElement(
      "svg",
      {
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0",
        ...data.attr,
        ...attr,
        ...svgProps,
        className,
        style: { color: color, ...style },
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg",
      },
      title && React.createElement("title", null, title),
      tree2Element(data.child)
    );
  };

const ICON_DATA: Record<string, IconNode> = {
`;

let body = "";
for (const [name, json] of payloads) {
  body += `  ${JSON.stringify(name)}: ${json},\n`;
}
const footer = `};

${Array.from(payloads.keys())
  .map((n) => `export const ${n} = genIcon(ICON_DATA[${JSON.stringify(n)}]);`)
  .join("\n")}

export const LOCAL_ICONS = ICON_DATA;
`;

const outPath = path.join(ROOT, OUT_FILE);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, header + body + footer, "utf8");
console.log(`✅ Đã ghi ${OUT_FILE}: ${payloads.size} icon (từ ${wanted.size} bộ)`);

/** 4) Đổi đường dẫn import trong các file đích (giữ nguyên tên icon) */
for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  let src = fs.readFileSync(abs, "utf8");
  const relPath = path
    .relative(path.dirname(rel), "src/components/icons/localIconSet")
    .replace(/\\/g, "/")
    .replace(/^(?![.])/, "./");
  let allNames = [];
  src = src.replace(IMPORT_RE, (_full, names) => {
    allNames = allNames.concat(names.split(",").map((s) => s.trim()).filter(Boolean));
    return `__LOCALICON_IMPORT__`;
  });
  if (allNames.length) {
    src = src.replace(
      "__LOCALICON_IMPORT__",
      `import { ${allNames.join(", ")} } from "${relPath}";`
    );
    fs.writeFileSync(abs, src, "utf8");
    console.log(`   ↳ ${rel}: ${allNames.length} icon → ${relPath}`);
  }
}

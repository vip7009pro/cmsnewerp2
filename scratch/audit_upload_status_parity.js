/**
 * AUDIT: tìm mọi chỗ UPLOAD bản vẽ CAD / Appsheet mà THIẾU bước cập nhật trạng thái vào DB.
 *
 * Quy tắc đúng (M100): sau khi `uploadQuery(file, ..., "banve"|"appsheet")` phải gọi
 * `update_banve_value` / `update_appsheet_value` để set BANVE/APPSHEET = 'Y'.
 * Thiếu bước 2 ⇒ file có trên server nhưng hệ thống vẫn coi "chưa có tài liệu".
 *
 * Chạy (trong cmsnewerp2): node scratch/audit_upload_status_parity.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = "src";
const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      walk(full);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
})(ROOT);

const rows = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const uploadBanVe = /uploadQuery\s*\([^;]*?["']banve["']/s.test(source);
  const uploadAppsheet = /uploadQuery\s*\([^;]*?["']appsheet["']/s.test(source);
  if (!uploadBanVe && !uploadAppsheet) continue;
  const updateBanVe = /update_banve_value/.test(source);
  const updateAppsheet = /update_appsheet_value/.test(source);
  rows.push({ file, uploadBanVe, uploadAppsheet, updateBanVe, updateAppsheet });
}

console.log(`\n=== Quét ${files.length} file TS/TSX — ${rows.length} file có upload banve/appsheet ===\n`);
let problems = 0;
for (const row of rows) {
  const gapBanVe = row.uploadBanVe && !row.updateBanVe;
  const gapAppsheet = row.uploadAppsheet && !row.updateAppsheet;
  if (gapBanVe || gapAppsheet) problems += 1;
  const status = gapBanVe || gapAppsheet ? "❌ THIẾU UPDATE DB" : "✔ đủ 2 bước";
  console.log(`${status}  ${row.file}`);
  console.log(
    `   upload: banve=${row.uploadBanVe ? "Y" : "-"} appsheet=${row.uploadAppsheet ? "Y" : "-"}` +
      ` | update: banve=${row.updateBanVe ? "Y" : "-"} appsheet=${row.updateAppsheet ? "Y" : "-"}` +
      `${gapBanVe ? "  ← thiếu update_banve_value" : ""}${gapAppsheet ? "  ← thiếu update_appsheet_value" : ""}`
  );
}
console.log(`\nKết luận: ${rows.length - problems} file đủ 2 bước, ${problems} file THIẾU.`);

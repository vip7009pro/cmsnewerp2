/**
 * menuIconCatalog — danh mục icon cho dropdown chọn icon của MenuManager.
 *
 * ⚠️ VÌ SAO PHẢI TÁCH RIÊNG FILE NÀY (đo ngày 2026-09-21):
 * Code cũ nằm ngay trong `MenuManager.tsx` và dùng NAMESPACE import + `Object.keys()`:
 *     import * as MdIcons from 'react-icons/md';
 *     Object.keys(MdIcons).map(...)        // <-- buộc giữ MỌI export của bộ icon
 * Namespace + Object.keys khiến Rollup KHÔNG thể tree-shake ⇒ phải giữ TOÀN BỘ 7 bộ icon
 * (~8.000 icon). Vì `react-icons/md`, `/fa`, `/bi`, `/ai`, `/fc` cũng được các file thuộc
 * graph khởi động dùng (Home.tsx, NavMenuCMS/NHATHAN/PVN), Rollup đặt module ĐẦY ĐỦ vào
 * entry chunk ⇒ MỌI user phải tải ~4,9 MB icon dù không mở màn hình no-code.
 *
 * Số đo (plugin analyze trong vite.config.mts, entry chunk 5.466 KB):
 *   react-icons/md 1.943 KB | fa 1.283 KB | bi 762 KB | ai 619 KB | fc 284 KB | fi 38 KB
 *   ⇒ react-icons chiếm 4.929 KB = 90% entry chunk.
 *
 * Cách sửa: tách ra file riêng rồi `await import(...)` trong MenuManager (chỉ nạp khi admin
 * thực sự mở modal chọn icon) ⇒ cả 7 bộ icon nằm trong 1 async chunk.
 * Chức năng KHÔNG đổi: danh mục vẫn đầy đủ và giữ nguyên thứ tự các bộ như bản cũ.
 */
import type { ComponentType } from "react";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as FcIcons from "react-icons/fc";
import * as HiIcons from "react-icons/hi";
import * as IoIcons from "react-icons/io";

export interface MenuIconItem {
  name: string;
  library: string;
  IconComponent: ComponentType<any>;
}

const listOf = (iconSet: any, library: string): MenuIconItem[] =>
  Object.keys(iconSet).map((name) => ({
    name,
    library,
    IconComponent: iconSet[name],
  }));

export const getAllIcons = (): MenuIconItem[] => [
  ...listOf(FaIcons, "fa"),
  ...listOf(MdIcons, "md"),
  ...listOf(BiIcons, "bi"),
  ...listOf(AiIcons, "ai"),
  ...listOf(FcIcons, "fc"),
  ...listOf(HiIcons, "hi"),
  ...listOf(IoIcons, "io"),
];

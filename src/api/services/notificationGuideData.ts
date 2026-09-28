import type { BrowserKind, PlatformKind } from "./platformDetect";

/**
 * Dữ liệu hướng dẫn bật quyền thông báo, chia theo THIẾT BỊ thật của người dùng.
 *
 * Nguyên tắc nội dung:
 * - Mỗi bước = 1 hành động, kèm hình minh hoạ vẽ bằng CSS (không phụ thuộc ảnh ngoài).
 * - Nhãn tiếng Việt + tiếng Anh trong ngoặc (đa số thiết bị người dùng đang chạy bản tiếng Anh).
 * - Chỉ liệt kê đường dẫn/nút có thật, không suy diễn.
 */

export type GuideTarget = "desktop" | "android" | "ios";

export type GuideVisual =
  | { kind: "urlbar"; url: string; callout: string }
  | {
      kind: "menu";
      anchor: string;
      items: { label: string; value?: string; active?: boolean }[];
    }
  | { kind: "toggle"; label: string; hint?: string; on: boolean; stateText: string }
  | {
      kind: "settings";
      title: string;
      rows: { label: string; value?: string; glyph?: string; active?: boolean }[];
    }
  | { kind: "tiles"; caption: string; tiles: { glyph: string; label: string; active?: boolean }[] }
  | { kind: "note"; tone: "info" | "warn" | "ok"; text: string };

export interface GuideStep {
  title: string;
  detail: string;
  visual?: GuideVisual;
}

export interface PlatformGuide {
  id: GuideTarget;
  tabLabel: string;
  /** Mô tả ngắn: hệ điều hành + trình duyệt áp dụng. */
  subtitle: string;
  /** Lối tắt mở trang cài đặt (desktop) — hiển thị kèm nút copy. */
  settingsUrl: string | null;
  /** Hướng dẫn khi quyền đã bị CHẶN (phải vào cài đặt bật lại). */
  deniedSteps: GuideStep[];
  /** Ghi chú cuối khối hướng dẫn. */
  footerNote: string;
}

/* -------------------------------------------------------------------------- */
/* DESKTOP                                                                     */
/* -------------------------------------------------------------------------- */

const CHROMIUM_DESKTOP: GuideStep[] = [
  {
    title: "Mở thông tin trang web",
    detail:
      "Bấm biểu tượng ổ khoá (hoặc nút “Cài đặt trang web”) ở đầu thanh địa chỉ, ngay bên trái địa chỉ trang ERP.",
    visual: {
      kind: "urlbar",
      url: "cmsvina4285.com/qc/iqc",
      callout: "Bấm vào đây",
    },
  },
  {
    title: "Chọn mục “Thông báo”",
    detail:
      "Trong bảng vừa hiện ra, tìm dòng Thông báo (Notifications) và bấm vào đó. Mục này thường nằm trong nhóm “Quyền cho trang này”.",
    visual: {
      kind: "menu",
      anchor: "🔒  cmsvina4285.com",
      items: [
        { label: "Quyền cho trang này", value: "▸" },
        { label: "Thông báo (Notifications)", value: "Chặn", active: true },
        { label: "Camera" },
        { label: "Vị trí (Location)" },
        { label: "Cookie và dữ liệu trang" },
      ],
    },
  },
  {
    title: "Đổi từ “Chặn” sang “Cho phép”",
    detail:
      "Bấm vào ô chọn bên cạnh Thông báo rồi chọn Cho phép (Allow). Không cần bấm Lưu — thay đổi có hiệu lực ngay.",
    visual: {
      kind: "toggle",
      label: "Thông báo (Notifications)",
      hint: "cmsvina4285.com",
      on: true,
      stateText: "Cho phép (Allow)",
    },
  },
  {
    title: "Quay lại ERP và xác nhận",
    detail:
      "Đóng tab cài đặt, quay lại tab ERP. Hệ thống tự phát hiện quyền mới; nếu chưa tự đóng hãy bấm nút “Tôi đã bật lại”.",
    visual: {
      kind: "note",
      tone: "ok",
      text: "Không cần tải lại trang (F5) — ERP kiểm tra lại ngay khi bạn quay lại tab.",
    },
  },
];

const FIREFOX_DESKTOP: GuideStep[] = [
  {
    title: "Mở thông tin trang web",
    detail:
      "Bấm biểu tượng ổ khoá ở đầu thanh địa chỉ để mở bảng quyền của trang ERP.",
    visual: {
      kind: "urlbar",
      url: "cmsvina4285.com/qc/iqc",
      callout: "Bấm vào đây",
    },
  },
  {
    title: "Xoá trạng thái “Đã chặn”",
    detail:
      "Bấm nút Xoá quyền (Clear permission) cho Thông báo. Firefox không cho bật trực tiếp khi quyền đang bị chặn — phải xoá rồi mới hỏi lại.",
    visual: {
      kind: "menu",
      anchor: "🔒  cmsvina4285.com",
      items: [
        { label: "Kết nối an toàn", value: "▸" },
        { label: "Thông báo: Đã chặn", value: "Xoá quyền", active: true },
        { label: "Cookie và dữ liệu trang" },
        { label: "Xoá cookie và dữ liệu trang…" },
      ],
    },
  },
  {
    title: "Tải lại trang rồi bấm “Cho phép”",
    detail:
      "Nhấn F5 để tải lại ERP. Hộp thoại của Firefox sẽ hỏi lại — chọn Cho phép thông báo (Allow).",
    visual: {
      kind: "toggle",
      label: "Thông báo (Notifications)",
      hint: "cmsvina4285.com",
      on: true,
      stateText: "Cho phép (Allow)",
    },
  },
  {
    title: "Quay lại ERP và xác nhận",
    detail:
      "Sau khi đã Cho phép, quay lại tab ERP và bấm nút “Tôi đã bật lại”.",
    visual: {
      kind: "note",
      tone: "ok",
      text: "Nếu không thấy hộp thoại hỏi lại, hãy mở about:preferences#privacy và thêm trang vào danh sách Cho phép.",
    },
  },
];

const SAFARI_MAC: GuideStep[] = [
  {
    title: "Mở Cài đặt của Safari",
    detail:
      "Trên thanh menu của macOS, chọn Safari → Cài đặt (Settings)…, sau đó mở thẻ Websites.",
    visual: {
      kind: "menu",
      anchor: "Safari",
      items: [
        { label: "Cài đặt (Settings)…", active: true, value: "⌘," },
        { label: "Xoá lịch sử…" },
        { label: "Đóng cửa sổ" },
      ],
    },
  },
  {
    title: "Chọn mục “Notifications”",
    detail:
      "Trong danh sách bên trái của thẻ Websites, bấm Notifications để xem các trang đã xin quyền.",
    visual: {
      kind: "settings",
      title: "Safari › Cài đặt › Websites",
      rows: [
        { label: "Camera" },
        { label: "Notifications", glyph: "🔔", active: true },
        { label: "Pop-up Windows" },
        { label: "Location" },
      ],
    },
  },
  {
    title: "Tìm trang ERP và đổi sang “Allow”",
    detail:
      "Tìm dòng chứa địa chỉ ERP (có thể đang là Deny), bấm vào cột bên phải và chọn Allow.",
    visual: {
      kind: "settings",
      title: "Cho phép trang web hỏi quyền thông báo",
      rows: [
        { label: "cmsvina4285.com", value: "Allow", active: true },
        { label: "Khác…", value: "Deny" },
      ],
    },
  },
  {
    title: "Quay lại ERP và xác nhận",
    detail: "Quay lại tab ERP và bấm nút “Tôi đã bật lại”.",
    visual: {
      kind: "note",
      tone: "ok",
      text: "Trên macOS, ERP cũng cần được cấp quyền trong System Settings → Notifications → trình duyệt đang dùng.",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* ANDROID                                                                     */
/* -------------------------------------------------------------------------- */

const ANDROID_STEPS: GuideStep[] = [
  {
    title: "Mở tuỳ chọn của trang web",
    detail:
      "Trên thanh địa chỉ, bấm biểu tượng ổ khoá (Chrome/Cốc Cốc) hoặc chữ “i” trong vòng tròn (Edge) ở bên trái địa chỉ ERP.",
    visual: {
      kind: "urlbar",
      url: "cmsvina4285.com/qc/iqc",
      callout: "Bấm vào đây",
    },
  },
  {
    title: "Chọn “Quyền” → “Thông báo”",
    detail:
      "Bấm Quyền (Permissions) rồi chọn Thông báo (Notifications) trong danh sách.",
    visual: {
      kind: "menu",
      anchor: "🔒  cmsvina4285.com",
      items: [
        { label: "Quyền (Permissions)", value: "▸", active: true },
        { label: "Cookie" },
        { label: "Dữ liệu trang web" },
        { label: "Thông tin trang" },
      ],
    },
  },
  {
    title: "Đổi sang “Cho phép”",
    detail:
      "Bấm Cho phép (Allow) để trình duyệt cấp quyền thông báo cho ERP.",
    visual: {
      kind: "toggle",
      label: "Thông báo (Notifications)",
      hint: "cmsvina4285.com",
      on: true,
      stateText: "Cho phép (Allow)",
    },
  },
  {
    title: "Nếu vẫn bị chặn: bật ở Cài đặt Android",
    detail:
      "Trường hợp trang đã “Cho phép” mà vẫn không có thông báo, hãy mở Cài đặt của điện thoại → Thông báo → tìm trình duyệt đang dùng và bật “Hiện thông báo”.",
    visual: {
      kind: "settings",
      title: "Cài đặt (Settings)",
      rows: [
        { label: "Thông báo (Notifications)", glyph: "🔔", value: "▸", active: true },
        { label: "Ứng dụng (Apps)", value: "▸" },
        { label: "Chrome", value: "▸" },
        { label: "Hiện thông báo", value: "Bật" },
      ],
    },
  },
  {
    title: "Quay lại ERP và xác nhận",
    detail:
      "Mở lại ERP (không cần xoá khỏi danh sách ứng dụng gần đây) rồi bấm nút “Tôi đã bật lại”.",
    visual: {
      kind: "note",
      tone: "ok",
      text: "Android cần BẬT Ở CẢ 2 NƠI: quyền của trang web trong trình duyệt và quyền thông báo của trình duyệt trong Cài đặt máy.",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* iOS                                                                         */
/* -------------------------------------------------------------------------- */

const IOS_STEPS: GuideStep[] = [
  {
    title: "Thêm ERP vào màn hình chính",
    detail:
      "Trong Safari, bấm nút Chia sẻ (hình vuông có mũi tên lên) ở thanh dưới, rồi chọn “Thêm vào màn hình chính” (Add to Home Screen) và bấm Thêm.",
    visual: {
      kind: "menu",
      anchor: "Chia sẻ (Share)",
      items: [
        { label: "Sao chép (Copy)" },
        { label: "Thêm vào Mục ưa thích (Add to Favorites)" },
        { label: "Thêm vào màn hình chính (Add to Home Screen)", active: true },
        { label: "In (Print)" },
      ],
    },
  },
  {
    title: "Mở ERP từ icon vừa tạo",
    detail:
      "Thoát Safari, ra màn hình chính và mở ERP bằng icon vừa thêm. Đây là điều kiện bắt buộc để iPhone/iPad cho phép thông báo đẩy.",
    visual: {
      kind: "tiles",
      caption: "Màn hình chính",
      tiles: [
        { glyph: "📷", label: "Camera" },
        { glyph: "🗓", label: "Lịch" },
        { glyph: "🏭", label: "ERP", active: true },
        { glyph: "⚙️", label: "Cài đặt" },
      ],
    },
  },
  {
    title: "Bấm “Cho phép” khi được hỏi",
    detail:
      "Khi ERP mở lần đầu, iOS sẽ hỏi “ERP muốn gửi thông báo cho bạn” — bấm Cho phép (Allow).",
    visual: {
      kind: "toggle",
      label: "ERP muốn gửi thông báo cho bạn",
      hint: "Thông báo có thể gồm âm thanh, huy hiệu và biểu ngữ",
      on: true,
      stateText: "Cho phép (Allow)",
    },
  },
  {
    title: "Nếu đã lỡ chặn: bật lại trong Cài đặt",
    detail:
      "Mở Cài đặt (Settings) → Thông báo (Notifications) → tìm tên ERP trong danh sách → bật “Cho phép thông báo” (Allow Notifications).",
    visual: {
      kind: "settings",
      title: "Cài đặt (Settings)",
      rows: [
        { label: "Thông báo (Notifications)", glyph: "🔔", value: "▸", active: true },
        { label: "Âm thanh (Sounds)" },
        { label: "Tập trung (Focus)" },
        { label: "Thời gian sử dụng (Screen Time)" },
      ],
    },
  },
  {
    title: "Quay lại ERP và xác nhận",
    detail:
      "Mở lại ERP từ icon ngoài màn hình chính, bấm nút “Tôi đã bật lại”.",
    visual: {
      kind: "note",
      tone: "info",
      text: "Không thấy tên ERP trong Cài đặt → chưa thêm vào màn hình chính; hãy làm lại bước 1. Web Push chỉ hỗ trợ iOS 16.4 trở lên.",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Registry                                                                    */
/* -------------------------------------------------------------------------- */

const GUIDES: Record<GuideTarget, PlatformGuide> = {
  desktop: {
    id: "desktop",
    tabLabel: "Máy tính",
    subtitle: "Chrome / Edge / Cốc Cốc / Opera / Firefox trên Windows, macOS, Linux",
    settingsUrl: "chrome://settings/content/notifications",
    deniedSteps: CHROMIUM_DESKTOP,
    footerNote:
      "Mẹo: dán đường dẫn cài đặt bên trên vào thanh địa chỉ để mở nhanh danh sách trang được phép thông báo.",
  },
  android: {
    id: "android",
    tabLabel: "Android",
    subtitle: "Chrome / Edge / Samsung Internet / Cốc Cốc trên điện thoại & máy tính bảng",
    settingsUrl: null,
    deniedSteps: ANDROID_STEPS,
    footerNote:
      "Mẹo: ở Cài đặt Android, đường dẫn nhanh là Ứng dụng → trình duyệt đang dùng → Thông báo.",
  },
  ios: {
    id: "ios",
    tabLabel: "iPhone / iPad",
    subtitle: "Safari trên iPhone & iPad (yêu cầu iOS 16.4 trở lên)",
    settingsUrl: null,
    deniedSteps: IOS_STEPS,
    footerNote:
      "Mẹo: ở Cài đặt iOS, đường dẫn nhanh là Thông báo → tên ứng dụng ERP → Cho phép thông báo.",
  },
};

/** Hướng dẫn “khác” khi không nhận diện được hệ điều hành. */
const GENERIC_STEPS: GuideStep[] = [
  {
    title: "Mở cài đặt quyền của trình duyệt",
    detail:
      "Tìm tuỳ chọn trang web / quyền của trang (thường ở biểu tượng ổ khoá cạnh thanh địa chỉ).",
    visual: {
      kind: "urlbar",
      url: "cmsvina4285.com/qc/iqc",
      callout: "Bấm vào đây",
    },
  },
  {
    title: "Tìm mục “Thông báo” và đổi sang “Cho phép”",
    detail:
      "Trong danh sách quyền, tìm Thông báo (Notifications) và chuyển từ Chặn sang Cho phép.",
    visual: {
      kind: "toggle",
      label: "Thông báo (Notifications)",
      on: true,
      stateText: "Cho phép (Allow)",
    },
  },
  {
    title: "Quay lại ERP và xác nhận",
    detail: "Quay lại tab ERP rồi bấm nút “Tôi đã bật lại”.",
    visual: {
      kind: "note",
      tone: "ok",
      text: "Nếu vẫn không được, hãy mở Cài đặt của hệ điều hành → Thông báo → chọn trình duyệt đang dùng → Bật.",
    },
  },
];

/** Đổi các bước khi trình duyệt desktop KHÔNG phải Chromium. */
function adaptDesktopSteps(browser: BrowserKind): GuideStep[] {
  if (browser === "firefox") return FIREFOX_DESKTOP;
  if (browser === "safari") return SAFARI_MAC;
  return CHROMIUM_DESKTOP;
}

function settingsUrlFor(browser: BrowserKind, platform: PlatformKind): string | null {
  if (platform !== "desktop" && platform !== "macos" && platform !== "windows" && platform !== "linux") {
    return null;
  }
  switch (browser) {
    case "edge":
      return "edge://settings/content/notifications";
    case "opera":
      return "opera://settings/content/notifications";
    case "firefox":
      return "about:preferences#privacy";
    case "chrome":
    case "coccoc":
    case "samsung":
      return "chrome://settings/content/notifications";
    case "safari":
      return null;
    default:
      return null;
  }
}

/**
 * Lấy hướng dẫn phù hợp với thiết bị + trình duyệt hiện tại.
 * `target` là tab người dùng đang chọn (mặc định = thiết bị tự nhận diện).
 */
export function getGuide(
  target: GuideTarget | "unknown",
  browser: BrowserKind,
  platform: PlatformKind
): PlatformGuide {
  if (target === "unknown" || !GUIDES[target]) {
    return {
      id: "desktop",
      tabLabel: "Trình duyệt khác",
      subtitle: "Hướng dẫn chung cho trình duyệt không xác định",
      settingsUrl: null,
      deniedSteps: GENERIC_STEPS,
      footerNote:
        "Nếu không tìm thấy mục Thông báo, hãy mở Cài đặt hệ điều hành → Thông báo → chọn trình duyệt → Bật.",
    };
  }

  const base = GUIDES[target];
  if (base.id !== "desktop") return base;

  return {
    ...base,
    deniedSteps: adaptDesktopSteps(browser),
    settingsUrl: settingsUrlFor(browser, platform),
  };
}

/** Tab hiển thị cho người dùng: tab của thiết bị hiện tại đứng đầu. */
export const GUIDE_TABS: GuideTarget[] = ["desktop", "android", "ios"];

export const GUIDE_BY_TARGET = GUIDES;

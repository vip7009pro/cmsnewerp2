/**
 * Nhận diện nền tảng (OS) / loại thiết bị / trình duyệt từ User-Agent.
 *
 * Mục đích: hiển thị hướng dẫn bật quyền thông báo ĐÚNG với thiết bị người dùng đang dùng
 * (desktop Windows/macOS, Android, iPhone/iPad) thay vì bắt họ tự đoán.
 *
 * Lưu ý: đây là suy đoán (heuristic) — luôn kèm fallback "khác" để không hiển thị sai hoàn toàn.
 */

export type PlatformKind = "android" | "ios" | "windows" | "macos" | "linux" | "unknown";
export type DeviceKind = "desktop" | "mobile" | "tablet";
export type BrowserKind =
  | "chrome"
  | "edge"
  | "firefox"
  | "opera"
  | "samsung"
  | "coccoc"
  | "safari"
  | "unknown";

export interface PlatformInfo {
  platform: PlatformKind;
  device: DeviceKind;
  browser: BrowserKind;
  /** "Máy tính (Windows)" / "Điện thoại Android" / "iPhone / iPad" … */
  deviceLabel: string;
  browserName: string;
  platformName: string;
  /** iPadOS 13+ tự nhận là MacIntel ⇒ phải dò bằng maxTouchPoints. */
  isIPadDesktopUA: boolean;
  /** iOS/iPadOS chưa "Add to Home Screen" ⇒ Web Push không khả dụng. */
  isIOSWebView: boolean;
}

const ua = (): string => (typeof navigator === "undefined" ? "" : navigator.userAgent || "");

/** iPadOS 13+ gửi UA giống macOS; phân biệt bằng số điểm chạm. */
function isIPadDesktopMode(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1;
}

function isIOSDevice(): boolean {
  const s = ua();
  return /iPhone|iPod|iPad/.test(s) || isIPadDesktopMode();
}

/**
 * Đang chạy ở chế độ PWA standalone (đã "Add to Home Screen") hay chỉ là tab Safari.
 * Trên iOS, Web Push CHỈ hoạt động ở chế độ standalone.
 */
export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  const displayMode = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone;
  return Boolean(displayMode || iosStandalone);
}

function detectPlatform(): { platform: PlatformKind; isIPadDesktopUA: boolean } {
  const s = ua();

  // Thứ tự QUAN TRỌNG: Android UA cũng chứa "Linux", iPad UA cũng chứa "Mac OS X".
  if (/Android/i.test(s) || /Silk\//i.test(s)) return { platform: "android", isIPadDesktopUA: false };
  if (/iPhone|iPod/i.test(s)) return { platform: "ios", isIPadDesktopUA: false };
  if (/iPad/i.test(s)) return { platform: "ios", isIPadDesktopUA: false };
  if (isIPadDesktopMode()) return { platform: "ios", isIPadDesktopUA: true };
  if (/Windows|Win32|Win64/i.test(s)) return { platform: "windows", isIPadDesktopUA: false };
  if (/Mac OS X|Macintosh/i.test(s)) return { platform: "macos", isIPadDesktopUA: false };
  if (/CrOS/i.test(s)) return { platform: "linux", isIPadDesktopUA: false };
  if (/Linux|X11/i.test(s)) return { platform: "linux", isIPadDesktopUA: false };
  return { platform: "unknown", isIPadDesktopUA: false };
}

function detectBrowser(): BrowserKind {
  const s = ua();
  // Thứ tự QUAN TRỌNG: Edge/Opera/Samsung/Cốc Cốc đều chứa "Chrome" trong UA.
  if (/Edg[A-Z]?\//.test(s)) return "edge";
  if (/OPR\/|Opera|OPT\//.test(s)) return "opera";
  if (/SamsungBrowser/i.test(s)) return "samsung";
  if (/CocCoc/i.test(s)) return "coccoc";
  if (/Firefox|FxiOS/i.test(s)) return "firefox";
  if (/Chrome|CriOS|Chromium/i.test(s)) return "chrome";
  if (/Safari\//.test(s)) return "safari";
  return "unknown";
}

const BROWSER_NAMES: Record<BrowserKind, string> = {
  chrome: "Google Chrome",
  edge: "Microsoft Edge",
  firefox: "Firefox",
  opera: "Opera",
  samsung: "Samsung Internet",
  coccoc: "Cốc Cốc",
  safari: "Safari",
  unknown: "trình duyệt",
};

const PLATFORM_NAMES: Record<PlatformKind, string> = {
  android: "Android",
  ios: "iOS / iPadOS",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  unknown: "hệ điều hành",
};

function detectDevice(platform: PlatformKind): DeviceKind {
  if (platform === "android" || platform === "ios") {
    // iPad / máy tính bảng Android: UA chứa "iPad" hoặc "Tablet" (hoặc Android không có "Mobile").
    const s = ua();
    if (/iPad|Tablet/i.test(s)) return "tablet";
    if (platform === "android" && !/Mobile/i.test(s)) return "tablet";
    if (platform === "ios" && isIPadDesktopMode()) return "tablet";
    return "mobile";
  }
  return "desktop";
}

const DEVICE_LABELS: Record<DeviceKind, string> = {
  desktop: "Máy tính",
  mobile: "Điện thoại",
  tablet: "Máy tính bảng",
};

export function getPlatformInfo(): PlatformInfo {
  const { platform, isIPadDesktopUA } = detectPlatform();
  const device = detectDevice(platform);
  const browser = detectBrowser();
  const platformName = PLATFORM_NAMES[platform];

  const deviceLabel =
    device === "desktop"
      ? `${DEVICE_LABELS.desktop} (${platformName})`
      : `${DEVICE_LABELS[device]} ${platformName}`;

  return {
    platform,
    device,
    browser,
    deviceLabel,
    browserName: BROWSER_NAMES[browser],
    platformName,
    isIPadDesktopUA,
    isIOSWebView: platform === "ios" && !isStandalonePwa(),
  };
}

/** Nhãn tab hiển thị trong phần hướng dẫn. */
export function getGuideTabLabel(device: DeviceKind, platform: PlatformKind): string {
  if (device === "desktop") return "Máy tính";
  if (platform === "ios") return "iPhone / iPad";
  if (platform === "android") return "Android";
  return "Điện thoại";
}

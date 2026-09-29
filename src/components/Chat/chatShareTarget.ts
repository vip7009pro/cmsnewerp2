/**
 * Nhận nội dung được CHIA SẺ từ ứng dụng khác (Zalo, Kakao, Gallery...) vào PWA.
 *
 * Luồng chuẩn của Web Share Target (chỉ chạy khi app đã được CÀI như PWA):
 *  1. App khác bấm "Chia sẻ" → chọn ERP trong khay chia sẻ.
 *  2. Trình duyệt POST multipart tới `/share-target` (khai báo trong manifest.json).
 *  3. Service worker chặn POST, lưu payload (JSON + ảnh base64) vào Cache API rồi
 *     redirect 303 về `/share-target?shared=1`.
 *  4. App nạp lại, đọc payload từ Cache ⇒ hiện hộp chọn phòng chat để gửi vào.
 *
 * Cache API được dùng vì SW và trang chia sẻ cùng origin (localStorage/IndexedDB của
 * trang không truy cập được từ SW).
 */

export interface SharedFilePayload {
  name: string;
  type: string;
  size: number;
  /** Nội dung file ở dạng base64 (không có tiền tố data:). */
  data: string;
}

export interface SharedPayload {
  title: string;
  text: string;
  url: string;
  sharedAt: number;
  files: SharedFilePayload[];
}

export const SHARE_CACHE = "erp-share-target-v1";
export const SHARE_KEY = "/__erp-shared-payload";
/** SW chặn POST ở đường dẫn này (khai báo trong manifest.json → share_target.action). */
export const SHARE_TARGET_PATH = "/share-target";
/** Cờ trên URL sau khi SW chuyển hướng về trang chủ. */
export const SHARE_QUERY_FLAG = "shared";

/** Chỉ trình duyệt hỗ trợ Cache API mới đọc được payload do SW lưu. */
export function isShareTargetSupported(): boolean {
  return typeof window !== "undefined" && "caches" in window;
}

/**
 * Lấy payload đã chia sẻ (nếu có) và XOÁ khỏi cache để không hiện lại lần sau.
 */
export async function readSharedPayload(): Promise<SharedPayload | null> {
  if (!isShareTargetSupported()) return null;
  try {
    const cache = await caches.open(SHARE_CACHE);
    const cached = await cache.match(SHARE_KEY);
    if (!cached) return null;
    await cache.delete(SHARE_KEY);
    const payload = (await cached.json()) as SharedPayload;
    if (!payload) return null;
    return {
      title: String(payload.title || ""),
      text: String(payload.text || ""),
      url: String(payload.url || ""),
      sharedAt: Number(payload.sharedAt) || Date.now(),
      files: Array.isArray(payload.files) ? payload.files : [],
    };
  } catch (error) {
    console.warn("[chat] không đọc được payload chia sẻ:", error);
    return null;
  }
}

/** Chuyển file base64 trong payload về `File` để upload như bình thường. */
export function sharedFileToFile(file: SharedFilePayload): File | null {
  try {
    const binary = atob(file.data || "");
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new File([bytes], file.name || `shared-${Date.now()}`, {
      type: file.type || "application/octet-stream",
    });
  } catch (error) {
    console.warn("[chat] tệp chia sẻ không đọc được:", error);
    return null;
  }
}

/** Payload có thực sự có nội dung để gửi không. */
export function sharedPayloadHasContent(payload: SharedPayload | null): boolean {
  if (!payload) return false;
  return Boolean(payload.text.trim() || payload.url.trim() || payload.files.length > 0);
}

/** Nội dung tin nhắn mặc định dựng từ payload chia sẻ. */
export function sharedPayloadContent(payload: SharedPayload): string {
  return [payload.text.trim(), payload.url.trim()].filter(Boolean).join("\n");
}

/**
 * File nhận qua `file_handlers` (mở app bằng "Mở bằng..." từ trình quản lý tệp).
 * Phải gọi SỚM (trước khi launchQueue có dữ liệu vẫn phải đăng ký consumer).
 */
export function collectLaunchQueueFiles(timeoutMs = 1200): Promise<File[]> {
  const nav = window as any;
  if (!nav.launchQueue?.setConsumer) return Promise.resolve([]);

  return new Promise((resolve) => {
    let done = false;
    const finish = (files: File[]) => {
      if (done) return;
      done = true;
      resolve(files);
    };

    nav.launchQueue.setConsumer(async (params: any) => {
      const handles = Array.isArray(params?.files) ? params.files : [];
      const files: File[] = [];
      for (const handle of handles) {
        try {
          files.push(await handle.getFile());
        } catch {
          /* bỏ qua handle lỗi */
        }
      }
      finish(files);
    });

    window.setTimeout(() => finish([]), timeoutMs);
  });
}

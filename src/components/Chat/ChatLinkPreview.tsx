import React, { useEffect, useState } from "react";
import { chatService } from "../../api/services/chatService";

/**
 * Thẻ xem trước liên kết (link preview) hiển thị dưới nội dung tin nhắn.
 *
 * Không thể đọc HTML của trang khác từ trình duyệt (CORS) ⇒ server lấy metadata OG hộ
 * qua command `chatLinkPreview`.
 *
 * Chống spam: cache theo URL ở cấp MODULE (mỗi URL chỉ gọi API 1 lần cho cả phiên),
 * kèm bản đồ "đang gọi" để nhiều tin cùng link không tạo nhiều request.
 */

export interface ChatLinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
}

const cache = new Map<string, ChatLinkPreviewData | null>();
const inflight = new Map<string, Promise<ChatLinkPreviewData | null>>();

/** Host nội bộ — không cần preview (và server cũng chặn). */
function isInternalHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local") ||
      /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)
    );
  } catch {
    return true;
  }
}

export function loadLinkPreview(url: string): Promise<ChatLinkPreviewData | null> {
  if (cache.has(url)) return Promise.resolve(cache.get(url) ?? null);
  const running = inflight.get(url);
  if (running) return running;

  const request = chatService
    .linkPreview(url)
    .then((data) => {
      const useful = data && (data.title || data.description || data.image) ? data : null;
      cache.set(url, useful);
      return useful;
    })
    .catch(() => {
      // Lỗi mạng/trang chặn bot ⇒ coi như không có preview, KHÔNG thử lại liên tục.
      cache.set(url, null);
      return null;
    })
    .finally(() => {
      inflight.delete(url);
    });

  inflight.set(url, request);
  return request;
}

interface Props {
  url: string;
}

export default function ChatLinkPreview({ url }: Props) {
  const [data, setData] = useState<ChatLinkPreviewData | null>(() => cache.get(url) ?? null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
    if (!url || isInternalHost(url)) {
      setData(null);
      return;
    }
    if (cache.has(url)) {
      setData(cache.get(url) ?? null);
      return;
    }
    let cancelled = false;
    void loadLinkPreview(url).then((value) => {
      if (!cancelled) setData(value);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!data) return null;

  const showImage = Boolean(data.image) && !imageFailed;

  return (
    <a
      className="erp-chat__linkPreview"
      href={data.url || url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
    >
      {showImage && (
        <img
          className="erp-chat__linkPreviewImg"
          src={data.image}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="erp-chat__linkPreviewBody">
        {data.siteName && <small className="erp-chat__linkPreviewSite">{data.siteName}</small>}
        <strong className="erp-chat__linkPreviewTitle">{data.title || data.url || url}</strong>
        {data.description && (
          <span className="erp-chat__linkPreviewDesc">{data.description}</span>
        )}
      </span>
    </a>
  );
}

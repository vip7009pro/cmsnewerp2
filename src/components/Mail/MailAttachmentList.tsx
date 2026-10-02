import { useEffect, useRef, useState } from "react";
import { CircularProgress, Dialog, IconButton, Tooltip } from "@mui/material";
import { downloadMailAttachment, fetchMailAttachmentBlob } from "../../api/services/emailService";
import type { MailAttachment } from "./mail.types";
import { attachmentIcon, canPreviewAttachment, formatBytes, isDangerousAttachment } from "./mailUtils";

interface MailAttachmentListProps {
  attachments: MailAttachment[];
}

interface PreviewState {
  name: string;
  url: string;
  isImage: boolean;
  isPdf: boolean;
}

/**
 * Danh sách tệp đính kèm của email.
 * - Tải về bằng Blob (khác origin với API nên không dùng `<a href>` trực tiếp được).
 * - Xem trước inline an toàn cho ảnh/PDF (không bao giờ preview tệp thực thi được).
 * - Cảnh báo rõ với đuôi tệp nguy hiểm (dù server luôn ép tải về với tệp này).
 */
export default function MailAttachmentList({ attachments }: MailAttachmentListProps) {
  const files = (attachments || []).filter((a) => !a.isInline);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const previewUrlRef = useRef<string>("");

  // Dọn object URL khi đổi email/thoát component — tránh rò rỉ bộ nhớ.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  if (files.length === 0) return null;

  const runDownload = async (att: MailAttachment) => {
    if (!att.available || busyId !== null) return;
    setBusyId(att.id);
    setError("");
    try {
      await downloadMailAttachment(att.id, att.fileName);
    } catch (err: any) {
      setError(err?.message || "Không tải được tệp đính kèm");
    } finally {
      setBusyId(null);
    }
  };

  const openPreview = async (att: MailAttachment) => {
    if (!att.available) return;
    setBusyId(att.id);
    setError("");
    setPreviewLoading(true);
    try {
      const blob = await fetchMailAttachmentBlob(att.id);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(blob);
      previewUrlRef.current = url;
      const type = String(att.contentType || blob.type || "").toLowerCase();
      setPreview({
        name: att.fileName,
        url,
        isImage: type.startsWith("image/"),
        isPdf: type.includes("pdf") || /\.pdf$/i.test(att.fileName || ""),
      });
    } catch (err: any) {
      setError(err?.message || "Không mở được tệp đính kèm");
    } finally {
      setBusyId(null);
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
    setPreview(null);
  };

  const downloadAll = async () => {
    for (const att of files) {
      if (!att.available) continue;
      try {
        // Tuần tự để không mở hàng loạt kết nối cùng lúc.
        await downloadMailAttachment(att.id, att.fileName);
      } catch (err: any) {
        setError(err?.message || "Không tải được toàn bộ tệp đính kèm");
        break;
      }
    }
  };

  return (
    <div className="erp-mail__attachmentsWrap">
      <div className="erp-mail__attachmentsHead">
        <span className="erp-mail__attachmentsTitle">
          <span className="material-symbols-outlined">attach_file</span>
          {files.length} tệp đính kèm
        </span>
        {files.length > 1 && (
          <button type="button" className="erp-mail__linkBtn" onClick={downloadAll} disabled={busyId !== null}>
            Tải tất cả
          </button>
        )}
      </div>

      <div className="erp-mail__attachments">
        {files.map((att) => {
          const dangerous = isDangerousAttachment(att.fileName);
          const previewable = canPreviewAttachment(att.fileName, att.contentType);
          return (
            <div key={att.id} className={`erp-mail__attachment${dangerous ? " erp-mail__attachment--danger" : ""}`}>
              <span className="material-symbols-outlined">{attachmentIcon(att.fileName, att.contentType)}</span>
              <button
                type="button"
                className="erp-mail__attachmentName"
                onClick={() => (previewable ? openPreview(att) : runDownload(att))}
                disabled={!att.available}
                title={att.available ? att.fileName : "Tệp chưa sẵn sàng"}
              >
                {att.fileName}
              </button>
              <span className="erp-mail__attachmentSize">{formatBytes(att.fileSize)}</span>
              {dangerous && (
                <Tooltip title="Tệp thực thi được — hãy cẩn thận trước khi mở">
                  <span className="erp-mail__attachmentWarn">
                    <span className="material-symbols-outlined">warning</span>
                  </span>
                </Tooltip>
              )}
              {!att.available && <span className="erp-mail__attachmentError">(chưa sẵn sàng)</span>}
              {previewable && att.available && (
                <button
                  type="button"
                  className="erp-mail__attachmentAction"
                  onClick={() => openPreview(att)}
                  disabled={busyId !== null}
                  title="Xem trước"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              )}
              <button
                type="button"
                className="erp-mail__attachmentAction"
                onClick={() => runDownload(att)}
                disabled={!att.available || busyId !== null}
                title="Tải về"
              >
                {busyId === att.id ? (
                  <CircularProgress size={14} />
                ) : (
                  <span className="material-symbols-outlined">download</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {error && <div className="erp-mail__attachmentErrorBar">{error}</div>}

      <Dialog open={!!preview || previewLoading} onClose={closePreview} maxWidth="lg" fullWidth>
        <div className="erp-mail__preview">
          <div className="erp-mail__previewHead">
            <span className="erp-mail__previewName" title={preview?.name}>
              {preview?.name || "Đang tải…"}
            </span>
            <IconButton size="small" onClick={closePreview} title="Đóng">
              <span className="material-symbols-outlined">close</span>
            </IconButton>
          </div>
          <div className="erp-mail__previewBody">
            {previewLoading || !preview ? (
              <CircularProgress />
            ) : preview.isImage ? (
              <img src={preview.url} alt={preview.name} />
            ) : preview.isPdf ? (
              <iframe src={preview.url} title={preview.name} sandbox="" />
            ) : (
              <div className="erp-mail__previewHint">Không hỗ trợ xem trước loại tệp này — hãy tải về.</div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

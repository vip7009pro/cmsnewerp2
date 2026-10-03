import { useCallback, useEffect, useRef, useState } from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import { emailService } from "../../api/services/emailService";
import type { MailSyncStatusResponse } from "./mail.types";
import { formatMailFullVn } from "./mailUtils";

interface MailSyncStatusProps {
  /** Gọi sau khi yêu cầu đồng bộ (để cha làm mới danh sách). */
  onSynced?: () => void;
}

const POLL_SYNCING_MS = 4000;
const POLL_IDLE_MS = 20000;

/**
 * Thanh TRẠNG THÁI ĐỒNG BỘ: cho user biết tổng thư / đã tải / còn lại / đang đồng bộ.
 * Tự dò lại nhanh (4s) khi có mailbox đang chạy, chậm (20s) khi rảnh.
 */
export default function MailSyncStatus({ onSynced }: MailSyncStatusProps) {
  const [status, setStatus] = useState<MailSyncStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const data = await emailService.syncStatus();
      if (mountedRef.current) setStatus(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const loop = async () => {
      const data = await load();
      const syncing = (data?.totals?.syncing || 0) > 0;
      if (!mountedRef.current) return;
      timerRef.current = window.setTimeout(loop, syncing ? POLL_SYNCING_MS : POLL_IDLE_MS);
    };
    void loop();
    return () => {
      mountedRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [load]);

  const handleSync = async (accountId: number) => {
    setBusyId(accountId);
    try {
      await emailService.syncNow(accountId);
      onSynced?.();
      // Đợi 1 nhịp rồi hỏi lại trạng thái (worker chạy nền).
      window.setTimeout(() => void load(), 1500);
      window.setTimeout(() => void load(), 8000);
    } catch (error: any) {
      console.warn("[mail] syncNow lỗi:", error?.message || error);
    } finally {
      setBusyId(null);
    }
  };

  const totals = status?.totals;
  const hasData = !!totals && (totals.serverTotal > 0 || totals.imported > 0);
  const syncing = (totals?.syncing || 0) > 0;
  // SERVER_TOTAL chỉ biết sau lần đồng bộ THÀNH CÔNG đầu tiên; trước đó tránh hiển thị "Tổng thư: 0".
  const knownTotal = !!totals && totals.serverTotal >= totals.imported && totals.serverTotal > 0;

  return (
    <div className="erp-mail__status">
      <div className="erp-mail__statusLine">
        <span className="material-symbols-outlined erp-mail__statusIcon">cloud_sync</span>
        {!hasData && !syncing && <span>Chưa có dữ liệu đồng bộ</span>}
        {hasData && (
          <span>
            {knownTotal ? (
              <>
                Tổng thư: <b>{totals!.serverTotal}</b> · Đã tải: <b>{totals!.imported}</b>
              </>
            ) : (
              <>
                Đã tải: <b>{totals!.imported}</b>
              </>
            )}
            {knownTotal && totals!.pending > 0 && (
              <>
                {" "}
                · <span className="is-pending">Còn {totals!.pending}</span>
              </>
            )}
          </span>
        )}
        {syncing && (
          <span className="erp-mail__statusSyncing">
            <CircularProgress size={12} /> Đang đồng bộ…
          </span>
        )}
        {!syncing && status?.accounts?.[0]?.lastSyncAt && (
          <span className="erp-mail__statusTime">· Lần cuối {formatMailFullVn(status.accounts[0].lastSyncAt)}</span>
        )}
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="erp-mail__statusBtn"
          onClick={() => setExpanded((v) => !v)}
          title={expanded ? "Thu gọn" : "Chi tiết đồng bộ"}
        >
          <span className="material-symbols-outlined">{expanded ? "expand_less" : "expand_more"}</span>
        </button>
        <button
          type="button"
          className="erp-mail__statusBtn"
          onClick={async () => {
            setLoading(true);
            await load();
            setLoading(false);
          }}
          title="Cập nhật trạng thái"
        >
          {loading ? (
            <CircularProgress size={13} />
          ) : (
            <span className="material-symbols-outlined">refresh</span>
          )}
        </button>
      </div>

      {expanded && (
        <div className="erp-mail__statusDetail">
          {(status?.accounts || []).map((acc) => (
            <div key={acc.accountId} className="erp-mail__statusRow">
              <span className="erp-mail__statusEmail" title={acc.emailAddress}>
                {acc.displayName || acc.emailAddress}
              </span>
              <span className="erp-mail__statusCounts">
                {acc.imported}
                {acc.serverTotal > 0 ? `/${acc.serverTotal}` : ""}
                {acc.pending > 0 ? ` · còn ${acc.pending}` : ""}
              </span>
              {acc.lastError && (
                <Tooltip title={acc.lastError}>
                  <span className="erp-mail__attachmentError">lỗi</span>
                </Tooltip>
              )}
              <button
                type="button"
                className="erp-mail__syncBtn"
                disabled={busyId === acc.accountId || acc.inProgress}
                onClick={() => handleSync(acc.accountId)}
              >
                {busyId === acc.accountId || acc.inProgress ? "Đang đồng bộ…" : "Đồng bộ ngay"}
              </button>
            </div>
          ))}
          {(status?.accounts || []).length === 0 && (
            <div className="erp-mail__statusRow">Chưa cấu hình mailbox nào.</div>
          )}
        </div>
      )}
    </div>
  );
}

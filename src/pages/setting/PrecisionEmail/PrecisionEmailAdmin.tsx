import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { emailService, type MailSyncAllState } from "../../../api/services/emailService";
import { formatMailFull } from "../../../components/Mail/mailUtils";
import PrecisionEmailImportModal from "./PrecisionEmailImportModal";
import type {
  MailAdminMailbox,
  MailAdminOverview,
  MailStorageDashboard,
  MailSyncLogRow,
} from "../../../components/Mail/mail.types";
import "./PrecisionEmailAdmin.scss";

const REFRESH_INTERVAL_MS = 20000;

/** Định dạng dung lượng. */
function formatBytes(bytes?: number | null): string {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatNumber(value?: number | null): string {
  return Number(value || 0).toLocaleString("vi-VN");
}

type StatusFilter = "all" | "active" | "inactive" | "error";

/**
 * Trang quản trị module Email (Phase 8):
 *  - Bảng mailbox kèm số liệu (số email/đính kèm/dung lượng/chưa đọc/lỗi đồng bộ).
 *  - Thao tác: bật/tắt, kiểm tra kết nối, đồng bộ ngay, reset con trỏ, xem nhật ký.
 *  - Dashboard dung lượng: tổng, theo nhân viên, theo năm, tăng trưởng 14 ngày.
 *  - Đối soát DB ↔ NAS ngay (kiểm tra toàn vẹn).
 */
export default function PrecisionEmailAdmin() {
  const [overview, setOverview] = useState<MailAdminOverview | null>(null);
  const [storage, setStorage] = useState<MailStorageDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [logAccount, setLogAccount] = useState<MailAdminMailbox | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [syncAll, setSyncAll] = useState<MailSyncAllState | null>(null);
  const [logs, setLogs] = useState<MailSyncLogRow[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const searchTimerRef = useRef<number | null>(null);

  const load = useCallback(async (withStorage = true) => {
    setLoading(true);
    setError(null);
    try {
      const data = await emailService.adminOverview();
      setOverview(data);
      if (withStorage) {
        setStorage(await emailService.storageDashboard().catch(() => null));
      }
    } catch (err: any) {
      setError(err?.message || "Không tải được dữ liệu quản trị Email");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Tự cập nhật để thấy trạng thái đang đồng bộ / lỗi mới (nhẹ: 1 request).
  useEffect(() => {
    const timer = window.setInterval(() => void load(false), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  // Theo dõi tiến độ "đồng bộ hàng loạt" (chỉ poll khi đang chạy).
  useEffect(() => {
    if (!syncAll?.running) return;
    const timer = window.setInterval(() => {
      void emailService
        .syncAllStatus()
        .then((state) => {
          setSyncAll(state);
          if (!state.running) void load(false);
        })
        .catch(() => undefined);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [syncAll?.running, load]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4000);
  };

  const mailboxes = overview?.mailboxes || [];
  const totals = overview?.totals;

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return mailboxes.filter((box) => {
      if (statusFilter === "active" && !box.isActive) return false;
      if (statusFilter === "inactive" && box.isActive) return false;
      if (statusFilter === "error" && box.lastSyncStatus !== "ERROR") return false;
      if (!keyword) return true;
      return [box.emailAddress, box.emplNo, box.emplName, box.displayName, box.pop3Host]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [mailboxes, search, statusFilter]);

  const run = async (id: number, action: () => Promise<unknown>, successMessage: string) => {
    setBusyId(id);
    setError(null);
    try {
      await action();
      flash(successMessage);
      await load(false);
    } catch (err: any) {
      setError(err?.message || "Thao tác thất bại");
    } finally {
      setBusyId(null);
    }
  };

  const openLogs = async (box: MailAdminMailbox) => {
    setLogAccount(box);
    setLogs([]);
    setLogsLoading(true);
    try {
      setLogs(await emailService.syncLogList(box.id, 50));
    } catch (err: any) {
      setError(err?.message || "Không tải được nhật ký đồng bộ");
    } finally {
      setLogsLoading(false);
    }
  };

  const reconcileNow = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await emailService.reconcileNow();
      flash(`Đối soát xong: sửa REF_COUNT ${result.refs}, dọn file mồ côi ${result.orphans}, file thiếu ${result.failed} (${result.ms}ms)`);
      await load();
    } catch (err: any) {
      setError(err?.message || "Đối soát thất bại");
    } finally {
      setLoading(false);
    }
  };

  const startSyncAll = async () => {
    setError(null);
    try {
      const state = await emailService.syncAll();
      setSyncAll(state);
      flash(state.started === false ? "Đang có tiến trình đồng bộ hàng loạt chạy sẵn" : `Đã bắt đầu đồng bộ ${state.total} mailbox`);
    } catch (err: any) {
      setError(err?.message || "Không bắt đầu được đồng bộ hàng loạt");
    }
  };

  const growthMax = Math.max(1, ...(storage?.growth || []).map((d) => d.messageCount));

  return (
    <div className="precision-email">
      <div className="precision-email__header">
        <div>
          <h1 className="precision-email__title">Quản trị Email</h1>
          <p className="precision-email__subtitle">
            Mailbox POP3/SMTP · nhật ký đồng bộ · dung lượng NAS · toàn vẹn dữ liệu
          </p>
        </div>
        <div className="precision-email__actions">
          <TextField
            size="small"
            placeholder="Tìm nhân viên / email / host…"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current);
              searchTimerRef.current = window.setTimeout(() => setSearch(value), 320);
            }}
            className="precision-email__search"
          />
          <Button size="small" variant="outlined" onClick={() => setShowImport(true)}>
            Nhập từ Excel
          </Button>
          <Tooltip title="Đẩy đồng bộ cho TẤT CẢ mailbox đang bật (chạy nền, tuần tự)">
            <span>
              <Button
                size="small"
                variant="outlined"
                onClick={() => void startSyncAll()}
                disabled={syncAll?.running === true}
              >
                {syncAll?.running ? `Đang đồng bộ ${syncAll.processed}/${syncAll.total}…` : "Đồng bộ tất cả"}
              </Button>
            </span>
          </Tooltip>
          <Button size="small" variant="outlined" onClick={() => void reconcileNow()} disabled={loading}>
            Đối soát ngay
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<RefreshRoundedIcon />}
            onClick={() => void load()}
            disabled={loading}
          >
            Tải lại
          </Button>
        </div>
      </div>

      {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 1.5 }}>{notice}</Alert>}

      {syncAll?.running && (
        <div className="precision-email__syncAll">
          <CircularProgress size={14} />
          Đang đồng bộ hàng loạt: <b>{syncAll.processed}/{syncAll.total}</b> mailbox
          (thành công {syncAll.ok} · lỗi {syncAll.failed}) — bắt đầu {syncAll.startedAt ? formatMailFull(syncAll.startedAt) : "—"}
        </div>
      )}
      {!syncAll?.running && syncAll?.finishedAt && (
        <div className="precision-email__syncAll is-done">
          Đồng bộ hàng loạt xong lúc {formatMailFull(syncAll.finishedAt)}: {syncAll.ok}/{syncAll.total} thành công
          {syncAll.failed > 0 ? `, ${syncAll.failed} lỗi` : ""}
        </div>
      )}

      <div className="precision-email__kpis">
        <div className="precision-email__kpi">
          <span className="precision-email__kpiLabel">Mailbox</span>
          <span className="precision-email__kpiValue">
            {formatNumber(totals?.activeMailboxCount)}/{formatNumber(totals?.mailboxCount)}
          </span>
          <span className="precision-email__kpiHint">đang bật / tổng</span>
        </div>
        <div className="precision-email__kpi">
          <span className="precision-email__kpiLabel">Email đã tải</span>
          <span className="precision-email__kpiValue">{formatNumber(totals?.messageCount)}</span>
          <span className="precision-email__kpiHint">còn thiếu {formatNumber(totals?.pending)}</span>
        </div>
        <div className="precision-email__kpi">
          <span className="precision-email__kpiLabel">Đính kèm</span>
          <span className="precision-email__kpiValue">{formatNumber(totals?.attachmentCount)}</span>
          <span className="precision-email__kpiHint">
            {formatNumber(storage?.totals?.physicalFiles)} file trên NAS
          </span>
        </div>
        <div className="precision-email__kpi">
          <span className="precision-email__kpiLabel">Dung lượng</span>
          <span className="precision-email__kpiValue">{formatBytes(totals?.storageBytes)}</span>
          <span className="precision-email__kpiHint">
            tiết kiệm nhờ dedup {formatBytes(storage?.totals?.dedupSavedBytes)}
          </span>
        </div>
        <div className="precision-email__kpi">
          <span className="precision-email__kpiLabel">Chưa đọc</span>
          <span className="precision-email__kpiValue">{formatNumber(totals?.unreadCount)}</span>
          <span className="precision-email__kpiHint">toàn bộ mailbox</span>
        </div>
        <div className={`precision-email__kpi${totals?.errorMailboxCount ? " is-danger" : ""}`}>
          <span className="precision-email__kpiLabel">Mailbox lỗi</span>
          <span className="precision-email__kpiValue">{formatNumber(totals?.errorMailboxCount)}</span>
          <span className="precision-email__kpiHint">
            file mồ côi {formatNumber(storage?.totals?.orphanFiles)}
          </span>
        </div>
      </div>

      <div className="precision-email__filters">
        {(
          [
            { key: "all", label: `Tất cả (${mailboxes.length})` },
            { key: "active", label: "Đang bật" },
            { key: "inactive", label: "Đang tắt" },
            { key: "error", label: `Lỗi (${totals?.errorMailboxCount || 0})` },
          ] as { key: StatusFilter; label: string }[]
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            className={`precision-email__pill${statusFilter === item.key ? " is-active" : ""}`}
            onClick={() => setStatusFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
        {loading && <CircularProgress size={16} />}
      </div>

      <div className="precision-email__tableWrap">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Mailbox</TableCell>
              <TableCell>POP3</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đồng bộ gần nhất</TableCell>
              <TableCell align="right">Email / Còn thiếu</TableCell>
              <TableCell align="right">Đính kèm</TableCell>
              <TableCell align="right">Dung lượng</TableCell>
              <TableCell align="right">Chưa đọc</TableCell>
              <TableCell>Lỗi gần nhất</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((box) => (
              <TableRow key={box.id} hover>
                <TableCell>
                  <div className="precision-email__empl">{box.emplName || box.displayName || "—"}</div>
                  <div className="precision-email__muted">{box.emplNo || "dùng chung"}</div>
                </TableCell>
                <TableCell>
                  <div>{box.emailAddress}</div>
                  {box.isShared && <Chip size="small" label="dùng chung" sx={{ height: 16, fontSize: 10 }} />}
                </TableCell>
                <TableCell className="precision-email__muted">
                  {box.pop3Host || "—"}:{box.pop3Port ?? "—"}
                  {box.pop3Secure ? " (SSL)" : ""}
                </TableCell>
                <TableCell>
                  <span
                    className={`precision-email__status precision-email__status--${
                      !box.isActive ? "off" : box.lastSyncStatus === "ERROR" ? "error" : box.inProgress ? "syncing" : "ok"
                    }`}
                  >
                    {!box.isActive
                      ? "Đang tắt"
                      : box.inProgress
                      ? "Đang đồng bộ…"
                      : box.lastSyncStatus === "ERROR"
                      ? "Lỗi"
                      : "Hoạt động"}
                  </span>
                </TableCell>
                <TableCell className="precision-email__muted">
                  {box.lastSyncAt ? formatMailFull(box.lastSyncAt) : "chưa đồng bộ"}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(box.messageCount)}
                  {box.pending > 0 && <span className="precision-email__pending"> +{formatNumber(box.pending)}</span>}
                </TableCell>
                <TableCell align="right">{formatNumber(box.attachmentCount)}</TableCell>
                <TableCell align="right">{formatBytes(box.storageBytes)}</TableCell>
                <TableCell align="right">{formatNumber(box.unreadCount)}</TableCell>
                <TableCell>
                  {box.lastError ? (
                    <Tooltip title={box.lastError}>
                      <span className="precision-email__errText">{box.lastError}</span>
                    </Tooltip>
                  ) : (
                    <span className="precision-email__muted">—</span>
                  )}
                </TableCell>
                <TableCell align="center">
                  <div className="precision-email__rowActions">
                    <Tooltip title={box.isActive ? "Tắt mailbox" : "Bật mailbox"}>
                      <button
                        type="button"
                        className="precision-email__iconBtn"
                        disabled={busyId === box.id}
                        onClick={() =>
                          void run(
                            box.id,
                            () => emailService.accountToggle(box.id, !box.isActive),
                            box.isActive ? "Đã tắt mailbox" : "Đã bật mailbox"
                          )
                        }
                      >
                        <span className="material-symbols-outlined">{box.isActive ? "pause" : "play_arrow"}</span>
                      </button>
                    </Tooltip>
                    <Tooltip title="Kiểm tra kết nối POP3">
                      <button
                        type="button"
                        className="precision-email__iconBtn"
                        disabled={busyId === box.id}
                        onClick={() =>
                          void run(
                            box.id,
                            async () => {
                              const res = await emailService.accountTest(box.id);
                              flash(res.message);
                            },
                            "Đã kiểm tra kết nối"
                          )
                        }
                      >
                        <span className="material-symbols-outlined">wifi_tethering</span>
                      </button>
                    </Tooltip>
                    <Tooltip title="Đồng bộ ngay">
                      <button
                        type="button"
                        className="precision-email__iconBtn"
                        disabled={busyId === box.id || !box.isActive}
                        onClick={() => void run(box.id, () => emailService.syncNow(box.id), "Đã gửi yêu cầu đồng bộ")}
                      >
                        <span className="material-symbols-outlined">sync</span>
                      </button>
                    </Tooltip>
                    <Tooltip title="Xem nhật ký đồng bộ">
                      <button type="button" className="precision-email__iconBtn" onClick={() => void openLogs(box)}>
                        <span className="material-symbols-outlined">receipt_long</span>
                      </button>
                    </Tooltip>
                    <Tooltip title="Đặt lại con trỏ đồng bộ (tải lại từ đầu)">
                      <button
                        type="button"
                        className="precision-email__iconBtn is-danger"
                        disabled={busyId === box.id}
                        onClick={() => {
                          if (!window.confirm(`Đặt lại con trỏ đồng bộ của ${box.emailAddress}? Lần tới sẽ quét lại từ đầu (không tạo trùng).`)) return;
                          void run(box.id, () => emailService.accountReset(box.id), "Đã đặt lại con trỏ đồng bộ");
                        }}
                      >
                        <span className="material-symbols-outlined">restart_alt</span>
                      </button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={11} align="center" className="precision-email__empty">
                  Không có mailbox phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dung lượng theo nhân viên + theo năm + tăng trưởng */}
      <div className="precision-email__grid">
        <div className="precision-email__card">
          <h2 className="precision-email__cardTitle">Dung lượng theo nhân viên</h2>
          <div className="precision-email__cardBody">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nhân viên</TableCell>
                  <TableCell align="right">Mailbox</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Đính kèm</TableCell>
                  <TableCell align="right">Dung lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(storage?.byEmployee || overview?.byEmployee || []).slice(0, 12).map((emp) => (
                  <TableRow key={emp.emplNo || "shared"} hover>
                    <TableCell>
                      {emp.emplName || emp.emplNo || "Mailbox dùng chung"}
                      {emp.emplNo && <span className="precision-email__muted"> · {emp.emplNo}</span>}
                    </TableCell>
                    <TableCell align="right">{formatNumber(emp.mailboxCount)}</TableCell>
                    <TableCell align="right">{formatNumber(emp.messageCount)}</TableCell>
                    <TableCell align="right">{formatNumber(emp.attachmentCount)}</TableCell>
                    <TableCell align="right">{formatBytes(emp.storageBytes)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="precision-email__card">
          <h2 className="precision-email__cardTitle">Theo năm</h2>
          <div className="precision-email__cardBody">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Năm</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Dung lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(storage?.byYear || []).map((row) => (
                  <TableRow key={row.year} hover>
                    <TableCell>{row.year}</TableCell>
                    <TableCell align="right">{formatNumber(row.messageCount)}</TableCell>
                    <TableCell align="right">{formatBytes(row.bytes)}</TableCell>
                  </TableRow>
                ))}
                {(storage?.byYear || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" className="precision-email__muted">
                      Chưa có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="precision-email__card">
          <h2 className="precision-email__cardTitle">Tăng trưởng 14 ngày</h2>
          <div className="precision-email__cardBody">
            <div className="precision-email__spark">
              {(storage?.growth || []).map((point) => (
                <Tooltip key={point.day} title={`${point.day}: ${formatNumber(point.messageCount)} email`}>
                  <div
                    className="precision-email__sparkBar"
                    style={{ height: `${Math.max(4, (point.messageCount / growthMax) * 100)}%` }}
                  />
                </Tooltip>
              ))}
              {(storage?.growth || []).length === 0 && <span className="precision-email__muted">Chưa có dữ liệu</span>}
            </div>
          </div>
        </div>
      </div>

      <PrecisionEmailImportModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onImported={() => void load()}
      />

      <Dialog open={!!logAccount} onClose={() => setLogAccount(null)} maxWidth="lg" fullWidth>
        <div className="precision-email__logDialog">
          <div className="precision-email__logHead">
            <div>
              <div className="precision-email__logTitle">Nhật ký đồng bộ</div>
              <div className="precision-email__muted">{logAccount?.emailAddress}</div>
            </div>
            <div className="precision-email__actions">
              <Button
                size="small"
                variant="outlined"
                onClick={() => logAccount && void emailService.syncNow(logAccount.id)}
              >
                Đồng bộ ngay
              </Button>
              <IconButton size="small" onClick={() => setLogAccount(null)} title="Đóng">
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
          <div className="precision-email__logBody">
            {logsLoading && <CircularProgress size={20} />}
            {!logsLoading && (
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Bắt đầu</TableCell>
                    <TableCell>Kết thúc</TableCell>
                    <TableCell align="right">Kết nối</TableCell>
                    <TableCell align="right">Tìm thấy</TableCell>
                    <TableCell align="right">Đã tải</TableCell>
                    <TableCell align="right">Đính kèm</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Thời gian</TableCell>
                    <TableCell>Lỗi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((row) => (
                    <TableRow key={row.ID} hover>
                      <TableCell>{formatMailFull(row.STARTED_AT as unknown as string)}</TableCell>
                      <TableCell>{row.FINISHED_AT ? formatMailFull(row.FINISHED_AT as unknown as string) : "—"}</TableCell>
                      <TableCell align="right">
                        {row.CONNECTED === true || row.CONNECTED === 1 ? "OK" : "✕"}
                      </TableCell>
                      <TableCell align="right">{formatNumber(row.NEW_COUNT)}</TableCell>
                      <TableCell align="right">{formatNumber(row.IMPORTED_COUNT)}</TableCell>
                      <TableCell align="right">{formatNumber(row.ATTACH_COUNT)}</TableCell>
                      <TableCell>
                        <span
                          className={`precision-email__status precision-email__status--${
                            row.STATUS === "ERROR" ? "error" : row.STATUS === "SUCCESS" ? "ok" : "off"
                          }`}
                        >
                          {row.STATUS}
                        </span>
                      </TableCell>
                      <TableCell align="right">{row.DURATION_MS ? `${Math.round(row.DURATION_MS / 1000)}s` : "—"}</TableCell>
                      <TableCell>
                        {row.ERROR_MESSAGE ? (
                          <Tooltip title={row.ERROR_MESSAGE}>
                            <span className="precision-email__errText">
                              {row.ERROR_CODE ? `[${row.ERROR_CODE}] ` : ""}
                              {row.ERROR_MESSAGE}
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="precision-email__muted">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" className="precision-email__muted">
                        Chưa có lượt đồng bộ nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

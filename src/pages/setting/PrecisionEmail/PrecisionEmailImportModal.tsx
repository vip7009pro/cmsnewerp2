import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Alert, Button, CircularProgress, Dialog, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { emailService, type MailImportResult } from "../../../api/services/emailService";
import "./PrecisionEmailImportModal.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Gọi sau khi nhập thành công để trang quản trị tải lại số liệu. */
  onImported: () => void;
}

/** Tên cột trong tệp mẫu (backend nhận cả bản tiếng Việt không dấu & có dấu). */
const TEMPLATE_HEADERS = [
  "MÃ NV",
  "EMAIL",
  "TÊN HIỂN THỊ",
  "MÁY CHỦ POP3",
  "CỔNG POP3",
  "SSL",
  "USERNAME",
  "PASSWORD",
  "IS_ACTIVE",
  "DÙNG CHUNG",
];

const PREVIEW_ROWS = 10;

/**
 * Nhập HÀNG LOẠT tài khoản email từ tệp Excel (chỉ admin).
 *
 * FE chỉ đọc tệp rồi gửi nguyên dữ liệu dòng lên backend — backend là nơi DUY NHẤT
 * hiểu các tên cột (kể cả tiếng Việt), tránh hai nơi lệch quy tắc.
 */
export default function PrecisionEmailImportModal({ open, onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MailImportResult | null>(null);

  const reset = () => {
    setRows([]);
    setFileName("");
    setResult(null);
    setError(null);
  };

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("Tệp không có sheet nào");
      const sheet = workbook.Sheets[sheetName];
      const parsed = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
      if (parsed.length === 0) throw new Error("Không đọc được dòng dữ liệu nào (kiểm tra dòng tiêu đề)");
      setRows(parsed);
      setFileName(file.name);
    } catch (err: any) {
      setRows([]);
      setFileName("");
      setError(err?.message || "Không đọc được tệp Excel");
    }
  };

  const downloadTemplate = () => {
    const sample = [
      {
        "MÃ NV": "NHU1903",
        EMAIL: "nvh1903@cmsbando.com",
        "TÊN HIỂN THỊ": "Nguyễn Văn Hùng",
        "MÁY CHỦ POP3": "mail.cmsbando.com",
        "CỔNG POP3": 110,
        SSL: "x",
        USERNAME: "nvh1903@cmsbando.com",
        PASSWORD: "matkhau123",
        IS_ACTIVE: "x",
        "DÙNG CHUNG": "",
      },
      {
        "MÃ NV": "NVH1011",
        EMAIL: "nghoai@cmsbando.com",
        "TÊN HIỂN THỊ": "Nguyễn Viết Hoài",
        "MÁY CHỦ POP3": "mail.cmsbando.com",
        "CỔNG POP3": 995,
        SSL: "x",
        USERNAME: "nghoai@cmsbando.com",
        PASSWORD: "matkhau456",
        IS_ACTIVE: "x",
        "DÙNG CHUNG": "",
      },
    ];
    const sheet = XLSX.utils.json_to_sheet(sample, { header: TEMPLATE_HEADERS });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Mailbox");
    const note = XLSX.utils.aoa_to_sheet([
      ["HƯỚNG DẪN NHANH"],
      ["- MÃ NV: mã nhân sự trong ERP (bắt buộc, trừ mailbox dùng chung)."],
      ["- EMAIL + MÁY CHỦ POP3: bắt buộc. CỔNG POP3: 110 (không SSL) hoặc 995 (SSL)."],
      ["- SSL / IS_ACTIVE / DÙNG CHUNG: đánh x = có; để trống = không."],
      ["- PASSWORD: bắt buộc với dòng MỚI; dòng đã có thì để trống nếu không đổi mật khẩu."],
      ["- Có thể dùng tên cột tiếng Anh: EMPL_NO, EMAIL_ADDRESS, POP3_HOST, POP3_PORT, POP3_SECURE, POP3_PASSWORD..."],
    ]);
    XLSX.utils.book_append_sheet(workbook, note, "Hướng dẫn");
    XLSX.writeFile(workbook, "mau-import-mailbox.xlsx");
  };

  const run = async (dryRun: boolean) => {
    if (rows.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const res = await emailService.accountImport(rows, dryRun);
      setResult(res);
      if (!dryRun && (res.created > 0 || res.updated > 0)) onImported();
    } catch (err: any) {
      setError(err?.message || "Nhập dữ liệu thất bại");
    } finally {
      setBusy(false);
    }
  };

  const previewColumns = rows[0] ? Object.keys(rows[0]).slice(0, 8) : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <div className="pe-import">
        <div className="pe-import__head">
          <span className="pe-import__title">
            <span className="material-symbols-outlined">upload_file</span>
            Nhập danh sách tài khoản email từ Excel
          </span>
          <IconButton size="small" onClick={onClose} title="Đóng">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="pe-import__body">
          <div className="pe-import__steps">
            <div className="pe-import__step">
              <b>1.</b> Tải tệp mẫu, điền danh sách nhân viên &amp; tài khoản email.
              <Button size="small" startIcon={<DownloadRoundedIcon />} onClick={downloadTemplate}>
                Tải tệp mẫu
              </Button>
            </div>
            <div className="pe-import__step">
              <b>2.</b> Chọn tệp Excel (.xlsx/.xls/.csv) rồi kiểm tra trước khi nhập.
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                  e.target.value = "";
                }}
              />
              <Button
                size="small"
                variant="outlined"
                startIcon={<UploadFileRoundedIcon />}
                onClick={() => fileRef.current?.click()}
              >
                Chọn tệp
              </Button>
            </div>
          </div>

          {fileName && (
            <div className="pe-import__file">
              <span className="material-symbols-outlined">description</span>
              <b>{fileName}</b>
              <span className="pe-import__muted">· {rows.length} dòng dữ liệu</span>
              <button type="button" className="pe-import__clear" onClick={reset}>
                Xoá tệp
              </button>
            </div>
          )}

          {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

          {result && (
            <Alert severity={result.errors.length > 0 ? "warning" : "success"} sx={{ mb: 1.5 }}>
              {result.dryRun ? "KIỂM TRA (chưa ghi vào hệ thống): " : "ĐÃ NHẬP: "}
              tổng {result.total} dòng · tạo mới <b>{result.created}</b> · cập nhật <b>{result.updated}</b> ·
              bỏ qua <b>{result.skipped}</b>
              {result.errors.length > 0 && ` · ${result.errors.length} lỗi`}
              {result.warnings.length > 0 && ` · ${result.warnings.length} cảnh báo`}
            </Alert>
          )}

          {result && result.errors.length > 0 && (
            <div className="pe-import__issues">
              <div className="pe-import__issuesTitle">Dòng lỗi (không nhập)</div>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Dòng</TableCell>
                    <TableCell>Mục</TableCell>
                    <TableCell>Lý do</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.errors.slice(0, 50).map((item) => (
                    <TableRow key={`${item.row}-${item.message}`}>
                      <TableCell>{item.row}</TableCell>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{item.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {result && result.warnings.length > 0 && (
            <div className="pe-import__issues">
              <div className="pe-import__issuesTitle">Cảnh báo (vẫn nhập)</div>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Dòng</TableCell>
                    <TableCell>Mục</TableCell>
                    <TableCell>Nội dung</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.warnings.slice(0, 30).map((item) => (
                    <TableRow key={`${item.row}-${item.message}`}>
                      <TableCell>{item.row}</TableCell>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{item.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!result && rows.length > 0 && (
            <>
              <div className="pe-import__muted" style={{ marginBottom: 6 }}>
                Xem trước {Math.min(PREVIEW_ROWS, rows.length)}/{rows.length} dòng:
              </div>
              <div className="pe-import__preview">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {previewColumns.map((column) => (
                        <TableCell key={column}>{column}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.slice(0, PREVIEW_ROWS).map((row, index) => (
                      <TableRow key={index}>
                        {previewColumns.map((column) => (
                          <TableCell key={column}>{String(row[column] ?? "")}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>

        <div className="pe-import__foot">
          <Tooltip title="Chỉ kiểm tra dữ liệu, KHÔNG ghi vào hệ thống">
            <span>
              <Button size="small" variant="outlined" disabled={rows.length === 0 || busy} onClick={() => void run(true)}>
                Kiểm tra trước
              </Button>
            </span>
          </Tooltip>
          <Button
            size="small"
            variant="contained"
            disabled={rows.length === 0 || busy}
            onClick={() => void run(false)}
            startIcon={busy ? <CircularProgress size={14} color="inherit" /> : undefined}
          >
            {busy ? "Đang xử lý…" : `Nhập ${rows.length || ""} dòng`}
          </Button>
          <Button size="small" onClick={onClose} disabled={busy}>
            Đóng
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

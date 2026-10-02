import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Chip, CircularProgress, Dialog, IconButton, TextField } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { emailService } from "../../api/services/emailService";
import type { MailContactGroup } from "./mail.types";
import { countAddresses, parseAddressText } from "./mailUtils";

interface MailContactBookProps {
  open: boolean;
  onClose: () => void;
  groups: MailContactGroup[];
  loading?: boolean;
  /** Nạp lại danh sách nhóm sau khi thêm/sửa/xoá. */
  onReload: () => Promise<void> | void;
  /** Mở dialog "Lưu To/Cc thành nhóm" (dùng khi chưa có nguồn sẵn). */
  onComposeGroup?: () => void;
}

interface EditorState {
  id: number | null;
  name: string;
  description: string;
  membersText: string;
  isShared: boolean;
}

const EMPTY_EDITOR: EditorState = { id: null, name: "", description: "", membersText: "", isShared: false };

/**
 * QUẢN LÝ DANH BẠ — tạo nhóm danh bạ để gửi nhanh / CC nhanh.
 * Mỗi người chỉ thấy nhóm của mình + nhóm dùng chung của công ty; chỉ sửa được nhóm của mình.
 */
export default function MailContactBook({ open, onClose, groups, loading, onReload, onComposeGroup }: MailContactBookProps) {
  const [keyword, setKeyword] = useState("");
  const [editor, setEditor] = useState<EditorState>(EMPTY_EDITOR);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEditor(EMPTY_EDITOR);
      setError(null);
      setInfo(null);
      setKeyword("");
      setExpandedId(null);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.description || "").toLowerCase().includes(q) ||
        g.members.some((m) => m.address.toLowerCase().includes(q) || (m.name || "").toLowerCase().includes(q))
    );
  }, [groups, keyword]);

  const memberPreviewCount = countAddresses(editor.membersText);

  const startEdit = (group: MailContactGroup) => {
    setError(null);
    setInfo(null);
    setEditor({
      id: group.id,
      name: group.name,
      description: group.description || "",
      membersText: group.members.map((m) => (m.name ? `${m.name} <${m.address}>` : m.address)).join(", "),
      isShared: group.isShared,
    });
    setExpandedId(group.id);
  };

  const handleSave = async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await emailService.contactGroupSave({
        ID: editor.id || undefined,
        GROUP_NAME: editor.name,
        DESCRIPTION: editor.description,
        ADDRESSES: editor.membersText,
        IS_SHARED: editor.isShared,
        REPLACE: true,
      });
      setInfo(result.message + (result.invalidAddresses?.length ? ` — đã bỏ ${result.invalidAddresses.length} địa chỉ không hợp lệ.` : ""));
      setEditor(EMPTY_EDITOR);
      await onReload();
    } catch (err: any) {
      setError(err?.message || "Lưu nhóm danh bạ thất bại");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (group: MailContactGroup) => {
    if (!window.confirm(`Xoá nhóm danh bạ "${group.name}"?\nCác email trong nhóm không bị ảnh hưởng.`)) return;
    setBusy(true);
    setError(null);
    try {
      await emailService.contactGroupDelete(group.id);
      setInfo(`Đã xoá nhóm "${group.name}"`);
      if (editor.id === group.id) setEditor(EMPTY_EDITOR);
      await onReload();
    } catch (err: any) {
      setError(err?.message || "Xoá nhóm thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { height: "min(760px, 92vh)" } }}>
      <div className="erp-mail__contacts">
        <div className="erp-mail__contactsHead">
          <span className="material-symbols-outlined">contacts</span>
          <span className="erp-mail__contactsTitle">Danh bạ Email — nhóm gửi nhanh</span>
          <span style={{ flex: 1 }} />
          {onComposeGroup && (
            <Button size="small" onClick={onComposeGroup} startIcon={<span className="material-symbols-outlined">playlist_add</span>}>
              Tạo từ To/Cc của thư
            </Button>
          )}
          <IconButton size="small" onClick={onClose} title="Đóng" aria-label="Đóng">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="erp-mail__contactsBody">
          {/* Cột trái: danh sách nhóm */}
          <div className="erp-mail__contactsList">
            <TextField
              size="small"
              fullWidth
              placeholder="Tìm theo tên nhóm hoặc email thành viên…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {loading && <div className="erp-mail__contactsHint"><CircularProgress size={16} /> Đang tải…</div>}
            {!loading && filtered.length === 0 && (
              <div className="erp-mail__contactsHint">
                {keyword ? "Không tìm thấy nhóm danh bạ phù hợp." : "Chưa có nhóm danh bạ nào. Tạo nhóm đầu tiên ở khung bên phải."}
              </div>
            )}
            {filtered.map((group) => (
              <div key={group.id} className={`erp-mail__contactItem${editor.id === group.id ? " is-editing" : ""}`}>
                <div className="erp-mail__contactItemHead" onClick={() => setExpandedId(expandedId === group.id ? null : group.id)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>groups</span>
                  <span className="erp-mail__contactName" title={group.description || group.name}>{group.name}</span>
                  {group.isShared && <Chip size="small" label="Dùng chung" className="erp-mail__tagChip" />}
                  <span className="erp-mail__contactCount">{group.memberCount} địa chỉ</span>
                </div>
                {expandedId === group.id && (
                  <div className="erp-mail__contactMembers">
                    {group.members.map((m) => (
                      <div key={m.address} className="erp-mail__contactMember" title={m.address}>
                        {m.name ? `${m.name} · ` : ""}
                        {m.address}
                      </div>
                    ))}
                  </div>
                )}
                <div className="erp-mail__contactActions">
                  {group.canEdit ? (
                    <>
                      <button type="button" className="erp-mail__linkBtn" onClick={() => startEdit(group)}>
                        Sửa
                      </button>
                      <button type="button" className="erp-mail__linkBtn is-danger" onClick={() => void handleDelete(group)} disabled={busy}>
                        Xoá
                      </button>
                    </>
                  ) : (
                    <span className="erp-mail__contactsHint" style={{ margin: 0 }}>
                      Nhóm của {group.ownerEmplNo || "người khác"} — chỉ dùng để gửi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cột phải: form thêm/sửa */}
          <div className="erp-mail__contactsEditor">
            <div className="erp-mail__contactsEditorTitle">
              {editor.id ? `Sửa nhóm #${editor.id}` : "Tạo nhóm danh bạ mới"}
            </div>
            <TextField
              size="small"
              fullWidth
              label="Tên nhóm"
              placeholder="VD: Nhóm khách hàng miền Bắc"
              value={editor.name}
              onChange={(e) => setEditor((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              size="small"
              fullWidth
              label="Mô tả (không bắt buộc)"
              value={editor.description}
              onChange={(e) => setEditor((prev) => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={6}
              label="Danh sách email"
              placeholder={"a@congty.com, b@congty.com\nKế toán <ketoan@congty.com>; sep@congty.com"}
              helperText={`${memberPreviewCount} địa chỉ · ngăn cách bằng dấu phẩy, dấu chấm phẩy hoặc xuống dòng`}
              value={editor.membersText}
              onChange={(e) => setEditor((prev) => ({ ...prev, membersText: e.target.value }))}
            />
            <label className="erp-mail__contactsCheck">
              <input
                type="checkbox"
                checked={editor.isShared}
                onChange={(e) => setEditor((prev) => ({ ...prev, isShared: e.target.checked }))}
              />
              Chia sẻ cho toàn công ty dùng chung (chỉ bạn sửa được)
            </label>

            {error && <Alert severity="error" sx={{ fontSize: 12.5 }}>{error}</Alert>}
            {info && <Alert severity="success" sx={{ fontSize: 12.5 }}>{info}</Alert>}

            <div className="erp-mail__contactsEditorFoot">
              <Button
                variant="contained"
                size="small"
                onClick={() => void handleSave()}
                disabled={busy || !editor.name.trim() || parseAddressText(editor.membersText).length === 0}
              >
                {busy ? "Đang lưu…" : editor.id ? "Lưu thay đổi" : "Tạo nhóm"}
              </Button>
              {(editor.id || editor.name || editor.membersText) && (
                <Button size="small" onClick={() => { setEditor(EMPTY_EDITOR); setError(null); }}>
                  Nhập lại
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

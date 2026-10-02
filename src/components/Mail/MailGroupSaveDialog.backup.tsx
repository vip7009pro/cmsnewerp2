import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Checkbox, Dialog, FormControlLabel, IconButton, TextField } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { emailService } from "../../api/services/emailService";
import type { MailContactGroup, MailContactMember } from "./mail.types";
import { countAddresses, mergeAddressText, parseAddressText } from "./mailUtils";

interface MailGroupSaveDialogProps {
  open: boolean;
  onClose: () => void;
  /** Nội dung hiện tại của các ô người nhận (để chọn làm thành viên nhóm). */
  sources: { to: string; cc: string; bcc: string };
  /** Tên nhóm gợi ý (ví dụ lấy từ tiêu đề email). */
  suggestedName?: string;
  /** Thành viên có sẵn (ví dụ lấy từ To/Cc của email qua `emailContactGroupFromMessage`). */
  presetMembers?: MailContactMember[];
  /** Nhóm hiện có — dùng để cảnh báo trùng tên (sẽ cập nhật thay vì tạo trùng). */
  existingGroups?: MailContactGroup[];
  onSaved?: (group: { id: number; name: string }) => void;
}

/**
 * LƯU NHÓM DANH BẠ từ danh sách người nhận / CC đang có.
 * Dùng cho cả 2 luồng: (1) trong hộp soạn thư — lưu To/Cc/Bcc đang gõ;
 * (2) trong chi tiết email — lưu người nhận của thư đã nhận.
 */
export default function MailGroupSaveDialog({
  open,
  onClose,
  sources,
  suggestedName = "",
  presetMembers = [],
  existingGroups = [],
  onSaved,
}: MailGroupSaveDialogProps) {
  const [useTo, setUseTo] = useState(true);
  const [useCc, setUseCc] = useState(true);
  const [useBcc, setUseBcc] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [membersText, setMembersText] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  /** Thành viên của từng nguồn (đã tách sẵn). */
  const sourceMembers = useMemo(
    () => ({
      to: parseAddressText(sources.to),
      cc: parseAddressText(sources.cc),
      bcc: parseAddressText(sources.bcc),
    }),
    [sources.to, sources.cc, sources.bcc]
  );

  /** Chỉ có To/Cc/Bcc gợi ý (không có To/Cc/Bcc nào) ⇒ dùng preset từ email. */
  const hasFieldSources = sourceMembers.to.length + sourceMembers.cc.length + sourceMembers.bcc.length > 0;

  const unionOfSelected = useMemo(() => {
    let text = "";
    if (useTo) text = mergeAddressText(text, sourceMembers.to);
    if (useCc) text = mergeAddressText(text, sourceMembers.cc);
    if (useBcc) text = mergeAddressText(text, sourceMembers.bcc);
    if (!hasFieldSources) text = mergeAddressText(text, presetMembers || []);
    return text;
  }, [useTo, useCc, useBcc, sourceMembers, hasFieldSources, presetMembers]);

  // Mở dialog ⇒ nạp lại từ nguồn đang chọn.
  useEffect(() => {
    if (!open) {
      setDone(null);
      return;
    }
    setError(null);
    setDone(null);
    setName(suggestedName || "");
    setDescription("");
    setIsShared(false);
    setUseBcc(false);
    const hasTo = parseAddressText(sources.to).length > 0;
    setUseTo(hasTo || !hasFieldSources ? true : false);
    setUseCc(parseAddressText(sources.cc).length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Nguồn đang chọn thay đổi ⇒ nạp lại textarea (người dùng vẫn sửa được sau đó).
  useEffect(() => {
    if (!open) return;
    setMembersText(unionOfSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, useTo, useCc, useBcc, sources.to, sources.cc, sources.bcc]);

  const memberCount = countAddresses(membersText);
  const duplicate = existingGroups.find((g) => g.name.trim().toLowerCase() === name.trim().toLowerCase());

  const handleSave = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await emailService.contactGroupSave({
        GROUP_NAME: name,
        DESCRIPTION: description,
        ADDRESSES: membersText,
        IS_SHARED: isShared,
        REPLACE: true,
      });
      setDone(
        result.message +
          (result.invalidAddresses?.length ? ` — đã bỏ ${result.invalidAddresses.length} địa chỉ không hợp lệ.` : "")
      );
      onSaved?.({ id: result.id, name: result.name });
    } catch (err: any) {
      setError(err?.message || "Lưu nhóm danh bạ thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div className="erp-mail__groupSave">
        <div className="erp-mail__groupSaveHead">
          <span className="material-symbols-outlined">playlist_add</span>
          <span>Lưu thành nhóm danh bạ</span>
          <span style={{ flex: 1 }} />
          <IconButton size="small" onClick={onClose} title="Đóng" aria-label="Đóng">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="erp-mail__groupSaveBody">
          {hasFieldSources ? (
            <div className="erp-mail__groupSaveSources">
              <span>Lấy người nhận từ:</span>
              <FormControlLabel
                control={<Checkbox size="small" checked={useTo} onChange={(e) => setUseTo(e.target.checked)} />}
                label={`Đến (${sourceMembers.to.length})`}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={useCc} onChange={(e) => setUseCc(e.target.checked)} />}
                label={`Cc (${sourceMembers.cc.length})`}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={useBcc} onChange={(e) => setUseBcc(e.target.checked)} />}
                label={`Bcc (${sourceMembers.bcc.length})`}
              />
            </div>
          ) : (
            <div className="erp-mail__groupSaveNote">
              Dùng {presetMembers.length} người nhận của thư này (đã bỏ địa chỉ của chính bạn) — sửa lại được bên dưới.
            </div>
          )}

          <TextField
            size="small"
            fullWidth
            label="Tên nhóm"
            placeholder="VD: Nhóm khách hàng miền Bắc"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            size="small"
            fullWidth
            label="Mô tả (không bắt buộc)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={4}
            label="Thành viên"
            helperText={`${memberCount} địa chỉ · có thể thêm/bớt trước khi lưu`}
            value={membersText}
            onChange={(e) => setMembersText(e.target.value)}
          />

          <FormControlLabel
            control={<Checkbox size="small" checked={isShared} onChange={(e) => setIsShared(e.target.checked)} />}
            label="Chia sẻ cho toàn công ty dùng chung"
          />

          {duplicate && (
            <Alert severity="info" sx={{ fontSize: 12.5 }}>
              Đã có nhóm “{duplicate.name}” — lưu sẽ <b>cập nhật</b> nhóm này (ghi đè danh sách thành viên).
            </Alert>
          )}
          {error && <Alert severity="error" sx={{ fontSize: 12.5 }}>{error}</Alert>}
          {done && <Alert severity="success" sx={{ fontSize: 12.5 }}>{done}</Alert>}
        </div>

        <div className="erp-mail__groupSaveFoot">
          <Button size="small" onClick={onClose} disabled={busy}>
            {done ? "Đóng" : "Huỷ"}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => void handleSave()}
            disabled={busy || !name.trim() || memberCount === 0}
          >
            {busy ? "Đang lưu…" : done ? "Lưu lại" : "Lưu nhóm"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

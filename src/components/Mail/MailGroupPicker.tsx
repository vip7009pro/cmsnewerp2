import { useEffect, useMemo, useState } from "react";
import { Button, Chip, CircularProgress, Dialog, IconButton, TextField } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { MailContactGroup, MailContactMember } from "./mail.types";
import { addressesOfGroup } from "./mailUtils";

export type MailGroupTarget = "to" | "cc" | "bcc";

interface MailGroupPickerProps {
  open: boolean;
  onClose: () => void;
  groups: MailContactGroup[];
  loading?: boolean;
  /** Ô nhận mặc định khi mở. */
  target: MailGroupTarget;
  /** Xác nhận: chèn thành viên của các nhóm đã chọn vào ô nhận. */
  onPick: (target: MailGroupTarget, members: MailContactMember[], groupNames: string[]) => void;
}

const TARGET_LABEL: Record<MailGroupTarget, string> = { to: "Đến (To)", cc: "Cc", bcc: "Bcc" };

/**
 * TAG NHANH NHÓM DANH BẠ vào ô Đến / Cc / Bcc khi soạn thư.
 * Chọn nhiều nhóm cùng lúc — thành viên được gộp và khử trùng ở phía hộp soạn.
 */
export default function MailGroupPicker({ open, onClose, groups, loading, target, onPick }: MailGroupPickerProps) {
  const [keyword, setKeyword] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [dest, setDest] = useState<MailGroupTarget>(target);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setKeyword("");
    setPicked([]);
    setDest(target);
    setSelectedId(null);
  }, [open, target]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) => g.name.toLowerCase().includes(q) || g.members.some((m) => m.address.toLowerCase().includes(q))
    );
  }, [groups, keyword]);

  const pickedGroups = groups.filter((g) => picked.includes(g.id));
  const totalMembers = useMemo(() => {
    const seen = new Set<string>();
    for (const group of pickedGroups) {
      for (const m of group.members) seen.add(m.address.toLowerCase());
    }
    return seen.size;
  }, [pickedGroups]);

  const detail = groups.find((g) => g.id === selectedId) || null;

  const confirm = () => {
    if (pickedGroups.length === 0) return;
    const seen = new Set<string>();
    const members: MailContactMember[] = [];
    for (const group of pickedGroups) {
      for (const m of group.members) {
        const key = m.address.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        members.push(m);
      }
    }
    onPick(dest, members, pickedGroups.map((g) => g.name));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { height: "min(620px, 90vh)" } }}>
      <div className="erp-mail__groupPicker">
        <div className="erp-mail__groupPickerHead">
          <span className="material-symbols-outlined">group_add</span>
          <span>Tag nhóm danh bạ</span>
          <span style={{ flex: 1 }} />
          <IconButton size="small" onClick={onClose} title="Đóng" aria-label="Đóng">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Chọn ô nhận: Đến / Cc / Bcc */}
        <div className="erp-mail__groupPickerTargets">
          {(Object.keys(TARGET_LABEL) as MailGroupTarget[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`erp-mail__segBtn${dest === key ? " is-active" : ""}`}
              onClick={() => setDest(key)}
            >
              {TARGET_LABEL[key]}
            </button>
          ))}
        </div>

        <div className="erp-mail__groupPickerBody">
          <div className="erp-mail__groupPickerList">
            <TextField
              size="small"
              fullWidth
              placeholder="Tìm nhóm danh bạ…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {loading && <div className="erp-mail__contactsHint"><CircularProgress size={16} /> Đang tải…</div>}
            {!loading && filtered.length === 0 && (
              <div className="erp-mail__contactsHint">
                {keyword ? "Không tìm thấy nhóm phù hợp." : "Chưa có nhóm danh bạ. Vào mục Danh bạ để tạo nhóm."}
              </div>
            )}
            {filtered.map((group) => {
              const checked = picked.includes(group.id);
              return (
                <div
                  key={group.id}
                  className={`erp-mail__pickItem${checked ? " is-picked" : ""}${selectedId === group.id ? " is-viewing" : ""}`}
                  onClick={() => setSelectedId(group.id)}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setPicked((prev) => (e.target.checked ? [...prev, group.id] : prev.filter((id) => id !== group.id)));
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="erp-mail__pickName" title={group.name}>{group.name}</span>
                  {group.isShared && <Chip size="small" label="Dùng chung" className="erp-mail__tagChip" />}
                  <span className="erp-mail__pickCount">{group.memberCount}</span>
                </div>
              );
            })}
          </div>

          {/* Xem nhanh thành viên của nhóm đang chọn trong danh sách */}
          {detail && (
            <div className="erp-mail__groupPickerPreview">
              <div className="erp-mail__contactsEditorTitle">{detail.name}</div>
              <div className="erp-mail__pickPreviewList">
                {detail.members.slice(0, 40).map((m) => (
                  <div key={m.address} className="erp-mail__contactMember" title={m.address}>
                    {m.name ? `${m.name} · ` : ""}
                    {m.address}
                  </div>
                ))}
                {detail.members.length > 40 && <div className="erp-mail__contactsHint">…và {detail.members.length - 40} địa chỉ khác</div>}
              </div>
              <button type="button" className="erp-mail__linkBtn" onClick={() => setPicked((prev) => (prev.includes(detail.id) ? prev : [...prev, detail.id]))}>
                Chọn nhóm này
              </button>
            </div>
          )}
        </div>

        <div className="erp-mail__groupPickerFoot">
          <span className="erp-mail__contactsHint" style={{ margin: 0 }}>
            {pickedGroups.length === 0
              ? `Chưa chọn nhóm nào — sẽ thêm vào ${TARGET_LABEL[dest]}`
              : `${pickedGroups.length} nhóm · ${totalMembers} địa chỉ → ${TARGET_LABEL[dest]}`}
          </span>
          <span style={{ flex: 1 }} />
          <Button size="small" onClick={onClose}>Huỷ</Button>
          <Button variant="contained" size="small" onClick={confirm} disabled={pickedGroups.length === 0}>
            Thêm vào {TARGET_LABEL[dest]}
          </Button>
        </div>

        {pickedGroups.length > 0 && (
          <div className="erp-mail__groupPickerChips">
            {pickedGroups.map((g) => (
              <Chip
                key={g.id}
                size="small"
                label={`${g.name} (${g.memberCount})`}
                title={addressesOfGroup(g.members).slice(0, 300)}
                onDelete={() => setPicked((prev) => prev.filter((id) => id !== g.id))}
              />
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}

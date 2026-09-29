import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import type { ChatEmployee } from "./chat.types";
import { chatAvatarUrl, initialsOf } from "./chatUtils";
import ChatAvatarPicker from "./ChatAvatarPicker";

interface Props {
  open: boolean;
  onClose: () => void;
  onSearch: (keyword: string) => Promise<ChatEmployee[]>;
  onStartDirect: (emplNo: string) => Promise<unknown>;
  onCreateGroup: (title: string, memberEmplNos: string[], avatar?: string) => Promise<unknown>;
}

export default function ChatNewChatDialog({
  open,
  onClose,
  onSearch,
  onStartDirect,
  onCreateGroup,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<ChatEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ChatEmployee[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce tìm kiếm nhân viên để không spam API khi gõ nhanh.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const data = await onSearch(keyword);
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, keyword ? 320 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [keyword, onSearch, open]);

  useEffect(() => {
    if (!open) {
      setKeyword("");
      setSelected([]);
      setGroupTitle("");
      setGroupAvatar("");
      setError(null);
    }
  }, [open]);

  const selectedNos = useMemo(() => selected.map((item) => item.EMPL_NO), [selected]);

  const toggle = (employee: ChatEmployee) => {
    setSelected((prev) =>
      prev.some((item) => item.EMPL_NO === employee.EMPL_NO)
        ? prev.filter((item) => item.EMPL_NO !== employee.EMPL_NO)
        : [...prev, employee]
    );
  };

  const handleStartDirect = async (employee: ChatEmployee) => {
    setSubmitting(true);
    setError(null);
    try {
      await onStartDirect(employee.EMPL_NO);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Không mở được hội thoại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupTitle.trim()) {
      setError("Nhập tên nhóm trước");
      return;
    }
    if (selectedNos.length === 0) {
      setError("Chọn ít nhất 1 thành viên");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onCreateGroup(groupTitle.trim(), selectedNos, groupAvatar || undefined);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Không tạo được nhóm");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="erp-chat-dialog">
      <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>
        Cuộc trò chuyện mới
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Đóng"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <div className="erp-chat__searchBox erp-chat__searchBox--dialog">
          <SearchRoundedIcon fontSize="small" />
          <input
            autoFocus
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tên, mã nhân viên, CMS ID"
          />
        </div>

        {selected.length > 0 && (
          <div className="erp-chat-dialog__chips">
            {selected.map((employee) => (
              <span key={employee.EMPL_NO} className="erp-chat-dialog__chip">
                <Avatar
                  src={chatAvatarUrl(employee.EMPL_NO, employee.EMPL_IMAGE)}
                  sx={{ width: 20, height: 20, fontSize: 10 }}
                >
                  {initialsOf(employee.FULL_NAME)}
                </Avatar>
                {employee.FULL_NAME}
                <button type="button" onClick={() => toggle(employee)} aria-label="Bỏ chọn">
                  <CloseRoundedIcon sx={{ fontSize: 12 }} />
                </button>
              </span>
            ))}
          </div>
        )}

        {selected.length > 1 && (
          <>
            <TextField
              size="small"
              fullWidth
              label="Tên nhóm"
              value={groupTitle}
              onChange={(event) => setGroupTitle(event.target.value)}
              sx={{ mt: 1.5 }}
            />
            <ChatAvatarPicker
              value={groupAvatar}
              name={groupTitle || "Nhóm"}
              onChange={setGroupAvatar}
              compact
            />
          </>
        )}

        <div className="erp-chat-dialog__list">
          {loading && (
            <div className="erp-chat-dialog__loading">
              <CircularProgress size={18} />
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="erp-chat-dialog__empty">Không tìm thấy nhân viên phù hợp</div>
          )}

          {results.map((employee) => {
            const isSelected = selectedNos.includes(employee.EMPL_NO);
            return (
              <div key={employee.EMPL_NO} className="erp-chat-dialog__row">
                <Avatar
                  src={chatAvatarUrl(employee.EMPL_NO, employee.EMPL_IMAGE)}
                  sx={{ width: 34, height: 34, fontSize: 13, bgcolor: "#475569" }}
                >
                  {initialsOf(employee.FULL_NAME)}
                </Avatar>
                <div className="erp-chat-dialog__info">
                  <strong>{employee.FULL_NAME}</strong>
                  <small>
                    {employee.JOB_NAME || "Nhân viên"}
                    {employee.MAINDEPTNAME ? ` · ${employee.MAINDEPTNAME}` : ""}
                    {employee.CMS_ID ? ` · ${employee.CMS_ID}` : ""}
                  </small>
                </div>
                <IconButton
                  size="small"
                  onClick={() => toggle(employee)}
                  className={isSelected ? "is-selected" : ""}
                  aria-label={isSelected ? "Bỏ chọn" : "Chọn"}
                >
                  {isSelected ? <CheckRoundedIcon fontSize="small" /> : <span className="dot" />}
                </IconButton>
                <Button size="small" disabled={submitting} onClick={() => handleStartDirect(employee)}>
                  Chat
                </Button>
              </div>
            );
          })}
        </div>

        {error && <div className="erp-chat-dialog__error">{error}</div>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} size="small">
          Huỷ
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={submitting || selected.length === 0}
          onClick={handleCreateGroup}
        >
          {selected.length > 1 ? `Tạo nhóm (${selected.length + 1})` : "Tạo nhóm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

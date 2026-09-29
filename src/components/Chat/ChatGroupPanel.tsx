import React, { useState } from "react";
import { Avatar, Button, Divider, IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupsRounded";
import type { ChatConversation, ChatEmployee, ChatMember } from "./chat.types";
import { chatAvatarUrl, initialsOf } from "./chatUtils";

interface Props {
  conversation: ChatConversation;
  myEmplNo: string;
  onlineUsers: Set<string>;
  onClose: () => void;
  onAddMembers: (memberEmplNos: string[]) => Promise<void>;
  onRemoveMember: (emplNo: string) => Promise<void>;
  onSetRole: (emplNo: string, role: "MODERATOR" | "MEMBER") => Promise<void>;
  onTransferOwner: (emplNo: string) => Promise<void>;
  onRenameGroup: (title: string) => Promise<void>;
  onLeave: () => Promise<void>;
  onSearch: (keyword: string) => Promise<ChatEmployee[]>;
}

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Chủ nhóm",
  ADMIN: "Quản trị",
  MODERATOR: "Moderator",
  MEMBER: "Thành viên",
};

export default function ChatGroupPanel({
  conversation,
  myEmplNo,
  onlineUsers,
  onClose,
  onAddMembers,
  onRemoveMember,
  onSetRole,
  onTransferOwner,
  onRenameGroup,
  onLeave,
  onSearch,
}: Props) {
  const isGroup = conversation.CONV_TYPE === "GROUP";
  const canManage = conversation.MY_ROLE === "OWNER" || conversation.MY_ROLE === "ADMIN";
  const canModerate =
    canManage || conversation.MY_ROLE === "MODERATOR";

  const [title, setTitle] = useState(conversation.TITLE || "");
  const [addOpen, setAddOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [candidates, setCandidates] = useState<ChatEmployee[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const others = conversation.MEMBERS.filter((m) => m.EMPL_NO !== myEmplNo);
  const peer = others[0];

  const runSearch = async (value: string) => {
    setKeyword(value);
    try {
      const data = await onSearch(value);
      setCandidates(data.filter((e) => !conversation.MEMBERS.some((m) => m.EMPL_NO === e.EMPL_NO)));
    } catch {
      setCandidates([]);
    }
  };

  const guard = async (action: () => Promise<void>, successMessage: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage(successMessage);
    } catch (error: any) {
      setMessage(error?.message || "Thao tác thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="erp-chat__info">
      <div className="erp-chat__infoHead">
        <span>{isGroup ? "Quản lý nhóm" : "Thông tin hội thoại"}</span>
        <IconButton size="small" onClick={onClose} aria-label="Đóng thông tin">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </div>

      <div className="erp-chat__infoBody">
        <div className="erp-chat__infoHero">
          <Avatar
            src={conversation.DISPLAY_AVATAR || undefined}
            sx={{ width: 60, height: 60, fontSize: 20, bgcolor: "#2563eb" }}
          >
            {isGroup ? <GroupRoundedIcon /> : initialsOf(conversation.DISPLAY_NAME)}
          </Avatar>
          {isGroup && canManage ? (
            <div className="erp-chat__renameRow">
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
              <Button
                size="small"
                disabled={busy || !title.trim() || title === conversation.TITLE}
                onClick={() => guard(() => onRenameGroup(title.trim()), "Đã đổi tên nhóm")}
              >
                Lưu
              </Button>
            </div>
          ) : (
            <strong>{conversation.DISPLAY_NAME}</strong>
          )}
          <small>
            {isGroup
              ? `${conversation.MEMBERS.length} thành viên · ${ROLE_LABEL[conversation.MY_ROLE]}`
              : peer?.JOB_NAME || "Hội thoại 1-1"}
          </small>
        </div>

        {isGroup && (
          <>
            <Divider sx={{ my: 1 }} />
            <div className="erp-chat__infoSection">
              <div className="erp-chat__infoSectionHead">
                <span>Thành viên ({conversation.MEMBERS.length})</span>
                {canManage && (
                  <Tooltip title="Thêm thành viên">
                    <IconButton size="small" onClick={() => setAddOpen((prev) => !prev)}>
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>

              {addOpen && canManage && (
                <div className="erp-chat__addMembers">
                  <input
                    value={keyword}
                    placeholder="Tìm nhân viên để thêm"
                    onChange={(event) => void runSearch(event.target.value)}
                  />
                  {candidates.slice(0, 6).map((employee) => (
                    <button
                      key={employee.EMPL_NO}
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        guard(async () => {
                          await onAddMembers([employee.EMPL_NO]);
                          setCandidates((prev) =>
                            prev.filter((item) => item.EMPL_NO !== employee.EMPL_NO)
                          );
                        }, `Đã thêm ${employee.FULL_NAME}`)
                      }
                    >
                      <Avatar
                        src={chatAvatarUrl(employee.EMPL_NO, employee.EMPL_IMAGE)}
                        sx={{ width: 22, height: 22, fontSize: 10 }}
                      >
                        {initialsOf(employee.FULL_NAME)}
                      </Avatar>
                      {employee.FULL_NAME}
                    </button>
                  ))}
                </div>
              )}

              {conversation.MEMBERS.map((member: ChatMember) => {
                const isMe = member.EMPL_NO === myEmplNo;
                const isOwner = member.ROLE === "OWNER";
                const canRemove =
                  !isMe &&
                  !isOwner &&
                  (canManage || (conversation.MY_ROLE === "MODERATOR" && member.ROLE === "MEMBER"));

                return (
                  <div key={member.EMPL_NO} className="erp-chat__memberRow">
                    <div className="erp-chat__memberAvatar">
                      <Avatar
                        src={chatAvatarUrl(member.EMPL_NO, member.EMPL_IMAGE)}
                        sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "#475569" }}
                      >
                        {initialsOf(member.FULL_NAME)}
                      </Avatar>
                      {onlineUsers.has(member.EMPL_NO) && <span className="erp-chat__onlineDot" />}
                    </div>
                    <div className="erp-chat__memberInfo">
                      <strong>
                        {member.FULL_NAME} {isMe && <em>(bạn)</em>}
                      </strong>
                      <small>
                        {ROLE_LABEL[member.ROLE]}
                        {member.JOB_NAME ? ` · ${member.JOB_NAME}` : ""}
                      </small>
                    </div>

                    {!isOwner && canManage && (
                      <Select
                        size="small"
                        value={member.ROLE === "MODERATOR" ? "MODERATOR" : "MEMBER"}
                        disabled={busy}
                        onChange={(event) =>
                          guard(
                            () =>
                              onSetRole(member.EMPL_NO, event.target.value as "MODERATOR" | "MEMBER"),
                            "Đã cập nhật quyền"
                          )
                        }
                        sx={{ fontSize: 12, height: 30 }}
                      >
                        <MenuItem value="MEMBER" sx={{ fontSize: 12 }}>
                          Thành viên
                        </MenuItem>
                        <MenuItem value="MODERATOR" sx={{ fontSize: 12 }}>
                          Moderator
                        </MenuItem>
                      </Select>
                    )}

                    {conversation.MY_ROLE === "OWNER" && !isMe && !isOwner && (
                      <Tooltip title="Chuyển quyền chủ nhóm">
                        <Button
                          size="small"
                          disabled={busy}
                          onClick={() =>
                            guard(() => onTransferOwner(member.EMPL_NO), "Đã chuyển quyền chủ nhóm")
                          }
                        >
                          Chủ nhóm
                        </Button>
                      </Tooltip>
                    )}

                    {canRemove && (
                      <Tooltip title="Xoá khỏi nhóm">
                        <Button
                          size="small"
                          color="error"
                          disabled={busy}
                          onClick={() =>
                            guard(() => onRemoveMember(member.EMPL_NO), "Đã xoá thành viên")
                          }
                        >
                          Xoá
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </div>

            <Divider sx={{ my: 1 }} />
            <Button
              fullWidth
              color="error"
              size="small"
              disabled={busy}
              onClick={() =>
                guard(async () => {
                  try {
                    await onLeave();
                  } catch (error: any) {
                    throw error;
                  }
                }, "Đã rời nhóm")
              }
            >
              Rời nhóm
            </Button>
          </>
        )}

        {!isGroup && peer && (
          <>
            <Divider sx={{ my: 1 }} />
            <div className="erp-chat__infoSection">
              <div className="erp-chat__memberRow">
                <Avatar
                  src={chatAvatarUrl(peer.EMPL_NO, peer.EMPL_IMAGE)}
                  sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "#475569" }}
                >
                  {initialsOf(peer.FULL_NAME)}
                </Avatar>
                <div className="erp-chat__memberInfo">
                  <strong>{peer.FULL_NAME}</strong>
                  <small>
                    {peer.JOB_NAME || "Nhân viên"}
                    {peer.CMS_ID ? ` · ${peer.CMS_ID}` : ""}
                  </small>
                </div>
              </div>
            </div>
          </>
        )}

        {message && <div className="erp-chat__infoMessage">{message}</div>}
      </div>
    </div>
  );
}

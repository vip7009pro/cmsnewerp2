import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupsRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import type { ChatConversation, ChatEmployee, ChatMember } from "./chat.types";
import { chatAvatarUrl, initialsOf, memberFullLabel } from "./chatUtils";
import ChatRoomAvatar from "./chatAvatars";
import ChatAvatarPicker from "./ChatAvatarPicker";

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
  onChangeAvatar: (avatar: string) => Promise<void>;
  onLeave: () => Promise<void>;
  onSearch: (keyword: string) => Promise<ChatEmployee[]>;
}

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Chủ nhóm",
  ADMIN: "Quản trị",
  MODERATOR: "Moderator",
  MEMBER: "Thành viên",
};

const ROLE_TONE: Record<string, string> = {
  OWNER: "is-owner",
  ADMIN: "is-admin",
  MODERATOR: "is-mod",
  MEMBER: "",
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
  onChangeAvatar,
  onLeave,
  onSearch,
}: Props) {
  const isGroup = conversation.CONV_TYPE === "GROUP";
  const isDirect = conversation.CONV_TYPE === "DIRECT";
  const canManage = conversation.MY_ROLE === "OWNER" || conversation.MY_ROLE === "ADMIN";
  const canModerate = canManage || conversation.MY_ROLE === "MODERATOR";

  const [title, setTitle] = useState(conversation.TITLE || "");
  const [avatar, setAvatar] = useState(conversation.AVATAR || "");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [candidates, setCandidates] = useState<ChatEmployee[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  const [roleMenu, setRoleMenu] = useState<{ anchor: HTMLElement; member: ChatMember } | null>(null);

  const others = useMemo(
    () => conversation.MEMBERS.filter((member) => member.EMPL_NO !== myEmplNo),
    [conversation.MEMBERS, myEmplNo]
  );
  const peer = others[0];

  const run = async (action: () => Promise<void>, successText: string) => {
    setBusy(true);
    setNotice(null);
    try {
      await action();
      setNotice({ text: successText, tone: "ok" });
    } catch (error: any) {
      setNotice({ text: error?.message || "Thao tác thất bại", tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  const runSearch = async (value: string) => {
    setKeyword(value);
    try {
      const data = await onSearch(value);
      setCandidates(
        data.filter((employee) => !conversation.MEMBERS.some((m) => m.EMPL_NO === employee.EMPL_NO))
      );
    } catch {
      setCandidates([]);
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
        {/* Hero: avatar + tên + vai trò */}
        <div className="erp-chat__infoHero">
          <div className="erp-chat__infoAvatar">
            <ChatRoomAvatar
              value={conversation.DISPLAY_AVATAR}
              name={conversation.DISPLAY_NAME}
              size={64}
              isDirect={!isGroup}
            />
          </div>

          {isGroup && canManage && (
            <button
              type="button"
              className="erp-chat__ghostBtn erp-chat__changeAvatarBtn"
              onClick={() => setShowAvatarPicker((prev) => !prev)}
            >
              {showAvatarPicker ? "Đóng" : "Đổi avatar phòng"}
            </button>
          )}

          {isGroup && canManage && showAvatarPicker && (
            <ChatAvatarPicker
              value={avatar}
              name={title || conversation.DISPLAY_NAME}
              onChange={(next) => {
                setAvatar(next);
                void run(() => onChangeAvatar(next), "Đã cập nhật avatar phòng");
              }}
            />
          )}

          {isGroup && canManage ? (
            <div className="erp-chat__renameRow">
              <input
                value={title}
                maxLength={120}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Tên nhóm"
              />
              <Button
                size="small"
                variant="contained"
                disabled={busy || !title.trim() || title === conversation.TITLE}
                onClick={() => run(() => onRenameGroup(title.trim()), "Đã đổi tên nhóm")}
              >
                Lưu
              </Button>
            </div>
          ) : (
            <strong className="erp-chat__infoName">{conversation.DISPLAY_NAME}</strong>
          )}

          <div className="erp-chat__infoMeta">
            {isGroup && <span>{conversation.MEMBERS.length} thành viên</span>}
            <span className={`erp-chat__roleChip ${ROLE_TONE[conversation.MY_ROLE] || ""}`}>
              {ROLE_LABEL[conversation.MY_ROLE]}
            </span>
          </div>
        </div>

        <Divider sx={{ my: 1.5 }} />

        {/* Hội thoại 1-1: thẻ thông tin người đối diện */}
        {!isGroup && peer && (
          <div className="erp-chat__peerCard">
            <Avatar
              src={chatAvatarUrl(peer.EMPL_NO, peer.EMPL_IMAGE)}
              sx={{ width: 40, height: 40, fontSize: 14, bgcolor: "#475569" }}
            >
              {initialsOf(peer.FULL_NAME)}
            </Avatar>
            <div className="erp-chat__peerMeta">
              <strong>{memberFullLabel(peer)}</strong>
              <small>
                {peer.JOB_NAME || "Nhân viên"}
                {peer.CMS_ID ? ` · ${peer.CMS_ID}` : ""}
              </small>
              <small className={onlineUsers.has(peer.EMPL_NO) ? "is-online" : ""}>
                {onlineUsers.has(peer.EMPL_NO) ? "Đang hoạt động" : "Không hoạt động"}
              </small>
            </div>
          </div>
        )}

        {/*
         * Hội thoại 1-1 được coi như nhóm thường ⇒ cũng có nút RỜI.
         * Bên kia vẫn giữ hội thoại và xem được bình thường; mở lại chat với nhau sẽ tham gia lại.
         */}
        {isDirect && (
          <Button
            fullWidth
            color="error"
            size="small"
            variant="outlined"
            disabled={busy}
            className="erp-chat__dangerBtn"
            onClick={() => run(onLeave, "Đã rời hội thoại")}
          >
            Rời hội thoại
          </Button>
        )}

        {/* Nhóm: danh sách thành viên */}
        {isGroup && (
          <>
            <div className="erp-chat__infoSection">
              <div className="erp-chat__infoSectionHead">
                <span>Thành viên</span>
                <span className="erp-chat__infoCount">{conversation.MEMBERS.length}</span>
                {canManage && (
                  <Tooltip title="Thêm thành viên">
                    <IconButton
                      size="small"
                      className={`erp-chat__iconBtn${addOpen ? " is-active" : ""}`}
                      onClick={() => {
                        setAddOpen((prev) => !prev);
                        setCandidates([]);
                        setKeyword("");
                      }}
                    >
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>

              {addOpen && canManage && (
                <div className="erp-chat__addMembers">
                  <div className="erp-chat__searchBox erp-chat__searchBox--dialog">
                    <SearchRoundedIcon fontSize="small" />
                    <input
                      autoFocus
                      value={keyword}
                      placeholder="Tìm nhân viên để thêm vào nhóm"
                      onChange={(event) => void runSearch(event.target.value)}
                    />
                  </div>
                  {candidates.slice(0, 8).map((employee) => (
                    <button
                      key={employee.EMPL_NO}
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          await onAddMembers([employee.EMPL_NO]);
                          setCandidates((prev) =>
                            prev.filter((item) => item.EMPL_NO !== employee.EMPL_NO)
                          );
                        }, `Đã thêm ${employee.FULL_NAME}`)
                      }
                    >
                      <Avatar
                        src={chatAvatarUrl(employee.EMPL_NO, employee.EMPL_IMAGE)}
                        sx={{ width: 24, height: 24, fontSize: 11 }}
                      >
                        {initialsOf(employee.FULL_NAME)}
                      </Avatar>
                      <span className="erp-chat__addName">{employee.FULL_NAME}</span>
                      <small>{employee.MAINDEPTNAME || ""}</small>
                    </button>
                  ))}
                  {keyword.trim() && candidates.length === 0 && (
                    <div className="erp-chat__addEmpty">Không tìm thấy nhân viên phù hợp</div>
                  )}
                </div>
              )}

              <div className="erp-chat__memberList">
                {conversation.MEMBERS.map((member) => {
                  const isMe = member.EMPL_NO === myEmplNo;
                  const isOwner = member.ROLE === "OWNER";
                  const canRemove =
                    !isMe &&
                    !isOwner &&
                    (canManage ||
                      (conversation.MY_ROLE === "MODERATOR" && member.ROLE === "MEMBER"));

                  return (
                    <div key={member.EMPL_NO} className="erp-chat__memberRow">
                      <div className="erp-chat__memberAvatar">
                        <Avatar
                          src={chatAvatarUrl(member.EMPL_NO, member.EMPL_IMAGE)}
                          sx={{ width: 34, height: 34, fontSize: 13, bgcolor: "#475569" }}
                        >
                          {initialsOf(member.FULL_NAME)}
                        </Avatar>
                        {onlineUsers.has(member.EMPL_NO) && <span className="erp-chat__onlineDot" />}
                      </div>

                      <div className="erp-chat__memberInfo">
                        <strong>
                          {memberFullLabel(member)}
                          {isMe && <em> (bạn)</em>}
                        </strong>
                        <small>
                          <span className={`erp-chat__roleChip ${ROLE_TONE[member.ROLE] || ""}`}>
                            {ROLE_LABEL[member.ROLE]}
                          </span>
                          {member.JOB_NAME ? ` ${member.JOB_NAME}` : ""}
                        </small>
                      </div>

                      {!isOwner && (canManage || canRemove) && (
                        <IconButton
                          size="small"
                          className="erp-chat__iconBtn"
                          disabled={busy}
                          onClick={(event) =>
                            setRoleMenu({ anchor: event.currentTarget, member })
                          }
                          aria-label={`Tuỳ chọn cho ${member.FULL_NAME}`}
                        >
                          <MoreVertRoundedIcon fontSize="small" />
                        </IconButton>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Divider sx={{ my: 1.5 }} />

            <Button
              fullWidth
              color="error"
              size="small"
              variant="outlined"
              disabled={busy}
              className="erp-chat__dangerBtn"
              onClick={() => run(onLeave, "Đã rời nhóm")}
            >
              Rời nhóm
            </Button>
          </>
        )}

        {notice && (
          <div className={`erp-chat__infoMessage${notice.tone === "error" ? " is-error" : ""}`}>
            {notice.text}
          </div>
        )}
      </div>

      {/* Menu vai trò / hành động của từng thành viên */}
      <Menu
        open={Boolean(roleMenu)}
        anchorEl={roleMenu?.anchor || null}
        onClose={() => setRoleMenu(null)}
        slotProps={{ paper: { sx: { minWidth: 210 } } }}
      >
        {roleMenu && canManage && roleMenu.member.ROLE !== "OWNER" && (
          <MenuItem
            disabled={busy}
            onClick={() => {
              const target = roleMenu.member;
              setRoleMenu(null);
              void run(
                () => onSetRole(target.EMPL_NO, target.ROLE === "MODERATOR" ? "MEMBER" : "MODERATOR"),
                "Đã cập nhật quyền"
              );
            }}
          >
            <ListItemIcon>
              <ShieldRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                roleMenu.member.ROLE === "MODERATOR" ? "Thu quyền Moderator" : "Cấp quyền Moderator"
              }
              primaryTypographyProps={{ fontSize: 12.5 }}
            />
          </MenuItem>
        )}

        {roleMenu && conversation.MY_ROLE === "OWNER" && roleMenu.member.ROLE !== "OWNER" && (
          <MenuItem
            disabled={busy}
            onClick={() => {
              const target = roleMenu.member;
              setRoleMenu(null);
              void run(() => onTransferOwner(target.EMPL_NO), "Đã chuyển quyền chủ nhóm");
            }}
          >
            <ListItemIcon>
              <SwapHorizRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Chuyển quyền chủ nhóm"
              primaryTypographyProps={{ fontSize: 12.5 }}
            />
          </MenuItem>
        )}

        {roleMenu &&
          roleMenu.member.ROLE !== "OWNER" &&
          roleMenu.member.EMPL_NO !== myEmplNo &&
          (canManage ||
            (conversation.MY_ROLE === "MODERATOR" && roleMenu.member.ROLE === "MEMBER")) && (
            <MenuItem
              disabled={busy}
              sx={{ color: "#e11d48" }}
              onClick={() => {
                const target = roleMenu.member;
                setRoleMenu(null);
                void run(() => onRemoveMember(target.EMPL_NO), "Đã xoá thành viên");
              }}
            >
              <ListItemIcon>
                <PersonRemoveRoundedIcon fontSize="small" sx={{ color: "#e11d48" }} />
              </ListItemIcon>
              <ListItemText
                primary="Xoá khỏi nhóm"
                primaryTypographyProps={{ fontSize: 12.5, fontWeight: 600 }}
              />
            </MenuItem>
          )}

        {roleMenu && roleMenu.member.EMPL_NO === myEmplNo && (
          <MenuItem disabled>
            <ListItemIcon>
              <PersonRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Đây là bạn" primaryTypographyProps={{ fontSize: 12.5 }} />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

import React from "react";
import { FiX, FiBookmark, FiCalendar, FiUser, FiLayers } from "react-icons/fi";
import { POST_DATA } from "../interfaces/infoInterface";

interface ModalProps {
  post: POST_DATA | null;
  onClose: () => void;
}

const PrecisionPostManagerViewModal: React.FC<ModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  const hasMedia =
    post.FILE_NAME &&
    post.FILE_NAME.trim().length > 0 &&
    !post.FILE_NAME.endsWith("_undefined");
  const imgSrc = hasMedia ? encodeURI(`/informationboard/${post.FILE_NAME}`) : "";
  const isPinned = post.IS_PINNED === "Y" || post.IS_PINNED === "1";

  return (
    <div className="postmanager-view-modal" onClick={onClose}>
      <div className="postmanager-view-modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="postmanager-view-modal__header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#0284c7",
                padding: "2px 6px",
                background: "#e0f2fe",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              {post.SUBDEPT || "TỔNG HỢP"}
            </span>
            {isPinned && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#d97706",
                  padding: "2px 6px",
                  background: "#fef3c7",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <FiBookmark size={11} /> GHIM NỔI BẬT
              </span>
            )}
          </div>

          <button
            type="button"
            className="postmanager-view-modal__closeBtn"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <FiX />
          </button>
        </div>

        <div className="postmanager-view-modal__body">
          {hasMedia && (
            <img
              src={imgSrc}
              alt="Post Banner"
              onError={(e: any) => {
                e.target.style.display = "none";
              }}
            />
          )}

          <h2
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            {post.TITLE}
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: "11.5px",
              color: "#64748b",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "8px",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <FiUser size={12} color="#0284c7" />
              Tác giả: <strong>{post.INS_EMPL || "Admin"}</strong>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <FiCalendar size={12} color="#10b981" />
              Ngày đăng: <strong>{post.INS_DATE}</strong>
            </span>
            {post.MAINDEPT && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <FiLayers size={12} color="#8b5cf6" />
                Khối: {post.MAINDEPT}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#334155",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {post.CONTENT}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPostManagerViewModal);

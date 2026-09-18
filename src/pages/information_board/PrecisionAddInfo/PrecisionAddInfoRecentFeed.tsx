import React from "react";
import { FiSearch, FiDownload, FiBookmark, FiImage, FiCalendar, FiUser } from "react-icons/fi";
import { POST_DATA } from "../interfaces/infoInterface";

interface FeedProps {
  posts: POST_DATA[];
  totalCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectPost: (post: POST_DATA) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
}

const PrecisionAddInfoRecentFeed: React.FC<FeedProps> = ({
  posts,
  totalCount,
  searchTerm,
  onSearchChange,
  onSelectPost,
  onExportEX1,
  onExportEX2,
}) => {
  return (
    <div className="precision-addinfo__recentFeed">
      {/* Feed Toolbar */}
      <div className="feed-toolbar">
        <div className="left-box">
          <div className="search-box">
            <FiSearch size={12} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm nhanh theo tiêu đề / phòng ban / tác giả..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <span style={{ fontSize: "11px", color: "#64748b" }}>
            Hiển thị: <strong>{posts.length}</strong> / {totalCount} bài
          </span>
        </div>

        <div className="actions-box">
          <button
            type="button"
            className="precision-addinfo__btn"
            onClick={onExportEX1}
            title="Xuất Excel danh sách bài viết đang lọc"
          >
            <FiDownload size={11} color="#059669" />
            <span>EX1 (Đang lọc)</span>
          </button>

          <button
            type="button"
            className="precision-addinfo__btn"
            onClick={onExportEX2}
            title="Xuất Excel toàn bộ danh sách bài viết"
          >
            <FiDownload size={11} color="#0284c7" />
            <span>EX2 (Tất cả)</span>
          </button>
        </div>
      </div>

      {/* Feed Grid List */}
      <div className="feed-list">
        {posts.map((p, idx) => {
          const hasMedia = p.FILE_NAME && p.FILE_NAME.trim().length > 0 && !p.FILE_NAME.endsWith("_undefined");
          const imgSrc = hasMedia
            ? encodeURI(`/informationboard/${p.FILE_NAME}`)
            : "";
          const isPinned = p.IS_PINNED === "Y" || p.IS_PINNED === "1";

          return (
            <div
              key={p.POST_ID || idx}
              className="feed-item"
              onClick={() => onSelectPost(p)}
              title="Nhấp để xem chi tiết bài viết"
            >
              {hasMedia ? (
                <img
                  src={imgSrc}
                  alt="Thumb"
                  className="item-thumb"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="item-thumb"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                  }}
                >
                  <FiImage size={20} />
                </div>
              )}

              <div className="item-info">
                <div className="item-top">
                  <div className="item-badge">
                    <span>{p.SUBDEPT || "TỔNG HỢP"}</span>
                    {isPinned && (
                      <span style={{ color: "#d97706", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                        <FiBookmark size={11} /> GHIM
                      </span>
                    )}
                  </div>
                  <div className="item-title" title={p.TITLE}>
                    {p.TITLE || "(Không có tiêu đề)"}
                  </div>
                </div>

                <div className="item-meta">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <FiUser size={10} />
                    {p.INS_EMPL || "Admin"}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <FiCalendar size={10} />
                    {p.INS_DATE ? p.INS_DATE.slice(0, 10) : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {posts.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "12px" }}>
            Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddInfoRecentFeed);

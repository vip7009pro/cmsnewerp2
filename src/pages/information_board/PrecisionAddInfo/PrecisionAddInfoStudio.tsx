import React, { useRef } from "react";
import {
  FiEdit3,
  FiEye,
  FiUploadCloud,
  FiCheckCircle,
  FiRefreshCw,
  FiImage,
  FiTrash2,
  FiBookmark,
  FiHeart,
  FiMessageSquare,
  FiShare2,
} from "react-icons/fi";
import { DEPARTMENT_DATA } from "../interfaces/infoInterface";

interface StudioProps {
  deptList: DEPARTMENT_DATA[];
  selectedDept: number;
  onDeptChange: (code: number) => void;
  title: string;
  onTitleChange: (val: string) => void;
  content: string;
  onContentChange: (val: string) => void;
  isPinned: boolean;
  onPinnedChange: (val: boolean) => void;
  file: File | null;
  previewUrl: string;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  authorName?: string;
}

const PrecisionAddInfoStudio: React.FC<StudioProps> = ({
  deptList,
  selectedDept,
  onDeptChange,
  title,
  onTitleChange,
  content,
  onContentChange,
  isPinned,
  onPinnedChange,
  file,
  previewUrl,
  onFileChange,
  onSubmit,
  isSubmitting,
  authorName = "Admin",
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentDept = deptList.find((d) => d.DEPT_CODE === selectedDept);
  const deptName = currentDept ? currentDept.SUBDEPT : "Phòng Ban";

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="precision-addinfo__studioGrid">
      {/* 1. Editor Workspace (Cột Trái) */}
      <div className="editor-card">
        <div className="editor-card__header">
          <div className="editor-card__titleWrap">
            <FiEdit3 size={14} color="#0284c7" />
            <span>Soạn Thảo Bài Viết & Đa Phương Tiện</span>
          </div>
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            * Trường bắt buộc
          </span>
        </div>

        <div className="editor-card__body">
          {/* Nhóm 1: Chọn Phòng Ban & Ghim Tin */}
          <div className="editor-card__inlineFields">
            <div className="editor-card__fieldGroup">
              <label>
                <span>Phòng Ban Phát Hành *</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => onDeptChange(Number(e.target.value))}
              >
                {deptList.map((d) => (
                  <option key={d.DEPT_CODE} value={d.DEPT_CODE}>
                    {d.SUBDEPT} ({d.MAINDEPT})
                  </option>
                ))}
              </select>
            </div>

            <div className="editor-card__fieldGroup" style={{ justifyContent: "center" }}>
              <label>
                <span>Ưu Tiên Hiển Thị</span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#334155",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => onPinnedChange(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#f59e0b" }}
                />
                <FiBookmark size={14} color={isPinned ? "#f59e0b" : "#94a3b8"} />
                <span>Ghim Lên Đầu Bảng Tin (Sticky Post)</span>
              </label>
            </div>
          </div>

          {/* Nhóm 2: Tiêu Đề Bài Viết */}
          <div className="editor-card__fieldGroup">
            <label>
              <span>Tiêu Đề Bài Viết *</span>
              <span className="char-counter">{title.length}/150</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tiêu đề thông báo, chỉ thị hoặc tin tức ngắn gọn, súc tích..."
              value={title}
              maxLength={150}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          {/* Nhóm 3: Nội Dung Chi Tiết */}
          <div className="editor-card__fieldGroup">
            <label>
              <span>Nội Dung Thông Cáo / Bài Viết *</span>
            </label>
            <textarea
              placeholder="Soạn thảo toàn văn nội dung bài viết. Có thể chia đoạn, ghi chú hướng dẫn cụ thể cho cán bộ nhân viên..."
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </div>

          {/* Nhóm 4: Tải Lên Ảnh Đính Kèm (Drag-and-Drop) */}
          <div className="editor-card__fieldGroup">
            <label>
              <span>Hình Ảnh Đính Kèm / Banner Bảng Tin (Tùy chọn)</span>
            </label>

            {!file ? (
              <div
                className="editor-card__dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="dropzone-content">
                  <FiUploadCloud size={24} color="#0284c7" />
                  <span>
                    Kéo thả ảnh vào đây hoặc <strong>nhấp để duyệt tệp</strong>
                  </span>
                  <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>
                    Định dạng hỗ trợ: JPG, PNG, WEBP (Khuyến nghị tỷ lệ 16:9)
                  </span>
                </div>
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-preview__info">
                  <img src={previewUrl} alt="Preview" />
                  <div className="file-meta">
                    <span className="name">{file.name}</span>
                    <span className="size">
                      {(file.size / 1024).toFixed(1)} KB • Sẵn sàng tải lên
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="file-preview__remove"
                  onClick={() => onFileChange(null)}
                  title="Xóa tệp ảnh này"
                >
                  <FiTrash2 size={12} />
                  <span>Xóa ảnh</span>
                </button>
              </div>
            )}
          </div>

          {/* Cụm Nút Hành Động */}
          <div className="editor-card__actions">
            <button
              type="button"
              className="precision-addinfo__btn"
              onClick={() => {
                onTitleChange("");
                onContentChange("");
                onPinnedChange(false);
                onFileChange(null);
              }}
              disabled={isSubmitting}
            >
              <FiRefreshCw size={12} />
              <span>Làm Mới Form</span>
            </button>

            <button
              type="button"
              className="editor-card__submitBtn"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              <FiCheckCircle size={14} />
              <span>{isSubmitting ? "Đang Xuất Bản..." : "Xuất Bản Bài Viết"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Live Preview Card (Cột Phải) */}
      <div className="preview-card">
        <div className="preview-card__header">
          <div className="preview-card__titleWrap">
            <FiEye size={14} color="#10b981" />
            <span>Mô Phỏng Bài Đăng Thời Gian Thực (Live Preview)</span>
          </div>
          <span className="preview-card__badge">Live Feed</span>
        </div>

        <div className="preview-card__inner">
          {/* Tác Giả & Phòng Ban */}
          <div className="preview-card__author">
            <div className="author-avatar">{authorName.slice(0, 2)}</div>
            <div className="author-info">
              <span className="name">{authorName}</span>
              <div className="meta">
                <span className="dept-tag">{deptName}</span>
                <span>• Vừa xong</span>
              </div>
            </div>
          </div>

          {/* Ảnh Bìa Bảng Tin */}
          <div className="preview-card__cover">
            {previewUrl ? (
              <img src={previewUrl} alt="Cover Preview" />
            ) : (
              <div className="placeholder">
                <FiImage size={32} />
                <span>Chưa chọn ảnh đính kèm (Sẽ dùng ảnh mặc định hệ thống)</span>
              </div>
            )}
          </div>

          {/* Tiêu Đề Bài Viết */}
          <h3 className={`preview-card__postTitle ${isPinned ? "pinned" : ""}`}>
            {title.trim() || "Tiêu đề bài viết sẽ hiển thị tại đây..."}
          </h3>

          {/* Nội Dung Bài Viết */}
          <div className="preview-card__postContent">
            {content.trim() ||
              "Nội dung toàn văn bài viết sẽ xuất hiện tại đây khi bạn nhập vào form soạn thảo bên trái..."}
          </div>

          {/* Footer Tương Tác */}
          <div className="preview-card__footer">
            <div className="mock-likes">
              <span><FiHeart size={13} color="#e11d48" /> 0 Thích</span>
              <span><FiMessageSquare size={13} color="#0284c7" /> 0 Phản hồi</span>
            </div>
            <span><FiShare2 size={13} /> Chia sẻ nội bộ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddInfoStudio);

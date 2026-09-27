import React, { useRef } from "react";
import {
  FiTrash2,
  FiCamera,
  FiMaximize2,
  FiFolder,
} from "react-icons/fi";

interface PrecisionDataSampleSxImageUploadBoxProps {
  title: string;
  icon: React.ReactNode;
  file: File | null;
  preview: string | null;
  emeraldTheme?: boolean;
  onFileChange: (file: File | null) => void;
  onOpenPreview: (title: string, url: string, name?: string, size?: number) => void;
}

const PrecisionDataSampleSxImageUploadBox: React.FC<PrecisionDataSampleSxImageUploadBoxProps> = ({
  title,
  icon,
  file,
  preview,
  emeraldTheme = false,
  onFileChange,
  onOpenPreview,
}) => {
  const camInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={`upload-box ${file ? "has-file" : ""}`}>
      {/* Box Header */}
      <div className="upload-box__header">
        <div className="box-title">
          {icon}
          <span>{title}</span>
        </div>
        {file && (
          <button
            type="button"
            className="btn-remove-file"
            onClick={() => {
              onFileChange(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              if (camInputRef.current) camInputRef.current.value = "";
            }}
            title="Xóa ảnh này"
          >
            <FiTrash2 size={12} />
            <span>Xóa</span>
          </button>
        )}
      </div>

      {/* Preview hoặc Dropzone */}
      {preview ? (
        <div className="upload-preview-area">
          <div
            className="preview-img-container"
            onClick={() => onOpenPreview(title, preview, file?.name, file?.size)}
            title="Chạm để phóng to xem chi tiết"
          >
            <img src={preview} alt={`${title} preview`} className="preview-img" />
            <span className="zoom-hint">
              <FiMaximize2 size={11} /> Phóng to
            </span>
          </div>

          <div className="preview-meta">
            <span className="file-name">{file?.name}</span>
            <span className="file-size font-mono">
              {((file?.size ?? 0) / 1024).toFixed(0)} KB
            </span>
          </div>

          <div className="preview-actions">
            <button
              type="button"
              className="btn-action-sm btn-camera"
              onClick={() => camInputRef.current?.click()}
            >
              <FiCamera size={12} />
              <span>Chụp lại</span>
            </button>
            <button
              type="button"
              className="btn-action-sm btn-gallery"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiFolder size={12} />
              <span>Chọn file khác</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-dropzone">
          <div className="dropzone-text">{title}</div>
          <div className="dropzone-buttons">
            <button
              type="button"
              className={`btn-capture btn-capture--camera ${emeraldTheme ? "emerald" : ""}`}
              onClick={() => camInputRef.current?.click()}
            >
              <FiCamera size={16} />
              <span>Chụp Camera</span>
            </button>
            <button
              type="button"
              className="btn-capture btn-capture--file"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiFolder size={16} />
              <span>Thư Viện Ảnh</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        ref={camInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        capture="environment"
        className="hidden-file-input"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
          }
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden-file-input"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

export { PrecisionDataSampleSxImageUploadBox };
export default React.memo(PrecisionDataSampleSxImageUploadBox);

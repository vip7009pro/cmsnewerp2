import React from "react";
import CustomDialog from "../../../../../components/Dialog/CustomDialog";

interface PrecisionPoReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REFERENCE_IMG_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuClwahZ7WLxpcrmkGM1qqXxkx7NDUVjtcJenR7Z3uMGk3sCpELgj30AnH3b9sks3oOdBXm7UbwlLWD1oqgfmhjJ8Ac5phn-OyLgsKdfmgvzdbRMWM9kUI4hzJnj_1OVrg3vN3sODYA0vKKzenS6fLip9E1NXabuq7_j7goOEIAEH8okA7j2wdPfhU7rfD0ilkjfKPEjmkwF2yz_1r1JJBg5fCMAXCtE5Nz1JIZ0bxgwXPyNG231Fiqg4k4azCs4mOPYFbg";

const PrecisionPoReferenceModal: React.FC<PrecisionPoReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Màn hình tham chiếu gốc (KD1 Master Table Archetype)"
      content={
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <div
            style={{
              maxHeight: "72vh",
              overflow: "auto",
              background: "#f1f5f9",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #cbd5e1",
            }}
          >
            <img
              src={REFERENCE_IMG_SRC}
              alt="KD1 PO Manager Reference"
              style={{ maxWidth: "100%", height: "auto", borderRadius: 4, display: "block" }}
            />
          </div>
          <p style={{ fontSize: 11, color: "#64748b", margin: 0, textAlign: "center" }}>
            Giao diện mới được tinh giản theo chuẩn Enterprise High-Density (Linear, Datadog), tối ưu bảng dữ liệu 28px và tương phản chuyên nghiệp.
          </p>
        </div>
      }
      actions={
        <button
          type="button"
          onClick={onClose}
          style={{
            height: 32,
            padding: "0 16px",
            borderRadius: 4,
            background: "#004ac6",
            color: "#ffffff",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Đóng cửa sổ
        </button>
      }
    />
  );
};

export default React.memo(PrecisionPoReferenceModal);

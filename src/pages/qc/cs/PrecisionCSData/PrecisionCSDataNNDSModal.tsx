import React from "react";
import { CSCONFIRM_DATA } from "../../interfaces/qcInterface";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface PrecisionCSDataNNDSModalProps {
  row: CSCONFIRM_DATA;
  currentNN: string;
  setCurrentNN: (val: string) => void;
  currentDS: string;
  setCurrentDS: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const PrecisionCSDataNNDSModal: React.FC<PrecisionCSDataNNDSModalProps> = ({
  row,
  currentNN,
  setCurrentNN,
  currentDS,
  setCurrentDS,
  onSave,
  onClose,
}) => {
  const imgSrc = `/cs/CS_${row.CONFIRM_ID}.jpg`;

  return (
    <div className="precision-cs__nndsBackdrop">
      <div className="precision-cs__nndsDialog">
        {/* Header Modal */}
        <div className="nnds-header">
          <div className="title-group">
            <span className="title">CẬP NHẬT NGUYÊN NHÂN & ĐỐI SÁCH CS</span>
            <span className="badge-id">CONFIRM_ID: #{row.CONFIRM_ID}</span>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <CloseIcon style={{ fontSize: "1.1rem" }} />
          </button>
        </div>

        {/* Body Form */}
        <div className="nnds-body">
          {/* Thẻ tóm tắt sự cố & ảnh */}
          <div className="defect-info-card">
            <div className="defect-img-wrap">
              <img
                src={imgSrc}
                alt="Defect"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            <div className="defect-details">
              <div className="info-row">
                <strong>Khách Hàng:</strong>
                <span>{row.CUST_NAME_KD || row.CUST_CD || "N/A"}</span>
              </div>
              <div className="info-row">
                <strong>Mã Hàng (Code):</strong>
                <span>{row.G_NAME_KD || row.G_CODE || "N/A"}</span>
              </div>
              <div className="info-row">
                <strong>Hiện Tượng (현상):</strong>
                <span className="highlight-red">{row.CONTENT || "Chưa có mô tả hiện tượng"}</span>
              </div>
              <div className="info-row">
                <strong>Số Lượng Lỗi:</strong>
                <span>{row.NG_QTY?.toLocaleString("en-US")} EA / {row.INSPECT_QTY?.toLocaleString("en-US")} EA</span>
              </div>
            </div>
          </div>

          {/* 1. Nguyên nhân */}
          <div className="form-section">
            <label className="section-label red">
              <span>1. Nguyên nhân phát sinh & lọt lỗi (원인):</span>
            </label>
            <textarea
              className="red-input"
              rows={4}
              placeholder="Nhập chi tiết nguyên nhân phát sinh tại công đoạn và nguyên nhân lọt qua khâu kiểm tra..."
              value={currentNN}
              onChange={(e) => setCurrentNN(e.target.value)}
            />
          </div>

          {/* 2. Đối sách */}
          <div className="form-section">
            <label className="section-label green">
              <span>2. Biện pháp đối sách khắc phục & phòng ngừa (대책):</span>
            </label>
            <textarea
              className="green-input"
              rows={4}
              placeholder="Nhập hành động khắc phục tức thời, đối sách dài hạn và tiêu chuẩn hóa..."
              value={currentDS}
              onChange={(e) => setCurrentDS(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="nnds-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Hủy Bỏ
          </button>
          <button type="button" className="btn-save" onClick={onSave}>
            <CheckCircleOutlineIcon style={{ fontSize: "0.95rem", verticalAlign: "middle", marginRight: 4 }} />
            <span>Lưu Đối Sách (Update)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSDataNNDSModal);

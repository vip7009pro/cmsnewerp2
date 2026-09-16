import React, { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineFileImage, AiOutlineGlobal, AiOutlineInfoCircle } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  codeinfoCMS: string;
  amz_prod_name: string;
  setAMZ_PROD_NAME: (val: string) => void;
  amz_country: string;
  setAMZ_COUNTRY: (val: string) => void;
  onUpdateInfo: () => void;
}

const COUNTRY_PRESETS = ["US", "JP", "UK", "DE", "FR", "IT", "ES", "CA", "GLOBAL"];

export const PrecisionBomAmazonInfoPanel: React.FC<InfoPanelProps> = React.memo(
  ({
    isOpen,
    onClose,
    codeinfoCMS,
    amz_prod_name,
    setAMZ_PROD_NAME,
    amz_country,
    setAMZ_COUNTRY,
    onUpdateInfo,
  }) => {
    const [imageError, setImageError] = useState(false);

    // Reset imageError state when codeinfoCMS changes
    React.useEffect(() => {
      setImageError(false);
    }, [codeinfoCMS]);

    const imageUrl = codeinfoCMS ? `/amazon_image/AMZ_${codeinfoCMS}.jpg` : "";

    return (
      <aside className={`precision-bom-amz__infoPanel ${!isOpen ? "precision-bom-amz__infoPanel--collapsed" : ""}`}>
        <div className="precision-bom-amz__panelHeader">
          <h3>
            <BsBoxSeam size={15} color="#2563eb" />
            <span>THÔNG TIN SẢN PHẨM AMAZON</span>
          </h3>
          <button
            type="button"
            className="precision-bom-amz__iconBtn"
            onClick={onClose}
            title="Đóng bảng thông tin phụ"
          >
            <AiOutlineClose size={14} />
          </button>
        </div>

        {/* 1. ẢNH SẢN PHẨM */}
        <div className="precision-bom-amz__imageCard">
          <div className="imgWrap">
            {codeinfoCMS && !imageError ? (
              <img
                src={imageUrl}
                alt={`AMZ_${codeinfoCMS}.jpg`}
                onError={() => setImageError(true)}
                onClick={() => window.open(imageUrl, "_blank")}
                title="Nhấp để xem ảnh kích thước đầy đủ"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <div className="noImg">
                <AiOutlineFileImage size={38} />
                <span>
                  {codeinfoCMS ? `Chưa có ảnh AMZ_${codeinfoCMS}.jpg` : "Vui lòng chọn sản phẩm"}
                </span>
              </div>
            )}
          </div>
          <div className="imgCaption">
            {codeinfoCMS ? `AMZ_${codeinfoCMS}.jpg` : "---"}
          </div>
        </div>

        {/* 2. FORM THÔNG TIN PHỤ */}
        <div className="precision-bom-amz__formSection">
          <div className="formGroup">
            <label>
              <AiOutlineInfoCircle size={13} color="#2563eb" />
              <span>TÊN SẢN PHẨM THỰC TẾ:</span>
            </label>
            <textarea
              placeholder="Nhập tên sản phẩm thực tế theo quy cách Amazon..."
              value={amz_prod_name ?? ""}
              onChange={(e) => setAMZ_PROD_NAME(e.target.value)}
              disabled={!codeinfoCMS}
            />
          </div>

          <div className="formGroup">
            <label>
              <AiOutlineGlobal size={13} color="#2563eb" />
              <span>THỊ TRƯỜNG PHÂN PHỐI:</span>
            </label>
            <input
              type="text"
              placeholder="VD: US, JP, EU..."
              value={amz_country ?? ""}
              onChange={(e) => setAMZ_COUNTRY(e.target.value)}
              disabled={!codeinfoCMS}
            />
            {/* PRESET CHIPS */}
            <div className="presetTags">
              {COUNTRY_PRESETS.map((country) => (
                <button
                  key={country}
                  type="button"
                  className="tag"
                  onClick={() => setAMZ_COUNTRY(country)}
                  disabled={!codeinfoCMS}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="updateBtn"
            onClick={onUpdateInfo}
            disabled={!codeinfoCMS}
            title="Cập nhật tên thực tế và thị trường (Yêu cầu mật mã xác nhận)"
          >
            <AiOutlineCheck size={14} />
            <span>CẬP NHẬT THÔNG TIN PHỤ</span>
          </button>
        </div>
      </aside>
    );
  }
);

PrecisionBomAmazonInfoPanel.displayName = "PrecisionBomAmazonInfoPanel";

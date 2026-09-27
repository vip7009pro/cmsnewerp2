import React, { useState } from "react";
import { FiX, FiFilter, FiRotateCcw, FiCheck } from "react-icons/fi";
import { FSC_LIST_DATA } from "../../interfaces/muaInterface";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";

interface PrecisionQLVLMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Current values
  searchKeyword: string;
  filterUseYn: "ALL" | "Y" | "N";
  filterFsc: "ALL" | "Y" | "N";
  filterFscCode: string;
  filterDocs: "ALL" | "HAS_DOCS" | "NO_DOCS";
  filterVendor: string;
  // Options
  customerList: CustomerListData[];
  fscList: FSC_LIST_DATA[];
  // Handler apply & reset
  onApply: (filters: {
    searchKeyword: string;
    filterUseYn: "ALL" | "Y" | "N";
    filterFsc: "ALL" | "Y" | "N";
    filterFscCode: string;
    filterDocs: "ALL" | "HAS_DOCS" | "NO_DOCS";
    filterVendor: string;
  }) => void;
  onReset: () => void;
}

const PrecisionQLVLMobileFilterDrawer: React.FC<PrecisionQLVLMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  searchKeyword,
  filterUseYn,
  filterFsc,
  filterFscCode,
  filterDocs,
  filterVendor,
  customerList,
  fscList,
  onApply,
  onReset,
}) => {
  // Local state trong drawer để user bấm "Áp Dụng" mới lưu
  const [localSearch, setLocalSearch] = useState<string>(searchKeyword);
  const [localUseYn, setLocalUseYn] = useState<"ALL" | "Y" | "N">(filterUseYn);
  const [localFsc, setLocalFsc] = useState<"ALL" | "Y" | "N">(filterFsc);
  const [localFscCode, setLocalFscCode] = useState<string>(filterFscCode);
  const [localDocs, setLocalDocs] = useState<"ALL" | "HAS_DOCS" | "NO_DOCS">(filterDocs);
  const [localVendor, setLocalVendor] = useState<string>(filterVendor);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      searchKeyword: localSearch,
      filterUseYn: localUseYn,
      filterFsc: localFsc,
      filterFscCode: localFscCode,
      filterDocs: localDocs,
      filterVendor: localVendor,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalSearch("");
    setLocalUseYn("ALL");
    setLocalFsc("ALL");
    setLocalFscCode("");
    setLocalDocs("ALL");
    setLocalVendor("");
    onReset();
    onClose();
  };

  return (
    <div className="precision-qlvl-drawer-overlay" onClick={onClose}>
      <div className="precision-qlvl-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={16} style={{ color: "#2563eb" }} />
            <span>Bộ Lọc Nâng Cao Vật Liệu</span>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        {/* Body Form */}
        <div className="drawer-body">
          {/* 1. Từ khóa tìm kiếm */}
          <div className="drawer-field">
            <label className="drawer-label">Từ Khóa Tìm Kiếm</label>
            <input
              type="text"
              className="drawer-input"
              placeholder="Nhập mã vật liệu, mô tả..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* 2. Nhà cung cấp (Vendor) */}
          <div className="drawer-field">
            <label className="drawer-label">Nhà Cung Cấp (Vendor / Khách Hàng)</label>
            <select
              className="drawer-select"
              value={localVendor}
              onChange={(e) => setLocalVendor(e.target.value)}
            >
              <option value="">-- Tất Cả Nhà Cung Cấp ({customerList.length}) --</option>
              {customerList.map((c) => (
                <option key={c.CUST_CD} value={c.CUST_CD}>
                  {c.CUST_NAME_KD} ({c.CUST_CD})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Trạng thái sử dụng (USE_YN) */}
          <div className="drawer-field">
            <label className="drawer-label">Trạng Thái Áp Dụng (USE_YN)</label>
            <div className="drawer-segmented">
              <button
                type="button"
                className={`segment-btn ${localUseYn === "ALL" ? "active" : ""}`}
                onClick={() => setLocalUseYn("ALL")}
              >
                Tất Cả
              </button>
              <button
                type="button"
                className={`segment-btn ${localUseYn === "Y" ? "active" : ""}`}
                onClick={() => setLocalUseYn("Y")}
              >
                Đang Dùng (Y)
              </button>
              <button
                type="button"
                className={`segment-btn ${localUseYn === "N" ? "active" : ""}`}
                onClick={() => setLocalUseYn("N")}
              >
                Ngừng Dùng (N)
              </button>
            </div>
          </div>

          {/* 4. Tiêu chuẩn Chứng chỉ FSC */}
          <div className="drawer-field">
            <label className="drawer-label">Chứng Nhận Chuẩn FSC</label>
            <div className="drawer-segmented">
              <button
                type="button"
                className={`segment-btn ${localFsc === "ALL" ? "active" : ""}`}
                onClick={() => setLocalFsc("ALL")}
              >
                Tất Cả
              </button>
              <button
                type="button"
                className={`segment-btn ${localFsc === "Y" ? "active" : ""}`}
                onClick={() => setLocalFsc("Y")}
              >
                Đạt FSC (Y)
              </button>
              <button
                type="button"
                className={`segment-btn ${localFsc === "N" ? "active" : ""}`}
                onClick={() => setLocalFsc("N")}
              >
                Không FSC (N)
              </button>
            </div>
          </div>

          {/* 5. Phân loại mã FSC nếu có */}
          {fscList.length > 0 && (
            <div className="drawer-field">
              <label className="drawer-label">Mã Nhóm FSC</label>
              <select
                className="drawer-select"
                value={localFscCode}
                onChange={(e) => setLocalFscCode(e.target.value)}
              >
                <option value="">-- Tất Cả Nhóm FSC ({fscList.length}) --</option>
                {fscList.map((f) => (
                  <option key={f.FSC_CODE} value={f.FSC_CODE}>
                    {f.FSC_NAME} ({f.FSC_CODE})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 6. Hồ Sơ Kỹ Thuật (MSDS / TDS / SGS) */}
          <div className="drawer-field">
            <label className="drawer-label">Hồ Sơ Kỹ Thuật (MSDS / TDS / SGS)</label>
            <div className="drawer-segmented">
              <button
                type="button"
                className={`segment-btn ${localDocs === "ALL" ? "active" : ""}`}
                onClick={() => setLocalDocs("ALL")}
              >
                Tất Cả
              </button>
              <button
                type="button"
                className={`segment-btn ${localDocs === "HAS_DOCS" ? "active" : ""}`}
                onClick={() => setLocalDocs("HAS_DOCS")}
              >
                Đã Có Hồ Sơ
              </button>
              <button
                type="button"
                className={`segment-btn ${localDocs === "NO_DOCS" ? "active" : ""}`}
                onClick={() => setLocalDocs("NO_DOCS")}
              >
                Chưa Có Hồ Sơ
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button type="button" className="btn-drawer-reset" onClick={handleReset}>
            <FiRotateCcw size={14} />
            <span>Đặt Lại</span>
          </button>
          <button type="button" className="btn-drawer-apply" onClick={handleApply}>
            <FiCheck size={15} />
            <span>Áp Dụng Bộ Lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLMobileFilterDrawer);

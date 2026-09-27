import React, { useState } from "react";
import { FiX, FiFilter, FiRotateCcw, FiCheck, FiCalendar } from "react-icons/fi";
import moment from "moment";

interface PrecisionTinhLieuMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    FROM_DATE: string;
    TO_DATE: string;
    ALLTIME: boolean;
    SHORTAGE_ONLY: boolean;
    NEWPO: boolean;
  };
  searchKeyword: string;
  onApply: (filters: {
    formData: {
      FROM_DATE: string;
      TO_DATE: string;
      ALLTIME: boolean;
      SHORTAGE_ONLY: boolean;
      NEWPO: boolean;
    };
    searchKeyword: string;
  }) => void;
  onReset: () => void;
}

const PrecisionTinhLieuMobileFilterDrawer: React.FC<PrecisionTinhLieuMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  formData,
  searchKeyword,
  onApply,
  onReset,
}) => {
  // Local state bên trong Drawer
  const [localFromDate, setLocalFromDate] = useState<string>(formData.FROM_DATE || moment().format("YYYY-MM-DD"));
  const [localToDate, setLocalToDate] = useState<string>(formData.TO_DATE || moment().format("YYYY-MM-DD"));
  const [localAllTime, setLocalAllTime] = useState<boolean>(formData.ALLTIME || false);
  const [localShortageOnly, setLocalShortageOnly] = useState<boolean>(formData.SHORTAGE_ONLY || false);
  const [localNewPo, setLocalNewPo] = useState<boolean>(formData.NEWPO || false);
  const [localSearch, setLocalSearch] = useState<string>(searchKeyword || "");

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      formData: {
        FROM_DATE: localFromDate,
        TO_DATE: localToDate,
        ALLTIME: localAllTime,
        SHORTAGE_ONLY: localShortageOnly,
        NEWPO: localNewPo,
      },
      searchKeyword: localSearch,
    });
    onClose();
  };

  const handleReset = () => {
    const today = moment().format("YYYY-MM-DD");
    setLocalFromDate(today);
    setLocalToDate(today);
    setLocalAllTime(false);
    setLocalShortageOnly(false);
    setLocalNewPo(false);
    setLocalSearch("");
    onReset();
    onClose();
  };

  return (
    <div className="precision-tinhlieu-drawer-overlay" onClick={onClose}>
      <div className="precision-tinhlieu-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={16} style={{ color: "#2563eb" }} />
            <span>Bộ Lọc Nâng Cao MRP</span>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} title="Đóng bộ lọc">
            <FiX size={18} />
          </button>
        </div>

        {/* Body Form */}
        <div className="drawer-body">
          {/* 1. Từ khóa tìm kiếm */}
          <div className="drawer-field">
            <label className="drawer-label">Từ Khóa Tìm Kiếm (Tức Thời)</label>
            <input
              type="text"
              className="drawer-input"
              placeholder="Nhập mã vật liệu, tên vật liệu, PO, YCSX..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* 2. Phạm vi thời gian */}
          <div className="drawer-field">
            <label className="drawer-label">Thời Gian Tính Liệu</label>
            <div className="drawer-segmented">
              <button
                type="button"
                className={`segment-btn ${!localAllTime ? "active" : ""}`}
                onClick={() => setLocalAllTime(false)}
              >
                Theo Khoảng Ngày
              </button>
              <button
                type="button"
                className={`segment-btn ${localAllTime ? "active" : ""}`}
                onClick={() => setLocalAllTime(true)}
              >
                Tất Cả (All Time)
              </button>
            </div>
          </div>

          {!localAllTime && (
            <div className="drawer-date-grid">
              <div className="drawer-field">
                <label className="drawer-label">
                  <FiCalendar size={12} style={{ display: "inline", marginRight: 4 }} />
                  Từ Ngày
                </label>
                <input
                  type="date"
                  className="drawer-input"
                  value={localFromDate.slice(0, 10)}
                  onChange={(e) => setLocalFromDate(e.target.value)}
                />
              </div>

              <div className="drawer-field">
                <label className="drawer-label">
                  <FiCalendar size={12} style={{ display: "inline", marginRight: 4 }} />
                  Đến Ngày
                </label>
                <input
                  type="date"
                  className="drawer-input"
                  value={localToDate.slice(0, 10)}
                  onChange={(e) => setLocalToDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 3. Tùy chọn lọc: Chỉ Liệu Thiếu */}
          <div className="drawer-field">
            <label className="drawer-label">Trạng Thái Thiếu Hụt Vật Liệu</label>
            <div className="drawer-segmented">
              <button
                type="button"
                className={`segment-btn ${!localShortageOnly ? "active" : ""}`}
                onClick={() => setLocalShortageOnly(false)}
              >
                Tất Cả Vật Liệu
              </button>
              <button
                type="button"
                className={`segment-btn ${localShortageOnly ? "active active--warning" : ""}`}
                onClick={() => setLocalShortageOnly(true)}
              >
                Chỉ Vật Liệu Thiếu (Shortage)
              </button>
            </div>
          </div>

          {/* 4. Tùy chọn lọc: Chỉ PO Mới */}
          <div className="drawer-field">
            <label className="drawer-label">Phân Loại Đơn Hàng PO</label>
            <div className="drawer-segmented">
              <button
                type="button"
                className={`segment-btn ${!localNewPo ? "active" : ""}`}
                onClick={() => setLocalNewPo(false)}
              >
                Tất Cả Đơn PO
              </button>
              <button
                type="button"
                className={`segment-btn ${localNewPo ? "active" : ""}`}
                onClick={() => setLocalNewPo(true)}
              >
                Chỉ Đơn PO Mới (New PO)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
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

export default React.memo(PrecisionTinhLieuMobileFilterDrawer);

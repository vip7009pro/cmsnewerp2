import React, { useState, useEffect } from "react";
import { FiX, FiRotateCcw, FiCheck, FiFilter } from "react-icons/fi";

interface PrecisionEqStatus2MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  factoryFilter: string;
  setFactoryFilter: (val: string) => void;
  isCmsCompany: boolean;
  seriesFilter: string;
  setSeriesFilter: (val: string) => void;
  seriesList: string[];
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionEqStatus2MobileFilterDrawer: React.FC<
  PrecisionEqStatus2MobileFilterDrawerProps
> = React.memo(({
  isOpen,
  onClose,
  factoryFilter,
  setFactoryFilter,
  isCmsCompany,
  seriesFilter,
  setSeriesFilter,
  seriesList,
  statusFilter,
  setStatusFilter,
  activeFilter,
  setActiveFilter,
  onApply,
  onReset,
}) => {
  // State tạm thời khi người dùng thao tác trong drawer
  const [tempFactory, setTempFactory] = useState(factoryFilter);
  const [tempSeries, setTempSeries] = useState(seriesFilter);
  const [tempStatus, setTempStatus] = useState(statusFilter);
  const [tempActive, setTempActive] = useState(activeFilter);

  useEffect(() => {
    if (isOpen) {
      setTempFactory(factoryFilter);
      setTempSeries(seriesFilter);
      setTempStatus(statusFilter);
      setTempActive(activeFilter);
    }
  }, [isOpen, factoryFilter, seriesFilter, statusFilter, activeFilter]);

  if (!isOpen) return null;

  const handleApply = () => {
    setFactoryFilter(tempFactory);
    setSeriesFilter(tempSeries);
    setStatusFilter(tempStatus);
    setActiveFilter(tempActive);
    onApply();
    onClose();
  };

  const handleReset = () => {
    setTempFactory("ALL");
    setTempSeries("ALL");
    setTempStatus("ALL");
    setTempActive("ALL");
    onReset();
  };

  return (
    <div className="eqs2_drawer_overlay" onClick={onClose}>
      <div
        className="eqs2_drawer_content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="eqs2_drawer_header">
          <div className="drawer-title">
            <FiFilter size={18} color="#0284c7" />
            <span>Bộ Lọc Thiết Bị</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="eqs2_drawer_body">
          {/* Nhóm 1: Phân xưởng / Nhà máy */}
          <div className="filter-group">
            <div className="filter-label">Phân Xưởng / Nhà Máy</div>
            <div className="filter-options-grid">
              <button
                type="button"
                className={`filter-opt-btn ${tempFactory === "ALL" ? "is-selected" : ""}`}
                onClick={() => setTempFactory("ALL")}
              >
                Tất cả xưởng
              </button>
              <button
                type="button"
                className={`filter-opt-btn ${tempFactory === "NM1" ? "is-selected" : ""}`}
                onClick={() => setTempFactory("NM1")}
              >
                Nhà máy 1 (NM1)
              </button>
              {isCmsCompany && (
                <button
                  type="button"
                  className={`filter-opt-btn ${tempFactory === "NM2" ? "is-selected" : ""}`}
                  onClick={() => setTempFactory("NM2")}
                >
                  Nhà máy 2 (NM2)
                </button>
              )}
            </div>
          </div>

          {/* Nhóm 2: Nhóm Máy / Tiền Tố Series */}
          <div className="filter-group">
            <div className="filter-label">Loại Máy / Nhóm Thiết Bị</div>
            <div className="filter-options-wrap">
              <button
                type="button"
                className={`filter-opt-btn ${tempSeries === "ALL" ? "is-selected" : ""}`}
                onClick={() => setTempSeries("ALL")}
              >
                Tất cả nhóm
              </button>
              {seriesList.map((ser) => (
                <button
                  key={ser}
                  type="button"
                  className={`filter-opt-btn ${tempSeries === ser ? "is-selected" : ""}`}
                  onClick={() => setTempSeries(ser)}
                >
                  Máy {ser}
                </button>
              ))}
            </div>
          </div>

          {/* Nhóm 3: Trạng Thái Vận Hành */}
          <div className="filter-group">
            <div className="filter-label">Trạng Thái Vận Hành</div>
            <div className="filter-options-grid">
              <button
                type="button"
                className={`filter-opt-btn ${tempStatus === "ALL" ? "is-selected" : ""}`}
                onClick={() => setTempStatus("ALL")}
              >
                Tất cả trạng thái
              </button>
              <button
                type="button"
                className={`filter-opt-btn opt-success ${tempStatus === "MASS" ? "is-selected" : ""}`}
                onClick={() => setTempStatus("MASS")}
              >
                Đang Chạy (MASS)
              </button>
              <button
                type="button"
                className={`filter-opt-btn opt-warning ${tempStatus === "SETTING" ? "is-selected" : ""}`}
                onClick={() => setTempStatus("SETTING")}
              >
                Cài Đặt (SETTING)
              </button>
              <button
                type="button"
                className={`filter-opt-btn opt-danger ${tempStatus === "STOP" ? "is-selected" : ""}`}
                onClick={() => setTempStatus("STOP")}
              >
                Tạm Dừng (STOP)
              </button>
            </div>
          </div>

          {/* Nhóm 4: Tình Trạng Thiết Bị */}
          <div className="filter-group">
            <div className="filter-label">Tình Trạng Thiết Bị</div>
            <div className="filter-options-grid">
              <button
                type="button"
                className={`filter-opt-btn ${tempActive === "ALL" ? "is-selected" : ""}`}
                onClick={() => setTempActive("ALL")}
              >
                Tất cả
              </button>
              <button
                type="button"
                className={`filter-opt-btn opt-success ${tempActive === "OK" ? "is-selected" : ""}`}
                onClick={() => setTempActive("OK")}
              >
                Bình Thường (OK)
              </button>
              <button
                type="button"
                className={`filter-opt-btn opt-danger ${tempActive === "NG" ? "is-selected" : ""}`}
                onClick={() => setTempActive("NG")}
              >
                Báo Hỏng / Lỗi (NG)
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="eqs2_drawer_footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={handleReset}
          >
            <FiRotateCcw size={15} />
            <span>Đặt Lại</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
          >
            <FiCheck size={16} />
            <span>Áp Dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default PrecisionEqStatus2MobileFilterDrawer;

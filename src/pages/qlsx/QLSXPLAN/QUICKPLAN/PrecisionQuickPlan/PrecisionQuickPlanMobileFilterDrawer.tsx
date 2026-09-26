import React from "react";
import { AiOutlineClose, AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";

interface PrecisionQuickPlanMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  codeKD: string;
  setCodeKD: (val: string) => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  empl_name: string;
  setEmpl_Name: (val: string) => void;
  cust_name: string;
  setCust_Name: (val: string) => void;
  prod_type: string;
  setProdType: (val: string) => void;
  prodrequestno: string;
  setProdRequestNo: (val: string) => void;
  material: string;
  setMaterial: (val: string) => void;
  phanloai: string;
  setPhanLoai: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  materialYES: boolean;
  setMaterialYES: (val: boolean) => void;
  ycsxpendingcheck: boolean;
  setYCSXPendingCheck: (val: boolean) => void;
  inspectInputcheck: boolean;
  setInspectInputCheck: (val: boolean) => void;
  onSearch: () => void;
}

export const PrecisionQuickPlanMobileFilterDrawer: React.FC<
  PrecisionQuickPlanMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  codeKD,
  setCodeKD,
  codeCMS,
  setCodeCMS,
  empl_name,
  setEmpl_Name,
  cust_name,
  setCust_Name,
  prod_type,
  setProdType,
  prodrequestno,
  setProdRequestNo,
  material,
  setMaterial,
  phanloai,
  setPhanLoai,
  alltime,
  setAllTime,
  materialYES,
  setMaterialYES,
  ycsxpendingcheck,
  setYCSXPendingCheck,
  inspectInputcheck,
  setInspectInputCheck,
  onSearch,
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    onSearch();
    onClose();
  };

  const handleReset = () => {
    setCodeKD("");
    setCodeCMS("");
    setEmpl_Name("");
    setCust_Name("");
    setProdType("");
    setProdRequestNo("");
    setMaterial("");
    setPhanLoai("ALL");
    setAllTime(false);
    setMaterialYES(false);
    setYCSXPendingCheck(false);
    setInspectInputCheck(false);
  };

  return (
    <div
      className="quickplan-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="quickplan-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#2563eb" />
            <span>BỘ LỌC TRA CỨU YCSX</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* 2. Form Body */}
        <div className="drawer-body">
          {/* Nhóm ngày */}
          <div className="filter-group">
            <span className="group-title">Khoảng Thời Gian</span>
            <div className="grid-2col">
              <div className="field-item">
                <label>Từ ngày:</label>
                <input
                  type="date"
                  value={fromdate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="field-item">
                <label>Đến ngày:</label>
                <input
                  type="date"
                  value={todate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm mã & thông tin sản phẩm */}
          <div className="filter-group">
            <span className="group-title">Thông Tin Sản Phẩm & YCSX</span>
            <div className="grid-2col">
              <div className="field-item">
                <label>Code KD:</label>
                <input
                  type="text"
                  placeholder="Mã KD..."
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                />
              </div>
              <div className="field-item">
                <label>Code ERP / CMS:</label>
                <input
                  type="text"
                  placeholder="Mã ERP..."
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2col">
              <div className="field-item">
                <label>Số YCSX (PO):</label>
                <input
                  type="text"
                  placeholder="Số PO..."
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                />
              </div>
              <div className="field-item">
                <label>Khách Hàng:</label>
                <input
                  type="text"
                  placeholder="Tên KH..."
                  value={cust_name}
                  onChange={(e) => setCust_Name(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2col">
              <div className="field-item">
                <label>Phân Loại:</label>
                <select
                  value={phanloai}
                  onChange={(e) => setPhanLoai(e.target.value)}
                >
                  <option value="ALL">Tất cả phân loại</option>
                  <option value="SAMPLE">SAMPLE</option>
                  <option value="MASS">MASS</option>
                </select>
              </div>
              <div className="field-item">
                <label>Loại SP:</label>
                <input
                  type="text"
                  placeholder="Loại SP..."
                  value={prod_type}
                  onChange={(e) => setProdType(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2col">
              <div className="field-item">
                <label>Mã Liệu (NVL):</label>
                <input
                  type="text"
                  placeholder="Tên liệu..."
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
              </div>
              <div className="field-item">
                <label>Nhân Viên:</label>
                <input
                  type="text"
                  placeholder="Tên NV..."
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm Tùy Chọn Lọc Nhanh (Checkboxes) */}
          <div className="filter-group">
            <span className="group-title">Điều Kiện Lọc Nhanh</span>
            <div className="checkbox-pills">
              <label className={`pill-check ${alltime ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={alltime}
                  onChange={(e) => setAllTime(e.target.checked)}
                />
                <span>Toàn thời gian (All Time)</span>
              </label>

              <label className={`pill-check ${materialYES ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={materialYES}
                  onChange={(e) => setMaterialYES(e.target.checked)}
                />
                <span>Đã có vật liệu (YES)</span>
              </label>

              <label className={`pill-check ${ycsxpendingcheck ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={ycsxpendingcheck}
                  onChange={(e) => setYCSXPendingCheck(e.target.checked)}
                />
                <span>YCSX Pending</span>
              </label>

              <label className={`pill-check ${inspectInputcheck ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={inspectInputcheck}
                  onChange={(e) => setInspectInputCheck(e.target.checked)}
                />
                <span>Inspect Input Check</span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Footer Action Buttons */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={handleReset}
          >
            <AiOutlineReload size={14} />
            <span>Đặt Lại</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
          >
            <AiOutlineSearch size={16} />
            <span>Áp Dụng & Tra Cứu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQuickPlanMobileFilterDrawer);

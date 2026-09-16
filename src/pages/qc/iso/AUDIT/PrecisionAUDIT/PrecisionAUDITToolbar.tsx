import React from "react";
import { AUDIT_LIST } from "./auditTypes";

interface PrecisionAUDITToolbarProps {
  fromDate: string;
  setFromDate: (val: string) => void;
  toDate: string;
  setToDate: (val: string) => void;
  auditList: AUDIT_LIST[];
  selectedAuditID: number;
  onSelectAuditID: (id: number) => void;
  onLoadAuditData: () => void;
  onCreateNewAudit: () => void;
  onOpenAddFormModal: () => void;
  quickFilterText: string;
  setQuickFilterText: (val: string) => void;
  onSaveCheckSheet: () => void;
  onResetEvident: () => void;
  onExportExcel: () => void;
  totalChecklistCount: number;
  selectedChecklistCount: number;
}

const PrecisionAUDITToolbar: React.FC<PrecisionAUDITToolbarProps> = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  auditList,
  selectedAuditID,
  onSelectAuditID,
  onLoadAuditData,
  onCreateNewAudit,
  onOpenAddFormModal,
  quickFilterText,
  setQuickFilterText,
  onSaveCheckSheet,
  onResetEvident,
  onExportExcel,
  totalChecklistCount,
  selectedChecklistCount,
}) => {
  return (
    <div className="precision-audit__toolbar">
      {/* Hàng 1: Filters & Master Actions */}
      <div className="precision-audit__toolbarRow">
        <div className="precision-audit__filterGroup">
          <div className="precision-audit__filterItem">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={fromDate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="precision-audit__filterItem">
            <label>Tới ngày:</label>
            <input
              type="date"
              value={toDate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="precision-audit__filterItem">
            <label>Mẫu Audit:</label>
            <select
              value={selectedAuditID}
              onChange={(e) => onSelectAuditID(Number(e.target.value))}
            >
              {auditList.map((ele: AUDIT_LIST, index: number) => (
                <option key={index} value={ele.AUDIT_ID}>
                  {ele.CUST_NAME_KD}: {ele.AUDIT_NAME}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--primary"
            onClick={onLoadAuditData}
            title="Tải lại danh sách đợt kiểm toán"
          >
            <span className="material-symbols-outlined">search</span>
            <span>Nạp Dữ Liệu</span>
          </button>

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--emerald"
            onClick={onCreateNewAudit}
            title="Tạo thêm một đợt Audit mới cho mẫu đang chọn"
          >
            <span className="material-symbols-outlined">add_task</span>
            <span>New Audit</span>
          </button>

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--purple"
            onClick={onOpenAddFormModal}
            title="Tải lên hoặc khởi tạo Form Mẫu Checksheet mới"
          >
            <span className="material-symbols-outlined">post_add</span>
            <span>Thêm Mẫu Mới (Add Form)</span>
          </button>
        </div>
      </div>

      {/* Hàng 2: Checklist Actions & Quick Filter */}
      <div className="precision-audit__toolbarRow">
        <div className="precision-audit__filterGroup">
          <div className="precision-audit__quickSearch">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              placeholder="Lọc nhanh trên checksheet..."
            />
            {quickFilterText && (
              <button
                type="button"
                onClick={() => setQuickFilterText("")}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8", padding: 0 }}
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--emerald"
            onClick={onSaveCheckSheet}
            title="Lưu điểm và ghi chú cho các dòng đang tick chọn"
          >
            <span className="material-symbols-outlined">save</span>
            <span>Lưu Checksheet</span>
          </button>

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--rose"
            onClick={onResetEvident}
            title="Xóa bằng chứng ảnh cho các dòng đang tick chọn (Quyền ISO)"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            <span>Reset Evident</span>
          </button>

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--outline"
            onClick={onExportExcel}
            title="Xuất bảng checksheet ra Excel"
          >
            <span className="material-symbols-outlined" style={{ color: "#059669" }}>file_download</span>
            <span>Xuất Excel</span>
          </button>
        </div>

        <div style={{ fontSize: 11, color: "#64748b" }}>
          Đang hiển thị: <strong>{totalChecklistCount}</strong> dòng | Đã chọn: <strong style={{ color: selectedChecklistCount > 0 ? "#2563eb" : "inherit" }}>{selectedChecklistCount}</strong> dòng
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAUDITToolbar);

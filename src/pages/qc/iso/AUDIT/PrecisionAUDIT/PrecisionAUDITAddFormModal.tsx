import React, { useRef } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import AGTable from "../../../../../components/DataTable/AGTable";
import { CustomerListData, AUDIT_CHECK_LIST } from "./auditTypes";

interface PrecisionAUDITAddFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerList: CustomerListData[];
  selectedCust_CD: CustomerListData | null;
  setSelectedCust_CD: (val: CustomerListData | null) => void;
  passScore: number;
  setPassScore: (val: number) => void;
  auditName: string;
  setAuditName: (val: string) => void;
  uploadExcelJson: any[];
  onReadUploadFile: (e: any) => void;
  onAddRow: () => void;
  onDeleteRow: (id: number) => void;
  onInsertNewAuditInfo: () => void;
}

const filterOptions1 = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

const PrecisionAUDITAddFormModal: React.FC<PrecisionAUDITAddFormModalProps> = ({
  isOpen,
  onClose,
  customerList,
  selectedCust_CD,
  setSelectedCust_CD,
  passScore,
  setPassScore,
  auditName,
  setAuditName,
  uploadExcelJson,
  onReadUploadFile,
  onAddRow,
  onDeleteRow,
  onInsertNewAuditInfo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const columns_excelupload = [
    { field: "MAIN_ITEM_NO", headerName: "MAIN_ITEM_NO", width: 90 },
    { field: "MAIN_ITEM_CONTENT", headerName: "MAIN_ITEM_CONTENT", width: 140 },
    { field: "SUB_ITEM_NO", headerName: "SUB_ITEM_NO", width: 90 },
    { field: "SUB_ITEM_CONTENT", headerName: "SUB_ITEM_CONTENT", width: 140 },
    { field: "LEVEL_CAT", headerName: "LEVEL_CAT", width: 90 },
    { field: "DETAIL_VN", headerName: "DETAIL_VN", width: 180 },
    { field: "DETAIL_KR", headerName: "DETAIL_KR", width: 180 },
    { field: "DETAIL_EN", headerName: "DETAIL_EN", width: 180 },
    { field: "MAX_SCORE", headerName: "MAX_SCORE", width: 90 },
    { field: "DEPARTMENT", headerName: "DEPARTMENT", width: 100 },
    {
      field: "DELETE",
      headerName: "DELETE",
      width: 60,
      cellRenderer: (ele: any) => (
        <button
          type="button"
          onClick={() => onDeleteRow(ele.data.id)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
          title="Xóa dòng này"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
        </button>
      ),
    },
  ];

  return (
    <div className="precision-audit__modalOverlay" onClick={onClose}>
      <div
        className="precision-audit__modalCard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="precision-audit__modalHeader">
          <span className="modal-title">
            <span className="material-symbols-outlined" style={{ color: "#7c3aed" }}>
              post_add
            </span>
            <span>KHỞI TẠO FORM MẪU CHECKSHEET AUDIT MỚI</span>
          </span>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="precision-audit__modalToolbar">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={onReadUploadFile}
          />

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-symbols-outlined" style={{ color: "#059669" }}>
              upload_file
            </span>
            <span>Chọn File Excel Checksheet</span>
          </button>

          <Autocomplete
            sx={{ width: 220 }}
            size="small"
            disablePortal
            options={customerList}
            filterOptions={filterOptions1}
            isOptionEqualToValue={(option: any, value: any) => option.CUST_CD === value?.CUST_CD}
            getOptionLabel={(option: CustomerListData | any) => `${option.CUST_CD}: ${option.CUST_NAME_KD}`}
            renderInput={(params) => <TextField {...params} label="Khách hàng" size="small" />}
            value={selectedCust_CD}
            onChange={(_event: any, newValue: CustomerListData | null) => setSelectedCust_CD(newValue)}
          />

          <TextField
            value={passScore}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassScore(Number(e.target.value))}
            size="small"
            label="Pass Score"
            type="number"
            sx={{ width: 100 }}
          />

          <TextField
            value={auditName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuditName(e.target.value)}
            size="small"
            label="Tên Form Audit"
            sx={{ width: 180 }}
          />

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--outline"
            onClick={onAddRow}
          >
            <span className="material-symbols-outlined" style={{ color: "#2563eb" }}>add</span>
            <span>Thêm Dòng</span>
          </button>

          <button
            type="button"
            className="precision-audit__btn precision-audit__btn--primary"
            onClick={onInsertNewAuditInfo}
            style={{ marginLeft: "auto" }}
          >
            <span className="material-symbols-outlined">cloud_upload</span>
            <span>Tải Form Lên Hệ Thống</span>
          </button>
        </div>

        <div className="precision-audit__modalBody">
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>
            Tổng số tiêu chí chuẩn bị tạo: <strong>{uploadExcelJson.length}</strong> dòng
          </div>
          <div style={{ flex: 1, height: "100%", width: "100%", overflow: "hidden" }}>
            <AGTable
              showFilter={true}
              columns={columns_excelupload}
              data={uploadExcelJson}
              rowHeight={32}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAUDITAddFormModal);

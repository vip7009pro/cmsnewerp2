import React, { useRef } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { MdQrCodeScanner, MdOutput } from "react-icons/md";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";

interface XuatLieuScannerPanelProps {
  selectedCustomer: CustomerListData | null;
  setSelectedCustomer: (val: any) => void;
  customerList: CustomerListData[];
  filterOptions: any;
  selectedFactory: string;
  setSelectedFactory: (val: string) => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  giao_empl: string;
  giao_empl_name: string;
  onGiaoEmplChange: (val: string) => void;
  nhan_empl: string;
  nhan_empl_name: string;
  onNhanEmplChange: (val: string) => void;
  planId: string;
  g_name: string;
  fsc_GCODE: string;
  solanout: number;
  onPlanIdChange: (val: string) => void;
  m_lot_no: string;
  m_name: string;
  onLotNoChange: (val: string) => void;
  onXuatKho: () => void;
  prepareOutCount: number;
}

const XuatLieuScannerPanel: React.FC<XuatLieuScannerPanelProps> = ({
  selectedCustomer,
  setSelectedCustomer,
  customerList,
  filterOptions,
  selectedFactory,
  setSelectedFactory,
  fromdate,
  setFromDate,
  giao_empl,
  giao_empl_name,
  onGiaoEmplChange,
  nhan_empl,
  nhan_empl_name,
  onNhanEmplChange,
  planId,
  g_name,
  fsc_GCODE,
  solanout,
  onPlanIdChange,
  m_lot_no,
  m_name,
  onLotNoChange,
  onXuatKho,
  prepareOutCount,
}) => {
  const lotInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="xuatlieu__scannerCard">
      <div className="controls-grid">
        {/* Khách Hàng */}
        <div className="form-field">
          <label>Khách Hàng / Đối Tác</label>
          <div className="stitch-autocomplete">
            <Autocomplete
              size="small"
              disablePortal
              options={customerList}
              filterOptions={filterOptions}
              isOptionEqualToValue={(option: any, value: any) => option.CUST_CD === value.CUST_CD}
              getOptionLabel={(option: any) =>
                `${option.CUST_NAME_KD ? option.CUST_NAME_KD : ""}${option.CUST_CD ? ` (${option.CUST_CD})` : ""}`
              }
              renderInput={(params) => <TextField {...params} placeholder="Chọn khách hàng" />}
              renderOption={(props, option: any) => (
                <Typography style={{ fontSize: "11.5px", padding: "4px 8px" }} {...props}>
                  <strong>{option.CUST_NAME_KD}</strong> ({option.CUST_CD})
                </Typography>
              )}
              value={selectedCustomer}
              onChange={(_event: any, newValue: any) => setSelectedCustomer(newValue)}
            />
          </div>
        </div>

        {/* Factory */}
        <div className="form-field">
          <label>Nhà Máy</label>
          <select value={selectedFactory} onChange={(e) => setSelectedFactory(e.target.value)}>
            <option value="NM1">NM1 (Nhà máy 1)</option>
            <option value="NM2">NM2 (Nhà máy 2)</option>
          </select>
        </div>

        {/* Ngày xuất kho */}
        <div className="form-field">
          <label>Ngày Xuất Kho</label>
          <input type="date" value={fromdate} onChange={(e) => setFromDate(e.target.value)} />
        </div>

        {/* Số lần xuất */}
        <div className="form-field">
          <label>Lần Xuất (O302)</label>
          <input type="text" readOnly value={`Lần thứ: ${solanout}`} style={{ backgroundColor: "#f1f5f9", fontWeight: 700 }} />
        </div>

        {/* Người giao */}
        <div className="form-field">
          <label>
            <span>Người Giao (Mã NV)</span>
            {giao_empl_name && <span className="matched-badge">{giao_empl_name}</span>}
          </label>
          <input
            type="text"
            placeholder="VD: NHU1903"
            value={giao_empl}
            onChange={(e) => onGiaoEmplChange(e.target.value)}
          />
        </div>

        {/* Người nhận */}
        <div className="form-field">
          <label>
            <span>Người Nhận (Mã NV)</span>
            {nhan_empl_name && <span className="matched-badge">{nhan_empl_name}</span>}
          </label>
          <input
            type="text"
            placeholder="VD: NHU1903"
            value={nhan_empl}
            onChange={(e) => onNhanEmplChange(e.target.value)}
          />
        </div>

        {/* Số chỉ thị PLAN_ID */}
        <div className="form-field" style={{ gridColumn: "span 2" }}>
          <label>
            <span>Số Chỉ Thị (PLAN_ID) <span className="required">*</span></span>
            {g_name && (
              <span className="matched-badge" title={g_name}>
                SP: {g_name} | FSC: {fsc_GCODE}
              </span>
            )}
          </label>
          <input
            type="text"
            placeholder="Nhập số PLAN_ID (tối thiểu 7 ký tự để load thông tin)..."
            value={planId}
            onChange={(e) => onPlanIdChange(e.target.value)}
          />
        </div>
      </div>

      {/* 4. SCANNER HERO BAR (Vùng Bắn Barcode) */}
      <div className="scanner-hero-bar">
        <div className="scanner-input-box">
          <MdQrCodeScanner className="scanner-icon" />
          <span className="scanner-label">Bắn Mã Barcode:</span>
          <input
            ref={lotInputRef}
            type="text"
            className="scanner-input"
            placeholder="Đặt con trỏ vào đây và bắn mã vạch cuộn liệu (M_LOT_NO)..."
            value={m_lot_no}
            onChange={(e) => onLotNoChange(e.target.value)}
            autoFocus
          />
        </div>

        {m_name && (
          <div className="scanned-feedback" title={m_name}>
            <span className="label-tag">ĐÃ NHẬN DIỆN</span>
            <span>{m_name}</span>
          </div>
        )}

        <button
          type="button"
          className="btn-submit-xuatkho"
          onClick={onXuatKho}
          disabled={prepareOutCount === 0}
        >
          <MdOutput size={16} />
          <span>Xác Nhận Xuất Kho ({prepareOutCount})</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(XuatLieuScannerPanel);

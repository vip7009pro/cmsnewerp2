import React from "react";
import {
  FiDownload,
  FiUpload,
  FiFilter,
  FiPlus,
  FiSave,
  FiSearch,
  FiSend,
} from "react-icons/fi";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { PrecisionFailingFormIn } from "./PrecisionFailingFormIn";
import { PrecisionFailingFormOut } from "./PrecisionFailingFormOut";

interface PrecisionFailingSidebarProps {
  sidebarMode: "IN" | "OUT" | "FILTER";
  setSidebarMode: (m: "IN" | "OUT" | "FILTER") => void;
  cmsvcheck: boolean;
  setCMSVCheck: React.Dispatch<React.SetStateAction<boolean>>;
  onlyPending: boolean;
  setOnlyPending: React.Dispatch<React.SetStateAction<boolean>>;
  customerList: CustomerListData[];
  testtype: string;
  setTestType: (v: string) => void;
  cust_cd: string;
  setCust_Cd: (v: string) => void;
  ncrId: number;
  setNCRID: (v: number) => void;
  remark: string;
  setReMark: (v: string) => void;
  planId: string;
  setPlanId: (v: string) => void;
  g_name: string;
  m_lot_no: string;
  setM_LOT_NO: (v: string) => void;
  process_lot_no: string;
  setProcessLotNo: (v: string) => void;
  vendorLot: string;
  setVendorLot: (v: string) => void;
  m_name: string;
  defect_phenomenon: string;
  setDefectPhenomenon: (v: string) => void;
  request_empl: string;
  setrequest_empl: (v: string) => void;
  request_empl2: string;
  setrequest_empl2: (v: string) => void;
  empl_name: string;
  empl_name2: string;
  onAddRow: () => void;
  onSaveData: () => void;
  onOutputFail: () => void;
  onSearch: () => void;
  checkPlanID: (id: string) => void;
  checkPQC3_ID: (id: string) => void;
  checkLotNVL: (lot: string) => void;
  checkLotProcess: (lot: string) => void;
  checkEMPL_NAME: (sel: number, no: string) => void;
}

export const PrecisionFailingSidebar: React.FC<PrecisionFailingSidebarProps> = (props) => {
  const {
    sidebarMode,
    setSidebarMode,
    cmsvcheck,
    setCMSVCheck,
    onlyPending,
    setOnlyPending,
    customerList,
    cust_cd,
    setCust_Cd,
    ncrId,
    setNCRID,
    onAddRow,
    onSaveData,
    onOutputFail,
    onSearch,
  } = props;

  return (
    <aside className="precision-failing-sidebar">
      {/* Segmented Mode Switcher */}
      <div className="precision-failing-sidebar__segmented">
        <button
          type="button"
          className={`btn-seg ${sidebarMode === "IN" ? "is-active" : ""}`}
          onClick={() => setSidebarMode("IN")}
        >
          <FiDownload />
          <span>Nhập (IN)</span>
        </button>

        <button
          type="button"
          className={`btn-seg ${sidebarMode === "OUT" ? "is-active is-active--out" : ""}`}
          onClick={() => setSidebarMode("OUT")}
        >
          <FiUpload />
          <span>Xuất (OUT)</span>
        </button>

        <button
          type="button"
          className={`btn-seg ${sidebarMode === "FILTER" ? "is-active is-active--filter" : ""}`}
          onClick={() => setSidebarMode("FILTER")}
        >
          <FiFilter />
          <span>Bộ Lọc</span>
        </button>
      </div>

      {/* Sidebar Body */}
      <div className="precision-failing-sidebar__body">
        {/* COMMON: Vendor & CMSV Checkbox */}
        <div className="form-group">
          <label>Nhà Cung Cấp</label>
          <select
            className="input-control"
            disabled={cmsvcheck}
            value={cust_cd}
            onChange={(e) => setCust_Cd(e.target.value)}
          >
            {customerList.map((item, idx) => (
              <option key={idx} value={item.CUST_CD}>
                {item.CUST_NAME_KD}
              </option>
            ))}
          </select>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="cmsv_toggle"
            checked={cmsvcheck}
            onChange={(e) => {
              if (!cmsvcheck) setCust_Cd("6969");
              setCMSVCheck(e.target.checked);
            }}
          />
          <label htmlFor="cmsv_toggle">CMSV Mặc Định</label>
        </div>

        {/* MODE 1: FORM IN (NHẬP KHO FAILING) */}
        {sidebarMode === "IN" && <PrecisionFailingFormIn {...props} />}

        {/* MODE 2: FORM OUT (XUẤT KHO FAILING) */}
        {sidebarMode === "OUT" && <PrecisionFailingFormOut {...props} />}

        {/* MODE 3: BỘ LỌC TRA CỨU */}
        {sidebarMode === "FILTER" && (
          <>
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="only_pending_toggle"
                checked={onlyPending}
                onChange={(e) => setOnlyPending(e.target.checked)}
              />
              <label htmlFor="only_pending_toggle">Chỉ Lọc Lô PENDING</label>
            </div>

            <div className="form-group">
              <label>NCR ID</label>
              <input
                type="number"
                className="input-control input-control--mono font-bold text-rose-600"
                placeholder="0"
                value={ncrId}
                onChange={(e) => setNCRID(parseInt(e.target.value) || 0)}
              />
            </div>
          </>
        )}
      </div>

      {/* Sidebar Footer Actions */}
      <div className="precision-failing-sidebar__footer">
        {sidebarMode === "IN" && (
          <div className="btn-action-row">
            <button type="button" className="btn-form btn-form--add" onClick={onAddRow}>
              <FiPlus />
              <span>ADD</span>
            </button>
            <button type="button" className="btn-form btn-form--save" onClick={onSaveData}>
              <FiSave />
              <span>SAVE</span>
            </button>
          </div>
        )}

        {sidebarMode === "OUT" && (
          <button type="button" className="btn-form btn-form--out w-full" onClick={onOutputFail}>
            <FiSend />
            <span>XUẤT KHO LIỆU</span>
          </button>
        )}

        {sidebarMode === "FILTER" && (
          <button type="button" className="btn-form btn-form--search w-full" onClick={onSearch}>
            <FiSearch />
            <span>TRA DATA FAILING</span>
          </button>
        )}
      </div>
    </aside>
  );
};

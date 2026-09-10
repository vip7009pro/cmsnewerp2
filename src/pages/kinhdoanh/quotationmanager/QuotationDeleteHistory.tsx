import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { FiClock, FiDownload, FiEye, FiFilter, FiLayers, FiSearch } from "react-icons/fi";

import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { checkBP } from "../../../api/services/permissionService";
import { SaveExcel } from "../../../api/services/excelService";
import AGTable from "../../../components/DataTable/AGTable";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { BANGGIA_DELETED_DATA } from "../interfaces/kdInterface";
import { f_loadbanggiaDeletedHistory } from "../utils/kdUtils";
import { createPivotDataSource, formatDecimal } from "./PrecisionQuotation/PrecisionPriceColumns";

const QuotationDeleteHistory: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  /* ── State Filters ── */
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [m_name, setMName] = useState("");
  const [cust_name, setCustName] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* ── Data States ── */
  const [rows, setRows] = useState<BANGGIA_DELETED_DATA[]>([]);
  const [showPivot, setShowPivot] = useState(false);

  /* ── Load Data ── */
  const loadDeletedPriceHistory = useCallback(async () => {
    const loadedData = await f_loadbanggiaDeletedHistory({
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      CUST_NAME_KD: cust_name,
    });
    setRows(loadedData || []);
  }, [alltime, fromdate, todate, m_name, codeCMS, codeKD, cust_name]);

  /* ── Columns Definition ── */
  const columnsDeletedHistory = useMemo(
    () => [
      { field: "PROD_ID", headerName: "PROD_ID", width: 85 },
      { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
      { field: "CUST_CD", headerName: "CUST_CD", width: 65 },
      { field: "G_CODE", headerName: "G_CODE", width: 85 },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 110 },
      { field: "G_NAME", headerName: "G_NAME", width: 130 },
      { field: "PROD_MAIN_MATERIAL", headerName: "MATERIAL", width: 100 },
      { field: "PRICE_DATE", headerName: "PRICE_DATE", width: 90, cellStyle: { textAlign: "center" } },
      { field: "MOQ", headerName: "MOQ", width: 65, cellStyle: { textAlign: "right" } },
      {
        field: "PROD_PRICE",
        headerName: "PROD_PRICE ($)",
        width: 100,
        cellStyle: { textAlign: "right" },
        cellRenderer: (e: any) => (
          <span style={{ color: "#1d4ed8", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
            {formatDecimal(e.data?.PROD_PRICE, 2, 6)}
          </span>
        ),
      },
      {
        field: "BEP",
        headerName: "BEP",
        width: 80,
        cellStyle: { textAlign: "right" },
        cellRenderer: (e: any) => (
          <span style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
            {formatDecimal(e.data?.BEP, 2, 6)}
          </span>
        ),
      },
      { field: "CURRENCY", headerName: "CURRENCY", width: 75, cellStyle: { textAlign: "center" } },
      {
        field: "RATE",
        headerName: "RATE",
        width: 80,
        cellStyle: { textAlign: "right" },
        cellRenderer: (e: any) => (
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {formatDecimal(e.data?.RATE, 2, 4)}
          </span>
        ),
      },
      {
        field: "FINAL",
        headerName: "APPROVAL",
        width: 85,
        cellStyle: { textAlign: "center" },
        cellRenderer: (e: any) =>
          e.data?.FINAL === "Y" ? (
            <span className="badge-approved-y">Y</span>
          ) : (
            <span className="badge-approved-n">N</span>
          ),
      },
      { field: "REMARK", headerName: "REMARK", width: 130 },
      {
        field: "INS_DATE",
        headerName: "DELETE_DATE",
        width: 135,
        cellRenderer: (e: any) => (
          <span style={{ color: "#e11d48", fontWeight: 600 }}>{e.data?.INS_DATE}</span>
        ),
      },
      { field: "INS_EMPL", headerName: "DELETE_EMPL", width: 85 },
      { field: "UPD_DATE", headerName: "UPD_DATE", width: 135 },
      { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 85 },
    ],
    []
  );

  /* ── Init ── */
  useEffect(() => {
    checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadDeletedPriceHistory);
  }, [loadDeletedPriceHistory, userData]);

  return (
    <div className="precision-quotation__workspace">
      {/* ── Left Filter Panel ── */}
      {!sidebarCollapsed && (
        <aside className="precision-quotation__sidebar">
          <div className="precision-quotation__sidebar-title">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FiClock style={{ color: "#f43f5e", fontSize: 16 }} />
              <span>Tra Cứu Xóa Giá</span>
            </div>
            <span className="badge" style={{ background: "#fff1f2", color: "#e11d48", borderColor: "#fecdd3" }}>
              AUDIT
            </span>
          </div>

          <div className="precision-quotation__filter-fields">
            <div className="precision-quotation__field-group">
              <label>Từ ngày</label>
              <input
                type="date"
                value={fromdate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="precision-quotation__field-group">
              <label>Tới ngày</label>
              <input
                type="date"
                value={todate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="precision-quotation__field-group">
              <label>Code KD</label>
              <input
                type="text"
                placeholder="GH63-..."
                value={codeKD}
                onChange={(e) => setCodeKD(e.target.value)}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>

            <div className="precision-quotation__field-group">
              <label>Code ERP</label>
              <input
                type="text"
                placeholder="Mã ERP..."
                value={codeCMS}
                onChange={(e) => setCodeCMS(e.target.value)}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>

            <div className="precision-quotation__field-group">
              <label>Tên Liệu</label>
              <input
                type="text"
                placeholder="Tên liệu..."
                value={m_name}
                onChange={(e) => setMName(e.target.value)}
              />
            </div>

            <div className="precision-quotation__field-group">
              <label>Tên khách hàng</label>
              <input
                type="text"
                placeholder="Tên đối tác..."
                value={cust_name}
                onChange={(e) => setCustName(e.target.value)}
              />
            </div>

            <div className="precision-quotation__checkbox-row">
              <span>All Time (Tất cả)</span>
              <input
                type="checkbox"
                checked={alltime}
                onChange={(e) => setAllTime(e.target.checked)}
              />
            </div>
          </div>

          <button
            className="precision-quotation__cmd-btn precision-quotation__cmd-btn--blue"
            style={{ marginTop: 8, height: 32 }}
            onClick={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadDeletedPriceHistory)}
          >
            <FiSearch />
            <span>TRA CỨU KIỂM TOÁN</span>
          </button>

          <div className="precision-quotation__sidebar-footer">
            <div className="row">
              <span>Kiểm toán:</span>
              <span className="active-dot">
                <span /> Active
              </span>
            </div>
            <div className="row">
              <span>Lưu vết:</span>
              <span style={{ fontWeight: 700, color: "#e11d48" }}>90 ngày gần nhất</span>
            </div>
          </div>
        </aside>
      )}

      {/* ── Right Content & AGTable Surface ── */}
      <div className="precision-quotation__content">
        <div className="precision-quotation__toolbar">
          <div className="precision-quotation__toolbar-left">
            <button
              className="precision-quotation__btn precision-quotation__btn--outline"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <FiEye />
              <span>Show/Hide</span>
            </button>
            <button
              className="precision-quotation__btn precision-quotation__btn--ex-excel"
              onClick={() => SaveExcel(rows, "Lich_Su_Xoa_Gia_Audit")}
            >
              <FiDownload />
              <span>EX1 (Excel)</span>
            </button>
            <button
              className="precision-quotation__btn precision-quotation__btn--ex-pivot"
              onClick={() => setShowPivot(true)}
            >
              <FiLayers />
              <span>PIVOT</span>
            </button>
          </div>

          <div className="precision-quotation__toolbar-right">
            <span style={{ fontSize: 11, color: "#e11d48", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f43f5e" }} />
              Chỉ lưu vết dữ liệu 90 ngày gần nhất
            </span>
          </div>
        </div>

        <div className="precision-quotation__grid-body">
          <AGTable
            showFilter={true}
            toolbar={<div />}
            columns={columnsDeletedHistory}
            data={rows}
            onSelectionChange={() => {}}
          />
        </div>
      </div>

      {/* ── Pivot Modal ── */}
      {showPivot && (
        <div className="precision-quotation__modal-overlay" onClick={() => setShowPivot(false)}>
          <div
            className="precision-quotation__modal-box precision-quotation__modal-box--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="precision-quotation__modal-header">
              <h4>
                <FiLayers /> Phân Tích Lịch Sử Xóa Giá (Pivot Grid)
              </h4>
              <button className="close-btn" onClick={() => setShowPivot(false)}>
                ✕
              </button>
            </div>
            <div className="precision-quotation__modal-body" style={{ padding: 6, height: "calc(100% - 85px)" }}>
              <PivotTable datasource={createPivotDataSource(rows)} tableID="pivotDeleteHistory" />
            </div>
            <div className="precision-quotation__modal-footer">
              <button
                className="precision-quotation__btn precision-quotation__btn--outline"
                onClick={() => setShowPivot(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationDeleteHistory;

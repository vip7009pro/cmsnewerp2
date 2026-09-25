// CODE_MANAGER.tsx - Master Controller Quản Lý Thông Tin Sản Phẩm (Google Stitch High-Density Enterprise)

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { createPivotDataSource } from "../../../components/PivotChart/lazyPivot";
import PivotTable from "../../../components/PivotChart/LazyPivotTable";
import AGTable from "../../../components/DataTable/AGTable";
import { generalQuery, uploadQuery } from "../../../api/Api";
import { checkBP } from "../../../api/services/permissionService";
import { SaveExcel } from "../../../api/services/excelService";
import { f_updateLossKT } from "../../../api/services/inventoryService";
import {
  f_getCodeInfo,
  f_handleSaveLossSX,
  f_handleSaveQLSX,
  f_pdBanVe,
  f_resetBanVe,
  f_setNgoaiQuan,
  f_updateBEP,
} from "../../qlsx/QLSXPLAN/utils/khsxUtils";
import { UserData } from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CODE_FULL_INFO } from "../interfaces/rndInterface";
import { FiX } from "react-icons/fi";

// Subcomponents & Styles
import "./PrecisionCodeManager/PrecisionCodeManager.scss";
import PrecisionCodeManagerHeader from "./PrecisionCodeManager/PrecisionCodeManagerHeader";
import PrecisionCodeManagerKpi from "./PrecisionCodeManager/PrecisionCodeManagerKpi";
import PrecisionCodeManagerToolbar from "./PrecisionCodeManager/PrecisionCodeManagerToolbar";
import { getCodeManagerColumns } from "./PrecisionCodeManager/PrecisionCodeManagerColumns";

const CODE_MANAGER: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Responsive viewport state
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Filter states
  const [activeOnly, setActiveOnly] = useState(true);
  const [cndb, setCNDB] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [selectedProdType, setSelectedProdType] = useState("ALL");

  // Grid Data states
  const [rows, setRows] = useState<CODE_FULL_INFO[]>([]);
  const [selectedRows, setSelectedRows] = useState<CODE_FULL_INFO[]>([]);
  const [enableEdit, setEnableEdit] = useState(false);
  const [showPivotModal, setShowPivotModal] = useState(false);

  // 1. Tra cứu thông tin sản phẩm
  const handleCODEINFO = useCallback(async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tải dữ liệu sản phẩm, vui lòng chờ...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    try {
      const kq = await f_getCodeInfo({
        G_NAME: codeCMS.trim(),
        CNDB: cndb,
        ACTIVE_ONLY: activeOnly,
      });
      setRows(kq || []);
      Swal.fire("Thông báo", `Đã tải thành công ${kq?.length || 0} sản phẩm`, "success");
    } catch (err: any) {
      Swal.fire("Thông báo", "Lỗi tải dữ liệu: " + err.message, "error");
    }
  }, [codeCMS, cndb, activeOnly]);

  // 2. Danh sách phân loại sản phẩm (PROD_TYPE List)
  const prodTypeList = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.PROD_TYPE?.trim()) set.add(r.PROD_TYPE.trim());
    });
    return Array.from(set).sort();
  }, [rows]);

  // 3. Lọc dữ liệu theo PROD_TYPE
  const filteredRows = useMemo(() => {
    if (selectedProdType === "ALL") return rows;
    return rows.filter((r) => r.PROD_TYPE?.trim() === selectedProdType);
  }, [rows, selectedProdType]);

  // 4. Upload bản vẽ PDF
  const handleUploadBanVe = useCallback(
    (file: File, row: CODE_FULL_INFO) => {
      checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
        Swal.fire({ title: "Đang tải file...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
          const response = await uploadQuery(file, `${row.G_CODE}.pdf`, "banve");
          if (response.data.tk_status !== "NG") {
            const updRes = await generalQuery("update_banve_value", {
              G_CODE: row.G_CODE,
              banvevalue: "Y",
            });
            if (updRes.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Upload bản vẽ thành công", "success");
              setRows((prev) =>
                prev.map((item) => (item.G_CODE === row.G_CODE ? { ...item, BANVE: "Y" } : item))
              );
            } else {
              Swal.fire("Thông báo", "Cập nhật dữ liệu bản vẽ thất bại", "error");
            }
          } else {
            Swal.fire("Thông báo", "Upload file thất bại: " + response.data.message, "error");
          }
        } catch (err: any) {
          Swal.fire("Thông báo", "Lỗi upload: " + err.message, "error");
        }
      });
    },
    [userData]
  );

  // 5. Upload AppSheet docx
  const handleUploadAppSheet = useCallback(
    (file: File, row: CODE_FULL_INFO) => {
      checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
        Swal.fire({ title: "Đang tải file...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
          const response = await uploadQuery(file, `Appsheet_${row.G_CODE}.docx`, "appsheet");
          if (response.data.tk_status !== "NG") {
            const updRes = await generalQuery("update_appsheet_value", {
              G_CODE: row.G_CODE,
              appsheetvalue: "Y",
            });
            if (updRes.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Upload Appsheet thành công", "success");
              setRows((prev) =>
                prev.map((item) => (item.G_CODE === row.G_CODE ? { ...item, APPSHEET: "Y" } : item))
              );
            } else {
              Swal.fire("Thông báo", "Cập nhật dữ liệu Appsheet thất bại", "error");
            }
          } else {
            Swal.fire("Thông báo", "Upload file thất bại: " + response.data.message, "error");
          }
        } catch (err: any) {
          Swal.fire("Thông báo", "Lỗi upload: " + err.message, "error");
        }
      });
    },
    [userData]
  );

  // 6. Cấu hình cột AG-Grid
  const gridColumns = useMemo(
    () =>
      getCodeManagerColumns({
        enableEdit,
        onUploadBanVe: handleUploadBanVe,
        onUploadAppSheet: handleUploadAppSheet,
      }),
    [enableEdit, handleUploadBanVe, handleUploadAppSheet]
  );

  // 7. Xuất Excel
  const handleExportEX1 = useCallback(() => {
    if (filteredRows.length > 0) {
      SaveExcel(filteredRows, "Product_Master_Filtered");
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất", "warning");
    }
  }, [filteredRows]);

  const handleExportEX2 = useCallback(() => {
    if (rows.length > 0) {
      SaveExcel(rows, "Product_Master_All");
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất", "warning");
    }
  }, [rows]);

  // 8. Cấu hình Pivot Grid DataSource
  // ⚠️ DevExtreme chỉ được nạp khi user mở pivot (xem components/PivotChart/lazyPivot.ts).
  const [pivotDataSource, setPivotDataSource] = useState<any>(null);
  useEffect(() => {
    if (!showPivotModal) return; // chưa mở pivot -> không tải DevExtreme
    let cancelled = false;
    void (async () => {
      const ds = await createPivotDataSource({
        fields: [
          { caption: "PROD_TYPE", width: 120, dataField: "PROD_TYPE", area: "row" },
          { caption: "PROD_MODEL", width: 140, dataField: "PROD_MODEL", area: "row" },
          { caption: "PACKING_TYPE", width: 110, dataField: "PACKING_TYPE", area: "column" },
          {
            caption: "SỐ LƯỢNG MÃ",
            dataField: "G_CODE",
            summaryType: "count",
            area: "data",
          },
        ],
        store: filteredRows,
      });
      if (!cancelled) setPivotDataSource(ds);
    })();
    return () => {
      cancelled = true;
    };
  }, [showPivotModal, filteredRows]);

  return (
    <div className={`precision-code-manager ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. SUB-HEADER BANNER (CHỈ RENDER TRÊN DESKTOP) */}
      {!isMobile && <PrecisionCodeManagerHeader onRefresh={handleCODEINFO} />}

      {/* 2. REALTIME KPI METRICS BAR (CHỈ RENDER TRÊN DESKTOP) */}
      {!isMobile && <PrecisionCodeManagerKpi data={rows} />}

      {/* 3. COLOR-CODED ACTION TOOLBAR */}
      <PrecisionCodeManagerToolbar
        isMobile={isMobile}
        codeCMS={codeCMS}
        setCodeCMS={setCodeCMS}
        activeOnly={activeOnly}
        setActiveOnly={setActiveOnly}
        cndb={cndb}
        setCNDB={setCNDB}
        selectedProdType={selectedProdType}
        onProdTypeChange={setSelectedProdType}
        prodTypeList={prodTypeList}
        enableEdit={enableEdit}
        onToggleEnableEdit={() => setEnableEdit(!enableEdit)}
        onSearchCode={handleCODEINFO}
        onExportEX1={handleExportEX1}
        onExportEX2={handleExportEX2}
        onOpenPivot={() => setShowPivotModal(true)}
        onSaveExcel={() => SaveExcel(rows, "Code Info Table")}
        onSetNgoaiQuan={(isNoInspection) => f_setNgoaiQuan(selectedRows, isNoInspection)}
        onResetBanVe={() => f_resetBanVe(selectedRows, "N")}
        onPdBanVe={() => f_pdBanVe(selectedRows, "Y")}
        onSaveQLSX={() => f_handleSaveQLSX(selectedRows)}
        onSaveLossSX={() => f_handleSaveLossSX(selectedRows)}
        onUpdateBEP={() => f_updateBEP(selectedRows)}
        onUpdateLossKT={() => f_updateLossKT(selectedRows)}
        selectedCount={selectedRows.length}
        filteredCount={filteredRows.length}
        totalCount={rows.length}
      />

      {/* 4. HIGH-DENSITY AG-GRID WORKSPACE */}
      <div className="precision-code-manager__gridContainer">
        <AGTable
          columns={gridColumns}
          data={filteredRows}
          showFilter={true}
          onSelectionChange={(params: any) => {
            setSelectedRows(params?.api?.getSelectedRows() || []);
          }}
        />
      </div>

      {/* 5. MODAL PIVOT GRID */}
      {showPivotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setShowPivotModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              width: "95vw",
              height: "90vh",
              maxWidth: "98vw",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.25)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #6b21a8, #7c3aed)",
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                <span>Phân Tích Pivot Danh Mục Sản Phẩm</span>
              </div>
              <button
                type="button"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  color: "#ffffff",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setShowPivotModal(false)}
              >
                <FiX size={16} />
              </button>
            </div>
            <div style={{ padding: "12px", height: "calc(100% - 50px)", overflow: "auto" }}>
              {pivotDataSource ? (
                <PivotTable datasource={pivotDataSource} tableID="ProductMasterPivot" />
              ) : (
                <div className="pivot-loading">Đang tải bảng pivot…</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CODE_MANAGER;
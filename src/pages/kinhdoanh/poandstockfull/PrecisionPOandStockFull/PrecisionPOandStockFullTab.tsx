import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import * as XLSX from "xlsx";
import { FiRefreshCw, FiMaximize2, FiColumns, FiX } from "react-icons/fi";
import { generalQuery, getAuditMode, getCompany } from "../../../../api/Api";
import {
  f_updateBTP_M100,
  f_updateTONKIEM_M100,
} from "../../../../api/services/inventoryService";
import AGTable from "../../../../components/DataTable/AGTable";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { POFullCMS, POFullSummary } from "../../interfaces/kdInterface";

import PrecisionPOandStockFullKpi from "./PrecisionPOandStockFullKpi";
import PrecisionPOandStockFullToolbar from "./PrecisionPOandStockFullToolbar";
import {
  getColumnsCodeCMS,
  getColumnsCodeKD,
  getColumnsCodePVN,
} from "./PrecisionPOandStockFullColumns";
import "./PrecisionPOandStockFull.scss";

interface PrecisionPOandStockFullTabProps {
  onTotalRowsChange?: (count: number) => void;
}

const PrecisionPOandStockFullTab: React.FC<PrecisionPOandStockFullTabProps> = ({
  onTotalRowsChange,
}) => {
  const isCMS = getCompany() === "CMS";

  // State quản lý
  const [pofullSummary, setPOFullSummary] = useState<POFullSummary>({
    PO_BALANCE: 0,
    TP: 0,
    BTP: 0,
    CK: 0,
    CNK: 0,
    BLOCK: 0,
    TONG_TON: 0,
    THUATHIEU: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [codeCMS, setCodeCMS] = useState<string>("");
  const [alltime, setAllTime] = useState<boolean>(true);
  const [pofulldatatable, setPOFULLDataTable] = useState<Array<POFullCMS>>([]);
  const [showPivot, setShowPivot] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState<string>(moment().format("HH:mm:ss"));

  // Ref lưu dòng chọn
  const selectedRowsRef = useRef<any[]>([]);

  // Columns AG Grid ban đầu
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(
    isCMS ? getColumnsCodeCMS() : getColumnsCodePVN()
  );

  // Digital clock realtime
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(moment().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Tra cứu theo G_CODE
  const handletraPOFullCMS = useCallback(async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang nạp và đối soát dữ liệu PO & Tồn Kho...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });

    try {
      await f_updateBTP_M100();
      await f_updateTONKIEM_M100();
      setIsLoading(true);

      setColumnDefinition(isCMS ? getColumnsCodeCMS() : getColumnsCodePVN());

      const res = await generalQuery(
        isCMS ? "traPOFullCMS_New" : "traPOFullCMS2",
        {
          allcode: alltime,
          codeSearch: codeCMS,
        }
      );

      if (res.data.tk_status !== "NG") {
        const temp_summary: POFullSummary = {
          PO_BALANCE: 0,
          TP: 0,
          BTP: 0,
          CK: 0,
          CNK: 0,
          BLOCK: 0,
          TONG_TON: 0,
          THUATHIEU: 0,
        };

        const auditMode = getAuditMode();
        const loadeddata: POFullCMS[] = res.data.data.map(
          (element: POFullCMS, index: number) => {
            temp_summary.PO_BALANCE += element.PO_BALANCE || 0;
            temp_summary.TP += element.TON_TP || 0;
            temp_summary.BTP += element.BTP || 0;
            temp_summary.CK += element.TONG_TON_KIEM || 0;
            temp_summary.CNK += element.WAIT_INPUT_WH || 0;
            temp_summary.BLOCK += element.BLOCK_QTY || 0;
            temp_summary.TONG_TON += element.GRAND_TOTAL_STOCK || 0;
            temp_summary.THUATHIEU +=
              element.THUA_THIEU < 0 ? element.THUA_THIEU : 0;

            const isCNDB = element?.G_NAME?.includes("CNDB");
            const isCNDBKD = element?.G_NAME_KD?.includes("CNDB");

            return {
              ...element,
              G_NAME:
                auditMode === 0
                  ? element?.G_NAME
                  : !isCNDB
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                auditMode === 0
                  ? element?.G_NAME_KD
                  : !isCNDBKD
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              id: index,
            };
          }
        );

        setPOFullSummary(temp_summary);
        setPOFULLDataTable(loadeddata);
        onTotalRowsChange?.(loadeddata.length);
        setIsLoading(false);

        Swal.fire({
          title: "Thành công",
          text: `Đã nạp thành công ${loadeddata.length.toLocaleString()} dòng dữ liệu`,
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        setIsLoading(false);
        Swal.fire("Thông báo", "Nội dung: " + res.data.message, "error");
      }
    } catch (error: any) {
      setIsLoading(false);
      Swal.fire("Lỗi", error?.message || "Lỗi khi truy vấn dữ liệu", "error");
    }
  }, [alltime, codeCMS, isCMS, onTotalRowsChange]);

  // 2. Tra cứu theo Tên Kinh Doanh (G_NAME_KD)
  const handletraPOFullKD = useCallback(async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang nạp dữ liệu theo mã kinh doanh...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });

    try {
      await f_updateBTP_M100();
      await f_updateTONKIEM_M100();
      setIsLoading(true);

      setColumnDefinition(getColumnsCodeKD());

      const res = await generalQuery(
        isCMS ? "traPOFullKD_NEW" : "traPOFullKD2",
        {
          allcode: alltime,
          codeSearch: codeCMS,
        }
      );

      if (res.data.tk_status !== "NG") {
        const temp_summary: POFullSummary = {
          PO_BALANCE: 0,
          TP: 0,
          BTP: 0,
          CK: 0,
          CNK: 0,
          BLOCK: 0,
          TONG_TON: 0,
          THUATHIEU: 0,
        };

        const auditMode = getAuditMode();
        const loadeddata: POFullCMS[] = res.data.data.map(
          (element: POFullCMS, index: number) => {
            temp_summary.PO_BALANCE += element.PO_BALANCE || 0;
            temp_summary.TP += element.TON_TP || 0;
            temp_summary.BTP += element.BTP || 0;
            temp_summary.CK += element.TONG_TON_KIEM || 0;
            temp_summary.CNK += element.WAIT_INPUT_WH || 0;
            temp_summary.BLOCK += element.BLOCK_QTY || 0;
            temp_summary.TONG_TON += element.GRAND_TOTAL_STOCK || 0;
            temp_summary.THUATHIEU +=
              element.THUA_THIEU < 0 ? element.THUA_THIEU : 0;

            const isCNDB = element?.G_NAME?.includes("CNDB");
            const isCNDBKD = element?.G_NAME_KD?.includes("CNDB");

            return {
              ...element,
              G_NAME:
                auditMode === 0
                  ? element?.G_NAME
                  : !isCNDB
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                auditMode === 0
                  ? element?.G_NAME_KD
                  : !isCNDBKD
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              id: index,
            };
          }
        );

        setPOFullSummary(temp_summary);
        setPOFULLDataTable(loadeddata);
        onTotalRowsChange?.(loadeddata.length);
        setIsLoading(false);

        Swal.fire({
          title: "Thành công",
          text: `Đã nạp thành công ${loadeddata.length.toLocaleString()} dòng dữ liệu (KD)`,
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        setIsLoading(false);
        Swal.fire("Thông báo", "Nội dung: " + res.data.message, "error");
      }
    } catch (error: any) {
      setIsLoading(false);
      Swal.fire("Lỗi", error?.message || "Lỗi khi truy vấn dữ liệu", "error");
    }
  }, [alltime, codeCMS, isCMS, onTotalRowsChange]);

  // Xuất file Excel
  const exportExcel = (data: any[], fileName: string) => {
    if (!data || data.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PO_TK_FULL");
    XLSX.writeFile(wb, `${fileName}_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  const handleExportEX1 = useCallback(() => {
    const dataToExport =
      selectedRowsRef.current.length > 0
        ? selectedRowsRef.current
        : pofulldatatable;
    exportExcel(dataToExport, "PO_TK_FULL_HienThi");
  }, [pofulldatatable]);

  const handleExportEX2 = useCallback(() => {
    exportExcel(pofulldatatable, "PO_TK_FULL_RawData");
  }, [pofulldatatable]);

  // Pivot Table Datasource
  const pvdts = useMemo(() => {
    if (pofulldatatable.length === 0) return null;
    const keys = Object.keys(pofulldatatable[0] || {});
    const fields = keys.map((key) => ({
      caption: key,
      width: 100,
      dataField: key,
      allowSorting: true,
      allowFiltering: true,
      summaryType: typeof (pofulldatatable[0] as any)[key] === "number" ? "sum" : "count",
    }));

    return new PivotGridDataSource({
      fields,
      store: pofulldatatable,
    });
  }, [pofulldatatable]);

  // Row selection handler
  const handleSelectionChange = useCallback((params: any) => {
    const selected = params?.api?.getSelectedRows() || [];
    selectedRowsRef.current = selected;
  }, []);

  // Tính tỷ lệ đáp ứng tồn kho
  const responseRate = useMemo(() => {
    if (pofullSummary.PO_BALANCE <= 0) return "0.00%";
    const rate = (pofullSummary.TONG_TON / pofullSummary.PO_BALANCE) * 100;
    return `${rate.toFixed(2)}%`;
  }, [pofullSummary.PO_BALANCE, pofullSummary.TONG_TON]);

  return (
    <div className="precision-po-stock">
      {/* 1. Sub-nav Header Utility Bar */}
      <div className="precision-po-stock__subnav">
        <div className="subnav-left">
          <button type="button" className="subnav-tab-btn active">
            <span className="pulse-dot" />
            <span>PO+TK FULL</span>
            <span className="badge-count">
              {pofulldatatable.length.toLocaleString()}
            </span>
          </button>
        </div>

        <div className="subnav-right">
          <div className="live-timer-box">
            <FiRefreshCw size={13} className="timer-icon" />
            <span>Cập nhật tồn tức thời:</span>
            <span className="timer-val">{liveTime}</span>
          </div>

          <button
            type="button"
            className="btn-icon-util"
            onClick={handletraPOFullCMS}
            title="Làm mới dữ liệu theo G_CODE"
          >
            <FiRefreshCw size={14} />
          </button>

          <button
            type="button"
            className="btn-icon-util"
            title="Chuyển chế độ hiển thị cột"
            onClick={() =>
              setColumnDefinition((prev) =>
                prev === columnDefinition ? getColumnsCodeCMS() : columnDefinition
              )
            }
          >
            <FiColumns size={14} />
          </button>

          <button
            type="button"
            className="btn-icon-util"
            title="Toàn màn hình"
            onClick={() => {
              const el = document.querySelector(".precision-po-stock");
              if (el) {
                if (!document.fullscreenElement) {
                  el.requestFullscreen?.();
                } else {
                  document.exitFullscreen?.();
                }
              }
            }}
          >
            <FiMaximize2 size={14} />
          </button>
        </div>
      </div>

      {/* 2. Action Search & Filter Toolbar */}
      <PrecisionPOandStockFullToolbar
        code={codeCMS}
        onChangeCode={setCodeCMS}
        onlyPoBalance={alltime}
        onToggleOnlyPoBalance={() => setAllTime((prev) => !prev)}
        onSearchGCode={handletraPOFullCMS}
        onSearchKD={handletraPOFullKD}
        onExportEX1={handleExportEX1}
        onExportEX2={handleExportEX2}
        onTogglePivot={() => setShowPivot(true)}
        poBalance={pofullSummary.PO_BALANCE}
        totalStock={pofullSummary.TONG_TON}
        responseRate={responseRate}
        isLoading={isLoading}
      />

      {/* 3. Industrial KPI Summary Strip (8 Tiles) */}
      <PrecisionPOandStockFullKpi summary={pofullSummary} />

      {/* 4. AG Grid Workspace Table */}
      <div className="precision-po-stock__tableWrap">
        <AGTable
          data={pofulldatatable}
          columns={columnDefinition}
          showFilter={true}
          toolbar={null}
          suppressRowClickSelection={false}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* 5. Pivot Table Modal Popup */}
      {showPivot && pvdts && (
        <div className="precision-po-stock__pivotModal">
          <div className="pivot-modal-card">
            <div className="pivot-modal-header">
              <h3>Phân Tích Đa Chiều PO & Tồn Kho (Pivot Grid)</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowPivot(false)}
                title="Đóng cửa sổ"
              >
                <FiX size={15} />
              </button>
            </div>
            <div className="pivot-modal-body">
              <PivotTable datasource={pvdts} tableID="pivot_po_stock_full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionPOandStockFullTab);

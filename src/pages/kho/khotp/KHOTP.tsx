// KHOTP.tsx - Master Controller Kho Thành Phẩm (Google Stitch High-Density Enterprise)

import React, { useState, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { AiFillCloseCircle } from "react-icons/ai";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../components/PivotChart/PivotChart";
import AGTable from "../../../components/DataTable/AGTable";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import { SaveExcel } from "../../../api/services/excelService";
import { f_updateBTP_M100 } from "../../../api/services/inventoryService";
import {
  TONKIEMGOP_CMS,
  TONKIEMGOP_KD,
  TONKIEMTACH,
  WH_IN_OUT,
  XUATPACK_DATA,
} from "../interfaces/khoInterface";

// Styles & Sub-modules
import "./PrecisionKHOTP/PrecisionKHOTP.scss";
import PrecisionKHOTPFilterPanel from "./PrecisionKHOTP/PrecisionKHOTPFilterPanel";
import PrecisionKHOTPToolbar from "./PrecisionKHOTP/PrecisionKHOTPToolbar";
import PrecisionKHOTPKpi from "./PrecisionKHOTP/PrecisionKHOTPKpi";
import {
  column_WH_IN_OUT,
  column_XUATPACK,
  column_STOCK_CMS,
  column_STOCK_KD,
  column_STOCK_TACH,
} from "./PrecisionKHOTP/PrecisionKHOTPColumns";

const KHOTP: React.FC = () => {
  // Filter States
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [cust_name, setCustName] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [capbu, setCapBu] = useState(false);
  const [justbalancecode, setJustBalanceCode] = useState(true);
  const [buttonselected, setbuttonselected] = useState("GR");

  // Data & Table States
  const [whdatatable, setWhDataTable] = useState<Array<any>>([]);
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_WH_IN_OUT);
  const [showFilter, setShowFilter] = useState(true);
  const [showPivotModal, setShowPivotModal] = useState(false);

  // Helper hiển thị Swal Loading
  const showLoading = (title: string = "Tra data", text: string = "Đang tra data, vui lòng chờ...") => {
    Swal.fire({
      title,
      text,
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  };

  // 1. Nghiệp vụ: Nhập / Xuất Kho (IN / OUT)
  const handletraWHInOut = useCallback(
    (in_out: string) => {
      showLoading("Tra cứu dữ liệu", in_out === "IN" ? "Đang tải dữ liệu Nhập Kho..." : "Đang tải dữ liệu Xuất Kho...");
      generalQuery("trakhotpInOut", {
        G_CODE: codeCMS.trim(),
        G_NAME: codeKD.trim(),
        ALLTIME: alltime,
        JUSTBALANCE: justbalancecode,
        CUST_NAME: cust_name.trim(),
        FROM_DATE: fromdate,
        TO_DATE: todate,
        INOUT: in_out,
        CAPBU: capbu,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const loadeddata: WH_IN_OUT[] = response.data.data.map(
              (element: WH_IN_OUT, index: number) => ({
                ...element,
                G_NAME:
                  getAuditMode() === 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search("CNDB") === -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
                G_NAME_KD:
                  getAuditMode() === 0
                    ? element?.G_NAME_KD
                    : element?.G_NAME?.search("CNDB") === -1
                    ? element?.G_NAME_KD
                    : "TEM_NOI_BO",
                IO_Date: moment.utc(element.IO_Date).format("YYYY-MM-DD"),
                INPUT_DATETIME: moment
                  .utc(element.INPUT_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              })
            );
            setWhDataTable(loadeddata);
            setColumnDefinition(column_WH_IN_OUT);
            Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
          } else {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => console.log(error));
    },
    [alltime, fromdate, todate, cust_name, codeCMS, codeKD, justbalancecode, capbu]
  );

  // 2. Nghiệp vụ: Xuất Pack
  const handletraXuatPack = useCallback(() => {
    showLoading("Tra cứu dữ liệu", "Đang tải dữ liệu Xuất Pack...");
    generalQuery("xuatpackkhotp", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME_KD: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CAPBU: capbu,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: XUATPACK_DATA[] = response.data.data.map(
            (element: XUATPACK_DATA, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() === 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              OUT_DATE: moment.utc(element.OUT_DATE).format("YYYY-MM-DD"),
              OUT_DATETIME: moment
                .utc(element.OUT_DATETIME.slice(0, element.OUT_DATETIME.length - 2))
                .format("YYYY-MM-DD HH:mm:ss"),
              SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
              EXP_DATE: moment.utc(element.EXP_DATE).format("YYYY-MM-DD"),
              id: index,
            })
          );
          setWhDataTable(loadeddata);
          setColumnDefinition(column_XUATPACK);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [alltime, fromdate, todate, cust_name, codeCMS, codeKD, justbalancecode, capbu]);

  // 3. Nghiệp vụ: Tồn theo G_CODE (CMS)
  const handletraWHSTOCKCMS = useCallback(async () => {
    showLoading("Tra cứu tồn kho", "Đang cập nhật tồn BTP và tải dữ liệu tồn theo G_CODE...");
    await f_updateBTP_M100();
    await generalQuery(getCompany() === "CMS" ? "traSTOCKCMS_NEW" : "traSTOCKCMS", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONKIEMGOP_CMS[] = response.data.data.map(
            (element: TONKIEMGOP_CMS, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() === 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              id: index,
            })
          );
          setWhDataTable(loadeddata);
          setColumnDefinition(column_STOCK_CMS);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [codeCMS, codeKD, alltime, justbalancecode, cust_name, fromdate, todate]);

  // 4. Nghiệp vụ: Tồn theo Code KD
  const handletraWHSTOCKKD = useCallback(async () => {
    showLoading("Tra cứu tồn kho", "Đang cập nhật tồn BTP và tải dữ liệu tồn theo Code KD...");
    await f_updateBTP_M100();
    await generalQuery(getCompany() === "CMS" ? "traSTOCKKD_NEW" : "traSTOCKKD", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONKIEMGOP_KD[] = response.data.data.map(
            (element: TONKIEMGOP_KD, index: number) => ({
              ...element,
              G_NAME_KD:
                getAuditMode() === 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME_KD?.search("CNDB") === -1
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              id: index,
            })
          );
          setWhDataTable(loadeddata);
          setColumnDefinition(column_STOCK_KD);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [codeCMS, codeKD, alltime, justbalancecode, cust_name, fromdate, todate]);

  // 5. Nghiệp vụ: Tồn theo vị trí kho (Tách)
  const handletraWHSTOCKTACH = useCallback(() => {
    showLoading("Tra cứu tồn kho", "Đang tải dữ liệu tồn theo vị trí kho...");
    generalQuery("traSTOCKTACH", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONKIEMTACH[] = response.data.data.map(
            (element: TONKIEMTACH, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() === 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              KHO_NAME: element.KHO_NAME === "NM1" ? "SK1" : element.KHO_NAME === "NM3" ? "SK3" : element.KHO_NAME,
              id: index,
            })
          );
          setWhDataTable(loadeddata);
          setColumnDefinition(column_STOCK_TACH);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [codeCMS, codeKD, alltime, justbalancecode, cust_name, fromdate, todate]);

  // Hàm điều phối Load dữ liệu theo mode
  const handleExecuteQuery = useCallback(
    (mode: string = buttonselected) => {
      switch (mode) {
        case "GR":
          handletraWHInOut("IN");
          break;
        case "GI":
          handletraWHInOut("OUT");
          break;
        case "GI_PACK":
          handletraXuatPack();
          break;
        case "STOCKG_CODE":
          handletraWHSTOCKCMS();
          break;
        case "STOCKG_NAME_KD":
          handletraWHSTOCKKD();
          break;
        case "STOCKG_TACH":
          handletraWHSTOCKTACH();
          break;
        default:
          handletraWHInOut("IN");
      }
    },
    [buttonselected, handletraWHInOut, handletraXuatPack, handletraWHSTOCKCMS, handletraWHSTOCKKD, handletraWHSTOCKTACH]
  );

  // Xử lý chuyển nhanh chế độ xem trên Toolbar
  const handleQuickModeChange = useCallback(
    (newMode: string) => {
      setbuttonselected(newMode);
      handleExecuteQuery(newMode);
    },
    [handleExecuteQuery]
  );

  // Xử lý Reset bộ lọc
  const handleResetFilters = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setCodeKD("");
    setCodeCMS("");
    setCustName("");
    setAllTime(false);
    setCapBu(false);
    setJustBalanceCode(true);
  }, []);

  // Xử lý Xuất Excel
  const handleExportEX1 = useCallback(() => {
    if (whdatatable.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(whdatatable, `KHOTP_${buttonselected}_EX1`);
  }, [whdatatable, buttonselected]);

  const handleExportEX2 = useCallback(() => {
    if (whdatatable.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(whdatatable, `KHOTP_${buttonselected}_EX2_RAW`);
  }, [whdatatable, buttonselected]);

  // AGTable Component
  const warehouseDataTableAG = useMemo(() => {
    return (
      <AGTable
        showFilter={showFilter}
        columns={columnDefinition}
        data={whdatatable}
      />
    );
  }, [whdatatable, columnDefinition, showFilter]);

  // Pivot DataSource
  const pivotDataSource = useMemo(() => {
    return new PivotGridDataSource({
      store: whdatatable,
    });
  }, [whdatatable]);

  return (
    <div className="precision-khotp">
      {/* 1. Sidebar Bộ Lọc Tra Cứu */}
      <PrecisionKHOTPFilterPanel
        buttonselected={buttonselected}
        setbuttonselected={setbuttonselected}
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        codeKD={codeKD}
        setCodeKD={setCodeKD}
        codeCMS={codeCMS}
        setCodeCMS={setCodeCMS}
        cust_name={cust_name}
        setCustName={setCustName}
        alltime={alltime}
        setAllTime={setAllTime}
        capbu={capbu}
        setCapBu={setCapBu}
        justbalancecode={justbalancecode}
        setJustBalanceCode={setJustBalanceCode}
        onReset={handleResetFilters}
        onLoadData={() => handleExecuteQuery(buttonselected)}
      />

      {/* 2. Workspace Bảng Dữ Liệu AG Grid */}
      <main className="precision-khotp__workspace">
        {/* Dải 4 Thẻ KPI Summary Realtime */}
        <PrecisionKHOTPKpi data={whdatatable} mode={buttonselected} />

        {/* Action Toolbar */}
        <PrecisionKHOTPToolbar
          totalColumns={columnDefinition.length}
          currentMode={buttonselected}
          onModeChange={handleQuickModeChange}
          onExportEX1={handleExportEX1}
          onExportEX2={handleExportEX2}
          onPivotClick={() => setShowPivotModal(true)}
          onToggleFilter={() => setShowFilter(!showFilter)}
        />

        {/* Khung Bảng AG Table Full-Height (Sử dụng footer chuẩn AGTable) */}
        <div className="precision-khotp__tableContainer">
          {warehouseDataTableAG}
        </div>
      </main>

      {/* 3. Modal Phân Tích Pivot Table */}
      {showPivotModal && (
        <div className="precision-khotp__pivotBackdrop">
          <div className="precision-khotp__pivotDialog">
            <div className="precision-khotp__pivotHeader">
              <span>BẢNG PHÂN TÍCH XOAY ĐA CHIỀU (PIVOT GRID) - KHO THÀNH PHẨM</span>
              <button
                type="button"
                onClick={() => setShowPivotModal(false)}
                title="Đóng bảng Pivot"
              >
                <AiFillCloseCircle color="#dc2626" size={14} />
                <span>Đóng</span>
              </button>
            </div>
            <div className="precision-khotp__pivotContent">
              <PivotTable datasource={pivotDataSource} tableID="khotppivot" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(KHOTP);

// INSPECTION.tsx - Master Controller Phòng Kiểm Tra / Data Kiểm Tra (Google Stitch High-Density)

import React, { useState, useMemo, useCallback, useEffect } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { AiFillCloseCircle } from "react-icons/ai";
import { createPivotDataSource } from "../../../components/PivotChart/lazyPivot";
import PivotTable from "../../../components/PivotChart/LazyPivotTable";
import AGTable from "../../../components/DataTable/AGTable";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { SaveExcel } from "../../../api/services/excelService";
import { f_updateTONKIEM_M100 } from "../../../api/services/inventoryService";
import {
  f_loadKHKT_ADUNG,
  f_loadTemLotKTHistory,
  f_updateTrueDiemKiemTra,
} from "../utils/qcUtils";
import {
  CHO_KIEM_DATA,
  INSPECT_INOUT_YCSX,
  INSPECT_INPUT_DATA,
  INSPECT_NG_DATA,
  INSPECT_OUTPUT_DATA,
  INSPECT_PATROL,
} from "../interfaces/qcInterface";

// Styles & Sub-modules
import "./PrecisionINSPECTION/PrecisionINSPECTION.scss";
import PrecisionINSPECTIONFilterPanel from "./PrecisionINSPECTION/PrecisionINSPECTIONFilterPanel";
import PrecisionINSPECTIONToolbar from "./PrecisionINSPECTION/PrecisionINSPECTIONToolbar";
import {
  column_inspect_input,
  column_inspect_output,
  column_inspect_inoutycsx,
  column_inspection_NG,
  column_inspect_balance,
  column_inspect_patrol,
  column_khkt,
  column_lothistory,
} from "./PrecisionINSPECTION/PrecisionINSPECTIONColumns";
import {
  fieldsinputkiem,
  fieldsoutputkiem,
  fieldsinoutputkiem,
  fieldsnhatkykiem,
  fieldsinspectbalance,
  fieldsinspectionpatrol,
} from "./PrecisionINSPECTION/PrecisionINSPECTIONPivotFields";

const INSPECTION: React.FC = () => {
  // Filter States
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCustName] = useState("");
  const [process_lot_no, setProcess_Lot_No] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");

  // Data & View States
  const [activeAction, setActiveAction] = useState<string>("nhapkiem");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]);
  const [sumaryINSPECT, setSummaryInspect] = useState("");
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_inspect_input);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  // ⚠️ DevExtreme chỉ được nạp khi user mở pivot (xem components/PivotChart/lazyPivot.ts):
  // `pivotConfig` chỉ là object cấu hình, DataSource thật được dựng khi bấm PIVOT.
  const [selectedDataSource, setSelectedDataSource] = useState<any>(null);
  const [pivotConfig, setPivotConfig] = useState<any>({
    fields: fieldsinputkiem,
    store: inspectiondatatable,
  });
  useEffect(() => {
    if (!showhidePivotTable) return; // chưa mở pivot -> không tải DevExtreme
    let cancelled = false;
    void createPivotDataSource(pivotConfig).then((ds) => {
      if (!cancelled) setSelectedDataSource(ds);
    });
    return () => {
      cancelled = true;
    };
  }, [showhidePivotTable, pivotConfig]);

  // Helper hiển thị Swal Loading
  const showLoading = () => {
    Swal.fire({
      title: "Đang tải dữ liệu",
      text: "Hệ thống đang xử lý, vui lòng chờ...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  };

  // 1. Nghiệp vụ: Nhập Kiểm (LOT)
  const handletraInspectionInput = useCallback(() => {
    showLoading();
    let summaryInput = 0;
    generalQuery("get_inspection", {
      OPTIONS: "Nhập Kiểm (LOT)",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_INPUT_DATA[] = response.data.data.map(
            (element: INSPECT_INPUT_DATA, index: number) => {
              summaryInput += element.INPUT_QTY_EA;
              return {
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
                PROD_DATETIME: moment.utc(element.PROD_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
                INPUT_DATETIME: moment.utc(element.INPUT_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setSummaryInspect("Tổng Nhập: " + summaryInput.toLocaleString("en-US") + " EA");
          setInspectionDataTable(loadeddata);
          // Chỉ lưu cấu hình — DevExtreme dựng khi user mở pivot (xem lazyPivot.ts).
          setPivotConfig({
            fields: fieldsinputkiem,
            store: loadeddata,
          });
          setColumnDefinition(column_inspect_input);
          setActiveAction("nhapkiem");
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno]);

  // 2. Nghiệp vụ: Xuất Kiểm (LOT)
  const handletraInspectionOutput = useCallback(() => {
    showLoading();
    let summaryOutput = 0;
    generalQuery("get_inspection", {
      OPTIONS: "Xuất Kiểm (LOT)",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_OUTPUT_DATA[] = response.data.data.map(
            (element: INSPECT_OUTPUT_DATA, index: number) => {
              summaryOutput += element.OUTPUT_QTY_EA;
              return {
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
                PROD_DATETIME: moment.utc(element.PROD_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
                OUTPUT_DATETIME: moment.utc(element.OUTPUT_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
                NGAY_LAM_VIEC: element.NGAY_LAM_VIEC?.slice(0, 10),
                id: index,
              };
            }
          );
          setSummaryInspect("Tổng Xuất: " + summaryOutput.toLocaleString("en-US") + " EA");
          setInspectionDataTable(loadeddata);
          // Chỉ lưu cấu hình — DevExtreme dựng khi user mở pivot (xem lazyPivot.ts).
          setPivotConfig({
            fields: fieldsoutputkiem,
            store: loadeddata,
          });
          setColumnDefinition(column_inspect_output);
          setActiveAction("xuatkiem");
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno]);

  // 3. Nghiệp vụ: Nhập Xuất Kiểm (YCSX)
  const handletraInspectionInOut = useCallback(() => {
    showLoading();
    setSummaryInspect("");
    generalQuery("get_inspection", {
      OPTIONS: "Nhập Xuất Kiểm (YCSX)",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_INOUT_YCSX[] = response.data.data.map(
            (element: INSPECT_INOUT_YCSX, index: number) => ({
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
          setInspectionDataTable(loadeddata);
          // Chỉ lưu cấu hình — DevExtreme dựng khi user mở pivot (xem lazyPivot.ts).
          setPivotConfig({
            fields: fieldsinoutputkiem,
            store: loadeddata,
          });
          setColumnDefinition(column_inspect_inoutycsx);
          setActiveAction("nhapxuat");
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno]);

  // 4. Nghiệp vụ: Nhật Ký Kiểm Tra (NG)
  const handletraInspectionNG = useCallback(() => {
    showLoading();
    setSummaryInspect("");
    generalQuery("get_inspection", {
      OPTIONS: "Nhật Ký Kiểm Tra",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_NG_DATA[] = response.data.data.map(
            (element: INSPECT_NG_DATA, index: number) => ({
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
              INSPECT_DATETIME: moment.utc(element.INSPECT_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
              INSPECT_START_TIME: moment.utc(element.INSPECT_START_TIME).format("YYYY-MM-DD HH:mm:ss"),
              INSPECT_FINISH_TIME: moment.utc(element.INSPECT_FINISH_TIME).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setInspectionDataTable(loadeddata);
          // Chỉ lưu cấu hình — DevExtreme dựng khi user mở pivot (xem lazyPivot.ts).
          setPivotConfig({
            fields: fieldsnhatkykiem,
            store: loadeddata,
          });
          setColumnDefinition(column_inspection_NG);
          setActiveAction("nhatky");
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno]);

  // 5. Nghiệp vụ: Chờ Kiểm (Gộp)
  const handleLoadChoKiem = useCallback(async () => {
    showLoading();
    setSummaryInspect("");
    await f_updateTONKIEM_M100();
    generalQuery("loadChoKiemGop_NEW", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: CHO_KIEM_DATA[] = response.data.data.map(
            (element: CHO_KIEM_DATA, index: number) => ({
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
          setInspectionDataTable(loadeddata);
          // Chỉ lưu cấu hình — DevExtreme dựng khi user mở pivot (xem lazyPivot.ts).
          setPivotConfig({
            fields: fieldsinspectbalance,
            store: loadeddata,
          });
          setColumnDefinition(column_inspect_balance);
          setActiveAction("chokiem");
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          setInspectionDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno]);

  // 6. Nghiệp vụ: Data Patrol
  const handleGetInspectionPatrol = useCallback(() => {
    showLoading();
    setSummaryInspect("");
    generalQuery("loadInspectionPatrol", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_PATROL[] = response.data.data.map(
            (element: INSPECT_PATROL, index: number) => ({
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
          setInspectionDataTable(loadeddata);
          // Chỉ lưu cấu hình — DevExtreme dựng khi user mở pivot (xem lazyPivot.ts).
          setPivotConfig({
            fields: fieldsinspectionpatrol,
            store: loadeddata,
          });
          setColumnDefinition(column_inspect_patrol);
          setActiveAction("patrol");
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          setInspectionDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno]);

  // 7. Nghiệp vụ: KHKT (Kế Hoạch Kiểm Tra)
  const handleGetInspectionPlan = useCallback(async () => {
    showLoading();
    setSummaryInspect("");
    const res = await f_loadKHKT_ADUNG(fromdate);
    setInspectionDataTable(res);
    setColumnDefinition(column_khkt);
    setActiveAction("khkt");
    Swal.close();
  }, [fromdate]);

  // 8. Nghiệp vụ: TEM LOT HISTORY
  const handleGetTemLotHistory = useCallback(async () => {
    showLoading();
    setSummaryInspect("");
    const res = await f_loadTemLotKTHistory(fromdate, todate);
    setInspectionDataTable(res);
    setColumnDefinition(column_lothistory);
    setActiveAction("lothistory");
    Swal.close();
  }, [fromdate, todate]);

  // Xử lý Reset bộ lọc
  const handleResetFilters = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setCodeKD("");
    setCodeCMS("");
    setEmpl_Name("");
    setCustName("");
    setProdType("");
    setProdRequestNo("");
    setProcess_Lot_No("");
    setID("");
    setAllTime(false);
  }, []);

  // Xử lý Xuất Excel
  const handleExportEX1 = useCallback(() => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(inspectiondatatable, `Inspection_${activeAction.toUpperCase()}_EX1`);
  }, [inspectiondatatable, activeAction]);

  const handleExportEX2 = useCallback(() => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(inspectiondatatable, `Inspection_${activeAction.toUpperCase()}_EX2_RAW`);
  }, [inspectiondatatable, activeAction]);

  // AGTable Component
  const inspectionDataTableAG = useMemo(() => {
    return (
      <AGTable
        showFilter={showFilter}
        columns={columnDefinition}
        data={inspectiondatatable}
        onCellEditingStopped={async (e: any) => {
          if (e.column.colId === "TRU_DIEM") {
            await f_updateTrueDiemKiemTra(e.data);
          }
        }}
      />
    );
  }, [inspectiondatatable, columnDefinition, showFilter]);

  return (
    <div className="precision-ins">
      {/* 1. Sidebar Bộ Lọc & Cụm Nút Nghiệp Vụ */}
      <PrecisionINSPECTIONFilterPanel
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        codeKD={codeKD}
        setCodeKD={setCodeKD}
        codeCMS={codeCMS}
        setCodeCMS={setCodeCMS}
        empl_name={empl_name}
        setEmpl_Name={setEmpl_Name}
        cust_name={cust_name}
        setCustName={setCustName}
        prod_type={prod_type}
        setProdType={setProdType}
        prodrequestno={prodrequestno}
        setProdRequestNo={setProdRequestNo}
        process_lot_no={process_lot_no}
        setProcess_Lot_No={setProcess_Lot_No}
        id={id}
        setID={setID}
        alltime={alltime}
        setAllTime={setAllTime}
        onReset={handleResetFilters}
        activeAction={activeAction}
        onActionNhapKiem={handletraInspectionInput}
        onActionXuatKiem={handletraInspectionOutput}
        onActionNhapXuat={handletraInspectionInOut}
        onActionNhatKy={handletraInspectionNG}
        onActionChoKiem={handleLoadChoKiem}
        onActionPatrol={handleGetInspectionPatrol}
        onActionKHKT={handleGetInspectionPlan}
        onActionLotHistory={handleGetTemLotHistory}
      />

      {/* 2. Workspace Bảng Dữ Liệu AG Grid */}
      <section className="precision-ins__workspace" data-purpose="ag-grid-workspace">
        {/* Top Action Toolbar */}
        <PrecisionINSPECTIONToolbar
          totalColumns={columnDefinition.length}
          summaryText={sumaryINSPECT}
          onPivotClick={() => setShowHidePivotTable(true)}
          onExportEX1={handleExportEX1}
          onExportEX2={handleExportEX2}
          onToggleFilter={() => setShowFilter(!showFilter)}
        />

        {/* Khung Bảng AG Table Full-Height */}
        <div className="precision-ins__tableContainer" id="table-scroll-container">
          {inspectionDataTableAG}
        </div>
      </section>

      {/* 3. Modal Phân Tích Pivot Table */}
      {showhidePivotTable && (
        <div className="precision-ins__pivotBackdrop">
          <div className="precision-ins__pivotDialog">
            <div className="precision-ins__pivotHeader">
              <span>BẢNG PHÂN TÍCH XOAY ĐA CHIỀU (PIVOT GRID)</span>
              <button
                type="button"
                onClick={() => setShowHidePivotTable(false)}
                title="Đóng bảng Pivot"
              >
                <AiFillCloseCircle color="#dc2626" size={14} />
                <span>Đóng</span>
              </button>
            </div>
            <div className="precision-ins__pivotContent">
              <PivotTable
                datasource={selectedDataSource}
                tableID="inspectiontablepivot"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(INSPECTION);
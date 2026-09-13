// KHOLIEU.tsx - Master Controller Kho Liệu (Google Stitch High-Density Enterprise)

import React, { useState, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { FiX } from "react-icons/fi";
import { MdInput, MdOutput } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../components/PivotChart/PivotChart";
import AGTable from "../../../components/DataTable/AGTable";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import { checkBP } from "../../../api/services/permissionService";
import { SaveExcel } from "../../../api/services/excelService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { NHAPLIEUDATA, TONLIEUDATA, XUATLIEUDATA } from "../interfaces/khoInterface";
import NHAPLIEU from "./nhaplieu/NHAPLIEU";
import XUATLIEU from "./xuatlieu/XUATLIEU";

// Sub-components & Styles
import "./PrecisionKHOLIEU/PrecisionKHOLIEU.scss";
import {
  column_NHAPLIEUDATA,
  column_XUATLIEUDATA,
  column_STOCK_LIEU,
} from "./PrecisionKHOLIEU/PrecisionKHOLIEUColumns";
import PrecisionKHOLIEUKpi from "./PrecisionKHOLIEU/PrecisionKHOLIEUKpi";
import PrecisionKHOLIEUFilterPanel from "./PrecisionKHOLIEU/PrecisionKHOLIEUFilterPanel";
import PrecisionKHOLIEUToolbar from "./PrecisionKHOLIEU/PrecisionKHOLIEUToolbar";

const KHOLIEU: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Filter States
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [codeKD, setCodeKD] = useState("");
  const [prod_request_no, setProd_Request_No] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [lotncc, setLOTNCC] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [justbalancecode, setJustBalanceCode] = useState(true);
  const [in_nhanh, setInNhanh] = useState(false);

  // View Mode: "NHAP" | "XUAT" | "TON"
  const [mode, setMode] = useState<"NHAP" | "XUAT" | "TON">("XUAT");
  const [whdatatable, setWhDataTable] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);

  // UI Toggles
  const [showFilter, setShowFilter] = useState(true);
  const [shownhaplieu, setShowNhapLieu] = useState(false);
  const [showxuatlieu, setShowXuatLieu] = useState(false);
  const [showPivotModal, setShowPivotModal] = useState(false);

  // Loading Helper
  const showLoading = (title: string = "Tra data", text: string = "Đang tải dữ liệu, vui lòng chờ...") => {
    Swal.fire({
      title,
      text,
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  };

  // 1. Nghiệp vụ: Tra Data Nhập Liệu
  const handletra_inputlieu = useCallback(() => {
    showLoading("Tra cứu dữ liệu", "Đang tải dữ liệu Data Nhập...");
    const roll_no_array = rollNo.trim().split("-");
    generalQuery("tranhaplieu", {
      M_NAME: m_name,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      ROLL_NO_START: roll_no_array.length === 2 ? roll_no_array[0] : "",
      ROLL_NO_STOP: roll_no_array.length === 2 ? roll_no_array[1] : "",
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: NHAPLIEUDATA[] = response.data.data.map(
            (element: NHAPLIEUDATA, index: number) => ({
              ...element,
              id: index,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              QC_PASS_DATE:
                element.QC_PASS_DATE !== null
                  ? moment.utc(element.QC_PASS_DATE).format("YYYY-MM-DD HH:mm:ss")
                  : "",
              EXP_DATE:
                element.EXP_DATE !== null
                  ? moment.utc(element.EXP_DATE).format("YYYY-MM-DD")
                  : "",
            })
          );
          setWhDataTable(loadeddata);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [m_name, fromdate, todate, rollNo]);

  // 2. Nghiệp vụ: Tra Data Xuất Liệu
  const handletra_outputlieu = useCallback(() => {
    showLoading("Tra cứu dữ liệu", "Đang tải dữ liệu Data Xuất...");
    generalQuery("traxuatlieu", {
      G_NAME: codeKD,
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      PROD_REQUEST_NO: prod_request_no,
      M_NAME: m_name,
      M_CODE: m_code,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PLAN_ID: plan_id,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: XUATLIEUDATA[] = response.data.data.map(
            (element: XUATLIEUDATA, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") === -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
              id: index,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            })
          );
          setWhDataTable(loadeddata);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [codeKD, alltime, justbalancecode, prod_request_no, m_name, m_code, fromdate, todate, plan_id, in_nhanh]);

  // 3. Nghiệp vụ: Tra Tồn Liệu
  const handletraWHSTOCKLIEU = useCallback(() => {
    showLoading("Tra cứu tồn kho", "Đang tải dữ liệu Tồn Kho Liệu...");
    generalQuery("tratonlieu", {
      M_CODE: m_code,
      M_NAME: m_name,
      JUSTBALANCE: justbalancecode,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONLIEUDATA[] = response.data.data.map(
            (element: TONLIEUDATA, index: number) => ({
              ...element,
              id: index,
            })
          );
          setWhDataTable(loadeddata);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  }, [m_code, m_name, justbalancecode]);

  // Điều phối Query theo Mode
  const handleExecuteQuery = useCallback(
    (targetMode: "NHAP" | "XUAT" | "TON" = mode) => {
      if (targetMode === "NHAP") {
        handletra_inputlieu();
      } else if (targetMode === "XUAT") {
        handletra_outputlieu();
      } else if (targetMode === "TON") {
        handletraWHSTOCKLIEU();
      }
    },
    [mode, handletra_inputlieu, handletra_outputlieu, handletraWHSTOCKLIEU]
  );

  // Chuyển Mode nhanh từ Sidebar
  const handleModeChange = useCallback(
    (newMode: "NHAP" | "XUAT" | "TON") => {
      setMode(newMode);
      handleExecuteQuery(newMode);
    },
    [handleExecuteQuery]
  );

  // Nghiệp vụ: Update LOT NCC
  const handleUpdateLotNCC = useCallback(() => {
    if (!lotncc.trim()) {
      Swal.fire("Thông báo", "Vui lòng nhập LOT NCC", "warning");
      return;
    }
    if (selectedRows.length === 0) {
      Swal.fire("Thông báo", "Xin hãy chọn ít nhất một dòng trong bảng", "warning");
      return;
    }

    const runUpdate = async () => {
      let err_code = "";
      for (let i = 0; i < selectedRows.length; i++) {
        try {
          const response = await generalQuery("updatelieuncc", {
            M_LOT_NO: selectedRows[i].M_LOT_NO,
            LOTNCC: lotncc.trim(),
          });
          if (response.data.tk_status === "NG") {
            err_code += `Có lỗi: ${response.data.message} | `;
          }
        } catch (err: any) {
          err_code += `Lỗi mạng | `;
        }
      }

      if (err_code === "") {
        Swal.fire("Thông báo", "Update LOT NCC thành công", "success");
        handleExecuteQuery();
      } else {
        Swal.fire("Thông báo", "Update LOT NCC thất bại: " + err_code, "error");
      }
    };

    if (userData?.SUBDEPTNAME === "IQC") {
      checkBP(userData, ["QC", "KHO"], ["ALL"], ["ALL"], runUpdate);
    } else {
      Swal.fire("Thông báo", "Bạn không phải người IQC", "error");
    }
  }, [lotncc, selectedRows, userData, handleExecuteQuery]);

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setM_Name("");
    setM_Code("");
    setCodeKD("");
    setProd_Request_No("");
    setPlanID("");
    setRollNo("");
    setLOTNCC("");
    setAllTime(false);
    setJustBalanceCode(true);
    setInNhanh(false);
  }, []);

  // Xác định cấu hình cột hiển thị theo Mode
  const activeColumns = useMemo(() => {
    if (mode === "NHAP") return column_NHAPLIEUDATA;
    if (mode === "TON") return column_STOCK_LIEU;
    return column_XUATLIEUDATA;
  }, [mode]);

  // Xuất Excel EX1 & EX2
  const handleExportEX1 = useCallback(() => {
    if (whdatatable.length > 0) {
      SaveExcel(whdatatable, `KHOLIEU_${mode}_FILTERED`);
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
    }
  }, [whdatatable, mode]);

  const handleExportEX2 = useCallback(() => {
    if (whdatatable.length > 0) {
      SaveExcel(whdatatable, `KHOLIEU_${mode}_RAW`);
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
    }
  }, [whdatatable, mode]);

  // Cấu hình Pivot Grid DataSource
  const pivotDataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: [
        { caption: "M_CODE", width: 100, dataField: "M_CODE", area: "row" },
        { caption: "M_NAME", width: 150, dataField: "M_NAME", area: "row" },
        { caption: "LOTNCC", width: 100, dataField: "LOTNCC", area: "column" },
        {
          caption: "SỐ LƯỢNG",
          dataField: mode === "XUAT" ? "TOTAL_OUT_QTY" : mode === "NHAP" ? "TOTAL_IN_QTY" : "TOTAL_OK",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
          area: "data",
        },
      ],
      store: whdatatable,
    });
  }, [whdatatable, mode]);

  return (
    <div className="precision-kholieu">
      {/* 1. SIDEBAR BỘ LỌC */}
      <PrecisionKHOLIEUFilterPanel
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        m_name={m_name}
        setM_Name={setM_Name}
        m_code={m_code}
        setM_Code={setM_Code}
        codeKD={codeKD}
        setCodeKD={setCodeKD}
        prod_request_no={prod_request_no}
        setProd_Request_No={setProd_Request_No}
        plan_id={plan_id}
        setPlanID={setPlanID}
        rollNo={rollNo}
        setRollNo={setRollNo}
        lotncc={lotncc}
        setLOTNCC={setLOTNCC}
        alltime={alltime}
        setAllTime={setAllTime}
        justbalancecode={justbalancecode}
        setJustBalanceCode={setJustBalanceCode}
        in_nhanh={in_nhanh}
        setInNhanh={setInNhanh}
        isPVN={getCompany() === "PVN"}
        mode={mode}
        onModeChange={handleModeChange}
        onLoadData={() => handleExecuteQuery()}
        onUpdateLotNCC={handleUpdateLotNCC}
        onResetFilters={handleResetFilters}
      />

      {/* 2. WORKSPACE DỮ LIỆU CHÍNH */}
      <div className="precision-kholieu__workspace">
        {/* Realtime KPI Bar */}
        <PrecisionKHOLIEUKpi data={whdatatable} mode={mode} />

        {/* Data Grid Container */}
        <div className="precision-kholieu__gridContainer">
          {/* Action Toolbar */}
          <PrecisionKHOLIEUToolbar
            onOpenNhapLieu={() => {
              checkBP(userData, ["KHO"], ["ALL"], ["ALL"], () => {
                setShowNhapLieu(true);
                setShowXuatLieu(false);
              });
            }}
            onOpenXuatLieu={() => {
              checkBP(userData, ["KHO"], ["ALL"], ["ALL"], () => {
                setShowNhapLieu(false);
                setShowXuatLieu(true);
              });
            }}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={() => setShowPivotModal(true)}
            filteredCount={whdatatable.length}
            totalCount={whdatatable.length}
            showFilter={showFilter}
            onToggleFilter={() => setShowFilter(!showFilter)}
          />

          {/* AG-Grid Table Body (Không prop toolbar, không footer thừa) */}
          <div className="precision-kholieu__gridBody">
            <AGTable
              columns={activeColumns}
              data={whdatatable}
              showFilter={showFilter}
              onSelectionChange={(params: any) => {
                setSelectedRows(params.api.getSelectedRows());
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. MODAL NHẬP LIỆU */}
      {shownhaplieu && (
        <div className="precision-kholieu__modalOverlay" onClick={() => setShowNhapLieu(false)}>
          <div className="precision-kholieu__modalDialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header--nhap">
              <div className="modal-title">
                <MdInput size={18} />
                <span>Nhập Vật Liệu Vào Kho</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowNhapLieu(false)}
                title="Đóng cửa sổ"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="modal-body">
              <NHAPLIEU />
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL XUẤT LIỆU */}
      {showxuatlieu && (
        <div className="precision-kholieu__modalOverlay" onClick={() => setShowXuatLieu(false)}>
          <div className="precision-kholieu__modalDialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header--xuat">
              <div className="modal-title">
                <MdOutput size={18} />
                <span>Xuất Vật Liệu Ra Sản Xuất</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowXuatLieu(false)}
                title="Đóng cửa sổ"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="modal-body">
              <XUATLIEU />
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL PIVOT GRID */}
      {showPivotModal && (
        <div className="precision-kholieu__modalOverlay" onClick={() => setShowPivotModal(false)}>
          <div
            className="precision-kholieu__modalDialog"
            style={{ width: "95vw", height: "90vh", maxWidth: "98vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #6b21a8, #7c3aed)", color: "#ffffff" }}>
              <div className="modal-title">
                <span>Phân Tích Pivot Kho Liệu ({mode})</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPivotModal(false)}
                title="Đóng bảng Pivot"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ height: "calc(100% - 50px)" }}>
              <PivotTable datasource={pivotDataSource} tableID={""} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KHOLIEU;

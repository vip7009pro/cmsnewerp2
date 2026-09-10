import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import {
  FiX, FiUploadCloud, FiFileText, FiCheckCircle,
  FiEdit3, FiRefreshCw, FiCheck, FiInfo,
  FiCalendar, FiBarChart2, FiDownload,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { generalQuery, getSocket, getUserData } from "../../../../api/Api";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import AGTable from "../../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { CodeListData, CustomerListData } from "../../interfaces/kdInterface";
import { f_getcodelist, f_getcustomerlist } from "../../utils/kdUtils";
import { FCST_EXCEL_COLUMNS } from "./PrecisionFCSTColumns";
import "./PrecisionFCST.scss";

interface Props {
  open: boolean;
  onClose: () => void;
}

const WEEK_FIELDS = Array.from({ length: 22 }, (_, i) => `W${i + 1}`);

const FALLBACK_CUSTOMERS: CustomerListData[] = [
  { CUST_CD: "0025", CUST_NAME_KD: "SEVT", CUST_NAME: "SAMSUNG ELECTRONICS VIETNAM THAI NGUYEN" },
  { CUST_CD: "0002", CUST_NAME_KD: "MOBIS", CUST_NAME: "HYUNDAI MOBIS VIETNAM" },
  { CUST_CD: "0003", CUST_NAME_KD: "DONGKWANG", CUST_NAME: "DONGKWANG CL CO., LTD" },
  { CUST_CD: "0007", CUST_NAME_KD: "SEV", CUST_NAME: "SAMSUNG ELECTRONICS VIETNAM (BAC NINH)" },
];

const FALLBACK_CODES: CodeListData[] = [
  { G_CODE: "7C09353A", G_NAME: "GH63-23259A_A_SM-5741B", G_NAME_KD: "GH63-23259A", USE_YN: "Y", PROD_LAST_PRICE: 0 },
  { G_CODE: "7C09019B", G_NAME: "S029-00673B_B_Tab S10 FE", G_NAME_KD: "S029-00673B", USE_YN: "Y", PROD_LAST_PRICE: 0 },
];

const filterCustomerOptions = createFilterOptions<CustomerListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CustomerListData) => `${opt.CUST_CD || ""} ${opt.CUST_NAME_KD || ""} ${opt.CUST_NAME || ""}`,
});

const filterCodeOptions = createFilterOptions<CodeListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CodeListData) => `${opt.G_CODE || ""} ${opt.G_NAME_KD || ""} ${opt.G_NAME || ""}`,
});

const PrecisionFCSTAddModal: React.FC<Props> = ({ open, onClose }) => {
  const userData = useSelector((state: RootState) => state.totalSlice.userData);
  const [activeMode, setActiveMode] = useState<"manual" | "excel">("manual");

  /* ── Master Data ── */
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);

  /* ── Manual Mode State ── */
  const [selectedCust, setSelectedCust] = useState<CustomerListData | null>(null);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>(null);
  const [fcstYear, setFcstYear] = useState<string>(new Date().getFullYear().toString());
  const [fcstWeekNo, setFcstWeekNo] = useState<string>("");
  const [prodPrice, setProdPrice] = useState<string>("0");
  const [remark, setRemark] = useState<string>("");
  const [wValues, setWValues] = useState<{ [key: string]: number }>(() =>
    Object.fromEntries(WEEK_FIELDS.map((f) => [f, 0]))
  );

  /* ── Excel Mode State ── */
  const [uploadExcelJson, setUploadExcelJSon] = useState<any[]>([]);
  const [trigger, setTrigger] = useState(true);
  const [isLoading, setisLoading] = useState(false);

  /* ── Load Master Data ── */
  useEffect(() => {
    if (open) {
      if (customerList.length === 0) {
        f_getcustomerlist()
          .then((res: any) => {
            if (Array.isArray(res) && res.length > 0) setCustomerList(res);
          })
          .catch(console.error);
      }
      if (codeList.length === 0) {
        f_getcodelist("")
          .then((res: any) => {
            if (Array.isArray(res) && res.length > 0) setCodeList(res);
          })
          .catch(console.error);
      }
    }
  }, [open, customerList.length, codeList.length]);

  const effectiveCustomers = useMemo(
    () => (customerList.length > 0 ? customerList : FALLBACK_CUSTOMERS),
    [customerList]
  );

  const effectiveCodes = useMemo(
    () => (codeList.length > 0 ? codeList : FALLBACK_CODES),
    [codeList]
  );

  const sumW = useMemo(
    () => WEEK_FIELDS.reduce((acc, f) => acc + (Number(wValues[f]) || 0), 0),
    [wValues]
  );

  const updateW = useCallback((field: string, val: number) => {
    setWValues((prev) => ({ ...prev, [field]: val }));
  }, []);

  const handleReset = () => {
    setSelectedCust(null);
    setSelectedCode(null);
    setFcstYear(new Date().getFullYear().toString());
    setFcstWeekNo("");
    setProdPrice("0");
    setRemark("");
    setWValues(Object.fromEntries(WEEK_FIELDS.map((f) => [f, 0])));
    setUploadExcelJSon([]);
  };

  /* ── Manual Save ── */
  const handleManualSave = async () => {
    if (!selectedCust) {
      Swal.fire("Thông báo", "Vui lòng chọn khách hàng (CUST_CD)", "warning");
      return;
    }
    if (!selectedCode) {
      Swal.fire("Thông báo", "Vui lòng chọn sản phẩm (G_CODE)", "warning");
      return;
    }
    if (!fcstYear || !fcstWeekNo) {
      Swal.fire("Thông báo", "Vui lòng nhập Năm và Tuần FCST", "warning");
      return;
    }

    const gCode = selectedCode.G_CODE;
    const custCd = selectedCust.CUST_CD || selectedCust.CUST_NAME_KD;

    let err = 0;
    await generalQuery("checkFcstExist", {
      FCSTYEAR: fcstYear,
      FCSTWEEKNO: fcstWeekNo,
      G_CODE: gCode,
      CUST_CD: custCd,
    })
      .then((r) => { if (r.data.tk_status !== "NG") err = 1; })
      .catch(console.log);

    await generalQuery("checkGCodeVer", { G_CODE: gCode })
      .then((r) => {
        if (r.data.tk_status !== "NG") {
          if (r.data.data[0].USE_YN !== "Y") err = 3;
        } else err = 4;
      })
      .catch(console.log);

    if (err === 1) { Swal.fire("Lỗi", "FCST đã tồn tại trên hệ thống", "error"); return; }
    if (err === 3) { Swal.fire("Lỗi", "Ver sản phẩm này đã bị khóa", "error"); return; }
    if (err === 4) { Swal.fire("Lỗi", "Không tìm thấy Code ERP này", "error"); return; }

    await generalQuery("insert_fcst", {
      EMPL_NO: userData?.EMPL_NO,
      CUST_CD: custCd,
      G_CODE: gCode,
      PROD_PRICE: Number(prodPrice) || 0,
      YEAR: fcstYear,
      WEEKNO: fcstWeekNo,
      ...Object.fromEntries(WEEK_FIELDS.map((f) => [f, Number(wValues[f]) || 0])),
    })
      .then((r) => {
        if (r.data.tk_status !== "NG") {
          Swal.fire("Thành công", "Đã thêm FCST thành công", "success");
          const notif: NotificationElement = {
            CTR_CD: "002", NOTI_ID: -1, NOTI_TYPE: "success",
            TITLE: "Thêm FCST mới",
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm forecast mới`,
            SUBDEPTNAME: "KD", MAINDEPTNAME: "KD",
            INS_EMPL: "NHU1903", INS_DATE: "2024-12-30",
            UPD_EMPL: "NHU1903", UPD_DATE: "2024-12-30",
          };
          f_insert_Notification_Data(notif).then((ok) => {
            if (ok) getSocket().emit("notification_panel", notif);
          });
          handleReset();
          onClose();
        } else {
          Swal.fire("Lỗi SQL", r.data.message, "error");
        }
      })
      .catch(console.log);
  };

  /* ── Excel Mode: Read File ── */
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        const data = ev.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        setUploadExcelJSon(
          json.map((element: any, index: number) => ({
            ...element,
            id: index,
            CHECKSTATUS: "Waiting",
            ...Object.fromEntries(
              WEEK_FIELDS.map((f) => [f, element[f] === undefined || element[f] === "" ? 0 : element[f]])
            ),
          }))
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  /* ── Excel Mode: Check FCST ── */
  const handle_checkFcstHangLoat = async () => {
    setisLoading(true);
    let tempjson = [...uploadExcelJson];
    for (let i = 0; i < tempjson.length; i++) {
      let err_code = 0;
      await generalQuery("checkFcstExist", {
        FCSTYEAR: tempjson[i].YEAR,
        FCSTWEEKNO: tempjson[i].WEEKNO,
        G_CODE: tempjson[i].G_CODE,
        CUST_CD: tempjson[i].CUST_CD,
      })
        .then((r) => { if (r.data.tk_status !== "NG") err_code = 1; })
        .catch(console.log);

      await generalQuery("checkGCodeVer", { G_CODE: tempjson[i].G_CODE })
        .then((r) => {
          if (r.data.tk_status !== "NG") {
            if (r.data.data[0].USE_YN !== "Y") err_code = 3;
          } else err_code = 4;
        })
        .catch(console.log);

      if (err_code === 0) tempjson[i].CHECKSTATUS = "OK";
      else if (err_code === 1) tempjson[i].CHECKSTATUS = "NG:FCST đã tồn tại";
      else if (err_code === 3) tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      else if (err_code === 4) tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check FCST hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
  };

  /* ── Excel Mode: Upload FCST ── */
  const handle_upFcstHangLoat = async () => {
    setisLoading(true);
    let tempjson = [...uploadExcelJson];
    for (let i = 0; i < tempjson.length; i++) {
      let err_code = 0;
      await generalQuery("checkFcstExist", {
        FCSTYEAR: tempjson[i].YEAR,
        FCSTWEEKNO: tempjson[i].WEEKNO,
        G_CODE: tempjson[i].G_CODE,
        CUST_CD: tempjson[i].CUST_CD,
      })
        .then((r) => { if (r.data.tk_status !== "NG") err_code = 1; })
        .catch(console.log);

      await generalQuery("checkGCodeVer", { G_CODE: tempjson[i].G_CODE })
        .then((r) => {
          if (r.data.tk_status !== "NG") {
            if (r.data.data[0].USE_YN !== "Y") err_code = 3;
          } else err_code = 4;
        })
        .catch(console.log);

      if (err_code === 0) {
        await generalQuery("insert_fcst", {
          EMPL_NO: tempjson[i].EMPL_NO,
          CUST_CD: tempjson[i].CUST_CD,
          G_CODE: tempjson[i].G_CODE,
          PROD_PRICE: tempjson[i].PROD_PRICE,
          YEAR: tempjson[i].YEAR,
          WEEKNO: tempjson[i].WEEKNO,
          ...Object.fromEntries(WEEK_FIELDS.map((f) => [f, tempjson[i][f]])),
        })
          .then((r) => {
            if (r.data.tk_status !== "NG") tempjson[i].CHECKSTATUS = "OK";
            else { err_code = 5; tempjson[i].CHECKSTATUS = "NG: Lỗi SQL: " + r.data.message; }
          })
          .catch(console.log);
      } else if (err_code === 1) tempjson[i].CHECKSTATUS = "NG:FCST đã tồn tại";
      else if (err_code === 3) tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      else if (err_code === 4) tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
    }
    setisLoading(false);

    const notif: NotificationElement = {
      CTR_CD: "002", NOTI_ID: -1, NOTI_TYPE: "success",
      TITLE: "Thêm FCST mới",
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm forecast mới`,
      SUBDEPTNAME: "KD", MAINDEPTNAME: "KD",
      INS_EMPL: "NHU1903", INS_DATE: "2024-12-30",
      UPD_EMPL: "NHU1903", UPD_DATE: "2024-12-30",
    };
    if (await f_insert_Notification_Data(notif)) {
      getSocket().emit("notification_panel", notif);
    }

    Swal.fire("Thông báo", "Đã hoàn thành thêm FCST hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };

  const confirmCheckFcst = () => {
    Swal.fire({
      title: "Chắc chắn muốn check FCST hàng loạt ?",
      text: "Sẽ bắt đầu check FCST hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check FCST hàng loạt", "success");
        handle_checkFcstHangLoat();
      }
    });
  };

  const confirmUpFcst = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm FCST hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm FCST hàng loạt", "success");
        handle_upFcstHangLoat();
      }
    });
  };

  /* ── Excel AGTable ── */
  const fcstDataAGTableExcel = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={<></>}
        columns={FCST_EXCEL_COLUMNS}
        data={uploadExcelJson}
        onCellEditingStopped={() => {}}
        onRowClick={() => {}}
        onSelectionChange={() => {}}
      />
    ),
    [uploadExcelJson, trigger]
  );

  if (!open) return null;

  return (
    <div className="precision-fcst__modalOverlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="precision-fcst__modal">
        {/* ── Modal Header ── */}
        <div className="precision-fcst__modalHeader">
          <div className="precision-fcst__modalHeaderLeft">
            <div className="precision-fcst__modalIcon">
              <FiBarChart2 />
            </div>
            <div>
              <h2 className="precision-fcst__modalTitle">
                <span>Thêm Kế Hoạch Dự Báo (FCST Entry)</span>
                <span className="precision-fcst__modalBadge">Khởi tạo hoặc tải dữ liệu hàng loạt</span>
              </h2>
            </div>
          </div>
          <button type="button" className="precision-fcst__modalClose" onClick={onClose} title="Đóng modal">
            <FiX />
          </button>
        </div>

        {/* ── Mode Tabs ── */}
        <div className="precision-fcst__modalModeTabs">
          <div className="precision-fcst__modalModeTabList">
            <button
              type="button"
              className={`precision-fcst__modalModeTab ${activeMode === "manual" ? "precision-fcst__modalModeTab--active" : ""}`}
              onClick={() => setActiveMode("manual")}
            >
              ✍️ Nhập Thủ Công (Direct Input)
            </button>
            <button
              type="button"
              className={`precision-fcst__modalModeTab ${activeMode === "excel" ? "precision-fcst__modalModeTab--active" : ""}`}
              onClick={() => setActiveMode("excel")}
            >
              📑 Import File Excel (Hàng Loạt)
            </button>
          </div>
          <div className="precision-fcst__modalSyncStatus">
            <span>Trạng thái kết nối:</span>
            <span className="dot" />
            <span className="status">ERP SYNC READY</span>
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className="precision-fcst__modalBody">
          {activeMode === "manual" ? (
            <>
              {/* Section 1: Master Metadata */}
              <div className="precision-fcst__sectionHeader">
                <div className="precision-fcst__sectionTitle">
                  <FiInfo />
                  <span>1. THÔNG TIN NHẬN DIỆN DỰ BÁO (MASTER METADATA)</span>
                </div>
                <span className="precision-fcst__sectionNote">* Các trường bắt buộc nhập để kiểm toán</span>
              </div>

              <div className="precision-fcst__formGrid">
                {/* Năm Dự Báo */}
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Năm Dự Báo (FCSTYEAR): *</label>
                  <input
                    className="precision-fcst__formInput"
                    type="number"
                    value={fcstYear}
                    onChange={(e) => setFcstYear(e.target.value)}
                  />
                </div>

                {/* Tuần Bắt Đầu */}
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Tuần Bắt Đầu (FCSTWEEKNO): *</label>
                  <input
                    className="precision-fcst__formInput"
                    type="text"
                    placeholder="W37"
                    value={fcstWeekNo}
                    onChange={(e) => setFcstWeekNo(e.target.value)}
                  />
                </div>

                {/* Mã ERP Sản Phẩm (G_CODE) */}
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Mã ERP Sản Phẩm (G_CODE): *</label>
                  <Autocomplete
                    size="small"
                    options={effectiveCodes}
                    value={selectedCode}
                    onChange={(_, v) => setSelectedCode(v)}
                    filterOptions={filterCodeOptions}
                    getOptionLabel={(o) => `${o.G_CODE} - ${o.G_NAME_KD}`}
                    renderOption={(props, o) => (
                      <li {...props} key={o.G_CODE} style={{ fontSize: 11, padding: "4px 8px" }}>
                        <b>{o.G_CODE}</b>&nbsp;—&nbsp;{o.G_NAME_KD}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Chọn G_CODE..." variant="outlined"
                        sx={{ "& .MuiInputBase-root": { height: 30, fontSize: 12 } }}
                      />
                    )}
                  />
                </div>

                {/* Khách hàng */}
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Khách Hàng (CUST_CD): *</label>
                  <Autocomplete
                    size="small"
                    options={effectiveCustomers}
                    value={selectedCust}
                    onChange={(_, v) => setSelectedCust(v)}
                    filterOptions={filterCustomerOptions}
                    getOptionLabel={(o) => `${o.CUST_CD} - ${o.CUST_NAME_KD}`}
                    renderOption={(props, o) => (
                      <li {...props} key={o.CUST_CD} style={{ fontSize: 11, padding: "4px 8px" }}>
                        <b>{o.CUST_CD}</b>&nbsp;—&nbsp;{o.CUST_NAME_KD}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Chọn khách hàng..." variant="outlined"
                        sx={{ "& .MuiInputBase-root": { height: 30, fontSize: 12 } }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Additional info row */}
              <div className="precision-fcst__formGrid">
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Mã KD (G_NAME_KD):</label>
                  <input className="precision-fcst__formInput precision-fcst__formInput--readonly" readOnly
                    value={selectedCode?.G_NAME_KD || ""} />
                </div>
                <div className="precision-fcst__formGroup precision-fcst__formGroup--span2">
                  <label className="precision-fcst__formLabel">Tên Sản Phẩm & Quy Cách (G_NAME):</label>
                  <input className="precision-fcst__formInput precision-fcst__formInput--readonly" readOnly
                    value={selectedCode?.G_NAME || ""} />
                </div>
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Đơn Giá (PROD_PRICE):</label>
                  <input className="precision-fcst__formInput" type="number" step="0.001"
                    value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} />
                </div>
              </div>

              {/* Section 2: Week Matrix W1-W22 */}
              <div className="precision-fcst__weekMatrix">
                <div className="precision-fcst__weekMatrixHeader">
                  <div className="precision-fcst__weekMatrixTitle">
                    <FiCalendar />
                    <span>2. MA TRẬN KẾ HOẠCH SỐ LƯỢNG THEO TUẦN (W1 ĐẾN W22 FORECAST MATRIX)</span>
                  </div>
                  <div className="precision-fcst__weekMatrixTotal">
                    <span>TỔNG FCST (SUM W1-W22):</span>
                    <strong>{sumW.toLocaleString("en-US")} EA</strong>
                  </div>
                </div>
                <div className="precision-fcst__weekMatrixNote">
                  * Điền số lượng sản phẩm dự báo cho 22 tuần chu kỳ kinh doanh kế tiếp (đơn vị tính: Chiếc / EA)
                </div>
                <div className="precision-fcst__weekGrid">
                  {WEEK_FIELDS.map((f) => (
                    <div key={f} className="precision-fcst__weekCell">
                      <span className="precision-fcst__weekLabel">{f}</span>
                      <input
                        className="precision-fcst__weekInput"
                        type="number"
                        value={wValues[f] || 0}
                        onChange={(e) => updateW(f, Number(e.target.value) || 0)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Remark Row */}
              <div className="precision-fcst__remarkRow">
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Ghi Chú & Điều Kiện (REMARK):</label>
                  <input className="precision-fcst__formInput" type="text"
                    placeholder="Nhập ghi chú đặc biệt cho kế hoạch dự báo sản xuất..."
                    value={remark} onChange={(e) => setRemark(e.target.value)} />
                </div>
                <div className="precision-fcst__formGroup">
                  <label className="precision-fcst__formLabel">Trạng thái (CHECKSTATUS):</label>
                  <span className="precision-fcst__statusBadge precision-fcst__statusBadge--ready">
                    <FiCheck /> SẴN SÀNG ĐỒNG BỘ
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* ── Excel Mode ── */
            <>
              <div className="precision-fcst__sectionHeader">
                <div className="precision-fcst__sectionTitle">
                  <FiUploadCloud />
                  <span>IMPORT FILE EXCEL HÀNG LOẠT</span>
                </div>
              </div>

              <div className="precision-fcst__excelUploadArea">
                <FiUploadCloud />
                <div className="precision-fcst__excelUploadText">
                  Chọn file Excel (.xlsx, .xls) để tải lên
                </div>
                <div className="precision-fcst__excelUploadSubtext">
                  Cấu trúc: EMPL_NO, CUST_CD, G_CODE, PROD_PRICE, YEAR, WEEKNO, W1-W22
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={readUploadFile}
                  style={{ marginTop: 8 }}
                />
              </div>

              {uploadExcelJson.length > 0 && (
                <>
                  <div className="precision-fcst__excelActions">
                    <button
                      type="button"
                      className="precision-fcst__actionBtn precision-fcst__actionBtn--primary"
                      onClick={confirmCheckFcst}
                      disabled={isLoading}
                    >
                      <FiCheckCircle />
                      <span>Check FCST</span>
                    </button>
                    <button
                      type="button"
                      className="precision-fcst__actionBtn precision-fcst__actionBtn--danger"
                      onClick={confirmUpFcst}
                      disabled={isLoading}
                    >
                      <FiUploadCloud />
                      <span>Up FCST</span>
                    </button>
                  </div>
                  <div className="precision-fcst__excelGrid">
                    {fcstDataAGTableExcel}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="precision-fcst__modalFooter">
          <span className="precision-fcst__modalSession">
            Phiên làm việc: USER_{userData?.EMPL_NO}_{new Date().toISOString().slice(0, 10).replace(/-/g, "")}
          </span>
          <div className="precision-fcst__modalFooterActions">
            <button type="button" className="precision-fcst__modalBtn precision-fcst__modalBtn--ghost" onClick={handleReset}>
              <FiRefreshCw /> Làm mới (Clear)
            </button>
            <button type="button" className="precision-fcst__modalBtn precision-fcst__modalBtn--ghost" onClick={onClose}>
              Đóng (Cancel)
            </button>
            {activeMode === "manual" && (
              <button type="button" className="precision-fcst__modalBtn precision-fcst__modalBtn--primary" onClick={handleManualSave}>
                <FiDownload /> Lưu Kế Hoạch FCST
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionFCSTAddModal);

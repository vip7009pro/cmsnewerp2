import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import {
  FiX, FiUploadCloud, FiFileText, FiCheckCircle,
  FiEdit3, FiRefreshCw, FiCheck, FiInfo,
  FiCalendar, FiBarChart2, FiFolder, FiDownload,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import moment from "moment";
import { generalQuery, getSocket, getUserData } from "../../../../api/Api";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import AGTable from "../../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { CodeListData, CustomerListData } from "../../interfaces/kdInterface";
import { f_getcodelist, f_getcustomerlist, renderCheckStatus } from "../../utils/kdUtils";
import "./PrecisionPlan.scss";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DAY_FIELDS = Array.from({ length: 15 }, (_, i) => `D${i + 1}`);

// Không dùng dữ liệu master hardcode: chỉ lấy từ API để tránh chọn khách/mã không tồn tại thật

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

const PrecisionPlanAddModal: React.FC<Props> = ({ open, onClose }) => {
  const userData = useSelector((state: RootState) => state.totalSlice.userData);
  const [activeMode, setActiveMode] = useState<"manual" | "excel">("manual");

  // Viewport mobile (≤768px) — rút gọn chữ trong header/info để modal không bị đẩy nội dung xuống
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  /* ── Master Data State ── */
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);

  /* ── Manual Mode State: CUST_CD, G_CODE, PLAN_DATE, D1..D15, REMARK ── */
  const [selectedCust, setSelectedCust] = useState<CustomerListData | null>(null);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>(null);
  const [planDate, setPlanDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [remark, setRemark] = useState<string>("");
  const [dValues, setDValues] = useState<{ [key: string]: number }>(() =>
    Object.fromEntries(DAY_FIELDS.map((f) => [f, 0]))
  );

  /* Load Metadata when opening modal */
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

  // Chỉ dùng danh mục thật từ API (rỗng nếu API lỗi) để không tạo Plan với dữ liệu không có thật
  const effectiveCustomers = customerList;
  const effectiveCodes = codeList;

  const sumD = useMemo(
    () => DAY_FIELDS.reduce((acc, f) => acc + (Number(dValues[f]) || 0), 0),
    [dValues]
  );

  const updateD = useCallback((field: string, val: number) => {
    setDValues((prev) => ({ ...prev, [field]: val }));
  }, []);

  const handleReset = () => {
    setSelectedCust(null);
    setSelectedCode(null);
    setPlanDate(moment().format("YYYY-MM-DD"));
    setRemark("");
    setDValues(Object.fromEntries(DAY_FIELDS.map((f) => [f, 0])));
    setUploadExcelJSon([]);
    setSelectedFileName("");
    setSelectedFileSize("");
  };

  const handleManualSave = async () => {
    if (!selectedCust) {
      Swal.fire("Thông báo", "Vui lòng chọn khách hàng (CUST_CD)", "warning");
      return;
    }
    if (!selectedCode) {
      Swal.fire("Thông báo", "Vui lòng chọn sản phẩm (G_CODE)", "warning");
      return;
    }
    if (!planDate) {
      Swal.fire("Thông báo", "Vui lòng chọn ngày Plan (PLAN_DATE)", "warning");
      return;
    }

    const gCode = selectedCode.G_CODE;
    const custCd = selectedCust.CUST_CD || selectedCust.CUST_NAME_KD;

    // Check plan exist
    let err = 0;
    await generalQuery("checkPlanExist", {
      G_CODE: gCode,
      CUST_CD: custCd,
      PLAN_DATE: planDate,
    })
      .then((r) => {
        if (r.data.tk_status !== "NG") err = 1;
      })
      .catch(console.log);

    if (moment() < moment(planDate)) err = 2;

    await generalQuery("checkGCodeVer", { G_CODE: gCode })
      .then((r) => {
        if (r.data.tk_status !== "NG") {
          if (r.data.data[0].USE_YN !== "Y") err = 3;
        } else err = 4;
      })
      .catch(console.log);

    if (err === 1) {
      Swal.fire("Lỗi", "Plan đã tồn tại trên hệ thống", "error");
      return;
    }
    if (err === 2) {
      Swal.fire("Lỗi", "Ngày Plan không được sau ngày hôm nay", "error");
      return;
    }
    if (err === 3) {
      Swal.fire("Lỗi", "Ver sản phẩm này đã bị khóa", "error");
      return;
    }
    if (err === 4) {
      Swal.fire("Lỗi", "Không tìm thấy Code ERP này", "error");
      return;
    }

    await generalQuery("insert_plan", {
      REMARK: remark,
      G_CODE: gCode,
      CUST_CD: custCd,
      PLAN_DATE: planDate,
      EMPL_NO: userData?.EMPL_NO,
      ...Object.fromEntries(DAY_FIELDS.map((f) => [f, Number(dValues[f]) || 0])),
    })
      .then((r) => {
        if (r.data.tk_status !== "NG") {
          Swal.fire("Thành công", "Đã thêm Plan thành công", "success");
          const notif: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Thêm kế hoạch giao hàng mới",
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm kế hoạch giao hàng mới`,
            SUBDEPTNAME: "KD",
            MAINDEPTNAME: "KD",
            INS_EMPL: "NHU1903",
            INS_DATE: "2024-12-30",
            UPD_EMPL: "NHU1903",
            UPD_DATE: "2024-12-30",
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

  /* ── Excel Mode State ── */
  const [uploadExcelJson, setUploadExcelJSon] = useState<any[]>([]);
  const [columnsExcel, setColumnsExcel] = useState<any[]>([]);
  const [trigger, setTrigger] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const excelSelected = useRef<any[]>([]);

  // Đọc 1 File Excel (dùng chung cho input[type=file] và vùng kéo-thả)
  const applyExcelFile = useCallback((file: File) => {
    setSelectedFileName(file.name);
    setSelectedFileSize((file.size / 1024).toFixed(1) + " KB");
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any = XLSX.utils.sheet_to_json(worksheet);
      const keys = json.length > 0 ? Object.keys(json[0]) : [];
      const cols = keys.map((k) => ({
        field: k,
        headerName: k,
        width: DAY_FIELDS.includes(k) ? 62 : k === "REMARK" ? 150 : 92,
        minWidth: DAY_FIELDS.includes(k) ? 62 : k === "REMARK" ? 150 : 92,
      }));
        cols.push({
          field: "CHECKSTATUS",
          headerName: "CHECKSTATUS",
          width: 200,
          minWidth: 200,
          cellRenderer: renderCheckStatus,
        });
      setColumnsExcel(cols);
      setUploadExcelJSon(
        json.map((el: any, idx: number) => ({
          ...el,
          id: idx,
          CHECKSTATUS: "Waiting",
          ...Object.fromEntries(
            DAY_FIELDS.map((f) => [f, el[f] === undefined || el[f] === "" ? 0 : el[f]])
          ),
        }))
      );
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const loadFile = (e: any) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) applyExcelFile(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        G_CODE: "7C09353A",
        CUST_CD: "SEVT",
        PLAN_DATE: moment().format("YYYY-MM-DD"),
        D1: 30000,
        D2: 25000,
        D3: 25000,
        D4: 20000,
        D5: 20000,
        D6: 20000,
        D7: 20000,
        D8: 20000,
        D9: 0,
        D10: 0,
        D11: 0,
        D12: 0,
        D13: 0,
        D14: 0,
        D15: 0,
        REMARK: "Kế hoạch mẫu giao hàng",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PlanTemplate");
    XLSX.writeFile(wb, "CMS_Vina_Plan_Template_2026.xlsx");
  };

  const handle_checkPlanHangLoat = async () => {
    if (uploadExcelJson.length === 0) {
      Swal.fire("Thông báo", "Vui lòng tải file Plan trước khi kiểm tra", "warning");
      return;
    }

    setIsLoading(true);
    Swal.fire({
      title: "Đang kiểm tra Plan",
      text: `Đang kiểm tra ${uploadExcelJson.length} dòng...`,
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    try {
      // Clone từng row: mutate row cũ (cùng reference) làm AG Grid không refresh cột CHECKSTATUS.
      const tempjson = uploadExcelJson.map((r) => ({ ...r }));
      for (let i = 0; i < tempjson.length; i++) {
        let err_code = 0;
        const row = tempjson[i];

        try {
          const planResponse = await generalQuery("checkPlanExist", {
            G_CODE: row.G_CODE,
            CUST_CD: row.CUST_CD,
            PLAN_DATE: row.PLAN_DATE,
          });
          if (planResponse.data?.tk_status !== "NG") err_code = 1;

          if (moment() < moment(row.PLAN_DATE)) err_code = 2;

          const codeResponse = await generalQuery("checkGCodeVer", { G_CODE: row.G_CODE });
          if (codeResponse.data?.tk_status !== "NG") {
            if (codeResponse.data?.data?.[0]?.USE_YN !== "Y") err_code = 3;
          } else {
            err_code = 4;
          }

          if (err_code === 0) row.CHECKSTATUS = "OK";
          else if (err_code === 1) row.CHECKSTATUS = "NG: Plan đã tồn tại";
          else if (err_code === 2) row.CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
          else if (err_code === 3) row.CHECKSTATUS = "NG: Ver này đã bị khóa";
          else if (err_code === 4) row.CHECKSTATUS = "NG: Không có Code ERP này";
        } catch (error) {
          console.error(`Check Plan row ${i + 1} failed`, error);
          row.CHECKSTATUS = "NG: Không thể kiểm tra dữ liệu";
        }
      }

      setUploadExcelJSon(tempjson);
      setTrigger((value) => !value);
      Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    } catch (error: any) {
      console.error("Check Plan failed", error);
      Swal.fire("Lỗi", error?.message || "Không thể kiểm tra dữ liệu Plan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handle_upPlanHangLoat = async () => {
    // Clone từng row để AG Grid cập nhật CHECKSTATUS ngay sau khi up.
    const tempjson = uploadExcelJson.map((r) => ({ ...r }));
    for (let i = 0; i < tempjson.length; i++) {
      let err_code = 0;
      await generalQuery("checkPlanExist", {
        G_CODE: tempjson[i].G_CODE,
        CUST_CD: tempjson[i].CUST_CD,
        PLAN_DATE: tempjson[i].PLAN_DATE,
      })
        .then((r) => {
          if (r.data.tk_status !== "NG") err_code = 1;
        })
        .catch(console.log);
      if (moment() < moment(tempjson[i].PLAN_DATE)) err_code = 2;
      await generalQuery("checkGCodeVer", { G_CODE: tempjson[i].G_CODE })
        .then((r) => {
          if (r.data.tk_status !== "NG") {
            if (r.data.data[0].USE_YN !== "Y") err_code = 3;
          } else err_code = 4;
        })
        .catch(console.log);
      if (err_code === 0) {
        await generalQuery("insert_plan", {
          REMARK: tempjson[i].REMARK,
          G_CODE: tempjson[i].G_CODE,
          CUST_CD: tempjson[i].CUST_CD,
          PLAN_DATE: tempjson[i].PLAN_DATE,
          EMPL_NO: userData?.EMPL_NO,
          ...Object.fromEntries(DAY_FIELDS.map((f) => [f, tempjson[i][f]])),
        })
          .then((r) => {
            if (r.data.tk_status !== "NG") tempjson[i].CHECKSTATUS = "OK";
            else {
              err_code = 5;
              tempjson[i].CHECKSTATUS = "NG: Lỗi SQL: " + r.data.message;
            }
          })
          .catch(console.log);
      } else if (err_code === 1) tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      else if (err_code === 2)
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      else if (err_code === 3) tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      else if (err_code === 4) tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      else if (err_code === 5) tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn đơn hàng";
    }
    const notif: NotificationElement = {
      CTR_CD: "002",
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: "Thêm kế hoạch giao hàng mới",
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm kế hoạch giao hàng mới`,
      SUBDEPTNAME: "KD",
      MAINDEPTNAME: "KD",
      INS_EMPL: "NHU1903",
      INS_DATE: "2024-12-30",
      UPD_EMPL: "NHU1903",
      UPD_DATE: "2024-12-30",
    };
    if (await f_insert_Notification_Data(notif)) getSocket().emit("notification_panel", notif);
    Swal.fire("Thông báo", "Đã hoàn thành up Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };

  const confirmCheck = () => {
    Swal.fire({
      title: "Check Plan hàng loạt?",
      text: "Bắt đầu kiểm tra tính hợp lệ dữ liệu",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Check!",
    }).then((r) => {
      if (r.isConfirmed) handle_checkPlanHangLoat();
    });
  };

  const confirmUp = () => {
    Swal.fire({
      title: "Thêm Plan hàng loạt?",
      text: "Đẩy toàn bộ dữ liệu hợp lệ lên hệ thống",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Thêm!",
    }).then((r) => {
      if (r.isConfirmed) handle_upPlanHangLoat();
    });
  };

  const planDataAGTableExcel = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        columns={columnsExcel}
        data={uploadExcelJson}
        onSelectionChange={(params: any) => {
          excelSelected.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [uploadExcelJson, columnsExcel, trigger]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kéo-thả file Excel từ ngoài vào vùng drop của modal
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) applyExcelFile(file);
  };

  if (!open) return null;

  return (
    <div
      className="pp-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pp-modal">
        {/* ── Modal Header ── */}
        <div className="pp-modal__header">
          <div className="pp-modal__headerLeft">
            <div className="pp-modal__headerIcon">
              <FiCalendar size={16} />
            </div>
            <div>
              <h3
                className="pp-modal__title"
                title="Thêm Mới Kế Hoạch Giao hàng (Plan Entry)"
              >
                {isMobile ? "Thêm Kế Hoạch" : "Thêm Mới Kế Hoạch Giao hàng (Plan Entry)"}
              </h3>
              {!isMobile && (
                <p className="pp-modal__subtitle">
                  Khởi tạo hoặc tải dữ liệu kế hoạch hàng loạt vào hệ thống
                </p>
              )}
            </div>
          </div>
          <div className="pp-modal__headerRight">
            <div className="pp-modal__modeToggle">
              <button
                type="button"
                className={`pp-modal__modeBtn ${activeMode === "manual" ? "pp-modal__modeBtn--active" : ""
                  }`}
                onClick={() => setActiveMode("manual")}
              >
                <FiEdit3 size={13} /> {isMobile ? "Thủ Công" : "Nhập Thủ Công"}
              </button>
              <button
                type="button"
                className={`pp-modal__modeBtn pp-modal__modeBtn--excel ${activeMode === "excel" ? "pp-modal__modeBtn--active" : ""
                  }`}
                onClick={() => setActiveMode("excel")}
              >
                <FiFileText
                  size={13}
                  style={{ color: activeMode === "excel" ? "#047857" : "#059669" }}
                />{" "}
                {isMobile ? "Excel" : "Import File Excel"}
              </button>
            </div>
            <button
              type="button"
              className="pp-modal__closeBtn"
              onClick={onClose}
              title="Đóng modal"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className="pp-modal__body">
          {activeMode === "manual" ? (
            /* ═══ MANUAL MODE (Chỉ gồm CUST_CD, G_CODE, PLAN_DATE, D1..D15, REMARK) ═══ */
            <div className="pp-manual">
              {/* Info Banner */}
              <div className="pp-manual__info">
                <span
                  className="pp-manual__infoLeft"
                  title="Chọn Khách Hàng, Mã Sản Phẩm, Ngày Plan và phân bổ sản lượng giao hàng từ D1 đến D15."
                >
                  <FiInfo size={15} />
                  {isMobile
                    ? "Chọn KH, mã SP, ngày Plan và phân bổ D1–D15"
                    : "Chọn Khách Hàng, Mã Sản Phẩm, Ngày Plan và phân bổ sản lượng giao hàng từ D1 đến D15."}
                </span>
                <span className="pp-manual__infoRight">
                  Phụ trách:{" "}
                  <strong>
                    {getUserData()?.MIDLAST_NAME} {getUserData()?.FIRST_NAME} ({getUserData()?.EMPL_NO})
                  </strong>
                </span>
              </div>

              {/* Row 1: CUST_CD, G_CODE, PLAN_DATE (Chuẩn tương tự PO Manager) */}
              <div className="pp-manual__grid pp-manual__grid--3">
                {/* 1. Khách Hàng (CUST_CD) */}
                <div className="pp-manual__field">
                  <label>
                    Khách Hàng (CUST_CD): <span className="pp-manual__req">*</span>
                  </label>
                  <Autocomplete
                    size="small"
                    options={effectiveCustomers}
                    filterOptions={filterCustomerOptions}
                    isOptionEqualToValue={(opt: any, val: any) => opt?.CUST_CD === val?.CUST_CD}
                    getOptionLabel={(opt: any) => {
                      if (!opt) return "";
                      if (typeof opt === "string") return opt;
                      return `${opt.CUST_CD || ""}: ${opt.CUST_NAME_KD || opt.CUST_NAME || ""}`;
                    }}
                    value={selectedCust}
                    onChange={(_, val: any) => setSelectedCust(val)}
                    openOnFocus
                    autoHighlight
                    clearOnEscape
                    slotProps={{
                      popper: {
                        sx: { zIndex: 120000 },
                      },
                    }}
                    noOptionsText="Không tìm thấy khách hàng phù hợp"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Chọn hoặc gõ tìm khách hàng..."
                      />
                    )}
                  />
                </div>

                {/* 2. Mã Sản Phẩm (G_CODE) */}
                <div className="pp-manual__field">
                  <label>
                    Mã Sản Phẩm (G_CODE): <span className="pp-manual__req">*</span>
                  </label>
                  <Autocomplete
                    size="small"
                    options={effectiveCodes}
                    filterOptions={filterCodeOptions}
                    isOptionEqualToValue={(opt: any, val: any) => opt?.G_CODE === val?.G_CODE}
                    getOptionLabel={(opt: any) => {
                      if (!opt) return "";
                      if (typeof opt === "string") return opt;
                      return `${opt.G_CODE || ""}: ${opt.G_NAME_KD || opt.G_NAME || ""}`;
                    }}
                    value={selectedCode}
                    onChange={(_, val: any) => setSelectedCode(val)}
                    openOnFocus
                    autoHighlight
                    clearOnEscape
                    slotProps={{
                      popper: {
                        sx: { zIndex: 120000 },
                      },
                    }}
                    noOptionsText="Không tìm thấy mã sản phẩm phù hợp"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Chọn hoặc gõ mã ERP / mã KD..."
                      />
                    )}
                  />
                </div>

                {/* 3. Ngày Plan (PLAN_DATE) */}
                <div className="pp-manual__field">
                  <label>
                    Ngày Plan (PLAN_DATE): <span className="pp-manual__req">*</span>
                  </label>
                  <input
                    type="date"
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="pp-manual__input"
                  />
                </div>
              </div>

              {/* Thông tin xác nhận nhanh sản phẩm đã chọn */}
              {selectedCode && (
                <div className="pp-manual__codeBadge">
                  <span>
                    Mã ERP: <strong>{selectedCode.G_CODE}</strong>
                  </span>
                  <span className="sep">•</span>
                  <span>
                    Mã KD: <strong>{selectedCode.G_NAME_KD || "---"}</strong>
                  </span>
                  <span className="sep">•</span>
                  <span>
                    Tên Sản Phẩm: <strong>{selectedCode.G_NAME || "---"}</strong>
                  </span>
                </div>
              )}

              {/* D1-D15 Grid Section */}
              <div className="pp-manual__dSection">
                <div className="pp-manual__dHeader">
                  <span className="pp-manual__dTitle">
                    <FiBarChart2 size={15} /> PHÂN BỔ SẢN LƯỢNG D1 ĐẾN D15 (DAILY BREAKDOWN)
                  </span>
                  <span className="pp-manual__dUnit">
                    Đơn vị tính: <strong>Pcs / EA</strong>
                  </span>
                </div>
                <div className="pp-manual__dGrid">
                  {DAY_FIELDS.map((f, idx) => (
                    <div key={f} className="pp-manual__dCell">
                      <span
                        className={`pp-manual__dLabel ${idx < 8 ? "pp-manual__dLabel--active" : ""
                          }`}
                      >
                        {f}
                      </span>
                      <input
                        type="number"
                        value={dValues[f] || 0}
                        onChange={(e) => updateD(f, Number(e.target.value))}
                        className={`pp-manual__dInput ${dValues[f] > 0 ? "pp-manual__dInput--filled" : ""
                          }`}
                      />
                    </div>
                  ))}
                  <div className="pp-manual__dCell pp-manual__dCell--sum">
                    <span className="pp-manual__dLabel">SUM D1-15</span>
                    <span className="pp-manual__dSum">{sumD.toLocaleString("en-US")}</span>
                  </div>
                </div>
              </div>

              {/* Remark / Note */}
              <div className="pp-manual__field">
                <label>Ghi chú (REMARK / Note):</label>
                <textarea
                  rows={2}
                  placeholder="Nhập ghi chú yêu cầu kỹ thuật, tiến độ giao nhận đặc biệt..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="pp-manual__textarea"
                />
              </div>
            </div>
          ) : (
            /* ═══ EXCEL MODE ═══ */
            <div className="pp-excel">
              {/* Drop Zone */}
              <div
                className={`pp-excel__dropzone${isDragOver ? " pp-excel__dropzone--over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(false);
                }}
                onDrop={handleDrop}
              >
                <div className="pp-excel__dropIcon">
                  <FiFileText size={22} />
                </div>
                <p className="pp-excel__dropTitle">
                  Kéo thả file Excel (.xlsx, .xls) vào đây hoặc bấm để duyệt
                </p>
                <p className="pp-excel__dropDesc">
                  Hỗ trợ các file chuẩn mẫu kế hoạch CMS Vina Plan Template v2026
                </p>
                <div className="pp-excel__dropBtns">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={loadFile}
                    hidden
                  />
                  <button
                    type="button"
                    className="pp-excel__browseBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <FiFolder size={14} /> Chọn File Từ Máy Tính
                  </button>
                  <button
                    type="button"
                    className="pp-excel__templateBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadTemplate();
                    }}
                  >
                    <FiDownload size={14} /> Tải File Mẫu (Template)
                  </button>
                </div>
              </div>

              {/* File Info Bar */}
              {selectedFileName && (
                <div className="pp-excel__fileBar">
                  <div className="pp-excel__fileInfo">
                    <span className="pp-excel__fileLabel">Tệp đã chọn:</span>
                    <span className="pp-excel__fileName">{selectedFileName}</span>
                    <span className="pp-excel__fileSize">({selectedFileSize})</span>
                  </div>
                  <div className="pp-excel__fileActions">
                    <button
                      type="button"
                      className="pp-excel__actionBtn pp-excel__actionBtn--check"
                      onClick={confirmCheck}
                      disabled={isLoading}
                    >
                      <FiCheckCircle size={13} /> CHECK PLAN
                    </button>
                    <button
                      type="button"
                      className="pp-excel__actionBtn pp-excel__actionBtn--up"
                      onClick={confirmUp}
                      disabled={isLoading}
                    >
                      <FiUploadCloud size={13} /> UP PLAN
                    </button>
                  </div>
                </div>
              )}

              {/* Preview Grid */}
              <div className="pp-excel__preview">
                <div className="pp-excel__previewHeader">
                  <span>XEM TRƯỚC BẢNG DỮ LIỆU ĐƯỢC CHECK (PREVIEW GRID)</span>
                  <span className="pp-excel__previewCount">
                    Total: {uploadExcelJson.length} rows checked
                  </span>
                </div>
                <div className="pp-excel__previewBody">
                  {uploadExcelJson.length > 0 ? (
                    planDataAGTableExcel
                  ) : (
                    <div className="pp-excel__emptyState">
                      Bấm "CHECK PLAN" để phân tích và kiểm tra dữ liệu trước khi đẩy lên máy chủ
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="pp-modal__footer">
          <button
            type="button"
            className="pp-modal__footerBtn pp-modal__footerBtn--ghost"
            onClick={handleReset}
          >
            <FiRefreshCw size={13} /> Làm mới
          </button>
          <div className="pp-modal__footerRight">
            <button
              type="button"
              className="pp-modal__footerBtn pp-modal__footerBtn--secondary"
              onClick={onClose}
            >
              Đóng
            </button>
            {activeMode === "manual" && (
              <button
                type="button"
                className="pp-modal__footerBtn pp-modal__footerBtn--primary"
                onClick={handleManualSave}
              >
                <FiCheck size={14} /> Lưu Plan Kế Hoạch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionPlanAddModal);

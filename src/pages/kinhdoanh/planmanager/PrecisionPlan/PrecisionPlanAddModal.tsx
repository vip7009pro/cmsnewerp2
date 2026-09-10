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
import { f_getcodelist, f_getcustomerlist } from "../../utils/kdUtils";
import "./PrecisionPlan.scss";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DAY_FIELDS = Array.from({ length: 15 }, (_, i) => `D${i + 1}`);

const FALLBACK_CUSTOMERS: CustomerListData[] = [
  { CUST_CD: "0025", CUST_NAME_KD: "SEVT", CUST_NAME: "SAMSUNG ELECTRONICS VIETNAM THAI NGUYEN" },
  { CUST_CD: "0002", CUST_NAME_KD: "MOBIS", CUST_NAME: "HYUNDAI MOBIS VIETNAM" },
  { CUST_CD: "0003", CUST_NAME_KD: "DONGKWANG", CUST_NAME: "DONGKWANG CL CO., LTD" },
  { CUST_CD: "0004", CUST_NAME_KD: "SAMKWANG", CUST_NAME: "SAMKWANG VINA CO., LTD" },
  { CUST_CD: "0005", CUST_NAME_KD: "HAE SUNG", CUST_NAME: "HAESUNG OPTICS VIETNAM" },
  { CUST_CD: "0006", CUST_NAME_KD: "ALMUS", CUST_NAME: "ALMUS VINA CO., LTD" },
  { CUST_CD: "0007", CUST_NAME_KD: "SEV", CUST_NAME: "SAMSUNG ELECTRONICS VIETNAM (BAC NINH)" },
  { CUST_CD: "0008", CUST_NAME_KD: "INNOTEK", CUST_NAME: "LG INNOTEK VIETNAM HAI PHONG" },
];

const FALLBACK_CODES: CodeListData[] = [
  {
    G_CODE: "7C09353A", G_NAME: "GH63-23259A_A_SM-5741B", G_NAME_KD: "GH63-23259A", USE_YN: "Y",
    PROD_LAST_PRICE: 0
  },
  {
    G_CODE: "7C09019B", G_NAME: "S029-00673B_B_Tab S10 FE", G_NAME_KD: "S029-00673B", USE_YN: "Y",
    PROD_LAST_PRICE: 0
  },
  {
    G_CODE: "7B09441A", G_NAME: "S029-00728A_A_A165B", G_NAME_KD: "S029-00728A", USE_YN: "Y",
    PROD_LAST_PRICE: 0
  },
  {
    G_CODE: "7C09014A", G_NAME: "GH63-22420A_A_SM-X626B", G_NAME_KD: "GH63-22420A", USE_YN: "Y",
    PROD_LAST_PRICE: 0
  },
  {
    G_CODE: "7A09927A", G_NAME: "LABEL-BARCODE 45X25", G_NAME_KD: "GH68-57003A", USE_YN: "Y",
    PROD_LAST_PRICE: 0
  },
  {
    G_CODE: "7A09871A", G_NAME: "LABEL-SERIAL 30X15", G_NAME_KD: "GH68-55201B", USE_YN: "Y",
    PROD_LAST_PRICE: 0
  },
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

const PrecisionPlanAddModal: React.FC<Props> = ({ open, onClose }) => {
  const userData = useSelector((state: RootState) => state.totalSlice.userData);
  const [activeMode, setActiveMode] = useState<"manual" | "excel">("manual");

  /* ── Master Data State ── */
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);

  /* ── Manual Mode State: CUST_CD, G_CODE, PLAN_DATE, D1..D15, REMARK ── */
  const [selectedCust, setSelectedCust] = useState<CustomerListData | null>(null);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>(null);
  const [planDate, setPlanDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [remark, setRemark] = useState<string>("");
  const [dValues, setDValues] = useState<{ [key: string]: number }>(() =>
    Object.fromEntries(DAY_FIELDS.map((f, i) => [f, i < 3 ? 20000 : 0]))
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

  const effectiveCustomers = useMemo(
    () => (customerList.length > 0 ? customerList : FALLBACK_CUSTOMERS),
    [customerList]
  );

  const effectiveCodes = useMemo(
    () => (codeList.length > 0 ? codeList : FALLBACK_CODES),
    [codeList]
  );

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
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");
  const excelSelected = useRef<any[]>([]);

  const loadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
        const cols = keys.map((k) => ({ field: k, headerName: k, width: 150 }));
        cols.push({ field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 200 });
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
    }
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
    const tempjson = [...uploadExcelJson];
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
      if (err_code === 0) tempjson[i].CHECKSTATUS = "OK";
      else if (err_code === 1) tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      else if (err_code === 2)
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      else if (err_code === 3) tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      else if (err_code === 4) tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
    }
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
  };

  const handle_upPlanHangLoat = async () => {
    const tempjson = [...uploadExcelJson];
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
              <h3 className="pp-modal__title">Thêm Mới Kế Hoạch Sản Xuất (Plan Entry)</h3>
              <p className="pp-modal__subtitle">
                Khởi tạo hoặc tải dữ liệu kế hoạch hàng loạt vào hệ thống
              </p>
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
                <FiEdit3 size={13} /> Nhập Thủ Công
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
                Import File Excel
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
                <span className="pp-manual__infoLeft">
                  <FiInfo size={15} />
                  Chọn Khách Hàng, Mã Sản Phẩm, Ngày Plan và phân bổ sản lượng giao hàng từ D1 đến D15.
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
              <div className="pp-excel__dropzone" onClick={() => fileInputRef.current?.click()}>
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
                    >
                      <FiCheckCircle size={13} /> CHECK PLAN
                    </button>
                    <button
                      type="button"
                      className="pp-excel__actionBtn pp-excel__actionBtn--up"
                      onClick={confirmUp}
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

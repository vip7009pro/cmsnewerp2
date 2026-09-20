import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import { SaveExcel } from "../../../api/services/excelService";
import { f_insert_Notification_Data } from "../../../api/services/notificationService";
import { zeroPad } from "../../../api/services/utilService";
import AGTable from "../../../components/DataTable/AGTable";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { CUST_INFO } from "../interfaces/kdInterface";
import PrecisionCustHeader from "./PrecisionCustManager/PrecisionCustHeader";
import PrecisionCustKpi from "./PrecisionCustManager/PrecisionCustKpi";
import PrecisionCustToolbar, { CustFilterType } from "./PrecisionCustManager/PrecisionCustToolbar";
import { getPrecisionCustColumns } from "./PrecisionCustManager/PrecisionCustColumns";
import PrecisionCustModal from "./PrecisionCustManager/PrecisionCustModal";
import PrecisionCustPivotModal from "./PrecisionCustManager/PrecisionCustPivotModal";
import "./PrecisionCustManager/PrecisionCustManager.scss";

const initialCustInfo: CUST_INFO = {
  id: "0",
  CUST_TYPE: "KH",
  CUST_CD: "",
  CUST_NAME_KD: "",
  CUST_NAME: "",
  CUST_ADDR1: "",
  CUST_ADDR2: "",
  CUST_ADDR3: "",
  EMAIL: "",
  TAX_NO: "",
  CUST_NUMBER: "",
  BOSS_NAME: "",
  TEL_NO1: "",
  FAX_NO: "",
  CUST_POSTAL: "",
  REMK: "",
  USE_YN: "Y",
  INS_DATE: "",
  INS_EMPL: "",
  UPD_DATE: "",
  UPD_EMPL: "",
};

const CUST_MANAGER: React.FC = () => {
  const [custinfodatatable, setCUSTINFODataTable] = useState<CUST_INFO[]>([]);
  const [selectedRows, setSelectedRows] = useState<CUST_INFO>(initialCustInfo);
  const [openModal, setOpenModal] = useState(false);
  const [isNewMode, setIsNewMode] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<CustFilterType>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showPivot, setShowPivot] = useState(false);
  // Dòng đang được click trên lưới (độc lập với state form) để phục vụ nút "Sửa Đối Tác"
  const clickedRowRef = useRef<CUST_INFO | null>(null);
  // Đánh dấu user đã tự nhập mã, tránh bị ghi đè khi đổi phân loại
  const codeTouched = useRef(false);

  // 1. Tải danh sách đối tác
  const handleCUSTINFO = useCallback(() => {
    Swal.fire({
      title: "Tra data",
      text: "Đang nạp danh sách đối tác...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    generalQuery("get_listcustomer", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: CUST_INFO[] = response.data.data.map(
            (element: CUST_INFO, index: number) => ({
              ...element,
              CUST_NAME: element.CUST_NAME ?? "",
              CUST_NAME_KD: element.CUST_NAME_KD ?? "",
              CUST_ADDR1: element.CUST_ADDR1 !== "undefined" ? element.CUST_ADDR1 ?? "" : "",
              CUST_ADDR2: element.CUST_ADDR2 !== "undefined" ? element.CUST_ADDR2 ?? "" : "",
              CUST_ADDR3: element.CUST_ADDR3 !== "undefined" ? element.CUST_ADDR3 ?? "" : "",
              EMAIL: element.EMAIL ?? "",
              TAX_NO: element.TAX_NO ?? "",
              CUST_NUMBER: element.CUST_NUMBER ?? "",
              BOSS_NAME: element.BOSS_NAME ?? "",
              TEL_NO1: element.TEL_NO1 ?? "",
              FAX_NO: element.FAX_NO ?? "",
              CUST_POSTAL: element.CUST_POSTAL ?? "",
              REMK: element.REMK ?? "",
              INS_DATE: element.INS_DATE !== null ? moment.utc(element.INS_DATE).format("YYYY-MM-DD") : "",
              UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD") : "",
              id: index.toString(),
            })
          );
          setCUSTINFODataTable(loadeddata);
          Swal.fire("Thông báo", `Đã nạp thành công ${loadeddata.length} đối tác`, "success");
        } else {
          setCUSTINFODataTable([]);
          Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Lỗi", "Không thể kết nối máy chủ: " + error, "error");
      });
  }, []);

  // 2. Tự động sinh mã đối tác tiếp theo (autogenerateCUST_CD)
  const autogenerateCUST_CD = useCallback(async (company_type: string) => {
    let next_cust_cd = company_type + "001";
    try {
      const response = await generalQuery("checkcustcd", { COMPANY_TYPE: company_type });
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        const lastCode = response.data.data[0].CUST_CD || "";
        const stt = company_type === "KH" ? lastCode.substring(2, 5) : lastCode.substring(3, 6);
        const nextNum = parseInt(stt, 10);
        if (!isNaN(nextNum)) {
          next_cust_cd = company_type + zeroPad(nextNum + 1, 3);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return next_cust_cd;
  }, []);

  // 3. Mở modal thêm mới
  const handleOpenAddNew = useCallback(async () => {
    const nextCode = await autogenerateCUST_CD("KH");
    codeTouched.current = false;
    setSelectedRows({
      ...initialCustInfo,
      CUST_TYPE: "KH",
      CUST_CD: nextCode,
    });
    setIsNewMode(true);
    setOpenModal(true);
  }, [autogenerateCUST_CD]);

  // 4. Mở modal chỉnh sửa dòng
  const handleOpenEditRow = useCallback((row: CUST_INFO) => {
    codeTouched.current = false;
    setSelectedRows({ ...row });
    setIsNewMode(false);
    setOpenModal(true);
  }, []);

  // 4b. Sửa dòng đang click trên lưới (khôi phục luồng legacy: click dòng -> Add/Update)
  const handleOpenEditSelected = useCallback(() => {
    const row = clickedRowRef.current;
    if (!row || !row.CUST_CD) {
      Swal.fire(
        "Thông báo",
        "Vui lòng click chọn một dòng đối tác trên bảng để sửa",
        "warning"
      );
      return;
    }
    handleOpenEditRow(row);
  }, [handleOpenEditRow]);

  // 5. Thay đổi trường form (đánh dấu khi user tự sửa mã để không ghi đè)
  const handleChangeField = useCallback((key: string, value: any) => {
    if (key === "CUST_CD") codeTouched.current = true;
    setSelectedRows((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 6. Tự sinh mã trong modal (không ghi đè mã user đã tự nhập)
  const handleModalAutoGenCode = useCallback(
    async (type: string) => {
      if (codeTouched.current) {
        setSelectedRows((prev) => ({ ...prev, CUST_TYPE: type }));
        return;
      }
      const nextCode = await autogenerateCUST_CD(type);
      setSelectedRows((prev) => ({ ...prev, CUST_TYPE: type, CUST_CD: nextCode }));
    },
    [autogenerateCUST_CD]
  );

  // 7. Làm mới form trong modal
  const handleClearModalForm = useCallback(async () => {
    const currentType = selectedRows.CUST_TYPE || "KH";
    const nextCode = await autogenerateCUST_CD(currentType);
    codeTouched.current = false;
    setSelectedRows({
      ...initialCustInfo,
      CUST_TYPE: currentType,
      CUST_CD: nextCode,
    });
  }, [autogenerateCUST_CD, selectedRows.CUST_TYPE]);

  // 8. Thêm mới đối tác (handle_addCustomer)
  const handle_addCustomer = useCallback(() => {
    if (!selectedRows.CUST_CD || !selectedRows.CUST_NAME_KD) {
      Swal.fire("Cảnh báo", "Vui lòng nhập Mã đối tác và Tên viết tắt", "warning");
      return;
    }

    generalQuery("add_customer", selectedRows)
      .then(async (response) => {
        if (response.data.tk_status !== "NG") {
          const uData = getUserData();
          const newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Thêm đối tác mới",
            CONTENT: `${uData?.EMPL_NO} (${uData?.MIDLAST_NAME} ${uData?.FIRST_NAME}) đã thêm đối tác mới: [${selectedRows.CUST_CD}] ${selectedRows.CUST_NAME_KD} - ${selectedRows.CUST_NAME}`,
            SUBDEPTNAME: "ALL",
            MAINDEPTNAME: "ALL",
            INS_EMPL: uData?.EMPL_NO || "SYSTEM",
            INS_DATE: moment.utc().format("YYYY-MM-DD"),
            UPD_EMPL: uData?.EMPL_NO || "SYSTEM",
            UPD_DATE: moment.utc().format("YYYY-MM-DD"),
          };
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }

          Swal.fire("Thành công", "Đã thêm đối tác mới thành công", "success");
          setOpenModal(false);
          handleCUSTINFO();
        } else {
          Swal.fire("Lỗi", "Thêm đối tác thất bại: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Lỗi", "Có lỗi xảy ra: " + error, "error");
      });
  }, [handleCUSTINFO, selectedRows]);

  // 9. Cập nhật đối tác (handle_editCustomer)
  const handle_editCustomer = useCallback(() => {
    if (!selectedRows.CUST_CD || !selectedRows.CUST_NAME_KD) {
      Swal.fire("Cảnh báo", "Vui lòng nhập Mã đối tác và Tên viết tắt", "warning");
      return;
    }

    generalQuery("edit_customer", selectedRows)
      .then(async (response) => {
        if (response.data.tk_status !== "NG") {
          const uData = getUserData();
          const newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "info",
            TITLE: "Cập nhật hồ sơ đối tác",
            CONTENT: `${uData?.EMPL_NO} (${uData?.MIDLAST_NAME} ${uData?.FIRST_NAME}) đã sửa hồ sơ đối tác: [${selectedRows.CUST_CD}] ${selectedRows.CUST_NAME_KD} - ${selectedRows.CUST_NAME}`,
            SUBDEPTNAME: "ALL",
            MAINDEPTNAME: "ALL",
            INS_EMPL: uData?.EMPL_NO || "SYSTEM",
            INS_DATE: moment.utc().format("YYYY-MM-DD"),
            UPD_EMPL: uData?.EMPL_NO || "SYSTEM",
            UPD_DATE: moment.utc().format("YYYY-MM-DD"),
          };
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }

          Swal.fire("Thành công", "Đã cập nhật thông tin đối tác thành công", "success");
          setOpenModal(false);
          handleCUSTINFO();
        } else {
          Swal.fire("Lỗi", "Cập nhật thất bại: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Lỗi", "Có lỗi xảy ra: " + error, "error");
      });
  }, [handleCUSTINFO, selectedRows]);

  // 10. Lọc dữ liệu theo Segment Filter và Search Keyword
  const filteredData = useMemo(() => {
    let list = custinfodatatable;

    // Lọc theo phân loại
    if (currentFilter === "KH") {
      list = list.filter((d) => (d.CUST_TYPE || "").trim().toUpperCase() === "KH");
    } else if (currentFilter === "NCC") {
      list = list.filter((d) => (d.CUST_TYPE || "").trim().toUpperCase() === "NCC");
    } else if (currentFilter === "USE") {
      list = list.filter((d) => d.USE_YN === "Y");
    } else if (currentFilter === "NOT_USE") {
      list = list.filter((d) => d.USE_YN !== "Y");
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim() !== "") {
      const q = searchKeyword.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.CUST_CD?.toLowerCase().includes(q) ||
          d.CUST_NAME_KD?.toLowerCase().includes(q) ||
          d.CUST_NAME?.toLowerCase().includes(q) ||
          d.TAX_NO?.toLowerCase().includes(q) ||
          d.TEL_NO1?.toLowerCase().includes(q) ||
          d.EMAIL?.toLowerCase().includes(q) ||
          d.BOSS_NAME?.toLowerCase().includes(q) ||
          d.CUST_ADDR1?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [currentFilter, custinfodatatable, searchKeyword]);

  // Đếm số lượng theo nhóm
  const counts = useMemo(() => {
    const total = custinfodatatable.length;
    let kh = 0;
    let ncc = 0;
    let use = 0;
    let off = 0;
    custinfodatatable.forEach((d) => {
      if ((d.CUST_TYPE || "").trim().toUpperCase() === "KH") kh++;
      else ncc++;
      if (d.USE_YN === "Y") use++;
      else off++;
    });
    return { total, kh, ncc, use, off };
  }, [custinfodatatable]);

  // Xuất Excel
  const handleExportEX1 = useCallback(() => {
    SaveExcel(filteredData, "DANH_SACH_DOI_TAC_LOC");
  }, [filteredData]);

  const handleExportEX2 = useCallback(() => {
    SaveExcel(custinfodatatable, "DANH_SACH_DOI_TAC_FULL");
  }, [custinfodatatable]);

  // Cấu hình Pivot Table
  const pivotDataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: [
        { caption: "Phân loại", dataField: "CUST_TYPE", area: "row" },
        { caption: "Trạng thái", dataField: "USE_YN", area: "column" },
        { caption: "Tên KD", dataField: "CUST_NAME_KD", area: "filter" },
        { caption: "Địa chỉ", dataField: "CUST_ADDR1", area: "filter" },
        { summaryType: "count", area: "data", caption: "Số lượng đối tác" },
      ],
      store: custinfodatatable,
    });
  }, [custinfodatatable]);

  // Cột AG-Grid
  const columns = useMemo(() => getPrecisionCustColumns(handleOpenEditRow), [handleOpenEditRow]);

  useEffect(() => {
    handleCUSTINFO();
  }, [handleCUSTINFO]);

  return (
    <div className="precision-cust">
      {/* 1. Sub-Header */}
      <PrecisionCustHeader onRefresh={handleCUSTINFO} />

      {/* 2. Realtime KPI Cards */}
      <PrecisionCustKpi custData={custinfodatatable} />

      {/* 3. Action Toolbar */}
      <PrecisionCustToolbar
        currentFilter={currentFilter}
        onChangeFilter={setCurrentFilter}
        searchKeyword={searchKeyword}
        onChangeSearch={setSearchKeyword}
        onAddNew={handleOpenAddNew}
        onEditSelected={handleOpenEditSelected}
        onRefresh={handleCUSTINFO}
        onExportEX1={handleExportEX1}
        onExportEX2={handleExportEX2}
        onOpenPivot={() => setShowPivot(true)}
        counts={counts}
      />

      {/* 4. AG-Grid Workspace */}
      <div className="precision-cust__gridContainer">
        <div className="grid-meta-bar">
          <div className="meta-left">
            <span>
              Đang hiển thị: <strong>{filteredData.length}</strong> / {custinfodatatable.length} đối tác
            </span>
            {selectedRows.CUST_CD && (
              <span>
                • Đang chọn: <strong>{selectedRows.CUST_CD}</strong> ({selectedRows.CUST_NAME_KD})
              </span>
            )}
          </div>
          <div className="meta-right">
            <span>Dữ liệu máy chủ ERP chuẩn hóa</span>
          </div>
        </div>

        <div className="grid-body">
          <AGTable
            columns={columns}
            data={filteredData}
            showFilter={true}
            onRowClick={(params: any) => {
              clickedRowRef.current = params.data;
              setSelectedRows(params.data);
            }}
          />
        </div>
      </div>

      {/* 5. Modal Thêm / Sửa Đối Tác Siêu Đẹp Chuẩn Stitch */}
      <PrecisionCustModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        custInfo={selectedRows}
        onChangeField={handleChangeField}
        onAutoGenCode={handleModalAutoGenCode}
        onClearForm={handleClearModalForm}
        onSaveAdd={handle_addCustomer}
        onSaveEdit={handle_editCustomer}
        isNewMode={isNewMode}
      />

      {/* 6. Modal Phân Tích Pivot Table */}
      <PrecisionCustPivotModal
        isOpen={showPivot}
        onClose={() => setShowPivot(false)}
        dataSource={pivotDataSource}
      />
    </div>
  );
};

export default React.memo(CUST_MANAGER);

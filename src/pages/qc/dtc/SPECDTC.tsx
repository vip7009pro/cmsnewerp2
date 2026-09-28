import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { FiSearch, FiRefreshCw, FiDownload, FiPieChart } from "react-icons/fi";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { SaveExcel } from "../../../api/services/excelService";
import { getDisplayedGridRows } from "../../../components/DataTable/gridExportUtils";
import AGTable from "../../../components/DataTable/AGTable";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { DTC_SPEC_DATA, TestListTable } from "../interfaces/qcInterface";
import { f_loadDTC_TestList } from "../utils/qcUtils";

import "./PrecisionSPECDTC/PrecisionSPECDTC.scss";
import PrecisionSPECDTCKpi from "./PrecisionSPECDTC/PrecisionSPECDTCKpi";
import PrecisionSPECDTCSidebar from "./PrecisionSPECDTC/PrecisionSPECDTCSidebar";
import { getPrecisionSPECDTCColumns } from "./PrecisionSPECDTC/PrecisionSPECDTCColumns";

// Mobile Subcomponents
import PrecisionSPECDTCMobileHeader from "./PrecisionSPECDTC/PrecisionSPECDTCMobileHeader";
import PrecisionSPECDTCMobileKpi from "./PrecisionSPECDTC/PrecisionSPECDTCMobileKpi";
import PrecisionSPECDTCMobileToolbar from "./PrecisionSPECDTC/PrecisionSPECDTCMobileToolbar";
import PrecisionSPECDTCMobileFilterDrawer from "./PrecisionSPECDTC/PrecisionSPECDTCMobileFilterDrawer";

const SPECDTC: React.FC = () => {
  const isMobile = useIsMobile();

  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [testname, setTestName] = useState("0");
  const [testtype, setTestType] = useState("0");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");

  const [inspectiondatatable, setInspectionDataTable] = useState<DTC_SPEC_DATA[]>([]);
  const [testlist, setTestList] = useState<TestListTable[]>([]);
  const [quickFilterText, setQuickFilterText] = useState("");

  // Trạng thái chuyên biệt cho Mobile ERP
  const [showMobileKpi, setShowMobileKpi] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showTableFilter, setShowTableFilter] = useState(true);

  // Nạp danh mục các hạng mục kiểm tra
  const getTestList = async () => {
    const tempList: TestListTable[] = await f_loadDTC_TestList();
    tempList.unshift({
      TEST_CODE: 0, TEST_NAME: "ALL", SELECTED: false,
      TEST_TIME: undefined
    });
    setTestList(tempList);
  };

  // Tra cứu dữ liệu SPEC DTC
  const handletraDTCData = useCallback(() => {
    Swal.fire({
      title: "Tra cứu SPEC Vật liệu - Sản phẩm",
      text: "Đang tải dữ liệu, hãy chờ chút...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });

    generalQuery("dtcspec", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      M_NAME: m_name,
      M_CODE: m_code,
      TEST_NAME: testname,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,
      ID: id,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_SPEC_DATA[] = response.data.data.map(
            (element: DTC_SPEC_DATA, index: number) => {
              return {
                ...element,
                G_NAME:
                  getAuditMode() === 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search("CNDB") === -1
                      ? element?.G_NAME
                      : "TEM_NOI_BO",
                id: index,
              };
            }
          );
          setInspectionDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            `Đã tải ${response.data.data.length.toLocaleString("vi-VN")} dòng tiêu chuẩn`,
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error loading dtcspec:", error);
        Swal.fire("Lỗi kết nối", "Không thể kết nối đến máy chủ", "error");
      });
  }, [alltime, fromdate, todate, codeCMS, codeKD, m_name, m_code, testname, prodrequestno, testtype, id]);

  // Reset bộ lọc về mặc định
  const handleResetFilter = useCallback(() => {
    setCodeKD("");
    setCodeCMS("");
    setM_Name("");
    setM_Code("");
    setTestName("0");
    setProdRequestNo("");
    setAllTime(false);
    setQuickFilterText("");
  }, []);

  // Lọc dữ liệu nhanh theo từ khoá
  const filteredData = useMemo(() => {
    if (!quickFilterText.trim()) return inspectiondatatable;
    const query = quickFilterText.toLowerCase().trim();
    return inspectiondatatable.filter((item) => {
      return (
        item.CUST_NAME_KD?.toLowerCase().includes(query) ||
        item.G_CODE?.toLowerCase().includes(query) ||
        item.G_NAME?.toLowerCase().includes(query) ||
        item.TEST_NAME?.toLowerCase().includes(query) ||
        item.POINT_NAME?.toLowerCase().includes(query) ||
        item.M_NAME?.toLowerCase().includes(query) ||
        item.M_CODE?.toLowerCase().includes(query) ||
        item.BARCODE_CONTENT?.toLowerCase().includes(query) ||
        item.REMARK?.toLowerCase().includes(query)
      );
    });
  }, [inspectiondatatable, quickFilterText]);

  // Xuất Excel EX1: Dữ liệu đang lọc
  const handleExportEX1 = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Cảnh báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(
      getDisplayedGridRows(undefined, filteredData),
      `DTC_SPEC_FILTERED_${moment().format("YYYYMMDD_HHmm")}`
    );
  }, [filteredData]);

  // Xuất Excel EX2: Toàn bộ dữ liệu
  const handleExportEX2 = useCallback(() => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Cảnh báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(inspectiondatatable, `DTC_SPEC_ALL_${moment().format("YYYYMMDD_HHmm")}`);
  }, [inspectiondatatable]);

  // Mở phân tích Pivot
  const handleOpenPivot = useCallback(() => {
    Swal.fire("Tính năng PIVOT", "Bảng Pivot phân tích đang được cập nhật", "info");
  }, []);

  // Áp dụng bộ lọc từ Mobile Filter Drawer
  const handleApplyMobileFilter = useCallback((filters: {
    codeKD: string;
    codeCMS: string;
    m_name: string;
    m_code: string;
    testname: string;
    prodrequestno: string;
    alltime: boolean;
  }) => {
    setCodeKD(filters.codeKD);
    setCodeCMS(filters.codeCMS);
    setM_Name(filters.m_name);
    setM_Code(filters.m_code);
    setTestName(filters.testname);
    setProdRequestNo(filters.prodrequestno);
    setAllTime(filters.alltime);
  }, []);

  // Đếm số bộ lọc đang kích hoạt
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (codeKD.trim()) count++;
    if (codeCMS.trim()) count++;
    if (m_name.trim()) count++;
    if (m_code.trim()) count++;
    if (testname !== "0") count++;
    if (prodrequestno.trim()) count++;
    if (alltime) count++;
    return count;
  }, [codeKD, codeCMS, m_name, m_code, testname, prodrequestno, alltime]);

  useEffect(() => {
    getTestList();
  }, []);

  const columns = useMemo(() => getPrecisionSPECDTCColumns(), []);

  // Tên test đang chọn để gửi vào KPI
  const activeTestObj = testlist.find((t) => String(t.TEST_CODE) === String(testname));
  const activeTestLabel = activeTestObj ? activeTestObj.TEST_NAME : "ALL";

  return (
    <div className={`precision-specdtc ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================================= */}
      {/* GIAO DIỆN DESKTOP (> 768px): GIỮ NGUYÊN 100% BỐ CỤC BAN ĐẦU             */}
      {/* ========================================================================= */}
      {!isMobile && (
        <>
          {/* 1. Micro-cards KPI Realtime */}
          <PrecisionSPECDTCKpi
            tableData={filteredData}
            activeTestName={activeTestLabel}
          />

          {/* 2. Main Workspace Split Layout (Sidebar Trái & AGTable Phải) */}
          <div className="precision-specdtc__workspace">
            {/* Panel Bộ Lọc 250px bên trái */}
            <PrecisionSPECDTCSidebar
              codeKD={codeKD}
              setCodeKD={setCodeKD}
              codeCMS={codeCMS}
              setCodeCMS={setCodeCMS}
              m_name={m_name}
              setM_Name={setM_Name}
              m_code={m_code}
              setM_Code={setM_Code}
              testname={testname}
              setTestName={setTestName}
              testlist={testlist}
              prodrequestno={prodrequestno}
              setProdRequestNo={setProdRequestNo}
              alltime={alltime}
              setAllTime={setAllTime}
              onSearch={handletraDTCData}
              onReset={handleResetFilter}
            />

            {/* Khung Chứa Bảng Dữ Liệu AGTable High-Density bên phải */}
            <main className="precision-specdtc__gridContainer">
              {/* Toolbar Phía Trên Bảng: Nút EX1, EX2, PIVOT, Quick Search, Refresh */}
              <div className="precision-specdtc__gridToolbar">
                <div className="precision-specdtc__gridTitle">
                  <span className="dot" />
                  <span>Bảng Tiêu Chuẩn Kỹ Thuật DTC (Spec Data Grid)</span>
                  <span className="badge-count">
                    {filteredData.length.toLocaleString("vi-VN")} / {inspectiondatatable.length.toLocaleString("vi-VN")} rows
                  </span>
                </div>

                <div className="precision-specdtc__gridControls">
                  {/* Nút EX1 (Lọc) */}
                  <button
                    type="button"
                    className="precision-specdtc__btn precision-specdtc__btn--excel"
                    onClick={handleExportEX1}
                    title="Xuất Excel danh sách dữ liệu đang lọc"
                  >
                    <FiDownload style={{ fontSize: "12px" }} />
                    <span>EX1 (Lọc)</span>
                  </button>

                  {/* Nút EX2 (Toàn bộ) */}
                  <button
                    type="button"
                    className="precision-specdtc__btn precision-specdtc__btn--excelAll"
                    onClick={handleExportEX2}
                    title="Xuất toàn bộ dữ liệu ra Excel"
                  >
                    <FiDownload style={{ fontSize: "12px" }} />
                    <span>EX2 (Toàn bộ)</span>
                  </button>

                  {/* Nút PIVOT */}
                  <button
                    type="button"
                    className="precision-specdtc__btn precision-specdtc__btn--pivot"
                    onClick={handleOpenPivot}
                    title="Mở phân tích bảng Pivot đa chiều"
                  >
                    <FiPieChart style={{ fontSize: "12px" }} />
                    <span>PIVOT</span>
                  </button>

                  {/* Quick Search */}
                  <div className="precision-specdtc__searchBox">
                    <FiSearch style={{ color: "#94a3b8", fontSize: "11px" }} />
                    <input
                      type="text"
                      placeholder="Lọc nhanh trên lưới..."
                      value={quickFilterText}
                      onChange={(e) => setQuickFilterText(e.target.value)}
                    />
                  </div>

                  {/* Nút Refresh */}
                  <button
                    type="button"
                    className="precision-specdtc__btn precision-specdtc__btn--refresh"
                    onClick={handletraDTCData}
                    title="Tải lại dữ liệu"
                  >
                    <FiRefreshCw style={{ fontSize: "11px" }} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Body Chứa AGTable */}
              <div className="precision-specdtc__gridBody">
                <AGTable
                  rowHeight={32}
                  columns={columns}
                  data={filteredData}
                />
              </div>
            </main>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIỆN MOBILE (≤ 768px): TỐI ƯU CÔNG THÁI HỌC VÀ TỐI ĐA KHÔNG GIAN  */}
      {/* ========================================================================= */}
      {isMobile && (
        <>
          {/* 1. Mobile Header Tinh Gọn */}
          <PrecisionSPECDTCMobileHeader
            totalCount={inspectiondatatable.length}
            filteredCount={filteredData.length}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi(!showMobileKpi)}
            onOpenFilterDrawer={() => setShowMobileFilter(true)}
            onReload={handletraDTCData}
            activeFilterCount={activeFilterCount}
          />

          {/* 2. Micro-KPI Bar Cuộn Ngang (Bật/Tắt theo nhu cầu người dùng) */}
          {showMobileKpi && (
            <PrecisionSPECDTCMobileKpi
              tableData={filteredData}
              activeTestName={activeTestLabel}
            />
          )}

          {/* 3. Mobile Toolbar 3 Hàng Công Thái Học */}
          <PrecisionSPECDTCMobileToolbar
            searchKeyword={quickFilterText}
            onSearchChange={setQuickFilterText}
            onSearch={handletraDTCData}
            onOpenFilterDrawer={() => setShowMobileFilter(true)}
            activeFilterCount={activeFilterCount}
            onReload={handletraDTCData}
            alltime={alltime}
            onToggleAllTime={() => setAllTime(!alltime)}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={handleOpenPivot}
            showTableFilter={showTableFilter}
            onToggleTableFilter={() => setShowTableFilter(!showTableFilter)}
            onResetFilter={handleResetFilter}
          />

          {/* 4. AGTable Container Chiếm Trọn Không Gian Còn Lại */}
          <div className="precision-specdtc__mobileGridContainer">
            <AGTable
              rowHeight={30}
              columns={columns}
              data={filteredData}
              showFilter={showTableFilter}
            />
          </div>

          {/* 5. Bottom Sheet Filter Drawer (Zero-Blur) */}
          {showMobileFilter && (
            <PrecisionSPECDTCMobileFilterDrawer
              isOpen={showMobileFilter}
              onClose={() => setShowMobileFilter(false)}
              codeKD={codeKD}
              codeCMS={codeCMS}
              m_name={m_name}
              m_code={m_code}
              testname={testname}
              testlist={testlist}
              prodrequestno={prodrequestno}
              alltime={alltime}
              onApply={handleApplyMobileFilter}
              onReset={handleResetFilter}
            />
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(SPECDTC);

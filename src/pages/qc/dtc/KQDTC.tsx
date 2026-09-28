import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { FiDownload, FiSearch } from "react-icons/fi";
import { generalQuery, getAuditMode } from "../../../api/Api";
import AGTable from "../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../api/services/excelService";
import { getDisplayedGridRows } from "../../../components/DataTable/gridExportUtils";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { CPK_DATA, DTC_DATA, HISTOGRAM_DATA, TestListTable, XBAR_DATA } from "../interfaces/qcInterface";
import { f_loadDTC_TestList } from "../utils/qcUtils";

import "./PrecisionKQDTC/PrecisionKQDTC.scss";
import PrecisionKQDTCKpi from "./PrecisionKQDTC/PrecisionKQDTCKpi";
import PrecisionKQDTCSidebar from "./PrecisionKQDTC/PrecisionKQDTCSidebar";
import PrecisionKQDTCCharts from "./PrecisionKQDTC/PrecisionKQDTCCharts";
import { buildDTCColumns } from "./PrecisionKQDTC/PrecisionKQDTCColumns";

// Mobile Subcomponents
import PrecisionKQDTCMobileHeader from "./PrecisionKQDTC/PrecisionKQDTCMobileHeader";
import PrecisionKQDTCMobileKpi from "./PrecisionKQDTC/PrecisionKQDTCMobileKpi";
import PrecisionKQDTCMobileToolbar from "./PrecisionKQDTC/PrecisionKQDTCMobileToolbar";
import PrecisionKQDTCMobileFilterDrawer from "./PrecisionKQDTC/PrecisionKQDTCMobileFilterDrawer";
import PrecisionKQDTCMobileChartsModal from "./PrecisionKQDTC/PrecisionKQDTCMobileChartsModal";

const KQDTC = () => {
  const isMobile = useIsMobile();
  const isLoading = useRef<boolean>(false);

  // 1. Quản lý trạng thái bộ lọc
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
  const [searchKeyword, setSearchKeyword] = useState("");

  // 2. Dữ liệu bảng & Biểu đồ
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<DTC_DATA>>([]);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [xbar, setXbar] = useState<XBAR_DATA[]>([]);
  const [cpk, setCPK] = useState<CPK_DATA[]>([]);
  const [histogram, setHistogram] = useState<HISTOGRAM_DATA[]>([]);
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [isChartsCollapsed, setIsChartsCollapsed] = useState(false);

  // 3. Trạng thái chuyên biệt cho Mobile ERP
  const [showMobileKpi, setShowMobileKpi] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileCharts, setShowMobileCharts] = useState(false);
  const [onlyNG, setOnlyNG] = useState(false);
  const [showTableFilter, setShowTableFilter] = useState(true);

  // Nạp danh mục Test
  useEffect(() => {
    f_loadDTC_TestList().then((tempList: TestListTable[]) => {
      setTestList(tempList);
    });
  }, []);

  // 4. API Nạp Dữ Liệu Biểu Đồ SPC khi nhấp đúp dòng
  const getXbar = async (DATA: any) => {
    try {
      const response = await generalQuery("loadXbarData", {
        ALLTIME: alltime,
        FROM_DATE: fromdate,
        TO_DATE: todate,
        G_CODE: DATA.G_CODE,
        G_NAME: codeKD,
        M_NAME: DATA.M_NAME,
        M_CODE: DATA.M_CODE,
        TEST_CODE: DATA.TEST_CODE,
        PROD_REQUEST_NO: prodrequestno,
        TEST_TYPE: testtype,
        POINT_CODE: DATA.POINT_CODE,
      });

      if (response.data.tk_status !== "NG") {
        let totalXBAR = 0;
        let totalR = 0;
        const cnt = response.data.data.length;
        for (let i = 0; i < cnt; i++) {
          totalXBAR += response.data.data[i].AVG_VALUE;
          totalR += response.data.data[i].R_VALUE;
        }
        const avgXBAR = cnt > 0 ? totalXBAR / cnt : 0;
        const avgR = cnt > 0 ? totalR / cnt : 0;
        const loadeddata: XBAR_DATA[] = response.data.data.map(
          (element: XBAR_DATA, index: number) => ({
            ...element,
            X_UCL: avgXBAR + avgR * 0.577,
            X_CL: avgXBAR,
            X_LCL: avgXBAR - avgR * 0.577,
            R_UCL: avgR * 0,
            R_CL: avgR,
            R_LCL: avgR * 2.114,
            id: index,
          })
        );
        setXbar(loadeddata);
      } else {
        setXbar([]);
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCPK = async (DATA: any) => {
    try {
      const response = await generalQuery("loadCPKTrend", {
        ALLTIME: alltime,
        FROM_DATE: fromdate,
        TO_DATE: todate,
        G_CODE: DATA.G_CODE,
        G_NAME: codeKD,
        M_NAME: DATA.M_NAME,
        M_CODE: DATA.M_CODE,
        TEST_CODE: DATA.TEST_CODE,
        PROD_REQUEST_NO: prodrequestno,
        TEST_TYPE: testtype,
        POINT_CODE: DATA.POINT_CODE,
      });

      if (response.data.tk_status !== "NG") {
        const loadeddata: CPK_DATA[] = response.data.data.map(
          (element: CPK_DATA, index: number) => ({
            ...element,
            CPK1: 1.33,
            CPK2: 1.67,
            id: index,
          })
        );
        setCPK(loadeddata);
      } else {
        setCPK([]);
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getHistogram = async (DATA: any) => {
    try {
      const response = await generalQuery("loadHistogram", {
        ALLTIME: alltime,
        FROM_DATE: fromdate,
        TO_DATE: todate,
        G_CODE: DATA.G_CODE,
        G_NAME: codeKD,
        M_NAME: DATA.M_NAME,
        M_CODE: DATA.M_CODE,
        TEST_CODE: DATA.TEST_CODE,
        PROD_REQUEST_NO: prodrequestno,
        TEST_TYPE: testtype,
        POINT_CODE: DATA.POINT_CODE,
      });

      if (response.data.tk_status !== "NG") {
        const loadeddata: HISTOGRAM_DATA[] = response.data.data.map(
          (element: HISTOGRAM_DATA, index: number) => ({
            ...element,
            id: index,
          })
        );
        setHistogram(loadeddata);
      } else {
        setHistogram([]);
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 5. Tra cứu dữ liệu kiểm tra ĐTC
  const handletraDTCData = useCallback(
    (customParams?: {
      fromdate?: string;
      todate?: string;
      alltime?: boolean;
      codeKD?: string;
      codeCMS?: string;
      m_name?: string;
      m_code?: string;
      testname?: string;
      prodrequestno?: string;
      testtype?: string;
      id?: string;
    }) => {
      const p_alltime = customParams?.alltime !== undefined ? customParams.alltime : alltime;
      const p_fromdate = customParams?.fromdate !== undefined ? customParams.fromdate : fromdate;
      const p_todate = customParams?.todate !== undefined ? customParams.todate : todate;
      const p_codeCMS = customParams?.codeCMS !== undefined ? customParams.codeCMS : codeCMS;
      const p_codeKD = customParams?.codeKD !== undefined ? customParams.codeKD : codeKD;
      const p_m_name = customParams?.m_name !== undefined ? customParams.m_name : m_name;
      const p_m_code = customParams?.m_code !== undefined ? customParams.m_code : m_code;
      const p_testname = customParams?.testname !== undefined ? customParams.testname : testname;
      const p_prodrequestno =
        customParams?.prodrequestno !== undefined ? customParams.prodrequestno : prodrequestno;
      const p_testtype = customParams?.testtype !== undefined ? customParams.testtype : testtype;
      const p_id = customParams?.id !== undefined ? customParams.id : id;

      generalQuery("dtcdata", {
        ALLTIME: p_alltime,
        FROM_DATE: p_fromdate,
        TO_DATE: p_todate,
        G_CODE: p_codeCMS,
        G_NAME: p_codeKD,
        M_NAME: p_m_name,
        M_CODE: p_m_code,
        TEST_NAME: p_testname,
        PROD_REQUEST_NO: p_prodrequestno,
        TEST_TYPE: p_testtype,
        ID: p_id,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const loadeddata: DTC_DATA[] = response.data.data.map(
              (element: DTC_DATA, index: number) => ({
                ...element,
                G_NAME:
                  getAuditMode() === 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search("CNDB") === -1
                      ? element?.G_NAME
                      : "TEM_NOI_BO",
                TEST_FINISH_TIME: moment.utc(element.TEST_FINISH_TIME).format("YYYY-MM-DD HH:mm:ss"),
                REQUEST_DATETIME: moment.utc(element.REQUEST_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
                DANHGIA:
                  element.RESULT >= element.CENTER_VALUE - element.LOWER_TOR &&
                    element.RESULT <= element.CENTER_VALUE + element.UPPER_TOR
                    ? "OK"
                    : "NG",
                id: index,
              })
            );
            setInspectionDataTable(loadeddata);
            Swal.fire("Thành Công", `Đã nạp ${loadeddata.length} dòng kết quả kiểm tra ĐTC`, "success");
          } else {
            setInspectionDataTable([]);
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Lỗi Máy Chủ", "Không thể nạp dữ liệu kết quả ĐTC", "error");
        });
    },
    [alltime, fromdate, todate, codeCMS, codeKD, m_name, m_code, testname, prodrequestno, testtype, id]
  );

  // Thiết lập lại bộ lọc
  const handleResetFilter = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setAllTime(false);
    setCodeKD("");
    setCodeCMS("");
    setM_Name("");
    setM_Code("");
    setTestName("0");
    setTestType("0");
    setProdRequestNo("");
    setID("");
    setSearchKeyword("");
    setOnlyNG(false);
  }, []);

  // 6. Đếm số điều kiện lọc nâng cao đang active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (alltime) count++;
    if (codeKD.trim() !== "") count++;
    if (codeCMS.trim() !== "") count++;
    if (m_name.trim() !== "") count++;
    if (m_code.trim() !== "") count++;
    if (testname !== "0") count++;
    if (testtype !== "0") count++;
    if (prodrequestno.trim() !== "") count++;
    if (id.trim() !== "") count++;
    return count;
  }, [alltime, codeKD, codeCMS, m_name, m_code, testname, testtype, prodrequestno, id]);

  // Áp dụng bộ lọc từ Mobile Drawer
  const handleApplyMobileFilter = useCallback(
    (filters: {
      fromdate: string;
      todate: string;
      alltime: boolean;
      codeKD: string;
      codeCMS: string;
      m_name: string;
      m_code: string;
      testname: string;
      prodrequestno: string;
      testtype: string;
      id: string;
    }) => {
      setFromDate(filters.fromdate);
      setToDate(filters.todate);
      setAllTime(filters.alltime);
      setCodeKD(filters.codeKD);
      setCodeCMS(filters.codeCMS);
      setM_Name(filters.m_name);
      setM_Code(filters.m_code);
      setTestName(filters.testname);
      setProdRequestNo(filters.prodrequestno);
      setTestType(filters.testtype);
      setID(filters.id);

      handletraDTCData(filters);
    },
    [handletraDTCData]
  );

  // 7. Cấu hình cột bảng
  const columns = useMemo(() => buildDTCColumns(), []);

  // 8. Lọc dữ liệu tức thời qua ô tìm kiếm và chế độ lọc nhanh
  const filteredData = useMemo(() => {
    let list = inspectiondatatable;

    // Lọc theo cờ Chỉ mẫu NG
    if (onlyNG) {
      list = list.filter((item) => item.DANHGIA === "NG");
    }

    if (!searchKeyword.trim()) return list;
    const kw = searchKeyword.toLowerCase().trim();
    return list.filter(
      (item) =>
        String(item.DTC_ID || "").toLowerCase().includes(kw) ||
        String(item.PROD_REQUEST_NO || "").toLowerCase().includes(kw) ||
        String(item.G_CODE || "").toLowerCase().includes(kw) ||
        String(item.G_NAME || "").toLowerCase().includes(kw) ||
        String(item.M_NAME || "").toLowerCase().includes(kw) ||
        String(item.M_CODE || "").toLowerCase().includes(kw) ||
        String(item.TEST_NAME || "").toLowerCase().includes(kw) ||
        String(item.DANHGIA || "").toLowerCase().includes(kw) ||
        String(item.POINT_CODE || "").toLowerCase().includes(kw)
    );
  }, [inspectiondatatable, searchKeyword, onlyNG]);

  // 9. Xử lý nhấp đúp dòng
  const handleRowDoubleClick = useCallback(
    async (e: any) => {
      if (!e?.data) return;
      Swal.fire({
        title: "Đang Tải Biểu Đồ SPC",
        text: "Hệ thống đang truy vấn các thông số SPC, xin vui lòng chờ...",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      setSelectedData(e.data);
      if (!isLoading.current) {
        isLoading.current = true;
        await Promise.all([getXbar(e.data), getCPK(e.data), getHistogram(e.data)])
          .then(() => {
            isLoading.current = false;
            Swal.fire("Đã Tải Thành Công", "Dữ liệu SPC (Histogram, Xbar, R, Cpk) đã sẵn sàng", "success");
            // Tự động mở modal biểu đồ trên Mobile để xem tiện lợi
            if (isMobile) {
              setShowMobileCharts(true);
            }
          })
          .catch((err) => {
            isLoading.current = false;
            console.error(err);
            Swal.fire("Lỗi", "Không thể nạp dữ liệu SPC", "error");
          });
      } else {
        Swal.fire("Thông báo", "Dữ liệu đang được tải, vui lòng đợi trong giây lát", "warning");
      }
    },
    [alltime, fromdate, todate, codeKD, prodrequestno, testtype, isMobile]
  );

  return (
    <div className={`precision-kqdtc ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================================= */}
      {/* GIAO DIỆN DESKTOP (> 768px): BẢO TOÀN NGUYÊN VẸN 100% CẤU TRÚC VÀ HÀNH VI */}
      {/* ========================================================================= */}
      {!isMobile && (
        <>
          {/* 1. Micro-cards KPI Realtime */}
          <PrecisionKQDTCKpi tableData={filteredData} xbarData={xbar} cpkData={cpk} />

          {/* 2. Main Workspace Split Layout */}
          <div className="precision-kqdtc__workspace">
            {/* Left Filter Sidebar */}
            <PrecisionKQDTCSidebar
              fromdate={fromdate}
              setFromDate={setFromDate}
              todate={todate}
              setToDate={setToDate}
              alltime={alltime}
              setAllTime={setAllTime}
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
              testList={testList}
              prodrequestno={prodrequestno}
              setProdRequestNo={setProdRequestNo}
              testtype={testtype}
              setTestType={setTestType}
              id={id}
              setID={setID}
              onSubmit={() => handletraDTCData()}
              onReset={handleResetFilter}
            />

            {/* Right Main Content (Charts Section + High-Density AGTable) */}
            <div className="precision-kqdtc__mainPanel">
              {/* Top: 4 SPC Charts Workspace */}
              <PrecisionKQDTCCharts
                selectedData={selectedData}
                xbarData={xbar}
                cpkData={cpk}
                histogramData={histogram}
                isCollapsed={isChartsCollapsed}
                onToggleCollapse={() => setIsChartsCollapsed(!isChartsCollapsed)}
              />

              {/* Bottom: AGTable Container */}
              <div className="precision-kqdtc__tableSection">
                {/* Table Control Toolbar */}
                <div className="precision-kqdtc__tableToolbar">
                  <div className="precision-kqdtc__toolbarLeft">
                    <button
                      type="button"
                      className="precision-kqdtc__btnAction precision-kqdtc__btnAction--ex1"
                      onClick={() =>
                        SaveExcel(
                          getDisplayedGridRows(undefined, filteredData),
                          "DTC_Data_DangLoc"
                        )
                      }
                    >
                      <FiDownload size={13} />
                      <span>EX1 (Lọc)</span>
                    </button>
                    <button
                      type="button"
                      className="precision-kqdtc__btnAction precision-kqdtc__btnAction--ex2"
                      onClick={() => SaveExcel(inspectiondatatable, "DTC_Data_ToanBo")}
                    >
                      <FiDownload size={13} />
                      <span>EX2 (Toàn bộ)</span>
                    </button>
                  </div>

                  <div className="precision-kqdtc__toolbarRight">
                    <div className="precision-kqdtc__searchBox">
                      <FiSearch size={12} color="#94a3b8" />
                      <input
                        type="text"
                        placeholder="Lọc nhanh kết quả..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                    <span className="precision-kqdtc__countBadge">
                      {filteredData.length.toLocaleString()} / {inspectiondatatable.length.toLocaleString()} rows
                    </span>
                  </div>
                </div>

                {/* Scrollable AGTable */}
                <div className="precision-kqdtc__tableBody">
                  <AGTable
                    rowHeight={28}
                    columns={columns}
                    data={filteredData}
                    suppressRowClickSelection={false}
                    showFilter={true}
                    onRowDoubleClick={handleRowDoubleClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIỆN MOBILE (≤ 768px): TỐI ƯU CÔNG THÁI HỌC VÀ TỐI ĐA KHÔNG GIAN BẢNG */}
      {/* ========================================================================= */}
      {isMobile && (
        <>
          {/* 1. Mobile Header Tinh Gọn */}
          <PrecisionKQDTCMobileHeader
            totalCount={inspectiondatatable.length}
            filteredCount={filteredData.length}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi(!showMobileKpi)}
            onOpenFilterDrawer={() => setShowMobileFilter(true)}
            onOpenChartsModal={() => setShowMobileCharts(true)}
            hasSelectedChart={Boolean(selectedData)}
            onReload={() => handletraDTCData()}
            activeFilterCount={activeFilterCount}
          />

          {/* 2. Micro-KPI Bar Cuộn Ngang (Bật/Tắt theo nhu cầu người dùng) */}
          {showMobileKpi && (
            <PrecisionKQDTCMobileKpi
              tableData={filteredData}
              xbarData={xbar}
              cpkData={cpk}
              selectedData={selectedData}
            />
          )}

          {/* 3. Mobile Toolbar 3 Hàng Công Thái Học */}
          <PrecisionKQDTCMobileToolbar
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onOpenFilterDrawer={() => setShowMobileFilter(true)}
            activeFilterCount={activeFilterCount}
            onReload={() => handletraDTCData()}
            onlyNG={onlyNG}
            onToggleOnlyNG={() => setOnlyNG(!onlyNG)}
            alltime={alltime}
            onToggleAllTime={() => setAllTime(!alltime)}
            onOpenChartsModal={() => setShowMobileCharts(true)}
            hasSelectedData={Boolean(selectedData)}
            selectedTestName={selectedData?.TEST_NAME}
            onExportEX1={() =>
              SaveExcel(getDisplayedGridRows(undefined, filteredData), "DTC_Data_DangLoc")
            }
            onExportEX2={() => SaveExcel(inspectiondatatable, "DTC_Data_ToanBo")}
            showTableFilter={showTableFilter}
            onToggleTableFilter={() => setShowTableFilter(!showTableFilter)}
            onResetFilter={handleResetFilter}
          />

          {/* 4. AGTable Container Chiếm Trọn Không Gian Còn Lại */}
          <div className="precision-kqdtc__mobileGridContainer">
            <AGTable
              rowHeight={30}
              columns={columns}
              data={filteredData}
              suppressRowClickSelection={false}
              showFilter={showTableFilter}
              onRowDoubleClick={handleRowDoubleClick}
            />
          </div>

          {/* 5. Bottom Sheet Filter Drawer (Zero-Blur) */}
          {showMobileFilter && (
            <PrecisionKQDTCMobileFilterDrawer
              isOpen={showMobileFilter}
              onClose={() => setShowMobileFilter(false)}
              fromdate={fromdate}
              todate={todate}
              alltime={alltime}
              codeKD={codeKD}
              codeCMS={codeCMS}
              m_name={m_name}
              m_code={m_code}
              testname={testname}
              testList={testList}
              prodrequestno={prodrequestno}
              testtype={testtype}
              id={id}
              onApply={handleApplyMobileFilter}
              onReset={handleResetFilter}
            />
          )}

          {/* 6. Modal Xem Biểu Đồ SPC Chuyên Dụng Trên Mobile */}
          {showMobileCharts && (
            <PrecisionKQDTCMobileChartsModal
              isOpen={showMobileCharts}
              onClose={() => setShowMobileCharts(false)}
              selectedData={selectedData}
              xbarData={xbar}
              cpkData={cpk}
              histogramData={histogram}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KQDTC;

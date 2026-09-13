import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { FiDownload, FiSearch } from "react-icons/fi";
import { generalQuery, getAuditMode } from "../../../api/Api";
import AGTable from "../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../api/services/excelService";
import { CPK_DATA, DTC_DATA, HISTOGRAM_DATA, TestListTable, XBAR_DATA } from "../interfaces/qcInterface";
import { f_loadDTC_TestList } from "../utils/qcUtils";

import "./PrecisionKQDTC/PrecisionKQDTC.scss";
import PrecisionKQDTCKpi from "./PrecisionKQDTC/PrecisionKQDTCKpi";
import PrecisionKQDTCSidebar from "./PrecisionKQDTC/PrecisionKQDTCSidebar";
import PrecisionKQDTCCharts from "./PrecisionKQDTC/PrecisionKQDTCCharts";
import { buildDTCColumns } from "./PrecisionKQDTC/PrecisionKQDTCColumns";

const KQDTC = () => {
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

  // Nạp danh mục Test
  useEffect(() => {
    f_loadDTC_TestList().then((tempList: TestListTable[]) => {
      setTestList(tempList);
    });
  }, []);

  // 3. API Nạp Dữ Liệu Biểu Đồ SPC khi nhấp đúp dòng
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

  // 4. Tra cứu dữ liệu kiểm tra ĐTC
  const handletraDTCData = useCallback(() => {
    generalQuery("dtcdata", {
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
  }, [alltime, fromdate, todate, codeCMS, codeKD, m_name, m_code, testname, prodrequestno, testtype, id]);

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
  }, []);

  // 5. Cấu hình cột bảng
  const columns = useMemo(() => buildDTCColumns(), []);

  // 6. Lọc dữ liệu tức thời qua ô tìm kiếm
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return inspectiondatatable;
    const kw = searchKeyword.toLowerCase().trim();
    return inspectiondatatable.filter(
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
  }, [inspectiondatatable, searchKeyword]);

  // 7. Xử lý nhấp đúp dòng
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
    [alltime, fromdate, todate, codeKD, prodrequestno, testtype]
  );

  return (
    <div className="precision-kqdtc">
      {/* 1. Micro-cards KPI Realtime */}
      <PrecisionKQDTCKpi tableData={filteredData} xbarData={xbar} cpkData={cpk} />

      {/* 3. Main Workspace Split Layout */}
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
          onSubmit={handletraDTCData}
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
                  onClick={() => SaveExcel(filteredData, "DTC_Data_DangLoc")}
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
    </div>
  );
};

export default KQDTC;

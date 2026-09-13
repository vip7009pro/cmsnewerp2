import React from "react";
import { FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";
import { TestListTable } from "../../interfaces/qcInterface";

interface PrecisionKQDTCSidebarProps {
  fromdate: string;
  setFromDate: (v: string) => void;
  todate: string;
  setToDate: (v: string) => void;
  alltime: boolean;
  setAllTime: (v: boolean) => void;
  codeKD: string;
  setCodeKD: (v: string) => void;
  codeCMS: string;
  setCodeCMS: (v: string) => void;
  m_name: string;
  setM_Name: (v: string) => void;
  m_code: string;
  setM_Code: (v: string) => void;
  testname: string;
  setTestName: (v: string) => void;
  testList: TestListTable[];
  prodrequestno: string;
  setProdRequestNo: (v: string) => void;
  testtype: string;
  setTestType: (v: string) => void;
  id: string;
  setID: (v: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

const PrecisionKQDTCSidebar: React.FC<PrecisionKQDTCSidebarProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  alltime,
  setAllTime,
  codeKD,
  setCodeKD,
  codeCMS,
  setCodeCMS,
  m_name,
  setM_Name,
  m_code,
  setM_Code,
  testname,
  setTestName,
  testList,
  prodrequestno,
  setProdRequestNo,
  testtype,
  setTestType,
  id,
  setID,
  onSubmit,
  onReset,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <aside className="precision-kqdtc__sidebar">
      {/* Sidebar Header */}
      <div className="precision-kqdtc__sidebarHeader">
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FiFilter size={13} color="#2563eb" />
          <span>Bộ Lọc Dữ Liệu ĐTC</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: 10.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
          title="Thiết lập lại bộ lọc"
        >
          <FiRefreshCw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sidebar Form Body */}
      <div className="precision-kqdtc__sidebarBody">
        {/* Từ ngày */}
        <div className="precision-kqdtc__formItem">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={alltime}
            className="font-mono"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Tới ngày */}
        <div className="precision-kqdtc__formItem">
          <label>Tới ngày:</label>
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
            disabled={alltime}
            className="font-mono"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* All Time Checkbox */}
        <label className="precision-kqdtc__checkboxItem">
          <input
            type="checkbox"
            checked={alltime}
            onChange={(e) => setAllTime(e.target.checked)}
          />
          <span>All Time (Xem tất cả)</span>
        </label>

        <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "2px 0" }} />

        {/* Code KD */}
        <div className="precision-kqdtc__formItem">
          <label>Code KD (Khách Hàng):</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx"
            value={codeKD}
            onChange={(e) => setCodeKD(e.target.value)}
            className="font-mono"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Code ERP */}
        <div className="precision-kqdtc__formItem">
          <label>Code ERP:</label>
          <input
            type="text"
            placeholder="7C123xxx"
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
            className="font-mono"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Tên Liệu */}
        <div className="precision-kqdtc__formItem">
          <label>Tên Liệu:</label>
          <input
            type="text"
            placeholder="SJ-203020HC"
            value={m_name}
            onChange={(e) => setM_Name(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Mã Liệu CMS */}
        <div className="precision-kqdtc__formItem">
          <label>Mã Liệu CMS:</label>
          <input
            type="text"
            placeholder="A123456"
            value={m_code}
            onChange={(e) => setM_Code(e.target.value)}
            className="font-mono"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Hạng mục test */}
        <div className="precision-kqdtc__formItem">
          <label>Hạng mục test:</label>
          <select
            value={testname}
            onChange={(e) => setTestName(e.target.value)}
          >
            <option value="0">ALL (Tất cả)</option>
            {testList.map((item) => (
              <option key={item.TEST_CODE} value={item.TEST_CODE}>
                {item.TEST_NAME}
              </option>
            ))}
          </select>
        </div>

        {/* Số YCSX */}
        <div className="precision-kqdtc__formItem">
          <label>Số YCSX (Lệnh SX):</label>
          <input
            type="text"
            placeholder="1H23456"
            value={prodrequestno}
            onChange={(e) => setProdRequestNo(e.target.value)}
            className="font-mono"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Phân loại test */}
        <div className="precision-kqdtc__formItem">
          <label>Phân loại test:</label>
          <select
            value={testtype}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="0">ALL (Mass + Pilot)</option>
            <option value="1">FIRST_LOT</option>
            <option value="2">ECN</option>
            <option value="3">MASS PRODUCTION</option>
            <option value="4">SAMPLE</option>
          </select>
        </div>

        {/* DTC ID */}
        <div className="precision-kqdtc__formItem">
          <label>DTC ID:</label>
          <input
            type="text"
            placeholder="12345"
            value={id}
            onChange={(e) => setID(e.target.value)}
            className="font-mono"
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Sidebar Action Button */}
      <div className="precision-kqdtc__sidebarFooter">
        <button
          type="button"
          className="precision-kqdtc__btnSubmit"
          onClick={onSubmit}
        >
          <FiSearch size={14} />
          <span>TRA DATA ĐTC</span>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(PrecisionKQDTCSidebar);

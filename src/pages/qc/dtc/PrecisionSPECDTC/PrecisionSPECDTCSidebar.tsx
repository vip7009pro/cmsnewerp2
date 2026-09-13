import React from "react";
import { FiFilter, FiRotateCcw, FiSearch } from "react-icons/fi";
import { TestListTable } from "../../interfaces/qcInterface";

interface PrecisionSPECDTCSidebarProps {
  codeKD: string;
  setCodeKD: (val: string) => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  m_name: string;
  setM_Name: (val: string) => void;
  m_code: string;
  setM_Code: (val: string) => void;
  testname: string;
  setTestName: (val: string) => void;
  testlist: TestListTable[];
  prodrequestno: string;
  setProdRequestNo: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  onSearch: () => void;
  onReset: () => void;
}

const PrecisionSPECDTCSidebar: React.FC<PrecisionSPECDTCSidebarProps> = ({
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
  testlist,
  prodrequestno,
  setProdRequestNo,
  alltime,
  setAllTime,
  onSearch,
  onReset,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <aside className="precision-specdtc__sidebar">
      {/* Sidebar Header */}
      <div className="precision-specdtc__sidebarHeader">
        <div className="precision-specdtc__sidebarTitle">
          <FiFilter style={{ color: "#2563eb", fontSize: "13px" }} />
          <span>Điều Kiện Lọc Spec</span>
        </div>
        <button
          type="button"
          className="precision-specdtc__resetBtn"
          onClick={onReset}
          title="Khôi phục bộ lọc mặc định"
        >
          <FiRotateCcw style={{ fontSize: "11px" }} />
          <span>Reset</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="precision-specdtc__formFields">
        {/* 1. Code KD */}
        <div className="precision-specdtc__formGroup">
          <label>Mã Khách Hàng (Code KD)</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx"
            value={codeKD}
            onChange={(e) => setCodeKD(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 2. Code ERP */}
        <div className="precision-specdtc__formGroup">
          <label>Mã Sản Phẩm (Code ERP)</label>
          <input
            type="text"
            placeholder="7C123xxx"
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 3. Tên Liệu */}
        <div className="precision-specdtc__formGroup">
          <label>Tên Vật Liệu (Tên Liệu)</label>
          <input
            type="text"
            placeholder="SJ-203020HC"
            value={m_name}
            onChange={(e) => setM_Name(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 4. Mã Liệu CMS */}
        <div className="precision-specdtc__formGroup">
          <label>Mã Liệu CMS (Internal Code)</label>
          <input
            type="text"
            placeholder="A123456"
            value={m_code}
            onChange={(e) => setM_Code(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 5. Hạng mục test */}
        <div className="precision-specdtc__formGroup">
          <label>Hạng Mục Test (Test Type)</label>
          <select
            value={testname}
            onChange={(e) => setTestName(e.target.value)}
          >
            {testlist.map((item, index) => (
              <option key={index} value={item.TEST_CODE}>
                {item.TEST_NAME}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Số YCSX */}
        <div className="precision-specdtc__formGroup">
          <label>Số Lệnh Sản Xuất (Số YCSX)</label>
          <input
            type="text"
            placeholder="1H23456"
            value={prodrequestno}
            onChange={(e) => setProdRequestNo(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 7. All Time Checkbox */}
        <div className="precision-specdtc__checkboxGroup">
          <label>
            <input
              type="checkbox"
              checked={alltime}
              onChange={(e) => setAllTime(e.target.checked)}
            />
            <span>All Time (Toàn thời gian)</span>
          </label>
          <span className="badge-history">History</span>
        </div>
      </div>

      {/* Execute Filter Button */}
      <button
        type="button"
        className="precision-specdtc__btnSearch"
        onClick={onSearch}
        title="Bắt đầu tra cứu tiêu chuẩn SPEC DTC"
      >
        <FiSearch style={{ fontSize: "13px" }} />
        <span>SPEC DTC (TÌM KIẾM)</span>
      </button>
    </aside>
  );
};

export default React.memo(PrecisionSPECDTCSidebar);

import React from "react";
import moment from "moment";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

export interface TemLotFilterData {
  FROM_DATE: string;
  TO_DATE: string;
  PROCESS_LOT_NO: string;
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME: string;
  PROD_REQUEST_NO: string;
}

interface PrecisionLichSuTemLotSxToolbarProps {
  filterData: TemLotFilterData;
  onFilterChange: (keyname: keyof TemLotFilterData, value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export const PrecisionLichSuTemLotSxToolbar: React.FC<PrecisionLichSuTemLotSxToolbarProps> = ({
  filterData,
  onFilterChange,
  onSearch,
  isLoading = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleQuickDays = (days: number) => {
    const to = moment().format("YYYY-MM-DD");
    const from = days === 0 ? to : moment().subtract(days, "days").format("YYYY-MM-DD");
    onFilterChange("TO_DATE", to);
    onFilterChange("FROM_DATE", from);
  };

  const isToday =
    filterData.FROM_DATE === moment().format("YYYY-MM-DD") &&
    filterData.TO_DATE === moment().format("YYYY-MM-DD");

  return (
    <div className="precision-lichsutemlotsx__toolbar">
      <div className="precision-lichsutemlotsx__toolbarRow">
        <div className="precision-lichsutemlotsx__filterGroup">
          {/* Từ ngày */}
          <div className="precision-lichsutemlotsx__filterField">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={filterData.FROM_DATE ? filterData.FROM_DATE.slice(0, 10) : ""}
              onChange={(e) => onFilterChange("FROM_DATE", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Tới ngày */}
          <div className="precision-lichsutemlotsx__filterField">
            <label>Tới ngày:</label>
            <input
              type="date"
              value={filterData.TO_DATE ? filterData.TO_DATE.slice(0, 10) : ""}
              onChange={(e) => onFilterChange("TO_DATE", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Quick select ngày */}
          <div className="precision-lichsutemlotsx__quickDays">
            <button
              type="button"
              className={`precision-lichsutemlotsx__dayBtn ${isToday ? "precision-lichsutemlotsx__dayBtn--active" : ""}`}
              onClick={() => handleQuickDays(0)}
              title="Xem hôm nay"
            >
              Hôm nay
            </button>
            <button
              type="button"
              className="precision-lichsutemlotsx__dayBtn"
              onClick={() => handleQuickDays(3)}
              title="3 ngày gần nhất"
            >
              3 ngày
            </button>
            <button
              type="button"
              className="precision-lichsutemlotsx__dayBtn"
              onClick={() => handleQuickDays(7)}
              title="7 ngày gần nhất"
            >
              7 ngày
            </button>
            <button
              type="button"
              className="precision-lichsutemlotsx__dayBtn"
              onClick={() => handleQuickDays(30)}
              title="30 ngày gần nhất"
            >
              30 ngày
            </button>
          </div>

          {/* Code KD */}
          <div className="precision-lichsutemlotsx__filterField">
            <label>Code KD:</label>
            <input
              type="text"
              placeholder="Code KD..."
              value={filterData.G_NAME}
              onChange={(e) => onFilterChange("G_NAME", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Code ERP */}
          <div className="precision-lichsutemlotsx__filterField">
            <label>Code ERP:</label>
            <input
              type="text"
              placeholder="Code ERP..."
              value={filterData.G_CODE}
              onChange={(e) => onFilterChange("G_CODE", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* YCSX */}
          <div className="precision-lichsutemlotsx__filterField">
            <label>YCSX:</label>
            <input
              type="text"
              placeholder="Mã YCSX..."
              value={filterData.PROD_REQUEST_NO}
              onChange={(e) => onFilterChange("PROD_REQUEST_NO", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Khách hàng */}
          <div className="precision-lichsutemlotsx__filterField">
            <label>Khách hàng:</label>
            <input
              type="text"
              placeholder="Khách hàng..."
              value={filterData.CUST_NAME_KD}
              onChange={(e) => onFilterChange("CUST_NAME_KD", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* LOT SX */}
          <div className="precision-lichsutemlotsx__filterField">
            <label>LOT SX:</label>
            <input
              type="text"
              placeholder="Mã LOT SX..."
              value={filterData.PROCESS_LOT_NO}
              onChange={(e) => onFilterChange("PROCESS_LOT_NO", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Nút Load Data */}
        <button
          type="button"
          className="precision-lichsutemlotsx__btnLoad"
          onClick={onSearch}
          disabled={isLoading}
          title="Tra cứu dữ liệu tem lót"
        >
          <FaSearch size={11} />
          <span>Load Data</span>
        </button>
      </div>
    </div>
  );
};

export default PrecisionLichSuTemLotSxToolbar;

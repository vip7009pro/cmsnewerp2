import React from "react";
import moment from "moment";
import { BiSearch } from "react-icons/bi";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionAchivementTbToolbarProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  machine_list: MACHINE_LIST[];
  onSearch: (date?: string) => void;
  isLoading: boolean;
}

export const PrecisionAchivementTbToolbar: React.FC<
  PrecisionAchivementTbToolbarProps
> = ({
  fromdate,
  setFromDate,
  factory,
  setFactory,
  machine,
  setMachine,
  machine_list,
  onSearch,
  isLoading,
}) => {
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  const beforeYesterday = moment().subtract(2, "days").format("YYYY-MM-DD");

  const handleQuickDate = (d: string) => {
    setFromDate(d);
    onSearch(d);
  };

  return (
    <div className="precision-achivementtb__toolbar">
      <div className="toolbar-left">
        {/* PLAN DATE */}
        <div className="filter-item">
          <label>PLAN DATE:</label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* FACTORY */}
        <div className="filter-item">
          <label>FACTORY:</label>
          <select
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
          >
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>
        </div>

        {/* MACHINE */}
        <div className="filter-item">
          <label>MACHINE:</label>
          <select
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
            style={{ width: 140 }}
          >
            <option value="ALL">ALL (TẤT CẢ)</option>
            {machine_list
              .filter((m) => m.EQ_NAME !== "ALL")
              .map((ele, idx) => (
                <option key={idx} value={ele.EQ_NAME}>
                  {ele.EQ_NAME}
                </option>
              ))}
          </select>
        </div>

        {/* BUTTON TRA PLAN */}
        <button
          className="btn-tra-plan"
          onClick={() => onSearch()}
          disabled={isLoading}
        >
          <BiSearch size={14} />
          <span>{isLoading ? "ĐANG TẢI..." : "TRA PLAN"}</span>
        </button>
      </div>

      <div className="toolbar-right">
        <button
          type="button"
          className={`quick-date-btn ${fromdate === today ? "active" : ""}`}
          onClick={() => handleQuickDate(today)}
        >
          Hôm nay
        </button>
        <button
          type="button"
          className={`quick-date-btn ${fromdate === yesterday ? "active" : ""}`}
          onClick={() => handleQuickDate(yesterday)}
        >
          Hôm qua
        </button>
        <button
          type="button"
          className={`quick-date-btn ${fromdate === beforeYesterday ? "active" : ""}`}
          onClick={() => handleQuickDate(beforeYesterday)}
        >
          Hôm kia
        </button>
      </div>
    </div>
  );
};

import React from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { MdPersonAdd, MdOutlinePivotTableChart } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

interface PrecisionUserToolbarProps {
  resignedCheck: boolean;
  setResignedCheck: (val: boolean) => void;
  onLoadData: () => void;
  onOpenAddModal: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  quickFilterText: string;
  setQuickFilterText: (text: string) => void;
  isLoading?: boolean;
}

export const PrecisionUserToolbar: React.FC<PrecisionUserToolbarProps> = ({
  resignedCheck,
  setResignedCheck,
  onLoadData,
  onOpenAddModal,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  quickFilterText,
  setQuickFilterText,
  isLoading,
}) => {
  return (
    <div className="precision-usermanager__toolbar">
      <div className="precision-usermanager__actionsLeft">
        <label className="precision-usermanager__checkboxLabel">
          <input
            type="checkbox"
            checked={resignedCheck}
            onChange={(e) => setResignedCheck(e.target.checked)}
          />
          <span>Trừ người đã nghỉ việc</span>
        </label>

        <button
          className="precision-usermanager__btn precision-usermanager__btn--add"
          onClick={onOpenAddModal}
          type="button"
        >
          <MdPersonAdd size={15} />
          <span>+ Add / Update</span>
        </button>

        <button
          className="precision-usermanager__btn precision-usermanager__btn--load"
          onClick={onLoadData}
          disabled={isLoading}
          type="button"
        >
          <BiLoaderCircle
            size={15}
            className={isLoading ? "animate-spin" : ""}
          />
          <span>Load Data</span>
        </button>

        <button
          className="precision-usermanager__btn precision-usermanager__btn--excel1"
          onClick={onExportEX1}
          title="Xuất danh sách nhân viên đang lọc"
          type="button"
        >
          <RiFileExcel2Line size={15} color="#10b981" />
          <span>EX1 Export Full</span>
        </button>

        <button
          className="precision-usermanager__btn precision-usermanager__btn--excel2"
          onClick={onExportEX2}
          title="Xuất toàn bộ danh sách nhân viên"
          type="button"
        >
          <RiFileExcel2Line size={15} color="#f59e0b" />
          <span>EX2 Báo Cáo</span>
        </button>

        <button
          className="precision-usermanager__btn precision-usermanager__btn--pivot"
          onClick={onOpenPivot}
          title="Phân tích Pivot đa chiều nhân sự"
          type="button"
        >
          <MdOutlinePivotTableChart size={15} color="#8b5cf6" />
          <span>PIVOT</span>
        </button>
      </div>

      <div className="precision-usermanager__searchBox">
        <AiOutlineSearch className="search-icon" size={15} />
        <input
          type="text"
          value={quickFilterText}
          onChange={(e) => setQuickFilterText(e.target.value)}
          placeholder="Lọc ERP_ID, họ tên, SĐT..."
        />
        {quickFilterText && (
          <AiOutlineClose
            className="clear-icon"
            size={13}
            onClick={() => setQuickFilterText("")}
          />
        )}
      </div>
    </div>
  );
};

export default PrecisionUserToolbar;

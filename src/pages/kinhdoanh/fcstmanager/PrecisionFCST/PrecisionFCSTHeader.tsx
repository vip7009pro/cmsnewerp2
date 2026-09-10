import React, { memo } from "react";
import { FiClipboard, FiPlus, FiTrash2 } from "react-icons/fi";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { AiFillFileExcel } from "react-icons/ai";

interface Props {
  onOpenAddModal: () => void;
  onDeleteFcst: () => void;
  onTogglePivot: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
}

const PrecisionFCSTHeader: React.FC<Props> = ({
  onOpenAddModal,
  onDeleteFcst,
  onTogglePivot,
  onExportEX1,
  onExportEX2,
}) => {
  return (
    <div className="precision-fcst__header">
      {/* Sub-Tabs */}
      <div className="precision-fcst__tabs">
        <button
          type="button"
          className="precision-fcst__tab precision-fcst__tab--active"
        >
          <FiClipboard />
          <span>📋 Quản lý FCST (Forecast Master)</span>
        </button>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="precision-fcst__headerRight">
        <button
          type="button"
          className="precision-fcst__actionBtn precision-fcst__actionBtn--primary"
          onClick={onOpenAddModal}
          title="Thêm dự báo FCST mới"
        >
          <FiPlus />
          <span>+ Thêm FCST Mới</span>
        </button>

        <button
          type="button"
          className="precision-fcst__actionBtn precision-fcst__actionBtn--purple"
          onClick={onTogglePivot}
          title="Pivot Báo Cáo FCST"
        >
          <MdOutlinePivotTableChart />
          <span>Pivot Báo Cáo FCST</span>
        </button>

        <button
          type="button"
          className="precision-fcst__actionBtn precision-fcst__actionBtn--danger"
          onClick={onDeleteFcst}
          title="Xóa FCST đã chọn"
        >
          <FiTrash2 />
          <span>XÓA FCST</span>
        </button>

        <button
          type="button"
          className="precision-fcst__actionBtn precision-fcst__actionBtn--success"
          onClick={onExportEX1}
          title="Xuất Excel dữ liệu hiển thị"
        >
          <AiFillFileExcel size={13} />
          <span>EX1 (Hiển thị)</span>
        </button>

        <button
          type="button"
          className="precision-fcst__actionBtn precision-fcst__actionBtn--success"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ dữ liệu thô"
        >
          <AiFillFileExcel size={13} />
          <span>EX2 (Raw Data)</span>
        </button>
      </div>
    </div>
  );
};

export default memo(PrecisionFCSTHeader);

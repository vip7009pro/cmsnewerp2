import React from "react";
import moment from "moment";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import AGTable from "../../../../../components/DataTable/AGTable";
import { Equipment, CalibrationHistory } from "./calibrationTypes";

interface TablesProps {
  equipmentData: Equipment[];
  eqColumns: any[];
  selectedEqId: number | null;
  selectedEquipment: Equipment | null;
  onSelectEqId: (id: number) => void;
  onCloseDetail: () => void;
  onOpenAddHist: () => void;
  historyData: CalibrationHistory[];
  histColumns: any[];
}

export const PrecisionCalibrationTables: React.FC<TablesProps> = ({
  equipmentData,
  eqColumns,
  selectedEqId,
  selectedEquipment,
  onSelectEqId,
  onCloseDetail,
  onOpenAddHist,
  historyData,
  histColumns,
}) => {
  const getEqRowStyle = (params: any) => {
    if (!params.data) return undefined;
    if (params.data.STATUS === "BROKEN") {
      return { backgroundColor: "#f8fafc", color: "#64748b" };
    }
    if (params.data.NEXT_CAL_DATE) {
      const nextCalDate = moment(params.data.NEXT_CAL_DATE).startOf("day");
      const today = moment().startOf("day");
      const daysDiff = nextCalDate.diff(today, "days");

      if (daysDiff < 0) {
        return { backgroundColor: "#fee2e2" }; // Overdue soft rose
      } else if (daysDiff <= 30) {
        return { backgroundColor: "#fef3c7" }; // Due soon soft amber
      }
    }
    return { backgroundColor: "#f0fdf4" }; // Valid soft emerald
  };

  const getHistRowStyle = (params: any) => {
    if (!params.data) return undefined;
    if (params.data.NEXT_CAL_DATE) {
      const nextCalDate = moment(params.data.NEXT_CAL_DATE).startOf("day");
      const today = moment().startOf("day");
      const daysDiff = nextCalDate.diff(today, "days");

      if (daysDiff < 0) {
        return { backgroundColor: "#fee2e2" };
      } else if (daysDiff <= 30) {
        return { backgroundColor: "#fef3c7" };
      }
    }
    return { backgroundColor: "#f0fdf4" };
  };

  return (
    <div className="pc-tables-container">
      {/* 1. Master Equipment Table */}
      <div className={`panel-master ${selectedEqId ? "shrink" : ""}`}>
        <div className="agtable-wrapper">
          <AGTable
            showFilter={true}
            toolbar={<div />}
            columns={eqColumns}
            data={equipmentData}
            rowHeight={50}
            getRowStyle={getEqRowStyle}
            onRowClick={(e: any) => {
              if (e.data?.EQ_ID) onSelectEqId(e.data.EQ_ID);
            }}
            onSelectionChange={() => {}}
          />
        </div>
      </div>

      {/* 2. Detail History Table (Opens when equipment selected) */}
      {selectedEqId && (
        <div className="panel-detail">
          <div className="detail-header">
            <div className="detail-title-group">
              <span className="detail-badge">LỊCH SỬ HIỆU CHUẨN</span>
              <span className="detail-title">
                {selectedEquipment
                  ? `${selectedEquipment.EQ_NAME} (Số QL: ${selectedEquipment.CONTROL_NO})`
                  : `ID: ${selectedEqId}`}
              </span>
              <span className="detail-sub">
                - Tổng: {historyData.length} lượt kiểm định
              </span>
            </div>

            <div className="detail-actions">
              <button
                type="button"
                className="btn-detail-add"
                onClick={onOpenAddHist}
                title="Thêm lượt hiệu chuẩn mới cho thiết bị này"
              >
                <AiOutlinePlus />
                <span>Thêm Lịch Sử</span>
              </button>

              <button
                type="button"
                className="btn-close-detail"
                onClick={onCloseDetail}
                title="Đóng bảng lịch sử"
              >
                <AiOutlineClose size={16} />
              </button>
            </div>
          </div>

          <div className="agtable-wrapper">
            <AGTable
              showFilter={true}
              toolbar={<div />}
              columns={histColumns}
              data={historyData}
              rowHeight={50}
              getRowStyle={getHistRowStyle}
              onSelectionChange={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

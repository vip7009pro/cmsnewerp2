// PrecisionIncomingTable.tsx - High-Density AGTable wrapper & Status Footer Bar
import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { IQC_INCOMMING_DATA } from "../../interfaces/qcInterface";
import { getIncomingColumns } from "./PrecisionIncomingColumns";
import { filterIncomingRows } from "./incomingMobileFilter";

interface PrecisionIncomingTableProps {
  data: IQC_INCOMMING_DATA[];
  isWorker: boolean;
  clickedRow: IQC_INCOMMING_DATA | null;
  onRowClick: (row: IQC_INCOMMING_DATA) => void;
  onSelectionChange: (selectedRows: IQC_INCOMMING_DATA[]) => void;
  onUpdateRow: (row: IQC_INCOMMING_DATA) => void;
  onUploadChecksheet: (file: File, iqc1Id: number) => void;
  onToggleField: (row: IQC_INCOMMING_DATA, field: keyof IQC_INCOMMING_DATA, checked: boolean) => void;
  /** Nhánh mobile: ẩn status-bar desktop và lọc nhanh ngay trong bảng (Zero-Blur GPU-friendly) */
  isMobile?: boolean;
  quickFilterText?: string;
  onlyPending?: boolean;
}

export const PrecisionIncomingTable: React.FC<PrecisionIncomingTableProps> = ({
  data,
  isWorker,
  clickedRow,
  onRowClick,
  onSelectionChange,
  onUpdateRow,
  onUploadChecksheet,
  onToggleField,
  isMobile = false,
  quickFilterText = "",
  onlyPending = false,
}) => {
  // Extract dynamic sample keys KQ1, KQ2...
  const sampleKeys = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((k) => k.startsWith("KQ"));
  }, [data]);

  // Lọc realtime theo ô search + chip "Chờ KQ" trên mobile (không gọi lại API)
  const filteredData = useMemo(
    () => filterIncomingRows(data, quickFilterText, onlyPending),
    [data, quickFilterText, onlyPending]
  );

  const columns = useMemo(
    () =>
      getIncomingColumns({
        isWorker,
        onUpdateRow,
        onUploadChecksheet,
        onToggleField,
        sampleKeys,
      }),
    [isWorker, onUpdateRow, onUploadChecksheet, onToggleField, sampleKeys]
  );

  return (
    <div className="precision-incoming__center-panel">
      <div className="precision-incoming__grid-container">
        <AGTable
          columns={columns}
          data={isMobile ? filteredData : data}
          dataAlias={data}
          suppressRowClickSelection={false}
          onRowClick={(params: any) => onRowClick(params.data)}
          onSelectionChange={(params: any) => onSelectionChange(params.api.getSelectedRows())}
        />
      </div>

      {!isMobile && (
      <div className="precision-incoming__status-bar">
        <div className="status-left">
          <span>
            Tổng số dòng: <strong>{data.length} rows</strong>
          </span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          {clickedRow ? (
            <span className="selected-info">
              Đang chọn: <strong>{clickedRow.M_NAME}</strong> (Lot: {clickedRow.M_LOT_NO})
            </span>
          ) : (
            <span>Chưa chọn lô NVL nào</span>
          )}
        </div>

        <div className="status-right">
          <span>CMS_GRID_ENGINE v2.7</span>
          <span className="dot" />
          <span style={{ color: "#059669", fontWeight: 700 }}>SYNC OK</span>
        </div>
      </div>
      )}
    </div>
  );
};

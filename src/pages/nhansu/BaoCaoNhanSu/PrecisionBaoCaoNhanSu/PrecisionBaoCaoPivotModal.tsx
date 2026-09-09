import React, { useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import { DiemDanhFullData } from "../../interfaces/nhansuInterface";

interface PrecisionBaoCaoPivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Array<DiemDanhFullData>;
}

export const PrecisionBaoCaoPivotModal: React.FC<PrecisionBaoCaoPivotModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const dataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: [
        { caption: "DATE_COLUMN", width: 90, dataField: "DATE_COLUMN", dataType: "string", summaryType: "count" },
        { caption: "WEEKDAY", width: 85, dataField: "WEEKDAY", dataType: "string", summaryType: "count" },
        { caption: "EMPL_NO", width: 90, dataField: "EMPL_NO", dataType: "string", summaryType: "count" },
        { caption: "NS_ID", width: 85, dataField: "CMS_ID", dataType: "string", summaryType: "count" },
        { caption: "MIDLAST_NAME", width: 100, dataField: "MIDLAST_NAME", dataType: "string", summaryType: "count" },
        { caption: "FIRST_NAME", width: 90, dataField: "FIRST_NAME", dataType: "string", summaryType: "count" },
        { caption: "SEX_NAME", width: 75, dataField: "SEX_NAME", dataType: "string", summaryType: "count" },
        { caption: "FACTORY_NAME", width: 90, dataField: "FACTORY_NAME", dataType: "string", summaryType: "count" },
        { caption: "JOB_NAME", width: 90, dataField: "JOB_NAME", dataType: "string", summaryType: "count" },
        { caption: "MAINDEPTNAME", width: 100, dataField: "MAINDEPTNAME", dataType: "string", summaryType: "count" },
        { caption: "SUBDEPTNAME", width: 100, dataField: "SUBDEPTNAME", dataType: "string", summaryType: "count" },
        { caption: "WORK_SHIF_NAME", width: 95, dataField: "WORK_SHIF_NAME", dataType: "string", summaryType: "count" },
        { caption: "ON_OFF", width: 75, dataField: "ON_OFF", dataType: "number", summaryType: "sum" },
        { caption: "WORKING_MINUTES", width: 90, dataField: "WORKING_MINUTES", dataType: "number", summaryType: "sum" },
        { caption: "OVERTIME", width: 85, dataField: "OVERTIME", dataType: "number", summaryType: "sum" },
        { caption: "REASON_NAME", width: 110, dataField: "REASON_NAME", dataType: "string", summaryType: "count" },
      ],
      store: data,
    });
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="precision-baocao__modalOverlay" onClick={onClose}>
      <div
        className="precision-baocao__modalCard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="precision-baocao__modalHeader">
          <div className="precision-baocao__modalTitle">
            <MdOutlinePivotTableChart size={18} color="#6b21a8" />
            <span>Ma Trận Phân Tích Đa Chiều (Pivot Analysis) - Chấm Công & Điểm Danh</span>
          </div>

          <button
            type="button"
            className="precision-baocao__modalCloseBtn"
            onClick={onClose}
            title="Đóng cửa sổ Pivot"
          >
            <AiOutlineClose size={14} />
          </button>
        </div>

        <div className="precision-baocao__modalBody">
          <PivotTable datasource={dataSource} tableID="baocaonhansupivot" />
        </div>
      </div>
    </div>
  );
};

export default PrecisionBaoCaoPivotModal;

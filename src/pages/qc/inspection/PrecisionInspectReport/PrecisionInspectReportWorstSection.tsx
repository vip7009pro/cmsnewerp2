import React from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InspectionWorstTable from "../../../../components/DataTable/InspectionWorstTable";
import PrecisionInspectReportWorstDonut from "./PrecisionInspectReportWorstDonut";
import { WorstData } from "../../interfaces/qcInterface";
import { SaveExcel } from "../../../../api/services/excelService";

interface Props {
  worstdatatable: WorstData[];
  worstby: string;
  fromdate: string;
  todate: string;
  ng_type: string;
  searchCodeArray: string[];
  cust_name: string;
}

export const PrecisionInspectReportWorstSection: React.FC<Props> = ({
  worstdatatable,
  worstby,
  fromdate,
  todate,
  ng_type,
  searchCodeArray,
  cust_name,
}) => {
  return (
    <section className="pir-section">
      <div className="pir-section__header">
        <div className="pir-section__title-group">
          <EmojiEventsIcon style={{ fontSize: 18, color: "#d97706" }} />
          <h2 className="pir-section__title">
            4. Xếp Hạng Sản Phẩm Lỗi Nhiều Nhất (Worst Products by {worstby})
          </h2>
          <span className="pir-section__tag">F-COST BY DEFECT</span>
        </div>
        <button
          type="button"
          className="pir-chart-card__btn-excel"
          onClick={() => SaveExcel(worstdatatable, "WorstProducts")}
          title="Xuất Excel"
        >
          <FileDownloadIcon style={{ fontSize: 13 }} />
          <span>Excel</span>
        </button>
      </div>

      {/* 1. Biểu đồ tròn Donut Top 5 Loại Lỗi Phổ Biến (Kiểu KDChartCustomerRevenue) */}
      {worstdatatable.length > 0 && (
        <PrecisionInspectReportWorstDonut
          worstdatatable={worstdatatable}
          worstby={worstby}
        />
      )}

      {/* 2. Cụm Bảng Xếp Hạng Lỗi + Biểu Đồ Tròn Phân Bổ Sản Phẩm Theo Lỗi Được Chọn */}
      {worstdatatable.length > 0 && (
        <div className="pir-chart-card">
          <div className="pir-chart-card__top">
            <div className="pir-chart-card__title-area">
              <span className="pir-chart-card__badge">CHI TIẾT</span>
              <span className="pir-chart-card__title">
                Bảng Chi Tiết Xếp Hạng Lỗi & Biểu Đồ Sản Phẩm
              </span>
            </div>
          </div>
          <div className="pir-chart-card__chart-body--tall">
            <InspectionWorstTable
              dailyClosingData={worstdatatable}
              worstby={worstby}
              from_date={fromdate}
              to_date={todate}
              ng_type={ng_type}
              listCode={searchCodeArray}
              cust_name={cust_name}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default React.memo(PrecisionInspectReportWorstSection);

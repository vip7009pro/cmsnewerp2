import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FactoryIcon from "@mui/icons-material/Factory";
import InspectDailyDefectTrending from "../../../../components/Chart/INSPECTION/InspectDailyDefectTrending";
import PATROL_HEADER from "../../../sx/PATROL/PATROL_HEADER";
import { DEFECT_TRENDING_DATA } from "../../interfaces/qcInterface";
import { PATROL_HEADER_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface Props {
  dailyDefectTrendingData: DEFECT_TRENDING_DATA[];
  patrolheaderdata: PATROL_HEADER_DATA[];
  fromdate: string;
  todate: string;
  onExportDefect: () => void;
}

export const PrecisionInspectReportDefectsSection: React.FC<Props> = ({
  dailyDefectTrendingData, patrolheaderdata, fromdate, todate, onExportDefect,
}) => {
  return (
    <section className="pir-section">
      <div className="pir-section__header">
        <div className="pir-section__title-group">
          <WarningAmberIcon style={{ fontSize: 18, color: "#e11d48" }} />
          <h2 className="pir-section__title">3. Xu Hướng Khuyết Tật & Sự Cố (Defects Trending)</h2>
          <span className="pir-section__tag">DAILY ANALYSIS</span>
        </div>
      </div>

      {/* Defect Trending Chart */}
      <div className="pir-chart-card">
        <div className="pir-chart-card__top">
          <div className="pir-chart-card__title-area">
            <span className="pir-chart-card__badge">KHUYẾT TẬT</span>
            <span className="pir-chart-card__title">Daily Defect Trending</span>
          </div>
          <button type="button" className="pir-chart-card__btn-excel" onClick={onExportDefect} title="Xuất Excel">
            <FileDownloadIcon style={{ fontSize: 13 }} />
            <span>Excel</span>
          </button>
        </div>
        <div className="pir-chart-card__chart-body--tall">
          <InspectDailyDefectTrending dldata={[...dailyDefectTrendingData].reverse()} />
        </div>
      </div>

      {/* Patrol Header - Top 3 F-Cost Products */}
      <div className="pir-patrol-card">
        <div className="pir-patrol-card__header">
          <FactoryIcon style={{ fontSize: 16, color: "#7c3aed" }} />
          <span className="pir-patrol-card__title">Top 3 F-Cost Products ({fromdate} ~ {todate})</span>
        </div>
        <div className="pir-patrol-card__body">
          <PATROL_HEADER data={patrolheaderdata} />
        </div>
      </div>
    </section>
  );
};

import React from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { DEFECT_TRENDING_DATA, PQC3_DATA } from "../../interfaces/qcInterface";
import PQCDailyDefectTrending from "../../../../components/Chart/PQC/PQCDailyDefectTrending";
import PATROL_COMPONENT2 from "../../../sx/PATROL/PATROL_COMPONENT2";

interface PrecisionPQCReportDefectsSectionProps {
  dailyDefectTrendingData: DEFECT_TRENDING_DATA[];
  pqcdatatable: PQC3_DATA[];
  onDefectClick: (activeLabel: string) => void;
  onExportDefects: () => void;
}

export const PrecisionPQCReportDefectsSection: React.FC<PrecisionPQCReportDefectsSectionProps> = ({
  dailyDefectTrendingData,
  pqcdatatable,
  onDefectClick,
  onExportDefects,
}) => {
  return (
    <div className="precision-section">
      <div className="section-header">
        <div className="section-title">
          <WarningAmberIcon style={{ color: "#f59e0b", fontSize: "1.1rem" }} />
          <span>2. XU HƯỚNG LỖI KHUYẾT TẬT & SỰ CỐ HIỆN TRƯỜNG (DEFECTS & PATROL)</span>
        </div>
        <div className="section-actions">
          <button className="btn-export-excel" onClick={onExportDefects} title="Xuất dữ liệu lỗi khuyết tật ra Excel">
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>Xuất Excel Defect</span>
          </button>
        </div>
      </div>

      {/* Biểu đồ Defect Trending */}
      <div className="executive-chart-card">
        <div className="chart-card-header">
          <span className="chart-name">Phân Bố & Xu Hướng Mã Lỗi Khuyết Tật Hàng Ngày (Nhấp vào cột để lọc sự cố)</span>
        </div>
        <div className="chart-content" style={{ height: 420 }}>
          <PQCDailyDefectTrending
            dldata={[...dailyDefectTrendingData].reverse()}
            onClick={(e: any) => {
              if (e?.activeLabel) onDefectClick(e.activeLabel);
            }}
          />
        </div>
      </div>

      {/* Danh sách thẻ sự cố Patrol */}
      <div className="executive-chart-card defect-incident-card">
        <div className="chart-card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="chart-name">
              Chi Tiết Sự Cố Chất Lượng Công Đoạn PQC ({pqcdatatable.length} sự cố ghi nhận)
            </span>
            <span className="scroll-hint">⟵ Cuộn ngang để xem thêm ⟶</span>
          </div>
        </div>
        <div className="defect-cards-track">
          {pqcdatatable.length === 0 ? (
            <div className="defect-empty-state">
              Không có dữ liệu sự cố lỗi trong khoảng thời gian này
            </div>
          ) : (
            pqcdatatable.map((ele: PQC3_DATA, index: number) => (
              <div key={index} className="defect-item-container">
                <span className="defect-time-header">⏰ {ele.OCCURR_TIME}</span>
                <PATROL_COMPONENT2
                  data={{
                    CUST_NAME_KD: ele.CUST_NAME_KD,
                    DEFECT: `${ele.ERR_CODE}: ${ele.DEFECT_PHENOMENON}`,
                    EQ: ele.LINE_NO,
                    FACTORY: ele.FACTORY,
                    G_NAME_KD: ele.G_NAME_KD,
                    INSPECT_QTY: ele.INSPECT_QTY,
                    INSPECT_NG: ele.DEFECT_QTY,
                    LINK: `/pqc/PQC3_${ele.PQC3_ID + 1}.png`,
                    TIME: ele.OCCURR_TIME,
                    EMPL_NO: ele.LINEQC_PIC,
                    DOI_SACH: ele.DOI_SACH,
                    NG_NHAN: ele.NG_NHAN,
                    STATUS: ele.STATUS,
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQCReportDefectsSection);

import React from "react";
import { FiClock, FiPieChart, FiDownload, FiUsers, FiCheckCircle } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  ALL_GAP_RATE_BACK_DATA,
  CNT_GAP_DATA,
  CNT_GAP_DATA2,
  KD_YC_GAP_RATE_BACK_DATA,
  KT_GAP_RATE_BACK_DATA,
  SX_GAP_RATE_BACK_DATA,
  TRUOCHAN_BACK_DATA,
  TRUOCHAN_BACK_DATA2,
} from "../../../qc/interfaces/qcInterface";
import { SX_LOSSTIME_BY_EMPL, SX_LOSSTIME_REASON_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import PrecisionSxPieLossReason from "./charts/PrecisionSxPieLossReason";
import PrecisionSxPieLossEmpl from "./charts/PrecisionSxPieLossEmpl";
import PrecisionSxPieGapRate from "./charts/PrecisionSxPieGapRate";
import YCSX_GAP_RATE2 from "../../../../components/Chart/SX/YCSX_GAP_RATE2";

interface PrecisionSxReportLeadTimeSectionProps {
  fromDate: string;
  toDate: string;
  lossTimeReasonData: SX_LOSSTIME_REASON_DATA[];
  lossTimeEmplData: SX_LOSSTIME_BY_EMPL[];
  ycgapData: CNT_GAP_DATA[];
  ycsxgapbackData: KD_YC_GAP_RATE_BACK_DATA[];
  sxgapData: CNT_GAP_DATA[];
  sxgapbackData: SX_GAP_RATE_BACK_DATA[];
  ktgapData: CNT_GAP_DATA[];
  ktgapbackData: KT_GAP_RATE_BACK_DATA[];
  allgapData: CNT_GAP_DATA[];
  allgapbackData: ALL_GAP_RATE_BACK_DATA[];
  allhoanthanhtruochanrateData: CNT_GAP_DATA[];
  allhoanthanhtruochanratebackData: TRUOCHAN_BACK_DATA[];
  allhoanthanhtruochanrateData2: CNT_GAP_DATA2[];
  allhoanthanhtruochanratebackData2: TRUOCHAN_BACK_DATA2[];
}

const PrecisionSxReportLeadTimeSection: React.FC<PrecisionSxReportLeadTimeSectionProps> = ({
  fromDate,
  toDate,
  lossTimeReasonData,
  lossTimeEmplData,
  ycgapData,
  ycsxgapbackData,
  sxgapData,
  sxgapbackData,
  ktgapData,
  ktgapbackData,
  allgapData,
  allgapbackData,
  allhoanthanhtruochanrateData,
  allhoanthanhtruochanratebackData,
  allhoanthanhtruochanrateData2,
  allhoanthanhtruochanratebackData2,
}) => {
  return (
    <div className="precision-sx-section">
      <div className="precision-sx-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiClock />
          </span>
          <span>4. Chi Tiết Thời Gian Dừng Máy & Lead Time Giao Hàng ({fromDate} ~ {toDate})</span>
        </div>
      </div>

      {/* Cặp Biểu Đồ 1: Dừng máy theo lý do & theo nhân viên */}
      <div className="two-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#0284c7" />
              <span className="executive-card__title">Loss Time By Reason (Thời Gian Dừng Máy Theo Lý Do)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(lossTimeReasonData, "SX_Loss_Time_By_Reason")}
              title="Xuất Excel Loss Time By Reason"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <PrecisionSxPieLossReason data={lossTimeReasonData} />
          </div>
        </div>

        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiUsers size={13} color="#059669" />
              <span className="executive-card__title">Loss Time By Employee (Thời Gian Dừng Máy Theo Nhân Viên)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(lossTimeEmplData, "Loss_Time_By_Employee")}
              title="Xuất Excel Loss Time By Employee"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <PrecisionSxPieLossEmpl data={lossTimeEmplData} />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Tỉ trọng YCSX gấp & Tỉ trọng ngày hoàn thành SX */}
      <div className="two-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#d97706" />
              <span className="executive-card__title">Tỉ Trọng YCSX Gấp Theo Số Ngày (Ngày YC - Ngày Giao)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(ycsxgapbackData, "YCSX_GAP_RATE")}
              title="Xuất Excel YCSX Gap Rate"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <PrecisionSxPieGapRate data={ycgapData} unitLabel="YCSX" gapUnit="ngày" />
          </div>
        </div>

        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#dc2626" />
              <span className="executive-card__title">Tỉ Trọng Số Ngày Hoàn Thành SX (Ngày YC - Nhập Kiểm Cuối)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(sxgapbackData, "SX_GAP_RATE")}
              title="Xuất Excel SX Gap Rate"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <PrecisionSxPieGapRate data={sxgapData} unitLabel="YCSX" gapUnit="ngày" />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 3: Tỉ trọng hoàn thành KT & Hoàn thành ALL Công Đoạn */}
      <div className="two-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#7c3aed" />
              <span className="executive-card__title">Tỉ Trọng Hoàn Thành Kiểm Tra (Nhập Kiểm Đầu - Xuất Kiểm Cuối)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(ktgapbackData, "KT_GAP_RATE")}
              title="Xuất Excel KT Gap Rate"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <PrecisionSxPieGapRate data={ktgapData} unitLabel="YCSX" gapUnit="ngày" />
          </div>
        </div>

        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCheckCircle size={13} color="#0891b2" />
              <span className="executive-card__title">Tỉ Trọng Hoàn Thành ALL CĐ (Lên YC - Ngày Kiểm Cuối)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(allgapbackData, "ALL_GAP_RATE")}
              title="Xuất Excel ALL Gap Rate"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <PrecisionSxPieGapRate data={allgapData} unitLabel="YCSX" gapUnit="ngày" />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 4: Tỉ trọng trước hạn & Chi tiết chậm theo bộ phận */}
      <div className="two-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCheckCircle size={13} color="#16a34a" />
              <span className="executive-card__title">Tỉ Trọng Hoàn Thành Trước Hạn (Dương: Trước hạn, Âm: Quá hạn)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(allhoanthanhtruochanratebackData, "ALL_HOAN_THANH_TRUOC_HAN_RATE")}
              title="Xuất Excel Hoàn Thành Trước Hạn"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <PrecisionSxPieGapRate data={allhoanthanhtruochanrateData} unitLabel="YCSX" gapUnit="ngày" />
          </div>
        </div>

        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#ea580c" />
              <span className="executive-card__title">Chi Tiết Tỉ Trọng Giao Chậm Theo Bộ Phận (SX / QC / OK)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(allhoanthanhtruochanratebackData2, "ALL_HOAN_THANH_TRUOC_HAN_RATE2")}
              title="Xuất Excel Giao Chậm Bộ Phận"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--tall">
            <YCSX_GAP_RATE2
              dldata={[...allhoanthanhtruochanrateData2].reverse()}
              processColor="#dda224"
              materialColor="#74c938"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrecisionSxReportLeadTimeSection };
export default React.memo(PrecisionSxReportLeadTimeSection);

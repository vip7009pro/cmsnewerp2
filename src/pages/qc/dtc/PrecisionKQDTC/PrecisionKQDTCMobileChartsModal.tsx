// PrecisionKQDTCMobileChartsModal.tsx - Modal/Sheet chuyên dụng xem biểu đồ SPC trên Mobile

import React, { useState } from "react";
import { FiX, FiPieChart, FiBarChart2, FiTrendingUp, FiActivity } from "react-icons/fi";
import HISTOGRAM_CHART from "../../../../components/Chart/DTC/HISTOGRAM_CHART";
import XBAR_CHART from "../../../../components/Chart/DTC/XBAR_CHART";
import R_CHART from "../../../../components/Chart/DTC/R_CHART";
import CPK_CHART from "../../../../components/Chart/DTC/CPK_CHART";
import { CPK_DATA, HISTOGRAM_DATA, XBAR_DATA } from "../interfaces/qcInterface";

interface PrecisionKQDTCMobileChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedData: any;
  xbarData: XBAR_DATA[];
  cpkData: CPK_DATA[];
  histogramData: HISTOGRAM_DATA[];
}

type ChartTab = "HISTOGRAM" | "XBAR" | "R" | "CPK";

const PrecisionKQDTCMobileChartsModal: React.FC<PrecisionKQDTCMobileChartsModalProps> = ({
  isOpen,
  onClose,
  selectedData,
  xbarData,
  cpkData,
  histogramData,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("HISTOGRAM");

  if (!isOpen) return null;

  const hasData = xbarData.length > 0 || cpkData.length > 0 || histogramData.length > 0;

  return (
    <div className="precision-kqdtc-charts-modal-overlay" onClick={onClose}>
      <div className="precision-kqdtc-charts-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-charts-header">
          <div className="modal-charts-title">
            <FiPieChart size={16} style={{ color: "#2563eb" }} />
            <div>
              <div className="title-text">Phân Tích Biểu Đồ SPC 6-Sigma</div>
              <div className="subtitle-text">
                {selectedData?.G_NAME || "Chưa chọn mẫu"} • {selectedData?.TEST_NAME || "--"}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Đóng xem biểu đồ"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Selected Data Context Card */}
        <div className="modal-context-strip">
          <div className="context-item">
            <span className="ctx-label">Model:</span>
            <span className="ctx-val font-mono">{selectedData?.G_NAME || "--"}</span>
          </div>
          <div className="context-item">
            <span className="ctx-label">Vật liệu:</span>
            <span className="ctx-val">{selectedData?.M_NAME || "--"}</span>
          </div>
          <div className="context-item">
            <span className="ctx-label">Test Point:</span>
            <span className="ctx-val ctx-val--highlight font-mono">
              {selectedData?.POINT_CODE || "--"}
            </span>
          </div>
          <div className="context-item">
            <span className="ctx-label">Đánh giá:</span>
            <span
              className={`ctx-badge ${
                selectedData?.DANHGIA === "OK" ? "ctx-badge--ok" : "ctx-badge--ng"
              }`}
            >
              {selectedData?.DANHGIA || "--"}
            </span>
          </div>
        </div>

        {/* Chart Tab Navigation */}
        <div className="modal-chart-tabs">
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === "HISTOGRAM" ? "active" : ""}`}
            onClick={() => setActiveTab("HISTOGRAM")}
          >
            <FiBarChart2 size={13} />
            <span>HISTOGRAM</span>
          </button>
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === "XBAR" ? "active" : ""}`}
            onClick={() => setActiveTab("XBAR")}
          >
            <FiTrendingUp size={13} />
            <span>XBAR (n=5)</span>
          </button>
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === "R" ? "active" : ""}`}
            onClick={() => setActiveTab("R")}
          >
            <FiActivity size={13} />
            <span>R CHART</span>
          </button>
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === "CPK" ? "active" : ""}`}
            onClick={() => setActiveTab("CPK")}
          >
            <FiPieChart size={13} />
            <span>CPK TREND</span>
          </button>
        </div>

        {/* Chart View Content */}
        <div className="modal-chart-viewport">
          {!hasData ? (
            <div className="no-chart-placeholder">
              <FiPieChart size={32} style={{ color: "#94a3b8", marginBottom: 8 }} />
              <p>Chưa có dữ liệu SPC cho dòng này.</p>
              <span>Vui lòng nhấn đúp dòng trong bảng để hệ thống nạp dữ liệu.</span>
            </div>
          ) : (
            <div className="active-chart-card">
              {activeTab === "HISTOGRAM" && (
                <div className="chart-render-wrapper">
                  <div className="chart-card-top">
                    <h4>PHÂN BỐ TẦN SUẤT (HISTOGRAM)</h4>
                    <span className="legend-hint">■ Count | — Normal Distribution</span>
                  </div>
                  <div className="chart-svg-box">
                    {histogramData.length > 0 ? (
                      <HISTOGRAM_CHART dldata={histogramData} />
                    ) : (
                      <div className="empty-subchart">Không có dữ liệu Histogram</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "XBAR" && (
                <div className="chart-render-wrapper">
                  <div className="chart-card-top">
                    <h4>XBAR CONTROL CHART (X̄ Trend)</h4>
                    <span className="legend-hint">● AVG | -- UCL/LCL | -- CL</span>
                  </div>
                  <div className="chart-svg-box">
                    {xbarData.length > 0 ? (
                      <XBAR_CHART dldata={xbarData} />
                    ) : (
                      <div className="empty-subchart">Không có dữ liệu Xbar</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "R" && (
                <div className="chart-render-wrapper">
                  <div className="chart-card-top">
                    <h4>R CHART (Độ Biến Thiên Khoảng R)</h4>
                    <span className="legend-hint">● R Range | -- R_UCL/R_LCL</span>
                  </div>
                  <div className="chart-svg-box">
                    {xbarData.length > 0 ? (
                      <R_CHART dldata={xbarData} />
                    ) : (
                      <div className="empty-subchart">Không có dữ liệu R Chart</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "CPK" && (
                <div className="chart-render-wrapper">
                  <div className="chart-card-top">
                    <h4>XU HƯỚNG NĂNG LỰC QUY TRÌNH (CPK TREND)</h4>
                    <span className="legend-hint">■ CPK | -- Chuẩn 1.33 & 1.67</span>
                  </div>
                  <div className="chart-svg-box">
                    {cpkData.length > 0 ? (
                      <CPK_CHART dldata={cpkData} />
                    ) : (
                      <div className="empty-subchart">Không có dữ liệu Cpk Trend</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKQDTCMobileChartsModal);

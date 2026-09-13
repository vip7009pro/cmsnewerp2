import React from "react";
import { FiChevronDown, FiChevronUp, FiBarChart2 } from "react-icons/fi";
import HISTOGRAM_CHART from "../../../../components/Chart/DTC/HISTOGRAM_CHART";
import XBAR_CHART from "../../../../components/Chart/DTC/XBAR_CHART";
import R_CHART from "../../../../components/Chart/DTC/R_CHART";
import CPK_CHART from "../../../../components/Chart/DTC/CPK_CHART";
import { CPK_DATA, HISTOGRAM_DATA, XBAR_DATA } from "../../interfaces/qcInterface";

interface PrecisionKQDTCChartsProps {
  selectedData: any;
  xbarData: XBAR_DATA[];
  cpkData: CPK_DATA[];
  histogramData: HISTOGRAM_DATA[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const PrecisionKQDTCCharts: React.FC<PrecisionKQDTCChartsProps> = ({
  selectedData,
  xbarData,
  cpkData,
  histogramData,
  isCollapsed,
  onToggleCollapse,
}) => {
  const hasData = xbarData.length > 0 || cpkData.length > 0 || histogramData.length > 0;

  return (
    <div className="precision-kqdtc__chartsSection">
      {/* Context Banner */}
      <div className="precision-kqdtc__chartBanner">
        <div className="precision-kqdtc__bannerLeft">
          <div className="tag-item">
            <span className="label">Sản phẩm:</span>
            <span className="val">{selectedData?.G_NAME || "Chưa chọn"}</span>
          </div>
          <span className="divider">|</span>
          <div className="tag-item">
            <span className="label">Vật liệu:</span>
            <span className="val">{selectedData?.M_NAME || "--"}</span>
          </div>
          <span className="divider">|</span>
          <div className="tag-item">
            <span className="label">Hạng mục test:</span>
            <span className="val val--highlight">{selectedData?.TEST_NAME || "--"}</span>
          </div>
          <span className="divider">|</span>
          <div className="tag-item">
            <span className="label">Test point:</span>
            <span className="val">{selectedData?.POINT_CODE || "--"}</span>
          </div>
        </div>

        <div className="precision-kqdtc__bannerRight">
          <button type="button" onClick={onToggleCollapse}>
            {isCollapsed ? <FiChevronDown size={14} /> : <FiChevronUp size={14} />}
            <span>{isCollapsed ? "Hiện Biểu Đồ" : "Ẩn Biểu Đồ"}</span>
          </button>
        </div>
      </div>

      {/* 4 SPC Charts Grid */}
      {!isCollapsed && (
        <>
          {hasData ? (
            <div className="precision-kqdtc__chartsGrid">
              {/* Biểu đồ 1: HISTOGRAM */}
              <div className="precision-kqdtc__chartCard">
                <div className="chart-card-header">
                  <h4>HISTOGRAM CHART</h4>
                  <div className="legend-chips">
                    <span style={{ color: "#2563eb" }}>■ CNT</span>
                    <span style={{ color: "#059669" }}>— Normal</span>
                  </div>
                </div>
                <div className="chart-card-body">
                  {histogramData.length > 0 ? (
                    <HISTOGRAM_CHART dldata={histogramData} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 11 }}>
                      Chưa có dữ liệu Histogram
                    </div>
                  )}
                </div>
              </div>

              {/* Biểu đồ 2: XBAR CHART */}
              <div className="precision-kqdtc__chartCard">
                <div className="chart-card-header">
                  <h4>XBAR CHART (n=5)</h4>
                  <div className="legend-chips">
                    <span style={{ color: "#059669" }}>● AVG</span>
                    <span style={{ color: "#e11d48" }}>-- UCL/LCL</span>
                    <span style={{ color: "#2563eb" }}>-- CL</span>
                  </div>
                </div>
                <div className="chart-card-body">
                  {xbarData.length > 0 ? (
                    <XBAR_CHART dldata={xbarData} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 11 }}>
                      Chưa có dữ liệu Xbar
                    </div>
                  )}
                </div>
              </div>

              {/* Biểu đồ 3: R CHART */}
              <div className="precision-kqdtc__chartCard">
                <div className="chart-card-header">
                  <h4>R CHART (n=5)</h4>
                  <div className="legend-chips">
                    <span style={{ color: "#0d9488" }}>● R_VAL</span>
                    <span style={{ color: "#e11d48" }}>-- UCL</span>
                    <span style={{ color: "#2563eb" }}>-- CL</span>
                  </div>
                </div>
                <div className="chart-card-body">
                  {xbarData.length > 0 ? (
                    <R_CHART dldata={xbarData} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 11 }}>
                      Chưa có dữ liệu R-Chart
                    </div>
                  )}
                </div>
              </div>

              {/* Biểu đồ 4: CPK TREND */}
              <div className="precision-kqdtc__chartCard">
                <div className="chart-card-header">
                  <h4>CPK TREND (n=32)</h4>
                  <div className="legend-chips">
                    <span style={{ color: "#059669" }}>● CPK</span>
                    <span style={{ color: "#e11d48" }}>-- Chuẩn 1.33</span>
                  </div>
                </div>
                <div className="chart-card-body">
                  {cpkData.length > 0 ? (
                    <CPK_CHART dldata={cpkData} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 11 }}>
                      Chưa có dữ liệu Cpk
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "16px 20px",
                textAlign: "center",
                background: "#f8fafc",
                color: "#64748b",
                fontSize: 11.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FiBarChart2 size={16} color="#2563eb" />
              <span>
                💡 <b>Gợi ý thao tác:</b> Nhấp đúp chuột (Double click) vào bất kỳ dòng nào trên bảng để nạp dữ liệu chi tiết và phân tích 4 biểu đồ SPC (Histogram, Xbar, R, Cpk).
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(PrecisionKQDTCCharts);

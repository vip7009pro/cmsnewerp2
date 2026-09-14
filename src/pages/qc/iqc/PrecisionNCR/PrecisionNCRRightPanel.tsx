import React from "react";
import {
  AiOutlineCamera,
  AiOutlineExpandAlt,
  AiOutlineDownload,
  AiOutlineWarning,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import AGTable from "../../../../components/DataTable/AGTable";
import { HOLDDING_BY_NCR_ID, NCR_DATA } from "../../interfaces/qcInterface";

interface PrecisionNCRRightPanelProps {
  selectedNCR: NCR_DATA | null;
  holdingData: HOLDDING_BY_NCR_ID[];
  holdingColumns: any[];
  onUploadDefectImage: (file: File, ncrId: number) => void;
  onExportHoldingExcel: (type: 1 | 2) => void;
}

export const PrecisionNCRRightPanel: React.FC<PrecisionNCRRightPanelProps> = ({
  selectedNCR,
  holdingData,
  holdingColumns,
  onUploadDefectImage,
  onExportHoldingExcel,
}) => {
  const hasImage =
    selectedNCR &&
    selectedNCR.DEFECT_IMAGE !== "N" &&
    selectedNCR.DEFECT_IMAGE !== null &&
    selectedNCR.DEFECT_IMAGE !== undefined &&
    selectedNCR.DEFECT_IMAGE !== "P";

  const imageUrl = selectedNCR ? `/ncrimage/NCR_${selectedNCR.NCR_ID}.png` : "";

  // Thống kê tổng cuộn và tổng mét
  const totalRoll = holdingData.reduce(
    (acc, r) => acc + (Number(r.TOTAL_HOLDING_ROLL) || 0),
    0
  );
  const totalM = holdingData.reduce(
    (acc, r) => acc + (Number(r.TOTAL_HOLDING_M) || 0),
    0
  );

  return (
    <aside className="precision-ncr-right-panel">
      {/* 1. TOP CARD: ẢNH LỖI (DEFECT IMAGE) */}
      <div className="defect-image-card">
        <div className="defect-image-card__header">
          <h4>
            <AiOutlineCamera size={13} />
            <span>ẢNH LỖI (DEFECT IMAGE)</span>
          </h4>
          {hasImage && (
            <div className="actions">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Phóng to ảnh trong tab mới"
              >
                <button type="button">
                  <AiOutlineExpandAlt size={12} />
                </button>
              </a>
              <a href={imageUrl} download={`NCR_${selectedNCR?.NCR_ID}.png`} title="Tải ảnh gốc">
                <button type="button">
                  <AiOutlineDownload size={12} />
                </button>
              </a>
            </div>
          )}
        </div>

        <div className="defect-image-card__preview">
          {hasImage ? (
            <>
              <img src={imageUrl} alt="Defect Visual" />
              <div className="tag-ng">NG REJECT</div>
              <div className="overlay-info">
                <p className="title">{selectedNCR?.DEFECT_TITLE || "Lỗi bất thường"}</p>
                <p className="detail">{selectedNCR?.DEFECT_DETAIL || "Xem chi tiết biên bản"}</p>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <AiOutlineCamera size={24} />
              <span>
                {selectedNCR
                  ? "Chưa có ảnh lỗi cho phiếu này"
                  : "Nhấp chọn một NCR để xem ảnh"}
              </span>
              {selectedNCR && (
                <label
                  className="ncr-upload-btn"
                  style={{ marginTop: 4, cursor: "pointer" }}
                >
                  <AiOutlineCloudUpload size={13} />
                  <span>Tải ảnh PNG lên</span>
                  <input
                    type="file"
                    accept=".png"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && selectedNCR) {
                        onUploadDefectImage(file, selectedNCR.NCR_ID);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {selectedNCR && (
          <div className="defect-image-card__meta">
            <span className="lot">LOT: {selectedNCR.CMS_LOT || "N/A"}</span>
            <span>NV: {selectedNCR.INS_EMPL || "IQC"}</span>
          </div>
        )}
      </div>

      {/* 2. BOTTOM CARD: BẢNG HOLDING - FAILING DETAIL */}
      <div className="holding-detail-card">
        <div className="holding-detail-card__header">
          <h4>
            <AiOutlineWarning size={13} />
            <span>Holding - Failing Detail</span>
          </h4>
          <div className="btn-group">
            <button
              className="btn-ex"
              onClick={() => onExportHoldingExcel(1)}
              title="Xuất Excel"
            >
              EX1
            </button>
            <button
              className="btn-ex"
              onClick={() => onExportHoldingExcel(2)}
              title="Xuất toàn bộ Excel"
            >
              EX2
            </button>
            <button
              className="btn-piv"
              onClick={() => onExportHoldingExcel(2)}
              title="Pivot phân tích"
            >
              PIVOT
            </button>
          </div>
        </div>

        <div className="holding-detail-card__grid-wrapper">
          <AGTable
            columns={holdingColumns}
            data={holdingData}
            onRowClick={() => {}}
            onSelectionChange={() => {}}
          />
        </div>

        <div className="holding-detail-card__summary">
          <span>
            Tổng giữ: <strong>{totalRoll} Cuộn</strong> ({totalM.toLocaleString()}m)
          </span>
          <span>{holdingData.length} rows</span>
        </div>
      </div>
    </aside>
  );
};

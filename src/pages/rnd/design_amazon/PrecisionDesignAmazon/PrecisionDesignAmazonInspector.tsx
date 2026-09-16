import React, { useState } from "react";
import {
  MdClose,
  MdDeleteOutline,
  MdUploadFile,
  MdTune,
  MdHistory,
  MdLayers,
} from "react-icons/md";
import { Tooltip, IconButton } from "@mui/material";
import { COMPONENT_DATA } from "../../interfaces/rndInterface";

interface PrecisionDesignAmazonInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedComponent: COMPONENT_DATA | undefined;
  currentIndex: number;
  totalComponents: number;
  onUpdateComponent: (index: number, patch: Partial<COMPONENT_DATA>, commit?: boolean) => void;
  onDeleteComponent: (index: number) => void;
  onPickAndUploadImage: () => Promise<string | null>;
  historyPast: COMPONENT_DATA[][];
  onJumpToHistory: (index: number) => void;
}

export const PrecisionDesignAmazonInspector: React.FC<PrecisionDesignAmazonInspectorProps> = ({
  isOpen,
  onClose,
  selectedComponent,
  currentIndex,
  totalComponents,
  onUpdateComponent,
  onDeleteComponent,
  onPickAndUploadImage,
  historyPast,
  onJumpToHistory,
}) => {
  const [activeTab, setActiveTab] = useState<"props" | "history">("props");

  if (!isOpen) return null;

  return (
    <aside className="precision-amz-design__inspector">
      <div className="precision-amz-design__inspectorHeader">
        <div className="precision-amz-design__inspectorTabs">
          <button
            type="button"
            className={`precision-amz-design__inspectorTab ${activeTab === "props" ? "is-active" : ""}`}
            onClick={() => setActiveTab("props")}
          >
            <MdTune size={15} />
            <span>Thuộc Tính</span>
          </button>

          <button
            type="button"
            className={`precision-amz-design__inspectorTab ${activeTab === "history" ? "is-active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <MdHistory size={15} />
            <span>Lịch Sử ({historyPast.length})</span>
          </button>
        </div>

        <Tooltip title="Đóng panel">
          <IconButton size="small" onClick={onClose} className="precision-amz-design__iconBtn">
            <MdClose size={16} />
          </IconButton>
        </Tooltip>
      </div>

      <div className="precision-amz-design__inspectorBody">
        {activeTab === "props" ? (
          selectedComponent ? (
            <div className="precision-amz-design__propsForm">
              <div className="precision-amz-design__elementBanner">
                <div className="precision-amz-design__elementBannerLeft">
                  <span className="precision-amz-design__elementStt">
                    #{selectedComponent.DOITUONG_STT || selectedComponent.DOITUONG_NO}
                  </span>
                  <span className="precision-amz-design__elementTitle">
                    {selectedComponent.DOITUONG_NAME || "Chưa đặt tên"}
                  </span>
                </div>
                <span className="precision-amz-design__typeBadge">
                  {selectedComponent.PHANLOAI_DT}
                </span>
              </div>

              {/* Phân loại & Tên */}
              <div className="precision-amz-design__fieldRow">
                <div className="precision-amz-design__fieldGroup">
                  <label>LOẠI ĐỐI TƯỢNG</label>
                  <select
                    value={selectedComponent.PHANLOAI_DT}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { PHANLOAI_DT: e.target.value }, true)
                    }
                  >
                    <option value="TEXT">TEXT (Văn bản)</option>
                    <option value="IMAGE">IMAGE (Hình ảnh)</option>
                    <option value="1D BARCODE">1D BARCODE (Mã vạch)</option>
                    <option value="2D MATRIX">2D MATRIX (DataMatrix)</option>
                    <option value="QRCODE">QRCODE (Mã QR)</option>
                    <option value="CONTAINER">CONTAINER (Khung bao)</option>
                  </select>
                </div>
              </div>

              <div className="precision-amz-design__fieldRow">
                <div className="precision-amz-design__fieldGroup">
                  <label>TÊN ĐỐI TƯỢNG</label>
                  <input
                    type="text"
                    value={selectedComponent.DOITUONG_NAME || ""}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { DOITUONG_NAME: e.target.value }, false)
                    }
                  />
                </div>

                <div className="precision-amz-design__fieldGroup precision-amz-design__fieldGroup--short">
                  <label>STT</label>
                  <input
                    type="text"
                    value={selectedComponent.DOITUONG_STT || ""}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { DOITUONG_STT: e.target.value }, false)
                    }
                  />
                </div>
              </div>

              {/* Giá trị / Nội dung */}
              <div className="precision-amz-design__fieldRow">
                <div className="precision-amz-design__fieldGroup">
                  <div className="precision-amz-design__labelWithAction">
                    <label>GIÁ TRỊ / NỘI DUNG</label>
                    {selectedComponent.PHANLOAI_DT === "IMAGE" && (
                      <button
                        type="button"
                        className="precision-amz-design__miniUploadBtn"
                        onClick={async () => {
                          const url = await onPickAndUploadImage();
                          if (url) {
                            onUpdateComponent(currentIndex, { GIATRI: url }, true);
                          }
                        }}
                      >
                        <MdUploadFile size={13} />
                        <span>Đổi Ảnh</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={selectedComponent.GIATRI || ""}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { GIATRI: e.target.value }, false)
                    }
                  />
                </div>
              </div>

              {/* Tọa độ & Kích thước (2x2 Grid) */}
              <div className="precision-amz-design__sectionDivider">
                <span>VỊ TRÍ & KÍCH THƯỚC (MM)</span>
              </div>

              <div className="precision-amz-design__grid2x2">
                <div className="precision-amz-design__fieldGroup">
                  <label>TỌA ĐỘ X (MM)</label>
                  <input
                    type="number"
                    step={0.01}
                    value={selectedComponent.POS_X ?? 0}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { POS_X: Number(e.target.value) }, false)
                    }
                  />
                </div>

                <div className="precision-amz-design__fieldGroup">
                  <label>TỌA ĐỘ Y (MM)</label>
                  <input
                    type="number"
                    step={0.01}
                    value={selectedComponent.POS_Y ?? 0}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { POS_Y: Number(e.target.value) }, false)
                    }
                  />
                </div>

                <div className="precision-amz-design__fieldGroup">
                  <label>CHIỀU RỘNG W (MM)</label>
                  <input
                    type="number"
                    step={0.01}
                    value={selectedComponent.SIZE_W ?? 0}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { SIZE_W: Number(e.target.value) }, false)
                    }
                  />
                </div>

                <div className="precision-amz-design__fieldGroup">
                  <label>CHIỀU CAO H (MM)</label>
                  <input
                    type="number"
                    step={0.01}
                    value={selectedComponent.SIZE_H ?? 0}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { SIZE_H: Number(e.target.value) }, false)
                    }
                  />
                </div>
              </div>

              <div className="precision-amz-design__fieldRow">
                <div className="precision-amz-design__fieldGroup">
                  <label>GÓC XOAY (ĐỘ °)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={selectedComponent.ROTATE ?? 0}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { ROTATE: Number(e.target.value) }, true)
                    }
                  />
                </div>

                <div className="precision-amz-design__fieldGroup">
                  <label>CAVITY IN</label>
                  <input
                    type="number"
                    value={selectedComponent.CAVITY_PRINT ?? 2}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { CAVITY_PRINT: Number(e.target.value) }, false)
                    }
                  />
                </div>
              </div>

              {/* Font Typography */}
              <div className="precision-amz-design__sectionDivider">
                <span>ĐỊNH DẠNG CHỮ & KIỂU DÁNG</span>
              </div>

              <div className="precision-amz-design__fieldRow">
                <div className="precision-amz-design__fieldGroup">
                  <label>TÊN FONT</label>
                  <input
                    type="text"
                    value={selectedComponent.FONT_NAME || "Arial"}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { FONT_NAME: e.target.value }, false)
                    }
                  />
                </div>

                <div className="precision-amz-design__fieldGroup precision-amz-design__fieldGroup--short">
                  <label>CỠ (PT)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={selectedComponent.FONT_SIZE ?? 6}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { FONT_SIZE: Number(e.target.value) }, false)
                    }
                  />
                </div>
              </div>

              <div className="precision-amz-design__fieldRow">
                <div className="precision-amz-design__fieldGroup">
                  <label>KIỂU CHỮ (FONT STYLE)</label>
                  <select
                    value={selectedComponent.FONT_STYLE || "B"}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { FONT_STYLE: e.target.value }, true)
                    }
                  >
                    <option value="B">Bold (In Đậm)</option>
                    <option value="I">Italic (In Nghiêng)</option>
                    <option value="U">Underline (Gạch Chân)</option>
                    <option value="R">Regular (Bình Thường)</option>
                  </select>
                </div>
              </div>

              <div className="precision-amz-design__fieldRow">
                <div className="precision-amz-design__fieldGroup">
                  <label>GHI CHÚ (REMARK)</label>
                  <input
                    type="text"
                    value={selectedComponent.REMARK || ""}
                    onChange={(e) =>
                      onUpdateComponent(currentIndex, { REMARK: e.target.value }, false)
                    }
                  />
                </div>
              </div>

              {/* Xóa đối tượng */}
              <div className="precision-amz-design__propsAction">
                <button
                  type="button"
                  className="precision-amz-design__deleteBtn"
                  onClick={() => onDeleteComponent(currentIndex)}
                >
                  <MdDeleteOutline size={16} />
                  <span>XÓA ĐỐI TƯỢNG NÀY</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="precision-amz-design__emptyState">
              <MdLayers size={36} className="precision-amz-design__emptyIcon" />
              <p className="precision-amz-design__emptyTitle">Chưa chọn đối tượng nào</p>
              <p className="precision-amz-design__emptyDesc">
                Nhấp chuột vào một đối tượng trên Canvas hoặc trên bảng bên dưới để xem và chỉnh sửa thuộc tính.
              </p>
            </div>
          )
        ) : (
          <div className="precision-amz-design__historyList">
            {historyPast.map((item, index) => (
              <div key={index} className="precision-amz-design__historyItem">
                <div className="precision-amz-design__historyInfo">
                  <span className="precision-amz-design__historyTitle">Bước #{index + 1}</span>
                  <span className="precision-amz-design__historySub">
                    {item.length} đối tượng lưu trữ
                  </span>
                </div>
                <button
                  type="button"
                  className="precision-amz-design__historyJumpBtn"
                  onClick={() => onJumpToHistory(index)}
                >
                  Khôi phục
                </button>
              </div>
            ))}
            {historyPast.length === 0 && (
              <div className="precision-amz-design__emptyState">
                <MdHistory size={36} className="precision-amz-design__emptyIcon" />
                <p className="precision-amz-design__emptyTitle">Chưa có lịch sử thao tác</p>
                <p className="precision-amz-design__emptyDesc">
                  Mỗi lần kéo thả, thay đổi thuộc tính, hệ thống sẽ tự động ghi lại tại đây để hoàn tác.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

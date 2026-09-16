import React from "react";
import {
  MdViewSidebar,
  MdTune,
  MdTableChart,
  MdFullscreen,
  MdFullscreenExit,
  MdRefresh,
} from "react-icons/md";
import { Tooltip, IconButton } from "@mui/material";

interface PrecisionDesignAmazonHeaderProps {
  codeinfoCMS: string;
  codeinfoKD: string;
  componentCount: number;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  showInspector: boolean;
  setShowInspector: React.Dispatch<React.SetStateAction<boolean>>;
  showTable: boolean;
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onRefresh: () => void;
}

export const PrecisionDesignAmazonHeader: React.FC<PrecisionDesignAmazonHeaderProps> = ({
  codeinfoCMS,
  codeinfoKD,
  componentCount,
  showSidebar,
  setShowSidebar,
  showInspector,
  setShowInspector,
  showTable,
  setShowTable,
  isFullscreen,
  toggleFullscreen,
  onRefresh,
}) => {
  return (
    <header className="precision-amz-design__header">
      <div className="precision-amz-design__headerLeft">
        <div className="precision-amz-design__breadcrumb">
          <span className="precision-amz-design__sectionTag">02. R&D • THIẾT KẾ TEM NHÃN</span>
          <span className="precision-amz-design__separator">/</span>
          <span className="precision-amz-design__pageTitle">AMAZON LABEL DESIGN STUDIO</span>
          <span className="precision-amz-design__appBadge">CMS R&D</span>
          <span className="precision-amz-design__specBadge">INDUSTRIAL CAD</span>
        </div>

        {codeinfoCMS ? (
          <div className="precision-amz-design__codeChip" title={`Mã KH: ${codeinfoKD || "N/A"}`}>
            <span className="precision-amz-design__codeLabel">MÃ ĐANG CHỌN:</span>
            <span className="precision-amz-design__codeValue">{codeinfoCMS}</span>
            {codeinfoKD && <span className="precision-amz-design__codeSub">({codeinfoKD})</span>}
          </div>
        ) : (
          <div className="precision-amz-design__codeChip precision-amz-design__codeChip--empty">
            <span className="precision-amz-design__codeLabel">CHƯA CHỌN MÃ HÀNG</span>
          </div>
        )}
      </div>

      <div className="precision-amz-design__headerRight">
        <div className="precision-amz-design__telemetry">
          <span className="precision-amz-design__pulseDot" />
          <span className="precision-amz-design__pulseText">LIVE • CAD STUDIO</span>
          <span className="precision-amz-design__countBadge">{componentCount} đối tượng</span>
        </div>

        <div className="precision-amz-design__headerActions">
          <Tooltip title={showSidebar ? "Thu gọn danh mục mã hàng" : "Mở danh mục mã hàng"}>
            <button
              type="button"
              className={`precision-amz-design__toggleBtn ${showSidebar ? "is-active" : ""}`}
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              <MdViewSidebar size={16} />
              <span>Mã Hàng</span>
            </button>
          </Tooltip>

          <Tooltip title={showTable ? "Thu gọn bảng đối tượng" : "Mở bảng đối tượng"}>
            <button
              type="button"
              className={`precision-amz-design__toggleBtn ${showTable ? "is-active" : ""}`}
              onClick={() => setShowTable((prev) => !prev)}
            >
              <MdTableChart size={16} />
              <span>Bảng Đối Tượng</span>
            </button>
          </Tooltip>

          <Tooltip title={showInspector ? "Thu gọn thuộc tính" : "Mở thuộc tính đối tượng"}>
            <button
              type="button"
              className={`precision-amz-design__toggleBtn ${showInspector ? "is-active" : ""}`}
              onClick={() => setShowInspector((prev) => !prev)}
            >
              <MdTune size={16} />
              <span>Thuộc Tính</span>
            </button>
          </Tooltip>

          <Tooltip title="Làm mới trạng thái">
            <IconButton size="small" onClick={onRefresh} className="precision-amz-design__iconBtn">
              <MdRefresh size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình Studio"}>
            <IconButton size="small" onClick={toggleFullscreen} className="precision-amz-design__iconBtn">
              {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

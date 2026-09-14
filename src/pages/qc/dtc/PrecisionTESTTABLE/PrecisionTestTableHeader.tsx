import React from "react";
import {
  IoRefreshOutline,
  IoExpandOutline,
  IoContractOutline,
  IoOptionsOutline,
} from "react-icons/io5";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionTestTableHeaderProps {
  userData?: UserData;
  onRefresh: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const PrecisionTestTableHeader: React.FC<PrecisionTestTableHeaderProps> = ({
  userData,
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="precision-testtable__header">
      <div className="precision-testtable__headerLeft">
        <div className="precision-testtable__headerIcon">
          <IoOptionsOutline size={18} />
        </div>
        <div className="precision-testtable__headerInfo">
          <div className="precision-testtable__headerTitleGroup">
            <span className="precision-testtable__headerTag">04. QC • ĐTC</span>
            <h1 className="precision-testtable__headerTitle">
              DANH MỤC HẠNG MỤC & ĐIỂM ĐO ĐTC (TEST & POINT MASTER)
            </h1>
            <span className="precision-testtable__headerBadge">CONFIG MASTER</span>
          </div>
          <div className="precision-testtable__headerSub">
            Quản lý mã định danh, tên hạng mục kiểm tra độ tin cậy và cấu hình các điểm đo (Points) tương ứng
          </div>
        </div>
      </div>

      <div className="precision-testtable__headerRight">
        {/* Telemetry Indicator */}
        <div className="precision-testtable__telemetry">
          <span className="precision-testtable__statusDot" />
          <span className="precision-testtable__statusText">NET_SERVER: 3007 (Online)</span>
        </div>

        {/* User Account Info */}
        <div className="precision-testtable__userInfo">
          <span className="precision-testtable__userName">
            👤 {userData?.EMPL_NO || "QC_ADMIN"}
          </span>
        </div>

        {/* Header Action Buttons */}
        <div className="precision-testtable__headerActions">
          <button
            type="button"
            className="precision-testtable__headerBtn"
            onClick={onRefresh}
            title="Tải lại toàn bộ dữ liệu danh mục"
          >
            <IoRefreshOutline size={15} />
            <span>Nạp lại</span>
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              className="precision-testtable__headerBtn"
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Thu nhỏ cửa sổ" : "Mở rộng toàn màn hình"}
            >
              {isFullscreen ? <IoContractOutline size={15} /> : <IoExpandOutline size={15} />}
              <span>{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTestTableHeader);

import React from "react";
import {
  IoRefreshOutline,
  IoExpandOutline,
  IoContractOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionDTCResultHeaderProps {
  userData?: UserData;
  onRefresh: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const PrecisionDTCResultHeader: React.FC<PrecisionDTCResultHeaderProps> = ({
  userData,
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="precision-dtcresult__header">
      <div className="precision-dtcresult__headerLeft">
        <div className="precision-dtcresult__headerIcon">
          <IoSpeedometerOutline size={18} />
        </div>
        <div className="precision-dtcresult__headerInfo">
          <div className="precision-dtcresult__headerTitleGroup">
            <span className="precision-dtcresult__headerTag">04. QC • ĐTC</span>
            <h1 className="precision-dtcresult__headerTitle">
              NHẬP KẾT QUẢ ĐO ĐỘ TIN CẬY (DTC RESULT)
            </h1>
            <span className="precision-dtcresult__headerBadge">RESULT ENTRY</span>
          </div>
          <div className="precision-dtcresult__headerSub">
            Ghi nhận số đo thực tế, kiểm soát dung sai Center/Tor tự động và nhập dữ liệu đo quang phổ XRF/RoHS
          </div>
        </div>
      </div>

      <div className="precision-dtcresult__headerRight">
        <div className="precision-dtcresult__telemetry">
          <span className="precision-dtcresult__statusDot" />
          <span className="precision-dtcresult__statusText">NET_SERVER: 3007 (Online)</span>
        </div>

        <div className="precision-dtcresult__userInfo">
          <span className="precision-dtcresult__userName">
            {userData?.EMPL_NO || "QC Inspector"}
          </span>
          <span style={{ color: "#64748b", marginLeft: "4px" }}>
            ({userData?.MAINDEPTNAME || "QC"})
          </span>
        </div>

        <div className="precision-dtcresult__headerActions">
          <button
            type="button"
            className="precision-dtcresult__headerBtn"
            onClick={onRefresh}
            title="Nạp lại dữ liệu điểm đo"
          >
            <IoRefreshOutline size={15} />
            <span>Nạp lại</span>
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              className="precision-dtcresult__headerBtn"
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
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

export default React.memo(PrecisionDTCResultHeader);

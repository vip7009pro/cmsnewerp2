import React from "react";
import { IoRefreshOutline, IoExpandOutline, IoContractOutline, IoFlaskOutline } from "react-icons/io5";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionDKDTCHeaderProps {
  userData?: UserData;
  onRefresh: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const PrecisionDKDTCHeader: React.FC<PrecisionDKDTCHeaderProps> = ({
  userData,
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="precision-dkdtc__header">
      <div className="precision-dkdtc__headerLeft">
        <div className="precision-dkdtc__headerIcon">
          <IoFlaskOutline size={18} />
        </div>
        <div className="precision-dkdtc__headerInfo">
          <div className="precision-dkdtc__headerTitleGroup">
            <span className="precision-dkdtc__headerTag">04. QC • ĐTC</span>
            <h1 className="precision-dkdtc__headerTitle">ĐĂNG KÝ TEST ĐỘ TIN CẬY (DTC)</h1>
            <span className="precision-dkdtc__headerBadge">QC RELIABILITY</span>
          </div>
          <div className="precision-dkdtc__headerSub">
            Hệ thống tiếp nhận và quản lý đăng ký kiểm tra độ tin cậy mẫu sản phẩm PQC/OQC & nguyên vật liệu IQC
          </div>
        </div>
      </div>

      <div className="precision-dkdtc__headerRight">
        <div className="precision-dkdtc__telemetry">
          <span className="precision-dkdtc__statusDot" />
          <span className="precision-dkdtc__statusText">NET_SERVER: 3007 (Online)</span>
        </div>

        <div className="precision-dkdtc__userInfo">
          <span className="precision-dkdtc__userLabel">Nhân viên:</span>
          <span className="precision-dkdtc__userName">
            {userData?.EMPL_NO || "Khách"}
          </span>
          <span className="precision-dkdtc__userDept">
            ({userData?.MAINDEPTNAME || "QC"})
          </span>
        </div>

        <div className="precision-dkdtc__headerActions">
          <button
            type="button"
            className="precision-dkdtc__headerBtn"
            onClick={onRefresh}
            title="Tải lại dữ liệu kiểm tra"
          >
            <IoRefreshOutline size={15} />
            <span>Nạp lại</span>
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              className="precision-dkdtc__headerBtn"
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Thu nhỏ màn hình" : "Mở rộng toàn màn hình"}
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

export default React.memo(PrecisionDKDTCHeader);

import "./BTP_AUTO.scss";
import "./PrecisionBtpAuto/PrecisionBtpAuto.scss";
import { useBtpAutoData } from "./PrecisionBtpAuto/useBtpAutoData";
import PrecisionBtpAutoHeader from "./PrecisionBtpAuto/PrecisionBtpAutoHeader";
import PrecisionBtpAutoKpi from "./PrecisionBtpAuto/PrecisionBtpAutoKpi";
import PrecisionBtpAutoGrid from "./PrecisionBtpAuto/PrecisionBtpAutoGrid";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";

/**
 * BTP_AUTO — Tra Cứu Bán Thành Phẩm (BTP) Tự Động
 * Controller chính tinh gọn kết nối subcomponents chuẩn Google Stitch.
 */
const BTP_AUTO = () => {
  const {
    btpData,
    filteredData,
    viewMode,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    lastUpdated,
    showGiaoNhan,
    setShowGiaoNhan,
    kpiData,
    handleSwitchMode,
    handleExportExcel,
  } = useBtpAutoData();

  return (
    <div className="precision-btpauto">
      {/* Header */}
      <PrecisionBtpAutoHeader
        dataLength={filteredData.length}
        lastUpdated={lastUpdated}
        viewMode={viewMode}
        isLoading={isLoading}
      />

      {/* KPI Dashboard */}
      <PrecisionBtpAutoKpi
        kpiData={kpiData}
        viewMode={viewMode}
        dataLength={btpData.length}
      />

      {/* Grid + Segmented Tabs + Search + Excel */}
      <PrecisionBtpAutoGrid
        viewMode={viewMode}
        filteredData={filteredData}
        totalDataLength={btpData.length}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        isLoading={isLoading}
        onSwitchMode={handleSwitchMode}
        onExportExcel={handleExportExcel}
      />

      {/* QLGN Overlay (Quản lý giao nhận) */}
      {showGiaoNhan && (
        <div className="precision-btpauto__qlgnOverlay">
          <button
            type="button"
            className="precision-btpauto__qlgnClose"
            onClick={() => setShowGiaoNhan(false)}
          >
            ✕ Đóng
          </button>
          <div className="precision-btpauto__qlgnContent">
            <QLGN />
          </div>
        </div>
      )}
    </div>
  );
};

export default BTP_AUTO;

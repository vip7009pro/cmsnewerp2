import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useVOCHistoryData } from "./PrecisionVOCHistory/useVOCHistoryData";
import { PrecisionVOCHistoryToolbar } from "./PrecisionVOCHistory/PrecisionVOCHistoryToolbar";
import { PrecisionVOCHistoryGrid } from "./PrecisionVOCHistory/PrecisionVOCHistoryGrid";
import "./PrecisionVOCHistory/PrecisionVOCHistory.scss";

/**
 * VOC_HISTORY - Thư viện trực quan khiếu nại khách hàng Voice of Customer (VOC)
 * Chuẩn thiết kế: Single Unified Header & TV Mode F11 Fullscreen
 * Tối ưu vận hành: Barcode Scanner rảnh tay không cần chuột/bàn phím
 */
const VOC_HISTORY: React.FC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);

  const {
    searchInputRef,
    searchInputValue,
    setSearchInputValue,
    appliedSearchValue,
    useMachineScan,
    setUseMachineScan,
    showAll,
    setShowAll,
    isTvMode,
    toggleFullscreen,
    allVocData,
    visibleData,
    isLoading,
    loadVocHistoryData,
    commitSearch,
    clearSearch,
    focusSearchInput,
  } = useVOCHistoryData();

  return (
    <div
      className={`precision-voc-history ${isTvMode ? "precision-voc-history--tv" : ""}`}
      style={{
        backgroundImage: !isTvMode ? theme?.CMS?.backgroundImage : undefined,
      }}
    >
      {/* Duy nhất 1 Header điều khiển: Quét mã vạch + Toggles + TV Mode F11 */}
      <PrecisionVOCHistoryToolbar
        searchInputRef={searchInputRef}
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        appliedSearchValue={appliedSearchValue}
        useMachineScan={useMachineScan}
        setUseMachineScan={setUseMachineScan}
        showAll={showAll}
        setShowAll={setShowAll}
        isTvMode={isTvMode}
        toggleFullscreen={toggleFullscreen}
        isLoading={isLoading}
        onCommitSearch={commitSearch}
        onClearSearch={clearSearch}
        visibleCount={visibleData.length}
        totalCount={allVocData.length}
        onReload={loadVocHistoryData}
        focusSearchInput={focusSearchInput}
      />

      {/* Lưới thẻ ảnh khiếu nại VOC 16:9 */}
      <PrecisionVOCHistoryGrid
        data={visibleData}
        isLoading={isLoading}
        appliedSearchValue={appliedSearchValue}
      />
    </div>
  );
};

export default VOC_HISTORY;
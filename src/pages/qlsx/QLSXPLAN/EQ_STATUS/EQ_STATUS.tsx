import React, { useState, useMemo, useCallback } from "react";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
import { useEqStatusData } from "./PrecisionEqStatus/useEqStatusData";
import { PrecisionEqStatusHeader } from "./PrecisionEqStatus/PrecisionEqStatusHeader";
import { PrecisionEqStatusToolbar } from "./PrecisionEqStatus/PrecisionEqStatusToolbar";
import { PrecisionEqStatusMachineCard } from "./PrecisionEqStatus/PrecisionEqStatusMachineCard";
import { PrecisionEqStatusMobileHeader } from "./PrecisionEqStatus/PrecisionEqStatusMobileHeader";
import { PrecisionEqStatusMobileToolbar } from "./PrecisionEqStatus/PrecisionEqStatusMobileToolbar";
import { PrecisionEqStatusMobileFilterDrawer } from "./PrecisionEqStatus/PrecisionEqStatusMobileFilterDrawer";
import "./PrecisionEqStatus/PrecisionEqStatus.scss";

const EQ_STATUS: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const {
    showTime,
    setShowTime,
    fullScreen,
    handleToggleFullScreen,
    autoSlide,
    setAutoSlide,
    theme,
    handleToggleTheme,
    factory,
    setFactory,
    machine,
    setMachine,
    searchString,
    setSearchString,
    onlyRunning,
    setOnlyRunning,
    machineNumber,
    setMachineNumber,
    currentPage,
    totalPages,
    startMachineIdx,
    endMachineIdx,
    totalFilteredCount,
    currentPageMachines,
    factoryMetrics,
    eq_series,
    countdownProgress,
    handlePrevPage,
    handleNextPage,
  } = useEqStatusData();

  const getGridClass = () => {
    if (machineNumber <= 6) return "grid-count-6";
    if (machineNumber <= 8) return "grid-count-8";
    if (machineNumber <= 12) return "grid-count-12";
    return "grid-count-16";
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchString.trim() !== "") count++;
    if (onlyRunning) count++;
    if (factory !== "NM1") count++;
    if (machine !== "ED") count++;
    if (machineNumber !== 12) count++;
    return count;
  }, [searchString, onlyRunning, factory, machine, machineNumber]);

  const handleResetFilter = useCallback(() => {
    setFactory("NM1");
    setMachine("ED");
    setSearchString("");
    setOnlyRunning(false);
    setMachineNumber(12);
  }, [setFactory, setMachine, setSearchString, setOnlyRunning, setMachineNumber]);

  return (
    <div
      className={`precision-eq-status ${theme} ${fullScreen ? "fullscreen-mode" : ""} ${
        isMobile ? "is-mobile" : ""
      }`}
    >
      {/* 1. Header Andon TV: Viewport Conditional Rendering */}
      {!isMobile ? (
        <PrecisionEqStatusHeader
          factory={factory}
          machineType={machine}
          totalMachines={factoryMetrics.total}
          runningCount={factoryMetrics.running}
          settingCount={factoryMetrics.setting}
          stopCount={factoryMetrics.stop}
          currentPage={currentPage}
          totalPages={totalPages}
          startIdx={startMachineIdx}
          endIdx={endMachineIdx}
          totalFiltered={totalFilteredCount}
          autoSlide={autoSlide}
          onToggleAutoSlide={() => setAutoSlide((prev) => !prev)}
          fullScreen={fullScreen}
          onToggleFullScreen={handleToggleFullScreen}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          countdownProgress={countdownProgress}
        />
      ) : (
        <PrecisionEqStatusMobileHeader
          factory={factory}
          machineType={machine}
          totalMachines={factoryMetrics.total}
          runningCount={factoryMetrics.running}
          settingCount={factoryMetrics.setting}
          stopCount={factoryMetrics.stop}
          currentPage={currentPage}
          totalPages={totalPages}
          autoSlide={autoSlide}
          onToggleAutoSlide={() => setAutoSlide((prev) => !prev)}
          fullScreen={fullScreen}
          onToggleFullScreen={handleToggleFullScreen}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          countdownProgress={countdownProgress}
        />
      )}

      {/* 2. Thanh điều khiển Toolbar: Tự co gọn công thái học trên Mobile */}
      {!isMobile ? (
        <PrecisionEqStatusToolbar
          factory={factory}
          setFactory={setFactory}
          machine={machine}
          setMachine={setMachine}
          eqSeries={eq_series}
          machineNumber={machineNumber}
          setMachineNumber={setMachineNumber}
          showTime={showTime}
          setShowTime={setShowTime}
          onlyRunning={onlyRunning}
          setOnlyRunning={setOnlyRunning}
          searchString={searchString}
          setSearchString={setSearchString}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <PrecisionEqStatusMobileToolbar
          factory={factory}
          setFactory={setFactory}
          machine={machine}
          setMachine={setMachine}
          eqSeries={eq_series}
          machineNumber={machineNumber}
          setMachineNumber={setMachineNumber}
          onlyRunning={onlyRunning}
          setOnlyRunning={setOnlyRunning}
          searchString={searchString}
          setSearchString={setSearchString}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
          startIdx={startMachineIdx}
          endIdx={endMachineIdx}
          totalFiltered={totalFilteredCount}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          activeFilterCount={activeFilterCount}
          onReset={handleResetFilter}
        />
      )}

      {/* 3. Lưới hiển thị các thẻ máy Andon chuyên nghiệp */}
      <div className="machine-grid-container">
        {currentPageMachines.length > 0 ? (
          <div
            className={`machine-grid ${
              isMobile ? "mobile-machine-grid" : getGridClass()
            }`}
          >
            {currentPageMachines.map((element, index) => (
              <PrecisionEqStatusMachineCard
                key={element.EQ_NAME || index}
                data={element}
                searchString={searchString}
              />
            ))}
          </div>
        ) : (
          <div className="empty-machine-message">
            <span>Không có thiết bị phù hợp với điều kiện lọc</span>
          </div>
        )}
      </div>

      {/* 4. Bottom Sheet Filter Drawer (Chỉ mở trên Mobile khi người dùng bấm Lọc) */}
      {isMobile && showMobileFilter && (
        <PrecisionEqStatusMobileFilterDrawer
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          factory={factory}
          setFactory={setFactory}
          machine={machine}
          setMachine={setMachine}
          eqSeries={eq_series}
          machineNumber={machineNumber}
          setMachineNumber={setMachineNumber}
          showTime={showTime}
          setShowTime={setShowTime}
          onlyRunning={onlyRunning}
          setOnlyRunning={setOnlyRunning}
          autoSlide={autoSlide}
          setAutoSlide={setAutoSlide}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          searchString={searchString}
          setSearchString={setSearchString}
          onReset={handleResetFilter}
        />
      )}
    </div>
  );
};

export default EQ_STATUS;

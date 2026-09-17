import React from "react";
import { useEqStatusData } from "./PrecisionEqStatus/useEqStatusData";
import { PrecisionEqStatusHeader } from "./PrecisionEqStatus/PrecisionEqStatusHeader";
import { PrecisionEqStatusToolbar } from "./PrecisionEqStatus/PrecisionEqStatusToolbar";
import { PrecisionEqStatusMachineCard } from "./PrecisionEqStatus/PrecisionEqStatusMachineCard";
import "./PrecisionEqStatus/PrecisionEqStatus.scss";

const EQ_STATUS: React.FC = () => {
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

  return (
    <div
      className={`precision-eq-status ${theme} ${fullScreen ? "fullscreen-mode" : ""}`}
    >
      {/* 1. Header Andon TV: Đồng hồ số, KPI toàn xưởng, Countdown Bar */}
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

      {/* 2. Thanh điều khiển Toolbar TV */}
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

      {/* 3. Lưới hiển thị các thẻ máy Andon chuyên nghiệp */}
      <div className="machine-grid-container">
        {currentPageMachines.length > 0 ? (
          <div className={`machine-grid ${getGridClass()}`}>
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
    </div>
  );
};

export default EQ_STATUS;

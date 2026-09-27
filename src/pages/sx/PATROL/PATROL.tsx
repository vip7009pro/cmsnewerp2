import React, { useState, useMemo, useCallback, useEffect } from "react";
import "./PrecisionPATROL/PrecisionPATROL.scss";
import { usePatrolData, PatrolFilterLane } from "./PrecisionPATROL/usePatrolData";
import { usePatrolCards } from "./PrecisionPATROL/usePatrolCards";
import PrecisionPatrolHeader from "./PrecisionPATROL/PrecisionPatrolHeader";
import PrecisionPatrolToolbar from "./PrecisionPATROL/PrecisionPatrolToolbar";
import PrecisionPatrolLane from "./PrecisionPATROL/PrecisionPatrolLane";
import PrecisionPatrolCard, { PatrolCardData } from "./PrecisionPATROL/PrecisionPatrolCard";
import PrecisionPatrolModal from "./PrecisionPATROL/PrecisionPatrolModal";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import PrecisionPatrolMobileHeader from "./PrecisionPATROL/PrecisionPatrolMobileHeader";
import PrecisionPatrolMobileKpi from "./PrecisionPATROL/PrecisionPatrolMobileKpi";
import PrecisionPatrolMobileToolbar from "./PrecisionPATROL/PrecisionPatrolMobileToolbar";
import PrecisionPatrolMobileFilterDrawer from "./PrecisionPATROL/PrecisionPatrolMobileFilterDrawer";

const PATROL: React.FC = () => {
  const isMobile = useIsMobile();
  const patrol = usePatrolData();

  // Mobile specific UI states
  const [mobileSearchText, setMobileSearchText] = useState<string>("");
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

  // Hook xử lý chuẩn hóa thẻ & tìm kiếm realtime
  const {
    pqcCardItems,
    dtcCardItems,
    insCardItems,
    displayPqcItems,
    displayDtcItems,
    displayInsItems,
    displayAllItems,
  } = usePatrolCards({
    pqcdatatable: patrol.pqcdatatable,
    dtcPatrolTable: patrol.dtcPatrolTable,
    filteredInsData: patrol.filteredInsData,
    filterLane: patrol.filterLane,
    mobileSearchText,
    isMobile,
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      patrol.setIsFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [patrol]);

  const handleToggleFullScreen = useCallback(async () => {
    const nextState = !patrol.isFullScreen;

    try {
      if (nextState) {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        await document.documentElement.requestFullscreen?.();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn("Fullscreen toggle failed:", error);
    }

    patrol.setIsFullScreen(nextState);
  }, [patrol]);

  // Mở modal xem ảnh chi tiết
  const handleOpenModal = useCallback((cardData: PatrolCardData) => {
    patrol.setPreviewModal({
      isOpen: true,
      imageUrl: cardData.LINK || "",
      title: `${cardData.CATEGORY} - ${cardData.G_NAME_KD || "Sự cố chất lượng"}`,
      emplNo: cardData.EMPL_NO,
      defect: cardData.DEFECT,
      eq: cardData.EQ,
      factory: cardData.FACTORY,
      custName: cardData.CUST_NAME_KD,
      gName: cardData.G_NAME_KD,
      time: cardData.TIME,
      ngRate: `${cardData.INSPECT_NG}/${cardData.INSPECT_QTY}`,
    });
  }, [patrol]);

  // Đếm số điều kiện lọc active trên Mobile
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!patrol.isLive) count++;
    if (patrol.filterLane !== "ALL") count++;
    return count;
  }, [patrol.isLive, patrol.filterLane]);

  // Xử lý áp dụng lọc từ Bottom Sheet Drawer
  const handleApplyMobileFilter = useCallback(
    (params: {
      isLive: boolean;
      fromDate: string;
      toDate: string;
      filterLane: PatrolFilterLane;
      autoRefresh: boolean;
    }) => {
      patrol.setIsLive(params.isLive);
      patrol.setFromDate(params.fromDate);
      patrol.setToDate(params.toDate);
      patrol.setFilterLane(params.filterLane);
      patrol.setAutoRefresh(params.autoRefresh);
      patrol.refreshAll();
    },
    [patrol]
  );

  const handleResetMobileFilter = useCallback(() => {
    patrol.setIsLive(true);
    patrol.setFilterLane("ALL");
    patrol.setAutoRefresh(true);
    patrol.refreshAll();
  }, [patrol]);

  return (
    <div
      className={`precision-patrol ${patrol.isFullScreen ? "fullscreen" : ""} ${
        isMobile ? "is-mobile" : ""
      }`}
    >
      {/* 1. Header: Phân biệt Desktop vs Mobile */}
      {!isMobile ? (
        <PrecisionPatrolHeader
          isLive={patrol.isLive}
          fromDate={patrol.fromDate}
          setFromDate={patrol.setFromDate}
          toDate={patrol.toDate}
          setToDate={patrol.setToDate}
          isFullScreen={patrol.isFullScreen}
          onToggleFullScreen={handleToggleFullScreen}
          autoRefresh={patrol.autoRefresh}
          onToggleAutoRefresh={() => patrol.setAutoRefresh((prev) => !prev)}
          countdown={patrol.countdown}
          onReload={patrol.refreshAll}
          onToggleLive={patrol.handleToggleLive}
        />
      ) : (
        <PrecisionPatrolMobileHeader
          isLive={patrol.isLive}
          countdown={patrol.countdown}
          autoRefresh={patrol.autoRefresh}
          onToggleAutoRefresh={() => patrol.setAutoRefresh((prev) => !prev)}
          totalIncidents={patrol.kpis.totalIncidents}
          showKpi={showMobileKpi}
          onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          onReload={patrol.refreshAll}
          onToggleLive={patrol.handleToggleLive}
        />
      )}

      {/* 2. Dải Micro-KPI cuộn ngang (Chỉ mở khi bấm nút KPI trên mobile) */}
      {isMobile && showMobileKpi && (
        <PrecisionPatrolMobileKpi
          kpis={patrol.kpis}
          currentFilterLane={patrol.filterLane}
          onSelectLane={patrol.setFilterLane}
          onClose={() => setShowMobileKpi(false)}
        />
      )}

      {/* 3. Toolbar: Phân biệt Desktop vs Mobile */}
      {!isMobile ? (
        <PrecisionPatrolToolbar
          layoutView={patrol.layoutView}
          onLayoutChange={patrol.setLayoutView}
          filterLane={patrol.filterLane}
          onFilterLaneChange={patrol.setFilterLane}
          kpis={patrol.kpis}
        />
      ) : (
        <PrecisionPatrolMobileToolbar
          searchText={mobileSearchText}
          onSearchChange={setMobileSearchText}
          filterLane={patrol.filterLane}
          onFilterLaneChange={patrol.setFilterLane}
          layoutView={patrol.layoutView}
          onLayoutChange={patrol.setLayoutView}
          kpis={patrol.kpis}
          filteredCount={displayAllItems.length}
          activeFilterCount={activeFilterCount}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
        />
      )}

      {/* 4. Content Workspace: Chế độ Lanes hoặc Lưới Grid */}
      <div
        className={`precision-patrol-content ${
          patrol.layoutView === "GRID" ? "grid-mode" : ""
        }`}
      >
        {patrol.layoutView === "LANES" ? (
          <>
            {(patrol.filterLane === "ALL" || patrol.filterLane === "PQC3") && (
              <PrecisionPatrolLane
                category="PQC3"
                title="Sự Cố Lỗi Công Đoạn (PQC3)"
                subtitle={patrol.isLive ? "Hôm nay" : `${patrol.fromDate} → ${patrol.toDate}`}
                items={isMobile ? displayPqcItems : pqcCardItems}
                onOpenModal={handleOpenModal}
              />
            )}

            {(patrol.filterLane === "ALL" || patrol.filterLane === "DTC") && (
              <PrecisionPatrolLane
                category="DTC"
                title="Thử Nghiệm Độ Tin Cậy (DTC)"
                subtitle={patrol.isLive ? "Hôm nay" : `${patrol.fromDate} → ${patrol.toDate}`}
                items={isMobile ? displayDtcItems : dtcCardItems}
                onOpenModal={handleOpenModal}
              />
            )}

            {(patrol.filterLane === "ALL" || patrol.filterLane === "INS") && (
              <PrecisionPatrolLane
                category="INS"
                title="Kiểm Tra Ngoại Quan (INS Patrol)"
                subtitle="Nguyên liệu (NL) & Phụ kiện (PK)"
                items={isMobile ? displayInsItems : insCardItems}
                onOpenModal={handleOpenModal}
              />
            )}
          </>
        ) : (
          displayAllItems.map((item, idx) => (
            <PrecisionPatrolCard
              key={`grid_${item.CATEGORY}_${idx}`}
              data={item}
              onOpenModal={handleOpenModal}
            />
          ))
        )}
      </div>

      {/* 5. Modal xem trước ảnh lỗi phóng to */}
      <PrecisionPatrolModal
        data={patrol.previewModal}
        onClose={() =>
          patrol.setPreviewModal({
            isOpen: false,
            imageUrl: "",
            title: "",
          })
        }
      />

      {/* 6. Bottom Sheet Filter Drawer (Mobile Only) */}
      {isMobile && showMobileFilter && (
        <PrecisionPatrolMobileFilterDrawer
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          isLive={patrol.isLive}
          fromDate={patrol.fromDate}
          toDate={patrol.toDate}
          filterLane={patrol.filterLane}
          autoRefresh={patrol.autoRefresh}
          onApply={handleApplyMobileFilter}
          onReset={handleResetMobileFilter}
        />
      )}
    </div>
  );
};

export default React.memo(PATROL);
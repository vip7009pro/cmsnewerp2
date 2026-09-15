import React, { useMemo, useCallback } from "react";
import "./PrecisionPATROL/PrecisionPATROL.scss";
import { usePatrolData } from "./PrecisionPATROL/usePatrolData";
import PrecisionPatrolHeader from "./PrecisionPATROL/PrecisionPatrolHeader";
import PrecisionPatrolKpi from "./PrecisionPATROL/PrecisionPatrolKpi";
import PrecisionPatrolToolbar from "./PrecisionPATROL/PrecisionPatrolToolbar";
import PrecisionPatrolLane from "./PrecisionPATROL/PrecisionPatrolLane";
import PrecisionPatrolCard, { PatrolCardData } from "./PrecisionPATROL/PrecisionPatrolCard";
import PrecisionPatrolModal from "./PrecisionPATROL/PrecisionPatrolModal";

const PATROL: React.FC = () => {
  const patrol = usePatrolData();

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

  // Chuẩn hóa dữ liệu thẻ PQC3
  const pqcCardItems: PatrolCardData[] = useMemo(() => {
    return patrol.pqcdatatable.map((ele) => ({
      CATEGORY: "PQC3" as const,
      CUST_NAME_KD: ele.CUST_NAME_KD,
      DEFECT: `${ele.ERR_CODE}: ${ele.DEFECT_PHENOMENON}`,
      EQ: ele.LINE_NO,
      FACTORY: ele.FACTORY,
      G_NAME_KD: ele.G_NAME_KD,
      INSPECT_QTY: ele.INSPECT_QTY,
      INSPECT_NG: ele.DEFECT_QTY,
      LINK: `/pqc/PQC3_${ele.PQC3_ID + 1}.png`,
      TIME: ele.OCCURR_TIME,
      EMPL_NO: ele.LINEQC_PIC,
    }));
  }, [patrol.pqcdatatable]);

  // Chuẩn hóa dữ liệu thẻ DTC
  const dtcCardItems: PatrolCardData[] = useMemo(() => {
    return patrol.dtcPatrolTable.map((ele) => ({
      CATEGORY: "DTC" as const,
      CUST_NAME_KD: ele.M_CODE !== "B0000035" ? ele.VENDOR : ele.CUST_NAME_KD,
      DEFECT: ele.DEFECT_PHENOMENON,
      EQ: ele.TEST_NAME,
      FACTORY: ele.M_CODE !== "B0000035" ? ele.M_FACTORY : ele.FACTORY,
      G_NAME_KD: ele.M_CODE !== "B0000035" ? `${ele.M_NAME}|${ele.WIDTH_CD}` : ele.G_NAME_KD,
      INSPECT_QTY: 5,
      INSPECT_NG: 5,
      LINK: `/DTC_PATROL/${ele.DTC_ID}_${ele.TEST_CODE}${ele.FILE_}`,
      TIME: ele.INS_DATE,
      EMPL_NO: ele.INS_EMPL,
    }));
  }, [patrol.dtcPatrolTable]);

  // Chuẩn hóa dữ liệu thẻ INS Patrol
  const insCardItems: PatrolCardData[] = useMemo(() => {
    return patrol.filteredInsData.map((ele) => ({
      CATEGORY: "INS" as const,
      CUST_NAME_KD: ele.CUST_NAME_KD,
      DEFECT: `${ele.ERR_CODE}: ${ele.DEFECT_PHENOMENON}`,
      EQ: ele.EQUIPMENT_CD,
      FACTORY: ele.FACTORY,
      G_NAME_KD: ele.G_NAME_KD,
      INSPECT_QTY: ele.INSPECT_QTY,
      INSPECT_NG: ele.DEFECT_QTY,
      LINK: `/INS_PATROL/INS_PATROL_${ele.INS_PATROL_ID}.png`,
      TIME: ele.OCCURR_TIME,
      EMPL_NO: ele.INSP_PIC,
    }));
  }, [patrol.filteredInsData]);

  // Tổng hợp dữ liệu cho chế độ xem Grid
  const allCardItems: PatrolCardData[] = useMemo(() => {
    let result: PatrolCardData[] = [];
    if (patrol.filterLane === "ALL" || patrol.filterLane === "PQC3") {
      result = result.concat(pqcCardItems);
    }
    if (patrol.filterLane === "ALL" || patrol.filterLane === "DTC") {
      result = result.concat(dtcCardItems);
    }
    if (patrol.filterLane === "ALL" || patrol.filterLane === "INS") {
      result = result.concat(insCardItems);
    }
    return result;
  }, [patrol.filterLane, pqcCardItems, dtcCardItems, insCardItems]);

  return (
    <div className={`precision-patrol ${patrol.isFullScreen ? "fullscreen" : ""}`}>
      {/* 1. Sub-Header Stitch & TV Telemetry */}
      <PrecisionPatrolHeader
        isLive={patrol.isLive}
        fromDate={patrol.fromDate}
        setFromDate={patrol.setFromDate}
        toDate={patrol.toDate}
        setToDate={patrol.setToDate}
        isFullScreen={patrol.isFullScreen}
        onToggleFullScreen={() => patrol.setIsFullScreen((prev) => !prev)}
        autoRefresh={patrol.autoRefresh}
        onToggleAutoRefresh={() => patrol.setAutoRefresh((prev) => !prev)}
        countdown={patrol.countdown}
        onReload={patrol.refreshAll}
        onToggleLive={patrol.handleToggleLive}
      />

      {/* 2. Micro-cards KPI realtime */}
      <PrecisionPatrolKpi kpis={patrol.kpis} />

      {/* 3. Action Toolbar & View Controller */}
      <PrecisionPatrolToolbar
        layoutView={patrol.layoutView}
        onLayoutChange={patrol.setLayoutView}
        filterLane={patrol.filterLane}
        onFilterLaneChange={patrol.setFilterLane}
        kpis={patrol.kpis}
      />

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
                items={pqcCardItems}
                onOpenModal={handleOpenModal}
              />
            )}

            {(patrol.filterLane === "ALL" || patrol.filterLane === "DTC") && (
              <PrecisionPatrolLane
                category="DTC"
                title="Thử Nghiệm Độ Tin Cậy (DTC)"
                subtitle={patrol.isLive ? "Hôm nay" : `${patrol.fromDate} → ${patrol.toDate}`}
                items={dtcCardItems}
                onOpenModal={handleOpenModal}
              />
            )}

            {(patrol.filterLane === "ALL" || patrol.filterLane === "INS") && (
              <PrecisionPatrolLane
                category="INS"
                title="Kiểm Tra Ngoại Quan (INS Patrol)"
                subtitle="Nguyên liệu (NL) & Phụ kiện (PK)"
                items={insCardItems}
                onOpenModal={handleOpenModal}
              />
            )}
          </>
        ) : (
          allCardItems.map((item, idx) => (
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
    </div>
  );
};

export default React.memo(PATROL);
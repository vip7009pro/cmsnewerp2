import { useMemo, useCallback } from "react";
import { PQC3_DATA, DTC_PATROL_DATA, INSP_PATROL_DATA } from "../../../qc/interfaces/qcInterface";
import { PatrolCardData } from "./PrecisionPatrolCard";
import { PatrolFilterLane } from "./usePatrolData";

interface UsePatrolCardsParams {
  pqcdatatable: PQC3_DATA[];
  dtcPatrolTable: DTC_PATROL_DATA[];
  filteredInsData: INSP_PATROL_DATA[];
  filterLane: PatrolFilterLane;
  mobileSearchText: string;
  isMobile: boolean;
}

export const usePatrolCards = ({
  pqcdatatable,
  dtcPatrolTable,
  filteredInsData,
  filterLane,
  mobileSearchText,
  isMobile,
}: UsePatrolCardsParams) => {
  // 1. Chuẩn hóa dữ liệu thẻ PQC3
  const pqcCardItems: PatrolCardData[] = useMemo(() => {
    return pqcdatatable.map((ele) => ({
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
  }, [pqcdatatable]);

  // 2. Chuẩn hóa dữ liệu thẻ DTC
  const dtcCardItems: PatrolCardData[] = useMemo(() => {
    return dtcPatrolTable.map((ele) => ({
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
  }, [dtcPatrolTable]);

  // 3. Chuẩn hóa dữ liệu thẻ INS Patrol
  const insCardItems: PatrolCardData[] = useMemo(() => {
    return filteredInsData.map((ele) => ({
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
  }, [filteredInsData]);

  // 4. Lọc tìm kiếm realtime trên Mobile
  const filterBySearch = useCallback(
    (items: PatrolCardData[]) => {
      if (!mobileSearchText.trim()) return items;
      const query = mobileSearchText.toLowerCase().trim();
      return items.filter(
        (item) =>
          (item.G_NAME_KD && item.G_NAME_KD.toLowerCase().includes(query)) ||
          (item.DEFECT && item.DEFECT.toLowerCase().includes(query)) ||
          (item.CUST_NAME_KD && item.CUST_NAME_KD.toLowerCase().includes(query)) ||
          (item.EQ && item.EQ.toLowerCase().includes(query)) ||
          (item.EMPL_NO && item.EMPL_NO.toLowerCase().includes(query)) ||
          (item.CATEGORY && item.CATEGORY.toLowerCase().includes(query))
      );
    },
    [mobileSearchText]
  );

  const displayPqcItems = useMemo(
    () => (isMobile ? filterBySearch(pqcCardItems) : pqcCardItems),
    [isMobile, filterBySearch, pqcCardItems]
  );

  const displayDtcItems = useMemo(
    () => (isMobile ? filterBySearch(dtcCardItems) : dtcCardItems),
    [isMobile, filterBySearch, dtcCardItems]
  );

  const displayInsItems = useMemo(
    () => (isMobile ? filterBySearch(insCardItems) : insCardItems),
    [isMobile, filterBySearch, insCardItems]
  );

  // 5. Tổng hợp dữ liệu cho chế độ xem Grid
  const displayAllItems: PatrolCardData[] = useMemo(() => {
    let result: PatrolCardData[] = [];
    if (filterLane === "ALL" || filterLane === "PQC3") {
      result = result.concat(displayPqcItems);
    }
    if (filterLane === "ALL" || filterLane === "DTC") {
      result = result.concat(displayDtcItems);
    }
    if (filterLane === "ALL" || filterLane === "INS") {
      result = result.concat(displayInsItems);
    }
    return result;
  }, [filterLane, displayPqcItems, displayDtcItems, displayInsItems]);

  return {
    pqcCardItems,
    dtcCardItems,
    insCardItems,
    displayPqcItems,
    displayDtcItems,
    displayInsItems,
    displayAllItems,
  };
};

export default usePatrolCards;

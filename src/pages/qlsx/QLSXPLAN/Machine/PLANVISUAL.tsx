import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SaveExcel } from "../../../../api/services/excelService";
import "./PrecisionMachine/PrecisionMachine.scss";
import { useMachineData } from "./PrecisionMachine/useMachineData";
import { useMachinePlanModal } from "./PrecisionMachine/useMachinePlanModal";
import { PrecisionMachineToolbar } from "./PrecisionMachine/dashboard/PrecisionMachineToolbar";
import { PrecisionMachineKpi } from "./PrecisionMachine/dashboard/PrecisionMachineKpi";
import { PrecisionMachineLineGroup } from "./PrecisionMachine/dashboard/PrecisionMachineLineGroup";
import { PrecisionMachinePlanModal } from "./PrecisionMachine/modal/PrecisionMachinePlanModal";
import { PrecisionMachineMobileActionDrawer } from "./PrecisionMachine/dashboard/PrecisionMachineMobileActionDrawer";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";

const MACHINE_SHORTCUTS: Record<string, string> = {
  F1: "FR01",
  F2: "FR02",
  F3: "FR03",
  F4: "FR04",
  S1: "SR01",
  S2: "SR02",
  S3: "SR03",
  S4: "SR04",
  S5: "SR05",
  S6: "SR06",
  S7: "SR07",
  S8: "SR08",
  D1: "DC01",
  D2: "DC02",
  D3: "DC03",
  D4: "DC04",
  D5: "DC05",
};

for (let machineNumber = 1; machineNumber <= 38; machineNumber += 1) {
  MACHINE_SHORTCUTS[`E${machineNumber}`] = `ED${String(machineNumber).padStart(2, "0")}`;
}

const PLAN_VISUAL: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileActionDrawer, setShowMobileActionDrawer] = useState<boolean>(false);

  // 1. Hook Quản Lý Dữ Liệu Sàn Sản Xuất Chính
  const {
    factory,
    setFactory,
    selectedPlanDate,
    setSelectedPlanDate,
    selected_eq,
    setSelected_eq,
    eq_series,
    eq_status,
    plandatatable,
    kpiData,
    refreshAll,
    handleAutoDispatch,
    showPlanWindow,
    setShowPlanWindow,
    selectedMachine,
    selectedFactory,
    openPlanModal,
    machinePlans,
    isMachinePlansLoading,
    loadMachinePlans,
  } = useMachineData();

  // 2. Hook Quản Lý Modal Kế Hoạch Chi Tiết Trên Máy
  //    Danh sách chỉ thị của máy được tải RIÊNG theo máy (không dùng chung list toàn sàn)
  const modalController = useMachinePlanModal({
    selectedMachine,
    selectedFactory,
    selectedPlanDate,
    machinePlans,
    isMachinePlansLoading,
    loadMachinePlans,
    onRefreshData: refreshAll,
  });

  const closePlanModal = useCallback(() => {
    modalController.resetPlanModal();
    setShowPlanWindow(false);
  }, [modalController.resetPlanModal, setShowPlanWindow]);

  // 3. Toggle Filter Line Checkboxes
  const handleToggleEqSeries = useCallback(
    (series: string, checked: boolean) => {
      if (series === "ALL") {
        if (checked) {
          setSelected_eq(eq_series);
        } else {
          setSelected_eq([]);
        }
      } else {
        if (checked) {
          setSelected_eq([...selected_eq.filter((s) => s !== "ALL"), series]);
        } else {
          setSelected_eq(
            selected_eq.filter((s) => s !== series && s !== "ALL")
          );
        }
      }
    },
    [selected_eq, setSelected_eq]
  );

  // 4. Xuất Báo Cáo Kế Hoạch Ra Excel
  const handleExportExcel = useCallback(() => {
    if (plandatatable.length === 0) return;
    SaveExcel(
      plandatatable.filter((p) => p.PLAN_FACTORY === factory),
      `KeHoachSanXuat_${factory}_${selectedPlanDate}`
    );
  }, [factory, plandatatable, selectedPlanDate]);

  // 5. Từ khóa tìm kiếm code, mã hàng, PLAN_ID
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const machineShortcutBufferRef = useRef("");

  // Khôi phục các phím tắt của màn hình cũ mà không phụ thuộc focus của container.
  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        machineShortcutBufferRef.current = "";
        closePlanModal();
        return;
      }

      if (event.key === "F2") {
        event.preventDefault();
        machineShortcutBufferRef.current = "F2";
        void refreshAll();
        return;
      }

      if (/^F[134]$/.test(event.key)) {
        event.preventDefault();
        machineShortcutBufferRef.current = event.key;
        return;
      }

      if (event.key === "[") {
        event.preventDefault();
        setFactory("NM1");
        machineShortcutBufferRef.current = "";
        return;
      }

      if (event.key === "]") {
        event.preventDefault();
        setFactory("NM2");
        machineShortcutBufferRef.current = "";
        return;
      }

      if (event.key === "Enter") {
        const shortcut = machineShortcutBufferRef.current.toUpperCase();
        machineShortcutBufferRef.current = "";
        if (!showPlanWindow && shortcut) {
          const machineName = MACHINE_SHORTCUTS[shortcut];
          if (machineName) {
            event.preventDefault();
            openPlanModal(machineName, factory);
          }
        }
        return;
      }

      if (/^[a-z0-9]$/i.test(event.key)) {
        machineShortcutBufferRef.current = `${machineShortcutBufferRef.current}${event.key}`.slice(-3);
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [closePlanModal, factory, openPlanModal, refreshAll, setFactory, showPlanWindow]);

  // 6. Gom chỉ thị (bản rút gọn của cả sàn) theo từng máy để card hiển thị nhanh,
  //    tránh mỗi card phải tự filter lại trên toàn bộ danh sách.
  const plansByMachine = useMemo(() => {
    const map: Record<string, typeof plandatatable> = {};
    plandatatable.forEach((p) => {
      const key = `${p.PLAN_FACTORY || ""}|${p.PLAN_EQ || ""}`;
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [plandatatable]);

  // 7. Danh Sách Các Line Máy Cần Hiển Thị
  const activeSeries = useMemo(() => {
    const rawSeries = eq_series.filter((s) => s !== "ALL");
    const baseList = rawSeries.length > 0 ? rawSeries : ["FR", "DC", "ED", "SR"];
    if (selected_eq.includes("ALL") || selected_eq.length === 0) {
      return baseList;
    }
    return baseList.filter((s) => selected_eq.includes(s));
  }, [eq_series, selected_eq]);

  return (
    <div className={`precision-machine ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. ACTION TOOLBAR & BỘ LỌC CÔNG THÁI HỌC (TỰ THÍCH ỨNG DESKTOP / MOBILE) */}
      <PrecisionMachineToolbar
        factory={factory}
        onFactoryChange={setFactory}
        selectedPlanDate={selectedPlanDate}
        onDateChange={setSelectedPlanDate}
        onRefresh={refreshAll}
        onAutoDispatch={handleAutoDispatch}
        eq_series={eq_series}
        selected_eq={selected_eq}
        onToggleEqSeries={handleToggleEqSeries}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
        isMobile={isMobile}
        onOpenActionDrawer={() => setShowMobileActionDrawer(true)}
        onExportExcel={handleExportExcel}
      />

      {/* 2. MAIN WORKSHOP FLOORPLAN (CUỘN TRỰC QUAN SÀN SẢN XUẤT) */}
      <main className="precision-machine__floorplan">
        {/* THANH THẺ MICRO-KPIS: DESKTOP RENDER CARD ĐẦY ĐỦ, MOBILE RENDER BANNER 1 DÒNG GỌN GÀNG */}
        {!isMobile ? (
          <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
            <PrecisionMachineKpi
              kpiData={kpiData}
              onExportExcel={handleExportExcel}
            />
          </div>
        ) : (
          <div
            className="mobile-floor-ticker"
            onClick={() => setShowMobileActionDrawer(true)}
            title="Chạm để xem chi tiết tác vụ & KPIs sàn sản xuất"
          >
            <div className="ticker-left">
              <span className="ticker-dot" />
              <span className="ticker-text">
                <strong>{kpiData.activeMachines}/{kpiData.totalMachines}</strong> Máy (
                {kpiData.totalMachines > 0
                  ? ((kpiData.activeMachines / kpiData.totalMachines) * 100).toFixed(0)
                  : 0}
                %)
              </span>
              <span className="ticker-divider">•</span>
              <span className="ticker-text">
                Tiến độ:{" "}
                <strong>
                  {kpiData.totalTargetQty > 0
                    ? ((kpiData.completedQty / kpiData.totalTargetQty) * 100).toFixed(0)
                    : 0}
                  %
                </strong>
              </span>
            </div>
            <div className="ticker-right">
              {kpiData.waitingMaterialCount > 0 ? (
                <span className="ticker-alert">
                  ⚠️ {kpiData.waitingMaterialCount} máy thiếu NVL
                </span>
              ) : (
                <span className="ticker-action">⚡ Menu Tác Vụ</span>
              )}
            </div>
          </div>
        )}

        {/* TỪNG PHÂN HỆ DÒNG MÁY (LINE SECTIONS) */}
        {activeSeries.map((series) => {
          let lineMachines = eq_status.filter(
            (m) =>
              m.FACTORY === factory &&
              ((m.EQ_SERIES === series) ||
                (m.EQ_NAME ?? "NA").substring(0, 2) === series)
          );

          // Nếu có searchKeyword, lọc các máy có thông tin hoặc kế hoạch khớp từ khóa
          if (searchKeyword.trim()) {
            const kw = searchKeyword.trim().toLowerCase();
            lineMachines = lineMachines.filter((m) => {
              if (m.EQ_NAME?.toLowerCase().includes(kw)) return true;
              if (m.G_NAME?.toLowerCase().includes(kw)) return true;
              if (m.CURR_PLAN_ID?.toLowerCase().includes(kw)) return true;

              const machinePlansOfCard =
                plansByMachine[`${m.FACTORY || ""}|${m.EQ_NAME || ""}`] || [];
              return machinePlansOfCard.some(
                (p) =>
                  p.PLAN_ID?.toLowerCase().includes(kw) ||
                  p.G_NAME?.toLowerCase().includes(kw) ||
                  p.G_NAME_KD?.toLowerCase().includes(kw) ||
                  p.G_CODE?.toLowerCase().includes(kw) ||
                  p.PROD_REQUEST_NO?.toLowerCase().includes(kw)
              );
            });
          }

          if (lineMachines.length === 0 && searchKeyword.trim()) {
            return null;
          }

          return (
            <PrecisionMachineLineGroup
              key={series}
              series={series}
              factory={factory}
              machines={lineMachines}
              plansByMachine={plansByMachine}
              onOpenPlanModal={openPlanModal}
              isMobile={isMobile}
            />
          );
        })}
      </main>

      {/* 3. MODAL KẾ HOẠCH MÁY CHI TIẾT (CONTROL PANEL DIALOG) */}
      {showPlanWindow && (
        <PrecisionMachinePlanModal
          selectedMachine={selectedMachine}
          selectedFactory={selectedFactory}
          onClose={closePlanModal}
          modalController={modalController}
        />
      )}

      {/* 4. MOBILE ACTION DRAWER BOTTOM SHEET (CHỈ RENDER KHI Ở MOBILE VÀ ĐƯỢC KÍCH HOẠT) */}
      {isMobile && (
        <PrecisionMachineMobileActionDrawer
          isOpen={showMobileActionDrawer}
          onClose={() => setShowMobileActionDrawer(false)}
          factory={factory}
          onFactoryChange={setFactory}
          selectedPlanDate={selectedPlanDate}
          onDateChange={setSelectedPlanDate}
          eq_series={eq_series}
          selected_eq={selected_eq}
          onToggleEqSeries={handleToggleEqSeries}
          onRefresh={refreshAll}
          onAutoDispatch={handleAutoDispatch}
          onExportExcel={handleExportExcel}
          kpiData={kpiData}
        />
      )}
    </div>
  );
};

export default PLAN_VISUAL;

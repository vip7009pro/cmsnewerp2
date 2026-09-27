import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import { useIncomingData } from "./PrecisionINCOMMING/useIncomingData";
import { PrecisionIncomingHeader } from "./PrecisionINCOMMING/PrecisionIncomingHeader";
import { PrecisionIncomingKpi } from "./PrecisionINCOMMING/PrecisionIncomingKpi";
import { PrecisionIncomingSidebar } from "./PrecisionINCOMMING/PrecisionIncomingSidebar";
import { PrecisionIncomingGridToolbar } from "./PrecisionINCOMMING/PrecisionIncomingGridToolbar";
import { PrecisionIncomingTable } from "./PrecisionINCOMMING/PrecisionIncomingTable";
import { PrecisionIncomingDtcPanel } from "./PrecisionINCOMMING/PrecisionIncomingDtcPanel";
import { PrecisionBNKModal } from "./PrecisionINCOMMING/PrecisionBNKModal";
import { PrecisionIncomingMobileHeader } from "./PrecisionINCOMMING/PrecisionIncomingMobileHeader";
import { PrecisionIncomingMobileKpi } from "./PrecisionINCOMMING/PrecisionIncomingMobileKpi";
import { PrecisionIncomingMobileToolbar } from "./PrecisionINCOMMING/PrecisionIncomingMobileToolbar";
import { PrecisionIncomingMobileSidebarSheet } from "./PrecisionINCOMMING/PrecisionIncomingMobileSidebarSheet";
import { PrecisionIncomingMobileDtcSheet } from "./PrecisionINCOMMING/PrecisionIncomingMobileDtcSheet";
import { filterIncomingRows } from "./PrecisionINCOMMING/incomingMobileFilter";
import "./PrecisionINCOMMING/PrecisionINCOMMING.scss";
import { IQC_INCOMMING_DATA } from "../interfaces/qcInterface";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";

const INCOMMING: React.FC = () => {
  const isMobile = useIsMobile();
  const incoming = useIncomingData();

  // Mobile-only UI state (không ảnh hưởng desktop)
  const [showMobileKpi, setShowMobileKpi] = useState(false);
  const [showSidebarSheet, setShowSidebarSheet] = useState(false);
  const [showDtcSheet, setShowDtcSheet] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  // Ref (selectedRowsData.current) không trigger re-render ⇒ cần state đếm cho chip counter trên mobile
  const [selectedCount, setSelectedCount] = useState(0);

  // Print Checksheet Ref with optimized A4 pageStyle
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `CHECKSHEET_BNK_${incoming.clickedRow?.M_LOT_NO || "INCOMING"}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 5mm;
      }
      @media print {
        html, body {
          background: #ffffff !important;
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .precision-bnk-modal__paper-sheet {
          box-shadow: none !important;
          border: none !important;
          margin: 0 auto !important;
          padding: 0 !important;
          width: 210mm !important;
          background: #ffffff !important;
        }
        .material-check {
          box-shadow: none !important;
          margin: 0 auto !important;
        }
      }
    `,
  });

  const isWorker = incoming.userData?.JOB_NAME === "Worker";

  const handleRowClick = (row: IQC_INCOMMING_DATA) => {
    incoming.setClickedRow(row);
    if (row.DTC_ID) {
      incoming.handletraDTCData(row.DTC_ID);
    }
  };

  const handleSelectionChange = (rows: IQC_INCOMMING_DATA[]) => {
    incoming.selectedRowsData.current = rows;
    setSelectedCount(rows.length);
  };

  const handleToggleField = (
    row: IQC_INCOMMING_DATA,
    field: keyof IQC_INCOMMING_DATA,
    checked: boolean
  ) => {
    incoming.updateDataTable(row, field as string, checked ? "OK" : "NG");
  };

  const handleBNKDataChange = (updatedFields: Partial<IQC_INCOMMING_DATA>) => {
    if (incoming.clickedRow) {
      const updatedRow = { ...incoming.clickedRow, ...updatedFields };
      incoming.setClickedRow(updatedRow);
      incoming.setIQC1DataTable((prev) =>
        prev.map((item) => (item.IQC1_ID === incoming.clickedRow!.IQC1_ID ? { ...item, ...updatedFields } : item))
      );
    }
  };

  const handleToggleBNK = () => {
    if (!incoming.showBNK) {
      if (!incoming.clickedRow) {
        if (incoming.iqc1datatable.length > 0) {
          const first = incoming.iqc1datatable[0];
          incoming.setClickedRow(first);
          if (first.DTC_ID) {
            incoming.handletraDTCData(first.DTC_ID);
          }
          incoming.setShowBNK(true);
        } else {
          Swal.fire({
            title: "Chưa chọn lô kiểm tra",
            text: "Vui lòng tra cứu dữ liệu và chọn một lô kiểm tra trước khi xem hoặc in biên bản BNK.",
            icon: "warning",
            confirmButtonText: "Đã hiểu",
          });
          return;
        }
      } else {
        incoming.setShowBNK(true);
      }
    } else {
      incoming.setShowBNK(false);
    }
  };

  // ==========================================================
  // MOBILE SỐ LIỆU PHÁI SINH (chỉ dùng ở nhánh mobile)
  // ==========================================================
  const mobileRows = useMemo(
    () => (isMobile ? filterIncomingRows(incoming.iqc1datatable, quickSearch, onlyPending) : incoming.iqc1datatable),
    [isMobile, incoming.iqc1datatable, quickSearch, onlyPending]
  );

  // Số điều kiện lọc đang bật (hiển thị badge trên nút "Lọc")
  const activeFilterCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let count = 0;
    if (incoming.fromdate !== today) count++;
    if (incoming.todate !== today) count++;
    if (incoming.m_name.trim()) count++;
    if (incoming.m_code.trim()) count++;
    if (incoming.vendor.trim()) count++;
    if (incoming.vendorLot.trim()) count++;
    if (incoming.showAllIncoming) count++;
    if (onlyPending) count++;
    return count;
  }, [
    incoming.fromdate,
    incoming.todate,
    incoming.m_name,
    incoming.m_code,
    incoming.vendor,
    incoming.vendorLot,
    incoming.showAllIncoming,
    onlyPending,
  ]);

  // Nút "Nhập" trên mobile: mở sheet và tự chuyển sang tab phiếu đăng ký
  const handleOpenInputSheet = () => {
    incoming.setActiveLeftTab("newInput");
    setShowSidebarSheet(true);
  };

  // Filter sheet đóng ngay sau khi tìm kiếm để thấy kết quả trên bảng
  const handleSearchFromSheet = () => {
    setShowSidebarSheet(false);
    incoming.handletraIQC1Data();
  };

  // ==========================================================
  // MOBILE VIEW (Viewport <= 768px): Tối đa không gian bảng dữ liệu
  // ==========================================================
  if (isMobile) {
    return (
      <div className="precision-incoming is-mobile">
        <PrecisionIncomingMobileHeader
          userData={incoming.userData}
          filteredCount={mobileRows.length}
          totalCount={incoming.iqc1datatable.length}
          passRate={incoming.kpis.passRate}
          dtcTestCount={incoming.kpis.dtcTestCount}
          holdingCount={incoming.kpis.holdingCount}
          showKpi={showMobileKpi}
          onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
          onOpenInputSheet={handleOpenInputSheet}
          onRefresh={incoming.handletraIQC1Data}
        />

        {showMobileKpi && (
          <PrecisionIncomingMobileKpi
            totalLots={incoming.kpis.totalLots}
            passRate={incoming.kpis.passRate}
            dtcTestCount={incoming.kpis.dtcTestCount}
            holdingCount={incoming.kpis.holdingCount}
            onClose={() => setShowMobileKpi(false)}
          />
        )}

        <PrecisionIncomingMobileToolbar
          searchTerm={quickSearch}
          setSearchTerm={setQuickSearch}
          onSearch={incoming.handletraIQC1Data}
          onOpenFilterSheet={() => setShowSidebarSheet(true)}
          activeFilterCount={activeFilterCount}
          onlyPending={onlyPending}
          onToggleOnlyPending={() => setOnlyPending((prev) => !prev)}
          onOpenInputSheet={handleOpenInputSheet}
          onSetPass={() => incoming.setQCPASS("Y")}
          onSetFail={() => incoming.setQCPASS("N")}
          onUpdateSelected={incoming.updateIncomingData}
          onToggleBNK={handleToggleBNK}
          onOpenDtcSheet={() => setShowDtcSheet(true)}
          dtcCount={incoming.dtcDataTable.length}
          onExportExcel={incoming.handleExportExcel}
          selectedCount={selectedCount}
          filteredCount={mobileRows.length}
          totalCount={incoming.iqc1datatable.length}
        />

        <PrecisionIncomingTable
          data={incoming.iqc1datatable}
          isWorker={isWorker}
          clickedRow={incoming.clickedRow}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
          onUpdateRow={incoming.updateIQC_INLINE}
          onUploadChecksheet={incoming.uploadChecksheet}
          onToggleField={handleToggleField}
          isMobile
          quickFilterText={quickSearch}
          onlyPending={onlyPending}
        />

        {showSidebarSheet && (
          <PrecisionIncomingMobileSidebarSheet
            hook={incoming}
            onClose={() => setShowSidebarSheet(false)}
            onSearch={handleSearchFromSheet}
          />
        )}

        {showDtcSheet && (
          <PrecisionIncomingMobileDtcSheet
            dtcData={incoming.dtcDataTable}
            clickedRow={incoming.clickedRow}
            onExportDtcExcel={incoming.handleExportDtcExcel}
            ncrIdInput={incoming.ncrIdInput}
            setNcrIdInput={incoming.setNcrIdInput}
            onUpdateNcrId={incoming.handleUpdateNcrId}
            onClose={() => setShowDtcSheet(false)}
          />
        )}

        <PrecisionBNKModal
          show={incoming.showBNK}
          onClose={() => incoming.setShowBNK(false)}
          printRef={printRef}
          onPrint={handlePrint}
          clickedRow={incoming.clickedRow}
          dtcData={incoming.dtcDataTable}
          onDataChange={handleBNKDataChange}
          isMobile
        />
      </div>
    );
  }

  return (
    <div className={`precision-incoming ${incoming.isFullscreen ? "precision-incoming--fullscreen" : ""}`}>
      {/* 1. Header with breadcrumb & telemetry */}
      <PrecisionIncomingHeader
        userData={incoming.userData}
        isFullscreen={incoming.isFullscreen}
        onToggleFullscreen={() => incoming.setIsFullscreen((prev) => !prev)}
        onRefresh={incoming.handletraIQC1Data}
      />

      {/* 2. Realtime Micro-KPI Banner */}
      <PrecisionIncomingKpi
        totalLots={incoming.kpis.totalLots}
        passRate={incoming.kpis.passRate}
        dtcTestCount={incoming.kpis.dtcTestCount}
        holdingCount={incoming.kpis.holdingCount}
      />

      {/* 3. Main Workspace: Sidebar + Center Grid + Right DTC Panel */}
      <div className="precision-incoming__workspace">
        <PrecisionIncomingSidebar hook={incoming} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>
          <PrecisionIncomingGridToolbar
            onSwitchToNewInput={() => incoming.setActiveLeftTab("newInput")}
            onSwitchToTraData={() => incoming.setActiveLeftTab("traData")}
            onSetPass={() => incoming.setQCPASS("Y")}
            onSetFail={() => incoming.setQCPASS("N")}
            onUpdateSelected={incoming.updateIncomingData}
            onToggleBNK={handleToggleBNK}
            ncrIdInput={incoming.ncrIdInput}
            setNcrIdInput={incoming.setNcrIdInput}
            onUpdateNcrId={incoming.handleUpdateNcrId}
            onExportExcel={incoming.handleExportExcel}
          />

          <PrecisionIncomingTable
            data={incoming.iqc1datatable}
            isWorker={isWorker}
            clickedRow={incoming.clickedRow}
            onRowClick={handleRowClick}
            onSelectionChange={handleSelectionChange}
            onUpdateRow={incoming.updateIQC_INLINE}
            onUploadChecksheet={incoming.uploadChecksheet}
            onToggleField={handleToggleField}
          />
        </div>

        <PrecisionIncomingDtcPanel
          dtcData={incoming.dtcDataTable}
          clickedRow={incoming.clickedRow}
          onExportDtcExcel={incoming.handleExportDtcExcel}
        />
      </div>

      {/* 4. Luxury A4 Print-Ready Modal for BNK Checksheet */}
      <PrecisionBNKModal
        show={incoming.showBNK}
        onClose={() => incoming.setShowBNK(false)}
        printRef={printRef}
        onPrint={handlePrint}
        clickedRow={incoming.clickedRow}
        dtcData={incoming.dtcDataTable}
        onDataChange={handleBNKDataChange}
      />
    </div>
  );
};

export default INCOMMING;

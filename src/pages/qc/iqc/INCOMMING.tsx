import React, { useRef } from "react";
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
import "./PrecisionINCOMMING/PrecisionINCOMMING.scss";
import { IQC_INCOMMING_DATA } from "../interfaces/qcInterface";

const INCOMMING: React.FC = () => {
  const incoming = useIncomingData();

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

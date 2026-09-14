import React, { useMemo } from 'react';
import './PrecisionTRAPQC/PrecisionTRAPQC.scss';
import { useTrapqcData } from './PrecisionTRAPQC/useTrapqcData';
import PrecisionTrapqcHeader from './PrecisionTRAPQC/PrecisionTrapqcHeader';
import PrecisionTrapqcKpi from './PrecisionTRAPQC/PrecisionTrapqcKpi';
import PrecisionTrapqcSidebar from './PrecisionTRAPQC/PrecisionTrapqcSidebar';
import PrecisionTrapqcToolbar from './PrecisionTRAPQC/PrecisionTrapqcToolbar';
import PrecisionTrapqcTable from './PrecisionTRAPQC/PrecisionTrapqcTable';
import PrecisionTrapqcNNDSModal from './PrecisionTRAPQC/PrecisionTrapqcNNDSModal';
import {
  getColumnTraPqc1Data, getColumnPqc3Data,
  getColumnDaofilmData, getColumnCndbData,
} from './PrecisionTRAPQC/PrecisionTrapqcColumns';

const TRAPQC: React.FC = () => {
  const {
    activeMode, handleSwitchMode, handleSearchCurrentMode, isLoading,
    pqcdatatable, quickFilterText, setQuickFilterText,
    alltime, setAllTime, fromdate, setFromDate, todate, setToDate,
    factory, setFactory, codeKD, setCodeKD, codeCMS, setCodeCMS,
    empl_name, setEmpl_Name, cust_name, setCustName,
    process_lot_no, setProcess_Lot_No, prod_type, setProdType,
    prodrequestno, setProdRequestNo, id, setID,
    showNNDSModal, currentDefectRow, currentNN, setCurrentNN,
    currentDS, setCurrentDS, handleOpenNNDSModal, handleCloseNNDSModal,
    handleUpdateNNDS, handleExportExcel,
  } = useTrapqcData();

  // Chọn bộ cột tương ứng theo chế độ đang kích hoạt
  const currentColumns = useMemo(() => {
    switch (activeMode) {
      case 'SETTING': return getColumnTraPqc1Data();
      case 'DEFECT': return getColumnPqc3Data(handleOpenNNDSModal);
      case 'DAOFILM': return getColumnDaofilmData();
      case 'CNDB': return getColumnCndbData();
      default: return getColumnTraPqc1Data();
    }
  }, [activeMode, handleOpenNNDSModal]);

  return (
    <div className="precision-trapqc">
      {/* 1. Sub-header chuẩn Google Stitch */}
      <PrecisionTrapqcHeader onReload={handleSearchCurrentMode} />

      {/* 2. Split Workspace: Sidebar Bộ Lọc bên trái + Khung Bảng bên phải */}
      <div className="precision-trapqc-workspace">
        <PrecisionTrapqcSidebar
          alltime={alltime} onAllTimeChange={setAllTime}
          fromDate={fromdate} onFromDateChange={setFromDate}
          toDate={todate} onToDateChange={setToDate}
          factory={factory} onFactoryChange={setFactory}
          codeKD={codeKD} onCodeKDChange={setCodeKD}
          codeCMS={codeCMS} onCodeCMSChange={setCodeCMS}
          empl_name={empl_name} onEmplNameChange={setEmpl_Name}
          cust_name={cust_name} onCustNameChange={setCustName}
          prod_type={prod_type} onProdTypeChange={setProdType}
          prodrequestno={prodrequestno} onProdRequestNoChange={setProdRequestNo}
          process_lot_no={process_lot_no} onProcessLotNoChange={setProcess_Lot_No}
          id={id} onIdChange={setID}
          onSearch={handleSearchCurrentMode} isLoading={isLoading}
        />

        {/* Khung chính bên phải */}
        <main className="precision-trapqc-main">
          {/* Micro-cards KPI Realtime */}
          <PrecisionTrapqcKpi data={pqcdatatable} activeMode={activeMode} />

          {/* SaaS Action Toolbar */}
          <PrecisionTrapqcToolbar
            activeMode={activeMode} onSwitchMode={handleSwitchMode}
            quickFilterText={quickFilterText} onQuickFilterChange={setQuickFilterText}
            recordCount={pqcdatatable.length} onExportExcel={handleExportExcel}
          />

          {/* AGTable High-Density Không Footer Thừa */}
          <PrecisionTrapqcTable
            data={pqcdatatable} columns={currentColumns}
            quickFilterText={quickFilterText}
          />
        </main>
      </div>

      {/* 3. Modal Popup Cập Nhật Nguyên Nhân & Đối Sách */}
      <PrecisionTrapqcNNDSModal
        isOpen={showNNDSModal} onClose={handleCloseNNDSModal}
        defectRow={currentDefectRow}
        currentNN={currentNN} onNNChange={setCurrentNN}
        currentDS={currentDS} onDSChange={setCurrentDS}
        onSave={handleUpdateNNDS}
      />
    </div>
  );
};

export default TRAPQC;

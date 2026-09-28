import React from 'react';
import './PrecisionIQCReport/PrecisionIQCReport.scss';
import { useIQCReportData } from './PrecisionIQCReport/useIQCReportData';
import PrecisionIQCReportHeader from './PrecisionIQCReport/PrecisionIQCReportHeader';
import PrecisionIQCReportToolbar from './PrecisionIQCReport/PrecisionIQCReportToolbar';
import PrecisionIQCReportKpi from './PrecisionIQCReport/PrecisionIQCReportKpi';
import PrecisionIQCReportPPMSection from './PrecisionIQCReport/PrecisionIQCReportPPMSection';
import PrecisionIQCReportVendorSection from './PrecisionIQCReport/PrecisionIQCReportVendorSection';
import PrecisionIQCReportFailingSection from './PrecisionIQCReport/PrecisionIQCReportFailingSection';

const IQC_REPORT: React.FC = () => {
  const {
    dailyppm, weeklyppm, monthlyppm, yearlyppm,
    weeklyvendorppm, monthlyvendorppm,
    weeklyfailingtrending, weeklyholdingtrending,
    iqcfailpending, iqcholdingpending,
    fromdate, setFromDate, todate, setToDate,
    worstby, setWorstBy, ng_type, setNg_Type,
    cust_name, setCust_Name, codeList,
    searchCodeArray, selectedCode,
    handleSelectCode, handleRemoveCode, handleClearCodeArray,
    df, setDF, activeTab, setActiveTab, initFunction,
  } = useIQCReportData();

  const showPpm = activeTab === 'all' || activeTab === 'ppm';
  const showVendor = activeTab === 'all' || activeTab === 'vendor';
  const showFailing = activeTab === 'all' || activeTab === 'failing';

  return (
    <div className="precision-iqc-report">
      {/* 1. Header Bar công nghiệp chuẩn Google Stitch */}
      <PrecisionIQCReportHeader onReload={initFunction} />

      {/* 2. SaaS Control Toolbar & Phân hệ điều hướng */}
      <PrecisionIQCReportToolbar
        fromDate={fromdate} toDate={todate}
        onFromDateChange={setFromDate} onToDateChange={setToDate}
        worstBy={worstby} onWorstByChange={setWorstBy}
        ngType={ng_type} onNgTypeChange={setNg_Type}
        custName={cust_name} onCustNameChange={setCust_Name}
        codeList={codeList} selectedCode={selectedCode}
        onSelectCode={handleSelectCode}
        searchCodeArray={searchCodeArray}
        onClearCodeArray={handleClearCodeArray}
        onRemoveCode={handleRemoveCode}
        df={df} onDfChange={setDF}
        onSearch={initFunction}
        activeTab={activeTab} onTabChange={setActiveTab}
      />

      {/* 3. Vùng hiển thị cuộn mượt mà các biểu đồ và KPI */}
      <div className="precision-iqc-body">
        {/* Micro-cards KPI tổng quan */}
        <PrecisionIQCReportKpi
          dailyppm={dailyppm} weeklyppm={weeklyppm}
          monthlyppm={monthlyppm} yearlyppm={yearlyppm}
        />

        {/* Phân hệ 1: Xu hướng tỷ lệ lỗi PPM (Daily, Weekly, Monthly, Yearly) */}
        {showPpm && (
          <PrecisionIQCReportPPMSection
            dailyppm={dailyppm} weeklyppm={weeklyppm}
            monthlyppm={monthlyppm} yearlyppm={yearlyppm}
          />
        )}

        {/* Phân hệ 2: Xu hướng lỗi Nhà cung cấp (Vendor Defect Trending) */}
        {showVendor && (
          <PrecisionIQCReportVendorSection
            weeklyvendorppm={weeklyvendorppm}
            monthlyvendorppm={monthlyvendorppm}
          />
        )}

        {/* Phân hệ 3: Phân tích Kho lỗi & Hàng chặn giữ (Failing & Holding) */}
        {showFailing && (
          <PrecisionIQCReportFailingSection
            weeklyfailingtrending={weeklyfailingtrending}
            weeklyholdingtrending={weeklyholdingtrending}
            iqcfailpending={iqcfailpending}
            iqcholdingpending={iqcholdingpending}
          />
        )}
      </div>
    </div>
  );
};

export default IQC_REPORT;

import React, { useMemo, useState } from 'react';
import './PrecisionIQCReport/PrecisionIQCReport.scss';
import useIsMobile from '../../../components/Navbar/AccountInfo/useIsMobile';
import { useIQCReportData } from './PrecisionIQCReport/useIQCReportData';
import PrecisionIQCReportHeader from './PrecisionIQCReport/PrecisionIQCReportHeader';
import PrecisionIQCReportToolbar from './PrecisionIQCReport/PrecisionIQCReportToolbar';
import PrecisionIQCReportKpi from './PrecisionIQCReport/PrecisionIQCReportKpi';
import PrecisionIQCReportPPMSection from './PrecisionIQCReport/PrecisionIQCReportPPMSection';
import PrecisionIQCReportVendorSection from './PrecisionIQCReport/PrecisionIQCReportVendorSection';
import PrecisionIQCReportFailingSection from './PrecisionIQCReport/PrecisionIQCReportFailingSection';
import PrecisionIQCReportMobileHeader from './PrecisionIQCReport/PrecisionIQCReportMobileHeader';
import PrecisionIQCReportMobileToolbar from './PrecisionIQCReport/PrecisionIQCReportMobileToolbar';
import PrecisionIQCReportMobileKpi from './PrecisionIQCReport/PrecisionIQCReportMobileKpi';
import PrecisionIQCReportMobileFilterDrawer from './PrecisionIQCReport/PrecisionIQCReportMobileFilterDrawer';

const IQC_REPORT: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

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

  // Số điều kiện lọc đang áp dụng (badge trên nút Bộ Lọc của mobile)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromdate) count += 1;
    if (todate) count += 1;
    if (cust_name.trim()) count += 1;
    if (searchCodeArray.length > 0) count += 1;
    if (worstby !== 'AMOUNT') count += 1;
    if (ng_type !== 'ALL') count += 1;
    if (df) count += 1;
    return count;
  }, [fromdate, todate, cust_name, searchCodeArray, worstby, ng_type, df]);

  return (
    <div className={`precision-iqc-report ${isMobile ? 'is-mobile' : 'is-desktop'}`}>
      {/* 1. Header Bar: desktop giữ nguyên, mobile dùng compact header */}
      {!isMobile && <PrecisionIQCReportHeader onReload={initFunction} />}
      {isMobile && (
        <PrecisionIQCReportMobileHeader
          onReload={initFunction}
          onOpenFilter={() => setShowMobileFilter(true)}
          activeFilterCount={activeFilterCount}
        />
      )}

      {/* 2. Toolbar: desktop giữ nguyên, mobile tinh gọn (Bộ Lọc + Tra Cứu + tabs) */}
      {!isMobile && (
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
      )}
      {isMobile && (
        <PrecisionIQCReportMobileToolbar
          activeFilterCount={activeFilterCount}
          onOpenFilter={() => setShowMobileFilter(true)}
          onSearch={initFunction}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* 3. Vùng hiển thị cuộn mượt mà các biểu đồ và KPI */}
      <div className="precision-iqc-body">
        {/* Micro-cards KPI: desktop 4 card lớn, mobile dải nén gập được */}
        {!isMobile && (
          <PrecisionIQCReportKpi
            dailyppm={dailyppm} weeklyppm={weeklyppm}
            monthlyppm={monthlyppm} yearlyppm={yearlyppm}
          />
        )}
        {isMobile && (
          <PrecisionIQCReportMobileKpi
            dailyppm={dailyppm} weeklyppm={weeklyppm}
            monthlyppm={monthlyppm} yearlyppm={yearlyppm}
          />
        )}

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

      {/* 4. FLOATING FILTER BOTTOM SHEET (chỉ render trên mobile khi mở) */}
      {isMobile && (
        <PrecisionIQCReportMobileFilterDrawer
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          fromDate={fromdate}
          toDate={todate}
          worstBy={worstby}
          ngType={ng_type}
          custName={cust_name}
          codeList={codeList}
          selectedCode={selectedCode}
          searchCodeArray={searchCodeArray}
          df={df}
          onSelectCode={handleSelectCode}
          onRemoveCode={handleRemoveCode}
          onClearCodeArray={handleClearCodeArray}
          onReset={() => {
            setWorstBy('AMOUNT');
            setNg_Type('ALL');
            setCust_Name('');
            setDF(true);
          }}
          onApply={({ fromDate, toDate, worstBy: wb, ngType, custName, df: dfVal }) => {
            setFromDate(fromDate);
            setToDate(toDate);
            setWorstBy(wb);
            setNg_Type(ngType);
            setCust_Name(custName);
            setDF(dfVal);
          }}
        />
      )}
    </div>
  );
};

export default IQC_REPORT;

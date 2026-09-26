import React, { useMemo } from "react";
import "./PrecisionQuickPlan/PrecisionQuickPlan.scss";
import useQuickPlanData from "./PrecisionQuickPlan/useQuickPlanData";
import PrecisionQuickPlanHeader from "./PrecisionQuickPlan/PrecisionQuickPlanHeader";
import PrecisionQuickPlanDinhMuc from "./PrecisionQuickPlan/PrecisionQuickPlanDinhMuc";
import PrecisionQuickPlanYCSXSection from "./PrecisionQuickPlan/PrecisionQuickPlanYCSXSection";
import PrecisionQuickPlanTableSection from "./PrecisionQuickPlan/PrecisionQuickPlanTableSection";
import PrecisionQuickPlanPrintModals from "./PrecisionQuickPlan/PrecisionQuickPlanPrintModals";

/**
 * QUICKPLAN2_OLD - Controller chính thức cho Quick Plan Sản Xuất (ERP)
 * Được tái cấu trúc theo chuẩn Google Stitch High-Density Enterprise.
 * Giữ nguyên 100% logic, bảo toàn đầy đủ các nút thao tác nghiệp vụ và tối ưu chống giật lag.
 */
const PLAN_NHANH: React.FC = () => {
  const {
    userData,
    recentDMData,
    selection,
    setSelection,
    datadinhmuc,
    setDataDinhMuc,
    plandatatable,
    isLoading,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    empl_name,
    setEmpl_Name,
    cust_name,
    setCust_Name,
    prod_type,
    setProdType,
    prodrequestno,
    setProdRequestNo,
    alltime,
    setAllTime,
    materialYES,
    setMaterialYES,
    phanloai,
    setPhanLoai,
    material,
    setMaterial,
    ycsxdatatable,
    ycsxdatatablefilter,
    qlsxplandatafilter,
    ycsxpendingcheck,
    setYCSXPendingCheck,
    inspectInputcheck,
    setInspectInputCheck,
    ycsxlistrender,
    setYCSXListRender,
    chithilistrender,
    setChiThiListRender,
    ycktlistrender,
    setYCKTListRender,
    selectedCode,
    showChiThi,
    setShowChiThi,
    showYCKT,
    setShowYCKT,
    showhideycsxtable,
    setShowHideYCSXTable,
    machine_list,
    ycsxprintref,
    handlePrint,
    handletraYCSX,
    handleSearchCodeKeyDown,
    handleConfirmSetClosedYCSX,
    handleConfirmSetPendingYCSX,
    handle_AddPlan,
    handle_AddBlankPlan,
    handleConfirmSavePlan,
    handleConfirmDeletePlan,
    handleSaveQLSX,
    handleYCSXSelectionforUpdate,
    handleUploadBanVe,
    onCellEditingStopped,
    onCellClick,
    onSelectionChange,
    handleToggleIsSetting,
    renderYCSX,
    renderBanVe,
    renderChiThi,
    renderYCKT,
  } = useQuickPlanData();

  // Tính toán tổng số lượng chỉ thị nháp
  const totalPlanQty = useMemo(() => {
    return plandatatable.reduce((sum, item) => sum + (Number(item.PLAN_QTY) || 0), 0);
  }, [plandatatable]);

  // Class cho layout chia vùng theo chế độ hiển thị 1-2-3
  const contentModeClass = useMemo(() => {
    if (showhideycsxtable === 1) return "precision-quickplan__content--plan-only";
    if (showhideycsxtable === 2) return "precision-quickplan__content--ycsx-only";
    return "precision-quickplan__content--split";
  }, [showhideycsxtable]);

  return (
    <div className="precision-quickplan">
      {/* 1. Header Bar: Selected Code Banner & Segmented Switcher */}
      <PrecisionQuickPlanHeader
        selectedCode={selectedCode}
        showhideycsxtable={showhideycsxtable}
        setShowHideYCSXTable={setShowHideYCSXTable}
        ycsxCount={ycsxdatatable.length}
        planCount={plandatatable.length}
        totalPlanQty={totalPlanQty}
      />

      {/* 2. Định Mức Sản Xuất (Hiển thị ở mode 1 và 3) */}
      {(showhideycsxtable === 1 || showhideycsxtable === 3) && (
        <PrecisionQuickPlanDinhMuc
          datadinhmuc={datadinhmuc}
          setDataDinhMuc={setDataDinhMuc}
          recentDMData={recentDMData}
          machine_list={machine_list}
        />
      )}

      {/* 3. Main Workspace: Tra Cứu YCSX & Bảng Tạm Xắp Plan */}
      <div className={`precision-quickplan__content ${contentModeClass}`}>
        {/* Khối YCSX (Mode 2 hoặc 3) */}
        {(showhideycsxtable === 2 || showhideycsxtable === 3) && (
          <PrecisionQuickPlanYCSXSection
            isLoading={isLoading}
            fromdate={fromdate}
            setFromDate={setFromDate}
            todate={todate}
            setToDate={setToDate}
            codeKD={codeKD}
            setCodeKD={setCodeKD}
            codeCMS={codeCMS}
            setCodeCMS={setCodeCMS}
            empl_name={empl_name}
            setEmpl_Name={setEmpl_Name}
            cust_name={cust_name}
            setCust_Name={setCust_Name}
            prod_type={prod_type}
            setProdType={setProdType}
            prodrequestno={prodrequestno}
            setProdRequestNo={setProdRequestNo}
            material={material}
            setMaterial={setMaterial}
            phanloai={phanloai}
            setPhanLoai={setPhanLoai}
            alltime={alltime}
            setAllTime={setAllTime}
            materialYES={materialYES}
            setMaterialYES={setMaterialYES}
            ycsxpendingcheck={ycsxpendingcheck}
            setYCSXPendingCheck={setYCSXPendingCheck}
            inspectInputcheck={inspectInputcheck}
            setInspectInputCheck={setInspectInputCheck}
            handletraYCSX={handletraYCSX}
            handleSearchCodeKeyDown={handleSearchCodeKeyDown}
            showhideycsxtable={showhideycsxtable}
            setShowHideYCSXTable={setShowHideYCSXTable}
            ycsxdatatable={ycsxdatatable}
            ycsxdatatablefilter={ycsxdatatablefilter}
            handleConfirmSetClosedYCSX={handleConfirmSetClosedYCSX}
            handleConfirmSetPendingYCSX={handleConfirmSetPendingYCSX}
            handle_AddPlan={handle_AddPlan}
            selection={selection}
            setSelection={setSelection}
            setYCSXListRender={setYCSXListRender}
            renderYCSX={renderYCSX}
            renderBanVe={renderBanVe}
            handleYCSXSelectionforUpdate={handleYCSXSelectionforUpdate}
            handleUploadBanVe={handleUploadBanVe}
          />
        )}

        {/* Khối Bảng Plan Nháp (Mode 1 hoặc 3) */}
        {(showhideycsxtable === 1 || showhideycsxtable === 3) && (
          <PrecisionQuickPlanTableSection
            userData={userData}
            showhideycsxtable={showhideycsxtable}
            setShowHideYCSXTable={setShowHideYCSXTable}
            plandatatable={plandatatable}
            handle_AddBlankPlan={handle_AddBlankPlan}
            handleConfirmSavePlan={handleConfirmSavePlan}
            handleConfirmDeletePlan={handleConfirmDeletePlan}
            handleSaveQLSX={handleSaveQLSX}
            onCellEditingStopped={onCellEditingStopped}
            onCellClick={onCellClick}
            onSelectionChange={onSelectionChange}
            onToggleIsSetting={handleToggleIsSetting}
          />
        )}
      </div>

      {/* 4. Modal Print System (YCSX, Bản Vẽ, Chỉ Thị, YCKT) */}
      <PrecisionQuickPlanPrintModals
        selection={selection}
        setSelection={setSelection}
        showChiThi={showChiThi}
        setShowChiThi={setShowChiThi}
        showYCKT={showYCKT}
        setShowYCKT={setShowYCKT}
        ycsxlistrender={ycsxlistrender}
        setYCSXListRender={setYCSXListRender}
        chithilistrender={chithilistrender}
        setChiThiListRender={setChiThiListRender}
        ycktlistrender={ycktlistrender}
        setYCKTListRender={setYCKTListRender}
        ycsxdatatablefilter={ycsxdatatablefilter}
        qlsxplandatafilter={qlsxplandatafilter}
        renderYCSX={renderYCSX}
        renderBanVe={renderBanVe}
        renderChiThi={renderChiThi}
        renderYCKT={renderYCKT}
        ycsxprintref={ycsxprintref}
        handlePrint={handlePrint}
      />
    </div>
  );
};

export default PLAN_NHANH;

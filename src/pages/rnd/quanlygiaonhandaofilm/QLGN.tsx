import React from "react";
import "./PrecisionQLGN/PrecisionQLGN.scss";
import { useQLGNData } from "./PrecisionQLGN/useQLGNData";
import PrecisionQLGNHeader from "./PrecisionQLGN/PrecisionQLGNHeader";
import PrecisionQLGNKpi from "./PrecisionQLGN/PrecisionQLGNKpi";
import PrecisionQLGNInputCard from "./PrecisionQLGN/PrecisionQLGNInputCard";
import PrecisionQLGNToolbar from "./PrecisionQLGN/PrecisionQLGNToolbar";
import PrecisionQLGNTable from "./PrecisionQLGN/PrecisionQLGNTable";

const QLGN: React.FC = () => {
  const {
    customerList,
    selectedCust_CD,
    setSelectedCust_CD,
    codeList,
    selectedCode,
    setSelectedCode,
    handoverdatatable,
    loading,
    quickFilterText,
    setQuickFilterText,
    showInputForm,
    setShowInputForm,
    isFullscreen,
    toggleFullscreen,
    fromdate,
    setFromDate,
    daofimltotalqty,
    setDaoFilmTotalQty,
    ohpfilmqty,
    setOHPFilmQTy,
    madaofilm,
    setMaDaoFilm,
    vitritailieu,
    setViTriTaiLieu,
    g_width,
    setG_Width,
    g_length,
    setG_Length,
    remark,
    setRemark,
    plph,
    setPLPH,
    pltl,
    setPLTL,
    pldao,
    setPLDao,
    plfilm,
    setPLFilm,
    ldph,
    setLDPH,
    rndEmpl,
    setRNDEMPL,
    qcEmpl,
    setQCEMPL,
    sxEmpl,
    setSXEMPL,
    selectedRows,
    setSelectedRows,
    setBarCodeInfo,
    gridRef,
    load_handoverdata_table,
    confirmAddBanGiao,
    resetForm,
    exportExcelFiltered,
    exportExcelAll,
    kpis,
  } = useQLGNData();

  return (
    <div className="qlgn precision-qlgn">
      <PrecisionQLGNHeader
        onRefresh={load_handoverdata_table}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        loading={loading}
      />

      <PrecisionQLGNKpi kpis={kpis} />

      <div className="precision-qlgn-workarea">
        {showInputForm && (
          <PrecisionQLGNInputCard
            customerList={customerList}
            selectedCust_CD={selectedCust_CD}
            setSelectedCust_CD={setSelectedCust_CD}
            codeList={codeList}
            selectedCode={selectedCode}
            setSelectedCode={setSelectedCode}
            selectedRows={selectedRows}
            setBarCodeInfo={setBarCodeInfo}
            fromdate={fromdate}
            setFromDate={setFromDate}
            plph={plph}
            setPLPH={setPLPH}
            pltl={pltl}
            setPLTL={setPLTL}
            ldph={ldph}
            setLDPH={setLDPH}
            rndEmpl={rndEmpl}
            setRNDEMPL={setRNDEMPL}
            qcEmpl={qcEmpl}
            setQCEMPL={setQCEMPL}
            sxEmpl={sxEmpl}
            setSXEMPL={setSXEMPL}
            daofimltotalqty={daofimltotalqty}
            setDaoFilmTotalQty={setDaoFilmTotalQty}
            pldao={pldao}
            setPLDao={setPLDao}
            plfilm={plfilm}
            setPLFilm={setPLFilm}
            ohpfilmqty={ohpfilmqty}
            setOHPFilmQTy={setOHPFilmQTy}
            madaofilm={madaofilm}
            setMaDaoFilm={setMaDaoFilm}
            vitritailieu={vitritailieu}
            setViTriTaiLieu={setViTriTaiLieu}
            g_width={g_width}
            setG_Width={setG_Width}
            g_length={g_length}
            setG_Length={setG_Length}
            remark={remark}
            setRemark={setRemark}
            onSubmit={confirmAddBanGiao}
            onReset={resetForm}
          />
        )}

        <div className="precision-qlgn-main">
          <PrecisionQLGNToolbar
            onRefresh={load_handoverdata_table}
            showInputForm={showInputForm}
            onToggleForm={() => setShowInputForm((prev) => !prev)}
            quickFilterText={quickFilterText}
            onQuickFilterChange={setQuickFilterText}
            onExportFiltered={exportExcelFiltered}
            onExportAll={exportExcelAll}
            totalRows={handoverdatatable.length}
            loading={loading}
          />

          <PrecisionQLGNTable
            data={handoverdatatable}
            onRowClick={(row) => setSelectedRows(row)}
            gridRef={gridRef}
          />
        </div>
      </div>
    </div>
  );
};

export default QLGN;

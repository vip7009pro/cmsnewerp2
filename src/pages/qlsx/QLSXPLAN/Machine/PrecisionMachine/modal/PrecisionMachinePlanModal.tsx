import React from "react";
import { AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../PrecisionMachinePlanModal.scss";
import { UseMachinePlanModalReturn } from "../machineTypes";
import { PrecisionPlanYCSXSection } from "./PrecisionPlanYCSXSection";
import { PrecisionPlanCurrentListSection } from "./PrecisionPlanCurrentListSection";
import { PrecisionPlanDinhMucSection, PrecisionPlanCardSection } from "./PrecisionPlanDinhMucSection";
import { PrecisionPlanMaterialSection } from "./PrecisionPlanMaterialSection";
import { PrecisionPlanPrintModals } from "./PrecisionPlanPrintModals";

interface ModalProps {
  selectedMachine: string;
  selectedFactory: string;
  onClose: () => void;
  modalController: UseMachinePlanModalReturn;
}

export const PrecisionMachinePlanModal: React.FC<ModalProps> = React.memo(
  ({ selectedMachine, selectedFactory, onClose, modalController }) => {
    const {
      selectedPlan,
      setSelectedPlan,
      handleSelectPlan,
      currentMachinePlans,
      setCurrentMachinePlans,
      datadinhmuc,
      setDataDinhMuc,
      recentDMData,
      machine_list,
      showYCSX,
      setShowYCSX,
      ycsxFilter,
      setYCSXFilter,
      ycsxDataTable,
      handletraYCSX,
      handleAddPlanFromYCSX,
      handleSaveSinglePlan,
      handleDeletePlan,
      handleMovePlan,
      handleStartPlan,
      handleFinishPlan,
      chithidatatable,
      handleSaveChiThiMaterial,
      handleResetChiThi,
      handleDangKyXuatLieu,
      handleDeleteChiThiLine,
      handleXuatDaoSample,
      handleXuatLieuSample,
      showChiThi,
      setShowChiThi,
      showChiThi2,
      setShowChiThi2,
      showKhoAo,
      setShowKhoAo,
      showYCKT,
      setShowYCKT,
      selection,
      setSelection,
      maxLieu,
      setMaxLieu,
      handleSetMaxLieu,
      handlePrint,
      ycsxprintref,
      chithilistrender,
      chithilistrender2,
      ycsxlistrender,
      ycktlistrender,
      renderPrintYCSX,
      renderPrintBanVe,
      renderPrintChiThi,
      renderPrintChiThi2,
      renderPrintYCKT,
      handleUpdateBatchPlan,
      handleSaveDataDinhMuc,
      handleSetDMMD,
      totalMachineTime,
      onRefreshData,
      handleSetPendingYCSX,
      handlePrintYCSXList,
      handlePrintBanVeList,
      handleRefreshChiThi,
      isDetailLoading,
    } = modalController;

    return (
      <div className="precision-plan-modal">
        <div className="precision-plan-modal__window">
          {/* 1. MODAL HEADER */}
          <header className="precision-plan-modal__header">
            <div className="header-left">
              <span className="machine-badge">{selectedMachine}</span>
              <h1 className="modal-title">CHI TIẾT KẾ HOẠCH SẢN XUẤT TRÊN MÁY</h1>
              <span className="factory-tag">{selectedFactory}</span>
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="btn-toggle-ycsx"
                onClick={() => setShowYCSX(!showYCSX)}
                title="Ẩn/Hiện bảng tra cứu YCSX"
              >
                {showYCSX ? <AiOutlineEyeInvisible size={15} /> : <AiOutlineEye size={15} />}
                <span>{showYCSX ? "Gập YCSX" : "Mở YCSX"}</span>
              </button>

              <button
                type="button"
                className="btn-close-modal"
                onClick={onClose}
                title="Đóng cửa sổ kế hoạch (Esc)"
              >
                <AiOutlineClose size={15} />
                <span>ĐÓNG</span>
              </button>
            </div>
          </header>

          {/* 2. MODAL BODY */}
          <main className="precision-plan-modal__body">
            <div
              className={`precision-plan-modal__splitContent ${
                showYCSX ? "with-ycsx" : ""
              }`}
            >
              {/* PHÂN VÙNG 1: TRA CỨU & NẠP YCSX (NẾU BẬT) */}
              {showYCSX && (
                <PrecisionPlanYCSXSection
                  ycsxFilter={ycsxFilter}
                  setYCSXFilter={setYCSXFilter}
                  ycsxDataTable={ycsxDataTable}
                  onSearchYCSX={handletraYCSX}
                  onAddPlanFromYCSX={handleAddPlanFromYCSX}
                  onSetPendingYCSX={handleSetPendingYCSX}
                  onPrintYCSX={handlePrintYCSXList}
                  onPrintBanVe={handlePrintBanVeList}
                />
              )}

              {/* KHỐI PHẢI: KẾ HOẠCH MÁY + ĐỊNH MỨC + PLAN CARD + VẬT TƯ */}
              <div className="precision-plan-modal__rightPane">
                {/* PHÂN VÙNG 2: BẢNG KẾ HOẠCH HIỆN TẠI CỦA MÁY & SLC */}
                <PrecisionPlanCurrentListSection
                  plans={currentMachinePlans}
                  selectedPlan={selectedPlan}
                  onSelectPlan={handleSelectPlan}
                  onMovePlan={handleMovePlan}
                  onDeletePlan={handleDeletePlan}
                  onStartPlan={handleStartPlan}
                  onFinishPlan={handleFinishPlan}
                  showYCSX={showYCSX}
                  onToggleYCSX={() => setShowYCSX(!showYCSX)}
                  onPrintChiThi={renderPrintChiThi}
                  onPrintYCKT={renderPrintYCKT}
                  onSavePlanBatch={handleUpdateBatchPlan}
                  onRefreshPlans={onRefreshData}
                  onSaveDataDinhMuc={handleSaveDataDinhMuc}
                  onSetDMMD={handleSetDMMD}
                  totalMachineTime={totalMachineTime}
                  plandatatable={currentMachinePlans}
                  setPlanDataTable={setCurrentMachinePlans}
                />

                <div className={`precision-plan-modal__detailContent${isDetailLoading ? " is-loading" : ""}`}>
                  {isDetailLoading && (
                    <div className="precision-plan-modal__detailLoading" role="status" aria-live="polite">
                      <span className="precision-plan-modal__loadingSpinner" />
                      <span>Đang tải dữ liệu chi tiết...</span>
                    </div>
                  )}

                  <PrecisionPlanDinhMucSection
                    datadinhmuc={datadinhmuc}
                    setDataDinhMuc={setDataDinhMuc}
                    recentDMData={recentDMData}
                    machine_list={machine_list}
                  />

                  <div className="bottom-plan-material-row">
                    <PrecisionPlanCardSection
                      selectedPlan={selectedPlan}
                      setSelectedPlan={setSelectedPlan}
                      onSavePlan={handleSaveSinglePlan}
                    />
                    <PrecisionPlanMaterialSection
                      chithidatatable={chithidatatable}
                      onSaveMaterial={handleSaveChiThiMaterial}
                      onDangKyXuatLieu={handleDangKyXuatLieu}
                      onResetChiThi={handleResetChiThi}
                      onDeleteSelectedLine={handleDeleteChiThiLine}
                      onXuatDaoSample={handleXuatDaoSample}
                      onXuatLieuSample={handleXuatLieuSample}
                      onOpenKhoAo={() => setShowKhoAo(true)}
                      onRefreshChiThi={handleRefreshChiThi}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* 3. CÁC POPUP IN ẤN & PHỤ TRỢ */}
          <PrecisionPlanPrintModals
            selectedPlan={selectedPlan}
            showChiThi={showChiThi}
            setShowChiThi={setShowChiThi}
            showChiThi2={showChiThi2}
            setShowChiThi2={setShowChiThi2}
            showKhoAo={showKhoAo}
            setShowKhoAo={setShowKhoAo}
            showYCKT={showYCKT}
            setShowYCKT={setShowYCKT}
            selection={selection}
            setSelection={setSelection}
            maxLieu={maxLieu}
            setMaxLieu={setMaxLieu}
            onSetMaxLieu={handleSetMaxLieu}
            onPrint={handlePrint}
            ycsxprintref={ycsxprintref}
            chithilistrender={chithilistrender}
            chithilistrender2={chithilistrender2}
            ycsxlistrender={ycsxlistrender}
            ycktlistrender={ycktlistrender}
            onRenderChiThi={renderPrintChiThi}
            onRenderChiThi2={renderPrintChiThi2}
            onRenderYCSX={renderPrintYCSX}
            onRenderBanVe={renderPrintBanVe}
            onRenderYCKT={renderPrintYCKT}
          />
        </div>
      </div>
    );
  }
);

import React from "react";
import { AiFillSave } from "react-icons/ai";
import { MACHINE_LIST, QLSXPLANDATA, RecentDM } from "../../../interfaces/khsxInterface";
import { DataDinhMucState } from "../machineTypes";

interface DinhMucSectionProps {
  datadinhmuc: DataDinhMucState;
  setDataDinhMuc: React.Dispatch<React.SetStateAction<DataDinhMucState>>;
  recentDMData: RecentDM[];
  machine_list: MACHINE_LIST[];
}

/** Hàng định mức 1 công đoạn: EQ | Setting | UPH | Step | LossSX | LossST */
const DinhMucRow: React.FC<{
  cdIndex: number;
  eqVal: string;
  settingVal: number;
  uphVal: number;
  stepVal: number;
  lossSxVal: number;
  lossSettingVal: number;
  recentLoss?: number;
  recentSetting?: number;
  machine_list: MACHINE_LIST[];
  onDmChange: (field: keyof DataDinhMucState, val: any) => void;
  eqField: keyof DataDinhMucState;
  settingField: keyof DataDinhMucState;
  uphField: keyof DataDinhMucState;
  stepField: keyof DataDinhMucState;
  lossSxField: keyof DataDinhMucState;
  lossSettingField: keyof DataDinhMucState;
}> = ({
  cdIndex, eqVal, settingVal, uphVal, stepVal, lossSxVal, lossSettingVal,
  recentLoss, recentSetting, machine_list, onDmChange,
  eqField, settingField, uphField, stepField, lossSxField, lossSettingField,
}) => (
  <div className="dm-row">
    <span className="dm-row__label">CĐ{cdIndex}</span>
    <div className="dm-row__field">
      <label>EQ{cdIndex}:</label>
      <select value={eqVal} onChange={(e) => onDmChange(eqField, e.target.value)}>
        <option value="">---</option>
        {machine_list.map((m, i) => <option key={i} value={m.EQ_NAME}>{m.EQ_NAME}</option>)}
      </select>
    </div>
    <div className="dm-row__field">
      <label>Setting{cdIndex}(min):</label>
      <input type="number" value={settingVal} onChange={(e) => onDmChange(settingField, Number(e.target.value))} />
    </div>
    <div className="dm-row__field">
      <label>UPH{cdIndex}(EA/h):</label>
      <input type="number" value={uphVal} onChange={(e) => onDmChange(uphField, Number(e.target.value))} />
    </div>
    <div className="dm-row__field">
      <label>Step{cdIndex}:</label>
      <input type="number" value={stepVal} onChange={(e) => onDmChange(stepField, Number(e.target.value))} />
    </div>
    <div className="dm-row__field">
      <label>
        LOSS_SX{cdIndex}(%){recentLoss !== undefined && <span className="ref-val">({recentLoss}%)</span>}:
      </label>
      <input type="number" value={lossSxVal} onChange={(e) => onDmChange(lossSxField, Number(e.target.value))} />
    </div>
    <div className="dm-row__field">
      <label>
        LOSS_ST{cdIndex}(m){recentSetting !== undefined && <span className="ref-val">({recentSetting}m)</span>}:
      </label>
      <input type="number" value={lossSettingVal} onChange={(e) => onDmChange(lossSettingField, Number(e.target.value))} />
    </div>
  </div>
);

export const PrecisionPlanDinhMucSection: React.FC<DinhMucSectionProps> = React.memo(
  ({ datadinhmuc, setDataDinhMuc, recentDMData, machine_list }) => {
    const handleDmChange = (field: keyof DataDinhMucState, val: any) => {
      setDataDinhMuc((prev) => ({ ...prev, [field]: val }));
    };

    const getRecent = (proc: number) => recentDMData.find((e) => e.PROCESS_NUMBER === proc);

    return (
      <div className="dinhmuc-rows-section">
        <div className="dinhmuc-scroll-wrapper">
          {/* 4 HÀNG NGANG ĐỊNH MỨC (GIỐNG BẢN GỐC) */}
          <DinhMucRow cdIndex={1} eqVal={datadinhmuc.EQ1} settingVal={datadinhmuc.Setting1} uphVal={datadinhmuc.UPH1} stepVal={datadinhmuc.Step1} lossSxVal={datadinhmuc.LOSS_SX1} lossSettingVal={datadinhmuc.LOSS_SETTING1} recentLoss={getRecent(1)?.LOSS_SX} recentSetting={getRecent(1)?.TT_SETTING_MET} machine_list={machine_list} onDmChange={handleDmChange} eqField="EQ1" settingField="Setting1" uphField="UPH1" stepField="Step1" lossSxField="LOSS_SX1" lossSettingField="LOSS_SETTING1" />
          <DinhMucRow cdIndex={2} eqVal={datadinhmuc.EQ2} settingVal={datadinhmuc.Setting2} uphVal={datadinhmuc.UPH2} stepVal={datadinhmuc.Step2} lossSxVal={datadinhmuc.LOSS_SX2} lossSettingVal={datadinhmuc.LOSS_SETTING2} recentLoss={getRecent(2)?.LOSS_SX} recentSetting={getRecent(2)?.TT_SETTING_MET} machine_list={machine_list} onDmChange={handleDmChange} eqField="EQ2" settingField="Setting2" uphField="UPH2" stepField="Step2" lossSxField="LOSS_SX2" lossSettingField="LOSS_SETTING2" />
          <DinhMucRow cdIndex={3} eqVal={datadinhmuc.EQ3} settingVal={datadinhmuc.Setting3} uphVal={datadinhmuc.UPH3} stepVal={datadinhmuc.Step3} lossSxVal={datadinhmuc.LOSS_SX3} lossSettingVal={datadinhmuc.LOSS_SETTING3} recentLoss={getRecent(3)?.LOSS_SX} recentSetting={getRecent(3)?.TT_SETTING_MET} machine_list={machine_list} onDmChange={handleDmChange} eqField="EQ3" settingField="Setting3" uphField="UPH3" stepField="Step3" lossSxField="LOSS_SX3" lossSettingField="LOSS_SETTING3" />
          <DinhMucRow cdIndex={4} eqVal={datadinhmuc.EQ4} settingVal={datadinhmuc.Setting4} uphVal={datadinhmuc.UPH4} stepVal={datadinhmuc.Step4} lossSxVal={datadinhmuc.LOSS_SX4} lossSettingVal={datadinhmuc.LOSS_SETTING4} recentLoss={getRecent(4)?.LOSS_SX} recentSetting={getRecent(4)?.TT_SETTING_MET} machine_list={machine_list} onDmChange={handleDmChange} eqField="EQ4" settingField="Setting4" uphField="UPH4" stepField="Step4" lossSxField="LOSS_SX4" lossSettingField="LOSS_SETTING4" />

          {/* FACTORY & NOTE */}
          <div className="factory-note-bar">
            <div className="fn-item">
              <label className="fn-label">FACTORY:</label>
              <select value={datadinhmuc.FACTORY || "NA"} onChange={(e) => handleDmChange("FACTORY", e.target.value)}>
                <option value="NA">NA</option>
                <option value="NM1">NM1</option>
                <option value="NM2">NM2</option>
              </select>
            </div>
            <div className="fn-item flex-1">
              <label className="fn-label">NOTE (QLSX):</label>
              <input type="text" placeholder="Ghi chú kế hoạch sản xuất..." value={datadinhmuc.NOTE || ""} onChange={(e) => handleDmChange("NOTE", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

/** Plan Card bên phải (tách ra riêng để modal đặt vị trí linh hoạt) */
interface PlanCardProps {
  selectedPlan: QLSXPLANDATA;
  setSelectedPlan: React.Dispatch<React.SetStateAction<QLSXPLANDATA>>;
  onSavePlan: () => void;
}

export const PrecisionPlanCardSection: React.FC<PlanCardProps> = React.memo(
  ({ selectedPlan, setSelectedPlan, onSavePlan }) => {
    const handlePlanChange = (field: keyof QLSXPLANDATA, val: any) => {
      setSelectedPlan((prev) => ({ ...prev, [field]: val }));
    };

    return (
      <div className="selected-plan-card">
        <div
          className="selected-plan-card__header"
          style={{
            background:
              (selectedPlan?.LOSS_KT ?? 0) <= 5
                ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                : (selectedPlan?.LOSS_KT ?? 0) <= 15
                ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
          }}
        >
          <div className="plan-code-title">
            {selectedPlan?.PLAN_ID && selectedPlan.PLAN_ID !== "XXX"
              ? selectedPlan.PLAN_ID
              : selectedPlan?.G_CODE || "CHƯA CHỌN"}
          </div>
          <div className="plan-name-title" title={selectedPlan?.G_NAME_KD || selectedPlan?.G_NAME || ""}>
            {selectedPlan?.G_NAME_KD || selectedPlan?.G_NAME || "---"}
          </div>
          <div className="plan-pd-cavity">
            PD:{selectedPlan?.PD ?? 0} --- CAVITY:{selectedPlan?.CAVITY ?? 0}
          </div>
          <div className="plan-loss-kt">
            LOSS KT 10 LOT: {selectedPlan?.ORG_LOSS_KT?.toLocaleString("en-US") || 0}%
          </div>
          <div className="plan-qty-headline">
            PLAN_QTY: {(selectedPlan?.PLAN_QTY ?? 0).toLocaleString("en-US")}
          </div>
        </div>

        <div className="selected-plan-card__form">
          <div className="form-row">
            <label>PLAN QTY:</label>
            <input type="number" value={selectedPlan?.PLAN_QTY || 0} onChange={(e) => handlePlanChange("PLAN_QTY", Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>PROC_NUMBER:</label>
            <input type="number" value={selectedPlan?.PROCESS_NUMBER || 0} onChange={(e) => handlePlanChange("PROCESS_NUMBER", Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>STEP:</label>
            <input type="number" value={selectedPlan?.STEP || 0} onChange={(e) => handlePlanChange("STEP", Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>PLAN_EQ:</label>
            <input type="text" value={selectedPlan?.PLAN_EQ || ""} onChange={(e) => handlePlanChange("PLAN_EQ", e.target.value)} />
          </div>
          <div className="form-row">
            <label>NEXT_PLAN:</label>
            <input type="text" value={selectedPlan?.NEXT_PLAN_ID || ""} onChange={(e) => handlePlanChange("NEXT_PLAN_ID", e.target.value)} />
          </div>
          <div className="form-row form-row--checkbox">
            <label htmlFor="plan-is-setting-chk">IS_SETTING:</label>
            <input type="checkbox" id="plan-is-setting-chk" checked={selectedPlan?.IS_SETTING === "Y"} onChange={(e) => handlePlanChange("IS_SETTING", e.target.checked ? "Y" : "N")} />
          </div>
          <button type="button" className="btn-save-plan" onClick={onSavePlan}>
            <AiFillSave size={14} />
            <span>SAVE PLAN</span>
          </button>
        </div>
      </div>
    );
  }
);

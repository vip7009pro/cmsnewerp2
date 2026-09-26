import React from "react";
import { DINHMUC_QSLX, MACHINE_LIST, RecentDM } from "../../interfaces/khsxInterface";

interface PrecisionQuickPlanDinhMucProps {
  datadinhmuc: DINHMUC_QSLX;
  setDataDinhMuc: React.Dispatch<React.SetStateAction<DINHMUC_QSLX>>;
  recentDMData: RecentDM[];
  machine_list: MACHINE_LIST[];
}

export const PrecisionQuickPlanDinhMuc: React.FC<PrecisionQuickPlanDinhMucProps> = ({
  datadinhmuc,
  setDataDinhMuc,
  recentDMData,
  machine_list,
}) => {
  const getRecentLossSX = (step: number) => {
    const val = recentDMData.find((e) => e.PROCESS_NUMBER === step)?.LOSS_SX;
    return val !== undefined && val !== null
      ? `${val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%`
      : "";
  };

  const getRecentLossSetting = (step: number) => {
    const val = recentDMData.find((e) => e.PROCESS_NUMBER === step)?.TT_SETTING_MET;
    return val !== undefined && val !== null
      ? `${val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}m`
      : "";
  };

  const steps = [
    {
      step: 1,
      eqKey: "EQ1" as keyof DINHMUC_QSLX,
      settingKey: "Setting1" as keyof DINHMUC_QSLX,
      uphKey: "UPH1" as keyof DINHMUC_QSLX,
      stepKey: "Step1" as keyof DINHMUC_QSLX,
      lossSxKey: "LOSS_SX1" as keyof DINHMUC_QSLX,
      lossSettingKey: "LOSS_SETTING1" as keyof DINHMUC_QSLX,
    },
    {
      step: 2,
      eqKey: "EQ2" as keyof DINHMUC_QSLX,
      settingKey: "Setting2" as keyof DINHMUC_QSLX,
      uphKey: "UPH2" as keyof DINHMUC_QSLX,
      stepKey: "Step2" as keyof DINHMUC_QSLX,
      lossSxKey: "LOSS_SX2" as keyof DINHMUC_QSLX,
      lossSettingKey: "LOSS_SETTING2" as keyof DINHMUC_QSLX,
    },
    {
      step: 3,
      eqKey: "EQ3" as keyof DINHMUC_QSLX,
      settingKey: "Setting3" as keyof DINHMUC_QSLX,
      uphKey: "UPH3" as keyof DINHMUC_QSLX,
      stepKey: "Step3" as keyof DINHMUC_QSLX,
      lossSxKey: "LOSS_SX3" as keyof DINHMUC_QSLX,
      lossSettingKey: "LOSS_SETTING3" as keyof DINHMUC_QSLX,
    },
    {
      step: 4,
      eqKey: "EQ4" as keyof DINHMUC_QSLX,
      settingKey: "Setting4" as keyof DINHMUC_QSLX,
      uphKey: "UPH4" as keyof DINHMUC_QSLX,
      stepKey: "Step4" as keyof DINHMUC_QSLX,
      lossSxKey: "LOSS_SX4" as keyof DINHMUC_QSLX,
      lossSettingKey: "LOSS_SETTING4" as keyof DINHMUC_QSLX,
    },
  ];

  return (
    <div className="precision-quickplan__dinhmuc">
      <div className="dinhmuc-scroll-wrapper">
        {/* 4 Hàng Định Mức Công Đoạn Thẳng Hàng Excel */}
        {steps.map((item) => {
          const recentLossSx = getRecentLossSX(item.step);
          const recentLossSetting = getRecentLossSetting(item.step);

          return (
            <div key={item.step} className="dm-row">
              {/* Nhãn CĐ */}
              <div className="dm-row__label">CĐ{item.step}</div>

              {/* EQ */}
              <div className="dm-row__field">
                <label>EQ{item.step}:</label>
                <select
                  value={(datadinhmuc[item.eqKey] as string) || ""}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      [item.eqKey]: e.target.value,
                    })
                  }
                >
                  <option value="">-- Máy --</option>
                  {machine_list.map((ele: MACHINE_LIST, idx: number) => (
                    <option key={idx} value={ele.EQ_NAME}>
                      {ele.EQ_NAME}
                    </option>
                  ))}
                </select>
              </div>

              {/* Setting (min) */}
              <div className="dm-row__field">
                <label>Set{item.step}(m):</label>
                <input
                  type="number"
                  placeholder="0"
                  value={datadinhmuc[item.settingKey] ?? 0}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      [item.settingKey]: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* UPH */}
              <div className="dm-row__field">
                <label>UPH{item.step}:</label>
                <input
                  type="number"
                  placeholder="0"
                  value={datadinhmuc[item.uphKey] ?? 0}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      [item.uphKey]: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* Step */}
              <div className="dm-row__field">
                <label>Step{item.step}:</label>
                <input
                  type="number"
                  placeholder="0"
                  value={datadinhmuc[item.stepKey] ?? 0}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      [item.stepKey]: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* Loss SX */}
              <div className="dm-row__field">
                <label>
                  LossSX{item.step}(%):
                  {recentLossSx && <span className="ref-val">({recentLossSx})</span>}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={datadinhmuc[item.lossSxKey] ?? 0}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      [item.lossSxKey]: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* Loss Setting */}
              <div className="dm-row__field">
                <label>
                  LossSet{item.step}(m):
                  {recentLossSetting && <span className="ref-val">({recentLossSetting})</span>}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={datadinhmuc[item.lossSettingKey] ?? 0}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      [item.lossSettingKey]: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          );
        })}

        {/* Hàng FACTORY & NOTE (QLSX) */}
        <div className="factory-note-bar">
          <div className="fn-item">
            <span className="fn-label">FACTORY:</span>
            <select
              value={datadinhmuc.FACTORY || "NA"}
              onChange={(e) =>
                setDataDinhMuc({ ...datadinhmuc, FACTORY: e.target.value })
              }
            >
              <option value="NA">NA</option>
              <option value="NM1">NM1</option>
              <option value="NM2">NM2</option>
            </select>
          </div>

          <div className="fn-item" style={{ flex: 1, minWidth: 0 }}>
            <span className="fn-label">NOTE (QLSX):</span>
            <input
              type="text"
              placeholder="Ghi chú điều phối sản xuất..."
              value={datadinhmuc.NOTE || ""}
              onChange={(e) =>
                setDataDinhMuc({ ...datadinhmuc, NOTE: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQuickPlanDinhMuc);

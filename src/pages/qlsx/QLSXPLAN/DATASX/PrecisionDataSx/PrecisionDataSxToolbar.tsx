import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { Search, Assignment, ListAlt } from "@mui/icons-material";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionDataSxToolbarProps {
  register: UseFormRegister<any>;
  machineList: MACHINE_LIST[];
  loading: boolean;
  onLoadChiThi: () => void;
  onLoadYcsx: () => void;
  activeMode: boolean; // true = Chỉ thị, false = YCSX
}

export const PrecisionDataSxToolbar: React.FC<PrecisionDataSxToolbarProps> = React.memo(({
  register,
  machineList,
  loading,
  onLoadChiThi,
  onLoadYcsx,
  activeMode,
}) => {
  return (
    <div className="precision-datasx-toolbar">
      {/* Hàng 1: Các trường lọc đầu vào */}
      <div className="toolbar-input-grid">
        <div className="input-group date-group">
          <label className="input-label">Từ ngày</label>
          <input type="date" className="toolbar-input" {...register("fromdate")} />
        </div>

        <div className="input-group date-group">
          <label className="input-label">Tới ngày</label>
          <input type="date" className="toolbar-input" {...register("todate")} />
        </div>

        <div className="input-group">
          <label className="input-label">Code KD</label>
          <input type="text" className="toolbar-input" placeholder="GH63-xxxxxx" {...register("codeKD")} />
        </div>

        <div className="input-group">
          <label className="input-label">Code ERP</label>
          <input type="text" className="toolbar-input" placeholder="7C123xxx" {...register("codeCMS")} />
        </div>

        <div className="input-group">
          <label className="input-label">Tên Liệu</label>
          <input type="text" className="toolbar-input" placeholder="SJ-203020HC" {...register("m_name")} />
        </div>

        <div className="input-group">
          <label className="input-label">Mã Liệu CMS</label>
          <input type="text" className="toolbar-input" placeholder="A123456" {...register("m_code")} />
        </div>

        <div className="input-group">
          <label className="input-label">Số YCSX</label>
          <input type="text" className="toolbar-input" placeholder="1F80008" {...register("prodrequestno")} />
        </div>

        <div className="input-group">
          <label className="input-label">Số chỉ thị</label>
          <input type="text" className="toolbar-input" placeholder="A123456" {...register("plan_id")} />
        </div>

        <div className="input-group select-group">
          <label className="input-label">Factory</label>
          <select className="toolbar-select" {...register("factory")}>
            <option value="ALL">Tất cả</option>
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>
        </div>

        <div className="input-group select-group">
          <label className="input-label">Máy</label>
          <select className="toolbar-select" {...register("machine")}>
            <option value="ALL">Tất cả máy</option>
            {machineList
              .slice()
              .sort((a, b) => a.EQ_NAME.localeCompare(b.EQ_NAME))
              .map((ele: MACHINE_LIST, index: number) => (
                <option key={index} value={ele.EQ_NAME}>
                  {ele.EQ_NAME}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Hàng 2: Checkboxes và nút truy vấn */}
      <div className="toolbar-action-row">
        <div className="checkbox-group">
          <label className="custom-checkbox-label">
            <input type="checkbox" {...register("alltime")} />
            <span>All Time</span>
          </label>
          <label className="custom-checkbox-label">
            <input type="checkbox" {...register("truSample")} />
            <span>Trừ Sample</span>
          </label>
          <label className="custom-checkbox-label">
            <input type="checkbox" {...register("onlyClose")} />
            <span>Only Closed</span>
          </label>
          <label className="custom-checkbox-label highlight">
            <input type="checkbox" {...register("fullSummary")} />
            <span>Full Summary</span>
          </label>
        </div>

        <div className="action-buttons">
          <Button
            variant={activeMode ? "contained" : "outlined"}
            color="primary"
            size="small"
            startIcon={<Assignment />}
            disabled={loading}
            onClick={onLoadChiThi}
            className="btn-chithi"
          >
            TRA CHỈ THỊ
          </Button>

          <Button
            variant={!activeMode ? "contained" : "outlined"}
            color="secondary"
            size="small"
            startIcon={<ListAlt />}
            disabled={loading}
            onClick={onLoadYcsx}
            className="btn-ycsx"
          >
            TRA YCSX
          </Button>
        </div>
      </div>
    </div>
  );
});

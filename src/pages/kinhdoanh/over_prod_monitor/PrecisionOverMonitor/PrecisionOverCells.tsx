import React, { useState } from "react";
import { CustomCellRendererProps } from "ag-grid-react";
import Swal from "sweetalert2";
import { checkBP } from "../../../../api/services/permissionService";
import { getUserData } from "../../../../api/Api";
import { PROD_OVER_DATA } from "../../interfaces/kdInterface";

interface KdCfmCellRendererProps extends CustomCellRendererProps {
  onUpdateData: (row: PROD_OVER_DATA, val: string) => Promise<void>;
}

// Component Cell Renderer tương tác bảo lưu 100% chức năng cho cột KD_CFM
export const KdCfmCellRenderer: React.FC<KdCfmCellRendererProps> = (props) => {
  const { data, onUpdateData } = props;
  if (!data) return null;

  // Bản gốc: const [showhidecell, setshowHideCell] = useState(params.data.KD_CFM === 'P')
  const [showhidecell, setShowHideCell] = useState(data.KD_CFM === "P");

  const handleRadioChange = (value: "Y" | "N") => {
    checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], async () => {
      if (data.HANDLE_STATUS === "P") {
        await onUpdateData(data, value);
      } else {
        Swal.fire("Thông báo", "Đã xử lý xong, không update lại trạng thái được nữa", "error");
      }
    });
  };

  return (
    <div className="precision-cell-kd-cfm">
      {!showhidecell ? (
        <div className="radio-group-wrap">
          <label className="radio-opt radio-opt--nhap">
            <input
              type="radio"
              name={`${data.AUTO_ID}_KD_CFM`}
              value="Y"
              checked={data.KD_CFM === "Y"}
              onChange={() => handleRadioChange("Y")}
            />
            <span>NHẬP</span>
          </label>
          <label className="radio-opt radio-opt--huy">
            <input
              type="radio"
              name={`${data.AUTO_ID}_KD_CFM`}
              value="N"
              checked={data.KD_CFM === "N"}
              onChange={() => handleRadioChange("N")}
            />
            <span>HỦY</span>
          </label>
        </div>
      ) : (
        <span
          className={`badge-label-toggle ${
            data.KD_CFM === "Y"
              ? "badge-label-toggle--nhap"
              : data.KD_CFM === "N"
              ? "badge-label-toggle--huy"
              : "badge-label-toggle--pending"
          }`}
          onClick={() => setShowHideCell((prev) => !prev)}
          title="Nhấp để đổi sang chế độ chọn NHẬP / HỦY"
        >
          {data.KD_CFM === "Y" ? "NHẬP" : data.KD_CFM === "N" ? "HỦY" : "PENDING"}
        </span>
      )}
    </div>
  );
};

// Component Cell Renderer cho cột HANDLE_STATUS
export const HandleStatusCellRenderer: React.FC<CustomCellRendererProps> = (props) => {
  const status = props.data?.HANDLE_STATUS;
  const isPending = status === "P";
  // Legacy OVER_MONITOR: 'C' = xanh (đã xử lý), 'Y' = đỏ, còn lại = cam
  const isHandledPending = status === "Y";

  if (isHandledPending) {
    return (
      <div className="precision-cell-status">
        <span
          className="status-chip"
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >
          CLOSED
        </span>
      </div>
    );
  }

  return (
    <div className="precision-cell-status">
      <span className={`status-chip ${isPending ? "status-chip--pending" : "status-chip--closed"}`}>
        {isPending ? "PENDING" : "CLOSED"}
      </span>
    </div>
  );
};

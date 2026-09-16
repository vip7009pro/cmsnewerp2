import React from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Equipment, CalibrationHistory } from "./calibrationTypes";

interface EqColumnProps {
  onPreviewImage: (title: string, imageUrl: string) => void;
  onEditEq: (eq: Equipment) => void;
  onDeleteEq: (eqId: number) => void;
}

interface HistColumnProps {
  onPreviewImage: (title: string, imageUrl: string) => void;
  onEditHist: (hist: CalibrationHistory) => void;
  onDeleteHist: (calId: number) => void;
}

export const createEquipmentColumns = ({
  onPreviewImage,
  onEditEq,
  onDeleteEq,
}: EqColumnProps) => {
  return [
    { field: "EQ_ID", headerName: "ID", width: 60 },
    { field: "EQ_NAME", headerName: "Tên thiết bị", width: 200 },
    { field: "CONTROL_NO", headerName: "Số quản lý", width: 150 },
    { field: "SERIES_MODEL", headerName: "Số series/Model", width: 150 },
    { field: "MAKER", headerName: "Nhà SX", width: 150 },
    {
      field: "IMAGE_URL",
      headerName: "Ảnh thiết bị",
      width: 100,
      cellRenderer: (params: any) => {
        if (!params.value) {
          return (
            <div className="pc-thumb-cell">
              <span className="no-img-text">Không có ảnh</span>
            </div>
          );
        }
        return (
          <div className="pc-thumb-cell">
            <img
              src={`/calibration/${params.value}`}
              className="thumb-img"
              alt="Thiết bị"
              title="Bấm để xem ảnh phóng to"
              onClick={() =>
                onPreviewImage(
                  `Ảnh thiết bị: ${params.data?.EQ_NAME || ""}`,
                  params.value
                )
              }
            />
          </div>
        );
      },
    },
    {
      field: "STAMP_IMAGE_URL",
      headerName: "Ảnh tem cuối",
      width: 100,
      cellRenderer: (params: any) => {
        if (!params.value) {
          return (
            <div className="pc-thumb-cell">
              <span className="no-img-text">Chưa có tem</span>
            </div>
          );
        }
        return (
          <div className="pc-thumb-cell">
            <img
              src={`/calibration/${params.value}`}
              className="thumb-img"
              alt="Tem HC"
              title="Bấm để xem ảnh tem phóng to"
              onClick={() =>
                onPreviewImage(
                  `Tem hiệu chuẩn: ${params.data?.EQ_NAME || ""}`,
                  params.value
                )
              }
            />
          </div>
        );
      },
    },
    { field: "CAL_PERIOD", headerName: "Chu kỳ (tháng)", width: 120 },
    { field: "LAST_CAL_DATE", headerName: "Ngày HC cuối", width: 150 },
    { field: "NEXT_CAL_DATE", headerName: "Ngày HC kế", width: 150 },
    {
      field: "STATUS",
      headerName: "Trạng thái",
      width: 120,
      cellRenderer: (params: any) => {
        const val = params.value;
        if (val === "IN_USE") {
          return <span className="pc-status-chip in-use">Đang sử dụng</span>;
        }
        if (val === "BROKEN") {
          return <span className="pc-status-chip broken">Đã hỏng</span>;
        }
        return <span>{val || ""}</span>;
      },
    },
    { field: "DEPARTMENT", headerName: "BP Sử dụng", width: 120 },
    { field: "LOCATION", headerName: "Vị trí", width: 120 },
    {
      field: "ACTION",
      headerName: "Hành động",
      width: 100,
      cellRenderer: (params: any) => (
        <div className="pc-action-cell">
          <button
            type="button"
            className="btn-cell-action edit"
            title="Chỉnh sửa thiết bị"
            onClick={(e) => {
              e.stopPropagation();
              onEditEq(params.data);
            }}
          >
            <AiOutlineEdit size={14} />
          </button>
          <button
            type="button"
            className="btn-cell-action delete"
            title="Xóa thiết bị"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteEq(params.data.EQ_ID);
            }}
          >
            <AiOutlineDelete size={14} />
          </button>
        </div>
      ),
    },
  ];
};

export const createHistoryColumns = ({
  onPreviewImage,
  onEditHist,
  onDeleteHist,
}: HistColumnProps) => {
  return [
    { field: "CAL_DATE", headerName: "Ngày hiệu chuẩn", width: 150 },
    { field: "NEXT_CAL_DATE", headerName: "Ngày HC kế tiếp", width: 150 },
    { field: "CAL_PERIOD", headerName: "Chu kỳ (tháng)", width: 120 },
    {
      field: "STAMP_IMAGE_URL",
      headerName: "Tem hiệu chuẩn",
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.value) {
          return (
            <div className="pc-thumb-cell">
              <span className="no-img-text">Chưa có tem</span>
            </div>
          );
        }
        return (
          <div className="pc-thumb-cell">
            <img
              src={`/calibration/${params.value}`}
              className="thumb-img"
              alt="Tem HC"
              title="Bấm để xem tem phóng to"
              onClick={() =>
                onPreviewImage(
                  `Tem hiệu chuẩn ngày ${params.data?.CAL_DATE || ""}`,
                  params.value
                )
              }
            />
          </div>
        );
      },
    },
    { field: "CAL_PERSON", headerName: "Người HC", width: 150 },
    { field: "REMARK", headerName: "Ghi chú", width: 200 },
    {
      field: "ACTION",
      headerName: "Hành động",
      width: 100,
      cellRenderer: (params: any) => (
        <div className="pc-action-cell">
          <button
            type="button"
            className="btn-cell-action edit"
            title="Sửa lượt hiệu chuẩn"
            onClick={(e) => {
              e.stopPropagation();
              onEditHist(params.data);
            }}
          >
            <AiOutlineEdit size={14} />
          </button>
          <button
            type="button"
            className="btn-cell-action delete"
            title="Xóa lượt hiệu chuẩn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteHist(params.data.CAL_ID);
            }}
          >
            <AiOutlineDelete size={14} />
          </button>
        </div>
      ),
    },
  ];
};

import { useMemo } from "react";
import {
  renderTruncated,
  renderProcessStatus,
  renderDefectImageCell,
  renderCountermeasureCell,
} from "./ncrCellRenderers";

interface NCRColumnsProps {
  onUploadDefectImage: (file: File, ncrId: number) => void;
  onUploadCountermeasure: (file: File, ncrId: number) => void;
}

const cCol = (field: string, width: number = 80, isMono: boolean = false) => ({
  field,
  headerName: field,
  width,
  cellRenderer: (params: any) => renderTruncated(params.value, isMono),
});

export const usePrecisionNCRColumns = ({
  onUploadDefectImage,
  onUploadCountermeasure,
}: NCRColumnsProps) => {
  // 1. Cấu hình 23 cột Bảng NCR Detail khớp 100% headerName & width bản gốc
  const ncrColumns = useMemo(
    () => [
      {
        field: "NCR_ID",
        headerName: "NCR_ID",
        width: 80,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        checkboxSelectionVisible: true,
        cellRenderer: (params: any) => renderTruncated(params.value, true),
      },
      cCol("FACTORY", 80),
      cCol("NCR_NO", 80, true),
      cCol("NCR_DATE", 80, true),
      cCol("RESPONSE_REQ_DATE", 80, true),
      cCol("CUST_CD", 80, true),
      cCol("VENDOR", 80),
      cCol("M_CODE", 80, true),
      cCol("M_NAME", 80),
      cCol("WIDTH_CD", 80, true),
      cCol("CMS_LOT", 80, true),
      cCol("VENDOR_LOT", 80, true),
      cCol("DEFECT_TITLE", 80),
      cCol("DEFECT_DETAIL", 80),
      {
        field: "DEFECT_IMAGE",
        headerName: "DEFECT_IMAGE",
        width: 80,
        cellRenderer: (params: any) =>
          renderDefectImageCell(params, onUploadDefectImage),
      },
      {
        field: "COUNTERMEASURE",
        headerName: "COUNTERMEASURE",
        width: 120,
        cellRenderer: (params: any) =>
          renderCountermeasureCell(params, onUploadCountermeasure),
      },
      {
        field: "PROCESS_STATUS",
        headerName: "PROCESS_STATUS",
        width: 80,
        cellRenderer: (params: any) => renderProcessStatus(params.value),
      },
      cCol("USE_YN", 80, true),
      cCol("INS_DATE", 80, true),
      cCol("INS_EMPL", 80, true),
      cCol("UPD_DATE", 80, true),
      cCol("UPD_EMPL", 80, true),
      cCol("REMARK", 80),
    ],
    [onUploadDefectImage, onUploadCountermeasure]
  );

  // 2. Cấu hình 9 cột Bảng Holding Detail khớp 100% headerName & width bản gốc
  const holdingColumns = useMemo(
    () => [
      {
        field: "NCR_ID",
        headerName: "NCR_ID",
        width: 60,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        checkboxSelectionVisible: true,
        cellRenderer: (params: any) => renderTruncated(params.value, true),
      },
      cCol("VENDOR_LOT", 60, true),
      cCol("M_CODE", 60, true),
      cCol("M_NAME", 60),
      cCol("WIDTH_CD", 60, true),
      {
        field: "TOTAL_HOLDING_ROLL",
        headerName: "TOTAL_HOLDING_ROLL",
        width: 60,
        cellRenderer: (params: any) =>
          renderTruncated(
            params.value !== null && params.value !== undefined
              ? Number(params.value).toLocaleString()
              : "",
            true
          ),
      },
      {
        field: "TOTAL_HOLDING_M",
        headerName: "TOTAL_HOLDING_M",
        width: 60,
        cellRenderer: (params: any) =>
          renderTruncated(
            params.value !== null && params.value !== undefined
              ? Number(params.value).toLocaleString()
              : "",
            true
          ),
      },
      {
        field: "TOTAL_HOLDING_SQM",
        headerName: "TOTAL_HOLDING_SQM",
        width: 60,
        cellRenderer: (params: any) =>
          renderTruncated(
            params.value !== null && params.value !== undefined
              ? Number(params.value).toLocaleString()
              : "",
            true
          ),
      },
      cCol("TYPE", 60),
    ],
    []
  );

  return { ncrColumns, holdingColumns };
};

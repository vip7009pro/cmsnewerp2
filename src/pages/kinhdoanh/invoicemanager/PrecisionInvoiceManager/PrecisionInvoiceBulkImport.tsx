import React, { useMemo, useRef, useState, memo } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getSocket, getUserData } from "../../../../api/Api";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import AGTable from "../../../../components/DataTable/AGTable";
import { FiUploadCloud, FiCheckCircle, FiUpload, FiX } from "react-icons/fi";
import {
  f_checkG_CODE_USE_YN,
  f_checkPOInfo,
  f_compareDateToNow,
  f_compareTwoDate,
  f_insertInvoice,
  f_readUploadFile,
} from "../../utils/kdUtils";

interface Props {
  onClose?: () => void;
}

const PrecisionInvoiceBulkImport: React.FC<Props> = ({ onClose }) => {
  const userData = useSelector((state: RootState) => state.totalSlice.userData);

  const [columnsExcel, setColumnsExcel] = useState<Array<any>>([]);
  const [uploadExcelJson, setUploadExcelJson] = useState<Array<any>>([]);
  const [trigger, setTrigger] = useState(true);
  const excelSelected = useRef<any[]>([]);

  const loadFile = (e: any) => {
    f_readUploadFile(e, setUploadExcelJson, setColumnsExcel);
  };

  const handle_checkInvoiceHangLoat = async () => {
    if (uploadExcelJson.length > 0) {
      let tempjson = uploadExcelJson;
      for (let i = 0; i < uploadExcelJson.length; i++) {
        let err_code: number = 0;
        let po_info: Array<any> = await f_checkPOInfo(
          uploadExcelJson[i].G_CODE ?? "",
          uploadExcelJson[i].CUST_CD ?? "",
          uploadExcelJson[i].PO_NO
        );
        err_code =
          po_info.length > 0
            ? uploadExcelJson[i].DELIVERY_QTY > po_info[0].PO_BALANCE
              ? 5
              : err_code
            : 1;
        let checkCompareIVDatevsPODate: number =
          po_info.length > 0
            ? f_compareTwoDate(
                uploadExcelJson[i].DELIVERY_DATE,
                po_info[0]?.PO_DATE.substring(0, 10)
              )
            : err_code;
        err_code = checkCompareIVDatevsPODate === -1 ? 6 : err_code;
        err_code = f_compareDateToNow(uploadExcelJson[i].DELIVERY_DATE) ? 2 : err_code;
        let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
        err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
        if (err_code === 0) {
          tempjson[i].CHECKSTATUS = "OK";
        } else if (err_code === 1) {
          tempjson[i].CHECKSTATUS = "NG: Không tồn tại PO";
        } else if (err_code === 2) {
          tempjson[i].CHECKSTATUS = "NG: Ngày Giao hàng không được trước ngày hôm nay";
        } else if (err_code === 3) {
          tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
        } else if (err_code === 4) {
          tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
        } else if (err_code === 5) {
          tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
        } else if (err_code === 6) {
          tempjson[i].CHECKSTATUS = "NG: Ngày Invoice không được trước ngày PO";
        }
      }
      setUploadExcelJson(tempjson);
      setTrigger(!trigger);
      Swal.fire("Thông báo", "Đã hoàn thành check Invoice hàng loạt", "success");
    } else {
      Swal.fire("Thông báo", "Không có dòng nào", "error");
    }
  };

  const handle_upInvoiceHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      let po_info: Array<any> = await f_checkPOInfo(
        uploadExcelJson[i].G_CODE ?? "",
        uploadExcelJson[i].CUST_CD ?? "",
        uploadExcelJson[i].PO_NO
      );
      err_code =
        po_info.length > 0
          ? uploadExcelJson[i].DELIVERY_QTY > po_info[0].PO_BALANCE
            ? 5
            : err_code
          : 1;
      let checkCompareIVDatevsPODate: number =
        po_info.length > 0
          ? f_compareTwoDate(
              uploadExcelJson[i].DELIVERY_DATE,
              po_info[0]?.PO_DATE.substring(0, 10)
            )
          : err_code;
      err_code = checkCompareIVDatevsPODate === -1 ? 6 : err_code;
      err_code = f_compareDateToNow(uploadExcelJson[i].DELIVERY_DATE) ? 2 : err_code;
      let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
      err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = await f_insertInvoice({
          DELIVERY_QTY: uploadExcelJson[i].DELIVERY_QTY,
          DELIVERY_DATE: uploadExcelJson[i].DELIVERY_DATE,
          REMARK: uploadExcelJson[i]?.REMARK ?? "",
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PO_NO: uploadExcelJson[i].PO_NO,
          EMPL_NO: userData?.EMPL_NO,
          INVOICE_NO: uploadExcelJson[i].INVOICE_NO,
        });
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG: Không tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Giao hàng không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      } else if (err_code === 6) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Invoice không được trước ngày PO";
      }
    }

    let newNotification: NotificationElement = {
      CTR_CD: "002",
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: "Invoice mới hàng loạt",
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm Invoice hàng loạt`,
      SUBDEPTNAME: "KD",
      MAINDEPTNAME: "KD",
      INS_EMPL: "NHU1903",
      INS_DATE: "2024-12-30",
      UPD_EMPL: "NHU1903",
      UPD_DATE: "2024-12-30",
    };
    if (await f_insert_Notification_Data(newNotification)) {
      getSocket().emit("notification_panel", newNotification);
    }

    Swal.fire("Thông báo", "Đã hoàn thành thêm Invoice hàng loạt", "success");
    setUploadExcelJson(tempjson);
    setTrigger(!trigger);
  };

  const confirmCheckInvoiceHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check Invoice hàng loạt ?",
      text: "Sẽ bắt đầu check Invoice hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Check Invoice",
          text: "Đang check Invoice hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_checkInvoiceHangLoat();
      }
    });
  };

  const confirmUpInvoiceHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm Invoice hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Up Invoice",
          text: "Đang up invoice hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_upInvoiceHangLoat();
      }
    });
  };

  const excelDataAGTable = useMemo(
    () => (
      <AGTable
        showFilter={true}
        toolbar={<div />}
        columns={columnsExcel}
        data={uploadExcelJson}
        onCellEditingStopped={() => {}}
        onRowClick={() => {}}
        onSelectionChange={(params: any) => {
          excelSelected.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [uploadExcelJson, columnsExcel, trigger]
  );

  return (
    <div className="stitch-inv__bulk-import">
      {/* Header bar */}
      <div className="stitch-inv__bulk-header">
        <div>
          <h2>
            <FiUploadCloud />
            Thêm Invoice Hàng Loạt Từ Excel (Batch Import)
          </h2>
          <p>Tải lên tệp danh sách hóa đơn xuất hàng theo mẫu định dạng của hệ thống</p>
        </div>
        <div className="stitch-inv__bulk-actions">
          <button
            className="stitch-inv__btn stitch-inv__btn--primary"
            onClick={confirmCheckInvoiceHangLoat}
          >
            <FiCheckCircle size={12} /> CHECK INVOICE
          </button>
          <button
            className="stitch-inv__btn stitch-inv__btn--emerald"
            onClick={confirmUpInvoiceHangLoat}
          >
            <FiUpload size={12} /> UP INVOICE (LƯU DB)
          </button>
          {onClose && (
            <button
              className="stitch-inv__btn stitch-inv__btn--outline"
              onClick={onClose}
            >
              <FiX size={12} /> ĐÓNG
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div className="stitch-inv__dropzone">
        <div className="stitch-inv__dropzone-icon">
          <FiUploadCloud />
        </div>
        <div className="stitch-inv__dropzone-text">
          Kéo thả file hóa đơn hoặc nhấn để chọn file từ máy tính
        </div>
        <div className="stitch-inv__dropzone-subtext">
          Hỗ trợ định dạng .XLSX, .XLS, dung lượng tối đa 15MB
        </div>
        <div className="stitch-inv__dropzone-actions">
          <input
            type="file"
            id="bulkFileInput"
            style={{ display: "none" }}
            onChange={loadFile}
          />
          <label htmlFor="bulkFileInput" className="stitch-inv__file-label">
            Chọn File Excel
          </label>
          {uploadExcelJson.length > 0 && (
            <span className="stitch-inv__file-info">
              Đã tải lên {uploadExcelJson.length} dòng
            </span>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      <div className="stitch-inv__bulk-preview">
        <div className="stitch-inv__bulk-preview-card">
          <div className="stitch-inv__bulk-preview-header">
            <span className="stitch-inv__bulk-preview-title">
              Bảng xem trước dữ liệu tải lên (Preview)
            </span>
          </div>
          <div className="stitch-inv__bulk-preview-table">{excelDataAGTable}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionInvoiceBulkImport);

import React, { useMemo, useRef, useState } from "react";
import { Button, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import "./PoManagerAddTab.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getCompany, getSocket, getUserData } from "../../../api/Api";
import { autoGetProdPrice, f_insert_Notification_Data } from "../../../api/GlobalFunction";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import AGTable from "../../../components/DataTable/AGTable";
import PivotTable from "../../../components/PivotChart/PivotChart";
import {
  f_checkG_CODE_USE_YN,
  f_checkPOExist,
  f_compareDateToNow,
  f_insertPO,
  f_readUploadFile,
} from "../utils/kdUtils";

const PoManagerAddTab: React.FC = () => {
  const userData = useSelector((state: RootState) => state.totalSlice.userData);
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const company: string = useSelector((state: RootState) => state.totalSlice.company);
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [columnsExcel, setColumnsExcel] = useState<Array<any>>([]);
  const [trigger, setTrigger] = useState(true);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const excelSelected = useRef<any[]>([]);

  const loadFile = (e: any) => {
    f_readUploadFile(e, setUploadExcelJSon, setColumnsExcel);
  };

  const handle_checkPOHangLoat = async () => {
    if (uploadExcelJson.length > 0) {
      Swal.fire({
        title: "Đang check PO hàng loạt",
        text: "Đang check, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let tempjson = uploadExcelJson;
      for (let i = 0; i < uploadExcelJson.length; i++) {
        let err_code: number = 0;
        err_code =
          (await f_checkPOExist(
            uploadExcelJson[i].G_CODE,
            uploadExcelJson[i].CUST_CD,
            uploadExcelJson[i].PO_NO
          ))
            ? 1
            : 0;
        err_code = f_compareDateToNow(uploadExcelJson[i].PO_DATE) ? 2 : err_code;
        let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
        err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
        let tempgia = { prod_price: 0, bep: 0 };
        if (getCompany() !== "CMS") {
          tempgia = await autoGetProdPrice(
            uploadExcelJson[i].G_CODE,
            uploadExcelJson[i].CUST_CD,
            uploadExcelJson[i].PO_QTY
          );
          if (tempgia.prod_price !== 0) {
            tempjson[i].PROD_PRICE = tempgia.prod_price;
            tempjson[i].BEP = tempgia.bep;
          } else {
            err_code = 5;
          }
        }
        if (err_code === 0) {
          tempjson[i].CHECKSTATUS = "OK";
        } else if (err_code === 1) {
          tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
        } else if (err_code === 2) {
          tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
        } else if (err_code === 3) {
          tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
        } else if (err_code === 4) {
          tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
        } else if (err_code === 5) {
          tempjson[i].CHECKSTATUS = "NG: Chưa có giá hoặc chua phê duyệt giá";
        }
      }
      Swal.fire("Thông báo", "Đã hoàn thành check PO hàng loạt", "success");
      setUploadExcelJSon(tempjson);
      setTrigger(!trigger);
    } else {
      Swal.fire("Thông báo", "Chưa có dòng nào", "error");
    }
  };

  const handle_upPOHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      err_code =
        (await f_checkPOExist(
          uploadExcelJson[i].G_CODE,
          uploadExcelJson[i].CUST_CD,
          uploadExcelJson[i].PO_NO
        ))
          ? 1
          : 0;
      err_code = f_compareDateToNow(uploadExcelJson[i].PO_DATE) ? 2 : err_code;
      let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
      err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
      uploadExcelJson[i].CHECKSTATUS !== "OK" ? (err_code = 5) : (err_code = err_code);
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = await f_insertPO({
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PO_NO: uploadExcelJson[i].PO_NO,
          EMPL_NO: userData?.EMPL_NO,
          PO_QTY: uploadExcelJson[i].PO_QTY,
          PO_DATE: uploadExcelJson[i].PO_DATE,
          RD_DATE: uploadExcelJson[i].RD_DATE,
          PROD_PRICE: uploadExcelJson[i].PROD_PRICE,
          BEP: uploadExcelJson[i].BEP ?? 0,
          REMARK: uploadExcelJson[i].REMARK,
        });
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: PO chưa được check trước khi up";
      }
    }
    let newNotification: NotificationElement = {
      CTR_CD: "002",
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: "PO vừa được thêm hàng loạt",
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm hàng loạt PO mới`,
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
    Swal.fire("Thông báo", "Đã hoàn thành thêm PO hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
  };

  const confirmUpPoHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm PO hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm PO hàng loạt", "success");
        Swal.fire({
          title: "Up PO",
          text: "Đang up PO hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_upPOHangLoat();
      }
    });
  };

  const confirmCheckPoHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check PO hàng loạt ?",
      text: "Sẽ bắt đầu check po hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Check PO",
          text: "Đang check PO hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_checkPOHangLoat();
      }
    });
  };

  const dataSource = new PivotGridDataSource({
    fields: [
      { caption: "CUST_CD", dataField: "CUST_CD", dataType: "string", area: "row" },
      { caption: "G_CODE", dataField: "G_CODE", dataType: "string", area: "row" },
      { caption: "PO_NO", dataField: "PO_NO", dataType: "string", area: "row" },
      { caption: "PO_QTY", dataField: "PO_QTY", dataType: "number", summaryType: "sum", area: "data" },
    ],
    store: uploadExcelJson,
  });

  const excelDataAGTable = useMemo(
    () => (
      <AGTable
        showFilter={true}
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(!showhidePivotTable);
              }}
            >
              <MdOutlinePivotTableChart color="#ff33bb" size={15} />
              Pivot
            </IconButton>
          </div>
        }
        columns={columnsExcel}
        data={uploadExcelJson}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }}
        onRowClick={(params: any) => {
          //
        }}
        onSelectionChange={(params: any) => {
          excelSelected.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [uploadExcelJson, columnsExcel, trigger, showhidePivotTable]
  );

  return (
    <div className="newpo">
      <div
        className="batchnewpo batchnewpo--full"
        style={{
          ["--poadd-header-bg" as any]:
            theme?.[company]?.backgroundImage ?? theme?.CMS?.backgroundImage ?? "",
        }}
      >
        <div className="newpoHeader">
          <h3>Thêm PO Hàng Loạt</h3>
        </div>

        <div className="formupload formupload--full">
          <div className="uploadLeft">
            <input
              className="selectfilebutton"
              type="file"
              name="upload"
              id="upload"
              onChange={(e: any) => {
                loadFile(e);
              }}
            />
          </div>
          <Button
            className="poAddActionBtn"
            variant="contained"
            size="small"
            onClick={() => {
              confirmCheckPoHangLoat();
            }}
          >
            Check PO
          </Button>
          <Button
            className="poAddActionBtn"
            variant="contained"
            size="small"
            color="success"
            onClick={() => {
              confirmUpPoHangLoat();
            }}
          >
            Up PO
          </Button>
        </div>

        <div className="insertPOTable insertPOTable--full">{excelDataAGTable}</div>

        {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              Close
            </IconButton>
            <PivotTable datasource={dataSource} tableID="potablepivot_add" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PoManagerAddTab;

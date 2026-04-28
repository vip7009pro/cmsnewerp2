import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbLogout } from "react-icons/tb";
import { useSelector } from "react-redux";
import "./QuotationDeleteHistory.scss";
import { UserData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { RootState } from "../../../redux/store";
import { BANGGIA_DELETED_DATA } from "../interfaces/kdInterface";
import { f_loadbanggiaDeletedHistory } from "../utils/kdUtils";
import { checkBP } from "../../../api/GlobalFunction";
import { getUserData } from "../../../api/Api";

const QuotationDeleteHistory = () => {
  const { register, watch } = useForm({
    defaultValues: {
      fromdate: moment().format("YYYY-MM-DD"),
      todate: moment().format("YYYY-MM-DD"),
      codeKD: "",
      codeCMS: "",
      m_name: "",
      cust_name: "",
      alltime: true,
    },
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [, setSH] = useState(false);
  const showhidesearchdiv = useRef(true);
  const [rows, setRows] = useState<BANGGIA_DELETED_DATA[]>([]);

  const formatDecimal = (value: any, maximumFractionDigits = 6) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return "";
    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    });
  };

  const columnsDeletedHistory = useMemo(
    () => getUserData()?.EMPL_NO ==='NHU1903' ? [
      { field: "PROD_ID", headerName: "PROD_ID", width: 90 },
      { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
      { field: "CUST_CD", headerName: "CUST_CD", width: 70 },
      { field: "G_CODE", headerName: "G_CODE", width: 90 },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
      { field: "G_NAME", headerName: "G_NAME", width: 140 },
      {
        field: "PROD_MAIN_MATERIAL",
        headerName: "PROD_MAIN_MATERIAL",
        width: 120,
      },
      { field: "PRICE_DATE", headerName: "PRICE_DATE", width: 100 },
      { field: "MOQ", headerName: "MOQ", width: 80 },
      {
        field: "PROD_PRICE",
        headerName: "PROD_PRICE",
        width: 110,
        cellRenderer: (e: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "normal" }}>
              {formatDecimal(e.data.PROD_PRICE)}
            </span>
          );
        },
      },
      {
        field: "BEP",
        headerName: "BEP",
        width: 100,
        cellRenderer: (e: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "normal" }}>
              {formatDecimal(e.data.BEP)}
            </span>
          );
        },
      },
      { field: "CURRENCY", headerName: "CURRENCY", width: 90 },
      {
        field: "RATE",
        headerName: "RATE",
        width: 90,
        cellRenderer: (e: any) => {
          return (
            <span style={{ color: "black", fontWeight: "normal" }}>
              {formatDecimal(e.data.RATE, 4)}
            </span>
          );
        },
      },
      {
        field: "FINAL",
        headerName: "APPROVAL",
        width: 100,
        cellRenderer: (e: any) => {
          if (e.data.FINAL === "Y") {
            return (
              <div
                style={{
                  color: "white",
                  backgroundColor: "#13DC0C",
                  width: "85px",
                  textAlign: "center",
                }}
              >
                Y
              </div>
            );
          }
          return (
            <div
              style={{
                color: "white",
                backgroundColor: "red",
                width: "85px",
                textAlign: "center",
              }}
            >
              N
            </div>
          );
        },
      },
      { field: "REMARK", headerName: "REMARK", width: 120 },
      { field: "INS_DATE", headerName: "DELETE_DATE", width: 150 },
      { field: "INS_EMPL", headerName: "DELETE_EMPL", width: 100 },
      { field: "UPD_DATE", headerName: "UPD_DATE", width: 150 },
      { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 100 },
    ]:[
      { field: "PROD_ID", headerName: "PROD_ID", width: 90 },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
      { field: "INS_DATE", headerName: "DELETE_DATE", width: 150 },
      { field: "INS_EMPL", headerName: "DELETE_EMPL", width: 100 },
    ],
    [],
  );

  const loadDeletedPriceHistory = useCallback(async () => {
    const loadedData = await f_loadbanggiaDeletedHistory({
      ALLTIME: watch("alltime"),
      FROM_DATE: watch("fromdate"),
      TO_DATE: watch("todate"),
      M_NAME: watch("m_name"),
      G_CODE: watch("codeCMS"),
      G_NAME: watch("codeKD"),
      CUST_NAME_KD: watch("cust_name"),
    });
    setRows(loadedData);
  }, [watch]);

  const deletedHistoryTable = useMemo(
    () => (
      <AGTable
        showFilter={true}
        toolbar={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              className="buttonIcon"
              onClick={() => {
                showhidesearchdiv.current = !showhidesearchdiv.current;
                setSH((prev) => !prev);
              }}
            >
              <TbLogout color="green" size={15} />
              Show/Hide
            </IconButton>
          </div>
        }
        columns={columnsDeletedHistory}
        data={rows}
        onSelectionChange={() => {}}
      />
    ),
    [columnsDeletedHistory, rows],
  );

  useEffect(() => {
    checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadDeletedPriceHistory);
  }, [loadDeletedPriceHistory, userData]);

  return (
    <div className="quotationDeleteHistory">
      <div className="tracuuDataInspection">
        {showhidesearchdiv.current == true && (
          <div
            className="tracuuDataInspectionform"
            style={{ backgroundImage: theme.CMS.backgroundImage }}
          >
            <div className="forminput">
              <div className="forminputcolumn">
                <label>
                  <b>Từ ngày:</b>
                  <input type="date" {...register("fromdate")}></input>
                </label>
                <label>
                  <b>Tới ngày:</b>
                  <input type="date" {...register("todate")}></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Code KD:</b>
                  <input
                    type="text"
                    placeholder="GH63-xxxxxx"
                    {...register("codeKD")}
                  ></input>
                </label>
                <label>
                  <b>Code ERP:</b>
                  <input
                    type="text"
                    placeholder="7C123xxx"
                    {...register("codeCMS")}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Tên Liệu:</b>
                  <input
                    type="text"
                    placeholder="SJ-203020HC"
                    {...register("m_name")}
                  ></input>
                </label>
                <label>
                  <b>Tên khách hàng:</b>
                  <input
                    type="text"
                    placeholder="SEVT"
                    {...register("cust_name")}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>All Time:</b>
                  <input type="checkbox" {...register("alltime")}></input>
                </label>
              </div>
            </div>
            <div className="formbutton">
              <Button
                color={"primary"}
                variant="contained"
                size="small"
                fullWidth={true}
                sx={{
                  fontSize: "0.7rem",
                  padding: "3px",
                  backgroundColor: "#36D334",
                }}
                onClick={() => {
                  checkBP(
                    userData,
                    ["KD"],
                    ["ALL"],
                    ["ALL"],
                    loadDeletedPriceHistory,
                  );
                }}
              >
                Tra cứu
              </Button>
            </div>
          </div>
        )}
        <div className="tracuuYCSXTable">{deletedHistoryTable}</div>
      </div>
    </div>
  );
};

export default QuotationDeleteHistory;

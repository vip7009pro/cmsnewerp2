import { Button, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./BTP_AUTO.scss";
import {
  BTP_AUTO_DATA,
  BTP_AUTO_DATA2,
  BTP_AUTO_DATA_SUMMARY,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { BiLoader } from "react-icons/bi";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";
import {
  f_load_BTP_Auto,
  f_load_BTP_Summary_Auto,
  f_updateBTP_M100,
} from "../../../api/GlobalFunction";
import moment from "moment";
const BTP_AUTO = () => {
  const [showGiaoNhan, setShowGiaoNhan] = useState(false);
  const columns_btp = [
    { field: "PROD_REQUEST_NO", headerName: "YCSX", width: 50 },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 80 },
    /* { field: "EQUIPMENT_CD", headerName: "START_EQ", width: 60 }, */
    /*    { field: "MACHINE", headerName: "EQ_SERIES", width: 60 }, */
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 60 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 70 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 100 },
    { field: "TEMP_QTY", headerName: "TEMP_QTY", width: 60, type: "number" },
    /* { field: "LOT_STATUS", headerName: "LOT_STT", width: 50 },
    { field: "USE_YN", headerName: "USE_YN", width: 40 }, */
    /*     { field: "REMAIN_QTY", headerName: "REMAIN_QTY (M)", width: 90, type: 'number' }, */
    /*     { field: "USE_YN", headerName: "USE_YN", width: 40 },
    { field: "PR_NB", headerName: "PR_NB", width: 40, type: 'number' }, */
    /*     { field: "BTP_REMAIN_EA", headerName: "REMAIN_QTY (EA)", width: 90, type: 'number' }, */
    /*     { field: "EQ_NAME", headerName: "REMAIN_EQ", width: 150 },
     */
    /* { field: "NEXT_EQ", headerName: "NEXT_EQ", width: 60 }, */
    {
      field: "FINAL_BTP",
      headerName: "FINAL_BTP",
      width: 60,
      type: "number",
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    /*  { field: "FINAL_PR_NB", headerName: "FINAL_PR_NB", width: 80, type: 'number' }, */
    /*     { field: "BTP_LOCATION", headerName: "BTP_LOCATION", width: 150 }, */
    /*     { field: "FINAL_MACHINE", headerName: "FINAL_MACHINE", width: 150 }, */
    { field: "FINAL_LOCATION", headerName: "FINAL_LOCATION", width: 90 },
    { field: "FINAL_FACTORY", headerName: "FINAL_FACTORY", width: 90 },
    { field: "FINAL_XUONG", headerName: "FINAL_XUONG", width: 90 },
    /*  { field: "XUONG", headerName: "XUONG", width: 50 }, */
    { field: "INS_DATE", headerName: "PROD_DATE", width: 90 },
  ];
  const columns_btp_auto_2 = [
    { field: "INS_DATE", headerName: "PROD_DATE", width: 100 },
    { field: "FACTORY", headerName: "FACTORY", width: 50 },
    { field: "XUONG", headerName: "XUONG", width: 50 },
    { field: "EQ_NAME", headerName: "EQ_NAME", width: 50 },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 60 },
    { field: "UNIT", headerName: "UNIT", width: 50 },
    { field: "PROD_REQUEST_NO", headerName: "YCSX_NO", width: 60 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 50 },
    { field: "PROCESS_NUMBER", headerName: "CD", width: 30, type: "number" },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 60 },
    { field: "PROCESS_LOT_NO", headerName: "LOTSX", width: 60 },
    { field: "REMAIN_QTY_M", headerName: "TON_MET", width: 50, type: "number" },
    {
      field: "TEMP_QTY_EA",
      headerName: "TON_EA",
      width: 50,
      type: "number",
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    { field: "FINAL_FACTORY", headerName: "FINAL_FACTORY", width: 80 },
    { field: "FINAL_XUONG", headerName: "FINAL_XUONG", width: 70 },
    { field: "PHAN_LOAI", headerName: "PHAN_LOAI", width: 70 },
    { field: "USE_YN", headerName: "USE_YN", width: 60 },
    { field: "PD", headerName: "PD", width: 50, type: "number" },
    { field: "CAVITY", headerName: "CAVITY", width: 60, type: "number" },
    { field: "TRANS_LOT_NO", headerName: "TRANS_LOT_NO", width: 90 },
  ];

  const columns_btp2 = [
    { field: "PROD_REQUEST_NO", headerName: "YCSX", width: 50 },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 50 },
    { field: "EQUIPMENT_CD", headerName: "START_EQ", width: 60 },
    { field: "MACHINE", headerName: "EQ_SERIES", width: 60 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 60 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 70 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 100 },
    { field: "TEMP_QTY", headerName: "TEMP_QTY", width: 60, type: "number" },
    { field: "LOT_STATUS", headerName: "LOT_STT", width: 50 },
    { field: "USE_YN", headerName: "USE_YN", width: 40 },
    /*     { field: "REMAIN_QTY", headerName: "REMAIN_QTY (M)", width: 90, type: 'number' }, */
    /*     { field: "USE_YN", headerName: "USE_YN", width: 40 },
    { field: "PR_NB", headerName: "PR_NB", width: 40, type: 'number' }, */
    /*     { field: "BTP_REMAIN_EA", headerName: "REMAIN_QTY (EA)", width: 90, type: 'number' }, */
    /*     { field: "EQ_NAME", headerName: "REMAIN_EQ", width: 150 },
     */
    { field: "NEXT_EQ", headerName: "NEXT_EQ", width: 60 },
    {
      field: "FINAL_BTP",
      headerName: "FINAL_BTP",
      width: 60,
      type: "number",
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "FINAL_PR_NB",
      headerName: "FINAL_PR_NB",
      width: 80,
      type: "number",
    },
    /*     { field: "BTP_LOCATION", headerName: "BTP_LOCATION", width: 150 }, */
    /*     { field: "FINAL_MACHINE", headerName: "FINAL_MACHINE", width: 150 }, */
    { field: "FINAL_LOCATION", headerName: "FINAL_LOCATION", width: 90 },
    { field: "XUONG", headerName: "XUONG", width: 50 },
    { field: "INS_DATE", headerName: "PROD_DATE", width: 90 },
  ];
  const columns_btp_summary = [
    { field: "id", headerName: "STT", width: 30 },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    {
      field: "XA",
      headerName: "XA",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "XB",
      headerName: "XB",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "TOTAL_BTP",
      headerName: "TOTAL_BTP",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(columns_btp_auto_2);
  const [btpData, setBTPData] = useState<Array<any>>([]);
  const handleLoadBTPAutoData = async () => {
    await f_updateBTP_M100();
    let kq: BTP_AUTO_DATA2[] = [];
    kq = await f_load_BTP_Auto();
    setBTPData(
      kq.map((ele: BTP_AUTO_DATA2, index: number) => {
        return {
          ...ele,
          INS_DATE: ele.INS_DATE !== null ? moment.utc(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          id: index,
        };
      })
    );
    Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
  const handleLoadBTPSummaryData = async () => {
    await f_updateBTP_M100();
    let kq: BTP_AUTO_DATA_SUMMARY[] = [];
    kq = await f_load_BTP_Summary_Auto();
    setBTPData(
      kq.map((ele: BTP_AUTO_DATA_SUMMARY, index: number) => {
        return {
          ...ele,
          id: index,
        };
      })
    );
    Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
  const btpDataAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_btp_auto_2);
                handleLoadBTPAutoData();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Detail
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_btp_summary);
                handleLoadBTPSummaryData();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Summary
            </IconButton>
          </div>
        }
        columns={columnDefinition}
        data={btpData}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }}
        onRowClick={(e) => {
          //console.log(e.data)
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [btpData, columnDefinition, columns_btp_auto_2, columns_btp_summary]);
  useEffect(() => {
    //handleLoadDefectProcessData();
    //handleLoadBTPAutoData();
  }, []);
  return (
    <div className="maindefects">
      <div className="tracuuDataPqc">
        {/* <div className="tracuuDataPQCform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Phân Loại:</b>
                <select
                  name="phanloai"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="CTF">CTF</option>
                  <option value="CTP">CTP</option>
                  <option value="PVC">PVC</option>
                  <option value="PINACLE">PINACLE</option>
                </select>
              </label>
              <label>
                <b>Nhà máy:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>PLAN_ID:</b>{" "}
                <input
                  type="text"
                  placeholder="1F80008A"
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                ></input>
              </label>
              <label>
                <b>ID:</b>{" "}
                <input
                  type="text"
                  placeholder="12345"
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>All Time:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00a54a' }} onClick={() => {
                setColumnDefinition(columns_btp);
                handleLoadBTPAutoData();
              }}>Load Data</Button>              
            </div>
          </div>
        </div> */}
        <div className="tracuuPQCTable">{btpDataAG}</div>
      </div>
      {showGiaoNhan && (
        <div className="updatenndsform">
          <Button
            color={"primary"}
            variant="contained"
            size="small"
            fullWidth={false}
            sx={{
              fontSize: "0.7rem",
              padding: "3px",
              backgroundColor: "#69b1f5f",
            }}
            onClick={() => {
              setShowGiaoNhan(false);
            }}
          >
            Close
          </Button>
          <QLGN />
        </div>
      )}
    </div>
  );
};
export default BTP_AUTO;

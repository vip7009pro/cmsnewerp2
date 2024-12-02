import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import "./MAINDEFECTS.scss";
import { DAO_FILM_DATA, DEFECT_PROCESS_DATA, QUANLYDAOFILM_DATA, XUATDAOFILM_DATA } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { BiAddToQueue, BiLogIn } from "react-icons/bi";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { f_loadDefectProcessData } from "../../../api/GlobalFunction";
const MAINDEFECTS = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showGiaoNhan, setShowGiaoNhan] = useState(false);
  const [btnGN_QL, setBtnGN_QL] = useState(true);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [planId, setPlanId] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [type, setType] = useState("All");
  const [factory, setFactory] = useState("All");
  const column_defect_data = [
    { field: "NG_SX100_ID", headerName: "ID", width: 50 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 100 },
    { field: "G_CODE", headerName: "G_CODE", width: 70 },
    { field: "G_NAME", headerName: "G_NAME", width: 100 },
    { field: "DESCR", headerName: "DESCR", width: 150 },
    { field: "PROCESS_NUMBER", headerName: "PROCESS_NUMBER", width: 100 },
    { field: "STT", headerName: "STT", width: 50 },
    { field: "DEFECT", headerName: "DEFECT", width: 150 },
    { field: "TEST_ITEM", headerName: "TEST_ITEM", width: 150 },
    { field: "TEST_METHOD", headerName: "TEST_METHOD", width: 150 },
    { field: "INS_PATROL_ID", headerName: "INS_PATROL_ID", width: 90, cellRenderer: (params: any) => {
      return (
        <img 
          src={'/INS_PATROL/INS_PATROL_'+params.data.INS_PATROL_ID+'.png'} 
          alt={params.data.G_CODE}
          style={{width: '30px', height: '20px', cursor: 'pointer'}}
          onClick={() => {
            Swal.fire({
              imageUrl: '/INS_PATROL/INS_PATROL_'+params.data.INS_PATROL_ID+'.png',
              imageWidth: 600,              
              imageAlt: params.data.G_CODE,
            });
          }}
        />
      )
    } },
    { field: "USE_YN", headerName: "USE_YN", width: 80,  },
    { field: "IMAGE_YN", headerName: "IMAGE_YN", width: 60, cellRenderer: (params: any) => {
      return (
        <img           
          src={'/sxng100/SX100_'+params.data.NG_SX100_ID+'.png'} 
          alt={params.data.G_CODE}
          style={{width: '30px', height: '20px', cursor: 'pointer'}}
          onClick={() => {
            Swal.fire({
              imageUrl: '/sxng100/SX100_'+params.data.NG_SX100_ID+'.png',
              imageWidth: 600,              
              imageAlt: params.data.G_CODE,
            });
          }}
        />
      )
    }},
    { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 70 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 100 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 70 }
  ]
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_defect_data);
  const [defectProcessData, setDefectProcessData] = useState<Array<DEFECT_PROCESS_DATA>>([]);
  
  const handleLoadDefectProcessData = async () => {
    let kq: DEFECT_PROCESS_DATA[] = []; 
    kq = await f_loadDefectProcessData('', -1);
    setDefectProcessData(kq.map((ele: DEFECT_PROCESS_DATA) => {
      return {
        ...ele,
        INS_DATE: ele.INS_DATE !== null ? moment(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
        UPD_DATE: ele.UPD_DATE !== null ? moment(ele.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : ""
      }
    }));
  } 
  const daofilmAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            {btnGN_QL && <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowGiaoNhan(true);
              }}
            >
              <BiAddToQueue color="red" size={15} />
              Thêm Giao Nhận
            </IconButton>}
            {btnGN_QL && <IconButton
              className="buttonIcon"
              onClick={() => {
              }}
            >
              <BiAddToQueue color="#0ecb8c" size={15} />
              Gán Code
            </IconButton>}
            {!btnGN_QL && <IconButton
              className="buttonIcon"
              onClick={() => {
              }}
            >
              <BiLogIn color="#f92baa" size={15} />
              Xuất Dao Film
            </IconButton>}
          </div>}
        columns={column_defect_data}
        data={defectProcessData}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  }, [defectProcessData, columnDefinition]);
  useEffect(() => {
    handleLoadDefectProcessData();
  }, []);
  return (
    <div className="maindefects">
      <div className="tracuuDataPqc">
        <div className="tracuuDataPQCform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
                setColumnDefinition(column_defect_data);
                handleLoadDefectProcessData();
              }}>Load Data</Button>              
            </div>
          </div>
        </div>
        <div className="tracuuPQCTable">
          {daofilmAGTable}
        </div>
      </div>
      {
        showGiaoNhan && <div className="updatenndsform">
          <Button color={'primary'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#69b1f5f' }} onClick={() => {
            setShowGiaoNhan(false);
          }}>Close</Button>
          <QLGN />
        </div>
      }
    </div>
  );
};
export default MAINDEFECTS;

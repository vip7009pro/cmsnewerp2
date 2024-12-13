import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import "./DAOFILMDATA.scss";
import { DAO_FILM_DATA, QUANLYDAOFILM_DATA, XUATDAOFILM_DATA } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { BiAddToQueue, BiLogIn } from "react-icons/bi";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const DAOFILMDATA = () => {
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
  const [daofilmdatatable, setDaoFilmDataTable] = useState<Array<any>>([]);
  const column_daofilm_data = [
    { field: "KNIFE_FILM_ID", headerName: "ID", width: 50 },
    { field: "FACTORY_NAME", headerName: "FACTORY", width: 50 },
    { field: "NGAYBANGIAO", headerName: "NGAYBANGIAO", width: 100, },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
    {
      field: "LOAIBANGIAO_PDP",
      headerName: "LOAIBANGIAO",
      width: 80,
      cellRenderer: (params: any) => {
        switch (params.data.LOAIBANGIAO_PDP) {
          case "D":
            return <span style={{ color: "blue" }}>DAO</span>;
            break;
          case "F":
            return <span style={{ color: "blue" }}>FILM</span>;
            break;
          case "T":
            return <span style={{ color: "blue" }}>TAI LIEU</span>;
            break;
          default:
            return <span style={{ color: "blue" }}>N/A</span>;
            break;
        }
      },
    },
    {
      field: "LOAIPHATHANH",
      headerName: "LOAIPHATHANH",
      width: 110,
      cellRenderer: (params: any) => {
        switch (params.data.LOAIPHATHANH) {
          case "PH":
            return <span style={{ color: "blue" }}>PHAT HANH</span>;
            break;
          case "TH":
            return <span style={{ color: "blue" }}>THU HOI</span>;
            break;
          default:
            return <span style={{ color: "blue" }}>N/A</span>;
            break;
        }
      },
    },
    { field: "SOLUONG", headerName: "SOLUONG", width: 60 },
    { field: "SOLUONGOHP", headerName: "SOLUONGOHP", width: 80 },
    { field: "LYDOBANGIAO", headerName: "LYDOBANGIAO", width: 80 },
    { field: "PQC_EMPL_NO", headerName: "PQC_EMPL_NO", width: 80 },
    { field: "RND_EMPL_NO", headerName: "RND_EMPL_NO", width: 80 },
    { field: "SX_EMPL_NO", headerName: "SX_EMPL_NO", width: 80 },
    { field: "MA_DAO", headerName: "MA_DAO", width: 100 },
    { field: "CFM_GIAONHAN", headerName: "CFM_GIAONHAN", width: 100 },
    { field: "CFM_INS_EMPL", headerName: "CFM_INS_EMPL", width: 100 },
    { field: "CFM_DATE", headerName: "CFM_DATE", width: 100 },
    { field: "KNIFE_TYPE", headerName: "KNIFE_TYPE", width: 100 },
    {
      field: "KNIFE_FILM_STATUS", headerName: "KNIFE_FILM_STATUS", width: 100, cellRenderer: (params: any) => {
        if (params.data.KNIFE_FILM_STATUS === 'OK') {
          return (
            <div style={{ color: "black", width: '100%', backgroundColor: 'greenyellow' }}>
              {params.data.KNIFE_FILM_STATUS}
            </div>
          )
        }
        else if (params.data.KNIFE_FILM_STATUS === 'OK') {
          return (
            <div style={{ color: "white", width: '100%', backgroundColor: 'red' }}>
              {params.data.KNIFE_FILM_STATUS}
            </div>
          );
        }
      },
    },
    { field: "G_WIDTH", headerName: "G_WIDTH", width: 100 },
    { field: "G_LENGTH", headerName: "G_LENGTH", width: 100 },
    { field: "VENDOR", headerName: "VENDOR", width: 100 },
    {
      field: "TOTAL_PRESS", headerName: "TOTAL_PRESS", width: 100, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TOTAL_PRESS?.toLocaleString('en-US')}
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 150 },
  ];
  const column_quanlydaofilm_data = [
    { field: 'KNIFE_FILM_ID', headerName: 'DF_ID', resizable: true, width: 60 },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 60 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 80 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80 },
    { field: 'KNIFE_TYPE', headerName: 'TYPE', resizable: true, width: 50 },
    { field: 'KNIFE_FILM_STEP', headerName: 'STEP', resizable: true, width: 50 },
    { field: 'KNIFE_FILM_QTY', headerName: 'DF_QTY', resizable: true, width: 50 },
    { field: 'FULL_KNIFE_CODE', headerName: 'MA_DAO', resizable: true, width: 80 },
    { field: 'KT_KNIFE_CODE', headerName: 'MA_DAO_KT', resizable: true, width: 80 },
    { field: 'KNIFE_BOX_NUMBER', headerName: 'BOX_NUMBER', resizable: true, width: 80 },
    { field: 'CAVITY_NGANG', headerName: 'CAVITY_NGANG', resizable: true, width: 80 },
    { field: 'CAVITY_DOC', headerName: 'CAVITY_DOC', resizable: true, width: 80 },
    { field: 'PD', headerName: 'PD', resizable: true, width: 50 },
    { field: 'BOGOC', headerName: 'BOGOC', resizable: true, width: 50 },
    { field: 'SONG_GIUA', headerName: 'SONG_GIUA', resizable: true, width: 50 },
    {
      field: 'KNIFE_STATUS', headerName: 'STATUS', resizable: true, width: 50, cellRenderer: (params: any) => {
        if (params.data.KNIFE_STATUS === 'OK') {
          return (
            <div style={{ color: "black", width: '100%', backgroundColor: 'greenyellow' }}>
              {params.data.KNIFE_STATUS}
            </div>
          )
        }
        else {
          return (
            <div style={{ color: "white", width: '100%', backgroundColor: 'red' }}>
              {params.data.KNIFE_STATUS}
            </div>
          );
        }
      },
    },
    {
      field: 'STANDARD_PRESS_QTY', headerName: 'STANDARD_PRESS', resizable: true, width: 80, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.STANDARD_PRESS_QTY?.toLocaleString('en-US')}
          </span>
        );
      },
    },
    {
      field: 'TOTAL_PRESS', headerName: 'TOTAL_PRESS', resizable: true, width: 80, cellRenderer: (params: any) => {
        if (params.data.TOTAL_PRESS > params.data.STANDARD_PRESS_QTY) {
          return (
            <span style={{ color: "red" }}>
              {params.data.TOTAL_PRESS?.toLocaleString('en-US')}
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              {params.data.TOTAL_PRESS?.toLocaleString('en-US')}
            </span>
          );
        }
      },
    },
    { field: 'FACTORY_NAME', headerName: 'FACTORY_NAME', resizable: true, width: 80 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', resizable: true, width: 80 },
    { field: 'PROD_TYPE', headerName: 'PROD_TYPE', resizable: true, width: 80 },
    { field: 'REV_NO', headerName: 'REV_NO', resizable: true, width: 80 },
    { field: 'VENDOR', headerName: 'VENDOR', resizable: true, width: 80 },
    { field: 'INS_DATE', headerName: 'INS_DATE', resizable: true, width: 80 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', resizable: true, width: 80 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', resizable: true, width: 80 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 80 },
    { field: 'KNIFE_FILM_NO', headerName: 'KNIFE_FILM_NO', resizable: true, width: 80 },
    { field: 'KNIFE_FILM_SEQ', headerName: 'KNIFE_FILM_SEQ', resizable: true, width: 80 },
    { field: 'KCTD', headerName: 'KCTD', resizable: true, width: 80 },
  ]
  const column_lichsuxuatdaofilm = [
    { field: 'INS_DATE', headerName: 'INS_DATE', resizable: true, width: 100 },
    { field: 'PLAN_DATE', headerName: 'PLAN_DATE', resizable: true, width: 80 },
    { field: 'CA_LAM_VIEC', headerName: 'CA', resizable: true, width: 40 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', resizable: true, width: 50 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 100 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 70 },
    { field: 'KNIFE_FILM_NO', headerName: 'KNIFE_FILM_NO', resizable: true, width: 100 },
    { field: 'QTY_KNIFE_FILM', headerName: 'QTY', resizable: true, width: 50 },
    { field: 'CAVITY', headerName: 'CAVITY', resizable: true, width: 100 },
    { field: 'PD', headerName: 'PD', resizable: true, width: 100 },
    { field: 'EQ_THUC_TE', headerName: 'EQ', resizable: true, width: 40 },
    {
      field: 'PRESS_QTY', headerName: 'PRESS_QTY', resizable: true, width: 70, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.PRESS_QTY?.toLocaleString('en-US')}
          </span>
        );
      },
    },
    { field: 'EMPL_NO', headerName: 'EMPL_NO', resizable: true, width: 70 },
    {
      field: 'LOAIBANGIAO_PDP', headerName: 'PHANLOAI', resizable: true, width: 60, cellRenderer: (params: any) => {
        switch (params.data.LOAIBANGIAO_PDP) {
          case "D":
            return <span style={{ color: "blue" }}>DAO</span>;
            break;
          case "F":
            return <span style={{ color: "blue" }}>FILM</span>;
            break;
          case "T":
            return <span style={{ color: "blue" }}>TAI LIEU</span>;
            break;
          default:
            return <span style={{ color: "blue" }}>N/A</span>;
            break;
        }
      },
    },
    { field: 'F_WIDTH', headerName: 'F_WIDTH', resizable: true, width: 70 },
    { field: 'F_LENGTH', headerName: 'F_LENGTH', resizable: true, width: 70 },
    { field: 'INS_EMPL', headerName: 'DF_EMPL', resizable: true, width: 70 },
    { field: 'SX_EMPL_NO', headerName: 'SX_EMPL', resizable: true, width: 70 },
    { field: 'SX_DATE', headerName: 'SX_DATE', resizable: true, width: 60 },
  ]
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_daofilm_data);
  const handletraGiaoNhanDaoFilm = () => {
    setBtnGN_QL(true);
    generalQuery("tradaofilm", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DAO_FILM_DATA[] = response.data.data.map(
            (element: DAO_FILM_DATA, index: number) => {
              return {
                ...element,
                NGAYBANGIAO: moment.utc(element.NGAYBANGIAO).format('YYYY-MM-DD'),
                CFM_DATE: element.CFM_DATE !== null ? moment.utc(element.CFM_DATE).format('YYYY-MM-DD HH:mm:ss') : '',
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setDaoFilmDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handletraQuanLyDaoFilm = () => {
    setBtnGN_QL(true);
    generalQuery("loadquanlydaofilm", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      FACTORY: factory,
      KNIFE_TYPE: type,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: QUANLYDAOFILM_DATA[] = response.data.data.map(
            (element: QUANLYDAOFILM_DATA, index: number) => {
              return {
                ...element,
                INS_DATE: moment.utc(element.INS_DATE).format('YYYY-MM-DD HH:mm:ss'),
                UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format('YYYY-MM-DD HH:mm:ss') : '',
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setDaoFilmDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handletraLichSuXuatDaoFilm = () => {
    setBtnGN_QL(false);
    generalQuery("lichsuxuatdaofilm", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      FACTORY: factory,
      PLAN_ID: planId
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: XUATDAOFILM_DATA[] = response.data.data.map(
            (element: XUATDAOFILM_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: element.PLAN_DATE !== null ? moment.utc(element.PLAN_DATE).format('YYYY-MM-DD') : '',
                INS_DATE: element.INS_DATE !== null ? moment.utc(element.INS_DATE).format('YYYY-MM-DD HH:mm:ss') : '',
                SX_DATE: element.SX_DATE !== null ? moment.utc(element.SX_DATE).format('YYYY-MM-DD') : '',
                UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format('YYYY-MM-DD HH:mm:ss') : '',
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setDaoFilmDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        columns={columnDefinition}
        data={daofilmdatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  }, [daofilmdatatable, columnDefinition])
  useEffect(() => {
  }, []);
  return (
    <div className="daofilmdata">
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
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f396fc' }} onClick={() => {
                setColumnDefinition(column_daofilm_data);
                handletraGiaoNhanDaoFilm();
              }}>LS GIAO NHẬN</Button>
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#9ddd49', color: 'black' }} onClick={() => {
                setColumnDefinition(column_quanlydaofilm_data);
                handletraQuanLyDaoFilm();
              }}>QL DAO FILM</Button>
            </div>
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#69b1f5f' }} onClick={() => {
                setColumnDefinition(column_lichsuxuatdaofilm);
                handletraLichSuXuatDaoFilm();
              }}>LS XUẤT DF</Button>
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
export default DAOFILMDATA;

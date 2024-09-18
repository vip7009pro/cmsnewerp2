import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { CPK_DATA, DTC_DATA, HISTOGRAM_DATA, XBAR_DATA } from "../../../api/GlobalInterface";
import "./KQDTC.scss";
import AGTable from "../../../components/DataTable/AGTable";
import XBAR_CHART from "../../../components/Chart/DTC/XBAR_CHART";
import R_CHART from "../../../components/Chart/DTC/R_CHART";
import CPK_CHART from "../../../components/Chart/DTC/CPK_CHART";
import HISTOGRAM_CHART from "../../../components/Chart/DTC/HISTOGRAM_CHART";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const KQDTC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [readyRender, setReadyRender] = useState(false);
  const isLoading = useRef<boolean>(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [testname, setTestName] = useState("0");
  const [testtype, setTestType] = useState("0");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const column_dtc_data = [
    { field: "DTC_ID", headerName: "DTC_ID", width: 80 },
    { field: "PROD_REQUEST_NO", headerName: "YCSX", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 200,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE !== "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    {
      field: "M_CODE",
      headerName: "M_CODE",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE === "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.M_CODE}</b>
          </span>
        );
      },
    },
    {
      field: "M_NAME",
      headerName: "TEN LIEU",
      width: 150,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE === "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.M_NAME}</b>
          </span>
        );
      },
    },
    { field: "TEST_NAME", headerName: "TEST_NAME", width: 80 },
    { field: "POINT_CODE", headerName: "POINT_CODE", width: 90 },
    {
      field: "CENTER_VALUE",
      headerName: "CENTER_VALUE",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.CENTER_VALUE}</b>
          </span>
        );
      },
    },
    {
      field: "UPPER_TOR",
      headerName: "UPPER_TOR",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.UPPER_TOR}</b>
          </span>
        );
      },
    },
    {
      field: "LOWER_TOR",
      headerName: "LOWER_TOR",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.LOWER_TOR}</b>
          </span>
        );
      },
    },
    { field: "RESULT", headerName: "RESULT", width: 80 },
    {
      field: "DANHGIA",
      headerName: "DANH_GIA",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.DANHGIA == 'OK')
          return (
            <span style={{ color: "green" }}>
              <b>OK</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>NG</b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 80 },
    { field: "BARCODE_CONTENT", headerName: "BARCODE_CONTENT", width: 120 },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "TEST_FINISH_TIME", headerName: "TEST_FINISH_TIME", width: 145 },
    { field: "TEST_EMPL_NO", headerName: "NV TEST", width: 100 },
    { field: "TEST_TYPE_NAME", headerName: "TEST_TYPE_NAME", width: 140 },
    { field: "WORK_POSITION_NAME", headerName: "BO PHAN", width: 80 },
    { field: "SAMPLE_NO", headerName: "SAMPLE_NO", width: 80 },
    { field: "REQUEST_DATETIME", headerName: "NGAY YC", width: 145 },
    { field: "REQUEST_EMPL_NO", headerName: "NV YC", width: 80 },
    { field: "SIZE", headerName: "SIZE", width: 80 },
    { field: "LOTCMS", headerName: "LOTCMS", width: 80 },
    { field: "TEST_CODE", headerName: "TEST_CODE", width: 80 },
    { field: "TDS", headerName: "TDS", width: 80 },
    { field: "TDS_EMPL", headerName: "TDS_EMPL", width: 80 },
    { field: "TDS_UPD_DATE", headerName: "TDS_UPD_DATE", width: 80 },
  ];
  const [xbar, setXbar] = useState<XBAR_DATA[]>([]);
  const [cpk, setCPK] = useState<CPK_DATA[]>([]);
  const [histogram, setHistogram] = useState<HISTOGRAM_DATA[]>([]);
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_dtc_data);
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handletraDTCData();
    }
  };
  const [selectedData, setSelectedData] = useState<any>(null);
  const getXbar = async (DATA: any) => {
    await generalQuery("loadXbarData", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: DATA.G_CODE,
      G_NAME: codeKD,
      M_NAME: DATA.M_NAME,
      M_CODE: DATA.M_CODE,
      TEST_CODE: DATA.TEST_CODE,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,
      POINT_CODE: DATA.POINT_CODE,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let totalXBAR: number = 0, totalR: number = 0, cnt: number = 0, avgXBAR: number = 0, avgR: number = 0;
          for (let i = 0; i < response.data.data.length; i++) {
            totalXBAR += response.data.data[i].AVG_VALUE;
            totalR += response.data.data[i].R_VALUE;
          }
          cnt = response.data.data.length;
          avgXBAR = totalXBAR / cnt;
          avgR = totalR / cnt;
          const loadeddata: XBAR_DATA[] = response.data.data.map(
            (element: XBAR_DATA, index: number) => {
              return {
                ...element,
                X_UCL: avgXBAR + avgR * 0.577,
                X_CL: avgXBAR,
                X_LCL: avgXBAR - avgR * 0.577,
                R_UCL: avgR * 0,
                R_CL: avgR,
                R_LCL: avgR * 2.114,
                id: index,
              };
            }
          );
          //console.log(loadeddata)
          setXbar(loadeddata);
        } else {
          setXbar([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const getCPK = async (DATA: any) => {
    await generalQuery("loadCPKTrend", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: DATA.G_CODE,
      G_NAME: codeKD,
      M_NAME: DATA.M_NAME,
      M_CODE: DATA.M_CODE,
      TEST_CODE: DATA.TEST_CODE,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,
      POINT_CODE: DATA.POINT_CODE,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CPK_DATA[] = response.data.data.map(
            (element: CPK_DATA, index: number) => {
              return {
                ...element,
                CPK1: 1.33,
                CPK2: 1.67,
                id: index,
              };
            }
          );
          //console.log(loadeddata)
          setCPK(loadeddata);
        } else {
          setCPK([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const getHistogram = async (DATA: any) => {
    await generalQuery("loadHistogram", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: DATA.G_CODE,
      G_NAME: codeKD,
      M_NAME: DATA.M_NAME,
      M_CODE: DATA.M_CODE,
      TEST_CODE: DATA.TEST_CODE,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,
      POINT_CODE: DATA.POINT_CODE,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: HISTOGRAM_DATA[] = response.data.data.map(
            (element: HISTOGRAM_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          //console.log(loadeddata)
          setHistogram(loadeddata);
        } else {
          setHistogram([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handletraDTCData = () => {
    generalQuery("dtcdata", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      M_NAME: m_name,
      M_CODE: m_code,
      TEST_NAME: testname,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,
      ID: id,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_DATA[] = response.data.data.map(
            (element: DTC_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                TEST_FINISH_TIME: moment
                  .utc(element.TEST_FINISH_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                REQUEST_DATETIME: moment
                  .utc(element.REQUEST_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                DANHGIA: (
                  element.RESULT >= element.CENTER_VALUE - element.LOWER_TOR &&
                  element.RESULT <= element.CENTER_VALUE + element.UPPER_TOR
                ) ? 'OK' : 'NG',
                id: index,
              };
            }
          );
          setInspectionDataTable(loadeddata);
          setReadyRender(true);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const kqdtcDataTableAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
          </div>}
        columns={columnDefinition}
        data={inspectiondatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          /* setSelectedData(e.data)
          if (isLoading.current === false) {
            isLoading.current = true;
            Promise.all([getXbar(e.data), getCPK(e.data), getHistogram(e.data)]).then((value) => {
              isLoading.current = false;
            })
          }
          else {
            Swal.fire('Thông báo', 'Data chưa load xong, bấm từ từ thôi', 'error')
          } */
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
        onRowDoubleClick={async (e) => {
          Swal.fire({
            title: "Loading data",
            text: "Đang tải dữ liệu, hãy chờ chút",
            icon: "info",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonText: "OK",
            showConfirmButton: false,
          });
          setSelectedData(e.data)
          if (isLoading.current === false) {
            isLoading.current = true;
            await Promise.all([getXbar(e.data), getCPK(e.data), getHistogram(e.data)]).then(() => {
              isLoading.current = false;
              Swal.fire('Thông báo', 'Data loaded', 'success')
            })
          }
          else {
            Swal.fire('Thông báo', 'Data chưa load xong, bấm từ từ thôi', 'error')
          }
          //console.log(e.data)
        }}
      />
    )
  }, [inspectiondatatable, columnDefinition, isLoading.current])
  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='kqdtc'>
      <div className='tracuuDataInspectionform' style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <div className='forminput'>
          <div className='forminputcolumn'>
            <label>
              <b>Từ ngày:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={fromdate.slice(0, 10)}
                onChange={(e) => setFromDate(e.target.value)}
              ></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={todate.slice(0, 10)}
                onChange={(e) => setToDate(e.target.value)}
              ></input>
            </label>
          </div>
          <div className='forminputcolumn'>
            <label>
              <b>Code KD:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='text'
                placeholder='GH63-xxxxxx'
                value={codeKD}
                onChange={(e) => setCodeKD(e.target.value)}
              ></input>
            </label>
            <label>
              <b>Code ERP:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='text'
                placeholder='7C123xxx'
                value={codeCMS}
                onChange={(e) => setCodeCMS(e.target.value)}
              ></input>
            </label>
          </div>
          <div className='forminputcolumn'>
            <label>
              <b>Tên Liệu:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='text'
                placeholder='SJ-203020HC'
                value={m_name}
                onChange={(e) => setM_Name(e.target.value)}
              ></input>
            </label>
            <label>
              <b>Mã Liệu CMS:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='text'
                placeholder='A123456'
                value={m_code}
                onChange={(e) => setM_Code(e.target.value)}
              ></input>
            </label>
          </div>
          <div className='forminputcolumn'>
            <label>
              <b>Hạng mục test</b>
              <select
                name='hangmuctest'
                value={testname}
                onChange={(e) => {
                  setTestName(e.target.value);
                }}
              >
                <option value='0'>ALL</option>
                <option value='1'>Kích thước</option>
                <option value='2'>Kéo keo</option>
                <option value='3'>XRF</option>
                <option value='4'>Điện trở</option>
                <option value='5'>Tĩnh điện</option>
                <option value='6'>Độ bóng</option>
                <option value='7'>Phtalate</option>
                <option value='8'>FTIR</option>
                <option value='9'>Mài mòn</option>
                <option value='10'>Màu sắc</option>
                <option value='11'>TVOC</option>
                <option value='12'>Cân nặng</option>
                <option value='13'>Scanbarcode</option>
                <option value='14'>Nhiệt cao Ẩm cao</option>
                <option value='15'>Shock nhiệt</option>
                <option value='1002'>Kéo keo 2</option>
                <option value='1003'>Ngoại quan</option>
                <option value='1005'>Độ dày</option>
              </select>
            </label>
            <label>
              <b>Số YCSX:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='text'
                placeholder='1H23456'
                value={prodrequestno}
                onChange={(e) => setProdRequestNo(e.target.value)}
              ></input>
            </label>
          </div>
          <div className='forminputcolumn'>
            <label>
              <b>Phân loại test</b>
              <select
                name='phanloaihang'
                value={testtype}
                onChange={(e) => {
                  setTestType(e.target.value);
                }}
              >
                <option value='0'>ALL</option>
                <option value='1'>FIRST_LOT</option>
                <option value='2'>ECN</option>
                <option value='3'>MASS PRODUCTION</option>
                <option value='4'>SAMPLE</option>
              </select>
            </label>
            <label>
              <b>DTC ID:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='text'
                placeholder='12345'
                value={id}
                onChange={(e) => setID(e.target.value)}
              ></input>
            </label>
          </div>
        </div>
        <div className='formbutton'>
          <label>
            <b>All Time:</b>
            <input
              onKeyDown={(e) => {
                handleSearchCodeKeyDown(e);
              }}
              type='checkbox'
              name='alltimecheckbox'
              defaultChecked={alltime}
              onChange={() => setAllTime(!alltime)}
            ></input>
          </label>
          <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#36D334', color: 'white' }} onClick={() => {
            setReadyRender(false);
            setColumnDefinition(column_dtc_data);
            handletraDTCData();
          }}>DATA ĐTC</Button>
        </div>
      </div>
      <div className='tracuuYCSXTable'>
        {kqdtcDataTableAG}
        <div className="pointInfomation"><span>Sản phẩm: {selectedData?.G_NAME}</span>|<span>Vật liệu: {selectedData?.M_NAME}</span>|<span>Hạng mục test: {selectedData?.TEST_NAME}</span>|<span>Test point: {selectedData?.POINT_CODE}</span></div>
        {xbar.length > 0 && <div className="chart">
          <div className="xbar">
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>HISTOGRAM CHART</span>
            {histogram.length > 0 && <HISTOGRAM_CHART dldata={histogram} />}
          </div>
          <div className="xbar">
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>XBAR CHART (n=5)</span>
            {xbar.length > 0 && <XBAR_CHART dldata={xbar} />}
          </div>
          <div className="xbar">
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>R CHART (n=5)</span>
            {xbar.length > 0 && <R_CHART dldata={xbar} />}
          </div>
          <div className="xbar">
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>CPK TREND (n=25)</span>
            {cpk.length > 0 && <CPK_CHART dldata={cpk} />}
          </div>
        </div>}
      </div>
    </div>
  );
};
export default KQDTC;

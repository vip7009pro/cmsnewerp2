import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import "./SPECDTC.scss";
import { DTC_SPEC_DATA } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const SPECDTC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [testname, setTestName] = useState("0");
  const [testtype, setTestType] = useState("0");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    [],
  );
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const dtcSpecColumn = [    
    { field: 'CUST_NAME_KD',headerName: 'CUST_NAME_KD', resizable: true,width: 100 },
    { field: 'G_CODE',headerName: 'G_CODE', resizable: true,width: 100 },
    { field: 'G_NAME',headerName: 'G_NAME', resizable: true,width: 100 },
    { field: 'TEST_NAME',headerName: 'TEST_NAME', resizable: true,width: 100 },
    { field: 'POINT_NAME',headerName: 'POINT_NAME', resizable: true,width: 100 },
    { field: 'PRI',headerName: 'PRI', resizable: true,width: 100 },
    { field: 'CENTER_VALUE',headerName: 'CENTER_VALUE', resizable: true,width: 100 },
    { field: 'UPPER_TOR',headerName: 'UPPER_TOR', resizable: true,width: 100 },
    { field: 'LOWER_TOR',headerName: 'LOWER_TOR', resizable: true,width: 100 },
    { field: 'MIN_SPEC',headerName: 'MIN_SPEC', resizable: true,width: 100 },
    { field: 'MAX_SPEC',headerName: 'MAX_SPEC', resizable: true,width: 100 },
    { field: 'BARCODE_CONTENT',headerName: 'BARCODE_CONTENT', resizable: true,width: 100 },
    { field: 'REMARK',headerName: 'REMARK', resizable: true,width: 100 },
    { field: 'M_NAME',headerName: 'M_NAME', resizable: true,width: 100 },
    { field: 'WIDTH_CD',headerName: 'WIDTH_CD', resizable: true,width: 100 },
    { field: 'M_CODE',headerName: 'M_CODE', resizable: true,width: 100 },
    { field: 'TDS',headerName: 'TDS', resizable: true,width: 100 },
    { field: 'BANVE',headerName: 'BANVE', resizable: true,width: 100 },   
  ]
  const spectDTCTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
          </div>}
        columns={dtcSpecColumn}
        data={inspectiondatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
        onRowDoubleClick={async (e) => {
          //console.log(e.data)
        }}
      />
    )
  }, [inspectiondatatable,])
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handletraDTCData();
    }
  };
  const handletraDTCData = () => {
    Swal.fire({
      title: "Tra cứu SPEC Vật liệu - Sản phẩm",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("dtcspec", {
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
          const loadeddata: DTC_SPEC_DATA[] = response.data.data.map(
            (element: DTC_SPEC_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
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
  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="specdtc">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="GH63-xxxxxx"
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
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên Liệu:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SJ-203020HC"
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
                  type="text"
                  placeholder="A123456"
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Hạng mục test</b>
                <select
                  name="hangmuctest"
                  value={testname}
                  onChange={(e) => {
                    setTestName(e.target.value);
                  }}
                >
                  <option value="0">ALL</option>
                  <option value="1">Kích thước</option>
                  <option value="2">Kéo keo</option>
                  <option value="3">XRF</option>
                  <option value="4">Điện trở</option>
                  <option value="5">Tĩnh điện</option>
                  <option value="6">Độ bóng</option>
                  <option value="7">Phtalate</option>
                  <option value="8">FTIR</option>
                  <option value="9">Mài mòn</option>
                  <option value="10">Màu sắc</option>
                  <option value="11">TVOC</option>
                  <option value="12">Cân nặng</option>
                  <option value="13">Scanbarcode</option>
                  <option value="14">Nhiệt cao Ẩm cao</option>
                  <option value="15">Shock nhiệt</option>
                  <option value="1002">Kéo keo 2 mặt</option>
                </select>
              </label>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="1H23456"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn"></div>
          </div>
          <div className="formbutton">
            <label>
              <b>All Time:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#18a70b' }} onClick={() => {
              handletraDTCData();
            }}> Spec DTC</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{spectDTCTable}</div>
      </div>
    </div>
  );
};
export default SPECDTC;

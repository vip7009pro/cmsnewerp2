import moment from "moment";
import React, { useContext, useEffect, useMemo, useState, useTransition } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import { f_lichsuinputlieu, SaveExcel } from "../../../../api/GlobalFunction";
import "./LICHSUINPUTLIEU.scss";
import { LICHSUINPUTLIEU_DATA } from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
const LICHSUINPUTLIEU = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [readyRender, setReadyRender] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const column_lichsuinputlieusanxuat = [
    { field: "PROD_REQUEST_NO", headerName: "YCSX NO", width: 80 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 150 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "WIDTH_CD", headerName: "SIZE", width: 60 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
    { field: "INPUT_QTY", headerName: "INPUT_QTY", width: 120 },
    { field: "USED_QTY", headerName: "USED_QTY", width: 80 },
    { field: "REMAIN_QTY", headerName: "REMAIN_QTY", width: 90 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
    { field: "EQUIPMENT_CD", headerName: "MAY", width: 60 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(
    column_lichsuinputlieusanxuat
  );
  const handle_loadlichsuinputlieu = async () => {
    let kq: LICHSUINPUTLIEU_DATA[] = [];
    kq = await f_lichsuinputlieu({
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      PLAN_ID: plan_id,
      M_NAME: m_name,
      M_CODE: m_code,
      G_NAME: codeKD,
      G_CODE: codeCMS,
    });
    setInspectionDataTable(kq);
    if(kq.length > 0)
    {      
      Swal.fire('Thông báo', 'Đã load ' + kq.length + ' dòng', 'success');
    }
    else
    {
      Swal.fire('Thông báo', 'Không có dữ liệu', 'error');
    }
    setReadyRender(true);
  };
  const lichSuInputLieuDataTableAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              paddingLeft: 20,
              color: "black",
            }}
          >
            Lịch sử input liệu sản xuất
          </div>}
        columns={columnDefinition}
        data={inspectiondatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  }, [inspectiondatatable, columnDefinition])
  useEffect(() => {
  }, []);
  return (
    <div className='lichsuinputlieu'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform' style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
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
                  type='text'
                  placeholder='GH63-xxxxxx'
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
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
                  type='text'
                  placeholder='SJ-203020HC'
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type='text'
                  placeholder='1F80008'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b>All Time:</b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className='tranhatky'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_lichsuinputlieusanxuat);
                handle_loadlichsuinputlieu();
              }}
            >
              Tra lịch sử
            </button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          {lichSuInputLieuDataTableAG}
        </div>
      </div>
    </div>
  );
};
export default LICHSUINPUTLIEU;

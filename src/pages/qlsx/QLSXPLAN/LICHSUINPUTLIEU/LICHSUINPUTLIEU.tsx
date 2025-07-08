import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { f_lichsuinputlieu } from "../../../../api/GlobalFunction";
import "./LICHSUINPUTLIEU.scss";
import { LICHSUINPUTLIEU_DATA } from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useForm } from "react-hook-form";
const LICHSUINPUTLIEU = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const {register,handleSubmit,watch, formState:{errors}} = useForm()
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]); 
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
      ALLTIME: watch("alltime"),
      FROM_DATE: watch("fromdate"),
      TO_DATE: watch("todate"),
      PROD_REQUEST_NO: watch("prodrequestno"),
      PLAN_ID: watch("plan_id"),
      M_NAME: watch("m_name"),
      M_CODE: watch("m_code"),
      G_NAME: watch("codeKD"),
      G_CODE: watch("codeCMS"),
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
    handleSubmit(handle_loadlichsuinputlieu)();
  }, []);
  return (
    <div className='lichsuinputlieu'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform' style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input type='date' {...register("fromdate")} defaultValue={moment().format("YYYY-MM-DD")} ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input type='date' {...register("todate")} defaultValue={moment().format("YYYY-MM-DD")} ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Code KD:</b>{" "}
                <input type='text' placeholder='GH63-xxxxxx' {...register("codeKD")} defaultValue={""} ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input type='text' placeholder='7C123xxx' {...register("codeCMS")} defaultValue={""} ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Tên Liệu:</b>{" "}
                <input type='text' placeholder='SJ-203020HC' {...register("m_name")} defaultValue={""} ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input type='text' placeholder='A123456' {...register("m_code")} defaultValue={""} ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Số YCSX:</b>{" "}
                <input type='text' placeholder='1F80008' {...register("prodrequestno")} defaultValue={""} ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input type='text' placeholder='A123456' {...register("plan_id")} defaultValue={""} ></input>
              </label>
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b>All Time:</b>
              <input type='checkbox' {...register("alltime")} defaultChecked={false} ></input>
            </label>
            <button className='tranhatky' onClick={() => { setColumnDefinition(column_lichsuinputlieusanxuat); handleSubmit(handle_loadlichsuinputlieu)(); }} > Tra lịch sử </button>
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

import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import "./UploadCong.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import Swal from "sweetalert2";
import { Button, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { RxUpdate } from "react-icons/rx";
import { f_readUploadFile } from "../../kinhdoanh/utils/kdUtils";
import { BANG_CONG_DATA, BANG_CONG_THANG_DATA } from "../interfaces/nhansuInterface";
import { f_checkNV, f_insertBangCong, f_loadBangCong, f_syncBangCong, loadBangCongTheoThang } from "../utils/nhansuUtils";
import { getUserData } from "../../../api/Api";

const UploadCong = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const {register,handleSubmit,watch, formState:{errors}} = useForm({
    defaultValues: {
      from_date: moment().format("YYYY-MM-01"),
      to_date: moment().format("YYYY-MM-DD"),
    }
  })
  const [bangcongdata, setBangCongData] = useState<BANG_CONG_DATA[]>([]);
  const [bangcongthangdata, setBangCongThangData] = useState<BANG_CONG_THANG_DATA[]>([]);
  const selectedBangCongDetailData = useRef<BANG_CONG_DATA[]>([]);
  const columns_bangcongdetail = useMemo(() => {
    return [      
      {
        field: "BC_ID",
        headerName: "BC_ID",
        width: 60,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        field: "NV_CCID",
        headerName: "NV_CCID",
        width: 60,
      },
      {
        field: "EMPL_NO",
        headerName: "EMPL_NO",
        width: 60,
      },
      {
        field: "APPLY_DATE",
        headerName: "APPLY_DATE",
        width: 70,
      },
      {
        field: "FULL_NAME",
        headerName: "FULL_NAME",
        width: 100,
      },
      {
        field: "MAINDEPTNAME",
        headerName: "MAINDEPTNAME",
        width: 80,
      },
      {
        field: "WORK_HOUR",
        headerName: "WORK_HOUR",
        width: 80,
      },
      {
        field: "IN_TIME",
        headerName: "IN_TIME",
        width: 60,
      },
      {
        field: "OUT_TIME",
        headerName: "OUT_TIME",
        width: 60,
      },
      {
        field: "L100",
        headerName: "L100",
        width: 60,
      },
      {
        field: "L150T",
        headerName: "L150T",
        width: 60,
      },
      {
        field: "L150S",
        headerName: "L150S",
        width: 60,
      },
      {
        field: "L130",
        headerName: "L130",
        width: 60,
      },
      {
        field: "L180",
        headerName: "L180",
        width: 60,
      },
      {
        field: "L200",
        headerName: "L200",
        width: 60,
      },
      {
        field: "L210",
        headerName: "L210",
        width: 60,
      },
      {
        field: "L270",
        headerName: "L270",
        width: 60,
      },
      {
        field: "L300",
        headerName: "L300",
        width: 60,
      },
      {
        field: "L390",
        headerName: "L390",
        width: 60,
      },
      {
        field: "DI_TRE",
        headerName: "DI_TRE",
        width: 60,
      },
      {
        field: "VE_SOM",
        headerName: "VE_SOM",
        width: 60,
      },
      {
        field: "AN_SANG",
        headerName: "AN_SANG",
        width: 60,
      },
      {
        field: "AN_TRUA",
        headerName: "AN_TRUA",
        width: 60,
      },
      {
        field: "AN_TOI",
        headerName: "AN_TOI",
        width: 60,
      },
      {
        field: "PHU",
        headerName: "PHU",
        width: 60,
      },
      {
        field: "DI_LAI",
        headerName: "DI_LAI",
        width: 60,
      },
      {
        field: "INS_DATE",
        headerName: "INS_DATE",
        width: 60,
      },
      {
        field: "INS_EMPL",
        headerName: "INS_EMPL",
        width: 60,
      },
      {
        field: "UPD_DATE",
        headerName: "UPD_DATE",
        width: 60,
      },
      {
        field: "UPD_EMPL",
        headerName: "UPD_EMPL",
        width: 60,
      },
    ];
  }, []);
  const columns_bangcongthang = useMemo(() => {
    return [ 
      {
        field: "Year_Month",
        headerName: "Year_Month",
        width: 60,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        field: "EMPL_NO",
        headerName: "EMPL_NO",
        width: 60,
      },
      {
        field: "FULL_NAME",
        headerName: "FULL_NAME",
        width: 100,
      },
      {
        field: "MAINDEPTNAME",
        headerName: "MAINDEPTNAME",
        width: 80,
      },      
      {
        field: "Total_WORK_HOUR",
        headerName: "Total_WORK_HOUR",
        width: 60,
      },
      {
        field: "Total_L100",
        headerName: "Total_L100",
        width: 60,
      },
      {
        field: "Total_L150T",
        headerName: "Total_L150T",
        width: 60,
      },
      {
        field: "Total_L150S",
        headerName: "Total_L150S",
        width: 60,
      },
      {
        field: "Total_L130",
        headerName: "Total_L130",
        width: 60,
      },
      {
        field: "Total_L180",
        headerName: "Total_L180",
        width: 60,
      },
      {
        field: "Total_L200",
        headerName: "Total_L200",
        width: 60,
      },
      {
        field: "Total_L210",
        headerName: "Total_L210",
        width: 60,
      },
      {
        field: "Total_L270",
        headerName: "Total_L270",
        width: 60,
      },
      {
        field: "Total_L300",
        headerName: "Total_L300",
        width: 60,
      },
      {
        field: "Total_L390",
        headerName: "Total_L390",
        width: 60,
      },
      {
        field: "Total_DI_TRE",
        headerName: "Total_DI_TRE",
        width: 60,
      },
      {
        field: "Total_VE_SOM",
        headerName: "Total_VE_SOM",
        width: 60,
      },
      {
        field: "Total_AN_SANG",
        headerName: "Total_AN_SANG",
        width: 60,
      },
      {
        field: "Total_AN_TRUA",
        headerName: "Total_AN_TRUA",
        width: 60,
      },
      {
        field: "Total_AN_TOI",
        headerName: "Total_AN_TOI",
        width: 60,
      },
      {
        field: "Total_PHU",
        headerName: "Total_PHU",
        width: 60,
      },
      {
        field: "Total_DI_LAI",
        headerName: "Total_DI_LAI",
        width: 60,
      },     
    ];
  }, []);
  const [columnDetail, setcolumnDetail] = useState<any>(columns_bangcongdetail);

  const loadFile = (e: any) => {
    f_readUploadFile(e, setBangCongData, setcolumnDetail);
  };

  const checkNV = async ()=> {
    let listNV_CCID = [...new Set(bangcongdata.map((item: BANG_CONG_DATA) =>  parseInt(item.NV_CCID.toString())))].join(',');

    let ketqua = await f_checkNV({
      LIST_NV_CCID: listNV_CCID
    });
    if(ketqua.length > 0){
      Swal.fire({
        title: 'Có nhân viên không tồn tại trong hệ thống',
        text: ketqua.map((item: any) => item.EmployeeCode).join(','),
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
    return ketqua;
  }
  const kpi_detail_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div>
          <IconButton size='small' aria-label='show 4 new mails' color='inherit' onClick={() => {
              handleInsertUpdateBangCong();
            }}>
              <RxUpdate size={15} color='#ec08ec' /> <span style={{ color: '#ec08ec', fontSize: '0.8rem' }}>Update</span>
            </IconButton>
            <input                 
              className='selectfilebutton'
              type='file'
              name='upload'
              id='upload'
              onChange={(e: any) => {
                loadFile(e);
              }}
            />
        </div>}
        columns={columnDetail}
        data={bangcongdata}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [bangcongdata,columnDetail, loadFile]);
  const handleInsertUpdateBangCong = async () => {
      Swal.fire({
        title: 'Chắc chắn muốn cập nhật giờ làm?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cập nhật'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let kqchecknvid = await checkNV();
          if(kqchecknvid.length > 0 && getUserData()?.EMPL_NO !== "NHU1903"){
            return;
          }
          let kq: string = '';
          let temp_bangcongdata: BANG_CONG_DATA[] = bangcongdata;
          if(bangcongdata?.length> 0){
            for(let i = 0; i < bangcongdata.length; i++){
              let ketqua : string = '';
              ketqua = await f_insertBangCong(bangcongdata[i]);
              if(ketqua !== ''){
                kq += ketqua;
                 temp_bangcongdata[i].CHECKSTATUS = 'OK';
              } else {
                temp_bangcongdata[i].CHECKSTATUS = ketqua;
              }
            }
            console.log(temp_bangcongdata)
            setBangCongData(temp_bangcongdata);
            if(kq === ''){
              await f_syncBangCong({
                FROM_DATE: watch("from_date"),
                TO_DATE: watch("to_date"),
              });
             
              Swal.fire("Thông báo", "Upload thành công", "success");
            }else{
              Swal.fire("Thông báo", "Upload thất bại:" + kq, "error");
            }
          }
          else {
            Swal.fire("Thông báo", "Chọn ít nhất một dòng để update giờ làm", "error");
          }
        }
      })
  }
  const kpi_summary_ag_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>
            
          </div>          
        }
        columns={columns_bangcongthang}
        data={bangcongthangdata}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          selectedBangCongDetailData.current = params.api.getSelectedRows();
        }}
      />
    );
  }, [bangcongthangdata,columns_bangcongthang, loadFile]);
  const handle_loaddatasx = async () => {
    let kq: BANG_CONG_DATA[] = [];
    kq = await f_loadBangCong({
      FROM_DATE: watch("from_date"),
      TO_DATE: watch("to_date"),
    });
    let kq_summary: BANG_CONG_THANG_DATA[] = [];
    kq_summary = await loadBangCongTheoThang({
      FROM_DATE: watch("from_date"),
      TO_DATE: watch("to_date"),
    });
    //console.log(kq);
    const count = kq.length + kq_summary.length;
    const msg = count > 0 ? `Đã load : ${count} dòng (${kq.length} dòng dữ liệu, ${kq_summary.length} dòng dữ liệu)` : "Không có dữ liệu";
    Swal.fire("Thông báo", msg, count > 0 ? "success" : "error");
    setBangCongData(kq);
    setBangCongThangData(kq_summary);
    setcolumnDetail(columns_bangcongdetail);
  };

  useEffect(() => {
    handle_loaddatasx();
    return () => {
    };
  }, []);
  return (
    <div className="uploadcong">
      <div className="tracuuDataInspection">
        <div
          className="tracuuDataInspectionform"
          style={{ backgroundImage: theme.CMS.backgroundImage }}
        >
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>From Date:</b>
                <input
                  defaultValue={moment().format("YYYY-MM-DD")}
                  {...register("from_date")}
                  type="date"
                />
              </label>              
              <label>
                <b>To Date:</b>
                <input
                  defaultValue={moment().format("YYYY-MM-DD")}
                  {...register("to_date")}
                  type="date"
                />
              </label>              
            </div>
            <Button onClick={handleSubmit(handle_loaddatasx)}>
              Load Data
            </Button>
          </div>
          <div className="formbutton">
           
          </div>
        </div>
        <div className="tracuuYCSXTable">          
          <div className="backdata">
            <div className="datatable2">Bảng tháng{kpi_summary_ag_table}</div>
            <div className="datatable1">Bảng ngày{kpi_detail_ag_table}</div>
          </div>          
        </div>
      </div>
    </div>
  );
};
export default UploadCong;

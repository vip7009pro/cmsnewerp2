import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import "./KPI_NV_NEW.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import Swal from "sweetalert2";
import { Button, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { RxUpdate } from "react-icons/rx";
import { SX_KPI_NEW_DETAIL_DATA, SX_KPI_NEW_SUMMARY_DATA, SX_KPI_NV_DATA } from "../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_insertupdateworkhours, f_load_SX_NV_KPI_DATA_Daily, f_load_SX_NV_KPI_DATA_Monthly, f_load_SX_NV_KPI_DATA_Weekly, f_load_SX_NV_KPI_DATA_Yearly, f_loadSXKPINEW_DETAIL, f_loadSXKPINEW_SUMMARY } from "../../qlsx/QLSXPLAN/utils/khsxUtils";
import SX_KPI_NV_GRAPH from "../../../components/Chart/SX/SX_KPI_NV_GRAPH";
import { f_readUploadFile } from "../../kinhdoanh/utils/kdUtils";
const KPI_NVSX_NEW = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const {register,handleSubmit,watch, formState:{errors}} = useForm({
    defaultValues: {
      kpi_date: moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD")
    }
  })
  const [kpi_detail_data, setKPI_DetailData] = useState<SX_KPI_NEW_DETAIL_DATA[]>([]);
  const [kpi_summary_data, setKPI_SummaryData] = useState<SX_KPI_NEW_SUMMARY_DATA[]>([]);
  const selectedKpiSummaryData = useRef<SX_KPI_NEW_SUMMARY_DATA[]>([]);
  const columns_kpinvsx_detail = useMemo(() => {
    return [
      {
        field: "EQ_NAME",
        headerName: "EQ_NAME",
        width: 60,
      },
      {
        field: "INS_EMPL",
        headerName: "INS_EMPL",
        width: 60,
      },
      {
        field: "EMPL_NAME",
        headerName: "EMPL_NAME",
        width: 100,
      },
      {
        field: "RUN_COUNT",
        headerName: "RUN_COUNT",
        width: 60,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US")} lần
            </span>
          );
        },
      },
      {
        field: "INPUT_QTY",
        headerName: "INPUT_QTY",
        width: 60,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "REMAIN_QTY",
        headerName: "REMAIN_QTY",
        width: 70,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#df0000" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "USED_QTY",
        headerName: "USED_QTY",
        width: 60,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "DEFAULT_QTY",
        headerName: "DEFAULT_QTY",
        width: 70,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "RATE_MET_TONG",
        headerName: "RATE_MET_TONG",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              
            </span>
          );
        },
      },
      {
        field: "RATE_MET_MAY",
        headerName: "RATE_MET_MAY",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              
            </span>
          );
        },
      },
      {
        field: "WORK_HOURS",
        headerName: "WORK_HOURS",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              H
            </span>
          );
        },
      },
      {
        field: "REAL_RUN_HOURS",
        headerName: "REAL_RUN_HOURS",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              H
            </span>
          );
        },
      },
      {
        field: "KPI_BY_MET",
        headerName: "KPI_BY_MET",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              
            </span>
          );
        },
      },
      {
        field: "KPI",
        headerName: "KPI",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413", fontWeight:'bold' }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              
            </span>
          );
        },
      },
    ];
  }, []);
  const columns_kpinvsx_summary = useMemo(() => {
    return [
      {
        field: "INS_EMPL",
        headerName: "INS_EMPL",
        width: 100,
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      {
        field: "EMPL_NAME",
        headerName: "EMPL_NAME",
        width: 100,
      },
      {
        field: "RUN_COUNT",
        headerName: "RUN_COUNT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              lần
            </span>
          );
        },
      },
      {
        field: "TOTAL_SANLUONG",
        headerName: "TOTAL_SANLUONG",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "KPI",
        headerName: "KPI",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413", fontWeight:'bold' }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              
            </span>
          );
        },
      },
      {
        field: "WORK_HOURS",
        headerName: "WORK_HOURS",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              H
            </span>
          );
        },
      },
    ];
  }, []);
  const [columnSummary, setColumnSummary] = useState<any>(columns_kpinvsx_summary);

  const kpi_detail_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}
        columns={columns_kpinvsx_detail}
        data={kpi_detail_data}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [kpi_detail_data]);
  const handleInsertUpdateWorkHours = async () => {
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
          let kq: string = '';
          if(selectedKpiSummaryData.current?.length> 0){
            for(let i = 0; i < selectedKpiSummaryData.current.length; i++){
              kq += await f_insertupdateworkhours({...selectedKpiSummaryData.current[i], WORK_YEAR: moment(watch("kpi_date")).format("YYYY"), WORK_MONTH: moment(watch("kpi_date")).format("MM")})
            }
            if(kq === ''){
              Swal.fire("Thông báo", "Update thành công", "success");
            }else{
              Swal.fire("Thông báo", "Update thất bại:" + kq, "error");
            }
          }
          else {
            Swal.fire("Thông báo", "Chọn ít nhất một dòng để update giờ làm", "error");
          }
        }
      })

    
   
    
  }
  const loadFile = (e: any) => {
    f_readUploadFile(e, setKPI_SummaryData, setColumnSummary);
  };
  const kpi_summary_ag_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>
            <IconButton size='small' aria-label='show 4 new mails' color='inherit' onClick={() => {
              handleInsertUpdateWorkHours();
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
          </div>
          
        }
        columns={columnSummary}
        data={kpi_summary_data}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          selectedKpiSummaryData.current = params.api.getSelectedRows();
        }}
      />
    );
  }, [kpi_summary_data,columnSummary, loadFile]);
  const handle_loaddatasx = async () => {
    let kq: SX_KPI_NEW_DETAIL_DATA[] = [];
    kq = await f_loadSXKPINEW_DETAIL({
      KPI_DATE: watch("kpi_date"),
    });
    let kq_summary: SX_KPI_NEW_SUMMARY_DATA[] = [];
    kq_summary = await f_loadSXKPINEW_SUMMARY({
      KPI_DATE: watch("kpi_date"),
    });
    //console.log(kq);
    const count = kq.length + kq_summary.length;
    const msg = count > 0 ? `Đã load : ${count} dòng` : "Không có dữ liệu";
    Swal.fire("Thông báo", msg, count > 0 ? "success" : "error");
    setKPI_DetailData(kq);
    setKPI_SummaryData(kq_summary);
    setColumnSummary(columns_kpinvsx_summary);
  };

  useEffect(() => {
    handle_loaddatasx();
    return () => {
    };
  }, []);
  return (
    <div className="kpinvsxnew">
      <div className="tracuuDataInspection">
        <div
          className="tracuuDataInspectionform"
          style={{ backgroundImage: theme.CMS.backgroundImage }}
        >
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>KPI Date:</b>
                <input
                  defaultValue={moment().format("YYYY-MM-DD")}
                  {...register("kpi_date")}
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
          <div className="chart">            
            <SX_KPI_NV_GRAPH dldata={kpi_summary_data} />
          </div>
          <div className="backdata">
            <div className="datatable1">{kpi_detail_ag_table}</div>
            <div className="datatable2">{kpi_summary_ag_table}</div>
          </div>          
        </div>
      </div>
    </div>
  );
};
export default KPI_NVSX_NEW;

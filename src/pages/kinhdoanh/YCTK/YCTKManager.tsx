import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import "./YCTKManager.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import Swal from "sweetalert2";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { f_insert_YCTK, f_load_YCTK, f_update_YCTK } from "../utils/kdUtils";
import { YCTKData } from "../interfaces/kdInterface";
import YCTK from "./YCTK";
import CustomDialog from "../../../components/Dialog/CustomDialog";
import { AiFillEdit, AiFillFileAdd } from "react-icons/ai";
const emptyYCTKData: YCTKData = {
  CTR_CD: "002",
  REQ_ID: 0,
  CUST_CD: "",
  G_CODE: "",
  G_NAME: "",
  G_NAME_KD: "",
  CUST_NAME_KD: "",
  DESIGN_REQUEST_DATE: moment().format('YYYY-MM-DD'),
  ESTIMATED_PO: 0,
  MATERIAL: "",
  Coating_KhongPhu: false,
  Coating_LamiBong: false,
  Coating_OpamMo: false,
  Coating_UVBong: false,
  Coating_UVMo: false,
  LabelWidth: 0,
  LabelHeight: 0,
  Tolerance: 0,
  FaceOut: 0,
  FaceIn: 0,
  TopBottomSpacing: 0,
  BetweenLabelSpacing: 0,
  LinerSpacing: 0,
  CornerRadius: 0,
  AdhesiveRemoval: false,
  HasToothCut: false,
  DieCutType: "",
  LabelForm: "",
  LabelFormQty: 0,
  RollCore: "",
  PrintYN: "",
  DecalType: "",
  ApproveType: "",
  SpecialRequirement: "",
  SpecialRequirementLevel: 0,
  SAMPLE_STATUS: "P",
  RND_EMPL: "",
  QC_EMPL: "",
  KD_EMPL: "",
  INS_DATE: moment().format('YYYY-MM-DD'),
  INS_EMPL: "",
  UPD_DATE: moment().format('YYYY-MM-DD'),
  UPD_EMPL: "",
  Co_Sx_Mau: true,
  ManualCloseStatus: false,
  FINAL_STATUS: "P",
};

const YCTKManager = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const {register,handleSubmit,watch, formState:{errors}} = useForm({
    defaultValues: {
      fromdate: moment().format('YYYY-MM-DD'),
      todate: moment().format('YYYY-MM-DD'),
      alltime: true,
    }
  })
  const [yctkdata, setYCTKData] = useState<YCTKData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>("add");
  const [form, setForm] = useState<YCTKData>(emptyYCTKData);
  const [selectedRow, setSelectedRow] = useState<YCTKData | null>(null);

  const columns_yctk= useMemo(() => {
    return [
      { field: "id", headerName: "ID", width: 30, checkboxSelection: true, headerCheckboxSelection: true },
      { field: "REQ_ID", headerName: "REQ_ID", width: 40 },
      { field: "FINAL_STATUS", headerName: "FINAL_STATUS", width: 100, cellRenderer: (params: any) =>  {
        return <span style={{ color: params.value === "P" ? "red" : "green", fontWeight: "bold" }}>{params.value === "P" ? "Pending" : "Completed"}</span>
      } },
      { field: "SAMPLE_STATUS", headerName: "SAMPLE_STATUS", width: 100, cellRenderer: (params: any) =>  {
        return <span style={{ color: params.value === "P" ? "red" : "green" }}>{params.value === "P" ? "Pending" : "Completed"}</span>
      } },
      { field: "ManualCloseStatus", headerName: "ManualCloseStatus", width: 60, cellRenderer: (params: any) =>  {
        return <span style={{ color: params.value === false ? "red" : "green" }}>{params.value === false ? "Pending" : "Completed"}</span>
      } },
      { field: "Co_Sx_Mau", headerName: "Co_Sx_Mau", width: 60 },
      { field: "CUST_CD", headerName: "CUST_CD", width: 60 },
      { field: "G_CODE", headerName: "G_CODE", width: 60 },
      { field: "G_NAME", headerName: "G_NAME", width: 60 },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 60 },
      { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 60 },
      { field: "DESIGN_REQUEST_DATE", headerName: "DESIGN_REQUEST_DATE", width: 60, cellRenderer: (params: any) => moment(params.value).format("YYYY-MM-DD") },
      { field: "ESTIMATED_PO", headerName: "ESTIMATED_PO", width: 60 },
      { field: "MATERIAL", headerName: "MATERIAL", width: 60 },
      { field: "Coating_KhongPhu", headerName: "Coating_KhongPhu", width: 60},
      { field: "Coating_LamiBong", headerName: "Coating_LamiBong", width: 60},
      { field: "Coating_OpamMo", headerName: "Coating_OpamMo", width: 60},
      { field: "Coating_UVBong", headerName: "Coating_UVBong", width: 60},
      { field: "Coating_UVMo", headerName: "Coating_UVMo", width: 60},
      { field: "LabelWidth", headerName: "LabelWidth", width: 60 },
      { field: "LabelHeight", headerName: "LabelHeight", width: 60 },
      { field: "Tolerance", headerName: "Tolerance", width: 60 },
      { field: "FaceOut", headerName: "FaceOut", width: 60 },
      { field: "FaceIn", headerName: "FaceIn", width: 60 },
      { field: "TopBottomSpacing", headerName: "TopBottomSpacing", width: 60 },
      { field: "BetweenLabelSpacing", headerName: "BetweenLabelSpacing", width: 60 },
      { field: "LinerSpacing", headerName: "LinerSpacing", width: 60 },
      { field: "CornerRadius", headerName: "CornerRadius", width: 60 },
      { field: "AdhesiveRemoval", headerName: "AdhesiveRemoval", width: 60},
      { field: "HasToothCut", headerName: "HasToothCut", width: 60},
      { field: "DieCutType", headerName: "DieCutType", width: 60 },
      { field: "LabelForm", headerName: "LabelForm", width: 60 },
      { field: "LabelFormQty", headerName: "LabelFormQty", width: 60 },
      { field: "RollCore", headerName: "RollCore", width: 60 },
      { field: "PrintYN", headerName: "PrintYN", width: 60 },
      { field: "DecalType", headerName: "DecalType", width: 60 },
      { field: "ApproveType", headerName: "ApproveType", width: 60 },
      { field: "SpecialRequirement", headerName: "SpecialRequirement", width: 60 },
      { field: "SpecialRequirementLevel", headerName: "SpecialRequirementLevel", width: 60 },
      { field: "INS_DATE", headerName: "INS_DATE", width: 60 },
      { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
      { field: "UPD_DATE", headerName: "UPD_DATE", width: 60 },
      { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 60 },
       
    ];
  }, []);
  const yctk_ag_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        columns={columns_yctk}
        data={yctkdata}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          setSelectedRow(params.data);
        }}
        toolbar={
          <div style={{ display: 'flex', gap: 8 }}>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                setDialogMode('add');
                setForm(emptyYCTKData);
                setDialogOpen(true);
              }}
            >
              <AiFillFileAdd color='green' size={15} />
              Thêm mới
            </IconButton>
            <IconButton
              className='buttonIcon'
              disabled={!selectedRow}
              onClick={() => {
                if (selectedRow) {
                  setDialogMode('edit');
                  setForm(selectedRow);
                  setDialogOpen(true);
                }
              }}
            >
              <AiFillEdit color='#e038e0' size={15} />
              Cập nhật
            </IconButton>
          </div>
        }
        onSelectionChange={(params: any) => {
          setSelectedRow(params.api.getSelectedRows()[0] || null);
        }}
      />
    );
  }, [yctkdata,selectedRow]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setForm(emptyYCTKData);
  };
  const handle_loaddatasx = async () => {
    let kq: YCTKData[] = [];    
        kq = await f_load_YCTK({
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
        ALL_TIME: watch("alltime"),
      });      
    //console.log(kq);
    if (kq.length > 0) {
      Swal.fire("Thông báo", "Đã load : " + kq.length + " dòng", "success");
      setYCTKData(kq);
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu", "error");
      setYCTKData([]);
    }
  };
  useEffect(() => {
    return () => {
    };
  }, []);
  return (
    <div className='yctkmanager'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform' style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input defaultValue={moment().add(-8, 'day').format('YYYY-MM-DD')} {...register('fromdate')} type='date' />
              </label>
              <label>
                <b>Tới ngày:</b> <input defaultValue={moment().format('YYYY-MM-DD')} {...register('todate')} type='date' />
              </label>              
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b
                style={{
                  color: '#1f67ec',
                  fontWeight: 'normal',
                  fontSize: '0.8rem',
                }}
              >
                All Time:
              </b>
              <input {...register('alltime')} type='checkbox' />
            </label>
            <Button onClick={handleSubmit(handle_loaddatasx)}>Load Data</Button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          <div className='datatable'>{yctk_ag_table}</div>
        </div>
      </div>
      <CustomDialog isOpen={dialogOpen} onClose={handleDialogClose} title={dialogMode === 'add' ? 'Thêm mới YCTK' : 'Cập nhật YCTK'} content={<YCTK data={form} />} actions={<></>} />
    </div>
  );
};
export default YCTKManager;
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import "./AUDIT_HISTORY.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import AGTable from "../../../../components/DataTable/AGTable";
import Swal from "sweetalert2";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Autocomplete,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { PlusOneOutlined } from "@mui/icons-material";
import { AiFillDelete, AiFillEdit, AiFillFileAdd } from "react-icons/ai";
import { getCtrCd, uploadQuery } from "../../../../api/Api";
import { DownloadButtonAll } from "../../../../components/DownloadButton/DownloadButtonAll";
import { f_getcustomerlist } from "../../../kinhdoanh/utils/kdUtils";
import { AUDIT_HISTORY_DATA } from "../../interfaces/qcInterface";
import { f_add_AUDIT_HISTORY_DATA, f_delete_AUDIT_HISTORY_DATA, f_load_AUDIT_HISTORY_DATA, f_update_AUDIT_HISTORY_DATA, f_updateFileInfo_AUDIT_HISTORY } from "../../utils/qcUtils";


const AUDIT_HISTORY = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fromdate: moment().add(-8, "day").format("YYYY-MM-DD"),
      todate: moment().format("YYYY-MM-DD"),
      alltime: false,
    },
  });
  const [auditHistoryData, setAuditHistoryData] = useState<
    AUDIT_HISTORY_DATA[]
  >([]);
  // State cho dialog thêm audit mới
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAudit, setNewAudit] = useState<AUDIT_HISTORY_DATA>({
    id: 0,
    CTR_CD: "",
    CUST_CD: "",
    CUST_NAME_KD: "",
    AUDIT_ID: 0,
    AUDIT_DATE: moment().format("YYYY-MM-DD"),
    AUDIT_NAME: "",
    AUDIT_MAX_SCORE: 0,
    AUDIT_SCORE: 0,
    AUDIT_PASS_SCORE: 0,
    AUDIT_RESULT: "",
    AUDIT_FILE_EXT: "",
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
  });
  // State cho danh sách khách hàng
  const [customerList, setCustomerList] = useState<any[]>([]);
  // State cho dialog sửa
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editAudit, setEditAudit] = useState<AUDIT_HISTORY_DATA | null>(null);
  // Lấy danh sách khách hàng khi mở dialog
  const protocol = window.location.protocol.startsWith("https") ? "https" : "http";


    const handleUploadDoc = async (auditRow: AUDIT_HISTORY_DATA) => {     
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
  
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        if (!target.files?.length) return;        
        
        const file = target.files[0];
        const filename = getCtrCd()+'_'+ auditRow.AUDIT_ID + "." + file.name.split('.').pop();
        //const filename = file.name;
        const uploadfoldername = 'audithistory';
  
        try {       
          uploadQuery(file, filename, uploadfoldername)
            .then(async (response) => {
              console.log(response.data);
              if (response.data.tk_status !== "NG") {
                Swal.fire("Thông báo", "Upload file thành công", "success");
                let kq = await f_updateFileInfo_AUDIT_HISTORY({
                  AUDIT_ID: auditRow.AUDIT_ID,
                  AUDIT_FILE_EXT: '.' + file.name.split('.').pop(),
                });
                console.log('kq',kq)
                if(kq === '') {
                  Swal.fire("Thông báo", "Upload file thành công", "success");
                }
               else {
                Swal.fire("Thông báo", "Upload file thất bại", "error");
              }
  
            }
               
            })
            .catch((error) => {
              console.error('Error uploading file:', error);
            });
          // Refresh the data after successful upload
          
        } catch (error) {
          console.error('Error uploading file:', error);
          // You might want to add error handling/notification here
        }
      };
  
      // Trigger file selection dialog
      input.click();
    };

  useEffect(() => {
    if (openAddDialog || openEditDialog) {
      f_getcustomerlist().then((data: any[]) => setCustomerList(data || []));
    }
  }, [openAddDialog, openEditDialog]);
  const columns_auditHistory = useMemo(() => {
    return [
      {
        field: "id",
        headerName: "ID",
        width: 60,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
      { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
      { field: "AUDIT_ID", headerName: "AUDIT_ID", width: 100 },
      { field: "AUDIT_DATE", headerName: "AUDIT_DATE", width: 100 },
      { field: "AUDIT_NAME", headerName: "AUDIT_NAME", width: 100 },
      { field: "AUDIT_MAX_SCORE", headerName: "AUDIT_MAX_SCORE", width: 100 },
      { field: "AUDIT_SCORE", headerName: "AUDIT_SCORE", width: 100 },
      { field: "AUDIT_PASS_SCORE", headerName: "AUDIT_PASS_SCORE", width: 100 },
      {
        field: "AUDIT_RESULT",
        headerName: "AUDIT_RESULT",
        width: 100,
        cellRenderer: (params: any) =>
          params.value === "PASS" ? (
            <span style={{ color: "green", fontWeight: "bold" }}>PASS</span>
          ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>FAIL</span>
          ),
      },
      { field: "AUDIT_FILE_EXT", headerName: "ATT_FILE", width: 100, cellRenderer: (params: any) =>{
        if(params.value === '') {
          return (
            <Button color="primary" onClick={() => handleUploadDoc(params.data)}>
              <span style={{fontSize: "0.7rem"}}>Upload</span>
            </Button>
          )
        }
        else {
          let fullUrl = `${protocol}://${window.location.host}/audithistory/${getCtrCd()}_${params.data.AUDIT_ID}${params.data.AUDIT_FILE_EXT}`;
          console.log(fullUrl)
          const filename = `${params.data.AUDIT_ID}${params.data.AUDIT_FILE_EXT}`;
          return (
            <DownloadButtonAll fullUrl={fullUrl} filename={filename} /> 
          )
        }
      } },  
      { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
      { field: "INS_EMPL", headerName: "INS_EMPL", width: 100 },
      { field: "UPD_DATE", headerName: "UPD_DATE", width: 100 },
      { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 100 },
    ];
  }, []);
  const selectedRows = useRef<AUDIT_HISTORY_DATA[]>([]);
  const selectedRow = useRef<AUDIT_HISTORY_DATA | null>(null);
  const handle_Delete_Row = async () => {
    if (selectedRows.current.length > 0) {
      for (let i = 0; i < selectedRows.current.length; i++) {
        await f_delete_AUDIT_HISTORY_DATA(selectedRows.current[i]);
      }
      Swal.fire("Thông báo", "Xóa thành công", "success");
    }
    setAuditHistoryData(
      auditHistoryData.filter(
        (item: AUDIT_HISTORY_DATA) => !selectedRows.current.includes(item)
      )
    );
    selectedRows.current = [];
  };
  const loss_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div>
            {/* add button mở dialog */}
            <IconButton color="primary" onClick={() => setOpenAddDialog(true)}>
              <AiFillFileAdd color="blue" size={15} />
              <span style={{ fontSize: "0.8rem" }}>Add</span>
            </IconButton>
            {/* delete button */}
            <IconButton color="error" onClick={() => handle_Delete_Row()}>
              <AiFillDelete color="red" size={15} />
              <span style={{ fontSize: "0.8rem" }}>Delete</span>
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => {
                if (selectedRow.current) {
                  setEditAudit(selectedRow.current);
                  setOpenEditDialog(true);
                }
              }}
            >
              <AiFillEdit color="#ffaaff" size={15} />
              <span style={{ fontSize: "0.8rem" }}>Edit</span>
            </IconButton>
          </div>
        }
        columns={columns_auditHistory}
        data={auditHistoryData}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          selectedRow.current = params.data;
        }}
        onSelectionChange={(params: any) => {
          selectedRows.current = params.api.getSelectedRows();
        }}
      />
    );
  }, [auditHistoryData, columns_auditHistory, selectedRows.current]);
  const hanlde_load_AUDIT_HISTORY_DATA = async () => {
    let kq: AUDIT_HISTORY_DATA[] = [];
    kq = await f_load_AUDIT_HISTORY_DATA({
      FROM_DATE: watch("fromdate"),
      TO_DATE: watch("todate"),
      ALLTIME: watch("alltime"),
    });
    //console.log(kq);
    if (kq.length > 0) {
      Swal.fire("Thông báo", "Đã load : " + kq.length + " dòng", "success");
      setAuditHistoryData(kq);
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu", "error");
      setAuditHistoryData([]);
    }
  };
  useEffect(() => {
    hanlde_load_AUDIT_HISTORY_DATA();
    return () => {};
  }, []);
  // Hàm lưu audit đã sửa
  const handleSaveEditAudit = async () => {
    if (!editAudit) return;
    const res = await f_update_AUDIT_HISTORY_DATA(editAudit);
    if (!res) {
      Swal.fire("Thành công", "Đã cập nhật audit!", "success");
      setOpenEditDialog(false);
      hanlde_load_AUDIT_HISTORY_DATA();
    } else {
      Swal.fire("Lỗi", res, "error");
    }
  };
  return (
    <div className="kpinvsx">
      <div className="tracuuDataInspection">
        <div
          className="tracuuDataInspectionform"
          style={{ backgroundImage: theme.CMS.backgroundImage }}
        >
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  defaultValue={moment().add(-8, "day").format("YYYY-MM-DD")}
                  {...register("fromdate")}
                  type="date"
                />
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  defaultValue={moment().format("YYYY-MM-DD")}
                  {...register("todate")}
                  type="date"
                />
              </label>
            </div>
          </div>
          <div className="formbutton">
            <label>
              <b
                style={{
                  color: "#1f67ec",
                  fontWeight: "normal",
                  fontSize: "0.8rem",
                }}
              >
                All Time:
              </b>
              <input {...register("alltime")} type="checkbox" />
            </label>
            <Button onClick={handleSubmit(hanlde_load_AUDIT_HISTORY_DATA)}>
              Load Data
            </Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">
          <div className="datatable">{loss_data_ag_table}</div>
        </div>
      </div>
      {/* Dialog nhập audit mới */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Thêm Audit mới</DialogTitle>
        <DialogContent style={{ padding: 24 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={customerList}
                getOptionLabel={(option: any) =>
                  option.CUST_CD +
                  (option.CUST_NAME_KD ? " - " + option.CUST_NAME_KD : "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Khách hàng"
                    fullWidth
                    size="small"
                  />
                )}
                value={
                  customerList.find((c) => c.CUST_CD === newAudit.CUST_CD) ||
                  null
                }
                onChange={(_e, value) => {
                  setNewAudit({
                    ...newAudit,
                    CUST_CD: value ? value.CUST_CD : "",
                    CUST_NAME_KD: value ? value.CUST_NAME_KD : "",
                  });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.CUST_CD === value.CUST_CD
                }
                filterSelectedOptions
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CUST_NAME_KD"
                fullWidth
                size="small"
                value={newAudit.CUST_NAME_KD}
                onChange={(e) =>
                  setNewAudit({ ...newAudit, CUST_NAME_KD: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_ID"
                type="number"
                fullWidth
                size="small"
                value={newAudit.AUDIT_ID}
                onChange={(e) =>
                  setNewAudit({ ...newAudit, AUDIT_ID: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_DATE"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={newAudit.AUDIT_DATE}
                onChange={(e) =>
                  setNewAudit({ ...newAudit, AUDIT_DATE: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_NAME"
                fullWidth
                size="small"
                value={newAudit.AUDIT_NAME}
                onChange={(e) =>
                  setNewAudit({ ...newAudit, AUDIT_NAME: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_MAX_SCORE"
                type="number"
                fullWidth
                size="small"
                value={newAudit.AUDIT_MAX_SCORE}
                onChange={(e) =>
                  setNewAudit({
                    ...newAudit,
                    AUDIT_MAX_SCORE: Number(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_SCORE"
                type="number"
                fullWidth
                size="small"
                value={newAudit.AUDIT_SCORE}
                onChange={(e) =>
                  setNewAudit({
                    ...newAudit,
                    AUDIT_SCORE: Number(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_PASS_SCORE"
                type="number"
                fullWidth
                size="small"
                value={newAudit.AUDIT_PASS_SCORE}
                onChange={(e) =>
                  setNewAudit({
                    ...newAudit,
                    AUDIT_PASS_SCORE: Number(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_FILE_EXT"
                fullWidth
                size="small"
                value={newAudit.AUDIT_FILE_EXT}
                onChange={(e) =>
                  setNewAudit({ ...newAudit, AUDIT_FILE_EXT: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: 16, justifyContent: "flex-end" }}>
          <Button onClick={() => setOpenAddDialog(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusOneOutlined />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              await f_add_AUDIT_HISTORY_DATA(newAudit);
              handleSubmit(hanlde_load_AUDIT_HISTORY_DATA)
              setOpenAddDialog(false);
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog sửa audit */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Sửa thông tin Audit</DialogTitle>
        <DialogContent style={{ padding: 24 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={customerList}
                getOptionLabel={(option: any) =>
                  option.CUST_CD +
                  (option.CUST_NAME_KD ? " - " + option.CUST_NAME_KD : "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Khách hàng"
                    fullWidth
                    size="small"
                  />
                )}
                value={
                  customerList.find(
                    (c) => c.CUST_CD === (editAudit?.CUST_CD ?? "")
                  ) || null
                }
                onChange={(_e, value) => {
                  if (editAudit)
                    setEditAudit({
                      ...editAudit,
                      CUST_CD: value ? value.CUST_CD : "",
                      CUST_NAME_KD: value ? value.CUST_NAME_KD : "",
                    });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.CUST_CD === value.CUST_CD
                }
                filterSelectedOptions
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CUST_NAME_KD"
                fullWidth
                size="small"
                value={editAudit?.CUST_NAME_KD ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? { ...editAudit, CUST_NAME_KD: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_ID"
                type="number"
                fullWidth
                size="small"
                value={editAudit?.AUDIT_ID ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? { ...editAudit, AUDIT_ID: Number(e.target.value) }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_DATE"
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editAudit?.AUDIT_DATE ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? { ...editAudit, AUDIT_DATE: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_NAME"
                fullWidth
                size="small"
                value={editAudit?.AUDIT_NAME ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? { ...editAudit, AUDIT_NAME: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_MAX_SCORE"
                type="number"
                fullWidth
                size="small"
                value={editAudit?.AUDIT_MAX_SCORE ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? {
                          ...editAudit,
                          AUDIT_MAX_SCORE: Number(e.target.value),
                        }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_SCORE"
                type="number"
                fullWidth
                size="small"
                value={editAudit?.AUDIT_SCORE ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? { ...editAudit, AUDIT_SCORE: Number(e.target.value) }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_PASS_SCORE"
                type="number"
                fullWidth
                size="small"
                value={editAudit?.AUDIT_PASS_SCORE ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? {
                          ...editAudit,
                          AUDIT_PASS_SCORE: Number(e.target.value),
                        }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="AUDIT_FILE_EXT"
                fullWidth
                size="small"
                value={editAudit?.AUDIT_FILE_EXT ?? ""}
                onChange={(e) =>
                  setEditAudit(
                    editAudit
                      ? { ...editAudit, AUDIT_FILE_EXT: e.target.value }
                      : null
                  )
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSaveEditAudit}
            color="primary"
            variant="contained"
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AUDIT_HISTORY;

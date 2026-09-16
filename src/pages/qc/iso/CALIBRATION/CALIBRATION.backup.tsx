import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { AiFillFileAdd, AiOutlineEdit, AiOutlineDelete, AiOutlineReload } from "react-icons/ai";
import Swal from "sweetalert2";
import moment from "moment";
import { generalQuery, uploadQuery } from "../../../../api/Api";
import AGTable from "../../../../components/DataTable/AGTable";
import "./CALIBRATION.scss";

// Interfaces
interface Equipment {
  EQ_ID: number;
  CTR_CD: string;
  EQ_NAME: string;
  CONTROL_NO: string;
  SERIES_MODEL: string;
  MAKER: string;
  IMAGE_URL: string;
  STATUS: string;
  DEPARTMENT: string;
  LOCATION: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  id?: number;
}

interface CalibrationHistory {
  CAL_ID: number;
  CTR_CD: string;
  EQ_ID: number;
  CAL_DATE: string;
  NEXT_CAL_DATE: string;
  CAL_PERIOD: number;
  STAMP_IMAGE_URL: string;
  CAL_PERSON: string;
  REMARK: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  id?: number;
}

const CALIBRATION = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedEqId, setSelectedEqId] = useState<number | null>(null);
  const [historyList, setHistoryList] = useState<CalibrationHistory[]>([]);

  // Equipment Modal state
  const [openEqModal, setOpenEqModal] = useState(false);
  const [isEditEq, setIsEditEq] = useState(false);
  const [eqFormData, setEqFormData] = useState<Partial<Equipment>>({});
  const [eqFile, setEqFile] = useState<any>(null);

  // History Modal state
  const [openHistModal, setOpenHistModal] = useState(false);
  const [isEditHist, setIsEditHist] = useState(false);
  const [histFormData, setHistFormData] = useState<Partial<CalibrationHistory>>({});
  const [histFile, setHistFile] = useState<any>(null);

  const eqGridRef = useRef<any>(null);
  const histGridRef = useRef<any>(null);

  const loadEquipment = () => {
    generalQuery("qc_get_equipment_list", {})
      .then((res) => {
        if (res.data.tk_status !== "NG") {
          setEquipmentList(res.data.data.map((item: any, idx: number) => ({
            ...item,
            LAST_CAL_DATE: item.LAST_CAL_DATE ? moment(item.LAST_CAL_DATE).format("YYYY-MM-DD") : "",
            NEXT_CAL_DATE: item.NEXT_CAL_DATE ? moment(item.NEXT_CAL_DATE).format("YYYY-MM-DD") : "",
            id: idx
          })));
        } else {
          setEquipmentList([]);
        }
      })
      .catch((err) => console.log(err));
  };

  const loadHistory = (eqId: number) => {
    generalQuery("qc_get_calibration_history", { EQ_ID: eqId })
      .then((res) => {
        if (res.data.tk_status !== "NG") {
          setHistoryList(res.data.data.map((item: any, idx: number) => ({
            ...item,
            CAL_DATE: moment(item.CAL_DATE).format("YYYY-MM-DD"),
            NEXT_CAL_DATE: moment(item.NEXT_CAL_DATE).format("YYYY-MM-DD"),
            id: idx
          })));
        } else {
          setHistoryList([]);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    if (selectedEqId !== null) {
      loadHistory(selectedEqId);
    } else {
      setHistoryList([]);
    }
  }, [selectedEqId]);

  // Equipment Handlers
  const handleSaveEq = async () => {
    let imageUrl = eqFormData.IMAGE_URL || "";
    if (eqFile && eqFile.length > 0) {
      const fileName = `EQ_${Date.now()}_${eqFile[0].name}`;
      const res = await uploadQuery(eqFile[0], fileName, "calibration");
      if (res.data.tk_status !== "NG") {
        imageUrl = fileName;
      } else {
        Swal.fire("Lỗi", "Upload ảnh thất bại", "error");
        return;
      }
    }

    const payload = { ...eqFormData, IMAGE_URL: imageUrl };
    const cmd = isEditEq ? "qc_update_equipment" : "qc_insert_equipment";

    generalQuery(cmd, payload).then((res) => {
      if (res.data.tk_status !== "NG") {
        Swal.fire("Thành công", "Lưu thiết bị thành công", "success");
        setOpenEqModal(false);
        loadEquipment();
      } else {
        Swal.fire("Lỗi", res.data.message, "error");
      }
    });
  };

  const handleDeleteEq = (eqId: number) => {
    Swal.fire({
      title: "Xóa thiết bị?",
      text: "Xóa thiết bị sẽ xóa toàn bộ lịch sử hiệu chuẩn của nó!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("qc_delete_equipment", { EQ_ID: eqId }).then((res) => {
          if (res.data.tk_status !== "NG") {
            Swal.fire("Đã xóa", "Xóa thiết bị thành công", "success");
            loadEquipment();
            setSelectedEqId(null);
          }
        });
      }
    });
  };

  // History Handlers
  const handleSaveHist = async () => {
    let stampUrl = histFormData.STAMP_IMAGE_URL || "";
    if (histFile && histFile.length > 0) {
      const fileName = `CAL_${Date.now()}_${histFile[0].name}`;
      const res = await uploadQuery(histFile[0], fileName, "calibration");
      if (res.data.tk_status !== "NG") {
        stampUrl = fileName;
      } else {
        Swal.fire("Lỗi", "Upload ảnh tem thất bại", "error");
        return;
      }
    }

    const payload = { ...histFormData, EQ_ID: selectedEqId, STAMP_IMAGE_URL: stampUrl };
    const cmd = isEditHist ? "qc_update_calibration" : "qc_insert_calibration";

    generalQuery(cmd, payload).then((res) => {
      if (res.data.tk_status !== "NG") {
        Swal.fire("Thành công", "Lưu lịch sử thành công", "success");
        setOpenHistModal(false);
        if (selectedEqId) loadHistory(selectedEqId);
      } else {
        Swal.fire("Lỗi", res.data.message, "error");
      }
    });
  };

  const handleDeleteHist = (calId: number) => {
    Swal.fire({
      title: "Xóa lịch sử?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("qc_delete_calibration", { CAL_ID: calId }).then((res) => {
          if (res.data.tk_status !== "NG") {
            Swal.fire("Đã xóa", "Xóa lịch sử thành công", "success");
            if (selectedEqId) loadHistory(selectedEqId);
          }
        });
      }
    });
  };

  const getEqRowStyle = (params: any) => {
    if (params.data.STATUS === "BROKEN") {
      return { backgroundColor: "#f0f0f0", color: "#888", fontSize: "0.65rem" };
    }
    if (params.data.NEXT_CAL_DATE) {
      const nextCalDate = moment(params.data.NEXT_CAL_DATE).startOf('day');
      const today = moment().startOf('day');
      const daysDiff = nextCalDate.diff(today, 'days');

      if (daysDiff < -30) {
        return { backgroundColor: "#ffcccc", fontSize: "0.65rem" };
      } else if (daysDiff >= -30 && daysDiff <= 0) {
        return { backgroundColor: "#fff5cc", fontSize: "0.65rem" };
      }
    }
    return { backgroundColor: "#eaf5e1", fontSize: "0.65rem" };
  };

  const getHistRowStyle = (params: any) => {
    if (params.data.NEXT_CAL_DATE) {
      const nextCalDate = moment(params.data.NEXT_CAL_DATE).startOf('day');
      const today = moment().startOf('day');
      const daysDiff = nextCalDate.diff(today, 'days');
      console.log('daydiff', daysDiff);

      if (daysDiff < -30) {
        return { backgroundColor: "#ffcccc", fontSize: "0.65rem" };
      } else if (daysDiff >= -30 && daysDiff <= 0) {
        return { backgroundColor: "#fff5cc", fontSize: "0.65rem" };
      }
    }
    return { backgroundColor: "#eaf5e1", fontSize: "0.65rem" };
  };

  const eqColumns = [
    { field: "EQ_ID", headerName: "ID", width: 60 },
    { field: "EQ_NAME", headerName: "Tên thiết bị", width: 200 },
    { field: "CONTROL_NO", headerName: "Số quản lý", width: 150 },
    { field: "SERIES_MODEL", headerName: "Số series/Model", width: 150 },
    { field: "MAKER", headerName: "Nhà SX", width: 150 },
    {
      field: "IMAGE_URL",
      headerName: "Ảnh thiết bị",
      width: 100,
      cellRenderer: (params: any) => params.value ? (
        <a href={`/calibration/${params.value}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <img src={`/calibration/${params.value}`} style={{ height: "50px", width: "100%", objectFit: "contain", cursor: "pointer" }} alt="EQ" />
        </a>
      ) : null
    },
    {
      field: "STAMP_IMAGE_URL",
      headerName: "Ảnh tem cuối",
      width: 100,
      cellRenderer: (params: any) => params.value ? (
        <a href={`/calibration/${params.value}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <img src={`/calibration/${params.value}`} style={{ height: "50px", width: "100%", objectFit: "contain", cursor: "pointer" }} alt="STAMP" />
        </a>
      ) : null
    },
    { field: "CAL_PERIOD", headerName: "Chu kỳ (tháng)", width: 120 },
    { field: "LAST_CAL_DATE", headerName: "Ngày HC cuối", width: 150 },
    { field: "NEXT_CAL_DATE", headerName: "Ngày HC kế", width: 150 },
    { field: "STATUS", headerName: "Trạng thái", width: 120 },
    { field: "DEPARTMENT", headerName: "BP Sử dụng", width: 120 },
    { field: "LOCATION", headerName: "Vị trí", width: 120 },
    {
      field: "ACTION", headerName: "Hành động", width: 100, cellRenderer: (params: any) => (
        <div style={{ display: "flex", gap: "5px", height: "100%", alignItems: "center" }}>
          <IconButton size="small" onClick={() => { setEqFormData(params.data); setIsEditEq(true); setEqFile(null); setOpenEqModal(true); }}>
            <AiOutlineEdit color="blue" size={16} />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteEq(params.data.EQ_ID)}>
            <AiOutlineDelete color="red" size={16} />
          </IconButton>
        </div>
      )
    }
  ];

  const histColumns = [
    { field: "CAL_DATE", headerName: "Ngày hiệu chuẩn", width: 150 },
    { field: "NEXT_CAL_DATE", headerName: "Ngày HC kế tiếp", width: 150 },
    { field: "CAL_PERIOD", headerName: "Chu kỳ (tháng)", width: 120 },
    {
      field: "STAMP_IMAGE_URL",
      headerName: "Tem hiệu chuẩn",
      width: 120,
      cellRenderer: (params: any) => params.value ? (
        <a href={`/calibration/${params.value}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <img src={`/calibration/${params.value}`} style={{ height: "50px", width: "100%", objectFit: "contain", cursor: "pointer" }} alt="STAMP" />
        </a>
      ) : null
    },
    { field: "CAL_PERSON", headerName: "Người HC", width: 150 },
    { field: "REMARK", headerName: "Ghi chú", width: 200 },
    {
      field: "ACTION", headerName: "Hành động", width: 100, cellRenderer: (params: any) => (
        <div style={{ display: "flex", gap: "5px", height: "100%", alignItems: "center" }}>
          <IconButton size="small" onClick={() => { setHistFormData(params.data); setIsEditHist(true); setHistFile(null); setOpenHistModal(true); }}>
            <AiOutlineEdit color="blue" size={16} />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteHist(params.data.CAL_ID)}>
            <AiOutlineDelete color="red" size={16} />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <div className="calibration">
      <div className="top_section">
        <AGTable
          toolbar={
            <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: '10px' }}>
              <Button variant="contained" size="small" startIcon={<AiFillFileAdd />} onClick={() => { setEqFormData({ STATUS: "IN_USE" }); setIsEditEq(false); setEqFile(null); setOpenEqModal(true); }}>
                Thêm Thiết bị
              </Button>
              <Button variant="contained" color="info" size="small" startIcon={<AiOutlineReload />} onClick={loadEquipment}>
                Load data
              </Button>
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', fontSize: '0.8rem' }}>
                <span style={{ backgroundColor: "#ffcccc", padding: '2px 8px', borderRadius: '4px', color: '#000' }}>Quá hạn</span>
                <span style={{ backgroundColor: "#fff5cc", padding: '2px 8px', borderRadius: '4px', color: '#000' }}>Sắp đến hạn (30 ngày)</span>
                <span style={{ backgroundColor: "#eaf5e1", padding: '2px 8px', borderRadius: '4px', color: '#000' }}>Trong hạn</span>
                <span style={{ backgroundColor: "#f0f0f0", padding: '2px 8px', borderRadius: '4px', color: '#888' }}>Đã hỏng</span>
              </div>
            </div>
          }
          ref={eqGridRef}
          data={equipmentList}
          columns={eqColumns}
          rowHeight={60}
          onRowClick={(e: any) => setSelectedEqId(e.data.EQ_ID)}
          getRowStyle={getEqRowStyle}
          onSelectionChange={(e: any) => { }}
        />
      </div>

      {selectedEqId && (
        <div className="bottom_section">

          <AGTable
            toolbar={
              <div className="toolbar" style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: '10px', justifyContent: "center", alignContent: "center" }}>
                <span style={{ fontWeight: "bold", marginRight: "20px" }}>Lịch sử hiệu chuẩn (ID: {selectedEqId})</span>
                <Button variant="contained" color="secondary" size="small" startIcon={<AiFillFileAdd />} onClick={() => { setHistFormData({ CAL_DATE: moment().format("YYYY-MM-DD"), NEXT_CAL_DATE: moment().add(1, 'year').format("YYYY-MM-DD"), CAL_PERIOD: 12 }); setIsEditHist(false); setHistFile(null); setOpenHistModal(true); }}>
                  Thêm Lịch sử
                </Button>
                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', fontSize: '0.8rem' }}>
                  <span style={{ backgroundColor: "#ffcccc", padding: '2px 8px', borderRadius: '4px' }}>Quá hạn</span>
                  <span style={{ backgroundColor: "#fff5cc", padding: '2px 8px', borderRadius: '4px' }}>Sắp đến hạn (30 ngày)</span>
                </div>
              </div>
            }
            ref={histGridRef}
            data={historyList}
            columns={histColumns}
            rowHeight={60}
            getRowStyle={getHistRowStyle}
            onSelectionChange={(e: any) => { }}
          />
        </div>
      )}

      {/* Equipment Modal */}
      <Dialog open={openEqModal} onClose={() => setOpenEqModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditEq ? "Sửa thiết bị" : "Thêm thiết bị mới"}</DialogTitle>
        <DialogContent dividers style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <TextField label="Tên thiết bị" size="small" fullWidth value={eqFormData.EQ_NAME || ""} onChange={(e) => setEqFormData({ ...eqFormData, EQ_NAME: e.target.value })} />
          <TextField label="Số quản lý" size="small" fullWidth value={eqFormData.CONTROL_NO || ""} onChange={(e) => setEqFormData({ ...eqFormData, CONTROL_NO: e.target.value })} />
          <TextField label="Số series / Model" size="small" fullWidth value={eqFormData.SERIES_MODEL || ""} onChange={(e) => setEqFormData({ ...eqFormData, SERIES_MODEL: e.target.value })} />
          <TextField label="Nhà sản xuất" size="small" fullWidth value={eqFormData.MAKER || ""} onChange={(e) => setEqFormData({ ...eqFormData, MAKER: e.target.value })} />
          <FormControl size="small" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={eqFormData.STATUS || "IN_USE"} label="Trạng thái" onChange={(e) => setEqFormData({ ...eqFormData, STATUS: e.target.value as string })}>
              <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
              <MenuItem value="BROKEN">Đã hỏng</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Bộ phận" size="small" fullWidth value={eqFormData.DEPARTMENT || ""} onChange={(e) => setEqFormData({ ...eqFormData, DEPARTMENT: e.target.value })} />
          <TextField label="Vị trí" size="small" fullWidth value={eqFormData.LOCATION || ""} onChange={(e) => setEqFormData({ ...eqFormData, LOCATION: e.target.value })} />
          <div>
            <label style={{ fontSize: "0.8rem", color: "#666" }}>Ảnh thiết bị:</label>
            <input type="file" accept="image/*" onChange={(e: any) => setEqFile(e.target.files)} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEqModal(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveEq}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* History Modal */}
      <Dialog open={openHistModal} onClose={() => setOpenHistModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditHist ? "Sửa lịch sử" : "Thêm lịch sử hiệu chuẩn"}</DialogTitle>
        <DialogContent dividers style={{ display: "flex", flexDirection: "column", gap: "15px", paddingTop: '20px' }}>
          <TextField label="Ngày hiệu chuẩn" size="small" type="date" InputLabelProps={{ shrink: true }} fullWidth value={histFormData.CAL_DATE || ""} onChange={(e) => setHistFormData({ ...histFormData, CAL_DATE: e.target.value })} />
          <TextField label="Ngày kiểm hiệu chuẩn kế tiếp" size="small" type="date" InputLabelProps={{ shrink: true }} fullWidth value={histFormData.NEXT_CAL_DATE || ""} onChange={(e) => setHistFormData({ ...histFormData, NEXT_CAL_DATE: e.target.value })} />
          <TextField label="Chu kỳ (tháng)" size="small" type="number" fullWidth value={histFormData.CAL_PERIOD || ""} onChange={(e) => setHistFormData({ ...histFormData, CAL_PERIOD: Number(e.target.value) })} />
          <TextField label="Người hiệu chuẩn" size="small" fullWidth value={histFormData.CAL_PERSON || ""} onChange={(e) => setHistFormData({ ...histFormData, CAL_PERSON: e.target.value })} />
          <TextField label="Ghi chú" size="small" fullWidth multiline rows={3} value={histFormData.REMARK || ""} onChange={(e) => setHistFormData({ ...histFormData, REMARK: e.target.value })} />
          <div>
            <label style={{ fontSize: "0.8rem", color: "#666" }}>Ảnh tem hiệu chuẩn:</label>
            <input type="file" accept="image/*" onChange={(e: any) => setHistFile(e.target.files)} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistModal(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveHist}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CALIBRATION;

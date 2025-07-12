import React, { useState, useRef } from "react";
import AGTable from "../../components/DataTable/AGTable";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Refresh,
  FileUpload as ImportExcelIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { f_createKPI, f_deleteKPI, f_loadKPI, f_loadKPIList, f_updateKPI } from "./utils/kpiUtils";
import { KPI_DATA } from "./interfaces/kpiInterface";
import "./KPIManager.scss";
type KPI_ROW = KPI_DATA & { id: number };
export const KPIManager = () => {
  // State
  const [kpiData, setKpiData] = useState<KPI_ROW[]>([]); // Chi tiết KPI
  const [kpiList, setKpiList] = useState<{KPI_NAME: string, id: number}[]>([]); // Danh sách KPI tổng quát (tên, id)
  const [selectedKPI, setSelectedKPI] = useState<{KPI_NAME: string, id: number}>({
    KPI_NAME: "",
    id: 0
  }); // KPI đang chọn
  const [selectedRows, setSelectedRows] = useState<KPI_ROW[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [form, setForm] = useState({
    KPI_NAME: "",
    KPI_YEAR: new Date().getFullYear(),
    KPI_PERIOD: "Month",
    VALUE_TYPE: "Number",
  });
  const gridRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadKPIList = () => {
    f_loadKPIList().then((data: {KPI_NAME: string}[]) => {
      setKpiList(data.map((row: {KPI_NAME: string}, idx: number) => ({ ...row, id: idx + 1 })));
    });
  }
  
  // Load danh sách KPI tổng quát khi mount
  React.useEffect(() => {
    // f_loadKPI trả về danh sách KPI tổng quát
    loadKPIList();
  }, []);

  // Khi chọn KPI ở bảng trái
  const handleSelectKPI = (kpi: {KPI_NAME: string, id: number}) => {
    setSelectedKPI(kpi);
    // Lấy chi tiết KPI này (giả sử f_loadKPI có thể filter theo tên)
    f_loadKPI(kpi.KPI_NAME).then((data: KPI_DATA[]) => {
      setKpiData(data.map((row, idx) => ({ ...row, id: idx + 1 })));
    });
  };


  // Columns for AGTable
  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "KPI_NAME", headerName: "KPI Name", width: 160, editable: false },
    { field: "KPI_YEAR", headerName: "Year", width: 80, editable: false },
    { field: "KPI_PERIOD", headerName: "Period", width: 80, editable: false },
    { field: "KPI_MONTH", headerName: "Month", width: 70, editable: false },
    {
      field: "KPI_VALUE",
      headerName: "Value",
      width: 120,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    { field: "VALUE_TYPE", headerName: "Type", width: 100, editable: false },
    {
      field: "INS_DATE",
      headerName: "Created At",
      width: 120,
      editable: false,
    },
    {
      field: "INS_EMPL",
      headerName: "Created By",
      width: 100,
      editable: false,
    },
    {
      field: "UPD_DATE",
      headerName: "Updated At",
      width: 120,
      editable: false,
    },
    {
      field: "UPD_EMPL",
      headerName: "Updated By",
      width: 100,
      editable: false,
    },
  ];
  // Load KPI data by name
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
          if (jsonData.length === 0) {
            Swal.fire("Lỗi Import", "File Excel không có dữ liệu.", "error");
            return;
          }
          // Map jsonData to KPI_ROW type, assuming headers match KPI_DATA fields
          // And generate unique 'id' for each row
          const importedKpiData: KPI_ROW[] = jsonData.map((row, index) => {
            // Basic validation or transformation can be done here
            const kpiRow: Partial<KPI_ROW> = { id: kpiData.length + index + 1 }; // Ensure unique ID
            Object.keys(row).forEach((key) => {
              // Attempt to match Excel headers to KPI_DATA fields
              // This is a simple match, might need more robust mapping for different header names
              if (
                key in form ||
                key === "KPI_VALUE" ||
                key === "KPI_MONTH" ||
                key === "CTR_CD" ||
                key === "KPI_ID" ||
                key === "INS_DATE" ||
                key === "INS_EMPL" ||
                key === "UPD_DATE" ||
                key === "UPD_EMPL"
              ) {
                (kpiRow as any)[key] = row[key];
              }
            });
            // Ensure required fields have defaults if not in Excel
            kpiRow.id = kpiData.length + index + 1; // Ensure unique ID
            kpiRow.KPI_NAME = row.KPI_NAME || form.KPI_NAME || "Imported KPI";
            kpiRow.KPI_YEAR =
              Number(row.KPI_YEAR) || form.KPI_YEAR || new Date().getFullYear();
            kpiRow.KPI_PERIOD = row.KPI_PERIOD || form.KPI_PERIOD || "Month";
            kpiRow.VALUE_TYPE = row.VALUE_TYPE || form.VALUE_TYPE || "Number";
            kpiRow.KPI_MONTH = Number(row.KPI_MONTH) || (index % 12) + 1; // Example default for month
            kpiRow.KPI_VALUE = Number(row.KPI_VALUE) || 0;
            return kpiRow as KPI_ROW;
          });
          setKpiData((prevData) => [...prevData, ...importedKpiData]);
          Swal.fire(
            "Import Thành Công",
            "Dữ liệu đã được import vào bảng.",
            "success"
          );
        } catch (error) {
          console.error("Error importing Excel: ", error);
          Swal.fire("Lỗi Import", "Có lỗi xảy ra khi đọc file Excel.", "error");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    // Reset file input to allow importing the same file again if needed
    if (event.target) {
      event.target.value = "";
    }
  };
  const handleLoadKPI = async () => {
    if (!form.KPI_NAME) {
      Swal.fire("Thông báo", "Nhập tên KPI để load", "info");
      return;
    }
    const data = await f_loadKPI(form.KPI_NAME);
    setKpiData(
      data.map(
        (row: KPI_DATA, idx: number) => ({ ...row, id: idx + 1 } as KPI_ROW)
      )
    );
    setIsCreateMode(false);
  };
  // Toolbar actions
  const handleCreate = () => {
    setForm({
      KPI_NAME: "",
      KPI_YEAR: new Date().getFullYear(),
      KPI_PERIOD: "Month",
      VALUE_TYPE: "Number",
    });
    setIsCreateMode(true);
    setOpenModal(true);
  };
  const handleModalOk = () => {
    const { KPI_NAME, KPI_YEAR, KPI_PERIOD, VALUE_TYPE } = form;
    if (!KPI_NAME || !KPI_YEAR || !KPI_PERIOD || !VALUE_TYPE) {
      Swal.fire("Lỗi", "Vui lòng nhập đủ thông tin", "error");
      return;
    }
    // Sinh 12 dòng KPI
    const newRows: KPI_ROW[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      CTR_CD: "",
      KPI_ID: i + 1,
      KPI_NAME,
      KPI_YEAR: Number(KPI_YEAR),
      KPI_PERIOD,
      KPI_MONTH: i + 1,
      KPI_VALUE: 0, // Để trống cho người dùng nhập
      VALUE_TYPE,
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "",
      UPD_EMPL: "",
    }));
    setKpiData(newRows);
    setOpenModal(false);
  };
  const handleDelete = async () => {
    if (kpiData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu KPI để xóa", "info");
      return;
    }
    const kq = await f_deleteKPI(kpiData);
    if (kq === "") {
      Swal.fire("Thông báo", "Xóa KPI thành công", "success");
      handleRefresh();
    } else {
      Swal.fire("Thông báo", kq, "error");
    }
    setSelectedRows([]);
  };
  const handleSave = () => {
    // TODO: Gọi API lưu dữ liệu KPI
    if (isCreateMode) {
      handleCreateKPI();
    } else {
      handleUpdateKPI();
    }
  };
  const handleCreateKPI = async () => {
    if (kpiData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu KPI để tạo", "info");
      return;
    }
    const kq = await f_createKPI(kpiData);
    if (kq === "") {
      Swal.fire("Thông báo", "Tạo KPI thành công", "success");
      handleRefresh();
    } else {
      Swal.fire("Thông báo", kq, "error");
    }
    setIsCreateMode(false);
  };
  const handleUpdateKPI = async () => {
    if (kpiData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu KPI để cập nhật", "info");
      return;
    }
    const kq = await f_updateKPI(kpiData);
    if (kq === "") {
      Swal.fire("Thông báo", "Cập nhật KPI thành công", "success");
      handleRefresh();
    } else {
      Swal.fire("Thông báo", kq, "error");
    }
    setIsCreateMode(false);
  };
  const handleRefresh = () => {
    handleLoadKPI();
  };
  // AGTable event handlers
  const onSelectionChange = (params: any) => {
    setSelectedRows(params.api.getSelectedRows());
  };
  // Toolbar component
  const renderToolbar = (
    <Toolbar className="kpi-toolbar">
      <Button
        startIcon={<Add />}
        onClick={handleCreate}
        variant="contained"
        color="primary"
        size="small"
      >
        Create
      </Button>
      <Button
        startIcon={<Delete />}
        onClick={handleDelete}
        variant="contained"
        color="secondary"
        size="small"
        sx={{ ml: 1 }}
      >
        Delete
      </Button>
      <Button
        startIcon={<Save />}
        onClick={handleSave}
        variant="contained"
        color="success"
        size="small"
        sx={{ ml: 1 }}
      >
        Save
      </Button>
      <Button
        startIcon={<Refresh />}
        onClick={handleRefresh}
        variant="outlined"
        size="small"
        sx={{ ml: 1 }}
      >
        Refresh
      </Button>
      <TextField
        label="KPI Name"
        size="small"
        value={form.KPI_NAME}
        onChange={(e) => setForm((f) => ({ ...f, KPI_NAME: e.target.value }))}
        sx={{ ml: 2, width: 150 }}
      />
      <Button
        startIcon={<ImportExcelIcon />}
        onClick={() => fileInputRef.current?.click()}
        variant="contained"
        color="info"
        size="small"
        sx={{ ml: 1 }}
      >
        Import Excel
      </Button>
      <Button
        onClick={handleLoadKPI}
        variant="outlined"
        size="small"
        sx={{ ml: 1 }}
      >
        Load
      </Button>
    </Toolbar>
  );
  // Columns cho bảng bên trái (danh sách KPI)
  const kpiListColumns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "KPI_NAME", headerName: "KPI Name", width: 170 },
  ];

  return (
    <Box className="kpi-manager" sx={{ display: 'flex', height: '100%' }}>
      {/* Bảng bên trái: Danh sách KPI */}
      <Box sx={{ width: 220, mr: 0, flexShrink: 0 }}>       
        <AGTable
        toolbar={<>KPI List</>}
          data={kpiList}
          columns={kpiListColumns}
          onRowClick={(params: any) => handleSelectKPI(params.data)}
          suppressRowClickSelection={false}       
          onSelectionChange={(params: any) => {

          }}  
        />
      </Box>
      {/* Bảng bên phải: Chi tiết KPI */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AGTable
          ref={gridRef}
          data={kpiData}
          columns={columns}
          toolbar={renderToolbar}
          onSelectionChange={onSelectionChange}
          showFilter={true}
          suppressRowClickSelection={false}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportExcel}
          accept=".xlsx, .xls"
          style={{ display: "none" }}
        />
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box className="kpi-modal">
            <Typography variant="h6" mb={2}>
              Tạo mới KPI
            </Typography>
            <TextField
              label="KPI Name"
              value={form.KPI_NAME}
              onChange={(e) =>
                setForm((f) => ({ ...f, KPI_NAME: e.target.value }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Year"
              type="number"
              value={form.KPI_YEAR}
              onChange={(e) =>
                setForm((f) => ({ ...f, KPI_YEAR: Number(e.target.value) }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Period"
              value={form.KPI_PERIOD}
              onChange={(e) =>
                setForm((f) => ({ ...f, KPI_PERIOD: e.target.value }))
              }
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Month">Month</MenuItem>
            </TextField>
            <TextField
              label="Value Type"
              value={form.VALUE_TYPE}
              onChange={(e) =>
                setForm((f) => ({ ...f, VALUE_TYPE: e.target.value }))
              }
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Number">Number</MenuItem>
              <MenuItem value="Percentage">Percentage</MenuItem>
            </TextField>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleModalOk} variant="contained">
                OK
              </Button>
              <Button onClick={() => setOpenModal(false)} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

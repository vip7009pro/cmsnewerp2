import React, { useEffect, useState } from "react";
import AGTable from "../../../components/DataTable/AGTable";
import SqlEditor from "../components/TestBackEnd/SqlEditor";
import {
  Box,
  Button,
  Typography,
  Toolbar,
  IconButton,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete, Save, Refresh } from "@mui/icons-material";
import MonacoEditor from "@monaco-editor/react";
import { generalQuery, getCtrCd } from "../../../api/Api";
import Swal from "sweetalert2";
import "./QueryManager.scss";
// Interface cho Query và QueryFilter
interface Query {
  QueryID: number;
  QueryName: string;
  BaseQuery: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
}
interface QueryFilter {
  FilterID: number;
  QueryID: number;
  Placeholder: string;
  Clause: string;
  ParamName: string;
  LikeType?: string;
  SkipValues?: string; // JSON array string
  CreatedAt: string;
  UpdatedAt: string;
}
const QueryManager: React.FC = () => {
  // State
  const [queryList, setQueryList] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [filterList, setFilterList] = useState<QueryFilter[]>([]);
  const [baseQuery, setBaseQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // Popup filter
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [editFilter, setEditFilter] = useState<Partial<QueryFilter> | null>(
    null
  );
  // Row filter đang chọn để sửa
  const [selectedFilter, setSelectedFilter] = useState<QueryFilter | null>(
    null
  );
  // Popup Query
  const [openQueryModal, setOpenQueryModal] = useState(false);
  const [editQuery, setEditQuery] = useState<Partial<Query> | null>(null);
  // Lấy danh sách Query khi load trang
  useEffect(() => {
    fetchQueryList();
  }, []);
  const fetchQueryList = async () => {
    setLoading(true);
    try {
      // API này cần chỉnh lại theo backend thực tế
      const res = await generalQuery("getQueryList", {});
      if (res?.data?.data) {
        setQueryList(res.data.data);
        if (res.data.data.length > 0) {
          let loaded_data: Query[] = res.data.data.map(
            (element: Query, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setQueryList(loaded_data);
          setSelectedQuery(loaded_data[0]);
          setBaseQuery(loaded_data[0].BaseQuery);
        }
      }
    } catch (e) {
      setQueryList([]);
    }
    setLoading(false);
  };
  // Khi chọn Query, load filter và baseQuery
  useEffect(() => {
    if (selectedQuery) {
      fetchFilterList(selectedQuery.QueryID);
      setBaseQuery(selectedQuery.BaseQuery);
    } else {
      setFilterList([]);
      setBaseQuery("");
    }
  }, [selectedQuery]);
  const fetchFilterList = async (queryId: number) => {
    try {
      // API này cần chỉnh lại theo backend thực tế
      console.log(queryId);
      const res = await generalQuery("getQueryFilter", { QueryID: queryId });
      if (res?.data?.data) {
        let loaded_data: QueryFilter[] = res.data.data.map(
          (element: QueryFilter, index: number) => {
            return {
              ...element,
              // SkipValues là string dạng JSON array
              SkipValues: element.SkipValues ?? "",
              id: index,
            };
          }
        );
        setFilterList(loaded_data);
      } else {
        setFilterList([]);
      }
    } catch (e) {
      setFilterList([]);
    }
  };
  // CRUD Filter
  const handleOpenAddFilter = () => {
    setEditFilter({
      QueryID: selectedQuery?.QueryID || 0,
      Placeholder: "",
      Clause: "",
      ParamName: "",
      LikeType: "",
      SkipValues: "",
    });
    setOpenFilterModal(true);
  };
  const handleOpenEditFilter = () => {
    if (!selectedFilter) return;
    setEditFilter({ ...selectedFilter });
    setOpenFilterModal(true);
  };
  const handleCloseFilterModal = () => {
    setEditFilter(null);
    setOpenFilterModal(false);
  };
  const handleSaveFilter = async () => {
    if (!editFilter) return;
    if (
      !editFilter.Placeholder ||
      !editFilter.Clause ||
      !editFilter.ParamName
    ) {
      Swal.fire("Lỗi", "Vui lòng nhập đủ thông tin bắt buộc.", "error");
      return;
    }
    try {
      let res;
      if (editFilter.FilterID) {
        // Update filter
        res = await generalQuery("updateQueryFilter", editFilter);
      } else {
        // Add filter
        console.log(editFilter);
        res = await generalQuery("addQueryFilter", editFilter);
      }
      if (res?.data?.tk_status === "OK") {
        Swal.fire("Thành công", "Đã lưu filter.", "success");
        fetchFilterList(selectedQuery!.QueryID);
        handleCloseFilterModal();
      } else {
        Swal.fire("Lỗi", res?.data?.message || "Không thể lưu filter", "error");
      }
    } catch (e) {
      Swal.fire("Lỗi", "Không thể lưu filter", "error");
    }
  };
  const handleDeleteFilter = async (filter: QueryFilter) => {
    if (!filter.FilterID) return;
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc muốn xóa filter này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (confirm.isConfirmed) {
      try {
        const res = await generalQuery("deleteQueryFilter", {
          FilterID: filter.FilterID,
        });
        if (res?.data?.tk_status === "OK") {
          Swal.fire("Đã xóa", "", "success");
          fetchFilterList(selectedQuery!.QueryID);
        } else {
          Swal.fire("Lỗi", res?.data?.message || "Không thể xóa", "error");
        }
      } catch (e) {
        Swal.fire("Lỗi", "Không thể xóa", "error");
      }
    }
  };
  // Lưu BaseQuery
  const handleSaveQuery = async () => {
    if (!selectedQuery) return;
    try {
      const res = await generalQuery("updateBaseQuery", {
        QueryID: selectedQuery.QueryID,
        BaseQuery: baseQuery,
      });
      if (res?.data?.tk_status === "OK") {
        Swal.fire("Đã lưu BaseQuery", "", "success");
        fetchQueryList();
      } else {
        Swal.fire("Lỗi", res?.data?.message || "Không thể lưu", "error");
      }
    } catch (e) {
      Swal.fire("Lỗi", "Không thể lưu", "error");
    }
  };
  const handleRunQuery = async () => {
    if (!selectedQuery) return;
    try {
      const res = await generalQuery("runQuery", {
        QueryName: selectedQuery.QueryName,
        PARAMS: {
          ONLY_PENDING: true,
          LOT_VENDOR: "",
          CTR_CD: getCtrCd(),
          M_LOT_NO: "",
          DEFECT: "",
          NCR_ID: "",
          PLSP: "ALL",
        },
      });
      if (res?.data?.tk_status === "OK") {
        Swal.fire("Đã chạy Query", "", "success");
        console.log(res.data.data);
        fetchQueryList();
      } else {
        Swal.fire("Lỗi", res?.data?.message || "Không thể chạy", "error");
      }
    } catch (e) {
      Swal.fire("Lỗi", "Không thể chạy", "error");
    }
  };
  // Thêm Query
  const handleSaveQueryModal = async () => {
    if (!editQuery?.QueryName || !editQuery.BaseQuery) {
      Swal.fire("Lỗi", "Vui lòng nhập QueryName và BaseQuery", "error");
      return;
    }
    try {
      const res = await generalQuery("addQuery", {
        QueryName: editQuery.QueryName,
        Description: editQuery.Description || "",
        BaseQuery: editQuery.BaseQuery,
        IsActive: editQuery.IsActive ?? true,
      });
      if (res?.data?.tk_status === "OK") {
        Swal.fire("Thành công", "Đã thêm Query", "success");
        setOpenQueryModal(false);
        setEditQuery(null);
        fetchQueryList();
      } else {
        Swal.fire("Lỗi", res?.data?.message || "Không thể thêm", "error");
      }
    } catch (e) {
      Swal.fire("Lỗi", "Không thể thêm", "error");
    }
  };
  // Cột cho AGTable Query
  const queryColumns = [
    { field: "QueryID", headerName: "ID", width: 30 },
    { field: "QueryName", headerName: "Name", width: 100 },
    { field: "Description", headerName: "Description", width: 120 },
    { field: "CreatedAt", headerName: "Created", width: 120 },
    { field: "UpdatedAt", headerName: "Updated", width: 120 },
    {
      field: "IsActive",
      headerName: "Active",
      width: 80,
      cellRenderer: (params: any) => (params.value ? "✔️" : ""),
    },
  ];
  // Cột cho AGTable Filter
  const filterColumns = [
    { field: "FilterID", headerName: "ID", width: 30 },
    { field: "Placeholder", headerName: "Placeholder", width: 70 },
    { field: "Clause", headerName: "Clause", width: 150 },
    { field: "ParamName", headerName: "Param", width: 50 },
    {
      field: "LikeType",
      headerName: "Like",
      width: 50,
      cellRenderer: (params: any) => params.value || "--None--",
    },
    { field: "SkipValues", headerName: "Skip", width: 50 },
    /*  { field: 'CreatedAt', headerName: 'Created', width: 110 },
    { field: 'UpdatedAt', headerName: 'Updated', width: 110 }, */
    {
      field: "actions",
      headerName: "Delete",
      width: 60,
      cellRenderer: (params: any) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteFilter(params.data)}
        >
          <Delete fontSize="small" />
        </IconButton>
      ),
    },
  ];
  // Toolbar cho bảng filter
  const filterToolbar = (
    <>
      <IconButton size="small" onClick={handleOpenAddFilter}>
        <Add />
      </IconButton>
      <IconButton
        size="small"
        disabled={!selectedFilter}
        onClick={handleOpenEditFilter}
      >
        <Edit />
      </IconButton>
    </>
  );
  // Render
  return (
    <Box className="query-manager-root">
      {/* Cột trái: Query List */}
 

     
      <Box className="query-list-panel">
        <AGTable
          toolbar={
            <>
              <Typography variant="h6" sx={{ flex: 1, fontSize: 16 }}>
                Query List
              </Typography>
              <IconButton size="small" onClick={() => fetchQueryList()}>
                <Refresh />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setEditQuery({
                    QueryName: "",
                    BaseQuery: "",
                    Description: "",
                    IsActive: true,
                  });
                  setOpenQueryModal(true);
                }}
              >
                <Add />
              </IconButton>
            </>
          }
          data={queryList}
          columns={queryColumns}
          onRowClick={(row: any) => {
            setSelectedQuery(row.data);
            fetchFilterList(row.data.QueryID);
          }}
          onSelectionChange={() => {}}
        />
      </Box>
      {/* Cột giữa: Filter List */}
      <Box className="filter-list-panel">
        <AGTable
          toolbar={
            <>
              <Typography variant="h6" sx={{ flex: 1, fontSize: 16 }}>
                Query Filters ({selectedQuery?.QueryName})
              </Typography>
              {filterToolbar}
            </>
          }
          data={filterList}
          columns={filterColumns}
          onRowClick={(row: any) => {
            setSelectedFilter(row.data);
            console.log(row.data);
          }}
          onSelectionChange={() => {}}
        />
      </Box>
     
      {/* Cột phải: SQL Editor */}
      <Box className="sql-editor-panel">
        <Toolbar className="sql-toolbar">
          <Typography variant="h6" sx={{ flex: 1, fontSize: 16 }}>
            Base Query
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<Save />}
            onClick={handleRunQuery}
          >
            Run Query
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Save />}
            onClick={handleSaveQuery}
          >
            Save Query
          </Button>
        </Toolbar>
        <Box sx={{ height: "100%" }}>
          <div style={{ width: "100%" }}>
            <MonacoEditor
              height="80vh"
              defaultLanguage="sql"
              value={baseQuery}
              onChange={(e) => {
                setBaseQuery(e ?? "");
              }}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                formatOnPaste: true,
                formatOnType: true,
                wordWrap: "on",
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>
        </Box>
      </Box>
      {/* Popup thêm/sửa filter */}
      <Modal open={openFilterModal} onClose={handleCloseFilterModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            minWidth: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editFilter?.FilterID ? "Sửa Filter" : "Thêm Filter"}
          </Typography>
          <TextField
            label="Placeholder"
            value={editFilter?.Placeholder || ""}
            onChange={(e) =>
              setEditFilter((f) => ({ ...f!, Placeholder: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Clause"
            value={editFilter?.Clause || ""}
            onChange={(e) =>
              setEditFilter((f) => ({ ...f!, Clause: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Param Name"
            value={editFilter?.ParamName || ""}
            onChange={(e) => {
              setEditFilter((f) => ({
                ...f!,
                ParamName: e.target.value,
                Placeholder: "{{" + e.target.value + "}}",
              }));
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Like Type"
            value={editFilter?.LikeType || ""}
            onChange={(e) =>
              setEditFilter((f) => ({ ...f!, LikeType: e.target.value }))
            }
            fullWidth
            margin="normal"
          >
            <MenuItem value="">--None--</MenuItem>
            <MenuItem value="both">both</MenuItem>
            <MenuItem value="left">left</MenuItem>
            <MenuItem value="right">right</MenuItem>
          </TextField>
          <TextField
            label="Skip Values"
            value={editFilter?.SkipValues || ""}
            onChange={(e) =>
              setEditFilter((f) => ({
                ...f!,
                SkipValues: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
          <Box className="popup-actions">
            <Button variant="contained" onClick={handleSaveFilter}>
              {editFilter?.FilterID ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCloseFilterModal}>Hủy</Button>
          </Box>
        </Box>
      </Modal>
      {/* Popup thêm Query */}
      <Modal open={openQueryModal} onClose={() => setOpenQueryModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            minWidth: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Thêm Query
          </Typography>
          <TextField
            label="Query Name"
            value={editQuery?.QueryName || ""}
            onChange={(e) =>
              setEditQuery((q) => ({ ...q!, QueryName: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={editQuery?.Description || ""}
            onChange={(e) =>
              setEditQuery((q) => ({ ...q!, Description: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Base Query"
            value={editQuery?.BaseQuery || ""}
            onChange={(e) =>
              setEditQuery((q) => ({ ...q!, BaseQuery: e.target.value }))
            }
            fullWidth
            multiline
            minRows={6}
            margin="normal"
          />
          <TextField
            select
            label="Is Active"
            value={editQuery?.IsActive ? "true" : "false"}
            onChange={(e) =>
              setEditQuery((q) => ({
                ...q!,
                IsActive: e.target.value === "true",
              }))
            }
            fullWidth
            margin="normal"
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
          <Box className="popup-actions">
            <Button variant="contained" onClick={handleSaveQueryModal}>
              Thêm mới
            </Button>
            <Button onClick={() => setOpenQueryModal(false)}>Hủy</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default QueryManager;

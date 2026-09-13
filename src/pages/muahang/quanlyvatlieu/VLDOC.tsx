import React, { useEffect, useState, useRef, useCallback } from "react";
import { IconButton } from "@mui/material";
import { checkBP } from "../../../api/services/permissionService";
import { f_downloadFile } from "../../../api/services/fileService";
import AGTable from "../../../components/DataTable/AGTable";
import { getUserData, uploadQuery } from "../../../api/Api";
import Swal from "sweetalert2";
import moment from "moment";
import DocumentComponent from "../../../components/DocumentComponent/DocumentComponent";
import { BiDownload } from "react-icons/bi";
import { FiEye, FiSearch, FiUploadCloud, FiSave, FiX, FiFileText } from "react-icons/fi";
import { MAT_DOC_DATA } from "../interfaces/muaInterface";
import { f_updateDtcApp, f_updatePurApp, f_updateRndApp } from "../../rnd/utils/rndUtils";
import {
  f_autoUpdateDocUSE_YN,
  f_checkDocVersion,
  f_getMaterialDocData,
  f_insertMaterialDocData,
  f_updateMaterialDocData,
} from "../utils/muaUtils";

interface VLDOCProps {
  M_ID: number;
  M_NAME: string;
}

const VLDOC: React.FC<VLDOCProps> = ({ M_ID, M_NAME }) => {
  const [matDocData, setMatDocData] = useState<MAT_DOC_DATA[]>([]);
  const [filteredMatDocData, setFilteredMatDocData] = useState<MAT_DOC_DATA[]>([]);
  const [showDoc, setShowDoc] = useState(false);
  const [filterValues, setFilterValues] = useState({
    M_NAME: M_NAME || "",
    DOC_TYPE: "ALL",
    REG_DATE: moment().format("YYYY-MM-DD"),
    EXP_DATE: moment().format("YYYY-MM-DD"),
    EXP_YN: "N",
  });
  const gridRef = useRef<any>(null);
  const [selected_M_ID, setSelected_M_ID] = useState(0);
  const [selected_DOC_TYPE, setSelected_DOC_TYPE] = useState("ALL");
  const [selected_VER, setSelected_VER] = useState(0);

  // 1. Tìm kiếm danh sách tài liệu
  const handleSearch = useCallback(async () => {
    try {
      const data = await f_getMaterialDocData(filterValues);
      setMatDocData(data || []);
    } catch (error) {
      console.error(error);
    }
  }, [filterValues]);

  // 2. Upload tài liệu PDF mới
  const handleUploadDoc = useCallback(() => {
    if (filterValues.DOC_TYPE === "ALL") {
      Swal.fire("Thông báo", "Vui lòng chọn loại tài liệu cụ thể (TDS, SGS hoặc MSDS)", "warning");
      return;
    }
    if (!filterValues.M_NAME.trim()) {
      Swal.fire("Thông báo", "Vui lòng nhập hoặc chọn mã vật liệu", "warning");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;

      const ver: number = await f_checkDocVersion({ M_ID, DOC_TYPE: filterValues.DOC_TYPE });
      const file = target.files[0];
      const ext = file.name.split(".").pop();
      const filename = `${M_ID}_${filterValues.DOC_TYPE}_${ver}.${ext}`;
      const uploadfoldername = "materialdocs";

      try {
        const response = await uploadQuery(file, filename, uploadfoldername);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", `Upload file ${filename} thành công`, "success");
          await f_insertMaterialDocData({
            M_ID,
            M_NAME,
            DOC_TYPE: filterValues.DOC_TYPE,
            FILE_NAME: filename,
            VER: ver,
          });
          handleSearch();
        } else {
          Swal.fire("Thông báo", "Upload file thất bại: " + response.data.message, "error");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        Swal.fire("Lỗi", "Không thể upload file", "error");
      }
    };

    input.click();
  }, [filterValues, M_ID, M_NAME, handleSearch]);

  // 3. Cập nhật hồ sơ hàng loạt
  const handleUpdateDoc = useCallback(() => {
    checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
      if (filteredMatDocData.length === 0) {
        Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 dòng tài liệu trên bảng để cập nhật", "warning");
        return;
      }

      for (let i = 0; i < filteredMatDocData.length; i++) {
        await f_updateMaterialDocData({
          DOC_ID: filteredMatDocData[i].DOC_ID,
          REG_DATE: filteredMatDocData[i].REG_DATE,
          EXP_DATE: filteredMatDocData[i].EXP_DATE,
          EXP_YN: filteredMatDocData[i].EXP_YN.toUpperCase(),
          USE_YN: filteredMatDocData[i].USE_YN.toUpperCase(),
        });
      }
      handleSearch();
      Swal.fire("Thông báo", "Cập nhật hồ sơ tài liệu thành công", "success");
    });
  }, [filteredMatDocData, handleSearch]);

  // 4. Phê duyệt Mua Hàng (PUR)
  const handlePurApp = useCallback((DOC_ID: number, APP_VALUE: string) => {
    f_updatePurApp({ DOC_ID, PUR_APP: APP_VALUE })
      .then(() => handleSearch())
      .catch((err) => console.error(err));
  }, [handleSearch]);

  // 5. Phê duyệt Độ Tin Cậy (DTC)
  const handleDtcApp = useCallback((DOC_ID: number, APP_VALUE: string) => {
    f_updateDtcApp({ DOC_ID, DTC_APP: APP_VALUE })
      .then(() => handleSearch())
      .catch((err) => console.error(err));
  }, [handleSearch]);

  // 6. Phê duyệt R&D
  const handleRndApp = useCallback((DOC_ID: number, APP_VALUE: string) => {
    f_updateRndApp({ DOC_ID, RND_APP: APP_VALUE })
      .then(() => handleSearch())
      .catch((err) => console.error(err));
  }, [handleSearch]);

  // Cấu hình các cột AG-Grid phong cách Google Stitch High-Density
  const columns = [
    {
      field: "DOC_ID",
      headerName: "DOC ID",
      width: 75,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}>#{params.value}</span>
      ),
    },
    {
      field: "USE_YN",
      headerName: "TRẠNG THÁI",
      width: 85,
      cellRenderer: (params: any) => {
        const isUse = params.value === "Y";
        return (
          <span className={`precision-qlvl-chip ${isUse ? "precision-qlvl-chip--active" : "precision-qlvl-chip--locked"}`}>
            {isUse ? "USE" : "LOCKED"}
          </span>
        );
      },
    },
    {
      field: "DOC_TYPE",
      headerName: "LOẠI DOC",
      width: 85,
      cellRenderer: (params: any) => {
        let typeColor = "#0369a1";
        let typeBg = "#f0f9ff";
        if (params.value === "SGS") {
          typeColor = "#047857";
          typeBg = "#ecfdf5";
        } else if (params.value === "MSDS") {
          typeColor = "#b45309";
          typeBg = "#fffbeb";
        }
        return (
          <span
            style={{
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: 10.5,
              fontWeight: 800,
              fontFamily: "JetBrains Mono",
              backgroundColor: typeBg,
              color: typeColor,
              border: `1px solid ${typeColor}40`,
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "M_NAME",
      headerName: "MÃ VẬT LIỆU",
      width: 140,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, color: "#1d4ed8" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "VER",
      headerName: "VER",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, color: "#475569" }}>
          v.{params.value}
        </span>
      ),
    },
    { field: "FILE_NAME", headerName: "TÊN TẬP TIN", width: 170 },
    {
      field: "FILE",
      headerName: "THAO TÁC",
      width: 130,
      cellRenderer: (params: any) => {
        const canDownload =
          params.data.PUR_APP === "Y" &&
          params.data.DTC_APP === "Y" &&
          params.data.RND_APP === "Y";

        return (
          <div style={{ display: "flex", gap: 6, alignItems: "center", height: "100%" }}>
            <button
              type="button"
              className="vldoc-btn-action vldoc-btn-action--view"
              onClick={() => {
                setSelected_M_ID(params.data.M_ID);
                setSelected_DOC_TYPE(params.data.DOC_TYPE);
                setSelected_VER(params.data.VER);
                setShowDoc(true);
              }}
              title="Xem nội dung tài liệu PDF"
            >
              <FiEye size={10} style={{ marginRight: 3 }} />
              Xem
            </button>

            {canDownload && (
              <IconButton
                size="small"
                sx={{
                  padding: "2px",
                  color: "#059669",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  "&:hover": { backgroundColor: "#d1fae5" },
                }}
                onClick={() => {
                  const hrefLink = "/materialdocs/" + params.data.FILE_NAME;
                  f_downloadFile(hrefLink, `${params.data.FILE_NAME}_${params.data.M_NAME}.pdf`);
                }}
                title="Tải tập tin về máy"
              >
                <BiDownload size={13} />
              </IconButton>
            )}
          </div>
        );
      },
    },
    { field: "REG_DATE", headerName: "NGÀY ĐĂNG KÝ", width: 110 },
    { field: "EXP_DATE", headerName: "HẠN HIỆU LỰC", width: 110 },
    {
      field: "EXP_YN",
      headerName: "HẾT HẠN (EXP)",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <select
            value={params.data.EXP_YN}
            onChange={(e) => {
              const val = e.target.value;
              setMatDocData((prev) =>
                prev.map((item) =>
                  item.DOC_ID === params.data.DOC_ID ? { ...item, EXP_YN: val } : item
                )
              );
            }}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              padding: "1px 4px",
              height: 22,
              backgroundColor: params.data.EXP_YN === "Y" ? "#fff1f2" : "#f8fafc",
              color: params.data.EXP_YN === "Y" ? "#e11d48" : "#0f172a",
            }}
          >
            <option value="N">N (Hiệu Lực)</option>
            <option value="Y">Y (Hết Hạn)</option>
          </select>
        );
      },
    },
    {
      field: "PUR_APP",
      headerName: "PUR DUYỆT",
      width: 140,
      cellRenderer: (params: any) => {
        if (params.data.PUR_APP === "P") {
          return (
            <div style={{ display: "flex", gap: 4, alignItems: "center", height: "100%" }}>
              <button
                type="button"
                className="vldoc-btn-action vldoc-btn-action--approve"
                onClick={() => {
                  checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
                    handlePurApp(params.data.DOC_ID, "Y");
                  });
                }}
              >
                Duyệt
              </button>
              <button
                type="button"
                className="vldoc-btn-action vldoc-btn-action--reject"
                onClick={() => {
                  checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
                    handlePurApp(params.data.DOC_ID, "N");
                  });
                }}
              >
                Từ Chối
              </button>
            </div>
          );
        } else if (params.data.PUR_APP === "Y") {
          return <span className="vldoc-app-chip vldoc-app-chip--approved">ĐÃ DUYỆT</span>;
        } else {
          return <span className="vldoc-app-chip vldoc-app-chip--rejected">TỪ CHỐI</span>;
        }
      },
    },
    {
      field: "DTC_APP",
      headerName: "DTC DUYỆT",
      width: 140,
      cellRenderer: (params: any) => {
        if (params.data.DTC_APP === "P") {
          return (
            <div style={{ display: "flex", gap: 4, alignItems: "center", height: "100%" }}>
              <button
                type="button"
                className="vldoc-btn-action vldoc-btn-action--approve"
                onClick={() => {
                  checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], async () => {
                    if (getUserData()?.SUBDEPTNAME === "ĐỘ TIN CẬY") {
                      handleDtcApp(params.data.DOC_ID, "Y");
                    } else {
                      Swal.fire("Thông báo", "Bạn không thuộc bộ phận Độ Tin Cậy", "error");
                    }
                  });
                }}
              >
                Duyệt
              </button>
              <button
                type="button"
                className="vldoc-btn-action vldoc-btn-action--reject"
                onClick={() => {
                  checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], async () => {
                    if (getUserData()?.SUBDEPTNAME === "ĐỘ TIN CẬY") {
                      handleDtcApp(params.data.DOC_ID, "N");
                    } else {
                      Swal.fire("Thông báo", "Bạn không thuộc bộ phận Độ Tin Cậy", "error");
                    }
                  });
                }}
              >
                Từ Chối
              </button>
            </div>
          );
        } else if (params.data.DTC_APP === "Y") {
          return <span className="vldoc-app-chip vldoc-app-chip--approved">ĐÃ DUYỆT</span>;
        } else {
          return <span className="vldoc-app-chip vldoc-app-chip--rejected">TỪ CHỐI</span>;
        }
      },
    },
    {
      field: "RND_APP",
      headerName: "R&D DUYỆT",
      width: 140,
      cellRenderer: (params: any) => {
        if (params.data.RND_APP === "P") {
          return (
            <div style={{ display: "flex", gap: 4, alignItems: "center", height: "100%" }}>
              <button
                type="button"
                className="vldoc-btn-action vldoc-btn-action--approve"
                onClick={() => {
                  checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], async () => {
                    handleRndApp(params.data.DOC_ID, "Y");
                  });
                }}
              >
                Duyệt
              </button>
              <button
                type="button"
                className="vldoc-btn-action vldoc-btn-action--reject"
                onClick={() => {
                  checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], async () => {
                    handleRndApp(params.data.DOC_ID, "N");
                  });
                }}
              >
                Từ Chối
              </button>
            </div>
          );
        } else if (params.data.RND_APP === "Y") {
          return <span className="vldoc-app-chip vldoc-app-chip--approved">ĐÃ DUYỆT</span>;
        } else {
          return <span className="vldoc-app-chip vldoc-app-chip--rejected">TỪ CHỐI</span>;
        }
      },
    },
    { field: "PUR_EMPL", headerName: "NGƯỜI PUR", width: 85 },
    { field: "DTC_EMPL", headerName: "NGƯỜI DTC", width: 85 },
    { field: "RND_EMPL", headerName: "NGƯỜI RND", width: 85 },
    { field: "PUR_APP_DATE", headerName: "NGÀY PUR DUYỆT", width: 120 },
    { field: "DTC_APP_DATE", headerName: "NGÀY DTC DUYỆT", width: 120 },
    { field: "RND_APP_DATE", headerName: "NGÀY RND DUYỆT", width: 120 },
    { field: "INS_DATE", headerName: "NGÀY TẠO", width: 120 },
    { field: "INS_EMPL", headerName: "NGƯỜI TẠO", width: 85 },
  ];

  useEffect(() => {
    handleSearch();
    f_autoUpdateDocUSE_YN({});
  }, [handleSearch]);

  return (
    <div className="precision-vldoc">
      {/* 1. Toolbar Tra Cứu & Hành Động */}
      <div className="precision-vldoc__toolbar">
        <div className="precision-vldoc__toolbarLeft">
          <input
            type="text"
            className="precision-vldoc__inputMaterial"
            placeholder="Mã vật liệu (VD: NY-PET-01)..."
            value={filterValues.M_NAME}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, M_NAME: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <select
            className="precision-vldoc__selectType"
            value={filterValues.DOC_TYPE}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, DOC_TYPE: e.target.value }))}
          >
            <option value="ALL">Tất Cả Loại (ALL)</option>
            <option value="TDS">TDS</option>
            <option value="SGS">SGS</option>
            <option value="MSDS">MSDS</option>
          </select>

          <button
            type="button"
            className="precision-vldoc__btn precision-vldoc__btn--search"
            onClick={handleSearch}
          >
            <FiSearch size={12} />
            <span>Tìm Kiếm</span>
          </button>

          <button
            type="button"
            className="precision-vldoc__btn precision-vldoc__btn--upload"
            onClick={() => {
              checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
                handleUploadDoc();
              });
            }}
          >
            <FiUploadCloud size={13} />
            <span>Upload Tài Liệu (PDF)</span>
          </button>

          <button
            type="button"
            className="precision-vldoc__btn precision-vldoc__btn--update"
            onClick={handleUpdateDoc}
          >
            <FiSave size={12} />
            <span>Lưu Cập Nhật ({filteredMatDocData.length})</span>
          </button>
        </div>

        <div className="precision-vldoc__toolbarRight">
          <span>
            Tổng hồ sơ: <strong>{matDocData.length}</strong> bản ghi
          </span>
        </div>
      </div>

      {/* 2. Khung Bảng AGTable Chiếm Trọn 100% Chiều Cao */}
      <div className="precision-vldoc__gridContainer">
        <AGTable
          data={matDocData}
          columns={columns}
          rowHeight={30}
          ref={gridRef}
          onSelectionChange={(e: any) => {
            setFilteredMatDocData(e!.api.getSelectedRows());
          }}
        />
      </div>

      {/* 3. Popup Viewer Xem Tài Liệu PDF Đẳng Cấp & Sang Trọng */}
      {showDoc && (
        <div className="precision-vldoc-viewer-overlay">
          <div className="precision-vldoc-viewer-card">
            <div className="precision-vldoc-viewer-header">
              <div className="precision-vldoc-viewer-title">
                <FiFileText size={16} style={{ color: "#38bdf8" }} />
                <span>
                  Xem Tài Liệu Kỹ Thuật • {selected_DOC_TYPE} (M_ID: {selected_M_ID}, Version: v.{selected_VER})
                </span>
              </div>
              <IconButton
                size="small"
                onClick={() => setShowDoc(false)}
                sx={{ color: "#ffffff", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" } }}
                title="Đóng cửa sổ xem tài liệu"
              >
                <FiX size={18} />
              </IconButton>
            </div>
            <div className="precision-vldoc-viewer-body">
              <DocumentComponent M_ID={selected_M_ID} DOC_TYPE={selected_DOC_TYPE} VER={selected_VER} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VLDOC);

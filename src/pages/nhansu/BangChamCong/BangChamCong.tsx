import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { generalQuery, getCompany } from "../../../api/Api";
import { checkBP } from "../../../api/services/permissionService";
import { SaveExcel } from "../../../api/services/excelService";
import AGTable from "../../../components/DataTable/AGTable";
import {
  BANGCHAMCONG_DATA2,
  CA_INFO,
} from "../interfaces/nhansuInterface";
import { f_setCaDiemDanh } from "../utils/nhansuUtils";

// Precision Subcomponents & Utilities
import "./BangChamCong.scss";
import "./PrecisionBangChamCong/PrecisionBangChamCong.scss";
import {
  formatChamCongRawData,
} from "./PrecisionBangChamCong/ChamCongCalculationUtils";
import {
  getChamCongColumns,
  getPivotFieldsChamCong,
} from "./PrecisionBangChamCong/PrecisionChamCongColumns";
import PrecisionChamCongHeader from "./PrecisionBangChamCong/PrecisionChamCongHeader";
import PrecisionChamCongToolbar from "./PrecisionBangChamCong/PrecisionChamCongToolbar";
import PrecisionChamCongMiniKpi from "./PrecisionBangChamCong/PrecisionChamCongMiniKpi";
import PrecisionChamCongPivotModal from "./PrecisionBangChamCong/PrecisionChamCongPivotModal";

const BANGCHAMCONG = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [loading, setLoading] = useState(false);
  const [cainfo, setCaInfo] = useState<CA_INFO[]>([]);
  const [bangchamcong2, setBangChamCong2] = useState<BANGCHAMCONG_DATA2[]>([]);
  const selectedRows = useRef<BANGCHAMCONG_DATA2[]>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [trunghiviec, setTruNghiViec] = useState(true);
  const [trunghisinh, setTruNghiSinh] = useState(true);

  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: getPivotFieldsChamCong(),
        store: [],
      })
    );

  const columns = useMemo(() => getChamCongColumns(), []);

  const loadCaInfo = () => {
    generalQuery("loadCaInfo", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCaInfo(response.data.data || []);
        }
      })
      .catch((err) => console.log(err));
  };

  const loadBangChamCong2 = () => {
    setLoading(true);
    Swal.fire({
      title: "Tra data chấm công",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });

    generalQuery("loadC0012", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      TRUNGHIVIEC: trunghiviec,
      TRUNGHISINH: trunghisinh,
    })
      .then((response) => {
        setLoading(false);
        if (response.data.tk_status !== "NG") {
          const formatted = formatChamCongRawData(response.data.data || []);
          setBangChamCong2(formatted);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: getPivotFieldsChamCong(),
              store: formatted,
            })
          );
          Swal.fire(
            "Thông báo",
            `Đã tải ${formatted.length} dòng chấm công thành công!`,
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire("Thông báo", "Có lỗi: " + error, "error");
      });
  };

  const handleFixTime = () => {
    if (selectedRows.current.length === 0) {
      Swal.fire("Thông báo", "Chưa chọn dòng nào", "warning");
      return;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn fix time không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        for (let i = 0; i < selectedRows.current.length; i++) {
          const row = selectedRows.current[i];
          if (row.ON_OFF === null) {
            await generalQuery("setdiemdanhnhom2", {
              APPLY_DATE: row.DATE_COLUMN,
              diemdanhvalue:
                row.IN_TIME?.includes("Thiếu") && row.OUT_TIME?.includes("Thiếu")
                  ? 0
                  : 1,
              EMPL_NO: row.EMPL_NO,
              CURRENT_TEAM:
                row.WORK_SHIF_NAME === "Hành Chính"
                  ? 0
                  : row.WORK_SHIF_NAME === "TEAM 1"
                  ? 1
                  : 2,
              CURRENT_CA:
                row.WORK_SHIF_NAME === "Hành Chính" ? 0 : row.CALV ?? 0,
            }).catch((e) => console.log(e));
          }

          await generalQuery("fixTime", {
            APPLY_DATE: row.DATE_COLUMN,
            EMPL_NO: row.EMPL_NO,
            IN_TIME: row.FIXED_IN_TIME,
            OUT_TIME: row.FIXED_OUT_TIME,
            WORK_HOUR: row.WORK_HOUR,
          }).catch((e) => console.log(e));
        }
        setLoading(false);
        Swal.fire("Thông báo", "Fix time thành công", "success");
      }
    });
  };

  const handleFixTimeAutoHangLoat = () => {
    if (selectedRows.current.length === 0) {
      Swal.fire("Thông báo", "Chưa chọn dòng nào", "warning");
      return;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn fix time tự động hàng loạt?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await generalQuery("fixTimehangloat", {
          TIME_DATA: selectedRows.current,
        })
          .then((response) => {
            setLoading(false);
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Fix time tự động thành công", "success");
            } else {
              Swal.fire("Thông báo", "Fix time thất bại: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            setLoading(false);
            Swal.fire("Thông báo", "Có lỗi: " + error, "error");
          });
      }
    });
  };

  const handleSETCA = (CALV: number) => {
    if (selectedRows.current.length === 0) {
      Swal.fire("Thông báo", "Chưa chọn dòng nào", "warning");
      return;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn set ca không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        for (let i = 0; i < selectedRows.current.length; i++) {
          const row = selectedRows.current[i];
          await f_setCaDiemDanh({
            EMPL_NO: row.EMPL_NO,
            APPLY_DATE: row.DATE_COLUMN,
            CALV: CALV,
          });
        }
        setLoading(false);
        loadBangChamCong2();
        Swal.fire("Thông báo", "Set Ca thành công", "success");
      }
    });
  };

  useEffect(() => {
    loadCaInfo();
  }, []);

  return (
    <div className="precision-chamcong">
      {/* 1. Sub-Header */}
      <PrecisionChamCongHeader totalCount={bangchamcong2.length} />

      {/* 2. Action Toolbar & Mini-KPI */}
      <div className="precision-chamcong__toolbar">
        <PrecisionChamCongToolbar
          fromDate={fromdate}
          setFromDate={setFromDate}
          toDate={todate}
          setToDate={setToDate}
          truNghiViec={trunghiviec}
          setTruNghiViec={setTruNghiViec}
          truNghiSinh={trunghisinh}
          setTruNghiSinh={setTruNghiSinh}
          onLoadData={() => {
            if (getCompany() === "CMS") {
              checkBP(userData, ["NHANSU"], ["ALL"], ["ALL"], loadBangChamCong2);
            } else {
              checkBP(userData, ["ALL"], ["Leader"], ["ALL"], loadBangChamCong2);
            }
          }}
          onFixTime={() => {
            checkBP(userData, ["NHANSU"], ["ALL"], ["ALL"], handleFixTime);
          }}
          onFixAutoTime={() => {
            checkBP(userData, ["NHANSU"], ["ALL"], ["ALL"], handleFixTimeAutoHangLoat);
          }}
          onSetCa={(calv) => {
            checkBP(userData, ["NHANSU"], ["ALL"], ["ALL"], () => handleSETCA(calv));
          }}
          onExportEX1={() => SaveExcel(bangchamcong2, "BangChamCong_Filtered")}
          onExportEX2={() => SaveExcel(bangchamcong2, "BangChamCong_All")}
          onOpenPivot={() => setShowHidePivotTable(true)}
          isLoading={loading}
        />

        <PrecisionChamCongMiniKpi data={bangchamcong2} />
      </div>

      {/* 3. AGTable High-Density Data Grid Container */}
      <div className="precision-chamcong__gridContainer">
        <AGTable
          suppressRowClickSelection={false}
          data={bangchamcong2}
          columns={columns}
          onSelectionChange={(e: any) => {
            const selected = e?.api?.getSelectedRows();
            if (selected) {
              selectedRows.current = selected;
            }
          }}
        />
      </div>

      {/* 4. Pivot Modal */}
      <PrecisionChamCongPivotModal
        isOpen={showhidePivotTable}
        onClose={() => setShowHidePivotTable(false)}
        dataSource={selectedDataSource}
      />
    </div>
  );
};

export default BANGCHAMCONG;

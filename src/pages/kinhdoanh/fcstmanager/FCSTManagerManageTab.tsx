import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { checkBP } from "../../../api/services/permissionService";
import { UserData } from "../../../api/GlobalInterface";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import AGTable from "../../../components/DataTable/AGTable";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { SaveExcel } from "../../../api/services/excelService";
import { FCSTTableData } from "../interfaces/kdInterface";
import PrecisionFCSTFilterPanel from "./PrecisionFCST/PrecisionFCSTFilterPanel";
import { getFCSTManageColumns } from "./PrecisionFCST/PrecisionFCSTColumns";

interface FilterState {
  fromdate: string;
  todate: string;
  codeKD: string;
  codeCMS: string;
  empl_name: string;
  cust_name: string;
  prod_type: string;
  id: string;
  po_no: string;
  material: string;
  over: string;
  invoice_no: string;
  alltime: boolean;
}

const FCSTManagerManageTab = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [isLoading, setisLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    fromdate: moment().format("YYYY-MM-DD"),
    todate: moment().format("YYYY-MM-DD"),
    codeKD: "",
    codeCMS: "",
    empl_name: "",
    cust_name: "",
    prod_type: "",
    id: "",
    po_no: "",
    material: "",
    over: "",
    invoice_no: "",
    alltime: false,
  });

  const [fcstdatatable, setFCSTDataTable] = useState<Array<FCSTTableData>>([]);
  const fcstdatatablefilter = useRef<Array<FCSTTableData>>([]);
  const gridRef = useRef<any>(null);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);

  const column_fcsttable = useMemo(() => getFCSTManageColumns(), []);

  const handleFilterChange = useCallback(
    (field: keyof FilterState, value: string | boolean) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFilterReset = useCallback(() => {
    setFilters({
      fromdate: moment().format("YYYY-MM-DD"),
      todate: moment().format("YYYY-MM-DD"),
      codeKD: "",
      codeCMS: "",
      empl_name: "",
      cust_name: "",
      prod_type: "",
      id: "",
      po_no: "",
      material: "",
      over: "",
      invoice_no: "",
      alltime: false,
    });
  }, []);

  const handletraFcst = useCallback(() => {
    setisLoading(true);
    generalQuery("traFcstDataFull", {
      alltime: filters.alltime,
      justPoBalance: true,
      start_date: filters.fromdate,
      end_date: filters.todate,
      cust_name: filters.cust_name,
      codeCMS: filters.codeCMS,
      codeKD: filters.codeKD,
      prod_type: filters.prod_type,
      empl_name: filters.empl_name,
      po_no: filters.po_no,
      over: filters.over,
      id: filters.id,
      material: filters.material,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: FCSTTableData[] = response.data.data.map(
            (element: FCSTTableData, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() == 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() == 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME_KD
                    : "TEM_NOI_BO",
              id: index,
            })
          );
          setFCSTDataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Nội dung: " + response.data.message,
            "error"
          );
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  }, [filters]);

  const deleteFcst = async () => {
    if (fcstdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < fcstdatatablefilter.current.length; i++) {
        if (fcstdatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_fcst", {
            FCST_ID: fcstdatatablefilter.current[i].FCST_ID,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
              } else {
                err_code = true;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      if (!err_code) {
        Swal.fire(
          "Thông báo",
          "Xóa FCST thành công (chỉ FCST của người đăng nhập)!",
          "success"
        );
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 FCST để xóa !", "error");
    }
  };

  const handleConfirmDeleteFcst = useCallback(() => {
    Swal.fire({
      title: "Chắc chắn muốn xóa FCST đã chọn ?",
      text: "Sẽ chỉ xóa FCST do bạn up lên",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa FCST hàng loạt", "success");
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], deleteFcst);
      }
    });
  }, [userData]);

  /* ── Export EX1 (filtered / displayed) & EX2 (raw) ── */
  const handleExportEX1 = useCallback(() => {
    let rowsToExport = fcstdatatable;
    if (gridRef.current?.api) {
      const filtered: any[] = [];
      gridRef.current.api.forEachNodeAfterFilterAndSort((node: any) => {
        if (node.data) filtered.push(node.data);
      });
      if (filtered.length > 0) rowsToExport = filtered;
    }
    SaveExcel(rowsToExport, "FCST_Data");
  }, [fcstdatatable]);

  const handleExportEX2 = useCallback(() => {
    SaveExcel(fcstdatatable, "FCST_Data_Full");
  }, [fcstdatatable]);

  /* ── DevExtreme Pivot DataSource ── */
  const pivotDataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: column_fcsttable.map((col: any) => ({
        caption: col.headerName,
        dataField: col.field,
        dataType: col.type === "number" ? "number" : "string",
        area: col.area ?? undefined,
      })),
      store: fcstdatatable,
    });
  }, [column_fcsttable, fcstdatatable]);

  /* ── Listen to events from header ── */
  useEffect(() => {
    const handleDelete = () => {
      checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleConfirmDeleteFcst);
    };
    const handlePivot = () => {
      setShowHidePivotTable((prev) => !prev);
    };
    const handleExport1 = () => handleExportEX1();
    const handleExport2 = () => handleExportEX2();

    window.addEventListener("fcst-delete-selected", handleDelete);
    window.addEventListener("fcst-toggle-pivot", handlePivot);
    window.addEventListener("fcst-export-ex1", handleExport1);
    window.addEventListener("fcst-export-ex2", handleExport2);

    return () => {
      window.removeEventListener("fcst-delete-selected", handleDelete);
      window.removeEventListener("fcst-toggle-pivot", handlePivot);
      window.removeEventListener("fcst-export-ex1", handleExport1);
      window.removeEventListener("fcst-export-ex2", handleExport2);
    };
  }, [userData, handleConfirmDeleteFcst, handleExportEX1, handleExportEX2]);

  const fcstDataAGTable = useMemo(
    () => (
      <AGTable
        ref={gridRef}
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={<></>}
        columns={column_fcsttable}
        data={fcstdatatable}
        onCellEditingStopped={() => {}}
        onRowClick={() => {}}
        onSelectionChange={(params: any) => {
          fcstdatatablefilter.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [fcstdatatable, column_fcsttable]
  );

  return (
    <div className="precision-fcst__body">
      {/* Left Filter Sidebar */}
      <PrecisionFCSTFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handletraFcst}
        onReset={handleFilterReset}
        isLoading={isLoading}
      />

      {/* Right Data Grid */}
      <div className="precision-fcst__gridContainer">
        <div className="precision-fcst__gridBody">
          {fcstDataAGTable}
        </div>
      </div>

      {/* DevExtreme Pivot Table Modal Overlay */}
      {showhidePivotTable && (
        <div
          className="precision-fcst__pivotOverlay"
          onClick={() => setShowHidePivotTable(false)}
        >
          <div
            className="precision-fcst__pivotCard"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="precision-fcst__pivotHeader">
              <div className="precision-fcst__pivotTitle">
                <span>📊</span>
                <span>
                  Bảng Phân Tích Xoay Đa Chiều Pivot (DevExtreme) — Báo Cáo FCST
                </span>
              </div>
              <button
                type="button"
                className="precision-fcst__pivotClose"
                onClick={() => setShowHidePivotTable(false)}
                title="Đóng cửa sổ Pivot"
              >
                ✕
              </button>
            </div>
            <div className="precision-fcst__pivotBody">
              <PivotTable
                datasource={pivotDataSource}
                tableID="precision_fcst_pivot"
              />
            </div>
            <div className="precision-fcst__pivotFooter">
              <button
                type="button"
                className="precision-fcst__actionBtn precision-fcst__actionBtn--primary"
                onClick={() => setShowHidePivotTable(false)}
              >
                Đóng Cửa Sổ Pivot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FCSTManagerManageTab;

import {
  forwardRef,
  lazy,
  ReactElement,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import './AGTable.scss'
import { AgGridReact } from 'ag-grid-react';
import { IconButton } from '@mui/material';
import { AiFillCloseCircle, AiFillFileExcel } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ColDef, GridApi } from 'ag-grid-community';
// DevExtreme PivotGridDataSource chỉ cần TYPE ở đây. Import runtime phải là ĐỘNG (xem effect bên dưới):
// import tĩnh sẽ kéo cả gói DevExtreme (devExtreme core + widgets ≈ 4.9 MB JS) vào đường khởi động,
// vì AGTable nằm trong graph khởi động qua Home -> PageTabs -> ... -> TableFromQueryComponent.
import type PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { MdOutlinePivotTableChart } from 'react-icons/md';
import { SaveExcel } from '../../api/services/excelService';

// PivotTable (bảng PIVOT của DevExtreme) chỉ được render khi user bấm nút PIVOT.
// Import TĨNH ở đây khiến mọi trang có bảng phải tải sẵn widget DevExtreme + theme CSS
// (~4.9 MB JS + ~774 KB CSS) — và tệ hơn: nó kéo cả 2 chunk đó vào initial bundle vì
// Home -> PageTabs -> TableFromQueryComponent -> AGTable nằm trong graph khởi động.
const PivotTable = lazy(() => import('../PivotChart/PivotChart'));

interface AGInterface {
  data: Array<any>,
  columns?: Array<any>,
  toolbar?: ReactElement,
  showFilter?: boolean,

  suppressRowClickSelection?: boolean,
  rowHeight?: number,
  columnWidth?: number,
  /**
   * Animation di chuyển row của AG Grid. Mặc định TẮT vì:
   * mỗi lần sort/filter/refresh AG Grid phải chạy transition cho mọi row
   * (× 228 chỗ dùng AGTable trong repo). Bật lại cho từng bảng nếu cần hiệu ứng.
   */
  animateRows?: boolean,
  onRowClick?: (e: any) => void,
  onCellClick?: (e: any) => void,
  onRowDoubleClick?: (e: any) => void,
  onSelectionChange: (e: any) => void,
  onCellEditingStarted?: (e: any) => void,
  onCellEditingStopped?: (e: any) => void,
  onRowDragEnd?: (e: any) => void,
  getRowStyle?: (e: any) => any,
  getRowId?: (params: any) => string
}

// ===== CÁC HẰNG/CALLBACK MẶC ĐỊNH ĐƯỢC HOIST RA MODULE SCOPE =====
// Lý do: nếu tạo mới (object/function literal) trong mỗi lần render của AGTable
// thì AG Grid coi đây là prop thay đổi (rowStyle/getRowStyle/getRowId) và sẽ
// refresh/redraw TOÀN BỘ row => mọi cell renderer bị render lại => nháy toàn bảng.
const DEFAULT_ROW_STYLE = { backgroundColor: 'transparent', height: '20px' };
const DEFAULT_GET_ROW_STYLE = (_params: any) => ({
  backgroundColor: 'transparent',
  fontSize: '0.6rem',
});
const DEFAULT_GET_ROW_ID = (params: any) => {
  if (params.data?.id !== undefined && params.data?.id !== null) return String(params.data.id);
  if (params.data?.NG_SX100_ID !== undefined && params.data?.NG_SX100_ID !== null) return String(params.data.NG_SX100_ID);
  if (params.data?.PLAN_ID !== undefined && params.data?.PLAN_ID !== null) return String(params.data.PLAN_ID);
  if (params.data?.PROD_REQUEST_NO !== undefined && params.data?.PROD_REQUEST_NO !== null) return String(params.data.PROD_REQUEST_NO);
  if (params.node?.rowIndex !== undefined && params.node?.rowIndex !== null) return `row_${params.node.rowIndex}`;
  return undefined;
};
const NOOP = () => { };

const AGTableInner = forwardRef((ag_data: AGInterface, gridRef: any) => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [selectedrow, setSelectedrow] = useState(0);

  const gridRefDefault = useRef<AgGridReact<any>>(null);

  const tableSelectionChange = useCallback(() => {
    const api = (gridRef ?? gridRefDefault).current?.api;
    const selectedrows = api?.getSelectedRows().length ?? 0;
    setSelectedrow(selectedrows);
  }, [gridRef]);

  const setHeaderHeight = useCallback((value?: number) => {
    (gridRef ?? gridRefDefault).current?.api?.setGridOption("headerHeight", value);
  }, [gridRef]);

  const defaultColDef = useMemo(() => {
    return {
      initialWidth: ag_data.columnWidth ?? 100,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      editable: true,
      floatingFilter: ag_data.showFilter ?? true,
      filter: true,
      headerCheckboxSelectionFilteredOnly: true,
    };
  }, [ag_data.showFilter, ag_data.columnWidth]);

  const defaultColumns = useMemo(() => {
    if (ag_data.data.length > 0) {
      let keys = Object.keys(ag_data.data[0]);
      return keys.map((key) => {
        return { field: key, headerName: key, width: ag_data.columnWidth ?? 100 }
      })
    }
    else return []
  }, [ag_data.data])

  const pivotDatasourcefiels = useMemo(() => {
    if (ag_data.data.length > 0) {
      let keys = Object.keys(ag_data.data[0]);
      return keys.map((key) => {
        return {
          caption: key,
          width: 80,
          dataField: key,
          allowSorting: true,
          allowFiltering: true,
          summaryType: "sum",
          format: "fixedPoint",
          headerFilter: {
            allowSearch: true,
            height: 500,
            width: 300,
          },
        }
      })
    }
    else {
      return []
    }
  }, [ag_data.data])

  // ===== PIVOT: chỉ nạp DevExtreme khi user THỰC SỰ mở bảng pivot =====
  // Trước đây: `new PivotGridDataSource(...)` chạy trong useMemo cho MỌI bảng dù panel pivot đóng,
  // và import tĩnh ở đầu file => mọi trang có bảng (và cả màn hình đăng nhập) phải tải DevExtreme.
  const [pvdts, setPvdts] = useState<PivotGridDataSource | null>(null);
  const [pivotLoading, setPivotLoading] = useState(false);
  const pivotBuiltForRef = useRef<any[] | null>(null);

  useEffect(() => {
    if (!showhidePivotTable) return;

    // Dữ liệu chưa đổi và đã có data source => tái sử dụng, mở lại panel là hiện ngay.
    if (pvdts && pivotBuiltForRef.current === ag_data.data) {
      setPivotLoading(false);
      return;
    }

    let cancelled = false;
    setPivotLoading(true);

    void (async () => {
      const mod = await import('devextreme/ui/pivot_grid/data_source');
      if (cancelled) return;
      const PivotGridDataSourceCtor = mod.default;
      setPvdts(
        new PivotGridDataSourceCtor({
          fields: pivotDatasourcefiels,
          store: ag_data.data,
        }) as unknown as PivotGridDataSource
      );
      pivotBuiltForRef.current = ag_data.data;
      setPivotLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [showhidePivotTable, pivotDatasourcefiels, ag_data.data, pvdts]);

  const onExportClick = () => {
    (gridRef ?? gridRefDefault).current?.api?.exportDataAsCsv();
  };

  const handleSelectionChanged = useCallback(
    (params: any) => {
      ag_data.onSelectionChange?.(params);
      tableSelectionChange();
    },
    [ag_data.onSelectionChange, tableSelectionChange]
  );

  const handleGridReady = useCallback(() => {
    setHeaderHeight(20);
  }, [setHeaderHeight]);

  interface RowData {
    name: string;
    age: number;
    country: string;
  }
  interface FilteredRow {
    [key: string]: any; // Key là headerName, giá trị là dữ liệu tương ứng
  }
  /**
   * Lấy các dòng đang được lọc và hiển thị từ AG Grid
   * @param gridApi - GridApi từ AG Grid
   * @returns Mảng các dòng đã lọc với key là headerName
   */
  const getFilteredDisplayedRows = (gridApi: GridApi<RowData> | null): FilteredRow[] => {
    // Kiểm tra xem gridApi có tồn tại không
    if (!gridApi) {
      console.warn('GridApi chưa được khởi tạo.');
      return [];
    }
    // Lấy các cột đang hiển thị từ GridApi
    const displayedColumns = (gridApi.getColumnDefs() || [])
      .filter((col): col is ColDef<RowData> => {
        // Kiểm tra xem col có phải là ColDef không (loại bỏ ColGroupDef)
        return 'field' in col && col.hide !== true;
      })
      .map((col) => ({
        field: col.field as keyof RowData,
        headerName: col.headerName || col.field || '',
      }));
    // Lấy dữ liệu đã lọc và hiển thị
    const filteredRows: FilteredRow[] = [];
    gridApi.forEachNodeAfterFilter((node) => {
      const row: FilteredRow = {};
      displayedColumns.forEach((col) => {
        row[col.headerName] = node.data?.[col.field];
      });
      filteredRows.push(row);
    });
    return filteredRows;
  };

  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => {
  }, [])

  return (
    <div className='agtable'>
      {ag_data.toolbar !== undefined && <div className="toolbar" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        {ag_data.toolbar}
        <IconButton
          className="buttonIcon"
          onClick={() => {
            //onExportClick();
            //onExportExcelClick();
            let kq = gridRef ? getFilteredDisplayedRows(gridRef?.current?.api!) : getFilteredDisplayedRows(gridRefDefault?.current?.api!);
            //console.log(kq);
            SaveExcel(kq, "Data Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          EX1
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(ag_data.data, "Data Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          EX2
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHidePivotTable(!showhidePivotTable);
          }}
        >
          <MdOutlinePivotTableChart color="#ff33bb" size={15} />
          PIVOT
        </IconButton>
      </div>}
      <div className="ag-theme-quartz">
        <AgGridReact
          rowDragManaged={true} // Bật tính năng kéo hàng
          animateRows={ag_data.animateRows ?? false}
          rowData={ag_data.data ?? []}
          columnDefs={ag_data.columns ?? defaultColumns}
          rowHeight={ag_data.rowHeight ? ag_data.rowHeight : 25}
          defaultColDef={defaultColDef}
          ref={gridRef ?? gridRefDefault}
          onGridReady={handleGridReady}
          columnHoverHighlight={true}
          rowStyle={DEFAULT_ROW_STYLE}
          getRowStyle={ag_data.getRowStyle ?? DEFAULT_GET_ROW_STYLE}
          getRowId={ag_data.getRowId ?? (DEFAULT_GET_ROW_ID as any)}
          rowSelection={"multiple"}
          rowMultiSelectWithClick={false}
          suppressRowClickSelection={ag_data.suppressRowClickSelection ?? true}
          enterNavigatesVertically={true}
          enterNavigatesVerticallyAfterEdit={true}
          stopEditingWhenCellsLoseFocus={true}
          rowBuffer={10}
          debounceVerticalScrollbar={false}
          enableCellTextSelection={true}
          floatingFiltersHeight={23}
          onSelectionChanged={handleSelectionChanged}
          onRowClicked={ag_data.onRowClick}
          onRowDoubleClicked={ag_data.onRowDoubleClick ?? NOOP}
          onRowDragMove={NOOP}
          onRowDragEnd={ag_data.onRowDragEnd ?? NOOP}
          onCellEditingStarted={ag_data.onCellEditingStarted}
          onCellEditingStopped={ag_data.onCellEditingStopped}
          onCellClicked={ag_data.onCellClick}
        />
      </div>
      <div className="bottombar">
        <div className="selected">
          {selectedrow !== 0 && <span>
            Selected: {selectedrow}/{ag_data.data.length} rows
          </span>}
        </div>
        <div className="totalrow">
          <span>
            Total: {ag_data.data.length} rows
          </span>
        </div>
      </div>
      {showhidePivotTable && (
        <div className="pivottable1">
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowHidePivotTable(false);
            }}
          >
            <AiFillCloseCircle color="blue" size={15} />
            Close
          </IconButton>
          {pivotLoading || !pvdts ? (
            <div style={{ padding: 12, fontSize: 12, color: '#475569' }}>
              Đang tải bảng phân tích xoay...
            </div>
          ) : (
            <Suspense
              fallback={
                <div style={{ padding: 12, fontSize: 12, color: '#475569' }}>
                  Đang tải bảng phân tích xoay...
                </div>
              }
            >
              <PivotTable
                datasource={pvdts}
                tableID="datasxtablepivot"
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  )
});

const AGTable = memo(AGTableInner as any) as any;

export default AGTable
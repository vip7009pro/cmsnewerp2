import React, { useCallback, useMemo, useRef } from "react";
import { GrAdd } from "react-icons/gr";
import { AiFillFileExcel } from "react-icons/ai";
import { MdOutlineSearch } from "react-icons/md";
import { Tooltip } from "@mui/material";
import AGTable from "../../../../components/DataTable/AGTable";
import { COMPONENT_DATA } from "../../interfaces/rndInterface";
import { SaveExcel } from "../../../../api/services/excelService";

interface PrecisionDesignAmazonTableProps {
  isOpen: boolean;
  componentList: COMPONENT_DATA[];
  latestComponentListRef: React.MutableRefObject<COMPONENT_DATA[]>;
  currentComponent: number;
  setCurrentComponent: (idx: number) => void;
  commitComponentList: (next: COMPONENT_DATA[]) => void;
  newComponent: string;
  setNewComponent: (val: string) => void;
  onAddComponent: () => Promise<void>;
}

export const PrecisionDesignAmazonTable: React.FC<PrecisionDesignAmazonTableProps> = ({
  isOpen,
  componentList,
  latestComponentListRef,
  currentComponent,
  setCurrentComponent,
  commitComponentList,
  newComponent,
  setNewComponent,
  onAddComponent,
}) => {
  const agTableRef = useRef<any>(null);
  const isAgCellEditingRef = useRef(false);
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const agColumns = useMemo(
    () =>
      [
        {
          field: "DOITUONG_STT",
          headerName: "STT",
          width: 70,
          resizable: true,
          floatingFilter: true,
          rowDrag: true,
        },
        { field: "DOITUONG_NO", headerName: "NO", width: 60, resizable: true, floatingFilter: true },
        { field: "DOITUONG_NAME", headerName: "NAME", width: 140, resizable: true, floatingFilter: true },
        {
          field: "PHANLOAI_DT",
          headerName: "TYPE",
          width: 110,
          resizable: true,
          floatingFilter: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["TEXT", "IMAGE", "1D BARCODE", "2D MATRIX", "QRCODE", "CONTAINER"],
          },
        },
        { field: "POS_X", headerName: "X", width: 80, resizable: true, floatingFilter: true },
        { field: "POS_Y", headerName: "Y", width: 80, resizable: true, floatingFilter: true },
        { field: "SIZE_W", headerName: "W", width: 80, resizable: true, floatingFilter: true },
        { field: "SIZE_H", headerName: "H", width: 80, resizable: true, floatingFilter: true },
        { field: "ROTATE", headerName: "ROT", width: 80, resizable: true, floatingFilter: true },
        { field: "FONT_NAME", headerName: "FONT", width: 100, resizable: true, floatingFilter: true },
        { field: "FONT_SIZE", headerName: "F.SIZE", width: 80, resizable: true, floatingFilter: true },
        {
          field: "FONT_STYLE",
          headerName: "F.STYLE",
          width: 90,
          resizable: true,
          floatingFilter: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["R", "B", "I", "U"],
          },
        },
        {
          field: "GIATRI",
          headerName: "GIATRI",
          width: 260,
          resizable: true,
          floatingFilter: true,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#2563eb", fontFamily: "JetBrains Mono, monospace" }}>
                {params.value}
              </span>
            );
          },
        },
        { field: "REMARK", headerName: "REMARK", width: 150, resizable: true, floatingFilter: true },
      ] as any,
    []
  );

  const onAgCellClick = useCallback(
    (params: any) => {
      const clickedId = params?.data?.id;
      const idx = latestComponentListRef.current.findIndex((x: any) => x?.id === clickedId);
      if (idx >= 0) setCurrentComponent(idx);
    },
    [latestComponentListRef, setCurrentComponent]
  );

  const onAgCellEditingStopped = useCallback(
    (e: any) => {
      isAgCellEditingRef.current = false;
      const row = e?.data;
      if (!row) return;

      const id = row?.id;
      const field = e?.colDef?.field;
      if (!field) return;

      const numericFields = new Set([
        "POS_X",
        "POS_Y",
        "SIZE_W",
        "SIZE_H",
        "ROTATE",
        "FONT_SIZE",
        "DOITUONG_NO",
        "CAVITY_PRINT",
      ]);
      const raw = row[field];
      const nextValue = numericFields.has(field) ? (Number.isFinite(Number(raw)) ? Number(raw) : 0) : raw;

      const next = latestComponentListRef.current.map((x: any) => {
        if (x?.id !== id) return x;
        return { ...x, [field]: nextValue };
      });
      commitComponentList(next);

      const curSel = latestComponentListRef.current[currentComponent] as any;
      if (curSel) {
        const nextIdx = next.findIndex((x: any) => x?.id === curSel?.id);
        if (nextIdx >= 0) setCurrentComponent(nextIdx);
      }
    },
    [commitComponentList, currentComponent, latestComponentListRef, setCurrentComponent]
  );

  const onAgRowDragEnd = useCallback(
    (params: any) => {
      const curList = latestComponentListRef.current;
      const next: COMPONENT_DATA[] = [];
      params.api.forEachNode((node: any) => {
        if (node?.data) next.push(node.data);
      });
      if (next.length !== curList.length) return;

      const curSel = curList[currentComponent];
      commitComponentList(next.map((x) => ({ ...x })));
      if (curSel) {
        const nextIdx = next.findIndex((x: any) => x?.id === (curSel as any)?.id);
        if (nextIdx >= 0) setCurrentComponent(nextIdx);
      }
    },
    [commitComponentList, currentComponent, latestComponentListRef, setCurrentComponent]
  );

  const selectedComponentId = useMemo(() => {
    const cur = latestComponentListRef.current;
    const c = cur?.[currentComponent] as any;
    return c?.id ?? null;
  }, [currentComponent, latestComponentListRef]);

  const agGetRowStyle = useCallback(
    (params: any) => {
      const rowId = params?.data?.id ?? null;
      if (selectedComponentId == null || rowId == null) return undefined;
      if (rowId !== selectedComponentId)
        return {
          backgroundColor: "transparent",
          fontWeight: 400,
          fontSize: "11.5px",
        };
      return {
        backgroundColor: "#dbeafe",
        fontWeight: 700,
        fontSize: "12px",
        color: "#1e40af",
      };
    },
    [selectedComponentId]
  );

  const filteredComponents = useMemo(() => {
    if (!searchKeyword.trim()) return componentList;
    const q = searchKeyword.toLowerCase();
    return componentList.filter(
      (c) =>
        c.DOITUONG_NAME?.toLowerCase().includes(q) ||
        c.DOITUONG_STT?.toLowerCase().includes(q) ||
        c.PHANLOAI_DT?.toLowerCase().includes(q) ||
        c.GIATRI?.toLowerCase().includes(q) ||
        c.REMARK?.toLowerCase().includes(q)
    );
  }, [componentList, searchKeyword]);

  if (!isOpen) return null;

  return (
    <div className="precision-amz-design__tableDock">
      <div className="precision-amz-design__tableToolbar">
        <div className="precision-amz-design__tableToolbarLeft">
          <div className="precision-amz-design__searchBox">
            <MdOutlineSearch size={16} className="precision-amz-design__searchIcon" />
            <input
              type="text"
              placeholder="Lọc nhanh đối tượng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="precision-amz-design__addQuickGroup">
            <span className="precision-amz-design__quickLabel">Thêm:</span>
            <select
              className="precision-amz-design__quickSelect"
              value={newComponent}
              onChange={(e) => setNewComponent(e.target.value)}
            >
              <option value="TEXT">TEXT</option>
              <option value="IMAGE">IMAGE</option>
              <option value="1D BARCODE">1D BARCODE</option>
              <option value="2D MATRIX">2D MATRIX</option>
              <option value="QRCODE">QRCODE</option>
              <option value="CONTAINER">CONTAINER</option>
            </select>
            <Tooltip title="Thêm đối tượng này vào danh sách">
              <button
                type="button"
                className="precision-amz-design__quickAddBtn"
                onClick={onAddComponent}
              >
                <GrAdd size={12} color="#fff" />
                <span>Thêm</span>
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="precision-amz-design__tableToolbarRight">
          <button
            type="button"
            className="precision-amz-design__gridBtn precision-amz-design__gridBtn--excel"
            onClick={() => SaveExcel(componentList, "Danh Sach Doi Tuong Tem")}
            title="Xuất Excel danh sách đối tượng"
          >
            <AiFillFileExcel size={14} color="#059669" />
            <span>Xuất Excel</span>
          </button>
          <span className="precision-amz-design__gridMeta">
            Tổng số: <strong>{filteredComponents.length}</strong> / {componentList.length}
          </span>
        </div>
      </div>

      <div className="precision-amz-design__tableBody">
        <AGTable
          ref={agTableRef}
          suppressRowClickSelection={false}
          showFilter={true}
          columns={agColumns}
          data={filteredComponents}
          getRowStyle={agGetRowStyle}
          onCellEditingStarted={() => {
            isAgCellEditingRef.current = true;
          }}
          onCellEditingStopped={onAgCellEditingStopped}
          onCellClick={onAgCellClick}
          onSelectionChange={() => {}}
          onRowDragEnd={onAgRowDragEnd}
        />
      </div>
    </div>
  );
};

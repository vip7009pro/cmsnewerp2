import React, { useEffect, useState } from "react";
import { generalQuery } from "../../../api/Api";
import Swal from "sweetalert2";
import { ResponsiveContainer } from "recharts";
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Scrolling,
  SearchPanel,
  Selection,
  DataGrid,
  Paging,
  Toolbar,
  Item,
  Export,
  ColumnChooser,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import { IconButton } from "@mui/material";
import { SaveExcel } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import "./CalcQuotation.scss";
import CodeVisualLize from "./CodeVisualize/CodeVisualLize";
import { UserData } from "../../../redux/slices/globalSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export interface CODEDATA {
  id: number;
  Q_ID: string;
  G_CODE: string;
  WIDTH_OFFSET: number;
  LENGTH_OFFSET: number;
  KNIFE_UNIT: number;
  FILM_UNIT: number;
  INK_UNIT: number;
  LABOR_UNIT: number;
  DELIVERY_UNIT: number;
  DEPRECATION_UNIT: number;
  GMANAGEMENT_UNIT: number;
  M_LOSS_UNIT: number;
  G_WIDTH: number;
  G_LENGTH: number;
  G_C: number;
  G_C_R: number;
  G_LG: number;
  G_CG: number;
  G_SG_L: number;
  G_SG_R: number;
  PROD_PRINT_TIMES: number;
  KNIFE_COST: number;
  FILM_COST: number;
  INK_COST: number;
  LABOR_COST: number;
  DELIVERY_COST: number;
  DEPRECATION_COST: number;
  GMANAGEMENT_COST: number;
  MATERIAL_COST: number;
  TOTAL_COST: number;
  SALE_PRICE: number;
  PROFIT: number;
  G_NAME: string;
  G_NAME_KD: string;
  CUST_NAME_KD: string;
}
interface BOMVLDATA {
  id: number;
  Q_ID: string;
  G_CODE: string;
  M_CODE: string;
  M_NAME: string;
  OPEN_PRICE: number;
  ORIGINAL_PRICE: number;
}

interface BOM_GIA {
  id: string;
  BOM_ID?: string;
  G_CODE?: string;
  RIV_NO?: string;
  G_SEQ?: string;
  CATEGORY?: number;
  M_CODE?: string;
  M_NAME?: string;
  CUST_CD?: string;
  IMPORT_CAT?: string;
  M_CMS_PRICE: number;
  M_SS_PRICE: number;
  M_SLITTING_PRICE: number;
  USAGE?: string;
  MAIN_M: string;
  MAT_MASTER_WIDTH?: number;
  MAT_CUTWIDTH?: number;
  MAT_ROLL_LENGTH?: number;
  MAT_THICKNESS?: number;
  M_QTY?: number;
  REMARK?: string;
  PROCESS_ORDER?: number;
  INS_EMPL?: string;
  UPD_EMPL?: string;
  INS_DATE?: string;
  UPD_DATE?: string;
}

interface DEFAULT_DM {
  id: number;
  WIDTH_OFFSET: number;
  LENGTH_OFFSET: number;
  KNIFE_UNIT: number;
  FILM_UNIT: number;
  INK_UNIT: number;
  LABOR_UNIT: number;
  DELIVERY_UNIT: number;
  DEPRECATION_UNIT: number;
  GMANAGEMENT_UNIT: number;
  M_LOSS_UNIT: number;
}
interface GIANVL {
  mCutWidth: number;
  mLength: number;
  mArea: number;
  giaVLSS: number;
  giaVLCMS: number;
  knife_cost: number;
  film_cost: number;
  ink_cost: number;
  labor_cost: number;
  delivery_cost: number;
  deprecation_cost: number;
  gmanagement_cost: number;
  totalcostCMS: number;
  totalcostSS: number;
}
const CalcQuotation = () => {
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const [listcode, setListCode] = useState<Array<CODEDATA>>([]);
  const [listVL, setListVL] = useState<Array<BOM_GIA>>([]);
  const [tempQTY, setTempQty] = useState(1);
  const [defaultDM, setDefaultDM] = useState<DEFAULT_DM>({
    id: 0,
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT: 0,
    GMANAGEMENT_UNIT: 0,
    M_LOSS_UNIT: 0,
  });
  const [gianvl, setGiaNvl] = useState<GIANVL>({
    mCutWidth: 0,
    mLength: 0,
    mArea: 0,
    giaVLSS: 0,
    giaVLCMS: 0,
    knife_cost: 0,
    film_cost: 0,
    ink_cost: 0,
    labor_cost: 0,
    delivery_cost: 0,
    deprecation_cost: 0,
    gmanagement_cost: 0,
    totalcostCMS: 0,
    totalcostSS: 0,
  });

  const loadListCode = () => {
    generalQuery("loadlistcodequotation", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODEDATA[] = response.data.data.map(
            (element: CODEDATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setListCode(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          setListCode([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadbomNVLQuotation = (CODEINFO: CODEDATA) => {
    generalQuery("getbomgia", {
      G_CODE: CODEINFO.G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BOM_GIA[] = response.data.data.map(
            (element: BOM_GIA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          console.log(tinhgia(CODEINFO, loadeddata, tempQTY));
          setListVL(loadeddata);
        } else {
          setListVL([]);
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadDefaultDM = () => {
    generalQuery("loadDefaultDM", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DEFAULT_DM[] = response.data.data.map(
            (element: DEFAULT_DM, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setDefaultDM(loadeddata[0]);
        } else {
          setDefaultDM({
            id: 0,
            WIDTH_OFFSET: 0,
            LENGTH_OFFSET: 0,
            KNIFE_UNIT: 0,
            FILM_UNIT: 0,
            INK_UNIT: 0,
            LABOR_UNIT: 0,
            DELIVERY_UNIT: 0,
            DEPRECATION_UNIT: 0,
            GMANAGEMENT_UNIT: 0,
            M_LOSS_UNIT: 0,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [selectedRows, setSelectedRows] = useState<CODEDATA>({
    id: 0,
    Q_ID: "",
    G_CODE: "",
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT: 0,
    GMANAGEMENT_UNIT: 0,
    M_LOSS_UNIT: 0,
    G_WIDTH: 0,
    G_LENGTH: 0,
    G_C: 0,
    G_C_R: 0,
    G_LG: 0,
    G_CG: 0,
    G_SG_L: 0,
    G_SG_R: 0,
    PROD_PRINT_TIMES: 0,
    KNIFE_COST: 0,
    FILM_COST: 0,
    INK_COST: 0,
    LABOR_COST: 0,
    DELIVERY_COST: 0,
    DEPRECATION_COST: 0,
    GMANAGEMENT_COST: 0,
    MATERIAL_COST: 0,
    TOTAL_COST: 0,
    SALE_PRICE: 0,
    PROFIT: 0,
    G_NAME: "",
    G_NAME_KD: "",
    CUST_NAME_KD: "",
  });
  const listcodeTable = React.useMemo(
    () => (
      <div className='datatb'>
        <ResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={listcode}
            columnWidth='auto'
            keyExpr='id'
            height={"75vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //setSelectedRows(e.selectedRowsData[0]);
            }}
            onRowClick={(e) => {
              //console.log(e.data);
              setSelectedRows(e.data);
              loadbomNVLQuotation(e.data);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            <Selection mode='single' selectAllMode='allPages' />
            <Editing
              allowUpdating={false}
              allowAdding={true}
              allowDeleting={false}
              mode='batch'
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(listcode, "ListCode");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  SAVE
                </IconButton>
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooser' />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <ColumnChooser enabled={true} />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            <Summary>
              <TotalItem
                alignment='right'
                column='id'
                summaryType='count'
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </ResponsiveContainer>
      </div>
    ),
    [listcode]
  );
  const listBOMVLTable = React.useMemo(
    () => (
      <div className='datatb'>
        <ResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={listVL}
            columnWidth='auto'
            keyExpr='id'
            height={"30vh"}
            showBorders={true}
            onSelectionChanged={(e) => {}}
            onRowClick={(e) => {
              //console.log(e.data);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            <Selection mode='single' selectAllMode='allPages' />
            <Editing
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              mode='cell'
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(listVL, "ListVL");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  SAVE
                </IconButton>
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooser' />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <ColumnChooser enabled={true} />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            <Column dataField='G_CODE' caption='G_CODE' width={70}></Column>
            <Column dataField='G_SEQ' caption='G_SEQ' width={50}></Column>
            <Column dataField='M_CODE' caption='M_CODE' width={70}></Column>
            <Column dataField='M_NAME' caption='M_NAME' width={70}></Column>
            <Column dataField='MAT_CUTWIDTH' caption='SIZE' width={70}></Column>
            <Column
              dataField='M_CMS_PRICE'
              caption='OPEN PR'
              width={70}
            ></Column>
            <Column dataField='M_SS_PRICE' caption='ORG PR' width={70}></Column>
            <Column dataField='USAGE' caption='USAGE' width={70}></Column>
            <Column
              dataField='MAT_MASTER_WIDTH'
              caption='MST_WIDTH'
              width={70}
            ></Column>
            <Column dataField='M_QTY' caption='M_QTY' width={70}></Column>
            <Summary>
              <TotalItem
                alignment='right'
                column='id'
                summaryType='count'
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </ResponsiveContainer>
      </div>
    ),
    [listVL]
  );

  const handlesetDefaultDM = (keyname: string, value: any) => {
    let tempDM = { ...defaultDM, [keyname]: value };
    //console.log(tempcodefullinfo);
    setDefaultDM(tempDM);
  };
  const handlesetCodeInfo = (keyname: string, value: any) => {
    let tempCodeInfo = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCodeInfo);
  };
  const tinhgia = (CODEINFO: CODEDATA, BOMNVL: BOM_GIA[], TEMP_QTY: number) => {
    const materialCutWidth: number =
      CODEINFO.G_SG_L +
      (CODEINFO.G_CG + CODEINFO.G_WIDTH) * (CODEINFO.G_C - 1) +
      CODEINFO.G_WIDTH +
      CODEINFO.G_SG_R;
    const materialLength: number =
      ((CODEINFO.G_LENGTH + CODEINFO.G_LG) / CODEINFO.G_C) * 1.0 * TEMP_QTY;
    const materialArea =
      (materialLength * materialCutWidth * (1 + CODEINFO.M_LOSS_UNIT / 100)) /
      1000000;
    let materialAmountCMS: number = 0;
    let materialAmountSS: number = 0;

    //Material Cost
    for (let i = 0; i < BOMNVL.length; i++) {
      materialAmountCMS += BOMNVL[i].M_CMS_PRICE * materialArea;
      materialAmountSS += BOMNVL[i].M_SS_PRICE * materialArea;
    }
    //KNIFE
    const knife_cost =
      (CODEINFO.KNIFE_UNIT *
        (CODEINFO.G_WIDTH * CODEINFO.G_C * 2 +
          CODEINFO.G_LENGTH * CODEINFO.G_C_R * 2)) /
      TEMP_QTY;
    const film_cost =
      (CODEINFO.FILM_UNIT *
        ((CODEINFO.G_WIDTH + CODEINFO.WIDTH_OFFSET) *
          (CODEINFO.G_LENGTH + CODEINFO.LENGTH_OFFSET) *
          CODEINFO.G_C *
          CODEINFO.PROD_PRINT_TIMES)) /
      TEMP_QTY;
    const ink_cost = CODEINFO.INK_UNIT * materialArea;
    const labor_cost = CODEINFO.LABOR_UNIT * materialArea;
    const delivery_cost = CODEINFO.DELIVERY_UNIT;
    const deprecation_cost = CODEINFO.DEPRECATION_UNIT * materialArea;
    const gmanagement_cost = CODEINFO.GMANAGEMENT_UNIT * materialArea;
    const total_costCMS =
      materialAmountCMS +
      knife_cost +
      film_cost +
      ink_cost +
      labor_cost +
      delivery_cost +
      deprecation_cost +
      gmanagement_cost;
    const total_costSS =
      materialAmountSS +
      knife_cost +
      film_cost +
      ink_cost +
      labor_cost +
      delivery_cost +
      deprecation_cost +
      gmanagement_cost;

    setGiaNvl({
      mCutWidth: materialCutWidth,
      mLength: materialLength,
      mArea: materialArea,
      giaVLSS: materialAmountSS,
      giaVLCMS: materialAmountCMS,
      knife_cost: knife_cost,
      film_cost: film_cost,
      ink_cost: ink_cost,
      labor_cost: labor_cost,
      delivery_cost: delivery_cost,
      deprecation_cost: deprecation_cost,
      gmanagement_cost: gmanagement_cost,
      totalcostCMS: total_costCMS,
      totalcostSS: total_costSS,
    });
    return {
      mCutWidth: materialCutWidth,
      mLength: materialLength,
      mArea: materialArea,
      giaVLSS: materialAmountSS,
      giaVLCMS: materialAmountCMS,
      knife_cost: knife_cost,
      film_cost: film_cost,
      ink_cost: ink_cost,
      labor_cost: labor_cost,
      delivery_cost: delivery_cost,
      deprecation_cost: deprecation_cost,
      gmanagement_cost: gmanagement_cost,
      total_costCMS: total_costCMS,
      total_costSS: total_costSS,
    };
  };

  useEffect(() => {
    loadListCode();
    loadDefaultDM();
  }, []);

  return (
    <div className='calc_quotation'>
      <div className='calc_title'>BẢNG TÍNH GIÁ</div>
      <div className='calc_wrap'>
        <div className='left'>
          <div className='listcode'>{listcodeTable}</div>

          <div className='moqlist'></div>
          <div className='insert_button'></div>
        </div>
        <div className='right'>
          <div className='up'>
            <div className='bomnvl'>{listBOMVLTable}</div>
            <div className='product_visualize'>
              <CodeVisualLize DATA={selectedRows} />
            </div>
            <div className='openlink'></div>
          </div>
          <div className='middle'>
            <div className='openlink'>
              <div className='defaultunit'>
                <label>
                  W_OFFSET:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.WIDTH_OFFSET === null
                        ? 0
                        : defaultDM.WIDTH_OFFSET
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("WIDTH_OFFSET", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  L_OFFSET:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.LENGTH_OFFSET === null
                        ? 0
                        : defaultDM.LENGTH_OFFSET
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("LENGTH_OFFSET", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  KNIFE_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.KNIFE_UNIT === null ? 0 : defaultDM.KNIFE_UNIT
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("KNIFE_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  FILM_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.FILM_UNIT === null ? 0 : defaultDM.FILM_UNIT
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("FILM_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  INK_UNIT:<br></br>
                  <input
                    type='text'
                    value={defaultDM.INK_UNIT === null ? 0 : defaultDM.INK_UNIT}
                    onChange={(e) => {
                      handlesetDefaultDM("INK_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  LABOR_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.LABOR_UNIT === null ? 0 : defaultDM.LABOR_UNIT
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("LABOR_UNIT", e.target.value);
                    }}
                  ></input>
                </label>

                <label>
                  DELIVERY_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.DELIVERY_UNIT === null
                        ? 0
                        : defaultDM.DELIVERY_UNIT
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("DELIVERY_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  DEPRECATION_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.DEPRECATION_UNIT === null
                        ? 0
                        : defaultDM.DEPRECATION_UNIT
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("DEPRECATION_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  GMANAGEMENT_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.GMANAGEMENT_UNIT === null
                        ? 0
                        : defaultDM.GMANAGEMENT_UNIT
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("GMANAGEMENT_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  M_LOSS_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      defaultDM.M_LOSS_UNIT === null ? 0 : defaultDM.M_LOSS_UNIT
                    }
                    onChange={(e) => {
                      handlesetDefaultDM("M_LOSS_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
              </div>
              <div className='currentunit'>
                <label>
                  W_OFFSET:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.WIDTH_OFFSET === null
                        ? 0
                        : selectedRows.WIDTH_OFFSET
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("WIDTH_OFFSET", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  L_OFFSET:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.LENGTH_OFFSET === null
                        ? 0
                        : selectedRows.LENGTH_OFFSET
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("LENGTH_OFFSET", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  KNIFE_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.KNIFE_UNIT === null
                        ? 0
                        : selectedRows.KNIFE_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("KNIFE_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  FILM_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.FILM_UNIT === null
                        ? 0
                        : selectedRows.FILM_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("FILM_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  INK_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.INK_UNIT === null ? 0 : selectedRows.INK_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("INK_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  LABOR_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.LABOR_UNIT === null
                        ? 0
                        : selectedRows.LABOR_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("LABOR_UNIT", e.target.value);
                    }}
                  ></input>
                </label>

                <label>
                  DELIVERY_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.DELIVERY_UNIT === null
                        ? 0
                        : selectedRows.DELIVERY_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("DELIVERY_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  DEPRECATION_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.DEPRECATION_UNIT === null
                        ? 0
                        : selectedRows.DEPRECATION_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("DEPRECATION_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  GMANAGEMENT_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.GMANAGEMENT_UNIT === null
                        ? 0
                        : selectedRows.GMANAGEMENT_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("GMANAGEMENT_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  M_LOSS_UNIT:<br></br>
                  <input
                    type='text'
                    value={
                      selectedRows.M_LOSS_UNIT === null
                        ? 0
                        : selectedRows.M_LOSS_UNIT
                    }
                    onChange={(e) => {
                      handlesetCodeInfo("M_LOSS_UNIT", e.target.value);
                    }}
                  ></input>
                </label>
              </div>
            </div>
          </div>
          <div className='down'>
            <div className='tongchiphi'>
              <table>
                <thead>
                  <tr>
                    <td width={"50%"}>HẠNG MỤC</td>
                    <td width={"40%"}>GIÁ TRỊ</td>
                    <td width={"10%"}>UNIT</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Khổ liệu sử dụng</td>
                    <td>
                      {gianvl.mCutWidth.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>mm</td>
                  </tr>
                  <tr>
                    <td>Chiều dài liệu mỗi con hàng</td>
                    <td>
                      {gianvl.mLength.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>mm</td>
                  </tr>
                  <tr>
                    <td>Diện tích liệu mỗi con hàng</td>
                    <td>
                      {gianvl.mArea.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>m2</td>
                  </tr>
                  <tr>
                    <td>Tiền VL Nội Bộ</td>
                    <td>
                      {gianvl.giaVLCMS.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Tiền VL Open</td>
                    <td>
                      {gianvl.giaVLSS.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Tiền Dao</td>
                    <td>
                      {gianvl.knife_cost.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Tiền film bản</td>
                    <td>
                      {gianvl.film_cost.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Tiền mực</td>
                    <td>
                      {gianvl.ink_cost.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Tiền nhân công</td>
                    <td>
                      {gianvl.labor_cost.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Phí vận chuyển</td>
                    <td>
                      {gianvl.delivery_cost.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Khấu hao máy</td>
                    <td>
                      {gianvl.deprecation_cost.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Phí quản lý chung</td>
                    <td>
                      {gianvl.gmanagement_cost.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Tổng chi phí NB</td>
                    <td>
                      {gianvl.totalcostCMS.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                  <tr>
                    <td>Tổng chi phí OPEN</td>
                    <td>
                      {gianvl.totalcostSS.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{company === "PVN" ? "VND" : "USD"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='moqdiv'>
              <label>
                MOQ:<br></br>
                <input
                  type='text'
                  value={tempQTY}
                  onChange={(e) => {
                    setTempQty(Number(e.target.value));
                    tinhgia(selectedRows, listVL, Number(e.target.value));
                  }}
                ></input>
              </label>
            </div>
            <div className='savebutton'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalcQuotation;

import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import {
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
  Column,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./UpHangLoat.scss";
import { generalQuery, getCompany, getUserData } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel, zeroPad } from "../../../api/GlobalFunction";
import * as XLSX from "xlsx";
import { CODE_FULL_INFO, DEFAULT_DM } from "../../../api/GlobalInterface";
const UpHangLoat = () => {
  const [currentTable, setCurrentTable] = useState<Array<any>>([]);
  const [columns, setColumns] = useState<Array<any>>([]);
  const [trigger, setTrigger] = useState(false);
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
  const materialDataTable = React.useMemo(
    () => (
      <div className="datatb">
        <CustomResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={currentTable}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //setFormData(e.selectedRowsData[0]);
            }}
            onRowClick={(e) => {
              //console.log(e.data);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar="onHover"
              mode="virtual"
            />
            <Selection mode="single" selectAllMode="allPages" />
            <Editing
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              mode="cell"
              confirmDelete={false}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(currentTable, "MaterialStatus");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
                </IconButton>
              </Item>
              <Item name="searchPanel" />
              <Item name="exportButton" />
              <Item name="columnChooser" />
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
              infoText="Page #{0}. Total: {1} ({2} items)"
              displayMode="compact"
            />
            {columns.map((column, index) => {
              return <Column key={index} {...column}></Column>;
            })}
            <Summary>
              <TotalItem
                alignment="right"
                column="id"
                summaryType="count"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [currentTable, trigger, columns]
  );
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        const keys = Object.keys(json[0]);
        let uploadexcelcolumn = keys.map((element, index) => {
          return {
            field: element,
            headerName: element,
            width: 150,
          };
        });
        uploadexcelcolumn.push({
          field: "CHECKSTATUS",
          headerName: "CHECKSTATUS",
          width: 350,
        });
        let filejson = json.map((element: any, index: number) => {
          return { ...element, CHECKSTATUS: "Waiting", id: index };
        });
        let keysArray = Object.getOwnPropertyNames(filejson[0]);
        let column_map = keysArray.map((e, index) => {
          return {
            dataField: e,
            caption: e,
            width: 100,
            cellRender: (ele: any) => {
              //console.log(e);
              if (e === "CHECKSTATUS") {
                if (ele.data[e] === 'OK') {
                  return (
                    <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#00d134', color: "#000000", fontWeight: "normal" }}>OK</div>
                  );
                }
                else if (ele.data[e] === 'NG') {
                  return (
                    <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#ff0000', color: "#ffffff", fontWeight: "normal" }}>NG</div>
                  );
                }
                else {
                  return (
                    <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#4313f3', color: "#ffffff", fontWeight: "normal" }}>Waiting</div>
                  );
                }
              } else {
                return <span>{ele.data[e]}</span>;
              }
            },
          };
        });
        setColumns(column_map);
        setCurrentTable(filejson);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const checkG_NAME_KD_Exist = async (g_name_kd: string) => {
    let gnamekdExist: boolean = false;
    await generalQuery("checkGNAMEKDExist", {
      G_NAME_KD: g_name_kd
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.tk_status !== "NG") {
          gnamekdExist = true;
        } else {
          gnamekdExist = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return gnamekdExist;
  }
  const handleCheckCodeInfo = async (codefullinfo: CODE_FULL_INFO) => {
    let abc: CODE_FULL_INFO = codefullinfo;
    let result: boolean = true;
    if (getCompany() !== "CMS" && getUserData()?.MAINDEPTNAME === "KD") {
      result = true;
    } else {
      for (const [k, v] of Object.entries(abc)) {
        if (
          (v === null || v === "") &&
          k !== "REMK" &&
          k !== "FACTORY" &&
          k !== "Setting1" &&
          k !== "Setting2" &&
          k !== "Setting3" &&
          k !== "Setting4" &&
          k !== "UPH1" &&
          k !== "UPH2" &&
          k !== "UPH3" &&
          k !== "UPH4" &&
          k !== "Step1" &&
          k !== "Step2" &&
          k !== "Step3" &&
          k !== "Step4" &&
          k !== "LOSS_SX1" &&
          k !== "LOSS_SX2" &&
          k !== "LOSS_SX3" &&
          k !== "LOSS_SX4" &&
          k !== "LOSS_SETTING1" &&
          k !== "LOSS_SETTING2" &&
          k !== "LOSS_SETTING3" &&
          k !== "LOSS_SETTING4" &&
          k !== "NOTE"
        ) {
          //Swal.fire("Thông báo", "Không được để trống: " + k, "error");
          result = false;
          break;
        }
      }
    }
    return result;
  };
  const getNextG_CODE = async (CODE_12: string, CODE_27: string) => {
    let nextseq: string = "";
    let nextseqno: string = "";
    await generalQuery("getNextSEQ_G_CODE", {
      CODE_12: CODE_12,
      CODE_27: CODE_27,
    })
      .then((response) => {
        //console.log(response.data);
        let currentseq = response.data.data[0].LAST_SEQ_NO;
        if (response.data.tk_status !== "NG") {
          if (CODE_12 === "9") {
            nextseq = zeroPad(Number(currentseq) + 1, 6);
            nextseqno = nextseq;
          } else {
            nextseq = zeroPad(Number(currentseq) + 1, 5) + "A";
            nextseqno = zeroPad(Number(currentseq) + 1, 5);
          }
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          if (CODE_12 === "9") {
            nextseq = "000001";
            nextseqno = nextseq;
          } else {
            nextseq = "00001A";
            nextseqno = "00001";
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return { NEXT_G_CODE: CODE_12 + CODE_27 + nextseq, NEXT_SEQ_NO: nextseqno };
  };
  const handleinsertCodeTBG = (NEWG_CODE: string, codefullinfo: CODE_FULL_INFO) => {
    generalQuery("insertM100BangTinhGia", {
      G_CODE: NEWG_CODE,
      DEFAULT_DM: defaultDM,
      CODE_FULL_INFO: codefullinfo,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //Swal.fire("Thông báo", "Code mới: " + nextcode, "success");
        } else {
          //Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadDefaultDM = () => {
    generalQuery("loadDefaultDM", {})
      .then((response) => {
        console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DEFAULT_DM[] = response.data.data.map(
            (element: DEFAULT_DM, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
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
  const handleAddNewCode = async (codefullinfo: CODE_FULL_INFO) => {
    //console.log(handleCheckCodeInfo());
    let insertStatus: boolean = false;
    let checkg_name_kd: boolean = await checkG_NAME_KD_Exist(codefullinfo.G_NAME_KD === undefined ? 'zzzzzzzzz' : codefullinfo.G_NAME_KD);
    console.log('checkg_name_kd', checkg_name_kd);
    if ((getCompany() === 'CMS') && await handleCheckCodeInfo(codefullinfo) || (getCompany() !== 'CMS' && checkg_name_kd === false)) {
      let CODE_27 = "C";
      if (
        codefullinfo.PROD_TYPE.trim() === "TSP" ||
        codefullinfo.PROD_TYPE.trim() === "OLED" ||
        codefullinfo.PROD_TYPE.trim() === "UV"
      ) {
        CODE_27 = "C";
      } else if (codefullinfo.PROD_TYPE.trim() === "LABEL") {
        CODE_27 = "A";
      } else if (codefullinfo.PROD_TYPE.trim() === "TAPE") {
        CODE_27 = "B";
      } else if (codefullinfo.PROD_TYPE.trim() === "RIBBON") {
        CODE_27 = "E";
      }
      let nextcodeinfo = await getNextG_CODE(
        codefullinfo.CODE_12,
        CODE_27,
      );
      let nextcode = nextcodeinfo.NEXT_G_CODE;
      let nextgseqno = nextcodeinfo.NEXT_SEQ_NO;
      //Swal.fire("Thông báo","Next code: " + nextcode,"success");
      await generalQuery("insertM100", {
        G_CODE: nextcode,
        CODE_27: CODE_27,
        NEXT_SEQ_NO: nextgseqno,
        CODE_FULL_INFO: codefullinfo,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            //Swal.fire("Thông báo", "Code mới: " + nextcode, "success");
            insertStatus = true;
          } else {
            //Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      handleinsertCodeTBG(nextcode, codefullinfo);
    }
    else {
      if (getCompany() === 'CMS') {
      }
      else {
        //Swal.fire('Cảnh báo','Code '+(codefullinfo.G_NAME_KD===undefined? 'zzzzzzzzz': codefullinfo.G_NAME_KD)+ ' đã tồn tại','error');
      }
    }
    return insertStatus;
  };
  const addhangloat = async () => {
    if (currentTable.length !== 0) {
      let err_code: string = '';
      let tempTable = currentTable;
      for (let i = 0; i < currentTable.length; i++) {
        let insertStatus = await handleAddNewCode({...currentTable[i], QL_HSD: currentTable[i]?.QL_HSD ?? 'Y', EXP_DATE: currentTable[i]?.EXP_DATE ?? '0'});
        if (insertStatus === false) {
          err_code += `${currentTable[i].G_NAME_KD}: NG | `;
          tempTable[i]['CHECKSTATUS'] = 'NG';
        }
        else {
          tempTable[i]['CHECKSTATUS'] = 'OK';
        }
      }
      let keysArray = Object.getOwnPropertyNames(tempTable[0]);
      let column_map = keysArray.map((e, index) => {
        return {
          dataField: e,
          caption: e,
          width: 100,
          cellRender: (ele: any) => {
            //console.log(e);
            if (e === "CHECKSTATUS") {
              if (ele.data[e] === 'OK') {
                return (
                  <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#00d134', color: "#000000", fontWeight: "normal" }}>OK</div>
                );
              }
              else if (ele.data[e] === 'NG') {
                return (
                  <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#ff0000', color: "#ffffff", fontWeight: "normal" }}>NG</div>
                );
              }
              else {
                return (
                  <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#4313f3', color: "#ffffff", fontWeight: "normal" }}>Waiting</div>
                );
              }
            } else {
              return <span>{ele.data[e]}</span>;
            }
          },
        };
      });
      setColumns(column_map);
      setCurrentTable(tempTable);
      setTrigger(!trigger);
      if (err_code === '') {
        Swal.fire('Thông báo', 'Up code hàng loạt thành công', 'success');
      }
      else {
        Swal.fire('Thông báo', 'Up thất bại các code sau, hãy check lại thông tin', 'error');
      }
    }
    else {
      Swal.fire('Thông báo', 'Kéo file vào trước khi up', 'error');
    }
  }
  useEffect(() => {
    loadDefaultDM();
  }, []);
  return (
    <div className="uphangloatcode">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <input
                className='selectfilebutton'
                type='file'
                name='upload'
                id='upload'
                onChange={(e: any) => {
                  readUploadFile(e);
                }}
              />
            </div>
            <div className="forminputcolumn">
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
                addhangloat();
              }}>UP CODE</Button>
              {/* <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
              }}>UP BOM</Button> */}
            </div>
          </div>
        </div>
        <div className="tracuuYCSXTable">{materialDataTable}</div>
      </div>
    </div>
  );
};
export default UpHangLoat;

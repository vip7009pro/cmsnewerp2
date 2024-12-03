import { Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./UpHangLoat.scss";
import { generalQuery, getCompany, getUserData } from "../../../api/Api";
import { zeroPad } from "../../../api/GlobalFunction";
import * as XLSX from "xlsx";
import { CODE_FULL_INFO, DEFAULT_DM } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
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
  const column_codeinfo: any = [    
    { field: "CUST_CD", headerName: "CUST_CD", width: 80 },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 80 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 80 },
    { field: "CODE_12", headerName: "CODE_12", width: 80 },
    { field: "CODE_27", headerName: "CODE_27", width: 80 },
    { field: "SEQ_NO", headerName: "SEQ_NO", width: 80 },
    { field: "REV_NO", headerName: "REV_NO", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 80 },
    { field: "DESCR", headerName: "DESCR", width: 200 },
    { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120 },
    { field: "G_NAME", headerName: "G_NAME", width: 200 },
    { field: "G_LENGTH", headerName: "G_LENGTH", width: 80 },
    { field: "G_WIDTH", headerName: "G_WIDTH", width: 80 },
    { field: "PD", headerName: "PD", width: 80 },
    { field: "G_C", headerName: "G_C", width: 50 },
    { field: "G_C_R", headerName: "G_C_R", width: 50 },
    { field: "G_SG_L", headerName: "G_SG_L", width: 50 },
    { field: "G_SG_R", headerName: "G_SG_R", width: 50 },
    { field: "G_CG", headerName: "G_CG", width: 50 },
    { field: "G_LG", headerName: "G_LG", width: 50 },
    { field: "PACK_DRT", headerName: "PACK_DRT", width: 80 },
    { field: "KNIFE_TYPE", headerName: "KNIFE_TYPE", width: 80 },
    { field: "KNIFE_LIFECYCLE", headerName: "KNIFE_LIFECYCLE", width: 80 },
    { field: "KNIFE_PRICE", headerName: "KNIFE_PRICE", width: 80 },
    { field: "CODE_33", headerName: "CODE_33", width: 80 },
    { field: "ROLE_EA_QTY", headerName: "ROLE_EA_QTY", width: 80 },
    { field: "RPM", headerName: "RPM", width: 80 },
    { field: "PIN_DISTANCE", headerName: "PIN_DISTANCE", width: 80 },
    { field: "PROCESS_TYPE", headerName: "PROCESS_TYPE", width: 80 },
    { field: "EQ1", headerName: "EQ1", width: 80 },
    { field: "EQ2", headerName: "EQ2", width: 80 },
    { field: "EQ3", headerName: "EQ3", width: 80 },
    { field: "EQ4", headerName: "EQ4", width: 80 },
    { field: "PROD_DIECUT_STEP", headerName: "PROD_DIECUT_STEP", width: 120 },
    { field: "PROD_PRINT_TIMES", headerName: "PROD_PRINT_TIMES", width: 120 },
    { field: "REMK", headerName: "REMK", width: 80 },
    { field: "USE_YN", headerName: "USE_YN", width: 80 },
    { field: "PO_TYPE", headerName: "PO_TYPE", width: 80 },
    { field: "FSC", headerName: "FSC", width: 80 },
    { field: "PROD_DVT", headerName: "PROD_DVT", width: 80 },
    { field: "FSC_CODE", headerName: "FSC_CODE", width: 80 },
    { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 80, cellRenderer: (params: any) => {
      if (params.data.CHECKSTATUS === 'OK') {
        return (
          <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#00d134', color: "#000000", fontWeight: "normal" }}>OK</div>
        );
      }
      else if (params.data.CHECKSTATUS === 'NG') {
        return (
          <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#ff0000', color: "#ffffff", fontWeight: "normal" }}>NG</div>
        );
      }
      else {
        return (
          <div style={{ textAlign: 'center', width: '120px', backgroundColor: '#4313f3', color: "#ffffff", fontWeight: "normal" }}>Waiting</div>
        );
      }
    } },
  ];
  const codeAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={true}
      showFilter={true}
      toolbar={
        <>
        </>
      }
      data={currentTable}
      columns={column_codeinfo}
      onSelectionChange={() => {}}  
    />, [currentTable, trigger, columns]);

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
    if(Number(codefullinfo.CODE_12)<6 || Number(codefullinfo.CODE_12)>9){
      Swal.fire('Thông báo', 'Code 12 phải là số từ 6 đến 9', 'error');
      return false;
    }
    let insertStatus: boolean = false;
    let checkg_name_kd: boolean = await checkG_NAME_KD_Exist(codefullinfo.G_NAME_KD === undefined ? 'zzzzzzzzz' : codefullinfo.G_NAME_KD);
    console.log('checkg_name_kd', checkg_name_kd);
    if ((getCompany() === 'CMS') && (await handleCheckCodeInfo(codefullinfo)) || (getCompany() !== 'CMS' && checkg_name_kd === false)) {
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
        <div className="tracuuYCSXTable">{codeAGTable}</div>
      </div>
    </div>
  );
};
export default UpHangLoat;

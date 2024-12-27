import {
  Button,
  IconButton,
  createFilterOptions,
} from "@mui/material";
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
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { UserContext } from "../../../api/Context";
import { generalQuery, getCompany, getGlobalSetting, uploadQuery } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  CustomerListData,
  CSCONFIRM_DATA,
  CS_RMA_DATA,
  CS_CNDB_DATA,
  CS_TAXI_DATA,
  WEB_SETTING_DATA,
} from "../../../api/GlobalInterface";
import { DataDiv, DataTBDiv, FormButtonColumn, FromInputColumn, FromInputDiv, NNDSDiv, PivotTableDiv, QueryFormDiv } from "../../../components/StyledComponents/ComponentLib";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
const CS_DATA_TB = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showhideupdatennds, setShowHideUpdateNNDS] = useState(false);
  const [currentNN, setCurrentNN] = useState("");
  const [currentDS, setCurrentDS] = useState("");
  const [currentDefectRow, setCurrentDefectRow] = useState<CSCONFIRM_DATA>({
    YEAR_WEEK: '',
    CONFIRM_ID: 0,
    CONFIRM_DATE: '',
    CONTACT_ID: 0,
    CS_EMPL_NO: '',
    EMPL_NAME: '',
    G_CODE: '',
    G_NAME: '',
    G_NAME_KD: '',
    PROD_REQUEST_NO: '',
    CUST_CD: '',
    CUST_NAME_KD: '',
    CONTENT: '',
    INSPECT_QTY: 0,
    NG_QTY: 0,
    REPLACE_RATE: 0,
    REDUCE_QTY: 0,
    FACTOR: '',
    RESULT: '',
    CONFIRM_STATUS: '',
    REMARK: '',
    INS_DATETIME: '',
    PHANLOAI: '',
    LINK: '',
    PROD_TYPE: '',
    PROD_MODEL: '',
    PROD_PROJECT: '',
    PROD_LAST_PRICE: 0,
    REDUCE_AMOUNT: 0,
    NG_NHAN: '',
    DOI_SACH: '',
    DS_VN: '',
    DS_KR: ''
  });
  const [option, setOption] = useState("dataconfirm");
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [cs_table_data, set_cs_table_data] = useState<Array<CSCONFIRM_DATA>>([]);
  const [cs_rma_table_data, set_cs_rma_table_data] = useState<Array<CS_RMA_DATA>>([]);
  const [cs_cndb_table_data, set_cs_cndb_table_data] = useState<Array<CS_CNDB_DATA>>([]);
  const [cs_taxi_table_data, set_cs_taxi_table_data] = useState<Array<CS_TAXI_DATA>>([]);

  const [cs_data, set_cs_data] = useState<Array<any>>([]);


  const [filterData, setFilterData] = useState({
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    CONFIRM_DATE: '',
    CONFIRM_ID: 0,
    CONFIRM_STATUS: '',
    CONTACT_ID: 0,
    CONTENT: '',
    CS_EMPL_NO: '',
    CUST_CD: '',
    CUST_NAME_KD: '',
    EMPL_NAME: '',
    FACTOR: '',
    G_CODE: '',
    G_NAME: '',
    G_NAME_KD: '',
    INS_DATETIME: '',
    INSPECT_QTY: 0,
    LINK: '',
    NG_QTY: 0,
    PHANLOAI: '',
    PROD_LAST_PRICE: 0,
    PROD_MODEL: '',
    PROD_PROJECT: '',
    PROD_REQUEST_NO: '',
    PROD_TYPE: '',
    REDUCE_QTY: 0,
    REMARK: '',
    REPLACE_RATE: 0,
    RESULT: '',
    YEAR_WEEK: '',
    REDUCE_AMOUNT: 0
  });
  const columns_confirm = [
    {
      field: 'YEAR_WEEK',
      headerName: 'YEAR_WEEK',
      width: 100
    },
    {
      field: 'CONFIRM_ID',
      headerName: 'CONFIRM_ID',
      width: 100
    },
    {
      field: 'CONFIRM_DATE',
      headerName: 'CONFIRM_DATE',
      width: 100
    },
    {
      field: 'CONTACT_ID',
      headerName: 'CONTACT_ID',
      width: 100
    },
    {
      field: 'CS_EMPL_NO',
      headerName: 'CS_EMPL_NO',
      width: 100
    },
    {
      field: 'EMPL_NAME',
      headerName: 'EMPL_NAME',
      width: 100
    },
    {
      field: 'G_CODE',
      headerName: 'G_CODE',
      width: 100
    },
    {
      field: 'G_NAME',
      headerName: 'G_NAME',
      width: 100
    },
    {
      field: 'G_NAME_KD',
      headerName: 'G_NAME_KD',
      width: 100
    },
    {
      field: 'PROD_REQUEST_NO',
      headerName: 'PROD_REQUEST_NO',
      width: 100
    },
    {
      field: 'CUST_CD',
      headerName: 'CUST_CD',
      width: 100
    },
    {
      field: 'CUST_NAME_KD',
      headerName: 'CUST_NAME_KD',
      width: 100
    },
    {
      field: 'CONTENT',
      headerName: 'CONTENT',
      width: 100
    },
    {
      field: 'INSPECT_QTY',
      headerName: 'INSPECT_QTY',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ color: 'blue' }}>{ele.data.INSPECT_QTY?.toLocaleString('en-US')}</span>
        )
      }
    },
    {
      field: 'NG_QTY',
      headerName: 'NG_QTY',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ color: 'red' }}>{ele.data.NG_QTY?.toLocaleString('en-US')}</span>
      )
      }
    },
    {
      field: 'REPLACE_RATE',
      headerName: 'REPLACE_RATE',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ color: 'purple' }}>{ele.data.REPLACE_RATE?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2, })}%</span>
        )
      }
    },
    {
      field: 'REDUCE_QTY',
      headerName: 'REDUCE_QTY',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ color: 'green' }}>{ele.data.REDUCE_QTY?.toLocaleString('en-US')}</span>
        )
      }
    },
    {
      field: 'FACTOR',
      headerName: 'FACTOR',
      width: 100
    },
    {
      field: 'RESULT',
      headerName: 'RESULT',
      width: 100
    },
    {
      field: 'CONFIRM_STATUS',
      headerName: 'CONFIRM_STATUS',
      width: 100
    },
    {
      field: 'REMARK',
      headerName: 'REMARK',
      width: 100
    },
    {
      field: 'INS_DATETIME',
      headerName: 'INS_DATETIME',
      width: 100
    },
    {
      field: 'PHANLOAI',
      headerName: 'PHANLOAI',
      width: 100
    },
    {
      field: 'LINK',
      headerName: 'LINK',
      width: 200,
      cellRenderer :(ele: any) => {
        let href = `/cs/CS_${ele.data.CONFIRM_ID}.jpg`;
        return (
          <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={200} height={100}></img></a>
        )
      }
    },
    {
      field: 'PROD_TYPE',
      headerName: 'PROD_TYPE',
      width: 100
    },
    {
      field: 'PROD_MODEL',
      headerName: 'PROD_MODEL',
      width: 100
    },
    {
      field: 'PROD_PROJECT',
      headerName: 'PROD_PROJECT',
      width: 100
    },
    {
      field: 'PROD_LAST_PRICE',
      headerName: 'PROD_LAST_PRICE',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ color: '#0C8ADC' }}>{ele.data.PROD_LAST_PRICE?.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6, })}</span>
        )
      }
    },
    {
      field: 'REDUCE_AMOUNT',
      headerName: 'REDUCE_AMOUNT',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ color: 'green', fontWeight: 'bold' }}>{ele.data.REDUCE_AMOUNT?.toLocaleString("en-US", {
            style: "currency",
            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
          })}</span>
        )
      }
    },
    {
      field: 'LINK',
      headerName: 'DEFECT_IMAGE',
      width: 200,
      cellRenderer : (ele: any) => {
        let href = `/cs/CS_${ele.data.CONFIRM_ID}.jpg`;
        let file: any = null;
        if (ele.data.LINK === 'Y') {
          return (
            <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={200} height={100}></img></a>
          )
        }
        else {
          return (
            <div className="csuploadbutton">
              <button onClick={() => {
                uploadCSImage(ele.data.CONFIRM_ID, file);
              }}>Upload</button>
              <input
                accept='.jpg'
                type='file'
                onChange={(e: any) => {
                  file = e.target.files[0];
                }}
              />
            </div>
          )
        }
      }
    },
    {
      field: 'UP_NNDS',
      headerName: 'UP_NNDS',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <button onClick={() => {
            setCurrentDefectRow(ele.data);
            setShowHideUpdateNNDS(true)
            setCurrentDS(ele.data.DOI_SACH);
            setCurrentNN(ele.data.NG_NHAN);
          }
          }>Update NNDS</button>
        )
      }
    },
    {
      field: 'NG_NHAN',
      headerName: 'NG_NHAN',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ width: '150px', color: 'red', fontWeight: 'bold', wordWrap: 'break-word' }}>{ele.data.NG_NHAN}</span>
        )
      }
    },
    {
      field: 'DOI_SACH',
      headerName: 'DOI_SACH',
      width: 100,
      cellRenderer:(ele: any) => {
        return (
          <span style={{ width: '150px', color: 'green', fontWeight: 'bold', wordWrap: 'break-word' }}>{ele.data.DOI_SACH}</span>
        )
      }
    },
    {
      field: 'DS_VN',
      headerName: 'DS_VN',
      width: 100,
      cellRenderer:(ele: any) => {
        let href = `/cs/CS_${ele.data.CONFIRM_ID}_VN.pptx`;
        let file: any = null;
        if (ele.data.DS_VN === 'Y') {
          return (
            <a href={href}>LINK</a>
          )
        }
        else {
          return (
            <div className="csuploadbutton">
              <button onClick={() => {
                uploadCSDoiSach(ele.data.CONFIRM_ID, file, "VN");
              }}>Upload</button>
              <input
                accept='.pptx'
                type='file'
                onChange={(e: any) => {
                  file = e.target.files[0];
                }}
              />
            </div>
          )
        }
      }
    },
    {
      field: 'DS_KR',
      headerName: 'DS_KR',
      width: 100,
      cellRenderer : (ele: any) => {
        let href = `/cs/CS_${ele.data.CONFIRM_ID}_KR.pptx`;
        let file: any = null;
        if (ele.data.DS_KR === 'Y') {
          return (
            <a href={href}>LINK</a>
          )
        }
        else {
          return (
            <div className="csuploadbutton">
              <button onClick={() => {
                uploadCSDoiSach(ele.data.CONFIRM_ID, file, "KR");
              }}>Upload</button>
              <input
                accept='.pptx'
                type='file'
                onChange={(e: any) => {
                  file = e.target.files[0];
                }}
              />
            </div>
          )
        }
      }
    },
    {
      field: 'id',
      headerName: 'id',
      width: 100
    },
  ];
  const columns_rmadata = [
    {
      field: 'RMA_ID',
      headerName: 'RMA_ID',
      width: 100
    },
    {
      field: 'CONFIRM_ID',
      headerName: 'CONFIRM_ID',
      width: 100
    },
    {
      field: 'G_NAME_KD',
      headerName: 'G_NAME_KD',
      width: 100
    },
    {
      field: 'RETURN_DATE',
      headerName: 'RETURN_DATE',
      width: 100
    },
    {
      field: 'PROD_REQUEST_NO',
      headerName: 'PROD_REQUEST_NO',
      width: 100
    },
    {
      field: 'G_CODE',
      headerName: 'G_CODE',
      width: 100
    },
    {
      field: 'RMA_TYPE',
      headerName: 'RMA_TYPE',
      width: 100
    },
    {
      field: 'RMA_EMPL_NO',
      headerName: 'RMA_EMPL_NO',
      width: 100
    },
    {
      field: 'INS_DATETIME',
      headerName: 'INS_DATETIME',
      width: 100
    },
    {
      field: 'FACTORY',
      headerName: 'FACTORY',
      width: 100
    },
    {
      field: 'RETURN_QTY',
      headerName: 'RETURN_QTY',
      width: 100
    },
    {
      field: 'SORTING_OK_QTY',
      headerName: 'SORTING_OK_QTY',
      width: 100
    },
    {
      field: 'SORTING_NG_QTY',
      headerName: 'SORTING_NG_QTY',
      width: 100
    },
    {
      field: 'RMA_DELIVERY_QTY',
      headerName: 'RMA_DELIVERY_QTY',
      width: 100
    },
    {
      field: 'PROD_LAST_PRICE',
      headerName: 'PROD_LAST_PRICE',
      width: 100
    },
    {
      field: 'RETURN_AMOUNT',
      headerName: 'RETURN_AMOUNT',
      width: 100
    },
    {
      field: 'SORTING_OK_AMOUNT',
      headerName: 'SORTING_OK_AMOUNT',
      width: 100
    },
    {
      field: 'SORTING_NG_AMOUNT',
      headerName: 'SORTING_NG_AMOUNT',
      width: 100
    },
    {
      field: 'G_NAME',
      headerName: 'G_NAME',
      width: 100
    },
    {
      field: 'PROD_TYPE',
      headerName: 'PROD_TYPE',
      width: 100
    },
    {
      field: 'PROD_MODEL',
      headerName: 'PROD_MODEL',
      width: 100
    },
    {
      field: 'CONFIRM_DATE',
      headerName: 'CONFIRM_DATE',
      width: 100
    },
    {
      field: 'CS_EMPL_NO',
      headerName: 'CS_EMPL_NO',
      width: 100
    },
    {
      field: 'CONTENT',
      headerName: 'CONTENT',
      width: 100
    },
    {
      field: 'INSPECT_QTY',
      headerName: 'INSPECT_QTY',
      width: 100
    },
    {
      field: 'NG_QTY',
      headerName: 'NG_QTY',
      width: 100
    },
    {
      field: 'REPLACE_RATE',
      headerName: 'REPLACE_RATE',
      width: 100
    },
    {
      field: 'REDUCE_QTY',
      headerName: 'REDUCE_QTY',
      width: 100
    },
    {
      field: 'FACTOR',
      headerName: 'FACTOR',
      width: 100
    },
    {
      field: 'RESULT',
      headerName: 'RESULT',
      width: 100
    },
    {
      field: 'CONFIRM_STATUS',
      headerName: 'CONFIRM_STATUS',
      width: 100
    },
    {
      field: 'REMARK',
      headerName: 'REMARK',
      width: 100
    },
    {
      field: 'PHANLOAI',
      headerName: 'PHANLOAI',
      width: 100
    },
    {
      field: 'LINK',
      headerName: 'LINK',
      width: 100
    },
    {
      field: 'CUST_NAME_KD',
      headerName: 'CUST_NAME_KD',
      width: 100
    },
    {
      field: 'id',
      headerName: 'id',
      width: 100
    },
  ]
  const columns_cndbdata = [
    {
      field: 'SA_ID',
      headerName: 'SA_ID',
      width: 100
    },
    {
      field: 'CNDB_DATE',
      headerName: 'CNDB_DATE',
      width: 100
    },
    {
      field: 'CONTACT_ID',
      headerName: 'CONTACT_ID',
      width: 100
    },
    {
      field: 'CS_EMPL_NO',
      headerName: 'CS_EMPL_NO',
      width: 100
    },
    {
      field: 'G_CODE',
      headerName: 'G_CODE',
      width: 100
    },
    {
      field: 'G_NAME',
      headerName: 'G_NAME',
      width: 100
    },
    {
      field: 'CUST_NAME_KD',
      headerName: 'CUST_NAME_KD',
      width: 100
    },
    {
      field: 'PROD_REQUEST_NO',
      headerName: 'PROD_REQUEST_NO',
      width: 100
    },
    {
      field: 'REQUEST_DATETIME',
      headerName: 'REQUEST_DATETIME',
      width: 100
    },
    {
      field: 'CONTENT',
      headerName: 'CONTENT',
      width: 100
    },
    {
      field: 'SA_QTY',
      headerName: 'SA_QTY',
      width: 100
    },
    {
      field: 'RESULT',
      headerName: 'RESULT',
      width: 100
    },
    {
      field: 'SA_STATUS',
      headerName: 'SA_STATUS',
      width: 100
    },
    {
      field: 'SA_REMARK',
      headerName: 'SA_REMARK',
      width: 100
    },
    {
      field: 'INS_DATETIME',
      headerName: 'INS_DATETIME',
      width: 100
    },
    {
      field: 'SA_CUST_CD',
      headerName: 'SA_CUST_CD',
      width: 100
    },
  ]
  const columns_taxidata = [
    {
      field: 'TAXI_ID',
      headerName: 'TAXI_ID',
      width: 100
    },
    {
      field: 'CONFIRM_ID',
      headerName: 'CONFIRM_ID',
      width: 100
    },
    {
      field: 'SA_ID',
      headerName: 'SA_ID',
      width: 100
    },
    {
      field: 'CHIEU',
      headerName: 'CHIEU',
      width: 100
    },
    {
      field: 'CONG_VIEC',
      headerName: 'CONG_VIEC',
      width: 100
    },
    {
      field: 'TAXI_DATE',
      headerName: 'TAXI_DATE',
      width: 100
    },
    {
      field: 'TAXI_SHIFT',
      headerName: 'TAXI_SHIFT',
      width: 100
    },
    {
      field: 'CS_EMPL_NO',
      headerName: 'CS_EMPL_NO',
      width: 100
    },
    {
      field: 'DIEM_DI',
      headerName: 'DIEM_DI',
      width: 100
    },
    {
      field: 'DIEM_DEN',
      headerName: 'DIEM_DEN',
      width: 100
    },
    {
      field: 'TAXI_AMOUNT',
      headerName: 'TAXI_AMOUNT',
      width: 100
    },
    {
      field: 'TRANSPORTATION',
      headerName: 'TRANSPORTATION',
      width: 100
    },
    {
      field: 'TAXI_REMARK',
      headerName: 'TAXI_REMARK',
      width: 100
    },
    {
      field: 'INS_DATETIME',
      headerName: 'INS_DATETIME',
      width: 100
    },
  ]

  const [columnDef, setColumnDef] = useState(columns_confirm);
  const updateNNDS = () => {
    generalQuery("updatenndscs", {
      CONFIRM_ID: currentDefectRow.CONFIRM_ID,
      NG_NHAN: currentNN,
      DOI_SACH: currentDS
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire(
            "Thông báo",
            "Update thành công",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const uploadCSImage = async (cs_ID: number, up_file: any) => {
    if (up_file !== null && up_file !== undefined) {
      uploadQuery(up_file, "CS_" + cs_ID + ".jpg", "cs")
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            generalQuery("updateCSImageStatus", { CONFIRM_ID: cs_ID })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  //console.log(response.data.data);
                  Swal.fire(
                    "Thông báo",
                    "Upload file thành công",
                    "success"
                  );
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Upload file thất bại:" + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            Swal.fire(
              "Thông báo",
              "Upload file thất bại:" + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      Swal.fire("Thông báo", "Hãy chọn file", "warning");
    }
  }
  const uploadCSDoiSach = async (cs_ID: number, up_file: any, lang: string) => {
    console.log(up_file);
    if (up_file !== null && up_file !== undefined) {
      uploadQuery(up_file, "CS_" + cs_ID + "_" + lang + ".pptx", "cs")
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            let command = lang == 'VN' ? 'updateCSDoiSachVNStatus' : 'updateCSDoiSachKRStatus';
            generalQuery(command, { CONFIRM_ID: cs_ID, })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  //console.log(response.data.data);
                  Swal.fire(
                    "Thông báo",
                    "Upload file thành công",
                    "success"
                  );
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Upload file thất bại:" + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            Swal.fire(
              "Thông báo",
              "Upload file thất bại:" + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      Swal.fire("Thông báo", "Hãy chọn file", "warning");
    }
  }
  const load_cs_data = () => {
    switch (option) {
      case 'dataconfirm':
        generalQuery("tracsconfirm", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CSCONFIRM_DATA, index: number) => {
                  return {
                    ...element,
                    PHANLOAI: element.PHANLOAI !== '' ? element.PHANLOAI : 'MD',
                    CONFIRM_DATE: moment
                      .utc(element.CONFIRM_DATE)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              //set_cs_table_data(loadeddata);
              set_cs_data(loadeddata);
              setColumnDef(columns_confirm);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_data([]);
              setColumnDef(columns_confirm);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 'datarma':
        generalQuery("tracsrma", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CS_RMA_DATA, index: number) => {
                  return {
                    ...element,
                    CONFIRM_DATE: moment
                      .utc(element.CONFIRM_DATE)
                      .format("YYYY-MM-DD"),
                    RETURN_DATE: moment
                      .utc(element.RETURN_DATE)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              //set_cs_rma_table_data(loadeddata);
              set_cs_data(loadeddata);
              setColumnDef(columns_rmadata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_data([]);
              setColumnDef(columns_rmadata);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 'datacndbkhachhang':
        generalQuery("tracsCNDB", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CS_CNDB_DATA, index: number) => {
                  return {
                    ...element,
                    SA_REQUEST_DATE: moment
                      .utc(element.SA_REQUEST_DATE)
                      .format("YYYY-MM-DD"),
                    REQUEST_DATETIME: moment
                      .utc(element.REQUEST_DATETIME)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              //set_cs_cndb_table_data(loadeddata);
              set_cs_data(loadeddata);
              setColumnDef(columns_cndbdata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_data([]);
              setColumnDef(columns_cndbdata);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 'datataxi':
        generalQuery("tracsTAXI", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CS_TAXI_DATA, index: number) => {
                  return {
                    ...element,
                    TAXI_DATE: moment
                      .utc(element.TAXI_DATE)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              set_cs_data(loadeddata);
              setColumnDef(columns_taxidata)
              //set_cs_taxi_table_data(loadeddata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_data([]);
              setColumnDef(columns_taxidata);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      default:
        break;
    }
  };
  const setCSFormInfo = (keyname: string, value: any) => {
    let tempCSInfo = {
      ...filterData,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setFilterData(tempCSInfo);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_cs_data();
    }
  };
  const xacNhanDataTable = React.useMemo(
    () => (
      <CustomResponsiveContainer>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={cs_table_data}
          columnWidth="auto"
          keyExpr="id"
          height={"75vh"}
          showBorders={true}
          /* wordWrapEnabled={true} */
          onSelectionChanged={(e) => {
            //setFilterData(e.selectedRowsData[0]);
          }}
          onRowPrepared={(e) => {
            /*  e.rowElement.style.height = "20px"; */
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
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode="batch"
            confirmDelete={true}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(cs_table_data, "CS Xac Nhan Table");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
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
          <Column dataField='YEAR_WEEK' caption='YEAR_WEEK' width={80}></Column>
          <Column dataField='CONFIRM_ID' caption='CF_ID' width={80}></Column>
          <Column dataField='CONFIRM_DATE' caption='CF_DATE' width={80}></Column>
          <Column dataField='CONTACT_ID' caption='CONTACT_ID' width={100}></Column>
          <Column dataField='CS_EMPL_NO' caption='CS_EMPL_NO' width={100}></Column>
          <Column dataField='EMPL_NAME' caption='EMPL_NAME' width={120}></Column>
          <Column dataField='G_CODE' caption='G_CODE' width={100}></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={100}></Column>
          <Column dataField='G_NAME_KD' caption='G_NAME_KD' width={100}></Column>
          <Column dataField='PROD_REQUEST_NO' caption='YCSX' width={80}></Column>
          <Column dataField='CUST_CD' caption='CUST_CD' width={70}></Column>
          <Column dataField='CUST_NAME_KD' caption='CUST_NAME_KD' width={100}></Column>
          <Column dataField='CONTENT' caption='CONTENT' width={100}></Column>
          <Column dataField='LINK' caption='DEFECT_IMAGE' width={200} cellRender={(ele: any) => {
            let href = `/cs/CS_${ele.data.CONFIRM_ID}.jpg`;
            return (
              <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={200} height={100}></img></a>
            )
          }}></Column>
          <Column dataField='INSPECT_QTY' caption='INSPECT_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.INSPECT_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='NG_QTY' caption='NG_QTY' width={80} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'red' }}>{ele.data.NG_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='REPLACE_RATE' caption='REPLACE_RATE' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'purple' }}>{ele.data.REPLACE_RATE?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2, })}%</span>
            )
          }}></Column>
          <Column dataField='REDUCE_QTY' caption='REDUCE_QTY' width={90} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'green' }}>{ele.data.REDUCE_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='FACTOR' caption='NG.NHÂN' width={70}></Column>
          <Column dataField='RESULT' caption='RESULT' width={70}></Column>
          <Column dataField='CONFIRM_STATUS' caption='CF_STATUS' width={80}></Column>
          <Column dataField='REMARK' caption='REMARK' width={100}></Column>
          <Column dataField='INS_DATETIME' caption='INS_DATETIME' width={100}></Column>
          <Column dataField='PHANLOAI' caption='PHANLOAI' width={80}></Column>
          <Column dataField='PROD_TYPE' caption='PROD_TYPE' width={100}></Column>
          <Column dataField='PROD_MODEL' caption='PROD_MODEL' width={100}></Column>
          <Column dataField='PROD_PROJECT' caption='PROD_PROJECT' width={100}></Column>
          <Column dataField='PROD_LAST_PRICE' caption='PROD_PRICE' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: '#0C8ADC' }}>{ele.data.PROD_LAST_PRICE?.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6, })}</span>
            )
          }}></Column>
          <Column dataField='REDUCE_AMOUNT' caption='REDUCE_AMOUNT' width={110} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'green', fontWeight: 'bold' }}>{ele.data.REDUCE_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}</span>
            )
          }}></Column>
          <Column dataField='LINK' caption='DEFECT_IMAGE' width={200} cellRender={(ele: any) => {
            let href = `/cs/CS_${ele.data.CONFIRM_ID}.jpg`;
            let file: any = null;
            if (ele.data.LINK === 'Y') {
              return (
                <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={200} height={100}></img></a>
              )
            }
            else {
              return (
                <div className="csuploadbutton">
                  <button onClick={() => {
                    uploadCSImage(ele.data.CONFIRM_ID, file);
                  }}>Upload</button>
                  <input
                    accept='.jpg'
                    type='file'
                    onChange={(e: any) => {
                      file = e.target.files[0];
                    }}
                  />
                </div>
              )
            }
          }}></Column>
          <Column dataField='UP_NNDS' caption='UP_NNDS' width={120} cellRender={(ele: any) => {
            return (
              <button onClick={() => {
                setCurrentDefectRow(ele.data);
                setShowHideUpdateNNDS(true)
                setCurrentDS(ele.data.DOI_SACH);
                setCurrentNN(ele.data.NG_NHAN);
              }
              }>Update NNDS</button>
            )
          }}></Column>
          <Column dataField='NG_NHAN' caption='NG_NHAN' width={150} cellRender={(ele: any) => {
            return (
              <span style={{ width: '150px', color: 'red', fontWeight: 'bold', wordWrap: 'break-word' }}>{ele.data.NG_NHAN}</span>
            )
          }}></Column>
          <Column dataField='DOI_SACH' caption='DOI_SACH' width={150} cellRender={(ele: any) => {
            return (
              <span style={{ width: '150px', color: 'green', fontWeight: 'bold', wordWrap: 'break-word' }}>{ele.data.DOI_SACH}</span>
            )
          }}></Column>
          <Column dataField='DS_VN' caption='DS_VN' width={200} cellRender={(ele: any) => {
            let href = `/cs/CS_${ele.data.CONFIRM_ID}_VN.pptx`;
            let file: any = null;
            if (ele.data.DS_VN === 'Y') {
              return (
                <a href={href}>LINK</a>
              )
            }
            else {
              return (
                <div className="csuploadbutton">
                  <button onClick={() => {
                    uploadCSDoiSach(ele.data.CONFIRM_ID, file, "VN");
                  }}>Upload</button>
                  <input
                    accept='.pptx'
                    type='file'
                    onChange={(e: any) => {
                      file = e.target.files[0];
                    }}
                  />
                </div>
              )
            }
          }}></Column>
          <Column dataField='DS_KR' caption='DS_KR' width={200} cellRender={(ele: any) => {
            let href = `/cs/CS_${ele.data.CONFIRM_ID}_KR.pptx`;
            let file: any = null;
            if (ele.data.DS_KR === 'Y') {
              return (
                <a href={href}>LINK</a>
              )
            }
            else {
              return (
                <div className="csuploadbutton">
                  <button onClick={() => {
                    uploadCSDoiSach(ele.data.CONFIRM_ID, file, "KR");
                  }}>Upload</button>
                  <input
                    accept='.pptx'
                    type='file'
                    onChange={(e: any) => {
                      file = e.target.files[0];
                    }}
                  />
                </div>
              )
            }
          }}></Column>
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
    ),
    [cs_table_data],
  );
  const rmaDataTable = React.useMemo(
    () => (
      <CustomResponsiveContainer>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={cs_rma_table_data}
          columnWidth="auto"
          keyExpr="id"
          height={"75vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //setFilterData(e.selectedRowsData[0]);
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
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode="batch"
            confirmDelete={true}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(cs_rma_table_data, "CS RMA Table");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
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
          <Column dataField='RMA_ID' caption='RMA_ID' width={100}></Column>
          <Column dataField='CONFIRM_ID' caption='CONFIRM_ID' width={100}></Column>
          <Column dataField='G_NAME_KD' caption='G_NAME_KD' width={100}></Column>
          <Column dataField='RETURN_DATE' caption='RETURN_DATE' width={100}></Column>
          <Column dataField='PROD_REQUEST_NO' caption='PROD_REQUEST_NO' width={100}></Column>
          <Column dataField='G_CODE' caption='G_CODE' width={100}></Column>
          <Column dataField='RMA_TYPE' caption='RMA_TYPE' width={100}></Column>
          <Column dataField='RMA_EMPL_NO' caption='RMA_EMPL_NO' width={100}></Column>
          <Column dataField='INS_DATETIME' caption='INS_DATETIME' width={100}></Column>
          <Column dataField='FACTORY' caption='FACTORY' width={100}></Column>
          <Column dataField='RETURN_QTY' caption='RETURN_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.RETURN_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='SORTING_OK_QTY' caption='SORTING_OK_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.SORTING_OK_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='SORTING_NG_QTY' caption='SORTING_NG_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.SORTING_NG_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='RMA_DELIVERY_QTY' caption='RMA_DELIVERY_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.RMA_DELIVERY_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='PROD_LAST_PRICE' caption='PROD_LAST_PRICE' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: '#0C8ADC' }}>{ele.data.PROD_LAST_PRICE?.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6, })}</span>
            )
          }}></Column>
          <Column dataField='RETURN_AMOUNT' caption='RETURN_AMOUNT' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'green', fontWeight: 'bold' }}>{ele.data.RETURN_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}</span>
            )
          }}></Column>
          <Column dataField='SORTING_OK_AMOUNT' caption='SORTING_OK_AMOUNT' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'green', fontWeight: 'bold' }}>{ele.data.SORTING_OK_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}</span>
            )
          }}></Column>
          <Column dataField='SORTING_NG_AMOUNT' caption='SORTING_NG_AMOUNT' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'green', fontWeight: 'bold' }}>{ele.data.SORTING_NG_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}</span>
            )
          }}></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={100}></Column>
          <Column dataField='PROD_TYPE' caption='PROD_TYPE' width={100}></Column>
          <Column dataField='PROD_MODEL' caption='PROD_MODEL' width={100}></Column>
          <Column dataField='PROD_LAST_PRICE' caption='PROD_LAST_PRICE' width={100}></Column>
          <Column dataField='CONFIRM_DATE' caption='CONFIRM_DATE' width={100}></Column>
          <Column dataField='CS_EMPL_NO' caption='CS_EMPL_NO' width={100}></Column>
          <Column dataField='CONTENT' caption='CONTENT' width={100}></Column>
          <Column dataField='INSPECT_QTY' caption='INSPECT_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.INSPECT_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='NG_QTY' caption='NG_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.NG_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='REPLACE_RATE' caption='REPLACE_RATE' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'purple' }}>{ele.data.REPLACE_RATE?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2, })}%</span>
            )
          }}></Column>
          <Column dataField='REDUCE_QTY' caption='REDUCE_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.REDUCE_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
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
    ),
    [cs_rma_table_data],
  );
  const cndbDataTable = React.useMemo(
    () => (
      <CustomResponsiveContainer>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={cs_cndb_table_data}
          columnWidth="auto"
          keyExpr="id"
          height={"75vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //setFilterData(e.selectedRowsData[0]);
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
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode="batch"
            confirmDelete={true}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(cs_rma_table_data, "CS RMA Table");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
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
          <Column dataField='SA_ID' caption='SA_ID' width={100}></Column>
          <Column dataField='SA_REQUEST_DATE' caption='CNDB_DATE' width={100}></Column>
          <Column dataField='CONTACT_ID' caption='CONTACT_ID' width={100}></Column>
          <Column dataField='CS_EMPL_NO' caption='CS_EMPL_NO' width={100}></Column>
          <Column dataField='G_CODE' caption='G_CODE' width={100}></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={100}></Column>
          <Column dataField='CUST_NAME_KD' caption='CUST_NAME_KD' width={100}></Column>
          <Column dataField='PROD_REQUEST_NO' caption='PROD_REQUEST_NO' width={100}></Column>
          <Column dataField='REQUEST_DATETIME' caption='REQUEST_DATETIME' width={100}></Column>
          <Column dataField='CONTENT' caption='CONTENT' width={100}></Column>
          <Column dataField='SA_QTY' caption='SA_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.SA_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='RESULT' caption='RESULT' width={100}></Column>
          <Column dataField='SA_STATUS' caption='SA_STATUS' width={100}></Column>
          <Column dataField='SA_REMARK' caption='SA_REMARK' width={100}></Column>
          <Column dataField='INS_DATETIME' caption='INS_DATETIME' width={100}></Column>
          <Column dataField='SA_CUST_CD' caption='SA_CUST_CD' width={100}></Column>
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
    ),
    [cs_cndb_table_data],
  );
  const taxiDataTable = React.useMemo(
    () => (
      <CustomResponsiveContainer>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={cs_taxi_table_data}
          columnWidth="auto"
          keyExpr="id"
          height={"75vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //setFilterData(e.selectedRowsData[0]);
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
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode="batch"
            confirmDelete={true}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(cs_rma_table_data, "CS RMA Table");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
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
          <Column dataField='TAXI_ID' caption='TAXI_ID' width={80}></Column>
          <Column dataField='CONFIRM_ID' caption='CONFIRM_ID' width={80}></Column>
          <Column dataField='SA_ID' caption='SA_ID' width={50}></Column>
          <Column dataField='CHIEU' caption='CHIEU' width={50}></Column>
          <Column dataField='CONG_VIEC' caption='CONG_VIEC' width={100}></Column>
          <Column dataField='TAXI_DATE' caption='TAXI_DATE' width={100}></Column>
          <Column dataField='TAXI_SHIFT' caption='TAXI_SHIFT' width={100}></Column>
          <Column dataField='CS_EMPL_NO' caption='CS_EMPL_NO' width={100}></Column>
          <Column dataField='DIEM_DI' caption='DIEM_DI' width={100}></Column>
          <Column dataField='DIEM_DEN' caption='DIEM_DEN' width={100}></Column>
          <Column dataField='TAXI_AMOUNT' caption='TAXI_AMOUNT' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue' }}>{ele.data.TAXI_AMOUNT?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='TRANSPORTATION' caption='TRANSPORTATION' width={100}></Column>
          <Column dataField='TAXI_REMARK' caption='TAXI_REMARK' width={100}></Column>
          <Column dataField='INS_DATETIME' caption='INS_DATETIME' width={100}></Column>
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
    ),
    [cs_taxi_table_data],
  );

  const cs_data_ag_table = useMemo(() => {
    return (
      <AGTable
        rowHeight={option ==='dataconfirm' ? 100: 25}
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>
          </div>}
        columns={columnDef}
        data={cs_data}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={(params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}     />   
    )
  }, [cs_data, columnDef, option]);

  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: 'YEAR_WEEK',
        width: 80,
        dataField: 'YEAR_WEEK',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONFIRM_ID',
        width: 80,
        dataField: 'CONFIRM_ID',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONFIRM_DATE',
        width: 80,
        dataField: 'CONFIRM_DATE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONTACT_ID',
        width: 80,
        dataField: 'CONTACT_ID',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CS_EMPL_NO',
        width: 80,
        dataField: 'CS_EMPL_NO',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'EMPL_NAME',
        width: 80,
        dataField: 'EMPL_NAME',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'G_CODE',
        width: 80,
        dataField: 'G_CODE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'G_NAME',
        width: 80,
        dataField: 'G_NAME',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'G_NAME_KD',
        width: 80,
        dataField: 'G_NAME_KD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_REQUEST_NO',
        width: 80,
        dataField: 'PROD_REQUEST_NO',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CUST_CD',
        width: 80,
        dataField: 'CUST_CD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CUST_NAME_KD',
        width: 80,
        dataField: 'CUST_NAME_KD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONTENT',
        width: 80,
        dataField: 'CONTENT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INSPECT_QTY',
        width: 80,
        dataField: 'INSPECT_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'NG_QTY',
        width: 80,
        dataField: 'NG_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REPLACE_RATE',
        width: 80,
        dataField: 'REPLACE_RATE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REDUCE_QTY',
        width: 80,
        dataField: 'REDUCE_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'FACTOR',
        width: 80,
        dataField: 'FACTOR',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'RESULT',
        width: 80,
        dataField: 'RESULT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONFIRM_STATUS',
        width: 80,
        dataField: 'CONFIRM_STATUS',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REMARK',
        width: 80,
        dataField: 'REMARK',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INS_DATETIME',
        width: 80,
        dataField: 'INS_DATETIME',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PHANLOAI',
        width: 80,
        dataField: 'PHANLOAI',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'LINK',
        width: 80,
        dataField: 'LINK',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_TYPE',
        width: 80,
        dataField: 'PROD_TYPE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_MODEL',
        width: 80,
        dataField: 'PROD_MODEL',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_PROJECT',
        width: 80,
        dataField: 'PROD_PROJECT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_LAST_PRICE',
        width: 80,
        dataField: 'PROD_LAST_PRICE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REDUCE_AMOUNT',
        width: 80,
        dataField: 'REDUCE_AMOUNT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      },
    ],
    store: cs_table_data,
  });
  useEffect(() => {
  }, []);
  return (
    <DataDiv>
      <QueryFormDiv style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <FromInputDiv>
          <FromInputColumn>
            <label>
              <b>Từ ngày:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={filterData?.FROM_DATE.slice(0, 10)}
                onChange={(e) => setCSFormInfo("FROM_DATE", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={filterData?.TO_DATE.slice(0, 10)}
                onChange={(e) => setCSFormInfo("TO_DATE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>Code KD:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={filterData?.G_NAME}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setCSFormInfo("G_NAME", e.target.value)}
              ></input>
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <b>Code ERP:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={filterData?.G_CODE}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setCSFormInfo("G_CODE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>YCSX:</b>{" "}
              <input
                type="text"
                placeholder="YCSX"
                value={filterData?.PROD_REQUEST_NO}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setCSFormInfo("PROD_REQUEST_NO", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Khách hàng:</b>{" "}
              <input
                type="text"
                placeholder="Khách hàng"
                value={filterData?.CUST_NAME_KD}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setCSFormInfo("CUST_NAME_KD", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>Chọn data:</b>{" "}
              <select
                name="datatimekiem"
                value={option}
                onChange={(e) => {
                  setOption(e.target.value);
                }}
              >
                <option value="dataconfirm">Lịch Sử Xác Nhận Lỗi</option>
                <option value="datarma">Lịch Sử RMA</option>
                <option value="datacndbkhachhang">Lịch Sử Xin CNĐB</option>
                <option value="datataxi">Lịch Sử Taxi</option>
              </select>
            </label>
          </FromInputColumn>
        </FromInputDiv>
        <FormButtonColumn>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
            load_cs_data();
          }}>Load Data</Button>
        </FormButtonColumn>
      </QueryFormDiv>
      <DataTBDiv>
        {cs_data_ag_table}
       {/*  {option === 'dataconfirm' && xacNhanDataTable}
        {option === 'datarma' && rmaDataTable}
        {option === 'datacndbkhachhang' && cndbDataTable}
        {option === 'datataxi' && taxiDataTable} */}
      </DataTBDiv>
      {showhidePivotTable && (
        <PivotTableDiv>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowHidePivotTable(false);
            }}
          >
            <AiFillCloseCircle color="blue" size={15} />
            Close
          </IconButton>
          <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
        </PivotTableDiv>
      )}
      {showhideupdatennds && <NNDSDiv>
        <span style={{ fontWeight: 'bold' }}>Form update nguyên nhân đối sách</span>
        <div className="inputbox">
          1. Hiện tượng (현상)
          <div className="hientuongdiv" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', color: 'blue' }}>Khách: {currentDefectRow.CUST_NAME_KD}| <span style={{ fontWeight: 'bold', color: 'red' }}>Hiện tượng: {currentDefectRow.CONTENT} </span></span>
            <img src={`/cs/CS_${currentDefectRow.CONFIRM_ID}.jpg`} width={'400px'} height={'200px'}></img>
          </div>
          2. Nguyên nhân (원인)
          <textarea rows={8} style={{ width: '100%', color: 'red' }} value={currentNN} onChange={(e) => { setCurrentNN(e.target.value) }}></textarea>
          3. Đối sách (대책)
          <textarea rows={8} style={{ width: '100%', color: 'green' }} value={currentDS} onChange={(e) => { setCurrentDS(e.target.value) }}></textarea>
        </div>
        <div className="buttondiv">
          <button onClick={() => {
            updateNNDS();
          }}>Update</button>
          <button onClick={() => {
            setShowHideUpdateNNDS(false);
            setCurrentDS('');
            setCurrentNN('');
            setCurrentDefectRow({
              YEAR_WEEK: '',
              CONFIRM_ID: 0,
              CONFIRM_DATE: '',
              CONTACT_ID: 0,
              CS_EMPL_NO: '',
              EMPL_NAME: '',
              G_CODE: '',
              G_NAME: '',
              G_NAME_KD: '',
              PROD_REQUEST_NO: '',
              CUST_CD: '',
              CUST_NAME_KD: '',
              CONTENT: '',
              INSPECT_QTY: 0,
              NG_QTY: 0,
              REPLACE_RATE: 0,
              REDUCE_QTY: 0,
              FACTOR: '',
              RESULT: '',
              CONFIRM_STATUS: '',
              REMARK: '',
              INS_DATETIME: '',
              PHANLOAI: '',
              LINK: '',
              PROD_TYPE: '',
              PROD_MODEL: '',
              PROD_PROJECT: '',
              PROD_LAST_PRICE: 0,
              REDUCE_AMOUNT: 0,
              NG_NHAN: '',
              DOI_SACH: '',
              DS_VN: '',
              DS_KR: ''
            });
          }}>Close</button>
        </div>
      </NNDSDiv>
      }
    </DataDiv>
  );
};
export default CS_DATA_TB;

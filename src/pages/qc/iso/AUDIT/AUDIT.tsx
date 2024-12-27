import {
  Autocomplete,
  Button,
  IconButton,
  TextField,
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
  KeyboardNavigation,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillCloseCircle, AiFillFileAdd, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { generalQuery, getGlobalSetting, getUserData, uploadQuery } from "../../../../api/Api";
import { AUDIT_CHECKLIST_RESULT, AUDIT_CHECK_LIST, AUDIT_LIST, AUDIT_RESULT, CSCONFIRM_DATA, CS_CNDB_DATA, CS_RMA_DATA, CS_TAXI_DATA, CustomerListData, WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import { CustomResponsiveContainer, SaveExcel,} from "../../../../api/GlobalFunction";
import './AUDIT.scss'
import { HiSave } from "react-icons/hi";
import { TbLogout } from "react-icons/tb";
import { BiCloudUpload, BiRefresh } from "react-icons/bi";
import * as XLSX from "xlsx";
import AGTable from "../../../../components/DataTable/AGTable";
const AUDIT = () => {
  const [passScore, setPassScore] = useState(80);
  const [auditname, setAuditName] = useState("");
  const [customerList, setCustomerList] = useState<CustomerListData[]>([
    {
      CUST_CD: "0003",
      CUST_NAME_KD: "PHAN D&D HA NOI",
      CUST_NAME: "PHAN D&D HA NOI",
    },
  ]);
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>({
      CUST_CD: "0003",
      CUST_NAME_KD: "PHAN D&D HA NOI",
      CUST_NAME: "PHAN D&D HA NOI",
    });
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const showhidesearchdiv = useRef(false);
  const dataGridRef = useRef<any>(null);
  const [sh, setSH] = useState(true);
  const [showhideaddform, setShowHideAddForm] = useState(false);
  const [selectedAuditResultID, setSelectedAuditResultID] = useState(-1);
  const [auditList, setAuditList] = useState<AUDIT_LIST[]>([]);
  const [auditResultList, setAuditResultList] = useState<AUDIT_RESULT[]>([]);
  const [auditResultCheckList, setAuditResultCheckList] = useState<AUDIT_CHECKLIST_RESULT[]>([]);
  const selectedauditResultCheckListRows = useRef<AUDIT_CHECKLIST_RESULT[]>([]);
  const [selectedAuditID, setSelectedAuditID] = useState(1);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
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
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [selectedUploadExcelRow, setSelectedUploadExcelRow] = useState<AUDIT_CHECK_LIST[]>([]);
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
        setUploadExcelJSon(json.map((element: any, index: number) => {
          return {
            ...element,
            id: index
          }
        }));
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const getcustomerlist = () => {
    generalQuery("selectCustomerAndVendorList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const insertCheckSheetList = async () => {
    let err_code: number = 0;
    let lastAudit_ID: number = 1;
    await generalQuery("checklastAuditID", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          lastAudit_ID = response.data.data[0].MAX_AUDIT_ID;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 0; i < uploadExcelJson.length; i++) {
      await generalQuery("insertCheckSheetData", {
        AUDIT_ID: lastAudit_ID,
        MAIN_ITEM_NO: uploadExcelJson[i].MAIN_ITEM_NO,
        MAIN_ITEM_CONTENT: uploadExcelJson[i].MAIN_ITEM_CONTENT,
        SUB_ITEM_NO: uploadExcelJson[i].SUB_ITEM_NO,
        SUB_ITEM_CONTENT: uploadExcelJson[i].SUB_ITEM_CONTENT,
        LEVEL_CAT: uploadExcelJson[i].LEVEL_CAT,
        DETAIL_VN: uploadExcelJson[i].DETAIL_VN,
        DETAIL_KR: uploadExcelJson[i].DETAIL_KR,
        DETAIL_EN: uploadExcelJson[i].DETAIL_EN,
        MAX_SCORE: uploadExcelJson[i].MAX_SCORE,
        DEPARTMENT: uploadExcelJson[i].DEPARTMENT,
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
          } else {
            console.log('Error', response.data.message);
          }
        })
        .catch((error) => {
          err_code = 1;
          console.log(error);
        });
    }
    if (err_code === 0) {
      Swal.fire("Thông báo", "Thêm thành công", "success");
    }
    else {
      Swal.fire("Thông báo", "Thêm checksheet lỗi, hãy kiểm tra lại", "error");
    }
  }
  const insertNewAuditInfo = async () => {
    //check if auditname exist
    let auditnameExist: boolean = false;
    if (auditname !== '') {
      await generalQuery("checkAuditNamebyCustomer", {
        AUDIT_NAME: auditname,
        CUST_CD: selectedCust_CD?.CUST_CD,
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            if (response.data.data.length > 0) auditnameExist = true;
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (!auditnameExist) {
        if (uploadExcelJson.length > 0) {
          await generalQuery("insertNewAuditInfo", {
            AUDIT_NAME: auditname,
            CUST_CD: selectedCust_CD?.CUST_CD,
            PASS_SCORE: passScore
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                insertCheckSheetList();
              } else {
                Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        else {
          Swal.fire("Thông báo", "Nội dung checksheet trống !", "error");
        }
      }
      else {
        Swal.fire("Thông báo", "Đã có Audit này với khách này rồi,chọn khách khác hoặc sửa tên audit", "error");
      }
    }
    else {
      Swal.fire("Thông báo", "Hãy nhập tên Audit", "error");
    }
  }
  const upFormAuditTable = React.useMemo(
    () => (
      <div className="datatb">
        <DataGrid
          style={{ fontSize: "0.7rem" }}
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={uploadExcelJson}
          columnWidth="auto"
          keyExpr="id"
          height={"80vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //console.log(e.selectedRowsData);
            /*  setSelectedRowsDataYCSX(e.selectedRowsData); */
            setSelectedUploadExcelRow(e.selectedRowsData);
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
          <Selection mode="multiple" selectAllMode="allPages" />
          <Editing
            allowUpdating={false}
            allowAdding={false}
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
                  SaveExcel(uploadExcelJson, "AuditCheckListTable");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
            <Item name="addRowButton" />
            <Item name="saveButton" />
            <Item name="revertButton" />
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
          <Column dataField="id" caption="ID" width={60} allowEditing={false} />
          <Column dataField="MAIN_ITEM_NO" caption="MAIN_ITEM_NO" width={60} allowEditing={false} />
          <Column dataField="MAIN_ITEM_CONTENT" caption="MAIN_ITEM_CONTENT" width={150} allowEditing={false} />
          <Column dataField="SUB_ITEM_NO" caption="SUB_ITEM_NO" width={60} allowEditing={false} />
          <Column dataField="SUB_ITEM_CONTENT" caption="SUB_ITEM_CONTENT" width={150} allowEditing={false} />
          <Column dataField="LEVEL_CAT" caption="LEVEL_CAT" width={100} allowEditing={false} />
          <Column dataField="DETAIL_VN" caption="DETAIL_VN" width={200} allowEditing={false} />
          <Column dataField="DETAIL_KR" caption="DETAIL_KR" width={200} allowEditing={false} />
          <Column dataField="DETAIL_EN" caption="DETAIL_EN" width={200} allowEditing={false} />
          <Column dataField="MAX_SCORE" caption="MAX_SCORE" width={100} allowEditing={false} />
          <Column dataField="DEPARTMENT" caption="DEPARTMENT" width={100} allowEditing={false} />
          <Summary>
            <TotalItem
              alignment="right"
              column="G_CODE"
              summaryType="count"
              valueFormat={"decimal"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [uploadExcelJson],
  );
  const loadAuditList = () => {
    generalQuery("auditlistcheck", filterData)
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: AUDIT_LIST, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setAuditList(loadeddata);
          clearSelection();
        } else {
          setAuditList([]);
          clearSelection();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const loadAuditResultList = (audit_id: number) => {
    generalQuery("loadAuditResultList", {
      AUDIT_ID: audit_id
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: AUDIT_RESULT, index: number) => {
              return {
                ...element,
                AUDIT_DATE: moment(element.AUDIT_DATE).format('YYYY-MM-DD'),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setAuditResultList(loadeddata);
        } else {
          setAuditResultList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const loadAuditResultCheckList = (auditResultID: number) => {
    generalQuery("loadAuditResultCheckList", {
      AUDIT_RESULT_ID: auditResultID
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: AUDIT_CHECKLIST_RESULT, index: number) => {
              return {
                ...element,                
                INS_DATE: moment(element.INS_DATE).format('YYYY-MM-DD HH:mm:ss'),
                UPD_DATE: element.UPD_DATE !== null ? moment(element.UPD_DATE).format('YYYY-MM-DD HH:mm:ss') : '',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setAuditResultCheckList(loadeddata);
        } else {
          setAuditResultCheckList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const checkAuditResultCheckListExist = async (auditResultID: number) => {
    let kq: boolean = false;
    await generalQuery("checkAuditResultCheckListExist", {
      AUDIT_RESULT_ID: auditResultID
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          if (response.data.data.length > 0) {
            kq = true;
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }
  const insertNewResultCheckList = (auditResultID: number, auditID: number) => {
    generalQuery("insertResultIDtoCheckList", {
      AUDIT_RESULT_ID: auditResultID,
      AUDIT_ID: auditID
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //loadAuditResultCheckList(auditResultID);
        } else {
        }
        loadAuditResultCheckList(auditResultID);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const createNewAudit = () => {
    generalQuery("createNewAudit", {
      AUDIT_ID: selectedAuditID,
      AUDIT_NAME: auditList.filter((ele: AUDIT_LIST, index: number) => ele.AUDIT_ID === selectedAuditID)[0].AUDIT_NAME
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          loadAuditResultList(selectedAuditID);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const uploadAuditEvident = async (auditresultid: number, auditresultdetailid: number, up_file: any) => {
    if (up_file !== undefined && up_file !== null) {
      let filenamelist: string = "";
      if (up_file.length > 0) {
        let isUploaded: boolean = true;
        for (let i = 0; i < up_file.length; i++) {
          let file_name: string = up_file[i].name;
          filenamelist += file_name + ",";
          await uploadQuery(up_file[i], "AUDIT_" + auditresultid + "_" + auditresultdetailid + "_" + file_name, "audit")
            .then((response) => {
              if (response.data.tk_status !== "NG") {
              } else {
                isUploaded = false;
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
        if (isUploaded) {
          filenamelist = filenamelist.substring(0, filenamelist.length - 1);
          console.log(filenamelist);
          generalQuery("updateEvident", { AUDIT_RESULT_DETAIL_ID: auditresultdetailid, AUDIT_EVIDENT: filenamelist })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
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
        }
        else {
          Swal.fire(
            "Thông báo",
            "Upload file thất bại:",
            "error"
          );
        }
      }
      else {
        Swal.fire("Thông báo", "Hãy chọn file", "warning");
      }
      if (up_file !== null && up_file !== undefined) {
      }
      else {
        Swal.fire("Thông báo", "Hãy chọn file", "warning");
      }
    }
    else {
      Swal.fire(
        "Thông báo",
        "Hãy chọn file trước",
        "warning"
      );
    }
  }
  const setCSFormInfo = (keyname: string, value: any) => {
    let tempCSInfo = {
      ...filterData,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setFilterData(tempCSInfo);
  };
  const resetEvident = () => {
    if (selectedauditResultCheckListRows.current.length > 0) {
      for (let i = 0; i < selectedauditResultCheckListRows.current.length; i++) {
        generalQuery("resetEvident", {
          AUDIT_RESULT_DETAIL_ID: selectedauditResultCheckListRows.current[i].AUDIT_RESULT_DETAIL_ID,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      clearSelection();
      Swal.fire('Thông báo', 'Đã reset xong, hãy kiểm tra lại', 'success');
    }
    else {
      Swal.fire('Thông báo', 'Chưa chọn dòng nào', 'warning');
    }
  }
  const confirmSaveCheckSheet = () => {
    Swal.fire({
      title: "Lưu checksheet",
      text: "Bạn có muốn chắc chắn lưu checksheet ? Chỉ lưu những dòng đã tick chọn ! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Lưu!?",
    }).then((result) => {
      if (result.isConfirmed) {
        saveCheckSheet();
      }
    });
  }
  const confirmResetEvident = () => {
    Swal.fire({
      title: "Reset Evident",
      text: "Bạn có muốn chắc chắn reset Evident ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn reset!",
    }).then((result) => {
      if (result.isConfirmed) {
        resetEvident();
      }
    });
  }
  const saveCheckSheet = () => {
    if (selectedauditResultCheckListRows.current.length > 0) {
      for (let i = 0; i < selectedauditResultCheckListRows.current.length; i++) {
        generalQuery("updatechecksheetResultRow", {
          AUDIT_RESULT_DETAIL_ID: selectedauditResultCheckListRows.current[i].AUDIT_RESULT_DETAIL_ID,
          REMARK: selectedauditResultCheckListRows.current[i].REMARK,
          AUDIT_SCORE: selectedauditResultCheckListRows.current[i].AUDIT_SCORE,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      clearSelection();
      Swal.fire('Thông báo', 'Đã cập nhật xong, hãy kiểm tra lại', 'success');
    }
    else {
      Swal.fire('Thông báo', 'Chưa chọn dòng nào', 'warning');
    }
  }
  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      selectedauditResultCheckListRows.current = [];
      //console.log(dataGridRef.current);
    }
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
    }
  };
  const auditListResultCheckListTable = React.useMemo(
    () => (
      <div className="datatb">
        <CustomResponsiveContainer>
          <DataGrid
            ref={dataGridRef}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={auditResultCheckList}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            /* wordWrapEnabled={true} */
            onSelectionChanged={(e) => {
              //setFilterData(e.selectedRowsData[0]);
              //console.log(e.selectedRowsData)
              selectedauditResultCheckListRows.current = e.selectedRowsData
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
            <Selection mode="multiple" selectAllMode="allPages" />
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"column"}
            />
            <Editing
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              mode="cell"
              confirmDelete={true}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    showhidesearchdiv.current = !showhidesearchdiv.current;
                    setSH(!showhidesearchdiv.current);
                  }}
                >
                  <TbLogout color='green' size={15} />
                  Show/Hide
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(auditResultCheckList, "auditResultCheckList");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    confirmSaveCheckSheet();
                  }}
                >
                  <HiSave color="#05db5e" size={15} />
                  Lưu Checksheet
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    if (getUserData()?.SUBDEPTNAME === 'ISO' || getUserData()?.EMPL_NO === 'NHU1903') {
                      confirmResetEvident();
                    }
                    else {
                      Swal.fire("Cánh báo", "Không đủ quyền hạn", 'warning');
                    }
                  }}
                >
                  <HiSave color="#ff0000" size={15} />
                  Reset Evident
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    if (selectedAuditResultID !== -1) {
                      loadAuditResultCheckList(selectedAuditResultID);
                    }
                    else {
                      Swal.fire('Thông báo', 'Chọn ít nhất một checksheet kết quả audit để refresh (bảng bên phải)', 'error');
                    }
                    loadAuditList();
                  }}
                >
                  <BiRefresh color='yellow' size={20} />
                  Refresh
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
            <Column dataField="AUDIT_RESULT_DETAIL_ID" caption="RS_DT_ID" width={50} allowEditing={false} />
            <Column dataField="AUDIT_RESULT_ID" caption="RS_ID" width={50} allowEditing={false} />
            <Column dataField="AUDIT_DETAIL_ID" caption="DT_ID" width={50} allowEditing={false} />
            <Column dataField="AUDIT_ID" caption="AD_ID" width={50} allowEditing={false} />
            <Column dataField="AUDIT_NAME" caption="AUDIT_NAME" width={100} allowEditing={false} />
            <Column dataField="MAIN_ITEM_NO" caption="MAIN_NO" width={60} allowEditing={false} />
            <Column dataField="MAIN_ITEM_CONTENT" caption="MAIN_CONTENT" width={150} allowEditing={false} />
            <Column dataField="SUB_ITEM_NO" caption="SUB_NO" width={60} allowEditing={false} />
            <Column dataField="SUB_ITEM_CONTENT" caption="SUB_CONTENT" width={150} allowEditing={false} />
            <Column dataField="LEVEL_CAT" caption="LEVEL_CAT" width={100} allowEditing={false} />
            <Column dataField="DETAIL_VN" caption="DETAIL_VN" width={200} allowEditing={false} />
            <Column dataField="DETAIL_KR" caption="DETAIL_KR" width={200} allowEditing={false} />
            <Column dataField="DETAIL_EN" caption="DETAIL_EN" width={200} allowEditing={false} />
            <Column dataField="MAX_SCORE" caption="MAX_SCORE" width={100} allowEditing={false} />
            <Column dataField="AUDIT_SCORE" caption="AUDIT_SCORE" width={100} allowEditing={true} />
            <Column dataField="AUDIT_EVIDENT" caption="EVIDENT_FILE" width={100} allowEditing={false} />
            <Column dataField="EVIDENT_IMAGE" caption="EVIDENT_IMAGE" width={250} allowEditing={false} cellRender={(ele: any) => {
              if (ele.data.AUDIT_EVIDENT !== null) {
                let fileList: string[] = ele.data.AUDIT_EVIDENT.split(',');
                return (
                  <div className="evident_div" style={{ display: 'flex', gap: '10px' }}>
                    {
                      fileList.map((element: string, index: number) => {
                        let href = `/audit/AUDIT_${ele.data.AUDIT_RESULT_ID}_${ele.data.AUDIT_RESULT_DETAIL_ID}_${element}`;
                        return (
                          <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={50} height={50}></img></a>
                        )
                      })
                    }
                  </div>
                )
              }
              else {
              }
            }} />
            <Column dataField='AUDIT_EVIDENT2' caption='UPLOAD EVIDENT' width={200} cellRender={(ele: any) => {
              let href = `/audit/AUDIT_${ele.data.AUDIT_RESULT_DETAIL_ID}.jpg`;
              let file: any = null;
              if (ele.data.AUDIT_EVIDENT === 'Y') {
                return (
                  <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={200} height={100}></img></a>
                )
              }
              else {
                return (
                  <div className="csuploadbutton">
                    <button onClick={() => {
                      uploadAuditEvident(ele.data.AUDIT_RESULT_ID, ele.data.AUDIT_RESULT_DETAIL_ID, file);
                    }}>Upload</button>
                    <input
                      accept='.jpg'
                      type='file'
                      multiple={true}
                      onChange={(e: any) => {
                        file = e.target.files;
                      }}
                    />
                  </div>
                )
              }
            }} allowEditing={false}></Column>
            <Column dataField="REMARK" caption="REMARK" width={100} allowEditing={true} />
            <Column dataField="DEPARTMENT" caption="DEPARTMENT" width={100} allowEditing={false} />
            <Column dataField="INS_DATE" caption="INS_DATE" width={100} allowEditing={false} />
            <Column dataField="INS_EMPL" caption="INS_EMPL" width={100} allowEditing={false} />
            <Column dataField="UPD_DATE" caption="UPD_DATE" width={100} allowEditing={false} />
            <Column dataField="UPD_EMPL" caption="UPD_EMPL" width={100} allowEditing={false} />
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
    [auditResultCheckList],
  );
  const auditListResultTable = React.useMemo(
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
            dataSource={auditResultList}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //setFilterData(e.selectedRowsData[0]);
            }}
            onRowClick={async (e) => {
              //console.log(e.data);
              setSelectedAuditResultID(e.data.AUDIT_RESULT_ID);
              if (await checkAuditResultCheckListExist(e.data.AUDIT_RESULT_ID)) {
                loadAuditResultCheckList(e.data.AUDIT_RESULT_ID);
              }
              else {
                insertNewResultCheckList(e.data.AUDIT_RESULT_ID, e.data.AUDIT_ID);
              }
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
                    SaveExcel(auditResultList, "auditResultList");
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
            <Column dataField="AUDIT_RESULT_ID" caption="RS_ID" width={50} />
            <Column dataField="AUDIT_ID" caption="AD_ID" width={50} />
            <Column dataField="AUDIT_NAME" caption="AUDIT_NAME" width={100} />
            <Column dataField="AUDIT_DATE" caption="AUDIT_DATE" width={80} />
            <Column dataField="REMARK" caption="REMARK" width={100} />
            <Column dataField="INS_DATE" caption="INS_DATE" width={100} />
            <Column dataField="INS_EMPL" caption="INS_EMPL" width={100} />
            <Column dataField="UPD_DATE" caption="UPD_DATE" width={100} />
            <Column dataField="UPD_EMPL" caption="UPD_EMPL" width={100} />
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
    [auditResultList],
  );
  const columns_Audit_List_Table = [
    {
      field: 'AUDIT_RESULT_ID',
      headerName: 'RS_ID',
      width: 40
    },
    {
      field: 'AUDIT_ID',
      headerName: 'AD_ID',
      width: 40
    },
    {
      field: 'AUDIT_NAME',
      headerName: 'AUDIT_NAME',
      width: 120
    },
    {
      field: 'AUDIT_DATE',
      headerName: 'AUDIT_DATE',
      width: 80
    },
    {
      field: 'REMARK',
      headerName: 'REMARK',
      width: 100
    },
    {
      field: 'INS_DATE',
      headerName: 'INS_DATE',
      width: 120
    },
    {
      field: 'INS_EMPL',
      headerName: 'INS_EMPL',
      width: 60
    },
    {
      field: 'UPD_DATE',
      headerName: 'UPD_DATE',
      width: 120
    },
    {
      field: 'UPD_EMPL',
      headerName: 'UPD_EMPL',
      width: 60
    },

  ];
  const columns_Audit_CheckList_Table = [
    {
      field: 'AUDIT_RESULT_DETAIL_ID',
      headerName: 'RS_DT_ID',
      width: 50
    },
    {
      field: 'AUDIT_RESULT_ID',
      headerName: 'RS_ID',
      width: 30
    },
    {
      field: 'AUDIT_DETAIL_ID',
      headerName: 'DT_ID',
      width: 40
    },
    {
      field: 'AUDIT_ID',
      headerName: 'AD_ID',
      width: 40
    },
    {
      field: 'AUDIT_NAME',
      headerName: 'AUDIT_NAME',
      width: 120
    },
    {
      field: 'MAIN_ITEM_NO',
      headerName: 'MAIN_NO',
      width: 50
    },
    {
      field: 'MAIN_ITEM_CONTENT',
      headerName: 'MAIN_CONTENT',
      width: 100
    },
    {
      field: 'SUB_ITEM_NO',
      headerName: 'SUB_NO',
      width: 45
    },
    {
      field: 'SUB_ITEM_CONTENT',
      headerName: 'SUB_CONTENT',
      width: 150
    },
    {
      field: 'LEVEL_CAT',
      headerName: 'LEVEL_CAT',
      width: 60
    },
    {
      field: 'DETAIL_VN',
      headerName: 'DETAIL_VN',
      width: 200
    },   
    {
      field: 'MAX_SCORE',
      headerName: 'MAX_SCORE',
      width: 60
    },
    {
      field: 'AUDIT_SCORE',
      headerName: 'AUDIT_SCORE',
      width: 70
    },
    {
      field: 'AUDIT_EVIDENT',
      headerName: 'EVD_FILE',
      width: 60
    },
    {
      field: 'EVIDENT_IMAGE',
      headerName: 'EVD_IMAGE',
      width: 200,
      cellRenderer :(ele: any) => {
        if (ele.data.AUDIT_EVIDENT !== null) {
          let fileList: string[] = ele.data.AUDIT_EVIDENT.split(',');
          return (
            <div className="evident_div" style={{ display: 'flex', gap: '10px',}}>
              {
                fileList.map((element: string, index: number) => {
                  let href = `/audit/AUDIT_${ele.data.AUDIT_RESULT_ID}_${ele.data.AUDIT_RESULT_DETAIL_ID}_${element}`;
                  return (
                    <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={50} height={50}></img></a>
                  )
                })
              }
            </div>
          )
        }
        else {
        }
      }

    },
    {
      field: 'AUDIT_EVIDENT2',
      headerName: 'UPLOAD EVIDENT',
      width: 200,
      cellRenderer :(ele: any) => {
        let href = `/audit/AUDIT_${ele.data.AUDIT_RESULT_DETAIL_ID}.jpg`;
        let file: any = null;
        if (ele.data.AUDIT_EVIDENT === 'Y') {
          return (
            <div>
            <a target="_blank" rel="noopener noreferrer" href={href} ><img src={href} width={200} height={100}></img></a>
            </div>
          )
        }
        else {
          return (
            <div className="csuploadbutton">
              <button onClick={() => {
                uploadAuditEvident(ele.data.AUDIT_RESULT_ID, ele.data.AUDIT_RESULT_DETAIL_ID, file);
              }}>Upload</button>
              <input
                accept='.jpg'
                type='file'
                multiple={true}
                onChange={(e: any) => {
                  file = e.target.files;
                }}
              />
            </div>
          )
        }
      }
    },
    {
      field: 'REMARK',
      headerName: 'REMARK',
      width: 100
    },
    {
      field: 'DEPARTMENT',
      headerName: 'DEPARTMENT',
      width: 70
    },
    {
      field: 'DETAIL_KR',
      headerName: 'DETAIL_KR',
      width: 200
    },
    {
      field: 'DETAIL_EN',
      headerName: 'DETAIL_EN',
      width: 200
    },
    {
      field: 'INS_DATE',
      headerName: 'INS_DATE',
      width: 100
    },
    {
      field: 'INS_EMPL',
      headerName: 'INS_EMPL',
      width: 60
    },
    {
      field: 'UPD_DATE',
      headerName: 'UPD_DATE',
      width: 100
    },
    {
      field: 'UPD_EMPL',
      headerName: 'UPD_EMPL',
      width: 60
    },

  ];
  const audit_checklist_data_ag_table = useMemo(() => {
    return (
      <AGTable        
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>
            <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    showhidesearchdiv.current = !showhidesearchdiv.current;
                    setSH(!showhidesearchdiv.current);
                  }}
                >
                  <TbLogout color='green' size={15} />
                  Show/Hide
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(auditResultCheckList, "auditResultCheckList");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    confirmSaveCheckSheet();
                  }}
                >
                  <HiSave color="#05db5e" size={15} />
                  Lưu Checksheet
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    if (getUserData()?.SUBDEPTNAME === 'ISO' || getUserData()?.EMPL_NO === 'NHU1903') {
                      confirmResetEvident();
                    }
                    else {
                      Swal.fire("Cánh báo", "Không đủ quyền hạn", 'warning');
                    }
                  }}
                >
                  <HiSave color="#ff0000" size={15} />
                  Reset Evident
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    if (selectedAuditResultID !== -1) {
                      loadAuditResultCheckList(selectedAuditResultID);
                    }
                    else {
                      Swal.fire('Thông báo', 'Chọn ít nhất một checksheet kết quả audit để refresh (bảng bên phải)', 'error');
                    }
                    loadAuditList();
                  }}
                >
                  <BiRefresh color='yellow' size={20} />
                  Refresh
                </IconButton>
          </div>}        
          rowHeight={50}
        columns={columns_Audit_CheckList_Table}
        data={auditResultCheckList}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={(params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          selectedauditResultCheckListRows.current = params!.api.getSelectedRows()
        }}     />   
    )
  }, [auditResultCheckList, columns_Audit_CheckList_Table]);
  const audit_list_data_ag_table = useMemo(() => {
    return (
      <AGTable        
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>           
          </div>}
        columns={columns_Audit_List_Table}
        data={auditResultList}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
          setSelectedAuditResultID(params.data.AUDIT_RESULT_ID);
          if (await checkAuditResultCheckListExist(params.data.AUDIT_RESULT_ID)) {
            loadAuditResultCheckList(params.data.AUDIT_RESULT_ID);
          }
          else {
            insertNewResultCheckList(params.data.AUDIT_RESULT_ID, params.data.AUDIT_ID);
          }

        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          selectedauditResultCheckListRows.current = params!.api.getSelectedRows()
        }}     />   
    )
  }, [auditResultList, columns_Audit_List_Table]);

  useEffect(() => {
    getcustomerlist();
    loadAuditList();
    loadAuditResultList(selectedAuditID);
  }, []);
  return (
    <div className="audit">
      <div className="tracuuDataInspection">
        {sh && <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
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
            </div>
            <div className="forminputcolumn">
              <label>
                <b>List Audit:</b>{" "}
                <select
                  name="datatimekiem"
                  value={selectedAuditID}
                  onChange={(e) => {
                    setSelectedAuditID(Number(e.target.value));
                    setSelectedAuditResultID(-1);
                    loadAuditResultList(Number(e.target.value));
                  }}
                >
                  {
                    auditList.map((ele: AUDIT_LIST, index: number) => {
                      return (
                        <option key={index} value={ele.AUDIT_ID}>{ele.CUST_NAME_KD}:{ele.AUDIT_NAME}</option>
                      )
                    })
                  }
                </select>
              </label>             
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#bb10ff', color: 'white' }} onClick={() => {
              //console.log('new audit');
              setShowHideAddForm(true);
            }}>Add Form</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f6fa1b', color: 'black' }} onClick={() => {
              //console.log('new audit');
              createNewAudit();
            }}>New Audit</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0be441', color: 'black' }} onClick={() => {
              loadAuditResultList(selectedAuditID);
              setSelectedAuditResultID(-1);
            }}>Load Data</Button>
          </div>
          <div className="auditlist">          
          {audit_list_data_ag_table}
          </div>
        </div>}
        <div className="tracuuYCSXTable">
          {audit_checklist_data_ag_table}
        </div>
      </div>
      {showhideaddform && (
        <div className="upgia">
          <div className="barbutton">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHideAddForm(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>
            <label htmlFor="upload">
              <b>Chọn file Excel: </b>
              <input
                className="selectfilebutton"
                type="file"
                name="upload"
                id="upload"
                onChange={(e: any) => {
                  readUploadFile(e);
                }}
              />
            </label>
            {/* <IconButton className="buttonIcon" onClick={() => { }}>
              <AiOutlineCheckSquare color="#EB2EFE" size={15} />
              Check Giá
            </IconButton> */}
            <div className="upgiaform">
              <Autocomplete
                sx={{ fontSize: 10, width: "150px" }}
                size="small"
                disablePortal
                options={customerList}
                className="autocomplete1"
                filterOptions={filterOptions1}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.CUST_CD === value.CUST_CD
                }
                getOptionLabel={(option: CustomerListData | any) =>
                  `${option.CUST_CD}: ${option.CUST_NAME_KD}`
                }
                renderInput={(params) => (
                  <TextField {...params} label="Select customer" />
                )}
                value={selectedCust_CD}
                onChange={(event: any, newValue: CustomerListData | any) => {
                  console.log(newValue);
                  setSelectedCust_CD(newValue);
                }}
              />
            </div>
            <div className="upgiaform">
              <TextField
                value={passScore}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassScore(Number(e.target.value))
                }
                size="small"
                color="success"
                className="autocomplete"
                id="outlined-basic"
                label="Pass Score"
                variant="outlined"
              />
            </div>
            <div className="upgiaform">
              <TextField
                value={auditname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAuditName(e.target.value)
                }
                size="small"
                color="success"
                className="autocomplete"
                id="outlined-basic"
                label="Audit Name"
                variant="outlined"
              />
            </div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                insertNewAuditInfo();
              }}
            >
              <BiCloudUpload color="#FA0022" size={15} />
              Up Form
            </IconButton>
            {/* <IconButton
              className="buttonIcon"
              onClick={() => {
                let temp_row: AUDIT_CHECK_LIST = {
                  id: uploadExcelJson.length,
                  AUDIT_DETAIL_ID: 0,
                  AUDIT_ID: 0,
                  AUDIT_NAME: "",
                  MAIN_ITEM_NO: 0,
                  MAIN_ITEM_CONTENT: "",
                  SUB_ITEM_NO: 0,
                  SUB_ITEM_CONTENT: "",
                  LEVEL_CAT: "",
                  DETAIL_VN: "",
                  DETAIL_KR: "",
                  DETAIL_EN: "",
                  MAX_SCORE: 0,
                  INS_DATE: "",
                  INS_EMPL: "",
                  UPD_DATE: "",
                  UPD_EMPL: ""
                };
                setUploadExcelJSon([...uploadExcelJson, temp_row]);
              }}
            >
              <AiFillFileAdd color="#F50354" size={15} />
              Add Row
            </IconButton> */}
          </div>
          <div className="upgiatable">{upFormAuditTable}</div>
        </div>
      )}
    </div>
  );
};
export default AUDIT;

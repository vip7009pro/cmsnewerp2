import { Button, IconButton, createFilterOptions } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./SAMPLE_MONITOR.scss";
import { generalQuery, uploadQuery } from "../../../api/Api";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { CustomerListData, SAMPLE_MONITOR_DATA } from "../../../api/GlobalInterface";
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */ // Optional Theme applied to the grid
import AGTable from "../../../components/DataTable/AGTable";
import { CustomCellRendererProps } from "ag-grid-react";
import { checkBP } from "../../../api/GlobalFunction";
const SAMPLE_MONITOR = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [data, setData] = useState<Array<SAMPLE_MONITOR_DATA>>([]);
  const [m_name, setM_Name] = useState("");
  const [clickedRows, setClickedRows] = useState<SAMPLE_MONITOR_DATA>({
    SAMPLE_ID: 0,
    PROD_REQUEST_NO: '',
    G_CODE: '',
    G_NAME_KD: '',
    G_NAME: '',
    FILE_MAKET: '',
    FILM_FILE: '',
    KNIFE_STATUS: '',
    KNIFE_CODE: '',
    FILM: '',
    RND_EMPL: '',
    RND_UPD_DATE: '',
    PRINT_STATUS: '',
    DIECUT_STATUS: '',
    PR_EMPL: '',
    PR_UPD_DATE: '',
    QC_STATUS: '',
    QC_EMPL: '',
    QC_UPD_DATE: '',
    APPROVE_STATUS: '',
    APPROVE_DATE: '',
    USE_YN: '',
    REMARK: '',
    INS_DATE: '',
    INS_EMPL: '',
    CUST_CD: '',
    CUST_NAME_KD: '',
    DELIVERY_DT: '',    
    G_LENGTH: 0,
    G_WIDTH: 0,
    PROD_REQUEST_DATE: '',
    PROD_REQUEST_QTY: 0
  });
  const loadSampleListTable = () => {
    generalQuery("loadSampleMonitorTable", {
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: SAMPLE_MONITOR_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setData(loadeddata);
          /* Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          ); */
        } else {
          setData([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const seMaterialInfo = (keyname: string, value: any) => {
    let tempMaterialInfo: SAMPLE_MONITOR_DATA = {
      ...clickedRows,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setClickedRows(tempMaterialInfo);
  };

  const updateRNDSTATUS =(datarow: SAMPLE_MONITOR_DATA) => {
    
    generalQuery("updateRND_SAMPLE_STATUS", {
      SAMPLE_ID: datarow.SAMPLE_ID,
      FILE_MAKET: datarow.FILE_MAKET,
      FILM_FILE: datarow.FILM_FILE,
      KNIFE_STATUS: datarow.KNIFE_STATUS,
      KNIFE_CODE: datarow.KNIFE_CODE,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire('Thông báo','Update data thành công');
         
        } else {
          Swal.fire('Thông báo','Update data thất bại');
         
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }
  const updateDataTable = (data_row: SAMPLE_MONITOR_DATA, key: string, value: any) => {
    
    setData(prev => {
      const newData = prev.map((p) =>
        p.SAMPLE_ID === data_row.SAMPLE_ID
          ? { ...p, [key]: value, }
          : p
      );
      return newData;
    });
  }
  const addMaterial = async () => {
    let materialExist: boolean = false;
    await generalQuery("checkMaterialExist", {
      M_NAME: '',
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          materialExist = true;
        } else {
          materialExist = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (materialExist === false) {
      await generalQuery("addMaterial", clickedRows)
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm vật liệu thành công", "success");
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire("Thông báo", "Vật liệu đã tồn tại", "error");
    }
  };
  const updateMaterial = async () => {
    await generalQuery("updateMaterial", clickedRows)
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          generalQuery("updateM090FSC", clickedRows)
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                Swal.fire("Thông báo", "Update vật liệu thành công", "success");
              } else {
                Swal.fire("Thông báo", "Update vật liệu thất bại", "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const uploadTDS = async (M_ID: number, up_file: any) => {
    if (up_file !== null && up_file !== undefined) {
      uploadQuery(up_file, "NVL_" + M_ID + ".pdf", "tds2")
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            generalQuery("updateTDSStatus", { M_ID: M_ID })
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
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      loadSampleListTable();
    }
  };
  const handleUpdateData = (e: React.ChangeEvent<HTMLInputElement>, rowdata: SAMPLE_MONITOR_DATA, key: string) => {
    if (e.target.checked) {
      updateDataTable(rowdata, key, 'Y')
    }
    else {
      updateDataTable(rowdata, key, 'N')
    }
  }
  const colDefs = [
    {
      field: 'SAMPLE_ID', headerName: 'ID', headerCheckboxSelection: true, checkboxSelection: true, width: 50, resizable: true, floatingFilter: true, /* cellStyle: (params:any) => {     
       if (params.data.M_ID%2==0 ) {
        return { backgroundColor: '#d4edda', color: '#155724' };
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      } 
    } */},
    { field: 'PROD_REQUEST_NO', headerName: 'YCSX', width: 50, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'CUST_NAME_KD', headerName: 'CUSTOMER', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_CODE', headerName: 'G_CODE', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_NAME', headerName: 'G_NAME', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_WIDTH', headerName: 'G_WIDTH', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_LENGTH', headerName: 'G_LENGTH', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
    {
      field: 'FILE_MAKET', headerName: 'FILE_MAKET', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input type="checkbox" checked={params.data.FILE_MAKET === 'Y'} onChange={(e) => handleUpdateData(e, params.data, 'FILE_MAKET')}></input>
            <span style={{ color: 'white' }}>{params.data.FILE_MAKET === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.FILE_MAKET === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        } else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    {
      field: 'FILM_FILE', headerName: 'FILM_FILE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input type="checkbox" checked={params.data.FILM_FILE === 'Y'} onChange={(e) => handleUpdateData(e, params.data, 'FILM_FILE')}></input>
            <span style={{ color: 'white' }}>{params.data.FILM_FILE === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.FILM_FILE === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        } else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    {
      field: 'KNIFE_STATUS', headerName: 'KNIFE_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input type="checkbox" checked={params.data.KNIFE_STATUS === 'Y'} onChange={(e) => handleUpdateData(e, params.data, 'KNIFE_STATUS')}></input>
            <span style={{ color: 'white' }}>{params.data.KNIFE_STATUS === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.KNIFE_STATUS === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        } else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    { field: 'KNIFE_CODE', headerName: 'KNIFE_CODE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: true },
    {
      field: 'FILM', headerName: 'FILM', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input type="checkbox" checked={params.data.FILM === 'Y'} onChange={(e) => handleUpdateData(e, params.data, 'FILM')}></input>
            <span style={{ color: 'white' }}>{params.data.FILM === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.FILM === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        } else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    /* { field: 'RND_EMPL', headerName: 'RND_EMPL', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'RND_UPD_DATE', headerName: 'RND_UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false }, */
    {
      field: 'PRINT_STATUS', headerName: 'PRINT_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input type="checkbox" checked={params.data.PRINT_STATUS === 'Y'} onChange={(e) => handleUpdateData(e, params.data, 'PRINT_STATUS')}></input>
            <span style={{ color: 'white' }}>{params.data.PRINT_STATUS === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.PRINT_STATUS === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        } else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    {
      field: 'DIECUT_STATUS', headerName: 'DIECUT_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input type="checkbox" checked={params.data.DIECUT_STATUS === 'Y'} onChange={(e) => handleUpdateData(e, params.data, 'DIECUT_STATUS')}></input>
            <span style={{ color: 'white' }}>{params.data.DIECUT_STATUS === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.DIECUT_STATUS === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        } else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    /* { field: 'PR_EMPL', headerName: 'PR_EMPL', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PR_UPD_DATE', headerName: 'PR_UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false }, */
    {
      field: 'QC_STATUS', headerName: 'QC_STATUS', width: 80, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        const [showhidecell, setshowHideCell] = useState(params.data.QC_STATUS === 'P')
        return (
          <div className="checkboxcell">
            {!showhidecell && <>
              <label>
                <input
                  type="radio"
                  name={params.data.SAMPLE_ID + 'A'}
                  value="Y"
                  checked={params.data.QC_STATUS === 'Y'}
                  onChange={(e) => {
                    updateDataTable(params.data, 'QC_STATUS', e.target.value)
                  }}
                />
                <span>OK</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={params.data.SAMPLE_ID + 'A'}
                  value="N"
                  checked={params.data.QC_STATUS === 'N'}
                  onChange={(e) => {
                    updateDataTable(params.data, 'QC_STATUS', e.target.value)
                  }}
                />
                <span>NG</span>
              </label>
            </>}
            {showhidecell && <span style={{ color: 'white' }} onClick={() => { setshowHideCell(prev => !prev) }}>{params.data.QC_STATUS === 'Y' ? '' : params.data.QC_STATUS === 'N' ? '' : 'PENDING'}</span>}
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.QC_STATUS === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        }
        else if (params.data.QC_STATUS === 'N') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
        else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    /* { field: 'QC_EMPL', headerName: 'QC_EMPL', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'QC_UPD_DATE', headerName: 'QC_UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false }, */
    {
      field: 'APPROVE_STATUS', headerName: 'APPROVE_STATUS', width: 90, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        const [showhidecell, setshowHideCell] = useState(params.data.APPROVE_STATUS === 'P')
        return (
          <div className="checkboxcell">
            {!showhidecell && <>
              <label>
                <input
                  type="radio"
                  name={params.data.SAMPLE_ID + 'B'}
                  value="Y"
                  checked={params.data.APPROVE_STATUS === 'Y'}
                  onChange={(e) => {
                    updateDataTable(params.data, 'APPROVE_STATUS', e.target.value)
                  }}
                />
                <span>OK</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={params.data.SAMPLE_ID + 'B'}
                  value="N"
                  checked={params.data.APPROVE_STATUS === 'N'}
                  onChange={(e) => {
                    updateDataTable(params.data, 'APPROVE_STATUS', e.target.value)
                  }}
                />
                <span>NG</span>
              </label>
            </>}
            {showhidecell && <span style={{ color: 'white' }} onClick={() => { setshowHideCell(prev => !prev) }}>{params.data.APPROVE_STATUS === 'Y' ? '' : params.data.APPROVE_STATUS === 'N' ? '' : 'PENDING'}</span>}
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.APPROVE_STATUS === 'Y') {
          return { backgroundColor: '#06d436', color: 'white' };
        }
        else if (params.data.APPROVE_STATUS === 'N') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
        else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    { field: 'APPROVE_DATE', headerName: 'APPROVE_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'USE_YN', headerName: 'USE_YN', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'REMARK', headerName: 'REMARK', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
  ];
  const material_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(!showhidePivotTable);
              }}
            >
              <MdOutlinePivotTableChart color="#ff33bb" size={15} />
              Pivot
            </IconButton>
          </div>}
        columns={colDefs}
        data={data}
        onCellEditingStopped={(params: any) => {
          console.log(params)
        }}
        onCellClick={(params: any) => {
          setClickedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }} />
    )
  }, [data, colDefs])
  useEffect(() => {
    loadSampleListTable();
  }, []);
  return (
    <div className="sample_monitor">
      <div className="tracuuDataInspection">
        {/* <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Mã Vật Liệu:</b>{" "}
                <input
                  type="text"
                  placeholder="Mã Vật Liệu"
                  value={clickedRows?.M_NAME}
                  onChange={(e) => seMaterialInfo("M_NAME", e.target.value)}
                ></input>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <b>Vendor:</b>{" "}
                <Autocomplete
                  sx={{
                    height: 10,
                    width: "160px",
                    margin: "1px",
                    fontSize: "0.7rem",
                    marginBottom: "20px",
                    backgroundColor: "white",
                  }}
                  size="small"
                  disablePortal
                  options={customerList}
                  className="autocomplete"
                  filterOptions={filterOptions1}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.CUST_CD === value.CUST_CD
                  }
                  getOptionLabel={(option: any) =>
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : "SSJ"}${option.CUST_CD !== null ? option.CUST_CD : "0049"
                    }`
                  }
                  renderInput={(params) => (
                    <TextField {...params} style={{ height: "10px" }} />
                  )}
                  defaultValue={{
                    CUST_CD: getCompany() === "CMS" ? "0049" : "KH000",
                    CUST_NAME: getCompany() === "CMS" ? "SSJ" : "PVN",
                    CUST_NAME_KD: getCompany() === "CMS" ? "SSJ" : "PVN",
                  }}
                  value={{
                    CUST_CD: clickedRows?.CUST_CD,
                    CUST_NAME: customerList.filter(
                      (e: CustomerListData, index: number) =>
                        e.CUST_CD === clickedRows?.CUST_CD,
                    )[0]?.CUST_NAME,
                    CUST_NAME_KD:
                      customerList.filter(
                        (e: CustomerListData, index: number) =>
                          e.CUST_CD === clickedRows?.CUST_CD,
                      )[0]?.CUST_NAME_KD === undefined
                        ? ""
                        : customerList.filter(
                          (e: CustomerListData, index: number) =>
                            e.CUST_CD === clickedRows?.CUST_CD,
                        )[0]?.CUST_NAME_KD,
                  }}
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);
                    seMaterialInfo(
                      "CUST_CD",
                      newValue === null ? "" : newValue.CUST_CD,
                    );
                  }}
                />
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Mô tả:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.DESCR}
                  onChange={(e) => seMaterialInfo("DESCR", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Open Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.SSPRICE}
                  onChange={(e) => seMaterialInfo("SSPRICE", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Origin Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.CMSPRICE}
                  onChange={(e) => seMaterialInfo("CMSPRICE", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Slitting Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.SLITTING_PRICE}
                  onChange={(e) =>
                    seMaterialInfo("SLITTING_PRICE", e.target.value)
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Master Width:</b>{" "}
                <input
                  type="text"
                  placeholder="Master width"
                  value={clickedRows?.MASTER_WIDTH}
                  onChange={(e) =>
                    seMaterialInfo("MASTER_WIDTH", e.target.value)
                  }
                ></input>
              </label>
              <label>
                <b>Roll Length:</b>{" "}
                <input
                  type="text"
                  placeholder="Roll length"
                  value={clickedRows?.ROLL_LENGTH}
                  onChange={(e) =>
                    seMaterialInfo("ROLL_LENGTH", e.target.value)
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>HSD:</b>{" "}
                <input
                  type="text"
                  placeholder="Master width"
                  value={clickedRows?.EXP_DATE}
                  onChange={(e) => seMaterialInfo("EXP_DATE", e.target.value)}
                ></input>
              </label>           
              <label>
                <b>Mở/Khóa:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type='checkbox'
                  name='pobalancecheckbox'
                  checked={clickedRows?.USE_YN === "Y"}
                  onChange={(e) => {
                    seMaterialInfo(
                      "USE_YN", e.target.checked === true ? "Y" : "N",
                    );
                  }}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
              loadSampleListTable();
            }}>Refresh</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
               checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], () => {                
                addMaterial();
              })
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], () => {
                updateMaterial();
              })
            }}>Update</Button>
          </div>
        </div> */}
        <div className="tracuuYCSXTable">
          {material_data_ag_table}
        </div>
      </div>
    </div>
  );
};
export default SAMPLE_MONITOR;

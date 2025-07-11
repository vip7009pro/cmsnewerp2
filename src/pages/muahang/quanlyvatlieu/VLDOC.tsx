import React, { useEffect, useState, useRef } from "react";
import { Button, IconButton, MenuItem, Select, TextField } from "@mui/material";
import { checkBP, f_downloadFile} from "../../../api/GlobalFunction";
import AGTable from "../../../components/DataTable/AGTable";
import { getUserData, uploadQuery } from "../../../api/Api";
import Swal from "sweetalert2";
import moment from "moment";
import DocumentComponent from "../../../components/DocumentComponent/DocumentComponent";
import { BiDownload } from "react-icons/bi";
import { MAT_DOC_DATA } from "../interfaces/muaInterface";
import { f_updateDtcApp, f_updatePurApp, f_updateRndApp } from "../../rnd/utils/rndUtils";
import { f_autoUpdateDocUSE_YN, f_checkDocVersion, f_getMaterialDocData, f_insertMaterialDocData, f_updateMaterialDocData } from "../utils/muaUtils";

// Move SearchForm outside the main component
const SearchForm = ({
  M_ID,
  M_NAME,
  filterValues,
  setFilterValues,
  handleSearch,
  handleUploadDoc,
  handleUpdateDoc
}: {
  M_ID: number;
  M_NAME: string;
  filterValues: {
    M_NAME: string;
    DOC_TYPE: string;
    REG_DATE: string;
    EXP_DATE: string;
    EXP_YN: string;
  };
  setFilterValues: React.Dispatch<React.SetStateAction<{
    M_NAME: string;
    DOC_TYPE: string;
    REG_DATE: string;
    EXP_DATE: string;
    EXP_YN: string;
  }>>;
  handleSearch: () => void;
  handleUploadDoc: () => void;
  handleUpdateDoc: () => void;
}) => {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <TextField
        size="small"
        label="Material Name"
        value={filterValues.M_NAME}
        onChange={(e) =>
          setFilterValues({ ...filterValues, M_NAME: e.target.value, REG_DATE: filterValues.REG_DATE, EXP_DATE: filterValues.EXP_DATE, EXP_YN: filterValues.EXP_YN })
        }
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '0.8rem',
            padding: '5px 8px',
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.8rem'
          }
        }}
      />
      <Select
        size="small"
        value={filterValues.DOC_TYPE}
        onChange={(e) =>
          setFilterValues({ ...filterValues, DOC_TYPE: e.target.value, REG_DATE: filterValues.REG_DATE, EXP_DATE: filterValues.EXP_DATE, EXP_YN: filterValues.EXP_YN })
        }
        displayEmpty
        sx={{
          minWidth: 100,
          '& .MuiSelect-select': {
            fontSize: '0.8rem',
            padding: '3px 8px',
          }
        }}
      >
        <MenuItem value="ALL" sx={{ fontSize: '0.8rem' }}>ALL</MenuItem>
        <MenuItem value="TDS" sx={{ fontSize: '0.8rem' }}>TDS</MenuItem>
        <MenuItem value="SGS" sx={{ fontSize: '0.8rem' }}>SGS</MenuItem>
        <MenuItem value="MSDS" sx={{ fontSize: '0.8rem' }}>MSDS</MenuItem>
      </Select>
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          fontSize: '0.8rem',
          padding: '4px 8px',
          minWidth: '60px',
          height: '25px'
        }}
      >
        Search
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={() => {
          checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
            handleUploadDoc();
          });
        }}
        sx={{
          fontSize: '0.8rem',
          padding: '4px 8px',
          minWidth: '80px',
          height: '25px'
        }}
      >
        Upload Doc
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateDoc}
        sx={{
          fontSize: '0.8rem',
          padding: '4px 8px',
          minWidth: '80px',
          height: '25px'
        }}
      >
        Update Doc
      </Button>

    </div>
  );
};

const VLDOC = ({ M_ID, M_NAME }: { M_ID: number, M_NAME: string }) => {
  const [matDocData, setMatDocData] = useState<MAT_DOC_DATA[]>([]);
  const [filteredMatDocData, setFilteredMatDocData] = useState<MAT_DOC_DATA[]>([]);
  const [showDoc, setShowDoc] = useState(false);
  const [filterValues, setFilterValues] = useState({
    M_NAME: M_NAME,
    DOC_TYPE: "ALL",
    REG_DATE: moment().format("YYYY-MM-DD"),
    EXP_DATE: moment().format("YYYY-MM-DD"),
    EXP_YN: "N",
  });
  const gridRef = useRef<any>(null);
  const [selected_M_ID, setSelected_M_ID] = useState(0);
  const [selected_DOC_TYPE, setSelected_DOC_TYPE] = useState("ALL");
  const [selected_VER, setSelected_VER] = useState(0);

  const columns = [
    { field: "DOC_ID", headerName: "DOC_ID", width: 70, headerCheckboxSelection: true, checkboxSelection: true },
    { 
      field: "USE_YN", 
      headerName: "USE_YN", 
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <div style={{
            backgroundColor: params.value === 'Y' ? '#4caf50' : '#f44336',
            color: 'white',            
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {params.value === 'Y' ? 'USE' : 'NOT USE'}
          </div>
        )
      }
    },
    { field: "DOC_TYPE", headerName: "DOC_TYPE", width: 60 },
    { field: "M_ID", headerName: "M_ID", width: 50 },
    { field: "M_NAME", headerName: "M_NAME", width: 100 },
    { field: "VER", headerName: "VER", width: 30 },
    { field: "FILE_NAME", headerName: "FILE_NAME", width: 100 },
    { field: "FILE", headerName: "FILE_LINK", width: 100, cellRenderer: (params: any) => {
      function handleViewDoc(): void {
        setSelected_M_ID(params.data.M_ID);
        setSelected_DOC_TYPE(params.data.DOC_TYPE);
        setSelected_VER(params.data.VER);
        setShowDoc(true); 
      }

      return (
       

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <button style={{ fontSize: '0.7rem', padding: '2px 4px', minWidth: '60px', height: '20px', marginRight: '4px' }} onClick={() => handleViewDoc()}>View</button>
           {(params.data.PUR_APP === 'Y' && params.data.DTC_APP === 'Y' && params.data.RND_APP === 'Y') &&  <div>
        <IconButton
          className="buttonIcon"
          onClick={(e) => {
            let hreftlink = `/materialdocs/${params.data.FILE_NAME}`;
            f_downloadFile(hreftlink, params.data.FILE_NAME + "_" + params.data.M_NAME + ".pdf");
          }}>
          <BiDownload color="green" size={10} />
        </IconButton>
      </div>          
        }
        </div>
      )
    }},
    { field: "FILE_UPLOADED", headerName: "FILE_UPLOADED", width: 80 },
    {
      field: "REG_DATE",
      headerName: "REG_DATE", 
      width: 100,      
    },
    {
      field: "EXP_DATE",
      headerName: "EXP_DATE",
      width: 100,       
    },
    {
      field: "EXP_YN",
      headerName: "EXP_YN",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <select
            value={params.data.EXP_YN}
            onChange={(e) => {
             /*  const rowNode = gridRef.current.api.getRowNode(params.data.DOC_ID);
              if (rowNode) {
                rowNode.setDataValue('EXP_YN', e.target.value);
              } */
              setMatDocData(matDocData.map(item => item.DOC_ID === params.data.DOC_ID ? { ...item, EXP_YN: e.target.value } : item));
            }}
            style={{
              border: 'none',
              width: '100%',
              height: '100%'
            }}
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        )
      }
    },
    {
      field: "PUR_APP", headerName: "PUR_APP", width: 120, cellRenderer: (params: any) => {
        if (params.data.PUR_APP === 'P') {
          return (
            <div>
              <Button variant="contained" color="primary" size="small" sx={{ fontSize: '0.7rem', padding: '2px 4px', minWidth: '60px', height: '20px', marginRight: '4px' }} onClick={() => {
                
                checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
                  handlePurApp(params.data.DOC_ID, 'Y');
                });

              }}>
                Approve
              </Button>
              <Button variant="contained" color="error" size="small" sx={{ fontSize: '0.7rem', padding: '2px 4px', minWidth: '60px', height: '20px' }} onClick={() => {
                checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
                  handlePurApp(params.data.DOC_ID, 'N');
                });
              }}>
                Reject
              </Button>
            </div>
          )
        } else if (params.data.PUR_APP === 'Y') {
          return <span style={{ color: 'green' }}>Approved</span>
        } else {
          return <span style={{ color: 'red' }}>Rejected</span>
        }
      }
    },
    {
      field: "DTC_APP", headerName: "DTC_APP", width: 120, cellRenderer: (params: any) => {
        if (params.data.DTC_APP === 'P') {
          return (
            <div>
              <Button variant="contained" color="primary" size="small" sx={{ fontSize: '0.7rem', padding: '2px 4px', minWidth: '60px', height: '20px', marginRight: '4px' }} onClick={() => {
                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], async () => {
                  if(getUserData()?.SUBDEPTNAME === "ĐỘ TIN CẬY") {
                    handleDtcApp(params.data.DOC_ID, 'Y');
                  } else {
                    Swal.fire("Thông báo", "Bạn không phải người bộ phận Độ tin cậy", "error");
                  }
                });
              }}>
                Approve
              </Button>
              <Button variant="contained" color="error" size="small" sx={{ fontSize: '0.7rem', padding: '2px 4px', minWidth: '60px', height: '20px' }} onClick={() => {
                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], async () => {
                  if(getUserData()?.SUBDEPTNAME === "ĐỘ TIN CẬY") {
                    handleDtcApp(params.data.DOC_ID, 'N');
                  } else {
                    Swal.fire("Thông báo", "Bạn không phải người bộ phận Độ tin cậy", "error");
                  }
                });
              }}>
                Reject
              </Button>
            </div>
          )
        } else if (params.data.DTC_APP === 'Y') {
          return <span style={{ color: 'green' }}>Approved</span>
        } else {
          return <span style={{ color: 'red' }}>Rejected</span>
        }
      }
    },
    {
      field: "RND_APP", headerName: "RND_APP", width: 120, cellRenderer: (params: any) => {
        if (params.data.RND_APP === 'P') {
          return (
            <div>
              <Button variant="contained" color="primary" size="small" sx={{ fontSize: '0.7rem', padding: '2px 4px', minWidth: '60px', height: '20px', marginRight: '4px' }} onClick={() => {
                checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], async () => {
                  handleRndApp(params.data.DOC_ID, 'Y');
                });
              }}>
                Approve
              </Button>
              <Button variant="contained" color="error" size="small" sx={{ fontSize: '0.7rem', padding: '2px 4px', minWidth: '60px', height: '20px' }} onClick={() => {
                checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], async () => {
                  handleRndApp(params.data.DOC_ID, 'N');
                });
              }}>
                Reject
              </Button>
            </div>
          )
        } else if (params.data.RND_APP === 'Y') {
          return <span style={{ color: 'green' }}>Approved</span>
        } else {
          return <span style={{ color: 'red' }}>Rejected</span>
        }
      }
    },
    { field: "PUR_EMPL", headerName: "PUR_EMPL", width: 70 },
    { field: "DTC_EMPL", headerName: "DTC_EMPL", width: 70 },
    { field: "RND_EMPL", headerName: "RND_EMPL", width: 70 },
    { field: "PUR_APP_DATE", headerName: "PUR_APP_DATE", width: 80 },
    { field: "DTC_APP_DATE", headerName: "DTC_APP_DATE", width: 80 },
    { field: "RND_APP_DATE", headerName: "RND_APP_DATE", width: 80 },    
    { field: "INS_DATE", headerName: "INS_DATE", width: 70 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 70 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 70 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 70 }
  ];
  const handlePurApp = (DOC_ID: number, APP_VALUE: string) => {
    f_updatePurApp({
      DOC_ID: DOC_ID,
      PUR_APP: APP_VALUE
    })
    .then((response) => {
      console.log(response);
      handleSearch();
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const handleDtcApp = (DOC_ID: number, APP_VALUE: string) => {
    f_updateDtcApp({
      DOC_ID: DOC_ID,
      DTC_APP: APP_VALUE
    })
    .then((response) => {
      console.log(response);
      handleSearch();
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const handleRndApp = (DOC_ID: number, APP_VALUE: string) => {
    f_updateRndApp({
      DOC_ID: DOC_ID,
      RND_APP: APP_VALUE
    })
    .then((response) => {
      console.log(response);
      handleSearch();
    })
    .catch((error) => {
      console.log(error);
    });
  } 

  const handleSearch = async () => {
    const data = await f_getMaterialDocData(filterValues);
    setMatDocData(data);
  };
  const handleUploadDoc = async () => {
    if(filterValues.DOC_TYPE === "ALL") {
      Swal.fire("Thông báo", "Chọn loại tài liệu", "error");
      return;
    } 
    if(filterValues.M_NAME === "") {
      Swal.fire("Thông báo", "Chọn vật liệu", "error");
      return;
    }
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      let ver: number = await f_checkDocVersion({ M_ID: M_ID, DOC_TYPE: filterValues.DOC_TYPE });
      console.log('ver', ver);
      const file = target.files[0];
      const filename = M_ID + "_" + filterValues.DOC_TYPE + "_" + ver + "." + file.name.split('.').pop();
      //const filename = file.name;
      const uploadfoldername = 'materialdocs'; // folder where docs will be stored

      try {
        console.log(file);
        console.log(filename);
        console.log(uploadfoldername);
        uploadQuery(file, filename, uploadfoldername)
          .then((response) => {
            console.log(response.data);
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Upload file thành công", "success");
              f_insertMaterialDocData({
                M_ID: M_ID,
                M_NAME: M_NAME,
                DOC_TYPE: filterValues.DOC_TYPE,
                FILE_NAME: filename,
                VER: ver
              })
                .then((response) => {
                  console.log(response);
                  handleSearch();
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              Swal.fire("Thông báo", "Upload file thất bại", "error");
            }
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
          });
        // Refresh the data after successful upload
        handleSearch();
      } catch (error) {
        console.error('Error uploading file:', error);
        // You might want to add error handling/notification here
      }
    };

    // Trigger file selection dialog
    input.click();
  };
  const handleUpdateDoc = () => {
    checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], async () => {
      
    for (let i = 0; i < filteredMatDocData.length; i++) {
      f_updateMaterialDocData({
        DOC_ID: filteredMatDocData[i].DOC_ID,
        REG_DATE: filteredMatDocData[i].REG_DATE,
        EXP_DATE: filteredMatDocData[i].EXP_DATE,
        EXP_YN: filteredMatDocData[i].EXP_YN.toUpperCase(),
        USE_YN: filteredMatDocData[i].USE_YN.toUpperCase()
      })
        .then((response) => {
          console.log(response);
          handleSearch();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    Swal.fire("Thông báo", "Cập nhật thành công", "success");
  });
  };

  useEffect(() => {
    handleSearch();
    f_autoUpdateDocUSE_YN({});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      {/* <Button variant="contained" color="warning" sx={{ fontSize: '0.8rem', padding: '4px 8px', minWidth: '80px', height: '25px' }} onClick={()=> {
        console.log(filteredMatDocData);
      }}>
        Test Button
      </Button> */}
      <SearchForm
        M_ID={M_ID}
        M_NAME={filterValues.M_NAME}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        handleSearch={handleSearch}
        handleUploadDoc={handleUploadDoc}
        handleUpdateDoc={handleUpdateDoc}
      />
      <div style={{ height: '50vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AGTable
          data={matDocData}
          columns={columns}
          toolbar={<></>}
          ref={gridRef}
          onSelectionChange={(e) => {
            setFilteredMatDocData(e!.api.getSelectedRows());
          }}
        />  
        {showDoc && (
          <div style={{ position: 'absolute', top: '50px', left: '25%', backgroundColor: 'rgba(238, 196, 196, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'scroll', zIndex: 1000, flexFlow: 'column', height: '80vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <button  onClick={() => setShowDoc(false)}>Close</button>              
            </div>
            <DocumentComponent M_ID={selected_M_ID} DOC_TYPE={selected_DOC_TYPE} VER={selected_VER} />
          </div>
        )}
      </div>
      
    </div>
  );
};

export default VLDOC;

import React, { useEffect, useState, useRef } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import Swal from "sweetalert2";
import moment from "moment";
import { ALL_DOC_DATA, ALL_FILE_DATA, DOC_CATEGORY1_DATA, DOC_CATEGORY2_DATA, DOC_LIST_DATA, DOCUMENT_DATA, MAT_DOC_DATA } from "../../../../api/GlobalInterface";
import { generalQuery, getCtrCd, getUserData, uploadQuery } from "../../../../api/Api";
import { checkBP, f_autoUpdateDocUSE_YN, f_checkDocVersion, f_getMaterialDocData, f_insertMaterialDocData, f_updateDtcApp, f_updateMaterialDocData, f_updatePurApp, f_updateRndApp } from "../../../../api/GlobalFunction";
import './ALLDOC.scss';
import AGTable from "../../../../components/DataTable/AGTable";
import DocumentComponent from "../../../../components/DocumentComponent/DocumentComponent";
import { DownloadButton } from "../../../../components/DownloadButton/DownloadButton";
import { DownloadButtonAll } from "../../../../components/DownloadButton/DownloadButtonAll";
import { FaFile, FaFileExcel, FaFileImage, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";
import { FaFileZipper } from "react-icons/fa6";


export const f_getDocCategory1 = async () => {
  let kq: DOC_CATEGORY1_DATA[] = [];
  try {
    let res = await generalQuery('loadDocCategory1', {});
    if (res.data.tk_status !== 'NG') {
      let loaded_data: DOC_CATEGORY1_DATA[] = res.data.data.map((element: DOC_CATEGORY1_DATA, index: number) => {
        return {
          ...element,
          id: index
        };
      })
      kq = loaded_data;
    } else {
      console.log('fetch error');
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
}
export const f_getDocCategory2 = async () => {
  let kq: DOC_CATEGORY2_DATA[] = [];
  try {
    let res = await generalQuery('loadDocCategory2', {});
    if (res.data.tk_status !== 'NG') {
      let loaded_data: DOC_CATEGORY2_DATA[] = res.data.data.map((element: DOC_CATEGORY2_DATA, index: number) => {
        return {
          ...element,
          id: index
        };
      })
      kq = loaded_data;
    } else {
      console.log('fetch error');
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
}

export const f_getDocList = async () => {
  let kq: DOC_LIST_DATA[] = [];
  try {
    let res = await generalQuery('loadDocList', {});
    if (res.data.tk_status !== 'NG') {
      let loaded_data: DOC_LIST_DATA[] = res.data.data.map((element: DOC_LIST_DATA, index: number) => {
        return {
          ...element,         
          id: index
        };
      })
      kq = loaded_data;
    } else {
      console.log('fetch error');
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
}

// Move SearchForm outside the main component
const SearchForm = ({
  filterValues,
  setFilterValues,
  handleSearch,
  handleUploadDoc,
  handleUpdateDoc,  
  docCategory1Data,
  docCategory2Data,
  docListData,
}: {
  filterValues: {
    DOC_NAME: string;   
    DOC_ID: number;
    DOC_CAT_ID: number;
    CAT_ID: number;

  };
  setFilterValues: React.Dispatch<React.SetStateAction<{
    DOC_NAME: string;   
    DOC_ID: number;
    DOC_CAT_ID: number;
    CAT_ID: number;
  }>>;
  handleSearch: () => void;
  handleUploadDoc: () => void;
  handleUpdateDoc: () => void;
  docCategory1Data: DOC_CATEGORY1_DATA[];
  docCategory2Data: DOC_CATEGORY2_DATA[];
  docListData: DOC_LIST_DATA[];    
}) => {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <TextField
        size="small"
        label="Document Name"
        value={filterValues.DOC_NAME}
        onChange={(e) =>
          setFilterValues({ ...filterValues, DOC_NAME: e.target.value, CAT_ID: filterValues.CAT_ID, DOC_CAT_ID: filterValues.DOC_CAT_ID })
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
        value={filterValues.CAT_ID}
        onChange={(e) =>
          setFilterValues({ ...filterValues, DOC_NAME: filterValues.DOC_NAME, CAT_ID: Number(e.target.value), DOC_CAT_ID: filterValues.DOC_CAT_ID })
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
       <MenuItem value={0} sx={{ fontSize: '0.8rem' }}>Select Category</MenuItem>
      
        {docCategory1Data.map((item, index: number) => (
          <MenuItem key={item.CAT_ID} value={item.CAT_ID} sx={{ fontSize: '0.8rem' }}>
            {index+1}.{item.CAT_NAME}
          </MenuItem>
        ))
      }        
      </Select>
      <Select
        size="small"
        value={filterValues.DOC_CAT_ID}
        onChange={(e) =>
          setFilterValues({ ...filterValues, DOC_NAME: filterValues.DOC_NAME, CAT_ID: filterValues.CAT_ID, DOC_CAT_ID: Number(e.target.value) })
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
        
         <MenuItem value={0} sx={{ fontSize: '0.8rem' }}>Select Document Type</MenuItem>
         
        
        {
           docCategory2Data.map((item,index: number) => (
            <MenuItem key={item.DOC_CAT_ID} value={item.DOC_CAT_ID} sx={{ fontSize: '0.8rem' }}>
              {index+1}.{item.DOC_CAT_NAME}
            </MenuItem>
          ))
        }        
      </Select>      
      <Select
        size="small"
        value={filterValues.DOC_ID}
        onChange={(e) =>
          setFilterValues({ ...filterValues, DOC_NAME: filterValues.DOC_NAME, CAT_ID: filterValues.CAT_ID, DOC_ID: Number(e.target.value) })
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
         <MenuItem value={0} sx={{ fontSize: '0.8rem' }}>Select Document Name</MenuItem>         
        
        {
          docListData.filter((item) => item.CAT_ID === filterValues.CAT_ID && item.DOC_CAT_ID === filterValues.DOC_CAT_ID).
          map((item, index: number) => (
            <MenuItem key={item.DOC_ID} value={item.DOC_ID} sx={{ fontSize: '0.8rem' }}>
              {index+1}.{item.DOC_NAME}
            </MenuItem>
          ))
        }
              
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

export const f_loadAllDoc = async (filteredData: any) => {
 let kq: DOCUMENT_DATA[] = [];
   try {
     let res = await generalQuery('loadDocuments', filteredData);
     //console.log(res);
     if (res.data.tk_status !== 'NG') {
       //console.log(res.data.data);
       let loaded_data: DOCUMENT_DATA[] = res.data.data.map((element: DOCUMENT_DATA, index: number) => {
          return {
             ...element,
             REG_DATE: element.REG_DATE !== null ? moment.utc(element.REG_DATE).format("YYYY-MM-DD") : "",
             EXP_DATE: element.EXP_DATE !== null ? moment.utc(element.EXP_DATE).format("YYYY-MM-DD") : "",
             INS_DATE: element.INS_DATE !== null ? moment.utc(element.INS_DATE).format("YYYY-MM-DD") : "",
             UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD") : "",
            id: index
           };
       })
       kq = loaded_data;
     } else {
       console.log('fetch error');
     }
   } catch (error) {
     console.log(error);
   }
   return kq;
}

export const f_checkLastFileID = async () => {  
  let kq: number = 1;
  try {
    let res = await generalQuery('checkLastFileID', {
      
    });
    console.log(res);
    if (res.data.tk_status !== 'NG') {
      //console.log(res.data.data);
      let kq: number = res.data.data[0].FILE_ID;
      
    } else {
      console.log('fetch error');
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
}

export const f_insertFileData = async (data: any) => {
  let kq: string = '';
  try {
    let res = await generalQuery('insertFileData', {
      ...data
    });
    console.log(res);
    if (res.data.tk_status !== 'NG') {
      
    } else {
      console.log('fetch error');
      kq = 'NG';
    }
  } catch (error) {
    console.log(error);
    kq = 'NG:' + error;
  }
  return kq;
}

const ALLDOC = () => {
  const [filteredMatDocData, setFilteredMatDocData] = useState<DOCUMENT_DATA[]>([]);
  const [showDoc, setShowDoc] = useState(false);
  const [filterValues, setFilterValues] = useState({
    DOC_NAME: "",   
    DOC_ID: 0,
    CAT_ID: 0,
    DOC_CAT_ID: 0, 
  });
  const gridRef = useRef<any>(null);
  const [selected_M_ID, setSelected_M_ID] = useState(0);
  const [selected_DOC_TYPE, setSelected_DOC_TYPE] = useState("ALL");
  const [selected_VER, setSelected_VER] = useState(0);
  const [allDocData, setAllDocData] = useState<DOCUMENT_DATA[]>([]);
  const [allFileData, setAllFileData]= useState<ALL_FILE_DATA[]>([]);
  const [docCategory1Data, setDocCategory1Data] = useState<DOC_CATEGORY1_DATA[]>([]);
  const [docCategory2Data, setDocCategory2Data] = useState<DOC_CATEGORY2_DATA[]>([]);
  const [docListData, setDocListData] = useState<DOC_LIST_DATA[]>([]);


  const handleLoadDocCategory1 = async () => {
    let kq = await f_getDocCategory1(); 
    setDocCategory1Data(kq);
  }
  const handleLoadDocCategory2 = async () => {
    let kq = await f_getDocCategory2(); 
    setDocCategory2Data(kq);
  }
  const handleLoadDocList = async () => {
    let kq = await f_getDocList(); 
    setDocListData(kq);
  }
  const handleLoadAllDoc = async (filteredData: any) => {
    let kq = await f_loadAllDoc(filteredData); 
    setAllDocData(kq);
  }


  const columns_all_doc = [
    { field: 'CTR_CD', headerName: 'CTR_CD', width: 100 },
    { field: 'DOC_ID', headerName: 'DOC_ID', width: 100 },
    { field: 'DEPARTMENT', headerName: 'DEPARTMENT', width: 150 },
    { field: 'DOC_CATEGORY', headerName: 'DOC_CATEGORY', width: 150 },
    { field: 'DOC_CATEGORY2', headerName: 'DOC_CATEGORY2', width: 150 },
    { field: 'DOC_NAME', headerName: 'DOC_NAME', width: 200 },
    { field: 'HSD_YN', headerName: 'HSD_YN', width: 70 },
    { field: 'USE_YN', headerName: 'USE_YN', width: 70 },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 150 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 100 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 150 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', width: 100 },
  ];
  const columns_all_file = [
    { field: 'CTR_CD', headerName: 'CTR_CD', width: 100 },
    { field: 'FILE_ID', headerName: 'FILE_ID', width: 100 },
    { field: 'DOC_ID', headerName: 'DOC_ID', width: 100 },
    { field: 'REG_DATE', headerName: 'REG_DATE', width: 150 },
    { field: 'EXP_DATE', headerName: 'EXP_DATE', width: 150 },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 150 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 100 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 150 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', width: 100 },
  ]
  const columns = [
    { field: 'FILE_ID', headerName: 'FILE_ID', width: 80, headerCheckboxSelection: true, checkboxSelection: true  },
    { field: 'CAT_NAME', headerName: 'PHAN_LOAI', width: 60,  cellRenderer: (params: any) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', width: '100%', fontSize: '0.7rem',color: '#a30cd1', fontWeight: 'bold' }}>
          {params.data.CAT_NAME}
        </div>
      );
    }  },
    { field: 'DOC_CAT_NAME', headerName: 'LOAI_TAI_LIEU', width: 100, cellRenderer: (params: any) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', width: '100%', fontSize: '0.7rem',color: '#29aa02', fontWeight: 'bold' }}>
          {params.data.DOC_CAT_NAME}
        </div>
      );
    } ,
    },
    { field: 'DOC_NAME', headerName: 'DOC_NAME', width: 250, cellRenderer: (params: any) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', width: '100%', fontSize: '0.7rem',color: '#1a3bf3',  }}>
          {params.data.DOC_NAME}
        </div>
      );
    }  },
    { field: 'FORMAT_X', headerName: 'FORMAT', width: 50, cellRenderer: (params: any) => {
      const fileExt = params.value.split('.').pop().toLowerCase();
        if (['doc', 'docx', 'txt', 'rtf'].includes(fileExt)) return <FaFileWord color='green' size={20} />;
        if (['pdf'].includes(fileExt)) return <FaFilePdf color='red' size={20} />;
        if (['ppt','pptx'].includes(fileExt)) return <FaFilePowerpoint color='orange' size={20} />;
        if (['xls', 'xlsx'].includes(fileExt)) return <FaFileExcel color='green' size={20} />;
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExt)) return <FaFileImage color='skyblue' size={20} />;
        if (['zip', 'rar', '7z'].includes(fileExt)) return <FaFileZipper color='orange' size={20} />;
        return <FaFile color='gray' size={20} />;
    }
  }, 
    { field: 'DOC_NAME', headerName: 'DOWNLOAD', width: 100, cellRenderer: (params: any) => {
      let fullUrl = `http://${window.location.host}/alldocs/${params.data.FILE_ID}_${params.data.DOC_ID}_${params.data.DOC_CAT_ID}_${params.data.CAT_ID}${params.data.FORMAT_X}`;
      //console.log(fullUrl);
        return (
          <DownloadButtonAll fullUrl={fullUrl} filename={`${getCtrCd()}_${params.data.FILE_ID}_${params.data.DOC_ID}_${params.data.DOC_CAT_ID}_${params.data.CAT_ID}${params.data.FORMAT_X}`} />
        );
      }
    },
    { field: 'REG_DATE', headerName: 'REG_DATE', width: 60 },
    { field: 'EXP_DATE', headerName: 'EXP_DATE', width: 60 },
    { field: 'DOC_ID', headerName: 'DOC_ID', width: 40 },
    { field: 'CAT_ID', headerName: 'CAT_ID', width: 40 },
    { field: 'DOC_CAT_ID', headerName: 'DOC_CAT_ID', width: 60 },
    { field: 'HSD_YN', headerName: 'HSD_YN', width: 60 },
    { field: 'USE_YN', headerName: 'USE_YN', width: 60 },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 60 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 60 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 60 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', width: 60 },
  ];

  const handleUploadDoc = async () => {
    if(filterValues.CAT_ID === 0) {
      Swal.fire("Thông báo", "Chọn phân loại tài liệu", "error");
      return;
    } 
    if(filterValues.DOC_CAT_ID === 0) {
      Swal.fire("Thông báo", "Chọn phân loại tài liệu", "error");
      return;
    } 
    if(filterValues.DOC_NAME === "") {
      Swal.fire("Thông báo", "Nhập tên tài liệu", "error");
      return;
    }
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      let FILE_ID: number = (await f_checkLastFileID()) + 1;
      
      const file = target.files[0];
      const filename = FILE_ID + "_" + filterValues.DOC_ID + "_" + filterValues.DOC_CAT_ID + "_" + filterValues.CAT_ID + "." + file.name.split('.').pop();
      //const filename = file.name;
      const uploadfoldername = 'alldocs';

      try {
        console.log(file);
        console.log(filename);
        console.log(uploadfoldername);
        uploadQuery(file, filename, uploadfoldername)
          .then(async (response) => {
            console.log(response.data);
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Upload file thành công", "success");
              let kq = await f_insertFileData({
                FILE_ID: FILE_ID,
                DOC_ID: filterValues.DOC_ID,
                DOC_CAT_ID: filterValues.DOC_CAT_ID,
                CAT_ID: filterValues.CAT_ID,               
                REG_DATE: moment().format("YYYY-MM-DD"),
                EXP_DATE: moment().add(2, 'year').format("YYYY-MM-DD"),
                FORMAT_X: '.' + file.name.split('.').pop(),
              });
              if(kq !== '') {
                Swal.fire("Thông báo", "Upload file thành công", "success");
              }
             else {
              Swal.fire("Thông báo", "Upload file thất bại", "error");
            }

          }
             
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
          });
        // Refresh the data after successful upload
        
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
        FILE_ID: filteredMatDocData[i].FILE_ID,
        REG_DATE: filteredMatDocData[i].REG_DATE,
        EXP_DATE: filteredMatDocData[i].EXP_DATE,
        EXP_YN: filteredMatDocData[i].HSD_YN.toUpperCase(),
        USE_YN: filteredMatDocData[i].USE_YN.toUpperCase()
      })
        .then((response) => {
          console.log(response);
          
        })
        .catch((error) => {
          console.log(error);
        });
    }
    Swal.fire("Thông báo", "Cập nhật thành công", "success");
  });
  };

  useEffect(() => {
    handleLoadDocCategory1();
    handleLoadDocCategory2();
    handleLoadDocList();
    handleLoadAllDoc(filterValues);
    f_autoUpdateDocUSE_YN({});
  }, []);

  return (
    <div className="documentmanager" style={{ display: "flex", flexDirection: "column", gap: "10px", width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>  
      <SearchForm       
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        handleSearch={() => handleLoadAllDoc(filterValues)}
        handleUploadDoc={handleUploadDoc}
        handleUpdateDoc={handleUpdateDoc}
        docCategory1Data={docCategory1Data}
        docCategory2Data={docCategory2Data}
        docListData={docListData}
      />
      <div className="documenttable">        
        <div className="tbleft">
        <AGTable
        rowHeight={30}
          data={allDocData}
          columns={columns}
          toolbar={<></>}
          ref={gridRef}
          onSelectionChange={(e) => {
            setFilteredMatDocData(e!.api.getSelectedRows());
          }}
        />  

        </div>
        {showDoc && <div className="tbright">
        <AGTable
          data={allFileData}
          columns={columns_all_file}
          toolbar={<></>}
          ref={gridRef}
          onSelectionChange={(e) => {
            setFilteredMatDocData(e!.api.getSelectedRows());
          }}
        />  
        
          <div style={{ position: 'absolute', top: '50px', left: '25%', backgroundColor: 'rgba(238, 196, 196, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'scroll', zIndex: 1000, flexFlow: 'column', height: '80vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <button  onClick={() => setShowDoc(false)}>Close</button>              
            </div>
            <DocumentComponent M_ID={selected_M_ID} DOC_TYPE={selected_DOC_TYPE} VER={selected_VER} />
          </div>
       

        </div>}
        
      </div>
      
    </div>
  );
};

export default ALLDOC;

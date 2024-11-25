import React, { useEffect, useState, useRef } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { MAT_DOC_DATA } from "../../../api/GlobalInterface";
import { f_getMaterialDocData, f_insertMaterialDocData } from "../../../api/GlobalFunction";
import AGTable from "../../../components/DataTable/AGTable";
import { uploadQuery } from "../../../api/Api";
import Swal from "sweetalert2";

// Move SearchForm outside the main component
const SearchForm = ({ 
  M_ID,
  M_NAME,
  filterValues, 
  setFilterValues, 
  handleSearch,
  handleUploadDoc,
  handleNewDoc
}: {
  M_ID: number;
  M_NAME: string;
  filterValues: {
    M_NAME: string;
    DOC_TYPE: string;
  };
  setFilterValues: React.Dispatch<React.SetStateAction<{
    M_NAME: string;
    DOC_TYPE: string;
  }>>;
  handleSearch: () => void;
  handleUploadDoc: () => void;
  handleNewDoc: () => void;
}) => {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <TextField
        size="small"
        label="Material Name"
        value={filterValues.M_NAME}
        onChange={(e) =>
          setFilterValues({ ...filterValues, M_NAME: e.target.value })
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
          setFilterValues({ ...filterValues, DOC_TYPE: e.target.value })
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
        onClick={handleUploadDoc}
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
        onClick={handleNewDoc}
        sx={{ 
          fontSize: '0.8rem',
          padding: '4px 8px',
          minWidth: '80px',
          height: '25px'
        }}
      >
        New Doc
      </Button>
    </div>
  );
};

const VLDOC = ({ M_ID, M_NAME }: { M_ID: number,   M_NAME: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [matDocData, setMatDocData] = useState<MAT_DOC_DATA[]>([]);
  const [filterValues, setFilterValues] = useState({
    M_NAME: M_NAME,
    DOC_TYPE: "",
  });
  const gridRef = useRef<any>(null);

  const columns = [
    { field: "DOC_ID", headerName: "DOC_ID", width: 120 },
    { field: "DOC_TYPE", headerName: "DOC_TYPE", width: 100 },
    { field: "M_ID", headerName: "M_ID", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 200 },
    { field: "VER", headerName: "VER", width: 80 },
    { field: "FILE_NAME", headerName: "FILE_NAME", width: 200 },
    { field: "FILE_UPLOADED", headerName: "FILE_UPLOADED", width: 120 },
    { field: "REG_DATE", headerName: "REG_DATE", width: 100 },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 100 },
    { field: "EXP_YN", headerName: "EXP_YN", width: 80 },
    { field: "PUR_APP", headerName: "PUR_APP", width: 90 },
    { field: "DTC_APP", headerName: "DTC_APP", width: 90 },
    { field: "RND_APP", headerName: "RND_APP", width: 90 },
    { field: "PUR_EMPL", headerName: "PUR_EMPL", width: 100 },
    { field: "DTC_EMPL", headerName: "DTC_EMPL", width: 100 },
    { field: "RND_EMPL", headerName: "RND_EMPL", width: 100 },
    { field: "PUR_APP_DATE", headerName: "PUR_APP_DATE", width: 120 },
    { field: "DTC_APP_DATE", headerName: "DTC_APP_DATE", width: 120 },
    { field: "RND_APP_DATE", headerName: "RND_APP_DATE", width: 120 },
    { field: "USE_YN", headerName: "USE_YN", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 100 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 100 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 100 }
  ];

  const handleSearch = async () => {
    const data = await f_getMaterialDocData(filterValues);
    setMatDocData(data);
  };

  const handleUploadDoc = async () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      
      const file = target.files[0];
      const filename = file.name;
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
            })
            .then((response) => {
              console.log(response);
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

  const handleNewDoc = () => {
    console.log("New doc");
  };  

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>     
      <SearchForm 
        M_ID={M_ID}
        M_NAME={filterValues.M_NAME}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        handleSearch={handleSearch}
        handleUploadDoc={handleUploadDoc}
        handleNewDoc={handleNewDoc}
      />
      <div style={{ height: '50vh' }}>
        <AGTable
          data={matDocData}
          columns={columns}
          toolbar={<></>}
          ref={gridRef}
          onSelectionChange={() => {}}
        />
      </div>
    </div>
  );
};

export default VLDOC;

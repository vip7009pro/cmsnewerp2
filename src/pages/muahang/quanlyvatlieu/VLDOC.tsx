import React, { useEffect, useState, useRef } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { MAT_DOC_DATA } from "../../../api/GlobalInterface";
import { f_getMaterialDocData } from "../../../api/GlobalFunction";
import AGTable from "../../../components/DataTable/AGTable";

// Move SearchForm outside the main component
const SearchForm = ({ 
  filterValues, 
  setFilterValues, 
  handleSearch 
}: {
  filterValues: {
    M_NAME: string;
    DOC_TYPE: string;
  };
  setFilterValues: React.Dispatch<React.SetStateAction<{
    M_NAME: string;
    DOC_TYPE: string;
  }>>;
  handleSearch: () => void;
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <TextField
        size="small"
        label="Material Name"
        value={filterValues.M_NAME}
        onChange={(e) =>
          setFilterValues({ ...filterValues, M_NAME: e.target.value })
        }
      />
      <Select
        size="small"
        value={filterValues.DOC_TYPE}
        onChange={(e) =>
          setFilterValues({ ...filterValues, DOC_TYPE: e.target.value })
        }
        displayEmpty
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="">
          <em>Doc Type</em>
        </MenuItem>
        <MenuItem value="TDS">TDS</MenuItem>
        <MenuItem value="SGS">SGS</MenuItem>
        <MenuItem value="MSDS">MSDS</MenuItem>
      </Select>
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

const VLDOC = () => {
  const [matDocData, setMatDocData] = useState<MAT_DOC_DATA[]>([]);
  const [filterValues, setFilterValues] = useState({
    M_NAME: "",
    DOC_TYPE: "",
  });
  const gridRef = useRef<any>(null);

  const columns = [
    { field: "DOC_ID", headerName: "Doc ID", width: 120 },
    { field: "DOC_TYPE", headerName: "Doc Type", width: 100 },
    { field: "M_NAME", headerName: "Material Name", width: 200 },
    { field: "VER", headerName: "Version", width: 80 },
    { field: "FILE_NAME", headerName: "File Name", width: 200 },
    { field: "REG_DATE", headerName: "Reg Date", width: 100 },
    { field: "EXP_DATE", headerName: "Exp Date", width: 100 },
    { field: "EXP_YN", headerName: "Expired", width: 80 },
    { field: "USE_YN", headerName: "In Use", width: 80 },
  ];

  const handleSearch = async () => {
    const data = await f_getMaterialDocData(filterValues);
    setMatDocData(data);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>     
      <SearchForm 
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        handleSearch={handleSearch}
      />
      <AGTable
        data={matDocData}
        columns={columns}
        toolbar={<></>}
        ref={gridRef}
        onSelectionChange={() => {}}
      />
    </div>
  );
};

export default VLDOC;

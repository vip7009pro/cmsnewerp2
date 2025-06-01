import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete, Refresh, Input } from "@mui/icons-material";
import axios from "axios";
import AGTable from "../../../components/DataTable/AGTable";
import { generalQuery } from "../../../api/Api";
import Swal from "sweetalert2";
import "./DBManager.scss";
interface Table {
  id: number;
  TABLE_NAME: string;
}
interface Field {
  id: number;
  COLUMN_NAME: string;
  DATA_TYPE: string;
  IS_NULLABLE: string;
  CHARACTER_MAXIMUM_LENGTH: number | null;
  COLUMN_DEFAULT: string | null;
  IS_PRIMARY_KEY: string;
  IS_IDENTITY: string;
  VALUE: string;
}
interface NewField {
  name: string;
  dataType: string;
  length?: number;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isIdentity: boolean;
  defaultValue?: string;
  value?: string;
}
/**
 * Sinh chuỗi định nghĩa các field cho câu lệnh CREATE TABLE trong SQL Server.
 * Các cột là primary key sẽ được gom vào câu PRIMARY KEY (FIELD1, FIELD2, ...) ở cuối.
 * @param {Array} fields - Mảng các object chứa thông tin cột.
 * @returns {string} Chuỗi định nghĩa cột cho câu lệnh CREATE TABLE.
 */
function generateTableFields(fields: NewField[]) {
  if (!Array.isArray(fields) || fields.length === 0) {
    return "";
  }

  // Thu thập các cột là primary key
  const primaryKeyFields = fields
    .filter((field) => field.isPrimaryKey)
    .map((field) => `[${field.name}]`);
  const fieldDefinitions = fields.map((field) => {
    // Lấy thông tin từ field object
    const {
      name,
      dataType,
      length = null,
      isNullable = true,
      isIdentity = false,
      defaultValue = null,
      value = "",
    } = field;
    // Kiểm tra các giá trị bắt buộc
    if (!name || !dataType) {
      throw new Error(
        `Field must have name and dataType: ${JSON.stringify(field)}`
      );
    }
    // Xây dựng định nghĩa cột
    let definition = `[${name}] ${dataType}`; // Dùng [] để thoát ký tự tên cột
    // Thêm độ dài nếu áp dụng (VD: VARCHAR(100))
    if (
      length &&
      ["VARCHAR", "CHAR", "NVARCHAR", "NCHAR"].includes(dataType.toUpperCase())
    ) {
      definition += `(${length})`;
    }
    // Thêm IDENTITY nếu có
    if (isIdentity) {
      if (
        !["INT", "BIGINT", "SMALLINT", "TINYINT"].includes(
          dataType.toUpperCase()
        )
      ) {
        throw new Error(
          `IDENTITY is only supported for INT, BIGINT, SMALLINT, or TINYINT: ${name}`
        );
      }
      definition += " IDENTITY(1,1)";
    }
    // Thêm NOT NULL hoặc NULL
    definition += isNullable ? " NULL" : " NOT NULL";
    // Thêm DEFAULT nếu có giá trị mặc định
    if (defaultValue !== null && defaultValue !== "") {
      // Nếu là chuỗi, thêm dấu nháy đơn
      const defaultVal =
        typeof defaultValue === "string" &&
        !defaultValue.match(/^(GETDATE|NEWID)\(\)$/i)
          ? `'${defaultValue.replace(/'/g, "''")}'` // Thoát ký tự nháy đơn
          : defaultValue;
      definition += ` DEFAULT ${defaultVal}`;
    }
    return definition;
  });
  // Thêm câu PRIMARY KEY nếu có
  if (primaryKeyFields.length > 0) {
    fieldDefinitions.push(`PRIMARY KEY (${primaryKeyFields.join(", ")})`);
  }
  // Kết hợp các định nghĩa cột, phân tách bằng dấu phẩy
  return fieldDefinitions.join(", ");
}
export function generateField(field: NewField): string {
  const { name, dataType, length, isNullable, isIdentity, defaultValue } =
    field;
  let definition = `[${name}] ${dataType}`;
  if (
    length &&
    ["VARCHAR", "CHAR", "NVARCHAR", "NCHAR"].includes(dataType.toUpperCase())
  ) {
    definition += `(${length})`;
  }
  if (isIdentity) {
    if (
      !["INT", "BIGINT", "SMALLINT", "TINYINT"].includes(dataType.toUpperCase())
    ) {
      throw new Error(
        `IDENTITY is only supported for INT, BIGINT, SMALLINT, or TINYINT: ${name}`
      );
    }
    definition += " IDENTITY(1,1)";
  }
  definition += isNullable ? " NULL" : " NOT NULL";
  if (defaultValue !== null && defaultValue !== "") {
    console.log("defaultValue", defaultValue);
    const defaultVal =
      typeof defaultValue === "string" &&
      !defaultValue.match(/^(GETDATE|NEWID)\(\}$/i)
        ? `'${defaultValue.replace(/'/g, "''")}'` // Thoát ký tự nháy đơn
        : defaultValue;
    definition += ` DEFAULT ${defaultVal}`;
  }
  return definition;
}
export function generateFieldForUpdate(field: NewField): string {
  const { name, dataType, length, isNullable, isIdentity, defaultValue } =
    field;
  let definition = `[${name}] ${dataType}`;
  if (
    length &&
    ["VARCHAR", "CHAR", "NVARCHAR", "NCHAR"].includes(dataType.toUpperCase())
  ) {
    definition += `(${length})`;
  }
  if (isIdentity) {
    if (
      !["INT", "BIGINT", "SMALLINT", "TINYINT"].includes(dataType.toUpperCase())
    ) {
      throw new Error(
        `IDENTITY is only supported for INT, BIGINT, SMALLINT, or TINYINT: ${name}`
      );
    }
    definition += " IDENTITY(1,1)";
  }
  definition += isNullable ? " NULL" : " NOT NULL";
  return definition;
}
// Danh sách kiểu dữ liệu SQL Server hỗ trợ
const dataTypes = [
  "INT",
  "VARCHAR",
  "NVARCHAR",
  "DATETIME",
  "DATE",
  "BIT",
  "FLOAT",
  "BIGINT",
  "SMALLINT",
  "TINYINT",
];
const DBManager: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [openTableModal, setOpenTableModal] = useState(false);
  const [openFieldModal, setOpenFieldModal] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [isFieldEditting, setIsFieldEditting] = useState(false);
  const [enableDeleteField, setEnableDeleteField] = useState(false);
  const [newFields, setNewFields] = useState<NewField[]>([
    {
      name: "ID",
      dataType: "INT",
      isNullable: false,
      isPrimaryKey: true,
      isIdentity: true,
      defaultValue: "",
    },
  ]);
  const [editTableName, setEditTableName] = useState("");
  const [editField, setEditField] = useState<NewField | null>(null);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const tableGridRef = useRef<any>(null);
  const fieldGridRef = useRef<any>(null);
  // Lấy danh sách bảng
  const fetchTables = async () => {
    try {
      generalQuery("loadTableList", {})
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            if (response.data.data.length > 0) {
              let loaded_data = response.data.data.map(
                (item: any, index: number) => {
                  return {
                    id: index,
                    TABLE_NAME: item.TABLE_NAME,
                  };
                }
              );
              setTables(loaded_data);
            } else {
              setTables([]);
            }
          } else {
            setTables([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };
  // Lấy danh sách field của bảng được chọn
  const fetchFields = async (tableName: string) => {
    try {
      generalQuery("loadColumnList", { TABLE_NAME: tableName })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            if (response.data.data.length > 0) {
              let fields = response.data.data.map(
                (item: any, index: number) => {
                  return {
                    id: index,
                    name: item.COLUMN_NAME,
                    dataType: item.DATA_TYPE.toUpperCase(),
                    length: item.CHARACTER_MAXIMUM_LENGTH,
                    isNullable: item.IS_NULLABLE,
                    isPrimaryKey: item.IS_PRIMARY_KEY,
                    isIdentity: item.IS_IDENTITY,                    
                    defaultValue:
                      item.COLUMN_DEFAULT?.toUpperCase() === "(GETDATE())"
                        ? item.COLUMN_DEFAULT.slice(1, -1)
                        : item.COLUMN_DEFAULT !== null
                        ? item.COLUMN_DEFAULT.slice(2, -2)
                        : "",
                  };
                }
              );
              setFields(fields);
            } else {
              setFields([]);
            }
          } else {
            setFields([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };
  // Tạo bảng mới
  const handleCreateTable = async () => {
    try {
      const fieldsDefinition = generateTableFields(newFields);
      generalQuery("createTable", {
        TABLE_NAME: newTableName,
        FIELDS: fieldsDefinition,
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.tk_status !== "NG") {
          } else {
            fetchTables();
            if (response.data.message.includes("Không có dòng dữ liệu nào")) {
              Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Thêm bảng thành công",
                customClass: {
                  container: "swal2-zindex-top",
                },
              });
              setNewTableName("");
              setNewFields([
                {
                  name: "ID",
                  dataType: "INT",
                  isNullable: false,
                  isPrimaryKey: true,
                  isIdentity: true,
                },
              ]);
            } else {
              Swal.fire({
                icon: "error",
                title: "Error...",
                text: response.data.message,
                customClass: {
                  container: "swal2-zindex-top",
                },
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //setOpenTableModal(false);
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };
  // Sửa tên bảng
  const handleEditTable = async () => {
    if (!selectedTable) return;
    try {
      await axios.put(`/tables/${selectedTable}`, {
        newTableName: editTableName,
      });
      setEditTableName("");
      fetchTables();
    } catch (error) {
      console.error("Error editing table:", error);
    }
  };
  // Xóa bảng
  const handleDeleteTable = async () => {
    if (!selectedTable) return;
    try {
      await axios.delete(`/tables/${selectedTable}`);
      setSelectedTable(null);
      setFields([]);
      fetchTables();
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };
  // Thêm field mới
  const handleCreateField = async () => {
    if (!selectedTable || !editField) return;
    try {
      const fieldDefinition = generateField(editField);
      console.log("fieldDefinition", fieldDefinition);
      generalQuery("addColumn", {
        TABLE_NAME: selectedTable,
        COLUMN_NAME: editField.name,
        DATA_TYPE: fieldDefinition,
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.tk_status !== "NG") {
          } else {
            fetchFields(selectedTable);
            if (response.data.message.includes("Không có dòng dữ liệu nào")) {
              Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Thêm field thành công",
                customClass: {
                  container: "swal2-zindex-top",
                },
              });
              setEditField({
                name: "",
                dataType: "",
                length: 0,
                isNullable: true,
                isPrimaryKey: false,
                isIdentity: false,
                defaultValue: "",
              });
              //setOpenFieldModal(false);
              fetchFields(selectedTable);
            } else {
              Swal.fire({
                icon: "error",
                title: "Error...",
                text: response.data.message,
                customClass: {
                  container: "swal2-zindex-top",
                },
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setOpenFieldModal(false);
      setEditField({
        name: "",
        dataType: "",
        length: 0,
        isNullable: true,
        isPrimaryKey: false,
        isIdentity: false,
        defaultValue: "",
      });
      fetchFields(selectedTable);
    } catch (error) {
      console.error("Error creating field:", error);
    }
  };
  const handleEditField = async () => {
    if (!selectedTable || !editField) return;
    try {
      const fieldDefinition = generateFieldForUpdate(editField);
      console.log("fieldDefinition", fieldDefinition);
      generalQuery("updateColumn", {
        TABLE_NAME: selectedTable,
        COLUMN_NAME: editField.name,
        DATA_TYPE: fieldDefinition,
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.tk_status !== "NG") {
          } else {
            fetchFields(selectedTable);
            if (response.data.message.includes("Không có dòng dữ liệu nào")) {
              Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Sửa field thành công",
                customClass: {
                  container: "swal2-zindex-top",
                },
              });
              setEditField({
                name: "",
                dataType: "",
                length: 0,
                isNullable: true,
                isPrimaryKey: false,
                isIdentity: false,
                defaultValue: "",
              });
              //setOpenFieldModal(false);
              fetchFields(selectedTable);
            } else {
              Swal.fire({
                icon: "error",
                title: "Error...",
                text: response.data.message,
                customClass: {
                  container: "swal2-zindex-top",
                },
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setOpenFieldModal(false);
      setEditField({
        name: "",
        dataType: "",
        length: 0,
        isNullable: true,
        isPrimaryKey: false,
        isIdentity: false,
        defaultValue: "",
      });
      fetchFields(selectedTable);
    } catch (error) {
      console.error("Error creating field:", error);
    }
  };
  // Xóa field
  const handleDeleteField = async (columnName: string) => {
    if (!selectedTable) return;
    if (!enableDeleteField) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Please enable delete field first",
        customClass: {
          container: "swal2-zindex-top",
        },
      });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          generalQuery("deleteColumn", {
            TABLE_NAME: selectedTable,
            COLUMN_NAME: columnName,
          })
            .then((response) => {
              console.log(response.data);
              if (response.data.tk_status !== "NG") {
              } else {
                fetchFields(selectedTable);
                if (
                  response.data.message.includes("Không có dòng dữ liệu nào")
                ) {
                  Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "Xóa field thành công",
                    customClass: {
                      container: "swal2-zindex-top",
                    },
                  });
                  setEditField({
                    name: "",
                    dataType: "",
                    length: 0,
                    isNullable: true,
                    isPrimaryKey: false,
                    isIdentity: false,
                    defaultValue: "",
                  });
                  //setOpenFieldModal(false);
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Error...",
                    text: response.data.message,
                    customClass: {
                      container: "swal2-zindex-top",
                    },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.error("Error deleting field:", error);
        }
      }
    });
  };

const handleInsertData = async (fields: Field[]) => {
  try {
    await generalQuery("insertData", {
      TABLE_NAME: selectedTable,
      FIELDS: fields,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Thêm dữ liệu thành công",
          customClass: {
            container: "swal2-zindex-top",
          },
        });

      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: response.data.message,
          customClass: {
            container: "swal2-zindex-top",
          },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
    
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
const handleInsertData2= async (data: any[], fields: Field[]) => {
  let kq: any = "";
  try {
    await generalQuery("insertData2", {
      TABLE_NAME: selectedTable,
      FIELDS: fields,
      DATA: data,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {       
        
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
      kq = error;
    });
    
    
  } catch (error) {
    console.error("Error inserting data:", error);
    kq = error;
  }
  return kq;
};
const handleInsertMultipleData = async  (data: any[]) => {
  let totalkq: string = "";
  for(let i=0; i<data.length; i++){
    let kq = await handleInsertData2(data[i], fields);
    if(kq !== ''){
      totalkq += kq;
    }
  }
  if(totalkq === ''){
    Swal.fire({
      icon: "success",
      title: "Success...",
      text: "Thêm dữ liệu thành công",
      customClass: {
        container: "swal2-zindex-top",
      },
    });
  }else{
    Swal.fire({
      icon: "error",
      title: "Error...",
      text: totalkq,
      customClass: {
        container: "swal2-zindex-top",
      },
    });
  }
  
}

const handleLoadData = async (table_name: string) => {
  try {
    await generalQuery("loadData", {
      TABLE_NAME: table_name,
    })
    .then(async (response) => {
      if (response.data.tk_status !== "NG") {
        if(response.data.data.length > 0){
          let loaded_data: any[] = response.data.data.map(
            (element: any, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setData(loaded_data);
        }
       
      } else {
        let temp_fields = await generalQuery("loadColumnList", {
          TABLE_NAME: table_name,
        })        
        let loaded_data: any = {};
        temp_fields.data.data.forEach((field: any) => {
          loaded_data[field.COLUMN_NAME] = "";
        });
        loaded_data.id = 0;        
        setData([loaded_data]);
      
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
  } catch (error) {
    console.error("Error loading data:", error);
  }
};
const handleAddBlankDataToDataTable = async () => {
  let temp_fields = await generalQuery("loadColumnList", {
    TABLE_NAME: selectedTable,
  })
  let loaded_data: any = {};
  temp_fields.data.data.forEach((field: any) => {
    loaded_data[field.COLUMN_NAME] = "";
  });
  loaded_data.id = data.length;
  setData([...data, loaded_data]);  
} 
const deleteData = async (id: number) => {
  setData(data.filter((item) => item.id !== id));
}
const clearAllData = async () => {
  let temp_fields = await generalQuery("loadColumnList", {
    TABLE_NAME: selectedTable,
  })
  let loaded_data: any = {};
  temp_fields.data.data.forEach((field: any) => {
    loaded_data[field.COLUMN_NAME] = "";
  });
  loaded_data.id = 0;
  setData([loaded_data]);  
}
  useEffect(() => {
    fetchTables();
  }, []);
  // Cột cho bảng AGTable hiển thị danh sách bảng
  const tableColumns = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "TABLE_NAME", headerName: "Table Name", width: 200 },
  ];
  // Cột cho bảng AGTable hiển thị danh sách field
  const fieldColumns = [
    { field: "id", headerName: "ID", width: 30 },
    {
      field: "name",
      headerName: "Column Name",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.isPrimaryKey === "YES") {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.value}
            </span>
          );
        }
        return <span>{params.value}</span>;
      },
    },
    { field: "dataType", headerName: "Data Type", width: 60 },
    { field: "length", headerName: "Length", width: 50 },
    { field: "isNullable", headerName: "Nullable", width: 60 },
    { field: "defaultValue", headerName: "Default Value", width: 100 },
    {
      field: "isPrimaryKey",
      headerName: "Primary Key",
      width: 60,
      cellRenderer: (params: any) => {
        if (params.value === "YES") {
          return <span style={{ color: "blue", fontWeight: "bold" }}>Yes</span>;
        } else {
          return <span style={{ color: "red", fontWeight: "normal" }}>No</span>;
        }
      },
    },
    {
      field: "isIdentity",
      headerName: "Identity",
      width: 60,
      cellRenderer: (params: any) => {
        if (params.value === "YES") {
          return <span style={{ color: "blue", fontWeight: "bold" }}>Yes</span>;
        } else {
          return <span style={{ color: "red", fontWeight: "normal" }}>No</span>;
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton onClick={() => handleDeleteField(params.data.name)}>
              <Delete style={{ fontSize: 20 }} />
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "value",
      headerName: "Value",
      width: 100,
    },
  ];
  // Toolbar cho danh sách bảng
  const tableToolbar = (
    <Box>
      <Button
        size="small"
        startIcon={<Refresh style={{ fontSize: 15 }} />}
        onClick={() => fetchTables()}
        style={{ fontSize: 13 }}
      >
        Load
      </Button>
      <Button
        size="small"
        startIcon={<Add style={{ fontSize: 15 }} />}
        onClick={() => setOpenTableModal(true)}
        style={{ fontSize: 13 }}
      >
        Add
      </Button>
      <Button
        size="small"
        startIcon={<Edit style={{ fontSize: 15 }} />}
        onClick={() => setEditTableName(selectedTable || "")}
        disabled={!selectedTable}
        style={{ fontSize: 13 }}
      >
        Edit
      </Button>
      <Button
        size="small"
        startIcon={<Delete style={{ fontSize: 15 }} />}
        onClick={handleDeleteTable}
        disabled={!selectedTable}
        style={{ fontSize: 13 }}
      >
        Delete
      </Button>
    </Box>
  );
  // Toolbar cho danh sách field
  const fieldToolbar = (
    <Box>
      <Button
        size="small"
        startIcon={<Add style={{ fontSize: 15 }} />}
        onClick={() => {
          setOpenFieldModal(true);
          setIsFieldEditting(false);
          setEditField({
            name: "",
            dataType: "",
            length: 0,
            isNullable: true,
            isPrimaryKey: false,
            isIdentity: false,
            defaultValue: "",
          });
        }}
        disabled={!selectedTable}
        style={{ fontSize: 13 }}
      >
        Add
      </Button>
      {selectedTable && (
        <Button
          size="small"
          startIcon={<Edit style={{ fontSize: 15 }} />}
          onClick={() => {
            setOpenFieldModal(true);
            setIsFieldEditting(true);
          }}
          disabled={!selectedTable}
          style={{ fontSize: 13 }}
        >
          Edit
        </Button>
      )}
      <Button
        size="small"
        startIcon={<Delete style={{ fontSize: 15 }} />}
        onClick={() => {
          setEnableDeleteField((prev) => !prev);
        }}
        disabled={!selectedTable}
        style={{ fontSize: 13 }}
      >
        Delete
      </Button>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#7465b4" }}>
        {enableDeleteField ? "(ENABLE DELETE)" : ""}
      </span>
      (
      <span style={{ fontSize: 15, fontWeight: 500, color: "#d833ee" }}>
        {selectedTable}/
      </span>
      <span style={{ fontSize: 15, fontWeight: 500, color: "#157bdb" }}>
        {editField?.name}
      </span>
      )
      <Button
        size="small"
        startIcon={<Input style={{ fontSize: 15 }} />}
        onClick={() => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, insert it!",
          }).then((result) => {
            if (result.isConfirmed) {
              handleInsertData(fields);
            }
          });         
          
        }}
        disabled={!selectedTable}
        style={{ fontSize: 13 }}
      >
        INSERT DATA
      </Button>
    </Box>
  );
  //Toolbar cho  data table
  const dataToolbar = (
    <Box>
      <Button
        size="small"
        startIcon={<Refresh style={{ fontSize: 15 }} />}
        onClick={() => fetchTables()}
        style={{ fontSize: 13 }}
      >
        Load
      </Button>
      <Button
        size="small"
        startIcon={<Add style={{ fontSize: 15 }} />}
        onClick={() => {
          handleAddBlankDataToDataTable();
        }}
        disabled={!selectedTable}
        style={{ fontSize: 13 }}
      >
        Add Blank Data
      </Button>
      <Button
        size="small"
        startIcon={<Delete style={{ fontSize: 15 }} />}
        onClick={() => {
          if(data.length ===1 ) return;
          deleteData(selectedData.id);
        }}
        disabled={!selectedData || data.length ===1}
        style={{ fontSize: 13 }}
      >
        Delete Data
      </Button>

      <Button
        size="small"
        startIcon={<Delete style={{ fontSize: 15 }} />}
        onClick={() => {
          if(data.length ===1 ) return;
          clearAllData();
        }}
        disabled={!selectedData || data.length ===1}
        style={{ fontSize: 13 }}
      >
        Clear All Data
      </Button>
      <Button
        size="small"
        startIcon={<Input style={{ fontSize: 15 }} />}
        onClick={() => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, insert it!",
          }).then((result) => {
            if (result.isConfirmed) {
              handleInsertMultipleData(data);
            }
          });         
          
        }}
        disabled={!selectedTable}
        style={{ fontSize: 13 }}
      >
        INSERT DATA
      </Button>
    </Box>
  );
  const tableListAG = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={tables}
        columns={tableColumns}
        toolbar={tableToolbar}
        onRowClick={(e) => {
          setSelectedTable(e.data.TABLE_NAME);
          fetchFields(e.data.TABLE_NAME);
          handleLoadData(e.data.TABLE_NAME);
        }}
        onSelectionChange={() => {}}      
      />
    );
  }, [tables, selectedTable]);
  const columnListAG = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={fields}
        columns={fieldColumns}
        toolbar={fieldToolbar}
        onSelectionChange={() => {}}
        onCellClick={(e) => {
          let tempEditField: NewField = {
            name: e.data.name,
            dataType: e.data.dataType,
            length: e.data.length,
            isNullable: e.data.isNullable === "YES",
            isPrimaryKey: e.data.isPrimaryKey === "YES",
            isIdentity: e.data.isIdentity === "YES",
            defaultValue: e.data.defaultValue,
          };
          setEditField(tempEditField);
        }}
        onRowDoubleClick={(e) => {
          let tempEditField: NewField = {
            name: e.data.name,
            dataType: e.data.dataType,
            length: e.data.length,
            isNullable: e.data.isNullable === "YES",
            isPrimaryKey: e.data.isPrimaryKey === "YES",
            isIdentity: e.data.isIdentity === "YES",
            defaultValue: e.data.defaultValue,
          };
          setEditField(tempEditField);
          setOpenFieldModal(true);
          setIsFieldEditting(true);
        }}
        
      />
    );
  }, [fields, enableDeleteField, editField]);
  const dataTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={data}        
        toolbar={dataToolbar}
        onSelectionChange={() => {}}
        onRowClick={(e) => {
          setSelectedData(e.data);
        }}
        columnWidth={70}
       
      />
    );
  }, [data, selectedData, fields]);
  return (
    <Box display="flex" height="91vh" width="100%" className="DBManager">
      {/* Danh sách bảng (bên trái) */}
      <Box width="25%" p={0}>
        {tableListAG}
      </Box>
      {/* Danh sách field (bên phải) */}
      <Box width="75%" p={0}>
        {columnListAG}
      </Box>
      {/* Danh sách dữ liệu (bên phải) */}
      <Box width="75%" p={0}>
        {dataTable}
      </Box>
      {/* Modal để tạo/sửa bảng */}
      <Modal open={openTableModal} onClose={() => setOpenTableModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 2,
            width: "50%",
            fontSize: 13,
          }}
        >
          <Typography variant="h6" style={{ fontSize: 15 }}>
            Create New Table
          </Typography>
          <TextField
            label="Table Name"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            fullWidth
            margin="normal"
            style={{ fontSize: 13 }}
          />
          {newFields.map((field, index) => (
            <Box key={index} display="flex" gap={2} mb={2}>
              <TextField
                label="Field Name"
                value={field.name}
                onChange={(e) => {
                  const updatedFields = [...newFields];
                  updatedFields[index].name = e.target.value;
                  setNewFields(updatedFields);
                }}
                size="small"
                style={{ fontSize: 13 }}
              />
              <TextField
                select
                label="Data Type"
                value={field.dataType}
                onChange={(e) => {
                  const updatedFields = [...newFields];
                  updatedFields[index].dataType = e.target.value;
                  setNewFields(updatedFields);
                }}
                size="small"
                style={{ width: 170, fontSize: 13 }}
              >
                {dataTypes.map((type) => (
                  <MenuItem key={type} value={type} style={{ fontSize: 13 }}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Length"
                type="number"
                value={field.length || ""}
                onChange={(e) => {
                  const updatedFields = [...newFields];
                  updatedFields[index].length = e.target.value
                    ? parseInt(e.target.value)
                    : undefined;
                  setNewFields(updatedFields);
                }}
                size="small"
                disabled={
                  !["VARCHAR", "NVARCHAR", "CHAR", "NCHAR"].includes(
                    field.dataType
                  )
                }
                style={{ fontSize: 13 }}
              />
              <TextField
                select
                label="Nullable"
                value={field.isNullable ? "YES" : "NO"}
                onChange={(e) => {
                  const updatedFields = [...newFields];
                  updatedFields[index].isNullable = e.target.value === "YES";
                  setNewFields(updatedFields);
                }}
                size="small"
                style={{ width: 100, fontSize: 13 }}
              >
                <MenuItem value="YES" style={{ fontSize: 13 }}>
                  YES
                </MenuItem>
                <MenuItem value="NO" style={{ fontSize: 13 }}>
                  NO
                </MenuItem>
              </TextField>
              <TextField
                select
                label="Primary Key"
                value={field.isPrimaryKey ? "YES" : "NO"}
                onChange={(e) => {
                  const updatedFields = [...newFields];
                  updatedFields[index].isPrimaryKey = e.target.value === "YES";
                  updatedFields[index].isNullable = e.target.value === "YES" ? false : true;
                  setNewFields(updatedFields);
                }}
                size="small"
                style={{ width: 100, fontSize: 13 }}
              >
                <MenuItem value="YES" style={{ fontSize: 13 }}>
                  YES
                </MenuItem>
                <MenuItem value="NO" style={{ fontSize: 13 }}>
                  NO
                </MenuItem>
              </TextField>
              <TextField
                select
                label="Identity"
                value={field.isIdentity ? "YES" : "NO"}
                onChange={(e) => {
                  const updatedFields = [...newFields];
                  updatedFields[index].isIdentity = e.target.value === "YES";
                  setNewFields(updatedFields);
                }}
                size="small"
                style={{ width: 100, fontSize: 13 }}
                disabled={
                  !["INT", "BIGINT", "SMALLINT", "TINYINT"].includes(
                    field.dataType
                  )
                }
              >
                <MenuItem value="YES" style={{ fontSize: 13 }}>
                  YES
                </MenuItem>
                <MenuItem value="NO" style={{ fontSize: 13 }}>
                  NO
                </MenuItem>
              </TextField>
              <TextField
                label="Default Value"
                value={field.defaultValue || ""}
                onChange={(e) => {
                  const updatedFields = [...newFields];
                  updatedFields[index].defaultValue =
                    e.target.value || undefined;
                  setNewFields(updatedFields);
                }}
                size="small"
                style={{ fontSize: 13 }}
              />
              <IconButton
                onClick={() => {
                  const updatedFields = newFields.filter((_, i) => i !== index);
                  setNewFields(updatedFields);
                }}
                style={{ fontSize: 13 }}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={() =>
              setNewFields([
                ...newFields,
                {
                  name: "",
                  dataType: "VARCHAR",
                  isNullable: true,
                  isPrimaryKey: false,
                  isIdentity: false,
                },
              ])
            }
            style={{ fontSize: 13 }}
          >
            Add Field
          </Button>
          <Box mt={2}>
            <Button
              onClick={handleCreateTable}
              variant="contained"
              style={{ fontSize: 13 }}
            >
              Create
            </Button>
            <Button
              onClick={() => setOpenTableModal(false)}
              sx={{ ml: 2 }}
              style={{ fontSize: 13 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal để tạo/sửa field */}
      <Modal open={openFieldModal} onClose={() => setOpenFieldModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6">
            {isFieldEditting ? "Edit Field" : "Add Field"}
          </Typography>
          <TextField
            label="Field Name"
            value={editField?.name || ""}
            onChange={(e) =>
              setEditField({ ...editField!, name: e.target.value })
            }
            fullWidth
            margin="normal"
            disabled={isFieldEditting} // Không cho sửa tên khi chỉnh sửa field
          />
          <TextField
            select
            label="Data Type"
            value={editField?.dataType || "VARCHAR"}
            onChange={(e) => {
              if (
                e.target.value === "VARCHAR" ||
                e.target.value === "NVARCHAR"
              ) {
                setEditField({
                  ...editField!,
                  dataType: e.target.value,
                  isIdentity: false,
                });
              } else {
                setEditField({ ...editField!, dataType: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          >
            {dataTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Length"
            type="number"
            value={editField?.length || ""}
            onChange={(e) =>
              setEditField({
                ...editField!,
                length: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            fullWidth
            margin="normal"
            disabled={
              !["VARCHAR", "NVARCHAR", "CHAR", "NCHAR"].includes(
                editField?.dataType || "VARCHAR"
              )
            }
          />
          <TextField
            select
            label="Nullable"
            value={editField?.isNullable ? "YES" : "NO"}
            onChange={(e) =>
              setEditField({
                ...editField!,
                isNullable: e.target.value === "YES",
              })
            }
            fullWidth
            margin="normal"
          >
            <MenuItem value="YES">YES</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
          </TextField>
          <TextField
            select
            label="Primary Key"
            value={editField?.isPrimaryKey ? "YES" : "NO"}
            onChange={(e) =>
              setEditField({
                ...editField!,
                isPrimaryKey: e.target.value === "YES",
              })
            }
            fullWidth
            margin="normal"
          >
            <MenuItem value="YES">YES</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
          </TextField>
          <TextField
            select
            label="Identity"
            value={editField?.isIdentity ? "YES" : "NO"}
            onChange={(e) =>
              setEditField({
                ...editField!,
                isIdentity: e.target.value === "YES",
              })
            }
            fullWidth
            margin="normal"
            disabled={
              !["INT", "BIGINT", "SMALLINT", "TINYINT"].includes(
                editField?.dataType || "VARCHAR"
              )
            }
          >
            <MenuItem value="YES">YES</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
          </TextField>
          <TextField
            label="Default Value"
            value={editField?.defaultValue || ""}
            onChange={(e) =>
              setEditField({
                ...editField!,
                defaultValue: e.target.value || undefined,
              })
            }
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button
              onClick={isFieldEditting ? handleEditField : handleCreateField}
              variant="contained"
            >
              {isFieldEditting ? "Update" : "Create"}
            </Button>
            <Button onClick={() => setOpenFieldModal(false)} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal để sửa tên bảng */}
      <Modal open={!!editTableName} onClose={() => setEditTableName("")}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6">Edit Table Name</Typography>
          <TextField
            label="New Table Name"
            value={editTableName}
            onChange={(e) => setEditTableName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button onClick={handleEditTable} variant="contained">
              Update
            </Button>
            <Button onClick={() => setEditTableName("")} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default DBManager;

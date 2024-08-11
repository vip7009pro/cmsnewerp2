import { Autocomplete, LinearProgress, TextField } from "@mui/material";
import {
  DataGrid,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./INPUTPQC.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axios from "axios";
import {
  CodeListData,
  CustomerListData,
  UserData,
} from "../../../api/GlobalInterface";

const INPUTPQC = () => {
  const [file, setFile] = useState<any>();
  const [isPending, startTransition] = useTransition();
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [isLoading, setisLoading] = useState(false);
  const [column_excel, setColumn_Excel] = useState<Array<any>>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>({
      CUST_CD: "0000",
      CUST_NAME_KD: "SEOJIN",
    });
  const [deliverydate, setNewDeliveryDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [newycsxqty, setNewYcsxQty] = useState("");
  const [newycsxremark, setNewYcsxRemark] = useState("");
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [newphanloai, setNewPhanLoai] = useState("TT");
  const [loaisx, setLoaiSX] = useState("01");
  const [loaixh, setLoaiXH] = useState("02");

  const [ycsxdatatablefilterexcel, setYcsxDataTableFilterExcel] = useState<
    Array<any>
  >([]);

  const column_excel2 = [
    { field: "id", headerName: "id", width: 180 },
    { field: "PROD_REQUEST_DATE", headerName: "NGAY YC", width: 120 },
    { field: "CODE_50", headerName: "CODE_50", width: 80 },
    { field: "CODE_55", headerName: "CODE_55", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 100 },
    { field: "RIV_NO", headerName: "RIV_NO", width: 80 },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "SL YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PROD_REQUEST_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "CUST_CD", headerName: "CUST_CD", width: 80 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120 },
    { field: "REMK", headerName: "REMK", width: 150 },
    { field: "DELIVERY_DT", headerName: "NGAY GH", width: 120 },
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
    {
      field: "CHECKSTATUS",
      headerName: "CHECKSTATUS",
      width: 200,
      renderCell: (params: any) => {
        if (params.row.CHECKSTATUS.slice(0, 2) === "OK") {
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        } else if (params.row.CHECKSTATUS.slice(0, 2) === "NG") {
          return (
            <span style={{ color: "red" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        } else {
          return (
            <span style={{ color: "yellow" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        }
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className="saveexcelbutton"
          onClick={() => {
            SaveExcel(uploadExcelJson, "Uploaded PQC1  DATA");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log("Vao day");
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
        setColumn_Excel(uploadexcelcolumn);
        setUploadExcelJSon(
          json.map((element: any, index: number) => {
            return {
              ...element,
              id: index,
              CHECKSTATUS: "Waiting",
              PHANLOAI: "TT",
            };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const confirmUpYcsxHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm YCSX hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm YCSX hàng loạt", "success");
      }
    });
  };
  const confirmCheckYcsxHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check YCSX hàng loạt ?",
      text: "Sẽ bắt đầu check ycsx hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check YCSX hàng loạt", "success");
      }
    });
  };
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
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
  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          if (!isPending) {
            startTransition(() => {
              setCodeList(response.data.data);
            });
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clearYCSXform = () => {
    setNewDeliveryDate(moment().format("YYYY-MM-DD"));
    setNewYcsxQty("");
    setNewYcsxRemark("");
    setNewPhanLoai("TT");
    setLoaiSX("01");
    setLoaiXH("02");
  };
  const handleYCSXSelectionforUpdateExcel = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = uploadExcelJson.filter((element: any) =>
      selectedID.has(element.id),
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setYcsxDataTableFilterExcel(datafilter);
    } else {
      setYcsxDataTableFilterExcel([]);
    }
  };

  const handle_InsertYCSXTable = () => {
    let newycsx_row = {
      PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
      CODE_50: loaixh,
      CODE_55: loaisx,
      PHANLOAI: newphanloai,
      RIV_NO: "A",
      PROD_REQUEST_QTY: newycsxqty,
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      EMPL_NO: userData?.EMPL_NO,
      REMK: newycsxremark,
      DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
      CHECKSTATUS: "Waiting",
      id: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    };
    if (newycsx_row.PROD_REQUEST_QTY === "" || newycsx_row.REMK === "") {
      Swal.fire(
        "Thông báo",
        "Không được để trống thông tin cần thiết",
        "error",
      );
    } else {
      setUploadExcelJSon([...uploadExcelJson, newycsx_row]);
    }
  };
  const handle_DeleteYCSX_Excel = () => {
    if (ycsxdatatablefilterexcel.length > 0) {
      let datafilter = [...uploadExcelJson];
      for (let i = 0; i < ycsxdatatablefilterexcel.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (ycsxdatatablefilterexcel[i].id === datafilter[j].id) {
            datafilter.splice(j, 1);
          }
        }
      }
      setUploadExcelJSon(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };

  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({ ...selection, tab1: true, tab2: false, tab3: false });
    } else if (choose === 2) {
      setSelection({ ...selection, tab1: false, tab2: true, tab3: false });
    } else if (choose === 3) {
      setSelection({ ...selection, tab1: false, tab2: false, tab3: true });
    }
  };
  //console.log(userData);
  useEffect(() => {
    getcustomerlist();
    getcodelist("");
  }, []);
  return (
    (<div className="INPUTPQC">
      <div className="mininavbarinput">
        <div className="mininavitem" onClick={() => setNav(1)}>
          <span className="mininavtext">Input PQC1</span>
        </div>
        <div className="mininavitem" onClick={() => setNav(2)}>
          <span className="mininavtext">Input PQC3</span>
        </div>
        <div className="mininavitem" onClick={() => setNav(3)}>
          <span className="mininavtext">Input Dao Film</span>
        </div>
      </div>
      <div className="them1ycsx">
        <div className="formnho">
          {selection.tab1 && (
            <div className="dangkyform1">
              <h3>Thêm DATA SETTING mới</h3>
              <div className="dangkyinput">
                <div className="dangkyinputbox">
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={customerList}
                      className="autocomplete"
                      getOptionLabel={(option: CustomerListData) => {
                        return `${option.CUST_CD}: ${option.CUST_NAME_KD}`;
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select customer" />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | null,
                      ) => {
                        console.log(newValue);
                        setSelectedCust_CD(newValue);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.CUST_CD === value.CUST_CD
                      }
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={codeList}
                      className="autocomplete"
                      getOptionLabel={(option: CodeListData) =>
                        `${option.G_CODE}: ${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select code" />
                      )}
                      onChange={(event: any, newValue: CodeListData | null) => {
                        console.log(newValue);
                        setSelectedCode(newValue);
                      }}
                      value={selectedCode}
                      isOptionEqualToValue={(option, value) =>
                        option.G_CODE === value.G_CODE
                      }
                    />
                  </label>
                  <label>
                    <b>Delivery Date:</b>
                    <input
                      className="inputdata"
                      type="date"
                      value={deliverydate.slice(0, 10)}
                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Loại hàng</b>
                    <select
                      name="phanloaihang"
                      value={newphanloai}
                      onChange={(e) => {
                        setNewPhanLoai(e.target.value);
                      }}
                    >
                      {" "}
                      <option value="TT">Hàng Thường</option>
                      <option value="SP">SP</option>
                      <option value="RB">RB</option>
                      <option value="HQ">HQ</option>
                    </select>
                  </label>
                </div>
                <div className="dangkyinputbox">
                  <label>
                    <b>Loại sản xuất</b>
                    <select
                      name="loasx"
                      value={loaisx}
                      onChange={(e) => {
                        setLoaiSX(e.target.value);
                      }}
                    >
                      <option value="01">Thông Thường</option>
                      <option value="02">SDI</option>
                      <option value="03">ETC</option>
                      <option value="04">SAMPLE</option>
                    </select>
                  </label>
                  <label>
                    <b>Loại xuất hàng</b>
                    <select
                      name="loaixh"
                      value={loaixh}
                      onChange={(e) => {
                        setLoaiXH(e.target.value);
                      }}
                    >
                      <option value="01">GC</option>
                      <option value="02">SK</option>
                      <option value="03">KD</option>
                      <option value="04">VN</option>
                      <option value="05">SAMPLE</option>
                      <option value="06">Vai bac 4</option>
                      <option value="07">ETC</option>
                    </select>
                  </label>
                  <label>
                    <b>YCSX QTY:</b>{" "}
                    <TextField
                      value={newycsxqty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxQty(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="YCSX QTY"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newycsxremark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxRemark(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                    />
                  </label>
                </div>
              </div>
              <div className="dangkybutton">
                {selection.themycsx && (
                  <button
                    className="thembutton"
                    onClick={() => {
                      //handle_add_1YCSX();
                    }}
                  >
                    Thêm YCSX
                  </button>
                )}
                <button
                  className="thembutton"
                  onClick={() => {
                    handle_InsertYCSXTable();
                  }}
                >
                  Insert Dòng
                </button>
                <button
                  className="xoabutton"
                  onClick={() => {
                    clearYCSXform();
                  }}
                >
                  Clear Dòng
                </button>
                <button
                  className="closebutton"
                  onClick={() => {
                    setSelection({ ...selection, them1po: false });
                  }}
                >
                  Close Form
                </button>
              </div>
            </div>
          )}
          {selection.tab2 && (
            <div className="dangkyform2">
              <h3>Thêm DATA SETTING mới</h3>
              <div className="dangkyinput">
                <div className="dangkyinputbox">
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={customerList}
                      className="autocomplete"
                      getOptionLabel={(option: CustomerListData) => {
                        return `${option.CUST_CD}: ${option.CUST_NAME_KD}`;
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select customer" />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | null,
                      ) => {
                        console.log(newValue);
                        setSelectedCust_CD(newValue);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.CUST_CD === value.CUST_CD
                      }
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={codeList}
                      className="autocomplete"
                      getOptionLabel={(option: CodeListData) =>
                        `${option.G_CODE}: ${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select code" />
                      )}
                      onChange={(event: any, newValue: CodeListData | null) => {
                        console.log(newValue);
                        setSelectedCode(newValue);
                      }}
                      value={selectedCode}
                      isOptionEqualToValue={(option, value) =>
                        option.G_CODE === value.G_CODE
                      }
                    />
                  </label>
                  <label>
                    <b>Delivery Date:</b>
                    <input
                      className="inputdata"
                      type="date"
                      value={deliverydate.slice(0, 10)}
                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Loại hàng</b>
                    <select
                      name="phanloaihang"
                      value={newphanloai}
                      onChange={(e) => {
                        setNewPhanLoai(e.target.value);
                      }}
                    >
                      {" "}
                      <option value="TT">Hàng Thường</option>
                      <option value="SP">SP</option>
                      <option value="RB">RB</option>
                      <option value="HQ">HQ</option>
                    </select>
                  </label>
                </div>
                <div className="dangkyinputbox">
                  <label>
                    <b>Loại sản xuất</b>
                    <select
                      name="loasx"
                      value={loaisx}
                      onChange={(e) => {
                        setLoaiSX(e.target.value);
                      }}
                    >
                      <option value="01">Thông Thường</option>
                      <option value="02">SDI</option>
                      <option value="03">ETC</option>
                      <option value="04">SAMPLE</option>
                    </select>
                  </label>
                  <label>
                    <b>Loại xuất hàng</b>
                    <select
                      name="loaixh"
                      value={loaixh}
                      onChange={(e) => {
                        setLoaiXH(e.target.value);
                      }}
                    >
                      <option value="01">GC</option>
                      <option value="02">SK</option>
                      <option value="03">KD</option>
                      <option value="04">VN</option>
                      <option value="05">SAMPLE</option>
                      <option value="06">Vai bac 4</option>
                      <option value="07">ETC</option>
                    </select>
                  </label>
                  <label>
                    <b>YCSX QTY:</b>{" "}
                    <TextField
                      value={newycsxqty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxQty(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="YCSX QTY"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newycsxremark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxRemark(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                    />
                  </label>
                </div>
              </div>
              <div className="dangkybutton">
                {selection.themycsx && (
                  <button
                    className="thembutton"
                    onClick={() => {
                      //handle_add_1YCSX();
                    }}
                  >
                    Thêm YCSX
                  </button>
                )}
                <button
                  className="thembutton"
                  onClick={() => {
                    handle_InsertYCSXTable();
                  }}
                >
                  Insert Dòng
                </button>
                <button
                  className="xoabutton"
                  onClick={() => {
                    clearYCSXform();
                  }}
                >
                  Clear Dòng
                </button>
                <button
                  className="closebutton"
                  onClick={() => {
                    setSelection({ ...selection, them1po: false });
                  }}
                >
                  Close Form
                </button>
              </div>
            </div>
          )}
          {selection.tab3 && (
            <div className="dangkyform3">
              <h3>Thêm DATA SETTING mới</h3>
              <div className="dangkyinput">
                <div className="dangkyinputbox">
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={customerList}
                      className="autocomplete"
                      getOptionLabel={(option: CustomerListData) => {
                        return `${option.CUST_CD}: ${option.CUST_NAME_KD}`;
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select customer" />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | null,
                      ) => {
                        console.log(newValue);
                        setSelectedCust_CD(newValue);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.CUST_CD === value.CUST_CD
                      }
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={codeList}
                      className="autocomplete"
                      getOptionLabel={(option: CodeListData) =>
                        `${option.G_CODE}: ${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select code" />
                      )}
                      onChange={(event: any, newValue: CodeListData | null) => {
                        console.log(newValue);
                        setSelectedCode(newValue);
                      }}
                      value={selectedCode}
                      isOptionEqualToValue={(option, value) =>
                        option.G_CODE === value.G_CODE
                      }
                    />
                  </label>
                  <label>
                    <b>Delivery Date:</b>
                    <input
                      className="inputdata"
                      type="date"
                      value={deliverydate.slice(0, 10)}
                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Loại hàng</b>
                    <select
                      name="phanloaihang"
                      value={newphanloai}
                      onChange={(e) => {
                        setNewPhanLoai(e.target.value);
                      }}
                    >
                      {" "}
                      <option value="TT">Hàng Thường</option>
                      <option value="SP">SP</option>
                      <option value="RB">RB</option>
                      <option value="HQ">HQ</option>
                    </select>
                  </label>
                </div>
                <div className="dangkyinputbox">
                  <label>
                    <b>Loại sản xuất</b>
                    <select
                      name="loasx"
                      value={loaisx}
                      onChange={(e) => {
                        setLoaiSX(e.target.value);
                      }}
                    >
                      <option value="01">Thông Thường</option>
                      <option value="02">SDI</option>
                      <option value="03">ETC</option>
                      <option value="04">SAMPLE</option>
                    </select>
                  </label>
                  <label>
                    <b>Loại xuất hàng</b>
                    <select
                      name="loaixh"
                      value={loaixh}
                      onChange={(e) => {
                        setLoaiXH(e.target.value);
                      }}
                    >
                      <option value="01">GC</option>
                      <option value="02">SK</option>
                      <option value="03">KD</option>
                      <option value="04">VN</option>
                      <option value="05">SAMPLE</option>
                      <option value="06">Vai bac 4</option>
                      <option value="07">ETC</option>
                    </select>
                  </label>
                  <label>
                    <b>YCSX QTY:</b>{" "}
                    <TextField
                      value={newycsxqty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxQty(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="YCSX QTY"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newycsxremark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxRemark(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                    />
                  </label>
                </div>
              </div>
              <div className="dangkybutton">
                {selection.themycsx && (
                  <button
                    className="thembutton"
                    onClick={() => {
                      //handle_add_1YCSX();
                    }}
                  >
                    Thêm YCSX
                  </button>
                )}
                <button
                  className="thembutton"
                  onClick={() => {
                    handle_InsertYCSXTable();
                  }}
                >
                  Insert Dòng
                </button>
                <button
                  className="xoabutton"
                  onClick={() => {
                    clearYCSXform();
                  }}
                >
                  Clear Dòng
                </button>
                <button
                  className="closebutton"
                  onClick={() => {
                    setSelection({ ...selection, them1po: false });
                  }}
                >
                  Close Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="newycsx">
        <h3>Thêm DATA PQC Hàng Loạt</h3>
        <br></br>
        <div className="batchnewycsx">
          <form className="formupload">
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
            <div className="ycsxbutton">
              <div
                className="checkpobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmCheckYcsxHangLoat();
                }}
              >
                Check Data PQC1
              </div>
              <div
                className="uppobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmUpYcsxHangLoat();
                }}
              >
                Up Data PQC1
              </div>
              <div
                className="clearobutton"
                onClick={(e) => {
                  e.preventDefault();
                  handle_DeleteYCSX_Excel();
                }}
              >
                Clear YCSX
              </div>
            </div>
          </form>
          <div className="insertYCSXTable">
            {true && (
              <DataGrid
                slots={{
                  toolbar: CustomToolbar,
                  
                }}
                loading={isLoading}
                rowHeight={35}
                rows={uploadExcelJson}
                columns={column_excel2}
                pageSizeOptions={[
                  5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                ]}
                editMode="row"
                getRowHeight={() => "auto"}
                checkboxSelection
                onRowSelectionModelChange={(ids) => {
                  handleYCSXSelectionforUpdateExcel(ids);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>)
  );
};
export default INPUTPQC;

import { Button, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { AiFillEdit, AiFillFileExcel, AiFillSave } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { checkBP, SaveExcel } from "../../../api/GlobalFunction";
import "./BOM_AMAZON.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  BOM_AMAZON as BOM_AMAZON_DATA,
  CODE_INFO,
  CODEPHOI,
  LIST_BOM_AMAZON,
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const BOM_AMAZON = () => {
  const [codephoilist, setCodePhoiList] = useState<Array<CODEPHOI>>([]);
  const [listamazontable, setListBomAmazonTable] = useState<LIST_BOM_AMAZON[]>(
    []
  );
  const [bomamazontable, setBOMAMAZONTable] = useState<BOM_AMAZON_DATA[]>([]);
  const [G_CODE_MAU, setG_CODE_MAU] = useState("7A07994A");
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [enableEdit, setEnableEdit] = useState(false);
  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [codeinfoCMS, setcodeinfoCMS] = useState<any>("");
  const [codeinfoKD, setcodeinfoKD] = useState<any>("");
  const [amz_country, setAMZ_COUNTRY] = useState<any>("");
  const [amz_prod_name, setAMZ_PROD_NAME] = useState<any>("");
  const [column_codeinfo, setcolumn_codeinfo] = useState<Array<any>>([
    { field: "id", headerName: "ID", headerClassName: 'super-app-theme--header', width: 30, editable: enableEdit },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      headerClassName: 'super-app-theme--header',
      width: 100,
      editable: enableEdit,
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      flex: 1,
      minWidth: 120,
      headerClassName: 'super-app-theme--header',
      editable: enableEdit,
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      headerClassName: 'super-app-theme--header',
      width: 120,
      editable: enableEdit,
    },
  ]);
  const [column_listbomamazon, setcolumn_listbomamazon] = useState<Array<any>>([
    { field: "id", headerName: "ID", headerClassName: 'super-app-theme--header', width: 30, editable: enableEdit },
    { field: "G_NAME", headerName: "G_NAME", headerClassName: 'super-app-theme--header', width: 120, editable: enableEdit },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      headerClassName: 'super-app-theme--header', width: 100,
      editable: enableEdit,
    },
    { field: "G_CODE", headerName: "G_CODE", headerClassName: 'super-app-theme--header', width: 110, editable: enableEdit },
  ]);
  const [column_bomgia, setcolumn_bomgia] = useState<Array<any>>([
    { field: "id", headerName: "ID", headerClassName: 'super-app-theme--header', width: 30, editable: enableEdit },
    { field: "G_CODE", headerName: "G_CODE", headerClassName: 'super-app-theme--header', width: 60, editable: enableEdit },
    { field: "G_NAME", headerName: "G_NAME", headerClassName: 'super-app-theme--header', width: 100, editable: enableEdit },
    {
      field: "G_CODE_MAU",
      headerName: "G_CODE_MAU",
      headerClassName: 'super-app-theme--header', width: 100,
      editable: enableEdit,
    },
    {
      field: "TEN_MAU",
      headerName: "TEN_MAU",
      headerClassName: 'super-app-theme--header', width: 100,
      editable: enableEdit,
    },
    {
      field: "DOITUONG_NO",
      headerName: "DOITUONG_NO",
      headerClassName: 'super-app-theme--header', width: 100,
      editable: enableEdit,
    },
    {
      field: "DOITUONG_NAME",
      headerName: "DOITUONG_NAME",
      headerClassName: 'super-app-theme--header', width: 100,
      editable: enableEdit,
    },
    { field: "GIATRI", headerName: "GIATRI", headerClassName: 'super-app-theme--header', width: 100, editable: enableEdit },
    { field: "REMARK", headerName: "REMARK", headerClassName: 'super-app-theme--header', width: 100, editable: enableEdit },
  ]);
  const handle_saveAMAZONCODEINFO = async () => {
    const { value: pass1 } = await Swal.fire({
      title: "Xác nhận",
      input: "password",
      inputLabel: "Nhập mật mã",
      inputValue: "",
      inputPlaceholder: "Mật mã",
      showCancelButton: true,
    });
    if (pass1 === "okema") {
      if (codeinfoCMS !== "") {
        generalQuery("updateAmazonBOMCodeInfo", {
          G_CODE: codeinfoCMS,
          AMZ_PROD_NAME: amz_prod_name,
          AMZ_COUNTRY: amz_country,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Update data thành công", "success");
            } else {
              Swal.fire(
                "Thông báo",
                "Update data thất bại: " + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Swal.fire("Thông báo", "Chọn code trước đã !", "error");
      }
    } else {
      Swal.fire("Thông báo", "Đã nhập sai mật mã !", "error");
    }
  };
  const handleGETLISTBOMAMAZON = (G_NAME: string) => {
    setisLoading(true);
    generalQuery("listAmazon", {
      G_NAME: G_NAME,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: LIST_BOM_AMAZON[] = response.data.data.map(
            (element: LIST_BOM_AMAZON, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setListBomAmazonTable(loadeddata);
          setisLoading(false);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setListBomAmazonTable([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGETBOMAMAZON = (G_CODE: string) => {
    setisLoading(true);
    generalQuery("getBOMAMAZON", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BOM_AMAZON_DATA[] = response.data.data.map(
            (element: BOM_AMAZON_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element.G_NAME : element.G_NAME?.search('CNDB') == -1 ? element.G_NAME : 'TEM_NOI_BO',
                id: index,
              };
            }
          );
          setAMZ_COUNTRY(loadeddata[0].AMZ_COUNTRY);
          setAMZ_PROD_NAME(loadeddata[0].AMZ_PROD_NAME);
          setBOMAMAZONTable(loadeddata);
          setcodeinfoCMS(loadeddata[0].G_CODE)
          setcodeinfoKD(loadeddata[0].G_NAME)
          setisLoading(false);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setBOMAMAZONTable([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGETBOMAMAZONEMPTY = (
    G_CODE: string,
    G_NAME: string,
    G_CODE_MAU: string
  ) => {
    setisLoading(true);
    //console.log(G_CODE_MAU);
    generalQuery("getBOMAMAZON_EMPTY", {
      G_CODE_MAU: G_CODE_MAU,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BOM_AMAZON_DATA[] = response.data.data.map(
            (element: any, index: number) => {
              return {
                G_CODE: G_CODE,
                G_NAME: G_NAME,
                ...element,
                GIATRI: "",
                REMARK: "",
                id: index,
              };
            }
          );
          setBOMAMAZONTable(loadeddata);
          setisLoading(false);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setBOMAMAZONTable([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCODEINFO = () => {
    setisLoading(true);
    generalQuery("codeinfo", {
      G_NAME: codeCMS,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODE_INFO[] = response.data.data.map(
            (element: CODE_INFO, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setRows(loadeddata);
          //setCODEINFODataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  const confirmSaveBOMAMAZON = () => {
    Swal.fire({
      title: "Chắc chắn muốn lưu BOM AMAZON ?",
      text: "Lưu BOM AMAZON",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn lưu!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Lưu BOM AMAZON", "Đang lưu BOM", "success");
        //console.log(checkExistBOMAMAZON(codeinfoCMS));
        addBOMAMAZON();
      }
    });
  };
  const loadCodePhoi = () => {
    generalQuery("loadcodephoi", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODEPHOI[] = response.data.data.map(
            (element: CODEPHOI, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setCodePhoiList(loadeddata);
          setG_CODE_MAU(loadeddata[0].G_CODE_MAU);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkExistBOMAMAZON = async (G_CODE: string) => {
    let existcode: boolean = true;
    await generalQuery("checkExistBOMAMAZON", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.tk_status !== "NG") {
          if (response.data.data.length > 0) {
            existcode = true;
          } else {
            existcode = false;
          }
        } else {
          existcode = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return existcode;
  };
  const addBOMAMAZON = async () => {
    let bomAmazonExist: boolean = await checkExistBOMAMAZON(codeinfoCMS);
    if (!bomAmazonExist) {
      // neu chua ton tai bom amazon, thi them moi bom
      for (let i = 0; i < bomamazontable.length; i++) {
        Swal.fire("Thông báo", "Thêm BOM AMAZON mới", "warning");
        await generalQuery("insertAmazonBOM", {
          G_CODE: codeinfoCMS,
          G_CODE_MAU: G_CODE_MAU,
          DOITUONG_NO: bomamazontable[i].DOITUONG_NO,
          GIATRI: bomamazontable[i].GIATRI,
          REMARK: bomamazontable[i].REMARK,
          AMZ_PROD_NAME: amz_prod_name,
          AMZ_COUNTRY: amz_country,
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
    } // neu da ton tai, update bom
    else {
      Swal.fire("Thông báo", "Update BOM AMAZON", "warning");
      for (let i = 0; i < bomamazontable.length; i++) {
        await generalQuery("updateAmazonBOM", {
          G_CODE: codeinfoCMS,
          G_CODE_MAU: bomamazontable[i].G_CODE_MAU,
          DOITUONG_NO: bomamazontable[i].DOITUONG_NO,
          GIATRI: bomamazontable[i].GIATRI,
          REMARK: bomamazontable[i].REMARK,
          AMZ_PROD_NAME: amz_prod_name,
          AMZ_COUNTRY: amz_country,
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
    }
    handleGETLISTBOMAMAZON("");
  };
  const bomAMZAGTable = useMemo(() =>
    <AGTable
      showFilter={true}
      toolbar={
        <>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              SaveExcel(rows, "Code Info Table");
            }}
          >
            <AiFillFileExcel color='green' size={20} />
            EXCEL
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              /*  checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['RND'], confirmSaveBOMAMAZON); */
              checkBP(userData, ["RND"], ["ALL"], ["ALL"], confirmSaveBOMAMAZON);
              //confirmSaveBOMAMAZON();
            }}
          >
            <AiFillSave color='blue' size={20} />
            Lưu BOM
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              checkBP(userData, ["RND"], ["ALL"], ["ALL"], () => {
                setcolumn_bomgia(
                  column_bomgia.map((element, index: number) => {
                    return { ...element, editable: !element.editable };
                  })
                );
                Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
              });
            }}
          >
            <AiFillEdit color='yellow' size={15} />
            Bật tắt sửa
          </IconButton>
        </>
      }
      columns={column_bomgia}
      data={bomamazontable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        //bomsxdatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [bomamazontable, enableEdit, column_bomgia]);
  const listAMZCodeAGTable = useMemo(() =>
    <AGTable
      showFilter={true}
      toolbar={
        <></>
      }
      columns={column_listbomamazon}
      data={listamazontable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
        handleGETBOMAMAZON(params.data.G_CODE);
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        //bomsxdatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [column_listbomamazon, listamazontable]);
  function listCode () {
    return ( <AGTable
      showFilter={true}
      toolbar={
        <></>
      }
      columns={column_codeinfo}
      data={rows}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data)       
        setcodeinfoCMS(params.data.G_CODE);
        setcodeinfoKD(params.data.G_NAME);
        handleGETBOMAMAZONEMPTY(
          params.data.G_CODE,
          params.data.G_NAME,
          G_CODE_MAU
        );
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        //bomsxdatatablefilter.current = params!.api.getSelectedRows();
      }}
    />)
  }
  useEffect(() => {
    handleGETLISTBOMAMAZON("");
    loadCodePhoi();
  }, []);
  return (
    (<div className='bom_amazon'>
      <div className='left'>
        <div className='selectcodephoi'>
          <label>
            Code phôi:
            <select
              className='codephoiselection'
              name='codephoi'
              value={G_CODE_MAU}
              onChange={(e) => {
                setG_CODE_MAU(e.target.value);
              }}
            >
              {codephoilist.map((element, index) => (
                <option key={index} value={element.G_CODE_MAU}>
                  {element.G_NAME}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='tracuuFcst'>
          <div className='tracuuFcstform'>
            <div className='forminput'>
              <div className='forminputcolumn'>
                <label>
                  <b> All Code:</b>{" "}
                  <input
                    type='text'
                    placeholder='Nhập code vào đây'
                    value={codeCMS}
                    onChange={(e) => setCodeCMS(e.target.value)}
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                  ></input>
                </label>
                <button
                  className='traxuatkiembutton'
                  onClick={() => {
                    handleCODEINFO();
                  }}
                >
                  Tìm code
                </button>
              </div>
            </div>
          </div>
          <div className='codeinfotable'>
            {listCode()}
          </div>
        </div>
      </div>
      <div className='right'>
        <div className='codeinfobig'>
          <div className='biginfocms'> {codeinfoCMS}: </div>
          <div className='biginfokd'> {codeinfoKD}</div>
        </div>
        <div className='up'>
          <div className='bomsx'>
            <div className='listamazontable'>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  marginLeft: 10,
                  color: "black",
                  padding: 10,
                }}
              >
                LIST CODE ĐÃ CÓ BOM AMAZON
              </span>
              {listAMZCodeAGTable}
            </div>
          </div>
          <div className='bomgia'>
            <div className='bomamazontable'>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  marginLeft: 10,
                  color: "black",
                  padding: 10,
                }}
              >
                BOM AMAZON(
                {column_bomgia[0].editable ? "Bật Sửa" : "Tắt Sửa"})
              </span>
              {bomAMZAGTable}
            </div>
          </div>
          <div className='product_infor'>
            <div className='bomamazontable'>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginLeft: 50,
                  color: "black",
                  padding: 10,
                  justifyContent: "center",
                  justifyItems: "center",
                }}
              >
                Thông tin sản phẩm
              </span>
              <div className='section_title'>
                1. Ảnh sản phẩm <br></br>{" "}
              </div>
              <div className='product_image'>
                <img
                  width={"350px"}
                  height={"350px"}
                  src={"/amazon_image/AMZ_" + codeinfoCMS + ".jpg"}
                  alt={"AMZ_" + codeinfoCMS + ".jpg"}
                ></img>
              </div>
              <div className='section_title'>
                2. Tên sản phẩm thực tế <br></br>{" "}
              </div>
              <div className='amz_prod_name'>
                <textarea
                  value={
                    amz_prod_name === null
                      ? "Chưa nhập thông tin"
                      : amz_prod_name
                  }
                  onChange={(e: any) => {
                    setAMZ_PROD_NAME(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className='section_title'>
                3. Thị trường <br></br>{" "}
              </div>
              <div className='amz_country'>
                <div className='country'>
                  <input
                    type='text'
                    value={
                      amz_country === null
                        ? "Chưa nhập thông tin"
                        : amz_country
                    }
                    onChange={(e) => {
                      setAMZ_COUNTRY(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className='update_prod_info'>
                <Button
                  variant='contained'
                  color='success'
                  onClick={() => {
                    handle_saveAMAZONCODEINFO();
                  }}
                >
                  UPDATE
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='bottom'></div>
      </div>
    </div>)
  );
};
export default BOM_AMAZON;

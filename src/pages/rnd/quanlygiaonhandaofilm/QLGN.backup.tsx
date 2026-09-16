import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState, useTransition } from "react";
import Swal from "sweetalert2";
import "./QLGN.scss";
import { generalQuery, getAuditMode, getUserData } from "../../../api/Api";
import { HANDOVER_DATA } from "../interfaces/rndInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import { CodeListData, CustomerListData } from "../../kinhdoanh/interfaces/kdInterface";
const QLGN = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([
    {
      CUST_CD: "6969",
      CUST_NAME_KD: "CMSV",
      CUST_NAME: "CMSV",
    },
  ]);
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>({
      CUST_CD: "6969",
      CUST_NAME_KD: "CMSV",
      CUST_NAME: "CMSV",
    });
  const [handoverdatatable, setHandoverDataTable] = useState<Array<HANDOVER_DATA>>([]);
  const [fromdate, setFromDate] = useState(moment.utc().format("YYYY-MM-DD"));
  const [daofimltotalqty, setDaoFilmTotalQty] = useState(0);
  const [ohpfilmqty, setOHPFilmQTy] = useState(0);
  const [madaofilm, setMaDaoFilm] = useState("");
  const [vitritailieu, setViTriTaiLieu] = useState("");
  const [g_width, setG_Width] = useState(0);
  const [g_length, setG_Length] = useState(0);
  const [remark, setRemark] = useState("");
  const [plph, setPLPH] = useState("PH");
  const [pltl, setPLTL] = useState("D");
  const [pldao, setPLDao] = useState("PVC");
  const [plfilm, setPLFilm] = useState("CTF");
  const [ldph, setLDPH] = useState("New Code");
  const [rndEmpl, setRNDEMPL] = useState("");
  const [qcEmpl, setQCEMPL] = useState("");
  const [sxEmpl, setSXEMPL] = useState("");
  const [selectedRows, setSelectedRows] = useState<HANDOVER_DATA>({
    KNIFE_FILM_ID: "",
    FACTORY_NAME: "",
    NGAYBANGIAO: "",
    G_CODE: "",
    G_NAME: "",
    PROD_TYPE: "",
    CUST_NAME_KD: "",
    LOAIBANGIAO_PDP: "",
    LOAIPHATHANH: "",
    SOLUONG: 0,
    SOLUONGOHP: 0,
    LYDOBANGIAO: "",
    PQC_EMPL_NO: "",
    RND_EMPL_NO: "",
    SX_EMPL_NO: "",
    REMARK: "",
    CFM_GIAONHAN: "",
    CFM_INS_EMPL: "",
    CFM_DATE: "",
    KNIFE_FILM_STATUS: "",
    MA_DAO: "",
    TOTAL_PRESS: 0,
    CUST_CD: "",
    KNIFE_TYPE: "",
  });
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
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
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const load_handoverdata_table = () => {
    generalQuery("loadquanlygiaonhan", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: HANDOVER_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                NGAYBANGIAO: moment
                  .utc(element.NGAYBANGIAO)
                  .format("YYYY-MM-DD"),
                CFM_DATE: element.CFM_DATE === null ? '' : moment.utc(element.CFM_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setHandoverDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setHandoverDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setBarCodeInfo = (keyname: string, value: any) => {
    //console.log(keyname);
    //console.log(value);
    let tempHandoverData: HANDOVER_DATA = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempHandoverData);
  };
  const columns_handoverdata = [
    {
      field: "KNIFE_FILM_ID",
      headerName: "KNIFE_FILM_ID",
      width: 100,
      editable: false,
    },
    {
      field: "FACTORY_NAME",
      headerName: "FACTORY_NAME",
      width: 100,
      editable: false,
    },
    {
      field: "NGAYBANGIAO",
      headerName: "NGAYBANGIAO",
      width: 100,
      editable: false,
    },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 100,
      editable: false,
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 100,
      editable: false,
    },
    {
      field: "PROD_TYPE",
      headerName: "PROD_TYPE",
      width: 100,
      editable: false,
    },
    {
      field: "CUST_NAME_KD",
      headerName: "CUST_NAME_KD",
      width: 100,
      editable: false,
    },
    {
      field: "LOAIBANGIAO_PDP",
      headerName: "LOAIBANGIAO_PDP",
      width: 100,
      editable: false,
    },
    {
      field: "LOAIPHATHANH",
      headerName: "LOAIPHATHANH",
      width: 100,
      editable: false,
    },
    {
      field: "SOLUONG",
      headerName: "SOLUONG",
      width: 100,
      editable: false,
    },
    {
      field: "SOLUONGOHP",
      headerName: "SOLUONGOHP",
      width: 100,
      editable: false,
    },
    {
      field: "LYDOBANGIAO",
      headerName: "LYDOBANGIAO",
      width: 100,
      editable: false,
    },
    {
      field: "PQC_EMPL_NO",
      headerName: "PQC_EMPL_NO",
      width: 100,
      editable: false,
    },
    {
      field: "RND_EMPL_NO",
      headerName: "RND_EMPL_NO",
      width: 100,
      editable: false,
    },
    {
      field: "SX_EMPL_NO",
      headerName: "SX_EMPL_NO",
      width: 100,
      editable: false,
    },
    {
      field: "REMARK",
      headerName: "REMARK",
      width: 100,
      editable: false,
    },
    {
      field: "CFM_GIAONHAN",
      headerName: "CFM_GIAONHAN",
      width: 100,
      editable: false,
    },
    {
      field: "CFM_INS_EMPL",
      headerName: "CFM_INS_EMPL",
      width: 100,
      editable: false,
    },
    {
      field: "CFM_DATE",
      headerName: "CFM_DATE",
      width: 100,
      editable: false,
    },
    {
      field: "KNIFE_FILM_STATUS",
      headerName: "KNIFE_FILM_STATUS",
      width: 100,
      editable: false,
    },
    {
      field: "MA_DAO",
      headerName: "MA_DAO",
      width: 100,
      editable: false,
    },
    {
      field: "TOTAL_PRESS",
      headerName: "TOTAL_PRESS",
      width: 100,
      editable: false,
    },
    {
      field: "CUST_CD",
      headerName: "CUST_CD",
      width: 100,
      editable: false,
    },
    {
      field: "KNIFE_TYPE",
      headerName: "KNIFE_TYPE",
      width: 100,
      editable: false,
    },
  ]
  const HandoverDataTableAG = useMemo(() =>
    <AGTable
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>


        </div>
      }
      columns={columns_handoverdata}
      data={handoverdatatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(e: any) => {
        //clickedRow.current = params.data;
        //clickedRow.current = params.data;
        //console.log(e.data) 
        //console.log(e.data.CUST_CD);       

      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())        
      }}
    />
    , [handoverdatatable]);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const [isPending, startTransition] = useTransition();
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
  const confirmAddBanGiao = () => {
    Swal.fire({
      title: "Thêm Giao Nhận",
      text: "Chắc chắn thêm giao nhận dao film tài liệu ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        addBanGiao();
      }
    });
  }
  const checkBanGiaoData = () => {
    let err_code: string = '';
    if (rndEmpl.length < 7 || qcEmpl.length < 7) err_code = "NG: Mã nhân viên phải bằng 7 ký tự";
    if (daofimltotalqty <= 0) err_code = "NG: Tổng số lượng dao/film phải lớn hơn 0";
    return err_code;
  }
  const addBanGiao = () => {
    let err_code: string = checkBanGiaoData();
    if (err_code === '') {
      generalQuery("addbangiaodaofilmtailieu", {
        FACTORY: getUserData()?.FACTORY_CODE === 1 ? 'NM1' : 'NM2',
        NGAYBANGIAO: moment(fromdate).format("YYYY-MM-DD"),
        G_CODE: selectedCode?.G_CODE,
        LOAIBANGIAO_PDP: pltl,
        LOAIPHATHANH: plph,
        SOLUONG: daofimltotalqty,
        SOLUONGOHP: ohpfilmqty,
        LYDOBANGIAO: ldph,
        PQC_EMPL_NO: qcEmpl,
        RND_EMPL_NO: rndEmpl,
        SX_EMPL_NO: sxEmpl,
        REMARK: remark,
        MA_DAO: madaofilm,
        CUST_CD: selectedCust_CD?.CUST_CD,
        G_WIDTH: g_width,
        G_LENGTH: g_length,
        KNIFE_TYPE: pldao
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            Swal.fire('Thông báo', 'Thêm thành công', 'success');
          } else {
            Swal.fire('Thông báo', 'Thất bại', 'error');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      Swal.fire('Thông báo', err_code, 'error');
    }
  }
  useEffect(() => {
    getcodelist("");
    getcustomerlist();
    load_handoverdata_table();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="qlgn">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
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
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <Autocomplete
                  sx={{ fontSize: "0.6rem" }}
                  ListboxProps={{ style: { fontSize: "0.7rem" } }}
                  size="small"
                  disablePortal
                  options={codeList}
                  className="autocomplete1"
                  filterOptions={filterOptions1}
                  getOptionLabel={(option: CodeListData | any) =>
                    `${option.G_CODE}: ${option.G_NAME}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select code" />
                  )}
                  onChange={(event: any, newValue: CodeListData | any) => {
                    console.log(newValue);
                    setSelectedCode(newValue);
                    setBarCodeInfo("G_CODE", newValue.G_CODE);
                  }}
                  value={
                    codeList.filter(
                      (e: CodeListData, index: number) =>
                        e.G_CODE === selectedRows.G_CODE,
                    )[0]
                  }
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.G_CODE === value.G_CODE
                  }
                />
              </label>
              <label>
                <b>Ngày bàn giao:</b>
                <input
                  onKeyDown={(e) => { }}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>PL phát hành:</b>{" "}
                <select
                  name="vendor"
                  value={plph}
                  onChange={(e) => {
                    setPLPH(e.target.value);
                  }}
                >
                  <option value="PH">PHÁT HÀNH</option>
                  <option value="TH">THU HỒI</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>PL tài liệu:</b>{" "}
                <select
                  name="vendor"
                  value={pltl}
                  onChange={(e) => {
                    setPLTL(e.target.value);
                  }}
                >
                  <option value="F">FILM</option>
                  <option value="D">DAO</option>
                  <option value="T">TÀI LIỆU</option>
                  <option value="M">MẮT DAO</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>PL bàn giao:</b>{" "}
                <select
                  name="vendor"
                  value={ldph}
                  onChange={(e) => {
                    setLDPH(e.target.value);
                  }}
                >
                  <option value="New Code">New Code</option>
                  <option value="ECN">ECN</option>
                  <option value="Update">Update</option>
                  <option value="Amendment">Amendment</option>
                </select>
              </label>
              <label>
                <b>NV RND:</b>{" "}
                <input
                  type="text"
                  placeholder="RND"
                  value={rndEmpl}
                  onChange={(e) => setRNDEMPL(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>NV QC:</b>{" "}
                <input
                  type="text"
                  placeholder="QC"
                  value={qcEmpl}
                  onChange={(e) => setQCEMPL(e.target.value)}
                ></input>
              </label>
              <label>
                <b>NV SX:</b>{" "}
                <input
                  type="text"
                  placeholder="SX"
                  value={sxEmpl}
                  onChange={(e) => setSXEMPL(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>SL Dao/film/TL:</b>{" "}
                <input
                  type="text"
                  placeholder="D/F/T Qty"
                  value={daofimltotalqty}
                  onChange={(e) => setDaoFilmTotalQty(Number(e.target.value))}
                ></input>
              </label>
              {(pltl === 'D' || pltl === 'M') && <label>
                <b>Phân loại dao:</b>{" "}
                <select
                  name="vendor"
                  value={pldao}
                  onChange={(e) => {
                    setPLDao(e.target.value);
                  }}
                >
                  <option value="PVC">PVC</option>
                  <option value="PINACLE">PINACLE</option>
                </select>
              </label>}
              {pltl === 'F' && <label>
                <b>Phân loại film:</b>{" "}
                <select
                  name="vendor"
                  value={plfilm}
                  onChange={(e) => {
                    setPLFilm(e.target.value);
                  }}
                >
                  <option value="CTF">CTF</option>
                  <option value="CTP">CTP</option>
                </select>
              </label>}
            </div>
            <div className="forminputcolumn">
              {pltl === 'F' && <label>
                <b>OHP FILM QTY</b>{" "}
                <input
                  type="text"
                  placeholder="Nhập số lượng OHP Film vào đây"
                  value={ohpfilmqty}
                  onChange={(e) => setOHPFilmQTy(Number(e.target.value))}
                ></input>
              </label>}
              {(pltl === 'D' || pltl === 'F') && <label>
                <b>Mã Dao/Film</b>{" "}
                <input
                  type="text"
                  placeholder="Mã dao film"
                  value={madaofilm}
                  onChange={(e) => setMaDaoFilm(e.target.value)}
                ></input>
              </label>}
              {(pltl === 'T') && <label>
                <b>Vị trí tài liệu</b>{" "}
                <input
                  type="text"
                  placeholder="Vị trí tài liệu"
                  value={vitritailieu}
                  onChange={(e) => setViTriTaiLieu(e.target.value)}
                ></input>
              </label>}
            </div>
            {pltl !== 'T' && <div className="forminputcolumn">
              <label>
                <b>Rộng</b>{" "}
                <input
                  type="text"
                  placeholder="SX"
                  value={g_width}
                  onChange={(e) => setG_Width(Number(e.target.value))}
                ></input>
              </label>
              <label>
                <b>Dài</b>{" "}
                <input
                  type="text"
                  placeholder="SX"
                  value={g_length}
                  onChange={(e) => setG_Length(Number(e.target.value))}
                ></input>
              </label>
            </div>}
            <div className="forminputcolumn">
              <label>
                <b>Remark</b>{" "}
                <input
                  type="text"
                  placeholder="Remark here"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <button
              className="tranhatky"
              onClick={() => {
                load_handoverdata_table();
              }}
            >
              Refesh
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                confirmAddBanGiao();
              }}
            >
              Thêm Giao Nhận
            </button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{HandoverDataTableAG}</div>
      </div>
    </div>
  );
};
export default QLGN;

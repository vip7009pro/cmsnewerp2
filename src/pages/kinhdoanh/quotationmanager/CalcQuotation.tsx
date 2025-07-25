import { useEffect, useMemo, useRef, useState } from "react";
import { generalQuery, getAuditMode } from "../../../api/Api";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";
import { AiFillFolderAdd } from "react-icons/ai";
import "./CalcQuotation.scss";
import CodeVisualLize from "./CodeVisualize/CodeVisualLize";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import moment from "moment";
import { BiSave } from "react-icons/bi";
import { GrUpdate } from "react-icons/gr";
import { TbLogout } from "react-icons/tb";
import { UserData, } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { BANGGIA_DATA_CALC, CODEDATA, DEFAULT_DM, GIANVL } from "../interfaces/kdInterface";
import { BOM_GIA } from "../../rnd/interfaces/rndInterface";
const CalcQuotation = () => {
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [cust_nhancong, setCust_NhanCong] = useState("0");
  const [cust_vanchuyen, setCust_VanChuyen] = useState("0");
  const [cust_khauhao, setCust_KhauHao] = useState("0");
  const [cust_quanlychung, setCust_QuanLyChung] = useState("0");
  const [sh, setSH] = useState(true);
  const showhidesearchdiv = useRef(false);
  const [banggia, setBangGia] = useState<Array<BANGGIA_DATA_CALC>>([]);
  const [listcode, setListCode] = useState<Array<CODEDATA>>([]);
  const [listVL, setListVL] = useState<Array<BOM_GIA>>([]);
  const [tempQTY, setTempQty] = useState(1);
  const [profit, setProfit] = useState(10);
  const [salePriceNB, setSalePriceNB] = useState(0);
  const [salePriceOP, setSalePriceOP] = useState(0);
  const [defaultDM, setDefaultDM] = useState<DEFAULT_DM>({
    id: 0,
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT: 0,
    GMANAGEMENT_UNIT: 0,
    M_LOSS_UNIT: 0,
  });
  const [gianvl, setGiaNvl] = useState<GIANVL>({
    mCutWidth: 0,
    mLength: 0,
    mArea: 0,
    giaVLSS: 0,
    giaVLCMS: 0,
    knife_cost: 0,
    film_cost: 0,
    ink_cost: 0,
    labor_cost: 0,
    delivery_cost: 0,
    deprecation_cost: 0,
    gmanagement_cost: 0,
    totalcostCMS: 0,
    totalcostSS: 0,
  });
  const loadbanggia = (CUST_CD: string, G_CODE: string) => {
    generalQuery("loadbanggiamoinhat", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      M_NAME: "",
      G_CODE: G_CODE,
      G_NAME: "",
      CUST_NAME_KD: "",
      CUST_CD: CUST_CD,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: BANGGIA_DATA_CALC[] = response.data.data.map(
            (element: BANGGIA_DATA_CALC, index: number) => {
              return {
                ...element,
                PRICE_DATE:
                  element.PRICE_DATE !== null
                    ? moment.utc(element.PRICE_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          setBangGia(loaded_data);
        } else {
          setBangGia([]);
          /* Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error"); */
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const loadListCode = async () => {
    generalQuery("loadlistcodequotation", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODEDATA[] = response.data.data.map(
            (element: CODEDATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setListCode(loadeddata);
          /* Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          ); */
        } else {
          setListCode([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadbomNVLQuotation = (CODEINFO: CODEDATA) => {
    generalQuery("getbomgia", {
      G_CODE: CODEINFO.G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BOM_GIA[] = response.data.data.map(
            (element: BOM_GIA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          console.log(tinhgia(CODEINFO, loadeddata, tempQTY));
          setListVL(loadeddata);
        } else {
          setListVL([]);
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadDefaultDM = () => {
    generalQuery("loadDefaultDM", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DEFAULT_DM[] = response.data.data.map(
            (element: DEFAULT_DM, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setDefaultDM(loadeddata[0]);
        } else {
          setDefaultDM({
            id: 0,
            WIDTH_OFFSET: 0,
            LENGTH_OFFSET: 0,
            KNIFE_UNIT: 0,
            FILM_UNIT: 0,
            INK_UNIT: 0,
            LABOR_UNIT: 0,
            DELIVERY_UNIT: 0,
            DEPRECATION_UNIT: 0,
            GMANAGEMENT_UNIT: 0,
            M_LOSS_UNIT: 0,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [selectedRows, setSelectedRows] = useState<CODEDATA>({
    id: 0,
    Q_ID: "",
    G_CODE: "",
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT: 0,
    GMANAGEMENT_UNIT: 0,
    M_LOSS_UNIT: 0,
    G_WIDTH: 0,
    G_LENGTH: 0,
    G_C: 0,
    G_C_R: 0,
    G_LG: 0,
    G_CG: 0,
    G_SG_L: 0,
    G_SG_R: 0,
    PROD_PRINT_TIMES: 0,
    KNIFE_COST: 0,
    FILM_COST: 0,
    INK_COST: 0,
    LABOR_COST: 0,
    DELIVERY_COST: 0,
    DEPRECATION_COST: 0,
    GMANAGEMENT_COST: 0,
    MATERIAL_COST: 0,
    TOTAL_COST: 0,
    SALE_PRICE: 0,
    PROFIT: 0,
    G_NAME: "",
    G_NAME_KD: "",
    CUST_NAME_KD: "",
    CUST_CD: "",
  });
  const uploadgia = async () => {
    if (banggia.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < banggia.length; i++) {
        if (banggia[i].PRICE_DATE === moment.utc().format("YYYY-MM-DD")) {
          //console.log("price date", banggia[i].PRICE_DATE);
          await generalQuery("checkgiaExist", banggia[i])
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                generalQuery("updategiasp", banggia[i])
                  .then((response) => {
                    //console.log(response.data.data);
                    if (response.data.tk_status !== "NG") {
                    } else {
                      err_code += `Lỗi : ${response.data.message} |`;
                      //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    Swal.fire("Thông báo", " Có lỗi : " + error, "error");
                  });
              } else {
                generalQuery("upgiasp", banggia[i])
                  .then((response) => {
                    //console.log(response.data.data);
                    if (response.data.tk_status !== "NG") {
                    } else {
                      err_code += `Lỗi : ${response.data.message} |`;
                      //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    Swal.fire("Thông báo", " Có lỗi : " + error, "error");
                  });
              }
            })
            .catch((error) => {
              console.log(error);
              Swal.fire("Thông báo", " Có lỗi : " + error, "error");
            });
        }
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Up giá thành công", "success");
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + err_code, "error");
      }
    } else {
      Swal.fire(
        "Thông báo",
        "Thêm dòng hoặc import excel file để up giá",
        "error",
      );
    }
  };
  const updateCurrentUnit = async () => {
    generalQuery("updateCurrentUnit", selectedRows)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const columns_listcode = [    
    { field: "CUST_NAME_KD", headerName: "KHACH", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 60 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 80 },
    { field: "G_WIDTH", headerName: "RỘNG", width: 40 },
    { field: "G_LENGTH", headerName: "DÀI", width: 40 },
    { field: "G_C", headerName: "CỘT", width: 40 },
    { field: "G_C_R", headerName: "HÀNG", width: 40 },
    { field: "G_LG", headerName: "K/C HÀNG", width: 60 },
    { field: "G_CG", headerName: "K/C CỘT", width: 60 },
    { field: "G_SG_L", headerName: "MÉP TRÁI", width: 50 },
    { field: "G_SG_R", headerName: "MÉP PHẢI", width: 50 },
    { field: "PROD_PRINT_TIMES", headerName: "SỐ MÀU", width: 50 },
    { field: "WIDTH_OFFSET", headerName: "WIDTH_OFFSET", width: 90 },
    { field: "LENGTH_OFFSET", headerName: "LENGTH_OFFSET", width: 90 },
    { field: "KNIFE_UNIT", headerName: "KNIFE_UNIT", width: 90 },
    { field: "FILM_UNIT", headerName: "FILM_UNIT", width: 90 },
    { field: "INK_UNIT", headerName: "INK_UNIT", width: 90 },
    { field: "LABOR_UNIT", headerName: "LABOR_UNIT", width: 90 },
    { field: "DELIVERY_UNIT", headerName: "DELIVERY_UNIT", width: 90 },
    { field: "DEPRECATION_UNIT", headerName: "DEPRECATION_UNIT", width: 90 },
    { field: "GMANAGEMENT_UNIT", headerName: "GMANAGEMENT_UNIT", width: 90 },
    { field: "M_LOSS_UNIT", headerName: "M_LOSS_UNIT", width: 90 },
    { field: "KNIFE_COST", headerName: "KNIFE_COST", width: 90 },
    { field: "FILM_COST", headerName: "FILM_COST", width: 90 },
    { field: "INK_COST", headerName: "INK_COST", width: 90 },
    { field: "LABOR_COST", headerName: "LABOR_COST", width: 90 },
    { field: "DELIVERY_COST", headerName: "DELIVERY_COST", width: 90 },
    { field: "DEPRECATION_COST", headerName: "DEPRECATION_COST", width: 90 },
    { field: "GMANAGEMENT_COST", headerName: "GMANAGEMENT_COST", width: 90 },
    { field: "MATERIAL_COST", headerName: "MATERIAL_COST", width: 90 },
    { field: "TOTAL_COST", headerName: "TOTAL_COST", width: 90 },
    { field: "SALE_PRICE", headerName: "SALE_PRICE", width: 90 },
    { field: "PROFIT", headerName: "PROFIT", width: 90 },
  ];
  const columns_listbomvl = [
    { field: "G_CODE", headerName: "G_CODE", width: 60 },
    { field: "G_SEQ", headerName: "STT", width: 40 },
    { field: "M_CODE", headerName: "M_CODE", width: 60 },
    { field: "M_NAME", headerName: "M_NAME", width: 100 },
    { field: "MAT_CUTWIDTH", headerName: "SIZE", width: 50 },
    { field: "M_CMS_PRICE", headerName: "GIÁ NỘI BỘ", width: 60 },
    { field: "M_SS_PRICE", headerName: "GIÁ OPEN", width: 60 },
    { field: "USAGE", headerName: "VAI TRÒ", width: 60 },
    { field: "MAT_MASTER_WIDTH", headerName: "KHỔ CÂY", width: 50 },
    { field: "M_QTY", headerName: "SỐ LỚP LIỆU", width: 90 },
  ];
  const columns_banggia = [
    { field: "CUST_CD", headerName: "MÃ KH", width: 50 },
    { field: "G_CODE", headerName: "G_CODE", width: 60 },
    { field: "PRICE_DATE", headerName: "PRICE_DATE", width: 60 },
    { field: "MOQ", headerName: "MOQ", width: 50 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 90 },
    { field: "BEP", headerName: "BEP", width: 90 },
    { field: "FINAL", headerName: "APPROVAL", width: 90, cellRenderer: (e: any) => {
      if (e.data.FINAL === "Y") {
        return (
          <div
            style={{
              color: "white",
              backgroundColor: "#13DC0C",
              width: "80px",
              textAlign: "center",
            }}
          >
            Y
          </div>
        );
      } else {
        return (
          <div
            style={{
              color: "white",
              backgroundColor: "red",
              width: "80px",
              textAlign: "center",
            }}
          >
            Not Approved
          </div>
        );
      }
    } },
    { field: "DELETE", headerName: "DELETE", width: 90, cellRenderer: (e: any) => {
      return (
        <button style={{backgroundColor:'red', color:'white'}} onClick={()=> {
          setBangGia(banggia.filter((item) => item.id !== e.data.id));
        }}>Delete</button>  
      )}}
    ,
  ];
  const listCodeTableAG = useMemo(() =>
    <AGTable      
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    showhidesearchdiv.current = !showhidesearchdiv.current;
                    setSH(!showhidesearchdiv.current);
                  }}
                >
                  <TbLogout color="green" size={15} />
                  Show/Hide
                </IconButton>
        </div>
      }
      columns={columns_listcode}
      data={listcode}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(e: any) => {
        //clickedRow.current = params.data;
        //clickedRow.current = params.data;
        //console.log(e.data) 
        //console.log(e.data.CUST_CD);
        setSelectedRows(e.data);
        loadbomNVLQuotation(e.data);
        loadbanggia(e.data.CUST_CD, e.data.G_CODE);
        setCust_KhauHao("0");
        setCust_NhanCong("0");
        setCust_QuanLyChung("0");
        setCust_VanChuyen("0");
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())        
      }}
    />
    , [listcode]);
  const listBOMVLTableAG = useMemo(() =>
    <AGTable      
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>          
          <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    updateGIAVLBOM2();
                  }}
                >
                  <GrUpdate color="green" size={15} />
                  Update Giá Liệu
                </IconButton>
        </div>
      }
      columns={columns_listbomvl}
      data={listVL}
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
    , [listVL]);
  const banggiamoinhatAG = useMemo(() =>
    <AGTable      
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        </div>
      }
      columns={columns_banggia}
      data={banggia}
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
    , [banggia]);
  const addRowBG = () => {
    const addBangGiaRow: BANGGIA_DATA_CALC = {
      CUST_CD: selectedRows.CUST_CD,
      G_CODE: selectedRows.G_CODE,
      PRICE_DATE: moment.utc().format("YYYY-MM-DD"),
      MOQ: tempQTY,
      FINAL: "N",
      PROD_PRICE: Number((salePriceOP / tempQTY).toFixed(0)),
      BEP: Number((gianvl.totalcostSS / tempQTY).toFixed(0)), 
      id: banggia.length + 1,
      INS_DATE: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      INS_EMPL: userData?.EMPL_NO === undefined ? "" : userData?.EMPL_NO,
      UPD_DATE: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: userData?.EMPL_NO === undefined ? "" : userData?.EMPL_NO,
      REMARK: "",
    };
    setBangGia([...banggia, addBangGiaRow]);
  };
  const handlesetDefaultDM = (keyname: string, value: any) => {
    let tempDM = { ...defaultDM, [keyname]: value };
    //console.log(tempcodefullinfo);
    setDefaultDM(tempDM);
  };
  const handlesetCodeInfo = (keyname: string, value: any) => {
    let tempCodeInfo = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSalePriceNB(
      tinhgia(tempCodeInfo, listVL, tempQTY).total_costCMS * (1 + profit / 100),
    );
    setSalePriceOP(
      tinhgia(tempCodeInfo, listVL, tempQTY).total_costSS * (1 + profit / 100),
    );
    tinhgia(tempCodeInfo, listVL, tempQTY);
    setSelectedRows(tempCodeInfo);
  };
  const tinhgia = (CODEINFO: CODEDATA, BOMNVL: BOM_GIA[], TEMP_QTY: number) => {
    const materialCutWidth: number =
      CODEINFO.G_SG_L +
      (CODEINFO.G_CG + CODEINFO.G_WIDTH) * (CODEINFO.G_C - 1) +
      CODEINFO.G_WIDTH +
      CODEINFO.G_SG_R +
      CODEINFO.WIDTH_OFFSET;
    const materialLength: number =
      ((CODEINFO.G_LENGTH + CODEINFO.G_LG) / CODEINFO.G_C) * 1.0 * TEMP_QTY;
    const materialArea =
      (materialLength * materialCutWidth * (1 + CODEINFO.M_LOSS_UNIT / 100)) /
      1000000;
    let materialAmountCMS: number = 0;
    let materialAmountSS: number = 0;
    //Material Cost
    for (let i = 0; i < BOMNVL.length; i++) {
      materialAmountCMS += BOMNVL[i].M_CMS_PRICE * materialArea;
      materialAmountSS += BOMNVL[i].M_SS_PRICE * materialArea;
    }
    //KNIFE
    const knife_cost =
      CODEINFO.KNIFE_UNIT *
      (CODEINFO.G_WIDTH * CODEINFO.G_C * 2 +
        CODEINFO.G_LENGTH * CODEINFO.G_C_R * 2);
    const film_cost =
      CODEINFO.FILM_UNIT *
      (CODEINFO.G_WIDTH *
        (CODEINFO.G_LENGTH + CODEINFO.LENGTH_OFFSET) *
        CODEINFO.G_C *
        CODEINFO.PROD_PRINT_TIMES);
    const ink_cost = CODEINFO.INK_UNIT * materialArea;
    const labor_cost = CODEINFO.LABOR_UNIT * materialArea;
    const delivery_cost = CODEINFO.DELIVERY_UNIT;
    const deprecation_cost = CODEINFO.DEPRECATION_UNIT * materialArea;
    const gmanagement_cost = CODEINFO.GMANAGEMENT_UNIT * materialArea;
    const total_costCMS =
      materialAmountCMS +
      knife_cost +
      film_cost +
      ink_cost +
      labor_cost +
      delivery_cost +
      deprecation_cost +
      gmanagement_cost;
    const total_costSS =
      materialAmountSS +
      knife_cost +
      film_cost +
      ink_cost +
      labor_cost +
      delivery_cost +
      deprecation_cost +
      gmanagement_cost;
    //setCust_NhanCong(labor_cost);
    //setCust_VanChuyen(delivery_cost);
    //setCust_KhauHao(deprecation_cost);
    //setCust_QuanLyChung(gmanagement_cost);
    setGiaNvl({
      mCutWidth: materialCutWidth,
      mLength: materialLength,
      mArea: materialArea,
      giaVLSS: materialAmountSS,
      giaVLCMS: materialAmountCMS,
      knife_cost: knife_cost,
      film_cost: film_cost,
      ink_cost: ink_cost,
      labor_cost: labor_cost,
      delivery_cost: delivery_cost,
      deprecation_cost: deprecation_cost,
      gmanagement_cost: gmanagement_cost,
      totalcostCMS: total_costCMS,
      totalcostSS: total_costSS,
    });
    return {
      mCutWidth: materialCutWidth,
      mLength: materialLength,
      mArea: materialArea,
      giaVLSS: materialAmountSS,
      giaVLCMS: materialAmountCMS,
      knife_cost: knife_cost,
      film_cost: film_cost,
      ink_cost: ink_cost,
      labor_cost: labor_cost,
      delivery_cost: delivery_cost,
      deprecation_cost: deprecation_cost,
      gmanagement_cost: gmanagement_cost,
      total_costCMS: total_costCMS,
      total_costSS: total_costSS,
    };
  };
  const updateGIAVLBOM2 = async () => {
    if (listVL.length > 0) {
      for (let i = 0; i < listVL.length; i++) {
        await generalQuery("updateGiaVLBOM2", {
          G_CODE: listVL[i].G_CODE,
          M_CODE: listVL[i].M_CODE,
          M_CMS_PRICE: listVL[i].M_CMS_PRICE,
          M_SS_PRICE: listVL[i].M_SS_PRICE,
        })
          .then((response) => {
            //console.log(response.data);
            if (response.data.tk_status !== "NG") {
              //Swal.fire("Thông báo", "Lưu giá liệu thành công", "success");
            } else {
              Swal.fire(
                "Thông báo",
                "Nội dung: " + response.data.message,
                "error",
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      Swal.fire("Thông báo", "Lưu giá liệu thành công", "success");
    } else {
      Swal.fire("Thông báo", "Code này chưa có bom liệu", "error");
    }
  };
  useEffect(() => {
    loadListCode();
    loadDefaultDM();
  }, []);
  return (
    <div className="calc_quotation">
      <div className="calc_title">BẢNG TÍNH GIÁ</div>
      <div className="calc_wrap">
        <div className="left" /* style={{ width: sh ? "20%" : "100%" }} */>
          <div className="listcode">{listCodeTableAG}</div>
          <div className="moqlist"></div>
          <div className="insert_button"></div>
        </div>
        {sh && (
          <div className="right">
            <div className="up">
              <div className="bomnvl">{listBOMVLTableAG}</div>
              <div className="product_visualize">
                <CodeVisualLize DATA={selectedRows} />
                <div className="banve">
                  <span style={{ color: "green" }}>
                    <b>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`/banve/${selectedRows.G_CODE}.pdf`}
                      >
                        LINK
                      </a>
                    </b>
                  </span>
                </div>
              </div>
            </div>
            <div className="middle">
              <div className="openlink">
                <div className="defaultunit">
                  <span>T/C mặc định</span>
                  <label>
                    WIDTH_OFFSET:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.WIDTH_OFFSET === null
                          ? 0
                          : defaultDM.WIDTH_OFFSET
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("WIDTH_OFFSET", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    LENGTH_OFFSET:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.LENGTH_OFFSET === null
                          ? 0
                          : defaultDM.LENGTH_OFFSET
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("LENGTH_OFFSET", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    CP dao T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.KNIFE_UNIT === null ? 0 : defaultDM.KNIFE_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("KNIFE_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    CP film bản T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.FILM_UNIT === null ? 0 : defaultDM.FILM_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("FILM_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    CP mực T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.INK_UNIT === null ? 0 : defaultDM.INK_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("INK_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    CP nhân công T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.LABOR_UNIT === null ? 0 : defaultDM.LABOR_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("LABOR_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    CP giao hàng T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.DELIVERY_UNIT === null
                          ? 0
                          : defaultDM.DELIVERY_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("DELIVERY_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    CP khấu hao T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.DEPRECATION_UNIT === null
                          ? 0
                          : defaultDM.DEPRECATION_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("DEPRECATION_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    CP quản lý chung T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.GMANAGEMENT_UNIT === null
                          ? 0
                          : defaultDM.GMANAGEMENT_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("GMANAGEMENT_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    Hao hụt T/C:<br></br>
                    <input
                      type="text"
                      value={
                        defaultDM.M_LOSS_UNIT === null
                          ? 0
                          : defaultDM.M_LOSS_UNIT
                      }
                      onChange={(e) => {
                        handlesetDefaultDM("M_LOSS_UNIT", e.target.value);
                      }}
                    ></input>
                  </label>
                </div>
                <div className="currentunit">
                  <span>T/C hiện tại__</span>
                  <label>
                    WIDTH_OFFSET:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.WIDTH_OFFSET === null
                          ? 0
                          : selectedRows.WIDTH_OFFSET
                      }
                      onChange={(e) => {
                        handlesetCodeInfo(
                          "WIDTH_OFFSET",
                          Number(e.target.value),
                        );
                      }}
                    ></input>
                  </label>
                  <label>
                    LENGTH_OFFSET:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.LENGTH_OFFSET === null
                          ? 0
                          : selectedRows.LENGTH_OFFSET
                      }
                      onChange={(e) => {
                        handlesetCodeInfo(
                          "LENGTH_OFFSET",
                          Number(e.target.value),
                        );
                      }}
                    ></input>
                  </label>
                  <label>
                    CP dao T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.KNIFE_UNIT === null
                          ? 0
                          : selectedRows.KNIFE_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo("KNIFE_UNIT", Number(e.target.value));
                      }}
                    ></input>
                  </label>
                  <label>
                    CP film bản T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.FILM_UNIT === null
                          ? 0
                          : selectedRows.FILM_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo("FILM_UNIT", Number(e.target.value));
                      }}
                    ></input>
                  </label>
                  <label>
                    CP mực T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.INK_UNIT === null
                          ? 0
                          : selectedRows.INK_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo("INK_UNIT", Number(e.target.value));
                      }}
                    ></input>
                  </label>
                  <label>
                    CP nhân công T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.LABOR_UNIT === null
                          ? 0
                          : selectedRows.LABOR_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo("LABOR_UNIT", Number(e.target.value));
                      }}
                    ></input>
                  </label>
                  <label>
                    CP giao hàng T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.DELIVERY_UNIT === null
                          ? 0
                          : selectedRows.DELIVERY_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo(
                          "DELIVERY_UNIT",
                          Number(e.target.value),
                        );
                      }}
                    ></input>
                  </label>
                  <label>
                    CP khấu hao T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.DEPRECATION_UNIT === null
                          ? 0
                          : selectedRows.DEPRECATION_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo(
                          "DEPRECATION_UNIT",
                          Number(e.target.value),
                        );
                      }}
                    ></input>
                  </label>
                  <label>
                    CP quản lý chung T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.GMANAGEMENT_UNIT === null
                          ? 0
                          : selectedRows.GMANAGEMENT_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo(
                          "GMANAGEMENT_UNIT",
                          Number(e.target.value),
                        );
                      }}
                    ></input>
                  </label>
                  <label>
                    Hao hụt T/C:<br></br>
                    <input
                      type="text"
                      value={
                        selectedRows.M_LOSS_UNIT === null
                          ? 0
                          : selectedRows.M_LOSS_UNIT
                      }
                      onChange={(e) => {
                        handlesetCodeInfo(
                          "M_LOSS_UNIT",
                          Number(e.target.value),
                        );
                      }}
                    ></input>
                  </label>
                </div>
              </div>
            </div>
            <div className="down">
              <div className="tongchiphi">
                <table>
                  <thead>
                    <tr>
                      <td width={"40%"}>HẠNG MỤC</td>
                      <td width={"40%"}>GIÁ TRỊ</td>
                      <td width={"0%"}>TÙY BIẾN</td>
                      <td width={"10%"}>UNIT</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Khổ liệu sử dụng</td>
                      <td>
                        {gianvl.mCutWidth.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={
                            selectedRows.WIDTH_OFFSET === null
                              ? 0
                              : selectedRows.WIDTH_OFFSET
                          }
                          onChange={(e) => {
                            handlesetCodeInfo(
                              "WIDTH_OFFSET",
                              Number(e.target.value),
                            );
                          }}
                        ></input>
                      </td>
                      <td>mm</td>
                    </tr>
                    <tr>
                      <td>Chiều dài liệu cần</td>
                      <td>
                        {gianvl.mLength.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td>mm</td>
                    </tr>
                    <tr>
                      <td>Diện tích liệu cần</td>
                      <td>
                        {(gianvl.mArea * 1000000).toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td>mm2</td>
                    </tr>
                    <tr>
                      <td>Tiền VL Nội Bộ</td>
                      <td>
                        {gianvl.giaVLCMS.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Tiền VL Open</td>
                      <td>
                        {gianvl.giaVLSS.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Tiền Dao</td>
                      <td>
                        {gianvl.knife_cost.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Tiền film bản</td>
                      <td>
                        {gianvl.film_cost.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Tiền mực</td>
                      <td>
                        {gianvl.ink_cost.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Tiền nhân công</td>
                      <td>
                        {gianvl.labor_cost.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={cust_nhancong}
                          onChange={(e) => {
                            setCust_NhanCong(e.target.value);
                            handlesetCodeInfo(
                              "LABOR_UNIT",
                              (Number(e.target.value) / gianvl.mArea) * 1.0,
                            );
                          }}
                        ></input>
                      </td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Phí vận chuyển</td>
                      <td>
                        {gianvl.delivery_cost.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={cust_vanchuyen}
                          onChange={(e) => {
                            setCust_VanChuyen(e.target.value);
                            handlesetCodeInfo(
                              "DELIVERY_UNIT",
                              Number(e.target.value),
                            );
                          }}
                        ></input>
                      </td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Khấu hao máy</td>
                      <td>
                        {gianvl.deprecation_cost.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={cust_khauhao}
                          onChange={(e) => {
                            setCust_KhauHao(e.target.value);
                            handlesetCodeInfo(
                              "DEPRECATION_UNIT",
                              (Number(e.target.value) / gianvl.mArea) * 1.0,
                            );
                          }}
                        ></input>
                      </td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Phí quản lý chung</td>
                      <td>
                        {gianvl.gmanagement_cost.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={cust_quanlychung}
                          onChange={(e) => {
                            setCust_QuanLyChung(e.target.value);
                            handlesetCodeInfo(
                              "GMANAGEMENT_UNIT",
                              (Number(e.target.value) / gianvl.mArea) * 1.0,
                            );
                          }}
                        ></input>
                      </td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Tổng chi phí Nội Bộ</td>
                      <td>
                        {gianvl.totalcostCMS.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td></td>
                      <td>VND</td>
                    </tr>
                    <tr>
                      <td>Tổng chi phí OPEN</td>
                      <td>
                        {gianvl.totalcostSS.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td></td>
                      <td>VND</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="moqdiv">
                <label>
                  MOQ (EA):<br></br>
                  <input
                    type="text"
                    value={tempQTY}
                    onChange={(e) => {
                      setTempQty(Number(e.target.value));
                      setSalePriceNB(
                        tinhgia(selectedRows, listVL, Number(e.target.value))
                          .total_costCMS *
                        (1 + profit / 100),
                      );
                      setSalePriceOP(
                        tinhgia(selectedRows, listVL, Number(e.target.value))
                          .total_costSS *
                        (1 + profit / 100),
                      );
                      tinhgia(selectedRows, listVL, Number(e.target.value));
                    }}
                  ></input>
                </label>
                <label>
                  Lợi nhuận mong muốn (%):<br></br>
                  <input
                    type="text"
                    value={profit}
                    onChange={(e) => {
                      setProfit(Number(e.target.value));
                      setSalePriceNB(
                        tinhgia(selectedRows, listVL, tempQTY).total_costCMS *
                        (1 + Number(e.target.value) / 100),
                      );
                      setSalePriceOP(
                        tinhgia(selectedRows, listVL, tempQTY).total_costSS *
                        (1 + Number(e.target.value) / 100),
                      );
                    }}
                  ></input>
                </label>
                <label>
                  Giá bán Nội Bộ (MOA Nội Bộ):<br></br>
                  <input
                    type="text"
                    value={salePriceNB.toFixed(0)}
                    onChange={(e) => {
                      setSalePriceNB(Number(e.target.value));
                    }}
                  ></input>
                </label>
                <label>
                  Giá bán Open (MOA Open):<br></br>
                  <input
                    type="text"
                    value={salePriceOP.toFixed(0)}
                    onChange={(e) => {
                      setSalePriceOP(Number(e.target.value));
                    }}
                  ></input>
                </label>
                <label>
                  Giá bán 1EA: <br></br>
                  {(salePriceOP / tempQTY).toFixed(0)}
                </label>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    if (selectedRows.G_CODE !== "") {
                      addRowBG();
                      //console.log(banggia);
                    } else {
                      Swal.fire("Thông báo", "Chọn code bất kỳ !", "error");
                    }
                  }}
                >
                  <AiFillFolderAdd color="#69f542" size={15} />
                  Add to List
                </IconButton>
              </div>
              <div className="listbaogia">{banggiamoinhatAG}</div>
              <div className="buttondiv">
                <IconButton
                  className="buttonIcon"
                  onClick={async () => {
                    await uploadgia();
                    await updateCurrentUnit();
                    await loadListCode();
                  }}
                >
                  <BiSave color="#059B00" size={15} />
                  Lưu Giá
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CalcQuotation;

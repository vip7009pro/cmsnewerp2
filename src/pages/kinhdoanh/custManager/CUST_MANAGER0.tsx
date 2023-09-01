import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";

import moment from "moment";
import { useContext, useEffect, useState, useTransition } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel, checkBP } from "../../../api/GlobalFunction";
import "./CUST_MANAGER.scss";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { UserData } from "../../../api/GlobalInterface";

interface CUST_INFO {
  id: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  CUST_NAME: string;
  CUST_ADDR1: string;
  TAX_NO: string;
  CUST_NUMBER: string;
  BOSS_NAME: string;
  TEL_NO1: string;
  FAX_NO: string;
  CUST_POSTAL: string;
  REMK: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
const CUST_MANAGER = () => {
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    testinvoicetable: false,
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [isLoading, setisLoading] = useState(false);
  const [custinfodatatable, setCUSTINFODataTable] = useState<Array<any>>([]);
  const [cust_cd, setCust_Cd] = useState("0000");
  const [cust_name, setCustName] = useState("Seojin Vina");
  const [cust_name_kd, setCust_Name_KD] = useState("SEOJIN");
  const [edittable, setEditTable] = useState(true);

  const handleCUSTINFO = () => {
    setisLoading(true);
    generalQuery("get_listcustomer", {})
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CUST_INFO[] = response.data.data.map(
            (element: CUST_INFO, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setCUSTINFODataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
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

  const handle_addCustomer = () => {
    setisLoading(true);
    generalQuery("add_customer", {
      CUST_CD: cust_cd,
      CUST_NAME: cust_name,
      CUST_NAME_KD: cust_name_kd,
    })
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setisLoading(false);
          Swal.fire("Thông báo", "Thêm khách thành công", "success");
        } else {
          Swal.fire(
            "Thông báo",
            "Thêm khách thất bại: " + response.data.message,
            "error",
          );
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handle_editCustomer = () => {
    setisLoading(true);

    generalQuery("edit_customer", {
      CUST_CD: cust_cd,
      CUST_NAME: cust_name,
      CUST_NAME_KD: cust_name_kd,
    })
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setisLoading(false);
          Swal.fire("Thông báo", "Sửa khách thành công", "success");
        } else {
          Swal.fire(
            "Thông báo",
            "Sửa khách thất bại: " + response.data.message,
            "error",
          );
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleCUSTINFO();
  }, []);

  return (
    <div className="customermamanger">
      <span style={{ fontWeight: "bold", fontSize: 20, marginTop: 5 }}>
        Quản lý Khách Hàng
      </span>
      {selection.trapo && (
        <div className="tracuuFcst">
          <div className="tracuuFcstTable"></div>
          <div className="editcustomerform">
            <div className="formnho">
              <div className="dangkyform">
                <h3>Thêm - Sửa khách hàng</h3>
                <div className="dangkyinput">
                  <div className="dangkyinputbox">
                    <label>
                      <b>Mã khách hàng:</b>{" "}
                      <TextField
                        value={cust_cd}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setCust_Cd(e.target.value);
                        }}
                        size="small"
                        color="success"
                        className="autocomplete"
                        id="outlined-basic"
                        label="Số PO"
                        variant="outlined"
                      />
                    </label>
                    <label>
                      <b>Tên khách hàng (dài):</b>{" "}
                      <TextField
                        value={cust_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setCustName(e.target.value);
                        }}
                        size="small"
                        color="success"
                        className="autocomplete"
                        id="outlined-basic"
                        label="INVOICE QTY"
                        variant="outlined"
                      />
                    </label>
                    <label>
                      <b>Tên khách hàng (KD):</b>{" "}
                      <TextField
                        value={cust_name_kd}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setCust_Name_KD(e.target.value);
                        }}
                        size="small"
                        className="autocomplete"
                        id="outlined-basic"
                        label="Remark"
                        variant="outlined"
                      />
                    </label>
                  </div>
                </div>
                <div className="dangkybutton">
                  <button
                    className="thembutton"
                    onClick={() => {
                      checkBP(
                        userData,
                        ["RND"],
                        ["ALL"],
                        ["ALL"],
                        handle_addCustomer,
                      );

                      if (
                        userData?.EMPL_NO === "LVT1906" ||
                        userData?.EMPL_NO === "NHU1903"
                      ) {
                        handle_addCustomer();
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Chỉ leader kinh doanh mới tạo khách mới được",
                          "error",
                        );
                      }
                    }}
                  >
                    Thêm
                  </button>
                  <button
                    className="suabutton"
                    onClick={() => {
                      if (
                        userData?.EMPL_NO === "LVT1906" ||
                        userData?.EMPL_NO === "NHU1903"
                      ) {
                        handle_editCustomer();
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Chỉ leader kinh doanh mới sửa khách được",
                          "error",
                        );
                      }
                    }}
                  >
                    Sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CUST_MANAGER;

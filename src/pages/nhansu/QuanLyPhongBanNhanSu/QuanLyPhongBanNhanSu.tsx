import {
  DataGrid,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { generalQuery, getCompany, uploadQuery } from "../../../api/Api";
import "./QuanLyPhongBanNhanSu.scss";
import Swal from "sweetalert2";
import { SaveExcel, checkBP } from "../../../api/GlobalFunction";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { BiRefresh } from "react-icons/bi";
import {
  EmployeeTableData,
  MainDeptTableData,
  SubDeptTableData,
  UserData,
  WorkPositionTableData,
} from "../../../api/GlobalInterface";
import { changeUserData } from "../../../redux/slices/globalSlice";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IconButton } from "@mui/material";
import { getlang } from "../../../components/String/String";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
const QuanLyPhongBanNhanSu = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [isLoading, setisLoading] = useState(false);
  const [workpositionload, setWorkPositionLoad] = useState<
    Array<WorkPositionTableData>
  >([]);
  const [EMPL_NO, setEMPL_NO] = useState("");
  const [CMS_ID, setCMS_ID] = useState("");
  const [FIRST_NAME, setFIRST_NAME] = useState("");
  const [MIDLAST_NAME, setMIDLAST_NAME] = useState("");
  const [DOB, setDOB] = useState(moment().format("YYYY-MM-DD"));
  const [HOMETOWN, setHOMETOWN] = useState("");
  const [SEX_CODE, setSEX_CODE] = useState(0);
  const [ADD_PROVINCE, setADD_PROVINCE] = useState("");
  const [ADD_DISTRICT, setADD_DISTRICT] = useState("");
  const [ADD_COMMUNE, setADD_COMMUNE] = useState("");
  const [ADD_VILLAGE, setADD_VILLAGE] = useState("");
  const [PHONE_NUMBER, setPHONE_NUMBER] = useState("");
  const [WORK_START_DATE, setWORK_START_DATE] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [RESIGN_DATE, setRESIGN_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [PASSWORD, setPASSWORD] = useState("");
  const [EMAIL, setEMAIL] = useState("");
  const [WORK_POSITION_CODE, setWORK_POSITION_CODE] = useState(1);
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState(0);
  const [POSITION_CODE, setPOSITION_CODE] = useState(0);
  const [JOB_CODE, setJOB_CODE] = useState(1);
  const [FACTORY_CODE, setFACTORY_CODE] = useState(1);
  const [WORK_STATUS_CODE, setWORK_STATUS_CODE] = useState(0);
  const [EMPL_IMAGE, setEMPL_IMAGE] = useState('N');
  const [employeeTable, setEmployeeTable] = useState<Array<EmployeeTableData>>(
    []
  );
  const [maindeptTable, setMainDeptTable] = useState<Array<MainDeptTableData>>(
    []
  );
  const [maindeptDataFilter, setMainDeptDataFilter] = useState<
    Array<MainDeptTableData>
  >([]);
  const [maindeptcode, setMainDeptCode] = useState(1);
  const [maindeptname, setMainDeptName] = useState("");
  const [maindeptnamekr, setMainDeptNameKR] = useState("");
  const [subdeptcode, setSubDeptCode] = useState(1);
  const [subdeptname, setSubDeptName] = useState("");
  const [subdeptnamekr, setSubDeptNameKR] = useState("");
  const [workpositioncode, setWorkPositionCode] = useState(1);
  const [workpositionname, setWorkPositionName] = useState("");
  const [workpositionnamekr, setWorkPositionNameKR] = useState("");
  const [att_group_code, setATT_GROUP_CODE] = useState(1);
  const [avatar, setAvatar] = useState("");
  const [enableEdit, setEnableEdit] = useState(false);
  const [NV_CCID, setNV_CCID] = useState(0);
  const [resigned_check, setResignedCheck] = useState(true);
  const [file, setFile] = useState<any>(null);
  const dispatch = useDispatch();
  const uploadFile2 = async (empl_no: string) => {
    if (file !== null && file !== undefined) {
      if (EMPL_NO !== "") {
        uploadQuery(file, "NS_" + empl_no + ".jpg", "Picture_NS")
          .then((response) => {
            console.log("resopone upload:", response.data);
            if (response.data.tk_status !== "NG") {
              generalQuery("update_empl_image", {
                EMPL_NO: empl_no,
                EMPL_IMAGE: "Y",
              })
                .then((response) => {
                  if (response.data.tk_status !== "NG") {
                    dispatch(changeUserData({ ...userData, EMPL_IMAGE: "Y" }));
                    Swal.fire("Thông báo", "Upload avatar thành công", "success");
                  } else {
                    Swal.fire("Thông báo", "Upload avatar thất bại", "error");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              Swal.fire(
                "Thông báo",
                "Upload file thất bại:" + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      else {
        Swal.fire('Thông báo', 'Chọn nhân viên trước', 'error');
      }
    }
    else {
      Swal.fire('Thông báo', 'Chọn file trước', 'error');
    }
  };
  const handle_them_maindept = () => {
    const insertData = {
      CTR_CD: "002",
      MAINDEPTCODE: maindeptcode,
      MAINDEPTNAME: maindeptname,
      MAINDEPTNAME_KR: maindeptnamekr,
    };
    generalQuery("insertmaindept", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
          generalQuery("getmaindept", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setMainDeptTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Thêm thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_sua_maindept = () => {
    const insertData = {
      CTR_CD: "002",
      MAINDEPTCODE: maindeptcode,
      MAINDEPTNAME: maindeptname,
      MAINDEPTNAME_KR: maindeptnamekr,
    };
    generalQuery("updatemaindept", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
          generalQuery("getmaindept", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setMainDeptTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Sửa thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_xoa_maindept = () => {
    const insertData = {
      CTR_CD: "002",
      MAINDEPTCODE: maindeptcode,
      MAINDEPTNAME: maindeptname,
      MAINDEPTNAME_KR: maindeptnamekr,
    };
    generalQuery("deletemaindept", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, xoá thành công !", "success");
          generalQuery("getmaindept", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setMainDeptTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Xoá thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_them_subdept = () => {
    const insertData = {
      CTR_CD: "002",
      MAINDEPTCODE: maindeptcode,
      SUBDEPTCODE: subdeptcode,
      SUBDEPTNAME: subdeptname,
      SUBDEPTNAME_KR: subdeptnamekr,
    };
    generalQuery("insertsubdept", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
          generalQuery("getsubdept", { MAINDEPTCODE: maindeptcode })
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setSubDeptTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Thêm thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_sua_subdept = () => {
    const insertData = {
      CTR_CD: "002",
      MAINDEPTCODE: maindeptcode,
      SUBDEPTCODE: subdeptcode,
      SUBDEPTNAME: subdeptname,
      SUBDEPTNAME_KR: subdeptnamekr,
    };
    generalQuery("updatesubdept", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
          generalQuery("getsubdept", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setSubDeptTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Sửa thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_xoa_subdept = () => {
    const insertData = {
      CTR_CD: "002",
      MAINDEPTCODE: maindeptcode,
      SUBDEPTCODE: subdeptcode,
      SUBDEPTNAME: subdeptname,
      SUBDEPTNAME_KR: subdeptnamekr,
    };
    generalQuery("deletesubdept", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, xoá thành công !", "success");
          generalQuery("getsubdept", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setSubDeptTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Xoá thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_them_workposition = () => {
    const insertData = {
      CTR_CD: "002",
      SUBDEPTCODE: subdeptcode,
      WORK_POSITION_CODE: workpositioncode,
      WORK_POSITION_NAME: workpositionname,
      WORK_POSITION_NAME_KR: workpositionnamekr,
      ATT_GROUP_CODE: att_group_code,
    };
    generalQuery("insertworkposition", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
          generalQuery("getworkposition", { SUBDEPTCODE: subdeptcode })
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setWorkPositionTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Thêm thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_sua_workposition = () => {
    const insertData = {
      CTR_CD: "002",
      SUBDEPTCODE: subdeptcode,
      WORK_POSITION_CODE: workpositioncode,
      WORK_POSITION_NAME: workpositionname,
      WORK_POSITION_NAME_KR: workpositionnamekr,
      ATT_GROUP_CODE: att_group_code,
    };
    generalQuery("updateworkposition", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
          generalQuery("getworkposition", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setWorkPositionTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Sửa thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_xoa_workposition = () => {
    const insertData = {
      CTR_CD: "002",
      SUBDEPTCODE: subdeptcode,
      WORK_POSITION_CODE: workpositioncode,
      WORK_POSITION_NAME: workpositionname,
      WORK_POSITION_NAME_KR: workpositionnamekr,
      ATT_GROUP_CODE: att_group_code,
    };
    generalQuery("deleteworkposition", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, xoá thành công !", "success");
          generalQuery("getworkposition", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setSubDeptTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Xoá thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_them_employee = () => {
    const insertData = {
      NV_CCID: NV_CCID,
      EMPL_NO: EMPL_NO,
      CMS_ID: CMS_ID,
      FIRST_NAME: FIRST_NAME,
      MIDLAST_NAME: MIDLAST_NAME,
      DOB: DOB.slice(0, 10),
      HOMETOWN: HOMETOWN,
      SEX_CODE: SEX_CODE,
      ADD_PROVINCE: ADD_PROVINCE,
      ADD_DISTRICT: ADD_DISTRICT,
      ADD_COMMUNE: ADD_COMMUNE,
      ADD_VILLAGE: ADD_VILLAGE,
      PHONE_NUMBER: PHONE_NUMBER,
      WORK_START_DATE: WORK_START_DATE.slice(0, 10),
      PASSWORD: PASSWORD,
      EMAIL: EMAIL,
      WORK_POSITION_CODE: WORK_POSITION_CODE,
      WORK_SHIFT_CODE: WORK_SHIFT_CODE,
      POSITION_CODE: POSITION_CODE,
      JOB_CODE: JOB_CODE,
      FACTORY_CODE: FACTORY_CODE,
      WORK_STATUS_CODE: WORK_STATUS_CODE,
    };
    console.log(insertData);
    generalQuery("insertemployee", insertData)
      .then((response) => {
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
          generalQuery("getemployee_full", {})
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setEmployeeTable(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Thêm thất bại ! " + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_sua_employee = () => {
    const insertData = {
      NV_CCID: NV_CCID,
      EMPL_NO: EMPL_NO,
      CMS_ID: CMS_ID,
      FIRST_NAME: FIRST_NAME,
      MIDLAST_NAME: MIDLAST_NAME,
      DOB: DOB.slice(0, 10),
      HOMETOWN: HOMETOWN,
      SEX_CODE: SEX_CODE,
      ADD_PROVINCE: ADD_PROVINCE,
      ADD_DISTRICT: ADD_DISTRICT,
      ADD_COMMUNE: ADD_COMMUNE,
      ADD_VILLAGE: ADD_VILLAGE,
      PHONE_NUMBER: PHONE_NUMBER,
      WORK_START_DATE: WORK_START_DATE.slice(0, 10),
      PASSWORD: PASSWORD,
      EMAIL: EMAIL,
      WORK_POSITION_CODE: WORK_POSITION_CODE,
      WORK_SHIFT_CODE: WORK_SHIFT_CODE,
      POSITION_CODE: POSITION_CODE,
      JOB_CODE: JOB_CODE,
      FACTORY_CODE: FACTORY_CODE,
      WORK_STATUS_CODE: WORK_STATUS_CODE,
      RESIGN_DATE: RESIGN_DATE,
    };
    generalQuery("updateemployee", insertData)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status === "OK") {
          Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
          generalQuery("getemployee_full", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                console.log(response.data.data);
                setEmployeeTable(response.data.data);
                generalQuery("updateM010", insertData)
                  .then((response) => {
                    //console.log(response.data.data);
                    if (response.data.tk_status === "OK") {
                    } else {
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Sửa thất bại !" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_xoa_employee = () => {
    setEMPL_NO("");
    setCMS_ID("");
    setFIRST_NAME("");
    setMIDLAST_NAME("");
    setDOB("");
    setHOMETOWN("");
    setADD_PROVINCE("");
    setADD_DISTRICT("");
    setADD_COMMUNE("");
    setADD_VILLAGE("");
    setPHONE_NUMBER("");
    setWORK_START_DATE("");
    setRESIGN_DATE("");
    setPASSWORD("");
    setEMAIL("");
    setSEX_CODE(0);
    setWORK_STATUS_CODE(1);
    setFACTORY_CODE(1);
    setJOB_CODE(1);
    setPOSITION_CODE(1);
    setWORK_SHIFT_CODE(1);
    setWORK_POSITION_CODE(1);
    setATT_GROUP_CODE(1);
  };
  const [subdeptTable, setSubDeptTable] = useState<Array<SubDeptTableData>>([]);
  const [subdeptDataFilter, setSubDeptDataFilter] = useState<
    Array<SubDeptTableData>
  >([]);
  const [workpositionTable, setWorkPositionTable] = useState<
    Array<WorkPositionTableData>
  >([]);
  const [workpositionDataFilter, setWorkPositionDataFilter] = useState<
    Array<WorkPositionTableData>
  >([]);
  const columns_maindept = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "CTR_CD", headerName: "CTR_CD", width: 70 },
    { field: "MAINDEPTCODE", headerName: "MAINDEPTCODE", width: 170 },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 130 },
    { field: "MAINDEPTNAME_KR", headerName: "MAINDEPTNAME_KR", width: 170 },
  ];
  const columns_subdept = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "CTR_CD", headerName: "CTR_CD", width: 70 },
    { field: "MAINDEPTCODE", headerName: "MAINDEPTCODE", width: 170 },
    { field: "SUBDEPTCODE", headerName: "SUBDEPTCODE", width: 170 },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 130 },
    { field: "SUBDEPTNAME_KR", headerName: "SUBDEPTNAME_KR", width: 170 },
  ];
  const columns_work_position = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "CTR_CD", headerName: "CTR_CD", width: 70 },
    { field: "SUBDEPTCODE", headerName: "SUBDEPTCODE", width: 170 },
    {
      field: "WORK_POSITION_CODE",
      headerName: "WORK_POSITION_CODE",
      width: 170,
    },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 130,
    },
    {
      field: "WORK_POSITION_NAME_KR",
      headerName: "WORK_POSITION_NAME_KR",
      width: 170,
    },
    { field: "ATT_GROUP_CODE", headerName: "ATT_GROUP_CODE", width: 170 },
  ];
  const columns_employee_table = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120, resizable: true, headerClassName: 'super-app-theme--header', },
    { field: "CMS_ID", headerName: "NS_ID", width: 120, headerClassName: 'super-app-theme--header', },
    {
      field: "NV_CCID",
      headerName: "NV_CCID",
      width: 120,
      renderCell: (params: any) => {
        return <span>{zeroPad(params.row.NV_CCID, 6)}</span>;
      }, headerClassName: 'super-app-theme--header',
    },
    { field: "FULL_NAME", headerName: "FULL_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    {
      field: "DOB",
      headerName: "DOB",
      width: 100, headerClassName: 'super-app-theme--header',
    },
    { field: "HOMETOWN", headerName: "HOMETOWN", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "ADD_PROVINCE", headerName: "ADD_PROVINCE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "ADD_DISTRICT", headerName: "ADD_DISTRICT", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "ADD_COMMUNE", headerName: "ADD_COMMUNE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "ADD_VILLAGE", headerName: "ADD_VILLAGE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 100, headerClassName: 'super-app-theme--header', },
    {
      field: "WORK_START_DATE",
      headerName: "WORK_START_DATE",
      width: 100, headerClassName: 'super-app-theme--header',
    },
    /*  { field: "PASSWORD", headerName: "PASSWORD", width: 100},   */
    { field: "EMAIL", headerName: "EMAIL", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "REMARK", headerName: "REMARK", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "ONLINE_DATETIME", headerName: "ONLINE_DATETIME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "CTR_CD", headerName: "CTR_CD", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "SEX_CODE", headerName: "SEX_CODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "SEX_NAME_KR", headerName: "SEX_NAME_KR", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "WORK_STATUS_CODE", headerName: "WORK_STATUS_CODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    {
      field: "WORK_STATUS_NAME_KR",
      headerName: "WORK_STATUS_NAME_KR",
      width: 100, headerClassName: 'super-app-theme--header',
    },
    { field: "FACTORY_CODE", headerName: "FACTORY_CODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "FACTORY_NAME_KR", headerName: "FACTORY_NAME_KR", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "JOB_CODE", headerName: "JOB_CODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "JOB_NAME_KR", headerName: "JOB_NAME_KR", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "POSITION_CODE", headerName: "POSITION_CODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "POSITION_NAME", headerName: "POSITION_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "POSITION_NAME_KR", headerName: "POSITION_NAME_KR", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "WORK_SHIFT_CODE", headerName: "WORK_SHIFT_CODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "WORK_SHIF_NAME_KR", headerName: "WORK_SHIF_NAME_KR", width: 100, headerClassName: 'super-app-theme--header', },
    {
      field: "WORK_POSITION_CODE",
      headerName: "WORK_POSITION_CODE",
      width: 100, headerClassName: 'super-app-theme--header',
    },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 100, headerClassName: 'super-app-theme--header',
    },
    {
      field: "WORK_POSITION_NAME_KR",
      headerName: "WORK_POSITION_NAME_KR",
      width: 100, headerClassName: 'super-app-theme--header',
    },
    { field: "ATT_GROUP_CODE", headerName: "ATT_GROUP_CODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "SUBDEPTCODE", headerName: "SUBDEPTCODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "SUBDEPTNAME_KR", headerName: "SUBDEPTNAME_KR", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "MAINDEPTCODE", headerName: "MAINDEPTCODE", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 100, headerClassName: 'super-app-theme--header', },
    { field: "MAINDEPTNAME_KR", headerName: "MAINDEPTNAME_KR", width: 100, headerClassName: 'super-app-theme--header', },
  ];
  const handleMainDeptSelection = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    var datafilter = maindeptTable.filter((element: any) =>
      selectedID.has(element.id)
    );
    if (datafilter.length > 0) {
      setMainDeptCode(datafilter[datafilter.length - 1].MAINDEPTCODE);
      setMainDeptName(datafilter[datafilter.length - 1].MAINDEPTNAME);
      setMainDeptNameKR(datafilter[datafilter.length - 1].MAINDEPTNAME_KR);
      generalQuery("getsubdept", {
        MAINDEPTCODE: datafilter[datafilter.length - 1].MAINDEPTCODE,
      })
        .then((response) => {
          if (response.data.tk_status === "OK") {
            console.log(response.data.data);
            setSubDeptTable(response.data.data);
          }
          else {
            setSubDeptTable([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setMainDeptDataFilter(datafilter);
    //console.log(datafilter);
  };
  const handlesubDeptSelection = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    var datafilter = subdeptTable.filter((element: any) =>
      selectedID.has(element.id)
    );
    if (datafilter.length > 0) {
      setSubDeptCode(datafilter[datafilter.length - 1].SUBDEPTCODE);
      setSubDeptName(datafilter[datafilter.length - 1].SUBDEPTNAME);
      setSubDeptNameKR(datafilter[datafilter.length - 1].SUBDEPTNAME_KR);
      generalQuery("getworkposition", {
        SUBDEPTCODE: datafilter[datafilter.length - 1].SUBDEPTCODE,
      })
        .then((response) => {
          if (response.data.tk_status === "OK") {
            console.log(response.data.data);
            setWorkPositionTable(response.data.data);
          }
          else {
            setWorkPositionTable([]);
          }
          setWorkPositionCode(0);
          setWorkPositionName("");
          setWorkPositionNameKR("");
          setATT_GROUP_CODE(0);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setSubDeptDataFilter(datafilter);
    //console.log(datafilter);
  };
  const handleworkPositionSelection = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    var datafilter = workpositionTable.filter((element: any) =>
      selectedID.has(element.id)
    );
    if (datafilter.length > 0) {
      setWorkPositionCode(datafilter[datafilter.length - 1].WORK_POSITION_CODE);
      setWorkPositionName(datafilter[datafilter.length - 1].WORK_POSITION_NAME);
      setWorkPositionNameKR(
        datafilter[datafilter.length - 1].WORK_POSITION_NAME_KR
      );
      setATT_GROUP_CODE(datafilter[datafilter.length - 1].ATT_GROUP_CODE);
    }
    setWorkPositionDataFilter(datafilter);
    //console.log(datafilter);
  };
  const handleEmployeeSelection = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    var datafilter = employeeTable.filter((element: any) =>
      selectedID.has(element.id)
    );
    if (datafilter.length > 0) {
      setEMPL_NO(datafilter[datafilter.length - 1].EMPL_NO);
      setCMS_ID(datafilter[datafilter.length - 1].CMS_ID);
      setFIRST_NAME(datafilter[datafilter.length - 1].FIRST_NAME);
      setMIDLAST_NAME(datafilter[datafilter.length - 1].MIDLAST_NAME);
      setDOB(datafilter[datafilter.length - 1].DOB);
      setHOMETOWN(datafilter[datafilter.length - 1].HOMETOWN);
      setADD_PROVINCE(datafilter[datafilter.length - 1].ADD_PROVINCE);
      setADD_DISTRICT(datafilter[datafilter.length - 1].ADD_DISTRICT);
      setADD_COMMUNE(datafilter[datafilter.length - 1].ADD_COMMUNE);
      setADD_VILLAGE(datafilter[datafilter.length - 1].ADD_VILLAGE);
      setPHONE_NUMBER(datafilter[datafilter.length - 1].PHONE_NUMBER);
      setWORK_START_DATE(datafilter[datafilter.length - 1].WORK_START_DATE);
      setPASSWORD(datafilter[datafilter.length - 1].PASSWORD);
      setEMAIL(datafilter[datafilter.length - 1].EMAIL);
      setSEX_CODE(datafilter[datafilter.length - 1].SEX_CODE);
      setWORK_STATUS_CODE(datafilter[datafilter.length - 1].WORK_STATUS_CODE);
      setFACTORY_CODE(datafilter[datafilter.length - 1].FACTORY_CODE);
      setJOB_CODE(datafilter[datafilter.length - 1].JOB_CODE);
      setPOSITION_CODE(datafilter[datafilter.length - 1].POSITION_CODE);
      setWORK_SHIFT_CODE(datafilter[datafilter.length - 1].WORK_SHIFT_CODE);
      setWORK_POSITION_CODE(
        datafilter[datafilter.length - 1].WORK_POSITION_CODE
      );
      setATT_GROUP_CODE(datafilter[datafilter.length - 1].ATT_GROUP_CODE);
      setAvatar(datafilter[datafilter.length - 1].EMPL_NO);
      setNV_CCID(datafilter[datafilter.length - 1].NV_CCID);
      setEMPL_IMAGE(datafilter[datafilter.length - 1].EMPL_IMAGE);
    }
    //console.log(datafilter);
  };
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarQuickFilter />
        <button
          className='saveexcelbutton'
          onClick={() => {
            SaveExcel(
              employeeTable.map((element: EmployeeTableData, index: number) => {
                return {
                  ...element,
                  NV_CCID_TEXT: zeroPad(element.NV_CCID, 6),
                  PASSWORD: "xxx",
                };
              }),
              "DanhSachNhanVien"
            );
          }}
        >
          Save Excel
        </button>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            loademployeefull();
          }}
        >
          <BiRefresh color='green' size={15} />
          Search
        </IconButton>
        <label>
          <b>Trừ người đã nghỉ_</b>
          <input
            type='checkbox'
            name='alltimecheckbox'
            defaultChecked={resigned_check}
            onChange={() => setResignedCheck(!resigned_check)}
          ></input>
        </label>
      </GridToolbarContainer>
    );
  }
  const zeroPad = (num: number, places: number) =>
    String(num).padStart(places, "0");
  const loademployeefull = () => {
    generalQuery("getemployee_full", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: EmployeeTableData[] = response.data.data.map(
            (element: EmployeeTableData, index: number) => {
              return {
                ...element,
                DOB: element.DOB !== null ? moment.utc(element.DOB).format('YYYY-MM-DD') : '',
                WORK_START_DATE: element.WORK_START_DATE !== null ? moment.utc(element.WORK_START_DATE).format('YYYY-MM-DD') : '',
                RESIGN_DATE: element.RESIGN_DATE !== null ? moment.utc(element.RESIGN_DATE).format('YYYY-MM-DD') : '',
                ONLINE_DATETIME: element.ONLINE_DATETIME !== null ? moment.utc(element.ONLINE_DATETIME).format('YYYY-MM-DD HH:mm:ss') : '',
                FULL_NAME: element.MIDLAST_NAME + " " + element.FIRST_NAME,
              };
            }
          );
          setEmployeeTable(loaded_data);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    setisLoading(true);
    generalQuery("getmaindept", {})
      .then((response) => {
        //console.log(response.data.data);
        setMainDeptTable(response.data.data);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("workpositionlist", {})
      .then((response) => {
        //console.log(response.data.data);
        setWorkPositionLoad(response.data.data);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    loademployeefull();
  }, []);
  return (
    (<div className='quanlyphongbannhansu'>
      <Tabs className="tabs" style={{
        fontSize: "0.6rem",
        width: "100%",
      }}>
        <TabList className="tablist" style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundImage: theme.CMS.backgroundImage,
          justifyContent: "left",
        }}>
          <Tab>
            <span className="mininavtext">Quản lý Nhân Sự</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Quản Lý Phòng Ban</span>
          </Tab>
        </TabList>
        <TabPanel>
          <div className='quanlynhansu'>
            <div className='maindept'>
              <h3>{getlang("thongtinnhanvien", glbLang!)}</h3>
              <div className='maindeptform'>
                <div className='inputform'>
                  <div className='emplpicture'>
                    {
                      EMPL_IMAGE === 'Y' &&
                      <img
                        width={220}
                        height={300}
                        src={"/Picture_NS/NS_" + avatar + ".jpg"}
                        alt={avatar}
                      ></img>
                    }
                    {
                      EMPL_IMAGE !== 'Y' &&
                      <img
                        width={220}
                        height={300}
                        src={"/noimage.webp"}
                        alt={avatar}
                      ></img>
                    }
                    <div className="uploadavatardiv">
                      Change Avatar:
                      <input
                        accept='.jpg'
                        type='file'
                        onChange={(e: any) => {
                          setFile(e.target.files[0]);
                          console.log(e.target.files[0]);
                        }}
                      />
                      <IconButton className='buttonIcon' onClick={() => {
                        checkBP(userData, ['NHANSU'], ['ALL'], ['ALL'], async () => {
                          uploadFile2(EMPL_NO)
                        })
                      }}>
                        <AiOutlineCloudUpload color='yellow' size={15} />
                        Upload
                      </IconButton>
                    </div>
                  </div>
                  <div className='maindeptinput'>
                    <div className='maindeptinputbox'>
                      <label>
                        {getlang("maerp", glbLang!)}{" "}
                        <input
                          disabled={enableEdit}
                          type='text'
                          value={EMPL_NO}
                          onChange={(e) => setEMPL_NO(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("manhansu", glbLang!)}{" "}
                        <input
                          disabled={enableEdit}
                          type='text'
                          value={CMS_ID}
                          onChange={(e) => setCMS_ID(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("machamcong", glbLang!)}
                        <input
                          name='gioitinh'
                          value={NV_CCID}
                          onChange={(e) => setNV_CCID(Number(e.target.value))}
                        ></input>
                      </label>
                      <label>
                        {getlang("ten", glbLang!)}{" "}
                        <input
                          disabled={enableEdit}
                          type='text'
                          value={FIRST_NAME}
                          onChange={(e) => setFIRST_NAME(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("hovadem", glbLang!)}
                        <input
                          disabled={enableEdit}
                          type='text'
                          value={MIDLAST_NAME}
                          onChange={(e) => setMIDLAST_NAME(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("ngaythangnamsinh", glbLang!)}
                        <input
                          type='date'
                          value={DOB.slice(0, 10)}
                          onChange={(e) => setDOB(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("quequan", glbLang!)}
                        <input
                          type='text'
                          value={HOMETOWN}
                          onChange={(e) => setHOMETOWN(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("gioitinh", glbLang!)}
                        <select
                          name='gioitinh'
                          value={SEX_CODE}
                          onChange={(e) => setSEX_CODE(Number(e.target.value))}
                        >
                          <option value={0}>Nữ</option>
                          <option value={1}>Nam</option>
                        </select>
                      </label>
                    </div>
                    <div className='maindeptinputbox'>
                      <label>
                        {getlang("tinhthanhpho", glbLang!)}
                        <input
                          type='text'
                          value={ADD_PROVINCE}
                          onChange={(e) => setADD_PROVINCE(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("quanhuyen", glbLang!)}
                        <input
                          type='text'
                          value={ADD_DISTRICT}
                          onChange={(e) => setADD_DISTRICT(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("xathitran", glbLang!)}
                        <input
                          type='text'
                          value={ADD_COMMUNE}
                          onChange={(e) => setADD_COMMUNE(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("thonxom", glbLang!)}
                        <input
                          type='text'
                          value={ADD_VILLAGE}
                          onChange={(e) => setADD_VILLAGE(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("sodienthoai", glbLang!)}
                        <input
                          type='text'
                          value={PHONE_NUMBER}
                          onChange={(e) => setPHONE_NUMBER(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("ngaybatdaulamviec", glbLang!)}
                        <input
                          type='date'
                          value={WORK_START_DATE.slice(0, 10)}
                          onChange={(e) => setWORK_START_DATE(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("ngaynghiviec", glbLang!)}
                        <input
                          disabled={WORK_STATUS_CODE !== 0}
                          type='date'
                          value={RESIGN_DATE.slice(0, 10)}
                          onChange={(e) => setRESIGN_DATE(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("password", glbLang!)}
                        <input
                          type='password'
                          value={PASSWORD}
                          onChange={(e) => setPASSWORD(e.target.value)}
                        ></input>
                      </label>
                    </div>
                    <div className='maindeptinputbox'>
                      <label>
                        {getlang("email", glbLang!)}
                        <input
                          type='text'
                          value={EMAIL}
                          onChange={(e) => setEMAIL(e.target.value)}
                        ></input>
                      </label>
                      <label>
                        {getlang("vitrilamviec", glbLang!)}
                        <select
                          name='vitrilamviec'
                          value={WORK_POSITION_CODE}
                          onChange={(e) => {
                            setWORK_POSITION_CODE(Number(e.target.value));
                          }}
                        >
                          {workpositionload.map((element, index) => (
                            <option
                              key={index}
                              value={element.WORK_POSITION_CODE}
                            >
                              {element.WORK_POSITION_NAME}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {getlang("teamlamviec", glbLang!)}
                        <select
                          name='calamviec'
                          value={WORK_SHIFT_CODE}
                          onChange={(e) =>
                            setWORK_SHIFT_CODE(Number(e.target.value))
                          }
                        >
                          <option value={0}>Hành chính</option>
                          <option value={1}>TEAM 1</option>
                          <option value={2}>TEAM 2</option>
                          {/* <option value={3}>TEAM 12T</option> */}
                        </select>
                      </label>
                      <label>
                        {getlang("capbac", glbLang!)}
                        <select
                          name='chucdanh'
                          value={POSITION_CODE}
                          onChange={(e) =>
                            setPOSITION_CODE(Number(e.target.value))
                          }
                        >
                          <option value={0}>Manager</option>
                          <option value={1}>AM</option>
                          <option value={2}>Senior</option>
                          <option value={3}>Staff</option>
                          <option value={4}>No Pos</option>
                        </select>
                      </label>
                      <label>
                        {getlang("chucvu", glbLang!)}
                        <select
                          name='chucvu'
                          value={JOB_CODE}
                          onChange={(e) => setJOB_CODE(Number(e.target.value))}
                        >
                          <option value={1}>Dept Staff</option>
                          <option value={2}>Leader</option>
                          <option value={3}>Sub Leader</option>
                          <option value={4}>Worker</option>
                        </select>
                      </label>
                      <label>
                        {getlang("nhamay", glbLang!)}
                        <select
                          name='nhamay'
                          value={FACTORY_CODE}
                          onChange={(e) =>
                            setFACTORY_CODE(Number(e.target.value))
                          }
                        >
                          <option value={1}>Nhà máy 1</option>
                          <option value={2}>Nhà máy 2</option>
                        </select>
                      </label>
                      <label>
                        {getlang("trangthailamviec", glbLang!)}
                        <select
                          name='trangthailamviec'
                          value={WORK_STATUS_CODE}
                          onChange={(e) =>
                            setWORK_STATUS_CODE(Number(e.target.value))
                          }
                        >
                          <option value={0}>Đã nghỉ</option>
                          <option value={1}>Đang làm</option>
                          <option value={2}>Nghỉ sinh</option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className='maindeptbutton'>
                    <button
                      className='thembutton'
                      onClick={() => {
                        if (getCompany() !== "CMS") {
                          checkBP(
                            userData,
                            ["NHANSU"],
                            ["ALL"],
                            ["ALL"],
                            handle_them_employee
                          );
                        } else {
                          handle_them_employee();
                        }
                      }}
                    >
                      {getlang("them", glbLang!)}
                    </button>
                    <button
                      className='suabutton'
                      onClick={() => {
                        if (getCompany() !== "CMS") {
                          checkBP(
                            userData,
                            ["NHANSU"],
                            ["ALL"],
                            ["ALL"],
                            handle_sua_employee
                          );
                        } else {
                          handle_sua_employee();
                        }
                      }}
                    >
                      {getlang("update", glbLang!)}
                    </button>
                    <button
                      className='xoabutton'
                      onClick={() => {
                        if (getCompany() !== "CMS") {
                          checkBP(
                            userData,
                            ["NHANSU"],
                            ["ALL"],
                            ["ALL"],
                            handle_xoa_employee
                          );
                        } else {
                          handle_xoa_employee();
                        }
                      }}
                    >
                      {getlang("clear", glbLang!)}
                    </button>
                  </div>
                </div>
              </div>
              <div className='maindept_table'>
                <DataGrid
                  sx={{
                    fontSize: "0.7rem", '& .super-app-theme--header': {
                      backgroundColor: 'rgb(7, 180, 85)',
                      fontSize: '0.8rem',
                      color: 'white'
                    },
                  }}
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                  columnHeaderHeight={20}
                  density="compact"
                  keepNonExistentRowsSelected={false}
                  loading={isLoading}
                  rowHeight={35}
                  rows={
                    resigned_check
                      ? employeeTable.filter(
                        (ele: EmployeeTableData, index: number) =>
                          ele.WORK_STATUS_CODE !== 0
                      )
                      : employeeTable
                  }
                  columns={columns_employee_table}
                  pageSizeOptions={[5, 10, 50, 100, 500]}
                  editMode='row'
                  onRowSelectionModelChange={(ids) => {
                    handleEmployeeSelection(ids);
                  }}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className='quanlyphongban'>
            <div className='maindept'>
              <div className='maindept_table'>
                <DataGrid
                  sx={{ fontSize: "0.7rem" }}
                  rowHeight={25}
                  rows={maindeptTable}
                  columns={columns_maindept}
                  pageSizeOptions={[5, 10, 50, 100]}
                  /* checkboxSelection */
                  onRowSelectionModelChange={(ids) => {
                    handleMainDeptSelection(ids);
                  }}
                />
              </div>
              <div className='maindeptform'>
                <div className='maindeptinput'>
                  <div className='maindeptinputlabel'>
                    MAIN DEPT CODE:<br></br>
                    <br></br>
                    MAIN DEPT NAME:<br></br>
                    <br></br>
                    MAIN DEPT NAME KR:
                  </div>
                  <div className='maindeptinputbox'>
                    <input
                      type='text'
                      value={maindeptcode}
                      onChange={(e) => setMainDeptCode(Number(e.target.value))}
                    ></input>
                    <input
                      type='text'
                      value={maindeptname}
                      onChange={(e) => setMainDeptName(e.target.value)}
                    ></input>
                    <input
                      type='text'
                      value={maindeptnamekr}
                      onChange={(e) => setMainDeptNameKR(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className='maindeptbutton'>
                  <button
                    className='thembutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_them_maindept
                        );
                      } else {
                        handle_them_maindept();
                      }
                    }}
                  >
                    {getlang("them", glbLang!)}
                  </button>
                  <button
                    className='suabutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_sua_maindept
                        );
                      } else {
                        handle_sua_maindept();
                      }
                    }}
                  >
                    {getlang("update", glbLang!)}
                  </button>
                  <button
                    className='xoabutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_xoa_maindept
                        );
                      } else {
                        handle_xoa_maindept();
                      }
                    }}
                  >
                    {getlang("clear", glbLang!)}
                  </button>
                </div>
              </div>
            </div>
            <div className='subdept'>
              <div className='subdept_table'>
                <DataGrid
                  sx={{ fontSize: "0.7rem" }}
                  rowHeight={25}
                  rows={subdeptTable}
                  columns={columns_subdept}
                  pageSizeOptions={[5, 10, 50, 100]}
                  /* checkboxSelection */
                  onRowSelectionModelChange={(ids) => {
                    handlesubDeptSelection(ids);
                  }}
                />
              </div>
              <div className='subdeptform'>
                <div className='subdeptinput'>
                  <div className='subdeptinputlabel'>
                    SUB DEPT CODE:<br></br>
                    <br></br>
                    SUB DEPT NAME:<br></br>
                    <br></br>
                    SUB DEPT NAME KR:
                  </div>
                  <div className='subdeptinputbox'>
                    <input
                      type='text'
                      value={subdeptcode}
                      onChange={(e) => setSubDeptCode(Number(e.target.value))}
                    ></input>
                    <input
                      type='text'
                      value={subdeptname}
                      onChange={(e) => setSubDeptName(e.target.value)}
                    ></input>
                    <input
                      type='text'
                      value={subdeptnamekr}
                      onChange={(e) => setSubDeptNameKR(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className='subdeptbutton'>
                  <button
                    className='thembutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_them_subdept
                        );
                      } else {
                        handle_them_subdept();
                      }
                    }}
                  >
                    {getlang("them", glbLang!)}
                  </button>
                  <button
                    className='suabutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_sua_subdept
                        );
                      } else {
                        handle_sua_subdept();
                      }
                    }}
                  >
                    {getlang("update", glbLang!)}
                  </button>
                  <button
                    className='xoabutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_xoa_subdept
                        );
                      } else {
                        handle_xoa_subdept();
                      }
                    }}
                  >
                    {getlang("clear", glbLang!)}
                  </button>
                </div>
              </div>
            </div>
            <div className='workposition'>
              <div className='workposition_table'>
                <DataGrid
                  sx={{ fontSize: "0.7rem" }}
                  rowHeight={25}
                  rows={workpositionTable}
                  columns={columns_work_position}
                  pageSizeOptions={[5, 10, 50, 100]}
                  /* checkboxSelection */
                  onRowSelectionModelChange={(ids) => {
                    handleworkPositionSelection(ids);
                  }}
                />
              </div>
              <div className='workpositionform'>
                <div className='workpositioninput'>
                  <div className='workpositioninputlabel'>
                    WORK POSITION CODE:<br></br>
                    <br></br>
                    WORK POSITION NAME:<br></br>
                    <br></br>
                    WORK POSITION NAME KR: <br></br>
                    <br></br>
                    ATT GROUP CODE:
                  </div>
                  <div className='workpositioninputbox'>
                    <input
                      type='text'
                      value={workpositioncode}
                      onChange={(e) =>
                        setWorkPositionCode(Number(e.target.value))
                      }
                    ></input>
                    <input
                      type='text'
                      value={workpositionname}
                      onChange={(e) => setWorkPositionName(e.target.value)}
                    ></input>
                    <input
                      type='text'
                      value={workpositionnamekr}
                      onChange={(e) => setWorkPositionNameKR(e.target.value)}
                    ></input>
                    <input
                      type='text'
                      value={att_group_code}
                      onChange={(e) => setATT_GROUP_CODE(Number(e.target.value))}
                    ></input>
                  </div>
                </div>
                <div className='workpositionbutton'>
                  <button
                    className='thembutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_them_workposition
                        );
                      } else {
                        handle_them_workposition();
                      }
                    }}
                  >
                    {getlang("them", glbLang!)}
                  </button>
                  <button
                    className='suabutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_sua_workposition
                        );
                      } else {
                        handle_sua_workposition();
                      }
                    }}
                  >
                    {getlang("update", glbLang!)}
                  </button>
                  <button
                    className='xoabutton'
                    onClick={() => {
                      if (getCompany() !== "CMS") {
                        checkBP(
                          userData,
                          ["NHANSU"],
                          ["ALL"],
                          ["ALL"],
                          handle_xoa_workposition
                        );
                      } else {
                        handle_xoa_workposition();
                      }
                    }}
                  >
                    {getlang("clear", glbLang!)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>)
  );
};
export default QuanLyPhongBanNhanSu;

import moment from "moment";
import { generalQuery, getUserData } from "../../../api/Api";
import { BANG_CONG_DATA, BANG_CONG_THANG_DATA, DiemDanhNhomData, EmployeeTableData, MainDeptTableData, SubDeptTableData } from "../interfaces/nhansuInterface";
import { WORK_POSITION_DATA } from "../interfaces/nhansuInterface";

export const f_getEmployeeList = async () => {
  let kq: EmployeeTableData[] = [];
  try {
    let res = await generalQuery("getemployee_full", {});
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: EmployeeTableData[] = res.data.data.map(
        (element: EmployeeTableData, index: number) => {
          return {
            ...element,
            DOB: element.DOB !== null ? moment.utc(element.DOB).format("YYYY-MM-DD") : "",
            WORK_START_DATE: element.WORK_START_DATE !== null ? moment.utc(element.WORK_START_DATE).format("YYYY-MM-DD") : "",
            RESIGN_DATE: element.RESIGN_DATE !== null ? moment.utc(element.RESIGN_DATE).format("YYYY-MM-DD") : "",
            ONLINE_DATETIME: element.ONLINE_DATETIME !== null ? moment .utc(element.ONLINE_DATETIME) .format("YYYY-MM-DD HH:mm:ss") : "",
            FULL_NAME: element.MIDLAST_NAME + " " + element.FIRST_NAME,
            PASS_WORD: getUserData()?.EMPL_NO === "NHU1903" ? element.PASSWORD : "********",
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_loadWorkPositionList = async (SUBDEPTCODE?: number) => {
  let kq: WORK_POSITION_DATA[] = [];
  try {
    let res = await generalQuery(
      "workpositionlist",
      SUBDEPTCODE === undefined ? {} : { SUBDEPTCODE: SUBDEPTCODE }
    );
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: WORK_POSITION_DATA[] = res.data.data.map(
        (element: WORK_POSITION_DATA, index: number) => {
          return {
            ...element,
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_addEmployee = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertemployee", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateEmployee = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateemployee", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadMainDepList = async () => {
  let kq: MainDeptTableData[] = [];
  try {
    let res = await generalQuery("getmaindept", {});
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: MainDeptTableData[] = res.data.data.map(
        (element: MainDeptTableData, index: number) => {
          return {
            ...element,
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_loadSubDepList = async (MAINDEPTCODE?: number) => {
  let kq: SubDeptTableData[] = [];
  try {
    let res = await generalQuery(
      "getsubdeptall",
      MAINDEPTCODE === undefined ? {} : { MAINDEPTCODE: MAINDEPTCODE }
    );
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: SubDeptTableData[] = res.data.data.map(
        (element: SubDeptTableData, index: number) => {
          return {
            ...element,
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_addMainDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertmaindept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
    });
  return kq;
};
export const f_addSubDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertsubdept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_addWorkPosition = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertworkposition", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateMainDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updatemaindept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateSubDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updatesubdept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateWorkPosition = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateworkposition", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteWorkPosition = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteworkposition", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteMainDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deletemaindept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteSubDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deletesubdept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_setCa = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("setca", {
    EMPL_NO: DATA.EMPL_NO,
    CALV: DATA.CALV,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_setCaDiemDanh = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("setcadiemdanh", {
    EMPL_NO: DATA.EMPL_NO,
    APPLY_DATE: DATA.APPLY_DATE,
    CALV: DATA.CALV,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_getDiemDanhNhom = async (
  option: string,
  teamnamelist: number
) => {
  let kq: DiemDanhNhomData[] = [];
  await generalQuery(option, { team_name_list: teamnamelist })
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        let loaded_data = response.data.data.map((e: any, index: number) => {
          return {
            ...e,
            REQUEST_DATE:
              e.REQUEST_DATE !== null
                ? moment.utc(e.REQUEST_DATE).format('YYYY-MM-DD')
                : '',
            APPLY_DATE:
              e.APPLY_DATE !== null
                ? moment.utc(e.APPLY_DATE).format('YYYY-MM-DD')
                : '',
            FULL_NAME: e.MIDLAST_NAME + ' ' + e.FIRST_NAME,
            id: index + 1,
          };
        });
        kq = loaded_data;
      } else {
        console.log(response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_updateFaceID = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updatefaceid", {
    EMPL_NO: DATA.EMPL_NO,
    FACE_ID: DATA.FACE_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_recognizeFaceID = async (DATA: any) => {
  let kq: any = null;
  await generalQuery("recognizeface", {    
    FACE_ID: DATA.FACE_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data;
      }
      else {
        kq = response.data;
      }
    })
    .catch((error) => {
      console.log(error);
      kq = error.message;
    });
  return kq;
};

export const f_updateWorkHour = async (DATA: any, APPLY_DATE: string) => {
  let kq: boolean = false;
  await generalQuery("updateworkhour", {
    EMPL_NO: DATA.EMPL_NO,
    APPLY_DATE: APPLY_DATE,
    WORK_HOUR: DATA.WORK_HOUR,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_insertBangCong = async (DATA: any) => {
  let kq: string = '';
  await generalQuery("insertBangCong",DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_updateBangCong = async (DATA: any) => {
  let kq: string = '';
  await generalQuery("updateBangCong",DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_deleteBangCong = async (DATA: any) => {
  let kq: string = '';
  await generalQuery("deleteBangCong",DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_loadBangCong = async (DATA: any) => {
  let kq: BANG_CONG_DATA[] = [];
  await generalQuery("loadBangCong",DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data = response.data.data.map((e: any, index: number) => {
          return {
            ...e,
            INS_DATE:
              e.INS_DATE !== null
                ? moment.utc(e.INS_DATE).format('YYYY-MM-DD')
                : '',
            UPD_DATE:
              e.UPD_DATE !== null
                ? moment.utc(e.UPD_DATE).format('YYYY-MM-DD')
                : '',
            APPLY_DATE:
              e.APPLY_DATE !== null
                ? moment.utc(e.APPLY_DATE).format('YYYY-MM-DD')
                : '',      
            id: index + 1,
          };
        });
        kq = loaded_data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const loadBangCongTheoThang = async (DATA: any) => {
  let kq: BANG_CONG_THANG_DATA[] = [];
  await generalQuery("loadBangCongTheoThang",DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_checkNV = async (DATA: any) => {
  let kq: Array<any> = [];
  await generalQuery("checkNVCCID",DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_syncBangCong = async (DATA: any) => {
  let kq: string = '';
  await generalQuery("syncBangCongSangDiemDanh",DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

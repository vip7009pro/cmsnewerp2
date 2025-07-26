import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { ComponentAttribute, Field, Form, Page, PageComponent, Record } from "../types/types";

export const f_loadFormList = async () => {
  let kq: Form[] = [];
  await generalQuery("loadFormList", {})
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Load data thành công", "success");
        //console.log(response.data.data);
        let loaded_data: Form[] = response.data.data.map(
          (element: Form, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        //kq = response.data.message;
        Swal.fire("Thông báo", "Không có data", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadFormDetail = async (DATA: any) => {
  let kq: Form[] = [];
  await generalQuery("loadFormDetail", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: Form[] = response.data.data.map(
          (element: Form, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_insertForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadFieldList = async (DATA: any) => {
  let kq: Field[] = [];
  await generalQuery("loadFieldList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: Field[] = response.data.data.map(
          (element: Field, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_insertField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_addField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("addField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_loadPageList = async (DATA: any) => {
  let kq: Page[] = [];
  await generalQuery("loadPageList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: Page[] = response.data.data.map(
          (element: Page, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_insertPage = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertPage", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_updatePage = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updatePage", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_deletePage = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deletePage", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_loadComponents = async (DATA: any) => {
  let kq: PageComponent[] = [];
  await generalQuery("loadPageComponentList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: PageComponent[] = response.data.data.map(
          (element: PageComponent, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_insertComponent = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertPageComponent", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_updateComponent = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updatePageComponent", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_deleteComponent = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deletePageComponent", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_loadComponentAttributes = async (DATA: any) => {
  let kq: ComponentAttribute[] = [];
  await generalQuery("loadComponentAttributeList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: ComponentAttribute[] = response.data.data.map(
          (element: ComponentAttribute, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_insertComponentAttribute = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertComponentAttribute", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_updateComponentAttribute = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateComponentAttribute", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_deleteComponentAttribute = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteComponentAttribute", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};



//EAV 
export const f_insertRecord = async (DATA: any) => {
  let kq: {RecordID: number} = {RecordID: 0};
  await generalQuery("insertRecord", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data[0];
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_updateRecord = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateRecord", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_deleteRecord = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteRecord", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_loadRecordList = async (DATA: any) => {
  let kq: Record[] = [];
  await generalQuery("loadRecordList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: Record[] = response.data.data.map(
          (element: Record, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};


export const f_loadFormDataList = async (DATA: any) => {
  let kq: FormData[] = [];
  await generalQuery("loadFormDataList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: FormData[] = response.data.data.map(
          (element: FormData, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_updateFormData = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateFormData", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_deleteFormData = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteFormData", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_insertFormData = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertFormData", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_load_pivotedData = async (DATA: any) => {
  let kq: any[] = [];
  await generalQuery("load_pivotedData", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: any[] = response.data.data.map(
          (element: any, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};
import { generalQuery } from "../../../api/Api";
import { M_INPUT_BY_POPULAR_DATA, M_INPUT_BY_POPULAR_DETAIL_DATA, M_OUTPUT_BY_POPULAR_DATA, M_OUTPUT_BY_POPULAR_DETAIL_DATA, M_STOCK_BY_MONTH_DATA, M_STOCK_BY_MONTH_DETAIL_DATA, MSTOCK_BY_POPULAR_DATA, MSTOCK_BY_POPULAR_DETAIL_DATA, P_STOCK_BY_MONTH_DATA, P_STOCK_BY_MONTH_DETAIL_DATA } from "../interfaces/khoInterface";

export const f_loadMSTOCK_BY_POPULAR = async (DATA: any) => {
    let kq: MSTOCK_BY_POPULAR_DATA[] = [];
    await generalQuery("loadMSTOCK_BY_POPULAR", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: MSTOCK_BY_POPULAR_DATA[] = response.data.data.map(
            (element: MSTOCK_BY_POPULAR_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_loadMSTOCK_BY_POPULAR_DETAIL = async (DATA: any) => {
    let kq: MSTOCK_BY_POPULAR_DETAIL_DATA[] = [];
    await generalQuery("loadMSTOCK_BY_POPULAR_DETAIL", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: MSTOCK_BY_POPULAR_DETAIL_DATA[] = response.data.data.map(
            (element: MSTOCK_BY_POPULAR_DETAIL_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_loadM_INPUT_BY_POPULAR = async (DATA: any) => {
    let kq: M_INPUT_BY_POPULAR_DATA[] = [];
    await generalQuery("load_M_INPUT_BY_POPULAR", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: M_INPUT_BY_POPULAR_DATA[] = response.data.data.map(
            (element: M_INPUT_BY_POPULAR_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_loadM_INPUT_BY_POPULAR_DETAIL = async (DATA: any) => {
    let kq: M_INPUT_BY_POPULAR_DETAIL_DATA[] = [];
    await generalQuery("load_M_INPUT_BY_POPULAR_DETAIL", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: M_INPUT_BY_POPULAR_DETAIL_DATA[] = response.data.data.map(
            (element: M_INPUT_BY_POPULAR_DETAIL_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_loadM_OUTPUT_BY_POPULAR = async (DATA: any) => {
    let kq: M_OUTPUT_BY_POPULAR_DATA[] = [];
    await generalQuery("load_M_OUTPUT_BY_POPULAR", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: M_OUTPUT_BY_POPULAR_DATA[] = response.data.data.map(
            (element: M_OUTPUT_BY_POPULAR_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_loadM_OUTPUT_BY_POPULAR_DETAIL = async (DATA: any) => {
    let kq: M_OUTPUT_BY_POPULAR_DETAIL_DATA[] = [];
    await generalQuery("load_M_OUTPUT_BY_POPULAR_DETAIL", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: M_OUTPUT_BY_POPULAR_DETAIL_DATA[] = response.data.data.map(
            (element: M_OUTPUT_BY_POPULAR_DETAIL_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_loadM_STOCK_BY_MONTH = async (DATA: any) => {
    let kq: M_OUTPUT_BY_POPULAR_DETAIL_DATA[] = [];
    await generalQuery("load_M_STOCK_BY_MONTH", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: M_OUTPUT_BY_POPULAR_DETAIL_DATA[] = response.data.data.map(
            (element: M_OUTPUT_BY_POPULAR_DETAIL_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_load_Stock_By_Month = async (DATA: any) => {
    let kq: M_STOCK_BY_MONTH_DATA[] = [];
    await generalQuery("load_M_STOCK_BY_MONTH", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: M_STOCK_BY_MONTH_DATA[] = response.data.data.map(
            (element: M_STOCK_BY_MONTH_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_load_Stock_By_Month_Detail = async (DATA: any) => {
    let kq: M_STOCK_BY_MONTH_DETAIL_DATA[] = [];
    await generalQuery("load_M_STOCK_BY_MONTH_DETAIL", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: M_STOCK_BY_MONTH_DETAIL_DATA[] = response.data.data.map(
            (element: M_STOCK_BY_MONTH_DETAIL_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };
  export const f_load_P_Stock_By_Month = async (DATA: any) => {
    let kq: P_STOCK_BY_MONTH_DATA[] = [];
    await generalQuery("load_P_STOCK_BY_MONTH", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: P_STOCK_BY_MONTH_DATA[] = response.data.data.map(
            (element: P_STOCK_BY_MONTH_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_load_P_Stock_By_Month_Detail = async (DATA: any) => {
    let kq: P_STOCK_BY_MONTH_DETAIL_DATA[] = [];
    await generalQuery("load_P_STOCK_BY_MONTH_DETAIL", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: P_STOCK_BY_MONTH_DETAIL_DATA[] = response.data.data.map(
            (element: P_STOCK_BY_MONTH_DETAIL_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };
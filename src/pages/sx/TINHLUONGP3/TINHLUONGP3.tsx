import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import "./TINHLUONGP3.scss";
import { useSelector } from "react-redux";
import { LUONGP3_DATA, MACHINE_LIST, UserData, WEB_SETTING_DATA } from "../../../api/GlobalInterface";
import { RootState } from "../../../redux/store";
import { f_getMachineListData } from "../../../api/GlobalFunction";
import AGTable from "../../../components/DataTable/AGTable";
import { generalQuery, getGlobalSetting } from "../../../api/Api";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
export const f_handleLoadluongP3Data = async (data: any) => {
  let kq: LUONGP3_DATA[] = [];
  try {
    let res = await generalQuery('tinhluongP3', data);
    //console.log(res);
    if (res.data.tk_status !== 'NG') {
      //console.log(res.data.data);
      let loaded_data: LUONGP3_DATA[] = res.data.data.map((element: LUONGP3_DATA, index: number) => {
        return {
          ...element,
          PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
          SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
          id: index
        }
      })
      kq = loaded_data;
    } else {
      console.log('fetch error', res.data.message);
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
}

export const f_handleUpdate_M_PRICE_P500 = async () => {
  let kq:string ="";
  try {
    let res = await generalQuery('update_M_PRICE_P500', {});
    //console.log(res);
    if (res.data.tk_status !== 'NG') {
      //console.log(res.data.data);  
     
    } else {
      console.log('fetch error', res.data.message);
      kq = res.data.message;
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
}
const TINHLUONGP3 = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [fromdate, setFromDate] = useState(moment().add(-8, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [machine, setMachine] = useState("ALL");
  const [luongP3Data, setLuongP3Data] = useState<LUONGP3_DATA[]>([]);
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [cust_name_kd, setCUST_NAME_KD] = useState("");
  const [alltime, setAllTime] = useState(false);
  const columns = [
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 70 },
    { field: 'PLAN_DATE', headerName: 'PLAN_DATE', width: 70 },
    { field: 'PLAN_QTY', headerName: 'PLAN_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    } },
    { field: 'SX_DATE', headerName: 'SX_DATE', width: 70 },
    { field: 'PLAN_EQ', headerName: 'PLAN_EQ', width: 70 },
    { field: 'EQ_NAME', headerName: 'EQ_NAME', width: 70 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 70 },
    { field: 'FULL_NAME', headerName: 'FULL_NAME', width: 70 },
    { field: 'PROD_REQUEST_NO', headerName: 'YCSX_NO', width: 60 },
    { field: 'G_CODE', headerName: 'G_CODE', width: 70 },
    { field: 'G_NAME', headerName: 'G_NAME', width: 70 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 70 },
    { field: 'DESCR', headerName: 'DESCR', width: 70 },
    { field: 'M_CODE', headerName: 'M_CODE', width: 70 },
    { field: 'M_NAME', headerName: 'M_NAME', width: 70 },
    { field: 'WIDTH_CD', headerName: 'WIDTH_CD', width: 70 },
    { field: 'M_PRICE', headerName: 'M_PRICE', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'USED_QTY', headerName: 'USED_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'PR_NG', headerName: 'PR_NG', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'SETTING_MET', headerName: 'SETTING_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'OK_MET', headerName: 'OK_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'OK_EA', headerName: 'OK_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'DM_SETTING', headerName: 'DM_SETTING', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#d10ec7aa'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'DM_LOSS_SX', headerName: 'DM_LOSS_SX(%)', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#d10ec7aa'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'PD', headerName: 'BUOC_KEO(PD)', width: 70 },
    { field: 'DON_GIA_IN', headerName: 'DON_GIA_IN', width: 70 },
    { field: 'PROD_PRINT_TIMES', headerName: 'SO_MAU_IN', width: 70 },
    { field: 'FILM_OUT_TIMES', headerName: 'SO_LAN_XUAT_FILM', width: 70 },
    { field: 'THUA_THIEU_MET', headerName: 'THUA_THIEU_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'THUA_THIEU_M2', headerName: 'THUA_THIEU_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{Number(params.value).toLocaleString('en-US')}</span>;
    }  },
    { field: 'THUA_THIEU_AMOUNT', headerName: 'THUA_THIEU_AMOUNT', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: params.value >=0 ? 'blue' : 'red'}}>{Number(params.value).toLocaleString('en-US', { style: "currency", currency:"VND", })}</span>;
    }  },
    { field: 'PRINT_QTY_AMOUNT', headerName: 'PRINT_QTY_AMOUNT', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: params.value >=0 ? 'blue' : 'red'}}>{Number(params.value).toLocaleString('en-US', { style: "currency", currency:"VND", })}</span>;
    }   },
    { field: 'OUT_FILM_AMOUNT', headerName: 'OUT_FILM_AMOUNT', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: params.value >=0 ? 'blue' : 'red'}}>{Number(params.value).toLocaleString('en-US', { style: "currency", currency:"VND", })}</span>;
    }   },
    { field: 'TOTAL_P3_AMOUNT', headerName: 'TOTAL_P3_AMOUNT', width: 70, cellRenderer: (params: any) => {
      return <span style={{fontWeight:'bold', color: params.value >=0 ? 'green' : 'red'}}>{Number(params.value).toLocaleString('en-US', { style: "currency", currency:"VND", })}</span>;
    }   }, 
  ];
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
    }
  };
  const loss_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div>
          </div>}
        columns={columns}
        data={luongP3Data}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }} />
    )
  }, [luongP3Data, columns]);
  const handle_loaddatasx = async () => {
    await f_handleUpdate_M_PRICE_P500();
    let kq = await f_handleLoadluongP3Data({
      FROM_DATE: fromdate,
      TO_DATE: todate,
      FACTORY: factory,
      MACHINE: machine,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      M_NAME: m_name,
      M_CODE: m_code,
      PROD_REQUEST_NO: prodrequestno,
      PLAN_ID: plan_id,
      CUST_NAME_KD: cust_name_kd,
      ALL_TIME: alltime,
    });
    //console.log(kq);
    if (kq.length > 0) {
      Swal.fire('Thông báo', 'Đã load : ' + kq.length + ' dòng', 'success');
      setLuongP3Data(kq);
    }
    else {
      Swal.fire('Thông báo', 'Không có dữ liệu', 'error');
      setLuongP3Data([]);
    }
  };
  useEffect(() => {
    getMachineList();
    return () => {
      /* window.clearInterval(intervalID);*/
    };
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='baocaofullroll'>
      <div className='tracuuDataInspection'>
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên Liệu:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SJ-203020HC"
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="A123456"
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="1F80008"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="A123456"
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Khách hàng:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SEV"
                  value={cust_name_kd}
                  onChange={(e) => setCUST_NAME_KD(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>FACTORY:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
              <label>
                <b>MACHINE:</b>
                <select
                  name="machine2"
                  value={machine}
                  onChange={(e) => {
                    setMachine(e.target.value);
                  }}
                >
                  {machine_list.map((ele: MACHINE_LIST, index: number) => {
                    return (
                      <option key={index} value={ele.EQ_NAME}>
                        {ele.EQ_NAME}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <label>
              <b>All Time:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <Button onClick={() => {
              handle_loaddatasx();
            }}>Load Data</Button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          <div className="datatable">
            {loss_data_ag_table}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TINHLUONGP3;

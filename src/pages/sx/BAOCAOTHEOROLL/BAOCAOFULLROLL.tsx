import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import "./BAOCAOFULLROLL.scss";
import { useSelector } from "react-redux";
import { FULL_ROLL_DATA, MACHINE_LIST, UserData } from "../../../api/GlobalInterface";
import { RootState } from "../../../redux/store";
import { f_getMachineListData } from "../../../api/GlobalFunction";
import AGTable from "../../../components/DataTable/AGTable";
import { generalQuery } from "../../../api/Api";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
export const f_handleLoadFullRollData = async (data: any) => {
  let kq: FULL_ROLL_DATA[] = [];
  try {
    let res = await generalQuery('loadFullRollData', data);
    //console.log(res);
    if (res.data.tk_status !== 'NG') {
      //console.log(res.data.data);
      let loaded_data: FULL_ROLL_DATA[] = res.data.data.map((element: FULL_ROLL_DATA, index: number) => {
        return {
          ...element,
          PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
          id: index
        }
      })
      kq = loaded_data;
    } else {
      console.log('fetch error');
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
}
const BAOCAOFULLROLL = () => {
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
  const [fullRollData, setFullRollData] = useState<FULL_ROLL_DATA[]>([]);
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [cust_name_kd, setCUST_NAME_KD] = useState("");
  const [alltime, setAllTime] = useState(false);
  const columns = [
    { field: 'PLAN_DATE', headerName: 'PLAN_DATE', width: 70 },
    { field: 'PHAN_LOAI', headerName: 'PHAN_LOAI', width: 70 },
    { field: 'PROCESS_NUMBER', headerName: 'PROCESS_NUMBER', width: 70 },
    { field: 'STEP', headerName: 'STEP', width: 70 },    
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 70 },
    { field: 'PROD_MAIN_MATERIAL', headerName: 'PROD_MAIN_MATERIAL', width: 70 },
    { field: 'WIDTH_CD', headerName: 'WIDTH_CD', width: 70 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 70 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 70 },
    { field: 'M_LOT_NO', headerName: 'M_LOT_NO', width: 70 },
    { field: 'IQC_IN', headerName: 'IQC_IN', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    }},
    { field: 'OUT_KHO_QTY', headerName: 'OUT_KHO_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'LOCK_QTY', headerName: 'LOCK_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'INPUT_QTY', headerName: 'INPUT_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'USED_QTY', headerName: 'USED_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'REMAIN_QTY', headerName: 'REMAIN_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'SETTING_MET', headerName: 'SETTING_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'PR_NG', headerName: 'PR_NG', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'RESULT_MET', headerName: 'RESULT_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'BTP_REMAIN_QTY', headerName: 'BTP_REMAIN_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'TON_KHO_SX', headerName: 'TON_KHO_SX', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'RETURN_KHO_QTY', headerName: 'RETURN_KHO_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'RETURN_IQC_QTY', headerName: 'RETURN_IQC_QTY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },    
    { field: 'INS_INPUT_MET', headerName: 'INS_INPUT_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'TON_KIEM_MET', headerName: 'TON_KIEM_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'INSPECT_TOTAL_MET', headerName: 'INSPECT_TOTAL_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'INSPECT_OK_MET', headerName: 'INSPECT_OK_MET', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'IQC_IN_EA', headerName: 'IQC_IN_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'OUT_KHO_EA', headerName: 'OUT_KHO_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'LOCK_EA', headerName: 'LOCK_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'INPUT_EA', headerName: 'INPUT_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'USED_EA', headerName: 'USED_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'REMAIN_EA', headerName: 'REMAIN_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'SETTING_EA', headerName: 'SETTING_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'PR_NG_EA', headerName: 'PR_NG_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'RESULT_EA', headerName: 'RESULT_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'BTP_REMAIN_EA', headerName: 'BTP_REMAIN_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'TON_KHO_SX_EA', headerName: 'TON_KHO_SX_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'RETURN_EA', headerName: 'RETURN_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'RETURN_IQC_EA', headerName: 'RETURN_IQC_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'INS_INPUT_EA', headerName: 'INS_INPUT_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'TON_KIEM_EA', headerName: 'TON_KIEM_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'INSPECT_TOTAL_EA', headerName: 'INSPECT_TOTAL_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'INSPECT_OK_EA', headerName: 'INSPECT_OK_EA', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#17a736'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'IQC_IN_M2', headerName: 'IQC_IN_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }  },
    { field: 'OUT_KHO_M2', headerName: 'OUT_KHO_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'LOCK_M2', headerName: 'LOCK_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'INPUT_M2', headerName: 'INPUT_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'USED_M2', headerName: 'USED_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'REMAIN_M2', headerName: 'REMAIN_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'SETTING_M2', headerName: 'SETTING_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'PR_NG_M2', headerName: 'PR_NG_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'RESULT_M2', headerName: 'RESULT_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'BTP_REMAIN_M2', headerName: 'BTP_REMAIN_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'TON_KHO_SX_M2', headerName: 'TON_KHO_SX_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'RETURN_KHO_M2', headerName: 'RETURN_KHO_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'RETURN_IQC_M2', headerName: 'RETURN_IQC_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'INS_INPUT_M2', headerName: 'INS_INPUT_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'TON_KIEM_M2', headerName: 'TON_KIEM_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'INSPECT_TOTAL_M2', headerName: 'INSPECT_TOTAL_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'INSPECT_OK_M2', headerName: 'INSPECT_OK_M2', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: '#df0000'}}>{params.value?.toLocaleString('en-US')}</span>;
    }   },
    { field: 'PD', headerName: 'PD', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    { field: 'CAVITY', headerName: 'CAVITY', width: 70, cellRenderer: (params: any) => {
      return <span style={{color: 'blue'}}>{params.value?.toLocaleString('en-US')}</span>;
    } },
    
    
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
        data={fullRollData}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }} />
    )
  }, [fullRollData, columns]);
  const handle_loaddatasx = async () => {
    let kq = await f_handleLoadFullRollData({
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
      setFullRollData(kq);
    }
    else {
      Swal.fire('Thông báo', 'Không có dữ liệu', 'error');
      setFullRollData([]);
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
        <div className="tracuuDataInspectionform">
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
export default BAOCAOFULLROLL;

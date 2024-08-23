import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import {
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import { f_getMachineListData, SaveExcel } from "../../../../api/GlobalFunction";
import "./PLAN_STATUS.scss";
import PLAN_STATUS_COMPONENTS from "./PLAN_STATUS_COMPONENTS";
import { MACHINE_LIST, SX_DATA } from "../../../../api/GlobalInterface";
const PLAN_STATUS = () => {
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const [readyRender, setReadyRender] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const handle_loadplanStatus = () => {
    generalQuery("checkQLSXPLANSTATUS", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PLAN_ID: plan_id,
      PROD_REQUEST_NO: prodrequestno,
      FACTORY: factory,
      PLAN_EQ: machine,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_DATA[] = response.data.data.map(
            (element: SX_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          startTransition(() => {
            setDataSXTable(loaded_data);
          });
          setReadyRender(true);
          setisLoading(false);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getMachineList();
    handle_loadplanStatus();
    /*   let intervalID = window.setInterval(() => {
        handle_loadplanStatus();
      }, 10000); */
    return () => {
      //window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className="plan_status">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
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
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type="text"
                  placeholder="1F80008"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type="text"
                  placeholder="A123456"
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
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
                  name="machine"
                  value={machine}
                  onChange={(e) => {
                    setMachine(e.target.value);
                  }}
                  style={{ width: 150, height: 30 }}
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
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={alltime}
                onChange={() => {
                  setAllTime(!alltime);
                  console.log(!alltime);
                }}
              ></input>
            </label>
            <button
              className="tranhatky"
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                handle_loadplanStatus();
              }}
            >
              Tra lịch sử
            </button>
          </div>
        </div>
        <div className="tracuuYCSXTable">
          {readyRender &&
            datasxtable.map((element: SX_DATA, index: number) => {
              return <PLAN_STATUS_COMPONENTS key={index} DATA={element} />;
            })}
        </div>
      </div>
    </div>
  );
};
export default PLAN_STATUS;

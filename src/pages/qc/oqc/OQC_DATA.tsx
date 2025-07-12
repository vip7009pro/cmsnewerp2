import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import {
  DataDiv,
  DataTBDiv,
  FormButtonColumn,
  FromInputColumn,
  FromInputDiv,
  QueryFormDiv,
} from "../../../components/StyledComponents/ComponentLib";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import { OQC_DATA } from "../interfaces/qcInterface";
const OQC_DATA_TB = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [oqc_table_data, set_oqc_table_data] = useState<Array<OQC_DATA>>([]);
  const [selectedRows, setSelectedRows] = useState<OQC_DATA>({
    CUST_NAME_KD: '',
    DELIVERY_AMOUNT: 0,
    DELIVERY_DATE: '',
    DELIVERY_QTY: 0,
    FACTORY_NAME: '',
    FULL_NAME: '',
    G_CODE: '',
    G_NAME: '',
    G_NAME_KD: '',
    LABEL_ID: '',
    OQC_ID: 0,
    PROCESS_LOT_NO: '',
    M_LOT_NO: '',
    LOTNCC: '',
    PROD_LAST_PRICE: 0,
    PROD_REQUEST_DATE: '',
    PROD_REQUEST_NO: '',
    PROD_REQUEST_QTY: 0,
    REMARK: '',
    RUNNING_COUNT: 0,
    SAMPLE_NG_AMOUNT: 0,
    SAMPLE_NG_QTY: 0,
    SAMPLE_QTY: 0,
    SHIFT_CODE: ''
  });
  const load_oqc_data = () => {
    generalQuery("traOQCData", {
      CUST_NAME_KD: selectedRows.CUST_NAME_KD,
      PROD_REQUEST_NO: selectedRows.PROD_REQUEST_NO,
      G_NAME: selectedRows.G_NAME,
      G_CODE: selectedRows.G_CODE,
      FROM_DATE: fromdate,
      TO_DATE: todate
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: OQC_DATA, index: number) => {
              return {
                ...element,
                DELIVERY_DATE: moment
                  .utc(element.DELIVERY_DATE)
                  .format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          set_oqc_table_data(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          set_oqc_table_data([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setOQCFormInfo = (keyname: string, value: any) => {
    console.log(keyname);
    console.log(value);
    let tempCustInfo: OQC_DATA = {
      ...selectedRows,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_oqc_data();
    }
  };
  const columns_def = [  
    { field: 'OQC_ID', headerName: 'OQC_ID', width: 50 },
    { field: 'DELIVERY_DATE', headerName: 'DELIVERY_DATE', width: 80 },
    { field: 'SHIFT_CODE', headerName: 'SHIFT_CODE', width: 70 },
    { field: 'FACTORY_NAME', headerName: 'FACTORY_NAME', width: 80 },
    { field: 'FULL_NAME', headerName: 'FULL_NAME', width: 100 },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', width: 80 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 100 },
    { field: 'PROCESS_LOT_NO', headerName: 'PROCESS_LOT_NO', width: 100 },
    { field: 'M_LOT_NO', headerName: 'M_LOT_NO', width: 100 },
    { field: 'LOTNCC', headerName: 'LOTNCC', width: 100 },
    { field: 'LABEL_ID', headerName: 'LABEL_ID', width: 60 },
    { field: 'PROD_REQUEST_DATE', headerName: 'YCSX_DATE', width: 60 },
    { field: 'PROD_REQUEST_QTY', headerName: 'YCSX_QTY', width: 60 },
    { field: 'G_CODE', headerName: 'G_CODE', width: 60 },
    { field: 'G_NAME', headerName: 'G_NAME', width: 100 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 100 },
    { field: 'DELIVERY_QTY', headerName: 'DELIVERY_QTY', width: 80 },
    { field: 'SAMPLE_QTY', headerName: 'SAMPLE_QTY', width:70 },
    { field: 'SAMPLE_NG_QTY', headerName: 'SAMPLE_NG_QTY', width: 90 },
    { field: 'PROD_LAST_PRICE', headerName: 'PROD_LAST_PRICE', width: 100 },
    { field: 'DELIVERY_AMOUNT', headerName: 'DELIVERY_AMOUNT', width: 100 },
    { field: 'SAMPLE_NG_AMOUNT', headerName: 'SAMPLE_NG_AMOUNT', width: 100 },
    { field: 'REMARK', headerName: 'REMARK', width: 80 },
    { field: 'RUNNING_COUNT', headerName: 'RUNNING_COUNT', width: 90 },
    { field: 'id', headerName: 'id', width: 60 },
  ];
  const oqc_data_ag_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>
          </div>}
        columns={columns_def}
        data={oqc_table_data}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={(params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}     />   
    )
  }, [oqc_table_data, columns_def]);
  
  useEffect(() => {
  }, []);
  return (
    <DataDiv>
      <QueryFormDiv style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <FromInputDiv>
          <FromInputColumn >
            <label>
              <b>Từ ngày:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
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
                type='date'
                value={todate.slice(0, 10)}
                onChange={(e) => setToDate(e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>Code KD:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={selectedRows?.G_NAME}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("G_NAME_KD", e.target.value)}
              ></input>
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <b>Code ERP:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={selectedRows?.G_CODE}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("G_CODE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>YCSX:</b>{" "}
              <input
                type="text"
                placeholder="YCSX"
                value={selectedRows?.PROD_REQUEST_NO}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("PROD_REQUEST_NO", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Khách hàng:</b>{" "}
              <input
                type="text"
                placeholder="Khách hàng"
                value={selectedRows?.CUST_NAME_KD}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("CUST_NAME_KD", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
        </FromInputDiv>
        <FormButtonColumn>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
            load_oqc_data();
          }}>Load</Button>
        </FormButtonColumn>
      </QueryFormDiv>
      <DataTBDiv>
        {oqc_data_ag_table}
      </DataTBDiv>      
    </DataDiv>
  );
};
export default OQC_DATA_TB;

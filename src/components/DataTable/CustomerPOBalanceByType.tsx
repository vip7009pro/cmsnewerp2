import { IconButton, LinearProgress } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../api/Api";
import { SaveExcel } from "../../api/GlobalFunction";
import "./CustomerPOBalanceByType.scss";

interface CustomerPOBalanceByTypeData {
  CUST_NAME_KD: string;
  TOTAL_PO_BALANCE: number;
  TSP: number;
  LABEL: number;
  UV: number;
  OLED: number;
  TAPE: number;
  RIBBON: number;
  SPT: number;
  OTHERS: number;
}
const CustomerPOBalanceByType = () => {
  const [customerpobalancebytypedata, setCustomerPoBalanceByType] = useState<
    Array<CustomerPOBalanceByTypeData>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const customerpobalancebytype_potable = [
    {
      field: "CUST_NAME_KD",
      headerName: "CUST_NAME_KD",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.CUST_NAME_KD.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "#0000cc" }}>
            <b>{params.row.CUST_NAME_KD}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_PO_BALANCE",
      type: "number",
      headerName: "TOTAL_PO_BALANCE",
      width: 160,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.TOTAL_PO_BALANCE.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TOTAL_PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TSP",
      type: "number",
      headerName: "TSP",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.TSP.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.TSP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LABEL",
      type: "number",
      headerName: "LABEL",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.LABEL.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.LABEL.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "UV",
      type: "number",
      headerName: "UV",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.UV.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.UV.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "OLED",
      type: "number",
      headerName: "OLED",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.OLED.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.OLED.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TAPE",
      type: "number",
      headerName: "TAPE",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.TAPE.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.TAPE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "RIBBON",
      type: "number",
      headerName: "RIBBON",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.RIBBON.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.RIBBON.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "SPT",
      type: "number",
      headerName: "SPT",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.SPT.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.SPT.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "OTHERS",
      type: "number",
      headerName: "OTHERS",
      width: 90,
      renderCell: (params: any) => {
        if (params.row.CUST_NAME_KD === "TOTAL")
          return (
            <span
              style={{
                color: "blue",
                backgroundColor: "#66ff33",
                fontSize: 16,
              }}
            >
              <b>{params.row.OTHERS.toLocaleString("en-US")}</b>
            </span>
          );
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.OTHERS.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];

  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(customerpobalancebytypedata, "Customer PO Balance Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  const handleCustomerPOBalanceByType = () => {
    let total_summary: CustomerPOBalanceByTypeData = {
      CUST_NAME_KD: "TOTAL",
      TOTAL_PO_BALANCE: 0,
      TSP: 0,
      LABEL: 0,
      UV: 0,
      OLED: 0,
      TAPE: 0,
      RIBBON: 0,
      SPT: 0,
      OTHERS: 0,
    };
    generalQuery("POBalanceByCustomer", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loadeddata: CustomerPOBalanceByTypeData[] =
            response.data.data.map(
              (element: CustomerPOBalanceByTypeData, index: number) => {
                total_summary = {
                  ...total_summary,
                  TOTAL_PO_BALANCE:
                    response.data.data[index].TOTAL_PO_BALANCE +
                    total_summary.TOTAL_PO_BALANCE,
                  TSP: response.data.data[index].TSP + total_summary.TSP,
                  LABEL: response.data.data[index].LABEL + total_summary.LABEL,
                  UV: response.data.data[index].UV + total_summary.UV,
                  OLED: response.data.data[index].OLED + total_summary.OLED,
                  TAPE: response.data.data[index].TAPE + total_summary.TAPE,
                  RIBBON:
                    response.data.data[index].RIBBON + total_summary.RIBBON,
                  SPT: response.data.data[index].SPT + total_summary.SPT,
                  OTHERS:
                    response.data.data[index].OTHERS + total_summary.OTHERS,
                };
                return {
                  ...element,
                };
              },
            );
          loadeddata.unshift(total_summary);
          setCustomerPoBalanceByType(loadeddata);
          //console.log(loadeddata);
          /*  Swal.fire(
              "Thông báo",
              "Đã load " + response.data.data.length + " dòng",
              "success"
            ); */
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleCustomerPOBalanceByType();
  }, []);
  return (
    <div className="customerpobalancebytype">
      <DataGrid
        sx={{ fontSize: 12, flex: 1 }}
        components={{
          Toolbar: CustomToolbarPOTable,
          LoadingOverlay: LinearProgress,
        }}
        loading={isLoading}
        rowHeight={30}
        rows={customerpobalancebytypedata}
        columns={customerpobalancebytype_potable}
        getRowId={(row) => row.CUST_NAME_KD}
      />
    </div>
  );
};

export default CustomerPOBalanceByType;

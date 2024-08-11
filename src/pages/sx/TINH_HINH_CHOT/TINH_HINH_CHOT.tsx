import { IconButton, LinearProgress } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useEffect, useState, useTransition } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import { generalQuery } from "../../../api/Api";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./TINH_HINH_CHOT.scss";
import { TINH_HINH_CHOT_BC } from "../../../api/GlobalInterface";

const TINH_HINH_CHOT = () => {
  const [isPending, startTransition] = useTransition();
  const [tinh_hinh_chot_NM1, setTinh_Hinh_Chot_NM1] = useState<
    Array<TINH_HINH_CHOT_BC>
  >([]);
  const [tinh_hinh_chot_NM2, setTinh_Hinh_Chot_NM2] = useState<
    Array<TINH_HINH_CHOT_BC>
  >([]);
  const [isLoading, setisLoading] = useState(false);

  const column_chotbc = [
    { field: "SX_DATE", headerName: "SX_DATE", width: 100 },
    {
      field: "TOTAL",
      headerName: "Tổng SL Chỉ Thị",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.TOTAL}
          </span>
        );
      },
    },
    {
      field: "DA_CHOT",
      headerName: "Đã Chốt Báo Cáo",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.row.DA_CHOT}
          </span>
        );
      },
    },
    {
      field: "CHUA_CHOT",
      headerName: "Chưa Chốt Báo Cáo",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.row.CHUA_CHOT}
          </span>
        );
      },
    },
    {
      field: "DA_NHAP_HIEUSUAT",
      headerName: "Đã Nhập Hiệu Suất",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.row.DA_NHAP_HIEUSUAT}
          </span>
        );
      },
    },
    {
      field: "CHUA_NHAP_HIEUSUAT",
      headerName: "Chưa Nhập Hiệu Suất",
      width: 130,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.row.CHUA_NHAP_HIEUSUAT}
          </span>
        );
      },
    },
  ];

  function CustomToolbarPLANTABLE() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(tinh_hinh_chot_NM1, "Plan Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <span style={{ fontSize: 20, fontWeight: "bold" }}>
          Tình hình chốt BC NM1
        </span>
      </GridToolbarContainer>
    );
  }
  function CustomToolbarPLANTABLE2() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(tinh_hinh_chot_NM2, "Plan Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <span style={{ fontSize: 20, fontWeight: "bold" }}>
          Tình hình chốt BC NM2
        </span>
      </GridToolbarContainer>
    );
  }

  const loadTinhHinhBaoCao = (factory: string) => {
    generalQuery("tinhhinhchotbaocaosx", {
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          if (factory === "NM1") {
            let loadeddata = response.data.data.map(
              (element: TINH_HINH_CHOT_BC, index: number) => {
                return {
                  ...element,
                  SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                  id: index,
                };
              },
            );
            startTransition(() => {
              setTinh_Hinh_Chot_NM1(loadeddata);
            });
          } else {
            let loadeddata = response.data.data.map(
              (element: TINH_HINH_CHOT_BC, index: number) => {
                return {
                  ...element,
                  SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                  id: index,
                };
              },
            );
            startTransition(() => {
              setTinh_Hinh_Chot_NM2(loadeddata);
            });
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadTinhHinhBaoCao("NM1");
    loadTinhHinhBaoCao("NM2");
  }, []);

  return (
    (<div className="tinhhinhchotbaocao">
      <div className="nhamay1">
        <DataGrid
          sx={{ fontSize: 12, flex: 1 }}
          slots={{
            toolbar: CustomToolbarPLANTABLE,
            
          }}
          loading={isLoading}
          rowHeight={30}
          rows={tinh_hinh_chot_NM1}
          columns={column_chotbc}
          pageSizeOptions={[5, 10, 50, 100, 500, 1000, 5000, 10000, 500000]}
          disableRowSelectionOnClick
          editMode="cell"
          getRowId={(row) => row.SX_DATE}
        />
      </div>
      <div className="nhamay2">
        <DataGrid
          sx={{ fontSize: 12, flex: 1 }}
          slots={{
            toolbar: CustomToolbarPLANTABLE2,
            
          }}
          loading={isLoading}
          rowHeight={30}
          rows={tinh_hinh_chot_NM2}
          columns={column_chotbc}
          pageSizeOptions={[5, 10, 50, 100, 500, 1000, 5000, 10000, 500000]}
          disableRowSelectionOnClick
          editMode="cell"
          getRowId={(row) => row.SX_DATE}
        />
      </div>
    </div>)
  );
};

export default TINH_HINH_CHOT;

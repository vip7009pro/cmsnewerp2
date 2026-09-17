import { IconButton, TextField } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState, useTransition } from "react";
import { AiFillFileExcel, AiOutlineDownload, AiOutlineLoading } from "react-icons/ai";
import { generalQuery } from "../../../api/Api";
import "./TINH_HINH_CHOT.scss";
import { TINH_HINH_CHOT_BC } from "../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import AGTable from "../../../components/DataTable/AGTable";

const TINH_HINH_CHOT = () => {
  const [isPending, startTransition] = useTransition();
  const [tinh_hinh_chot_NM1, setTinh_Hinh_Chot_NM1] = useState<
    Array<TINH_HINH_CHOT_BC>
  >([]);
  const [tinh_hinh_chot_NM2, setTinh_Hinh_Chot_NM2] = useState<
    Array<TINH_HINH_CHOT_BC>
  >([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;
  const nm1Ref = React.useRef<any>(null);
  const nm2Ref = React.useRef<any>(null);

  const column_chotbc = [
    {
      field: "SX_DATE",
      headerName: "SX_DATE",
      width: 110,
      editable: false,
    },
    {
      field: "TOTAL",
      headerName: "Tổng SL Chỉ Thị",
      width: 130,
      editable: false,
      cellStyle: { color: "blue", fontWeight: "bold" },
    },
    {
      field: "DA_CHOT",
      headerName: "Đã Chốt Báo Cáo",
      width: 140,
      editable: false,
      cellStyle: { color: "green", fontWeight: "bold" },
    },
    {
      field: "CHUA_CHOT",
      headerName: "Chưa Chốt Báo Cáo",
      width: 150,
      editable: false,
      cellStyle: { color: "red", fontWeight: "bold" },
    },
    {
      field: "DA_NHAP_HIEUSUAT",
      headerName: "Đã Nhập Hiệu Suất",
      width: 150,
      editable: false,
      cellStyle: { color: "green", fontWeight: "bold" },
    },
    {
      field: "CHUA_NHAP_HIEUSUAT",
      headerName: "Chưa Nhập Hiệu Suất",
      width: 160,
      editable: false,
      cellStyle: { color: "red", fontWeight: "bold" },
    },
  ];

  const loadTinhHinhBaoCao = (factory: string) => {
    setLoadingCount((c) => c + 1);
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
      })
      .finally(() => {
        setLoadingCount((c) => Math.max(0, c - 1));
      });
  };

  useEffect(() => {
    loadTinhHinhBaoCao("NM1");
    loadTinhHinhBaoCao("NM2");
  }, []);

  return (
    (
      <div className="tinhhinhchotbaocao">
        <div className="nhamay1">
          <AGTable
            ref={nm1Ref}
            rowHeight={30}
            showFilter={true}
            toolbar={
              <div className="thc_toolbar">
                <span className="thc_title">Tình hình chốt BC NM1</span>                
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    loadTinhHinhBaoCao("NM1");
                  }}
                  disabled={isLoading}
                >
                  <AiOutlineDownload color="#0a7d2c" size={15} />
                  Reload
                </IconButton>
              </div>
            }
            columns={column_chotbc}
            data={tinh_hinh_chot_NM1}
            onSelectionChange={() => { }}
          />
        </div>
        <div className="nhamay2">
          <AGTable
            ref={nm2Ref}
            rowHeight={30}
            showFilter={true}
            toolbar={
              <div className="thc_toolbar">
                <span className="thc_title">Tình hình chốt BC NM2</span>                
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    loadTinhHinhBaoCao("NM2");
                  }}
                  disabled={isLoading}
                >
                  <AiOutlineDownload color="#0a7d2c" size={15} />
                  Reload
                </IconButton>
              </div>
            }
            columns={column_chotbc}
            data={tinh_hinh_chot_NM2}
            onSelectionChange={() => { }}
          />
        </div>
      </div>
    )
  );
};

export default TINH_HINH_CHOT;

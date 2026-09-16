import React, { useState, useEffect, useMemo, useCallback } from "react";
import { WEB_SETTING_DATA } from "../../api/GlobalInterface";
import ChartWorstCodeByErrCode from "../Chart/INSPECTION/ChartWorstCodeByErrCode";
import { generalQuery, getGlobalSetting } from "../../api/Api";
import Swal from "sweetalert2";
import "./InspectionWorstTable.scss";
import AGTable from "./AGTable";
import { WorstCodeData, WorstData } from "../../pages/qc/interfaces/qcInterface";

interface Props {
  dailyClosingData: Array<WorstData>;
  worstby: string;
  from_date: string;
  to_date: string;
  ng_type: string;
  listCode: string[];
  cust_name: string;
}

const InspectionWorstTable: React.FC<Props> = ({
  dailyClosingData,
  worstby,
  from_date,
  to_date,
  ng_type,
  listCode,
  cust_name,
}) => {
  const [worstByCodeData, setWorstByCodeData] = useState<Array<WorstCodeData>>([]);
  const [selectedErrCode, setSelectedErrCode] = useState<string>("");
  const [selectedErrName, setSelectedErrName] = useState<string>("");

  const currencySymbol = useMemo(() => {
    const curr = getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY"
    )[0]?.CURRENT_VALUE ?? "USD";
    return curr === "USD" ? "$" : "₫";
  }, []);

  const getWorstByErrCode = useCallback(
    (err_code: string) => {
      if (!err_code) return;
      generalQuery("getInspectionWorstByCode", {
        FROM_DATE: from_date,
        TO_DATE: to_date,
        WORSTBY: worstby,
        NG_TYPE: ng_type,
        ERR_CODE: err_code,
        codeArray: listCode,
        CUST_NAME_KD: cust_name,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const loadeddata = response.data.data.map(
              (element: WorstCodeData, index: number) => ({
                ...element,
                NG_QTY: Number(element.NG_QTY || 0),
                NG_AMOUNT: Number(element.NG_AMOUNT || 0),
                INSPECT_TOTAL_QTY: Number(element.INSPECT_TOTAL_QTY || 0),
                id: index,
              })
            );
            setWorstByCodeData(loadeddata);
          } else {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Lỗi tra cứu worst by code:", error);
        });
    },
    [from_date, to_date, worstby, ng_type, listCode, cust_name]
  );

  useEffect(() => {
    if (dailyClosingData && dailyClosingData.length > 0) {
      const first = dailyClosingData[0];
      setSelectedErrCode(first.ERR_CODE || "");
      setSelectedErrName(`${first.ERR_NAME_VN || ""} (${first.ERR_NAME_KR || ""})`);
      getWorstByErrCode(first.ERR_CODE || "");
    } else {
      setSelectedErrCode("");
      setSelectedErrName("");
      setWorstByCodeData([]);
    }
  }, [dailyClosingData, getWorstByErrCode]);

  const handleRowClick = useCallback(
    (params: any) => {
      if (params?.data?.ERR_CODE) {
        const item = params.data as WorstData;
        setSelectedErrCode(item.ERR_CODE);
        setSelectedErrName(`${item.ERR_NAME_VN || ""} (${item.ERR_NAME_KR || ""})`);
        getWorstByErrCode(item.ERR_CODE);
      }
    },
    [getWorstByErrCode]
  );

  const columns = useMemo(
    () => [
      {
        field: "ERR_CODE",
        headerName: "MÃ LỖI",
        width: 80,
        cellRenderer: (params: any) => (
          <span className="iwt-code-badge" title={params.value}>
            {params.value}
          </span>
        ),
      },
      {
        field: "ERR_NAME_VN",
        headerName: "TÊN LỖI (VN)",
        width: 130,
        cellRenderer: (params: any) => (
          <span className="iwt-name-vn" title={params.value}>
            {params.value}
          </span>
        ),
      },
      {
        field: "ERR_NAME_KR",
        headerName: "TÊN (KR)",
        width: 100,
        cellRenderer: (params: any) => (
          <span className="iwt-name-kr" title={params.value}>
            {params.value}
          </span>
        ),
      },
      {
        field: "NG_QTY",
        headerName: "SỐ LƯỢNG",
        width: 95,
        cellRenderer: (params: any) => (
          <span className="iwt-num">
            {Number(params.value || 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "NG_AMOUNT",
        headerName: "GIÁ TRỊ",
        width: 105,
        cellRenderer: (params: any) => (
          <span className="iwt-amount">
            {currencySymbol}
            {Number(params.value || 0).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
    ],
    [currencySymbol]
  );

  const rowClassRules = useMemo(
    () => ({
      "iwt-row-selected": (params: any) => params.data?.ERR_CODE === selectedErrCode,
    }),
    [selectedErrCode]
  );

  return (
    <div className="inspection-worst-table-wrapper">
      {/* Cột Trái: Bảng xếp hạng lỗi AGTable */}
      <div className="worst-table-pane">
        <div className="worst-table-header">
          <span className="worst-table-header__badge">XẾP HẠNG</span>
          <span className="worst-table-header__title">
            Danh Sách Loại Lỗi ({dailyClosingData.length})
          </span>
          <span className="worst-table-header__hint">
            💡 Nhấp chọn dòng để đổi biểu đồ tròn bên cạnh
          </span>
        </div>
        <div className="worst-table-grid">
          <AGTable
            suppressRowClickSelection={false}
            showFilter={true}
            toolbar={<></>}
            columns={columns}
            data={dailyClosingData}
            onRowClick={handleRowClick}
            rowClassRules={rowClassRules}
          />
        </div>
      </div>

      {/* Cột Phải: Biểu đồ tròn phân bổ sản phẩm theo lỗi được chọn */}
      <div className="worst-chart-pane">
        <ChartWorstCodeByErrCode
          dailyClosingData={worstByCodeData}
          worstby={worstby}
          selectedErrName={selectedErrName}
          selectedErrCode={selectedErrCode}
        />
      </div>
    </div>
  );
};

export default React.memo(InspectionWorstTable);
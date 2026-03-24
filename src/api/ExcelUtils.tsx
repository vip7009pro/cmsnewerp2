import React from "react";
import * as XLSX from "xlsx";

export const readUploadFile = (
  e: any,
  setRow: React.Dispatch<React.SetStateAction<Array<any>>>,
  setColumn: React.Dispatch<React.SetStateAction<Array<any>>>
) => {
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any = XLSX.utils.sheet_to_json(worksheet, { defval: null });
      // console.log(json)
      let keys = Object.keys(json[0]);
      // console.log(keys)
      keys.push("CHECKSTATUS");
      let uploadexcelcolumn = keys.map((e, index) => {
        return {
          field: e,
          headerName: e,
          width: 100,
          cellRenderer: (ele: any) => {
            // console.log(ele);
            if (e === "CHECKSTATUS") {
              if (ele.data[e] === "Waiting") {
                return (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {ele.data[e]}
                  </span>
                );
              } else if (ele.data[e] === "OK") {
                return (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {ele.data[e]}
                  </span>
                );
              } else {
                return (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {ele.data[e]}
                  </span>
                );
              }
            } else {
              return <span>{ele.data[e]}</span>;
            }
          },
        };
      });
      // console.log(uploadexcelcolumn);
      setRow(
        json.map((element: any, index: number) => {
          return { ...element, CHECKSTATUS: "Waiting", id: index };
        })
      );
      setColumn(uploadexcelcolumn);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }
};

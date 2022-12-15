import { ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { generalQuery } from './Api';

export const SaveExcel = (data: any, title: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title}.xlsx`);
}

export const readUploadFile = (e:any) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e:any) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);           
            return json;
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
}

export function CustomResponsiveContainer(props:any) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <ResponsiveContainer {...props} />
        </div>
      </div>
    );
  }

  export function nFormatter(num: number, digits:number) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

 export async function checkver() {
  let current_ver: number = 1;
  let server_ver: number = 1;
  await generalQuery("checkWebVer", {    
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        server_ver = response.data.data[0].VERWEB;
      } else {
       
      }
    })
    .catch((error) => {
      console.log(error);
    });

    if(server_ver === current_ver)
    {
      return 1;
    }
    else
    {
      return 0;
    }

 }
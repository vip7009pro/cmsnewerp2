import { ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

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
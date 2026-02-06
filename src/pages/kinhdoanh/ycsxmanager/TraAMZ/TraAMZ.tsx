import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiPrinter } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getUserData } from "../../../../api/Api";

import "./TraAMZ.scss";
import AGTable from "../../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { AMAZON_DATA } from "../../interfaces/kdInterface";
import { COMPONENT_DATA } from "../../../rnd/interfaces/rndInterface";
import { renderElement } from "../../../../api/GlobalFunction";
import { createPortal } from "react-dom";

const PrintTrigger = ({ onPrint }: { onPrint: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onPrint();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onPrint]);
  return null;
};

const TraAMZ = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showhidesearchdiv, setShowHideSearchDiv] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");

  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [dataAMZ, setDataAMZ] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [amzdatatable, setAMZDataTable] = useState<Array<any>>(
    [],
  );
  const [selectedRows, setSelectedRows] = useState<AMAZON_DATA[]>([]);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [printData, setPrintData] = useState<Array<{ design: COMPONENT_DATA[], dataRow: AMAZON_DATA }>>([]);

  const [printOffsetX, setPrintOffsetX] = useState(Number(localStorage.getItem('AMZ_PrintOffsetX')) || 0);
  const [printOffsetY, setPrintOffsetY] = useState(Number(localStorage.getItem('AMZ_PrintOffsetY')) || 0);
  const labelprintref = useRef(null);

  /* Confirm Print State */
  const [confirmPrintOpen, setConfirmPrintOpen] = useState(false);
  const [printSuccessCount, setPrintSuccessCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('AMZ_PrintOffsetX', printOffsetX.toString());
    localStorage.setItem('AMZ_PrintOffsetY', printOffsetY.toString());
  }, [printOffsetX, printOffsetY]);

  /* Logic for printing via Portal */
  const [isPrinting, setIsPrinting] = useState(false);
  const [printWindowContainer, setPrintWindowContainer] = useState<HTMLElement | null>(null);
  const printWindowRef = useRef<Window | null>(null);

  const handlePrint = () => {
     setIsPrinting(true);
  };
  
  const handleUpdatePrintStatus = async () => {
    if (printSuccessCount <= 0) {
      Swal.fire("Thông báo", "Số lượng in phải lớn hơn 0", "warning");
      return;
    }
    
    // Slice the data based on success count
    const printedRows = selectedRows.slice(0, printSuccessCount);
   

    // Mock API Call - Replace with real API
    // await generalQuery("updatePrintStatus", { G_CODES: printedGCODES });
    console.log("Updating print status for:", printedRows);
    Swal.fire("Thành công", `Đã cập nhật trạng thái in cho ${printSuccessCount} tem!`, "success");
    
    setConfirmPrintOpen(false);
    setOpenPrintModal(false);
  };

  useEffect(() => {
    if (isPrinting) {
      // Set initial count to total
      setPrintSuccessCount(printData.length);
      const pWin = window.open('', '', 'height=600,width=800');
      if (pWin) {
         printWindowRef.current = pWin;
         pWin.document.write('<html><head><title>Print Labels</title></head><body><div id="print-root"></div></body></html>');
         pWin.document.write(`<style>
            @media print {
                @page { size: auto; margin: 0mm; }
                body { margin: 0mm; }
                .print-label-item { break-after: page; page-break-after: always; }
            }
            .print-label-item { position: relative; }
         </style>`);
         pWin.document.close();
         setPrintWindowContainer(pWin.document.getElementById('print-root'));
      } else {
        alert("Please allow popups for printing");
        setIsPrinting(false);
      }
    } else {
        // Cleanup if printing stopped
        if (printWindowRef.current) {
            printWindowRef.current.close();
            printWindowRef.current = null;
            setPrintWindowContainer(null);
        }
    }
  }, [isPrinting]);

  // Effect to trigger print once content is mounted? 
  // We can just rely on the user clicking print in the new window? 
  // Or auto-print after a delay. Using a side-effect in the render content is better.




  const column_amz_data = [
    { field: "ROW_NO", headerName: "ROW_NO", minWidth: 80, flex: 1, checkboxSelection: true, headerCheckboxSelection: true },
    { field: "G_NAME", headerName: "G_NAME", minWidth: 80, flex: 2 },
    { field: "G_CODE", headerName: "G_CODE", minWidth: 80, flex: 1 },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX_NO",
      minWidth: 80,
      flex: 0.8,
    },
    { field: "NO_IN", headerName: "NO_IN", minWidth: 80, flex: 2 },    
    { field: "DATA_1", headerName: "DATA_1", minWidth: 80, flex: 3 },
    { field: "DATA_2", headerName: "DATA_2", minWidth: 80, flex: 3 },
    {
      field: "PRINT_STATUS",
      headerName: "PRINT_STATUS",
      minWidth: 80,
      flex: 1,
    },
    { field: "INLAI_COUNT", headerName: "INLAI_COUNT", minWidth: 80, flex: 1 },
    { field: "REMARK", headerName: "REMARK", minWidth: 80, flex: 1 },
    { field: "G_CODE_MAU", headerName: "G_CODE_MAU", minWidth: 80, flex: 1 },
    { field: "INS_DATE", headerName: "INS_DATE", minWidth: 80, flex: 1.2 },
    { field: "INS_EMPL", headerName: "INS_EMPL", minWidth: 80, flex: 1 },
  ];

  const handle_traAMZ = () => {
    generalQuery("traDataAMZ", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      NO_IN: plan_id,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      DATA_AMZ: dataAMZ
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: AMAZON_DATA[] = response.data.data.map(
            (element: AMAZON_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                INS_DATE: moment(element.INS_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setAMZDataTable(loaded_data);
          Swal.fire(
            "Thông báo",
            "Đã load: " + loaded_data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Không có data", "error");
        }
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DEFAULT_COMPONENT_LIST: COMPONENT_DATA[] = [
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Rectangle",
      PHANLOAI_DT: "CONTAINER",
      DOITUONG_STT: "A6",
      CAVITY_PRINT: 2,
      GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 0,
      POS_Y: 0,
      SIZE_W: 23,
      SIZE_H: 28.6,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 0,
      DOITUONG_NAME: "Code name",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A0",
      CAVITY_PRINT: 2,
      GIATRI: "GH68-54619A",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 20.53,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 1,
      DOITUONG_NAME: "Model",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A1",
      CAVITY_PRINT: 2,
      GIATRI: "SM-R910NZAAXJP",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 15.36,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 1,
      DOITUONG_NAME: "EAN No 1",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A2",
      CAVITY_PRINT: 2,
      GIATRI: "4986773220257",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 17.97,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 4,
      DOITUONG_NAME: "Logo AMZ 1",
      PHANLOAI_DT: "IMAGE",
      DOITUONG_STT: "A3",
      CAVITY_PRINT: 2,
      GIATRI: `${window.location.protocol.startsWith("https") ? "https" : "http"}://cmsvina4285.com/images/logoAMAZON.png`,
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.28,
      POS_Y: 2.58,
      SIZE_W: 7.11,
      SIZE_H: 7,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Barcode 1",
      PHANLOAI_DT: "1D BARCODE",
      DOITUONG_STT: "A4",
      CAVITY_PRINT: 2,
      GIATRI: "GH68-55104A",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 1.97,
      POS_Y: 23.57,
      SIZE_W: 19.05,
      SIZE_H: 3.55,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Matrix 1",
      PHANLOAI_DT: "2D MATRIX",
      DOITUONG_STT: "A5",
      CAVITY_PRINT: 2,
      GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 12,
      POS_Y: 2,
      SIZE_W: 9,
      SIZE_H: 9,
      ROTATE: 0,
      REMARK: "remark",
    },
  ];

  const handleGETAMAZON_DESIGN = async (G_CODE: string): Promise<COMPONENT_DATA[]> => {
    try {
      const response = await generalQuery("getAMAZON_DESIGN", { G_CODE: G_CODE });
      if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
        return response.data.data.map((element: COMPONENT_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return DEFAULT_COMPONENT_LIST;
    } catch (error) {
      console.log(error);
      return DEFAULT_COMPONENT_LIST;
    }
  };

  const handlePreparePrint = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("Lỗi", "Chưa chọn dòng nào để in", "error");
      return;
    }

    setisLoading(true);
    const uniqueGCodes = [...new Set(selectedRows.map(row => row.G_CODE_MAU))];
    const designMap: { [key: string]: COMPONENT_DATA[] } = {};
    console.log('uniqueGCodes', uniqueGCodes)

    for (const g_code of uniqueGCodes) {
      if (g_code) {
        let tempDesign = await handleGETAMAZON_DESIGN(g_code);
        console.log('tempDesign', tempDesign)
        designMap[g_code] = tempDesign;
      }
    }
    console.log('designMap', designMap)

    const newPrintData = selectedRows.map(row => {
      const design = designMap[row.G_CODE_MAU!] ? designMap[row.G_CODE_MAU!].map(comp => ({ ...comp })) : [];
      console.log('design', design)
      
      // Update data into design
      const matrices = design.filter(d => d.PHANLOAI_DT === "2D MATRIX");
      
      if (matrices.length > 0) {
        matrices[0].GIATRI = row.DATA_1 ?? "";
      }
      if (matrices.length > 1) {
        matrices[1].GIATRI = row.DATA_2 ?? "";
      }

      return {
        design: design,
        dataRow: row
      };
    });
    console.log(newPrintData);

    setPrintData(newPrintData);
    setisLoading(false);
    setOpenPrintModal(true);
  };

  const amzDataTableAG = useMemo(() => {
    return (
      <AGTable    
        showFilter={true}
        toolbar={
          <>
            <IconButton
              className="buttonIcon"
              disabled={selectedRows.length === 0}
              onClick={handlePreparePrint}
            >
              <BiPrinter color={selectedRows.length > 0 ? "blue" : "gray"} size={15} />
              Preview AMZ
            </IconButton>
          </>         }
        columns={column_amz_data}
        data={amzdatatable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onCellClick={(params: any) => {          
          //console.log(params)
        }} onSelectionChange={(params: any) => {
          setSelectedRows(params.api.getSelectedRows());
        }} />
    )
  }, [amzdatatable, isLoading, selectedRows]);

  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    (<div className="traAMZ">
      <div className="tracuuDataInspection">
        {showhidesearchdiv && (
          <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
                  <b>ID công việc:</b>{" "}
                  <input
                    type="text"
                    placeholder="CG123456789123456"
                    value={plan_id}
                    onChange={(e) => setPlanID(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>DATA:</b>{" "}
                  <input
                    type="text"
                    placeholder="AZ:H3BS9IZEHFHJDHR1UDQOB9WTWU"
                    value={dataAMZ}
                    onChange={(e) => setDataAMZ(e.target.value)}
                  ></input>
                </label>
              </div>
            </div>
            <div className="formbutton">
              <label>
                <b>All Time:</b>
                <input
                  disabled={getUserData()?.EMPL_NO==='NHU1903'}
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00DF0E' }} onClick={() => {
                setisLoading(true);             
                handle_traAMZ();
              }}>Tra AMZ</Button>

            </div>
          </div>
        )}
        <div className="tracuuYCSXTable">
          {amzDataTableAG}
        </div>
      </div>
      <Dialog
        open={openPrintModal}
        onClose={() => setOpenPrintModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Print Preview ({printData.length} labels)</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center', height: '50px' }}>
             <TextField 
                label="Offset X (mm)" 
                type="number" 
                size="small" 
                value={printOffsetX} 
                onChange={(e) => setPrintOffsetX(Number(e.target.value))} 
                inputProps={{ step: "0.01" }}
             />
             <TextField 
                label="Offset Y (mm)" 
                type="number" 
                size="small" 
                value={printOffsetY} 
                onChange={(e) => setPrintOffsetY(Number(e.target.value))} 
                inputProps={{ step: "0.01" }}
             />
          </div>
          <div ref={labelprintref} className="print-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
            {printData.slice(0, 50).map((item, index) => {
              let max_W = 0;
              let max_H = 0;
              item.design.forEach((d) => {
                const right = Number(d.POS_X) + Number(d.SIZE_W);
                const bottom = Number(d.POS_Y) + Number(d.SIZE_H);
                if (right > max_W) max_W = right;
                if (bottom > max_H) max_H = bottom;
              });

              return (
                <div key={index} className="print-label-item" style={{ position: 'relative', width: max_W + 'mm', height: max_H + 'mm', border: '1px solid #ccc' }}>
                  {renderElement(item.design)}
                </div>
              );
            })}
            {printData.length > 50 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>
                    ... and {printData.length - 50} more labels. Click Print to print all.
                </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrintModal(false)}>Close</Button>
          <Button onClick={handlePrint} variant="contained" color="primary">
            Print
          </Button>
        </DialogActions>
      </Dialog>
      {isPrinting && printWindowContainer && createPortal(
        <div style={{ width: '100%', height: '100%' }}>
            {printData.map((item, index) => {
              let max_W = 0;
              let max_H = 0;
              item.design.forEach((d) => {
                const right = Number(d.POS_X) + Number(d.SIZE_W);
                const bottom = Number(d.POS_Y) + Number(d.SIZE_H);
                if (right > max_W) max_W = right;
                if (bottom > max_H) max_H = bottom;
              });
              
              return (
                <div key={index} className="print-label-item" style={{ position: 'relative', width: max_W + 'mm', height: max_H + 'mm', border: 'none', pageBreakAfter: 'always', breakAfter: 'page', left: `${printOffsetX}mm`, top: `${printOffsetY}mm` }}>
                  {renderElement(item.design)}
                </div>
              );
            })}
            <PrintTrigger onPrint={() => {
                printWindowRef.current?.print();
                setIsPrinting(false);
                setConfirmPrintOpen(true);
            }} />
        </div>,
        printWindowContainer
      )}
      <Dialog open={confirmPrintOpen} onClose={() => setConfirmPrintOpen(false)}>
        <DialogTitle>Xác nhận in</DialogTitle>
        <DialogContent>
          <div style={{ padding: '10px' }}>
            <p>Bạn đã gửi lệnh in <b>{printData.length}</b> tem.</p>
            <p>Vui lòng nhập số lượng tem thực tế đã in thành công:</p>
            <p>{` `}</p>
            <TextField
              type="number"
              label="Số lượng in thành công"
              value={printSuccessCount}
              onChange={(e) => setPrintSuccessCount(Number(e.target.value))}
              fullWidth
              inputProps={{ min: 0, max: printData.length }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPrintOpen(false)} color="error">Hủy</Button>
          <Button onClick={handleUpdatePrintStatus} variant="contained" color="success">Xác nhận Update</Button>
        </DialogActions>
      </Dialog>
    </div>)
  );
};
export default TraAMZ;

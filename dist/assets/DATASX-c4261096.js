import{r as S,ai as T,j as e,aj as B,I as z,ak as q,al as J,ad as M,S as x}from"./index-4ab6dde0.js";/* empty css               */import{D as Z,G as $,b as ee}from"./DataGrid-b5e0acb2.js";import"./TextField-db9fe3d0.js";import"./MenuItem-8199bc03.js";import"./Typography-b6d023f3.js";const de=()=>{const[le,g]=S.useState(!1),[i,I]=S.useState({XUATKHO_MET:0,XUATKHO_EA:0,SCANNED_MET:0,SCANNED_EA:0,PROCESS1_RESULT:0,PROCESS2_RESULT:0,SX_RESULT:0,INSPECTION_INPUT:0,INSPECTION_OUTPUT:0,LOSS_INS_OUT_VS_SCANNED_EA:0,LOSS_INS_OUT_VS_XUATKHO_EA:0});S.useState([]);const[P,d]=S.useState(!1);S.useState({trapo:!0,thempohangloat:!1,them1po:!1,them1invoice:!1,themycsx:!1,suaycsx:!1,inserttableycsx:!1,renderycsx:!1,renderbanve:!1,amazontab:!1});const[j,o]=S.useState(!1),[_,Y]=S.useState(T().format("YYYY-MM-DD")),[s,R]=S.useState(T().format("YYYY-MM-DD")),[E,Q]=S.useState(""),[h,W]=S.useState(""),[N,b]=S.useState("ALL"),[c,w]=S.useState("ALL"),[A,X]=S.useState(""),[f,y]=S.useState(""),[a,H]=S.useState(!1);S.useState("");const[C,m]=S.useState([]);S.useState("");const[U,K]=S.useState(""),[O,p]=S.useState(""),L=[{field:"PHAN_LOAI",headerName:"PHAN_LOAI",minWidth:120,flex:1},{field:"PLAN_ID",headerName:"PLAN_ID",minWidth:120,flex:1},{field:"PLAN_DATE",headerName:"PLAN_DATE",minWidth:120,flex:1},{field:"PROD_REQUEST_NO",headerName:"PROD_REQUEST_NO",minWidth:120,flex:1},{field:"G_CODE",headerName:"G_CODE",minWidth:120,flex:1},{field:"G_NAME",headerName:"G_NAME",minWidth:120,flex:1},{field:"G_NAME_KD",headerName:"G_NAME_KD",minWidth:120,flex:1},{field:"PLAN_QTY",headerName:"PLAN_QTY",minWidth:120,flex:1,renderCell:l=>e.jsx("span",{style:{color:"blue"},children:l.row.PLAN_QTY.toLocaleString("en-US")})},{field:"PLAN_EQ",headerName:"PLAN_EQ",minWidth:120,flex:1},{field:"PLAN_FACTORY",headerName:"PLAN_FACTORY",minWidth:120,flex:1},{field:"PROCESS_NUMBER",headerName:"PROCESS_NUMBER",minWidth:120,flex:1},{field:"STEP",headerName:"STEP",minWidth:120,flex:1},{field:"M_NAME",headerName:"M_NAME",minWidth:120,flex:1},{field:"WAREHOUSE_OUTPUT_QTY",headerName:"WAREHOUSE_OUTPUT_QTY",minWidth:150,flex:1,renderCell:l=>l.row.WAREHOUSE_OUTPUT_QTY!==null?e.jsx("span",{style:{color:"blue",fontWeight:"bold"},children:l.row.WAREHOUSE_OUTPUT_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"TOTAL_OUT_QTY",headerName:"TOTAL_OUT_QTY",minWidth:120,flex:1,renderCell:l=>l.row.TOTAL_OUT_QTY!==null?e.jsx("span",{style:{color:"red",fontWeight:"bold"},children:l.row.TOTAL_OUT_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"USED_QTY",headerName:"USED_QTY",minWidth:120,flex:1,renderCell:l=>l.row.USED_QTY!==null?e.jsx("span",{style:{color:"green",fontWeight:"bold"},children:l.row.USED_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"REMAIN_QTY",headerName:"REMAIN_QTY",minWidth:120,flex:1,renderCell:l=>l.row.REMAIN_QTY!==null?e.jsx("span",{style:{color:"blue"},children:l.row.REMAIN_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"PD",headerName:"PD",minWidth:120,flex:1},{field:"CAVITY",headerName:"CAVITY",minWidth:120,flex:1},{field:"SETTING_MET_TC",headerName:"SETTING_MET_TC",minWidth:120,flex:1,renderCell:l=>l.row.SETTING_MET_TC!==null?e.jsx("span",{style:{color:"blue"},children:l.row.SETTING_MET_TC.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"SETTING_MET",headerName:"SETTING_MET",minWidth:120,flex:1,renderCell:l=>l.row.SETTING_MET!==null?e.jsx("span",{style:{color:"blue"},children:l.row.SETTING_MET.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"WAREHOUSE_ESTIMATED_QTY",headerName:"WAREHOUSE_ESTIMATED_QTY",minWidth:120,flex:1,renderCell:l=>l.row.WAREHOUSE_ESTIMATED_QTY!==null?e.jsx("span",{style:{color:"blue"},children:l.row.WAREHOUSE_ESTIMATED_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"ESTIMATED_QTY_ST",headerName:"ESTIMATED_QTY_ST",minWidth:150,flex:1,renderCell:l=>l.row.ESTIMATED_QTY_ST!==null?e.jsx("span",{style:{color:"blue"},children:l.row.ESTIMATED_QTY_ST.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"ESTIMATED_QTY",headerName:"ESTIMATED_QTY",minWidth:120,flex:1,renderCell:l=>l.row.ESTIMATED_QTY!==null?e.jsx("span",{style:{color:"blue"},children:l.row.ESTIMATED_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"KETQUASX",headerName:"KETQUASX",minWidth:120,flex:1,renderCell:l=>l.row.KETQUASX!==null?e.jsx("span",{style:{color:"red",fontWeight:"bold"},children:l.row.KETQUASX.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"LOSS_SX_ST",headerName:"LOSS_SX_ST",minWidth:120,flex:1,valueGetter:l=>l.row.KETQUASX!==null&&l.row.ESTIMATED_QTY_ST!==null?(1-l.row.KETQUASX/l.row.ESTIMATED_QTY_ST).toLocaleString("en-US",{style:"percent"}):"0%"},{field:"LOSS_SX",headerName:"LOSS_SX",minWidth:120,flex:1,valueGetter:l=>l.row.KETQUASX!==null&&l.row.ESTIMATED_QTY!==null?(1-l.row.KETQUASX/l.row.ESTIMATED_QTY).toLocaleString("en-US",{style:"percent"}):"0%"},{field:"INS_INPUT",headerName:"INS_INPUT",minWidth:120,flex:1,renderCell:l=>l.row.INS_INPUT!==null?e.jsx("span",{style:{color:"blue"},children:l.row.INS_INPUT.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"LOSS_SX_KT",headerName:"LOSS_SX_KT",minWidth:120,flex:1,valueGetter:l=>l.row.KETQUASX!==null&&l.row.INS_INPUT!==null?(1-l.row.INS_INPUT/l.row.KETQUASX).toLocaleString("en-US",{style:"percent"}):"0%"},{field:"INS_OUTPUT",headerName:"INS_OUTPUT",minWidth:120,flex:1,renderCell:l=>l.row.INS_OUTPUT!==null?e.jsx("span",{style:{color:"blue"},children:l.row.INS_OUTPUT.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"LOSS_KT",headerName:"LOSS_KT",minWidth:120,flex:1,valueGetter:l=>l.row.INS_INPUT!==null&&l.row.INS_OUTPUT!==null?(1-l.row.INS_OUTPUT/l.row.INS_INPUT).toLocaleString("en-US",{style:"percent"}):"0%"},{field:"SETTING_START_TIME",headerName:"SETTING_START_TIME",minWidth:150,flex:1},{field:"MASS_START_TIME",headerName:"MASS_START_TIME",minWidth:150,flex:1},{field:"MASS_END_TIME",headerName:"MASS_END_TIME",minWidth:150,flex:1},{field:"RPM",headerName:"RPM",minWidth:120,flex:1},{field:"EQ_NAME_TT",headerName:"EQ_NAME_TT",minWidth:120,flex:1},{field:"SX_DATE",headerName:"SX_DATE",minWidth:120,flex:1},{field:"WORK_SHIFT",headerName:"WORK_SHIFT",minWidth:120,flex:1},{field:"INS_EMPL",headerName:"INS_EMPL",minWidth:120,flex:1},{field:"FACTORY",headerName:"FACTORY",minWidth:120,flex:1},{field:"BOC_KIEM",headerName:"BOC_KIEM",minWidth:120,flex:1},{field:"LAY_DO",headerName:"LAY_DO",minWidth:120,flex:1},{field:"MAY_HONG",headerName:"MAY_HONG",minWidth:120,flex:1},{field:"DAO_NG",headerName:"DAO_NG",minWidth:120,flex:1},{field:"CHO_LIEU",headerName:"CHO_LIEU",minWidth:120,flex:1},{field:"CHO_BTP",headerName:"CHO_BTP",minWidth:120,flex:1},{field:"HET_LIEU",headerName:"HET_LIEU",minWidth:120,flex:1},{field:"LIEU_NG",headerName:"LIEU_NG",minWidth:120,flex:1},{field:"CAN_HANG",headerName:"CAN_HANG",minWidth:120,flex:1},{field:"HOP_FL",headerName:"HOP_FL",minWidth:120,flex:1},{field:"CHO_QC",headerName:"CHO_QC",minWidth:120,flex:1},{field:"CHOT_BAOCAO",headerName:"CHOT_BAOCAO",minWidth:120,flex:1},{field:"CHUYEN_CODE",headerName:"CHUYEN_CODE",minWidth:120,flex:1},{field:"KHAC",headerName:"KHAC",minWidth:120,flex:1},{field:"REMARK",headerName:"REMARK",minWidth:120,flex:1}],v=[{field:"YCSX_STATUS",headerName:"YCSX_STATUS",minWidth:120,flex:1},{field:"PHAN_LOAI",headerName:"PHAN_LOAI",minWidth:120,flex:1},{field:"PROD_REQUEST_NO",headerName:"PROD_REQUEST_NO",width:80},{field:"G_CODE",headerName:"G_CODE",width:80},{field:"G_NAME",headerName:"G_NAME",width:180},{field:"G_NAME_KD",headerName:"G_NAME_KD",width:120},{field:"FACTORY",headerName:"FACTORY",width:80},{field:"EQ1",headerName:"EQ1",width:80},{field:"EQ2",headerName:"EQ2",width:80},{field:"PROD_REQUEST_DATE",headerName:"YCSX_DATE",width:120},{field:"PROD_REQUEST_QTY",headerName:"YCSX_QTY",width:80},{field:"M_NAME",headerName:"M_NAME",width:150},{field:"M_OUTPUT",headerName:"M_OUTPUT",width:80,renderCell:l=>l.row.M_OUTPUT!==null?e.jsx("span",{style:{color:"blue"},children:l.row.M_OUTPUT.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"SCANNED_QTY",headerName:"SCANNED_QTY",width:100,renderCell:l=>l.row.SCANNED_QTY!==null?e.jsx("span",{style:{color:"blue"},children:l.row.SCANNED_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"REMAIN_QTY",headerName:"REMAIN_QTY",width:110,renderCell:l=>l.row.REMAIN_QTY!==null?e.jsx("span",{style:{color:"blue"},children:l.row.REMAIN_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"USED_QTY",headerName:"USED_QTY",width:100,renderCell:l=>l.row.USED_QTY!==null?e.jsx("span",{style:{color:"blue"},children:l.row.USED_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"PD",headerName:"PD",width:80},{field:"CAVITY",headerName:"CAVITY",width:80},{field:"WAREHOUSE_ESTIMATED_QTY",headerName:"WAREHOUSE_ESTIMATED_QTY",width:150,renderCell:l=>l.row.WAREHOUSE_ESTIMATED_QTY!==null?e.jsx("span",{style:{color:"green"},children:l.row.WAREHOUSE_ESTIMATED_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"ESTIMATED_QTY",headerName:"ESTIMATED_QTY",width:120,renderCell:l=>l.row.ESTIMATED_QTY!==null?e.jsx("span",{style:{color:"green"},children:l.row.ESTIMATED_QTY.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"CD1",headerName:"CD1",width:100,renderCell:l=>l.row.CD1!==null?e.jsx("span",{style:{color:"green"},children:l.row.CD1.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"LOSS_SX1",headerName:"LOSS_SX1",minWidth:120,flex:1,renderCell:l=>l.row.LOSS_SX1!==null?e.jsx("span",{style:{color:"red"},children:l.row.LOSS_SX1.toLocaleString("en-US",{style:"percent"})}):e.jsx(e.Fragment,{})},{field:"CD2",headerName:"CD2",width:100,renderCell:l=>l.row.CD2!==null?e.jsx("span",{style:{color:"green"},children:l.row.CD2.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"LOSS_SX2",headerName:"LOSS_SX2",minWidth:120,flex:1,renderCell:l=>l.row.LOSS_SX2!==null?e.jsx("span",{style:{color:"red"},children:l.row.LOSS_SX2.toLocaleString("en-US",{style:"percent"})}):e.jsx(e.Fragment,{})},{field:"INS_INPUT",headerName:"INS_INPUT",width:100,renderCell:l=>l.row.INS_INPUT!==null?e.jsx("span",{style:{color:"green"},children:l.row.INS_INPUT.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"LOSS_SX3",headerName:"LOSS_SX3",minWidth:120,flex:1,renderCell:l=>l.row.LOSS_SX3!==null?e.jsx("span",{style:{color:"red"},children:l.row.LOSS_SX3.toLocaleString("en-US",{style:"percent"})}):e.jsx(e.Fragment,{})},{field:"INS_OUTPUT",headerName:"INS_OUTPUT",width:100,renderCell:l=>l.row.INS_OUTPUT!==null?e.jsx("span",{style:{color:"green"},children:l.row.INS_OUTPUT.toLocaleString("en-US")}):e.jsx(e.Fragment,{})},{field:"LOSS_SX4",headerName:"LOSS_SX4",minWidth:120,flex:1,renderCell:l=>l.row.LOSS_SX4!==null?e.jsx("span",{style:{color:"red"},children:l.row.LOSS_SX4.toLocaleString("en-US",{style:"percent"})}):e.jsx(e.Fragment,{})},{field:"TOTAL_LOSS",headerName:"TOTAL_LOSS",minWidth:120,flex:1,renderCell:l=>l.row.TOTAL_LOSS!==null?e.jsx("span",{style:{color:"red",fontWeight:"bold",fontSize:16},children:l.row.TOTAL_LOSS.toLocaleString("en-US",{style:"percent"})}):e.jsx(e.Fragment,{})},{field:"TOTAL_LOSS2",headerName:"TOTAL_LOSS2",minWidth:120,flex:1,renderCell:l=>l.row.TOTAL_LOSS2!==null?e.jsx("span",{style:{color:"red",fontWeight:"bold",fontSize:16},children:l.row.TOTAL_LOSS2.toLocaleString("en-US",{style:"percent"})}):e.jsx(e.Fragment,{})}],[F,D]=S.useState(L);function G(){return e.jsxs($,{children:[e.jsxs(z,{className:"buttonIcon",onClick:()=>{q(C,"Data SX Table")},children:[e.jsx(J,{color:"green",size:25}),"SAVE"]}),e.jsx(ee,{}),e.jsx("div",{className:"div",style:{fontSize:20,fontWeight:"bold"},children:"DATA SẢN XUẤT"})]})}const k=()=>{M("loadDataSX",{ALLTIME:a,FROM_DATE:_,TO_DATE:s,PROD_REQUEST_NO:A,PLAN_ID:f,M_NAME:U,M_CODE:O,G_NAME:E,G_CODE:h,FACTORY:c,PLAN_EQ:N}).then(l=>{if(l.data.tk_status!=="NG"){const n=l.data.data.map((t,u)=>({...t,PLAN_DATE:T.utc(t.PLAN_DATE).format("YYYY-MM-DD"),SETTING_START_TIME:t.SETTING_START_TIME===null?"":T.utc(t.SETTING_START_TIME).format("YYYY-MM-DD HH:mm:ss"),MASS_START_TIME:t.MASS_START_TIME===null?"":T.utc(t.MASS_START_TIME).format("YYYY-MM-DD HH:mm:ss"),MASS_END_TIME:t.MASS_END_TIME===null?"":T.utc(t.MASS_END_TIME).format("YYYY-MM-DD HH:mm:ss"),SX_DATE:t.SX_DATE===null?"":T.utc(t.SX_DATE).format("YYYY-MM-DD"),LOSS_SX_ST:t.KETQUASX!==null&&t.ESTIMATED_QTY_ST!==null?t.ESTIMATED_QTY_ST!==0?1-t.KETQUASX/t.ESTIMATED_QTY_ST:-1e16:0,LOSS_SX:t.KETQUASX!==null&&t.ESTIMATED_QTY!==null?t.ESTIMATED_QTY!==0?1-t.KETQUASX/t.ESTIMATED_QTY:-1e16:0,LOSS_SX_KT:t.KETQUASX!==null&&t.INS_INPUT!==null?t.KETQUASX!==0?1-t.INS_INPUT/t.KETQUASX:-1e16:0,LOSS_KT:t.INS_INPUT!==null&&t.INS_OUTPUT!==null?t.INS_INPUT!==0?1-t.INS_OUTPUT/t.INS_INPUT:-1e16:0,id:u}));let r={XUATKHO_MET:0,XUATKHO_EA:0,SCANNED_MET:0,SCANNED_EA:0,PROCESS1_RESULT:0,PROCESS2_RESULT:0,SX_RESULT:0,INSPECTION_INPUT:0,INSPECTION_OUTPUT:0,LOSS_INS_OUT_VS_SCANNED_EA:0,LOSS_INS_OUT_VS_XUATKHO_EA:0};for(let t=0;t<n.length;t++)r.XUATKHO_MET+=n[t].WAREHOUSE_OUTPUT_QTY,r.XUATKHO_EA+=n[t].WAREHOUSE_ESTIMATED_QTY,r.SCANNED_MET+=n[t].USED_QTY,r.SCANNED_EA+=n[t].ESTIMATED_QTY,r.PROCESS1_RESULT+=n[t].PROCESS_NUMBER===1&&n[t].STEP===0?n[t].KETQUASX:0,r.PROCESS2_RESULT+=n[t].PROCESS_NUMBER===2&&n[t].STEP===0?n[t].KETQUASX:0,r.INSPECTION_INPUT+=n[t].INS_INPUT,r.INSPECTION_OUTPUT+=n[t].INS_OUTPUT;r.LOSS_INS_OUT_VS_SCANNED_EA=1-r.INSPECTION_OUTPUT/r.SCANNED_EA,r.LOSS_INS_OUT_VS_XUATKHO_EA=1-r.INSPECTION_OUTPUT/r.XUATKHO_EA,I(r),m(n),d(!0),o(!1)}else x.fire("Thông báo"," Có lỗi : "+l.data.message,"error")}).catch(l=>{console.log(l)})},V=()=>{M("loadDataSX_YCSX",{ALLTIME:a,FROM_DATE:_,TO_DATE:s,PROD_REQUEST_NO:A,PLAN_ID:f,M_NAME:U,M_CODE:O,G_NAME:E,G_CODE:h,FACTORY:c,PLAN_EQ:N}).then(l=>{if(l.data.tk_status!=="NG"){const n=l.data.data.map((t,u)=>({...t,PROD_REQUEST_DATE:T.utc(t.PROD_REQUEST_DATE).format("YYYY-MM-DD"),id:u}));let r={XUATKHO_MET:0,XUATKHO_EA:0,SCANNED_MET:0,SCANNED_EA:0,PROCESS1_RESULT:0,PROCESS2_RESULT:0,SX_RESULT:0,INSPECTION_INPUT:0,INSPECTION_OUTPUT:0,LOSS_INS_OUT_VS_SCANNED_EA:0,LOSS_INS_OUT_VS_XUATKHO_EA:0};for(let t=0;t<n.length;t++)r.XUATKHO_MET+=n[t].M_OUTPUT,r.XUATKHO_EA+=n[t].WAREHOUSE_ESTIMATED_QTY,r.SCANNED_MET+=n[t].USED_QTY,r.SCANNED_EA+=n[t].ESTIMATED_QTY,r.PROCESS1_RESULT+=n[t].CD1,r.PROCESS2_RESULT+=n[t].CD2,r.SX_RESULT+=n[t].EQ2==="NO"||n[t].EQ2==="NA"||n[t].EQ2===null?n[t].CD1:n[t].CD2,r.INSPECTION_INPUT+=n[t].INS_INPUT,r.INSPECTION_OUTPUT+=n[t].INS_OUTPUT,r.LOSS_INS_OUT_VS_SCANNED_EA=1-r.INSPECTION_OUTPUT/r.SCANNED_EA,r.LOSS_INS_OUT_VS_XUATKHO_EA=1-r.INSPECTION_OUTPUT/r.XUATKHO_EA;I(r),g(!0),m(n),d(!0),o(!1)}else x.fire("Thông báo"," Có lỗi : "+l.data.message,"error")}).catch(l=>{console.log(l),x.fire("Thông báo"," Có lỗi : "+l,"error")})};return S.useEffect(()=>{},[]),e.jsx("div",{className:"datasx",children:e.jsxs("div",{className:"tracuuDataInspection",children:[e.jsxs("div",{className:"tracuuDataInspectionform",children:[e.jsxs("div",{className:"forminput",children:[e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Từ ngày:"}),e.jsx("input",{type:"date",value:_.slice(0,10),onChange:l=>Y(l.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Tới ngày:"})," ",e.jsx("input",{type:"date",value:s.slice(0,10),onChange:l=>R(l.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Code KD:"})," ",e.jsx("input",{type:"text",placeholder:"GH63-xxxxxx",value:E,onChange:l=>Q(l.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Code CMS:"})," ",e.jsx("input",{type:"text",placeholder:"7C123xxx",value:h,onChange:l=>W(l.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Tên Liệu:"})," ",e.jsx("input",{type:"text",placeholder:"SJ-203020HC",value:U,onChange:l=>K(l.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Mã Liệu CMS:"})," ",e.jsx("input",{type:"text",placeholder:"A123456",value:O,onChange:l=>p(l.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Số YCSX:"})," ",e.jsx("input",{type:"text",placeholder:"1F80008",value:A,onChange:l=>X(l.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Số chỉ thị:"})," ",e.jsx("input",{type:"text",placeholder:"A123456",value:f,onChange:l=>y(l.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"FACTORY:"}),e.jsxs("select",{name:"phanloai",value:c,onChange:l=>{w(l.target.value)},children:[e.jsx("option",{value:"ALL",children:"ALL"}),e.jsx("option",{value:"NM1",children:"NM1"}),e.jsx("option",{value:"NM2",children:"NM2"})]})]}),e.jsxs("label",{children:[e.jsx("b",{children:"MACHINE:"}),e.jsxs("select",{name:"machine",value:N,onChange:l=>{b(l.target.value)},children:[e.jsx("option",{value:"ALL",children:"ALL"}),e.jsx("option",{value:"FR",children:"FR"}),e.jsx("option",{value:"SR",children:"SR"}),e.jsx("option",{value:"DC",children:"DC"}),e.jsx("option",{value:"ED",children:"ED"})]})]})]})]}),e.jsxs("div",{className:"formbutton",children:[e.jsxs("label",{children:[e.jsx("b",{children:"All Time:"}),e.jsx("input",{type:"checkbox",name:"alltimecheckbox",defaultChecked:a,onChange:()=>H(!a)})]}),e.jsx("button",{className:"tranhatky",onClick:()=>{o(!0),d(!1),D(L),k()},children:"TRA CHỈ THỊ"}),e.jsx("button",{className:"tranhatky",onClick:()=>{o(!0),d(!1),D(v),V()},children:"TRA YCSX"})]})]}),e.jsx("div",{className:"losstable",children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"1.XUAT KHO MET"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"2.XUAT KHO EA"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"3.USED MET"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"4.USED EA"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"5.PROCESS 1 RESULT"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"6.PROCESS 2 RESULT"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"6.SX RESULT"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"7.INSPECTION INPUT"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"8.INSPECTION OUTPUT"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"9.TOTAL_LOSS (8 vs 4) %"}),e.jsx("th",{style:{color:"black",fontWeight:"bold"},children:"10.TOTAL_LOSS2 (8 vs2) %"})]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{style:{color:"blue",fontWeight:"bold"},children:i.XUATKHO_MET.toLocaleString("en-US")}),e.jsx("td",{style:{color:"blue",fontWeight:"bold"},children:i.XUATKHO_EA.toLocaleString("en-US")}),e.jsx("td",{style:{color:"#fc2df6",fontWeight:"bold"},children:i.SCANNED_MET.toLocaleString("en-US")}),e.jsx("td",{style:{color:"#fc2df6",fontWeight:"bold"},children:i.SCANNED_EA.toLocaleString("en-US")}),e.jsx("td",{style:{color:"green",fontWeight:"bold"},children:i.PROCESS1_RESULT.toLocaleString("en-US")}),e.jsx("td",{style:{color:"green",fontWeight:"bold"},children:i.PROCESS2_RESULT.toLocaleString("en-US")}),e.jsx("td",{style:{color:"green",fontWeight:"bold"},children:i.SX_RESULT.toLocaleString("en-US")}),e.jsx("td",{style:{color:"green",fontWeight:"bold"},children:i.INSPECTION_INPUT.toLocaleString("en-US")}),e.jsx("td",{style:{color:"green",fontWeight:"bold"},children:i.INSPECTION_OUTPUT.toLocaleString("en-US")}),e.jsx("td",{style:{color:"#b56600",fontWeight:"bold"},children:(i.LOSS_INS_OUT_VS_SCANNED_EA*100).toLocaleString("en-US")}),e.jsx("td",{style:{color:"red",fontWeight:"bold"},children:(i.LOSS_INS_OUT_VS_XUATKHO_EA*100).toLocaleString("en-US")})]})})]})}),e.jsx("div",{className:"tracuuYCSXTable",children:P&&e.jsx(Z,{sx:{fontSize:12,flex:1},components:{Toolbar:G,LoadingOverlay:B},getRowId:l=>l.id,loading:j,rowHeight:30,rows:C,columns:F,rowsPerPageOptions:[5,10,50,100,500,1e3,5e3,1e4,5e5]})})]})})};export{de as default};
import{r as s,k as _e,ai as g,a_ as Ee,j as e,aT as T,aj as H,I as f,aV as Ae,a$ as ve,b0 as Le,ak as B,al as Fe,aW as Me,aZ as Ue,aX as Ge,aY as ke,ad as m,S as d}from"./index-4ab6dde0.js";import{D as Y,G as V,b as z}from"./DataGrid-b5e0acb2.js";import{G as X,a as J,b as Q}from"./GridToolbarFilterButton-ec6062d3.js";import"./TextField-db9fe3d0.js";import"./MenuItem-8199bc03.js";import"./Typography-b6d023f3.js";const Xe=()=>{const[c,D]=s.useState({trapo:!0,thempohangloat:!1,them1po:!1,them1invoice:!1,testinvoicetable:!1}),o=_e(t=>t.totalSlice.userData),[n,S]=s.useState([]),[N,u]=s.useState(!1),[Oe,W]=s.useState([]),[b,$]=s.useState(g().format("YYYY-MM-DD")),[y,Z]=s.useState(g().format("YYYY-MM-DD")),[P,q]=s.useState(""),[j,ee]=s.useState(""),[_,te]=s.useState(""),[E,ae]=s.useState(""),[A,le]=s.useState(""),[v,ne]=s.useState(""),[C,re]=s.useState(!0),[ie,Ke]=s.useState(!0),[L,oe]=s.useState(""),[F,se]=s.useState(""),[M,de]=s.useState(""),[ce,he]=s.useState(""),[x,ue]=s.useState([]),[w,U]=s.useState([]),[G,k]=s.useState(!1),me=[{field:"PLAN_ID",headerName:"PLAN_ID",width:80},{field:"EMPL_NAME",headerName:"EMPL_NAME",width:180},{field:"CUST_NAME_KD",headerName:"CUST_NAME_KD",width:120},{field:"G_CODE",headerName:"G_CODE",width:90},{field:"G_NAME_KD",headerName:"G_NAME_KD",width:120},{field:"G_NAME",headerName:"G_NAME",width:120,renderCell:t=>e.jsx("span",{style:{color:"red"},children:e.jsx("b",{children:t.row.G_NAME})})},{field:"PROD_TYPE",headerName:"PROD_TYPE",width:100},{field:"PROD_MAIN_MATERIAL",headerName:"PROD_MAIN_MATERIAL",width:120},{field:"PLAN_DATE",type:"date",headerName:"PLAN_DATE",width:120},{field:"D1",type:"number",headerName:"D1",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D1.toLocaleString("en-US")})})},{field:"D2",type:"number",headerName:"D2",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D2.toLocaleString("en-US")})})},{field:"D3",type:"number",headerName:"D3",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D3.toLocaleString("en-US")})})},{field:"D4",type:"number",headerName:"D4",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D4.toLocaleString("en-US")})})},{field:"D5",type:"number",headerName:"D5",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D5.toLocaleString("en-US")})})},{field:"D6",type:"number",headerName:"D6",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D6.toLocaleString("en-US")})})},{field:"D7",type:"number",headerName:"D7",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D7.toLocaleString("en-US")})})},{field:"D8",type:"number",headerName:"D8",width:80,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D8.toLocaleString("en-US")})})},{field:"REMARK",headerName:"REMARK",width:120}],pe=[{field:"EMPL_NO",headerName:"EMPL_NO",width:120},{field:"CUST_CD",headerName:"CUST_CD",width:120},{field:"G_CODE",headerName:"G_CODE",width:120},{field:"PLAN_DATE",type:"date",headerName:"PLAN_DATE",width:120},{field:"D1",type:"number",headerName:"D1",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D1.toLocaleString("en-US")})})},{field:"D2",type:"number",headerName:"D2",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D2.toLocaleString("en-US")})})},{field:"D3",type:"number",headerName:"D3",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D3.toLocaleString("en-US")})})},{field:"D4",type:"number",headerName:"D4",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D4.toLocaleString("en-US")})})},{field:"D5",type:"number",headerName:"D5",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D5.toLocaleString("en-US")})})},{field:"D6",type:"number",headerName:"D6",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D6.toLocaleString("en-US")})})},{field:"D7",type:"number",headerName:"D7",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D7.toLocaleString("en-US")})})},{field:"D8",type:"number",headerName:"D8",width:120,renderCell:t=>e.jsx("span",{style:{color:"blue"},children:e.jsx("b",{children:t.row.D8.toLocaleString("en-US")})})},{field:"REMARK",headerName:"REMARK",width:120},{field:"CHECKSTATUS",headerName:"CHECKSTATUS",width:200,renderCell:t=>t.row.CHECKSTATUS.slice(0,2)==="OK"?e.jsx("span",{style:{color:"green"},children:e.jsx("b",{children:t.row.CHECKSTATUS})}):e.jsx("span",{style:{color:"red"},children:e.jsx("b",{children:t.row.CHECKSTATUS})})}];function ge(){return e.jsxs(V,{children:[e.jsx(X,{}),e.jsx(J,{}),e.jsx(Q,{}),e.jsx("button",{className:"saveexcelbutton",onClick:()=>{B(n,"Uploaded Plan")},children:"Save Excel"}),e.jsx(z,{})]})}function fe(){return e.jsxs(V,{children:[e.jsx(X,{}),e.jsx(J,{}),e.jsx(Q,{}),e.jsxs(f,{className:"buttonIcon",onClick:()=>{B(x,"Plan Table")},children:[e.jsx(Fe,{color:"green",size:25}),"SAVE"]}),e.jsxs(f,{className:"buttonIcon",onClick:()=>{T(o==null?void 0:o.EMPL_NO,o==null?void 0:o.MAINDEPTNAME,["KD"],ye)},children:[e.jsx(Me,{color:"red",size:25}),"XÓA PLAN"]}),e.jsx(z,{}),e.jsxs(f,{className:"buttonIcon",onClick:()=>{k(!G)},children:[e.jsx(Ue,{color:"#ff33bb",size:25}),"Pivot"]})]})}const xe=t=>{if(t.preventDefault(),t.target.files){const a=new FileReader;a.onload=l=>{const h=l.target.result,p=Ge(h,{type:"array"}),i=p.SheetNames[0],je=p.Sheets[i],K=ke.sheet_to_json(je);let I=Object.keys(K[0]).map((r,R)=>({field:r,headerName:r,width:150}));I.push({field:"CHECKSTATUS",headerName:"CHECKSTATUS",width:350}),W(I),S(K.map((r,R)=>({...r,id:R,CHECKSTATUS:"Waiting",D1:r.D1===void 0||r.D1===""?0:r.D1,D2:r.D2===void 0||r.D2===""?0:r.D2,D3:r.D3===void 0||r.D2===""?0:r.D3,D4:r.D4===void 0||r.D2===""?0:r.D4,D5:r.D5===void 0||r.D2===""?0:r.D5,D6:r.D6===void 0||r.D2===""?0:r.D6,D7:r.D7===void 0||r.D2===""?0:r.D7,D8:r.D8===void 0||r.D2===""?0:r.D8})))},a.readAsArrayBuffer(t.target.files[0])}},we=()=>{u(!0),m("traPlanDataFull",{alltime:C,justPoBalance:ie,start_date:b,end_date:y,cust_name:E,codeCMS:j,codeKD:P,prod_type:A,empl_name:_,po_no:L,over:M,id:v,material:F}).then(t=>{if(t.data.tk_status!=="NG"){const a=t.data.data.map((l,h)=>({...l,PLAN_DATE:l.PLAN_DATE.slice(0,10)}));ue(a),u(!1),d.fire("Thông báo","Đã load "+t.data.data.length+" dòng","success")}else d.fire("Thông báo","Nội dung: "+t.data.message,"error"),u(!1)}).catch(t=>{console.log(t)})},De=async()=>{u(!0);let t=n;for(let a=0;a<n.length;a++){let l=0;await m("checkPlanExist",{G_CODE:n[a].G_CODE,CUST_CD:n[a].CUST_CD,PLAN_DATE:n[a].PLAN_DATE}).then(i=>{i.data.tk_status!=="NG"&&(l=1)}).catch(i=>{console.log(i)});let h=g(),p=g(n[a].PLAN_DATE);h<p&&(l=2),await m("checkGCodeVer",{G_CODE:n[a].G_CODE}).then(i=>{i.data.tk_status!=="NG"?i.data.data[0].USE_YN==="Y"||(l=3):l=4}).catch(i=>{console.log(i)}),l===0?t[a].CHECKSTATUS="OK":l===1?t[a].CHECKSTATUS="NG:Plan đã tồn tại":l===2?t[a].CHECKSTATUS="NG: Ngày Plan không được sau ngày hôm nay":l===3?t[a].CHECKSTATUS="NG: Ver này đã bị khóa":l===4?t[a].CHECKSTATUS="NG: Không có code CMS này":l===5&&(t[a].CHECKSTATUS="NG: Giao hàng nhiều hơn PO")}u(!1),d.fire("Thông báo","Đã hoàn thành check Plan hàng loạt","success"),S(t)},Se=async()=>{u(!0);let t=n;for(let a=0;a<n.length;a++){let l=0;await m("checkPlanExist",{G_CODE:n[a].G_CODE,CUST_CD:n[a].CUST_CD,PLAN_DATE:n[a].PLAN_DATE}).then(i=>{i.data.tk_status!=="NG"&&(l=1)}).catch(i=>{console.log(i)});let h=g(),p=g(n[a].PLAN_DATE);h<p&&(l=2),await m("checkGCodeVer",{G_CODE:n[a].G_CODE}).then(i=>{i.data.tk_status!=="NG"?i.data.data[0].USE_YN==="Y"||(l=3):l=4}).catch(i=>{console.log(i)}),l===0?await m("insert_plan",{REMARK:n[a].REMARK,G_CODE:n[a].G_CODE,CUST_CD:n[a].CUST_CD,PLAN_DATE:n[a].PLAN_DATE,EMPL_NO:o==null?void 0:o.EMPL_NO,D1:n[a].D1,D2:n[a].D2,D3:n[a].D3,D4:n[a].D4,D5:n[a].D5,D6:n[a].D6,D7:n[a].D7,D8:n[a].D8}).then(i=>{console.log(i.data.tk_status),i.data.tk_status!=="NG"?t[a].CHECKSTATUS="OK":(l=5,t[a].CHECKSTATUS="NG: Lỗi SQL: "+i.data.message)}).catch(i=>{console.log(i)}):l===1?t[a].CHECKSTATUS="NG:Plan đã tồn tại":l===2?t[a].CHECKSTATUS="NG: Ngày Plan không được sau ngày hôm nay":l===3?t[a].CHECKSTATUS="NG: Ver này đã bị khóa":l===4?t[a].CHECKSTATUS="NG: Không có code CMS này":l===5&&(t[a].CHECKSTATUS="NG: Giao hàng nhiều hơn PO")}u(!1),d.fire("Thông báo","Đã hoàn thành check Plan hàng loạt","success"),S(t)},Ce=()=>{d.fire({title:"Chắc chắn muốn thêm Plan hàng loạt ?",text:"Thêm rồi mà sai, sửa là hơi vất đấy",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Vẫn thêm!"}).then(t=>{t.isConfirmed&&(d.fire("Tiến hành thêm","Đang thêm Plan hàng loạt","success"),Se())})},Te=()=>{d.fire({title:"Chắc chắn muốn check Plan hàng loạt ?",text:"Sẽ bắt đầu check Plan hàng loạt",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Vẫn check!"}).then(t=>{t.isConfirmed&&(d.fire("Tiến hành check","Đang check Plan hàng loạt","success"),De())})},O=t=>{t===1?D({...c,trapo:!0,thempohangloat:!1,them1po:!1,them1invoice:!1,testinvoicetable:!1}):t===2?D({...c,trapo:!1,thempohangloat:!0,them1po:!1,them1invoice:!1,testinvoicetable:!1}):t===3&&D({...c,trapo:!1,thempohangloat:!1,them1po:!1,them1invoice:!1,testinvoicetable:!0})},Ne=t=>{const a=new Set(t);let l=x.filter(h=>a.has(h.PLAN_ID));l.length>0?U(l):U([])},be=async()=>{if(w.length>=1){let t=!1;for(let a=0;a<w.length;a++)w[a].EMPL_NO===(o==null?void 0:o.EMPL_NO)&&await m("delete_plan",{PLAN_ID:w[a].PLAN_ID}).then(l=>{console.log(l.data.tk_status),l.data.tk_status!=="NG"||(t=!0)}).catch(l=>{console.log(l)});t?d.fire("Thông báo","Có lỗi SQL!","error"):d.fire("Thông báo","Xóa Plan thành công (chỉ Plan của người đăng nhập)!","success")}else d.fire("Thông báo","Chọn ít nhất 1 Plan để xóa !","error")},ye=()=>{d.fire({title:"Chắc chắn muốn xóa Plan đã chọn ?",text:"Sẽ chỉ xóa Plan do bạn up lên",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Vẫn Xóa!"}).then(t=>{t.isConfirmed&&(d.fire("Tiến hành Xóa","Đang Xóa Plan hàng loạt","success"),T(o==null?void 0:o.EMPL_NO,o==null?void 0:o.MAINDEPTNAME,["KD"],be))})},Pe=new Ee({fields:[{caption:"PLAN_ID",width:80,dataField:"PLAN_ID",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"EMPL_NAME",width:80,dataField:"EMPL_NAME",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"EMPL_NO",width:80,dataField:"EMPL_NO",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"CUST_NAME_KD",width:80,dataField:"CUST_NAME_KD",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"CUST_CD",width:80,dataField:"CUST_CD",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"G_CODE",width:80,dataField:"G_CODE",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"G_NAME_KD",width:80,dataField:"G_NAME_KD",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"G_NAME",width:80,dataField:"G_NAME",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"PROD_TYPE",width:80,dataField:"PROD_TYPE",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"PROD_MAIN_MATERIAL",width:80,dataField:"PROD_MAIN_MATERIAL",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"PLAN_DATE",width:80,dataField:"PLAN_DATE",allowSorting:!0,allowFiltering:!0,dataType:"date",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D1",width:80,dataField:"D1",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D2",width:80,dataField:"D2",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D3",width:80,dataField:"D3",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D4",width:80,dataField:"D4",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D5",width:80,dataField:"D5",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D6",width:80,dataField:"D6",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D7",width:80,dataField:"D7",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"D8",width:80,dataField:"D8",allowSorting:!0,allowFiltering:!0,dataType:"number",summaryType:"sum",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"REMARK",width:80,dataField:"REMARK",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}},{caption:"",width:80,dataField:"",allowSorting:!0,allowFiltering:!0,dataType:"string",summaryType:"count",format:"fixedPoint",headerFilter:{allowSearch:!0,height:500,width:300}}],store:x});return s.useEffect(()=>{},[]),e.jsxs("div",{className:"planmanager",children:[e.jsxs("div",{className:"mininavbar",children:[e.jsx("div",{className:"mininavitem",onClick:()=>O(1),style:{backgroundColor:c.trapo===!0?"#02c712":"#abc9ae",color:(c.trapo===!0,"yellow")},children:e.jsx("span",{className:"mininavtext",children:"Tra PLAN"})}),e.jsx("div",{className:"mininavitem",onClick:()=>T(o==null?void 0:o.EMPL_NO,o==null?void 0:o.MAINDEPTNAME,["KD"],()=>{O(2)}),style:{backgroundColor:c.thempohangloat===!0?"#02c712":"#abc9ae",color:(c.thempohangloat===!0,"yellow")},children:e.jsx("span",{className:"mininavtext",children:"Thêm PLAN"})})]}),c.thempohangloat&&e.jsx("div",{className:"newplan",children:e.jsxs("div",{className:"batchnewplan",children:[e.jsx("h3",{children:"Thêm Plan Hàng Loạt"}),e.jsxs("form",{className:"formupload",children:[e.jsxs("label",{htmlFor:"upload",children:[e.jsx("b",{children:"Chọn file Excel: "}),e.jsx("input",{className:"selectfilebutton",type:"file",name:"upload",id:"upload",onChange:t=>{xe(t)}})]}),e.jsx("div",{className:"checkpobutton",onClick:t=>{t.preventDefault(),Te()},children:"Check Plan"}),e.jsx("div",{className:"uppobutton",onClick:t=>{t.preventDefault(),Ce()},children:"Up Plan"})]}),e.jsx("div",{className:"insertPlanTable",children:e.jsx(Y,{sx:{fontSize:"0.7rem"},components:{Toolbar:ge,LoadingOverlay:H},loading:N,rowHeight:35,rows:n,columns:pe,rowsPerPageOptions:[5,10,50,100,500,1e3,5e3,1e4,1e5],editMode:"row"})})]})}),c.trapo&&e.jsxs("div",{className:"tracuuPlan",children:[e.jsxs("div",{className:"tracuuPlanform",children:[e.jsxs("div",{className:"forminput",children:[e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Từ ngày:"}),e.jsx("input",{type:"date",value:b.slice(0,10),onChange:t=>$(t.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Tới ngày:"})," ",e.jsx("input",{type:"date",value:y.slice(0,10),onChange:t=>Z(t.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Code KD:"})," ",e.jsx("input",{type:"text",placeholder:"GH63-xxxxxx",value:P,onChange:t=>q(t.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Code CMS:"})," ",e.jsx("input",{type:"text",placeholder:"7C123xxx",value:j,onChange:t=>ee(t.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Tên nhân viên:"})," ",e.jsx("input",{type:"text",placeholder:"Trang",value:_,onChange:t=>te(t.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Khách:"})," ",e.jsx("input",{type:"text",placeholder:"SEVT",value:E,onChange:t=>ae(t.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Loại sản phẩm:"})," ",e.jsx("input",{type:"text",placeholder:"TSP",value:A,onChange:t=>le(t.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"ID:"})," ",e.jsx("input",{type:"text",placeholder:"12345",value:v,onChange:t=>ne(t.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"PO NO:"})," ",e.jsx("input",{type:"text",placeholder:"123abc",value:L,onChange:t=>oe(t.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Vật liệu:"})," ",e.jsx("input",{type:"text",placeholder:"SJ-203020HC",value:F,onChange:t=>se(t.target.value)})]})]}),e.jsxs("div",{className:"forminputcolumn",children:[e.jsxs("label",{children:[e.jsx("b",{children:"Over/OK:"})," ",e.jsx("input",{type:"text",placeholder:"OVER",value:M,onChange:t=>de(t.target.value)})]}),e.jsxs("label",{children:[e.jsx("b",{children:"Invoice No:"})," ",e.jsx("input",{type:"text",placeholder:"số invoice",value:ce,onChange:t=>he(t.target.value)})]})]})]}),e.jsxs("div",{className:"formbutton",children:[e.jsxs("label",{children:[e.jsx("b",{children:"All Time:"}),e.jsx("input",{type:"checkbox",name:"alltimecheckbox",defaultChecked:C,onChange:()=>re(!C)})]}),e.jsxs(f,{className:"buttonIcon",onClick:()=>{we()},children:[e.jsx(Ae,{color:"green",size:30}),"Search"]})]})]}),e.jsx("div",{className:"tracuuPlanTable",children:e.jsx(Y,{sx:{fontSize:"0.7rem"},components:{Toolbar:fe,LoadingOverlay:H},loading:N,rowHeight:30,rows:x,columns:me,rowsPerPageOptions:[5,10,50,100,500,1e3,5e3,1e4,1e5],editMode:"row",getRowId:t=>t.PLAN_ID,checkboxSelection:!0,disableSelectionOnClick:!0,onSelectionModelChange:t=>{Ne(t)}})})]}),G&&e.jsxs("div",{className:"pivottable1",children:[e.jsxs(f,{className:"buttonIcon",onClick:()=>{k(!1)},children:[e.jsx(ve,{color:"blue",size:25}),"Close"]}),e.jsx(Le,{datasource:Pe,tableID:"invoicetablepivot"})]})]})};export{Xe as default};
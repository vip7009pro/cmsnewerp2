import{r as i,k as Ae,j as t,aj as D,I as E,ak as j,al as S,aT as F,b7 as Oe,S as r,bv as Me,ad as _}from"./index-4ab6dde0.js";import{D as I,B as fe,G as v,b as p}from"./DataGrid-b5e0acb2.js";import"./TextField-db9fe3d0.js";import"./MenuItem-8199bc03.js";import"./Typography-b6d023f3.js";const Re=()=>{const[Ee,R]=i.useState([]),[be,w]=i.useState([]),[ge,B]=i.useState([]),[Y,X]=i.useState([]);i.useState({CUST_CD:"0000",PROD_PROJECT:"",PROD_MODEL:"",CODE_12:"7",PROD_TYPE:"TSP",G_NAME_KD:"",DESCR:"",PROD_MAIN_MATERIAL:"",G_NAME:"",G_LENGTH:0,G_WIDTH:0,PD:0,G_C:0,G_C_R:0,G_CG:0,G_LG:0,G_SG_L:0,G_SG_R:0,PACK_DRT:"1",KNIFE_TYPE:0,KNIFE_LIFECYCLE:0,KNIFE_PRICE:0,CODE_33:"02",ROLE_EA_QTY:0,RPM:0,PIN_DISTANCE:0,PROCESS_TYPE:"",EQ1:"NA",EQ2:"NA",PROD_DIECUT_STEP:0,PROD_PRINT_TIMES:0,REMK:"",USE_YN:"N",G_CODE:"-------"});const[b,g]=i.useState([]),[h,O]=i.useState([]),[C,H]=i.useState("7A07994A"),m=Ae(e=>e.totalSlice.userData),[x,d]=i.useState(!1),[P,Q]=i.useState(""),[l,Ce]=i.useState(!1),[A,Z]=i.useState([]),[T,W]=i.useState([]),[xe,V]=i.useState([]),[Te,J]=i.useState([]),[u,U]=i.useState(""),[$,k]=i.useState(""),[M,z]=i.useState(""),[f,L]=i.useState(""),[q,Ge]=i.useState([{field:"id",headerName:"ID",width:70,editable:l},{field:"G_CODE",headerName:"G_CODE",width:80,editable:l},{field:"G_NAME",headerName:"G_NAME",flex:1,minWidth:250,editable:l},{field:"G_NAME_KD",headerName:"G_NAME_KD",width:120,editable:l}]),[ee,De]=i.useState([{field:"id",headerName:"ID",width:60,editable:l},{field:"G_NAME",headerName:"G_NAME",width:230,editable:l},{field:"G_NAME_KD",headerName:"G_NAME_KD",width:120,editable:l},{field:"G_CODE",headerName:"G_CODE",width:110,editable:l}]),[G,te]=i.useState([{field:"id",headerName:"ID",width:60,editable:l},{field:"G_CODE",headerName:"G_CODE",width:110,editable:l},{field:"G_NAME",headerName:"G_NAME",width:230,editable:l},{field:"G_CODE_MAU",headerName:"G_CODE_MAU",width:120,editable:l},{field:"TEN_MAU",headerName:"TEN_MAU",width:150,editable:l},{field:"DOITUONG_NO",headerName:"DOITUONG_NO",width:120,editable:l},{field:"DOITUONG_NAME",headerName:"DOITUONG_NAME",width:120,editable:l},{field:"GIATRI",headerName:"GIATRI",width:120,editable:l},{field:"REMARK",headerName:"REMARK",width:120,editable:l}]);function ae(){return t.jsxs(v,{children:[t.jsxs(E,{className:"buttonIcon",onClick:()=>{j(A,"Code Info Table")},children:[t.jsx(S,{color:"green",size:25}),"SAVE"]}),t.jsx(p,{})]})}function se(){return t.jsxs(v,{children:[t.jsxs(E,{className:"buttonIcon",onClick:()=>{j(A,"Code Info Table")},children:[t.jsx(S,{color:"green",size:20}),"EXCEL"]}),t.jsx(p,{})]})}function oe(){return t.jsxs(v,{children:[t.jsxs(E,{className:"buttonIcon",onClick:()=>{j(A,"Code Info Table")},children:[t.jsx(S,{color:"green",size:20}),"EXCEL"]}),t.jsxs(E,{className:"buttonIcon",onClick:()=>{F(m==null?void 0:m.EMPL_NO,m==null?void 0:m.MAINDEPTNAME,["RND"],me)},children:[t.jsx(Oe,{color:"blue",size:20}),"Lưu BOM"]}),t.jsxs(E,{className:"buttonIcon",onClick:()=>{F(m==null?void 0:m.EMPL_NO,m==null?void 0:m.MAINDEPTNAME,["RND"],()=>{te(G.map((e,a)=>({...e,editable:!e.editable}))),r.fire("Thông báo","Bật/Tắt chế độ sửa","success")})},children:[t.jsx(Me,{color:"yellow",size:25}),"Bật tắt sửa"]}),t.jsx(p,{})]})}const ie=async()=>{const{value:e}=await r.fire({title:"Xác nhận",input:"password",inputLabel:"Nhập mật mã",inputValue:"",inputPlaceholder:"Mật mã",showCancelButton:!0});e==="okema"?u!==""?_("updateAmazonBOMCodeInfo",{G_CODE:u,AMZ_PROD_NAME:f,AMZ_COUNTRY:M}).then(a=>{a.data.tk_status!=="NG"?r.fire("Thông báo","Update data thành công","success"):r.fire("Thông báo","Update data thất bại: "+a.data.message,"error")}).catch(a=>{console.log(a)}):r.fire("Thông báo","Chọn code trước đã !","error"):r.fire("Thông báo","Đã nhập sai mật mã !","error")},y=e=>{d(!0),_("listAmazon",{G_NAME:e}).then(a=>{if(a.data.tk_status!=="NG"){const s=a.data.data.map((o,n)=>({...o,id:n}));g(s),d(!1)}else g([]),d(!1)}).catch(a=>{console.log(a)})},le=e=>{d(!0),_("getBOMAMAZON",{G_CODE:e}).then(a=>{if(a.data.tk_status!=="NG"){const s=a.data.data.map((o,n)=>({...o,id:n}));z(s[0].AMZ_COUNTRY),L(s[0].AMZ_PROD_NAME),O(s),d(!1)}else O([]),d(!1)}).catch(a=>{console.log(a)})},ne=(e,a,s)=>{d(!0),_("getBOMAMAZON_EMPTY",{G_CODE_MAU:s}).then(o=>{if(o.data.tk_status!=="NG"){const n=o.data.data.map((N,c)=>({G_CODE:e,G_NAME:a,...N,GIATRI:"",REMARK:"",id:c}));O(n),d(!1)}else O([]),d(!1)}).catch(o=>{console.log(o)})},K=()=>{d(!0),_("codeinfo",{G_NAME:P}).then(e=>{if(e.data.tk_status!=="NG"){const a=e.data.data.map((s,o)=>({...s,id:o}));Z(a),d(!1),r.fire("Thông báo","Đã load "+e.data.data.length+" dòng","success")}else r.fire("Thông báo","Nội dung: "+e.data.message,"error"),d(!1)}).catch(e=>{console.log(e)})},de=e=>{const a=new Set(e);let s=A.filter(o=>a.has(o.id));s.length>0?(R(s),U(s[0].G_CODE),k(s[0].G_NAME),ne(s[0].G_CODE,s[0].G_NAME,C)):R([])},ce=e=>{var o,n;const a=new Set(e);let s=b.filter(N=>a.has(N.id));s.length>0?(U((o=s[0])==null?void 0:o.G_CODE),k((n=s[0])==null?void 0:n.G_NAME),le(s[0].G_CODE),w(s)):w([])},re=e=>{const a=new Set(e);let s=h.filter(o=>a.has(o.id));s.length>0?B(s):B([])},he=e=>{e.key==="Enter"&&K()},me=()=>{r.fire({title:"Chắc chắn muốn lưu BOM AMAZON ?",text:"Lưu BOM AMAZON",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Vẫn lưu!"}).then(e=>{e.isConfirmed&&(r.fire("Tiến hành Lưu BOM AMAZON","Đang lưu BOM","success"),ue())})},Ne=()=>{_("loadcodephoi",{}).then(e=>{if(e.data.tk_status!=="NG"){const a=e.data.data.map((s,o)=>({...s,id:o}));X(a)}else r.fire("Thông báo","Nội dung: "+e.data.message,"error"),d(!1)}).catch(e=>{console.log(e)})},_e=async e=>{let a=!0;return await _("checkExistBOMAMAZON",{G_CODE:e}).then(s=>{console.log(s.data),s.data.tk_status!=="NG"&&s.data.data.length>0?a=!0:a=!1}).catch(s=>{console.log(s)}),a},ue=async()=>{if(await _e(u)){r.fire("Thông báo","Update BOM AMAZON","warning");for(let a=0;a<h.length;a++)await _("updateAmazonBOM",{G_CODE:u,G_CODE_MAU:h[a].G_CODE_MAU,DOITUONG_NO:h[a].DOITUONG_NO,GIATRI:h[a].GIATRI,REMARK:h[a].REMARK,AMZ_PROD_NAME:f,AMZ_COUNTRY:M}).then(s=>{s.data.tk_status}).catch(s=>{console.log(s)})}else for(let a=0;a<h.length;a++)r.fire("Thông báo","Thêm BOM AMAZON mới","warning"),await _("insertAmazonBOM",{G_CODE:u,G_CODE_MAU:C,DOITUONG_NO:h[a].DOITUONG_NO,GIATRI:h[a].GIATRI,REMARK:h[a].REMARK,AMZ_PROD_NAME:f,AMZ_COUNTRY:M}).then(s=>{s.data.tk_status}).catch(s=>{console.log(s)});y("")};return i.useEffect(()=>{y(""),Ne()},[]),t.jsx("div",{className:"bom_amazon",children:t.jsxs("div",{className:"bom_manager_wrapper",children:[t.jsxs("div",{className:"left",children:[t.jsx("div",{className:"bom_manager_button",children:t.jsx("div",{className:"selectcodephoi",children:t.jsxs("label",{children:["Code phôi:",t.jsx("select",{className:"codephoiselection",name:"codephoi",value:C,onChange:e=>{H(e.target.value)},children:Y.map((e,a)=>t.jsx("option",{value:e.G_CODE_MAU,children:e.G_NAME},a))})]})})}),t.jsx("div",{className:"codemanager",children:t.jsxs("div",{className:"tracuuFcst",children:[t.jsx("div",{className:"tracuuFcstform",children:t.jsx("div",{className:"forminput",children:t.jsxs("div",{className:"forminputcolumn",children:[t.jsxs("label",{children:[t.jsx("b",{children:" All Code:"})," ",t.jsx("input",{type:"text",placeholder:"Nhập code vào đây",value:P,onChange:e=>Q(e.target.value),onKeyDown:e=>{he(e)}})]}),t.jsx("button",{className:"traxuatkiembutton",onClick:()=>{K()},children:"Tìm code"})]})})}),t.jsx("div",{className:"codeinfotable",children:t.jsx(I,{components:{Toolbar:ae,LoadingOverlay:D},sx:{fontSize:"0.7rem"},loading:x,rowHeight:30,rows:A,columns:q,onSelectionModelChange:e=>{de(e)},rowsPerPageOptions:[5,10,50,100,500,1e3,5e3,1e4,1e5],editMode:"cell",onCellEditCommit:(e,a,s)=>{let o=T;o.push(e),W(o);const n=e.field,N=A.map(c=>c.id===e.id?{...c,[n]:e.value}:c);Z(N)}})})]})})]}),t.jsxs("div",{className:"right",children:[t.jsxs("div",{className:"codeinfobig",children:[t.jsxs("div",{className:"biginfocms",children:[" ",u,": "]}),t.jsxs("div",{className:"biginfokd",children:[" ",$]})]}),t.jsxs("div",{className:"up",children:[t.jsx("div",{className:"bomsx",children:t.jsxs("div",{className:"listamazontable",children:[t.jsx("span",{style:{fontSize:"1rem",fontWeight:"bold",marginLeft:10,color:"black",padding:10},children:"LIST CODE ĐÃ CÓ BOM AMAZON"}),t.jsx(I,{components:{Toolbar:se,LoadingOverlay:D},sx:{fontSize:"0.7rem"},loading:x,rowHeight:30,rows:b,columns:ee,onSelectionModelChange:e=>{ce(e)},rowsPerPageOptions:[5,10,50,100,500,1e3,5e3,1e4,1e5],editMode:"cell",onCellEditCommit:(e,a,s)=>{let o=T;o.push(e),V(o);const n=e.field,N=b.map(c=>c.id===e.id?{...c,[n]:e.value}:c);g(N)}})]})}),t.jsx("div",{className:"bomgia",children:t.jsxs("div",{className:"bomamazontable",children:[t.jsxs("span",{style:{fontSize:"1rem",fontWeight:"bold",marginLeft:10,color:"black",padding:10},children:["BOM AMAZON(",G[0].editable?"Bật Sửa":"Tắt Sửa",")"]}),t.jsx(I,{components:{Toolbar:oe,LoadingOverlay:D},sx:{fontSize:"0.7rem"},loading:x,rowHeight:30,rows:h,columns:G,onSelectionModelChange:e=>{re(e)},rowsPerPageOptions:[5,10,50,100,500,1e3,5e3,1e4,1e5],editMode:"cell",onCellEditCommit:(e,a,s)=>{let o=T;o.push(e),J(o);const n=e.field,N=h.map(c=>c.id===e.id?{...c,[n]:e.value}:c);O(N)}})]})}),t.jsx("div",{className:"product_infor",children:t.jsxs("div",{className:"bomamazontable",children:[t.jsx("span",{style:{fontSize:"1.5rem",fontWeight:"bold",marginLeft:50,color:"black",padding:10,justifyContent:"center",justifyItems:"center"},children:"Thông tin sản phẩm"}),t.jsxs("div",{className:"section_title",children:["1. Ảnh sản phẩm ",t.jsx("br",{})," "]}),t.jsx("div",{className:"product_image",children:t.jsx("img",{width:"350px",height:"350px",src:"/amazon_image/AMZ_"+u+".jpg",alt:"AMZ_"+u+".jpg"})}),t.jsxs("div",{className:"section_title",children:["2. Tên sản phẩm thực tế ",t.jsx("br",{})," "]}),t.jsx("div",{className:"amz_prod_name",children:t.jsx("textarea",{value:f===null?"Chưa nhập thông tin":f,onChange:e=>{L(e.target.value)}})}),t.jsxs("div",{className:"section_title",children:["3. Thị trường ",t.jsx("br",{})," "]}),t.jsx("div",{className:"amz_country",children:t.jsx("div",{className:"country",children:t.jsx("input",{type:"text",value:M===null?"Chưa nhập thông tin":M,onChange:e=>{z(e.target.value)}})})}),t.jsx("div",{className:"update_prod_info",children:t.jsx(fe,{variant:"contained",color:"success",onClick:()=>{ie()},children:"UPDATE"})})]})})]}),t.jsx("div",{className:"bottom"})]})]})})};export{Re as default};
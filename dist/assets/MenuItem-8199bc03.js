import{g as p,a as b,s as F,B as G,aG as N,_ as r,aH as c,r as d,u as P,b as U,f as S,aI as E,j as x,d as $,e as H}from"./index-4ab6dde0.js";import{L as M}from"./TextField-db9fe3d0.js";const _=p("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]),L=_;function Z(e){return b("MuiListItemIcon",e)}const D=p("MuiListItemIcon",["root","alignItemsFlexStart"]),O=D;function ee(e){return b("MuiListItemText",e)}const W=p("MuiListItemText",["root","multiline","dense","inset","primary","secondary"]),R=W;function z(e){return b("MuiMenuItem",e)}const A=p("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),n=A,h=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex","className"],q=(e,t)=>{const{ownerState:s}=e;return[t.root,s.dense&&t.dense,s.divider&&t.divider,!s.disableGutters&&t.gutters]},J=e=>{const{disabled:t,dense:s,divider:a,disableGutters:l,selected:u,classes:o}=e,i=H({root:["root",s&&"dense",t&&"disabled",!l&&"gutters",a&&"divider",u&&"selected"]},z,o);return r({},o,i)},K=F(G,{shouldForwardProp:e=>N(e)||e==="classes",name:"MuiMenuItem",slot:"Root",overridesResolver:q})(({theme:e,ownerState:t})=>r({},e.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!t.disableGutters&&{paddingLeft:16,paddingRight:16},t.divider&&{borderBottom:`1px solid ${(e.vars||e).palette.divider}`,backgroundClip:"padding-box"},{"&:hover":{textDecoration:"none",backgroundColor:(e.vars||e).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${n.selected}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`:c(e.palette.primary.main,e.palette.action.selectedOpacity),[`&.${n.focusVisible}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`:c(e.palette.primary.main,e.palette.action.selectedOpacity+e.palette.action.focusOpacity)}},[`&.${n.selected}:hover`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`:c(e.palette.primary.main,e.palette.action.selectedOpacity+e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`:c(e.palette.primary.main,e.palette.action.selectedOpacity)}},[`&.${n.focusVisible}`]:{backgroundColor:(e.vars||e).palette.action.focus},[`&.${n.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity},[`& + .${L.root}`]:{marginTop:e.spacing(1),marginBottom:e.spacing(1)},[`& + .${L.inset}`]:{marginLeft:52},[`& .${R.root}`]:{marginTop:0,marginBottom:0},[`& .${R.inset}`]:{paddingLeft:36},[`& .${O.root}`]:{minWidth:36}},!t.dense&&{[e.breakpoints.up("sm")]:{minHeight:"auto"}},t.dense&&r({minHeight:32,paddingTop:4,paddingBottom:4},e.typography.body2,{[`& .${O.root} svg`]:{fontSize:"1.25rem"}}))),Q=d.forwardRef(function(t,s){const a=P({props:t,name:"MuiMenuItem"}),{autoFocus:l=!1,component:u="li",dense:o=!1,divider:f=!1,disableGutters:i=!1,focusVisibleClassName:k,role:T="menuitem",tabIndex:v,className:w}=a,V=U(a,h),C=d.useContext(M),y=d.useMemo(()=>({dense:o||C.dense||!1,disableGutters:i}),[C.dense,o,i]),g=d.useRef(null);S(()=>{l&&g.current&&g.current.focus()},[l]);const B=r({},a,{dense:y.dense,divider:f,disableGutters:i}),m=J(a),j=E(g,s);let I;return a.disabled||(I=v!==void 0?v:-1),x.jsx(M.Provider,{value:y,children:x.jsx(K,r({ref:j,role:T,tabIndex:I,component:u,focusVisibleClassName:$(m.focusVisible,k),className:$(m.root,w)},V,{ownerState:B,classes:m}))})}),te=Q;export{te as M,Z as a,ee as g,R as l};
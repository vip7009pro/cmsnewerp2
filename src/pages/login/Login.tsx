import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import "./Login.scss";
import getsentence, { getlang } from "../../components/String/String";
import { LangConText, UserContext } from "../../api/Context";
import { getCompany, login } from "../../api/Api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  changeCtrCd,
  changeSelectedServer,
  changeServer,
} from "../../redux/slices/globalSlice";
import { isValidInput } from "../../api/GlobalFunction";
import Swal from "sweetalert2";
import { eventFunc } from "react-push-notification/dist/notifications/Storage";
const Login = () => {
  const protocol = window.location.protocol.startsWith("https") ? 'https' : 'http';
  const main_port = protocol === 'https' ? '5014' : '5013';
  const sub_port = protocol === 'https' ? '3006' : '3007';
  //console.log('sub_port', sub_port)
  const ref = useRef<any>(null);
  const [lang, setLang] = useContext(LangConText);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [server_string, setServer_String] = useState("");
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const companyInfo: any = useSelector((state: RootState) => state.totalSlice.cpnInfo);
  const ctr_cd: string = useSelector(
    (state: RootState) => state.totalSlice.ctr_cd,
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const cpnInfo: any = useSelector((state: RootState) => state.totalSlice.cpnInfo);
  const handle_setUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
  };
  const handle_setUserKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (ref !== null) {
        ref.current.focus();
      }
    }
  };
  const handle_setPassWordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
   
    if (e.key === "Enter") {
      if (isValidInput(user) && isValidInput(pass)) {
        login(user, pass);
      } else {
        Swal.fire("Thông báo", "Tên đăng nhập và mật khẩu không được chứa ký tự đặc biệt", "error");
      }
    }
  };
  const login_bt = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
      if (isValidInput(user) && isValidInput(pass)) { 
      login(user, pass);
    } else {
      Swal.fire("Thông báo", "Tên đăng nhập và mật khẩu không được chứa ký tự đặc biệt", "error");
    }
  };
  const server_ip: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.server_ip,
  );
  const dispatch = useDispatch();
  
 
  useEffect(() => {
    let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
    if (server_ip_local !== undefined) {
      setServer_String(server_ip_local);
      dispatch(changeServer(server_ip_local));
      dispatch(changeSelectedServer(cpnInfo[getCompany()].apiUrlArray.find((item: { apiUrl: string; }) => item.apiUrl === server_ip_local)?.server_name));
    } else {
      localStorage.setItem("server_ip",companyInfo[getCompany() as keyof typeof companyInfo].apiUrl);
      setServer_String(companyInfo[getCompany() as keyof typeof companyInfo].apiUrl);
      dispatch(changeServer(companyInfo[getCompany() as keyof typeof companyInfo].apiUrl));
      dispatch(changeSelectedServer(cpnInfo[getCompany()].apiUrlArray.find((item: { apiUrl: string; }) => item.apiUrl === companyInfo[getCompany() as keyof typeof companyInfo].apiUrl)?.server_name));
      //localStorage.setItem("server_ip", "");
      //dispatch(changeServer(companyInfo[getCompany() as keyof typeof companyInfo].apiUrl));
    }
    let saveLang: any = localStorage.getItem("lang")?.toString();
    if (saveLang !== undefined) {
      setLang(saveLang.toString());
    } else {
      setLang("en");
    }
  }, []);
  return (
    <div className="loginscreen">
      <div
        className="loginbackground"
        style={{
          position: "absolute",
          backgroundImage: `url('${company === "CMS" ? `/companybackground.png` : `/companybackground.png`
            }')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.5,
          height: "100vh",
          width: "100vw",
        }}
      ></div>
      <div
        className="login-form"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `${company === "CMS"
            ? theme.CMS.backgroundImage
            : theme.PVN.backgroundImage
            }`,
        }}
      >
        <div className="logo">          
            <img
              alt="cmsvina logo"
              src="/companylogo.png"
              width={cpnInfo[getCompany()].loginLogoWidth}
              height={cpnInfo[getCompany()].loginLogoHeight}
            />          
        </div>
        <span className="formname">
          {getlang("dangnhap", lang)}
          {/*Sign In*/}
        </span>
        <div className="login-input" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            id="login_input"
            type="text"
            placeholder="User name"
            required
            onKeyDown={(e) => {
              handle_setUserKeyDown(e);
            }}
            onChange={(e) => {
              handle_setUser(e);
            }}
          ></input>
          <input
            id="password_input"
            type="password"
            placeholder="Password"
            ref={ref}
            required
            onKeyDown={(e) => {
              handle_setPassWordKeyDown(e);
            }}
            onChange={(e) => setPass(e.target.value)}
          ></input>
          <label>
            Server:
            <select
              name="select_server"
              value={server_string}
              onChange={(e) => {
                localStorage.setItem("server_ip", e.target.value);
                setServer_String(e.target.value);
                dispatch(changeServer(e.target.value));
                dispatch(changeSelectedServer(cpnInfo[getCompany()].apiUrlArray.find((item: { apiUrl: string; }) => item.apiUrl === e.target.value)?.server_name));
                ///console.log(e.target.value);
              }}
            >
              {
                cpnInfo[getCompany()].apiUrlArray.map((item: any) => (
                  <option key={item.server_name} value={item.apiUrl}>{item.server_name}</option>
                ))  
              }             
            </select>
          </label>
          { getCompany() === "CMS" && <label>
            Branch:
            <select
              name="select_ctr_cd"
              value={ctr_cd}
              onChange={(e) => {
                dispatch(changeCtrCd(e.target.value));               
              }}
            >
              <option value="001">BR1</option>
              <option value="002">BR2</option>             
            </select>
          </label>}
        </div>
        <div className="submit" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button className="login_button" onClick={login_bt}>
            {getlang("dangnhap", lang)}
            {/*Login*/}
          </button>
        </div>
        <div className="bottom-text">
          <label htmlFor="checkbox" className="btmtext">
            <input type="checkbox" name="checkboxname" id="checkbox" />
            {` `}
            {getlang("nhothongtindangnhap", lang)}
            {/*Remember Me*/}
          </label>
          <a href="/" className="forgot-link">
            {getlang("quenmatkhau", lang)}
            {/*Forget password*/}
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;

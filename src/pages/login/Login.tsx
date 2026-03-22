import React, { useEffect, useRef, useState } from "react";
import "./Login.scss";
import { getlang } from "../../components/String/String";
import { getCompany, login } from "../../api/Api";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectCompany as selectCompanyFromState,
  selectCompanyInfo,
  selectCtrCd,
  selectLang,
  selectServerIp,
  selectTheme,
} from "../../redux/selectors/uiSelectors";
import {
  setCtrCd,
  setLanguage,
  setSelectedServer,
  setServerIp,
} from "../../redux/slices/uiSlice";
import { isValidInput } from "../../api/GlobalFunction";
import Swal from "sweetalert2";
const Login = () => {
  const protocol = window.location.protocol.startsWith("https")
    ? "https"
    : "http";
  const main_port = protocol === "https" ? "5014" : "5013";
  const sub_port = protocol === "https" ? "3007" : "3007";
  //console.log('sub_port', sub_port)
  const ref = useRef<any>(null);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [server_string, setServer_String] = useState("");
  const lang: string | undefined = useAppSelector(selectLang);
  const company: string = useAppSelector(selectCompanyFromState);
  const companyInfo: any = useAppSelector(selectCompanyInfo);
  const ctr_cd: string = useAppSelector(selectCtrCd);
  const theme: any = useAppSelector(selectTheme);
  const cpnInfo: any = useAppSelector(selectCompanyInfo);
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
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      if (isValidInput(user) && isValidInput(pass)) {
        login(user, pass);
      } else {
        Swal.fire(
          "Thông báo",
          "Tên đăng nhập và mật khẩu không được chứa ký tự đặc biệt",
          "error"
        );
      }
    }
  };
  const login_bt = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isValidInput(user) && isValidInput(pass)) {
      login(user, pass);
    } else {
      Swal.fire(
        "Thông báo",
        "Tên đăng nhập và mật khẩu không được chứa ký tự đặc biệt",
        "error"
      );
    }
  };
  const server_ip: string | undefined = useAppSelector(selectServerIp);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
    if (server_ip_local !== undefined) {
      setServer_String(server_ip_local);
      dispatch(setServerIp(server_ip_local));
      dispatch(
        setSelectedServer(
          cpnInfo[getCompany()].apiUrlArray.find(
            (item: { apiUrl: string }) => item.apiUrl === server_ip_local
          )?.server_name
        )
      );
    } else {
      localStorage.setItem(
        "server_ip",
        companyInfo[getCompany() as keyof typeof companyInfo].apiUrl
      );
      setServer_String(
        companyInfo[getCompany() as keyof typeof companyInfo].apiUrl
      );
      dispatch(
        setServerIp(
          companyInfo[getCompany() as keyof typeof companyInfo].apiUrl
        )
      );
      dispatch(
        setSelectedServer(
          cpnInfo[getCompany()].apiUrlArray.find(
            (item: { apiUrl: string }) =>
              item.apiUrl ===
              companyInfo[getCompany() as keyof typeof companyInfo].apiUrl
          )?.server_name
        )
      );
      //localStorage.setItem("server_ip", "");
      //dispatch(changeServer(companyInfo[getCompany() as keyof typeof companyInfo].apiUrl));
    }
    let saveLang: any = localStorage.getItem("lang")?.toString();
    if (saveLang !== undefined) {
      dispatch(setLanguage(saveLang.toString()));
    } else {
      dispatch(setLanguage("en"));
    }
  }, []);
  return (
    <div className="loginscreen">
      <div
        className="loginbackground"
        style={{
          position: "absolute",
          backgroundImage: `url('${
            company === "CMS"
              ? `/companybackground.png`
              : `/companybackground.png`
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
          backgroundImage: `${
            company === "CMS"
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
          {getlang("dangnhap", lang ?? "en")}
          {/*Sign In*/}
        </span>
        <div
          className="login-input"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
                console.log(e.target.value);
                localStorage.setItem("server_ip", e.target.value);
                setServer_String(e.target.value);
                dispatch(setServerIp(e.target.value));
                dispatch(
                  setSelectedServer(
                    cpnInfo[getCompany()].apiUrlArray.find(
                      (item: { apiUrl: string }) =>
                        item.apiUrl === e.target.value
                    )?.server_name
                  )
                );
              }}
            >
              {cpnInfo[getCompany()].apiUrlArray.map((item: any) => (
                <option key={item.server_name} value={item.apiUrl}>
                  {item.server_name}
                </option>
              ))}
            </select>
          </label>
          {getCompany() === "CMS" && (
            <label>
              Branch:
              <select
                name="select_ctr_cd"
                value={ctr_cd}
                onChange={(e) => {
                  dispatch(setCtrCd(e.target.value));
                }}
              >
                <option value="001">BR1</option>
                <option value="002">BR2</option>
              </select>
            </label>
          )}
        </div>
        <div
          className="submit"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button className="login_button" onClick={login_bt}>
            {getlang("dangnhap", lang ?? "en")}
            {/*Login*/}
          </button>
        </div>
        <div className="bottom-text">
          <label htmlFor="checkbox" className="btmtext">
            <input type="checkbox" name="checkboxname" id="checkbox" />          
            {getlang("nhothongtindangnhap", lang ?? "en")}           
          </label>
          <a href="/" className="forgot-link">
            {getlang("quenmatkhau", lang ?? "en")}           
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;

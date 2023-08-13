import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import "./Login.scss";
import getsentence, { getlang } from "../../components/String/String";
import { LangConText, UserContext } from "../../api/Context";
import { login } from "../../api/Api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  changeDiemDanhState,
  changeUserData,
  UserData,
  update_socket,
  changeServer,
} from "../../redux/slices/globalSlice";
const Login = () => {
  const ref = useRef<any>(null);
  const [lang, setLang] = useContext(LangConText);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [server_string, setServer_String] = useState('')
  /* const [server_string, setServer_String] = useState('http://14.160.33.94:5011/api') */
  //console.log(lang);

  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const theme: any = useSelector(
    (state: RootState) => state.totalSlice.theme
  );

  const defaultIP:string = company ==='CMS'? 'http://14.160.33.94:5011/api': 'http://222.252.1.63:3007/api'
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
      login(user, pass);
    }
  };
  const lang2: any = localStorage.getItem("lang");
  //console.log('lang2: ' + lang2);
  const login_bt = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login(user, pass);
  };

  const server_ip: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.server_ip
  );
  const dispatch = useDispatch();

  useEffect(() => {

    let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
    if (server_ip_local !== undefined) {
      setServer_String(server_ip_local);
      dispatch(changeServer(server_ip_local));
    } else {      
      /* localStorage.setItem("server_ip", 'http://14.160.33.94:5011/api');
      dispatch(changeServer('http://14.160.33.94:5011/api')); */
      localStorage.setItem("server_ip", '');
      dispatch(changeServer(''));
    }
    let saveLang: any = localStorage.getItem("lang")?.toString();
    if (saveLang !== undefined) {
      setLang(saveLang.toString());
      //console.log(getlang("dangnhap", lang));
    } else {
      setLang("en");
    }   
  }, []);
  //console.log(company)

  //if (userData.EMPL_NO!=='none') return <Navigate to='/' replace />;
  return (
    <div className='loginscreen'>
      <div
        className='loginbackground'
        style={{
          position: "absolute",
          backgroundImage: `url('${
            company === "CMS" ? `/CMSVBackground.png` : `/PVNBackground.png`
          }')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.5,
          height: "100vh",
          width: "100vw",
        }}
      ></div>
      <div className='login-form' style={{
        backgroundImage: `${company === "CMS" ?  theme.CMS.backgroundImage: theme.PVN.backgroundImage}`,
      }}>
        <div className='logo'>
          {company === "CMS" && (
            <img
              alt='cmsvina logo'
              src='/logocmsvina.png'
              width={190}
              height={50}
            />
          )}
          {company === "PVN" && (
            <img
              alt='cmsvina logo'
              src='/logopvn_big.png'
              width={190}
              height={80}
            />
          )}
        </div>
        <span className='formname'>
          {getlang("dangnhap", lang)}
          {/*Sign In*/}
        </span>
        <div className='login-input'>
          <input
            id='login_input'
            type='text'
            placeholder='User name'
            required
            onKeyDown={(e) => {
              handle_setUserKeyDown(e);
            }}
            onChange={(e) => {
              handle_setUser(e);
            }}
          ></input>
          <input
            id='password_input'
            type='password'
            placeholder='Password'
            ref={ref}
            required
            onKeyDown={(e) => {
              handle_setPassWordKeyDown(e);
            }}
            onChange={(e) => setPass(e.target.value)}
          ></input>
          <label>
            Chọn Server:
            <select
              name='select_server'
              value={server_string}
              onChange={(e) => {
                localStorage.setItem("server_ip", e.target.value);
                setServer_String(e.target.value);
                dispatch(changeServer(e.target.value));
                ///console.log(e.target.value);
              }}
            >
              {company==='CMS' && <option value={"http://14.160.33.94:5011"}>MAIN_SERVER</option>}
              {company==='CMS' && <option value={"http://14.160.33.94:3007"}>SUB_SERVER</option>}
              {company === 'PVN' && <option value={"http://222.252.1.63:3007"}>PUBLIC_PVN</option>}
              {/* {company === 'PVN' && <option value={"http://192.168.100.120:3007"}>LOCAL_PVN</option>} */}
              <option value={"http://localhost:3007"}>TEST_SERVER</option>
            </select>
          </label>
        </div>
        <div className='submit'>
          <button className='login_button' onClick={login_bt}>
            {getlang("dangnhap", lang)}
            {/*Login*/}
          </button>
        </div>
        <div className='bottom-text'>
          <label htmlFor='checkbox' className='btmtext'>
            <input type='checkbox' name='checkboxname' id='checkbox' />
            {` `}
            {getlang("nhothongtindangnhap", lang)}
            {/*Remember Me*/}
          </label>
          <a href='/' className='forgot-link'>
            {getlang("quenmatkhau", lang)}
            {/*Forget password*/}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

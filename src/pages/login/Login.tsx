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
  const [userData, setUserData] = useContext(UserContext);
  const [lang, setLang] = useContext(LangConText);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [server_string, setServer_String] = useState('http://14.160.33.94:5011/api')
  //console.log(lang);

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
    } else {      
      localStorage.setItem("server_ip", 'http://14.160.33.94:5011/api');
    }


    let saveLang: any = localStorage.getItem("lang")?.toString();
    if (saveLang !== undefined) {
      setLang(saveLang.toString());
      //console.log(getlang("dangnhap", lang));
    } else {
      setLang("en");
    }   
  }, []);

  //if (userData.EMPL_NO!=='none') return <Navigate to='/' replace />;
  return (
    <div className='login-form'>
      <div className='logo'>CMS VINA</div>
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
            }}
          >
            <option value={'http://14.160.33.94:5011/api'}>MAIN_SERVER</option>
            <option value={'http://14.160.33.94:3007/api'}>SUB_SERVER</option>
            <option value={'http://localhost:3007/api'}>TEST_SERVER</option>
            <option value={'http://10.138.187.250:3007/api'}>TEST_SERVER2</option>
            <option value={'http://64.176.197.26/:3007/api'}>TEST_SERVER3</option>
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
  );
};

export default Login;

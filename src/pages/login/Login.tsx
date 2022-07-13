import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./Login.scss";
import getsentence from "../../components/String/String";
import { LangConText, UserContext } from "../../api/Context";
import { login } from "../../api/Api";

const Login = () => {      
  const [userData,setUserData] = useContext(UserContext);
  const [lang,setLang] = useContext(LangConText);
  const [user,setUser] = useState('');
  const [pass,setPass] = useState('');
  console.log(lang);

  const lang2: any = localStorage.getItem('lang');
  console.log('lang2: ' + lang2);
  const login_bt = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login(user, pass);
  }  

  if (userData.EMPL_NO!=='none') return <Navigate to='/' replace />;
  return (
    <div className='login-form'>
      <div className='logo'>CMS VINA</div>
      <span className='formname'>{getsentence(0,lang2)}{/*Sign In*/}</span>
      <div className='login-input'>
        <input type='text' placeholder='User name' required onChange={e => setUser(e.target.value)}></input>
        <input type='password' placeholder='Password' required onChange={e => setPass(e.target.value)}></input>
      </div>
      <div className='submit'>
        <button className='login_button' onClick={login_bt} >{getsentence(0,lang2)}{/*Login*/}</button>
      </div>
      <div className='bottom-text'>
        <label htmlFor='checkbox' className='btmtext'>
          <input type='checkbox' name='checkboxname' id='checkbox' />
          {` `}{getsentence(1,lang2)}{/*Remember Me*/}   
        </label>
        <a href='/' className='forgot-link'>
            {getsentence(2,lang2)}{/*Forget password*/}
        </a>
      </div>
    </div>
  );
};

export default Login;

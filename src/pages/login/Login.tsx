import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import "./Login.scss";
import getsentence from "../../components/String/String";
import { LangConText, UserContext } from "../../api/Context";
import { login } from "../../api/Api";

const Login = () => {    
  const ref = useRef<any>(null);  
  const [userData,setUserData] = useContext(UserContext);
  const [lang,setLang] = useContext(LangConText);
  const [user,setUser] = useState('');
  const [pass,setPass] = useState('');
  //console.log(lang);

  const handle_setUser =(e:React.ChangeEvent<HTMLInputElement>)=> {
     setUser(e.target.value);
  }
  const handle_setUserKeyDown =(e:React.KeyboardEvent<HTMLInputElement>)=> {    
    if(e.key === 'Enter'){      
      if(ref !== null) 
      {
        ref.current.focus();
      }
    }
 }
  const handle_setPassWordKeyDown =(e:React.KeyboardEvent<HTMLInputElement>)=> {    
    if(e.key === 'Enter'){      
      login(user, pass);
    }
 }
  const lang2: any = localStorage.getItem('lang');
  //console.log('lang2: ' + lang2);
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
        <input id="login_input" type='text' placeholder='User name' required onKeyDown={(e)=> {handle_setUserKeyDown(e);}} onChange={(e)=> {handle_setUser(e)}}></input>
        <input id="password_input" type='password' placeholder='Password'  ref={ref}  required onKeyDown={(e)=> {handle_setPassWordKeyDown(e);}} onChange={e => setPass(e.target.value)}></input>
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

import React from "react";
import { Navigate } from "react-router-dom";
import "./Login.scss";
import getsentence from "../../components/String/String";

const Login = () => {
  const user = false;
  const lang: string = 'vi';

  if (user) return <Navigate to='/' replace />;
  return (
    <div className='login-form'>
      <div className='logo'>CMS VINA</div>
      <span className='formname'>{getsentence(0,lang)}</span>
      <div className='login-input'>
        <input type='text' placeholder='User name' required></input>
        <input type='password' placeholder='Password' required></input>
      </div>
      <div className='submit'>
        <button className='login_button'>{getsentence(0,lang)}</button>
      </div>
      <div className='bottom-text'>
        <label htmlFor='checkbox' className='btmtext'>
          <input type='checkbox' name='checkboxname' id='checkbox' />
          {` `}{getsentence(1,lang)}
        </label>
        <a href='/' className='forgot-link'>
            {getsentence(2,lang)}
        </a>
      </div>
    </div>
  );
};

export default Login;

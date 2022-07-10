import React from "react";
import "./Login.scss";
const Login = () => {
  return( 
    <div className='login-form'>
        <div className="logo">CMS VINA</div>
        <span className="formname">Sign In</span>
        <div className="login-input">
            <input type="text" placeholder="User name" required></input>
            <input type="password" placeholder="Password" required></input>
        </div>
        <div className="submit">
            <button className="login_button">Login</button>
        </div>
        <div className="bottom-text">
            <label htmlFor="checkbox" className="btmtext">                
                <input type="checkbox" name="checkboxname" id="checkbox" />
                {` `}Remember me
            </label>
            <a href="/" className="forgot-link">Forgot password</a>
        </div>
        
    </div>
  );
};

export default Login;

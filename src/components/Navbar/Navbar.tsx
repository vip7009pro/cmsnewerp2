import React, { ChangeEvent, Component, useContext, useEffect, useState } from "react";
import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ListIcon from "@mui/icons-material/List";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../api/Api";
import { LangConText } from "../../api/Context";
import Swal from "sweetalert2";
import { UserContext } from "../../api/Context";


export default function Navbar() {
  const [avatarmenu, setAvatarMenu] = useState(false);
  const [langmenu, setLangMenu] = useState(false);
  const [lang, setLang] = useContext(LangConText);
  const [userData, setUserData] = useContext(UserContext);

  useEffect(() => {
    setLang(localStorage.getItem('lang'));
  }, []);
  
  console.log(lang);
  const logout_bt = () => {
    logout();    
  }
  const showhideAvatarMenu = () => {
    setAvatarMenu(!avatarmenu);
    setLangMenu(false);
  }
  const showhideLangMenu = () => {
    setLangMenu(!langmenu);
    setAvatarMenu(false);
  }

  const changeLanguage= (selectLang: string)=> {
   console.log(selectLang);   
   setLangMenu(false);
   setLang(selectLang);
   localStorage.setItem('lang',selectLang);
  }
  return (
    <div className='navbar'>
      <div className='wrapper'>
        <div className='search'>
          <input type='text' placeholder='Search...' />
          <SearchIcon />
        </div>
        <div className="cmslogo">
          <img alt="cmsvina logo" src="logocmsvina.png" width={171.6} height={40.7}/>
        </div>
        <div className='items'>
          <div className='item' onClick={showhideLangMenu}>
            <LanguageIcon className='icon'/>
            {lang ==='vi'? 'Tiếng Việt': lang==='kr'? '한국어' : 'English'}
          </div>
          {langmenu &&  <div className='langmenu'>
            <div className='menu'>
              <div className='menu_item'>
                <AccountCircleIcon className="menu_icon"/>
                <span className='menulink' onClick={()=> {changeLanguage('vi')}}>                  
                  Tiếng Việt
                </span>
              </div>
              <div className='menu_item'>
                <LogoutIcon className="menu_icon"/>
                <span className='menulink'  onClick={()=> {changeLanguage('kr')}}>                  
                  한국어
                </span>
              </div>
              <div className='menu_item'>
                <LogoutIcon className="menu_icon"/>
                <span className='menulink'  onClick={()=> {changeLanguage('en')}}>                  
                  English
                </span>
              </div>
            </div>
          </div>}    
          <div className='item'>
            <DarkModeIcon className='icon' />
          </div>
          <div className='item'>
            <FullscreenExitIcon className='icon' />
          </div>
          <div className='item'>
            <NotificationsNoneIcon className='icon' />
            <div className='counter'>2</div>
          </div>
          <div className='item'>
            <ChatBubbleOutlineIcon className='icon' />
            <div className='counter'>2</div>
          </div>
          <div className='item'>
            <ListIcon className='icon' />
          </div>
          <div className='item'>
            <div className='avatar' onClick={showhideAvatarMenu}>
              {userData.FIRST_NAME.slice(0,1)}
            </div>            
          </div>
          {avatarmenu &&  <div className='avatarmenu'>
            <div className='menu'>
              <div className='menu_item'>
                <AccountCircleIcon className="menu_icon"/>                
                <Link to='/accountinfo' className='menulink' onClick={()=>setAvatarMenu(false)}>                  
                  Account Information
                </Link> 
              </div>
              <div className='menu_item'>
                <LogoutIcon className="menu_icon"/>
                <span className='menulink' onClick={logout_bt}>                  
                  Logout
                </span>
              </div>
            </div>
          </div>}         
        </div>
      </div>
    </div>
  );
}

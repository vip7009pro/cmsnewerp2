import React, { useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../api/Context";
const KinhDoanh = () => {
  const [userData, setUserData] = useContext(UserContext);
  return (
    <div className='kinhdoanh'>     
      <Outlet />
    </div>
  );
};
export default KinhDoanh;

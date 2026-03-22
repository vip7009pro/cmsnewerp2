import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from './api/GlobalFunction';
import Home from './pages/home/Home';
import { animated } from '@react-spring/web';
import { AccountInfo, BulletinBoard } from "./api/lazyPages";
import {
  BoPhanKhoRouteGroup,
  InformationBoardRouteGroup,
  KinhDoanhRouteGroup,
  NhanSuRouteGroup,
  PhongMuaHangRouteGroup,
  QcRouteGroup,
  QlsxRouteGroup,
  RndRouteGroup,
  SettingRouteGroup,
  SxRouteGroup,
  ToolRouteGroup,
} from "./routes/appRouteGroups";
const AppRoutes = ({ globalUserData }: { globalUserData: any }) => {
  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute
            user={globalUserData}
            maindeptname="all"
            jobname="all"
          >
            <animated.div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
              }}
            >
              <Home />
            </animated.div>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<BulletinBoard />}
          />
        <Route path="accountinfo" element={<AccountInfo />}></Route>
        {KinhDoanhRouteGroup(globalUserData)}
        {RndRouteGroup(globalUserData)}
        {QlsxRouteGroup(globalUserData)}
        {PhongMuaHangRouteGroup(globalUserData)}
        {BoPhanKhoRouteGroup(globalUserData)}
        {SettingRouteGroup(globalUserData)}
        {QcRouteGroup(globalUserData)}
        {ToolRouteGroup(globalUserData)}
        {InformationBoardRouteGroup(globalUserData)}
        {SxRouteGroup(globalUserData)}
        {NhanSuRouteGroup(globalUserData)}
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./AppBootScreen.scss";

const AppBootScreen = () => {
  const company = useSelector((state: RootState) => state.totalSlice.company);
  const cpnInfo = useSelector((state: RootState) => state.totalSlice.cpnInfo);
  const logo =
    cpnInfo[company as keyof typeof cpnInfo]?.logo ?? "/companylogo.png";

  return (
    <div className="app-boot-screen" role="status" aria-live="polite">
      <div className="app-boot-screen__panel">
        <img className="app-boot-screen__logo" src={logo} alt="" />
        <div className="app-boot-screen__spinner" aria-hidden />
        <p className="app-boot-screen__message">Đang khởi tạo ứng dụng…</p>
      </div>
    </div>
  );
};

export default AppBootScreen;

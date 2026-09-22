import React, { useEffect, useRef, useState, useCallback } from "react";
import "./PrecisionLogin/PrecisionLogin.scss";
import { getCompany, login } from "../../api/Api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  changeCtrCd,
  changeGLBLanguage,
  changeSelectedServer,
  changeServer,
} from "../../redux/slices/globalSlice";
import { isValidInput } from "../../api/services/utilCore";
import Swal from "sweetalert2";
import { PrecisionLoginHeader } from "./PrecisionLogin/PrecisionLoginHeader";
import { PrecisionLoginForm } from "./PrecisionLogin/PrecisionLoginForm";
import { PrecisionLoginFooter } from "./PrecisionLogin/PrecisionLoginFooter";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const passRef = useRef<HTMLInputElement>(null);
  const loadingTimerRef = useRef<number | null>(null);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [server_string, setServer_String] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const lang = useSelector((state: RootState) => state.totalSlice.lang) ?? "vi";
  const company = useSelector((state: RootState) => state.totalSlice.company) || "CMS";
  const cpnInfo = useSelector((state: RootState) => state.totalSlice.cpnInfo);
  const ctr_cd = useSelector((state: RootState) => state.totalSlice.ctr_cd) || "002";
  const selectedServer = useSelector((state: RootState) => state.totalSlice.selectedServer) || "";

  // Dọn timer trạng thái loading khi rời màn hình đăng nhập
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, []);

  // Khởi tạo server và ngôn ngữ từ localStorage / Redux
  useEffect(() => {
    const savedUser = localStorage.getItem("saved_username");
    if (savedUser) {
      setUser(savedUser);
    }

    const server_ip_local = localStorage.getItem("server_ip")?.toString();
    const activeCpn = getCompany();
    const fallbackApiUrl = cpnInfo?.[activeCpn]?.apiUrl || "http://localhost:3007";

    if (server_ip_local) {
      setServer_String(server_ip_local);
      dispatch(changeServer(server_ip_local));
      const matchedServer = cpnInfo?.[activeCpn]?.apiUrlArray?.find(
        (item: { apiUrl: string }) => item.apiUrl === server_ip_local
      );
      if (matchedServer) {
        dispatch(changeSelectedServer(matchedServer.server_name));
      }
    } else {
      localStorage.setItem("server_ip", fallbackApiUrl);
      setServer_String(fallbackApiUrl);
      dispatch(changeServer(fallbackApiUrl));
      const matchedServer = cpnInfo?.[activeCpn]?.apiUrlArray?.find(
        (item: { apiUrl: string }) => item.apiUrl === fallbackApiUrl
      );
      if (matchedServer) {
        dispatch(changeSelectedServer(matchedServer.server_name));
      }
    }

    const saveLang = localStorage.getItem("lang")?.toString();
    if (saveLang) {
      dispatch(changeGLBLanguage(saveLang));
    } else {
      dispatch(changeGLBLanguage("vi"));
    }
  }, [cpnInfo, dispatch]);

  // Xử lý đổi ngôn ngữ tức thì
  const handleLanguageChange = useCallback(
    (newLang: string) => {
      dispatch(changeGLBLanguage(newLang));
      localStorage.setItem("lang", newLang);
    },
    [dispatch]
  );

  // Xử lý đổi server
  const handleServerChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newApiUrl = e.target.value;
      localStorage.setItem("server_ip", newApiUrl);
      setServer_String(newApiUrl);
      dispatch(changeServer(newApiUrl));

      const activeCpn = getCompany();
      const matched = cpnInfo?.[activeCpn]?.apiUrlArray?.find(
        (item: { apiUrl: string }) => item.apiUrl === newApiUrl
      );
      if (matched) {
        dispatch(changeSelectedServer(matched.server_name));
      }
    },
    [cpnInfo, dispatch]
  );

  // Xử lý đổi chi nhánh
  const handleBranchChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(changeCtrCd(e.target.value));
    },
    [dispatch]
  );

  // Focus chuyển sang input password khi gõ Enter ở ô user
  const handleUserKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passRef.current?.focus();
    }
  }, []);

  // Xử lý đăng nhập
  const executeLogin = useCallback(async () => {
    if (!user.trim() || !pass.trim()) {
      Swal.fire("Thông báo", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu", "warning");
      return;
    }

    if (!isValidInput(user) || !isValidInput(pass)) {
      Swal.fire("Thông báo", "Tên đăng nhập và mật khẩu không được chứa ký tự đặc biệt", "error");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("saved_username", user.trim());
    } else {
      localStorage.removeItem("saved_username");
    }

    try {
      setIsLoading(true);
      login(user.trim(), pass);
    } finally {
      // Đăng nhập thành công sẽ chuyển trang ⇒ nếu không clear timer, callback dưới đây
      // sẽ chạy sau khi Login đã unmount (setState "mồ côi").
      if (loadingTimerRef.current !== null) {
        window.clearTimeout(loadingTimerRef.current);
      }
      loadingTimerRef.current = window.setTimeout(() => setIsLoading(false), 1500);
    }
  }, [user, pass, rememberMe]);

  const handlePassKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeLogin();
      }
    },
    [executeLogin]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      executeLogin();
    },
    [executeLogin]
  );

  return (
    <div className="precision-login-wrapper">
      {/* Background Công Ty Được Bảo Tồn Trọn Vẹn 100% */}
      <div
        className="precision-login-wrapper__bg-image"
        style={{
          backgroundImage: `url('/companybackground.png')`,
        }}
      />

      {/* Lớp phủ Frosted Glass Vignette làm nổi bật Card và tạo chiều sâu hiện đại */}
      <div className="precision-login-wrapper__bg-overlay" />

      {/* Khung Thẻ Đăng Nhập Glassmorphism Chuẩn Google Stitch Enterprise */}
      <div className="precision-login-wrapper__container">
        <div className="precision-login-wrapper__card">
          <PrecisionLoginHeader
            company={company}
            cpnInfo={cpnInfo}
            currentLang={lang}
            onLanguageChange={handleLanguageChange}
            activeServerName={selectedServer}
          />

          <PrecisionLoginForm
            user={user}
            pass={pass}
            serverString={server_string}
            ctrCd={ctr_cd}
            company={company}
            cpnInfo={cpnInfo}
            currentLang={lang}
            isLoading={isLoading}
            passRef={passRef}
            onUserChange={(e) => setUser(e.target.value)}
            onPassChange={(e) => setPass(e.target.value)}
            onUserKeyDown={handleUserKeyDown}
            onPassKeyDown={handlePassKeyDown}
            onServerChange={handleServerChange}
            onBranchChange={handleBranchChange}
            onSubmit={handleSubmit}
          />

          <PrecisionLoginFooter
            currentLang={lang}
            rememberMe={rememberMe}
            onRememberMeChange={setRememberMe}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

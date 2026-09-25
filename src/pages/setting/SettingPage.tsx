import React, { useState, useEffect, useCallback } from "react";
import "./PrecisionSetting/PrecisionSetting.scss";
import { WEB_SETTING_DATA } from "../../api/GlobalInterface";
import { generalQuery, getUserData } from "../../api/Api";
import { useDispatch } from "react-redux";
import { changeGLBSetting } from "../../redux/slices/globalSlice";
import { PrecisionSettingHeader } from "./PrecisionSetting/PrecisionSettingHeader";
import { PrecisionSettingMfaCard } from "./PrecisionSetting/PrecisionSettingMfaCard";
import { PrecisionSettingTable } from "./PrecisionSetting/PrecisionSettingTable";
import { PrecisionSettingNotification } from "./PrecisionSetting/PrecisionSettingNotification";
import {
  PrecisionSettingMobileTabs,
  SettingTabType,
} from "./PrecisionSetting/PrecisionSettingMobileTabs";

const SettingPage: React.FC = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState<Array<WEB_SETTING_DATA>>([]);
  const [activeTab, setActiveTab] = useState<SettingTabType>("mfa");
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768;
    }
    return false;
  });

  const currentUser = getUserData();
  const isAdmin = currentUser?.EMPL_NO === "NHU1903";

  // Theo dõi breakpoint màn hình mobile/tablet (<= 768px)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleResize);
      return () => mediaQuery.removeEventListener("change", handleResize);
    } else {
      mediaQuery.addListener(handleResize);
      return () => mediaQuery.removeListener(handleResize);
    }
  }, []);

  const updateSettingValue = useCallback((ID: number, newValue: any) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.ID === ID ? { ...setting, CURRENT_VALUE: newValue } : setting
      )
    );
  }, []);

  const resetSettingValue = useCallback(() => {
    setSettings((prevSettings) => {
      const reset = prevSettings.map((setting: WEB_SETTING_DATA) => ({
        ...setting,
        CURRENT_VALUE: setting.DEFAULT_VALUE,
      }));
      dispatch(changeGLBSetting(reset));
      localStorage.setItem("setting", JSON.stringify(reset));
      return reset;
    });
  }, [dispatch]);

  const loadWebSetting = useCallback(() => {
    generalQuery("loadWebSetting", {})
      .then((response) => {
        if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          const crST_string = localStorage.getItem("setting") ?? "";
          let loadeddata: WEB_SETTING_DATA[] = [];

          if (crST_string !== "") {
            try {
              const crST: WEB_SETTING_DATA[] = JSON.parse(crST_string);
              loadeddata = response.data.data.map((element: WEB_SETTING_DATA) => ({
                ...element,
                CURRENT_VALUE:
                  crST.find((ele) => ele.ID === element.ID)?.CURRENT_VALUE ??
                  element.DEFAULT_VALUE,
              }));
            } catch (e) {
              loadeddata = response.data.data.map((element: WEB_SETTING_DATA) => ({
                ...element,
                CURRENT_VALUE: element.DEFAULT_VALUE,
              }));
            }
          } else {
            loadeddata = response.data.data.map((element: WEB_SETTING_DATA) => ({
              ...element,
              CURRENT_VALUE: element.DEFAULT_VALUE,
            }));
          }

          dispatch(changeGLBSetting(loadeddata));
          setSettings(loadeddata);
        } else {
          setSettings([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi tải cấu hình hệ thống:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    loadWebSetting();
  }, [loadWebSetting]);

  return (
    <div className={`precision-setting ${isMobile ? "precision-setting--mobile" : ""}`}>
      {/* 1. Header Google Stitch */}
      <PrecisionSettingHeader isMobile={isMobile} />

      {/* 2. Mobile Tabs điều hướng chuẩn UX UI */}
      {isMobile && (
        <PrecisionSettingMobileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasNotificationTab={isAdmin}
          mfaEnabled={mfaEnabled}
          paramCount={settings.length}
        />
      )}

      {/* 3. Nội dung hiển thị: Phân tách theo Device */}
      {isMobile ? (
        /* Giao diện Mobile: Chỉ render tab đang chọn giúp người dùng tập trung & không bị rối mắt */
        <div className="precision-setting__mobile-content">
          {activeTab === "mfa" && (
            <PrecisionSettingMfaCard
              isMobile={true}
              onMfaStatusLoaded={setMfaEnabled}
            />
          )}

          {activeTab === "params" && (
            <PrecisionSettingTable
              settings={settings}
              onUpdateSettingValue={updateSettingValue}
              onResetSettingValue={resetSettingValue}
              isMobile={true}
            />
          )}

          {activeTab === "notifications" && isAdmin && (
            <PrecisionSettingNotification isMobile={true} />
          )}
        </div>
      ) : (
        /* Giao diện Desktop: Grid 2 cột song song chuẩn Google Stitch Enterprise */
        <>
          <div className="precision-setting__grid">
            {/* Cột Trái: Cấu hình Bảo mật 2 bước (Google Authenticator) */}
            <PrecisionSettingMfaCard
              isMobile={false}
              onMfaStatusLoaded={setMfaEnabled}
            />

            {/* Cột Phải: Bảng tham số hệ thống */}
            <PrecisionSettingTable
              settings={settings}
              onUpdateSettingValue={updateSettingValue}
              onResetSettingValue={resetSettingValue}
              isMobile={false}
            />
          </div>

          {/* Phần tiện ích riêng của Quản trị viên (NHU1903) */}
          {isAdmin && <PrecisionSettingNotification isMobile={false} />}
        </>
      )}
    </div>
  );
};

export default SettingPage;
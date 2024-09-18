import { useCallback, useContext, useEffect, useRef, useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../api/Api";
import { LangConText } from "../../api/Context";
import Swal from "sweetalert2";
import { FcList } from "react-icons/fc";
import {
  toggleSidebar,
  setTabModeSwap,
  closeTab,
  changeGLBLanguage,
  switchTheme
} from "../../redux/slices/globalSlice";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addTab, settabIndex, resetTab } from "../../redux/slices/globalSlice";
import { current_ver } from "../../pages/home/Home";
import { Checkbox, FormControlLabel, IconButton, createFilterOptions } from "@mui/material";
import { getlang } from "../String/String";
import "./navbar.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ELE_ARRAY, MENU_LIST_DATA, UserData } from "../../api/GlobalInterface";
import useOutsideClick from "../../api/customHooks";
import { MdOutlineSettings } from "react-icons/md";
import NavMenu from "../NavMenu/NavMenu";
import { SimplifiedSearchMode } from "devextreme/common";
interface SEARCH_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
}
export const minimumSearchLengthLabel = { 'aria-label': 'Minumum Search length' };
export const searchTimeoutLabel = { 'aria-label': 'Search Timeout' };
export const searchExpressionLabel = { 'aria-label': 'Search Expression' };
export const searchModeLabel = { 'aria-label': 'Search Mode' };
export const productLabel = { 'aria-label': 'Product' };
export const simpleProductLabel = { 'aria-label': 'Simple Product' };
export default function Navbar() {
  const [avatarmenu, setAvatarMenu] = useState(false);
  const [langmenu, setLangMenu] = useState(false);
  const [lang, setLang] = useContext(LangConText);
  const refLang = useRef<HTMLDivElement>(null);
  const refMenu = useRef<HTMLDivElement>(null);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const sidebarStatus: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.sidebarmenu,
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useOutsideClick(
    refLang,
    () => {
      setLangMenu(false);
    },
    () => { },
  );
  useOutsideClick(
    refMenu,
    () => {
      setAvatarMenu(false);
    },
    () => { },
  );

  const themeOptions = [
    { value: "linear-gradient(90deg, #7efbbc 0%, #ace95c 100%)", label: "Orange-Yellow" },
    { value: "linear-gradient(90deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)", label: "Green-Blue" },
    { value: "linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)", label: "Pink-Orange" },
    { value: "linear-gradient(90deg, #FEE140 0%, #FA709A 100%)", label: "Yellow-Pink" },
    { value: "linear-gradient(90deg, #8EC5FC 0%, #E0C3FC 100%)", label: "Light Blue-Purple" },
    { value: "linear-gradient(90deg, #FBAB7E 0%, #F7CE68 100%)", label: "Orange-Yellow" },
    { value: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(56,204,255,1) 0%, rgba(17,218,189,1) 100%)", label: "Green-Blue" },
    { value: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)", label: "White" },
    { value: "linear-gradient(0deg, rgba(77, 175, 252,1), rgba(159, 212, 254,1))", label: "Blue" },

  ];


  const switchRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themeOptions.length);
    const randomTheme = themeOptions[randomIndex].value;
    dispatch(switchTheme(randomTheme));
  };
  let intervalId: NodeJS.Timeout;
  useEffect(() => {
    //switchRandomTheme();    
    //  getTheme from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(switchTheme(savedTheme));
    }
    else {
      dispatch(switchTheme(themeOptions[0].value));
    }
  }, []);
  const menulist: MENU_LIST_DATA[] = [
    {
      MENU_CODE: "NS0",
      MENU_NAME: "Account Info",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS1",
      MENU_NAME: getlang("quanlyphongban", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS2",
      MENU_NAME: getlang("diemdanhnhom", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS3",
      MENU_NAME: getlang("dieuchuyenteam", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS4",
      MENU_NAME: getlang("dangky", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS5",
      MENU_NAME: getlang("pheduyet", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS6",
      MENU_NAME: getlang("lichsudilam", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS7",
      MENU_NAME: getlang("quanlycapcao", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS8",
      MENU_NAME: getlang("baocaonhansu", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "NS9",
      MENU_NAME: getlang("listchamcong", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD1",
      MENU_NAME: getlang("quanlypo", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD2",
      MENU_NAME: getlang("quanlyinvoices", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD3",
      MENU_NAME: getlang("quanlyplan", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD4",
      MENU_NAME: getlang("shortage", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD5",
      MENU_NAME: getlang("quanlyFCST", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD6",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD7",
      MENU_NAME: getlang("quanlyPOFull", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD8",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD9",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD10",
      MENU_NAME: getlang("quanlykhachhang", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD11",
      MENU_NAME: getlang("eqstatus", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD12",
      MENU_NAME: getlang("ins_status", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD13",
      MENU_NAME: getlang("baocao", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KD14",
      MENU_NAME: getlang("quanlygia", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "PU1",
      MENU_NAME: getlang("quanlyvatlieu", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "PU2",
      MENU_NAME: getlang("quanlymrp", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC2",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC3",
      MENU_NAME: "IQC",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC4",
      MENU_NAME: "PQC",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC5",
      MENU_NAME: "OQC",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC6",
      MENU_NAME: getlang("inspection", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC7",
      MENU_NAME: "CS",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC8",
      MENU_NAME: getlang("dtc", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC9",
      MENU_NAME: "ISO",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QC10",
      MENU_NAME: getlang("baocaoqc", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "RD1",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "RD2",
      MENU_NAME: getlang("thembomamazon", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "RD3",
      MENU_NAME: getlang("dtc", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "RD4",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "RD5",
      MENU_NAME: getlang("thietkedesignamazon", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "RD6",
      MENU_NAME: getlang("productbarcodemanager", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL2",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL3",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL4",
      MENU_NAME: getlang("quanlyplansx", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL5",
      MENU_NAME: getlang("quanlycapa", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL6",
      MENU_NAME: getlang("quanlymrp", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL7",
      MENU_NAME: "PLAN VISUAL",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL8",
      MENU_NAME: "QUICK PLAN",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL9",
      MENU_NAME: "TRA PLAN",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL10",
      MENU_NAME: "INPUT LIEU",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL11",
      MENU_NAME: "PLAN STATUS",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "QL12",
      MENU_NAME: "EQ STATUS",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX2",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX3",
      MENU_NAME: getlang("datasanxuat", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX4",
      MENU_NAME: getlang("inspection", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX5",
      MENU_NAME: getlang("planstatus", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX6",
      MENU_NAME: getlang("eqstatus", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX7",
      MENU_NAME: getlang("khothat", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX8",
      MENU_NAME: getlang("khoao", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX9",
      MENU_NAME: getlang("lichsuxuatlieuthat", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX10",
      MENU_NAME: getlang("materiallotstatus", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX13",
      MENU_NAME: getlang("sxrolldata", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX14",
      MENU_NAME: getlang("lichsutemlotsx", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX11",
      MENU_NAME: getlang("quanlycapa", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX12",
      MENU_NAME: getlang("hieusuatsx", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "SX15",
      MENU_NAME: getlang("khosub", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KO1",
      MENU_NAME: getlang("nhapxuattontp", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "KO2",
      MENU_NAME: getlang("nhapxuattonlieu", lang),
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "",
      MENU_NAME: "",
      MENU_ITEM: "",
    },
    {
      MENU_CODE: "-1",
      MENU_NAME: "",
      MENU_ITEM: "",
    },
  ];
  const [selectedTab, setSelectedTab] = useState<SEARCH_LIST_DATA>({
    MENU_CODE: "NS2",
    MENU_NAME: getlang("diemdanhnhom", lang),
  });
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap,
  );
  const tabIndex: number = useSelector(
    (state: RootState) => state.totalSlice.tabIndex,
  );
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs,
  );
  const dispatch = useDispatch();
  const customItemCreating = (args: any) => {
    if (!args.text) {
      args.customItem = null;
      return;
    }    
  }
  const editBoxValueChanged = useCallback(({ component }: {component: any}) => {
    let selected: MENU_LIST_DATA = component.option('selectedItem');
    console.log(selected);
    if (selected !== null) {
      setSelectedTab(selected);
      if (
        userData?.JOB_NAME === "ADMIN" ||
        userData?.JOB_NAME === "Leader" ||
        userData?.JOB_NAME === "Sub Leader" ||
        userData?.JOB_NAME === "Dept Staff"
      ) {                      
        if (tabModeSwap) {
          let ele_code_array: string[] = tabs.map(
            (ele: ELE_ARRAY, index: number) => {
              return ele.ELE_CODE;
            },
          );
          let tab_index: number = ele_code_array.indexOf(
            selected.MENU_CODE,
          );
          //console.log(tab_index);
          if (tab_index !== -1) {
            //console.log('co tab roi');
            dispatch(settabIndex(tab_index));
          } else {
            //console.log('chua co tab');
            dispatch(
              addTab({
                ELE_NAME: selected.MENU_NAME,
                ELE_CODE: selected.MENU_CODE,
                REACT_ELE: "",
              }),
            );
            dispatch(settabIndex(tabs.length));
          }
        }
      } else {
        Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
      }
    }
  }, []);
  useEffect(() => {
    let saveLang: any = localStorage.getItem("lang")?.toString();
    if (saveLang !== undefined) {
      setLang(saveLang.toString());
    } else {
      setLang("en");
    }
    let saveTab: any = localStorage.getItem("tabs")?.toString();
    if (saveTab !== undefined) {
      let tempTab: SEARCH_LIST_DATA[] = JSON.parse(saveTab);
      for (let i = 0; i < tempTab.length; i++) {
        if (tempTab[i].MENU_CODE !== "-1")
          dispatch(
            addTab({
              ELE_CODE: tempTab[i].MENU_CODE,
              ELE_NAME: tempTab[i].MENU_NAME,
              REACT_ELE: "",
            }),
          );
      }
      dispatch(settabIndex(0));
      localStorage.setItem(
        "tabs",
        JSON.stringify(
          tempTab.filter(
            (ele: SEARCH_LIST_DATA, index: number) => ele.MENU_CODE !== "-1",
          ),
        ),
      );
      setSelectedTab({
        MENU_CODE: "",
        MENU_NAME: "",
      });
    } else {
    }
    return () => {
      /* window.removeEventListener('scroll', controlNavbar); */
    };
  }, []);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const logout_bt = () => {
    dispatch(resetTab(0));
    logout();
  };
  const showhideAvatarMenu = () => {
    setAvatarMenu(!avatarmenu);
    setLangMenu(false);
  };
  const showhideLangMenu = () => {
    setLangMenu(!langmenu);
    setAvatarMenu(false);
  };
  const changeLanguage = (selectLang: string) => {
    //console.log(selectLang);
    setLangMenu(false);
    setLang(selectLang);
    dispatch(changeGLBLanguage(selectLang));
    localStorage.setItem("lang", selectLang);
  };
  return (
    <div className="navbar">
      <div
        className="wrapper"
        style={{
          backgroundImage: `${company === "CMS"
            ? theme.CMS.backgroundImage
            : theme.PVN.backgroundImage
            }`,
        }}
      >
        <div className="navleft">
          <FcList
            onClick={() => {
              dispatch(toggleSidebar("2"));
            }}
            size={15}
          />
          {sidebarStatus && <NavMenu />}
        </div>
        <div className="navcenter">
          <div className="cmslogo" style={{ cursor: "pointer" }}>
            <Link to="/" className="menulink">
              {company === "CMS" && (
                <img
                  alt="cmsvina logo"
                  src="/logocmsvina.png"
                  width={114.4}
                  height={27.13333}
                />
              )}
              {company === "PVN" && (
                <img
                  alt="pvn logo"
                  src="/logopvn_big.png"
                  width={114.4}
                  height={25}
                />
              )}
              {company === "NHATHAN" && (
                <img
                  alt="nhathan logo"
                  src="/logo_nhathan_small.png"
                  width={160}
                  height={40}
                />
              )}
            </Link>
          </div>
          <div className="webver" style={{ fontSize: "8pt" }}>
            <b> Web Ver: {current_ver} </b>
          </div>
        </div>
        <div className="item">
          <select
            onChange={(e) => {
              dispatch(switchTheme(e.target.value))
              localStorage.setItem('theme', e.target.value);              
            }}
            style={{ padding: '0px', border: 'none', backgroundColor: 'transparent', color: 'gray' }}
          >
            {themeOptions.map((theme, index) => (
              <option key={index} value={theme.value}>{theme.label}</option>
            ))}            
          </select>
        </div>
        <div className="navright">          
          <div className="items">
            <div className="item" onClick={showhideLangMenu}>
              <LanguageIcon className="icon" />
              {lang === "vi"
                ? "Tiếng Việt"
                : lang === "kr"
                  ? "한국어"
                  : "English"}
            </div>
            {langmenu && (
              <div className="langmenu" ref={refLang}>
                <div className="menu">
                  <div className="menu_item">
                    <AccountCircleIcon className="menu_icon" />
                    <span
                      className="menulink"
                      onClick={() => {
                        changeLanguage("vi");
                      }}
                    >
                      Tiếng Việt
                    </span>
                  </div>
                  <div className="menu_item">
                    <LogoutIcon className="menu_icon" />
                    <span
                      className="menulink"
                      onClick={() => {
                        changeLanguage("kr");
                      }}
                    >
                      한국어
                    </span>
                  </div>
                  <div className="menu_item">
                    <LogoutIcon className="menu_icon" />
                    <span
                      className="menulink"
                      onClick={() => {
                        changeLanguage("en");
                      }}
                    >
                      English
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="item">
              <div className={"avatar"} onClick={showhideAvatarMenu}>
                {userData?.EMPL_IMAGE !== "Y" &&
                  userData?.FIRST_NAME?.slice(0, 1)}
                {userData?.EMPL_IMAGE === "Y" && (
                  <img
                    width={25}
                    height={25}
                    src={"/Picture_NS/NS_" + userData?.EMPL_NO + ".jpg"}
                    alt={userData?.EMPL_NO}
                  ></img>
                )}
              </div>
            </div>
            {avatarmenu && (
              <div className="avatarmenu" ref={refMenu}>
                <div className="menu">
                  <div className="menu_item">
                    <AccountCircleIcon className="menu_icon" />
                    <Link
                      to="/accountinfo"
                      className="menulink"
                      onClick={() => setAvatarMenu(false)}
                    >
                      Account Information
                    </Link>
                  </div>
                  <div className="menu_item">
                    <SwitchRightIcon className="menu_icon" />
                    <FormControlLabel
                      sx={{ color: 'green', fontWeight: 'bold' }}
                      label={tabModeSwap ? "Multiple Tabs" : "Single Tab"}
                      control={
                        <Checkbox
                          checked={tabModeSwap}
                          onChange={(e) => {
                            if (!tabModeSwap) {
                              dispatch(resetTab(0));
                              dispatch(
                                addTab({
                                  ELE_CODE: "NS0",
                                  ELE_NAME: "ACCOUNT_INFO",
                                  REACT_ELE: "",
                                }),
                              );
                            }
                            dispatch(setTabModeSwap(!tabModeSwap));
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </div>
                  <div className="menu_item">
                    <MdOutlineSettings size={22} className="menu_icon" />
                    <Link
                      to="/setting"
                      className="menulink"
                      onClick={() => {
                        if (tabModeSwap) {
                          if (
                            userData?.JOB_NAME === "ADMIN" ||
                            userData?.JOB_NAME === "Leader" ||
                            userData?.JOB_NAME === "Sub Leader" ||
                            userData?.JOB_NAME === "Dept Staff"
                          ) {
                            if (tabModeSwap) {
                              let ele_code_array: string[] = tabs.map(
                                (ele: ELE_ARRAY, index: number) => {
                                  return ele.ELE_CODE;
                                },
                              );
                              let tab_index: number = ele_code_array.indexOf(
                                "ST01",
                              );
                              if (tab_index !== -1) {
                                dispatch(settabIndex(tab_index));
                              } else {
                                dispatch(
                                  addTab({
                                    ELE_CODE: "ST01",
                                    ELE_NAME: "SETTING",
                                    REACT_ELE: "",
                                  }),
                                );
                                dispatch(settabIndex(tabs.length));
                              }
                            }
                          } else {
                            Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
                          }
                        }
                      }}
                    >
                      Setting
                    </Link>
                  </div>
                  <div className="menu_item">
                    <LogoutIcon className="menu_icon" />
                    <span
                      className="menulink"
                      onClick={() => {
                        logout_bt();
                      }}
                    >
                      Logout
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {tabModeSwap && false &&
          tabs.filter(
            (ele: ELE_ARRAY, index: number) =>
              ele.ELE_CODE !== "-1" && ele.ELE_CODE !== "NS0",
          ).length > 0 && (
            <div className="closeTab">
              {tabModeSwap &&
                tabs.find(
                  (ele: ELE_ARRAY, index: number) => ele.ELE_CODE !== "-1",
                ) !== undefined && (
                  <IconButton
                    className="buttonIcon"
                    onClick={() => {
                      dispatch(closeTab(1));
                      //console.log(tabs);
                      let checktab: ELE_ARRAY[] = tabs.filter(
                        (ele: ELE_ARRAY, index: number) =>
                          ele.ELE_CODE !== "-1",
                      );
                      if (checktab.length === 1) {
                        dispatch(
                          addTab({
                            ELE_NAME: "Bulletin Board",
                            ELE_CODE: "NS0",
                            REACT_ELE: menulist.filter(
                              (ele: MENU_LIST_DATA, index: number) =>
                                ele.MENU_CODE === "NS0",
                            )[0].MENU_ITEM,
                          }),
                        );
                      }
                    }}
                  >
                    <AiOutlineCloseCircle color="red" size={22} />
                  </IconButton>
                )}
            </div>
          )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Badge,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Switch,
  TextField,
} from "@mui/material";
import {
  AccountCircleRounded,
  CloseRounded,
  LanguageRounded,
  MenuRounded,
  NotificationsRounded,
  PaletteRounded,
  LogoutRounded,
  SettingsRounded,
  SearchRounded,
  SwapHorizRounded,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { RootState } from "../../redux/store";
import {
  addTab,
  changeGLBLanguage,
  resetTab,
  setTabModeSwap,
  settabIndex,
  switchTheme,
  toggleSidebar,
  updateNotiCount,
} from "../../redux/slices/globalSlice";
import { current_ver } from "../../pages/home/Home";
import { logout } from "../../api/Api";
import { UserData } from "../../api/GlobalInterface";
import NotificationPanel from "../NotificationPanel/NotificationPanel";
import NavMenuNew from "../NavMenu/NavMenuNew";
import "./NavBarNew.scss";

type ThemeOption = {
  value: string;
  label: string;
};

interface NavBarNewProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearchFocus: () => void;
  onSearchEnter: () => void;
  onSidebarToggle?: (nextOpen: boolean) => void;
  menuAutoFocusSearch?: boolean;
}

const CMS_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, #7efbbc 0%, #ace95c 100%)", label: "Orange-Yellow" },
  { value: "linear-gradient(90deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)", label: "Green-Blue" },
  { value: "linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)", label: "Pink-Orange" },
  { value: "linear-gradient(90deg, #FEE140 0%, #FA709A 100%)", label: "Yellow-Pink" },
  { value: "linear-gradient(90deg, #8EC5FC 0%, #E0C3FC 100%)", label: "Light Blue-Purple" },
  { value: "linear-gradient(90deg, #FBAB7E 0%, #F7CE68 100%)", label: "Orange-Yellow" },
  { value: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(56,204,255,1) 0%, rgba(17,218,189,1) 100%)", label: "Green-Blue" },
  { value: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)", label: "White" },
  { value: "linear-gradient(0deg, rgba(77, 175, 252,1), rgba(159, 212, 254,1))", label: "Blue" },
  { value: "linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)", label: "Coral-Teal" },
  { value: "linear-gradient(90deg, #FFE45C 0%, #7CFC00 100%)", label: "Lemon-Lime" },
  { value: "linear-gradient(90deg, #FF69B4 0%, #FF1493 55%, #FFC0CB 100%)", label: "Hot Pink-Deep Pink-Light Pink" },
  { value: "linear-gradient(90deg, #FF00FF 0%, #FF4500 50%, #FFD700 100%)", label: "Magenta-OrangeRed-Gold" },
  { value: "linear-gradient(90deg, #00FFFF 0%, #1E90FF 100%)", label: "Cyan-DodgerBlue" },
  { value: "linear-gradient(90deg, #FF1493 0%, #4169E1 100%)", label: "DeepPink-RoyalBlue" },
  { value: "linear-gradient(90deg, #9400D3 0%, #00BFFF 100%)", label: "DarkViolet-DeepSkyBlue" },
  { value: "linear-gradient(90deg, #00FA9A 0%, #00FF00 100%)", label: "MediumSpringGreen-Lime" },
  { value: "linear-gradient(90deg, #FF00FF 0%, #FF69B4 100%)", label: "Magenta-HotPink" },
  { value: "linear-gradient(90deg, #1E90FF 0%, #00BFFF 100%)", label: "DodgerBlue-DeepSkyBlue" },
  { value: "linear-gradient(90deg, #FF6B6B 0%, #556270 100%)", label: "Coral-Slate" },
  { value: "linear-gradient(90deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)", label: "Purple-Pink-Peach" },
  { value: "linear-gradient(90deg, #4B79A1 0%, #283E51 100%)", label: "Sky Blue-Navy" },
  { value: "linear-gradient(90deg, #C6FFDD 0%, #FBD786 50%, #f7797d 100%)", label: "Mint-Yellow-Pink" },
  { value: "linear-gradient(90deg, #8A2387 0%, #E94057 50%, #F27121 100%)", label: "Purple-Red-Orange" },
  { value: "linear-gradient(90deg, #1A2980 0%, #26D0CE 100%)", label: "Deep Blue-Turquoise" },
  { value: "linear-gradient(90deg, #FF416C 0%, #FF4B2B 100%)", label: "Pink-Orange" },
  { value: "linear-gradient(90deg, #654EA3 0%, #EAAFC8 100%)", label: "Purple-Pink" },
  { value: "linear-gradient(90deg, #00B4DB 0%, #0083B0 100%)", label: "Light Blue-Dark Blue" },
  { value: "linear-gradient(90deg, #FDC830 0%, #F37335 100%)", label: "Yellow-Orange" },
  { value: "linear-gradient(90deg, #ED213A 0%, #93291E 100%)", label: "Bright Red-Dark Red" },
  { value: "linear-gradient(90deg, #1D976C 0%, #93F9B9 100%)", label: "Dark Green-Light Green" },
  { value: "linear-gradient(90deg, #834D9B 0%, #D04ED6 100%)", label: "Purple-Magenta" },
  { value: "linear-gradient(90deg, #ADD100 0%, #7B920A 100%)", label: "Lime-Olive" },
  { value: "linear-gradient(90deg, #1A2A6C 0%, #B21F1F 50%, #FDBB2D 100%)", label: "Navy-Red-Yellow" },
  { value: "linear-gradient(90deg, #f8dd55 0%, #caf52d 100%)", label: "Yellow-Orange" },
];

const PVN_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, #f1da67 0%, #d1ce17 100%)", label: "Yellow-Orange" },
];

const NHATHAN_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, hsla(0, 0%, 74%, 1) 0%, hsla(60, 23%, 95%, 1) 100%)", label: "Gray-White" },
];

const DEFAULT_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, #f8dd55 0%, #caf52d 100%)", label: "Yellow-Orange" },
];

const COMPANY_THEME_OPTIONS: Record<string, ThemeOption[]> = {
  CMS: CMS_THEME_OPTIONS,
  PVN: PVN_THEME_OPTIONS,
  NHATHAN: NHATHAN_THEME_OPTIONS,
  default: DEFAULT_THEME_OPTIONS,
};

const hasManagementRole = (userData?: UserData) => {
  return (
    userData?.JOB_NAME === "ADMIN" ||
    userData?.JOB_NAME === "Leader" ||
    userData?.JOB_NAME === "Sub Leader" ||
    userData?.JOB_NAME === "Dept Staff"
  );
};

export default function NavBarNew({ searchText, onSearchTextChange, onSearchFocus, onSearchEnter, onSidebarToggle, menuAutoFocusSearch = true }: NavBarNewProps) {
  const dispatch = useDispatch();
  const navbarRef = useRef<HTMLElement | null>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<HTMLElement | null>(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<HTMLElement | null>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLElement | null>(null);
  const [themeChoice, setThemeChoice] = useState("");

  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const company: string = useSelector((state: RootState) => state.totalSlice.company);
  const lang: string | undefined = useSelector((state: RootState) => state.totalSlice.lang);
  const tabModeSwap: boolean = useSelector((state: RootState) => state.totalSlice.tabModeSwap);
  const sidebarStatus: boolean | undefined = useSelector((state: RootState) => state.totalSlice.sidebarmenu);
  const selectedServer: string = useSelector((state: RootState) => state.totalSlice.selectedServer);
  const cpnInfo: any = useSelector((state: RootState) => state.totalSlice.cpnInfo);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);
  const tabs: any[] = useSelector((state: RootState) => state.totalSlice.tabs);
  const notiCount: number = useSelector((state: RootState) => state.totalSlice.notificationCount ?? 0);

  const themeOptions = COMPANY_THEME_OPTIONS[company] ?? COMPANY_THEME_OPTIONS.default;
  const logoInfo = cpnInfo?.[company] ?? { logoWidth: 48, logoHeight: 48 };
  const backgroundImage = company === "CMS" ? theme?.CMS?.backgroundImage : theme?.PVN?.backgroundImage;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme =
      savedTheme && themeOptions.some((option) => option.value === savedTheme)
        ? savedTheme
        : themeOptions[0]?.value ?? "";

    if (initialTheme) {
      setThemeChoice(initialTheme);
      dispatch(switchTheme(initialTheme));
    }
  }, [dispatch, themeOptions]);

  const handleSidebarToggle = useCallback(() => {
    const nextOpen = !sidebarStatus;
    onSidebarToggle?.(nextOpen);
    dispatch(toggleSidebar("2"));
  }, [dispatch, onSidebarToggle, sidebarStatus]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isCtrlSpace = event.ctrlKey && (event.code === "Space" || event.key === " ");
      if (!isCtrlSpace) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTypingTarget =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;

      if (isTypingTarget) return;

      event.preventDefault();
      handleSidebarToggle();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [handleSidebarToggle]);

  useEffect(() => {
    if (!sidebarStatus || company === "PVN") return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (navbarRef.current?.contains(target)) return;

      dispatch(toggleSidebar("2"));
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [company, dispatch, sidebarStatus]);

  const handleLanguageChange = (selectLang: string) => {
    dispatch(changeGLBLanguage(selectLang));
    localStorage.setItem("lang", selectLang);
    setLanguageAnchorEl(null);
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextTheme = event.target.value;
    setThemeChoice(nextTheme);
    dispatch(switchTheme(nextTheme));
    localStorage.setItem("theme", nextTheme);
  };

  const handleNotificationToggle = (event: MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    dispatch(updateNotiCount(0));
    localStorage.setItem("notification_count", "0");
  };

  const handleLogoutClick = () => {
    setAvatarAnchorEl(null);
    dispatch(resetTab(0));
    logout();
  };

  const handleTabModeToggle = () => {
    if (!tabModeSwap) {
      dispatch(resetTab(0));
      dispatch(
        addTab({
          ELE_CODE: "NS0",
          ELE_NAME: "ACCOUNT_INFO",
          REACT_ELE: "",
          PAGE_ID: -1,
        })
      );
    }
    dispatch(setTabModeSwap(!tabModeSwap));
  };

  const handleSettingClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!tabModeSwap) {
      setAvatarAnchorEl(null);
      return;
    }

    event.preventDefault();
    setAvatarAnchorEl(null);

    if (!hasManagementRole(userData)) {
      Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
      return;
    }

    const eleCodeArray: string[] = tabs.map((ele) => ele.ELE_CODE);
    const tabIndex = eleCodeArray.indexOf("ST01");
    if (tabIndex !== -1) {
      dispatch(settabIndex(tabIndex));
      return;
    }

    dispatch(
      addTab({
        ELE_CODE: "ST01",
        ELE_NAME: "SETTING",
        REACT_ELE: "",
        PAGE_ID: -1,
      })
    );
    dispatch(settabIndex(tabs.length));
  };

  const userDisplayName = [userData?.MIDLAST_NAME, userData?.FIRST_NAME].filter(Boolean).join(" ") || userData?.EMPL_NO || "User";
  const userAvatarLabel = userData?.EMPL_IMAGE === "Y" ? undefined : (userData?.FIRST_NAME?.slice(0, 1) || userData?.MIDLAST_NAME?.slice(0, 1) || "U");

  return (
    <nav ref={navbarRef} className="navbarnx" aria-label="Application top navigation">
      <div className="navbarnx__shell" style={{ backgroundImage }}>
        <div className="navbarnx__brand">
          <IconButton className="navbarnx__toggleButton" onClick={handleSidebarToggle} aria-label="Toggle navigation panel">
            {sidebarStatus ? <CloseRounded /> : <MenuRounded/>}
          </IconButton>

          <Link to="/" className="navbarnx__logoLink" aria-label="Go to home">
            <img
              alt="companylogo"
              src="/companylogo.png"
              width={logoInfo.logoWidth}
              height={logoInfo.logoHeight}
              className="navbarnx__logo"
            />
          </Link>

          <div className="navbarnx__brandMeta">
            <span className="navbarnx__companyTag">{company}</span>
            <div className="navbarnx__statusRow">
              <Chip size="small" className="navbarnx__statusChip" label={`Web Ver ${current_ver}`} />
              <Chip size="small" className="navbarnx__statusChip navbarnx__statusChip--server" label={selectedServer} />
            </div>
          </div>
        </div>

        <div className="navbarnx__searchWrap">
          <TextField
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
            onFocus={onSearchFocus}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              onSearchEnter();
            }}
            fullWidth
            size="small"
            placeholder="Nhập tên menu hoặc mã menu, hoặc bấm Ctrl + Space để tắt mở menu"
            className="navbarnx__searchField"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchText ? (
                <InputAdornment position="end">
                  <IconButton
                    className="navbarnx__searchClear"
                    size="small"
                    onClick={() => onSearchTextChange("")}
                    onMouseDown={(event) => event.preventDefault()}
                    aria-label="Clear search"
                  >
                    <CloseRounded fontSize="inherit" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
        </div>

        <div className="navbarnx__actions">
          {company === "CMS" && (
            <div className="navbarnx__themePicker">
              <PaletteRounded className="navbarnx__actionIcon" />
              <label className="navbarnx__fieldLabel" htmlFor="navbarnx-theme-select">
                Theme
              </label>
              <select
                id="navbarnx-theme-select"
                value={themeChoice}
                onChange={handleThemeChange}
                className="navbarnx__themeSelect"
                aria-label="Select theme"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            className="navbarnx__langTrigger"
            onClick={(event) => setLanguageAnchorEl(event.currentTarget)}
            startIcon={<LanguageRounded />}
            variant="text"
          >
            <span className="navbarnx__triggerLabel">
              {lang === "vi" ? "Tiếng Việt" : lang === "kr" ? "한국어" : "English"}
            </span>
          </Button>

          <IconButton className="navbarnx__notificationButton" onClick={handleNotificationToggle} aria-label="Notifications">
            <Badge badgeContent={notiCount} color="error" max={99}>
              <NotificationsRounded />
            </Badge>
          </IconButton>

          <Button className="navbarnx__avatarTrigger" onClick={(event) => setAvatarAnchorEl(event.currentTarget)}>
            <Avatar className="navbarnx__avatar" src={userData?.EMPL_IMAGE === "Y" ? `/Picture_NS/NS_${userData?.EMPL_NO}.jpg` : undefined}>
              {userAvatarLabel}
            </Avatar>
            <span className="navbarnx__avatarText">{userDisplayName}</span>
          </Button>
        </div>
      </div>

      {sidebarStatus && company !== "PVN" && (
        <div className="navbarnx__menuPanel">
          <NavMenuNew
            mode="overlay"
            onClose={handleSidebarToggle}
            searchText={searchText}
            onSearchTextChange={onSearchTextChange}
            onSearchEnter={onSearchEnter}
            autoFocusSearch={menuAutoFocusSearch}
          />
        </div>
      )}

      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={() => setNotificationAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ className: "navbarnx__notificationPaper" }}
      >
        <NotificationPanel />
      </Popover>

      <Menu
        anchorEl={languageAnchorEl}
        open={Boolean(languageAnchorEl)}
        onClose={() => setLanguageAnchorEl(null)}
        PaperProps={{ className: "navbarnx__menuPaper navbarnx__menuPaper--language" }}
      >
        <MenuItem onClick={() => handleLanguageChange("vi")} selected={lang === "vi"}>
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Tiếng Việt" />
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("kr")} selected={lang === "kr"}>
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="한국어" />
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("en")} selected={lang === "en"}>
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="English" />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={avatarAnchorEl}
        open={Boolean(avatarAnchorEl)}
        onClose={() => setAvatarAnchorEl(null)}
        PaperProps={{ className: "navbarnx__menuPaper navbarnx__menuPaper--avatar" }}
      >
        <div className="navbarnx__profileHeader">
          <Avatar
            className="navbarnx__profileAvatar"
            src={userData?.EMPL_IMAGE === "Y" ? `/Picture_NS/NS_${userData?.EMPL_NO}.jpg` : undefined}
          >
            {userAvatarLabel}
          </Avatar>
          <div className="navbarnx__profileCopy">
            <strong>{userDisplayName}</strong>
            <span>{userData?.JOB_NAME ?? "User"}</span>
          </div>
        </div>

        <Divider />

        <MenuItem component={Link} to="/accountinfo" onClick={() => setAvatarAnchorEl(null)}>
          <ListItemIcon>
            <AccountCircleRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Account Information" />
        </MenuItem>

        <MenuItem disableRipple>
          <FormControlLabel
            control={<Switch checked={tabModeSwap} onChange={() => { handleTabModeToggle(); setAvatarAnchorEl(null); }} />}
            label={tabModeSwap ? "Multiple Tabs" : "Single Tab"}
          />
        </MenuItem>

        <MenuItem component={Link} to="/setting" onClick={handleSettingClick}>
          <ListItemIcon>
            <SettingsRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Setting" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </nav>
  );
}

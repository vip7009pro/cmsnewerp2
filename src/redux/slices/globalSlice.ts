import { createSlice } from "@reduxjs/toolkit";
import type { SliceCaseReducers } from "@reduxjs/toolkit";
import type { GlobalInterface } from "../../api/GlobalInterface";
import { initialTotalState } from "./totalParts/initialTotalState";
import { authReducers } from "./totalParts/authPart";
import { uiReducers } from "./totalParts/uiPart";
import { notificationReducers } from "./totalParts/notificationPart";
import { socketReducers } from "./totalParts/socketPart";
import { tabsReducers } from "./totalParts/tabsPart";
import { chithiReducers } from "./totalParts/chithiPart";

const reducers = {
  ...authReducers,
  ...uiReducers,
  ...notificationReducers,
  ...socketReducers,
  ...tabsReducers,
  ...chithiReducers,
} satisfies SliceCaseReducers<GlobalInterface>;

export const glbSlice = createSlice({
  name: "totalSlice",
  initialState: initialTotalState,
  reducers,
});
export const { changeDiemDanhState, changeUserData, update_socket, toggleSidebar, hideSidebar, addChithiArray, resetChithiArray, changeServer, listen_socket, addTab, addComponent, closeTab, settabIndex, setTabModeSwap, resetTab, logout, login, vendorLogin, vendorLogout, changeGLBLanguage, changeGLBSetting, switchTheme, changeCtrCd, changeSelectedServer, updateNotiCount, changeLagMode} = glbSlice.actions;
export default glbSlice.reducer;

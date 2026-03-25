/**
 * GlobalFunction.tsx - Refactored into a re-export module (Phase 2)
 * All logic has been extracted to smaller, focused services in src/api/services/
 * Components that currently import from here will continue to work without modification.
 */

// 1. Excel Export Service
export {
  SaveExcel,
} from "./services/excelService";

// 2. Permission & Authorization Service
export {
  checkBP,
  ProtectedRoute,
} from "./services/permissionService";

// 3. File Download Service
export {
  f_downloadFile,
  f_downloadFile2,
} from "./services/fileService";

// 4. Notification Service
export {
  f_load_Notification_Data,
  f_insert_Notification_Data,
} from "./services/notificationService";

// 5. Inventory & Warehouse Service
export {
  f_updateStockM090,
  f_updateLossKT,
  f_getI221NextIN_NO,
  f_getI222Next_M_LOT_NO,
  f_Insert_I221,
  f_Insert_I222,
  f_updateBTP_M100,
  f_updateTONKIEM_M100,
  f_update_Stock_M100_CMS,
  f_update_btp_p400,
  f_update_tonkiem_p400,
} from "./services/inventoryService";

// 6. Utility Service (Formatting, Validation, Crypto, Misc)
export {
  zeroPad,
  CustomResponsiveContainer,
  nFormatter,
  checkver,
  autoGetProdPrice,
  weekdayarray,
  removeVietnameseTones,
  deBounce,
  COLORS,
  ERR_TABLE,
  dynamicSort,
  isValidInput,
  checkHSD2,
  renderElement,
  getNumberofDatesFromMonth,
  getWorkingDaysInMonth,
  requestFullScreen,
  generateMultiGradientColors,
  minutesSince,
  encryptData,
} from "./services/utilService";
# ERP Context & Status

## Update - 2026-09-23 (BOM MANAGER: Tinh gọn sidebar 1 dòng, nút NEW chuẩn không rỗng & tô đỏ nhãn trường thiếu)
- **1. Tinh gọn hàng nút Sidebar ([PrecisionBOMSidebar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMSidebar.tsx))**:
  * Chuyển toàn bộ 5 nút hành động chính: **`NEW`**, **`ADD`**, **`ADD VER`**, **`UP LOẠT`**, **`UPDATE`** vào layout 1 hàng ngang duy nhất (`grid-template-columns: repeat(5, 1fr)`), kích thước compact, font 8.5px, padding 2px vừa vặn 100% độ rộng 350px của sidebar.
  * Chuyển nút `CLEAR FORM` cũ thành nút `Clear` nhỏ gọn nằm ở thanh công cụ phụ (`quick-subtools`) bên dưới.
- **2. Bổ sung nút `NEW` reset dữ liệu mặc định chuẩn ([useBOMManagerData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/useBOMManagerData.ts))**:
  * Thiết lập `handleNewProduct`: Tự động điền đầy đủ tất cả các trường bắt buộc không rỗng (khách hàng đầu tiên, Project, Model, kích thước L=100/W=50/PD=100, cavity=1, liner=5, dao, máy, bao bì, FSC...).
  * `G_NAME_KD`: Tạo chuỗi định danh duy nhất `ITEM_YYMMDD_HHmmss` đảm bảo không bị trùng tên trong database.
  * `PROD_MAIN_MATERIAL`: Tự động chọn vật liệu chính đầu tiên từ `masterMaterialList`, đồng bộ `selectedMasterMaterial` và `EXP_DATE`.
  * `QL_HSD`: Đặt `"N"` để vượt qua kiểm tra `checkHSD` ngay lập tức.
  * Reset các bảng `bomsxtable`, `bomgiatable`, `currentProcessList` về rỗng. Người dùng bấm `NEW` xong có thể bấm `ADD` được ngay mà không gặp lỗi thiếu trường hay trùng mã.
- **3. Cập nhật quy tắc check lúc thêm BOM ([useBOMManagerActions.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/useBOMManagerActions.ts))**:
  * Bổ sung cờ `isNew: boolean = false` cho `handleCheckCodeInfo2` và `handleCheckCodeInfo`.
  * Khi tạo mới (`isNew = true` hoặc chưa có `G_CODE`), `G_CODE` được loại trừ khỏi kiểm tra vì hệ thống tự sinh mã qua `getNextG_CODE`.
  * Loại trừ các trường kỹ thuật/file phụ (`BANVE`, `APPSHEET`, `NO_INSPECTION`, `M_NAME_FULLBOM`) khỏi danh sách chặn của `handleCheckCodeInfo2`.
- **4. Nhận diện trực quan & tô đỏ Label các trường thiếu ([PrecisionBOMSpecGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMSpecGrid.tsx) & [PrecisionBOMManager.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMManager.scss))**:
  * Thêm helper `isFieldEmpty` và `getLabelClass` để xác định trường không đạt yêu cầu.
  * Áp dụng class `field-label--invalid` cho tất cả các nhãn của trường bắt buộc đang rỗng/null/undefined (Khách hàng, Dự án, Model, Phân loại, Kích thước, Cavity, Dao, Bao bì, Máy móc...).
  * Style SCSS `.field-label--invalid`: Màu đỏ cảnh báo `#dc2626`, font-weight 700, kèm dấu `*` đỏ nổi bật giúp nhận biết ngay mã sản phẩm cũ đang thiếu thông tin gì để bổ sung kịp thời.
- **5. Xác thực build**: Chạy `npm run build` thành công (`✓ built in 1m 58s`), 0 lỗi.

## Update - 2026-09-22 (AUTH: Fix màn hình trắng khi Logout + làm chắc cơ chế login/logout)
- **Root cause màn hình trắng khi Logout**: `Login` được khai báo `React.lazy()` trong `src/api/lazyPages.ts` nhưng trong `App.tsx` lại render trần `{!globalLoginState && <Login />}` — **không có Suspense/ErrorBoundary nào phía trên**. Khi user vào thẳng app bằng token còn hạn (không đi qua màn login), chunk `Login` chưa từng được tải ⇒ đúng lúc bấm Logout thì `lazy` suspend mà không có boundary ⇒ React 18 unmount cả root ⇒ trắng màn hình cho tới khi F5.
- **Fix chính (`src/App.tsx`)**: bọc `<Login />` trong `<Suspense fallback={<AppBootScreen />}>` + `<ErrorBoundary>`; thêm effect **warm-up chunk Login** sau khi boot xong (1.5s) để `React.lazy` resolve đồng bộ, logout ra màn login tức thì.
- **Fix phụ (`src/components/ErrorBoundary/ErrorBoundary.tsx`)**: nhận diện lỗi tải chunk ⇒ tự `window.location.reload()` **1 lần / 15s** (guard bằng `sessionStorage.erp_chunk_autoreload_at`).
- **`src/api/Api.ts` — `logout()` viết lại**: cờ `loggingOut` chống logout trùng lặp; bỏ `setTimeout(1000)` — xoá `userData` + hạ `loginState` ngay trong cùng nhịp render; thêm `isLoggingOut()` để chặn race "hồi sinh token".
- **Fix race token (`src/pages/home/Home.tsx`)**: `getchamcong()` thêm điều kiện `&& !isLoggingOut()` khi ghi cookie.
- Diagnostics sạch và `npm run build` thành công.

## Update - 2026-09-20 (KD PARITY: Khắc phục toàn bộ sai khác 6 module Kinh Doanh)
- **PO**: khôi phục 3 luật validate đơn lẻ; up hàng loạt kiểm lại dữ liệu trước khi ghi DB; bổ sung notification; nút Phê duyệt bọc `checkBP(["KD"])`; Invoice từ PO khôi phục kiểm tồn tại PO + so sánh ngày + notification.
- **PLAN**: nút PIVOT hoạt động trở lại; EX1 xuất dòng đang hiển thị sau lọc, EX2 xuất toàn bộ; `okCount/ngCount` đẩy từ tab Plan Status lên header.
- **OVER**: `HANDLE_STATUS='Y'` hiển thị lại chip đỏ; chart dùng đúng dữ liệu full; đổi "Only Pending" chỉ còn 1 request.
- **FCST**: bỏ ô REMARK khỏi form thủ công (backend `ZTBFCSTTB` không có cột REMARK).
- **CUST**: khôi phục nút "Sửa Đối Tác" cho dòng đang click, modal hiện đồng thời Add + Update, không ghi đè mã.
- **INVOICE**: memo hoá cột, khôi phục format `currency` cho pivot, ưu tiên lỗi "Không tồn tại PO" khi cập nhật.
- Diagnostics sạch và `npm run build` thành công.

## Update - 2026-09-20 (YCSX: Chốt hành vi up hàng loạt và validate Insert)
- `PROD_REQUEST_DATE` khi Up YCSX hàng loạt luôn = ngày hôm nay (`moment().format("YYYYMMDD")`) cho mọi công ty.
- Validate "Insert" dòng thủ công vào lưới Excel giữ theo `G_CODE + CUST_CD + QTY > 0`.
- Khôi phục phân quyền `checkBP` cho Khóa/Mở YCSX (`["KD"]`) và Khóa/Mở Liệu (`["MUA"]`).
- Nút Mở Liệu khôi phục vào toolbar; khôi phục xóa dòng đã chọn trong bảng preview Excel.
- Diagnostics sạch và `npm run build` thành công.

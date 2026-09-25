# Roadmap - cmsnewerp2

- [x] PWA/SERVICE-WORKER & MOBILE ICON: Sửa lỗi đăng ký Service Worker thất bại khi truy cập route con (`/sx`, `/kinhdoanh/`) do relative path bị tải nhầm `index.html` (MIME text/html) — chuyển sang absolute path `/service-worker.js` với `{ scope: '/' }`; đồng thời khắc phục triệt để lỗi icon PWA trên điện thoại bị mờ căm và vỡ hạt bằng bộ icon chất lượng cao siêu nét `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `logo192.png`, `logo512.png` cùng bộ adaptive `icon-maskable-192.png`, `icon-maskable-512.png` đạt chuẩn Safe Zone; cập nhật `manifest.json`, `index.html` và `service-worker.js`; production build thành công.

- [x] AUTH/BOOTSTRAP: Sửa dứt điểm lỗi login thành công nhưng kẹt lại màn hình login kèm TypeError `Cannot read properties of undefined (reading 'JOB_NAME')` — chuẩn hóa case-insensitive status kiểm tra `tkStatus === "ok"` và guard an toàn `userData` trong `useAppBootstrap.ts` & `Api.ts`; production build thành công (1m 44s).

- [x] AUTH/NETWORK: Khắc phục sự cố kẹt kết nối Load Data & đồng bộ Token/Cookie — cấu hình Axios timeout 45s chống treo vô hạn chiếm dụng 6 sockets của trình duyệt, thêm Response Interceptor bắt mã 401 & TOKEN_EXPIRED tự động cảnh báo và điều hướng logout sạch sẽ, chuẩn hóa options cookie token (sameSite/secure), tối ưu interval 30s chỉ chạy khi tab visible kèm visibilitychange listener tự làm mới token ngay sau khi máy tính thức dậy từ chế độ Sleep; production build thành công.

- [x] CUST_MANAGER: Sửa hiện tượng đóng modal khi nhấn giữ và vuốt chuột ra ngoài (PrecisionCustModal dùng mouseDownTarget ref bắt đầu từ overlay, chỉ đóng khi chủ động click trực tiếp ngoài modal); bổ sung tô đỏ label kèm dấu * đỏ cho các trường trống hoặc null; diagnostics sạch, production build thành công.

- [x] QLVL: Sửa hiện tượng đóng modal khi nhấn giữ và vuốt chuột ra ngoài (CustomDialog dùng mouseDownTarget ref bắt đầu từ overlay); bổ sung tô đỏ label kèm dấu * đỏ cho các trường trống hoặc null và cho phép xóa trắng input số phản hồi thời gian thực; chuẩn hóa payload cast số an toàn; diagnostics sạch, production build thành công.

- [x] BOM MANAGER: Tinh gọn hàng nút sidebar về 1 dòng (NEW, ADD, ADD VER, UP LOẠT, UPDATE), thêm nút NEW reset dữ liệu chuẩn không rỗng, bổ sung tô đỏ label các trường thiếu trong PrecisionBOMSpecGrid kèm dấu * đỏ nhận diện trực quan; diagnostics sạch, production build thành công.

- [x] NHÂN SỰ/LỊCH SỬ: Tối ưu mobile theo viewport — ẩn header/KPI bằng conditional rendering, giữ filterbar + timeline + AGTable, bật cuộn dọc và cấp chiều cao ổn định cho grid; tinh gọn filter bar mobile; diagnostics sạch, production build thành công.

- [x] RND/MUA/QLSX PARITY (đợt 3): Audit 6 component `QLVL`, `BOM_AMAZON`, `DESIGN_AMAZON`, `PRODUCT_BARCODE_MANAGER`, `KHOAO`, `KHOSUB` so với bản `.backup` và sửa sai khác; API parity & `checkBP` parity đều 100%; diagnostics/build thành công.

- [x] QC/DTC PARITY: Khắc phục sai khác khi audit 5 module `INCOMMING`, `DKDTC`, `ADDSPECDTC`, `DTCRESULT`, `TEST_TABLE` so với bản `.backup`; kèm fix backend `qcService.js`; diagnostics/build thành công.

- [x] KD PARITY: Khắc phục toàn bộ sai khác phát hiện khi audit 6 module Kinh Doanh (PO, PLAN, OVER, FCST, CUST, INVOICE); loại bỏ dữ liệu master hardcode; diagnostics/build thành công.

- [x] YCSX: Chốt hành vi nghiệp vụ sau audit — `PROD_REQUEST_DATE` khi up hàng loạt luôn lấy ngày hôm nay cho mọi công ty, siết validate Insert thành `G_CODE + CUST_CD + QTY > 0`; diagnostics/build thành công.

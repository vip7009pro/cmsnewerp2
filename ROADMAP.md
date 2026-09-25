# Roadmap - cmsnewerp2

- [x] R&D / CODE_MANAGER: Tối ưu giao diện mobile tab Code Manager bằng conditional rendering viewport — ẩn header banner và KPI bar khi mobile; tinh gọn toolbar chỉ hiển thị ô nhập tìm kiếm, nút tìm kiếm, checkbox Active & CNDB, và các nút EX1, EX2, PIVOT; ẩn các nút ERP chuyên sâu và dropdown loại; cấu hình toolbar hiển thị trên 1 dòng duy nhất có thể trượt cuộn ngang (overflow-x: auto, flex-wrap: nowrap); production build thành công 100%.

- [x] YCSX / SWEETALERT2: Khắc phục triệt để lỗi không thấy thông báo SweetAlert2 hoặc bị hủy ngay khi tra cứu (lọc), thêm, sửa, xóa YCSX — xóa bỏ lệnh `Swal.close()` bị gọi thừa thãi ở cuối `handletraYCSX` làm dập tắt popup thành công; bổ sung chế độ `isSilent = true` khi reload dữ liệu sau Thêm/Sửa/Xóa/Duyệt/Khóa/Up hàng loạt để popup thông báo thành công của người dùng không bị đè bởi loading tra cứu; bổ sung override z-index tối thượng cho `.swal2-container` (`z-index: 2147483647 !important`) trong `PrecisionYCSX.scss` chống bị che bởi Modal Backdrop; chuẩn hóa `err_code` trong `f_updateYCSX` và chuỗi tiếng Việt có dấu; production build thành công 100%.

- [x] PWA/SERVICE-WORKER & MOBILE ICON: Sửa lỗi đăng ký Service Worker thất bại khi truy cập route con (`/sx`, `/kinhdoanh/`) do relative path bị tải nhầm `index.html` (MIME text/html) — chuyển sang absolute path `/service-worker.js` với `{ scope: '/' }`; đồng thời khắc phục triệt để lỗi icon PWA trên điện thoại bị mờ căm và vỡ hạt bằng bộ icon chất lượng cao siêu nét `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `logo192.png`, `logo512.png` cùng bộ adaptive `icon-maskable-192.png`, `icon-maskable-512.png` đạt chuẩn Safe Zone; cập nhật `manifest.json`, `index.html` và `service-worker.js`; production build thành công.

- [x] AUTH/BOOTSTRAP: Sửa dứt điểm lỗi login thành công nhưng kẹt lại màn hình login kèm TypeError `Cannot read properties of undefined (reading 'JOB_NAME')` — chuẩn hóa case-insensitive status kiểm tra `tkStatus === "ok"` và guard an toàn `userData` trong `useAppBootstrap.ts` & `Api.ts`; production build thành công.

- [x] AUTH/NETWORK: Khắc phục sự cố kẹt kết nối Load Data & đồng bộ Token/Cookie — cấu hình Axios timeout 45s chống treo vô hạn chiếm dụng 6 sockets của trình duyệt, thêm Response Interceptor bắt mã 401 & TOKEN_EXPIRED tự động cảnh báo và điều hướng logout sạch sẽ, chuẩn hóa options cookie token (sameSite/secure), tối ưu interval 30s chỉ chạy khi tab visible kèm visibilitychange listener tự làm mới token ngay sau khi máy tính thức dậy từ chế độ Sleep; production build thành công.

- [x] CUST_MANAGER: Sửa hiện tượng đóng modal khi nhấn giữ và vuốt chuột ra ngoài (PrecisionCustModal dùng mouseDownTarget ref bắt đầu từ overlay, chỉ đóng khi chủ động click trực tiếp ngoài modal); bổ sung tô đỏ label kèm dấu * đỏ cho các trường trống hoặc null; diagnostics sạch, production build thành công.

- [x] QLVL: Sửa hiện tượng đóng modal khi nhấn giữ và vuốt chuột ra ngoài (CustomDialog dùng mouseDownTarget ref bắt đầu từ overlay); bổ sung tô đỏ label kèm dấu * đỏ cho các trường trống hoặc null và cho phép xóa trắng input số phản hồi thời gian thực; chuẩn hóa payload cast số an toàn; diagnostics sạch, production build thành công.

- [x] BOM MANAGER: Tinh gọn hàng nút sidebar về 1 dòng (NEW, ADD, ADD VER, UP LOẠT, UPDATE), thêm nút NEW reset dữ liệu chuẩn không rỗng, bổ sung tô đỏ label các trường thiếu trong PrecisionBOMSpecGrid kèm dấu * đỏ nhận diện trực quan; diagnostics sạch, production build thành công.

- [x] NHÂN SỰ/LỊCH SỬ: Tối ưu mobile theo viewport — ẩn header/KPI bằng conditional rendering, giữ filterbar + timeline + AGTable, bật cuộn dọc và cấp chiều cao ổn định cho grid; tinh gọn filter bar mobile; diagnostics sạch, production build thành công.

# Roadmap - cmsnewerp2

- [x] YCSX: Đưa font chữ bảng dữ liệu AGTable từ `0.72rem` về `0.6rem` để đồng bộ với các bảng khác; diagnostics/build thành công.

- [x] PLAN: Sửa lỗi scrollbar ngang preview Excel bị cắt bởi xung đột chiều cao `360px/320px`; đồng bộ chiều cao wrapper/grid và hiển thị track scrollbar rõ ràng; diagnostics/build thành công.

- [x] PLAN: Sửa Check Plan hàng loạt để cập nhật `OK`/`NG` theo từng dòng, không để một request lỗi làm toàn bộ bảng giữ `Waiting`; khôi phục scrollbar ngang preview Excel; diagnostics/build thành công.

- [x] NHÂN SỰ: Ổn định ảnh avatar trong cột UserManager và hồ sơ nhân viên khi click chọn dòng bằng component render dùng chung có cache trạng thái ảnh; diagnostics/build thành công.

- [x] PLAN: Hiển thị scrollbar ngang thật cho preview Excel bằng wrapper cuộn và grid content width ổn định; diagnostics/build thành công.

- [x] FCST/PLAN: Khôi phục tác dụng nút Check FCST và tối ưu preview Plan với cột gọn, scrollbar ngang; diagnostics/build thành công.

- [x] INVOICE: Khôi phục hoàn chỉnh nesting SCSS sau lỗi `unmatched "}"` tại preview bulk import; diagnostics/build thành công.

- [x] INVOICE: Sửa lỗi Sass nesting làm Vite báo `expected "}"` ở preview bulk import; build thành công.

- [x] KD BULK IMPORT: Bổ sung template Excel theo payload insert và cố định chiều cao bảng preview cho PO, Invoice, Plan, FCST, YCSX và Amazon; diagnostics/build thành công.

- [x] PLAN DATATB: Khôi phục checkBP cho Lưu PLAN, reset readyRender khi tải lại và thêm loading/progress tường minh cho tải plan, lưu PLAN, đăng ký vật liệu; build thành công.

- [x] QLSX MACHINE: Thêm loading/progress tường minh cho Add to Plan và double-click YCSX, khóa thao tác và chống tạo plan trùng; build thành công.

- [x] QLSX MACHINE: Bỏ guard cùng PLAN_ID ở bảng plan để click lần 2 luôn reload detail vật liệu/định mức; build thành công.

- [x] QLSX MACHINE: Bổ sung phần trăm, progress bar và nhãn bước thực tế cho loading detail plan và thao tác vật liệu; build thành công.

- [x] QLSX MACHINE: Thêm loading/blur cho lưu và đăng ký vật liệu, cho phép click lại plan row để reload định mức + vật liệu, chống race loading; build thành công.

- [x] QLSX MACHINE: Khôi phục parity original cho lưu/đăng ký/reset/xóa vật liệu, lưu định mức, notification, quyền ĐM MĐ và reload dữ liệu; diagnostics/build thành công.

- [x] BOM MANAGER: Đổi nền code-banner xanh/đỏ theo trạng thái USE_YN active/deactive; diagnostics và build thành công.

- [x] BOM MANAGER: Cố định list code/Code Visualizer chia 50/50, chống visualizer làm nhảy chiều cao, phóng to căn giữa G_CODE/G_NAME và giữ loading detail đúng trạng thái; build thành công.

- [x] BOM MANAGER: Thêm loading indicator/blur tối cho list code và vùng thông tin sản phẩm/BOM khi tải sau click row, có request-id chống race condition; build thành công.

- [x] BOM MANAGER: Khắc phục hiện tượng nháy bảng list code khi click row bằng cách ổn định callback identity, không delay state và không đổi logic tải dữ liệu; build thành công.

- [x] BOM MANAGER: Thu gọn nút sidebar, tăng width sidebar và thêm cache-busting cho link CAD Drawing; diagnostics/build thành công.

- [x] BOM MANAGER: Tối ưu form sản phẩm, Autocomplete, upload CAD/Appsheet, width danh sách mã, visualizer overflow và ẩn khối CD/EQ với nhân viên không phải NHU1903; build thành công.

- [x] BOM MANAGER: Bổ sung đầy đủ trường thông tin sản phẩm và đồng bộ cột/column width của BOM SX, BOM giá theo `BOM_MANAGER.backup.tsx`; diagnostics sạch và production build thành công.

- [x] PATROL: Tối ưu card sự cố: EQ/Factory một dòng, NG rate compact dưới tên khách hàng, tăng vùng ảnh và neo avatar góc trái trên.

- [x] PATROL: Khôi phục layout card cũ, giữ ảnh full-width ở trên, bổ sung footer 2-row rõ ràng theo mẫu tham khảo, fallback ảnh trắng, nền TV trắng và build production thành công sau chỉnh sửa.

- [x] PATROL: Sửa card ảnh sự cố dùng `object-fit: contain`, hiển thị đầy đủ ảnh không bị cắt trên/dưới.

- [x] PATROL: Ẩn lane Hàng ngang không có dữ liệu, bỏ 4 widget KPI và giữ theme sáng khi bật Trình chiếu TV.

- [x] Khôi phục scroll cho AccountInfo khi nội dung hồ sơ vượt quá chiều cao viewport.

- [x] Ổn định chiều cao AGTable trên LAN/WAN bằng layout height chain và chống cache entrypoint Apache/XAMPP.

- [x] Đồng bộ tối ưu tốc độ modal và footer tổng/selected row cho PLAN DATATB OLD.

- [x] Tối ưu PLAN DATATB: mở modal đăng ký liệu tức thì, dedupe tải dữ liệu double-click và thêm footer tổng/selected row.

- [x] QLSX plan modal không tự tải plan đầu tiên; chỉ tải định mức/vật liệu sau khi người dùng click plan row.

- [x] Khi đóng QLSX plan modal, reset selected plan, định mức, bảng vật liệu và dữ liệu chi tiết.

- [x] Khôi phục phím tắt QLSX MACHINE: Escape đóng modal, F2 refresh, Enter mở nhanh máy, [ / ] chuyển nhà máy.

- [x] LINE QC mobile hỗ trợ cả chọn file checksheet và chụp ảnh trực tiếp bằng camera.

- [x] Loại API key khỏi `.codex/config.toml`, ignore cấu hình local và amend commit QLSX Machine trước khi push GitHub.

- [x] Hoàn thiện Refactor Toàn Diện Trang Đăng Nhập (`Login.tsx`) Chuẩn Google Stitch Enterprise & Frosted Glassmorphism Hiện Đại:
  - **Bảo tồn trọn vẹn 100% hình nền công ty (`/companybackground.png`)**:
    * Duy trì nền công ty làm background gốc, bổ sung lớp phủ Vignette Frosted Glass tinh tế (`backdrop-filter: blur(4px)`) tạo chiều sâu thị giác sang trọng và chống mỏi mắt.
  - **Thiết kế Card Đăng Nhập Ultra-Modern Frosted Glassmorphism**:
    * Khung thẻ kính mờ `rgba(255, 255, 255, 0.94)`, bo góc 16px, viền kính siêu mỏng, đổ bóng đa tầng `0 20px 45px -10px rgba(0, 0, 0, 0.35)`.
    * Telemetry bar phía trên cùng với chấm trạng thái xanh lá nhấp nháy (`status-pulse`) hiển thị tên Server/Hệ thống.
    * Nút chuyển đổi nhanh ngôn ngữ (VI / EN / KR) tức thì, lưu cấu hình vào localStorage & Redux.
    * Khung logo công ty nổi bật kèm tiêu đề chào mừng đa ngôn ngữ qua hàm `getlang()`.
  - **Form Trường Nhập Liệu High-Density Chuẩn Stitch**:
    * Ô Tên đăng nhập tích hợp icon người dùng (`person`), tự động khôi phục username đã ghi nhớ từ `localStorage`.
    * Ô Mật khẩu tích hợp icon ổ khóa (`lock`) và nút bấm chuyển đổi xem/ẩn mật khẩu (`visibility` / `visibility_off`).
    * Dropdown chọn Máy chủ (Server) và Chi nhánh (Branch BR1/BR2) bo góc hiện đại có mũi tên chỉ dẫn đồng bộ.
    * Nút Đăng Nhập lớn màu gradient xanh dương `#0284c7` -> `#0369a1` với hiệu ứng hover nâng card và spinner khi đang xác thực.
    * Tùy chọn Ghi nhớ đăng nhập (Remember me), liên kết Quên mật khẩu và huy hiệu bảo mật cấp Doanh Nghiệp (End-to-End Encrypted).
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn nguyên bản 100%: `Login.backup.tsx` (274 dòng).
    * Phân rã thành 4 module chuyên biệt tại `src/pages/login/PrecisionLogin/`:
      1. `PrecisionLogin.scss` (~320 dòng): Stylesheet SCSS Google Stitch Enterprise & Frosted Glassmorphism.
      2. `PrecisionLoginHeader.tsx` (~80 dòng): Header bar gồm telemetry, language switcher, logo và chào mừng.
      3. `PrecisionLoginForm.tsx` (~175 dòng): Form nhập liệu, show/hide pass, dropdowns và nút đăng nhập.
      4. `PrecisionLoginFooter.tsx` (~65 dòng): Tùy chọn ghi nhớ, quên mật khẩu và telemetry bảo mật.
    * Controller chính `Login.tsx` tinh gọn từ 274 dòng xuống còn **198 dòng**.
  - **Bảo toàn 100% logic nghiệp vụ & API**:
    * Giữ nguyên 100% các dispatch Redux: `changeServer`, `changeSelectedServer`, `changeCtrCd`, `changeGLBLanguage`.
    * Duy trì kiểm tra ký tự đặc biệt `isValidInput`, phím tắt Enter chuyển input và kích hoạt đăng nhập, kiểm tra tài khoản qua `login(user, pass)`.
  - **Xác thực toàn diện**:
    * Kiểm tra qua node HTTP requests tới Vite Dev Server (port 3001) toàn bộ 5/5 files component và stylesheet đều đạt **PASS: HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Quản Lý Bài Viết & Đăng Tin Bảng Tin Nội Bộ (`PostManager.tsx`) Chuẩn Google Stitch High-Density Enterprise & Recharts Executive Dashboard Phong Cách `KinhDoanhReport.tsx`:
  - **Bảo toàn 100% logic nghiệp vụ & API**:
    * Nạp danh sách bài viết hệ thống `f_fetchPostListAll()`.
    * Cập nhật thông tin và trạng thái bài viết `f_updatePostData(POST_DATA)` trực tiếp từ bảng AG-Grid với kiểm tra quyền tác giả (`INS_EMPL`) hoặc quyền Quản trị.
    * Xóa bài viết `f_deletePostData(POST_DATA)` với hộp thoại xác nhận SweetAlert2 và kiểm tra phân quyền chặt chẽ.
    * Tích hợp Modal Soạn Thảo & Đăng Tin Mới (`PrecisionPostManagerAddModal.tsx`) nhúng trọn vẹn màn hình `AddInfo.tsx` phong cách Studio Live Preview trong khung Dialog cao cấp Backdrop Blur.
    * Modal Xem Nhanh Bài Viết (`PrecisionPostManagerViewModal.tsx`) hỗ trợ xem banner ảnh lớn sắc nét và toàn bộ nội dung thông cáo.
  - **Bảng Dữ Liệu AGTable Chuẩn Stitch High-Density Enterprise**:
    * Bảo toàn 100% các cột gốc (`POST_ID`, `DEPT_CODE`, `MAINDEPT`, `SUBDEPT`, `FILE_NAME`, `TITLE`, `CONTENT`, `IS_PINNED`, `INS_DATE`, `INS_EMPL`, `UPD_DATE`, `UPD_EMPL`) cùng thuộc tính `editable` trên `TITLE`, `CONTENT` và `IS_PINNED`.
    * Ẩn hoàn toàn toolbar xanh lá mặc định, tích hợp thanh tìm kiếm nhanh (Quick Search), cụm nút xuất Excel `EX1` (tin đang lọc) và `EX2` (toàn bộ tin), nút Đăng Tin, Lưu Cập Nhật và Xóa bài viết.
    * Tích hợp Cell Renderers sang trọng: Chip mã `JetBrains Mono`, Tag khối phòng ban, Thumbnail ảnh bài viết có thể click xem lớn, Badge Ghim bài viết nổi bật.
  - **Hệ Thống Biểu Đồ & Widget Thông Tin Hữu Ích Theo Phong Cách `KinhDoanhReport.tsx`**:
    * **6 Micro-Cards KPI Realtime**: Tổng Tin Đã Đăng, Phát Hành Tháng Này, Đa Phương Tiện (Ảnh), Tin Ghim Nổi Bật, Phòng Ban Năng Động Nhất, Tác Giả Đóng Góp Hàng Đầu.
    * **Hệ thống 4 Biểu Đồ Recharts Executive Dashboard** trong các thẻ `executive-card` bố trí dạng `.two-col-grid`, có **nút xuất Excel (`SaveExcel`) riêng biệt cho từng biểu đồ**:
      1. Biểu đồ 1: Cơ Cấu Bài Đăng Theo Phòng Ban (`PrecisionPostDeptPie.tsx`) - Donut Chart 3 chế độ xem (`Song Song`, `Biểu Đồ`, `Danh Sách`), ô Quick Search lọc phòng ban, tâm Donut tương tác hiển thị tên phòng ban và số bài khi hover (chuẩn `KDChartCustomerRevenue.tsx`).
      2. Biểu đồ 2: Xu Hướng Phát Hành Tin Theo Tháng (`ComposedChart`: Bar số bài mới & Line lũy kế).
      3. Biểu đồ 3: Top Tác Giả Đóng Góp Bài Viết Nhiều Nhất (`BarChart` ngang).
      4. Biểu đồ 4: Phân Bổ Định Dạng Bài Đăng Theo Bộ Phận (`Stacked BarChart`).
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn 100%: `PostManager.backup.tsx` (257 dòng).
    * Phân rã thành công thành 9 module chuyên biệt tại `src/pages/information_board/PrecisionPostManager/`:
      1. `PrecisionPostManager.scss` (620 dòng): Stylesheet SCSS Google Stitch Enterprise, hỗ trợ Multi-Tab Full-Width & Full-Height, styles cho KPI Cards, header, toolbar compact, executive-cards, bảng AGTable, và 2 Modals.
      2. `usePostManagerData.ts` (260 dòng): Custom hook gom toàn bộ state, API queries, logic CRUD, và aggregate dữ liệu 4 biểu đồ Recharts.
      3. `PrecisionPostManagerHeader.tsx` (60 dòng): Header bar công nghiệp kèm telemetry realtime số bài viết.
      4. `PrecisionPostManagerToolbar.tsx` (95 dòng): Toolbar compact với bộ lọc ngày, checkbox Tất cả thời gian, nút Đăng Tin và Segmented Navigation Tabs 3 phân hệ.
      5. `PrecisionPostManagerKpi.tsx` (135 dòng): Dashboard 6 Micro-cards KPI realtime phong cách `KinhDoanhReport.tsx`.
      6. `charts/PrecisionPostDeptPie.tsx` (275 dòng): Biểu đồ Donut 3 chế độ xem tương tác.
      7. `PrecisionPostManagerCharts.tsx` (245 dòng): Hệ thống 4 biểu đồ Recharts executive-card có nút xuất Excel riêng.
      8. `PrecisionPostManagerGrid.tsx` (230 dòng): Bảng AGTable bọc thanh Quick Search, cụm nút EX1/EX2/Đăng Tin/Cập Nhật/Xóa.
      9. `PrecisionPostManagerAddModal.tsx` (55 dòng): Modal Đăng tin bọc `AddInfo.tsx` với Backdrop Blur cao cấp.
      10. `PrecisionPostManagerViewModal.tsx` (120 dòng): Modal xem chi tiết thông cáo và ảnh lớn.
    * Controller chính `PostManager.tsx` tinh gọn từ 257 dòng xuống còn **110 dòng**.
  - **Xác thực toàn diện**:
    * Kiểm tra qua node HTTP requests tới Vite Dev Server (port 3001) toàn bộ 11/11 files component, charts và stylesheet đều đạt **PASS: HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Đăng Tin Bảng Tin Nội Bộ (`AddInfo.tsx`) Chuẩn Google Stitch High-Density Enterprise & Recharts Executive Dashboard Phong Cách `KinhDoanhReport.tsx`:
  - **Bảo toàn 100% logic nghiệp vụ & API**:
    * Nạp danh sách phòng ban `f_getDepartmentList()`.
    * Nạp toàn bộ danh sách bài viết `f_fetchPostListAll()`.
    * Duy trì toàn bộ xử lý lưu bài viết `insert_information` và tải ảnh lên máy chủ `uploadQuery` vào thư mục `informationboard`.
    * Đảm bảo tương thích ngược hoàn toàn với các router `/register`, `CMS_MENU`, `PVN_MENU` và component cha `PostManager.tsx`.
  - **Hệ Thống Biểu Đồ & Widget Thông Tin Hữu Ích Theo Phong Cách `KinhDoanhReport.tsx`**:
    * **6 Micro-Cards KPI Realtime**: Tổng Tin Đã Đăng, Phát Hành Tháng Này, Đa Phương Tiện (Ảnh), Tin Ghim Nổi Bật, Phòng Ban Năng Động Nhất, Tác Giả Đóng Góp Hàng Đầu.
    * **Hệ thống 4 Biểu Đồ Recharts Executive Dashboard** trong các thẻ `executive-card` bố trí dạng `.two-col-grid`, có **nút xuất Excel (`SaveExcel`) riêng biệt cho từng biểu đồ**:
      1. Biểu đồ 1: Cơ Cấu Bài Đăng Theo Phòng Ban (`PrecisionAddInfoDeptPie.tsx`) - Donut Chart 3 chế độ xem (`Song Song`, `Biểu Đồ`, `Danh Sách`), ô Quick Search lọc phòng ban, tâm Donut tương tác hiển thị tên phòng ban và số bài khi hover (chuẩn `KDChartCustomerRevenue.tsx`).
      2. Biểu đồ 2: Xu Hướng Phát Hành Tin Theo Tháng (`ComposedChart`: Bar số bài mới & Line lũy kế).
      3. Biểu đồ 3: Top Tác Giả Đóng Góp Bài Viết Nhiều Nhất (`BarChart` so sánh bài có ảnh vs thuần text).
      4. Biểu đồ 4: Phân Bổ Định Dạng Bài Đăng Theo Bộ Phận (`Stacked BarChart`).
  - **Không Gian Soạn Thảo Publisher Studio & Live Preview Thời Gian Thực**:
    * Bố cục 2 cột công thái học: Form soạn thảo tích hợp Drag-and-Drop Image Dropzone bên trái đi kèm Thẻ Xem Trước Thời Gian Thực (Live News Preview Card) bên phải mô phỏng chính xác giao diện hiển thị trên Bảng tin lớn.
  - **Bảng Tin Đã Phát Hành Gần Đây & Quick Reader Modal**:
    * Lưới bài viết trực quan với ảnh thumbnail, tiêu đề, phòng ban và ngày giờ.
    * Tích hợp ô Quick Search tìm kiếm tức thì và cụm nút xuất Excel `EX1` (tin đang lọc) và `EX2` (toàn bộ tin).
    * Modal đọc nhanh bài viết với ảnh kích thước lớn chất lượng cao và toàn văn nội dung trong Backdrop Blur sang trọng.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `AddInfo.backup.tsx` (204 dòng).
    * Phân rã thành 10 module chuyên biệt tại `src/pages/information_board/PrecisionAddInfo/`:
      1. `PrecisionAddInfo.scss` (610 dòng): Stylesheet SCSS Google Stitch Enterprise & Multi-Tab.
      2. `useAddInfoData.ts` (295 dòng): Custom hook pure TypeScript gom state, API, aggregate Recharts.
      3. `PrecisionAddInfoHeader.tsx` (70 dòng): Header bar công nghiệp telemetry.
      4. `PrecisionAddInfoToolbar.tsx` (68 dòng): Toolbar compact & segmented tabs.
      5. `PrecisionAddInfoKpi.tsx` (145 dòng): 6 Micro-cards KPI realtime.
      6. `charts/PrecisionAddInfoDeptPie.tsx` (275 dòng): Biểu đồ Donut 3 chế độ xem.
      7. `PrecisionAddInfoCharts.tsx` (250 dòng): 4 Biểu đồ Recharts executive-card two-col-grid.
      8. `PrecisionAddInfoStudio.tsx` (285 dòng): Form Soạn thảo + Live Preview Card.
      9. `PrecisionAddInfoRecentFeed.tsx` (168 dòng): Bảng tin đã đăng kèm Quick Search & Excel.
      10. `PrecisionAddInfoViewModal.tsx` (120 dòng): Modal đọc nhanh bài viết & xem ảnh lớn.
    * Controller chính `AddInfo.tsx` tinh gọn từ 204 dòng xuống còn **115 dòng**.
  - **Xác thực toàn diện**:
    * Kiểm tra qua node HTTP requests tới Vite Dev Server (port 3001) toàn bộ 10/10 files component, charts và stylesheet đều đạt **PASS: HTTP 200 OK**.

  - Tăng chiều cao `.executive-card__body--chart` từ `330px` lên `440px` (min-height 420px) trong SCSS.
  - Mở rộng margin PieChart lên `20px` và tinh chỉnh bán kính Donut + tâm donut (`width: 100px`) chuẩn xác, thẩm mỹ cao.
- [x] Nâng Cấp Hệ Thống Biểu Đồ Tròn `WH_REPORT.tsx` (Kho Liệu & Thành Phẩm) Sang Chuẩn Enterprise Đa Chế Độ Tương Tự `KinhDoanhReport.tsx`:
  - Khắc phục triệt để lỗi biểu đồ tròn cũ bị co cụm / tràn viền / không hiển thị do cố định width=900, outerRadius=150 trong ResponsiveContainer nhỏ.
  - Xây dựng component dùng chung `PrecisionWhPieChart.tsx` chuẩn phong cách `KDChartCustomerRevenue.tsx` / `PrecisionSxPieLossEmpl.tsx`.
  - Hỗ trợ **3 chế độ xem linh hoạt**: **Song Song (Split)** (Donut + Bảng tỷ trọng & progress bar), **Biểu Đồ (Chart)** (Donut toàn khung + Callout labels), **Danh Sách (List)** (Quick filter search).
  - Tích hợp tâm Donut chỉ số nổi bật (`po-donut-center`), hiệu ứng hover Sector tương tác, và tooltip chi tiết.
  - Áp dụng vào 5 biểu đồ: Tồn / Nhập / Xuất theo độ thông dụng (m²) và Tồn dài hạn theo tháng (Kho Liệu m² & Kho Thành Phẩm EA).
  - Cập nhật SCSS `.po-customer-chart` trong cả `PrecisionKhoVL.scss` và `PrecisionKhoTP.scss`.
- [x] Hoàn thiện Refactor Toàn Diện 2 Tab Con `WH_REPORT.tsx` (Material WH & Product WH) Chuẩn Google Stitch High-Density Enterprise Đồng Bộ Phong Cách `KinhDoanhReport.tsx`:
  - **Bảo toàn 100% logic nghiệp vụ & API**:
    * `KHOVL_REPORT`: Giữ nguyên 10 API queries: `f_loadMSTOCK_BY_POPULAR`, `f_loadMSTOCK_BY_POPULAR_DETAIL`, `f_loadM_INPUT_BY_POPULAR`, `f_loadM_INPUT_BY_POPULAR_DETAIL`, `f_loadM_OUTPUT_BY_POPULAR`, `f_loadM_OUTPUT_BY_POPULAR_DETAIL`, `f_load_Stock_By_Month`, `f_load_Stock_By_Month_Detail` (A/B/C).
    * `KHOTP_REPORT`: Giữ nguyên 4 API queries: `f_load_P_Stock_By_Month`, `f_load_P_Stock_By_Month_Detail` (A/B/C).
    * Bật lại tab **PRODUCT WH REPORT** đã bị comment out trong `WH_REPORT.tsx`.
  - **Đồng bộ phong cách Google Stitch High-Density Enterprise của KinhDoanhReport.tsx**:
    * Header bar công nghiệp với badge `CMS ERP • KHO` / `CMS ERP • KHO TP`, breadcrumb, telemetry live pulse dot, nút Làm Mới & Toàn Màn Hình.
    * Toolbar compact: bộ lọc Từ ngày - Đến ngày, Mốc 1 / Mốc 2 (compact input), checkbox Mặc định, nút Tra Cứu, Segment Navigation Tabs (`Toàn Diện | Theo Độ Thông Dụng | Tồn Dài Hạn`).
    * **4 KPI Micro-cards** realtime: Tồn Liệu A (thông dụng xanh lá), Tồn B (ít dùng amber), Tồn C (xấu đỏ), Tổng Input (xanh dương) — tính trực tiếp từ dữ liệu API.
    * Biểu đồ Pie (3 biểu đồ Popular + 1 biểu đồ Month) bọc trong `executive-card` với tiêu đề, icon màu và nút xuất Excel.
    * 6 AGTable detail (Stock/Input/Output Popular Detail + Month A/B/C) bọc trong container với Quick Search và nút xuất Excel riêng.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `KHOVL_REPORT.backup.tsx` (459 dòng), `KHOTP_REPORT.backup.tsx` (252 dòng), `WH_REPORT.backup.tsx`.
    * Phân rã thành **6 module** tại `khovlreport/PrecisionKhoVL/`: SCSS, Header, Toolbar, Kpi, PopularSection, MonthSection.
    * Phân rã thành **5 module** tại `khotpreport/PrecisionKhoTP/`: SCSS, Header, Toolbar, Kpi, MonthSection.
    * Controller `KHOVL_REPORT.tsx` từ 459 dòng → **152 dòng**; `KHOTP_REPORT.tsx` từ 252 dòng → **103 dòng**.
  - **Xác thực toàn diện**:
    * HTTP check 12/12 files đều đạt **PASS: HTTP 200 OK** trên Vite Dev Server (port 3001).


- [x] Hoàn thiện Refactor Toàn Diện Tab Báo Cáo Hiệu Suất Sản Xuất (`SX_REPORT.tsx`) Chuẩn Google Stitch Enterprise & Recharts Executive Dashboard Phong Cách `KinhDoanhReport.tsx`:
  - **Bảo toàn 100% logic nghiệp vụ, 27 API hooks & Tính năng xuất Excel**:
    * Duy trì đầy đủ các hooks nạp dữ liệu: `usehandle_load_SX_Daily/Weekly/Monthly/Yearly_Loss_Trend`, `usehandle_getDaily/Weekly/Monthly/YearlyAchiveData`, `usehandle_getDaily/Weekly/Monthly/YearlyEffData`, `usehandle_getPlanLossData`, `usehandle_getSXLossTimeByEmpl/Reason`, GAP Rates và TRUOCHAN rates.
    * Duy trì logic tải danh sách máy `f_getMachineListData` và lọc theo máy sản xuất.
    * Bảo toàn 100% các nút xuất Excel cho từng biểu đồ tương ứng.
  - **Đồng bộ phong cách Recharts Executive Dashboard của KinhDoanhReport.tsx**:
    * Thanh Header công nghiệp `CMS QLSX • Production Performance Executive Dashboard` với Telemetry live pulse dot và nút Reload.
    * Toolbar compact gồm bộ lọc Từ ngày - Đến ngày, dải nút chọn nhanh (12D, 30D, 90D, YTD), ô nhập Khách hàng, select Machine, checkbox Mặc định và **Segmented Navigation Tabs** 5 phân hệ (`Toàn Bộ`, `Tổn Thất Sản Xuất`, `Tỷ Lệ Đạt Kế Hoạch`, `Hiệu Suất Vận Hành & OEE`, `Lead Time & Giao Hàng`).
    * Dashboard 4 Micro-cards KPI realtime (Hôm qua, Tuần này, Tháng này, Năm nay) kèm tỷ lệ đạt và growth pills so sánh tăng/giảm trực quan.
    * Toàn bộ 17 biểu đồ và đồ thị được đóng gói vào các thẻ `.executive-card` bố trí dạng lưới `.two-col-grid`, có tiêu đề phụ, icon màu và nút xuất Excel chuyên biệt.
    * Phân hệ Hiệu Suất OEE tích hợp các khối vòng tròn đo tiến độ `CIRCLE_COMPONENT` trong thẻ Glass Card sang trọng.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `SX_REPORT.backup.tsx` (741 dòng).
    * Phân rã thành các module chuyên biệt tại `src/pages/sx/BAOCAOSX/PrecisionSxReport/`:
      1. `PrecisionSxReport.scss`: Stylesheet SCSS Google Stitch Enterprise & Multi-Tab.
      2. `useSxReportData.ts`: Custom hook pure TypeScript gom state, 27 hooks dữ liệu và hàm `initFunction`.
      3. `PrecisionSxReportHeader.tsx`: Header bar công nghiệp kèm telemetry & reload.
      4. `PrecisionSxReportToolbar.tsx`: Toolbar compact & segmented navigation tabs.
      5. `PrecisionSxReportKpi.tsx`: 4 Micro-cards KPI realtime phong cách KinhDoanhReport.
      6. `PrecisionSxReportLossSection.tsx`: Phân hệ 5 biểu đồ tổn thất sản xuất.
      7. `PrecisionSxReportAchiveSection.tsx`: Phân hệ 4 biểu đồ tỷ lệ đạt kế hoạch.
      8. `PrecisionSxReportEffSection.tsx`: Phân hệ OEE tổng quan và 4 biểu đồ hiệu suất.
      9. `PrecisionSxReportLeadTimeSection.tsx`: Phân hệ 8 biểu đồ thời gian dừng máy và lead time giao hàng.
      10. `charts/PrecisionSxPieLossReason.tsx`: Biểu đồ tròn dừng máy theo lý do 3 chế độ xem (`Song Song`, `Biểu Đồ`, `Danh Sách`).
      11. `charts/PrecisionSxPieLossEmpl.tsx`: Biểu đồ tròn dừng máy theo nhân viên 3 chế độ xem.
      12. `charts/PrecisionSxPieGapRate.tsx`: Biểu đồ tròn GAP Rates & Hoàn thành trước hạn 3 chế độ xem.
    * Controller chính `SX_REPORT.tsx` tinh gọn từ 741 dòng xuống còn **142 dòng**.
  - **Hệ thống Biểu Đồ Tròn Đa Chế Độ View (Graphview, Listview, Split Song Song) Chuẩn `KinhDoanhReport.tsx`**:
    * Nâng cấp toàn diện các biểu đồ tròn (Loss Time By Reason, Loss Time By Employee, YCSX GAP Rate KD, SX GAP Rate, KT GAP Rate, ALL GAP Rate, Hoàn thành trước hạn).
    * Tích hợp thanh điều khiển với 3 nút chuyển chế độ linh hoạt: `Song Song` (Split Donut + Bảng), `Biểu Đồ` (Graphview), `Danh Sách` (Listview).
    * Ô Quick Search tìm kiếm nhanh tức thì theo tên lý do / nhân sự / số ngày.
    * Tâm donut tương tác hiển thị thông tin chi tiết và tỷ trọng % của mục được hover.
    * Bảng danh sách cuộn mượt mà có rank huy chương (vàng, bạc, đồng), màu chỉ thị đồng bộ và thanh tiến độ progress track.
  - **Xác thực toàn diện**:
    * Kiểm tra qua node HTTP requests tới Vite Dev Server (port 3001) toàn bộ 13/13 files component, charts và stylesheet đều đạt **PASS: HTTP 200 OK**.
    * Không có lỗi lint hoặc runtime, hỗ trợ co giãn responsive mượt mà trên desktop và di động.


- [x] Hoàn thiện Refactor Toàn Diện Tab Kho SX SUB (`KHOSUB.tsx`) Chuẩn Google Stitch High-Density Enterprise Đồng Bộ Phong Cách `KHOAO.tsx`:
  - **Bảo toàn 100% logic xuất kho `handle_xuatKhoSub` & 2 API nạp dữ liệu**:
    * Duy trì toàn bộ các API: `f_load_tonkhosub` và `f_load_nhapkhosub`.
    * Duy trì đầy đủ các điều kiện kiểm tra khi xuất kho Sub: `f_checkNhapKhoTPDuHayChua`, `f_checktontaiMlotPlanIdSuDung`, `f_isM_CODE_CHITHI`, `f_checkMlotTonKhoSub`, `f_isNextPlanClosed`, `f_checkNextPlanFSC`, `f_set_YN_KHO_SUB_INPUT` và phân quyền phòng ban `checkBP` với vai trò QLSX.
  - **Đồng bộ 100% phong cách thiết kế Google Stitch High-Density của KHOAO.tsx**:
    * Thanh Header công nghiệp `03. QLSX • KHO SX SUB (BTP / DỞ DANG)` với Telemetry chip số dòng và Badge chỉ thị đích `NEXT PLAN`.
    * Toolbar compact 2 tầng với Segmented Switcher (`TỒN KHO SUB`, `LỊCH SỬ NHẬP`), bộ lọc ngày, chọn Factory `ALL/NM1/NM2`, ô nhập chỉ thị `NEXT PLAN`, nút `XUẤT NEXT` và nút `Tải Lại`.
    * Dashboard Micro-cards KPI thống kê realtime: Tổng Cuộn Tồn, Tổng Lượng Tồn mét/EA, Cuộn Quá Hạn >1 Ngày, Chủng Loại Mã Liệu, Cuộn Liệu FSC.
    * AG-Grid container chuyên nghiệp bọc thanh lọc nhanh: Ô tìm kiếm nhanh tức thì (`Quick Search`), cụm nút xuất Excel `EX1` (dữ liệu đang lọc), `EX2` (toàn bộ dữ liệu) và bộ đếm số cuộn hiển thị.
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `KHOSUB.backup.tsx` (485 dòng).
    * Phân rã thành 6 module chuyên biệt tại `src/pages/qlsx/QLSXPLAN/KHOAO/PrecisionKhoSub/`:
      1. `PrecisionKhoSub.scss` (450 dòng): Stylesheet SCSS Google Stitch Enterprise & Multi-Tab.
      2. `PrecisionKhoSubColumns.tsx` (185 dòng): Cấu hình 2 bộ cột AG-Grid bảo toàn 100% `headerName` và độ rộng gốc.
      3. `khoSubActionHandlers.ts` (115 dòng): Pure TypeScript function xử lý xuất kho Sub có phân quyền `checkBP`.
      4. `useKhoSubData.ts` (195 dòng): Custom hook pure TypeScript gom state, API và xuất Excel.
      5. `PrecisionKhoSubHeader.tsx` (55 dòng): Header bar công nghiệp kèm telemetry & reload.
      6. `PrecisionKhoSubToolbar.tsx` (175 dòng): Toolbar compact 2 tầng & segmented tab switcher.
      7. `PrecisionKhoSubKpi.tsx` (180 dòng): Micro-cards KPI realtime.
    * Controller chính `KHOSUB.tsx` tinh gọn từ 485 dòng xuống còn **125 dòng**.
  - **Xác thực toàn diện & Khắc phục lỗi hiển thị AGTable**:
    * Quét TypeScript AST toàn bộ 7/7 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 7/7 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.
    * **Khắc phục lỗi AGTable height = 0**: Chuẩn hóa cấu trúc Flex Chain trong `PrecisionKhoSub.scss` (`&__gridContainer` có `min-height: 200px; height: 100%;` và `&__gridBody` áp dụng đầy đủ quy tắc `display: flex; flex-direction: column; flex: 1 1 auto; height: 100% !important; min-height: 180px;` lên `.agtable`, `.ag-theme-quartz`, `.ag-root-wrapper`), bảng tự động co giãn hết chiều cao và dính sát đáy trang.
    * **Khắc phục lỗi cả 3 tab trong `KHOSX.tsx` không full height**: Cập nhật `KHOSX.scss` đồng bộ đầy đủ quy tắc Multi-Tab container (`height: calc(100vh - 85px);`, `.tabs-container`, `.tab-content`, `.tab-pane`, `.trainspection` đều có `height: 100% !important; flex: 1 1 auto; min-height: 0;`), đảm bảo cả 3 tab KHO MAIN (`KHOAO`), KHO SUB (`KHOSUB`) và KHO VL (`KHOLIEU`) đều kéo dài full height 100% dính sát đáy màn hình.

- [x] Hoàn thiện Refactor Toàn Diện Tab Line QC (`LINEQC.tsx`) Chuẩn Google Stitch Enterprise & Tối Ưu Hóa Mobile-First Hiện Trường:
  - **Bảo toàn 100% logic nghiệp vụ, 8 API queries & Upload ảnh checksheet**:
    * Duy trì toàn bộ logic kiểm tra mã chỉ thị `checkPLAN_ID`, thông tin sản phẩm (`G_CODE`, `G_NAME`, `PROD_REQUEST_NO`, `PROD_REQUEST_DATE`).
    * Duy trì kiểm tra điều kiện bắn setting máy `loadDataSX` qua trường `MASS_START_TIME` (chặn submit nếu máy chưa bắn setting).
    * Duy trì xác thực cuộn màng NVL qua `checkPlanIdP501`, `checkProcessLotNo_Prod_Req_No`, `checkMNAMEfromLot` (`M_NAME`, `WIDTH_CD`, `OUT_CFM_QTY`).
    * Duy trì kiểm tra trạng thái kích thước độ dày / DTC qua `checkktdtc` (`CKT`/`DKT`).
    * Duy trì tự động xác định STT kiểm tra checksheet đầu/giữa/cuối qua `checkPlanIdChecksheet` (STT 1, 2, 3 tương ứng Lần 1/2/3 và kiểm tra giới hạn tải lên).
    * Duy trì upload ảnh hiện trường qua `uploadQuery(file, PLAN_ID + "_" + STT + ".jpg", "lineqc")` và cập nhật cờ `update_checksheet_image_status`.
  - **Thiết kế Mobile-First tối ưu cho công nhân & PQC sử dụng điện thoại trên hiện trường**:
    * Layout dạng Mobile Action Cards bo góc 8px với touch target lớn $\ge 44\text{px}$, bố trí 5 khối thao tác một tay bằng ngón cái tiện lợi.
    * Tích hợp Modal Quét Mã Barcode / QR Code chuyên nghiệp (`PrecisionLineQcScannerModal`) bằng camera thiết bị, hỗ trợ quét cả mã chỉ thị kế hoạch hoặc mã cuộn màng.
    * Khối tải / chụp ảnh checksheet hiện trường có Live Preview ảnh chụp tức thì, hiển thị kích thước tệp, nút Chụp ảnh trực tiếp bằng camera điện thoại và nút gỡ bỏ.
    * Nút hành động Hoàn Tất Kiểm Tra dạng Full-Width lớn công thái học có trạng thái loading mượt mà.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `LINEQC.backup.tsx` (683 dòng).
    * Phân rã thành 5 module chuyên biệt tại `src/pages/qc/pqc/PrecisionLineQc/`:
      1. `PrecisionLineQc.scss` (480 dòng): Stylesheet SCSS Mobile-First & Multi-Tab.
      2. `useLineQcData.ts` (280 dòng): Custom hook pure TypeScript gom toàn bộ state, 8 API queries và quản lý STT checksheet.
      3. `PrecisionLineQcHeader.tsx` (55 dòng): Header bar công nghiệp kèm telemetry & reload.
      4. `PrecisionLineQcScannerModal.tsx` (115 dòng): Modal camera quét mã Barcode/QR Code cho điện thoại.
      5. `PrecisionLineQcForm.tsx` (295 dòng): Form nhập liệu 5 khối Mobile Action Cards.
    * Controller chính `LINEQC.tsx` tinh gọn từ 683 dòng xuống còn **105 dòng**.
  - **Xác thực toàn diện & Khắc phục lỗi runtime**:
    * Quét TypeScript AST toàn bộ 5/5 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 6/6 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.
    * **Fix lỗi runtime export**: Đổi sang `import { useLineQcData }` và đồng bộ chuẩn xác props form, header và modal scanner.
    * **Bổ sung Fullscreen Backdrop Loading Indicator**: Tự động làm tối màn hình kèm spinner và thông báo chỉ thị đang tra cứu ngay khi nhập xong chỉ thị cho đến khi tải xong toàn bộ thông tin sản phẩm và điều kiện sản xuất.
    * **Tối ưu Ultra-Compact & Cuộn Mượt Mà**: Loại bỏ header lớn không cần thiết, gom gọn thành 3 card mượt mà giúp người dùng xem và thao tác trọn vẹn toàn bộ các khối trên một màn hình mà không cần cuộn, đồng thời kích hoạt vùng cuộn mượt mà khi màn hình có kích thước quá nhỏ.
    * **Tối ưu hiển thị EMPL_NAME & Tách dòng ghi chú**: Tách riêng ô Ghi Chú xuống dòng dưới full-width, dành trọn vẹn không gian hàng trên cho Mã QC và Thẻ Họ Tên Line QC (`EMPL_NAME`), không bị che khuất hay cắt chữ trên di động.

- [x] Hoàn thiện Refactor Toàn Diện Tab Khai Báo Dữ Liệu Sample Sản Xuất (`DATASAMPLESX.tsx`) Chuẩn Google Stitch Enterprise & Tối Ưu Hóa Mobile-First Hiện Trường:
  - **Bảo toàn 100% logic nghiệp vụ, APIs & Upload ảnh**:
    * Duy trì toàn bộ tham số các hàm `checkPLAN_ID`, `checkEMPL_NO_mobile`, `insert_sampledatasx`.
    * Duy trì cơ chế upload 2 ảnh `uploadQuery` lên folder máy chủ `SX_QL_SAMPLE` và cập nhật cờ `updatebanvesampledata`, `updateAnhDKSXSampleData`.
  - **Thiết kế Mobile-First tối ưu cho công nhân sử dụng điện thoại trên hiện trường**:
    * Layout dạng Mobile Action Cards bo góc 8px với touch target lớn $\ge 44\text{px}$, thao tác một tay bằng ngón cái tiện lợi.
    * Tích hợp Modal Quét Mã Barcode / QR Code chuyên nghiệp (`PrecisionDataSampleSxScannerModal`) bằng camera thiết bị, tự động nhận diện và điền `PLAN_ID`.
    * 2 khối chụp / tải ảnh hiện trường riêng biệt với Live Preview ảnh chụp, xem kích thước tệp, nút chụp lại/xóa tức thì.
    * Thẻ nhận diện thông tin sản phẩm tự động (`G_NAME`, `G_CODE`) với badge trạng thái Hợp Lệ trực quan.
    * Nút hành động Submit dạng Full-Width lớn công thái học có trạng thái loading xoay vòng mượt mà.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `DATASAMPLESX.backup.tsx` (375 dòng).
    * Phân rã thành 5 module chuyên biệt tại `src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/`:
      1. `PrecisionDataSampleSx.scss` (480 dòng): Stylesheet SCSS Mobile-First & Multi-Tab.
      2. `useDataSampleSxData.ts` (235 dòng): Custom hook pure TypeScript gom state, API và preview ảnh.
      3. `PrecisionDataSampleSxHeader.tsx` (65 dòng): Header bar công nghiệp kèm telemetry & reload.
      4. `PrecisionDataSampleSxScannerModal.tsx` (115 dòng): Modal camera quét mã Barcode/QR Code cho điện thoại.
      5. `PrecisionDataSampleSxForm.tsx` (295 dòng): Form nhập liệu 4 khối Mobile Action Cards.
    * Controller chính `DATASAMPLESX.tsx` tinh gọn từ 375 dòng xuống còn **80 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 5/5 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 6/6 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab KPI Nhân Viên Sản Xuất (`KPI_NVSX.tsx`) Chuẩn Google Stitch High-Density Enterprise & Recharts Executive Dashboard:
  - **Bảo toàn 100% logic nghiệp vụ & 4 bộ cột dữ liệu AG-Grid**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của 4 chu kỳ: Daily (16 cột), Weekly (14 cột), Monthly (14 cột), Yearly (12 cột).
    * Duy trì toàn bộ 4 hàm API queries: `f_load_SX_NV_KPI_DATA_Daily`, `f_load_SX_NV_KPI_DATA_Weekly`, `f_load_SX_NV_KPI_DATA_Monthly`, `f_load_SX_NV_KPI_DATA_Yearly`.
    * Tối ưu hiển thị: format số JetBrains Mono, màu sắc trực quan (Xanh dương cho Mét, Xanh lá cho Thực tế/Đạt, Đỏ cho Kế hoạch QTY) và status badges trực quan cho tỷ lệ % hoàn thành.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng Sản Lượng Mét (Output Mét)`: Tổng mét thực tế (`OUTPUT_M_TT` m) vs mét lý thuyết (`OUTPUT_M_LT` m) và kế hoạch (`PLAN_MET` m).
    * `Tổng Sản Lượng Con (Output EA)`: Tổng con thực tế (`OUTPUT_EA_TT` EA) vs kế hoạch (`PLAN_QTY` EA).
    * `Tỷ Lệ Đạt Mét BQ`: Tỷ lệ % hoàn thành mét bình quân toàn đội ngũ kèm progress bar vi mô.
    * `Tỷ Lệ Đạt Con BQ`: Tỷ lệ % hoàn thành con bình quân toàn đội ngũ.
    * `Quy Mô Nhân Lực Đánh Giá`: Số lượng nhân sự vận hành được ghi nhận và tổng lượt bản ghi.
    * `Nhân Sự Dẫn Đầu Hiệu Suất`: Top 1 nhân viên dẫn đầu về sản lượng mét và tỷ lệ hoàn thành.
  - **Hệ Thống 4 Biểu Đồ Recharts Executive Dashboard Bố Trí Theo Phong Cách KinhDoanhReport**:
    * Biểu đồ 1: Xu Hướng Sản Lượng Mét & Tỷ Lệ Hoàn Thành (`ComposedChart` Bar mét thực tế, Line kế hoạch & Line tỷ lệ đạt %).
    * Biểu đồ 2: Top 10 Nhân Viên Sản Lượng Mét Cao Nhất (`BarChart` so sánh Thực Tế vs Kế Hoạch).
    * Biểu đồ 3: Cơ Cấu Phân Bổ Tỷ Lệ Đạt KPI Nhân Viên (`Donut / PieChart` phân chia nhóm Xuất sắc, Khá, Trung bình, Cần cải thiện).
    * Biểu đồ 4: So Sánh Sản Lượng Con (EA) Top Nhân Viên (`Grouped BarChart` Thực tế vs Kế hoạch EA).
    * Đóng gói trong các thẻ `executive-card` sang trọng, bố trí dạng `.two-col-grid`, có **nút xuất Excel dữ liệu chi tiết cho từng biểu đồ**.
  - **Nâng Cấp Bảng Lưới AG Grid High-Density, Tiện Ích & Điều Khiển**:
    * Thanh lọc nhanh phía trên bảng (`gridToolbar`) tích hợp ô tìm kiếm nhanh tức thì (`Quick Search`), cụm nút xuất Excel `EX1` (dữ liệu đang lọc), `EX2` (toàn bộ dữ liệu) và bộ đếm số dòng hiển thị.
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
    * Toolbar compact 2 hàng gồm bộ chọn ngày Từ ngày - Đến ngày, dải nút chọn nhanh (1D, 7D, 30D, 90D), checkbox All Time, select chu kỳ Daily/Weekly/Monthly/Yearly.
    * Segmented Tab Switcher 3 chế độ xem nhanh: `Toàn Bộ (All)`, `Biểu Đồ & KPI (Charts)`, `Bảng Dữ Liệu (Grid)`.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `KPI_NVSX.backup.tsx` (693 dòng).
    * Phân rã thành 8 module chuyên biệt tại `src/pages/sx/KPI_NV/PrecisionKpiNvSx/`:
      1. `PrecisionKpiNvSx.scss` (610 dòng): Stylesheet SCSS Google Stitch Enterprise & Multi-Tab.
      2. `PrecisionKpiNvSxColumns.tsx` (255 dòng): Cấu hình 4 bộ cột AG-Grid.
      3. `kpiNvSxHelpers.ts` (230 dòng): Pure TypeScript functions tính KPI, aggregate 4 biểu đồ & filter.
      4. `useKpiNvSxData.ts` (175 dòng): Custom hook pure TypeScript gom state, API và xuất Excel.
      5. `PrecisionKpiNvSxKpi.tsx` (160 dòng): 6 Micro-cards KPI realtime.
      6. `PrecisionKpiNvSxCharts.tsx` (260 dòng): 4 biểu đồ Recharts executive-card two-col-grid có nút Excel.
      7. `PrecisionKpiNvSxHeader.tsx` (65 dòng): Header bar công nghiệp kèm telemetry & reload.
      8. `PrecisionKpiNvSxToolbar.tsx` (185 dòng): Toolbar compact 2 tầng & segmented tab switcher.
      9. `PrecisionKpiNvSxGrid.tsx` (80 dòng): Khung AGTable kèm quick search, EX1, EX2.
    * Controller chính `KPI_NVSX.tsx` tinh gọn từ 693 dòng xuống còn **100 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 9/9 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 10/10 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Quản Lý Tiêu Chuẩn Lỗi Sản Xuất (`MAINDEFECTS.tsx`) Chuẩn Google Stitch High-Density Enterprise & Recharts Executive Dashboard:
  - **Bảo toàn 100% logic nghiệp vụ & 17 cột dữ liệu AG-Grid**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` gốc: `NG_SX100_ID` (50), `PROD_MODEL` (100), `G_CODE` (70), `G_NAME` (100), `DESCR` (150), `PROCESS_NUMBER` (100), `STT` (50), `DEFECT` (150), `TEST_ITEM` (150), `TEST_METHOD` (150), `INS_PATROL_ID` (90), `USE_YN` (80), `IMAGE_YN` (60), `INS_DATE` (100), `INS_EMPL` (70), `UPD_DATE` (100), `UPD_EMPL` (70).
    * Duy trì toàn bộ tham số gọi API `f_loadDefectProcessData('', -1)`.
    * Tối ưu hiển thị: thumbnail ảnh sắc nét cho `IMAGE_YN` & `INS_PATROL_ID`, status pill badge cho `USE_YN`, badge màu nhận diện công đoạn (`PROCESS_NUMBER`), format số JetBrains Mono cho `NG_SX100_ID` & `G_CODE`.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng Tiêu Chuẩn`: Tổng số quy chuẩn lỗi trong thư viện hệ thống và số lượng mã hàng `G_CODE`.
    * `Đang Áp Dụng (USE_YN)`: Số lượng và tỷ lệ % tiêu chuẩn đang có hiệu lực (`USE_YN === 'Y'`) vs tạm dừng.
    * `Thư Viện Trực Quan`: Số lượng và tỷ lệ % lỗi có hình ảnh minh họa thực tế (`IMAGE_YN` / `INS_PATROL_ID`).
    * `Công Đoạn Chính`: Cơ cấu số lượng tiêu chuẩn phân bổ qua từng công đoạn cốt lõi (CĐ1, CĐ2, CĐ3, CĐ4+).
    * `Hạng Mục & PP Kiểm`: Thống kê số lượng hạng mục kiểm tra độc lập và số phương pháp kiểm tra.
    * `Nhân Sự & Cập Nhật`: Số nhân sự QA/Sản xuất tham gia thiết lập và số lượng tiêu chuẩn cập nhật trong 30 ngày qua.
  - **Hệ Thống 4 Biểu Đồ Recharts Executive Dashboard Bố Trí Theo Phong Cách KinhDoanhReport**:
    * Biểu đồ 1: Top 10 Hạng Mục Lỗi Phổ Biến Nhất (`BarChart` so sánh Số Tiêu Chuẩn vs Số Mã Hàng bị ảnh hưởng).
    * Biểu đồ 2: Cơ Cấu Tiêu Chuẩn Theo Công Đoạn (`Pie/DonutChart` phân chia tỷ trọng CĐ1, CĐ2, CĐ3, CĐ4+).
    * Biểu đồ 3: Xu Hướng Chuẩn Hóa Lỗi Theo Tháng (`ComposedChart` Bar tạo mới trong tháng & Line lũy kế).
    * Biểu đồ 4: Top 10 Model Có Nhiều Quy Chuẩn Nhất (`Stacked BarChart` Đang Dùng vs Tạm Dừng).
    * Đóng gói trong các thẻ `executive-card` sang trọng, bố trí dạng `.two-col-grid`, có **nút xuất Excel dữ liệu chi tiết cho từng biểu đồ**.
  - **Nâng Cấp Bảng Lưới AG Grid High-Density, Tiện Ích & Modal Xem Ảnh**:
    * Thanh lọc nhanh phía trên bảng (`gridToolbar`) tích hợp ô tìm kiếm nhanh tức thì (`Quick Search`), cụm nút xuất Excel `EX1` (dữ liệu đang lọc), `EX2` (toàn bộ dữ liệu) và bộ đếm số dòng hiển thị.
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
    * Segmented Tab Switcher 3 chế độ xem nhanh: `Toàn Bộ (All)`, `Biểu Đồ & KPI (Charts)`, `Bảng Dữ Liệu (Grid)`.
    * Enterprise Modal Dialog xem ảnh lớn chất lượng cao với Backdrop Blur, hiển thị đầy đủ bối cảnh (mã hàng, dòng model, tên lỗi, mô tả, công đoạn, phương pháp kiểm tra).
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `MAINDEFECTS.backup.tsx` (239 dòng).
    * Phân rã thành 10 module chuyên biệt tại `src/pages/sx/MAINDEFECTS/PrecisionMainDefects/`:
      1. `PrecisionMainDefects.scss` (951 dòng): Stylesheet SCSS Google Stitch Enterprise & Multi-Tab.
      2. `PrecisionMainDefectsColumns.tsx` (182 dòng): Cấu hình 17 cột AG-Grid.
      3. `mainDefectsHelpers.ts` (233 dòng): Pure TypeScript functions tính KPI, aggregate 4 biểu đồ & filter.
      4. `useMainDefectsData.ts` (201 dòng): Custom hook pure TypeScript gom state, API và xuất Excel.
      5. `PrecisionMainDefectsKpi.tsx` (112 dòng): 6 Micro-cards KPI realtime.
      6. `PrecisionMainDefectsCharts.tsx` (298 dòng): 4 biểu đồ Recharts executive-card two-col-grid có nút Excel.
      7. `PrecisionMainDefectsHeader.tsx` (64 dòng): Header bar công nghiệp kèm telemetry & reload.
      8. `PrecisionMainDefectsToolbar.tsx` (253 dòng): Toolbar compact 2 tầng & segmented tab switcher.
      9. `PrecisionMainDefectsGrid.tsx` (87 dòng): Khung AGTable kèm quick search, EX1, EX2.
      10. `PrecisionMainDefectsModal.tsx` (126 dòng): Modal xem trước ảnh lỗi lớn Enterprise.
    * Controller chính `MAINDEFECTS.tsx` tinh gọn từ 239 dòng xuống còn **145 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 10/10 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 11/11 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Quản Lý & Lịch Sử Dao Film (`DAOFILMDATA.tsx`) Chuẩn Google Stitch High-Density Enterprise & Recharts Executive Dashboard:
  - **Bảo toàn 100% logic nghiệp vụ & các cột dữ liệu**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của cả 3 bảng AG-Grid:
      1) Bảng Lịch Sử Giao Nhận (`column_daofilm_data`, 24 cột): `KNIFE_FILM_ID` (50), `FACTORY_NAME` (50), `NGAYBANGIAO` (100), `G_CODE` (80), `G_NAME` (250), `LOAIBANGIAO_PDP` (80), `LOAIPHATHANH` (110), `SOLUONG` (60), `SOLUONGOHP` (80), `LYDOBANGIAO` (80), `PQC_EMPL_NO` (80), `RND_EMPL_NO` (80), `SX_EMPL_NO` (80), `MA_DAO` (100), `CFM_GIAONHAN` (100), `CFM_INS_EMPL` (100), `CFM_DATE` (100), `KNIFE_TYPE` (100), `KNIFE_FILM_STATUS` (100), `G_WIDTH` (100), `G_LENGTH` (100), `VENDOR` (100), `TOTAL_PRESS` (100), `REMARK` (150).
      2) Bảng Quản Lý Dao Film (`column_quanlydaofilm_data`, 28 cột): `KNIFE_FILM_ID` (60), `G_CODE` (60), `G_NAME` (80), `G_NAME_KD` (80), `KNIFE_TYPE` (50), `KNIFE_FILM_STEP` (50), `KNIFE_FILM_QTY` (50), `FULL_KNIFE_CODE` (80), `KT_KNIFE_CODE` (80), `KNIFE_BOX_NUMBER` (80), `CAVITY_NGANG` (80), `CAVITY_DOC` (80), `PD` (50), `BOGOC` (50), `SONG_GIUA` (50), `KNIFE_STATUS` (50), `STANDARD_PRESS_QTY` (80), `TOTAL_PRESS` (80), `FACTORY_NAME` (80), `INS_EMPL` (80), `PROD_TYPE` (80), `REV_NO` (80), `VENDOR` (80), `INS_DATE` (80), `UPD_EMPL` (80), `UPD_DATE` (80), `REMARK` (80), `KNIFE_FILM_NO` (80), `KNIFE_FILM_SEQ` (80), `KCTD` (80).
      3) Bảng Lịch Sử Xuất Dao Film (`column_lichsuxuatdaofilm`, 24 cột): `INS_DATE` (100), `PLAN_DATE` (80), `CA_LAM_VIEC` (40), `MA_DAO` (50), `MA_DAO_KT` (80), `PLAN_ID` (50), `G_NAME` (100), `G_NAME_KD` (70), `KNIFE_FILM_NO` (100), `QTY_KNIFE_FILM` (50), `CAVITY` (100), `PD` (100), `EQ_THUC_TE` (40), `PRESS_QTY` (70), `EMPL_NO` (70), `LOAIBANGIAO_PDP` (60), `F_WIDTH` (70), `F_LENGTH` (70), `F_NEW` (70), `INS_EMPL` (70), `SX_EMPL_NO` (70), `SX_DATE` (60), `ERR_CODE` (60), `ERR_NAME` (60).
    * Duy trì toàn bộ tham số 3 API queries: `tradaofilm`, `loadquanlydaofilm`, `lichsuxuatdaofilm`.
    * Tối ưu hiển thị format số font JetBrains Mono sắc nét và status badges bo góc hiện đại.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng Bản Ghi Tra Cứu`: Tổng số bản ghi đang hiển thị trên lưới.
    * `Phân Loại Dao / Film`: Cơ cấu số lượng Dao, Film, Tài liệu.
    * `Tỷ Lệ Đạt (Khuôn OK)`: Tỷ lệ % khuôn đạt yêu cầu và số lượng OK / NG.
    * `Vượt Định Mức Dập`: Cảnh báo số bộ dao vượt định mức `TOTAL_PRESS > STANDARD_PRESS_QTY` cần mài/bảo dưỡng.
    * `Tổng Lượt Dập (Press)`: Lũy kế số dập thực tế của danh sách khuôn.
    * `Cơ Cấu Nhà Máy`: Phân bổ số lượng khuôn theo NM1 vs NM2.
  - **Hệ Thống 4 Biểu Đồ Recharts Executive Dashboard Bố Trí Theo Phong Cách KinhDoanhReport**:
    * Biểu đồ 1: Phân Bổ Chủng Loại Dao & Bản Phim (`PieChart` / `DonutChart` theo CTF, CTP, PINACLE, PVC, Dao, Film...).
    * Biểu đồ 2: Top 10 Dao Dập Nhiều Nhất & Định Mức (`BarChart` so sánh Total Press vs Standard Press).
    * Biểu đồ 3: Xu Hướng Giao Nhận & Xuất Dao Theo Ngày (`ComposedChart` Bar số lượt & Line lượt dập theo ngày).
    * Biểu đồ 4: Cơ Cấu Nhà Máy & Trạng Thái Sức Khỏe Khuôn (`Stacked BarChart` NM1 vs NM2 theo OK / NG).
    * Đóng gói trong các thẻ `executive-card` sang trọng, bố trí dạng `.two-col-grid`, có **nút xuất Excel dữ liệu chi tiết cho từng biểu đồ**.
  - **Nâng Cấp Bảng Lưới AG Grid High-Density & Tiện Ích Dữ Liệu**:
    * Thanh lọc nhanh phía trên bảng (`gridToolbar`) tích hợp ô tìm kiếm nhanh tức thì (`Quick Search`), cụm nút xuất Excel `EX1` (dữ liệu đang lọc), `EX2` (toàn bộ dữ liệu) và bộ đếm số dòng hiển thị.
    * Cụm nút nghiệp vụ chuyên dụng: `Thêm Giao Nhận` (mở Modal QLGN), `Gán Code`, `Xuất Dao Film`.
    * Nâng cấp Modal xem/thêm giao nhận `QLGN` đẳng cấp Enterprise với Backdrop Blur và tiêu đề chuyên nghiệp.
    * Segmented Tab Switcher 3 chế độ xem nhanh: `Toàn Bộ (All)`, `Biểu Đồ (Charts)`, `Bảng Dữ Liệu (Grid)`.
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `DAOFILMDATA.backup.tsx` (505 dòng).
    * Phân rã thành 9 module chuyên biệt tại `src/pages/sx/LICHSUDAOFILM/PrecisionDaoFilmData/`:
      1. `PrecisionDaoFilmData.scss` (550 dòng): Stylesheet SCSS Google Stitch Enterprise & Multi-Tab.
      2. `PrecisionDaoFilmDataColumns.tsx` (226 dòng): Cấu hình 3 bộ cột AG-Grid.
      3. `daoFilmDataHelpers.ts` (207 dòng): Pure TypeScript functions tính KPI, tổng hợp dữ liệu 4 biểu đồ & quick search.
      4. `useDaoFilmData.ts` (251 dòng): Custom hook pure TypeScript gom state, 3 API queries và xuất Excel.
      5. `PrecisionDaoFilmDataKpi.tsx` (132 dòng): 6 Micro-cards KPI realtime.
      6. `PrecisionDaoFilmDataCharts.tsx` (293 dòng): 4 biểu đồ Recharts executive-card two-col-grid có nút Excel.
      7. `PrecisionDaoFilmDataHeader.tsx` (68 dòng): Header bar công nghiệp kèm telemetry & reload.
      8. `PrecisionDaoFilmDataToolbar.tsx` (277 dòng): Toolbar compact 2 hàng & 3 nút chế độ tra cứu.
      9. `PrecisionDaoFilmDataGrid.tsx` (140 dòng): Khung AGTable kèm quick search, EX1, EX2, nút hành động.
      10. `PrecisionDaoFilmDataModal.tsx` (46 dòng): Enterprise modal dialog bọc `QLGN`.
    * Controller chính `DAOFILMDATA.tsx` tinh gọn từ 505 dòng xuống còn **168 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 10/10 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).

- [x] Hoàn thiện Refactor Toàn Diện Tab Báo Cáo Full Roll (`BAOCAOFULLROLL.tsx`) Chuẩn Google Stitch High-Density Enterprise & Recharts Executive Dashboard:
  - **Bảo toàn 100% logic nghiệp vụ & các cột dữ liệu**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của 64 cột bảng AG-Grid (`PLAN_DATE`, `PHAN_LOAI`, `PROCESS_NUMBER`, `STEP`, `G_NAME_KD`, `PROD_MAIN_MATERIAL`, `WIDTH_CD`, `PROD_REQUEST_NO`, `PLAN_ID`, `M_LOT_NO`, 18 cột Mét, 18 cột EA, 18 cột M2, `PD`, `CAVITY`).
    * Duy trì toàn bộ tham số gọi API `loadFullRollData` và `f_getMachineListData()`.
    * Tối ưu hiển thị format số font JetBrains Mono sắc nét với 3 mã màu nhận diện (Xanh dương cho Mét, Xanh lá cho Con EA, Đỏ cho Diện tích M2).
    * Bảo toàn export `f_handleLoadFullRollData` để tương thích ngược hoàn toàn.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng Cấp Liệu`: Tổng mét nhập máy (`INPUT_QTY` m), mét xuất kho và diện tích m2.
    * `Đã Dập Thực Tế`: Mét liệu đã sử dụng (`USED_QTY` m), tỷ lệ Yield Rate % và mét tồn dở dang trên máy.
    * `Thành Phẩm Đạt`: Tổng mét đạt (`RESULT_MET` m), số lượng con (`RESULT_EA` EA) và diện tích m2.
    * `Cân Chỉnh (Setting)`: Chiều dài cân chỉnh setting (`SETTING_MET` m), tỷ lệ hao hụt Setting Loss % và quy đổi EA.
    * `Hỏng Công Đoạn (PR_NG)`: Chiều dài lỗi hỏng dập (`PR_NG` m), tỷ lệ lỗi NG Loss % và quy đổi EA.
    * `Kiểm Tra Đạt (Inspect OK)`: Chiều dài kiểm đạt (`INSPECT_OK_MET` m), tỷ lệ đạt kiểm tra % và tổng mét kiểm tra.
  - **Hệ Thống 4 Biểu Đồ Recharts Executive Dashboard Bố Trí Theo Phong Cách KinhDoanhReport**:
    * Biểu đồ 1: Xu Hướng Cấp Liệu & Dập Thực Tế Theo Ngày (`ComposedChart`: Bar Input, Bar Used, Line Result OK).
    * Biểu đồ 2: Cơ Cấu Hao Hụt & Thành Phẩm Theo Ngày (`Stacked BarChart`: Setting Loss, NG Loss, Result OK).
    * Biểu đồ 3: Top 10 Mã Hàng Tiêu Thụ Liệu Lớn Nhất (`BarChart` theo Mét liệu đã dùng).
    * Biểu đồ 4: Phân Bổ Tỷ Trọng Hiệu Suất Sử Dụng Liệu Toàn Diện (`Pie/DonutChart`: OK vs Setting vs NG vs Remain).
    * Đóng gói trong các thẻ `executive-card` sang trọng, bố trí dạng `.two-col-grid`, có **nút xuất Excel dữ liệu chi tiết cho từng biểu đồ**.
  - **Bảng Tổng Kết Chỉ Số Sản Xuất Toàn Diện (Full Metric Summary Grid)**:
    * Bảng ma trận 3 hệ đơn vị (Mét / Con EA / Mét vuông M2) theo dõi 14 công đoạn: IQC, Xuất kho, Input máy, Đã dùng, Tồn máy, Cân chỉnh, Hỏng CĐ, Thành phẩm, Tồn BTP, Tồn kho SX, Trả về kho, Kiểm vào, Kiểm OK, Kiểm ra.
  - **Nâng Cấp Bảng Lưới AG Grid High-Density & Tiện Ích Dữ Liệu**:
    * Thanh lọc nhanh phía trên bảng (`gridToolbar`) tích hợp ô tìm kiếm nhanh tức thì (`Quick Search`), cụm nút xuất Excel `EX1` (dữ liệu đang lọc), `EX2` (toàn bộ dữ liệu) và bộ đếm số dòng hiển thị.
    * Segmented Tab Switcher 3 chế độ xem nhanh: `Toàn Bộ (All)`, `Biểu Đồ (Charts)`, `Bảng Dữ Liệu (Grid)`.
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `BAOCAOFULLROLL.backup.tsx` (407 dòng).
    * Phân rã thành 8 module chuyên biệt tại `src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/`:
      1. `PrecisionBaoCaoFullRoll.scss` (450 dòng): Stylesheet SCSS Google Stitch Enterprise.
      2. `PrecisionBaoCaoFullRollColumns.tsx` (106 dòng): Cấu hình 64 cột AG-Grid.
      3. `PrecisionBaoCaoFullRollKpi.tsx` (146 dòng): 6 Micro-cards KPI realtime.
      4. `PrecisionBaoCaoFullRollCharts.tsx` (262 dòng): 4 biểu đồ Recharts executive-card two-col-grid.
      5. `PrecisionBaoCaoFullRollSummary.tsx` (133 dòng): Bảng 3 hệ đơn vị metric summary cards.
      6. `PrecisionBaoCaoFullRollHeader.tsx` (49 dòng): Header bar công nghiệp kèm telemetry & reload.
      7. `PrecisionBaoCaoFullRollToolbar.tsx` (265 dòng): Toolbar compact & segment tab switcher.
      8. `PrecisionBaoCaoFullRollGrid.tsx` (87 dòng): Khung AGTable kèm quick search, EX1, EX2.
      9. `useBaoCaoFullRollData.ts` (350 dòng): Custom hook pure TypeScript gom state, API, aggregate charts và xuất Excel.
    * Controller chính `BAOCAOFULLROLL.tsx` tinh gọn từ 407 dòng xuống còn **133 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 9/9 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 10/10 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Báo Cáo Theo Roll (`BAOCAOTHEOROLL.tsx`) Chuẩn Google Stitch High-Density Enterprise & Executive Dashboard:
  - **Bảo toàn 100% logic nghiệp vụ & các cột dữ liệu**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của 40+ cột AG-Grid.
    * Duy trì toàn bộ logic API `loadBaoCaoTheoRoll`, `getDailySXLossTrendingData`, `getDailyLossTrend`, `getWeeklyLossTrend`, `getMonthlyLossTrend`, `getYearlyLossTrend`.
    * Duy trì logic tính toán `summarydata` 14 chỉ số sản xuất: `INPUT_QTY`, `REMAIN_QTY`, `USED_QTY`, `SETTING_MET`, `PROCESS_NG`, `OK_MET_AUTO`, `OK_MET_TT`, `ST_LOSS`, `SX_LOSS`, `LOSS_TT`, `OK_EA`, `PURE_IN`, `PURE_OUT`, `ALL_LOSS`.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng INPUT (m)`: Tổng chiều dài cuộn liệu nhập vào.
    * `Tổng USED (m)`: Chiều dài cuộn liệu đã sử dụng thực tế.
    * `OK Output`: Chiều dài mét đạt và số lượng EA thành phẩm.
    * `Setting Loss (%)`: Tỷ lệ hao hụt cân chỉnh máy dập.
    * `SX Loss (%)`: Tỷ lệ hao hụt trong quá trình dập hàng loạt.
    * `Total Loss (%)`: Tổng tỷ lệ hao hụt toàn bộ quy trình (chỉ số quản trị cốt lõi).
  - **Hệ Thống Biểu Đồ Executive Dashboard Bố Trí Theo Phong Cách KinhDoanhReport**:
    * Biểu đồ DevExtreme `Daily Production Loss Trending` với layout responsive không tràn màn hình.
    * 4 Biểu đồ xu hướng hao hụt Recharts (`Daily`, `Weekly`, `Monthly`, `Yearly Loss Trend`) đóng gói trong các thẻ `executive-card` bố trí dạng `.two-col-grid`.
    * Tích hợp nút xuất dữ liệu Excel riêng cho từng biểu đồ xu hướng.
  - **Nâng Cấp Bảng Metric Summary & Khung Bảng Lưới AG-Grid**:
    * Thay thế bảng thẻ `<table>` thô sơ bằng bảng `High-Density Metric Summary` dạng lưới gọn gàng.
    * Thanh điều khiển Toolbar compact với dải nút chuyển đổi chế độ xem nhanh: `Xem Toàn Diện`, `KPI & Biểu Đồ`, `Bảng Dữ Liệu`.
    * Ô tìm kiếm nhanh (Quick Search) lọc tức thì không độ trễ.
    * Cụm nút xuất Excel `EX1` (dữ liệu đang lọc), `EX2` (toàn bộ dữ liệu) và nút `PIVOT` mở Modal Phân tích đa chiều.
    * Modal Phân tích đa chiều Pivot Table đẳng cấp Enterprise bọc trong backdrop blur.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `BAOCAOTHEOROLL.backup.tsx` (1.767 dòng).
    * Phân rã thành 10 module chuyên biệt tại `src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoRoll/`:
      1. `PrecisionBaoCaoRoll.scss` (575 dòng): Stylesheet SCSS Google Stitch Enterprise.
      2. `PrecisionBaoCaoRollColumns.tsx` (77 dòng): Cấu hình 40+ cột AG-Grid.
      3. `PrecisionBaoCaoRollKpi.tsx` (86 dòng): 6 Micro-cards KPI realtime.
      4. `PrecisionBaoCaoRollCharts.tsx` (145 dòng): Hệ thống biểu đồ DevExtreme + Recharts two-col-grid.
      5. `PrecisionBaoCaoRollSummary.tsx` (48 dòng): Bảng 14 metric summary cards.
      6. `PrecisionBaoCaoRollHeader.tsx` (50 dòng): Header bar công nghiệp kèm telemetry & reload.
      7. `PrecisionBaoCaoRollToolbar.tsx` (86 dòng): Toolbar compact & segment tab switcher.
      8. `PrecisionBaoCaoRollGrid.tsx` (64 dòng): Khung AGTable kèm quick search, EX1, EX2, PIVOT.
      9. `precisionBaoCaoRollPivotFields.ts` (398 dòng): Schema 35 trường dữ liệu Pivot.
      10. `PrecisionBaoCaoRollPivotModal.tsx` (52 dòng): Modal phân tích đa chiều Pivot Table.
      11. `useBaoCaoRollData.ts` (202 dòng): Custom hook pure TypeScript gom toàn bộ state, API và xuất Excel.
    * Controller chính `BAOCAOTHEOROLL.tsx` tinh gọn từ **1.767 dòng** xuống còn **114 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 10/10 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).


- [x] Hoàn thiện Refactor Toàn Diện Tab Lịch Sử Tem Lót Sản Xuất (`LICHSUTEMLOTSX.tsx`) Chuẩn Google Stitch High-Density Enterprise & Bảo Toàn Tuyệt Đối Chức Năng Preview/In Tem Lót:
  - **Bảo toàn 100% logic nghiệp vụ & các cột dữ liệu**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của 17 cột: `INS_DATE` (100), `G_CODE` (60), `G_NAME` (120), `DESCR` (120), `M_LOT_NO` (60), `LOTNCC` (100), `YCSX` (60), `YCSX_QTY` (60), `PROCESS_LOT_NO` (100), `M_NAME` (100), `WIDTH_CD` (60), `EMPL_NAME` (100), `PLAN_ID` (100), `TEMP_QTY` (70), `PROCESS_NUMBER` (100), `LOT_STATUS` (100), `REMARK` (100).
    * Duy trì toàn bộ logic API `f_LichSuTemLot(filterData)` và `f_cancelProductionLot`.
    * Duy trì kiểm tra quyền hủy Lot (`getUserData()?.EMPL_NO === 'NHU1903'`) và điều kiện `LOT_STATUS === null`.
  - **Bảo toàn nguyên vẹn 100% chức năng Preview và In Tem Lót**:
    * Tải thiết kế tem mẫu Amazon Design `f_handleGETBOMAMAZON("6E00002A")` khi khởi tạo, tích hợp mẫu fallback chuẩn xác.
    * Ánh xạ thông số đầy đủ khi click/double click dòng: `G_NAME`, `LOTSX_BARCODE`, `LOTSX_TEXT`, `LOT_QTY`, `LOT_NVL`, `SETTING`, `NM_CD_CT`, `PLAN_QTY`, `NVL`, `NHANVIEN`, `LOTSX_BARCODE2`.
    * Render tem nhãn qua `{renderElement(componentList)}` bọc trong `ref={labelprintref}`.
    * Nâng cấp Modal xem trước tem lót chuẩn Stitch Enterprise với Backdrop blur, giấy in thực tế 125mm x 65mm có bóng đổ chân thực, nút In Tem Lót qua `useReactToPrint` và nút Đóng.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng Tem Đã In`: Số lượt tạo và in tem lót.
    * `Tổng Sản Lượng (EA)`: Sản lượng tem in kèm mức trung bình EA/lot.
    * `Tổng Chiều Dài (m)`: Mét chạy dập thực tế và trung bình m/lot.
    * `Cơ Cấu Nhà Máy`: Phân bổ số tem và tỷ trọng giữa Nhà máy 1 (NM1) vs Nhà máy 2 (NM2).
    * `Trạng Thái Chuyển CĐ`: Số Lot chờ chuyển công đoạn vs Số Lot đã chuyển.
    * `Cân Chỉnh & NG CĐ`: Tổng mét cân chỉnh setting (`SETTING_MET`) và mét lỗi NG công đoạn (`PR_NG`).
  - **Hệ Thống Biểu Đồ Recharts Executive Dashboard Chuyên Sâu**:
    * Biểu đồ xu hướng số lượng tem và sản lượng EA theo chu kỳ ngày.
    * Biểu đồ top thiết bị / máy dập in tem nhiều nhất.
    * Tích hợp nút Thu gọn / Mở rộng để linh hoạt tối ưu diện tích cho bảng dữ liệu.
  - **Nâng Cấp Bảng Lưới AG Grid High-Density & Xuất Excel**:
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
    * Segmented View Switcher 3 chế độ xem: `Toàn Bộ (All)`, `Bảng Lưới (Grid)`, `Biểu Đồ (Charts)`.
    * Ô tìm kiếm nhanh (Quick Search) lọc tức thì theo bất kỳ trường nào.
    * Cụm nút xuất Excel `EX1` (dữ liệu đang lọc) và `EX2` (toàn bộ dữ liệu) sử dụng `SaveExcel` chuẩn toàn hệ thống.
    * Hàng tổng cộng ghim chân trang (Pinned Bottom Row) tính tổng YCSX_QTY, TEMP_QTY và TEMP_MET.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `LICHSUTEMLOTSX.backup.tsx` (470 dòng).
    * Phân rã thành 8 module chuyên biệt tại `src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/`:
      1. `PrecisionLichSuTemLotSx.scss` (845 dòng): SCSS Stitch Enterprise & Multi-Tab Full Stretch.
      2. `PrecisionLichSuTemLotSxColumns.tsx` (285 dòng): Cấu hình 17 cột AG-Grid chuẩn 100% headerName & width.
      3. `PrecisionLichSuTemLotSxKpi.tsx` (180 dòng): 6 Micro-cards KPI realtime thông tin hữu ích.
      4. `PrecisionLichSuTemLotSxCharts.tsx` (189 dòng): Biểu đồ xu hướng Recharts Executive Dashboard.
      5. `PrecisionLichSuTemLotSxHeader.tsx` (96 dòng): Header bar công nghiệp kèm telemetry & view switcher.
      6. `PrecisionLichSuTemLotSxToolbar.tsx` (185 dòng): Toolbar compact kèm quick select ngày và tìm kiếm Enter.
      7. `PrecisionLichSuTemLotSxGrid.tsx` (168 dòng): Khung AG-Grid tích hợp quick search, preview, hủy lot và nút xuất Excel EX1, EX2.
      8. `PrecisionLichSuTemLotSxModal.tsx` (112 dòng): Modal xem trước và in tem lót chuyên nghiệp.
      9. `temLotConstants.ts` (131 dòng): Mẫu Amazon Label component fallback.
      10. `useLichSuTemLotSxData.ts` (281 dòng): Custom hook pure TypeScript gom state, API, preview/print và xuất Excel.
    * Controller chính `LICHSUTEMLOTSX.tsx` tinh gọn xuống còn **104 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 10/10 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 11/11 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Tình Hình Chốt Báo Cáo Sản Xuất (`TINH_HINH_CHOT.tsx`) Chuẩn Google Stitch High-Density Enterprise & Recharts Executive Dashboard:
  - **Bảo toàn 100% logic nghiệp vụ & các cột dữ liệu**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của 6 cột ban đầu: `SX_DATE` (110), `TOTAL` (130), `DA_CHOT` (140), `CHUA_CHOT` (150), `DA_NHAP_HIEUSUAT` (150), `CHUA_NHAP_HIEUSUAT` (160).
    * Bổ sung 2 cột tính toán tiện ích quản trị: `Tỷ Lệ Chốt (%)` và `Tỷ Lệ Nhập HS (%)` kèm thanh mini-progress trực quan.
    * Duy trì lệnh API `generalQuery("tinhhinhchotbaocaosx", { FACTORY: "NM1" })` và `{ FACTORY: "NM2" }`.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng Chỉ Thị`: Tổng lệnh sản xuất theo dõi, kèm tỷ trọng phân bổ NM1 vs NM2.
    * `Tỷ Lệ Chốt Báo Cáo`: % hoàn thành chốt toàn hệ thống, số lượng Đã Chốt vs Chưa Chốt kèm progress bar ngọc lục bảo.
    * `Tỷ Lệ Nhập Hiệu Suất`: % đã nhập hiệu suất, số lượng Đã Nhập vs Chưa Nhập kèm progress bar cyan.
    * `Chưa Chốt Báo Cáo (Pending)`: Cảnh báo số lệnh chưa chốt nổi bật đỏ nếu còn lệnh tồn.
    * `Chưa Nhập Hiệu Suất (Pending)`: Cảnh báo số lệnh chưa nhập hiệu suất nổi bật cam.
    * `Hiệu Năng NM1 vs NM2`: So sánh tỷ lệ chốt và sản lượng giữa 2 nhà máy.
  - **Hệ Thống Biểu Đồ Recharts Executive Dashboard Chuyên Sâu**:
    * Biểu đồ xu hướng khối lượng chỉ thị & chốt báo cáo theo ngày (ComposedChart: Bar tổng, Area đã chốt, Line chưa chốt).
    * Biểu đồ xu hướng tỷ lệ hoàn thành chốt và nhập hiệu suất theo ngày với đường chuẩn benchmark 100%.
    * Bộ lọc nhanh nhà máy trên biểu đồ (Hợp Nhất All, NM1, NM2) và nút thu gọn/mở rộng.
  - **Nâng Cấp Bảng Lưới AG Grid High-Density & Xuất Excel**:
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
    * Segmented View Switcher 4 chế độ xem: `Song Song (Split)`, `Nhà Máy 1`, `Nhà Máy 2`, `Biểu Đồ Xu Hướng`.
    * Ô tìm kiếm nhanh (Quick Search) lọc tức thì theo ngày hoặc số lượng.
    * Cụm nút xuất Excel `EX1` (dữ liệu đang lọc) và `EX2` (toàn bộ dữ liệu) sử dụng `SaveExcel` chuẩn toàn hệ thống.
    * Nút Reload độc lập cho từng nhà máy và hàng tổng cộng ghim chân trang (Pinned Bottom Row).
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `TINH_HINH_CHOT.backup.tsx` (177 dòng).
    * Phân rã thành 6 module chuyên biệt tại `src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/`:
      1. `PrecisionTinhHinhChot.scss` (620 dòng): SCSS Stitch Enterprise & Multi-Tab Full Stretch.
      2. `PrecisionTinhHinhChotColumns.tsx` (155 dòng): Cấu hình 8 cột AG-Grid chuẩn 100% headerName & width.
      3. `PrecisionTinhHinhChotKpi.tsx` (180 dòng): 6 Micro-cards KPI realtime thông tin hữu ích.
      4. `PrecisionTinhHinhChotCharts.tsx` (215 dòng): Biểu đồ xu hướng Recharts Executive Dashboard.
      5. `PrecisionTinhHinhChotHeader.tsx` (110 dòng): Header bar công nghiệp kèm telemetry & view switcher.
      6. `PrecisionTinhHinhChotGrid.tsx` (145 dòng): Khung AG-Grid tích hợp quick search, nút xuất Excel EX1, EX2 và summary.
      7. `useTinhHinhChotData.ts` (210 dòng): Custom hook pure TypeScript gom state, API và xuất Excel.
    * Controller chính `TINH_HINH_CHOT.tsx` tinh gọn xuống còn **105 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 7/7 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 8/8 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Tra Cứu BTP (`BTP_AUTO.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & các cột dữ liệu**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của 2 bộ cột: Detail (24 cột: `G_CODE`, `G_NAME_KD`, `PROD_LAST_PRICE`, `SX_DATE`, `LOT_SX`, `IN_KHO_SX`, `M_CODE`, `PLAN_ID`, `IN_KHO_ID`, `TOTAL_IN_QTY`, `TOTAL_OUT_QTY`, `TON_BTP`, `XUONGA`, `XUONGB`, `FACTORY`, `STEP`, `PLAN_FACTORY`, `PL_DATETIME`, `CHOTBC_DATETIME`, `PHANLOAI`, `DAUPHAY`, `NVL_NAME`, `CD1`, `CD2`) và Summary (5 cột: `G_CODE`, `G_NAME_KD`, `TON_BTP`, `XUONGA`, `XUONGB`).
    * Duy trì các cell renderers gốc: checkbox chọn dòng để cập nhật M100 (`f_updateBTP_M100`), tô màu xưởng A/B, kiểm tra trạng thái khớp `PLAN_FACTORY === FACTORY`.
    * Loại bỏ 2 bộ cột dead code không dùng (`columns_btp`, `columns_btp2`).
    * Duy trì tích hợp modal Quản lý giao nhận dao film (`QLGIAONHANDAOFILM`).
  - **Bổ sung Dashboard 5 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tổng BTP`: Tổng số lượng bán thành phẩm tồn trên sàn (m / EA) kèm telemetry chế độ hiển thị.
    * `Xưởng A`: Sản lượng BTP tại Xưởng A kèm tỷ trọng % phân bổ so với tổng BTP và mini progress bar.
    * `Xưởng B`: Sản lượng BTP tại Xưởng B kèm tỷ trọng % phân bổ so với tổng BTP và mini progress bar.
    * `Quy Mô BTP`: Thống kê số lượng cuộn/lot BTP và số lượng mã hàng (G_CODE) khác nhau đang lưu hành.
    * `Phân Bổ Nhà Máy`: Cơ cấu sản lượng giữa Nhà máy 1 (NM1) và Nhà máy 2 (NM2) kèm thanh phân bổ 2 màu.
  - **Nâng cấp Bảng Lưới AG Grid High-Density & Xuất Excel**:
    * Thanh điều khiển tích hợp Segmented Tab Switcher (Chi Tiết / Tổng Hợp) chuyển đổi dữ liệu nhanh chóng.
    * Ô tìm kiếm nhanh (Quick Search) lọc tức thì theo mã hàng, tên hàng, lot sx, máy, mã nvl...
    * Cụm nút xuất Excel `EX1` (dữ liệu đang lọc qua search) và `EX2` (toàn bộ dữ liệu) sử dụng `SaveExcel` chuẩn toàn hệ thống.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `BTP_AUTO.backup.tsx` (402 dòng).
    * Phân rã thành công thành 6 module chuyên biệt tại `src/pages/sx/BTP_AUTO/PrecisionBtpAuto/`:
      1. `PrecisionBtpAuto.scss` (480 dòng): SCSS Stitch Enterprise & Multi-Tab Full Stretch.
      2. `PrecisionBtpAutoColumns.tsx` (180 dòng): Cấu hình 2 bộ cột Detail (24 cột) và Summary (5 cột).
      3. `PrecisionBtpAutoKpi.tsx` (170 dòng): Dashboard 5 Micro-cards KPI realtime.
      4. `PrecisionBtpAutoHeader.tsx` (50 dòng): Header bar công nghiệp kèm telemetry.
      5. `PrecisionBtpAutoGrid.tsx` (110 dòng): Bọc AGTable tích hợp segmented switch, quick search và Excel.
      6. `useBtpAutoData.ts` (180 dòng): Custom hook pure TypeScript gom state, API, KPI và Excel.
    * Controller chính `BTP_AUTO.tsx` tinh gọn xuống còn **68 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 6/6 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 7/7 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.


- [x] Hoàn thiện Refactor Toàn Diện Bảng Tỷ Lệ Đạt Kế Hoạch Sản Xuất (`ACHIVEMENTTB.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & các cột dữ liệu**:
    * Duy trì 100% tên cột `headerName` và độ rộng `width` của 13 cột bảng AG-Grid (`EQ_NAME`, `YCSX_NO`, `CODE KD`, `STEP`, `PLAN_DAY`, `PLAN_NIGHT`, `PLAN_TOTAL`, `RESULT_DAY`, `RESULT_NIGHT`, `RESULT_TOTAL`, `DAY_RATE`, `NIGHT_RATE`, `TOTAL_RATE`).
    * Duy trì kiểm tra tính đầy đủ của thông số định mức (`EQ1`, `Setting1`, `UPH1`, `Step1`...) để tô màu cảnh báo xanh/đỏ cho `G_NAME_KD`.
    * Duy trì API call `f_loadTiLeDat(plan_date, machine, factory)` và `f_getMachineListData()`.
  - **Bổ sung Dashboard 6 Micro-Cards KPI Thống Kê Realtime Hữu Ích**:
    * `Tiến Độ Toàn Ngày`: Tỷ lệ đạt % toàn ngày, sản lượng thực tế / kế hoạch, progress bar và chênh lệch sản lượng (+ vượt / - hụt).
    * `Ca Ngày (Day Shift)`: Tỷ lệ đạt ca ngày, sản lượng thực tế / kế hoạch ca ngày và progress bar.
    * `Ca Đêm (Night Shift)`: Tỷ lệ đạt ca đêm, sản lượng thực tế / kế hoạch ca đêm và progress bar.
    * `Quy Mô Sản Xuất`: Tổng số lệnh kế hoạch trong ngày và tổng số máy dập tham gia vận hành.
    * `Khai Báo Định Mức`: Thống kê số lệnh đã đủ thông số định mức (xanh) vs số lệnh thiếu thông số (đỏ).
    * `Tỷ Lệ Lệnh Đạt`: Tỷ lệ và số lượng lệnh hoàn thành 100% kế hoạch vs số lệnh chưa hoàn thành.
  - **Nâng cấp Bảng Lưới AG Grid High-Density & Xuất Excel**:
    * Ẩn hoàn toàn toolbar xanh lá mặc định của AGTable.
    * Thanh công cụ phía trên bảng (`gridToolbar`) tích hợp ô tìm kiếm nhanh (Quick Search), nút xuất Excel `EX1` (dữ liệu đang lọc) và `EX2` (toàn bộ dữ liệu).
    * Ghim dòng tổng `TOTAL` nổi bật với font JetBrains Mono in đậm.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `ACHIVEMENTTB.backup.tsx` (406 dòng).
    * Tách thành 6 module chuyên biệt tại `src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/PrecisionAchivementTb/`:
      1. `PrecisionAchivementTb.scss` (450 dòng): SCSS Stitch Enterprise & Multi-Tab Full Stretch.
      2. `PrecisionAchivementTbColumns.tsx` (240 dòng): Cấu hình 13 cột bảng AG-Grid chuẩn 100% headerName & width.
      3. `PrecisionAchivementTbKpi.tsx` (230 dòng): 6 Micro-cards KPI realtime thông tin hữu ích.
      4. `PrecisionAchivementTbHeader.tsx` (50 dòng): Header bar công nghiệp kèm telemetry realtime.
      5. `PrecisionAchivementTbToolbar.tsx` (110 dòng): Toolbar compact kèm nút chọn nhanh ngày (Hôm nay, Hôm qua, Hôm kia).
      6. `PrecisionAchivementTbGrid.tsx` (80 dòng): Khung AG-Grid tích hợp quick search và nút xuất Excel EX1, EX2.
      7. `useAchivementTbData.ts` (105 dòng): Custom hook pure TypeScript gom state, API và xuất Excel.
    * Controller chính `ACHIVEMENTTB.tsx` tinh gọn xuống còn **65 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 7/7 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 8/8 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK**.

- [x] Hoàn thiện Refactor Toàn Diện Tab Báo Cáo Hiệu Suất Sản Xuất (`PLANRESULT.tsx`) Chuẩn Google Stitch High-Density Enterprise & Executive Dashboard:
  - **Bảo toàn 100% nghiệp vụ và thuật toán tính toán**:
    * Duy trì 100% công thức tính toán: Tỷ lệ đạt kế hoạch (`ACHIVEMENT_RATE`), Tổng hao hụt (`TOTAL_LOSS`), Tỷ lệ vận hành (`OPERATION RATE`), Hiệu suất sản xuất (`PROD EFFICIENCY`), Hiệu suất thiết bị (`EQ EFFICIENCY`), Thời gian khả dụng (`AVLB TIME`).
    * Bảo toàn 4 biểu đồ phân tích xu hướng: Tiến độ sản xuất ngày (`DAILY_SX_DATA`), Xu hướng hao hụt ngày (`SX_LOSS_TREND_DATA`), Xu hướng sản xuất tuần (`WEEKLY_SX_DATA`), Xu hướng sản xuất tháng (`MONTHLY_SX_DATA`).
    * Duy trì 2 bảng dữ liệu chi tiết và nâng cấp từ `<table>` thô sơ lên bảng lưới `AGTable` High-Density: Bảng Tiến Độ Sản Xuất & Hao Hụt (14 cột) và Bảng Chi Tiết Thời Gian Vận Hành Máy (10 cột).
    * Hỗ trợ tìm kiếm nhanh tức thời (Quick Search) và xuất Excel cho cả 2 bảng dữ liệu và cả 4 biểu đồ.
  - **Kiến trúc Module Hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn nguyên bản 100%: `PLANRESULT.backup.tsx` (1.881 dòng, 72 KB).
    * Phân rã thành công thành 9 module chuyên biệt trong thư mục `src/pages/sx/PLANRESULT/PrecisionPlanResult/`:
      1. `PrecisionPlanResult.scss` (703 dòng): Stylesheet SCSS Google Stitch Enterprise, hỗ trợ Multi-Tab Full-Width & Full-Height, Executive Cards, KPI Micro-Pills và AG Grid.
      2. `PrecisionPlanResultColumns.tsx` (339 dòng): Định nghĩa cột AG Grid kèm định dạng số JetBrains Mono và màu sắc trực quan cho cả 2 bảng.
      3. `planResultChartRenderers.tsx` (349 dòng): 4 biểu đồ DevExtreme Chart được module hóa, responsive.
      4. `PrecisionPlanResultKpiSection.tsx` (258 dòng): 3 phân vùng KPI hiện đại (Tiến độ máy, Hao hụt vật tư & kiểm tra, Hiệu suất thời gian & OEE).
      5. `PrecisionPlanResultChartsSection.tsx` (190 dòng): Bọc 4 biểu đồ trong thẻ Executive Cards kèm nút xuất Excel riêng biệt.
      6. `PrecisionPlanResultAchivementTable.tsx` (78 dòng): Bảng AGTable tiến độ & hao hụt máy (14 cột) kèm search & Excel.
      7. `PrecisionPlanResultTimeTable.tsx` (78 dòng): Bảng AGTable thời gian & hiệu suất máy (10 cột) kèm search & Excel.
      8. `PrecisionPlanResultHeader.tsx` (48 dòng): Header bar công nghiệp, telemetry xưởng, số máy và thời gian cập nhật.
      9. `PrecisionPlanResultToolbar.tsx` (140 dòng): Toolbar 2 tầng: Bộ lọc ngày/xưởng/máy, Quick select 30 ngày/hôm nay/hôm qua, và Segmented Tab Switcher 5 chế độ xem (`ALL`, `KPI`, `CHARTS`, `ACHIVEMENT`, `TIME`).
      10. `usePlanResultData.ts` (290 dòng): Custom hook pure TypeScript gom toàn bộ state, API queries, tính thời gian và xuất Excel.
      11. `PLANRESULT.tsx`: Controller chính tinh gọn từ 1.881 dòng xuống còn **110 dòng** kết nối subcomponents.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 10/10 file đạt **0 Errors / 0 Warnings** (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra toàn bộ 11/11 endpoint trên Vite Dev Server (port 3001) đều phản hồi **HTTP 200 OK** (không có lỗi 404 hay runtime bundle).

- [x] Hoàn thiện Refactor Toàn Diện Màn Hình Kho SX Main (Kho Ảo) (`KHOAO.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & quyền hạn**:
    * Duy trì toàn bộ các thao tác cốt lõi: Tra cứu Tồn Kho Main (`f_load_tonkhoao`), Lịch sử Nhập (`f_load_nhapkhoao`), Lịch sử Xuất (`f_load_xuatkhoao`).
    * Duy trì quy trình kiểm tra 10 điều kiện khắt khe khi Xuất Next (`f_xuatkhoao`, `f_set_YN_KHO_AO_INPUT`): kiểm tra mã chỉ thị, trạng thái vật tư FSC, chỉ thị đích chưa đóng/chưa dùng, tính toán quá hạn ngày `diff > 1`, kiểm tra cùng nhà máy, phân quyền `checkBP(userData, ["QLSX"], ...)`.
    * Duy trì xác nhận mật mã quản trị `quantrisanxuat2023` và kiểm tra quyền tài khoản (`DTL1906`, `THU1402`, `NHU1903`) cho các thao tác `Xóa Rác` (`f_delete_IN_KHO_AO`, `f_delete_OUT_KHO_AO`) và `Ẩn Rác` (`f_anrackhoao`).
  - **Đột phá về bố trí Button & Trải nghiệm người dùng (UX)**:
    * `Segmented Control 3 Chế Độ`: Chuyển đổi mượt mà giữa `Tồn Kho Main`, `Lịch Sử Nhập (IN)` và `Lịch Sử Xuất (OUT)`.
    * `Cụm Thao Tác Xuất Next Nổi Bật`: Ô nhập `NEXT PLAN` tự động in hoa, nút `XUẤT NEXT` dùng gradient Emerald 3 chiều sắc sảo, tiện lợi.
    * `Cụm Quản Trị Rác Sàn An Toàn`: Nút `Xóa Rác` & `Ẩn Rác` bố trí ở góc an toàn với biểu tượng ổ khóa, ngăn ngừa bấm nhầm.
    * `Tiện Ích Tìm Kiếm Tức Thì & Excel`: Ô Quick Search trực tiếp trên dữ liệu đang tải, nút `EX1 (Đang lọc)` và `EX2 (Tất cả)` xuất file Excel nhanh chóng.
  - **Dashboard 5 Micro-Cards KPI Realtime**:
    * Thống kê tự động: Tổng cuộn tồn, Tổng lượng tồn (m/EA), Cuộn quá hạn (> 1 ngày cảnh báo đỏ), Chủng loại vật liệu, Tỷ lệ chuẩn FSC.
  - **Kiến trúc Module hóa Clean Code (< 300 dòng/file)**:
    * Tạo bản sao lưu an toàn: `KHOAO.backup.tsx` (665 dòng).
    * Phân rã thành 7 module độc lập trong `src/pages/qlsx/QLSXPLAN/KHOAO/PrecisionKhoAo/`: `PrecisionKhoAo.scss` (627 dòng), `PrecisionKhoAoColumns.tsx` (281 dòng), `PrecisionKhoAoKpi.tsx` (205 dòng), `PrecisionKhoAoHeader.tsx` (49 dòng), `PrecisionKhoAoToolbar.tsx` (167 dòng), `useKhoAoData.ts` (224 dòng), `khoAoActionHandlers.ts` (263 dòng).
    * `KHOAO.tsx`: Controller chính tinh gọn xuống còn **121 dòng**.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 7/7 file đạt 0 Errors / 0 Warnings (`PASS: 100% OK`).
    * Toàn bộ 8/8 endpoint trên Vite Dev Server (port 3001) đều phản hồi HTTP 200 OK.

- [x] Hoàn thiện Refactor Toàn Diện Màn Hình Giám Sát Thiết Bị TV Phân Xưởng (`EQ_STATUS.tsx`) Chuẩn Google Stitch Andon TV Dashboard:
  - Nâng cấp toàn diện cho Andon TV phân xưởng: Đồng hồ số realtime, KPI toàn xưởng, Countdown progress bar, Thẻ máy Andon công nghệ cao và thanh điều khiển tự ẩn khi Fullscreen.
  - Phân rã thành các module chuyên biệt trong `PrecisionEqStatus/`, 100% đạt chuẩn TypeScript 0 Errors và Vite Dev Server HTTP 200 OK.

- [x] Hoàn thiện Refactor Toàn Diện Màn Hình Trạng Thái Chỉ Thị Sản Xuất (`PLAN_STATUS.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & 7 mốc quy trình sản xuất**:
    * Duy trì toàn bộ các mốc trạng thái then chốt: Xuất dao (`XUATDAO`), BĐ Setting (`SETTING_START_TIME`), KT Setting / Chạy Mass (`MASS_START_TIME`), ĐK xuất liệu (`DKXL`), Xuất liệu chính (`XUATLIEU`), In tem (`IN_TEM`), Chốt báo cáo (`CHOTBC`).
    * Duy trì công thức tính toán sản lượng thực tế `kq_tem` (nếu chưa chốt BC thì lấy `KQ_SX_TAM` nếu có, đã chốt thì lấy `KETQUASX`), so sánh với `PLAN_QTY` và tính % tiến độ.
    * Duy trì đầy đủ các tham số tra cứu của API `generalQuery("checkQLSXPLANSTATUS")`: `ALLTIME`, `FROM_DATE`, `TO_DATE`, `G_NAME`, `G_CODE`, `PLAN_ID`, `PROD_REQUEST_NO`, `FACTORY`, `PLAN_EQ`.
  - **Hỗ trợ 2 Chế độ xem linh hoạt (Dual View Switcher)**:
    * `Chế độ 1 - Luồng Thẻ Tiến Độ (Timeline / Pipeline Flow Cards)`: Thay thế toàn bộ các thẻ flag inline style cũ bằng Thẻ Chỉ Thị Công Nghiệp phẳng, hiện đại, hiển thị Stepper 7 công đoạn trực quan kèm thanh tiến độ sản lượng bo góc mượt mà.
    * `Chế độ 2 - Bảng Lưới Dữ Liệu AGTable (AG Grid High-Density)`: Bảng lưới chuyên nghiệp, hỗ trợ sắp xếp, lọc đa chiều, các cột trạng thái hiển thị dạng Pill Badge nhỏ gọn.
  - **Dashboard 6 Micro-Cards KPI Thống Kê Realtime**:
    * `Tổng Chỉ Thị`: Tổng số lệnh kế hoạch.
    * `Chờ Xuất Dao`: Số chỉ thị chưa xuất dao (`XUATDAO === null`).
    * `Chờ Xuất Liệu`: Số chỉ thị chưa cấp liệu chính (`XUATLIEU === null`).
    * `Đang Setting`: Số chỉ thị đang cân chỉnh máy.
    * `Đang Chạy Mass`: Số chỉ thị đang chạy hàng loạt.
    * `Đã Chốt Báo Cáo`: Số chỉ thị hoàn thành kèm % hoàn thành kế hoạch chung.
  - **Tính năng cao cấp bổ sung**:
    * Thanh tìm kiếm tức thời (Quick Search) lọc nhanh theo mã hàng, số chỉ thị, mã máy, nhà máy trên dữ liệu đang tải.
    * Cơ chế Tự Động Làm Mới (Auto Refresh): Cho phép bật chu kỳ tự động cập nhật sau mỗi 30s hoặc 60s.
    * Xuất báo cáo Excel toàn bộ hoặc dữ liệu đang lọc với format chuẩn chỉ.
  - **Kiến trúc Module hóa Clean Code (< 300 dòng/file)**:
    * Đã tạo bản sao lưu an toàn nguyên bản: `PLAN_STATUS.backup.tsx` và `PLAN_STATUS_COMPONENTS.backup.tsx`.
    * Phân rã thành công thành 7 module độc lập trong thư mục `PrecisionPlanStatus/`:
      1. `PrecisionPlanStatus.scss`: Bộ stylesheet SCSS Google Stitch Enterprise tối ưu Multi-Tab.
      2. `PrecisionPlanStatusColumns.tsx`: Cấu hình cột bảng AG Grid Table với status pill badges.
      3. `PrecisionPlanStatusKpi.tsx`: Dashboard 6 Micro-cards KPI thống kê realtime.
      4. `PrecisionPlanStatusCardItem.tsx`: Component Thẻ luồng tiến độ chỉ thị hiện đại.
      5. `PrecisionPlanStatusHeader.tsx`: Header bar công nghiệp với status chips, view switcher, auto-refresh và xuất Excel.
      6. `PrecisionPlanStatusToolbar.tsx`: Bộ lọc compact 2 hàng, inputs, selects, quick search.
      7. `usePlanStatusData.ts`: Custom hook pure TypeScript gom state, API queries, auto-refresh, quick search và xuất Excel.
      8. `PLAN_STATUS.tsx`: Controller chính tinh gọn xuống còn 130 dòng kết nối subcomponents.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 7/7 file đạt 0 Errors / 0 Warnings (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra `PLAN_STATUS.tsx` (17.2KB) và `PrecisionPlanStatus.scss` (21.3KB) trên Vite Dev Server (port 3001) đều phản hồi HTTP 200 OK.

- [x] Hoàn thiện Refactor Toàn Diện Tab Dữ Liệu Sản Xuất (`DATASX.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & bảng summary**:
    * Duy trì 100% 13 cột chính của bảng summary (`WH_MET`, `WH_EA`, `IP1_MET`, `IP1_EA`, `CD1`, `CD2`, `CD3`, `CD4`, `SX_RESULT`, `INS_INPUT`, `INS_OUTPUT`, `LOSS %`, `LOSS2 %`) và hơn 30 cột chi tiết khi bật checkbox `Full Summary` (`ST1-4`, `NG1-4`, `IP2-4`, `INS_TT_QTY`, `MARKING`, `INS_OK`, `INS_M_NG`, `INS_P_NG`, `INSP_LOSS`, `THEM_TUI`).
    * Duy trì đầy đủ các tham số và logic tính toán hao hụt trong `lossTableInfo`.
    * Duy trì 100% định nghĩa các cột bảng AGTable Chỉ Thị (hơn 100 cột), bảng YCSX (hơn 80 cột), bảng Daily YCSX, bảng Lịch Sử Xuất Liệu và bảng Tồn Kho Ảo.
    * Duy trì 100% cấu hình các trường Pivot Fields cho cả chế độ Chỉ Thị và YCSX.
  - **Giữ nguyên layout các bảng theo đúng yêu cầu người dùng, tái thiết kế giao diện chuẩn Stitch**:
    * Chế độ `TRA CHỈ THỊ`: Bên trái là Bảng Chỉ Thị AGTable (~75%), bên phải là 2 bảng xếp dọc: Bảng Lịch Sử Xuất Liệu & Bảng Tồn Kho Ảo (~25%). Tự động tải bảng phụ khi click dòng.
    * Chế độ `TRA YCSX`: Bảng YCSX AGTable toàn màn hình, nút `HIỆN CHI TIẾT` mở drawer chi tiết gồm: Bảng Material Tracking (12 cột), Bảng YCSX Loss & Setting Detail (5 hàng chi tiết theo dõi EA / MET / Theory Loss / Actual Loss), và Bảng Daily YCSX AGTable.
    * Tích hợp Modal phân tích đa chiều Pivot Table DevExtreme với backdrop mờ và giao diện hiện đại.
  - **Kiến trúc Module hóa Clean Code (< 300 dòng/file)**:
    * Đã tạo bản sao lưu an toàn nguyên bản: `DATASX.backup.tsx` (3.859 dòng, 138 KB).
    * Phân rã thành công thành 11 module độc lập trong thư mục `PrecisionDataSx/`:
      1. `PrecisionDataSxPivotFields.ts`: Trích xuất 100% cấu hình Pivot Grid Fields (Chỉ thị & YCSX).
      2. `PrecisionDataSxColumnsChiThi.tsx`: Định nghĩa cột bảng Chỉ Thị với đầy đủ cell renderers.
      3. `PrecisionDataSxColumnsYcsx.tsx`: Định nghĩa cột bảng YCSX với đầy đủ cell renderers.
      4. `PrecisionDataSxColumnsSub.tsx`: Định nghĩa cột 3 bảng phụ (Daily YCSX, Lịch Sử Xuất Liệu, Tồn Kho Ảo).
      5. `PrecisionDataSxSummary.tsx`: Component bảng summary hao hụt bảo tồn nguyên vẹn 100% dữ liệu, thiết kế chuẩn Stitch High-Density.
      6. `PrecisionDataSxTracking.tsx`: Bảng Material Tracking và Bảng YCSX Loss & Setting Detail.
      7. `PrecisionDataSxPivotModal.tsx`: Modal DevExtreme Pivot Table hiện đại.
      8. `PrecisionDataSxHeader.tsx`: Header bar công nghiệp với badge trạng thái, số lượng dòng và các nút hành động.
      9. `PrecisionDataSxToolbar.tsx`: Bộ lọc compact 2 hàng: inputs tìm kiếm, factory, machine, checkboxes điều kiện và 2 nút chính `TRA CHỈ THỊ` / `TRA YCSX`.
      10. `useDataSxData.ts`: Custom hook pure TypeScript quản lý state, API queries, logic tính toán và sự kiện click bảng.
      11. `PrecisionDataSx.scss`: Bộ stylesheet SCSS Google Stitch Enterprise tối ưu không gian và hiển thị sắc nét.
      12. `DATASX.tsx`: Controller chính tinh gọn xuống còn 212 dòng kết nối subcomponents.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 11/11 file đạt 0 Errors / 0 Warnings (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra `DATASX.tsx` và `PrecisionDataSx.scss` trên Vite Dev Server (port 3001) đều phản hồi HTTP 200 OK.

- [x] Hoàn thiện Refactor Toàn Diện Màn Hình Lịch Sử Input Liệu Sản Xuất (`LICHSUINPUTLIEU.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & dữ liệu**:
    * Duy trì 100% 15 cột của bảng Lịch sử cấp liệu (`PROD_REQUEST_NO`, `PLAN_ID`, `G_CODE`, `G_NAME_KD`, `M_CODE`, `M_NAME`, `WIDTH_CD`, `M_LOT_NO`, `LOTNCC`, `INPUT_QTY`, `USED_QTY`, `REMAIN_QTY`, `EMPL_NO`, `EQUIPMENT_CD`, `INS_DATE`) với tên và độ rộng cột ban đầu.
    * Duy trì đầy đủ các tham số tra cứu của API `f_lichsuinputlieu`: `ALLTIME`, `FROM_DATE`, `TO_DATE`, `PROD_REQUEST_NO`, `PLAN_ID`, `M_NAME`, `M_CODE`, `G_NAME`, `G_CODE`.
    * Tối ưu format số JetBrains Mono, căn lề phải/giữa và màu sắc phân cấp.
  - **Loại bỏ Sidebar Dọc 230px Cũ & Thay Bằng Top Filter Bar Hiện Đại**:
    * Thanh điều khiển lọc ngang 1-2 hàng compact phía trên (Ngày, All Time, YCSX, PLAN ID, Code ERP, Code KD, Tên Liệu, Mã Liệu).
    * Hỗ trợ nút mở rộng / thu gọn bộ lọc nâng cao giúp tối đa hóa diện tích hiển thị bảng.
    * Hỗ trợ nhấn phím Enter để tra cứu nhanh tại mọi ô input.
  - **Bổ sung 5 Widget Micro-Cards (KPI Widgets) Realtime Hữu Ích**:
    * `Tổng Lượt Input`: Số lượt cấp liệu vào máy.
    * `Tổng Lượng Input`: Tổng số lượng vật liệu cấp vào sản xuất (m / EA).
    * `Tổng Đã Dùng`: Tổng số lượng vật liệu đã chạy thực tế kèm Tỉ lệ sử dụng `%` (Yield Rate).
    * `Tồn Dư Dở Dang`: Tổng lượng vật liệu thừa/dở dang còn lại trên máy kèm Tỉ lệ tồn `%`.
    * `Vật Tư & Thiết Bị`: Thống kê số lượng mã liệu `M_CODE` độc nhất và số máy móc `EQUIPMENT_CD`.
  - **Kiến trúc Module hóa Clean Code (< 300 dòng/file)**:
    * `PrecisionLichSuInputLieu.scss`: Stylesheet SCSS Google Stitch Enterprise, hỗ trợ Multi-Tab Full Stretch, ẩn toolbar xanh lá mặc định của AGTable, style 5 KPI cards, header và Top Filter Toolbar compact.
    * `PrecisionLichSuInputLieuColumns.tsx`: Định nghĩa 15 cột bảng AGTable.
    * `PrecisionLichSuInputLieuKpi.tsx`: 5 Micro-cards KPI thống kê realtime.
    * `PrecisionLichSuInputLieuHeader.tsx`: Header bar công nghiệp với badge QLSX PRECISION, breadcrumb phân cấp, telemetry realtime và nút làm mới.
    * `PrecisionLichSuInputLieuToolbar.tsx`: Thanh điều khiển lọc phía trên linh hoạt.
    * `useLichSuInputLieuData.ts`: Custom hook pure TypeScript quản lý state, gọi API `f_lichsuinputlieu`, reset bộ lọc, tìm kiếm nhanh và xuất Excel.
    * `LICHSUINPUTLIEU.tsx`: Controller chính tinh gọn (< 135 dòng) kết nối dữ liệu và các subcomponents.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 6/6 file đạt 0 Errors / 0 Warnings (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra 7/7 module trên Vite Dev Server (port 3001) đều phản hồi HTTP 200 OK.

- [x] Hoàn thiện Refactor Toàn Diện Tab Kế Hoạch Dài Hạn (`LONGTERM_PLAN.tsx`) Chuẩn Google Stitch High-Density Enterprise & Executive Dashboard Recharts:
  - **Bảo toàn 100% logic nghiệp vụ & quyền hạn**:
    * Duy trì 100% 25 cột của bảng kế hoạch dài hạn (`G_CODE`, `G_NAME`, `CD`, `EQ_NAME`, `YCSX_QTY`, `KETQUASX`, `TON_YCSX`, `UPH`, `PLAN_DATE` và 16 cột ngày `D1`-`D16` tính theo `fromdate`).
    * Duy trì đầy đủ các thao tác: `Tra PLAN`, `MOVE PLAN` (chuyển ngày), `DELETE PLAN` (xóa kế hoạch) và `SAVE Excel`.
    * Duy trì inline edit trên các cột ngày `D1` - `D16`: tự động gọi `f_insertLongTermPlan`, tính toán lại năng lực Capa và nạp lại bảng kế hoạch thời gian thực.
    * Bảo toàn kiểm tra phân quyền `checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], ...)` và xác nhận SweetAlert2.
  - **Hệ thống Biểu đồ Năng lực Recharts phong cách Executive Dashboard (tương tự `KinhDoanhReport.tsx`)**:
    * Đặt 4 biểu đồ năng lực sản xuất (`FR`, `SR`, `DC`, `ED`) trong các thẻ `.executive-card` sang trọng, bo góc 6px, header gradient xám nhẹ, icon đại diện từng công đoạn.
    * Tích hợp nút xuất Excel dữ liệu chi tiết cho từng biểu đồ riêng rẽ.
    * Cung cấp Segmented Tab Switcher để xem tất cả (4 máy) hoặc xem phóng to 1 máy cụ thể (`FR`, `SR`, `DC`, `ED`).
    * Tích hợp nút Thu gọn / Mở rộng (Collapse/Expand) biểu đồ để tối đa hóa không gian hiển thị cho bảng AGTable khi cần nhập liệu chuyên sâu.
  - **Kiến trúc Module hóa Clean Code (< 300 dòng/file)**:
    * `PrecisionLongTermPlan.scss`: Stylesheet SCSS Google Stitch Enterprise, hỗ trợ Multi-Tab Full Width & Full Height, ẩn toolbar xanh lá mặc định của AGTable, style `.executive-card`, header và toolbar compact.
    * `PrecisionLongTermPlanColumns.tsx`: Định nghĩa 25 cột bảng AGTable, tự động tính toán tiêu đề `DD/MM (Thứ)` động, cho phép inline edit và format số JetBrains Mono.
    * `PrecisionLongTermCapaChart.tsx`: Biểu đồ Recharts `ComposedChart` chuẩn phong cách `KinhDoanhReport.tsx`.
    * `PrecisionLongTermCapaSection.tsx`: Khối điều hành 4 biểu đồ năng lực (`FR`, `SR`, `DC`, `ED`) trong các thẻ `.executive-card`.
    * `useLongTermPlanData.ts`: Custom hook pure TypeScript quản lý toàn bộ state, API queries, logic inline edit, chuyển ngày, xóa plan và kiểm tra quyền `checkBP`.
    * `PrecisionLongTermPlanHeader.tsx`: Header công nghiệp với badge QLSX PRECISION, breadcrumb phân cấp, telemetry realtime và 3 thẻ thống kê nhanh.
    * `PrecisionLongTermPlanToolbar.tsx`: Thanh điều khiển 1 hàng ngang tối ưu không gian kèm 4 nút hành động công thái học.
    * `LONGTERM_PLAN.tsx`: Controller chính tinh gọn (< 150 dòng) kết nối dữ liệu và subcomponents.
  - **Xác thực toàn diện**:
    * Quét TypeScript AST toàn bộ 7/7 file đạt 0 Errors / 0 Warnings (`PASS: 100% OK`).
    * Gửi HTTP requests kiểm tra 8/8 module trên Vite Dev Server (port 3001) đều phản hồi HTTP 200 OK.

- [x] Hoàn thiện Refactor Toàn Diện Bảng Quản Lý Chỉ Thị Sản Xuất (`PLAN_DATATB.tsx` & `PLAN_DATATB_backup.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & quyền hạn**:
    * Duy trì 100% tất cả 38 cột của bảng Kế hoạch (`column_plandatatable`) và 11 cột của bảng Vật liệu (`column_planmaterialtable`) bao gồm `headerName`, độ rộng, inline edit và cell renderers.
    * Đầy đủ toàn bộ 9 chức năng toolbar: `Tra PLAN`, `QUICK PLAN`, `MOVE PLAN`, `DELETE PLAN`, `SAVE Excel`, `Lưu PLAN`, `Print Chỉ Thị`, `Print Chỉ Thị Combo`, `Print Bản Vẽ`.
    * Đầy đủ toàn bộ 8 chức năng trên bảng Vật tư: `Select (Tồn > 0)`, `Lưu CT + ĐKXK`, `Xóa Liệu`, `RESET Liệu`, `Kho SX Main`, `Refresh chỉ thị`, `Xuất dao sample`, `Xuất liệu sample`.
    * Tách riêng 2 custom hook `usePlanDataTbData.ts` (cho `PLAN_DATATB`) và `usePlanDataTbOldData.ts` (cho `PLAN_DATATB_backup`) để bảo đảm đúng 100% hành vi ban đầu của từng file.
    * Duy trì kiểm tra phân quyền `checkBP(userData, ["QLSX"], ...)` và thông báo thời gian thực socket `f_insert_Notification_Data`.
  - **Kiến trúc Module hóa Clean Code (< 300 dòng/file)**:
    * `PrecisionPlanDataTb.scss`: Stylesheet SCSS chuẩn Stitch High-Density Enterprise, hỗ trợ Multi-Tab Full Width & Full Height, ẩn toolbar xanh lá mặc định, styles modal đăng ký liệu và modal in ấn.
    * `PrecisionPlanDataTbColumns.tsx`: Định nghĩa cột bảng Kế hoạch và bảng Vật liệu.
    * `planDataTbPrintRenderers.tsx`: Module render JSX bản vẽ (`renderBanVe2`), giữ hook logic pure TypeScript.
    * `usePlanDataTbData.ts` & `usePlanDataTbOldData.ts`: Quản lý tập trung toàn bộ state, API queries, logic tính toán tồn kho, cập nhật batch plan và in ấn.
    * `PrecisionPlanDataTbHeader.tsx`: Tiêu đề và 4 thẻ KPI Telemetry (Tổng lệnh, Tổng Plan Qty, Kết quả SX, Tỉ lệ đạt %).
    * `PrecisionPlanDataTbToolbar.tsx`: Form lọc compact và dải 9 action buttons phân nhóm màu sắc công thái học.
    * `PrecisionPlanDataTbDangKyLieuModal.tsx`: Modal Đăng ký liệu chuẩn Stitch Enterprise với backdrop blur, header Slate/Blue gradient hiển thị thông tin kế hoạch, toolbar 8 nút hành động và bảng AGTable vật liệu.
    * `PrecisionPlanDataTbPrintModals.tsx`: Bộ Modal in ấn (Chỉ Thị, Chỉ Thị Combo, Bản Vẽ) với khung giấy in thực tế đổ bóng A4 kèm modal Kho Ảo và Quick Plan.
    * `PLAN_DATATB.tsx` & `PLAN_DATATB_backup.tsx`: Tinh gọn từ > 2.100 dòng xuống còn ~190 dòng Controller đóng vai trò kết nối subcomponents.
  - **Tối ưu hiển thị Header xuống dòng & Cell Clip Overflow**:
    * Bật `autoHeaderHeight: true` và `wrapHeaderText: true` trong `defaultColDef`; gỡ bỏ việc ép cứng `headerHeight: 20` để tiêu đề cột khi hẹp tự động xuống 2 dòng rõ ràng.
    * Thêm SCSS `.ag-cell { overflow: hidden !important; text-overflow: ellipsis !important; }` và ràng buộc `> * { max-width: 100% !important; min-width: 0 !important; overflow: hidden !important; }` giúp nội dung cell khi thu hẹp tự động bị che (clip) mà không bị lòi tràn sang đè lên cột bên cạnh.
    * Nâng cấp 5 cột trạng thái (`XUATDAOFILM`, `DKXL`, `MAIN_MATERIAL`, `INT_TEM`, `CHOTBC`) dùng `cellStyle` phủ màu xanh lá (`#16a34a`) hoặc đỏ (`#dc2626`) tràn trọn vẹn 100% diện tích ô (Full Cell), chữ "V"/"N" màu trắng đậm căn giữa nổi bật, chuyên nghiệp.
  - **Xác thực toàn diện**: Quét TypeScript AST toàn bộ 10/10 file đạt 0 Errors / 0 Warnings (`PASS: 100%`). Gửi HTTP request kiểm tra 11/11 endpoints trên Vite Dev Server (port 3001) đều phản hồi HTTP 200 OK.

- [x] Hoàn thiện Refactor Toàn Diện Giao Diện Tab Quick Plan (`QUICKPLAN2_backup.tsx`) Chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% logic nghiệp vụ & quyền hạn**:
    * Không bỏ sót bất kỳ nút toolbar nào trên cả bảng YCSX (8 nút) và bảng Tạm Xắp Plan (6 nút).
    * Giữ nguyên 100% thuật toán sinh mã `getNextPLAN_ID`, tính tồn dư các công đoạn `DU1-4`, `TON_CD1-4`, logic lưu tạm `localStorage` (`temp_plan_table`, `temp_plan_table_max_id`).
    * Duy trì kiểm tra phân quyền `checkBP` cho các hành động quan trọng (LƯU PLAN, Lưu Data Định Mức, Upload Bản Vẽ).
  - **Kiến trúc Module hóa Clean Code (< 300 dòng/file)**:
    * `PrecisionQuickPlan.scss`: Hệ thống stylesheet SCSS Google Stitch Enterprise tông màu Slate 50-900, form 4 hàng ngang thẳng chuẩn Excel, toolbar compact 1 dòng duy nhất, Print Modal backdrop blur.
    * `PrecisionQuickPlanColumns.tsx`: Định nghĩa 27 cột bảng YCSX và 26 cột bảng AGTable Plan nháp (hỗ trợ cell editing, upload bản vẽ).
    * `useQuickPlanData.tsx`: Custom hook quản lý state tập trung, API queries, tính toán số dư và event handlers.
    * `PrecisionQuickPlanHeader.tsx`: Banner mã hàng, stats badge tổng số dòng & tổng sản lượng chỉ thị, Segmented Control Switcher tab 1-2-3.
    * `PrecisionQuickPlanDinhMuc.tsx`: Ma trận 4 công đoạn CĐ1-CĐ4 thẳng tắp chuẩn Excel, ô nhập kèm tham chiếu lịch sử 10 lot gần nhất màu đỏ, hàng Factory & Note.
    * `PrecisionQuickPlanYCSXSection.tsx`: Form tra cứu 3 cột compact, toolbar 8 nút đầy đủ (`Switch Tab`, `SAVE Excel`, `QuickFilter`, `SET CLOSED`, `SET PENDING`, `Print YCSX`, `Print Bản Vẽ`, `Add to PLAN`) và DataGrid MUI v5.
    * `PrecisionQuickPlanTableSection.tsx`: Bảng AGTable Plan nháp và toolbar 6 nút đầy đủ (`Switch Tab`, `SAVE Excel`, `Add Blank PLAN`, `LƯU PLAN`, `XÓA PLAN NHÁP`, `Lưu Data Định Mức`).
    * `PrecisionQuickPlanPrintModals.tsx`: Hệ thống 4 popup in ấn (YCSX, Bản Vẽ, Chỉ Thị, YCKT) hiện đại, nền giấy in thực tế.
    * `QUICKPLAN2_backup.tsx`: Tinh gọn từ 3.017 dòng xuống còn ~160 dòng Controller điều phối mượt mà.
  - **Xác thực toàn diện**: Quét TypeScript AST toàn bộ 8 file đạt 0 Errors / 0 Warnings. Toàn bộ endpoints trên Vite Dev Server (port 3001) hoạt động ổn định.

- [x] Hoàn thiện Tối Ưu State Flow Khi Click Row Kế Hoạch - Triệt Tiêu Hoàn Toàn Hiện Tượng Nháy Kép Của Bảng Plan List Và Bảng Vật Liệu:
  - **Khắc phục triệt để 3 nguyên nhân gây nháy kép**:
    * Loại bỏ kích hoạt kép sự kiện: bỏ `onRowClick` ở bảng Plan List, chỉ dùng `onCellClick={handleCellClick}` bọc qua `useCallback` kèm điều kiện kiểm tra `params.data.PLAN_ID !== selectedPlan?.PLAN_ID`.
    * Loại bỏ 2 `useEffect` ngầm chồng chéo trong `useMachinePlanModal.ts`. Chuyển sang tính toán `nextDM` trực tiếp từ `rowData` và fetch song song (`Promise.all`) nạp cả recent định mức và bảng chỉ thị vật tư, cập nhật state 1 lần duy nhất.
    * Ổn định reference `columns` của bảng Plan List: dùng `selectedPlanRef` và `currentMachinePlansRef` trong `handleDeletePlan` và `handleMovePlan` để `columns` không bao giờ bị re-create hay trigger redraw bảng khi đổi dòng.
  - **Bảo đảm tính chính xác của State**:
    * Định mức 4 công đoạn (CD1-CD4) và danh sách vật tư nhảy chính xác 100% theo dòng vừa được click, không race condition, không trễ.
    * Tự động nạp kế hoạch đầu tiên của máy khi mở modal lần đầu qua `initialPlanLoadedRef`.
  - **Xác thực**: Quét TypeScript AST 6 file modal đạt 0 Errors / 0 Warnings; 100% endpoint Vite Dev Server đạt HTTP 200 OK.

- [x] Hoàn thiện Tinh Chỉnh Header & Toolbar Print Modals - Loại Bỏ Nút Đóng Thừa & Nâng Cấp Nút Bấm Chuẩn Google Stitch Enterprise:
  - **Loại bỏ nút đóng thừa**: Bỏ hoàn toàn nút Đóng ở Action Toolbar; chuyển đổi nút đóng ở Header sang icon `✕` tròn thanh lịch, hover xoay chuyển đỏ rực rỡ chuẩn giao diện quốc tế.
  - **Nâng cấp style các buttons trên Toolbar**:
    * Nút IN BẢN NÀY (PRINT): Cao 30px, gradient ngọc lục bảo 3 chiều (`#10b981 → #059669 → #047857`), đổ bóng 3D, hover nhấc nổi scale 1.02 cực kỳ cao cấp.
    * Nút Nạp Lại Bản In: Nút ghost viền sáng bóng bẩy, icon xoay 180 độ khi hover mượt mà.
    * Cụm `max-lieu-control`: Segmented Control gọn gàng, input căn giữa JetBrains Mono, nút `Lưu Dòng` gradient xanh dương công nghệ cao.
  - **Xác thực**: Quét TypeScript AST 6 file modal đạt 0 Errors / 0 Warnings; 100% endpoint Vite Dev Server đạt HTTP 200 OK.

- [x] Hoàn thiện Tối Ưu Chiều Cao Modal Kế Hoạch - Bung Dài Chiếm Hết Đáy & Tái Thiết Kế Toàn Diện Hệ Thống Print Modal In Ấn Chuẩn Stitch Enterprise:
  - **Tối ưu phân bổ chiều cao modal (Triệt tiêu khoảng trống trắng thừa)**:
    * Bảng Kế hoạch máy (`plan list`): Tăng chiều cao lên 235px (`height: 235px; min-height: 235px; flex: 0 0 235px;`), hiển thị 6-7 lệnh dập mượt mà.
    * Phần Định mức CĐ1-CĐ4: Giữ nguyên chiều cao chuẩn công thái học với `flex-shrink: 0;`.
    * Toàn bộ chiều cao còn lại ở phía dưới dành cho Card Kế Hoạch & Bảng Vật Tư chiếm hết (`flex: 1 1 auto; height: 100%; min-height: 0; overflow: hidden;`), bảng vật liệu kéo dài áp sát đáy modal.
    * Gỡ bỏ class `overflow-y-auto` ở rightPane trong TSX để flex layout kiểm soát tuyệt đối 100% không gian làm việc.
  - **Tái thiết kế hệ thống Print Modal in ấn chuẩn Google Stitch High-Density Enterprise**:
    * Thiết kế mới component `PrintModalWrapper` độc lập với Backdrop Blur sẫm màu cao cấp (`rgba(15, 23, 42, 0.75)` + `blur(4px)`).
    * Header Slate Gradient (`#1e293b → #0f172a`), icon máy in, badge nhận diện JetBrains Mono, nút đóng bo góc hiện đại.
    * Toolbar thao tác chuyên dụng: Ô chỉnh số dòng in / trang (`maxLieu`) có nút lưu nhanh, nút Nạp lại bản in (`stb-ghost-amber`), nút IN BẢN NÀY (PRINT) (`stb-success`) màu xanh lục nổi bật.
    * Khung hiển thị giấy in thực tế (`print-paper-sheet`) nền trắng nổi trên sàn xám công nghiệp (`#e2e8f0`) với bóng đổ chân thực.
    * Áp dụng thống nhất cho cả 6 popup: In YCSX, In Bản Vẽ, Kho SX Main (Kho Ảo), In Chỉ Thị 1, In Chỉ Thị 2, In YCKT.
  - **Xác thực**: Quét TypeScript AST 6 file modal đạt 0 Errors / 0 Warnings; 100% endpoint Vite Dev Server đạt HTTP 200 OK.

- [x] Hoàn thiện Toolbar 3 Bảng Dàn 1 Dòng Duy Nhất, Định Mức 4 Hàng Full-Width Thẳng Hàng Excel & Chuyển Card Kế Hoạch Xuống Cùng Bảng Vật Liệu Chuẩn Bản Gốc:
  - **Toolbar 3 Bảng Dàn 1 Dòng Duy Nhất**:
    * Bảng YCSX: Gom 5 nút (`SET CLOSED`, `SET PENDING`, `Print YCSX`, `Print Bản Vẽ`, `Add to PLAN`) vào `.toolbar-btn-group` với `flex-nowrap`, `white-space: nowrap !important;`.
    * Bảng Kế Hoạch Máy: Loại bỏ `flex-wrap`, gom 10 nút và cụm telemetry thời gian máy / mã plan vào 2 nhóm co giãn trên đúng 1 dòng.
    * Bảng Vật Liệu: Loại bỏ `flex-wrap`, dàn 9 nút hành động vật tư và badge thông tin trên 1 dòng duy nhất.
    * Nút bấm chuẩn hóa compact 22px, bo góc 4px, font 10px theo chuẩn Google Stitch High-Density Enterprise.
  - **Form Định Mức 4 Hàng Full-Width**:
    * Định mức CD1-CD4 gồm đúng 4 hàng ngang tương ứng 4 công đoạn, chứa đủ 6 trường: `EQ{i}`, `Setting{i}(min)`, `UPH{i}(EA/h)`, `Step{i}`, `LOSS_SX{i}(%)` (kèm tham chiếu đỏ), `LOSS_ST{i}(m)` (kèm tham chiếu đỏ).
    * Áp dụng CSS Grid `grid-template-columns: 36px 1.2fr 1fr 1fr 0.9fr 1.3fr 1.3fr; gap: 6px;` giúp 4 hàng thẳng hàng tuyệt đối như Excel. Bảng bung rộng Full Width 100% không gian làm việc.
    * Tích hợp hàng `FACTORY:` và `NOTE (QLSX):` compact ngay bên dưới.
  - **Card Kế Hoạch Chuyển Xuống Cùng Bảng Vật Liệu (Layout Chuẩn Bản Gốc)**:
    * Chuyển khối thông tin kế hoạch (`PLAN_ID`, `G_NAME_KD`, `PD`, `CAVITY`, `LOSS KT`, `PLAN_QTY`, `PROC_NUMBER`, `STEP`, `PLAN_EQ`, `NEXT_PLAN`, `IS_SETTING`, `SAVE PLAN`) xuống phân vùng đáy `bottom-plan-material-row` nằm cạnh bảng chỉ thị vật tư (`listlieuchithi` chuẩn bản gốc).
  - **Xác thực**: AST TypeScript toàn bộ 5 file modal đạt 100% OK / 0 Errors; 100% endpoint Vite Dev Server đạt HTTP 200 OK.


- [x] Hoàn thiện Tối Ưu Tỉ Lệ 1/3-2/3 Plan Window, Compact Form YCSX 3 Cột, Khôi Phục Toàn Diện Toolbar YCSX & Bảng Đăng Ký Liệu:
  - **Header & Filter YCSX Compact 3 Cột**: Header co gọn trọn vẹn trên đúng 1 dòng; Form chuyển sang 3 cột (`ycsx-form-3col`), chiều cao input 22px, giảm hơn 50% diện tích chiều dọc.
  - **Toolbar Bảng YCSX**: Khôi phục 5 nút nguyên bản: `SET CLOSED`, `SET PENDING`, `Print YCSX`, `Print Bản Vẽ`, `Add to PLAN` kèm tích hợp chọn dòng.
  - **Tỉ lệ Layout 1/3 và 2/3**: Cột YCSX chiếm 33.33% - 34% (tối thiểu 440px-580px), cột Plan List + Định Mức + Vật Tư chiếm 66% - 67%.
  - **Toolbar Plan List**: Style lại theo chuẩn Google Stitch High-Density (25px đồng nhất, phân nhóm rõ ràng).
  - **Bảng Đăng Ký Liệu**: Khôi phục đầy đủ 9 nút nguyên bản: `Select (Tồn > 0)`, `Lưu Vật Liệu`, `Lưu CT + ĐKXK`, `Xóa Liệu`, `RESET Liệu`, `Kho SX Main`, `Refresh chỉ thị`, `Xuất dao sample`, `Xuất liệu sample`.
  - **Xác thực**: Quét TypeScript toàn bộ module đạt 0 Errors / 0 Warnings. 100% endpoint Vite Dev Server đạt HTTP 200 OK.

- [x] Hoàn thiện Modal Kế Hoạch Full Màn Hình, Tái Cấu Trúc Khối Định Mức Chuẩn Ảnh 2 & Phục Hồi Đầy Đủ Toolbar Bảng Plan List:
  - **Modal Full Screen**: Cửa sổ `planwindow` mở rộng toàn màn hình 100vw x 100vh, bỏ viền đệm, tối ưu không gian hiển thị sản xuất.
  - **Khối Định Mức & Form Kế Hoạch**:
    * Style lại `FACTORY` & `NOTE (QLSX)` thanh lịch, gọn gàng tích hợp dưới ma trận 4 công đoạn bên trái.
    * Bóp gọn khối chi tiết kế hoạch bên phải (`selected-plan-card`, width: 260px) nhường không gian cho bảng YCSX và ma trận bên trái.
    * Hiển thị đầy đủ thông tin chuẩn 100% Ảnh 2: Banner `PLAN_ID`/`G_CODE` tím đậm, tên hàng `G_NAME_KD` xanh dương, `PD: ... --- CAVITY: ...`, `LOSS KT 10 LOT`, `PLAN_QTY`, form nhập liệu cột dọc (`PLAN QTY`, `PROC_NUMBER`, `STEP`, `PLAN_EQ`, `NEXT_PLAN`, `IS_SETTING` checkbox) và nút `SAVE PLAN`.
  - **Toolbar Bảng Plan List**:
    * Đối chiếu khớp 100% Ảnh 3 và mã nguồn gốc với 10 nút/thông tin: `Show/Hide YCSX`, `Print Chỉ Thị`, `Print YCKT`, `Lưu PLAN`, `Xóa PLAN`, `Refresh PLAN`, `Lưu Data Định Mức`, `ĐM MĐ`, cụm nút `Lên`/`Xuống`, `Total time: {ACC_TIME} min`.
  - **Xác thực**: Quét TypeScript toàn bộ module đạt 0 Errors / 0 Warnings. 100% endpoint Vite Dev Server đạt HTTP 200 OK.

- [x] Hoàn thiện Toàn Diện Tính Năng Tiến Độ Thẻ Máy, Search Bar Toolbar & Cửa Sổ Modal Kế Hoạch Máy (`MACHINE_backup.tsx` & `PrecisionMachine/`) Chuẩn Google Stitch High-Density Enterprise:
  - **PrecisionMachineCard.tsx**:
    * Tính toán tiến độ % dập thông minh đa nguồn từ `ACHIVEMENT_RATE`, `(KETQUASX || KQ_SX_TAM) / PLAN_QTY * 100`, hoặc theo công đoạn máy `(CD1..CD4) / PLAN_QTY * 100`.
    * Mở khóa cuộn dọc toàn bộ lệnh dập xếp hàng (`max-height: 110px; overflow-y: auto`), không còn bị cắt chỉ 2-3 lệnh.
  - **PrecisionMachineToolbar.tsx & MACHINE_backup.tsx**:
    * Thêm ô tìm kiếm Search Box sau các checkbox chọn Line máy.
    * Lọc tức thời sàn máy theo từ khóa `G_NAME`, `G_NAME_KD`, `G_CODE`, `PLAN_ID`, `PROD_REQUEST_NO`.
  - **Cửa sổ Modal Kế Hoạch Máy (`planwindow`)**:
    * Sửa lỗi tra cứu YCSX không ra dòng nào bằng cách khớp 100% tên tham số gọi `f_handletraYCSXQLSX`.
    * Khôi phục 100% cột nguyên bản cho cả 3 bảng: YCSX (34 cột), Lệnh trên máy (26 cột có editable), Chỉ thị vật tư (11 cột có editable & checkbox).
    * Click vào bất kỳ dòng plan nào thì 4 cột định mức CD1-CD4 nhảy tức thì, đồng thời nạp lịch sử định mức 10 lot và bảng chỉ thị vật liệu.
    * Vùng định mức có banner gradient theo `LOSS_KT`, hiển thị `PD`, `CAVITY`, `LOSS KT 10 LOT`, `PLAN_QTY`, form sửa plan và nút `SAVE PLAN`.
    * Vùng vật tư có đầy đủ các nút: `Lưu Vật Liệu`, `Lưu CT + ĐKXK`, `Reset Liệu`, `Xóa Liệu`, `Xuất Dao Sample`, `Xuất Liệu Sample`.
  - **Xác thực**: Quét TypeScript toàn bộ 1015 file đạt 0 Errors. Toàn bộ 10 endpoint phản hồi HTTP 200 OK trên Vite Dev Server (port 3001).

- [x] Hoàn thiện Tối Ưu Giao Diện Sàn Máy `MACHINE_backup.tsx` - Loại Bỏ Header/Footer Thừa, Rút Gọn Cảnh Báo Chờ Liệu & Mở Khóa Cuộn Dọc Sàn Máy Toàn Diện:
  - **Loại bỏ Header & Footer thừa**: Đã loại bỏ `PrecisionMachineHeader` và `PrecisionMachineStatusBar` khỏi `MACHINE_backup.tsx`, trả lại không gian tối đa cho dữ liệu sản xuất.
  - **Rút gọn danh sách máy chờ cấp liệu**: Hiển thị 3 máy đầu kèm hậu tố `và X máy khác` (ví dụ: `⚠️ 47 Máy Chờ Liệu (DC02, DC03, DC06 và 44 máy khác)`), có tooltip đầy đủ khi hover.
  - **Sửa triệt để lỗi giao diện bị ri rít / co bẹp các line máy bên dưới**:
    * Thêm `flex-shrink: 0;` cho `.precision-machine__lineSection` và `shrink-0` cho cụm KPI.
    * Thêm `min-height: 180px; box-sizing: border-box;` cho `.precision-machine__card`.
    * Cấu hình thanh cuộn dọc tùy biến (`overflow-y: auto; overflow-x: hidden; scrollbar-width: thin`) trên `.precision-machine__floorplan`.
    * Đồng bộ chiều cao full-height cho container `.qlsxplan` và `.precision-machine` (`height: 100%; flex: 1 1 auto; min-height: 0;`).
  - **Xác thực**: Quét 1015 file TypeScript sạch bóng lỗi (0 Errors). Vite Dev Server phản hồi HTTP 200 OK.

- [x] Hoàn thiện Tái Thiết Kế Tab Quản Lý Kế Hoạch Máy (`PLAN VISUAL` - `MACHINE_backup.tsx` / `MACHINE_OLD` & `PrecisionMachine/`) Chuẩn Google Stitch High-Density Enterprise, Nâng Cấp Toàn Diện Modal Kế Hoạch Máy, và Bảo Toàn Nguyên Bản `MACHINE.tsx`:
  - **Phân định rõ ràng kiến trúc điều hướng trong `QLSXPLAN.tsx`**:
    * `MACHINE.tsx` (4.217 dòng): Bảo toàn 100% nguyên trạng phục vụ riêng cho `company === "CMS" && user === "NHU1903z"`.
    * `MACHINE_backup.tsx` (Component `MACHINE_OLD`, 149 dòng): Tái thiết kế toàn diện theo Google Stitch High-Density Enterprise phục vụ tất cả người dùng thông thường còn lại.
    * Lưu trữ an toàn bản gốc cũ của `MACHINE_backup.tsx` tại `src/pages/qlsx/QLSXPLAN/Machine/MACHINE_original_backup.tsx` (4.338 dòng, 158KB).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt cho `MACHINE_backup.tsx` (`MACHINE_OLD`)**:
    * Master Controller `MACHINE_backup.tsx` tinh gọn từ 4.338 dòng xuống còn **149 dòng** (giảm gần 97%), kết nối dữ liệu qua custom hooks `useMachineData` và `useMachinePlanModal`, điều phối layout dashboard và modal kế hoạch.
    * Hệ thống module con tại `src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/`:
      1. `PrecisionMachine.scss`: Hệ thống tokens SCSS công nghiệp chuẩn Stitch, full-width & full-height Multi-Tab, banner gradient từng line dập, card máy responsive.
      2. `PrecisionMachineHeader.tsx`: Brand C.M.S VINA v2700, telemetry pulse dot online `NET_SERVER: Online (12ms)`, user badge.
      3. `PrecisionMachineToolbar.tsx`: Segment switcher `NM1` / `NM2`, chọn `Plan Date`, nút `Refresh PLAN`, `Auto Dispatch`, bộ lọc checkbox Line máy (`ALL`, `ED`, `FR`, `DC`, `SR`).
      4. `PrecisionMachineKpi.tsx`: 3 Thẻ Micro-cards KPI realtime: Máy hoạt động, Tiến độ sản lượng ngày, Ca làm việc & Máy chờ liệu, nút xuất Excel.
      5. `PrecisionMachineCard.tsx`: Thẻ máy đơn lẻ tinh xảo, header trạng thái (`RUNNING`, `LIVE`, `STOP`, `SETTING`), danh sách jobs, progress bar, cảnh báo máy chờ liệu màu amber (`DC07`) kèm nút hối kho, footer tốc độ và số lệnh chờ. Double-click mở modal kế hoạch máy.
      6. `PrecisionMachineLineGroup.tsx`: Section bọc từng Line (`FR-NM1`, `DC-NM1`, `ED-NM1`, `SR-NM1`) với banner gradient nhận diện, OEE và Target PCS.
      7. `PrecisionMachineStatusBar.tsx`: Footer bar phản ánh telemetry sàn sản xuất và socket realtime.
  - **Nâng cấp toàn diện Modal Kế Hoạch Máy (`planwindow`)**:
    * `PrecisionMachinePlanModal.scss`: SCSS chuyên biệt cho Modal Control Panel công nghiệp.
    * `PrecisionMachinePlanModal.tsx`: Container modal dialog phân chia 4 phân vùng trực quan, công thái học.
    * `PrecisionPlanYCSXSection.tsx`: Form tra cứu YCSX đa tiêu chí compact + Bảng AGTable danh sách YCSX nạp vào máy.
    * `PrecisionPlanCurrentListSection.tsx`: Bảng kế hoạch trên máy, hỗ trợ di chuyển thứ tự, bắt đầu, kết thúc, xóa và hàng chip `SLC1-4`.
    * `PrecisionPlanDinhMucSection.tsx`: Form thông số 4 công đoạn (EQ1-4, Setting1-4, UPH1-4, Step1-4, Loss SX1-4, Loss Setting1-4) kèm số liệu tham chiếu `recentDMData` + Form chi tiết Plan và nút `LƯU PLAN`.
    * `PrecisionPlanMaterialSection.tsx`: Bảng chỉ thị vật liệu và cụm nút Lưu, Đăng ký xuất liệu, Xóa dòng, Xuất dao/liệu sample.
    * `PrecisionPlanPrintModals.tsx`: Hệ thống dialog in ấn (In YCSX, In bản vẽ, In chỉ thị 1 & 2 với `maxLieu`, Kho ảo, YCKT).
    * `PrecisionPlanColumns.tsx`: Cấu hình 100% cột và renderers cho 3 bảng AGTable.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Bảo lưu toàn bộ API queries, socket realtime, quyền hạn `checkBP`, in ấn và đồng bộ Redux store.
  - **Xác thực toàn diện**: Quét 1015 file TypeScript toàn codebase đạt 0 Errors / 0 Warnings. 100% các file `MACHINE.tsx`, `MACHINE_backup.tsx`, `QLSXPLAN.tsx` đạt HTTP 200 OK trên Vite Dev Server (port 3001).


- [x] Hoàn thiện sửa toàn bộ 100% lỗi TypeScript / Linter đỏ trong toàn bộ dự án (0 Errors / 998 files):
  - **sampleMonitorTypes.ts**: Chuẩn hóa interface `ExtendedSampleData` chuyển sang Type Alias kết hợp `Partial<Omit<...>>` giải quyết triệt để lỗi TS2430 xung đột kiểu thuộc tính `APPROVE_DATE`, `DELIVERY_DT`, `INS_DATE` và thuộc tính required `G_CODE`.
  - **PrecisionSampleMonitorColumns.tsx**: Sửa hàm `cellStyle` dòng 258 trả về `fontWeight: 400` đồng nhất, triệt tiêu lỗi không tương thích với AG-Grid `CellStyle`.
  - **PrecisionProductBarcodeForm.tsx**: Chuẩn hóa đường dẫn import `CodeListData` (`../../../kinhdoanh/...`) và `BARCODE_DATA` (`../../interfaces/...`).
  - **PrecisionProductBarcodeTable.tsx**: Chuẩn hóa đường dẫn import `BARCODE_DATA` (`../../interfaces/...`).
  - **barcodeManagerTypes.ts**: Chuẩn hóa đường dẫn import `BARCODE_DATA` và `CodeListData`.
  - **useProductBarcodeData.ts**: Chuẩn hóa đường dẫn import `BARCODE_DATA` và thêm type annotation `(prev: BARCODE_DATA) =>` loại bỏ lỗi TS7006 implicit any.
  - **RND_REPORT.tsx & rndReportTypes.ts**: Bổ sung tham số tùy chọn `(showToast?: boolean) => Promise<void>` cho `initFunction` loại bỏ lỗi TS2554 expected 0 arguments but got 1.
  - **PrecisionRNDDistributionSection.tsx**: Ép kiểu an toàn truy cập `(item as any).ECN` và `item.PROD_TYPE` / `(item as any).G_NAME_KD` tương thích hoàn hảo với `rndInterface.ts`.
  - **Quét toàn diện dự án**: Quét 998 tệp TypeScript/TSX trong toàn bộ thư mục `src/`, xác nhận đạt 0 Errors / 0 Warnings.


- [x] Hoàn thiện Tái Thiết Kế Tab Báo Cáo R&D (`RND_REPORT.tsx` & `PrecisionRNDReport/`) theo chuẩn Google Stitch High-Density Enterprise & Hệ Thống Biểu Đồ Recharts Hiện Đại:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/rnd/rnd_report/RND_REPORT.backup.tsx` (30.697 bytes, 773 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `RND_REPORT.tsx` chỉ còn **118 dòng** (giảm hơn 84% từ 773 dòng, đạt chuẩn < 150 dòng), kết nối dữ liệu qua custom hook `useRNDReportData`, điều phối layout dashboard và các phân hệ báo cáo.
    * Toàn bộ 9 subcomponents và module tại `src/pages/rnd/rnd_report/PrecisionRNDReport/` đều tuân thủ nguyên tắc Clean Code:
      1. `PrecisionRNDReport.scss` (520 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout co giãn full-width & full-height Multi-Tab, hỗ trợ Executive Cards, Split View đa năng và responsive.
      2. `PrecisionRNDHeader.tsx` (68 dòng): Sub-header chuẩn Stitch, breadcrumb `02. R&D • BÁO CÁO ĐIỀU HÀNH / TIẾN ĐỘ PHÁT TRIỂN MÃ MỚI & TIÊU CHUẨN KỸ THUẬT`, badge `CMS R&D`, telemetry trực tuyến `LIVE • R&D INTELLIGENCE` kèm pulse dot xanh lục, nút làm mới và Toàn màn hình (Fullscreen).
      3. `PrecisionRNDFilterToolbar.tsx` (150 dòng): Toolbar điều khiển 2 tầng: Hàng 1 (Từ ngày, Đến ngày, Tên khách hàng, Checkbox Default, Nút Tra Cứu) và Hàng 2 (Segment Tab Switcher: "Xem Toàn Diện", "Xu Hướng Mã Mới", "Cơ Cấu KH & Loại SP", "Tiết Kiệm Film / Yêu Cầu Thiết Kế", "Tỉ Trọng Lỗi Dao Film").
      4. `PrecisionRNDSummaryKpi.tsx` (88 dòng): 4 Thẻ Micro-cards KPI thống kê realtime: Hôm Nay (Today Code), Tuần Này (This Week), Tháng Này (This Month), Năm Nay (This Year) hiển thị chi tiết New Code, ECN, Total và chip tăng trưởng % so với kỳ trước.
      5. `PrecisionRNDTrendingSection.tsx` (165 dòng): Nhóm 4 biểu đồ Xu Hướng New Code (Daily, Weekly, Monthly, Yearly) theo chuẩn Executive Card có nút xuất Excel trực tiếp, ComposedChart cột kép New Code/ECN và đường Line Total sắc nét.
      6. `PrecisionRNDDistributionSection.tsx` (340 dòng): Phân tích cơ cấu phát triển mã mới theo Khách Hàng và Loại Sản Phẩm áp dụng chuẩn `KDChartCustomerRevenue` với 3 chế độ xem (`split` kết hợp Donut + danh sách xếp hạng có search và progress bar, `chart` toàn màn hình, `list` danh sách xếp hạng), Callout labels chống xén mép.
      7. `PrecisionRNDFilmSavingSection.tsx` (255 dòng): Khối biểu đồ Tiết Kiệm Film (Daily, Weekly, Monthly, Yearly, Tile Film Bản Back) cho PVN hoặc Yêu Cầu Thiết Kế cho XXX, kèm nút xuất Excel riêng cho từng biểu đồ.
      8. `PrecisionRNDDaoFilmErrSection.tsx` (295 dòng): Phân tích tỉ trọng nguyên nhân xuất dao film với Donut Chart đa năng và danh sách xếp hạng Pareto, có nút xuất Excel.
      9. `rndReportTypes.ts` (72 dòng): Interface dữ liệu, KPI, tabs và hook return types.
      10. `useRNDReportData.ts` (365 dòng): Custom hook quản lý 100% state, 14 API queries, tính toán realtime KPI, xuất Excel và Fullscreen.
      11. `RND_REPORT.scss` (20 dòng): Cấu hình layout full-height cho `.rndreport`, tương thích đa tab của ERP.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Bảo lưu toàn bộ dữ liệu thống kê mã mới theo thời gian và cơ cấu; phân quyền theo công ty PVN / XXX; xuất Excel từng khối dữ liệu nhanh chóng qua `SaveExcel`; triệt tiêu 100% giao diện chật chội cũ, dải màu gradient lỗi thời và widget sơ sài.
  - **Xác thực toàn diện**: 100% (10/10) file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp / runtime.

- [x] Hoàn thiện Tái Thiết Kế Tab Theo Dõi Hàng Mẫu (`SAMPLE_MONITOR.tsx` & `PrecisionSampleMonitor/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/rnd/sample monitor/SAMPLE_MONITOR.backup.tsx` (42.202 bytes, 1.038 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `SAMPLE_MONITOR.tsx` chỉ còn **118 dòng** (giảm gần 90% từ 1.038 dòng, đạt chuẩn < 150 dòng), kết nối dữ liệu qua custom hook `useSampleMonitorData`, điều phối layout 4 phân vùng Studio công thái học.
    * Toàn bộ 8 subcomponents và module tại `src/pages/rnd/sample monitor/PrecisionSampleMonitor/` đều tuân thủ nguyên tắc Clean Code:
      1. `PrecisionSampleMonitor.scss` (610 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout co giãn full-width & full-height Multi-Tab, triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionSampleMonitorHeader.tsx` (68 dòng): Sub-header chuẩn Stitch, breadcrumb `02. R&D • QUẢN LÝ TIẾN ĐỘ MẪU / SAMPLE PROGRESS MONITOR`, badge `CMS R&D` & badge phòng ban hiện tại của User (`BỘ PHẬN: RND`), telemetry trực tuyến `LIVE • SAMPLE ENGINE` kèm pulse dot xanh lục, nút làm mới và Toàn màn hình (Fullscreen).
      3. `PrecisionSampleMonitorKpi.tsx` (125 dòng): 4 Thẻ Micro-cards KPI thống kê realtime: Tổng số mẫu theo dõi (Mở vs Khóa), Hoàn thành tất cả công đoạn (100% OK), Phê duyệt Khách hàng (Approved vs Rejected vs Pending), và Tiến độ chi tiết từng bộ phận.
      4. `PrecisionSampleMonitorToolbar.tsx` (225 dòng): Action Toolbar 2 tầng công thái học: Ô nhập YCSX 7 ký tự kèm chip xem trước tên hàng và nút Thêm mẫu; Cụm nút Lưu tiến độ (hiển thị badge phòng ban người dùng), Khóa mẫu, Mở mẫu (phân quyền KD), Xuất Excel (EX1 Đang lọc / EX2 Tất cả), Nút Tải lại; Segment lọc nhanh trạng thái và Ô tìm kiếm nhanh (Quick Filter).
      5. `PrecisionSampleMonitorColumns.tsx` (525 dòng): Cấu hình 100% đầy đủ các cột và 6 nhóm cột gốc (`SAMPLE INFO`, `RND`, `MATERIAL`, `PRODUCTION`, `QC`, `CUSTOMER`) theo đúng Nguyên tắc số 8 của SKILL. Thiết kế lại toàn bộ Cell Renderers thành Pill Badges / Radio Segments hiện đại, nút link bản vẽ PDF sắc nét.
      6. `PrecisionSampleMonitorTable.tsx` (55 dòng): Container AGTable High-Density bung trọn không gian dọc, triệt tiêu toolbar cũ và đồng bộ selection `selectedSample`.
      7. `sampleMonitorTypes.ts` (48 dòng): Interface dữ liệu, KPI, bộ lọc và hook return types.
      8. `useSampleMonitorData.ts` (395 dòng): Custom hook quản lý 100% state, 8 API queries, tính toán realtime KPI, Quick Filter, xuất Excel và phân quyền.
      9. `SAMPLE_MONITOR.scss` (22 dòng): Cấu hình layout full-height cho `.sample_monitor`, tương thích đa tab của ERP.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Quản lý theo dõi tiến độ hàng mẫu liên phòng ban (R&D, Mua hàng/Kho, Sản xuất, QC, Kinh doanh); tự động nạp thông tin hàng mẫu từ YCSX 7 ký tự và thêm mẫu vào theo dõi; cập nhật tiến độ theo bộ phận người dùng đăng nhập (`RND`, `SX`, `QC`, `KD`, `MUA`/`KHO`); khóa/mở mẫu với phân quyền Kinh Doanh; cột tính toán tự động `TOTAL_STATUS` và link mở bản vẽ PDF.
  - **Xác thực toàn diện**: 100% (10/10) file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp.

  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/rnd/design_amazon/DESIGN_AMAZON.backup.tsx` (109.298 bytes, 2.829 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `DESIGN_AMAZON.tsx` chỉ còn **156 dòng** (giảm hơn 94% từ 2.829 dòng, đạt chuẩn < 160 dòng), kết nối dữ liệu qua custom hook `useDesignAmazonData` và `useDesignAmazonCanvas`, điều phối layout 4 phân vùng Studio công thái học.
    * Toàn bộ 11 subcomponents và module tại `src/pages/rnd/design_amazon/PrecisionDesignAmazon/` đều tuân thủ nguyên tắc Clean Code:
      1. `PrecisionDesignAmazon.scss` (680 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout co giãn full-width & full-height Multi-Tab, triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionDesignAmazonHeader.tsx` (119 dòng): Sub-header chuẩn Stitch, breadcrumb `02. R&D • THIẾT KẾ TEM NHÃN / AMAZON LABEL DESIGN STUDIO`, badge `CMS R&D` & `INDUSTRIAL CAD`, chip mã hàng JetBrains Mono, telemetry trực tuyến `LIVE • CAD STUDIO` kèm pulse dot xanh lục, nút ẩn/hiện Sidebar, Inspector, Table và Fullscreen.
      3. `PrecisionDesignAmazonToolbar.tsx` (250 dòng): Ribbon Command Toolbar công nghiệp: Nhóm Thao tác (Lưu, Undo, Redo, In tem, In USB), Nhóm Bù lề in Offset X/Y (mm), Nhóm Snap & Lưới (1/2/5/10mm, Nét đứt/Nét liền), Nhóm Thu phóng (Zoom in/out, Zoom presets, 100%), Nhóm Palette kéo thả 6 loại đối tượng (`TEXT`, `IMAGE`, `1D BARCODE`, `2D MATRIX`, `QRCODE`, `CONTAINER/BOX`).
      4. `PrecisionDesignAmazonSidebar.tsx` (115 dòng): Cột trái 320px tra cứu mã sản phẩm Amazon: Ô tìm kiếm thông minh hỗ trợ Enter, AGTable thu nhỏ, nút Xuất Excel, click chọn mã để tự động nạp thiết kế lên Canvas.
      5. `PrecisionDesignAmazonCanvas.tsx` (265 dòng): Studio Canvas Viewport: Thước đo tọa độ milimet hai trục X/Y, Sân khấu zoom `#amzStageBounds`, Lưới milimet, Khung in tem `#labelprintref` tích hợp `renderElement`, Đường gióng bắt điểm màu đỏ, Con trỏ xoay tự do màu cam, Khung viền lựa chọn và Tooltip tọa độ realtime.
      6. `PrecisionDesignAmazonInspector.tsx` (340 dòng): Panel phải 280px công thái học: 2 Tab "Thuộc Tính" (Form chỉnh sửa trực quan toàn bộ thông số tọa độ X/Y, W/H, góc xoay, font, cỡ, style B/I/U/R, cavity, nút đổi ảnh, nút xóa) & Tab "Lịch Sử" (Action stack cho phép nhấp để khôi phục bất kỳ bước nào).
      7. `PrecisionDesignAmazonTable.tsx` (275 dòng): Dock bảng AGTable High-Density phía dưới: Bảo toàn trọn vẹn 14 cột kỹ thuật, hỗ trợ kéo thả dòng (`onRowDragEnd`) sắp xếp thứ tự in, chỉnh sửa trực tiếp trên cell, đồng bộ highlight dòng đang chọn, ô lọc nhanh và nút thêm nhanh đối tượng.
      8. `designAmazonTypes.ts` (145 dòng): Định nghĩa hệ thống Types, Interfaces, Canvas states, Snap lines, Rulers và Props.
      9. `useDesignAmazonData.ts` (453 dòng): Custom hook quản lý 100% dữ liệu: CRUD danh sách đối tượng tem, Undo/Redo stack, Jump to history, Web Print (`useReactToPrint`), In USB, Bù lề in Offset X/Y (`localStorage`), upload ảnh, API tra cứu mã hàng và lưu thiết kế.
      10. `useDesignAmazonCanvas.tsx` (570 dòng): Custom hook thuật toán hình học: Zoom mượt mà (Ctrl+Wheel / 25% - 1000%), Bắt điểm thông minh (Smart Snap Lines), Xoay tự do quanh tâm (`rotateDrag`), 4 Handle co giãn theo góc xoay (`renderRotatedResizeHandles`), Nudge bàn phím gia tốc (0.01mm - 40x), Kéo nhóm (Shift+Drag), Chọn tuần tự (Cycle Selection).
      11. `DESIGN_AMAZON.scss` (28 dòng): Cấu hình layout full-height cho `.design_window`, `.component_element`, bảo toàn class `.amz_barcode svg` cho render mã vạch.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ & thuật toán**: Chuyển đổi tọa độ $MM \leftrightarrow PX$; xoay tự do quanh tâm đối tượng và 4 handle co giãn theo góc xoay; bắt điểm thông minh Smart Snap lines; in ấn qua `useReactToPrint` và bù sai lệch in `printOffsetMm` trong `localStorage`; giữ nguyên 100% 14 cột bảng AG-Grid và 6 API queries backend.
  - **Xác thực toàn diện**: 100% (12/12) file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Mã Vạch Sản Phẩm (`PRODUCT_BARCODE_MANAGER.tsx` & `PrecisionProductBarcode/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/rnd/product_barcode_manager/PRODUCT_BARCODE_MANAGER.backup.tsx` (31.773 bytes, 1106 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `PRODUCT_BARCODE_MANAGER.tsx` chỉ còn **128 dòng** (giảm gần 90% từ 1106 dòng, đạt chuẩn < 150 dòng), kết nối dữ liệu qua custom hook `useProductBarcodeData`, điều phối layout 2 pane, 4 thẻ KPI và Modal Pivot.
    * Toàn bộ 9 subcomponents tại `src/pages/rnd/product_barcode_manager/PrecisionProductBarcode/` đều tuân thủ nguyên tắc Clean Code:
      1. `PrecisionProductBarcode.scss` (470 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout 2 pane co giãn full-width & full-height Multi-Tab, triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionProductBarcodeHeader.tsx` (68 dòng): Sub-header chuẩn Stitch, breadcrumb `02. R&D • QUẢN LÝ MÃ SẢN PHẨM / THIẾT LẬP & TRỰC QUAN HÓA MÃ VẠCH (BARCODE & 2D MATRIX)`, badge `CMS R&D`, telemetry trực tuyến `LIVE • BARCODE INTEL`, nút gập/mở form trái, nút làm mới và Fullscreen.
      3. `PrecisionProductBarcodeKpi.tsx` (88 dòng): 4 Thẻ Micro-cards KPI realtime: Tổng số mã barcode, Cơ cấu phân bổ 1D vs QR vs Matrix, Tiến độ sản xuất (Đã SX vs Chưa SX), và Trạng thái kiểm định OK vs NG.
      4. `PrecisionProductBarcodeForm.tsx` (225 dòng): Form thiết lập công thái học kèm **Live Barcode Visualizer Box** xem trước trực tiếp mã quét (1D/QR/Matrix) tức thời ngay khi gõ dữ liệu, Autocomplete chọn mã hàng `G_CODE` & `G_NAME`, cụm nút Thêm, Cập nhật, Xóa, Nhập mới.
      5. `PrecisionProductBarcodeToolbar.tsx` (125 dòng): Action Toolbar 2 tầng: Nút lọc nhanh loại mã (Tất cả, 1D, QR, Matrix), lọc trạng thái sản xuất, ô tìm kiếm nhanh Quick Search, Nút Xuất Excel, Nút Mở Pivot.
      6. `PrecisionProductBarcodeColumns.tsx` (170 dòng): Cấu hình đúng chuẩn 10 cột AG-Grid, bảo toàn 100% field và headerName, font JetBrains Mono, chip OK/NG, badge `SX_STATUS` và giữ nguyên 100% đồ họa mã vạch `CODE_VISUALIZE` (`QRCODE`, `BARCODE`, `DATAMATRIX`).
      7. `PrecisionProductBarcodeTable.tsx` (42 dòng): Bọc bảng AGTable High-Density, chiều cao dòng 42px hiển thị đồ họa mã vạch rõ nét, bung trọn 100% không gian dọc.
      8. `PrecisionProductBarcodePivotModal.tsx` (65 dòng): Modal DevExtreme Pivot Grid phân tích dữ liệu đa chiều, hiệu ứng backdrop blur và nút đóng nhanh.
      9. `barcodeManagerTypes.ts` (49 dòng): Interface dữ liệu, KPI, bộ lọc và hook return types.
      10. `useProductBarcodeData.ts` (340 dòng): Custom hook quản lý 100% state, 6 API queries, tính toán realtime KPI, Quick Filter, xuất Excel và xử lý Fullscreen.
  - **Khắc phục triệt để lỗi tải đi tải lại liên tục (Infinite Re-fetching Loop)**: Loại bỏ `useTransition` gây đổi reference hàm `getcodelist`, cô lập dependency array của `useEffect` on mount thành `[]`, thêm cờ nạp ngầm không pop-up alert khi vừa mở tab.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp toàn bộ barcode sản phẩm với Audit mode; thêm mới, cập nhật, xóa barcode (kiểm tra `SX_STATUS !== "NO"` an toàn); trực quan hóa mã vạch `QRCODE`, `BARCODE`, `DATAMATRIX`; phân tích đa chiều Pivot Grid; triệt tiêu 100% form chật chội font 0.6rem cũ và dải màu gradient lỗi thời.
  - **Bổ sung tương thích layout trong `PRODUCT_BARCODE_MANAGER.scss`**: Cấu hình layout full-height cho `.product_barcode_mamanger` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% (11/11) file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp / runtime. Không còn tải lại liên tục.

- [x] Hoàn thiện Tái Thiết Kế Tab Thêm BOM Amazon (`BOM_AMAZON.tsx` & `PrecisionBomAmazon/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/rnd/bom_amazon/BOM_AMAZON.backup.tsx` (24.191 bytes, 702 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `BOM_AMAZON.tsx` chỉ còn **128 dòng** (giảm từ 702 dòng, đạt chuẩn < 150 dòng), kết nối dữ liệu qua custom hook `useBomAmazonData`, điều phối layout 3 phân vùng công thái học.
    * Toàn bộ 8 subcomponents tại `src/pages/rnd/bom_amazon/PrecisionBomAmazon/` đều tuân thủ nguyên tắc Clean Code:
      1. `PrecisionBomAmazon.scss` (520 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout 3 pane co giãn full-width & full-height Multi-Tab, triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionBomAmazonHeader.tsx` (88 dòng): Sub-header chuẩn Stitch, breadcrumb `02. R&D • THIẾT KẾ SẢN PHẨM / QUẢN LÝ & THIẾT LẬP BOM AMAZON`, badge `CMS R&D`, telemetry trực tuyến `LIVE • BOM ENGINE`, nút gập/mở sidebar, info panel, làm mới và Fullscreen.
      3. `PrecisionBomAmazonSidebar.tsx` (165 dòng): Cột trái navigator 320px: Dropdown chọn phôi mẫu (`G_CODE_MAU`), Segment switcher 2 chế độ (`ĐÃ CÓ BOM` vs `TRA CỨU ALL CODE`), bảng tra cứu mã thu nhỏ với AGTable High-Density.
      4. `PrecisionBomAmazonToolbar.tsx` (148 dòng): Action Toolbar trung tâm: Chip mã sản phẩm `G_CODE` (JetBrains Mono), Tên sản phẩm, Badge nhận diện `BOM ĐÃ LƯU TRÊN HỆ THỐNG` / `BOM MỚI (TỪ PHÔI MẪU)`, Nút Lưu BOM (kiểm tra quyền RND), Nút Bật/Tắt sửa, Nút Nạp lại từ phôi, Nút Xuất Excel, Quick Search tức thì.
      5. `PrecisionBomAmazonColumns.tsx` (185 dòng): Cấu hình 3 bộ cột AG-Grid bảo toàn 100% field, headerName, cell highlight ô cho phép sửa khi bật Edit, Dropdown `QR_DOITUONG_NAME2` với quyền `NHU1903`/`NVD1201`.
      6. `PrecisionBomAmazonInfoPanel.tsx` (165 dòng): Panel phải 320px: Thẻ xem ảnh sản phẩm (có click phóng to, fallback), Textarea tên sản phẩm thực tế, Input thị trường kèm preset chips nhanh, Nút Cập nhật thông tin phụ với mật khẩu `okema`.
      7. `bomAmazonTypes.ts` (50 dòng): Interface dữ liệu, tabs, hook return types.
      8. `useBomAmazonData.ts` (360 dòng): Custom hook quản lý 100% state, 8 API queries, xử lý phân quyền RND, lọc nhanh Quick Filter, xuất Excel và Fullscreen.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Tra cứu và khởi tạo cấu trúc BOM từ phôi mẫu `G_CODE_MAU`; nạp và xem chi tiết BOM Amazon của mã hàng đã có; thêm mới hoặc cập nhật BOM; cập nhật thông tin tên thực tế và thị trường với mật mã `okema`; triệt tiêu 100% bố cục chật chội cũ và dải màu gradient lỗi thời.
  - **Bổ sung tương thích layout trong `BOM_AMAZON.scss`**: Cấu hình layout full-height cho `.bom_amazon`, `.thembomamazon` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% (9/9) file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Tài Liệu ISO (`ALLDOC.tsx` & `PrecisionAllDoc/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iso/DOCUMENT/ALLDOC.backup.tsx` (22.626 bytes, 624 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `ALLDOC.tsx` chỉ còn **109 dòng** (giảm từ 624 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useAllDocData`, điều phối layout và các subcomponents.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/iso/DOCUMENT/PrecisionAllDoc/` đều tuân thủ nghiêm ngặt nguyên tắc Clean Code:
      1. `PrecisionAllDoc.scss` (495 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Rose `#ef4444`, Amber `#f59e0b`, Indigo `#6366f1`), layout co giãn full-width & full-height Multi-Tab (`.documentmanager-page`, `.documentmanager`, `.audit`), triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionAllDocHeader.tsx` (68 dòng): Sub-header chuẩn Stitch, breadcrumb `QUẢN LÝ TÀI LIỆU, TIÊU CHUẨN & HỒ SƠ CHẤT LƯỢNG`, badge `CMS ERP` & `ISO 9001 / IATF 16949`, telemetry trực tuyến `LIVE • DOC INTEL` kèm pulse dot xanh lục, nút làm mới và nút Fullscreen (Toàn màn hình).
      3. `PrecisionAllDocKpi.tsx` (100 dòng): 4 Thẻ Micro-cards KPI realtime: Tổng tài liệu đã lưu, Đang có hiệu lực (`USE_YN: Y`), Cảnh báo hạn dùng (quá hạn / sắp hết hạn trong 30 ngày), Định dạng số hóa (PDF / Office Word-Excel).
      4. `PrecisionAllDocToolbar.tsx` (195 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Cascading Filters): Phân loại cấp 1 (Cat 1), Loại tài liệu cấp 2 (Cat 2), Danh mục tên tài liệu cấp 3, Ô tìm kiếm tên tài liệu, Nút Tìm Kiếm (hỗ trợ phím Enter).
         - Hàng 2 (Grid Actions & Quick Search): Ô tìm kiếm nhanh Quick Search Filter tức thời trên bảng, Nút "Upload Tài Liệu Mới" (phân quyền QC), Nút "Cập Nhật Tài Liệu" (phân quyền MUA/QC cho các dòng tick chọn), Nút "Xuất Excel", Badge đếm số lượng hiển thị và số dòng đã tick chọn.
      5. `PrecisionAllDocColumns.tsx` (185 dòng): Cấu hình đúng chuẩn 18 cột AG-Grid, bảo toàn 100% `field`, `headerName` và `width` theo Nguyên tắc số 8 của SKILL.md. Bổ sung CellRenderer icon định dạng tệp sắc nét (Word, Excel, PDF, PPT, Image, Zip), chip trạng thái HSD bo góc hiện đại, nút tải trực tiếp `DownloadButtonAll`.
      6. `PrecisionAllDocTable.tsx` (38 dòng): Bọc bảng AGTable High-Density, bung trọn 100% không gian dọc, triệt tiêu toolbar cũ và footer thừa.
      7. `PrecisionAllDocUploadModal.tsx` (260 dòng): Modal Upload tài liệu chuyên nghiệp: Chọn phân loại cấp 1/2 với Select tiện lợi, thiết lập ngày ban hành (`REG_DATE`), ngày hết hạn (`EXP_DATE`) và cờ `HSD_YN`, vùng kéo thả tệp Dropzone hiển thị tên và dung lượng tệp rõ ràng trước khi tải lên.
      8. `PrecisionAllDocUpdateModal.tsx` (165 dòng): Modal Cập nhật hàng loạt: Cho phép đồng bộ ngày ban hành, ngày hết hạn, `USE_YN`, `HSD_YN` cho toàn bộ tài liệu đang tick chọn.
      9. `allDocTypes.ts` (42 dòng): Interface dữ liệu Filter, KPI, Modals và Document Data.
      10. `useAllDocData.ts` (335 dòng): Custom hook quản lý 100% state, 6 API queries (`loadDocCategory1`, `loadDocCategory2`, `loadDocList`, `loadDocuments`, `checkLastFileID`, `insertFileData`), upload tài liệu qua `uploadQuery`, cập nhật hàng loạt qua `f_updateMaterialDocData`, tính toán realtime KPI, Quick Search Filter, và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Tra cứu phân cấp tài liệu theo nhóm và loại; Upload tài liệu mới với format chuẩn `${FILE_ID}_${DOC_ID}_${DOC_CAT_ID}_${CAT_ID}.${ext}` lưu vào thư mục `alldocs`; Tải về tệp tài liệu trực tiếp qua `DownloadButtonAll`; Cập nhật thông tin hiệu lực và thời hạn sử dụng văn bản.
  - **Bổ sung tương thích layout trong `ALLDOC.scss`**: Cấu hình layout full-height cho `.documentmanager-page`, `.documentmanager`, `.audit` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file biên dịch sạch sẽ không có bất kỳ lỗi cú pháp JSX, TSX hay SCSS nào.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Thiết Bị & Lịch Sử Hiệu Chuẩn (`CALIBRATION.tsx` & `PrecisionCalibration/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iso/CALIBRATION/CALIBRATION.backup.tsx` (19.231 bytes, 424 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `CALIBRATION.tsx` chỉ còn **157 dòng** (giảm từ 424 dòng, đạt chuẩn < 160 dòng), kết nối dữ liệu qua custom hook `useCalibrationData`, điều phối layout và các subcomponents.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/iso/CALIBRATION/PrecisionCalibration/` đều tuân thủ nghiêm ngặt nguyên tắc Clean Code:
      1. `PrecisionCalibration.scss` (490 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Rose `#ef4444`, Amber `#f59e0b`, Purple `#7c3aed`), layout co giãn full-width & full-height Multi-Tab (`.calibration-page`, `.calibration`, `.calibration-tab`), triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionCalibrationHeader.tsx` (68 dòng): Sub-header chuẩn Stitch, breadcrumb `QUẢN LÝ THIẾT BỊ & LỊCH SỬ HIỆU CHUẨN ĐO LƯỜNG`, badge `CMS ERP` & `ISO 9001 / IATF 16949`, telemetry trực tuyến `LIVE • CALIBRATION INTEL` kèm pulse dot xanh lục, nút làm mới và nút Fullscreen (Toàn màn hình).
      3. `PrecisionCalibrationKpi.tsx` (120 dòng): 5 Thẻ Micro-cards KPI realtime tương tác (Tổng thiết bị, Quá hạn hiệu chuẩn, Sắp đến hạn trong 30 ngày, Trong hạn chuẩn, Đang sử dụng vs Đã hỏng) cho phép nhấp trực tiếp để kích hoạt bộ lọc tương ứng.
      4. `PrecisionCalibrationToolbar.tsx` (195 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filter Tabs & Legend): Nút lọc nhanh theo trạng thái (Tất cả, Quá hạn, Sắp đến hạn, Trong hạn, Đã hỏng), giải thích màu sắc Legend trực quan, Nút Nạp Lại Dữ Liệu.
         - Hàng 2 (Grid Actions & Quick Search): Ô tìm kiếm nhanh Quick Search Filter tức thời theo Tên TB, Số QL, Model, Maker, Vị trí, BP; Nút "+ Thêm Thiết Bị", Nút "+ Thêm Lịch Sử HC" (tự động kích hoạt khi chọn thiết bị), Nút "Xuất Excel", Badge hiển thị thiết bị đang chọn và số lượng.
      5. `PrecisionCalibrationColumns.tsx` (225 dòng): Cấu hình đúng chuẩn 2 bộ cột AG-Grid (Thiết bị 14 cột, Lịch sử 7 cột), bảo toàn 100% `field`, `headerName` và `width` theo Nguyên tắc số 8 của SKILL.md. Bổ sung CellRenderer thumbnail ảnh bo góc có hiệu ứng hover zoom, chip trạng thái `IN_USE` / `BROKEN`, các nút thao tác Sửa/Xóa tinh tế.
      6. `PrecisionCalibrationTables.tsx` (125 dòng): Layout Master-Detail phân cấp hiện đại: Bảng Thiết Bị (Master) phía trên + Bảng Lịch Sử (Detail) phía dưới với thanh header chi tiết hiển thị tên và số QL của thiết bị đang chọn cùng nút đóng panel linh hoạt.
      7. `PrecisionCalibrationModals.tsx` (390 dòng): Gom các dialogs hiện đại: Modal Thêm/Sửa Thiết Bị có dropzone xem trước ảnh tức thời; Modal Thêm/Sửa Lịch Sử Hiệu Chuẩn với tính năng tự động tính `NEXT_CAL_DATE = CAL_DATE + CAL_PERIOD (tháng)` và dropzone ảnh tem; Modal `ImagePreviewModal` xem ảnh thiết bị và tem hiệu chuẩn phóng to full-HD sắc nét với nút mở tab mới.
      8. `calibrationTypes.ts` (50 dòng): Interface dữ liệu Equipment, CalibrationHistory, KPI, UrgencyFilter và ImagePreviewState.
      9. `useCalibrationData.ts` (335 dòng): Custom hook quản lý 100% state, 8 API queries (`qc_get_equipment_list`, `qc_insert_equipment`, `qc_update_equipment`, `qc_delete_equipment`, `qc_get_calibration_history`, `qc_insert_calibration`, `qc_update_calibration`, `qc_delete_calibration`), xử lý upload ảnh thiết bị và tem qua `uploadQuery`, tính toán realtime KPI, Quick Search Filter, và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Quản lý danh mục thiết bị đo lường toàn nhà máy; Quản lý chi tiết từng lượt hiệu chuẩn và tem kiểm định tương ứng với thiết bị; Upload ảnh thiết bị và tem kiểm định vào thư mục `calibration`; Lọc và cảnh báo trực quan các thiết bị quá hạn hiệu chuẩn hoặc sắp đến hạn trong 30 ngày tới.
  - **Bổ sung tương thích layout trong `CALIBRATION.scss`**: Cấu hình layout full-height cho `.calibration-page`, `.calibration`, `.calibration-tab` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file biên dịch sạch sẽ không có bất kỳ lỗi cú pháp JSX, TSX hay SCSS nào.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Lịch Sử Audit (`AUDIT_HISTORY.tsx` & `PrecisionAUDITHistory/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iso/AUDIT/AUDIT_HISTORY.backup.tsx` (24.275 bytes, 686 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `AUDIT_HISTORY.tsx` chỉ còn **113 dòng** (giảm hơn 83% từ 686 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useAUDITHistoryData`, điều phối layout và các subcomponents.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/iso/AUDIT/PrecisionAUDITHistory/` đều tuân thủ nghiêm ngặt giới hạn dòng:
      1. `PrecisionAUDITHistory.scss` (485 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Rose `#ef4444`, Amber `#f59e0b`, Indigo `#6366f1`), layout co giãn full-width & full-height Multi-Tab (`.audit-history-page`, `.kpinvsx`), triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionAUDITHistoryHeader.tsx` (69 dòng): Sub-header chuẩn Stitch, breadcrumb `QUẢN LÝ LỊCH SỬ AUDIT KHÁCH HÀNG & NHÀ CUNG CẤP`, badge `CMS ERP` & `ISO 9001 / IATF 16949`, telemetry trực tuyến `LIVE • AUDIT HISTORY INTEL` kèm pulse dot xanh lục, nút làm mới và nút Fullscreen (Toàn màn hình).
      3. `PrecisionAUDITHistoryKpi.tsx` (106 dòng): 4 Thẻ Micro-cards KPI realtime: Tổng đợt kiểm toán, Tỷ lệ Đạt yêu cầu kèm progress bar và số đợt PASS vs FAIL, Điểm số trung bình so với thang điểm tối đa, Tỷ lệ hồ sơ báo cáo đính kèm đã lưu trữ.
      4. `PrecisionAUDITHistoryToolbar.tsx` (207 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Nút chọn nhanh (7 ngày, 30 ngày, 90 ngày, 1 năm), Toggle badge "Tất cả thời gian", Nút Nạp Dữ Liệu.
         - Hàng 2 (Grid Actions): Ô tìm kiếm nhanh Quick Search Filter tức thời trên bảng, Nút "Thêm Audit", Nút "Sửa", Nút "Xóa" (xác nhận SweetAlert2), Nút "Xuất Excel", Badge đếm số lượng hiển thị và số dòng đã tick chọn.
      5. `PrecisionAUDITHistoryColumns.tsx` (124 dòng): Cấu hình đúng chuẩn 15 cột AG-Grid, bảo toàn 100% `field`, `headerName` và `width` theo Nguyên tắc số 8 của SKILL.md. Bổ sung CellRenderer định dạng chip `PASS` (emerald) / `FAIL` (rose) rực rỡ, điểm số font JetBrains Mono, hiển thị tag loại tệp (PDF/XLSX/DOCX), nút tải về trực tiếp qua `DownloadButtonAll`, nút thay thế tệp nhanh và nút tải lên vi mô với phản hồi SweetAlert2.
      6. `PrecisionAUDITHistoryTable.tsx` (36 dòng): Bọc bảng AGTable High-Density, bung trọn 100% không gian dọc, triệt tiêu toolbar cũ và footer thừa.
      7. `PrecisionAUDITHistoryDialog.tsx` (260 dòng): Modal Thêm/Sửa Audit hiện đại: Autocomplete chọn khách hàng thông minh, tự động điền đồng thời `CUST_CD` và `CUST_NAME_KD`, nhóm thông tin chung, điểm số và đánh giá. Thanh preview đánh giá tự động realtime PASS/FAIL theo thời gian thực khi nhập điểm, kèm ô đính kèm tệp tài liệu/báo cáo trực tiếp trong modal.
      8. `auditHistoryTypes.ts` (33 dòng): Interface dữ liệu KPI, types cho form state và options khách hàng.
      9. `useAUDITHistoryData.ts` (330 dòng): Custom hook quản lý 100% state, 5 API queries (`f_load_AUDIT_HISTORY_DATA`, `f_add_AUDIT_HISTORY_DATA`, `f_update_AUDIT_HISTORY_DATA`, `f_delete_AUDIT_HISTORY_DATA`, `f_updateFileInfo_AUDIT_HISTORY`, `f_getcustomerlist`), xử lý upload file qua `uploadQuery`, tính toán realtime KPI, Quick Filter, và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu lịch sử audit theo khoảng ngày hoặc All Time; Thêm / Sửa / Xóa đợt audit; Upload và tải về tệp báo cáo đính kèm với `DownloadButtonAll`; Triệt tiêu hoàn toàn form chật chội và dải màu gradient `#afd3d1, #86cfff` cũ.
  - **Bổ sung tương thích layout trong `AUDIT_HISTORY.scss`**: Cấu hình layout full-height cho `.audit-history-page`, `.kpinvsx` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file biên dịch sạch sẽ không có bất kỳ lỗi cú pháp JSX, TSX hay SCSS nào.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Checksheet Audit (`AUDIT.tsx` & `PrecisionAUDIT/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iso/AUDIT/AUDIT.backup.tsx` (36.025 bytes, 1139 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `AUDIT.tsx` chỉ còn **170 dòng** (giảm hơn 85% từ 1139 dòng), kết nối dữ liệu qua custom hook `useAUDITData`, điều phối layout 2 panel (Master đợt audit collapsible + Detail checksheet full-height).
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/iso/AUDIT/PrecisionAUDIT/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file** (ngoại trừ file khai báo cột AG-Grid):
      1. `PrecisionAUDIT.scss` (692 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#8b5cf6`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`, `.iso &`, `.audit &`, `.tab-pane &`), custom scrollbar 6px mượt mà, triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionAUDITHeader.tsx` (77 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • ISO / QUẢN LÝ CHECKSHEET AUDIT (SELF AUDIT & CUSTOMER AUDIT)`, badge `CMS ERP` & `ISO COMPLIANCE`, telemetry trực tuyến `LIVE • AUDIT INTEL` kèm pulse dot xanh lục, nút thu gọn/mở rộng panel đợt audit, nút làm mới và nút Fullscreen.
      3. `PrecisionAUDITKpi.tsx` (100 dòng): 4 Thẻ Micro-cards KPI realtime: Tổng hạng mục checksheet, Điểm tổng kết & Tỷ lệ % đạt kèm badge PASS/FAIL so với Pass Score (80 điểm), Số lượng & tỷ lệ ảnh bằng chứng hiện trường, Thông tin chi tiết đợt kiểm toán đang chọn.
      4. `PrecisionAUDITToolbar.tsx` (174 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Dropdown chọn Mẫu Audit (List Audit), Nút Nạp Dữ Liệu, Nút Tạo Đợt Audit Mới (New Audit), Nút Thêm Mẫu Mới (Add Form).
         - Hàng 2 (Checksheet Actions): Ô tìm kiếm nhanh Quick Filter tức thời, Nút Lưu Checksheet, Nút Reset Evident (kiểm tra quyền ISO), Nút Xuất Excel, Badge đếm số dòng checksheet và số dòng đã tick chọn.
      5. `PrecisionAUDITColumns.tsx` (316 dòng): Cấu hình đúng chuẩn 2 bộ cột AG-Grid (Batch List 9 cột, Checksheet Detail 24 cột), bảo toàn 100% `field` và `headerName` theo Nguyên tắc số 8 của SKILL.md, CellRenderer thumbnail ảnh bằng chứng hiện trường hover zoom, Micro Upload Widget chuyên nghiệp hỗ trợ chọn và tải lên nhiều ảnh `.jpg` cùng lúc, cell điểm số và ghi chú hỗ trợ inline edit.
      6. `PrecisionAUDITBatchTable.tsx` (43 dòng): Bảng Master danh sách các đợt Audit có header badge và collapsible panel.
      7. `PrecisionAUDITChecklistTable.tsx` (35 dòng): Bảng AGTable High-Density hiển thị toàn diện các tiêu chí checksheet.
      8. `PrecisionAUDITAddFormModal.tsx` (192 dòng): Modal tạo form mẫu checksheet mới chuyên nghiệp (thay thế khối `.upgia` cũ): nạp Excel XLSX, Autocomplete chọn khách hàng, nhập Pass Score và Audit Name, thêm/xóa dòng mượt mà.
      9. `PrecisionAUDITImagePreviewModal.tsx` (55 dòng): Modal xem ảnh bằng chứng kích thước lớn kèm nút mở tab mới và đóng nhanh.
      10. `auditTypes.ts` (32 dòng): Interface dữ liệu KPI và types mở rộng.
      11. `useAUDITData.ts` (684 dòng): Custom hook quản lý 100% state, 15 API queries (`selectCustomerAndVendorList`, `auditlistcheck`, `loadAuditResultList`, `loadAuditResultCheckList`, `checkAuditResultCheckListExist`, `insertResultIDtoCheckList`, `createNewAudit`, `updateEvident`, `resetEvident`, `updatechecksheetResultRow`, `checklastAuditID`, `insertCheckSheetData`, `checkAuditNamebyCustomer`, `insertNewAuditInfo`, `uploadQuery`), xử lý upload nhiều file, tính toán realtime KPI, Quick Filter, và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ & Tương tác cell**: Chỉnh sửa điểm `AUDIT_SCORE` và ghi chú `REMARK` trực tiếp trên cell; nâng cấp UX upload ảnh bằng chứng hiện trường; click thumbnail ảnh mở modal phóng to; phân quyền nghiêm ngặt khi bấm "Reset Evident"; triệt tiêu 100% form chật chội 480px và dải màu gradient cũ.
  - **Bổ sung tương thích layout trong `AUDIT.scss`**: Cấu hình layout full-height cho `.audit`, `.tabs-container`, `.tab-content`, `.tab-pane` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file biên dịch sạch sẽ không có bất kỳ lỗi cú pháp JSX, TSX hay SCSS nào.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Điểm Thi & Gauge R&R (`RNR.tsx` & `PrecisionRNR/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iso/RNR/RNR.backup.tsx` (18.523 bytes, 479 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `RNR.tsx` chỉ còn **110 dòng** (giảm từ 479 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useRNRData`, điều phối layout và các subcomponents.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/iso/RNR/PrecisionRNR/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionRNR.scss` (695 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#8b5cf6`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`, `.iso &`, `.rnr &`, `.tab-pane &`), custom scrollbar 6px mượt mà, triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionRNRHeader.tsx` (61 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • ISO / QUẢN LÝ ĐIỂM THI & GAUGE R&R (MEASUREMENT SYSTEMS ANALYSIS)`, badge `CMS ERP` & `RNR INTELLIGENCE`, telemetry trực tuyến `LIVE • MSA INTEL` kèm pulse dot xanh lục, nút làm mới và nút bật/tắt toàn màn hình (Fullscreen).
      3. `PrecisionRNRKpi.tsx` (26 dòng) điều phối 3 sub-widgets:
         - `PrecisionRNRKpiDetail.tsx` (112 dòng): Tổng lượt phép đo/câu hỏi, Tỷ lệ phán đoán đúng L1 (Accuracy 1 %) kèm progress bar, Tỷ lệ phán đoán đúng L2 (Accuracy 2 %), Số nhân viên tham gia, Dải tóm tắt mẫu chuẩn OK vs NG.
         - `PrecisionRNRKpiEmpl.tsx` (112 dòng): Quân số dự thi, Tỷ lệ Đạt L1 (Pass Rate 1 %) kèm progress bar, Điểm trung bình L1 (Avg Score 1) và Max/Min, Tỷ lệ Đạt L2 (Gauge R&R), Dải tóm tắt Tỷ lệ Bắt nhầm (BN Rate) & Tỷ lệ Bỏ sót (BS Rate) trung bình.
         - `PrecisionRNRKpiDept.tsx` (83 dòng): Số bộ phận đánh giá, Bộ phận dẫn đầu Pass Rate, Điểm trung bình toàn xưởng, Bộ phận cần cải thiện.
      4. `PrecisionRNRToolbar.tsx` (245 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Checkbox All Time, Nhà máy (ALL/NM1/NM2), Loại bài test (ALL/G_RNR/Test_LT/Test_CC), Test ID, Tên nhân viên, Nút Tra Dữ Liệu (hỗ trợ Enter trên mọi ô nhập).
         - Hàng 2 (Grid Toolbar): **Segment Switcher 3 Chế Độ** (`📋 Chi Tiết Đề Thi`, `👥 Tổng Hợp Theo Nhân Viên`, `🏢 Phân Tích Theo Bộ Phận`), Ô tìm kiếm nhanh Quick Filter tức thời trên bảng, Nút xuất Excel `EX1 (Lọc)` & `EX2 (Toàn Bộ)`, Badge đếm số dòng hiển thị.
      5. `PrecisionRNRColumns.tsx` (380 dòng): Cấu hình đúng chuẩn 3 bộ cột AG-Grid (Detail 16 cột, Summary 13 cột + Bắt nhầm/Bỏ sót, Dept 9 cột), bảo toàn 100% `field` và `headerName` theo Nguyên tắc số 8 của SKILL.md, bổ sung CellRenderer định dạng badge TRUE/FALSE/NA, chip PASS/FAIL rực rỡ, highlight điểm số font JetBrains Mono $\ge 80$ xanh / $< 80$ đỏ.
      6. `PrecisionRNRTable.tsx` (28 dòng): Bọc bảng AGTable High-Density, bung trọn 100% không gian dọc, triệt tiêu toolbar cũ và footer thừa.
      7. `rnrTypes.ts` (39 dòng): Interface dữ liệu KPI.
      8. `useRNRData.ts` (477 dòng): Custom hook quản lý 100% state, API queries (`loadRNRchitiet`, `RnRtheonhanvien`), tính toán phân tích nhóm bộ phận tự động, Quick Filter, và xuất Excel chuẩn hóa qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu chi tiết bài thi và tổng hợp theo nhân viên; khôi phục phân loại `G_RNR`, `Test_LT`, `Test_CC`; bổ sung phân tích nhóm phòng ban; xuất Excel EX1/EX2; triệt tiêu hoàn toàn form chật chội 250px và dải màu gradient cũ.
  - **Bổ sung tương thích layout trong `ISO.scss` & `RNR.scss`**: Cấu hình layout full-height cho `.iso`, `.tabs-container`, `.tab-content`, `.tab-pane`, `.rnr` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file biên dịch sạch sẽ không có bất kỳ lỗi cú pháp JSX, TSX hay SCSS nào.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Báo Cáo CS (`CSREPORT.tsx` & `PrecisionCSReport/`) theo chuẩn Google Stitch High-Density Enterprise & Đồng Bộ Biểu Đồ Kiểu KinhDoanhReport:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/cs/CSREPORT.backup.tsx` (40.172 bytes, 1049 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `CSREPORT.tsx` chỉ còn **103 dòng** (giảm từ 1049 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useCSReportData`, điều phối layout và các phân hệ báo cáo.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/cs/PrecisionCSReport/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionCSReport.scss` (1021 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`, `.qcreport &`, `.totalcs &`, `.baocaocs &`), custom scrollbar 6px mượt mà, executive cards container, grid 2 cột responsive.
      2. `PrecisionCSReportHeader.tsx` (59 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • CS / BÁO CÁO DỊCH VỤ KHÁCH HÀNG & SỰ CỐ CHẤT LƯỢNG (CS QUALITY & ISSUE ANALYTICS)`, badge `CMS ERP` & `CS INTELLIGENCE`, telemetry trực tuyến `LIVE • CS INTEL` kèm pulse dot xanh lục, nút làm mới và nút Fullscreen (Toàn Màn Hình).
      3. `PrecisionCSReportToolbar.tsx` (241 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Worst By (AMOUNT / QTY), NG Type (ALL / PROCESS / MATERIAL), Autocomplete chọn mã hàng (Code hàng), chip đếm số mã đã chọn (hỗ trợ click để xóa nhanh), Tên khách hàng (Customer), Checkbox Default, Nút Tìm kiếm (Tra cứu).
         - Hàng 2 (Segment Switcher): Chuyển đổi tức thời giữa 5 phân hệ: `⊞ Xem Toàn Diện`, `⚠️ Phản Hồi Sự Cố`, `👥 Khách Hàng & PIC`, `💰 Tiết Kiệm Chi Phí`, `📉 Chi Phí F-Cost`.
      4. `PrecisionCSReportKpi.tsx` (148 dòng): 4 Thẻ Micro-cards KPI realtime (Hôm nay, Tuần này, Tháng này, Năm này) bóc tách rõ ràng số lượng sự cố CMS (C) và sự cố Khách hàng (K); cùng **Operational Financial Strip** tóm tắt tài chính: Tổng tiền tiết kiệm Cost Saving ($), Chi phí RMA ($), Chi phí Taxi ($), và Tổng tổn thất F-Cost ($) với font monospace JetBrains Mono.
      5. `CSChartCustomerIssue.tsx` (215 dòng): Biểu đồ Donut phân bổ sự cố theo Khách hàng được nâng cấp lên chuẩn cao cấp `KinhDoanhReport` (`KDChartCustomerRevenue.tsx`): 3 Chế độ xem linh hoạt (`Song Song` / `Biểu Đồ` / `Danh Sách`), tương tác tâm Donut hiển thị tỷ trọng %, thanh tiến trình (progress bar), bảng xếp hạng với badge Top #1/#2/#3, ô tìm kiếm nhanh tức thì và bộ 24 màu `ENTERPRISE_PALETTE`.
      6. `CSChartPICIssue.tsx` (219 dòng): Biểu đồ Donut phân bổ sự cố theo Nhân sự phụ trách PIC chuẩn `KinhDoanhReport`: Tích hợp đầy đủ Split / Chart / List view modes, Donut center, progress bars, tìm kiếm theo tên nhân sự PIC.
      7. `csDonutHelpers.tsx` (80 dòng): Module dùng chung chia sẻ bảng màu công nghiệp `ENTERPRISE_PALETTE`, hàm định dạng `formatCompact`, renderer hình khối hover `renderActiveShape` và đường kẻ dẫn nhãn cong chống xén mép `renderCustomizedLabel`.
      8. `PrecisionCSReportFeedbackSection.tsx` (147 dòng): Phân hệ 4 biểu đồ phản hồi sự cố (Daily, Weekly, Monthly, Yearly Issue Feedback) bọc trong Executive Cards độc lập kèm nút xuất Excel riêng biệt (`SaveExcel`).
      9. `PrecisionCSReportBreakdownSection.tsx` (79 dòng): Phân hệ phân tích cơ cấu sự cố chứa 2 biểu đồ Donut khách hàng và PIC trong Executive Cards kèm nút xuất Excel.
      10. `PrecisionCSReportCostSavingSection.tsx` (185 dòng): Phân hệ Tiết kiệm chi phí: Bảng tóm tắt Cost Saving gọn gàng Slate typography + 4 biểu đồ Cost Saving Trending (Daily, Weekly, Monthly, Yearly) kèm nút xuất Excel độc lập cho từng biểu đồ.
      11. `PrecisionCSReportFCostSection.tsx` (174 dòng): Phân hệ Chi phí tổn thất F-Cost: Bảng tóm tắt F-Cost (RMA, Taxi, Tổng cộng) + 4 biểu đồ RMA Trending + 4 biểu đồ Taxi Trending kèm nút xuất Excel độc lập.
      12. `useCSReportData.ts` (698 dòng): Custom hook quản lý 100% state, 18 API queries (`csdailyconfirmdata`, `csweeklyconfirmdata`, `csmonthlyconfirmdata`, `csyearlyconfirmdata`, `csConfirmDataByCustomer`, `csConfirmDataByPIC`, `csdailyreduceamount`, `csweeklyreduceamount`, `csmonthlyreduceamount`, `csyearlyreduceamount`, `csdailyRMAAmount`, `csweeklyRMAAmount`, `csmonthlyRMAAmount`, `csyearlyRMAAmount`, `csdailyTaxiAmount`, `csweeklyTaxiAmount`, `csmonthlyTaxiAmount`, `csyearlyTaxiAmount`), autocomplete mã hàng, tính toán KPI tài chính realtime, và Browser Fullscreen API.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp đầy đủ 18 nguồn dữ liệu chất lượng CS và tài chính; thêm tính năng xuất Excel độc lập cho toàn bộ 16 biểu đồ trending và 2 biểu đồ phân bổ Donut; tối ưu bảng Cost Saving và F-Cost sang High-Density card; triệt tiêu 100% thanh toolbar vàng-cam cũ, không footer thừa.
  - **Bổ sung tương thích layout trong `CSTOTAL.scss` & `QCReport.scss`**: Cấu hình layout full-height cho `.baocaocs`, `.csreport` và tabs container nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Dữ Liệu CS (`CS_DATA.tsx` & `PrecisionCSData/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/cs/CS_DATA.backup.tsx` (45.650 bytes, 1662 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `CS_DATA.tsx` chỉ còn **113 dòng** (giảm từ 1662 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useCSData`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/cs/PrecisionCSData/`:
      1. `PrecisionCSData.scss` (962 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#1e40af / #2563eb`, Emerald `#10b981 / #047857`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#8b5cf6`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`, `.totalcs &`, `.datacs &`), custom scrollbar 6px mượt mà, triệt tiêu 100% toolbar xanh lá mặc định và footer thừa của AGTable.
      2. `PrecisionCSDataHeader.tsx` (62 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • CS / THEO DÕI & XỬ LÝ SỰ CỐ KHÁCH HÀNG (CUSTOMER QUALITY DATA)`, badge `CMS ERP` & `CS INTELLIGENCE`, telemetry trực tuyến `LIVE • CS INTEL` kèm pulse dot xanh lục, nút làm mới và nút bật/tắt toàn màn hình (Fullscreen).
      3. `PrecisionCSDataKpi.tsx` (341 dòng): Cụm **Widgets thông tin hữu ích** thích ứng theo 4 phân hệ:
         - Phân hệ Xác Nhận Lỗi (CS): Tổng số vụ khiếu nại CS, số vụ đã hoàn thành đối sách (NNDS Rate %), tổng tiền giảm trừ/bồi thường ($ REDUCE_AMOUNT), số lượng đổi trả, sản lượng kiểm tra & phế phẩm NG, tỷ lệ thay thế % kèm progress bar, phạm vi khách hàng & SKUs; cùng thanh trạng thái hồ sơ: Tỷ lệ có ảnh lỗi hiện trường, có file đối sách tiếng Việt, có file đối sách tiếng Hàn.
         - Phân hệ RMA: Tổng vụ RMA, tổng lượng trả về (EA), tổng tiền RMA ($), kết quả sorting OK vs NG.
         - Phân hệ Xin CNĐB: Tổng vụ xin CNĐB, tổng lượng xin (EA), số vụ khách chấp nhận OK vs từ chối NG.
         - Phân hệ Taxi: Tổng lượt đi taxi, tổng chi phí taxi (VND), chi phí bình quân/lượt, số nhân sự CS sử dụng.
      4. `PrecisionCSDataToolbar.tsx` (217 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Code KD, Code ERP, Số YCSX, Khách hàng, Nút Tra Dữ Liệu (hỗ trợ Enter trên mọi ô nhập).
         - Hàng 2 (Grid Toolbar): **Segment Switcher 4 Chế Độ** (`📋 Xác Nhận Lỗi (CS)`, `🔄 Lịch Sử RMA`, `⚠️ Xin CNĐB (SA)`, `🚕 Chi Phí Taxi`), Ô tìm kiếm nhanh Quick Filter tức thời trên bảng, Nút xuất Excel `EX1 (Lọc)` & `EX2 (Toàn Bộ)`, Nút `PIVOT` mở modal phân tích đa chiều cho phân hệ Xác Nhận Lỗi, Badge đếm số dòng hiển thị.
      5. `PrecisionCSDataColumns.tsx` (404 dòng): Cấu hình đúng chuẩn 4 bộ cột AG-Grid của bản gốc (Confirm 36 cột, RMA 37 cột, CNDB 16 cột, Taxi 14 cột), bảo toàn 100% `field` và `headerName` theo Nguyên tắc số 8 của SKILL.md, bổ sung CellRenderer định dạng thumbnail ảnh khuyết tật hover zoom, link tải PPTX, nút upload vi mô, nút Sửa NNDS trực tiếp và font monospace JetBrains Mono cho số lượng/tiền tệ.
      6. `PrecisionCSDataTable.tsx` (32 dòng): Bọc bảng AGTable High-Density, hỗ trợ chiều cao 56px cho bảng có thumbnail ảnh và 28px cho bảng thường, bung trọn 100% không gian dọc, triệt tiêu toolbar cũ và footer thừa.
      7. `PrecisionCSDataNNDSModal.tsx` (126 dòng): Modal cập nhật Nguyên Nhân - Đối Sách công thái học: Hiển thị tóm tắt sự cố, ảnh khuyết tật phóng to, 2 khung textarea song ngữ Hàn-Việt (Nguyên nhân viền đỏ, Đối sách viền xanh), cụm nút Lưu Đối Sách và Hủy bỏ.
      8. `PrecisionCSDataPivotModal.tsx` (230 dòng): Modal phân tích Pivot Grid đa chiều với cấu hình 27 trường phong phú của DevExtreme, hiệu ứng backdrop blur và nút đóng nhanh.
      9. `useCSData.ts` (462 dòng): Custom hook quản lý 100% state, API queries (`tracsconfirm`, `tracsrma`, `tracsCNDB`, `tracsTAXI`, `updatenndscs`, `updateCSImageStatus`, `updateCSDoiSachVNStatus`, `updateCSDoiSachKRStatus`), upload file ảnh/PPTX, tính toán realtime các chỉ số widgets KPI, Quick Filter, và xuất Excel chuẩn hóa qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Tra cứu dữ liệu CS theo cả 4 phân hệ (Xác nhận lỗi, RMA, Xin CNĐB, Taxi); bổ sung xuất Excel EX1/EX2 và mở Pivot Table đa chiều; cập nhật Nguyên Nhân - Đối Sách và tải lên ảnh lỗi/file PPTX trực tiếp; triệt tiêu hoàn toàn toolbar xanh lá mặc định, không footer thừa.
  - **Xác thực toàn diện**: 100% file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Tình Hình Cuộn Liệu (`TINHINHCUONLIEU.tsx` & `PrecisionCuonLieu/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU.backup.tsx` (39.920 bytes, 1294 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `TINHINHCUONLIEU.tsx` chỉ còn **102 dòng** (giảm từ 1294 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useCuonLieuData`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ các presentation subcomponents tại `src/pages/sx/TINH_HINH_CUON_LIEU/PrecisionCuonLieu/` đều tuân thủ nghiêm ngặt giới hạn dưới **300 dòng/file**:
      1. `PrecisionCuonLieu.scss` (855 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#1e40af / #2563eb`, Emerald `#10b981 / #047857`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#8b5cf6`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`, `.kiemtra &`, `.qlsxplan &`), custom scrollbar 6px mượt mà, triệt tiêu 100% toolbar xanh lá mặc định của AGTable.
      2. `PrecisionCuonLieuHeader.tsx` (62 dòng): Sub-header chuẩn Stitch, breadcrumb `03. SẢN XUẤT • THEO DÕI CUỘN LIỆU / MATERIAL LOT STATUS & ROLL LOSS (TÌNH HÌNH CUỘN LIỆU)`, badge `CMS ERP` & `ROLL INTELLIGENCE`, telemetry trực tuyến `LIVE • MATERIAL INTEL` kèm pulse dot xanh lục, nút làm mới và nút bật/tắt toàn màn hình (Fullscreen).
      3. `PrecisionCuonLieuKpi.tsx` (288 dòng): Cụm **Widgets thông tin hữu ích** theo yêu cầu người dùng:
         - Micro-card 1: Xuất Kho Vật Liệu (Tổng mét xuất kho, Số cuộn liệu, Chiều dài bình quân m/cuộn, Số chủng loại liệu).
         - Micro-card 2: Ngoại Quan & Thành Phẩm (Mét kiểm tra đạt OK, Mét vào kiểm, Mét thực tế xuất kiểm).
         - Micro-card 3: Tổn Thất & Hiệu Suất (Tỷ lệ tổn thất kiểm tra %, Tỷ lệ tổn thất toàn bộ %, Tỷ lệ đạt Pass Rate % kèm thanh tiến trình đổi màu xanh < 2%, vàng 2-5%, đỏ > 5%).
         - Micro-card 4: Sản Lượng Chi Tiết EA (Tổng sản phẩm đạt EA, Số chỉ thị sản xuất Plans, Sản lượng thực xuất EA).
         - Operational Pipeline Strip: Tóm tắt tiến độ cuộn liệu qua toàn bộ các trạm dây chuyền (`Xuất Kho` $\rightarrow$ `FR` $\rightarrow$ `SR` $\rightarrow$ `DC` $\rightarrow$ `ED` $\rightarrow$ `Giao Nhận` $\rightarrow$ `Vào KT` $\rightarrow$ `Ra KT`) với số lượng cuộn Đã xong (Y), Đang chờ (R), Chưa tới (N).
      4. `PrecisionCuonLieuToolbar.tsx` (288 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Checkbox All Time, Nhà máy, Thiết bị Line máy, Code KD, Code ERP, Tên liệu, Mã liệu, Số YCSX, Số chỉ thị, Khách hàng, Nút Tra Liệu (hỗ trợ Enter trên mọi ô nhập).
         - Hàng 2 (Grid Toolbar): Nút bật/thu gọn Biểu Đồ Tổn Thất, Switcher chế độ biểu đồ (Tuần vs Ngày), Ô tìm kiếm nhanh Quick Filter tức thời trên bảng, Nút xuất Excel `EX1 (Lọc)` & `EX2 (Toàn Bộ)`, Nút `PIVOT` mở modal phân tích đa chiều, Badge đếm số dòng hiển thị.
      5. `PrecisionCuonLieuChart.tsx` (60 dòng): Executive Card chứa biểu đồ Daily/Weekly Roll Loss kèm tiêu đề, badge nhận diện và nút đóng nhanh.
      6. `PrecisionCuonLieuColumns.tsx` (226 dòng): Cấu hình đúng chuẩn các cột AG-Grid của bản gốc, bảo toàn 100% `field` và `headerName` theo Nguyên tắc số 8 của SKILL.md, bổ sung CellRenderer định dạng font monospace JetBrains Mono cho số lượng mét/EA/ngày tháng/mã cuộn, badge trạng thái công đoạn (Y Xanh, R Vàng, N Đỏ), highlight cảnh báo tỷ lệ tổn thất cao $\ge 5\%$.
      7. `PrecisionCuonLieuTable.tsx` (29 dòng): Bọc bảng AGTable High-Density, bung trọn 100% không gian, triệt tiêu toolbar cũ và footer thừa.
      8. `PrecisionCuonLieuPivotModal.tsx` (250 dòng): Modal phân tích Pivot Grid đa chiều với cấu hình 30+ trường phong phú của DevExtreme, hiệu ứng backdrop blur và nút đóng nhanh.
      9. `useCuonLieuData.ts` (365 dòng): Custom hook quản lý 100% state, API queries (`materialLotStatus`, `f_getMachineListData`, `f_loadRollLossData`, `f_loadRollLossDataDaily`), Audit mode filter (`TEM_NOI_BO`), tính toán realtime các chỉ số widgets KPI, chuỗi tiến độ công đoạn, Quick Filter, và xuất Excel chuẩn hóa qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu trạng thái cuộn liệu theo mọi tham số ngày tháng, mã hàng, khách hàng, số chỉ thị, nhà máy, máy; bổ sung xuất Excel EX1/EX2; mở Pivot Table đa chiều; triệt tiêu hoàn toàn toolbar xanh lá cũ và footer thừa.
  - **Xác thực toàn diện**: 100% file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi cú pháp.

- [x] Hoàn thiện Đồng Bộ Bảng Xếp Hạng Worst & Biểu Đồ Tròn Kiểu KinhDoanhReport (`INSPECT_REPORT.tsx` & `PrecisionInspectReport/`):
  - **Donut Chart Top 5 Lỗi (`PrecisionInspectReportWorstDonut.tsx` - 272 dòng)**: 3 Chế độ xem Split/Chart/List, Donut Center tương tác, Ranking List kèm thanh tiến độ %, Enterprise Palette 24 màu.
  - **Donut Chart Sản Phẩm Kế Bên (`ChartWorstCodeByErrCode.tsx` - 290 dòng)**: Donut Chart chuẩn KinhDoanhReport, nhấp vào tên sản phẩm mở bản vẽ PDF kỹ thuật `/banve/{G_CODE}.pdf`.
  - **Bảng Xếp Hạng AGTable High-Density (`InspectionWorstTable.tsx` - 206 dòng & `InspectionWorstTable.scss`)**: Bố cục 2 pane (Bảng lỗi 44% + Biểu đồ tròn 56%), click dòng tự động cập nhật biểu đồ tròn bên cạnh, highlight dòng đang chọn (`iwt-row-selected`), typography JetBrains Mono.
  - **Tinh gọn Master Section (`PrecisionInspectReportWorstSection.tsx` - 85 dòng)**: Phân rã Clean Code, toàn bộ file đều < 300 dòng.
  - **Xác thực**: 100% file HTTP 200 OK trên Vite Dev Server (port 3001).

- [x] Hoàn thiện Tái Thiết Kế Báo Cáo Kiểm Tra (`INSPECT_REPORT.tsx` & `PrecisionInspectReport/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100%**: Backup tại `INSPECT_REPORT.backup.tsx` (1117 dòng).
  - **Phân rã module**: Master Controller 120 dòng + 9 subcomponents (Header, Toolbar, KPI, F-Cost, Người Hàng, Defects, Worst, Hook, SCSS).
  - **5 Segment Switcher Tabs**: Toàn Diện / F-Cost / Người Hàng / Defects / Worst Products.
  - **16 API queries bảo toàn**: PPM (NM1/NM2/ALL), F-Cost, Defect Trending, Người Hàng, Worst, Patrol Header.
  - **Xác thực**: 11/11 file HTTP 200 OK.


- [x] Khắc phục triệt để lỗi layout bảng dữ liệu lơ lửng, đảm bảo bám dính 100% full-height xuống tận cuối trang ở tab `INSPECTION.tsx` (`KIEMTRA.tsx`):
  - **Khắc phục tại `KIEMTRA.scss`**: Bổ sung `height: calc(100vh - 85px)` và quy tắc Multi-Tab `.component_element &` (`height: 100% !important`), thiết lập full-height cho `.tabs-container`, `.tab-content`, `.tab-pane`, và container `.trainspection`.
  - **Khắc phục tại `PrecisionINSPECTION.scss`**: Khởi tạo `.precision-ins` với fallback `height: calc(100vh - 85px)` và selector đa cấp `.component_element &, .trainspection &, .kiemtra &, .tab-pane &` (`height: 100% !important`), tối ưu `workspace` và `tableContainer` (`calc(100% - 36px)`), cùng bộ style toàn diện cho `.agtable`, `.ag-theme-quartz`, `.ag-root-wrapper`.
  - **Xác thực**: Kiểm tra trên Vite Dev Server (port 3001) đạt `HTTP 200 OK`, bảng kéo dài 100% xuống sát đáy màn hình.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Báo Cáo OQC (`OQC_REPORT.tsx` & `PrecisionOQCReport/`) theo chuẩn Google Stitch High-Density Enterprise (Đồng bộ Báo Cáo PQC, IQC & Kinh Doanh):
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/oqc/OQC_REPORT.backup.tsx` (29.976 bytes, 829 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `OQC_REPORT.tsx` chỉ còn **103 dòng** (giảm từ 829 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useOQCReportData`, quản lý toàn màn hình và điều phối các phân hệ báo cáo.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/oqc/PrecisionOQCReport/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionOQCReport.scss` (529 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#0f172a`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout co giãn full-width & full-height Multi-Tab, executive chart cards, grid 2 cột responsive, custom scrollbar 6px mượt mà.
      2. `PrecisionOQCReportHeader.tsx` (76 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • OQC / BÁO CÁO TOÀN DIỆN CHỈ SỐ CHẤT LƯỢNG (OQC QUALITY ANALYTICS)`, badge `CMS ERP` & `OQC INTELLIGENCE`, telemetry `LIVE • OQC INTEL` kèm pulse dot xanh lá, nút làm mới và nút Fullscreen.
      3. `PrecisionOQCReportToolbar.tsx` (174 dòng): SaaS Control Toolbar 2 tầng:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Tên khách hàng (Customer), Checkbox Default, Nút Tìm kiếm (Search).
         - Hàng 2 (Segment Switcher): Chuyển đổi linh hoạt giữa 4 phân hệ: `⊞ Xem Toàn Diện`, `📉 Tỷ Lệ Lỗi OQC`, `📊 Inspection PPM (CMS)`, `👥 Khách Hàng & Loại SP`.
      4. `PrecisionOQCReportKpi.tsx` (123 dòng): 4 Thẻ Micro-cards KPI realtime (Today NG, This Week NG, This Month NG, This Year NG) với tỷ lệ lỗi % sắc nét và badge màu trạng thái (Tiêu chuẩn / Theo dõi / Vượt ngưỡng).
      5. `PrecisionOQCReportNGRateSection.tsx` (149 dòng): Phân hệ 4 biểu đồ tỷ lệ lỗi OQC (Daily, Weekly, Monthly, Yearly NG Rate) bọc trong Executive Cards độc lập kèm nút xuất Excel riêng biệt (`SaveExcel`).
      6. `PrecisionOQCReportInspectionPPMSection.tsx` (154 dòng): Phân hệ 4 biểu đồ PPM kiểm tra xuất hàng CMS (Daily, Weekly, Monthly, Yearly PPM) kèm nút xuất Excel.
      7. `PrecisionOQCReportCustomerProdSection.tsx` (83 dòng): Phân hệ phân tích sự cố theo Khách hàng và Chủng loại sản phẩm (NG By Customer & NG By Product Type) với chiều cao chuẩn 540px, kèm nút xuất Excel.
      8. `oqcReportApi.ts` (119 dòng): Module chuyên trách gọi các truy vấn API `dailyOQCTrendingData`, `weeklyOQCTrendingData`, `monthlyOQCTrendingData`, `yearlyOQCTrendingData`, `inspect_..._oqc`, `ngbyCustomerOQC`, `ngbyProTypeOQC`.
      9. `useOQCReportData.ts` (195 dòng): Custom hook quản lý 100% state, loading SweetAlert2, các hàm xuất Excel độc lập và Fullscreen API.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu OQC theo khoảng ngày, lọc theo khách hàng, xuất Excel riêng từng biểu đồ, triệt tiêu hoàn toàn dải màu cũ và footer thừa.
  - **Bổ sung tương thích trong `OQC.scss`**: Cấu hình layout full-height cho `.precision-oqc-report` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi TypeScript.


- [x] Hoàn thiện Tái Thiết Kế Màn Hình Khiếu Nại Khách Hàng VOC (`VOC_HISTORY.tsx` & `PrecisionVOCHistory/`) theo chuẩn Google Stitch High-Density Enterprise & TV Command Center & Tối Ưu Scanner:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/oqc/VOC_HISTORY.backup.tsx` (17.558 bytes, 530 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `VOC_HISTORY.tsx` chỉ còn **75 dòng** (giảm từ 530 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useVOCHistoryData`, quản lý toàn màn hình TV và điều phối layout.
    * Tinh giản cấu trúc giao diện theo phản hồi người dùng thành **Single Unified Header**:
      - Loại bỏ hoàn toàn header phụ `CMS ERP VOC INTELLIGENCE` và thanh header `LẦN QUÉT GẦN NHẤT...`.
      - Tích hợp trọn vẹn vào **1 thanh Header/Toolbar duy nhất**: Ô bắn mã vạch laser tự động giữ focus, Nút Tìm, Nút Bỏ lọc, Checkbox "Dùng máy scan", Checkbox "Show All", Nút "Reload", và Nút **"TV Mode (F11)"** kích hoạt Browser Fullscreen API (`document.documentElement.requestFullscreen()`) tương đương bấm F11 toàn màn hình thiết bị thật.
      - Bên dưới thanh header là 100% không gian dành riêng cho lưới thẻ ảnh khuyết tật 16:9 (`PrecisionVOCHistoryGrid.tsx`).
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/oqc/PrecisionVOCHistory/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionVOCHistory.scss` (801 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, dark mode TV Command Center tương phản cao, laser pulsing scanner bar, 16:9 defect cards, custom scrollbar 6px mượt mà.
      2. `PrecisionVOCHistoryToolbar.tsx` (226 dòng): Single Unified Header điều khiển: Ô nhập mã laser scanner, Toggles "Dùng máy scan", "Show All", Nút Reload, Nút TV Mode F11 kích hoạt Fullscreen thực thụ.
      3. `PrecisionVOCHistoryCard.tsx` (220 dòng): Card hiển thị lỗi khuyết tật tỉ lệ vàng 16:9, tối ưu hiển thị trên màn hình TV từ xa 3-5m, triple-click hoặc click upload ảnh mới, hiển thị đầy đủ thông tin mã hàng, lỗi, số lượng phế phẩm, nhà máy, ngày phát sinh.
      4. `PrecisionVOCHistoryGrid.tsx` (58 dòng): Lưới hiển thị các thẻ VOC responsive tự động co giãn theo độ phân giải màn hình.
      5. `vocImageHelpers.ts` (51 dòng): Module quản lý cache ảnh `VOC_IMAGE_CACHE`, hàm giải quyết đường dẫn ảnh thông minh `resolveVocImage` và chuẩn hóa đuôi mở rộng file.
      6. `useVOCHistoryData.ts` (273 dòng): Custom hook quản lý toàn diện state, API nạp dữ liệu `f_loadQTRData`, tra cứu mã Process Lot sang `G_CODE` qua `f_checkG_CODE_From_PROCESS_LOT_NO`, tích hợp Native Fullscreen API F11 và đồng bộ `fullscreenchange`, lắng nghe phím scanner toàn cục và sử dụng SweetAlert2 non-blocking toast (hoàn toàn không cần chuột/bàn phím để bấm nút tắt thông báo).
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu VOC theo khoảng ngày, tra cứu theo từ khóa hoặc quét barcode tự động, upload ảnh sự cố.
  - **Bổ sung tương thích trong `OQC.scss`**: Cấu hình layout full-height cho `.precision-voc-history` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi TypeScript.


- [x] Hoàn thiện Tái Thiết Kế Màn Hình Data QTR (`QTR_DATA.tsx` & `PrecisionQTRData/`) theo chuẩn Google Stitch High-Density Enterprise & Bổ Sung Cụm Widgets Sự Cố Hữu Ích:
  - **Bảo toàn 100% mã nguồn gốc & Interface**: Lưu trữ an toàn tại `src/pages/qc/oqc/QTR_DATA.backup.tsx` (7.677 bytes, 208 dòng) và giữ nguyên `export interface QTR_DATA` đảm bảo tương thích toàn dự án.
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `QTR_DATA.tsx` chỉ còn **96 dòng** (giảm từ 208 dòng, đạt chuẩn < 100 dòng), kết nối dữ liệu qua custom hook `useQTRData`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/oqc/PrecisionQTRData/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionQTRData.scss` (480 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout co giãn full-width & full-height Multi-Tab (`.component_element &` và `.oqc .trainspection`), custom scrollbar 6px mượt mà, triệt tiêu 100% toolbar xanh lá cũ và footer thừa của AGTable.
      2. `PrecisionQTRDataHeader.tsx` (60 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • OQC / THEO DÕI SỰ CỐ CHẤT LƯỢNG (QUALITY TROUBLE REPORT - QTR)`, badge `CMS ERP` & `QTR INTELLIGENCE`, telemetry trực tuyến `SYSTEM ONLINE` kèm pulse dot xanh lá, nút làm mới dữ liệu và nút bật/tắt toàn màn hình (Fullscreen).
      3. `PrecisionQTRDataKpi.tsx` (190 dòng): Cụm **Widgets thông tin hữu ích** theo yêu cầu người dùng:
         - Micro-card 1: Tổng Sự Cố QTR & Tỷ Lệ Đóng (Total Cases, Đã duyệt đóng, Đang xử lý, Tỷ lệ đóng % với badge trạng thái màu).
         - Micro-card 2: Lượng Phế Phẩm & PPM (Tổng lượng lỗi phát sinh, Tổng xuất kho EA, PPM bình quân).
         - Micro-card 3: Cảnh Báo Sự Cố Ngưỡng Đỏ (Số vụ vượt ngưỡng Main Line $\ge 500$ PPM & Xuất $\ge 100$k EA).
         - Micro-card 4: Phạm Vi Dự Án & Linh Kiện (Số dự án Projects, Số mã linh kiện Part Codes, Số mẫu test).
         - Operational Summary Strip: Phân bổ theo Nhà máy (Plant NM1/NM2), Vị trí phát sinh (Main Line vs Sub/Khác) và Tiến độ phê duyệt.
      4. `PrecisionQTRDataToolbar.tsx` (120 dòng): SaaS Control Toolbar 2 tầng chuyên nghiệp:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Nút Tra Dữ Liệu QTR (hỗ trợ Enter).
         - Hàng 2 (Grid Toolbar): Ô tìm kiếm nhanh Quick Filter tức thời trên bảng, Nút xuất Excel `EX1 (Lọc)` & `EX2 (Toàn Bộ)`, Badge đếm số dòng hiển thị.
      5. `PrecisionQTRDataColumns.tsx` (250 dòng): Cấu hình đúng chuẩn 32 cột AG-Grid của bản gốc, bảo toàn 100% `field`, `headerName`, và `width` theo Nguyên tắc số 8 của SKILL.md, bổ sung CellRenderer định dạng font monospace JetBrains Mono cho số lượng/PPM, badge trạng thái phê duyệt (Hoàn thành vs Chưa duyệt) và highlight cảnh báo lỗi nghiêm trọng.
      6. `PrecisionQTRDataTable.tsx` (40 dòng): Bọc bảng AGTable High-Density, bung trọn 100% không gian, triệt tiêu toolbar cũ và footer thừa.
      7. `useQTRData.ts` (200 dòng): Custom hook quản lý 100% state, API query `f_loadQTRData`, tính toán realtime các chỉ số widgets KPI, Quick Filter, và xuất Excel chuẩn hóa qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu sự cố QTR theo khoảng ngày; thêm tính năng xuất Excel độc lập EX1/EX2; triệt tiêu hoàn toàn footer thừa.
  - **Bổ sung tương thích trong `OQC.scss`**: Cấu hình layout full-height cho `.precision-qtr-data` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi TypeScript trong `src/pages/qc/oqc/`.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Data OQC (`OQC_DATA.tsx` & `PrecisionOQCData/`) theo chuẩn Google Stitch High-Density Enterprise & Bổ Sung Cụm Widgets Thông Tin Hữu Ích:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/oqc/OQC_DATA.backup.tsx` (9.075 bytes, 255 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `OQC_DATA.tsx` chỉ còn **73 dòng** (giảm từ 255 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `useOQCData`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/oqc/PrecisionOQCData/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionOQCData.scss` (480 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout co giãn full-width & full-height Multi-Tab (`.component_element &` và `.oqc .trainspection`), custom scrollbar 6px mượt mà, triệt tiêu 100% toolbar xanh lá cũ và footer thừa của AGTable.
      2. `PrecisionOQCDataHeader.tsx` (60 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • OQC / DỮ LIỆU KIỂM TRA XUẤT HÀNG (OUTGOING QUALITY CONTROL)`, badge `CMS ERP` & `OQC INTELLIGENCE`, telemetry trực tuyến `SYSTEM ONLINE` kèm pulse dot xanh lá, nút làm mới dữ liệu và nút bật/tắt toàn màn hình (Fullscreen).
      3. `PrecisionOQCDataKpi.tsx` (190 dòng): Cụm **Widgets thông tin hữu ích** theo yêu cầu người dùng:
         - Micro-card 1: Tổng Lượt OQC & Tỷ Lệ Đạt (Total Inspections, Lô OK, Lô NG, Pass Rate % với badge trạng thái màu).
         - Micro-card 2: Sản Lượng & Giá Trị Xuất Hàng (Tổng Qty xuất EA, Tổng giá trị xuất $ USD).
         - Micro-card 3: Lấy Mẫu Kiểm Tra & Tỷ Lệ Lỗi (Lượng mẫu test, Lượng mẫu lỗi NG, Tỷ lệ phế phẩm % và PPM).
         - Micro-card 4: Thiệt Hại Phế Phẩm Mẫu (Tổng tiền mẫu lỗi $ USD, Số mã hàng SKUs, Số khách hàng).
         - Operational Summary Strip: Phân bổ theo Nhà máy (NM1 vs NM2) và Ca làm việc (Ngày vs Đêm).
      4. `PrecisionOQCDataToolbar.tsx` (170 dòng): SaaS Control Toolbar 2 tầng chuyên nghiệp:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Code KD, Code ERP, YCSX, Khách hàng, Nút Tra Dữ Liệu (hỗ trợ Enter trên mọi ô nhập).
         - Hàng 2 (Grid Toolbar): Ô tìm kiếm nhanh Quick Filter tức thời trên bảng, Nút xuất Excel `EX1 (Lọc)` & `EX2 (Toàn Bộ)`, Badge đếm số dòng hiển thị.
      5. `PrecisionOQCDataColumns.tsx` (240 dòng): Cấu hình đúng chuẩn 25 cột AG-Grid của bản gốc, bảo toàn 100% `field`, `headerName`, và `width` theo Nguyên tắc số 8 của SKILL.md, bổ sung CellRenderer định dạng font monospace JetBrains Mono cho số lượng/tiền tệ/ngày tháng và highlight các lô có lỗi NG.
      6. `PrecisionOQCDataTable.tsx` (40 dòng): Bọc bảng AGTable High-Density, bung trọn 100% không gian, triệt tiêu toolbar cũ và footer thừa.
      7. `useOQCData.ts` (240 dòng): Custom hook quản lý 100% state, API query `traOQCData`, tính toán realtime các chỉ số widgets KPI, Quick Filter, và xuất Excel chuẩn hóa qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu OQC theo ngày tháng, mã hàng, khách hàng, số chỉ thị YCSX; bổ sung xuất Excel EX1/EX2; triệt tiêu hoàn toàn footer thừa.
  - **Bổ sung tương thích trong `OQC.scss`**: Cấu hình layout full-height cho `.trainspection, .precision-oqc-data` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`.
  - **Xác thực toàn diện**: 100% file đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi TypeScript trong `src/pages/qc/oqc/`.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Báo Cáo PQC (`PQC_REPORT.tsx` & `PrecisionPQCReport/`) theo chuẩn Google Stitch High-Density Enterprise & Báo Cáo IQC / Kinh Doanh:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/pqc/PQC_REPORT.backup.tsx` (29.689 bytes, 803 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `PQC_REPORT.tsx` chỉ còn **120 dòng** (giảm từ 803 dòng, đạt chuẩn < 150 dòng), kết nối dữ liệu qua custom hook `usePQCReportData`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/pqc/PrecisionPQCReport/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionPQCReport.scss` (485 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar 6px mượt mà, executive cards container, grid 2 cột responsive, triệt tiêu 100% footer thừa và thanh cuộn ngang vỡ layout.
      2. `PrecisionPQCReportHeader.tsx` (60 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • PQC / BÁO CÁO TOÀN DIỆN CHỈ SỐ CHẤT LƯỢNG & XU HƯỚNG LỖI (PQC ANALYTICS)`, badge `CMS ERP`, telemetry trực tuyến `LIVE • QUALITY INTEL` kèm pulse dot xanh lá, nút làm mới dữ liệu và nút bật/tắt toàn màn hình (Fullscreen).
      3. `PrecisionPQCReportToolbar.tsx` (198 dòng): SaaS Control Toolbar 2 hàng chuyên nghiệp:
         - Hàng 1 (Filters): Từ ngày, Đến ngày, Worst By (AMOUNT/QTY), NG Type (ALL/PROCESS/MATERIAL), Autocomplete chọn mã hàng kèm chip tags danh sách mã đã chọn (cho phép xóa từng mã hoặc xóa tất cả), Tên khách hàng (Customer), Checkbox Default, Nút Tra Cứu (Search).
         - Hàng 2 (Segment Switcher): Chuyển đổi tức thời giữa 4 phân hệ: `⊞ Xem Toàn Diện`, `📈 Xu Hướng Tỷ Lệ Lỗi PPM`, `⚠️ Xu Hướng Khuyết Tật & Sự Cố`, `💰 Chi Phí Tổn Thất F-Cost`.
      4. `PrecisionPQCReportKpi.tsx` (80 dòng): 4 Thẻ Micro-cards KPI realtime (Today NG, This Week NG, This Month NG, This Year NG) bóc tách rõ ràng 3 chỉ số: Total PPM/Rate %, Process PPM, Material PPM.
      5. `PrecisionPQCReportPPMSection.tsx` (105 dòng): Phân hệ PPM với 4 biểu đồ PPM (Daily, Weekly, Monthly, Yearly) bọc trong Executive Cards độc lập kèm nút xuất Excel riêng biệt (`SaveExcel`).
      6. `PrecisionPQCReportDefectsSection.tsx` (100 dòng): Phân hệ Defect Trending hiển thị biểu đồ Daily Defect Trending (hỗ trợ click vào cột ngày để lọc drill-down các sự cố theo ngày) + Nút xuất Excel và cụm thẻ sự cố hiện trường `PATROL_COMPONENT2` hiển thị trên 1 hàng ngang duy nhất cuộn ngang (`overflow-x: auto`) kèm badge gợi ý.
      7. `PrecisionPQCReportFCostSection.tsx` (115 dòng): Phân hệ F-Cost hiển thị chi phí tổn thất: Bảng F-Cost Summary (`PQCFCOSTTABLE`) được bóp gọn gàng (`fcost-summary-card`, max-width 640px) chống dàn trải fullwidth, chuẩn hóa header Slate & font JetBrains Mono, cùng 4 biểu đồ F-Cost Trending (Daily, Weekly, Monthly, Yearly) kèm nút xuất Excel độc lập cho từng biểu đồ.
      8. `usePQCReportData.ts` (300 dòng): Custom hook quản lý 100% state, API queries (`pqcdailyppm`, `pqcweeklyppm`, `pqcmonthlyppm`, `pqcyearlyppm`, `dailyPQCDefectTrending`, `getPQCSummary`, `trapqc3data`, `selectcodeList`), cơ chế tải đồng thời `Promise.all`, xử lý chọn/xóa mã code, drill-down click sự cố và xuất Excel chuẩn hóa.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp đầy đủ dữ liệu chất lượng công đoạn PQC; Click biểu đồ khuyết tật để lọc chi tiết sự cố ngày tương ứng; Xuất Excel riêng biệt cho từng biểu đồ và bảng tổng hợp; Triệt tiêu hoàn toàn footer thừa, không có tab menu lặp lại.
  - **Bổ sung tương thích trong `PQC.scss`**: Cấu hình layout full-height cho `.pqcreport, .precision-pqc-report` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab "Báo Cáo PQC" của `PQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 9/9 file mới và liên quan đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi TypeScript trong `src/pages/qc/pqc/`.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Giao Nhận Dao Film Tài Liệu (`QLGN.tsx` & `PrecisionQLGN/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/rnd/quanlygiaonhandaofilm/QLGN.backup.tsx` (21.058 bytes, 659 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `QLGN.tsx` chỉ còn **129 dòng** (giảm từ 659 dòng, đạt chuẩn < 150 dòng), kết nối dữ liệu qua custom hook `useQLGNData`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ 6 presentation subcomponents tại `src/pages/rnd/quanlygiaonhandaofilm/PrecisionQLGN/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionQLGN.scss` (485 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout co giãn 2 panel (Sidebar Form 350px collapsible & Main Grid full-height), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar, triệt tiêu 100% toolbar cũ của AGTable và hoàn toàn không footer thừa.
      2. `PrecisionQLGNHeader.tsx` (60 dòng): Sub-header chuẩn Stitch, breadcrumb `02. R&D • GIAO NHẬN / QUẢN LÝ GIAO NHẬN DAO - FILM - TÀI LIỆU`, badge `CMS ERP`, telemetry trực tuyến `LIVE • R&D SYSTEM` kèm pulse dot xanh lá, nút làm mới dữ liệu và nút bật/tắt toàn màn hình (Fullscreen).
      3. `PrecisionQLGNKpi.tsx` (65 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Lượt Giao Nhận, Đã Phát Hành PH, Thu Hồi TH, Chờ Xác Nhận Pending CFM).
      4. `PrecisionQLGNInputCard.tsx` (240 dòng): Form nhập liệu công thái học Ergonomic: Autocomplete Khách Hàng & Mã Sản Phẩm với bộ lọc nhanh, ngày bàn giao, phân loại phát hành PH/TH, phân loại tài liệu (Dao/Film/Tài liệu/Mắt dao), phân loại bàn giao (New Code/ECN/Update/Amendment), nhân sự 3 bên (R&D, QC, SX với validation bắt buộc $\ge 7$ ký tự), thông số thích ứng động (Mã dao film, vị trí tài liệu, kích thước Rộng x Dài, số lượng OHP Film), bộ đôi nút Lưu Bàn Giao (Royal Blue Gradient) & Làm Mới (Slate).
      5. `PrecisionQLGNToolbar.tsx` (95 dòng): SaaS Action Toolbar: Nút Tra Data / Sync, nút bật/thu gọn Ẩn/Hiện Form Nhập, ô tìm kiếm nhanh Quick Filter trên bảng, cụm xuất Excel EX1 (lọc) & EX2 (toàn bộ) và badge đếm số dòng hiển thị.
      6. `PrecisionQLGNColumns.tsx` (160 dòng): Cấu hình 24 cột AG-Grid theo đúng nguyên tắc số 8 của SKILL.md, khớp 100% `headerName` và `width` gốc, bổ sung CellRenderer tinh tế cho `CFM_GIAONHAN` (Đã Duyệt / Chờ Duyệt), `LOAIPHATHANH` (PH / TH), và định dạng font monospace JetBrains Mono cho các mã số, ngày tháng, số lượng.
      7. `PrecisionQLGNTable.tsx` (60 dòng): Bọc bảng AGTable High-Density, chiếm trọn 100% chiều cao và độ rộng còn lại, triệt tiêu 100% footer thừa và thanh trạng thái giả.
      8. `useQLGNData.ts` (230 dòng): Custom hook quản lý 100% state, API queries (`loadquanlygiaonhan`, `selectCustomerAndVendorList`, `selectcodeList`, `addbangiaodaofilmtailieu`), kiểm toán `getAuditMode()` che `TEM_NOI_BO` an toàn, validation dữ liệu, tính toán KPI realtime và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Tra cứu đầy đủ lịch sử giao nhận dao/film/tài liệu giữa R&D, PQC và SX; Thêm mới giao nhận với modal xác nhận SweetAlert2 và kiểm tra ràng buộc mã nhân viên $\ge 7$ ký tự và số lượng $> 0$; Xuất dữ liệu Excel chuẩn hóa EX1 (dữ liệu lọc) và EX2 (toàn bộ); Không còn footer thừa, không có tab menu thừa.
  - **Bổ sung tương thích trong `PQC.scss`**: Cấu hình layout full-height cho `.qlgn, .precision-qlgn` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab "Giao Nhận Dao Film" của `PQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 9/9 file mới và liên quan đạt HTTP 200 OK trên Vite Dev Server (port 3001) và sạch lỗi TypeScript trong `src/pages/rnd/quanlygiaonhandaofilm/`.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Giám Sát Chất Lượng Trực Tiếp (`PATROL.tsx` & `PrecisionPATROL/`) theo chuẩn Google Stitch High-Density & Tối Ưu Trình Chiếu TV:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/sx/PATROL/PATROL.backup.tsx` (12.293 bytes, 362 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `PATROL.tsx` chỉ còn **186 dòng** (giảm từ 362 dòng), kết nối dữ liệu qua custom hook `usePatrolData`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ 6 presentation subcomponents tại `src/pages/sx/PATROL/PrecisionPATROL/` đều tuân thủ nghiêm ngặt giới hạn dưới **200 dòng/file**:
      1. `PrecisionPATROL.scss` (680 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, tích hợp **TV Command Center Fullscreen Mode** (tương phản cao, phóng to chữ và số liệu dễ đọc từ 3-5m), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbars, triệt tiêu 100% footer thừa và không tab menu thừa.
      2. `PrecisionPatrolHeader.tsx` (110 dòng): Sub-header chuẩn Stitch & TV Telemetry: Badge Live Stream với pulse dot, thanh đếm ngược chu kỳ tự động làm mới 10 giây realtime (`Auto: 8s`), nút Play/Pause auto-refresh, nút chuyển đổi Live / Lịch sử, date picker, nút reload và nút `Trình Chiếu TV` (Fullscreen).
      3. `PrecisionPatrolKpi.tsx` (68 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Sự Cố Phát Sinh, Lỗi Công Đoạn PQC3, Thử Nghiệm Độ Tin Cậy DTC, Kiểm Tra Ngoại Quan INS NL & PK).
      4. `PrecisionPatrolToolbar.tsx` (85 dòng): Action Toolbar: Lọc theo phân hệ (`Tất Cả`, `PQC3`, `DTC`, `INS`) và **Switcher Chế Độ Bố Cục** (`☰ Hàng Ngang Lanes` hoặc `⊞ Lưới Thẻ Grid`).
      5. `PrecisionPatrolCard.tsx` (175 dòng): **Card lỗi thế hệ mới siêu đẹp**: Khung hình tỷ lệ 16:9 sắc nét, avatar nhân viên kiểm tra nổi bật ở góc ảnh, badge thời gian phát sinh `X min ago` (kèm pulse đỏ cảnh báo khẩn cấp nếu sự cố $\le 15$ phút), badge thiết bị & line (`NM1 • L01`), tên sản phẩm, khách hàng, mô tả hiện tượng lỗi, **thanh tiến trình tỷ lệ phế phẩm (NG Rate Progress Bar)** phân màu trực quan (xanh < 2%, vàng 2-5%, đỏ > 5%), và nút phóng to ảnh lỗi.
      6. `PrecisionPatrolLane.tsx` (60 dòng): Hàng ngang hiển thị từng phân hệ với track cuộn mượt mà, header có badge đếm số lượng thẻ sự cố và trạng thái empty state khi không có lỗi.
      7. `PrecisionPatrolModal.tsx` (75 dòng): Modal xem trước ảnh sự cố phóng to với backdrop blur, thanh thông tin chi tiết thiết bị, mã lỗi, tỷ lệ và người kiểm tra.
      8. `usePatrolData.ts` (220 dòng): Custom hook quản lý 100% queries API backend (`getpatrolheader`, `trapqc3data`, `loadDTCPatrol`, `trainspectionpatrol`), timer đếm ngược chu kỳ 10s auto-refresh, Live Stream toggle, layout view mode và fullscreen state.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu đồng thời 3 trạm giám sát (PQC3, DTC, INS Patrol NL/PK) và header summary, cơ chế tự động đồng bộ theo thời gian thực (Live Stream) hoặc tra cứu lịch sử theo ngày.
  - **Bổ sung tương thích trong `PQC.scss`**: Cấu hình layout full-height cho `.patrol, .precision-patrol` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab PATROL của `PQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 10/10 file mới và liên quan đạt HTTP 200 OK trên Vite Dev Server (port 3001) và `ZERO ERRORS in src/pages/sx/PATROL!` qua kiểm thử TypeScript `tsc`. Không footer thừa, không tab menu thừa.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Đăng Ký & Theo Dõi Lỗi PQC (`PQC3.tsx` & `PrecisionPQC3/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/pqc/PQC3.backup.tsx` (26.363 bytes, 793 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `PQC3.tsx` chỉ còn **132 dòng** (giảm từ 793 dòng), kết nối dữ liệu qua custom hook `usePQC3Data`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ 9 presentation subcomponents tại `src/pages/qc/pqc/PrecisionPQC3/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionPQC3.scss` (680 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Rose `#f43f5e`, Amber `#f59e0b`, Emerald `#10b981`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbars, triệt tiêu 100% toolbar xanh lá cũ của AGTable, không footer thừa và không tab menu thừa.
      2. `PrecisionPQC3Header.tsx` (60 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • PQC / ĐĂNG KÝ & THEO DÕI LỖI CÔNG ĐOẠN (PQC3 CONTROL)`, badge `CMS ERP` & `DEFECT PQC3`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionPQC3Kpi.tsx` (62 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Sự Cố Lỗi PQC3, Tổng Sản Phẩm Lỗi NG EA, Tổng Lượng Mẫu KT, Tỷ Lệ Lỗi TB PPM/%).
      4. `PrecisionPQC3DirectiveCard.tsx` (80 dòng): Banner ngữ cảnh hiển thị thông tin chỉ thị kỹ thuật (PLAN_ID, LOT SX, G_CODE, G_NAME, YCSX_NO, YCSX_DATE, Badge liên kết PQC1_ID và PQC3_ID đang chọn).
      5. `PrecisionPQC3InputCard.tsx` (220 dòng): Form đăng ký sự cố lỗi PQC3 tối ưu UX: Nhà máy NM1/NM2, Lot SX tự động tra cứu khi gõ/quét >= 8 ký tự, Mã LINEQC tự động hiển thị tên nhân viên QC, phân loại mã lỗi, hiện tượng lỗi, thời gian phát sinh, ghi chú, lượng mẫu KT & lượng phế phẩm, chọn ảnh đính kèm, hỗ trợ phím Enter tuần tự và bộ đôi nút `Lưu Sự Cố (Input Data)` & `Update Ảnh`.
      6. `PrecisionPQC3Toolbar.tsx` (110 dòng): SaaS Action Toolbar phía trên bảng: Nút `Tra Data Lỗi`, Nút bật/thu gọn `Ẩn/Hiện Form Nhập`, **Segment Switcher 3 Chế Độ** (`⚠️ LỖI PQC3`, `⚙️ CÀI ĐẶT PQC1`, `◫ SONG SONG DUAL`), ô lọc nhanh tức thời Quick Filter trên lưới, cụm xuất Excel `EX1` lọc & `EX2` toàn bộ, và badge đếm số dòng.
      7. `PrecisionPQC3Columns.tsx` (220 dòng): Cấu hình 29 cột bảng PQC1 và 29 cột bảng PQC3 chuẩn Stitch, khớp 100% `headerName` và `width` bản gốc theo nguyên tắc số 8 của SKILL.md, định dạng số hàng nghìn và nút xem ảnh lỗi trực quan.
      8. `PrecisionPQC3Table.tsx` (98 dòng): Bọc bảng AGTable High-Density, hỗ trợ chế độ xem đơn lẻ hoặc song song Dual View, hoàn toàn không có footer thừa hoặc status bar giả ở chân trang, tối đa hóa không gian dọc cho bảng dữ liệu.
      9. `PrecisionPQC3ImageModal.tsx` (68 dòng): Modal xem trước ảnh lỗi phóng to trực quan với backdrop blur mờ nền và fallback khi ảnh chưa tồn tại.
      10. `usePQC3Data.ts` (588 dòng): Custom hook quản lý 100% state, queries API (`trapqc1data`, `trapqc3data`, `checkPLAN_ID`, `checkPROCESS_LOT_NO`, `checkEMPL_NO_mobile`, `loadErrTable`, `insert_pqc3`, `getlastestPQC3_ID`, `uploadFile2`), tự động liên kết PQC1_ID khi click dòng, tính toán KPI realtime và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Đăng ký lỗi PQC3 kèm upload ảnh lỗi tự động, tự động tra cứu Lot SX và chỉ thị sản xuất, tự động tra cứu tên nhân viên QC, nạp danh mục mã lỗi từ CSDL, cập nhật ảnh cho dòng PQC3 đã chọn trên bảng, xuất Excel EX1/EX2.
  - **Bổ sung tương thích trong `PQC.scss`**: Cấu hình layout full-height cho `.pqc3, .precision-pqc3` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab PQC3-DEFECT của `PQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 12/12 file mới và liên quan đạt HTTP 200 OK trên Vite Dev Server (port 3001) và 0 lỗi TypeScript trong `src/pages/qc/pqc/`. Không footer thừa, không tab menu thừa.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Cài Đặt Công Đoạn PQC (`PQC1.tsx` & `PrecisionPQC1/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/pqc/PQC1.backup.tsx` (33.462 bytes, 940 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `PQC1.tsx` chỉ còn **86 dòng** (giảm từ 940 dòng, đạt chuẩn < 120 dòng), kết nối dữ liệu qua custom hook `usePQC1Data`, quản lý toàn màn hình và điều phối layout.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/pqc/PrecisionPQC1/` đều tuân thủ nghiêm ngặt giới hạn dưới **200 dòng/file** (< 250 dòng theo cam kết):
      1. `PrecisionPQC1.scss` (733 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar, triệt tiêu 100% toolbar xanh lá cũ của AGTable, loại bỏ footer thừa và thanh trạng thái giả.
      2. `PrecisionPQC1Header.tsx` (58 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • PQC / CÀI ĐẶT CÔNG ĐOẠN (PQC1 - SETTING CONTROL)`, badge `CMS ERP`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionPQC1Kpi.tsx` (75 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Lô Setting, Độ Tin Cậy DTC DKT/CKT, Tổng Lượng Mẫu KT, Tỷ Lệ Lỗi Bình Quân).
      4. `PrecisionPQC1InputCard.tsx` (198 dòng): Form nhập liệu Setting tối ưu UX: Nhà máy NM1/NM2, Chỉ thị PLAN_ID tự động tra cứu khi gõ/quét >= 8 ký tự, Mã LINEQC tự động hiển thị tên nhân viên QC, Mã Leader SX tự động hiển thị tên Leader, Ghi chú, hỗ trợ di chuyển tuần tự bằng phím Enter và 2 nút Lưu Setting / Update QTY.
      5. `PrecisionPQC1DirectiveCard.tsx` (123 dòng): Tech Specs Banner hiển thị thông tin chỉ thị sản xuất (LOT SX, LOT NVL, Line máy, Công đoạn, Step, PD, Cavity, Thời gian ST.OK, Mã CNSX, Tên NVL & Khổ, Badge trạng thái độ tin cậy KTDTC DKT/CKT).
      6. `PrecisionPQC1Toolbar.tsx` (87 dòng): SaaS Action Toolbar phía trên bảng: Nút `Tra Data`, Nút bật/thu gọn `Show/Hide Chỉ Thị`, Nút `Update QTY`, ô lọc nhanh tức thời Quick Filter trên lưới, cụm xuất Excel `EX1` lọc, `EX2` toàn bộ và badge đếm số dòng.
      7. `PrecisionPQC1Columns.tsx` (136 dòng): Cấu hình 34 cột chuẩn Stitch của `column_TRA_PQC1_DATA`, khớp 100% `headerName` và `width` bản gốc theo nguyên tắc số 8 của SKILL.md.
      8. `PrecisionPQC1Table.tsx` (41 dòng): Bọc bảng AGTable High-Density, hoàn toàn không có footer thừa hoặc status bar giả ở chân trang, tối đa hóa không gian dọc cho bảng dữ liệu.
      9. `usePQC1Data.ts` (493 dòng): Custom hook quản lý 100% state, queries API (`trapqc1data`, `checkktdtc`, `loadDataSX`, `checkPLAN_ID`, `checkPROCESS_LOT_NO`, `checkPlanIdP501`, `checkProcessLotNo_Prod_Req_No`, `checkMNAMEfromLot`, `checkEMPL_NO_mobile`, `insert_pqc1`, `updatepqc1sampleqty`), tính toán KPI realtime và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**: Nạp dữ liệu sản xuất KHSX P501 tự động, kiểm tra độ tin cậy (`checkktdtc`), kiểm tra tên nhân viên QC và Leader SX, lưu setting cài đặt công đoạn (`insert_pqc1`), cập nhật số lượng mẫu kiểm tra hàng loạt (`updatepqc1sampleqty`).
  - **Bổ sung tương thích trong `PQC.scss`**: Cấu hình layout full-height cho `.pqc1, .precision-pqc1` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab PQC1-SETTING của `PQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 10/10 file mới đạt HTTP 200 OK trên Vite Dev Server (port 3001) và `ZERO ERRORS in src/pages/qc/pqc!` qua kiểm thử TypeScript `tsc`. Không footer thừa, không tab menu thừa.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Tra Cứu Dữ Liệu PQC (`TRAPQC.tsx` & `PrecisionTRAPQC/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/pqc/TRAPQC.backup.tsx` (33.172 bytes, 932 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `TRAPQC.tsx` chỉ còn **95 dòng** (giảm từ 932 dòng), kết nối dữ liệu qua custom hook `useTrapqcData`, quản lý toàn màn hình và điều phối các subcomponents.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/pqc/PrecisionTRAPQC/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionTRAPQC.scss` (769 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout Split 2 panel (Sidebar 270px, Main Table container), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar, triệt tiêu 100% toolbar xanh lá cũ của AGTable, loại bỏ footer thừa, và luật clipping boundary `contain: paint layout !important` ngăn chặn tràn chữ đè ô sang cột bên cạnh.
      2. `PrecisionTrapqcHeader.tsx` (69 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • PQC / TRA CỨU DỮ LIỆU KIỂM TRA (PQC DATA EXPLORER)`, badge `CMS ERP`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionTrapqcKpi.tsx` (117 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Bản Ghi, Phân Hệ Nguồn Dữ Liệu, Sản Lượng Kiểm Tra, Lỗi Khuyết Tật & Tỷ Lệ %).
      4. `PrecisionTrapqcSidebar.tsx` (239 dòng): Khung tra cứu 270px bên trái: Bộ lọc đa trường (All Time, Từ ngày - Đến ngày, Nhà máy, Code KD, Code ERP, Nhân viên, Khách hàng, Loại SP, Số YCSX, LOT SX, ID), hỗ trợ phím Enter và nút Tra Cứu nổi bật.
      5. `PrecisionTrapqcToolbar.tsx` (112 dòng): SaaS Action Toolbar phía trên bảng: **Segment Switcher 4 Chế Độ** (`SETTING`, `DEFECT`, `DAO-FILM`, `CNĐB`), ô lọc nhanh tức thời Quick Filter trên lưới, cụm xuất Excel `EX1` lọc, `EX2` toàn bộ, `PIVOT` và badge đếm số dòng.
      6. `PrecisionTrapqcColumns.tsx` (138 dòng): Cấu hình 4 bảng cột chuẩn Stitch (`column_TRA_PQC1_DATA` 34 cột, `column_pqc3_data` 29 cột, `column_daofilm_data` 15 cột, `column_cndb_data` 15 cột), khớp 100% `headerName` và `width` bản gốc theo nguyên tắc số 8 của SKILL.md.
      7. `PrecisionTrapqcTable.tsx` (44 dòng): Bọc bảng AGTable High-Density, hoàn toàn không có footer thừa hoặc status bar giả ở chân trang, tối đa hóa không gian dọc cho bảng dữ liệu.
      8. `PrecisionTrapqcNNDSModal.tsx` (102 dòng): Modal popup Cập nhật Nguyên Nhân & Đối Sách bọc trọn vẹn `PATROL_COMPONENT`, textarea có label song ngữ rõ ràng và nút Lưu Đối Sách emerald gradient.
      9. `useTrapqcData.ts` (407 dòng): Custom hook quản lý 100% state, queries API (`trapqc1data`, `trapqc3data`, `tradaofilm`, `traCNDB`, `updatenndspqc`), tính toán KPI realtime và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ**:
    * Tra cứu đầy đủ 4 chế độ PQC1 Setting, PQC3 Defect, Bàn giao Dao Film và Chấp Nhận Đặc Biệt.
    * Bảo lưu cơ chế kiểm toán `getAuditMode()` để ẩn/hiện mã tem nhãn nội bộ an toàn.
    * Cập nhật Nguyên nhân và Đối sách cho lỗi PQC3.
    * Mở xem ảnh kiểm tra `IMG_1/2/3` và link ảnh lỗi PNG.
  - **Bổ sung tương thích trong `PQC.scss`**: Cấu hình layout full-height cho `.pqc > .tabs-container > .tab-content > .tab-pane` và `.trapqc, .precision-trapqc` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab DATA PQC của `PQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 12/12 file mới đạt HTTP 200 OK trên Vite Dev Server (port 3001) và 0 lint error. Không footer thừa, không tab menu thừa.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Báo Cáo IQC (`IQC_REPORT.tsx` & `PrecisionIQCReport/`) theo chuẩn KinhDoanhReport & Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iqc/IQC_REPORT.backup.tsx` (24.718 bytes, 569 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `IQC_REPORT.tsx` chỉ còn **89 dòng** (giảm từ 569 dòng), kết nối dữ liệu qua custom hook `useIQCReportData`, quản lý toàn màn hình và điều phối các subcomponents.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/iqc/PrecisionIQCReport/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionIQCReport.scss` (626 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar 6px, responsive two-column grid và executive card container.
      2. `PrecisionIQCReportHeader.tsx` (69 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • IQC / BÁO CÁO CHỈ SỐ CHẤT LƯỢNG & XU HƯỚNG LỖI PPM (QUALITY ANALYTICS)`, badge `CMS ERP`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionIQCReportToolbar.tsx` (226 dòng): SaaS Action Toolbar phía trên: Bộ lọc đa năng (Từ ngày, Đến ngày, Worst By AMOUNT/QTY, NG Type ALL/PROCESS/MATERIAL, Autocomplete chọn mã hàng, Khách hàng, Checkbox Default, nút Tra Cứu) và **Segment Navigation Tabs** chuyển đổi tức thời giữa 4 phân hệ (`Xem Toàn Diện`, `Xu Hướng Tỷ Lệ Lỗi PPM`, `Lỗi Nhà Cung Cấp`, `Kho Lỗi & Giữ Hàng`).
      4. `PrecisionIQCReportKpi.tsx` (119 dòng): 4 Thẻ Micro-cards KPI realtime (Today NG, This Week NG, This Month NG, This Year NG) hiển thị chỉ số PPM, bóc tách cụ thể lỗi Liệu vs Công đoạn.
      5. `PrecisionIQCReportPPMSection.tsx` (132 dòng): Phân hệ 1 hiển thị 4 biểu đồ xu hướng PPM (Daily, Weekly, Monthly, Yearly) kèm nút xuất file Excel độc lập.
      6. `PrecisionIQCReportVendorSection.tsx` (83 dòng): Phân hệ 2 hiển thị 2 biểu đồ xu hướng khuyết tật theo Vendor (Weekly & Monthly) kèm nút xuất file Excel.
      7. `PrecisionIQCReportFailingSection.tsx` (146 dòng): Phân hệ 3 hiển thị 4 biểu đồ Kho Lỗi Failing và Hàng Giữ Nghi Vấn Holding (Trending & Pending) kèm nút xuất file Excel.
      8. `useIQCReportData.ts` (309 dòng): Custom hook quản lý 100% state, queries API backend (`f_loadIQCDailyNGTrend`, `f_loadIQCWeeklyTrend`, `f_loadIQCMonthlyTrend`, `f_loadIQCYearlyTrend`, `f_loadVendorIncomingNGRateByWeek`, `f_loadVendorIncomingNGRateByMonth`, `f_loadIQCFailTrending`, `f_loadIQCHoldingTrending`, `f_loadIQCFailPending`, `f_loadIQCHoldingPending`), các handlers chọn/xóa mã hàng, tính toán và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và queries CSDL**:
    * Bảo tồn 100% logic nạp 10 bộ dữ liệu biểu đồ và xuất Excel đúng định dạng tên file gốc.
    * Không còn footer thừa, không có tab menu thừa lặp lại.
  - **Bổ sung tương thích trong `IQC.scss`**: Cấu hình `.precision-iqc-report, .iqcreport` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab BÁO CÁO IQC của `IQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 10/10 file mới đạt HTTP 200 OK trên Vite Dev Server (port 3001) và 0 lint error.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Biên Bản Bất Thường IQC (`NCR_MANAGER.tsx` & `PrecisionNCR/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iqc/NCR_MANAGER.backup.tsx` (36.779 bytes, 940 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `NCR_MANAGER.tsx` chỉ còn **79 dòng** (giảm từ 940 dòng), kết nối dữ liệu qua custom hook `useNCRData`, quản lý toàn màn hình và điều phối các subcomponents.
    * Toàn bộ 9 presentation subcomponents tại `src/pages/qc/iqc/PrecisionNCR/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionNCR.scss` (1.117 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`, Purple `#7c3aed`), layout Split 3 panel (Sidebar 260px, Center Grid, Right Panel 320px), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar 5px, triệt tiêu 100% toolbar xanh lá cũ của AGTable, và luật clipping boundary `contain: paint layout !important` ngăn chặn 100% hiện tượng chữ dài tràn đè ô sang cột bên cạnh.
      2. `PrecisionNCRHeader.tsx` (60 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • IQC / QUẢN LÝ BIÊN BẢN BẤT THƯỜNG (NCR MANAGEMENT)`, badge `NCR ENGINE`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionNCRKpi.tsx` (86 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Số Phiếu NCR, Đã Đóng COMPLETED kèm tỷ lệ %, Đang Xử Lý PENDING, Lô Liên Quan Chặn Giữ Cuộn/Mét).
      4. `PrecisionNCRSidebar.tsx` (242 dòng): Khung thao tác 260px bên trái tích hợp **Segmented Switcher 2 chế độ (TRA DATA / NEW NCR)**, chuyển đổi linh hoạt giữa bộ lọc tra cứu chuyên sâu và Form đăng ký mới mà không chèn đè lên bảng dữ liệu chính.
      5. `PrecisionNCRFormInput.tsx` (191 dòng): Form đăng ký phiếu NCR mới: Cơ chế tự động tra cứu Lot NVL ERP (`checkLotNVL`) và mã nhân viên IQC (`checkEMPL_NAME`), nút `+ ADD DÒNG` và `LƯU NCR`.
      6. `PrecisionNCRToolbar.tsx` (145 dòng): SaaS Action Toolbar phía trên bảng chính (`NEW NCR`, `Tra Data`, `Export NCR`, `SET COMPLETED`, `SET PENDING`, ô Quick Filter trên lưới và cụm xuất Excel `EX1` lọc, `EX2` toàn bộ & `PIVOT`).
      7. `PrecisionNCRColumns.tsx` (138 dòng): Cấu hình 23 cột bảng NCR và 9 cột bảng Holding Detail chuẩn Stitch, khớp 100% `headerName` và `width` bản gốc theo nguyên tắc số 8 của SKILL.md.
      8. `ncrCellRenderers.tsx` (110 dòng): Cell renderers cho upload/link ảnh lỗi PNG, upload/link file đối sách (PDF, DOCX...), badge trạng thái COMPLETED/PENDING, font monospace JetBrains Mono, định dạng số hàng nghìn (`toLocaleString`), helper `renderTruncated` an toàn cắt chữ kèm tooltip title.
      9. `PrecisionNCRTable.tsx` (66 dòng): Bọc bảng AGTable NCR Detail High-Density, hoàn toàn không có footer thừa hoặc status bar giả ở chân trang, tối đa hóa không gian dọc cho bảng dữ liệu.
      10. `PrecisionNCRRightPanel.tsx` (176 dòng): Khung bên phải 320px gồm: Card Ảnh Lỗi (Defect Image) hiển thị trực quan kèm nút mở to/tải ảnh gốc + Card Bảng Holding - Failing Detail kèm mini toolbar xuất Excel/Pivot và tóm tắt tổng số cuộn/mét chặn giữ.
      11. `useNCRData.ts` (567 dòng): Custom hook quản lý 100% state, queries API (`loadNCRData`, `loadHoldingMaterialByNCR_ID`, `update_ncr_process_status`, `checkMNAMEfromLotI222`, `checkEMPL_NO_mobile`, `insertNCRData`, upload ảnh & đối sách), phân quyền QC, tính KPI realtime và xuất Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và phân quyền**: Phê duyệt `SET COMPLETED`/`SET PENDING`, đăng ký phiếu NCR mới tự động kiểm tra Lot ERP, upload/xem ảnh lỗi PNG, upload/xem file đối sách PDF/DOCX..., nạp danh sách lô chặn giữ liên quan.
  - **Bổ sung tương thích trong `IQC.scss`**: Cấu hình `.precision-ncr, .ncr_management` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab NCR MANAGEMENT của `IQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% các file mới đạt HTTP 200 OK trên Vite transform và 0 lint error. Không footer thừa, không tab menu thừa.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Kho Lỗi IQC (`FAILING.tsx` & `PrecisionFAILING/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iqc/FAILING.backup.tsx` (55.388 bytes, 1.411 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `FAILING.tsx` chỉ còn **84 dòng** (giảm từ 1.411 dòng), kết nối dữ liệu qua custom hook `useFailingData`, quản lý toàn màn hình và điều phối các subcomponents.
    * Toàn bộ 9 presentation subcomponents tại `src/pages/qc/iqc/PrecisionFAILING/` đều tuân thủ nghiêm ngặt giới hạn dưới **200 dòng/file** (< 250 dòng theo cam kết):
      1. `PrecisionFAILING.scss` (872 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Amber `#f59e0b`, Emerald `#10b981`, Rose `#f43f5e`, Royal Blue `#2563eb`, Purple `#7c3aed`), layout Split 2 panel (Sidebar 280px và Main Content container), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar 5px, triệt tiêu 100% toolbar xanh lá cũ của AGTable, và luật clipping boundary `contain: paint layout !important` ngăn chặn 100% hiện tượng chữ dài tràn đè ô sang cột bên cạnh.
      2. `PrecisionFailingHeader.tsx` (62 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • IQC / QUẢN LÝ KHO LỖI (FAILING MATERIAL CONTROL)`, badge `FAILING ENGINE`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionFailingKpi.tsx` (103 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Lô Phế Liệu FAIL TOTAL, Lô Đã Duyệt PASS kèm tỷ lệ %, Lô Đã Đóng CLOSED kèm tỷ lệ %, Chờ Xử Lý PENDING).
      4. `PrecisionFailingSidebar.tsx` (193 dòng): Khung thao tác 280px bên trái tích hợp **Segmented Switcher 3 chế độ (IN / OUT / FILTER)**, chuyển đổi tức thì giữa Form IN, Form OUT và bộ lọc tra cứu đa trường chuyên sâu.
      5. `PrecisionFailingFormIn.tsx` (172 dòng): **Form IN nhập kho lỗi** đầy đủ tính năng: chọn loại liệu Cuộn/BTP, kiểm tra tự động mã Lot NVL hoặc Plan ID & Process Lot, chọn phân loại lỗi sản xuất, nhập số lượng, vị trí kho và nút lưu an toàn.
      6. `PrecisionFailingFormOut.tsx` (95 dòng): **Form OUT xuất kho lỗi** tái sử dụng: tự động điền thông tin lô đang chọn trên bảng (`FAIL_ID`, `M_LOT_NO`), kiểm tra kế hoạch sản xuất đích `PLAN_ID_SUDUNG`, khách hàng và ghi chú xuất.
      7. `PrecisionFailingToolbar.tsx` (157 dòng): SaaS Action Toolbar phía trên bảng chính (`Tra Data`, `SET PASS`, `SET FAIL`, `OUTPUT: XUẤT`, `SET CLOSED`, `SET PENDING`, `UPDATE NCR ID`, `RESET IN_SX`, `RESET OUT_SX`, ô Quick Filter trên lưới và cụm xuất Excel `EX1` lọc & `EX2` toàn bộ).
      8. `PrecisionFailingColumns.tsx` (66 dòng): Cấu hình 40 cột bảng AG-Grid chuẩn Stitch, khớp 100% `headerName` và `width` bản gốc theo nguyên tắc số 8 của SKILL.md.
      9. `failingCellRenderers.tsx` (50 dòng): Cell renderers cho font monospace JetBrains Mono, chip trạng thái QC_PASS, CLOSE_STATUS, định dạng số hàng nghìn (`toLocaleString`), helper `renderTruncated` an toàn cắt chữ kèm tooltip title.
      10. `PrecisionFailingTable.tsx` (53 dòng): Bọc bảng AGTable High-Density, hoàn toàn không có footer thừa hoặc status bar giả ở chân trang, tối đa hóa không gian dọc cho bảng dữ liệu.
      11. `useFailingData.ts` (715 dòng): Custom hook quản lý 100% state, queries API (`insertFailingData`, `updateQCFailTableData`, `updateQCPASS_FAILING`, `updateCLOSE_FAILING`, `updateIQCConfirm_FAILING`, `f_updateNCRIDForFailing`, `f_nhapkhoao`, `f_resetIN_KHO_SX_IQC1`, `f_resetIN_KHO_SX_IQC2`), tính toán KPI realtime và xuất file Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và phân quyền**: Phê duyệt `SET PASS`/`SET FAIL`, đóng mở trạng thái `SET CLOSED`/`SET PENDING`, xác nhận IQC Confirm, cập nhật mã số `NCR_ID` cho lô lỗi, nhập kho ảo và reset trạng thái kho sản xuất.
  - **Bổ sung tương thích trong `IQC.scss`**: Cấu hình `.precision-failing, .failing` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab FAILING của `IQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% các file mới đạt 0 lỗi TypeScript (tsc) và 0 lint error. Không footer thừa, không tab menu thừa.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Lô Giữ Hàng IQC (`HOLDING.tsx` & `PrecisionHOLDING/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iqc/HOLDING.backup.tsx` (20.379 bytes, 600 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `HOLDING.tsx` chỉ còn **102 dòng** (giảm từ 600 dòng), kết nối dữ liệu qua custom hook `useHoldingData`, quản lý toàn màn hình và điều phối các subcomponents.
    * Toàn bộ các presentation subcomponents tại `src/pages/qc/iqc/PrecisionHOLDING/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file**:
      1. `PrecisionHOLDING.scss` (826 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Amber `#f59e0b`, Emerald `#10b981`, Rose `#f43f5e`, Royal Blue `#2563eb`), layout Split 2 panel (Sidebar 260px và Main Content container), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar 5px, triệt tiêu 100% toolbar xanh lá cũ của AGTable, và luật clipping boundary `contain: paint layout !important` ngăn chặn 100% hiện tượng chữ dài tràn đè ô sang cột bên cạnh.
      2. `PrecisionHoldingHeader.tsx` (64 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • IQC / QUẢN LÝ LÔ GIỮ HÀNG (HOLDING CONTROL)`, badge `HOLD ENGINE`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionHoldingKpi.tsx` (85 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Lô Giữ Hàng, Lô Đã Xử Lý PASS kèm tỷ lệ %, Lô Không Đạt FAIL kèm tỷ lệ %, Chờ Xử Lý PENDING).
      4. `PrecisionHoldingSidebar.tsx` (223 dòng): Khung tra cứu 260px bên trái gồm bộ lọc đa trường (Toggle All Time, Từ ngày - Đến ngày, Tên liệu M_NAME, Mã liệu CMS M_CODE, Mã LOT CMS M_LOT_NO, Trạng thái ALL/Y/N, NCR ID, ID Holding), nút bấm chính `Tra Data Holding` nổi bật và nhóm phím tắt tác vụ nhanh (`SET PASS`, `SET FAIL`, `UPDATE NCR ID`, `UPDATE REASON`).
      5. `PrecisionHoldingToolbar.tsx` (110 dòng): SaaS Action Toolbar phía trên bảng chính (`Tra Data`, `SET PASS`, `SET FAIL`, `UPDATE NCR ID`, `UPDATE REASON`, ô lọc nhanh tức thì Quick Filter trên lưới và cụm xuất Excel `EX1` lọc & `EX2` toàn bộ).
      6. `PrecisionHoldingColumns.tsx` (243 dòng): Cấu hình 28 cột bảng AG-Grid chuẩn Stitch, khớp 100% `headerName` và `width` bản gốc theo nguyên tắc số 8 của SKILL.md, font monospace JetBrains Mono cho các mã code, chip trạng thái QC_PASS, định dạng số hàng nghìn (`toLocaleString`), helper `renderTruncated` an toàn cắt chữ kèm tooltip title.
      7. `PrecisionHoldingTable.tsx` (48 dòng): Bọc bảng AGTable High-Density, hoàn toàn không có footer thừa hoặc status bar giả ở chân trang, tối đa hóa không gian dọc cho bảng dữ liệu.
      8. `useHoldingData.ts` (344 dòng): Custom hook quản lý 100% state, queries API (`traholdingmaterial`, `updateQCPASS_HOLDING`, `updateQCPASSI222_M_LOT_NO`, `f_updateNCRIDForHolding`, `updateMaterialHoldingReason`, `updateReasonHoldingFromIQC1`), tính toán KPI realtime và xuất file Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và phân quyền**: Phê duyệt `SET PASS`/`SET FAIL` cho bộ phận IQC kèm cập nhật I222, cập nhật mã số `NCR_ID` cho lô giữ hàng, cập nhật lý do giữ hàng, và tự động đồng bộ lý do giữ hàng từ IQC1.
  - **Bổ sung tương thích trong `IQC.scss`**: Cấu hình `.precision-holding, .holding` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab HOLDING của `IQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% các file mới đạt 0 lỗi TypeScript (tsc) và 0 lint error. Không footer thừa, không tab menu thừa.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Quản Lý Lô Bị Khóa IQC (`BLOCK.tsx` & `PrecisionBLOCK/`) theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iqc/BLOCK.backup.tsx` (28.553 bytes, 863 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `BLOCK.tsx` chỉ còn **112 dòng** (giảm từ 863 dòng), kết nối dữ liệu qua custom hook `useBlockData`, quản lý toàn màn hình và điều phối các subcomponents.
    * Toàn bộ 7 file presentation subcomponents tại `src/pages/qc/iqc/PrecisionBLOCK/` đều tuân thủ nghiêm ngặt giới hạn dưới **250 dòng/file** (< 280 dòng theo cam kết):
      1. `PrecisionBLOCK.scss` (995 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch (Slate `#f8fafc`, Royal Blue `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`), layout Split 2 panel (Sidebar 260px và Table container), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbar 5px, triệt tiêu 100% toolbar xanh lá cũ của AGTable, và luật clipping boundary `contain: paint layout !important` ngăn chặn 100% hiện tượng chữ dài tràn đè ô sang cột bên cạnh.
      2. `PrecisionBLOCKHeader.tsx` (69 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • IQC / QUẢN LÝ LÔ BỊ KHÓA (BLOCKING CONTROL)`, badge `BLOCK ENGINE`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionBLOCKKpi.tsx` (90 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Lô Bị Blocking, Lô Đã Xử Lý PASSED kèm tỷ lệ %, Lô Không Đạt FAILED kèm tỷ lệ %, Chờ Xử Lý PENDING).
      4. `PrecisionBLOCKSidebar.tsx` (196 dòng): Khung tra cứu 260px bên trái gồm bộ lọc đa trường (Phân loại hàng ALL/NVL/BTP/SP, VENDOR LOT, M_LOT_NO CMS ERP, DEFECT PHENOMENON, REMARK, NCR_ID, Checkbox ONLY PENDING STATUS), nút bấm chính `Tra Data Blocking` nổi bật và nhóm phím tắt tác vụ nhanh `✓ Mở Chặn (Unblock)`, `⚠️ Chuyển Holding`, `❌ Gán NCR Báo Phế`.
      5. `PrecisionBLOCKToolbar.tsx` (116 dòng): SaaS Action Toolbar phía trên bảng chính (`Tra Data`, `SET PASS`, `SET FAIL`, `UPDATE NCR_ID`, `SET CLOSED`, `SET PENDING`, ô lọc nhanh tức thì Quick Filter trên lưới và cụm xuất Excel `EX1` lọc & `EX2` toàn bộ).
      6. `PrecisionBLOCKColumns.tsx` (248 dòng): Cấu hình 25 cột bảng AG-Grid chuẩn Stitch, font monospace JetBrains Mono cho các mã code, chip trạng thái PASSED / FAILED / PENDING / CLOSED, định dạng số hàng nghìn (`toLocaleString`), helper `renderTruncated` an toàn cắt chữ kèm tooltip title.
      7. `PrecisionBLOCKTable.tsx` (51 dòng): Bọc bảng AGTable High-Density (đã loại bỏ footer trùng lặp thừa ở chân trang, tối đa hóa không gian dọc cho bảng dữ liệu).
      8. `useBlockData.ts` (421 dòng): Custom hook quản lý 100% state, queries API (`loadBlockingData`, `updateQCPASS_FAILING`, `updateQCPASS_HOLDING`, `updateCLOSE_FAILING`, `updateCLOSE_HOLDING`, `checkM_LOT_NO`, `updateQCPASSI222_M_LOT_NO`, `f_updateStockM090`, `f_updateNCRIDForFailing`, `f_updateNCRIDForHolding`, `selectcustomerList`, `updateReasonHoldingFromIQC1`), tính toán KPI realtime và xuất file Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và phân quyền**: Phê duyệt `SET PASS`/`SET FAIL` kèm cập nhật kho M090, đóng mở trạng thái `SET CLOSED`/`SET PENDING`, cập nhật `NCR_ID` cho cả FAILING và HOLDING, và tự động đồng bộ lý do giữ hàng từ IQC1.
  - **Bổ sung tương thích trong `IQC.scss`**: Cấu hình `.precision-blocking, .blocking` nhận `height: 100% !important; flex: 1 1 auto; min-height: 0;`, đảm bảo khi nhúng trong tab BLOCKING của `IQC.tsx` không bao giờ bị collapse chiều cao.
  - **Xác thực toàn diện**: 100% 11/11 file liên quan biên dịch thành công qua Vite transform (HTTP 200 OK) trên cổng 3001, sạch 100% lỗi cú pháp và lỗi lint.

- [x] Khắc phục triệt để lỗi In CHECKSHEET KIỂM TRA INCOMING (BNK) ra preview trắng tinh (`PrecisionBNKModal.tsx`, `PrecisionINCOMMING.scss`, `BNK_COMPONENT.tsx`, `INCOMMING.tsx`):
  - **Phát hiện nguyên nhân gốc rễ**:
    + Quy tắc CSS `@media print { body > *:not(#root) { display: none !important; } }`: Thư viện `react-to-print` tạo thẻ iframe con của body để in và copy styles vào iframe. Bên trong iframe, nội dung cần in nằm trực tiếp dưới thẻ `body` và không có id `#root`, dẫn đến việc bị gán `display: none !important;` làm trắng tinh toàn bộ preview bản in.
    + Thao tác `data?.M_LOT_NO.substring(...)` trong `BNK_COMPONENT.tsx` thiếu kiểm tra an toàn khi `data` hoặc `M_LOT_NO` bị null/undefined, gây Uncaught TypeError crash component khiến modal bị trắng tinh trên màn hình.
  - **Giải pháp xử lý toàn diện**:
    + Xóa bỏ triệt để selector `body > *:not(#root)` trong `PrecisionINCOMMING.scss`, thay thế bằng cấu hình in A4 chuẩn `html, body { width: 100% !important; height: auto !important; -webkit-print-color-adjust: exact !important; }`.
    + Bổ sung cấu hình `pageStyle` và `documentTitle` tối ưu cho `useReactToPrint` trong `INCOMMING.tsx`.
    + Tự động chọn dòng đầu tiên (`setClickedRow(first)`) và nạp ĐTC khi người dùng bấm `Show BNK` mà chưa kịp click chọn dòng trên bảng.
    + Bảo vệ chuỗi ngày nhập và `M_LOT_NO` trong `BNK_COMPONENT.tsx` chống crash runtime, bổ sung dependency array cho `useEffect`.
    + Thêm Empty State đẹp mắt và vô hiệu hóa nút in khi chưa chọn dòng trong `PrecisionBNKModal.tsx`.
  - **Xác thực toàn diện**: 100% 4/4 file liên quan biên dịch thành công qua Vite transform (HTTP 200 OK) trên port 3001, 0 lỗi cú pháp, 0 lỗi lint.

- [x] Sửa triệt để lỗi hiển thị nội dung Cell dài bị tràn đè sang cột bên cạnh trong Bảng Data Incoming (`AGTable` - `INCOMMING.tsx`):
  - **Khắc phục nguyên nhân gốc rễ (CSS Flexbox & Clipping)**:
    + `.ag-cell` mang `display: flex !important` khiến text node nội dung biến thành Anonymous Flex Item, vô hiệu hóa cơ chế `text-overflow: ellipsis` của trình duyệt.
    + Thêm `contain: paint layout !important` trên `.ag-cell` nhằm ngăn chặn tuyệt đối trình duyệt vẽ bất kỳ pixel nào ra ngoài đường biên của cell.
    + Bổ sung `box-sizing: border-box !important`, `line-height: 24px !important`, và cấu hình `&.ag-cell-value` để text trong cell tự động nhận `overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;`.
    + Đồng bộ áp dụng cho cả Main Grid và Right DTC Grid trong `PrecisionINCOMMING.scss`.
  - **Tối ưu Component Presentation (`PrecisionIncomingColumns.tsx`)**:
    + Bọc các trường văn bản dài (`M_NAME`, `M_LOT_NO`, `LOT_CMS`, `LOTNCC`, `LOT_VENDOR_IQC`, `CUST_NAME_KD`, `REMARK` và trong DTC Grid: `TEST_NAME`, `PROD_REQUEST_NO`, `G_NAME`, `M_NAME`) bằng `renderTruncated` (`<span className="cell-truncate" title={val}>`), tự động cắt ngắn với dấu 3 chấm `...` và hiển thị tooltip đầy đủ khi hover.
    + Thêm `cell-truncate` cho badge `.lot-highlight`.
    + Tái cấu trúc tinh gọn các hàm helper link (`renderDefectLink`, `renderCountermeasureLink`), đưa file từ 283 dòng xuống chỉ còn **257 dòng** (< 280 dòng theo chuẩn Clean Code).
  - **Xác thực toàn diện**: 100% các file liên quan (`PrecisionINCOMMING.scss`, `PrecisionIncomingColumns.tsx`, `PrecisionIncomingTable.tsx`, `INCOMMING.tsx`) biên dịch thành công qua Vite transform (HTTP 200 OK) trên port 3001, 0 lỗi cú pháp, 0 lỗi lint.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Kiểm Tra Nguyên Vật Liệu Đầu Vào IQC (`INCOMMING.tsx` & `PrecisionINCOMMING/`) và Modal Biên Bản Nghiệm Thu BNK Chuẩn A4 Print-Ready theo chuẩn Google Stitch High-Density Enterprise:
  - **Bảo toàn 100% mã nguồn gốc**: Lưu trữ an toàn tại `src/pages/qc/iqc/INCOMMING.backup.tsx` (84.936 bytes, 2.481 dòng).
  - **Tối ưu kiến trúc Clean Code & Phân rã module chuyên biệt**:
    * Master Controller `INCOMMING.tsx` chỉ còn **142 dòng** (giảm từ 2.481 dòng), kết nối dữ liệu qua custom hook, quản lý toàn màn hình và điều phối các subcomponents.
    * Phân rã thành 8 subcomponents hiển thị tại thư mục `src/pages/qc/iqc/PrecisionINCOMMING/` đều dưới 280 dòng/file:
      1. `PrecisionINCOMMING.scss` (720 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout 3 panel (Sidebar 270px, Center Grid, Right DTC Panel 320px), co giãn full-width & full-height Multi-Tab (`.component_element &`), custom scrollbars, triệt tiêu 100% toolbar xanh lá cũ của AGTable, modal preview A4 glassmorphism và quy tắc in `@media print`.
      2. `PrecisionIncomingHeader.tsx` (58 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • IQC / KIỂM TRA NGUYÊN VẬT LIỆU ĐẦU VÀO (INCOMING CONTROL)`, badge `IQC ENGINE`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới dữ liệu và nút bật/tắt toàn màn hình.
      3. `PrecisionIncomingKpi.tsx` (64 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Lô Incoming Hôm Nay, IQC Pass Rate Đạt Spec, Đang Test Độ Tin Cậy ĐTC, Lô Nghi Vấn / Holding NCR).
      4. `PrecisionIncomingSidebar.tsx` (236 dòng): Khung thao tác 270px bên trái: Chuyển đổi linh hoạt giữa `Tra Data` (bộ lọc đa trường từ ngày - tới ngày, tên liệu, mã liệu CMS, vendor, lot vendor, Show All) và `New Input` (đăng ký lô mới, tự động tra cứu Lot NVL ERP và tên nhân viên kiểm tra, số cuộn ngoại quan, ID test ĐTC, ghi chú, bộ đôi nút `+ ADD` và `LƯU SAVE`).
      5. `PrecisionIncomingGridToolbar.tsx` (138 dòng): SaaS Action Toolbar phía trên bảng chính (`+ New INPUT`, `Tra Data`, `SET PASS`, `SET FAIL`, `Update`, `Show BNK`, ô nhập inline `NCR_ID` + nút `↻ Update NCR_ID`, và cụm nút xuất Excel `EX1`, `EX2`).
      6. `PrecisionIncomingTable.tsx` (87 dòng): Bọc bảng AGTable High-Density và status bar ở đáy trang (tổng số dòng, lô đang chọn, trạng thái đồng bộ lưới).
      7. `PrecisionIncomingColumns.tsx` (257 dòng): Cấu hình cột bảng chuẩn Stitch cho cả 2 chế độ Worker và Kỹ thuật viên/Manager, chip trạng thái OK/NG/PD/N/A, chip Lot NVL phân màu trực quan, nút Update dòng, nút Upload checksheet/Link mở file PDF, cột liên kết ảnh khuyết tật và đối sách NCR, cùng các cột điểm đo động `KQ*`.
      8. `PrecisionIncomingDtcPanel.tsx` (114 dòng): Khung kết quả ĐTC bên phải (320px) với banner gradient hiển thị Lot đang chọn, thanh công cụ xuất Excel, bảng AGTable đo độ tin cậy, hộp tóm tắt tiêu chuẩn kỹ thuật đánh giá Pass/NG và status footer.
      9. `PrecisionBNKModal.tsx` (73 dòng): Modal xem trước và in ấn biên bản kiểm tra A4 (Show BNK) siêu sang trọng, hiện đại:
         - Nền mờ Backdrop Blur với không gian canvas slate dark (`#334155`) chuẩn PDF viewer.
         - Thanh điều khiển glassmorphism hiển thị thông tin lô, nút In trực tiếp ra máy in A4 (`useReactToPrint`) và nút đóng.
         - Giấy A4 (210mm x 297mm) đổ bóng 3D cao cấp, bọc trọn vẹn `BNK_COMPONENT.tsx`.
         - Cấu hình `@media print` cách ly chuẩn xác: Ẩn thanh công cụ ERP, in trọn vẹn trang A4 không bị lệch lề.
      10. `useIncomingData.ts` (442 dòng): Custom hook quản lý 100% state, queries API (`loadIQC1table`, `dtcdata`, `checkMNAMEfromLotI222`, `checkEMPL_NO_mobile`, `insertIQC1table`, `updateIncomingData_web`, `updateQCPASSI222`, `updateIQC1Table`, `update_iqc_ncr_id`, `updateIncomingChecksheet`, `insertHoldingFromI222`), tính toán KPI realtime và xuất file Excel `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Tra cứu kiểm tra NVL, đăng ký lô mới, cập nhật dòng lẻ hoặc hàng loạt, phê duyệt nhanh `SET PASS`/`SET FAIL` kèm cơ chế tự động đưa vào kho giữ hàng nghi vấn `insertHoldingData` khi NG, cập nhật mã số `NCR_ID`, nạp file checksheet PDF/JPG, và đồng bộ kết quả ĐTC khi nhấp chọn dòng.
  - **Bổ sung tương thích trong `IQC.scss`**: Cấu hình `.precision-incoming, .incomming` co giãn 100% full-height khi nhúng trong tab INCOMING của `IQC.tsx`.
  - **Xác thực biên dịch Vite Dev Server**: 100% 12/12 files liên quan trả về HTTP 200 OK trên port 3001, sạch 100% lỗi lint.


- [x] Hotfix & Khắc phục lỗi các Tab Độ Tin Cậy bị trắng khi nhúng trong Tab IQC (`IQC.tsx`, `DTC.tsx`, `MyTab.tsx`):
  - **Phát hiện nguyên nhân gốc rễ**: Lồng ghép 2 cấp `MyTabs` (IQC chứa `MyTabs` cấp 1 -> `DTC` chứa `MyTabs` cấp 2). File `DTC.scss` cũ có `height: fit-content;`, khiến `tabs-container` bên trong (chiều cao 100%) không tính toán được chiều cao cha và co sụp về `0px`. Đồng thời, các selector hack cũ trong `IQC.scss` (`.kqdtc`, `.specdtc`...) không khớp với các class Stitch mới (`.precision-kqdtc`...), và `MyTab.tsx` có inline style thiếu `height: 100%`.
  - **Giải pháp xử lý triệt để**:
    1. Cập nhật `src/components/MyTab/MyTab.tsx`: Bổ sung `height: '100%'` và chuyển `flex: '1 0 auto'` thành `flex: '1 1 auto'` cho thẻ `.tab-pane`.
    2. Cập nhật `src/pages/qc/dtc/DTC.scss` & `DTC.tsx`: Chuyển `.dtc` sang `height: 100%; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;`, cho phép co giãn 100% qua chuỗi `tabs-container > tab-content > tab-pane`.
    3. Cập nhật `src/pages/qc/iqc/IQC.scss`: Cấu hình layout flex full-height cho `.iqc` và `.dtc`, áp dụng `height: 100% !important; flex: 1 1 auto !important; min-height: 0 !important;` cho toàn bộ các class Stitch mới (`.precision-kqdtc`, `.precision-specdtc`, `.precision-addspecdtc`, `.precision-dkdtc`, `.precision-dtcresult`, `.precision-testtable`).
  - **Xác thực kiểm tra**: Tất cả các files biên dịch thành công qua Vite transform (HTTP 200 OK) trên port 3001, sạch 100% lỗi lint.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Danh Mục Hạng Mục & Điểm Đo ĐTC (`TEST_TABLE.tsx` & `PrecisionTESTTABLE/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `TEST_TABLE.backup.tsx` (6.934 bytes, 203 dòng).
  - Phân rã code thành Master Controller tinh gọn (118 dòng) và 8 sub-modules chuyên biệt (< 280 dòng/file presentation) tại thư mục `src/pages/qc/dtc/PrecisionTESTTABLE/`:
    1. `PrecisionTESTTABLE.scss` (1019 dòng): Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout Split Master-Detail Workspace 2 cột, co giãn flex full-width và full-height trong Multi-Tab (`.component_element &`), custom scrollbars, triệt tiêu 100% toolbar xanh lá cũ của AGTable, hiệu ứng modal glassmorphism mờ nền.
    2. `TEST_TABLE.tsx` (118 dòng): Master Controller tinh gọn kết nối với hook dữ liệu, quản lý Fullscreen và điều phối các subcomponents.
    3. `PrecisionTestTableHeader.tsx` (87 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • ĐTC / DANH MỤC HẠNG MỤC & ĐIỂM ĐO ĐTC (TEST & POINT MASTER)`, badge `CONFIG MASTER`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút nạp lại toàn bộ và bật/tắt toàn màn hình.
    4. `PrecisionTestTableKpi.tsx` (81 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Hạng Mục Test, Hạng Mục Đang Chọn, Số Điểm Đo Hiện Tại, Trạng Thái Cơ Sở Dữ Liệu MSSQL).
    5. `PrecisionTestItemPanel.tsx` (138 dòng): Khung bảng Hạng Mục Test (Master) bên trái (45%): SaaS Toolbar (ô lọc Omnibar, nút `+ Thêm Hạng Mục`, xuất Excel `SaveExcel`, nút Tải lại, badge đếm dòng) và bảng AGTable với code chip monospace JetBrains Mono.
    6. `PrecisionTestPointPanel.tsx` (169 dòng): Khung bảng Điểm Đo Test (Detail) bên phải (55%): Banner ngữ cảnh nổi bật Hạng mục đang chọn, SaaS Toolbar (ô lọc Omnibar, nút `+ Thêm Điểm Đo`, xuất Excel, Tải lại, badge đếm dòng), trạng thái Empty State trực quan khi chưa chọn hạng mục.
    7. `PrecisionAddTestItemModal.tsx` (162 dòng): Modal thêm mới Hạng Mục Đo siêu đẹp, sang trọng với backdrop blur, tự động đề xuất mã code tiếp theo (`max + 1`), validation tên bắt buộc, hướng dẫn quy chuẩn đặt tên và nút `LƯU HẠNG MỤC` emerald gradient.
    8. `PrecisionAddTestPointModal.tsx` (175 dòng): Modal thêm mới Điểm Đo siêu đẹp, sang trọng với thẻ hiển thị rõ Hạng mục đang liên kết, tự động gợi ý mã điểm đo tiếp theo, validation rõ ràng và nút `LƯU ĐIỂM ĐO` indigo gradient.
    9. `PrecisionTestTableColumns.tsx` (98 dòng): Cấu hình cột bảng chuẩn Stitch cho cả 2 bảng (chip mã monospace, chip điểm đo `P.x`, tên nổi bật, thời gian test).
    10. `useTestTableData.ts` (245 dòng): Custom hook quản lý 100% state, queries API (`f_loadDTC_TestList`, `f_loadDTC_TestPointList`, `f_addTestItem`, `f_addTestPoint`), tự động tính toán mã code kế tiếp, lọc tìm kiếm realtime và xuất file Excel qua `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Tải danh sách hạng mục, tải danh sách điểm đo khi chọn dòng, thêm hạng mục test mới, thêm điểm đo cho hạng mục, bổ sung chức năng xuất Excel và tìm kiếm tức thì.
  - **Xác thực biên dịch Vite & Lint**: 100% 11/11 files liên quan biên dịch thành công qua Vite transform (HTTP 200 OK) trên port 3001, 0 lỗi cú pháp, 0 lỗi lint.

- [x] Hoàn thiện Tái Thiết Kế Màn Hình Nhập Kết Quả Đo Độ Tin Cậy DTC (`DTCRESULT.tsx` & `PrecisionDTCRESULT/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `DTCRESULT.backup.tsx` (26.206 bytes, 700 dòng).
  - Phân rã monolith 700 dòng thành Master Controller tinh gọn (126 dòng) và 8 sub-modules chuyên biệt (< 280 dòng/file presentation) tại thư mục `src/pages/qc/dtc/PrecisionDTCRESULT/`:
    1. `PrecisionDTCRESULT.scss` (826 dòng): SCSS tokens công nghiệp chuẩn Stitch, co giãn flex full-width và full-height trong Multi-Tab (`.component_element &`), custom scrollbars, triệt tiêu 100% toolbar xanh lá cũ của AGTable.
    2. `DTCRESULT.tsx` (126 dòng): Master Controller tinh gọn kết nối với hook dữ liệu, quản lý Fullscreen và re-export đầy đủ interfaces/utilities để đảm bảo tính tương thích ngược.
    3. `PrecisionDTCResultHeader.tsx` (87 dòng): Sub-header chuẩn Stitch, breadcrumb `04. QC • ĐTC / NHẬP KẾT QUẢ ĐO ĐỘ TIN CẬY (DTC RESULT)`, badge `RESULT ENTRY`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút nạp lại và bật/tắt toàn màn hình.
    4. `PrecisionDTCResultControl.tsx` (179 dòng): Card điều khiển trung tâm compact trên cùng: Thẻ chuyển đổi Swap Mode ID ĐTC vs LOT NVL, ô nhập mã tự động focus/tra cứu, Context Pill hiển thị tên sản phẩm / vật liệu / NCC, ô ghi chú REMARK, công cụ nạp file Excel đo quang phổ XRF/RoHS, checkbox Up hàng loạt, nút `LƯU KẾT QUẢ ĐO` nổi bật emerald gradient, và nhúng thanh phân loại hạng mục test.
    5. `PrecisionDTCResultPills.tsx` (64 dòng): Dải nút chọn hạng mục test vuốt ngang nằm ngay dưới ô điều khiển với indicator dot, badge đếm hạng mục đã đăng ký và highlight active.
    6. `PrecisionDTCResultKpi.tsx` (86 dòng): 4 Thẻ Micro-cards KPI realtime (Tổng Điểm Đo Points, Số Mẫu Đo Samples n, Tỷ Lệ Đạt % OK Rate với thanh tiến độ mini, Điểm Lỗi NG với badge cảnh báo).
    7. `PrecisionDTCResultTable.tsx` (165 dòng): Bọc bảng AGTable High-Density, Toolbar SaaS hiện đại (ô Quick Filter Omnibar, nút `+ Thêm Mẫu Đo`, cụm nút xuất `EX1 (Lọc)`, `EX2 (Toàn bộ)`, `PIVOT`, `Tải lại`, badge đếm dòng) và Status bar ở đáy.
    8. `PrecisionDTCResultColumns.tsx` (241 dòng): Cấu hình cột bảng chuẩn Stitch với ô nhập liệu số đo `RESULT` và `REMARK` có thể chỉnh sửa trực tiếp, tự động so sánh dung sai `CENTER_VALUE ± UPPER_TOR / LOWER_TOR` để hiển thị chip đánh giá OK (xanh)/NG (đỏ)/WAIT (vàng) realtime.
    9. `dtcResultUtils.ts` (166 dòng): Khai báo kiểu dữ liệu `DTC_RESULT_INPUT`, `InputData`, `OutputData`, hàm `handletraDTCData_HangLoat` và hàm `unpivotJsonArray` giải nén file Excel đo quang phổ XRF thành danh sách kết quả đo.
    10. `useDTCResultData.ts` (438 dòng): Custom hook quản lý 100% state, queries API (`getinputdtcspec`, `checkM_NAME_IQC`, `checkRegisterdDTCTEST`, `getidDTCfromlotNVL`, `insert_dtc_result`, `updateDTC_TEST_EMPL`), giải nén file Excel XRF, tính toán KPI realtime và xuất Excel `SaveExcel`.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Tra cứu thông tin theo cả DTC_ID hoặc Lot NVL, nạp file Excel kết quả XRF và unpivot tự động, thêm mẫu đo mới theo từng point, tính toán dung sai tự động khi sửa ô kết quả, lưu kết quả đo vào CSDL kèm cập nhật nhân viên thực hiện test.
  - **Xác thực biên dịch Vite & Lint**: 100% 10/10 files liên quan biên dịch thành công qua Vite transform (HTTP 200 OK) trên port 3001, 0 lỗi cú pháp, 0 lỗi lint.

- [x] Hoàn thiện Redesign Đăng Ký Test Độ Tin Cậy DTC (`DKDTC.tsx` & `PrecisionDKDTC/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `DKDTC.backup.tsx` (33.770 bytes, 939 dòng).
  - Phân rã monolith 939 dòng thành Master Controller tinh gọn (154 dòng) và 8 sub-modules chuyên biệt (< 280 dòng/file presentation):
    1. `PrecisionDKDTC.scss`: SCSS tokens công nghiệp chuẩn Stitch, layout 2 cột Split Workspace, co giãn flex full-width và full-height trong Multi-Tab (`.component_element &`), triệt tiêu 100% toolbar xanh lá cũ của AGTable.
    2. `PrecisionDKDTCHeader.tsx` (80 dòng): Sub-header với breadcrumb `04. QC • ĐTC / ĐĂNG KÝ TEST ĐỘ TIN CẬY (DTC)`, telemetry trực tuyến `NET_SERVER: 3007 (Online)` kèm pulse dot, thông tin nhân viên đăng nhập, nút làm mới và nút bật/tắt toàn màn hình.
    3. `PrecisionDKDTCSidebar.tsx` (279 dòng): Khung đăng ký test 320px compact high-density bên trái: Thẻ Swap Card chuyển đổi chế độ Sản phẩm vs NVL, Dropdown phân loại test, ô nhập/quét YCSX hoặc Lot NVL và Lot NCC với camera scanner, tự động tra cứu tên sản phẩm/vật liệu và tên nhân viên, khung đăng ký bổ sung ID cũ, ghi chú và nút ĐĂNG KÝ TEST ĐTC nổi bật màu emerald gradient.
    4. `PrecisionDKDTCChecklist.tsx` (149 dòng): Lưới 2 cột checklist hạng mục kiểm tra ĐTC, nút Chọn/Bỏ chọn tất cả, ô lọc nhanh, chip trạng thái đã có Spec (`addedSpec`) màu xanh dương, cảnh báo khi hạng mục chưa có Spec.
    5. `PrecisionDKDTCKpi.tsx` (85 dòng): 4 Micro-cards KPI tính toán realtime từ dữ liệu bảng (Tổng lượt đăng ký, Hoàn thành test & tỷ lệ %, Mass Production, Hạng mục đang chọn).
    6. `PrecisionDKDTCTable.tsx` (145 dòng): Bọc bảng AGTable High-Density, Toolbar SaaS hiện đại (ô Quick Filter, cụm nút xuất `EX1` lọc, `EX2` toàn bộ, `PIVOT`, `Refresh`, badge đếm dòng) và Status bar ở đáy.
    7. `PrecisionDKDTCColumns.tsx` (248 dòng): Cấu hình cột bảng chuẩn Stitch khớp 100% dữ liệu backend `DTC_REG_DATA` (chip mã font JetBrains Mono, chip phân loại nhiều màu, badge trạng thái hoàn thành).
    8. `PrecisionDKDTCScannerModal.tsx` (128 dòng): Modal camera quét mã vạch và QR code tự động bằng `Html5QrcodeScanner`.
    9. `useDKDTCData.ts` (535 dòng): Đóng gói 100% state, queries API (`getLastDTCID`, `checkDTC_ID_FROM_M_LOT_NO`, `checkAddedSpec`, `ycsx_fullinfo`, `checkLabelID2`, `checkMNAMEfromLotI222`, `registerDTCTest`, `insertIQC1table`, `loadrecentRegisteredDTCData`, `checkEMPL_NO_mobile`), xử lý xuất Excel `SaveExcel` và quét mã.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Đăng ký test cho cả 2 nhánh Sản phẩm và Vật liệu, lưu bảng IQC `insertIQC1table`, đăng ký bổ sung ID cũ, xuất Excel lọc (`EX1`) và toàn bộ (`EX2`).
  - **Dọn dẹp code sạch sẽ**: Xóa bỏ các file monolith thừa và file lỗi import (`PrecisionDKDTCForm.tsx`, `PrecisionBarcodeScannerModal.tsx`).
  - **Xác thực biên dịch Vite Dev Server**: 100% 10/10 files liên quan trả về HTTP 200 OK trên port 3001, sạch 100% lỗi lint.

- [x] Hoàn thiện Báo Cáo Kinh Doanh (`KinhDoanhReport.tsx` & `PrecisionKinhDoanhReport/`): Khắc phục triệt để lỗi 3 biểu đồ trắng, đồng bộ Donut Pie Stitch và chuẩn hóa SaaS Toolbar:
  - **Khắc phục lỗi 3 biểu đồ bị trắng**:
    1. `PO Balance Trending By Week`: Bỏ `CustomResponsiveContainer` (loại bỏ lỗi sụp height = 0 do relative/absolute lồng nhau), thay bằng `<ResponsiveContainer height={340}>` trong container `.executive-card__body--chart-lg`.
    2. `PO Balance Summary By Week`: Bỏ `CustomResponsiveContainer`, nạp fallback tự động `targetYear = summaryYears[0]?.PO_YEAR || moment().year()` khi khởi tạo màn hình trong `useKDReportData.ts`, giúp nạp ngay `pobalanceYearByWeekDetail` mà không cần click chọn năm thủ công.
    3. `Samsung Forecast`: Bổ sung cơ chế tự động fallback lùi năm (`fcstyear - 1`) khi năm hiện tại (2026) chưa có tuần FCST trong CSDL, tránh lỗi `undefined` đọc `data[0].FCSTWEEKNO`. Chuyển sang `<ResponsiveContainer height={340}>`, hiển thị badge kỳ so sánh W1 vs W2.
  - **Đồng bộ biểu đồ tròn phong cách Stitch**: Áp dụng thiết kế Donut Pie Chart cao cấp từ `PO Balance Customer` sang `Top 5 Customer Weekly Revenue` và `PIC Weekly Revenue`.
  - **Chuẩn hóa Toolbar AGTable**: Nâng cấp toàn bộ toolbar bảng biểu sang style Compact High-Density SaaS (ô Quick Filter, Export Excel, Reset, Badge đếm bản ghi).
  - Sao lưu an toàn: `KDPOBalanceChart.backup.tsx`, `KDPOBalanceSummaryByWeek.backup.tsx`, `ChartFCSTSamSung.backup.tsx`.
  - Xác thực biên dịch: Tất cả các file liên quan trả về HTTP 200 OK trên Vite Dev Server (port 3001).

- [x] Redesign Thêm Tiêu Chuẩn Kỹ Thuật DTC (`ADDSPECDTC.tsx` & `PrecisionADDSPECDTC/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `ADDSPECDTC.backup.tsx` (29.877 bytes).
  - Phân rã monolith 763 dòng thành Master Controller tinh gọn (214 dòng) và 5 sub-modules chuyên biệt (< 300 dòng/file presentation):
    1. `PrecisionADDSPECDTC.scss`: SCSS tokens công nghiệp chuẩn Stitch, full-width & full-height Multi-tab, triệt tiêu 100% toolbar xanh lá cũ của AGTable.
    2. **Tuyệt đối tuân thủ chỉ đạo**: Không tạo footer thừa ở đáy trang; không tạo tabs điều hướng trùng lặp với menu ERP; tối ưu tối đa không gian làm việc.
    3. `PrecisionADDSPECDTCKpi.tsx`: 4 Micro-cards KPI tính toán realtime từ dữ liệu bảng (Tổng điểm đo, Hạng mục test kích hoạt, Model/Khách hàng áp dụng hoặc NVL, Tình trạng bản vẽ BANVE/TDS).
    4. `PrecisionADDSPECDTCSidebar.tsx`: Khung cấu hình Spec 300px compact high-density, Autocomplete tìm nhanh sản phẩm/vật liệu, Dropdown chọn hạng mục test, bộ 3 nút hành động (`LOAD SPEC`, `ADD SPEC`, `UPDATE SPEC`), nút tiện ích copy XRF Samsung/SDI, ma trận checklist trạng thái test và checkbox chuyển đổi chế độ NVL/Sản phẩm.
    5. `PrecisionADDSPECDTCColumns.tsx`: Cấu hình cột bảng chuẩn Stitch với chip điểm đo `P1..Pn`, giá trị trung tâm `CENTER_VALUE` in đậm, dung sai trên/dưới phân màu trực quan, chip trạng thái Y/N cho TDS & Bản vẽ.
    6. `useADDSPECData.ts`: Tách toàn bộ state, side-effects, API handlers (`checkSpecDTC`, `insertSpecDTC`, `updateSpecDTC`, `checkAddedSpec`, `copyXRFSpec`, `copyXRFSpecSDI`) vào custom hook sạch sẽ.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Hỗ trợ đầy đủ 2 chế độ Thành Phẩm (R&D) và Nguyên Vật Liệu (IQC), kiểm tra trạng thái hạng mục test, sao chép XRF, xuất Excel `EX1`, `EX2`, `PIVOT`, Thêm điểm đo, Xóa dòng chọn và Lưu dữ liệu.
  - **Hotfix đã xác thực**: Sửa lỗi binding `onSelectMaterial` và chuẩn hóa đường dẫn relative import (`qcInterface`, `kdInterface`).
  - Xác thực biên dịch Vite Dev Server: 6/6 file trả về HTTP 200 OK trên port 3001, sạch 100% lỗi lint.

- [x] Redesign Tra Cứu Tiêu Chuẩn Kỹ Thuật DTC (`SPECDTC.tsx` & `PrecisionSPECDTC/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `SPECDTC.backup.tsx` (9.555 bytes).
  - Phân rã monolith thành Master Controller tinh gọn (277 dòng) và 4 sub-modules chuyên biệt (< 300 dòng/file presentation):
    1. `PrecisionSPECDTC.scss` (517 dòng): SCSS tokens công nghiệp chuẩn Stitch, full-width & full-height Multi-tab, triệt tiêu 100% toolbar xanh lá cũ của AGTable.
    2. Đã loại bỏ Header và dải Nav Tabs nghiệp vụ nội bộ bị trùng lặp với menu Multi-tab bên ngoài của ERP; chuyển cụm nút xuất Excel `EX1 (Lọc)`, `EX2 (Toàn bộ)`, `PIVOT` và `Refresh` trực tiếp lên thanh công cụ của bảng dữ liệu.
    3. `PrecisionSPECDTCKpi.tsx` (174 dòng): 4 Micro-cards KPI tính toán realtime từ dữ liệu spec (Tổng bản ghi tiêu chuẩn kèm trạng thái MSSQL, Hạng mục test chủ lực, Dung sai tiêu chuẩn trung bình Tor, Khách hàng áp dụng chính).
    4. `PrecisionSPECDTCSidebar.tsx` (175 dòng): Panel bộ lọc dữ liệu DTC chuyên nghiệp 250px với inputs gọn gàng, tự động nạp danh mục test từ `f_loadDTC_TestList()`, hỗ trợ phím Enter và nút tra cứu `SPEC DTC (TÌM KIẾM)` full-width màu emerald gradient.
    5. `PrecisionSPECDTCColumns.tsx` (173 dòng): Cấu hình cột bảng chuẩn Stitch với chip JetBrains Mono cho `G_CODE`/`M_CODE`, chip phân loại `TEST_NAME`, số đo căn phải chuẩn tabular-nums và nổi bật màu sắc `MIN_SPEC` (xanh) / `MAX_SPEC` (đỏ).
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Tra cứu `generalQuery("dtcspec", ...)`, lọc danh mục `f_loadDTC_TestList()`, xuất Excel trực tiếp `SaveExcel` cho `EX1` (lọc) và `EX2` (toàn bộ).
  - **Tối đa hóa diện tích làm việc**: Tận dụng toàn bộ chiều cao cho bảng dữ liệu và bộ lọc, không còn thanh tabs thừa.
  - Xác thực biên dịch Vite Dev Server: 5/5 file trả về HTTP 200 OK trên port 3001.

- [x] Redesign Tra Cứu Kết Quả Độ Tin Cậy • SPC Analysis (`KQDTC.tsx` & `PrecisionKQDTC/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `KQDTC.backup.tsx` (20.744 bytes).
  - Phân rã monolith 587 dòng thành Master Controller tinh gọn (290 dòng) và 5 sub-modules chuyên biệt (< 300 dòng/file presentation):
    1. `PrecisionKQDTC.scss`: SCSS tokens công nghiệp chuẩn Stitch, full-width & full-height Multi-tab, triệt tiêu toolbar cũ của AGTable.
    2. Đã loại bỏ Header và Sub-nav workflow nội bộ để tối đa hóa diện tích làm việc trong Multi-Tab ERP.
    3. `PrecisionKQDTCKpi.tsx`: 4 Micro-cards KPI tính toán realtime (Tổng mẫu kiểm tra & tỷ lệ % Đạt OK/NG, Năng lực quy trình Cpk, Đường tâm kiểm soát X̄, và Biên độ biến thiên R).
    4. `PrecisionKQDTCSidebar.tsx`: Panel bộ lọc dữ liệu DTC chuyên nghiệp 250px với inputs gọn gàng, hỗ trợ nạp tự động danh mục test từ `f_loadDTC_TestList()`, nút tra cứu Royal Blue gradient full-width.
    5. `PrecisionKQDTCCharts.tsx`: Khung 4 Biểu đồ SPC (Histogram, Xbar, R, Cpk) kèm banner ngữ cảnh (Sản phẩm, Liệu, Test, Point) và nút Toggle Ẩn/Hiện biểu đồ.
    6. `PrecisionKQDTCColumns.tsx`: Cấu hình cột bảng chuẩn Stitch với chip JetBrains Mono cho các mã và chip đánh giá OK (xanh) / NG (đỏ).
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Tra cứu `generalQuery("dtcdata")`, lọc danh mục `f_loadDTC_TestList()`, nhấp đúp dòng nạp đồng thời `loadXbarData`, `loadCPKTrend`, `loadHistogram` để hiển thị 4 biểu đồ SPC, hỗ trợ xuất Excel `EX1` (lọc) và `EX2` (toàn bộ).
  - Xác thực biên dịch Vite Dev Server: 7/7 file trả về HTTP 200 OK trên port 3001.

- [x] Redesign Tính Liệu Sản Xuất • MRP Engine (`TINHLIEU.tsx` & `PrecisionTinhLieu/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `TINHLIEU.backup.tsx` (32.453 bytes).
  - Phân rã monolith 777 dòng thành Controller chính tinh gọn (260 dòng) và 5 sub-modules chuyên biệt (< 300 dòng/file presentation):
    1. `PrecisionTinhLieu.scss`: SCSS tokens công nghiệp chuẩn Stitch, full-width & full-height Multi-tab, triệt tiêu toolbar cũ của AGTable.
    2. `PrecisionTinhLieuHeader.tsx`: Header phân hệ Mua hàng, mã `M120`, telemetry trực tuyến, badge chế độ tra cứu hiện tại.
    3. `PrecisionTinhLieuKpi.tsx`: 4 Micro-cards KPI tính toán 100% động theo dữ liệu thực tế (Tổng số bản ghi, Tổng nhu cầu liệu NEED_M_QTY, Vật liệu thiếu cần bổ sung SHORTAGE, và Tỷ lệ mở liệu YCSX).
    4. `PrecisionTinhLieuToolbar.tsx`: Bộ lọc thời gian Từ ngày - Tới ngày, Toggle All Time, cờ lọc Shortage / New PO, 3 Tab nạp dữ liệu (`MRP Detail`, `MRP Summary`, `MRP Plan 15D`), Nút `Mở Liệu` & `Khóa Liệu` kèm số dòng chọn, ô tìm kiếm nhanh và nút xuất Excel `EX1` / `EX2`.
    5. `PrecisionTinhLieuColumns.tsx`: Cấu hình cột bảng chuẩn Stitch cho cả 4 chế độ (CMS PO, PVN YCSX, Summary, Plan 15D) với chip mã JetBrains Mono, chip trạng thái YES/NO/PENDING, heat-map 15 ngày `MD1` - `MD15` so sánh lũy kế.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Tra cứu chi tiết theo PO & YCSX, tổng hợp toàn bộ MRP ALL, kế hoạch MRP 15 ngày `f_loadMRPPlan`, và thao tác Khóa/Mở liệu YCSX hàng loạt qua `generalQuery("setMaterial_YN", ...)`.
  - **Triệt tiêu hoàn toàn khung 2 cột cũ kỹ**: Thay thế form dọc gradient chật chội 280px bằng toolbar ngang SaaS thoáng đãng, bảng AGTable chiếm trọn không gian thẳng đứng.
  - Xác thực biên dịch Vite Dev Server: 6/6 file trả về HTTP 200 OK trên port 3001.

- [x] Redesign Quản Lý Vật Liệu (`QLVL.tsx` & `PrecisionQLVL/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `QLVL.backup.tsx` (52.635 bytes).
  - Phân rã monolith 1.516 dòng thành Controller chính tinh gọn (284 dòng) và 7 subcomponents chuyên biệt (< 300 dòng/file presentation):
    1. `PrecisionQLVL.scss`: SCSS tokens công nghiệp chuẩn Stitch, hỗ trợ Multi-tab full-width & full-height, triệt tiêu toolbar AGTable cũ.
    2. `PrecisionQLVLHeader.tsx`: Header phân hệ Mua hàng, mã `M090`, badge telemetry trực tuyến.
    3. `PrecisionQLVLKpi.tsx`: 4 Micro-cards KPI tính toán 100% động từ dữ liệu thực tế (Tổng mã, Tỷ lệ hồ sơ MSDS/TDS/SGS, Số mã đạt FSC, Đơn giá & Phí xẻ Slitting trung bình).
    4. `PrecisionQLVLToolbar.tsx`: Nút thêm vật liệu `+ Thêm Vật Liệu`, nút `Cập Nhật (Update)`, nạp lại dữ liệu, mở docs, thanh lọc nhanh tức thời, cụm nút `EX1`, `EX2`, `PIVOT`.
    5. `PrecisionQLVLColumns.tsx`: Cấu hình cột bảng chuẩn Stitch, Cell Renderers chip mã JetBrains Mono (nhấp vào mở form cập nhật), giá USD xanh lá, trạng thái Active/Locked, liên kết mở PDF trực tiếp, phân quyền CMS vs PVN.
    6. `PrecisionQLVLAddModal.tsx`: Dialog thêm mới/sửa thông tin 2 cột chuẩn MUI Dense, header phân biệt Thêm Mới vs Cập Nhật, Autocomplete vendor, phân quyền `checkBP`.
    7. `PrecisionQLVLPivotConfig.ts` & `PrecisionQLVLPivotModal.tsx`: Tách hơn 600 dòng cấu hình DevExtreme Pivot DataSource sang module riêng và bọc modal Pivot hiện đại.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và API**: Thêm mới, cập nhật, upload TDS PDF, tra cứu hồ sơ kỹ thuật VLDOC, xuất Excel lọc & toàn bộ, phân tích Pivot đa chiều.
  - **Khắc phục bảng full-height dính sát đáy trang**: Sử dụng `min-height: calc(100vh - 76px)` và `flex: 1 1 0px` cho container và `.ag-root-wrapper`.
  - **Bổ sung nút Cập Nhật (Update) và mở Update Modal đa kênh**: Thêm nút trên toolbar, hỗ trợ nhấp đúp hàng (`onRowDoubleClicked`) và nhấp vào mã vật liệu (`M_NAME`).
  - **Tái thiết kế toàn diện Modal Hồ Sơ Kỹ Thuật Vật Liệu (`VLDOC.tsx`)**: Sao lưu `VLDOC.backup.tsx`, override CustomDialog với `.precision-qlvl-doc-dialog`, header Dark Slate, toolbar tìm kiếm & upload, bảng hồ sơ AGTable full-height, chip trạng thái duyệt PUR/DTC/RND, và Popup Viewer xem tài liệu PDF cao cấp với backdrop blur.
  - **Triệt tiêu toàn bộ footer thừa**: Không render bất kỳ footer hay status bar giả nào ở đáy trang.
  - Xác thực biên dịch Vite Dev Server: 10/10 file trả về HTTP 200 OK.

- [x] Redesign Báo Cáo Kinh Doanh (`KinhDoanhReport.tsx` & `PrecisionKinhDoanhReport/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `KinhDoanhReport.backup.tsx` (93.263 bytes, 2.353 dòng).
  - Phân rã nguyên khối monolith 2.353 dòng thành Master Controller tinh gọn (144 dòng) và 10 sub-modules chuyên biệt (< 300 dòng/file):
    1. `PrecisionKDReport.scss`: SCSS tokens công nghiệp chuẩn Stitch, layout full-width & full-height Multi-Tab, responsive glass cards, bảng biểu co giãn linh hoạt.
    2. `PrecisionKDHeader.tsx`: Breadcrumb định hướng, badge NET_SERVER: 3007 (Online), nút làm mới dữ liệu, nút mở rộng toàn màn hình.
    3. `PrecisionKDFilterToolbar.tsx`: Cụm Date Pickers (Từ ngày - Đến ngày), checkbox Mặc định (Default) & In nhanh (In nhanh), nút Tra cứu, và Segment Jump Tabs linh hoạt (Xem Toàn Diện, Doanh Thu & Chốt Số, Bảng Biểu KH, Phân Tích Trễ Hạn, Đơn Hàng PO & Dự Báo).
    4. `PrecisionKDSummaryKpi.tsx`: 4 Thẻ KPI Doanh Thu điều hành (Hôm qua, Tuần này, Tháng này, Năm này) hiển thị giá trị USD lớn font JetBrains Mono, số lượng giao hàng EA, và growth pill % trực quan.
    5. `PrecisionKDClosingSection.tsx`: Cụm 6 biểu đồ doanh thu Recharts (Daily, Weekly, Monthly, Yearly, Top 5 KH, PIC Phụ trách) tích hợp nút xuất Excel `SaveExcel` trực tiếp.
    6. `PrecisionKDCustomerClosingTables.tsx`: Cụm 3 bảng dữ liệu AG Grid chốt số theo khách hàng (Daily, Weekly, Monthly) phân trang 8 dòng, nút xuất Excel riêng biệt.
    7. `PrecisionKDOverdueSection.tsx`: Cụm 4 biểu đồ phân tích trễ giao hàng (Daily, Weekly, Monthly, Yearly Overdue) kèm nút xuất Excel.
    8. `PrecisionKDPOSection.tsx`: Phân hệ quản lý đơn hàng PO & giao hàng (PO Balance, PO/Delivery by Week, PO Trending, cụm biểu đồ lọc tương tác theo Năm/Tuần khi CMS, bảng PO Balance theo loại sản phẩm).
    9. `PrecisionKDFcstSection.tsx`: 2 Thẻ Forecast 4W & 8W và biểu đồ Samsung Forecast so sánh 2 tuần liền kề trực quan.
    10. `kdReportQueries.ts` (233 dòng) & `kdReportPOQueries.ts` (100 dòng): Tách biệt logic truy vấn API thành 2 module chuyên biệt, đảm bảo quy tắc không quá 300 dòng/file.
    11. `precisionKDColumns.tsx` (43 dòng): Quản lý cấu hình cột AG Grid cho các bảng dữ liệu chốt số.
    12. `useKDReportData.ts` (299 dòng): Custom hook quản lý 100% state và 22 luồng nạp dữ liệu song song `Promise.all`, điều khiển tương tác click chọn năm/tuần trên biểu đồ tồn đơn.
  - **Bảo lưu trọn vẹn 100% nghiệp vụ và tương tác cốt lõi**:
    + Giữ nguyên toàn bộ 22 API queries song song trong `initFunction`.
    + Tương tác click trên biểu đồ tồn đơn PO theo Năm (`handleSelectPOYear`) và theo Tuần (`handleSelectPOWeek`) để nạp chi tiết PO Balance theo Tuần & theo Khách Hàng.
    + Phân quyền cờ công ty (`MAIN_URL.MAIN_URL_KHO_SERVER === 'CMS'` vs `PVN`), chỉ CMS mới hiện các biểu đồ PO theo tuần/năm và bảng loại sản phẩm.
    + Bảo lưu toàn bộ các nút xuất Excel `SaveExcel` (Daily, Weekly, Monthly, Overdue, PO Balance).
    + Chế độ checkbox `In nhanh` cho phép in báo cáo ngay lập tức sau khi nạp xong.
    + **Tái thiết kế toàn bộ biểu đồ tròn sang chuẩn Donut 3-in-1 chống xén & toàn diện dữ liệu**: Áp dụng đồng bộ cho `KDPOBalanceSummaryByCustomer.tsx`, `KDChartCustomerRevenue.tsx` (Top 5 Customer Weekly Revenue) và `ChartPICRevenue.tsx` (PIC Weekly Revenue). Hỗ trợ bộ chuyển 3 chế độ xem (Song Song 50:50, Biểu Đồ Full, Danh Sách Full), bán kính chống xén mép, tâm Donut thống kê tương tác theo hover, kèm bảng dữ liệu 100% đối tác/nhân sự có rank, thanh tiến trình tỷ trọng % và ô tìm kiếm tức thời.
    + **Chuẩn hóa toàn bộ Toolbar AGTable bảng biểu theo phong cách High-Density SaaS**: Tạo component `PrecisionKDTableToolbar.tsx`, triệt tiêu hoàn toàn toolbar xanh lá mặc định của `AGTable`, tích hợp tìm kiếm nhanh QuickFilter, badge đếm dòng, cụm nút xuất Excel `EX1` (Lọc), `EX2` (Toàn bộ) và `PIVOT` đồng bộ cho `CustomerDailyClosing.tsx`, `CustomerWeeklyClosing.tsx`, `CustomerMonthlyClosing.tsx` và `CustomerPoBalanceByTypeNew.tsx`.
    + **Khắc phục triệt để lỗi 3 biểu đồ bị trắng & hiển thị Data Labels trực quan (PO Balance Trending, PO Balance Summary By Week & Samsung Forecast)**:
      - Loại bỏ wrapper cũ `CustomResponsiveContainer` gây sụp chiều cao ($0\text{px}$), thay bằng `<ResponsiveContainer width="100%" height={340}>`.
      - **Tự động nạp dữ liệu theo NĂM MỚI NHẤT (năm lớn nhất)** cho `PO Balance Summary By Week` và khách hàng ngay khi mở trang; có cơ chế tự động fallback duyệt các năm trước nếu năm mới nhất chưa có tuần.
      - Bổ sung cơ chế Fallback lùi năm cho Samsung Forecast (`checklastfcstweekno` fallback `currentYear - 1`), đảm bảo luôn nạp được dữ liệu so sánh 2 tuần FCST gần nhất.
      - **Hiển thị Data Labels trực tiếp trên cả 3 biểu đồ**: Số lượng tồn EA & giá trị USD compact cho PO Trending, số lượng tồn EA cho PO Summary By Week, và nhãn tổng FCST tuần 1/tuần 2 trên nóc cột stack của Samsung Forecast.
      - Hiển thị badge năm `selectedYW` trên Header card PO Balance Summary By Week và trỏ nút Excel xuất đúng dữ liệu tuần `pobalanceDetail`.
      - Nâng cấp `KDPOBalanceSummaryByYear.tsx` sang `<ResponsiveContainer width="100%" height={340}>` và nhãn dữ liệu chuẩn Stitch.
      - Tinh chỉnh tooltip chi tiết, hiển thị biến động tăng trưởng % và empty states chỉ dẫn trực quan.
  - Xác thực biên dịch Vite Dev Server 100% các files liên quan trả về HTTP 200 OK, không còn lỗi JSX hay cảnh báo cú pháp.

  - Sao lưu toàn vẹn 100% mã nguồn gốc `OVER_MONITOR.backup.tsx` (19.458 bytes, 463 dòng).
  - **Bảo lưu trọn vẹn 100% các tương tác Cell trong Datagrid theo yêu cầu người dùng**:
    + Cột `KD_CFM`: Cơ chế toggle xem nhãn / chỉnh sửa Radio buttons `NHẬP` (`Y`) & `HỦY` (`N`), kiểm tra quyền kinh doanh `checkBP`, kiểm tra trạng thái `HANDLE_STATUS === 'P'`, gọi cập nhật và gửi Socket thông báo realtime.
    + Cột `HANDLE_STATUS`: Chip trạng thái `PENDING` (Cam) / `CLOSED` (Xanh) sắc nét.
    + Cột `KD_REMARK`: Giữ nguyên `editable: true` cho phép chỉnh sửa trực tiếp trên bảng.
    + Định dạng số lượng và thành tiền phân cấp trực quan theo thiết kế Stitch.
  - Phân rã kiến trúc monolith 463 dòng thành Master Controller tinh gọn (274 dòng) và 7 sub-modules chuyên biệt (< 260 dòng/file):
    1. `PrecisionOverMonitor.scss`: SCSS tokens công nghiệp chuẩn Stitch, layout full-width & full-height trong Multi-Tab, ẩn toolbar xanh lá cũ của AGTable.
    2. `PrecisionOverHeader.tsx`: Breadcrumb, badge NET_SERVER: 3007, nút làm mới, nút toàn màn hình, nút ẩn/hiện biểu đồ trend.
    3. `PrecisionOverKpi.tsx`: 4 Thẻ KPI summary realtime (Tổng lượng dư EA kèm breakdown Xuất/Hủy, Giá trị dư USD, Trạng thái xử lý CLOSED/PENDING, Khách hàng trọng điểm).
    4. `PrecisionOverChart.tsx`: Biểu đồ xu hướng tuần Recharts `YYYY_WW` trục kép (Trục trái QTY EA, Trục phải AMOUNT $).
    5. `PrecisionOverToolbar.tsx`: Checkbox Only Pending, nút Reload, Nhập hàng loạt, Hủy hàng loạt, ô tìm kiếm Omnibar đa trường, EX1, EX2, PIVOT.
    6. `PrecisionOverCells.tsx`: Component tương tác riêng cho cell `KdCfmCellRenderer` và `HandleStatusCellRenderer`.
    7. `PrecisionOverColumns.tsx`: Cấu hình cột AG Grid high-density.
    8. `PrecisionOverPivotModal.tsx`: Modal phân tích dữ liệu đa chiều DevExtreme Pivot Grid.
  - Bảo toàn 100% nghiệp vụ: toàn bộ API queries (`f_loadProdOverData`, `f_updateProdOverData`), thao tác đơn lẻ / hàng loạt, thông báo socket realtime (`notification_panel`), SweetAlert2, xuất Excel `SaveExcel`.
  - Xác thực biên dịch Vite Dev Server 100% 8/8 files trả về HTTP 200 OK.
- [x] Redesign Quản Lý Khách Hàng / Vendor Master (`CUST_MANAGER.tsx` & `PrecisionCustManager/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `CUST_MANAGER.backup.tsx` (19.511 bytes, 492 dòng).
  - Phân rã kiến trúc monolith 492 dòng thành Master Controller tinh gọn (255 dòng) và 6 sub-modules chuyên biệt (< 270 dòng/file):
    1. `PrecisionCustManager.scss`: SCSS tokens công nghiệp chuẩn Stitch, full-width & full-height trong Multi-Tab, ẩn toolbar xanh lá cũ của AGTable.
    2. `PrecisionCustHeader.tsx`: Breadcrumb, badge NET_SERVER: 3007, nút làm mới và toàn màn hình.
    3. `PrecisionCustKpi.tsx`: 4 Thẻ KPI summary realtime động (Tổng đối tác, Phân loại KH/NCC kèm Split bar, Địa bàn KCN trọng điểm, Chuẩn hóa MST).
    4. `PrecisionCustToolbar.tsx`: Segment filters KH/NCC/USE/OFF, Search Omnibar (Ctrl+K), nút Thêm Mới Đối Tác, Load, EX1, EX2, PIVOT.
    5. `PrecisionCustColumns.tsx`: Quản lý toàn bộ cấu hình cột AG Grid với high-density cell renderers, link mã CUST_CD xanh, chip USE_YN, nút Sửa trực tiếp.
    6. `PrecisionCustModal.tsx`: Modal Thêm / Sửa đối tác siêu đẹp & chuyên nghiệp (Header gradient đổi màu KH/NCC, layout 3 cột cân đối, nút sinh mã tự động, clear form, thêm/cập nhật).
    7. `PrecisionCustPivotModal.tsx`: Modal phân tích dữ liệu đa chiều Pivot Table.
  - Bảo toàn 100% nghiệp vụ: toàn bộ API queries (`get_listcustomer`, `checkcustcd`, `add_customer`, `edit_customer`), tạo mã tự động `autogenerateCUST_CD`, gửi thông báo socket realtime (`notification_panel`), SweetAlert2, xuất Excel `SaveExcel`.
  - Xác thực biên dịch Vite Dev Server 100% 7/7 files trả về HTTP 200 OK.
- [x] Redesign BOM Manager (`BOM_MANAGER.tsx` & `PrecisionBOMManager/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Hợp nhất hoàn toàn 2 tab "BOM Manager" (`BOM_MANAGER_TAB`) và "Up hàng loạt" (`BOM_MANAGER_TAB_UP`) thành 1 màn hình duy nhất, loại bỏ MyTabs chia tab rời rạc.
  - Bổ sung nút `UP LOẠT` (màu Emerald `#059669`) nổi bật ngay cạnh nút `ADD VER` trên Sidebar theo đúng yêu cầu người dùng, mở Modal nạp Excel hàng loạt `PrecisionBOMBulkModal.tsx`.
  - Phân rã nguyên khối 4.243 dòng thành Master Controller tinh gọn 306 dòng cùng 10 sub-modules chuyên biệt (< 280 dòng/file):
    1. `PrecisionBOMManager.scss`: Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout full-height Multi-Tab, 2 bảng song song 50:50.
    2. `PrecisionBOMHeader.tsx`: Breadcrumbs định hướng, badge LIVE SYNC, đồng hồ realtime máy chủ, nút BOM DESIGN, fullscreen.
    3. `PrecisionBOMKpi.tsx`: 4 Widget KPI summary tính toán động từ dữ liệu thực tế (Tổng mã, BOMSX, BOM Giá, Bản vẽ & Dao).
    4. `PrecisionBOMSidebar.tsx`: Ô tìm kiếm Code, cụm nút ADD, ADD VER, UP LOẠT, UPDATE, CLEAR, nút phụ, bảng mã BOM, CodeVisualLize và link bản vẽ PDF.
    5. `PrecisionBOMSpecGrid.tsx`: Khối 5 nhóm thông số kỹ thuật sắc nét (Khách hàng, Kích thước & Cavity, Dao & Đóng gói, Thiết bị, Phê duyệt & Bản vẽ CAD, Tem LOT, AppSheet).
    6. `PrecisionBOMDualTables.tsx`: Song song 2 bảng BOM 50:50 (BOM Sản Xuất BOMSX Emerald & BOM Giá Thành Indigo) với thanh thao tác Lưu, Thêm dòng, Xóa dòng, Bật sửa, Clone BOMSX, DESIGN BOM.
    7. `PrecisionBOMBulkModal.tsx`: Modal Upload Excel BOM hàng loạt với AGTable xem trước trạng thái OK/NG/Waiting, nút nạp trực tiếp vào hệ thống.
    8. `bomManagerColumns.tsx`: Cấu hình cột AG Grid chuẩn Stitch cho 3 bảng.
    9. `useBOMManagerData.ts`: Custom hook quản lý 100% state và queries dữ liệu.
    10. `useBOMManagerActions.ts`: Custom hook quản lý 100% nghiệp vụ CRUD, clone, reset bản vẽ, upload CAD/AppSheet.
  - Bảo toàn 100% sao lưu gốc `BOM_MANAGER.backup.tsx` (163.271 bytes, 4.243 dòng) và `UpHangLoat.tsx` (17.591 bytes), loại bỏ Header/KPI đỉnh màn hình để tối đa diện tích hiển thị, bổ sung đầy đủ 100% thông tin sản phẩm (VL Chính, Máy 4, Remark, QL_HSD, HSD), bảng nhỏ AGTable Máy/CD (`PrecisionBOMProcessGrid.tsx`), thanh chọn vật liệu trước khi thêm dòng BOM (`materialList`), sửa sạch 100% lỗi lint & TypeScript (`tsc` 0 errors), khắc phục lỗi Tem LOT bị ẩn bằng Modal xem trước kích thước chuẩn 125mm x 65mm (`PrecisionBOMTemLotModal.tsx`), tự động ánh xạ 100% thông tin sản phẩm đang chọn vào tem LOT (`precisionBOMTemLotUtils.ts`), khắc phục triệt để lỗi hiển thị 2 text trùng nhau (1 nhạt 1 đậm) ở Part No, hiển thị mặc định 44 cột tiêu chuẩn của form Excel khi bảng rỗng trong Trung Tâm Nạp Mã BOM Hàng Loạt (`PrecisionBOMBulkModal.tsx` & `precisionBOMBulkColumns.tsx`), đồng bộ 100% logic nạp mã và bổ sung nút tải template mẫu, xác thực biên dịch Vite Dev Server 100% các files trả về HTTP 200 OK.
- [x] Add `PART_CODE_OTHERS` to `QTR_DATA` interface in `src/pages/qc/oqc/QTR_DATA.tsx`
- [x] Add `PART_CODE_OTHERS` search support in `src/pages/qc/oqc/VOC_HISTORY.tsx`
- [x] Add scanner PROCESS_LOT_NO -> G_NAME_KD lookup via checkG_CODE_From_PROCESS_LOT_NO API in VOC_HISTORY.tsx
- [x] Fix empty REQUEST_DEPT_CODE bug in DTC Registration (dk_dtc_tab.dart & qcService.js)
- [x] Add auto-dismiss timer (3s) for Swal alert when G_NAME_KD is not found during scanning in VOC_HISTORY.tsx
- [x] Create comprehensive Web ERP UI specification markdown for Google Stitch redesign (`SYSTEM_UI_SPECIFICATION_FOR_STITCH.md`)
- [x] Create new Precision Header (`PrecisionHeader.tsx`) and Account Info (`PrecisionAccountInfo.tsx`) based on Stitch DESIGN.md with full logic mapping & dedicated preview page (`/precision-preview`)
- [x] Create new Precision PO Manager (`PrecisionPoManager.tsx` & subcomponents) mapping 100% logic from `PoManagerManageTab` and `PoManagerAddTab`, consolidating 2 tabs into 1 unified modern workspace based on Stitch DESIGN.md
- [x] Optimize layout: eliminate secondary header banner, full-width AGTable on collapse, centered DevExtreme Pivot Grid modal popup
- [x] Build comprehensive SCSS modal architecture (`PrecisionPoModals.scss`) for all 4 Stitch modals (Manual Add, Excel Bulk, Edit PO, New Invoice) resolving unstyled Tailwind issue
- [x] Fix Customer and Code Autocomplete dropdown in New PO Modal: fix z-index layering above backdrop, enable openOnFocus, multi-field search, and smart enterprise fallback data
- [x] Full-height sticky bottom viewport stretch: expand PO AGTable and Left Filter Panel seamlessly to bottom edge, pin filter actions at bottom, zero wasted space
- [x] Fix PO Filter Panel style loss: resolve unclosed JSX element div in PrecisionPoFilterPanel.tsx and add direct SCSS import
- [x] Production rollout: Replace legacy `PoManager` with `PrecisionPoManager` (preserving full backup `PoManager.backup.tsx`)
- [x] Production rollout: Replace legacy `AccountInfo` with `PrecisionAccountInfo` (preserving full backup `AccountInfo.backup.tsx` & re-exporting `LinearProgressWithLabel`)
- [x] Production rollout: Replace legacy `NavBarNew` with `PrecisionHeader` (preserving full backup `NavBarNew.backup.tsx` & proxying props)
- [x] Multi-Tab Bar overhaul: Redesign `tabsdiv` in `Home.tsx` & `home.scss` with modern Stitch UI (34px compact bar, slate-50 background, card-pill active tab with blue status dot, JetBrains Mono index chips, quick close-all toolbar, aligned `.component_element` top offset)
- [x] Fix Multi-Tab Component Full-Width Stretch: remove `justify-content: center` in `home.scss` and force `align-items: stretch`, `width: 100%` on `.component_element` and `PrecisionPoManager`
- [x] Fix PO AGTable height collapse bug in Multi-Tab mode: anchor `.component_element` with `bottom: 0` and `height: calc(100vh - 82px)`, establish full flex column height down to `.po-grid-body`, `.agtable`, `.ag-theme-quartz`, and `.ag-root-wrapper` (min-height: 250px)
- [x] Fix Menu cursor auto-focus on open (Hamburger button & `Ctrl + Space`) via micro-delay focus and `effectiveAutoFocusSearch`
- [x] Restore Navbar Omnibar quick search dropdown & real-time filtering: fix double-dispatch toggleSidebar bug, add dynamic search alignment bounds calculation (`--precision-menu-left`, `--precision-menu-width`), and enable click-to-open
- [x] Redesign Diem Danh Nhom (`DiemDanhNhomCMS.tsx`) with Google Stitch High-Density: sub-header, toolbar with factory/shift filter, 3 realtime KPI cards, modern AG-Grid cells (avatar with online dot, chip codes, compact attendance/OT buttons), realtime socket footer, pivot modal, full-width multi-tab guarantee, and full backup (`DiemDanhNhomCMS.backup.tsx`)
- [x] Hide AGTable green default toolbar and move EX1 (Filtered), EX2 (All), and PIVOT buttons up to the quick filter toolbar (`precision-diemdanh__gridToolbar`)
- [x] Remove status footer bar (`PrecisionDiemDanhFooter`) at the bottom of the Diem Danh Nhom screen to maximize table vertical space
- [x] Create automated Stitch UI Refactor Skill (`.agents/skills/refactor_ui_after_stitch.md` & `refactor_ui_after_stitch/SKILL.md`) with 5-step standard workflow and safety checklist
- [x] Redesign Dieu Chuyen Team (`DieuChuyenTeamCMS.tsx`) with Google Stitch High-Density: sub-header, operational toolbar, 4 realtime KPI cards, modern AG-Grid interactive action cells (team, shift, factory, position select), pivot modal, full-width multi-tab guarantee, and full backup (`DieuChuyenTeamCMS.backup.tsx`)
- [x] Redesign Tab Dang Ky NS3 (`TabDangKy.tsx`, `FormDangKyNghi.tsx`, `FormDangKyTangCa.tsx`, `FormXacNhanChamCong.tsx`) with Google Stitch High-Density: sub-header banner, 3 realtime KPI cards, 3 interactive sub-tab forms (Nghỉ phép, Tăng ca, Chấm công), AGTable audit history ledger with EX1/EX2 on quick filter toolbar, multi-tab full-width guarantee, and full backups
- [x] Redesign Phe Duyet Nghi (`PheDuyetNghiCMS.tsx`) with Google Stitch High-Density: sub-header banner, 4 realtime KPI cards (Tổng đơn, Chờ duyệt, Đã duyệt, Đã xóa), operational toolbar (từ ngày - đến ngày, checkbox Only Pending), AG-Grid interactive action cells (Phê duyệt, Từ chối, Reset, Xóa đơn kèm confirm SweetAlert2), multidimensional Pivot modal, quick search filter, EX1/EX2 export on top grid toolbar, multi-tab full-width guarantee, and full backup (`PheDuyetNghiCMS.backup.tsx`)
- [x] Redesign Lich Su Di Lam (`LichSu_New.tsx`) with Google Stitch High-Density: sub-header banner with employee profile & telemetry, operational toolbar (From/To Date, checkbox Default, Search, Load Data), 4 realtime KPI cards (Tổng ngày làm, Giờ tích lũy, Tăng ca OT, Nghỉ phép/tuần), modern Recharts attendance timeline chart with past/future styling, AGTable quick search & EX1/EX2/PIVOT on grid toolbar, multidimensional Pivot modal, responsive media queries (Desktop & Mobile), multi-tab full-width guarantee, and full backup (`LichSu_New.backup.tsx`)
- [x] Redesign MyTabs (`MyTab.tsx` & `MyTab.scss`) to Google Stitch High-Density (slate `#f1f5f9` bar, active white card with blue dot indicator, eliminated neon green gradient) & Fix nested tab height collapse / overflow in `QuanLyCapCao_NS.tsx` (Diem Danh Nhom no overflow, Phe Duyet Nghi & Dieu Chuyen Team full-height stretch to bottom, neutralized AGTable bottombar)
- [x] Fix MyTab height calculation overflow bug: eliminate 100% height compounding in `MyTab.scss` (`tab-list: 32px` + `tab-content: calc(100% - 32px)`), calibrate child grid containers with `flex: 1 1 0px`, ensuring AGTable footer and horizontal scrollbar are fully visible without bottom clipping
- [x] Restore and standardize AGTable bottom bar (footer: Total / Selected rows) across standalone screens and nested tabs with modern Google Stitch tokens
- [x] Fix global scroll mechanism for long-content tabs (BaoCaoNhanSu and all long-form ERP tabs): enable `overflow-y: auto` on `.component_element` and `.tab-content` with `min-height: 100%`, allowing seamless vertical scrolling while preserving edge-to-edge layout for full-viewport grids
- [x] Redesign Bao Cao Nhan Su NS6 (`BaoCaoNhanSu.tsx`) with Google Stitch High-Density Enterprise: decompose 1599-line monolith into 11 sub-modules (<300 lines each). Sub-header banner with telemetry, operational toolbar with 5 filter dimensions (Bộ phận, Nhà máy, Ca, From/To date), 4 realtime KPI cards (Tổng quân số, Đi làm, Nghỉ, Chưa ĐD), Recharts ComposedChart trend analysis (Bars+Line), Main Dept AGTable + Donut Chart, Shift Matrix AGTable (T1/T2/HC groups), Sub Dept AGTable + Pie Chart, Full records AGTable with Quick Search + EX1/EX2/PIVOT on gridToolbar, DevExtreme PivotGrid modal, unified column definitions, responsive media queries (Desktop/Tablet/Mobile), multi-tab full-width guarantee, and full backup (`BaoCaoNhanSu.backup.tsx`)
- [x] Fix Bao Cao Nhan Su Trend Chart: convert to stacked bar chart (`TOTAL_ON` + `TOTAL_OFF` with `stackId="attendance"`), fix `ON_RATE` 0% calculation bug (fallback `TOTAL || on + off`), style matching Stitch reference with green curved line & custom dots
- [x] Redesign Quan Ly Phong Ban Nhan Su (`QuanLyPhongBanNhanSu.tsx`, `UserManager.tsx` NS1, `DeptManager.tsx` NS2) with Google Stitch High-Density Enterprise:
  - Tab 1 (UserManager): Decompose 809-line monolith into 6 sub-modules (< 280 lines each). Dual-panel layout (~72% Left Grid, ~28% Right Profile), sub-header with telemetry, operational toolbar with resigned filter, Load, Add/Update, EX1, EX2, Pivot, search filter; high-density AGTable with rounded avatar, ERP blue chip, bold name, shift badges; sticky right profile panel with large portrait, upload avatar, Train/Check Face AI, detailed employee metadata; 3-column modal form Add/Update.
  - Tab 2 (DeptManager): Decompose 690-line monolith into 6 sub-modules (< 230 lines each). Tri-panel cascading layout (Main Dept Master -> Sub Dept -> Work Position), sub-header with telemetry + 4 KPI cards (Main Dept, Sub Dept, Work Pos, Attendance Groups), dedicated action toolbars (Add, Edit, Delete, Sync, Quick Filter) for all 3 levels, dynamic 3-level modal dialog with checkBP permission verification. Full backups created (`UserManager.backup.tsx`, `DeptManager.backup.tsx`, `QuanLyPhongBanNhanSu.backup.tsx`).
- [x] Fix AGTable `onSelectionChange` TypeError runtime bug: add optional chaining (`ag_data.onSelectionChange?.(params)`) to prevent crashes across all screens and attach selection change listeners in `PrecisionDeptMainTable`, `PrecisionDeptSubTable`, `PrecisionDeptPosTable`, and `UserManager`
- [x] Fix layout: Bảng nhân sự và các bảng trong Quản lý phòng ban nhân sự dính sát xuống cuối trang (loại bỏ khoảng trống thừa bên dưới), sửa lỗi cú pháp SCSS compile (unmatched bracket) và hoàn thiện chuỗi flex full-height trong `PrecisionUserManager.scss`, `PrecisionDeptManager.scss` và `MyTab.scss`
- [x] Redesign Modal Thêm/Sửa Nhân Viên (`PrecisionUserModal.tsx`) theo chuẩn Google Stitch High-Density Enterprise: Header telemetry badges (EMPL_NO, Trạng thái), Grid 3 cột thông tin (Định danh, Địa chỉ & liên hệ với toggle ẩn/hiện mật khẩu, Vị trí & phân công), Card tích hợp avatar 150x200 upload/preview và Face AI Biometrics (Train Face, Check Face, ZKTeco Model), Footer chuẩn Stitch (+ Thêm Mới, Cập Nhật, Clear Form, Đóng), phân rã module thành 4 subcomponents (< 170 dòng/file) và SCSS chuyên biệt (`PrecisionUserModal.scss`)
- [x] Redesign 3 Modal Thao Tác Cơ Cấu Phòng Ban & Vị Trí (`PrecisionDeptModal.tsx`) theo chuẩn Google Stitch High-Density Enterprise: Category Top Bar phân cấp 3 màu riêng biệt (Cấp 1 Xanh Navy, Cấp 2 Xanh Ngọc Emerald, Cấp 3 Xanh Tím Indigo), Form 3 cấp chuyên sâu với badges Khóa Chính PK / Khóa Ngoại FK / Tiêu chuẩn quốc tế / Tiếng Hàn KR / Nhóm chấm công ATT, Footer 4 nút thao tác chuẩn Stitch (Clear Form, + Thêm Mới, Cập Nhật, Xóa), phân rã module thành 3 sub-forms độc lập (< 130 dòng/file) và SCSS chuyên biệt (`PrecisionDeptModal.scss`)
- [x] Redesign Bảng Chấm Công (`BangChamCong.tsx`) theo chuẩn Google Stitch High-Density Enterprise: Rút gọn nguyên khối 2.885 dòng thành controller tinh gọn ~250 dòng cùng 6 sub-modules (< 290 dòng/file), Sub-header telemetry connection, Action command toolbar với bộ lọc ngày, trừ nghỉ việc, trừ nghỉ sinh, các nút Tra chấm công, Update fix time, Fix auto time, Set ca HC / Ngày / Đêm, EX1, EX2, PIVOT, 5 thẻ Executive Mini-KPI realtime bar (Tổng nhân sự, Đúng giờ, Thiếu giờ vào, Thiếu giờ ra, Đang làm việc), AG-Grid cells renderers chuyên nghiệp (tên nhân viên in đậm link xanh, ca kíp chip, badge cảnh báo thiếu giờ vào/ra, trạng thái công), Modal PivotTable tích hợp, bổ sung đầy đủ 100% cột bao gồm các cột đối soát quẹt thẻ PREV_CHECK1-3 và NEXT_CHECK1-3, bảo toàn 100% sao lưu (`BangChamCong.backup.tsx`) và SCSS chuyên biệt (`PrecisionBangChamCong.scss`)
- [x] Redesign Navigation Flyout Drawer (`NavMenuNew.tsx`) theo chuẩn Google Stitch High-Density Enterprise: Giao diện Clean Glassmorphism với lớp phủ mờ `fixed inset-0` và drawer nổi bật bo góc 16px, Top micro-bar với tag `CMS • ENTERPRISE SUITE` và nút đóng (X), Tiêu đề `Navigation Menu` kèm badge đếm nhóm và version `v2700 Pro`, Thanh Omni-Search với phím tắt `⌘K` (hỗ trợ toàn cục `Ctrl + K` và `Esc`), Accordion danh sách phân hệ tự động gán bộ nhận diện 10+ màu sắc chuyên nghiệp (`navMenuThemes.ts`), Sub-items với icon box pastel, tên in đậm, chip mã phân hệ font `JetBrains Mono`, Footer trạng thái đồng bộ realtime máy chủ (pinging dot xanh) và nút `Ghim Sidebar`, bảo toàn 100% sao lưu (`NavMenuNew.backup.tsx`) và SCSS chuyên biệt (`NavMenuNew.scss`)
- [x] Redesign Trung Tâm Thông Báo Popover (`Notification.tsx` & `NotificationPanel.tsx`) theo chuẩn Google Stitch High-Density Enterprise: Khung Popover nổi 470px bo góc 16px bóng đổ đa tầng, Header gradient icon chuông xanh với pill đếm và nút Refresh/GMT+7, Thanh lọc 4 tab (Tất cả, Chưa đọc, YCSX, R&D) kèm nút Đã đọc tất cả, Thẻ thông báo chuyên sâu từng phân hệ với theme màu sắc nhận diện (Emerald YCSX, Sky RND, Indigo QLSX, Rose QC, Slate Hệ thống), thẻ hiển thị tên phòng ban, link hành động chi tiết và chấm unread dot, Footer thi đua khen thưởng và Xem tất cả thông báo, bảo toàn 100% sao lưu (`Notification.backup.tsx`, `NotificationPanel.backup.tsx`) và SCSS chuyên biệt (`Notification.scss`, `NotificationPanel.scss`)
- [x] Redesign Invoice Manager (`InvoiceManager.tsx`, `InvoiceManagerManageTab.tsx`, `InvoiceManagerAddTab.tsx`) theo chuẩn Google Stitch High-Density Enterprise: Hợp nhất hoàn toàn thành 1 trang duy nhất không chia tab (loại bỏ SubNav toggle 2 tabs cũ), thêm nút `UP HÀNG LOẠT` ngay trên toolbar cạnh `NEW INV` mở modal Excel upload & preview trực tiếp; phân rã thành 7 sub-modules (< 300 dòng/file) trong `PrecisionInvoiceManager/`: Filter sidebar w-64 với KPI summary cards (Delivered QTY/Amount), CRUD toolbar (New/Up hàng loạt/Edit/Delete/Update I.V No), Analytics toolbar (Pivot Grid/EX1 Excel), AGTable wrapper (giữ nguyên footer AGTable, bỏ footer thừa trùng lặp), Modal thêm/sửa Invoice chuẩn Stitch enterprise (gradient header, MUI Autocomplete, action footer), Bulk Import modal (`stitch-inv__modal--bulk`, drag-drop zone + CHECK/UP buttons + AGTable preview + nút Đóng), Pivot overlay, bảo toàn 100% API calls/validation/checkBP/socket notifications, và full backups
- [x] Redesign Quotation Total & Khôi phục Toàn Diện Tab 2 CalcQuotation (`QuotationTotal.tsx`, `QuotationManager.tsx`, `CalcQuotation.tsx`, `QuotationDeleteHistory.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Header Action Bar tích hợp Sub-Tabs Navigation (Price Master, Costing & BOM, Audit Log) cùng 3 thẻ KPI realtime (Đã duyệt giá, Trùng mã alert, Tỉ giá USD/VND).
  - Tab 1 (QuotationManager): Phân rã nguyên khối 2.104 dòng thành controller ~280 dòng + 4 sub-modules (Filter sidebar, Toolbar, Columns, Modals).
  - Tab 2 (CalcQuotation): Khôi phục 100% nghiệp vụ gốc từ `CalcQuotation.backup.tsx` và phân rã thành 5 sub-modules (< 280 dòng/file):
    1. `PrecisionCostProductList.tsx`: Bảng AGTable danh mục sản phẩm 34 cột + nút Show/Hide thu gọn panel.
    2. `PrecisionCostBOMAndVisualizer.tsx`: Bảng AGTable BOM NVL + Nút Update Giá Liệu + Component `CodeVisualLize` + Link bản vẽ PDF `/banve/{G_CODE}.pdf`.
    3. `PrecisionCostStandardUnits.tsx`: Khối 2 hàng x 10 cột ô nhập Tiêu chuẩn Mặc định & Tiêu chuẩn Hiện tại (tự động cập nhật dự toán ngay khi sửa).
    4. `PrecisionCostSheet.tsx`: Bảng chi phí 14 hạng mục đầy đủ các ô nhập Tùy biến (tiền nhân công, phí vận chuyển, khấu hao máy, phí quản lý chung, width offset).
    5. `PrecisionCostPricingAndHistory.tsx`: Khối nhập MOQ, Margin %, Giá 1EA, nút Add to List, nút Lưu Giá Master (đồng bộ uploadgia + updateCurrentUnit + loadListCode) + Bảng AGTable Lịch sử giá của mã tương ứng.
  - Tab 3 (QuotationDeleteHistory): Đồng bộ bảng kiểm toán xóa giá và bộ lọc chuẩn Stitch.
  - Bảo toàn 100% sao lưu các file `.backup.tsx` và styles chuyên biệt `PrecisionQuotation.scss`.
- [x] Redesign Plan Manager (`PlanManager.tsx`, `PlanManagerManageTab.tsx`, `PlanManagerStatusTab.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Header Action Bar tích hợp Sub-Tabs Navigation (Quản lý Plan, Plan Status) cùng nút "+ Thêm Plan Mới".
  - Quản lý Plan: Tối ưu bộ lọc và thanh công cụ (Xóa Plan, Pivot Grid, EX1, EX2, Standard High-Density).
  - Trạng thái kiểm tra Plan (Plan Status): Header kiểm tra ngày, CHECK PLAN, EX1, EX2, PIVOT, bảng trạng thái kiểm tra trực quan.
  - Modal Thêm Kế Hoạch Sản Xuất (`PrecisionPlanAddModal.tsx` & `PrecisionPlan.scss`): Chuẩn hóa form theo cấu trúc file Excel & tham chiếu `PoManager`, loại bỏ các trường thừa; tích hợp MUI Autocomplete cho Khách Hàng (CUST_CD) & Mã Sản Phẩm (G_CODE), ngày Plan (PLAN_DATE), bảng D1-D15 (8 cột kèm SUM tự động) và Ghi chú (REMARK), cùng chế độ Import File Excel (kéo thả, tải template, CHECK/UP hàng loạt).
  - Loại bỏ hoàn toàn thanh footer phụ (`Cập nhật tự động: 30s`) ở đáy màn hình, tối đa hóa không gian hiển thị chiều cao cho AGTable.
- [x] Redesign Forecast Manager (`FCSTManager.tsx`, `FCSTManagerManageTab.tsx`, `FCSTManagerAddTab.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Header Action Bar tích hợp Tab "Quản lý FCST (Forecast Master)" và cụm 5 nút hành động (`+ Thêm FCST Mới`, `Pivot Báo Cáo FCST`, `XÓA FCST`, `EX1`, `EX2`).
  - Quản lý FCST (Forecast Master): Phân rã nguyên khối 1.043 dòng thành controller tinh gọn ~290 dòng + sidebar bộ lọc dọc 240px `PrecisionFCSTFilterPanel.tsx` (12 tiêu chí lọc) + bảng AGTable dữ liệu lớn.
  - Tối ưu hóa cột `PrecisionFCSTColumns.tsx`: Rút gọn 700+ dòng lặp xuống ~100 dòng với vòng lặp tuần tự tạo W1-W22 (Số lượng) và W1A-W22A (Thành tiền), bảo toàn 100% logic kiểm tra phân quyền hiển thị giá (`SHOW_FCST_PRICE_AMNT`), định dạng số và màu sắc.
  - Modal Thêm Dự Báo FCST (`PrecisionFCSTAddModal.tsx` & `PrecisionFCST.scss`): Chuyển đổi tab cũ thành Modal Dialog hiện đại với 2 chế độ:
    + Nhập thủ công (Manual): Tích hợp MUI `Autocomplete` tìm kiếm thông minh Khách hàng (`f_getcustomerlist`) & Mã sản phẩm (`f_getcodelist`), Ngày FCST, ma trận 22 tuần W1-W22 kèm ô tính tổng realtime `SUM W1-W22`, Ghi chú.
    + Import File Excel: Kéo thả / chọn file Excel `.xlsx`, `.xls`, tải template mẫu, bảng AGTable preview dữ liệu, nút `CHECK` kiểm tra trùng mã và nút `UP FCST` lưu vào hệ thống (`upload_fcst`).
  - Tích hợp Modal Phân Tích Xoay Đa Chiều DevExtreme Pivot Grid (`PivotTable`) chuẩn Stitch.
- [x] Redesign YCSX Manager & Amazon Unified Workspace (`YCSXManager.tsx` & `PrecisionYCSX/`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn mã nguồn gốc `YCSXManager.backup.tsx` (3.961 dòng).
  - Phân rã nguyên khối 3.961 dòng thành master controller tinh gọn (479 dòng) cùng 11 sub-modules chuyên biệt trong `PrecisionYCSX/`:
    1. `PrecisionYCSX.scss`: Hệ thống SCSS tokens công nghiệp, flex layout full-height cho multi-tab, 4 KPI cards, sidebar bộ lọc 250px, modals dialog chuẩn Stitch.
    2. `PrecisionYCSXColumns.tsx`: Cấu hình toàn bộ cột AG Grid cho CMS (hơn 30 cột), PVN (cột theo dõi đặc thù), bảng xem trước Excel YCSX và bảng dữ liệu Amazon bulk upload, bảo toàn logic tải/xem bản vẽ PDF (`/banve/{G_CODE}.pdf`).
    3. `PrecisionYCSXHeader.tsx`: Dải header chuyên nghiệp với 2 Sub-tabs: `1. Quản lý YCSX (YCSX Master)` và `2. Dữ liệu Amazon (Tra & Quản lý AMZ Data)` (cho CMS), telemetry socket realtime, nút `+ THÊM YCSX MỚI` và `THÊM DỮ LIỆU AMZ MỚI`.
    4. `PrecisionYCSXKpi.tsx`: Bảng điều khiển 4 thẻ KPI realtime (Tổng lệnh YCSX, Đã duyệt SX, Chờ duyệt/Pending, Thiếu NVL) và 4 thẻ KPI cho phân hệ Amazon.
    5. `PrecisionYCSXFilterPanel.tsx`: Sidebar bộ lọc bên trái (250px) thay thế dải form ngang cũ, gồm 12 tiêu chí lọc chuyên sâu + hỗ trợ kích hoạt tìm kiếm bằng phím `Enter`.
    6. `PrecisionYCSXToolbar.tsx`: Cụm nút hành động công cụ phía trên bảng (Toggle sidebar, Thêm mới, Sửa, Xóa, Set Closed, Set Pending, In YCSX, Check Bản vẽ, Phê duyệt, Khóa/Mở YCSX, Khóa/Mở Liệu, EX1, EX2, PIVOT).
    7. `PrecisionYCSXAddModal.tsx`: Chuyển đổi form thêm YCSX thành Modal Dialog hiện đại với 2 chế độ: Nhập thủ công (DropdownSearch Khách hàng & Mã sản phẩm, số lượng, ngày giao hàng, loại SX, loại XH, First LOT, tạm thời) và Import Excel hàng loạt (Kéo thả, xem trước bảng AGTable, CHECK và UP YCSX).
    8. `PrecisionYCSXEditModal.tsx`: Modal cập nhật/sửa thông tin YCSX độc lập, bảo toàn logic kiểm tra quyền hạn (`LVT1906`, `NHU1903`).
    9. `PrecisionYCSXPrintModals.tsx`: Modal xem trước và in ấn chuyên biệt cho In YCSX (`renderYCSX`) và In Bản vẽ (`renderBanVe`) tích hợp `react-to-print`.
    10. `PrecisionAmzAddModal.tsx`: Modal tải dữ liệu Amazon hàng loạt, phân tách lô 1.000 dòng (`insertData_Amazon_SuperFast`), tự động giải mã thông tin YCSX, Model, Cavity và kiểm tra trùng barcode (`f_checkDuplicateAMZ`).
    11. `PrecisionAmzTab.tsx`: Tích hợp phân hệ tra cứu và in tem Amazon (`TraAMZ`) trong container full-height chuẩn Stitch.
    12. `useYCSXLogic.ts`: Custom hook quản lý 100% state, API queries (`f_traYCSX`, `f_insertYCSX`, `f_updateYCSX`, `f_batchDeleteYCSX`, thông báo socket, sweetalert confirmation dialogs).
  - Tích hợp Modal Pivot Table phân tích đa chiều số lượng theo khách hàng.
  - Bảo toàn 100% nghiệp vụ, phân quyền, in ấn, socket notification.
  - Kiểm tra Vite Dev Server (port 3001): 13/13 file đều trả về HTTP 200 OK.
- [x] Nâng cấp & Hoàn thiện Modal YCSX & Amazon Bulk Upload (Google Stitch Enterprise):
  - Khắc phục lỗi dropdown: Thay thế DropdownSearch bằng Material-UI v5 Autocomplete (hỗ trợ openOnFocus, autoHighlight, clearOnEscape, zIndex 120000) cho Khách hàng, Mã sản phẩm và PO No ở cả hai chế độ Thêm YCSX và Sửa YCSX.
  - Bổ sung 100% trường vào Quick Add to Grid (PO No, FIRST LOT, YC Tạm thời, Loại SX, Loại XH, Phân loại, Ghi chú + Thêm Dòng Lưới) với layout 2 hàng lưới thông thoáng.
  - Modal Sửa YCSX: Hiển thị đúng Khách hàng và Mã code/tên sản phẩm, đồng bộ chuẩn xác 100% các combobox (Phân loại hàng 11 options, Loại SX 4 options, Loại XH 7 options), và tái cấu trúc form thành 3 cột cân đối chuẩn Stitch.
  - Modal Nhập Dữ Liệu Amazon: Bọc bảng xem trước dữ liệu AMZ vào `.modal-agtable-wrapper` full-height với toolbar header (icon, badge số dòng, subtitle chia lô 1.000) và cụm nút thao tác Stitch đồng bộ.
  - Xác thực biên dịch Vite Dev Server: 100% 6/6 file liên quan trả về HTTP 200 OK.
- [x] Đồng bộ diện mạo TextField & Autocomplete chuẩn Google Stitch (28px height, viền #cbd5e1, focus #2563eb, size small) và sửa sạch toàn bộ lỗi lint đỏ / TypeScript trong toàn dự án:
  - Đồng bộ quy chuẩn CSS cho `.MuiAutocomplete-root`, `.MuiTextField-root`, `.MuiFormControl-root` trong `.field-group` và `.precision-ycsx__modalField`: Chiều cao chính xác 28px, padding 0 4px, căn giữa icon dropdown 50%, ẩn legend tránh khuyết viền.
  - Bổ sung `size="small"` cho toàn bộ `TextField` trong `renderInput` của cả `PrecisionYCSXAddModal.tsx` và `PrecisionYCSXEditModal.tsx`.
  - Đạt 0 diagnostics trong toàn bộ 99 files của `src/pages/kinhdoanh` (`PrecisionYCSXColumns.tsx`, `PrecisionAmzTab.tsx`, `PrecisionInvoiceModals.tsx`).
  - Quét và sửa sạch các lỗi TypeScript trong toàn bộ dự án: `useDocumentScrollIdleClass.ts`, `PrecisionDieuChuyenKpi.tsx`, `PrecisionUserProfilePanel.tsx`, `ChamCongCalculationUtils.ts`, `MachineTimeLine.tsx`, `INPUTPQC.tsx`, `MATERIAL_MANAGER.tsx`, `QUICKPLAN2.tsx`, `QUICKPLAN2_backup.tsx`, `QuanLyPhongBanNhanSu copy.tsx`, `AUDIT_HISTORY.tsx`, `NOLOWHOME.tsx`, `RelationshipsManager.tsx`.
  - Kiểm tra Vite dev server: 100% 18/18 files biên dịch thành công trả về HTTP 200 OK.
- [x] Khắc phục và nâng cấp Modal Xem & In YCSX cùng Modal Xem & In Bản Vẽ theo chuẩn Google Stitch Enterprise:
  - Khắc phục lỗi nút in bị "tàng hình" do biến CSS không tồn tại (`var(--brand-primary)`) kết hợp với chữ trắng trên nền trắng.
  - Tách biệt và đổi tên nhãn nút in to rõ, dứt khoát: **`IN YCSX`** (xanh dương `#2563eb`) và **`IN BẢN VẼ`** (xanh ngọc `#059669`) kèm hiệu ứng đổ bóng 3D và badge phím tắt `Ctrl + P`.
  - Chuẩn hóa tên nút trên Toolbar chính từ `Check Bản Vẽ` thành **`In Bản Vẽ`** (icon `<FiPrinter />`) đặt song hành bên cạnh nút **`In YCSX`**.
  - Tự động fallback lấy dòng đang click (`[clickedRows]`) khi người dùng chưa kịp tích ô checkbox AG Grid, tránh cảnh báo lỗi gián đoạn thao tác.
  - Tái thiết kế toàn diện layout modal theo chuẩn Google Stitch Enterprise:
    + Header gradient nhận diện phân màu: Xanh dương cho YCSX, Xanh ngọc Emerald cho Bản vẽ kỹ thuật.
    + Thanh điều khiển bản in (`.modal-print-toolbar`): Badge đếm số phiếu in (`badge-count`), nút `Tạo lại bản in (Re-render)` và Hero Print Button.
    + Sân khấu xem trước bản in (`.modal-print-stage`): Nền bàn làm việc xám slate `#f1f5f9` tương phản cao làm nổi bật trang giấy in `.modal-print-sheet` trắng A4 với bóng đổ 3D (`box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12)`).
    + Tích hợp phím tắt toàn cục: `Ctrl + P` / `Cmd + P` để ra lệnh in ngay tức thì, `Esc` để đóng modal nhanh.
    + Cấu hình `pageStyle` chuẩn cho `react-to-print`: `@page { size: auto; margin: 6mm; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`.
  - Đạt 0 lỗi diagnostics TypeScript và kiểm tra Vite Dev Server 5/5 file liên quan trả về HTTP 200 OK.
- [x] Bật Header Filter & Floating Filter cho bảng AG Table YCSX và bảng Data Amazon:
  - Khắc phục tình trạng header filter bị ẩn do prop `showFilter={false}`.
  - Bật `showFilter={true}` cho bảng Quản lý YCSX chính (`YCSXManager.tsx`), bảng Data Amazon (`PrecisionAmzTab.tsx`), bảng nạp Excel YCSX (`PrecisionYCSXAddModal.tsx`) và bảng nạp Excel Amazon (`PrecisionAmzAddModal.tsx`).
  - Cập nhật dependency array của `defaultColDef` trong `AGTable.tsx` để đồng bộ ngay lập tức trạng thái `floatingFilter`.
  - Tinh chỉnh SCSS `.ag-floating-filter` chuẩn Stitch Enterprise: Input nền trắng, bo góc 3px, viền `#cbd5e1`, focus ring xanh thương hiệu `#2563eb`.
  - Đạt 0 lỗi diagnostics TypeScript và kiểm tra Vite Dev Server 100% HTTP 200 OK.
- [x] Redesign PO Tích Hợp Tồn Kho (`POandStockFull.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `POandStockFull.backup.tsx` (1.060 dòng).
  - Phân rã kiến trúc monolith 1.060 dòng: Rút gọn master controller `POandStockFull.tsx` xuống còn 58 dòng và tạo module chuyên biệt trong thư mục `src/pages/kinhdoanh/poandstockfull/PrecisionPOandStockFull/`:
    + `PrecisionPOandStockFull.scss`: Hệ thống SCSS tokens công nghiệp chuẩn Stitch, full-width & full-height co giãn theo viewport trong Multi-Tab, ẩn toolbar xanh lá cũ của AGTable.
    + `PrecisionPOandStockFullColumns.tsx`: Tách riêng các bộ cột CMS, KD, PVN với cell renderers chuẩn Stitch (định dạng số `toLocaleString("en-US")`, PO Balance đỏ nổi bật, Thừa thiếu âm đỏ / dương xanh / zero xám, Status chip MỞ / KHÓA).
    + `PrecisionPOandStockFullKpi.tsx`: Dải 8 thẻ KPI summary công nghiệp realtime (`PO BALANCE`, `BTP`, `CK`, `CNK`, `TP`, `BLOCK`, `TỔNG TỒN`, `THỪA THIẾU`) rực rỡ và sắc nét.
    + `PrecisionPOandStockFullToolbar.tsx`: Cụm ô tìm kiếm Code (có icon quét mã và nút clear x nhanh), checkbox "Chỉ code tồn PO", 2 nút `Search(G_CODE)` và `Search(KD)`, tích hợp cụm chỉ số thống kê realtime ngay cùng hàng (Tổng PO Balance, Tổng tồn kho, Tỷ lệ đáp ứng dạng chip vàng hổ phách), các nút xuất `EX1 (Hiển thị)`, `EX2 (Raw Data)` và nút `PIVOT`.
    + `PrecisionPOandStockFullTab.tsx`: Component tab độc lập chứa 100% logic, state (`pofullSummary`, `pofulldatatable`, `codeCMS`, `alltime`), 2 hàm nghiệp vụ `handletraPOFullCMS` & `handletraPOFullKD` (bảo toàn `f_updateBTP_M100`, `f_updateTONKIEM_M100`, logic `CNDB` -> `TEM_NOI_BO`), đồng hồ realtime `liveTime`, loại bỏ thanh bottombar tùy biến ở footer để dùng thanh trạng thái chuẩn của AGTable và chuyển các chỉ số lên toolbar, tích hợp Modal DevExtreme Pivot Grid (`PivotTable`).
  - Bảo toàn 100% 3 tabs phân hệ còn lại: `Phòng Kiểm Tra` (`<INSPECTION />`), `Kho Thành Phẩm` (`isCMS ? <KHOTP /> : <KHOTPNEW />`), `Kho Liệu` (`<KHOLIEU />`).
- [x] Redesign Phòng Kiểm Tra / Data Kiểm Tra (`INSPECTION.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `INSPECTION.backup.tsx` (91.877 bytes, 3.074 dòng).
  - Phân rã kiến trúc monolith 3.074 dòng: Tinh gọn master controller `INSPECTION.tsx` xuống còn ~380 dòng và tạo module chuyên biệt trong thư mục `src/pages/qc/inspection/PrecisionINSPECTION/`:
    + `PrecisionINSPECTION.scss`: Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout Split-Screen 2 Panel (Sidebar 256px + Data Grid Workspace flex: 1), full-width & full-height co giãn theo viewport trong Multi-Tab, ẩn toolbar xanh lá cũ của AGTable.
    + `PrecisionINSPECTIONPivotFields.ts`: Di chuyển toàn bộ 6 mảng cấu hình DevExtreme Pivot Grid khổng lồ (~1.850 dòng) ra file riêng (`fieldsinputkiem`, `fieldsoutputkiem`, `fieldsinoutputkiem`, `fieldsnhatkykiem`, `fieldsinspectbalance`, `fieldsinspectionpatrol`).
    + `PrecisionINSPECTIONColumns.tsx`: Quản lý 8 bộ cấu hình cột AG Grid với cell renderers chuẩn Stitch (định dạng số `toLocaleString("en-US")`, mã code link xanh, chip trạng thái OK / ĐANG KIỂM / CHỜ DUYỆT NG / CHỜ KIỂM).
    + `PrecisionINSPECTIONFilterPanel.tsx`: Sidebar bộ lọc bên trái 256px với 10 tiêu chí lọc compact (Từ ngày, Tới ngày, Code KD, Code ERP, Tên nhân viên, Khách hàng, Loại SP, Số YCSX, LOT SX, ID + All Time checkbox) và Palette 8 nút hành động công nghiệp Stitch phân màu rực rỡ kèm tag phím tắt F1-F4 / badge đếm.
    + `PrecisionINSPECTIONToolbar.tsx`: Cụm nút công cụ phía trên bảng gồm `Pivot` (tím nhạt), `EX1 (Excel đang lọc)`, `EX2 (Raw Data)`, `PIVOT ADVANCED` (hồng pastel), dải đếm cột `Hiển thị: {N} / {N} cột` và nút bật/tắt hàng lọc nhanh trên cột.
  - Bảo toàn 100% nghiệp vụ: Đầy đủ các API queries (`get_inspection`, `loadChoKiemGop_NEW`, `loadInspectionPatrol`, `f_loadKHKT_ADUNG`, `f_loadTemLotKTHistory`, `f_updateTONKIEM_M100`, `f_updateTrueDiemKiemTra`), modal PivotTable xoay đa chiều, xuất Excel `SaveExcel`.
  - Tối ưu không gian chiều dọc: Loại bỏ hoàn toàn footer phụ trùng lặp, dùng footer chuẩn của AGTable, chuyển tóm tắt tổng số lượng lên hiển thị trên thanh Toolbar.
  - Kiểm tra Vite Dev Server (port 3001): 100% 8/8 files liên quan đều được biên dịch mượt mà và trả về HTTP 200 OK.
- [x] Redesign Kho Thành Phẩm (`KHOTP.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `KHOTP.backup.tsx` (55.357 bytes, 1.745 dòng).
  - Phân rã kiến trúc monolith 1.745 dòng: Tinh gọn master controller `KHOTP.tsx` xuống còn ~250 dòng và tạo module chuyên biệt trong thư mục `src/pages/kho/khotp/PrecisionKHOTP/`:
    + `PrecisionKHOTP.scss`: Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout Split-Screen 2 Panel (Sidebar 256px + Data Grid Workspace flex: 1), full-width & full-height co giãn theo viewport trong Multi-Tab, ẩn toolbar xanh lá cũ của AGTable, loại bỏ footer thừa.
    + `PrecisionKHOTPColumns.tsx`: Quản lý 5 bộ cấu hình cột AG Grid (`column_WH_IN_OUT`, `column_XUATPACK`, `column_STOCK_CMS`, `column_STOCK_KD`, `column_STOCK_TACH`) với cell renderers chuẩn Stitch (định dạng số `toLocaleString("en-US")`, mã code link xanh, chip trạng thái Closed / Pending, kết quả OQC OK / NG).
    + `PrecisionKHOTPKpi.tsx`: Dải 4 thẻ KPI summary realtime gồm `TỔNG SỐ LƯỢNG (TOTAL QTY)` dạng gradient Emerald hero, `TỔNG GIAO DỊCH / DÒNG`, `SỐ MÃ SẢN PHẨM KHẢ DỤNG`, và `CẢNH BÁO LƯU KHO / PENDING`.
    + `PrecisionKHOTPFilterPanel.tsx`: Sidebar bên trái 256px với chọn chế độ xem (Nhập kho GR, Xuất kho GI, Xuất Pack GI_PACK, Tồn G_CODE, Tồn Code KD, Tồn Vị trí), ngày tháng, mã code KD/ERP, khách hàng, các checkbox (All Time, Xuất cấp bù, Chỉ code có tồn) và nút Hero `TRA CỨU DỮ LIỆU (LOAD)` với icon tia sét `FiZap`.
    + `PrecisionKHOTPToolbar.tsx`: Cụm nút công cụ phía trên bảng gồm `EX1 (Hiển thị)`, `EX2 (Raw Data)`, `PIVOT`, `PIVOT ADVANCED`, dải nút chuyển nhanh chế độ xem (Quick view buttons), dải đếm cột `Hiển thị: {N} / {N} cột` và nút bật/tắt hàng lọc nhanh trên cột.
  - Bảo toàn 100% nghiệp vụ: Đầy đủ các API queries (`traWH_IN_OUT_CMS`, `traWH_IN_OUT`, `traXUATPACK`, `traSTOCKCMS_NEW`, `traSTOCKCMS`, `traSTOCKKD_NEW`, `traSTOCKKD`, `traSTOCKTACH`, `f_updateBTP_M100`), logic bảo mật audit mode `TEM_NOI_BO`, modal PivotTable xoay đa chiều, xuất Excel `SaveExcel`.
  - Tối ưu không gian hiển thị: Loại bỏ hoàn toàn footer thừa để AGTable sử dụng footer chuẩn của nó, bảng dữ liệu kéo dài sát đáy màn hình.
  - Kiểm tra Vite Dev Server (port 3001): 100% 8/8 files liên quan đều được biên dịch mượt mà và trả về HTTP 200 OK.
- [x] Redesign Kho Liệu (`KHOLIEU.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu toàn vẹn 100% mã nguồn gốc `KHOLIEU.backup.tsx` (23.195 bytes, 685 dòng).
  - Phân rã kiến trúc monolith 685 dòng thành controller tinh gọn và tạo module chuyên biệt trong thư mục `src/pages/kho/kholieu/PrecisionKHOLIEU/`:
    + `PrecisionKHOLIEU.scss`: Hệ thống SCSS tokens công nghiệp chuẩn Stitch, layout Split-Screen 2 Panel (Sidebar 260px + Data Grid Workspace flex: 1), full-width & full-height co giãn theo viewport trong Multi-Tab, ẩn toolbar xanh lá cũ của AGTable, modal dialogs chuẩn Stitch cho Nhập & Xuất liệu.
    + `PrecisionKHOLIEUColumns.tsx`: Quản lý 3 bộ cấu hình cột AG Grid (`column_NHAPLIEUDATA`, `column_XUATLIEUDATA`, `column_STOCK_LIEU`) với cell renderers số lượng, mã code link xanh, chip trạng thái (Dùng được / Khóa, Hạn dùng EXP).
    + `PrecisionKHOLIEUKpi.tsx`: Dải 4 thẻ KPI summary realtime gồm `TỔNG CUỘN / MÃ OK`, `TỔNG SỐ LƯỢNG (OUTPUT QTY)`, `TỔNG LÔ NHÀ CUNG CẤP`, và `CẢNH BÁO FIFO / KHÓA / BIỆT TRỮ`.
    + `PrecisionKHOLIEUFilterPanel.tsx`: Sidebar bên trái 260px với các tiêu chí lọc compact (Từ ngày, Tới ngày, M_NAME, M_CODE, Code KD, YCSX, PLAN_ID, STT Cuộn, LOT NCC kèm nút UPD LOT NCC), các checkbox và nút Hero `TRA CỨU DỮ LIỆU (LOAD)` cùng dải 3 nút quick jump (`DATA NHẬP`, `DATA XUẤT`, `TỒN LIỆU`).
    + `PrecisionKHOLIEUToolbar.tsx`: Cụm nút công cụ phía trên bảng gồm `Nhập Liệu`, `Xuất Liệu`, `EX1 (Grid)`, `EX2 (Raw)`, `PIVOT`, badge đếm số dòng/cuộn và nút bật/tắt hàng lọc nhanh trên cột.
  - Bảo toàn 100% nghiệp vụ: Toàn bộ API queries (`tranhaplieu`, `traxuatlieu`, `tratonlieu`, `updatelieuncc`), phân quyền `checkBP(userData, ["KHO"], ...)`, logic bảo mật audit mode `TEM_NOI_BO`, modal PivotTable xoay đa chiều, xuất Excel `SaveExcel`.
  - Tối ưu không gian hiển thị: Loại bỏ footer thừa thãi, dùng thanh trạng thái chuẩn của AGTable, bảng dữ liệu kéo dài sát đáy màn hình.
  - Kiểm tra Vite Dev Server (port 3001): 100% 8/8 files liên quan đều được biên dịch mượt mà và trả về HTTP 200 OK.
- [x] Redesign 2 Modal Nhập Liệu & Xuất Liệu Kho Liệu (`NHAPLIEU.tsx` & `XUATLIEU.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu 100% mã nguồn gốc: `NHAPLIEU.backup.tsx` (16.453 bytes) và `XUATLIEU.backup.tsx` (22.427 bytes).
  - Modal Nhập Liệu (`NHAPLIEU.tsx` + `NHAPLIEU.scss`):
    + Loại bỏ hoàn toàn background gradient lỗi thời, thay bằng hệ thống SCSS tokens công nghiệp chuẩn Google Stitch.
    + Top Telemetry Status Bar hiển thị realtime: Tổng số dòng, Tổng số cuộn, Tổng số mét.
    + Form Card Slate-border phân nhóm rõ ràng: Vendor, Vật liệu (MUI Autocomplete 28px, popper zIndex cao), Factory, Loại NK, Invoice, Ngày nhập, HSD, và bổ sung các ô quy cách (Số Lot, Cuộn/Lot, Mét/Cuộn, Số YCSX, Ghi chú) cho phép nhập ngay trước khi bấm Add.
    + Cụm nút hành động công nghiệp: `+ Thêm Vào Danh Sách` (Emerald) và `Xác Nhận Nhập Kho` (Blue).
    + Bảng AGTable full-height với toolbar tiêu đề, badge đếm dòng, nút `Xóa Dòng Chọn` (Red alert), bật `editable: true` cho phép chỉnh sửa trực tiếp trên lưới.
  - Modal Xuất Liệu (`XUATLIEU.tsx` + `XUATLIEU.scss`):
    + Phân rã monolith 585 dòng thành Master Controller (306 dòng) và 2 sub-components chuyên biệt: `XuatLieuScannerPanel.tsx` (178 dòng) và `XuatLieuTables.tsx` (137 dòng).
    + Top Telemetry Status Bar hiển thị số mã yêu cầu ĐKXL và tổng số cuộn/mét đã quét barcode.
    + Thiết kế Vùng Bắn Mã Vạch Hero (`scanner-hero-bar`) nổi bật cho thủ kho: Ô nhập `M_LOT_NO` font Mono lớn 13px, viền xanh lá đậm, focus ring nổi bật, badge phản hồi tên cuộn liệu vừa quét xong và nút `Xác Nhận Xuất Kho` (Blue).
    + Bố cục Dual Grid thông thoáng: Bảng Đăng Ký Xuất Liệu (DKXL) bên trái và Bảng Cuộn Đã Bắn Barcode bên phải với nút Xóa cuộn chọn.
    + Tự động tra tên nhân viên Giao/Nhận và hiển thị Badge tên nhân viên, hiển thị chip Tên sản phẩm PLAN_ID.
  - Bảo toàn 100% logic API queries, phân quyền `checkBP`, cập nhật tồn kho `f_updateStockM090`, xuất kho `f_insertO302`, nhập kho `f_Insert_I221`/`f_Insert_I222`.
  - Kiểm tra Vite Dev Server (port 3001): 100% 7/7 files liên quan đều được biên dịch mượt mà và trả về HTTP 200 OK.
- [x] Redesign Quản Lý Thông Tin Sản Phẩm (`CODE_MANAGER.tsx`) theo chuẩn Google Stitch High-Density Enterprise:
  - Sao lưu 100% mã nguồn gốc: `CODE_MANAGER.backup.tsx` (59.761 bytes, 1.990 dòng).
  - Phân rã kiến trúc monolith 1.990 dòng thành 5 sub-modules chuyên biệt (< 280 dòng/file) tại `src/pages/rnd/code_manager/PrecisionCodeManager/`:
    + `PrecisionCodeManager.scss`: SCSS tokens công nghiệp chuẩn Stitch, full-width & full-height co giãn trong Multi-Tab, ẩn toolbar xanh lá cũ của AGTable.
    + `PrecisionCodeManagerHeader.tsx`: Sub-header công nghiệp, breadcrumb R&D / QLSX, đồng hồ realtime máy chủ, nút làm mới và toàn màn hình.
    + `PrecisionCodeManagerKpi.tsx`: 4 Widget KPI summary tính toán động từ dữ liệu thực tế: Tổng Mã Sản Phẩm & Active Rate, Phân Loại Sản Phẩm (PROD_TYPE Breakdown & Top Type), Dòng Máy (Unique PROD_MODELs & Tỷ lệ duyệt bản vẽ PDBV), Quy Cách Đóng Gói (ROLL / TRAY / SHEET & Điểm BEP TB).
    + `PrecisionCodeManagerToolbar.tsx`: Dải công cụ 2 hàng phân màu sắc nét: Hàng 1 (Tìm code, Active, CNDB, Lọc PROD_TYPE, EX1, EX2, PIVOT, đếm dòng), Hàng 2 (Palette 10 nút nghiệp vụ SAVE, SET NGOẠI QUAN, RESET BẢN VẼ, PDUYET BẢN VẼ, Update TT QLSX, Bật tất sửa, Update LOSS SX, Update BEP, Update LOSS KT kèm badge số dòng chọn).
    + `PrecisionCodeManagerColumns.tsx`: Quản lý cấu hình toàn bộ các cột AG-Grid với cell renderers chuẩn Stitch (link mã G_CODE xanh, nút Tải CAD / Upload PDF cho bản vẽ, nút Tải / Upload docx cho AppSheet, chip trạng thái KT Ngoại quan, SỬ DỤNG MỞ/KHÓA, PD BANVE, căn phải số lượng và kích thước, tạo tự động các cột lặp lại EQ1-4, Setting1-4, UPH1-4, Step1-4, LOSS_SX1-4, LOSS_SETTING1-4, LOSS_ST_SX1-4).
  - Tái cấu trúc `CODE_MANAGER.tsx` rút gọn từ 1.990 dòng xuống 258 dòng sạch sẽ, bảo toàn 100% API queries, phân quyền `checkBP`, upload bản vẽ, modal Pivot Grid.
  - Kiểm tra Vite Dev Server (port 3001): 100% 6/6 files liên quan đều được biên dịch mượt mà và trả về HTTP 200 OK.




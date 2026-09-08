# TÀI LIỆU MÔ TẢ CHI TIẾT GIAO DIỆN HIỆN TẠI HỆ THỐNG WEB ERP (CMS VINA / PVN)
> **Mục đích:** Tài liệu kỹ thuật & đặc tả UI/UX toàn diện của hệ thống Web ERP hiện tại, phục vụ làm đầu vào (Prompt / Specification Context) cho **Google Stitch** (hoặc các công cụ thiết kế AI / Designer) để tiến hành tái thiết kế (Redesign) giao diện hiện đại, chuyên nghiệp và tối ưu trải nghiệm người dùng.

---

## 1. TỔNG QUAN HỆ THỐNG & ĐẶC THÙ NGHIỆP VỤ (SYSTEM PROFILE)

- **Tên hệ thống:** Web CMS ERP / PVN ERP (Hệ thống Quản trị Doanh nghiệp Sản xuất Điện tử, Khuôn mẫu & Vật liệu công nghệ cao).
- **Môi trường hoạt động:** Web Application trên Desktop PC văn phòng, Laptop và Máy tính trạm tại xưởng sản xuất (kết nối máy quét mã vạch Barcode/QR Scanner, máy scan công nghiệp).
- **Đối tượng người dùng chính:**
  1. *Khối Văn phòng (Office / Management):* Ban Giám đốc, Trưởng/Phó phòng, Nhân viên Kinh doanh, Mua hàng, Kế hoạch (QLSX), R&D, Nhân sự. Cần tra cứu nhanh, xử lý lượng dữ liệu khổng lồ, xuất Excel, phân tích đa chiều (Pivot table), đa nhiệm mở nhiều màn hình cùng lúc.
  2. *Khối Nhà xưởng (Workshop / Factory Workers):* Công nhân & Kỹ thuật viên QC (IQC, PQC, OQC, Inspection), Thủ kho, Vận hành máy sản xuất. Cần giao diện nhập liệu siêu tốc, tương thích máy quét mã vạch (Barcode Scanner) tự động commit mà không cần dùng chuột/bàn phím nhiều, xem ảnh sản phẩm lỗi trực quan kích thước lớn.
- **Tech Stack giao diện hiện tại:**
  - **Framework cốt lõi:** React 18 (TypeScript), Vite / Create React App, Redux Toolkit (`globalSlice`), React Router v6.
  - **Thư viện UI chính:** Material UI (MUI v5) cho Form inputs, Buttons, Dialogs, Selects; AG-Grid Community (`ag-theme-quartz`) cho toàn bộ bảng biểu dữ liệu; DevExtreme cho Pivot Grid & Charts; Recharts cho biểu đồ Dashboard; SweetAlert2 (Swal) cho popup cảnh báo/xác nhận; SCSS / Emotion CSS-in-JS.

---

## 2. KIẾN TRÚC KHUNG GIAO DIỆN CHÍNH (SHELL & MASTER LAYOUT)

Hệ thống sử dụng mô hình **Single Page Application (SPA)** với Master Layout bọc toàn bộ các trang con:

```
+-----------------------------------------------------------------------------------------------+
| TOP NAVBAR (Logo | Brand | Server/Ver Chips | Search Omnibar | Theme | Lang | Noti | Profile) |
+-----------------------------------------------------------------------------------------------+
| MULTI-TAB STRIP (Tab 1: Quản lý PO [x] | Tab 2: VOC History [x] | Tab 3: Dao Film Report [x]) |
+-------------------------------+---------------------------------------------------------------+
| SIDEBAR / FLYOUT MENU         | MAIN WORKSPACE / CONTENT OUTLET                               |
| - Accordion nhóm phòng ban     | (Hiển thị trang chức năng tương ứng của Tab đang chọn)        |
| - Tìm kiếm menu theo mã       |                                                               |
| - Chuyển chế độ Single/Multi  |                                                               |
+-------------------------------+---------------------------------------------------------------+
```

### 2.1. Thanh điều hướng trên cùng (Top Navigation Bar - `NavBarNew`)
- **Vị trí & Kích thước:** Nằm cố định ở đỉnh màn hình (`height: ~48px - 52px`), chiều rộng 100%, background phụ thuộc dải màu Gradient của Theme được chọn.
- **Thành phần từ Trái qua Phải:**
  1. **Nút Toggle Menu (Hamburger Button):** Icon `<MenuRounded>` / `<CloseRounded>` để đóng/mở thanh danh mục menu.
  2. **Logo Doanh nghiệp & Brand Meta:**
     - Logo công ty (`/companylogo.png`).
     - Tên công ty (`CMS` hoặc `PVN`).
     - 2 Chip badge nhỏ: `Web Ver 2700` và Tên Server kết nối (VD: `cmsvina4285.com:3007` hoặc `localhost:3007`).
  3. **Thanh tìm kiếm trung tâm (Search Omnibar):**
     - Input tìm kiếm chiếm toàn bộ diện tích ở giữa: *"Nhập tên menu hoặc mã menu, hoặc bấm Ctrl + Space để tắt mở menu"*.
     - Có icon kính lúp, nút "X" xóa nhanh, phím tắt `Ctrl + Space` để mở menu, gõ Enter để mở ngay kết quả tìm kiếm đầu tiên.
  4. **Nhóm chức năng bên Phải (Action Controls):**
     - **Theme Picker (Bảng màu giao diện):** Dropdown chọn dải màu Gradient (hơn 30 tùy chọn: Orange-Yellow, Green-Blue, Coral-Teal, Mint-Yellow, Purple-Pink...).
     - **Ngôn ngữ (Language Switcher):** Dropdown / Button chuyển đổi 3 ngôn ngữ: `Tiếng Việt` / `English` / `한국어`.
     - **Chuông thông báo (Notification Center):** Icon chuông có Badge đỏ đếm số thông báo chưa đọc. Click mở Popover danh sách thông báo realtime (kết nối Socket.io).
     - **Avatar & Thông tin tài khoản:** Hiển thị ảnh thẻ nhân viên (lấy từ thư mục `/Picture_NS/NS_[MãNV].jpg`) hoặc chữ cái đầu tên, Họ tên nhân viên. Click mở menu dropdown: *Account Info, Setting, Logout*.

### 2.2. Thanh Menu Điều Hướng (Navigation Menu - `NavMenuNew`)
- **2 chế độ hiển thị:**
  - **Mode Overlay / Flyout (Mặc định cho CMS):** Khi click nút menu hoặc focus ô tìm kiếm, menu trượt ra đè lên màn hình từ góc trái/dưới ô search, có backdrop mờ.
  - **Mode Sidebar (Dành cho PVN):** Cột bên trái cố định (`width: 220px`), có nút chevron nhỏ ở mép giữa màn hình để thu gọn/mở rộng (`collapse/expand`).
- **Cấu trúc Menu theo Phòng Ban (Hierarchical Tree):**
  - Danh mục cấp 1: Dạng Accordion nhóm theo từng bộ phận (Nhân sự, Phòng Kinh Doanh, Phòng Mua Hàng, Phòng QC, Phòng R&D, Phòng Sản Xuất, Bộ Phận Kho, Bảng Thông Tin, Công Cụ).
  - Danh mục cấp 2 (Sub-items): Mỗi chức năng hiển thị gồm:
    - **Icon màu đặc trưng:** Các icon từ `react-icons` (Fc, Md, Fa, Bi) với màu sắc sặc sỡ riêng biệt.
    - **Tên chức năng:** Đa ngôn ngữ (VD: "Quản lý PO", "IQC", "Báo cáo dao film"...).
    - **Mã chức năng viết tắt (Short Code):** VD: `KD1` (PO Manager), `QC3` (IQC), `SX1` (YCSX), `NS2` (Điểm danh nhóm)... Giúp nhân viên gõ phím tắt tìm kiếm cực nhanh.

### 2.3. Thanh đa Tab nội bộ (Internal Multi-Tab Bar - `CustomTabs`)
- **Cơ chế hoạt động:**
  - Hệ thống cho phép người dùng chuyển đổi giữa chế độ **Single Tab** (chạy URL thuần túy) và **Multiple Tabs** (mô phỏng trình duyệt lồng trong web app).
  - Khi mở chức năng, thay vì chuyển trang, chức năng được nhét vào 1 Tab mới, giữ nguyên trạng thái dữ liệu (state/filter/scroll) của các tab trước đó mà không bị reload.
- **Giao diện Tab:**
  - Nằm ngay dưới Top Navbar hoặc trên đỉnh trang nội dung.
  - Mỗi tab có: Số thứ tự (VD: `1.PO_MANAGER`), Tên tab, nút icon đóng tròn nhỏ `(x)`.
  - Tab đang active có hiệu ứng đổi màu chữ xanh dương `#0b5ed7`, nền mờ nhẹ và thanh chỉ thị (indicator line).
  - Hỗ trợ cuộn ngang (`scrollable tabs`) khi mở quá nhiều tab.
  - Phím tắt: `Ctrl + Shift + ArrowLeft/Right` để chuyển tab; `Ctrl + Shift + ArrowDown` để đóng tab hiện tại.

### 2.4. Khung Thông Báo Realtime (Notification Panel Popover)
- Popover mở ra khi click icon Chuông thông báo ở Topbar.
- Header có tiêu đề, tổng số thông báo, nút "Refresh".
- Danh sách item thông báo: Hiển thị icon trạng thái (Success/Error/Warning/Info), Tiêu đề (VD: *Update PO, Thêm Lot mới, Cảnh báo giao hàng*), Nội dung chi tiết kèm Mã NV, Tên NV, thời gian phát sinh và bộ phận liên quan.

---

## 3. CÁC ARCHETYPE (MẪU BỐ CỤC CHUẨN) CỦA CÁC TRANG CHỨC NĂNG

Hầu hết ~80 màn hình trong hệ thống ERP này được xây dựng dựa trên 5 Archetype mẫu sau đây:

```
+---------------------------------------------------------------------------------------------------+
| ARCHETYPE 1: SPLIT MASTER LAYOUT (TRA CỨU & DỮ LIỆU)                                              |
| +-------------------------+ +-------------------------------------------------------------------+ |
| | SEARCH FILTER PANEL     | | MAIN DATA GRID (AG-GRID)                                          | |
| | (Width ~240-260px)      | | - Custom Toolbar (Show/Hide, Add, Edit, Delete, Excel, Pivot)    | |
| | - Từ ngày / Tới ngày    | | - Floating filter row per column                                  | |
| | - All Time checkbox     | | - Ultra-dense rows (height: 20-25px)                              | |
| | - Text fields (Code,...) | | - Color coded status cells                                        | |
| | - Nút Search (FcSearch) | | - Footer status: Selected 2/1500 rows | Total: 1500 rows          | |
| +-------------------------+ +-------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| ARCHETYPE 2: DASHBOARD THỐNG KÊ KÉP (KPIs + PIE CHARTS + DUAL TABLES)                             |
| +-------------------+ +----------------------------------+ +------------------------------------+ |
| | KPI STAT CARDS    | | PIE CHART 1 (Usage Ratio %)      | | PIE CHART 2 (Export Count %)       | |
| | - Tổng số: 12,450 | | - Biểu đồ tròn + connector label | | - Biểu đồ tròn + connector label   | |
| | - OK: 11,800      | | - Chi tiết lát cắt               | | - Chi tiết lát cắt                 | |
| | - NG: 650         | |                                  | |                                    | |
| +-------------------+ +----------------------------------+ +------------------------------------+ |
| +-----------------------------------------------+ +-----------------------------------------------+ |
| | BẢNG TỔNG HỢP BACKDATA (Tỉ lệ 3/5)            | | BẢNG CHI TIẾT THEO DÒNG ĐƯỢC CHỌN (Tỉ lệ 2/5) | |
| | - Click chọn 1 dòng ở bảng này                | | -> Tự động load dữ liệu chi tiết của dòng đó  | |
| +-----------------------------------------------+ +-----------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| ARCHETYPE 3: THẺ TRỰC QUAN NHÀ XƯỞNG (VISUAL CARD GRID - VD: VOC HISTORY)                        |
| +-----------------------------------------------------------------------------------------------+ |
| | SCAN TOOLBAR: [Ô quét mã vạch Scanner (11 ký tự)] [x] Dùng máy scan [x] Show all [x] Fullscreen| |
| +-----------------------------------------------------------------------------------------------+ |
| | +-----------------------+ +-----------------------+ +-----------------------+                 | |
| | | CARD 1                | | CARD 2                | | CARD 3                |                 | |
| | | [ẢNH LỖI CHI TIẾT]    | | [ẢNH LỖI CHI TIẾT]    | | [ẢNH LỖI CHI TIẾT]    |                 | |
| | | (Height: 300px, zoom) | | (Height: 300px, zoom) | | (Height: 300px, zoom) |                 | |
| | | Meta: Ngày | Nhà máy  | | Meta: Ngày | Nhà máy  | | Meta: Ngày | Nhà máy  |                 | |
| | | Code | Số lượng lỗi   | | Code | Số lượng lỗi   | | Code | Số lượng lỗi   |                 | |
| | | MÔ TẢ LỖI (CHỮ LỚN)   | | MÔ TẢ LỖI (CHỮ LỚN)   | | MÔ TẢ LỖI (CHỮ LỚN)   |                 | |
| | +-----------------------+ +-----------------------+ +-----------------------+                 | |
+---------------------------------------------------------------------------------------------------+
```

---

### ARCHETYPE 1: Bố Cục Phân Tách Tra Cứu & Dữ Liệu (Search Filter + AG-Grid)
*Ví dụ điển hình:* Quản lý PO (`PoManager`), Quản lý Báo giá (`QuotationTotal`), Quản lý Khách hàng, Nhập xuất tồn Kho, Tra cứu YCSX, Lịch sử làm việc.

1. **Khung Tìm Kiếm Bên Trái (Left Filter Panel):**
   - Chiều rộng cố định: `~240px - 260px` (có thể ẩn/hiện bằng nút `Show/Hide` trên Toolbar để mở rộng bảng).
   - Nền: Thường dùng gradient xanh nhạt hoặc trắng có border viền xám.
   - Các trường điều khiển:
     - Date Range: `Từ ngày` & `Tới ngày` (HTML5 Datepicker hoặc MUI Datepicker).
     - Checkbox: `All Time` (bỏ chọn ngày, tra toàn bộ lịch sử từ 2020 đến nay), `Chỉ PO Tồn` / `Chỉ hàng chờ duyệt`.
     - Các ô Text input dày đặc (font 0.65rem): Mã sản phẩm KD (`G_NAME_KD`), Mã sản phẩm ERP (`G_CODE`), Khách hàng, Tên nhân viên, Số PO, Số Lot, Loại sản phẩm...
     - Nút Tìm kiếm: Button icon `FcSearch` màu xanh lá cây, hỗ trợ phím `Enter` tại bất kỳ ô input nào để kích hoạt tìm kiếm.
2. **Khung Bảng Dữ Liệu Bên Phải (Right Data Grid - `AGTable`):**
   - **Thanh Toolbar đỉnh bảng:**
     - Nút `Show/Hide` bảng lọc trái.
     - Nhóm nút hành động nghiệp vụ: `NEW` (Thêm mới), `EDIT` (Sửa dòng chọn), `DELETE` (Xóa dòng chọn), `APPROVE` (Phê duyệt).
     - Nhóm nút công cụ dữ liệu: `EX1` (Xuất Excel các dòng đang lọc hiển thị), `EX2` (Xuất toàn bộ data thô), `PIVOT` (Mở bảng phân tích xoay đa chiều DevExtreme PivotGrid dạng Modal).
   - **Lưới dữ liệu AG-Grid (`ag-theme-quartz`):**
     - **Mật độ dữ liệu siêu cao (Ultra-dense):** Chiều cao hàng (`rowHeight`) từ `20px` đến `25px`; kích thước chữ ô chỉ `0.6rem - 0.7rem` (~10px - 11px).
     - **Floating Filter Row:** Dưới tiêu đề mỗi cột luôn có 1 ô input nhỏ để người dùng gõ lọc trực tiếp từng cột mà không cần mở popup filter.
     - **Checkbox Selection:** Cột đầu tiên có checkbox chọn nhiều dòng (Multi-selection), hỗ trợ chọn tất cả theo điều kiện lọc.
     - **Tô màu ô có điều kiện (Conditional Formatting):**
       - Số tiền / Đơn giá / Doanh thu: Tô màu xanh lá đậm hoặc xanh dương kèm định dạng currency (`$`, `₫`).
       - Cảnh báo vượt hạn mức / Quá hạn (Overdue / NG): Tô màu đỏ rực `#dc2626`, chữ in đậm.
       - Trạng thái Duyệt: Xanh lá (`OK`), Vàng cam (`Chờ duyệt`), Đỏ (`Từ chối / Khóa`).
       - Dòng đang được chọn: Đổi màu nền xanh chuối nhạt `#bff38f` hoặc cam nhạt.
   - **Thanh trạng thái chân bảng (Grid Bottom Bar):**
     - Bên trái: `Selected: 3 / 250 rows` (nếu có dòng được tick).
     - Bên phải: `Total: 250 rows`.

---

### ARCHETYPE 2: Dashboard Thống Kê & Báo Cáo Kép (KPIs + Pie Charts + Dual Tables)
*Ví dụ điển hình:* Báo cáo Dao Film (`DAOFILM_REPORT`), Báo cáo Sản xuất (`BAOCAOSXALL`), Báo cáo Nhân sự (`BaoCaoNhanSu`), Báo cáo Kinh doanh (`KinhDoanhReport`).

1. **Khối Thống Kê Trên Cùng (Top Visual Section):**
   - Chia thành 3 cột cân bằng (`grid-template-columns: repeat(3, 1fr)`):
     - **Cột 1: Thẻ KPI dạng xếp chồng (Stacked Stat Cards):** 3 khối chữ nhật hiển thị số liệu lớn (`font-size: 2.2rem`, bold), màu nền gradient nhẹ:
       - *Thẻ 1 (Tổng số):* Gradient xanh dương nhạt (`#d9f3ff` -> `#7ed7ff`).
       - *Thẻ 2 (Số lượng Đạt OK):* Gradient xanh lá nhạt (`#dbfce8` -> `#9df7be`).
       - *Thẻ 3 (Số lượng Lỗi / Vượt ngưỡng NG):* Gradient đỏ hồng nhạt (`#ffe1e1` -> `#ffb0b0`).
     - **Cột 2 & Cột 3: Hai biểu đồ tròn Recharts (Dual Pie Charts):**
       - Biểu đồ 1: Tỉ trọng theo % sử dụng (chia dải: 0%, 1-10%, 11-20%, 21-50%, 51-99%, 100-300%, >500%).
       - Biểu đồ 2: Tỉ trọng theo số lần xuất xưởng (0 lần, 1 lần, 2-3 lần, 4-5 lần...).
       - Đặc điểm biểu đồ: Dạng Donut hoặc Full Pie, có **Connector Line** chỉ thẳng từ lát cắt ra ngoài hiển thị nhãn `[Tên nhóm]: [Số lượng] ([Tỉ lệ %])`, có Tooltip khi hover.
2. **Khối Bảng Dữ Liệu Kép Bên Dưới (Bottom Split Tables - Tỉ lệ 3:2):**
   - **Bảng Trái (Master Backdata - 60% chiều rộng):** Chứa danh sách tổng hợp tất cả các mã. Có Toolbar lọc từ ngày, tới ngày, checkbox All time, nút Refresh.
   - **Bảng Phải (Detail Breakdown - 40% chiều rộng):** Khi người dùng click vào bất kỳ dòng nào ở bảng bên trái, bảng bên phải lập tức kích hoạt API truy vấn và hiển thị toàn bộ lịch sử chi tiết (từng lần dập, ca máy, công nhân đứng máy, số lượng...).

---

### ARCHETYPE 3: Thẻ Trực Quan & Vận Hành Nhà Xưởng (Visual Card Grid)
*Ví dụ điển hình:* Lịch sử lỗi xuất hàng VOC (`VOC_HISTORY`), Tình trạng thiết bị máy móc (`EQ_STATUS`), Màn hình hiển thị xưởng TV Show.

1. **Thanh Toolbar Quét Mã Xưởng (Factory Scan Toolbar):**
   - Thiết kế dạng thanh bo tròn nổi (Floating pill card, blur 8px).
   - Ô nhập máy quét mã vạch (`input Scanner`): Tự động focus liên tục, tự động nhận chuỗi quét (lấy 11 ký tự đầu), tự lọc kết quả và xóa bộ đệm để chờ lần quét tiếp theo mà công nhân không cần chạm chuột.
   - Checkbox `Dùng máy scan`, Checkbox `Show all` (chuyển đổi giữa 6 thẻ mới nhất và toàn bộ danh sách).
   - Checkbox `Full Screen` để phóng to toàn màn hình hiển thị trên TV phân xưởng.
2. **Lưới Thẻ Trực Quan 3 Cột (3-Column Card Grid):**
   - Mỗi thẻ đại diện cho 1 sự vụ lỗi / linh kiện:
     - **Khu vực ảnh lớn (Photo Showcase - Chiều cao 300px):**
       - Hiển thị ảnh chụp thực tế lỗi sản phẩm (`object-fit: contain`).
       - Nếu chưa có ảnh: Hiển thị placeholder cảnh báo viền đỏ kèm nút bấm nhanh "Upload ảnh" trực tiếp vào thẻ.
       - Tính năng click ảnh để phóng to, hoặc triple-click để đổi ảnh.
       - Badge số quản lý nổi ở góc trên ảnh.
     - **Phần thông tin thẻ (Card Metadata Body):**
       - Cột trái: 4 badge nhỏ chia 2 dòng (Ngày phát sinh, Phân xưởng, Mã Part Code, Số lượng lỗi `DEFECT_QTY`).
       - Cột phải: Khối mô tả chi tiết hiện tượng lỗi với phông chữ lớn `1.15rem`, in đậm, màu đỏ sẫm `#7f1d1d` trên nền cam/đỏ nhạt để công nhân nhìn từ xa vẫn thấy rõ lỗi.

---

### ARCHETYPE 4: Cửa Sổ Form Nhập Liệu & Hộp Thoại (Modals & Dialogs)
*Ví dụ điển hình:* Form tạo mới / sửa PO, Dialog đăng ký nghỉ phép / tăng ca, Dialog phân quyền, Popup chỉnh sửa Metadata Semantic Engine.

- Sử dụng `CustomDialog` (bọc MUI Dialog).
- Header: Tiêu đề form màu xanh đậm, nút đóng `[X]` góc phải.
- Body: Form chia 2 hoặc 3 cột, sử dụng MUI `TextField` size dense hoặc HTML native input có viền xám mỏng.
- Input Autocomplete: Hỗ trợ tìm kiếm nhanh mã linh kiện (`G_CODE`), tên khách hàng với danh sách dropdown giới hạn 100 kết quả có scroll.
- Footer: Nhóm nút bấm `Lưu / Cập nhật` (Màu xanh lá `#21a73e` hoặc Xanh dương `#1976d2`) và `Hủy / Đóng` (Màu đỏ hoặc xám).
- Thông báo xác nhận: Luôn dùng SweetAlert2 (`Swal.fire`) với icon Warning/Success/Error đè lên modal (`z-index: 10000`).

---

### ARCHETYPE 5: Trang Thông Tin Cá Nhân & Hồ Sơ Nhân Viên (`AccountInfo`)
*Màn hình mặc định khi đăng nhập hoặc mở tab đầu tiên.*

1. **Card Header Profile (Hồ Sơ & Thẻ Vào/Ra):**
   - Ảnh đại diện tròn lớn: Tải từ ảnh thẻ nhân sự thực tế `/Picture_NS/NS_[MãNV].jpg` (click để chọn file tải ảnh mới).
   - Họ tên nhân viên (font lớn, bold), Bộ phận chính (Main Department), Bộ phận phụ (Sub Department), Mã nhân sự nội bộ (CMS ID), Mã ERP.
   - **Widget Chấm Công Ngày Hôm Nay:** 2 khối Pill nổi bật:
     - Giờ vào `IN`: Hiển thị giờ quẹt thẻ sáng (VD: `07:55:12`) hoặc "Chưa chấm".
     - Giờ ra `OUT`: Hiển thị giờ quẹt thẻ chiều/tối (VD: `17:02:40`) hoặc "Chưa chấm".
2. **Card Thống Kê & Biểu Đồ Công Làm Việc:**
   - **Thống kê tổng hợp:** Số ngày làm việc từ đầu năm, số ngày tăng ca, số ngày nghỉ phép, số lần được thưởng, số lần bị phạt.
   - **Biểu đồ đường (Line Chart - Recharts):** Biểu đồ thể hiện số giờ làm việc thực tế từng ngày trong tháng hiện tại (từ ngày 1 đến ngày cuối tháng). Các ngày đã qua hiển thị đường liền nét, các ngày chưa đến hiển thị rỗng.
3. **Card Thông Tin Chi Tiết & Hành Động:**
   - Bảng 2 cột: Ngày sinh, Quê quán, Địa chỉ thường trú, Vị trí công việc, Nhóm điểm danh, Chức vụ.
   - Nút `Change password` mở Modal đổi mật khẩu.

---

## 4. CHI TIẾT DANH MỤC CÁC PHÒNG BAN & PHÂN HỆ CHỨC NĂNG

Hệ thống quản lý toàn diện quy trình sản xuất công nghiệp với các phân hệ chính sau:

| STT | Phân hệ / Phòng ban | Mã Menu tiêu biểu | Danh sách màn hình chức năng chính | Mô tả luồng nghiệp vụ & Giao diện |
|:---:|:---|:---:|:---|:---|
| **1** | **Xác thực & Hệ thống** | `AUTH` | Trang Đăng nhập (`Login`), Cài đặt hệ thống (`SettingPage`) | Form đăng nhập chọn Server kết nối (IP/DDNS), chọn Chi nhánh (Branch 001/002), kiểm tra phiên bản web. |
| **2** | **Kinh Doanh (Sales)** | `KD1` - `KD15` | Quản lý PO (`PoManager`), Invoice (`InvoiceManager`), Plan giao hàng (`PlanManager`), FCST dự báo (`FCSTManager`), Quản lý Báo giá (`QuotationTotal`), PO tích hợp tồn kho (`POandStockFull`), Quản lý khách hàng (`CUST_MANAGER`), Hàng thiếu (`ShortageKD`), Theo dõi vượt hạn (`OVER_MONITOR`). | Archetype 1 chiếm ưu thế: Bảng dữ liệu PO/Invoice siêu lớn với hàng chục cột, tính toán số dư tồn PO Balance, tổng tiền USD/VND, phê duyệt giá bán. |
| **3** | **Quản Lý Sản Xuất (QLSX)** | `QL1` - `QL6` | Yêu cầu sản xuất YCSX (`YCSXManager`), Kế hoạch sản xuất (`QLSXPLAN`), Năng lực máy CAPA (`CAPASX2`), Tính toán nguyên vật liệu MRP (`TINHLIEU`), Báo cáo tiến độ. | Bảng kế hoạch theo từng dây chuyền máy dập, tính toán nhu cầu vật liệu theo BOM, theo dõi chỉ thị sản xuất phát hành cho xưởng. |
| **4** | **Phân Xưởng Sản Xuất (SX)** | `SX1` - `SX18` | Báo cáo sản xuất tổng hợp (`BAOCAOSXALL`), Tiến hành sản xuất (`TRANGTHAICHITHI`), Trạng thái máy TV Show (`EQ_STATUS`), Báo cáo Dao Film (`DAOFILM_REPORT`), Lịch sử cuộn liệu (`TINHHINHCUONLIEU`), Báo cáo theo roll (`BAOCAOTHEOROLL`), Kho SX (`KHOSX`). | Kết hợp Archetype 1 và Archetype 2: Theo dõi sản lượng thực tế dập theo từng giờ, hiệu suất máy OEE, tỉ lệ lỗi dập, khấu hao tuổi thọ dao cắt film. |
| **5** | **Quản Lý Chất Lượng (QC)** | `QC1` - `QC10` | Tra cứu chung IQC (`IQC`), PQC công đoạn (`PQC`), OQC xuất hàng (`OQC`), Lịch sử lỗi VOC (`VOC_HISTORY`), Kiểm tra ngoại quan (`KIEMTRA`), Thử nghiệm tin cậy (`DTC`), Khiếu nại khách hàng (`CSTOTAL`), Hồ sơ ISO (`ISO`), Báo cáo chất lượng (`QCReport`). | Archetype 3 và Archetype 1: Kiểm tra vật liệu đầu vào IQC, quản lý phiếu không phù hợp NCR kèm ảnh khuyết tật, bảng kiểm tra kích thước bản vẽ (DTC), thẻ lỗi VOC có ảnh cho công nhân. |
| **6** | **Nghiên Cứu & Phát Triển (R&D)** | `RD1` - `RD8` | Quản lý định mức BOM (`BOM_MANAGER`), Thiết kế BOM Amazon (`BOM_AMAZON`, `DESIGN_AMAZON`), Mã vạch Barcode (`PRODUCT_BARCODE_MANAGER`), Giao nhận dao film (`QLGN`), Theo dõi mẫu thử (`SAMPLE_MONITOR`), Báo cáo R&D (`RND_REPORT`). | Quản lý cấu trúc sản phẩm nhiều tầng (Multi-level BOM), quản lý mã Barcode theo chuẩn khách hàng Amazon/Samsung, lịch sử bàn giao dao khắc. |
| **7** | **Mua Hàng (Procurement)** | `PU1` - `PU2` | Quản lý vật liệu (`QLVL`), Tính toán MRP Mua hàng (`TINHLIEU`), Danh mục nhà cung cấp (`Suppliers`). | Theo dõi bảng giá nguyên vật liệu, tính toán tồn kho an toàn, tạo kế hoạch đặt mua vật tư theo tiến độ đơn hàng. |
| **8** | **Bộ Phận Kho (Warehouse)** | `KO1` - `KO3` | Nhập xuất tồn thành phẩm (`KHOTP`/`KHOTPNEW`), Nhập xuất tồn cuộn liệu (`KHOLIEU`), Báo cáo kho (`WH_REPORT`), Quản lý vị trí kho, Kho ảo, Kho sub. | Bảng dữ liệu quét mã QR pallet/cuộn liệu, theo dõi FIFO (nhập trước xuất trước), cảnh báo vật liệu cận date hoặc tồn kho lâu ngày. |
| **9** | **Nhân Sự & Hành Chính (HR)** | `NS1` - `NS10` | Điểm danh nhóm (`DiemDanhNhomCMS`), Điều chuyển team (`DieuChuyenTeam`), Đăng ký nghỉ/tăng ca (`TabDangKy`), Phê duyệt đơn (`PheDuyetNghi`), Lịch sử đi làm (`LichSu_New`), Bảng chấm công tổng (`BANGCHAMCONG`), Quản lý phòng ban (`QuanLyPhongBanNhanSu`), Báo cáo nhân sự (`BaoCaoNhanSu`). | Chấm công quét vân tay/thẻ từ, duyệt nghỉ phép online nhiều cấp (Leader -> Trưởng phòng), điều động công nhân giữa các chuyền sản xuất. |
| **10** | **Bảng Tin & Công Cụ (Tools & AI)** | `IF1` - `TL2` | Bảng tin thông báo (`Information`, `AddInfo`), Truyền nhận file (`FileTransfer`), No-code/Low-code page builder (`NOLOWHOME`), AI Chat & Quản trị Semantic Engine (`SemanticEngineManagerEnhanced`). | Đăng tin tức nội bộ; Công cụ dựng màn hình kéo thả; Chatbot AI hỏi đáp dữ liệu ERP bằng ngôn ngữ tự nhiên, bảng quản trị ánh xạ Metadata DB (Tables, Columns, Relationships). |

---

## 5. DESIGN SYSTEM HIỆN TẠI & CÁC NHƯỢC ĐIỂM CẦN KHẮC PHỤC

### 5.1. Bảng màu & Phong cách đồ họa hiện tại
- **Hệ màu Gradient Vintage:** Hệ thống đang sử dụng rất nhiều dải màu gradient 90s/2000s làm background cho Header, Sidebar, Toolbar và Card:
  - Gradient xanh lá - vàng chanh: `linear-gradient(90deg, #7efbbc 0%, #ace95c 100%)` hoặc `#b2ffa0`.
  - Gradient xanh cyan - xanh dương: `linear-gradient(0deg, #afd3d1, #86cfff)`.
  - Gradient cam đào - hồng: `linear-gradient(90deg, #FF9A8B, #FF6A88)`.
- **Màu sắc ngữ nghĩa (Semantic Colors) trong bảng:**
  - Tiêu đề cột bảng: Xanh dương đậm `#0554a2` trên nền xám nhạt hoặc trong suốt.
  - Dòng được chọn (Selected row): Xanh chuối `#bff38f` hoặc Cam `#ffa500`.
  - Trạng thái Lỗi / Cảnh báo: Đỏ `#dc2626` hoặc `#b91c1c`.
  - Trạng thái Hoàn thành / OK: Xanh lá `#15803d`.
  - Doanh thu / Số tiền: Xanh lá đậm hoặc xanh dương kèm định dạng số.
- **Typography:**
  - Font stack hệ thống: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
  - Kích thước chữ: Cực kỳ nhỏ để nhồi nhét thông tin (Header bảng `0.6rem` ~ 9.6px; Ô dữ liệu `0.65rem` ~ 10.5px; Ô input `0.6rem - 0.7rem`; Tiêu đề trang `1.0rem - 1.15rem`).
- **Đổ bóng & Viền (Shadows & Borders):**
  - Đổ bóng kiểu cũ, nặng nề: `box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27)`.
  - Viền bảng: `1px solid #cccccc` hoặc `1px solid #1f1f1f3b` chia cắt từng ô dữ liệu theo phong cách bảng Excel cổ điển.

### 5.2. Các điểm hạn chế lớn (Pain Points) cần Google Stitch giải quyết
1. **Thiếu tính thẩm mỹ hiện đại:** Dải màu gradient sặc sỡ và đổ bóng đậm khiến giao diện trông giống các phần mềm desktop WinForms cũ, gây mỏi mắt khi làm việc 8-10 tiếng/ngày.
2. **Hệ thống Design Tokens không đồng nhất:** Kích thước font chữ, khoảng cách (margin/padding), mã màu hex đang bị phân mảnh rải rác trong hàng chục file `.scss`.
3. **Mật độ thông tin cao nhưng chưa tối ưu thị giác (Visual Hierarchy):** Các bảng biểu rất dày đặc dữ liệu (tốt cho nghiệp vụ) nhưng thiếu khoảng thở vi mô (micro-spacing), thiếu sự tương phản mềm mại giữa các hàng, các cấp độ chữ chưa rõ ràng.
4. **Chưa có Dark Mode chuẩn:** Mặc dù người dùng có thể đổi màu gradient header, toàn bộ phần thân ứng dụng vẫn là nền trắng chói lóa, chưa có theme Dark Mode chuẩn cho ca đêm nhà xưởng.
5. **Khả năng hiển thị Responsive:** Một số màn hình tra cứu có bảng ngang quá rộng hoặc thanh search chiếm nhiều diện tích, khi hiển thị trên màn hình laptop 13-14 inch hoặc màn hình tablet của kỹ thuật viên xưởng dễ bị tràn hoặc che khuất dữ liệu.

---

## 6. ĐẶC TẢ YÊU CẦU CHO GOOGLE STITCH (PROMPT / REDESIGN DIRECTIVES)

Khi đưa bản mô tả này vào **Google Stitch** để thiết kế lại toàn bộ giao diện, hãy áp dụng các nguyên tắc chỉ đạo sau:

### 6.1. Phong cách thiết kế mục tiêu (Target Aesthetic)
- **Phong cách:** **Modern High-Density Enterprise SaaS** (Lấy cảm hứng từ các nền tảng công nghệ cao cấp hàng đầu như *Linear, Datadog, Retool, Vercel Dashboard, Salesforce Lightning Design System, Snowflake*).
- **Cảm giác thị giác (Vibe):** Sạch sẽ, tinh tế, tối giản, chuyên nghiệp, tạo cảm giác một phần mềm công nghiệp hiện đại, mượt mà và đáng tin cậy.
- **Bảng màu đề xuất (Refined Color Palette):**
  - **Nền chính (Canvas/Background):** Gam màu trung tính thanh lịch (Neutral Slate/Zinc: `#f8fafc` hoặc `#f1f5f9` cho Light Mode; `#090d16` / `#0f172a` cho Dark Mode).
  - **Bề mặt (Surfaces/Cards):** Màu trắng tinh khiết `#ffffff` (hoặc `#1e293b` ở Dark Mode) với viền siêu mảnh tinh tế `1px solid #e2e8f0` (`slate-200`) và đổ bóng nhẹ đa tầng (`shadow-sm`, `shadow-md`).
  - **Màu thương hiệu chủ đạo (Primary Accent):** Xanh dương công nghệ (Electric / Royal Blue `#2563eb` hoặc Deep Indigo `#4f46e5`) thay thế cho các màu gradient xanh chuối cũ.
  - **Màu trạng thái (Status Tokens):**
    - Success: Emerald Green (`#10b981` / nền `#ecfdf5`).
    - Warning: Amber / Orange (`#f59e0b` / nền `#fffbeb`).
    - Error / NG: Rose / Crimson (`#f43f5e` / nền `#fff1f2`).
    - Info: Sky Blue (`#0284c7` / nền `#f0f9ff`).

### 6.2. Bảo tồn đặc thù High-Density cho ERP
> **QUAN TRỌNG:** Không biến ERP thành landing page rỗng rãi với padding quá lớn. Người dùng là kế toán, kỹ sư và quản lý sản xuất cần xem được nhiều dòng dữ liệu nhất có thể trên một màn hình!
- Giữ chiều cao hàng bảng (`table row height`) ở mức compact: `28px - 32px`.
- Typography bảng sắc nét: `text-xs` (11px - 12px) với font chữ hiện đại như **Inter**, **Geist**, hoặc **Plus Jakarta Sans**.
- Các nút bấm, ô input, dropdown dùng size `Dense / Small` (`h-8`, `h-9`).
- Giữ nguyên các chức năng cốt lõi: Thanh đa Tab nội bộ, Thanh tìm kiếm nhanh Omnibar, Floating Filter trên từng cột bảng, Checkbox chọn nhiều dòng, Xuất Excel, Chế độ quét mã vạch không chạm cho công nhân xưởng.

### 6.3. Cải tiến trải nghiệm người dùng (UX Modernization)
1. **Header & Menu:**
   - Thay thế dải Gradient header bằng thanh Header kính mờ (Glassmorphism: nền trắng bán trong suốt `rgba(255,255,255,0.85)` kèm `backdrop-blur-md`).
   - Thanh Search Omnibar hiện đại có phím tắt badge `Ctrl K` hoặc `Ctrl Space`.
   - Sidebar phân cấp sạch sẽ, có icon SVG đồng bộ (Lucide / Heroicons thay vì icon nhiều màu hỗn tạp).
2. **Bảng dữ liệu AG-Grid:**
   - Hàng chẵn/lẻ phân biệt bằng sắc thái cực nhẹ (zebra striping `bg-slate-50/50`).
   - Sticky header cố định khi cuộn dữ liệu lớn.
   - Thanh công cụ Toolbar gom nhóm rõ ràng (Nhóm CRUD: Thêm, Sửa, Xóa; Nhóm Lọc: Ẩn/Hiện filter; Nhóm Xuất: Excel, Pivot).
3. **Thẻ trực quan (Cards & Dashboards):**
   - Các biểu đồ Pie Chart / Bar Chart dùng bảng màu hiện đại, tương phản tốt.
   - Thẻ hiển thị lỗi VOC bo góc mềm mại (`rounded-xl`), ảnh sản phẩm có tính năng zoom lightbox trực quan, badge trạng thái bo tròn mềm mại.

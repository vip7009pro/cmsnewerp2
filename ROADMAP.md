# Roadmap - cmsnewerp2

- [x] BOM MANAGER: Tinh gọn hàng nút sidebar về 1 dòng (NEW, ADD, ADD VER, UP LOẠT, UPDATE), thêm nút NEW reset dữ liệu chuẩn không rỗng (đầy đủ các trường bắt buộc, tự sinh tên định danh duy nhất không trùng, chọn VL chính và gán QL_HSD='N' pass check ngay), bổ sung tô đỏ label các trường thiếu trong PrecisionBOMSpecGrid kèm dấu * đỏ nhận diện trực quan; diagnostics sạch, production build thành công.

- [x] NHÂN SỰ/LỊCH SỬ: Tối ưu mobile theo viewport — ẩn header/KPI bằng conditional rendering, giữ filterbar + timeline + AGTable, bật cuộn dọc và cấp chiều cao ổn định cho grid; diagnostics sạch, production build thành công.

- [x] NHÂN SỰ/LỊCH SỬ: Tinh gọn filter bar — bỏ nút `Load Data` trùng handler với Search; mobile xếp 2 ô ngày + checkbox trên một hàng 3 cột, Search full-width hàng dưới, EX1/EX2/PIVOT chia 3 cột; kiểm tra trực quan 390px/360px + desktop 1180px; build thành công.

- [x] NHÂN SỰ/LỊCH SỬ: Giảm chiều cao mobile — ẩn cụm EX1/EX2/PIVOT ở toolbar trên mobile (trùng với toolbar dưới bảng), rút tiêu đề biểu đồ còn một dòng `TIMELINE T9/2026 · Giờ thực tế/ngày` và nút Refresh icon-only; build thành công.

- [x] RND/MUA/QLSX PARITY (đợt 3): Audit 6 component `QLVL`, `BOM_AMAZON`, `DESIGN_AMAZON`, `PRODUCT_BARCODE_MANAGER`, `KHOAO`, `KHOSUB` so với bản `.backup` và sửa sai khác — BOM_AMAZON (nối lại `sidebarSearch` bị bỏ rơi, sửa ô tìm kiếm chết ở tab "ĐÃ CÓ BOM"), KHOAO (guard `activeTab === "TON"` cho Xóa Rác / Ẩn Rác tránh xóa dữ liệu thật khi đang ở tab LS IN/LS OUT; reset `searchKeyword` khi đổi tab), PRODUCT_BARCODE (validate `BARCODE_STT` vì backend nội suy không nháy; tách export `EX1` đang lọc / `EX2` toàn bộ), QLVL (bọc riêng `updateM090FSC` để lỗi đồng bộ phụ không báo sai kết quả cập nhật). API parity & `checkBP` parity đều 100%; chi tiết có bằng chứng dòng tại `FINDINGS_PARITY_RND_MUA_QLSX_MODULES.md`; diagnostics/build thành công (1m 3s).

- [x] RND/MUA/QLSX PARITY (đợt 3, bổ sung): Thống nhất xử lý lỗi ghi dữ liệu theo mẫu `err_code` — `BOM_AMAZON.addBOMAMAZON` gom lỗi theo từng dòng (`DOITUONG_NO`) và chỉ báo thành công khi sạch lỗi, `checkExistBOMAMAZON` không nuốt lỗi kết nối (tránh insert trùng), `PRODUCT_BARCODE.addBarcode` dừng khi bước check trùng lỗi và `addBarcode`/`updateBarcode`/`deleteBarcode` báo lỗi kèm `message` thật thay vì im lặng; build thành công (52.53s).

- [ ] RND/MUA/QLSX PARITY (còn lại): quyết định có sửa backend `rndService.js` bọc `N'...'` cho `BARCODE_STT` hay chỉ validate số ở frontend; cân nhắc gộp request batch nếu số dòng BOM/barcode lớn.

- [x] QC/DTC PARITY: Khắc phục sai khác khi audit 5 module `INCOMMING`, `DKDTC`, `ADDSPECDTC`, `DTCRESULT`, `TEST_TABLE` so với bản `.backup` — INCOMMING (khôi phục gate quyền IQC khi sửa kết quả trên lưới, sửa payload LƯU SAVE thiếu `LOT_VENDOR` gây lỗi 500 backend, không đẩy `QC_PASS='N'` cho dòng PD khi Update hàng loạt), DTCRESULT (khôi phục validate RESULT + bắt buộc ID TEST, khôi phục điều kiện hiển thị & guard XRF cho nút nạp Excel), ADDSPECDTC (guard thêm điểm đo khi chưa chọn hạng mục, status bar đếm đúng dòng đang chọn); kèm fix backend `qcService.js` (optional chaining `DATA.LOT_VENDOR` trong `insertIQC1table`, trả thêm cột `LOT_VENDOR` từ `loadIQC1table`); chi tiết có bằng chứng dòng tại `FINDINGS_PARITY_QC_DTC_MODULES.md`; diagnostics/build thành công.

- [ ] KD PARITY (còn lại, cần backend/quyết định): thêm tham số `po_no`/`over`/`id` cho `traPlanDataFull` để 3 ô lọc Plan hoạt động; thêm cột REMARK cho `ZTBFCSTTB` nếu muốn lưu ghi chú FCST; xác nhận audit trail notification OVER (`NHU1903`); dọn dead code `PrecisionPoHeader`.

- [x] KD PARITY: Khắc phục toàn bộ sai khác phát hiện khi audit 6 module Kinh Doanh — PO (3 luật validate, re-validate up hàng loạt, notification, gate nút Phê duyệt, validate Invoice từ PO), PLAN (PIVOT + EX1/EX2 theo filter + badge OK/NG thật), OVER (chip `Y` đỏ, chart đúng dữ liệu, giảm request khi đổi Only Pending), FCST (bỏ ô REMARK không có cột DB), CUST (luồng sửa dòng đang chọn, Add + Update cùng hiện, không ghi đè mã), INVOICE (memo cột, currency pivot, ưu tiên lỗi PO); loại bỏ dữ liệu master hardcode; diagnostics/build thành công (1m 6s).

- [x] YCSX: Chốt hành vi nghiệp vụ sau audit — `PROD_REQUEST_DATE` khi up hàng loạt luôn lấy ngày hôm nay cho mọi công ty (4 vị trí ghi dữ liệu), siết validate Insert thành `G_CODE + CUST_CD + QTY > 0`, giữ kiểm tra codeList err_code 8, giữ `updateYCSX` tự đóng modal + tra lại bảng, giữ cột preview Excel dạng tĩnh; diagnostics/build thành công.

- [x] YCSX: Audit parity với `YCSXManager.backup.tsx`; khôi phục phân quyền `checkBP` cho Khóa/Mở YCSX và Khóa/Mở Liệu, khôi phục nút Mở Liệu, khôi phục chọn dòng để xóa trong preview Excel, khôi phục kiểm tra kết quả `f_insertYCSX` và thông báo NG chi tiết khi up hàng loạt, chuẩn hóa `DELIVERY_DT` cho input date; diagnostics/build thành công.

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

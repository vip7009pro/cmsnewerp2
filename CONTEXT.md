# ERP Context & Status

## Update - 2026-09-27 (QC / TEST_TABLE: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Hạng Mục ĐTC)
- Tạo backup [TEST_TABLE.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/TEST_TABLE.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`) – verify @1280: header 59px, 4 KPI card, 2 panel cạnh nhau (562px + 676px), 2 status bar, 0 khối mobile.
- **Điểm khác biệt của màn này**: desktop là layout **MASTER–DETAIL 2 panel cạnh nhau** (Hạng mục ↔ Điểm đo). Trên mobile KHÔNG xếp dọc (sẽ thành 2 bảng cao 500px nối tiếp) mà chuyển thành **2 tab segmented** [PrecisionTestTableMobileTabs.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionTESTTABLE/PrecisionTestTableMobileTabs.tsx) — mỗi lần chỉ render 1 panel ⇒ bảng được 510px thay vì ~250px.
- **Auto-switch UX**: chạm 1 dòng "Hạng mục" → nạp điểm đo rồi **tự chuyển sang tab Điểm đo** (`handleSelectItemMobile`). Đã verify: active `Hạng mục 30` → click row → `Điểm đo 30`, placeholder/nút chính đổi theo tab.
- Mobile Header [PrecisionTestTableMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionTESTTABLE/PrecisionTestTableMobileHeader.tsx): brand + count "HM" + điểm đo + toggle KPI + reload (51px).
- Mobile Toolbar [PrecisionTestTableMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionTESTTABLE/PrecisionTestTableMobileToolbar.tsx): **1 toolbar dùng chung cho cả 2 tab** — search 16px chống zoom iOS + clear, nút chính đổi nhãn/màu (`+ Hạng mục` emerald ↔ `+ Điểm đo` indigo, disable khi chưa chọn hạng mục), pills Excel/Tải lại/Lọc cột/Đặt lại.
- Micro-KPI compact: prop `compact` trên [PrecisionTestTableKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionTESTTABLE/PrecisionTestTableKpi.tsx) → 4 chip 2 cột × 2 dòng (89px), mặc định ẩn.
- Panel nhận prop `isMobile` + `showFilter`: nhánh mobile bỏ `__panelHeader` (title/nút/context banner/ô search) và `__statusBar` ⇒ tránh lặp 2 ô search & tiết kiệm ~130px. Modal Add Test Item/Point **không cần sửa** (đã responsive, verify @393: card 361×401 nằm trọn viewport).
- **PITFALL đã xử lý — text vỡ 1 ký tự/dòng trong mobile header**: `.brand-title > span:first-child` có `overflow: hidden` ⇒ automatic min-size của flex item bị hạ về **0**, mà span thiếu `white-space: nowrap` nên co còn 0px và bị bóp thành cột dọc. Fix: thêm `min-width:0; white-space:nowrap` cho span, `width:100%; overflow:hidden` + `> span { white-space:nowrap }` cho `.brand-meta`.
- **PITFALL đã xử lý — trang DTC cắt cụt nội dung mobile ở viewport thấp**: `DTC.scss` khoá `.dtc > .tabs-container > .tab-content > .tab-pane { height:100%; overflow:hidden }` bằng `!important` (block `@media 5000px`) ⇒ module con đặt `height:auto!important` vẫn bị tổ tiên cắt (đo được document chỉ cao 600px trong khi `innerHeight` 637 ⇒ đáy bảng + bottombar không tới được). Fix: điền vào block `@media (max-width:768px)` **đã có sẵn nhưng rỗng** trong `DTC.scss`, mở khoá `height:auto / flex:0 0 auto / overflow:visible` cho cả 4 tầng — **khôi phục đúng ý định sẵn có của `MyTab.scss`** (mobile đã set `min-height:100vh; overflow:visible`), không thêm hành vi mới.
- Verify @393×850: header 51px → tabs 47px → toolbar 98px → bảng **510px** (AG Grid 356px), `tableBottom 837 <= 850` nằm trọn viewport, `bodyOverflowX = 0`, 0 pill bị cắt nhãn. Build production PASS.

## Update - 2026-09-27 (QC / DTCRESULT: Tối Ưu Toàn Diện Giao Diện Mobile Nhập Kết Quả Đo ĐTC)
- Tạo backup [DTCRESULT.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/DTCRESULT.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- **Không có bộ lọc nhiều trường** (chỉ 1 ô search lọc realtime) ⇒ KHÔNG dựng FilterDrawer. Chỗ tốn diện tích thật là **thẻ ControlCard nhập liệu** (170px) + KPI (65px) + gridToolbar (99px) + statusBar (24px).
- Mobile Header [PrecisionDTCResultMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDTCRESULT/PrecisionDTCResultMobileHeader.tsx): brand (icon + "NHẬP KQ ĐTC") + dòng meta (số điểm đo đã lọc/tổng + badge hạng mục test) + 3 nút 38px (KPI toggle / Phiếu / Reload).
- Mobile Toolbar [PrecisionDTCResultMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDTCRESULT/PrecisionDTCResultMobileToolbar.tsx): hàng 1 = ô search 16px chống zoom iOS + clear `[X]` + nút Phiếu; hàng 2 = pills cuộn ngang (+ Mẫu / EX1 / EX2 / PIVOT / Lọc cột / Đặt lại).
- **Bottom-Sheet "PHIẾU NHẬP KẾT QUẢ ĐO"** [PrecisionDTCResultRecordSheet.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDTCRESULT/PrecisionDTCResultRecordSheet.tsx): Zero-Blur, chứa lại toàn bộ form desktop (switch ID TEST/LOT NVL, ô nhập + nút tra cứu, context pill vật liệu, Remark, nạp Excel XRF + Up hàng loạt, hạng mục test) ⇒ footer LƯU neo đáy (`flex-shrink: 0`), body tự cuộn.
- Micro-KPI compact: prop `compact` trên [PrecisionDTCResultKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDTCRESULT/PrecisionDTCResultKpi.tsx) → 4 ô × 2 dòng, mặc định ẩn để nhường chỗ bảng.
- Bảng mobile bỏ hẳn `__gridToolbar` + `__statusBar` (search đã ở MobileToolbar, count đã ở MobileHeader) ⇒ gridContainer 297px → **464px** (+56%). File chính [DTCRESULT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/DTCRESULT.tsx).
- **PITFALL đã xử lý — brand bị badge bóp hẹp**: `brand-meta` chứa text dài (`0 / 0 điểm đo`) có `white-space: nowrap` ⇒ min-content của nó chặn co, ép `brand-title` xuống còn 70–74px (vỡ/cắt chữ ở 320–360px). Fix: chuyển badge hạng mục xuống hàng meta, cho title chỉ 1 dòng, và ẩn nhãn chữ của nút header (`.btn-label`) trong `@media (max-width: 350px)` để chỉ giữ icon.
- Root mobile bắt buộc `height:auto!important; max-height:none!important; flex:0 0 auto!important; overflow:visible!important` vì `.component_element &` + `.dtc .precision-dtcresult` (DTC.scss) khóa cứng `height:100% / flex:1 1 auto`.
- Verify @320/360/393/430/768: `bodyOverflowX = 0`, 0 nhãn bị cắt; sheet bottom 850 = innerHeight, nút LƯU `bottom 840 < 850`; `backdropFilter = none`. Desktop @1440 giữ nguyên (header 48px, ControlCard 100px, 4 KPI card, gridToolbar 39px, statusBar 24px). Build production PASS.

## Update - 2026-09-27 (QC / DKDTC: Fix modal Quét Mã bị Bottom-Sheet che)
- Triệu chứng: trong Phiếu Đăng Ký (mobile bottom-sheet), bấm nút quét mã (LOT NVL / LOT NCC) thì modal quét nằm **phía dưới** sheet ⇒ không quét được.
- **Nguyên nhân**: `UniversalScannerModal` là MUI `Dialog` (dùng portal) với z-index mặc định của MUI = **1300**, trong khi `.precision-dkdtc-drawer-overlay` đặt **z-index: 10000** ⇒ sheet luôn thắng. Lưu ý đây KHÔNG phải lỗi DOM order (portal render ra `body` sau `#root`) mà là so sánh z-index giữa 2 stacking context cùng cấp.
- **Fix**: thêm prop tuỳ chọn `zIndex` vào `UniversalScannerModal` (truyền `slotProps.root.sx.zIndex`, API MUI v7) — mặc định bỏ trống thì giữ nguyên 1300. `PrecisionDKDTCScannerModal` truyền `zIndex={13000}` (lớn hơn 10000 của drawer).
- Verify @393: `elementFromPoint` tại tâm màn hình trả về `.universal-scanner__reader-box`, `modalRootZ = 13000`, `scannerOnTop = true`; đóng scanner thì sheet vẫn mở nguyên. Build PASS.
- ⚠️ Chỉ `DKDTC` gọi scanner từ **trong** drawer ⇒ 2 caller khác (`PrecisionLineQc`, `PrecisionDataSampleSx`) render scanner ở cấp trang nên không bị. Nếu sau này có module khác mở scanner từ drawer/bottom-sheet thì dùng lại prop `zIndex` này.

## Update - 2026-09-27 (QC / DKDTC: Tối Ưu Toàn Diện Giao Diện Mobile Đăng Ký Test ĐTC)
- Tạo backup `DKDTC.backup2.tsx` + `PrecisionDKDTC.backup2.scss`. Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Header [PrecisionDKDTCMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDKDTC/PrecisionDKDTCMobileHeader.tsx): brand + badge IQC/PQC + count dòng + toggle KPI + nạp lại.
- Micro-KPI compact [PrecisionDKDTCKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDKDTC/PrecisionDKDTCKpi.tsx): prop `compact` → 4 ô 2 dòng (mặc định ẩn để nhường chỗ bảng).
- Mobile Toolbar [PrecisionDKDTCMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDKDTC/PrecisionDKDTCMobileToolbar.tsx): search 16px chống zoom iOS + clear; pills cuộn ngang EX1/EX2/PIVOT/Lọc cột/Nạp lại/Đặt lại; nút mở Phiếu ĐK.
- **Bottom-Sheet Phiếu Đăng Ký** [PrecisionDKDTCRegisterSheet.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDKDTC/PrecisionDKDTCRegisterSheet.tsx): Zero-Blur, **tái sử dụng nguyên `PrecisionDKDTCSidebar`** (form 8 trường + quét mã) ⇒ nút ĐĂNG KÝ neo đáy (verify @393: bottom 842 < 850, không bị thanh URL che).
- Bảng mobile bỏ hẳn `__gridToolbar` (search đã ở MobileToolbar) ⇒ AG grid 484px. File chính [DKDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/DKDTC.tsx).

## Update - 2026-09-27 (QC / ADDSPECDTC: Fix nút đáy Bottom-Sheet Config bị "chìm")
- Triệu chứng: sau khi refactor mobile, bấm nút Config thì hàng nút dưới cùng của bottom sheet (`Đóng` / `LOAD & Đóng`) bị thanh địa chỉ trình duyệt mobile che mất.
- **Nguyên nhân 1**: `.addspecdtc-drawer-overlay` dùng `position: fixed; inset: 0` ⇒ neo theo **layout viewport** (đáy nằm sau thanh URL). Fix: `height: 100vh` → `height: 100dvh` (dòng `vh` làm fallback) để neo theo **visual viewport**.
- **Nguyên nhân 2**: `.addspecdtc-drawer` là flex-column + `overflow: hidden` nhưng `.drawer-header` mất `flex-shrink: 0`, nên khi body dài header bị bóp và đẩy footer khỏi sheet. Fix: `flex-shrink: 0` cho `.drawer-header` và `.drawer-footer`, `flex: 1 1 auto; min-height: 0; overscroll-behavior: contain` cho `.drawer-body`.
- Phụ: `.drawer` dùng `max-height: 88dvh`; `.drawer-footer` thêm `padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px))` né thanh home iOS.
- Verify 380/430/520/640/740/850px: nút Đóng & LOAD đều nằm trọn trong viewport (`pxBelowViewport = 0`). Build production PASS. File [PrecisionADDSPECDTC.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionADDSPECDTC/PrecisionADDSPECDTC.scss).
- ⚠️ Cùng pattern overlay `inset: 0` + `.drawer-body { flex: 1 }` còn lặp ở ~40 drawer mobile khác (`PrecisionSPECDTC`, `PrecisionKQDTC`, `PrecisionKHOLIEU`, `PrecisionQLVL`, `PrecisionTinhLieu`, `PrecisionPOandStockFull`…) — nếu gặp lỗi tương tự thì áp cùng 2 fix.

## Update - 2026-09-27 (QC / ADDSPECDTC: Tối Ưu Toàn Diện Giao Diện Mobile Thêm SPEC ĐTC)
- Tạo [ADDSPECDTC.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/ADDSPECDTC.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Toolbar 3 hàng [PrecisionADDSPECDTCMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionADDSPECDTC/PrecisionADDSPECDTCMobileToolbar.tsx): Search chống zoom iOS (14px), nút clear `[X]`, Config trigger, NVL/SP toggle, Save, cuộn ngang (EX1/EX2/PIVOT/+Điểm Đo/Xóa).
- Bottom-Sheet Config Drawer Zero-Blur [PrecisionADDSPECDTCMobileConfigDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionADDSPECDTC/PrecisionADDSPECDTCMobileConfigDrawer.tsx): Chứa toàn bộ Sidebar (Autocomplete code/NVL, Test select, Load/Add/Update, Copy XRF, Matrix checklist).
- AGTable chiếm trọn không gian còn lại (`flex: 1 1 0; min-height: 0`). Mobile Status Bar. File chính [ADDSPECDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/ADDSPECDTC.tsx).

## Update - 2026-09-27 (QC / SPECDTC: Tối Ưu Toàn Diện Giao Diện Mobile Tiêu Chuẩn Kỹ Thuật ĐTC)
- Mobile Header, Micro-KPI, Toolbar 3 hàng, Filter Drawer. File chính [SPECDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/SPECDTC.tsx).

## Update - 2026-09-27 (QC / KQDTC: Tối Ưu Toàn Diện Giao Diện Mobile Kiểm Tra Độ Tin Cậy & Biểu Đồ SPC)
- Mobile Header, Micro-KPI, Toolbar 3 hàng, Filter Drawer, SPC Charts Modal. File chính [KQDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/KQDTC.tsx).

## Update - 2026-09-27 (KHO / KHOLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Kho Liệu)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. File chính [KHOLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/KHOLIEU.tsx).

## Update - 2026-09-27 (MUA HANG / TINHLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Tính Liệu MRP)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. File chính [TINHLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/TINHLIEU.tsx).

## Update - 2026-09-27 (MUA HANG / QLVL: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Vật Liệu)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. File chính [QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx).

## Update - 2026-09-27 (SHARED / SCANNER: Tối Ưu Toàn Diện Giao Diện Cyberpunk High-Density SCSS)
- SCSS độc lập, Viewfinder HUD, Modal. File chính [UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx).

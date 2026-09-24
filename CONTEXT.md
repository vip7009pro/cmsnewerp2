# ERP Context & Status

## Update - 2026-09-24 (CUST_MANAGER: Sửa modal đối tác đóng ngoài ý muốn khi vuốt chuột & tô đỏ nhãn trường trống/null)
- **1. Sửa hiện tượng đóng modal khi nhấn giữ và vuốt chuột ra ngoài ([PrecisionCustModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustModal.tsx))**:
  * Root cause: DOM event `click` kích hoạt trên overlay cha chung khi mousedown trong modal-box và mouseup ngoài overlay.
  * Khắc phục: Sử dụng `mouseDownTarget = useRef<EventTarget | null>(null)` trên `precision-cust__modalOverlay`. Chỉ gọi `onClose()` khi `e.target === e.currentTarget && mouseDownTarget.current === e.currentTarget` (chủ động click trực tiếp vào vùng mờ overlay ngoài modal).
- **2. Tô đỏ Label các trường trống/null ([PrecisionCustModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustModal.tsx) & [PrecisionCustManager.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustManager.scss))**:
  * Thêm helper `isFieldEmpty(val)` nhận diện giá trị trống, `null`, `undefined`, chuỗi rỗng `""`, chuỗi `"undefined"`, `"null"`.
  * SCSS `.field-label--invalid`: Chuyển màu chữ sang đỏ cảnh báo `#dc2626`, font đậm `800`, tự động hiển thị dấu `*` đỏ nổi bật.
  * Áp dụng đồng bộ cho tất cả 16 trường: Phân loại, Mã đối tác, Tên viết tắt, Tên pháp nhân, Mã số thuế, Trạng thái, Người đại diện, SĐT di động, SĐT cố định, Fax, Email, 3 địa chỉ (trụ sở, xưởng 2, kho 3), Mã bưu chính, Ghi chú.
- **3. Xác thực build**: Chạy `npm run build` thành công (`code 0`), 0 lỗi.

## Update - 2026-09-24 (QLVL: Sửa modal đóng ngoài ý muốn khi vuốt chuột & tô đỏ nhãn trường trống/null)
- **1. Sửa modal đóng ngoài ý muốn ([CustomDialog.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Dialog/CustomDialog.tsx))**: Dùng `mouseDownTarget` chỉ đóng khi chủ động click trực tiếp vào overlay; giải quyết cho cả Modal Thêm/Sửa Vật Liệu ([PrecisionQLVLAddModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLAddModal.tsx)) và Modal Hồ sơ Kỹ thuật (VLDOC) trong [QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx).
- **2. Tô đỏ Label các trường trống/null ([PrecisionQLVLAddModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLAddModal.tsx) & [PrecisionQLVL.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVL.scss))**: Áp dụng class `.qlvl-form-label--invalid` cho 11 trường; cho phép xóa trắng input số thời gian thực.
- **3. Chuẩn hóa payload ([QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx))**: Cast số an toàn, validate M_NAME. Build production thành công.

## Update - 2026-09-23 (BOM MANAGER: Tinh gọn sidebar 1 dòng, nút NEW chuẩn không rỗng & tô đỏ nhãn trường thiếu)
- **Sidebar 1 dòng ([PrecisionBOMSidebar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMSidebar.tsx))**: Chuyển 5 nút `NEW`, `ADD`, `ADD VER`, `UP LOẠT`, `UPDATE` vào 1 hàng ngang duy nhất compact, font 8.5px.
- **Nút NEW chuẩn & Check BOM ([useBOMManagerData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/useBOMManagerData.ts), [PrecisionBOMSpecGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMSpecGrid.tsx))**: Tự sinh mã `ITEM_YYMMDD_HHmmss`, gán `QL_HSD='N'`, tô đỏ nhãn thiếu thông tin.

## Update - 2026-09-22 (AUTH: Fix màn hình trắng khi Logout + làm chắc cơ chế login/logout)
- **Fix Suspense/ErrorBoundary ([App.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/App.tsx))**: Bọc `<Login />` trong `<Suspense fallback={<AppBootScreen />}>` + warm-up chunk sau khi boot.
- **Api.ts & ErrorBoundary**: Cờ `loggingOut` chống logout lặp, auto reload 1 lần/15s khi lỗi chunk. Build production thành công.

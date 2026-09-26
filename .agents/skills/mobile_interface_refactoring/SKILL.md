---
name: mobile_interface_refactoring
description: Quy trình tự động refactor tối ưu hóa giao diện ERP cho Mobile bằng Viewport Conditional Rendering, giữ nguyên 100% giao diện Desktop, cô đọng thanh công cụ thành ô search + bảng dữ liệu, chuyển filter nhiều trường sang Floating Filter Bar, và tối ưu công thái học di động.
trigger: user_tag_or_mobile_refactor_request
---

# SKILL: REFACTOR GIAO DIỆN ERP CHO MOBILE (MOBILE INTERFACE REFACTORING)

## 📌 MỤC TIÊU VÀ TƯ TƯỞNG CỐT LÕI
Skill này thiết lập quy trình tự động hóa 100% để biến bất kỳ màn hình ERP desktop nào thành một phiên bản **cực kỳ tối ưu trên thiết bị di động (Mobile-First ERP)**, trong khi **bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop hiện có**.

Khi người dùng tag `@mobile_interface_refactoring` kèm file cần refactor (ví dụ: `@CODE_MANAGER.tsx` hoặc `@PlanManager.tsx`), Agent sẽ lập tức tiến hành refactor theo quy trình chuẩn bên dưới một cách tự động, chuẩn xác và báo cáo kết quả ngắn gọn, không giải thích dài dòng.

---

## ⚡ 6 QUY TẮC BẮT BUỘC (NON-NEGOTIABLE RULES)

### 1. BẢO TOÀN GIAO DIỆN DESKTOP & SAO LƯU ĐẦU TIÊN
- **Giữ nguyên 100% desktop**: Không làm thay đổi layout, khoảng cách, font chữ, hành vi hay component trên Desktop (> 768px).
- **Sao lưu bắt buộc**: Luôn tạo bản sao lưu `[ComponentName].backup.tsx` tại cùng thư mục trước khi sửa đổi bất kỳ dòng code nào.
- **Bảo toàn 100% Logic & State**: Giữ nguyên toàn bộ React state, hooks, API queries, form inputs, validation, event handlers và tính năng xuất dữ liệu (Excel `EX1`, `EX2`, `PIVOT`...).

### 2. PHƯƠNG THỨC: VIEWPORT CONDITIONAL RENDERING
- Sử dụng hook nhận diện viewport chuẩn của dự án:
  ```tsx
  import useIsMobile from "src/components/Navbar/AccountInfo/useIsMobile";
  // Hoặc dùng hook nội bộ chuẩn:
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);
  ```
- **Conditional Rendering dứt khoát**:
  - Dùng `{!isMobile && <DesktopComponent />}` để ngắt hoàn toàn việc render DOM các khối chỉ dùng cho desktop (SubHeader banner, KPI cards, bảng phụ, thanh công cụ cồng kềnh).
  - Tránh chỉ dùng `display: none` trong CSS với các component nặng — phải dùng Conditional Rendering trong JSX để giải phóng bộ nhớ và CPU cho điện thoại di động.

### 3. TỐI ĐA HÓA KHÔNG GIAN BẢNG DỮ LIỆU TRÊN MOBILE
- **Triết lý không gian**: Trên màn hình điện thoại (chiều rộng 360px - 430px, chiều cao có hạn do bàn phím và thanh điều hướng trình duyệt), diện tích quý giá nhất phải dành cho **Bảng Dữ Liệu (AGTable / Grid)**.
- **Những thứ PHẢI ẨN trên mobile**:
  - Ẩn Sub-Header banner, breadcrumb rườm rà.
  - Ẩn KPI Cards / Metrics Dashboard lớn.
  - Ẩn các nút hành động ERP ít dùng hoặc chuyên sâu (chuyển vào menu phụ hoặc giữ ở desktop).
- **Những thứ ĐƯỢC GIỮ trên mobile toolbar**:
  - Ô nhập tìm kiếm chính (mã, từ khóa, tên).
  - Nút tìm kiếm (icon kính lúp + text ngắn).
  - Checkbox lọc nhanh (ví dụ: `Active`, `CNDB`) dạng Pill/Chip gọn gàng.
  - Nút mở bộ lọc nâng cao (Floating Filter Button) nếu có nhiều trường lọc.
  - Nút tiện ích xuất/phân tích nhanh (`EX1`, `EX2`, `PIVOT`) bố trí cuộn ngang 1 dòng (`overflow-x: auto`).

### 4. FLOATING FILTER BAR / DRAWER CHO BỘ LỌC NHIỀU TRƯỜNG
- Khi màn hình có form filter nhiều trường (từ ngày, đến ngày, nhà máy, xưởng, công đoạn, phân loại, khách hàng...):
  - **Trên Desktop**: Giữ nguyên toolbar đầy đủ hoặc bộ lọc dạng lưới đa cột.
  - **Trên Mobile**: Thu gọn toàn bộ thành **Floating Filter Bar** nhỏ gọn gắn ở đầu hoặc cuối bảng:
    - Hiển thị: `[ Ô Search ] [ Nút Tìm ] [ 🔘 Nút Bộ Lọc (badge số điều kiện) ]`
    - Khi bấm `Bộ Lọc`: Mở một **Bottom Sheet / Drawer / Slide-over Modal** che từ dưới lên (hoặc full modal sạch sẽ).
    - Bên trong Bottom Sheet: Chứa toàn bộ các ô chọn ngày, dropdown nhà máy, checkbox... với nút **"Đặt lại"** và **"Áp dụng (Xác nhận)"**.
    - Khi người dùng bấm "Áp dụng", đóng drawer và trigger tìm kiếm dữ liệu.

### 5. CÔNG THÁI HỌC DI ĐỘNG & ERGONOMICS (MOBILE UX CHUYÊN SÂU)
- **Touch Targets >= 38px - 44px**: Mọi nút bấm, input, select và icon có diện tích bấm tối thiểu 38px để ngón tay chạm chính xác, không bấm nhầm.
- **Chống Zoom Tự Động Trên iOS Safari**: Font-size của input/select trên mobile phải đạt tối thiểu `14px - 16px` (không dùng `11px` như desktop), tránh Safari tự động phóng to màn hình làm lệch giao diện.
- **Input Search Thông Minh**: Bổ sung nút xóa nhanh `[X]` (Clear button) bên trong ô search khi có nội dung; hỗ trợ sự kiện `Enter` để kích hoạt tìm kiếm ngay trên bàn phím ảo.
- **Xử Lý Cuộn Bảng Dữ Liệu**:
  - Bảng AGTable phải được bao bọc trong container `overflow: hidden` hoặc `overflow-x: auto` với `-webkit-overflow-scrolling: touch`.
  - Giữ cố định cột mã/tên quan trọng (`pinned: 'left'`) nếu cần.
- **Không Gây Vỡ Layout Do Bàn Phím Ảo**: Sử dụng `height: 100%` và `flex: 1` kết hợp `min-height: 0` thay cho fixed `100vh` cứng nhắc.

### 6. ZERO BLUR & HIỆU NĂNG TỐI ĐA (DỰ ÁN ERP CHUẨN)
- **Tuyệt đối KHÔNG sử dụng `backdrop-filter: blur(...)`**: Tuân thủ triệt để quy tắc hiệu năng dự án — GPU điện thoại rất yếu, blur trên nền bảng hàng nghìn dòng sẽ gây giật lag hoặc treo trình duyệt.
- Dùng màu nền tối đặc `rgba(15, 23, 42, 0.75)` hoặc nền đặc `#ffffff` cho các popups, drawers và floating bars.
- Bọc các hàm xử lý bằng `useCallback`, dữ liệu tính toán bằng `useMemo`.

---

## 📐 CẤU TRÚC GIAO DIỆN CHUẨN MOBILE ERP

### 1. Cấu trúc JSX Mẫu (Conditional Rendering)
```tsx
return (
  <div className={`precision-module ${isMobile ? "is-mobile" : ""}`}>
    {/* 1. CHỈ RENDER TRÊN DESKTOP */}
    {!isMobile && <PrecisionModuleHeader />}
    {!isMobile && <PrecisionModuleKpi data={data} />}

    {/* 2. TOOLBAR THÍCH ỨNG: Tự co gọn trên Mobile */}
    <PrecisionModuleToolbar
      isMobile={isMobile}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onSearch={handleSearch}
      onOpenFilterDrawer={() => setShowMobileFilter(true)}
      activeFilterCount={activeFilterCount}
      /* các props khác */
    />

    {/* 3. BẢNG DỮ LIỆU: TỐI ĐA HÓA KHÔNG GIAN CẢ DESKTOP & MOBILE */}
    <div className="precision-module__gridContainer">
      <AGTable columns={columns} data={filteredData} />
    </div>

    {/* 4. FLOATING FILTER DRAWER (CHỈ HIỂN THỊ TRÊN MOBILE KHI MỞ) */}
    {isMobile && showMobileFilter && (
      <PrecisionModuleMobileFilterDrawer
        isOpen={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        /* filter states */
      />
    )}
  </div>
);
```

### 2. Cấu trúc SCSS Mẫu Cho Mobile Toolbar & Floating Bar
```scss
.precision-module {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  // Khi đang ở chế độ Mobile
  &.is-mobile {
    padding: 4px;
    gap: 4px;

    .precision-module__toolbar {
      padding: 6px 8px;
      gap: 6px;

      // Hàng tìm kiếm chính
      .toolbar-main-row {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;

        .search-input-box {
          flex: 1;
          height: 38px;
          font-size: 14px;
        }

        .btn-search {
          height: 38px;
          padding: 0 12px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .btn-filter-trigger {
          height: 38px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 6px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          font-size: 13px;
          font-weight: 600;
        }
      }

      // Hàng nút thao tác cuộn ngang (EX1, EX2, PIVOT, Chips)
      .toolbar-action-scroll {
        display: flex;
        align-items: center;
        gap: 6px;
        overflow-x: auto;
        white-space: nowrap;
        padding-bottom: 2px;
        scrollbar-width: none; // ẩn scrollbar cho gọn
        &::-webkit-scrollbar { display: none; }
      }
    }

    // Grid container chiếm trọn phần diện tích còn lại
    .precision-module__gridContainer {
      flex: 1 1 auto;
      min-height: 0;
      height: 100%;
    }
  }
}
```

---

## 🚀 QUY TRÌNH THỰC THI 4 BƯỚC CỦA AGENT (DIRECT & FAST)

Khi nhận yêu cầu refactor một file (ví dụ `@FileName.tsx`):

### Bước 1: Tiếp nhận & Tạo File Sao Lưu Ngay Lập Tức
- Tạo file sao lưu: `[FileName].backup.tsx` giữ 100% nội dung nguyên bản.
- Đọc nội dung file mục tiêu, xác định:
  - Các khối UI nào là Desktop-only (Headers, KPI, banners lớn).
  - Danh sách các trường filter (Nếu > 3 trường -> áp dụng Floating Filter Bar / Drawer).
  - Bảng dữ liệu chính (AGTable / DevExtreme).

### Bước 2: Tích Hợp Viewport Hook & Conditional Rendering
- Thêm `useIsMobile()` hoặc `window.matchMedia("(max-width: 768px)")`.
- Bọc các khối rườm rà trong `{!isMobile && <Component />}` để Desktop hoàn toàn không bị ảnh hưởng.
- Tinh gọn thanh Toolbar cho mobile:
  - Gom ô search chính + nút tìm kiếm lên hàng đầu.
  - Chuyển các checkbox sang chip toggle nhỏ gọn.
  - Gom các nút xuất file (`EX1`, `EX2`, `PIVOT`) vào dải cuộn ngang mượt mà.

### Bước 3: Tạo Floating Filter Bar / Drawer (Nếu có bộ lọc nâng cao)
- Tách một component Drawer/Modal phụ (dưới 250 dòng) chứa toàn bộ các dropdown, datepicker, radio filter.
- Thiết kế Bottom Sheet trượt mượt mà, có backdrop đặc `#0f172a` (opacity 0.75, ZERO blur), nút Đóng `[X]`, nút "Đặt lại" và nút "Áp dụng".

### Bước 4: Kiểm Tra Compile & Báo Cáo Ngắn Gọn
- Đảm bảo không phát sinh lỗi TypeScript/Lint, không làm vỡ logic state ban đầu.
- Module hóa các sub-component nếu file vượt quá 300 dòng theo quy tắc dự án.
- Cập nhật `CONTEXT.md` và `ROADMAP.md` (giữ tối đa 80 dòng).
- Báo cáo ngắn gọn cho người dùng:
  - Xác nhận file backup đã tạo.
  - Tóm tắt các thành phần đã tối ưu cho mobile (ẩn header/kpi, tinh gọn toolbar, floating filter drawer).
  - Xác nhận giao diện desktop giữ nguyên 100%.

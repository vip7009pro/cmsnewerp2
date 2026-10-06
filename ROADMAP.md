# Roadmap - cmsnewerp2

- [x] QLSX / LONGTERM_PLAN: Chuyển đổi biểu đồ Capa kế hoạch dài hạn sang hiển thị động theo danh sách dòng máy ([LONGTERM_PLAN.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.tsx), [PrecisionLongTermCapaSection.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermCapaSection.tsx), [useLongTermPlanData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/useLongTermPlanData.ts)) — Tải danh sách máy qua `f_getMachineListData()`, tự động loại bỏ 'NA', 'NO', 'ALL'; sinh tab và executive cards động theo danh sách dòng máy (FR, SR, DC, ED, SP, IN...), hỗ trợ xem tất cả hoặc từng dòng máy riêng biệt và xuất Excel dữ liệu Capa theo từng công đoạn.
- [x] SHARED / RECHARTS: Khắc phục triệt để warning *"The width(0) and height(0) of chart should be greater than 0..."* trên toàn hệ thống ([CustomResponsiveContainer](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/services/utilService.tsx), [SXPlanLossTrend.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/SX/SXPlanLossTrend.tsx), [PrecisionSxReport.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOSX/PrecisionSxReport/PrecisionSxReport.scss)) — Bổ sung `minWidth={0}`, `minHeight={250}`, `flex: 1` và `position: relative` vào container cha, loại bỏ hoàn toàn hiện tượng 0-dimension khi Recharts mount trong flexbox / multi-tab.
- [x] QLSX / CAPA: Chuyển biểu đồ Production Lead Time Từng Dòng Thiết Bị sang cột ngang (Horizontal Bar Chart) cho [CAPASX2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/CAPASX2.tsx) ([PrecisionCapaSx2LeadTimeCharts.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2LeadTimeCharts.tsx)) — Cấu hình Recharts BarChart layout="vertical", hiển thị nhãn giá trị ngày trực tiếp bên phải thanh bar (LabelList), phân tách rõ rệt Lead Time Thực Tế (đỏ) và Lead Time Đăng Ký (xanh lá).
- [x] QLSX / CAPA: Bổ sung trọn vẹn biểu đồ Delivery Plan Lead Time (`Delivery Plan Capa / Lead Time Chart`) cho [CAPASX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/CAPASX.tsx) ([PrecisionCapaSxDeliveryLeadTimeCharts.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx/PrecisionCapaSxDeliveryLeadTimeCharts.tsx)) — Khắc phục việc thiếu hiển thị `dlleadtime`, nâng cấp `getDeliveryLeadTime` độc lập dữ liệu nhân sự điểm danh, biểu đồ Recharts ComposedChart (Bar Leadtime + Line 12H + Line 8H) hỗ trợ xem đa máy / đơn máy và xuất Excel; hiển thị tối ưu ở cả tab Lead Time, Plans và All.



- [x] EMAIL / MODULE EMAIL TẬP TRUNG: Tối ưu Mobile — viewport conditional rendering ([MailDock.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Mail/MailDock.tsx), [MailMobileBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Mail/MailMobileBar.tsx), [MailMobileDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Mail/MailMobileDrawer.tsx), [mail.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Mail/mail.scss)) — Nhánh `isMobile` = app bar + tìm kiếm thu gọn + FAB soạn thư; cột thư mục bottom sheet `.erp-mail__mSheet*`; dialog con `fullScreen={isMobile}`; desktop giữ nguyên 100%.

- [x] QC / IQC / NCR_MANAGER (MASTER→DETAIL mobile): Tap 1 dòng NCR ⇒ Ảnh Lỗi + bảng Holding hiện ngay dưới bảng và tự cuộn xuống xem chi tiết ([NCR_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/NCR_MANAGER.tsx), [PrecisionNCR.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionNCR/PrecisionNCR.scss)).

- [x] QC / IQC / NCR_MANAGER: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Quản Lý Biên Bản Bất Thường NCR ([NCR_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/NCR_MANAGER.tsx)).

- [x] QC / IQC / BLOCK & HOLDING: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Quản Lý Lô Bị Khóa & Vật Liệu Holding ([BLOCK.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/BLOCK.tsx), [HOLDING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/HOLDING.tsx)).

- [x] QC / DTC (TEST_TABLE, DTCRESULT, DKDTC, SPECDTC, KQDTC): Tối ưu Mobile toàn diện (Segmented Tabs, Bottom-Sheet, Filter Drawers Zero-Blur).

- [x] KHO / KHOLIEU & MUA HANG / TINHLIEU, QLVL: Tối ưu Mobile (Header, Micro-KPI, Toolbar, Filter Drawer).

- [x] SHARED / SCANNER: Xây dựng Universal Barcode & QR Code Scanner chuẩn Enterprise ([UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx)).

- [x] SX / DATASAMPLE, KPI_NV, MAINDEFECTS, PATROL, DAOFILM, ROLL, CHOT: Tối ưu Mobile hàng loạt màn hình xưởng sản xuất.

- [x] QLSX / ACHIVEMENTTB, KHOAO, EQ_STATUS, PLAN_STATUS, DATASX, LICHSUINPUTLIEU, PLAN_TABLE, LONGTERM_PLAN: Tối ưu Mobile chuẩn Stitch Enterprise.

- [x] SKILL / MOBILE INTERFACE REFACTORING: Xây dựng Skill chuẩn dự án [SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md).

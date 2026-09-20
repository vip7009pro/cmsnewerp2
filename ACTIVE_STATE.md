# ACTIVE_STATE

## Mục tiêu task hiện tại
Rà soát parity các module QC/IQC so với bản `.backup` và sửa sai khác logic + cải tiến điểm bất hợp lý.

- Đợt 1 (đã xong): `INCOMMING`, `DKDTC`, `ADDSPECDTC`, `DTCRESULT`, `TEST_TABLE`.
- Đợt 2 (đã xong): `HOLDING`, `FAILING`, `BLOCK`, `NCR_MANAGER`.

Trạng thái: **HOÀN THÀNH** (audit + fix + build pass). Chi tiết: `FINDINGS_PARITY_QC_DTC_MODULES.md`.

## File đã chỉnh sửa (đợt 2)
- `src/pages/qc/iqc/PrecisionFAILING/useFailingData.ts` — khôi phục gate `checkBP(["QC"])` cho nghiệp vụ Xuất kho; thêm `handleLotKeyDown` (Enter + luật PQC3); `checkPlanID` xoá `G_NAME` khi mã chỉ thị < 7 ký tự.
- `src/pages/qc/iqc/PrecisionFAILING/PrecisionFailingFormIn.tsx`, `PrecisionFailingSidebar.tsx`, `FAILING.tsx` — nối prop `onLotKeyDown`.
- `src/pages/qc/iqc/PrecisionBLOCK/useBlockData.ts` — sửa export Excel cột `PLSP`; guard `NCR_ID !== 0` cho `updateNCRIDBlocking`.
- `src/pages/qc/iqc/PrecisionBLOCK/PrecisionBLOCKColumns.tsx` — thêm lại cột `USE_YN`.
- `src/pages/qc/iqc/PrecisionHOLDING/useHoldingData.ts` — chặn `Update Reason` khi REASON rỗng.
- `src/pages/qc/iqc/PrecisionNCR/PrecisionNCRSidebar.tsx` — reset cả `fromdate/todate` khi làm mới bộ lọc.
- `src/pages/qc/interfaces/qcInterface.ts` — thêm `PLSP?: string` vào `BLOCK_DATA`.
- `FINDINGS_PARITY_QC_DTC_MODULES.md`, `ROADMAP.md`.

## Việc cần làm tiếp theo
- Chạy lại audit tương tự cho các module IQC còn lại khi có `.backup` tương ứng (`IQC_REPORT`, `BNK_COMPONENT`, `HOLD_FAIL`).
- Cân nhắc (khi có thời gian): `updateIncomingData_web` ghi `REMARK` nhưng chưa map đúng ngữ nghĩa `IQC_TEST_RESULT`/`DTC_RESULT`; kiểm tra lại audit trail khi đổi kết luận lô.

## Ghi chú kỹ thuật
- Build kiểm chứng: `npm run build` (vite production) — thành công, `dist/index.html` ghi mới; `get_errors` trên các file đã sửa — 0 lỗi.
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác; không dùng tsc làm gate.
- Nhắc lại pitfall khi refactor: `checkBP` thường chỉ nằm trong handler ở bản backup → rất dễ mất khi tách hook; luôn grep `checkBP` trong file `.backup`.


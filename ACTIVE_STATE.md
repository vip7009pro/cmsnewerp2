# ACTIVE_STATE

## Mục tiêu task hiện tại
Rà soát parity 5 module QC/DTC so với bản `.backup` và sửa sai khác logic + cải tiến điểm bất hợp lý.
Trạng thái: **HOÀN THÀNH** (audit + fix + build pass).

## File đang chỉnh sửa (phiên vừa rồi)
- `src/pages/qc/iqc/PrecisionINCOMMING/useIncomingData.ts` — gate quyền IQC, payload `insertIQC1table`, guard QC_PASS khi update hàng loạt.
- `src/pages/qc/dtc/PrecisionDTCRESULT/useDTCResultData.ts` — validate RESULT + bắt buộc ID TEST, guard XRF khi nạp Excel.
- `src/pages/qc/dtc/PrecisionDTCRESULT/PrecisionDTCResultControl.tsx` — điều kiện hiển thị khối Excel XRF.
- `src/pages/qc/dtc/PrecisionADDSPECDTC/useADDSPECData.ts` + `src/pages/qc/dtc/ADDSPECDTC.tsx` — guard thêm điểm đo, `selectedCount`.
- `FINDINGS_PARITY_QC_DTC_MODULES.md` (mới), `ROADMAP.md`.

## Việc cần làm tiếp theo
- `DKDTC`, `TEST_TABLE`: không cần sửa (đã kiểm tra tương đương/tốt hơn backup).
- Đã xử lý backend `practice1/services/qcService.js`: optional chaining `DATA.LOT_VENDOR` trong `insertIQC1table`, và `loadIQC1table` trả thêm cột `LOT_VENDOR`.
- Cân nhắc (khi có thời gian): `updateIncomingData_web` ghi `REMARK` nhưng chưa map đúng ngữ nghĩa `IQC_TEST_RESULT`/`DTC_RESULT`; kiểm tra lại audit trail khi đổi kết luận lô.

## Ghi chú kỹ thuật
- Build kiểm chứng: `npm run build` (vite production) — thành công; `node --check practice1/services/qcService.js` — SYNTAX OK.
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác; không dùng tsc làm gate.

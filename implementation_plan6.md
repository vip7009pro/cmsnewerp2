# Final Refactoring & Deprecation of khsxUtils.tsx

This plan covers the final extraction of logic from [khsxUtils.tsx](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx) to complete the modularization of the QLSXPLAN module.

## Proposed Changes

### [Component] Render Utilities
Move UI-centric render functions from [khsxUtils.tsx](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx) to a dedicated utility file.

#### [NEW] [renderUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/renderUtils.tsx)
- Extract [renderChiThi](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#266-272), [renderChiThi2](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#272-276), [renderYCSX](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#276-281), [renderBanVe](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#281-297).

#### [MODIFY] [MACHINE.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/MACHINE.tsx)
- Update imports to use `renderUtils.tsx`.

#### [MODIFY] [PLAN_DATATB.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_DATATB.tsx)
- Update imports to use `renderUtils.tsx`.

---

### [Component] KHCT Component & Leadtime logic
Migrate functions used by the [KHCT](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHCT/KHCT.tsx#18-2364) component.

#### [NEW] [leadtimeService.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/services/leadtimeService.ts)
- Migrate [f_loadLeadtimeData](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#4288-4314).

#### [MODIFY] [KHCT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHCT/KHCT.tsx)
- Replace [f_handle_loadEQ_STATUS](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#494-530) with `eqStatusService.loadEQStatus`.
- Replace [f_loadLeadtimeData](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#4288-4314) with `leadtimeService.loadLeadtimeData`.

---

### [Component] Cleanup & Deprecation
Rename or remove [khsxUtils.tsx](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx) after ensuring all QLSXPLAN components are migrated.

#### [DELETE] [khsxUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx)
- OR [RENAME] to `legacyKHSXUtils.tsx` if some other modules still import it (to be verified via build).

## Verification Plan

### Automated Tests
- Run `yarn tsc --noEmit` to ensure zero type errors in [QLSXPLAN](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/services/planService.ts#638-741) module.
- Verify all imported functions in [MACHINE.tsx](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/MACHINE.tsx), [PLAN_DATATB.tsx](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_DATATB.tsx), [KHCT.tsx](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHCT/KHCT.tsx), and [ACHIVEMENTTB.tsx](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.tsx) resolve to valid service/utility paths.

### Manual Verification
- Verify that [renderChiThi](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#266-272) and [renderBanVe](file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx#281-297) still display correctly in the UI.

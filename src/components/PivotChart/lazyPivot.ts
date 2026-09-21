/**
 * lazyPivot — nạp DevExtreme PIVOT theo NHU CẦU (không nằm trong chunk của page).
 *
 * ⚠️ SỐ ĐO (production build, 2026-09-21):
 * DevExtreme chiếm ~6.395 KB trong dist (chunk lớn nhất 3.984 KB). Trước đây MỌI page có pivot
 * đều `import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source"` ở cấp module
 * ⇒ Rollup đưa module đó vào chunk dùng chung ⇒ vừa mở page là phải tải DevExtreme dù chưa bấm
 * nút PIVOT (đo được: mở "PO tích hợp tồn kho" tốn +3.114 KB sau khi đã sửa icon).
 *
 * Cách dùng (thay cho `new PivotGridDataSource({...})`):
 *
 *   import { createPivotDataSource } from ".../components/PivotChart/lazyPivot";
 *   ...
 *   const ds = await createPivotDataSource({ fields, store });   // hàm chứa nó phải async
 *
 * Ghi chú: KHÔNG dùng `import type` thay thế được — `import type` chỉ xoá kiểu, còn giá trị vẫn
 * bị ràng buộc tĩnh nếu module còn import thật ở chỗ khác trong cùng chunk.
 */
import type PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

type DataSourceModule = { default: new (config: any) => PivotGridDataSource };

let dsModulePromise: Promise<DataSourceModule> | null = null;

/** Nạp module DataSource (memoize: mọi page dùng chung 1 lần tải). */
export const loadPivotGridDataSourceModule = (): Promise<DataSourceModule> => {
  if (!dsModulePromise) {
    dsModulePromise = import("devextreme/ui/pivot_grid/data_source") as Promise<DataSourceModule>;
  }
  return dsModulePromise;
};

/** Tạo PivotGridDataSource bất đồng bộ (module DevExtreme chỉ tải khi gọi hàm này). */
export const createPivotDataSource = async (config: any): Promise<PivotGridDataSource> => {
  const { default: PivotGridDataSourceCtor } = await loadPivotGridDataSourceModule();
  return new PivotGridDataSourceCtor(config);
};

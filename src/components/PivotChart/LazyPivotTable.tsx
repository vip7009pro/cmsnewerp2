/**
 * LazyPivotTable — bọc `PivotChart` (DevExtreme PivotGrid) bằng React.lazy.
 *
 * ⚠️ VÌ SAO: `PivotChart.tsx` import `devextreme-react/pivot-grid` + `devextreme-react` exports
 * (Export, FieldChooser) ⇒ module DevExtreme. 26 file trong `src/pages/**` import nó ở cấp module,
 * nên mở page là tải DevExtreme dù chưa xem pivot (xem số đo trong `lazyPivot.ts`).
 *
 * Cách dùng: chỉ ĐỔI 1 DÒNG import, KHÔNG phải sửa JSX:
 *   - import PivotChart from "../PivotChart/PivotChart";
 *   + import PivotChart from "../PivotChart/LazyPivotTable";
 *
 * Chunk DevExtreme khi đó chỉ được tải khi component thực sự render.
 */
import { Suspense, lazy } from "react";
import type { ComponentProps } from "react";
import type PivotChartType from "./PivotChart";

const PivotChartLazy = lazy(() => import("./PivotChart"));

/** Cùng props với `PivotChart` gốc. */
export type LazyPivotTableProps = ComponentProps<typeof PivotChartType>;

const LazyPivotTable = (props: LazyPivotTableProps) => (
  <Suspense fallback={null}>
    <PivotChartLazy {...props} />
  </Suspense>
);

export default LazyPivotTable;

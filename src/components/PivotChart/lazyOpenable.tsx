/**
 * lazyOpenable — biến 1 modal (đã tự `if (!isOpen) return null` khi đóng) thành LAZY và
 * CHỈ NẠP CHUNK KHI USER THỰC SỰ MỞ.
 *
 * ⚠️ VÌ SAO (số đo production 2026-09-21): các pivot-modal import tĩnh
 * `devextreme/ui/pivot_grid/data_source` + `components/PivotChart/PivotChart`. Vì page import tĩnh
 * modal đó, module DevExtreme nằm trong graph tĩnh của page ⇒ VỪA MỞ PAGE đã phải tải DevExtreme
 * (~3.984 KB chunk + các chunk phụ, tổng DevExtreme ~6.395 KB) dù user chưa hề bấm PIVOT.
 *
 * Với `lazyOpenable`, chunk của modal (kèm DevExtreme) chỉ được tải khi prop mở = true.
 * Hành vi không đổi: khi đóng, modal vốn đã `return null`.
 *
 * Cách dùng ở page (thay dòng import tĩnh cũ):
 *   import { lazyOpenable } from "../../../components/PivotChart/lazyOpenable";
 *   const PrecisionPlanPivotModal = lazyOpenable(
 *     () => import("./PrecisionPlan/PrecisionPlanPivotModal").then((m) => m.default),
 *     "isOpen", // tên prop mở: "isOpen" | "open" | ...
 *   );
 */
import { Suspense, lazy, type ComponentType } from "react";

export function lazyOpenable<P extends Record<string, any>>(
  loader: () => Promise<ComponentType<P>>,
  openProp: string = "isOpen",
): ComponentType<P> {
  const Lazy = lazy(async () => ({ default: await loader() }));

  const Gated: ComponentType<P> = (props) => {
    if (!(props as any)[openProp]) return null;
    return (
      <Suspense fallback={null}>
        <Lazy {...(props as any)} />
      </Suspense>
    );
  };
  Gated.displayName = "LazyOpenable";

  return Gated;
}

/**
 * lazyComponent — biến component thành lazy (tự bọc Suspense) cho trường hợp page ĐÃ render có
 * điều kiện (`{showPivotModal && <Modal .../>}`), tức chỉ cần lazy, không cần gate theo prop.
 *
 * Dùng ở page: thay dòng import tĩnh bằng
 *   const PrecisionCSDataPivotModal = lazyComponent(
 *     () => import("./PrecisionCSData/PrecisionCSDataPivotModal").then((m) => m.PrecisionCSDataPivotModal),
 *   );
 * JSX giữ nguyên.
 */
export function lazyComponent<P extends Record<string, any>>(
  loader: () => Promise<ComponentType<P>>,
): ComponentType<P> {
  const Lazy = lazy(async () => ({ default: await loader() }));

  const Wrapped: ComponentType<P> = (props) => (
    <Suspense fallback={null}>
      <Lazy {...(props as any)} />
    </Suspense>
  );
  Wrapped.displayName = "LazyComponent";

  return Wrapped;
}

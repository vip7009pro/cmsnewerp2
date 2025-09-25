import { useEffect, useState } from "react";

/**
 * Hook tạo "lag" giả lập trong React.
 * @param enabled Bật/tắt chế độ lag
 * @param delayMs Thời gian delay (ms) cho mỗi cập nhật state/render
 */
export function useLaggy<T>(value: T, enabled: boolean = true, delayMs: number = 1000): T {
  const [laggyValue, setLaggyValue] = useState<T>(value);

  useEffect(() => {
    if (!enabled) {
      setLaggyValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setLaggyValue(value);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [value, enabled, delayMs]);

  return laggyValue;
}

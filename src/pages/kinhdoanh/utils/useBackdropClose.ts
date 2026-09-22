import { useCallback, useRef } from "react";
import type { MouseEvent } from "react";

/**
 * Chỉ đóng modal khi người dùng NHẤN XUỐNG và NHẢ LÊN đều ở vùng backdrop (ngoài vùng modal).
 *
 * Vì sao cần: khi nhấn chuột trong modal rồi kéo ra ngoài modal, browser bắn sự kiện `click`
 * tại tổ tiên chung gần nhất của điểm mousedown và điểm mouseup ⇒ target chính là backdrop.
 * Nếu backdrop chỉ dùng `onClick={onClose}` (hoặc chỉ check `e.target === e.currentTarget`)
 * thì thao tác kéo-ra-ngoài sẽ vô tình đóng modal.
 *
 * Hook này ghi nhớ việc mousedown có bắt đầu từ chính backdrop hay không, nên chỉ thao tác
 * "click hẳn ra ngoài" mới đóng modal.
 *
 * Cách dùng:
 *   const backdropProps = useBackdropClose(onClose);
 *   <div className="my-modal-backdrop" {...backdropProps}> ... </div>
 */
export const useBackdropClose = (onClose: () => void) => {
  const mouseDownOnBackdrop = useRef(false);

  const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    // mousedown bubble từ phần tử con ⇒ target !== currentTarget ⇒ không phải nhấn ra ngoài
    mouseDownOnBackdrop.current = e.target === e.currentTarget;
  }, []);

  const onClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const shouldClose = mouseDownOnBackdrop.current && e.target === e.currentTarget;
      mouseDownOnBackdrop.current = false;
      if (shouldClose) onClose();
    },
    [onClose]
  );

  return { onMouseDown, onClick };
};

export default useBackdropClose;

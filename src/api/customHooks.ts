import { useEffect } from "react";

const useOutsideClick = (ref: any, callback: any, callback2: any) => {
  useEffect(() => {
    const handleClickOutside = (evt: any) => {
      if (ref.current && !ref.current.contains(evt.target)) {
        callback(); //Do what you want to handle in the callback
      } else {
        callback2();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
};

export default useOutsideClick;

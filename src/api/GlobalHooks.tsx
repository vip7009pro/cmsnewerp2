import { useState } from "react";

function useCalc(initValue: number) {
  const [value, setValue] = useState(initValue);

  const increaseValue = ()=> {
    setValue(value +1);
  }
  const decreaseValue = ()=> {
    setValue(value-1);
  }
  return {
    value,
    increaseValue,
    decreaseValue
  }
}

function useDebounce() {

}


export {useCalc}
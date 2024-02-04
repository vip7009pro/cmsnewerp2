import React from "react";
import { COMPONENT_DATA } from "../../../../api/GlobalInterface";

const RECTANGLE = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  return (
    <div
      className="amazon_rectange"
      style={{
        backgroundColor: DATA.COLOR ? DATA.COLOR : "white",
        width: `${DATA.SIZE_W}mm`,
        height: `${DATA.SIZE_H}mm`,
        top: `${DATA.POS_Y}mm`,
        left: `${DATA.POS_X}mm`,
        position: "absolute",
        transform: `rotate(${DATA.ROTATE}deg)`,
        transformOrigin: `top left`,
      }}
    ></div>
  );
};
export default RECTANGLE;

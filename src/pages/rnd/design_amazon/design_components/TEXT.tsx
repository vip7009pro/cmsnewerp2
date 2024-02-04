import React from "react";
import { COMPONENT_DATA } from "../../../../api/GlobalInterface";

const TEXT = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  return (
    <div
      className="amz_text"
      style={{
        position: "absolute",
        top: `${DATA.POS_Y}mm`,
        left: `${DATA.POS_X}mm`,
        fontSize: `${DATA.FONT_SIZE}pt`,
        fontFamily: `${DATA.FONT_NAME}`,
        fontWeight: DATA.FONT_STYLE === "B" ? "bold" : "normal",
        fontStyle: DATA.FONT_STYLE === "I" ? "italic" : "normal",
        textDecoration: DATA.FONT_STYLE === "U" ? "underline" : "none",
        whiteSpace: "pre",
        transform: `rotate(${DATA.ROTATE}deg)`,
        transformOrigin: `top left`,
        background: `${
          DATA.REMARK.toUpperCase() === "HIGHTLIGHT" ? "black" : "white"
        }`,
        color: `${
          DATA.REMARK.toUpperCase() === "HIGHTLIGHT" ? "white" : "black"
        }`,
      }}
    >
      {DATA.GIATRI}
    </div>
  );
};
export default TEXT;

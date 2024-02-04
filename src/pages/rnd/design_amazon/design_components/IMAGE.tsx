import React from "react";
import { COMPONENT_DATA } from "../../../../api/GlobalInterface";

const IMAGE = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  return (
    <div
      className="amz_image"
      style={{
        position: "absolute",
        top: `${DATA.POS_Y}mm`,
        left: `${DATA.POS_X}mm`,
        width: `${DATA.SIZE_W}mm`,
        height: `${DATA.SIZE_H}mm`,
        transform: `rotate(${DATA.ROTATE}deg)`,
        transformOrigin: `top left`,
      }}
    >
      <img
        src={
          DATA.GIATRI === "logoAMAZON.jpg" || DATA.GIATRI === "logoAMAZON.png"
            ? "http://14.160.33.94/images/logoAMAZON.png"
            : DATA.GIATRI
        }
        alt="anhlogo"
        width={DATA.SIZE_W / 0.26458333333719}
        height={DATA.SIZE_H / 0.26458333333719}
      ></img>
    </div>
  );
};

export default IMAGE;

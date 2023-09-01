import React from "react";
import DataMatrix from "react-datamatrix-svg";
import { COMPONENT_DATA } from "../../../../api/GlobalInterface";

const DATAMATRIX = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  return (
    <div
      className="amz_datamatrix"
      style={{
        position: "absolute",
        top: `${DATA.POS_Y}mm`,
        left: `${DATA.POS_X}mm`,
        width: `${DATA.SIZE_W}mm`,
        height: `${DATA.SIZE_H}mm`,
        transform: `rotate(${DATA.ROTATE}deg)`,
      }}
    >
      <DataMatrix
        msg={DATA.GIATRI}
        dim={DATA.SIZE_W / 0.26458333333719}
        pad={0}
      />
    </div>
  );
};

export default DATAMATRIX;

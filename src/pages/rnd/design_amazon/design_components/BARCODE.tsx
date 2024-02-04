import React from "react";
import Barcode from "react-barcode";
import { COMPONENT_DATA } from "../../../../api/GlobalInterface";

const BARCODE = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  return (
    <div
      className="amz_barcode"
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
      <Barcode
        value={DATA.GIATRI}
        format="CODE128"
        width={DATA.SIZE_W / 41.47695504}
        height={DATA.SIZE_H / 0.265}
        displayValue={false}
        background="#fff"
        lineColor="black"
        margin={0}
      />
    </div>
  );
};

export default BARCODE;

import React from "react";
import QRCode from "qrcode.react";
import { COMPONENT_DATA } from "../../../../api/GlobalInterface";
/* import QRCode from "react-qr-code"; */

const QRCODE = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  return (
    <div
      className="amz_qrcode"
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
      <QRCode
        id="qrcode"
        value={DATA.GIATRI}
        size={DATA.SIZE_W / 0.26458333333719}
        level={"M"}
        includeMargin={false}
        renderAs="svg"
      />
      {/*  {<QRCode
          size={DATA.SIZE_W/0.26458333333719}          
          value={DATA.GIATRI}                   
          level="L"
          />} */}
    </div>
  );
};

export default QRCODE;

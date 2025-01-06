import React, { ReactElement, useEffect, useState } from "react";
import "./CodeVisualLize.scss";
import RECTANGLE from "../../../rnd/design_amazon/design_components/RECTANGLE";
import { CODEDATA } from "../../../../api/GlobalInterface";

const CodeVisualLize = ({ DATA }: { DATA: CODEDATA }) => {
  let factor = 1;
  let standard_rect: number = 70;
  if (DATA.G_LENGTH * DATA.G_C_R + DATA.G_LG * DATA.G_C_R > standard_rect) {
    factor =
      (standard_rect * 1.0) /
      (DATA.G_LENGTH * DATA.G_C_R + DATA.G_LG * DATA.G_C_R);
  }

  const [productArray, setProductArrray] = useState<Array<ReactElement>>([]);
  const renderProduct = () => {
    let tempProductArray: ReactElement[] = [
      <RECTANGLE
        key={9999}
        DATA={{
          SIZE_W:
            (DATA.G_SG_L +
              (DATA.G_CG + DATA.G_WIDTH) * (DATA.G_C - 1) +
              DATA.G_WIDTH +
              DATA.G_SG_R) *
            factor *
            1.0,
          SIZE_H: (DATA.G_LENGTH + DATA.G_LG) * DATA.G_C_R * factor * 1.0,
          CAVITY_PRINT: 2,
          DOITUONG_NAME: "",
          DOITUONG_NO: 1,
          DOITUONG_STT: "1",
          FONT_NAME: "Arial",
          FONT_SIZE: 6,
          FONT_STYLE: "normal",
          G_CODE_MAU: "",
          GIATRI: "",
          PHANLOAI_DT: "",
          POS_X: 0,
          POS_Y: 0,
          REMARK: "",
          ROTATE: 0,
        }}
      />,
    ];
    let keydata: number = 0;
    for (let i = 0; i < DATA.G_C; i++) {
      for (let j = 0; j < DATA.G_C_R; j++) {
        //console.log(DATA.G_WIDTH*i+DATA.G_CG);
        //console.log(DATA.G_LENGTH*j+ DATA.G_LG);
        keydata++;
        tempProductArray.push(
          <RECTANGLE
            key={keydata}
            DATA={{
              SIZE_W: DATA.G_WIDTH * factor * 1.0,
              SIZE_H: DATA.G_LENGTH * factor * 1.0,
              CAVITY_PRINT: 2,
              DOITUONG_NAME: "",
              DOITUONG_NO: 1,
              DOITUONG_STT: "1",
              FONT_NAME: "Arial",
              FONT_SIZE: 6,
              FONT_STYLE: "normal",
              G_CODE_MAU: "",
              GIATRI: "",
              PHANLOAI_DT: "",
              POS_X:
                (DATA.G_SG_L + (DATA.G_WIDTH * i + DATA.G_CG * i)) *
                factor *
                1.0,
              POS_Y: (DATA.G_LENGTH * j + DATA.G_LG * j) * factor * 1.0,
              REMARK: "",
              ROTATE: 0,
              COLOR: "#35B0D1",
            }}
          />,
        );
      }
    }
    setProductArrray(tempProductArray);
  };

  useEffect(() => {
    renderProduct();
  }, [DATA]);

  return (
    <div className="codevisualizecomponent" style={{ display: "flex" }}>
      {productArray}
    </div>
  );
};

export default CodeVisualLize;

import { useEffect } from "react";
import "./KHOSX.scss";
import KHOAO from "../../qlsx/QLSXPLAN/KHOAO/KHOAO";
import KHOSUB from "../../qlsx/QLSXPLAN/KHOAO/KHOSUB";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import MyTabs from "../../../components/MyTab/MyTab";

const KHOSX = () => {
  useEffect(() => {}, []);
  return (
    <div className="khosx">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title={"KHO MAIN"}>
          <div className="trainspection">
            <KHOAO />
          </div>
        </MyTabs.Tab>
        <MyTabs.Tab title={"KHO SUB"}>
          <div className="trainspection">
            <KHOSUB />
          </div>
        </MyTabs.Tab>
        <MyTabs.Tab title={"KHO VL"}>
          <div className="trainspection">
            <KHOLIEU />
          </div>
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};

export default KHOSX;
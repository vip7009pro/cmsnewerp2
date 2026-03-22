import { useEffect } from "react";
import "./HOLD_FAIL.scss";
import HOLDING from "./HOLDING";
import FAILING from "./FAILING";
import INCOMMING from "./INCOMMING";
import MyTabs from "../../../components/MyTab/MyTab";
import { useAppSelector } from "../../../redux/hooks";
import { selectTheme } from "../../../redux/selectors/uiSelectors";

const HOLD_FAIL = () => {
  const theme: any = useAppSelector(selectTheme);


  useEffect(() => {}, []);

  return (
    <div className="hold_fail">      
      <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="INCOMMING">
          <INCOMMING /> 
          </MyTabs.Tab>
          <MyTabs.Tab title="FAILING">
          <FAILING />
          </MyTabs.Tab>
          <MyTabs.Tab title="HOLDING">
          <HOLDING />
          </MyTabs.Tab>
        </MyTabs>
    </div>
  );
};
export default HOLD_FAIL;
      

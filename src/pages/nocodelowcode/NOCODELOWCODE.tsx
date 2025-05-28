import { useEffect } from "react";
import "./NOCODELOWCODE.scss";
import MyTabs from "../../components/MyTab/MyTab";
import DBManager from "./DBManager/DBManager";
import SqlEditor from "./components/TestBackEnd/SqlEditor";
const  NOCODELOWCODE = () => {
  useEffect(() => { }, []);
  return (
    <div className="dtc">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title={"Quản lý DB"}>
          <DBManager/>          
        </MyTabs.Tab>
        <MyTabs.Tab title={"SQL"}>
          <SqlEditor/>         
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default NOCODELOWCODE;
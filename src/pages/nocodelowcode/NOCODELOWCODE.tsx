import { useEffect } from "react";
import "./NOCODELOWCODE.scss";
import MyTabs from "../../components/MyTab/MyTab";
import DBManager from "./DBManager/DBManager";
import SqlEditor from "./components/TestBackEnd/SqlEditor";
import QueryManager from "./QueryManager/QueryManager";
import MenuManager from "./MenuManager/MenuManager";
const  NOCODELOWCODE = () => {
  useEffect(() => { }, []);
  return (
    <div className="dtc">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title={"DB Manager"}>
          <DBManager/>          
        </MyTabs.Tab>
        <MyTabs.Tab title={"SQL"}>
          <SqlEditor/>         
        </MyTabs.Tab>
        <MyTabs.Tab title={"Query Manager"}>
          <QueryManager/>         
        </MyTabs.Tab>
        <MyTabs.Tab title={"Menu Manager"}>
          <MenuManager/>         
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default NOCODELOWCODE;
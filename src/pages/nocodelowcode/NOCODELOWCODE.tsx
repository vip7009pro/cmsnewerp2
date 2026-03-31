import { useEffect } from "react";
import "./NOCODELOWCODE.scss";
import MyTabs from "../../components/MyTab/MyTab";
import DBManager from "./DBManager/DBManager";
import SqlEditor from "./components/TestBackEnd/SqlEditor";
import QueryManager from "./QueryManager/QueryManager";
/* import MenuManager from "./MenuManager/MenuManager"; */
import { KPIManager } from "../KPI/KPIManager";
import NOLOWHOME from "./components/NOLOWHOME/NOLOWHOME";
import MenuManager from "./MenuManager/MenuManager";
import PagesManager from "./components/PagesManager/PagesManager";
import RelationshipsManager from "./components/RelationshipsManager/RelationshipsManager";
import ProcessManager from "./ProcessManager/ProcessManager";
import ExcelAITranslator from "./AI/ExcelAITranslator";
import PowerPointAITranslator from "./AI/PowerPointAITranslator";
import WordAITranslator from "./AI/WordAITranslator";
import ERPChat from "./AI/ERPChat";
import ERPChatV2 from "./AI/ERPChatV2";
import ColumnComments from "./DBComments/ColumnComments";
import SemanticEngineManager from "../../components/SemanticEngineManagerEnhanced";

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
        <MyTabs.Tab title={"KPI Manager"}>
          <KPIManager/>         
        </MyTabs.Tab>
        <MyTabs.Tab title={"Form Manager"}>
          <NOLOWHOME/>         
        </MyTabs.Tab>
        <MyTabs.Tab title={"Relationship Manager"}>
          <RelationshipsManager/>         
        </MyTabs.Tab>
        <MyTabs.Tab title={"Pages Manager"}>
          <PagesManager/>         
        </MyTabs.Tab>
        <MyTabs.Tab title={"Process Manager"}>
          <ProcessManager/>         
        </MyTabs.Tab>      
        <MyTabs.Tab title={"Excel Translator AI"}>
          <ExcelAITranslator/>
        </MyTabs.Tab>
        <MyTabs.Tab title={"PowerPoint Translator AI"}>
          <PowerPointAITranslator/>
        </MyTabs.Tab>
        <MyTabs.Tab title={"Word Translator AI"}>
          <WordAITranslator/>
        </MyTabs.Tab>
        <MyTabs.Tab title={"ERP Chat"}>
          <ERPChat/>
        </MyTabs.Tab>
        <MyTabs.Tab title={"ERP Chat V2"}>
          <ERPChatV2/>
        </MyTabs.Tab>
        <MyTabs.Tab title={"Semantic Engine Manager"}>
          <SemanticEngineManager/>
        </MyTabs.Tab>
        <MyTabs.Tab title={"DB Column Comments"}>
          <ColumnComments/>
        </MyTabs.Tab>        
      </MyTabs>
    </div>
  );
};
export default NOCODELOWCODE;
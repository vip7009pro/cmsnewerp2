import { useEffect, Suspense } from "react";
import "./QuotationTotal.scss";
import QuotationManager from "./QuotationManager";
import CalcQuotation from "./CalcQuotation";
import MyTabs from "../../../components/MyTab/MyTab";
const QuotationTotal = () => {
  useEffect(() => { }, []);
  return (
    <div className="quotationtotal">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="Quản lý giá">
            <QuotationManager />
          </MyTabs.Tab>
          <MyTabs.Tab title="Tính báo giá">
            <CalcQuotation />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default QuotationTotal;
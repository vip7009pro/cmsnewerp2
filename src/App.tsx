import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import "./App.scss";
import KinhDoanh from "./pages/kinhdoanh/KinhDoanh";
import PoManager from "./pages/kinhdoanh/pomanager/PoManager";
import KinhDoanhReport from "./pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport";
import InvoiceManager from "./pages/kinhdoanh/invoicemanager/InvoiceManager";
import PlanManager from "./pages/kinhdoanh/planmanager/PlanManager";
import FCSTManager from "./pages/kinhdoanh/fcstmanager/FCSTManager";
import YCSXManager from "./pages/kinhdoanh/ycsxmanager/YCSXManager";
import POandStockFull from "./pages/kinhdoanh/poandstockfull/POandStockFull";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='kinhdoanh' element={<KinhDoanh />}>
              <Route path='pomanager' element={<PoManager />}/>
              <Route path='invoicemanager' element={<InvoiceManager />}/>
              <Route path='planmanager' element={<PlanManager />}/>
              <Route path='fcstmanager' element={<FCSTManager />}/>
              <Route path='ycsxmanager' element={<YCSXManager />}/>
              <Route path='poandstockfull' element={<POandStockFull />}/>
              <Route path='kinhdoanhreport' element={<KinhDoanhReport />}/>
            </Route>
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

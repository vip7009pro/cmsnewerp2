import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";


function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<Login/>} />
            <Route path='/login' element={<Home />} />
            <Route path='/users'>
              <Route index element={<Home />} />
              <Route path=':userId' element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

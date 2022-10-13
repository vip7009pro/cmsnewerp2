import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./redux/store";
import {Provider} from 'react-redux'

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(   
  
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>
);

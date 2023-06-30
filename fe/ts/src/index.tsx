import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import { GlobalStyle }  from './styles/global';
import App from "./App";

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <GlobalStyle />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
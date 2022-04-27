import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./i18n";

// Redux
import { Provider } from "react-redux";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducer from "./_reducers";
import * as actions from "./_actions";

const root = createRoot(document.getElementById("root"));

// Redux devtools only in development
let store;
if (process.env.NODE_ENV === "development") {
  const composeEnhancers = composeWithDevTools({
    actions,
    trace: true,
    traceLimit: 25,
  });
  store = createStore(allReducer, composeEnhancers(applyMiddleware(thunk)));
} else {
  store = createStore(allReducer, applyMiddleware(thunk));
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

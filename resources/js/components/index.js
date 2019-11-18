import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "../serviceWorker";
import "./custom.scss";
import { Provider } from "react-redux";
import { Store } from "./store";


const e = React.createElement;

ReactDOM.render(
  e(Provider, { store: Store }, 
    e(App)  
  ),
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


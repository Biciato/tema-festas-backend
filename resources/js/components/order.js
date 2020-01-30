import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ProductComponent from "./ProductComponent";
import * as serviceWorker from "../serviceWorker";
import "./custom.scss";

document.getElementById('order') && ReactDOM.render(<ProductComponent />, document.getElementById("order"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


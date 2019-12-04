import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CartComponent from "./CartComponent/CartComponent";
import * as serviceWorker from "../serviceWorker";
import "./custom.scss";

if (document.getElementById('cart')) {
  ReactDOM.render(<CartComponent />, document.getElementById("cart"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

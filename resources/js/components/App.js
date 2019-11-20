import React from 'react';
import './App.css';
import ClientComponent from './ClientComponent/ClientComponent'
import ProductComponent from './ProductComponent/ProductComponent';
import CartComponent from './CartComponent/CartComponent';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom"

export default function App() { 
    return (
        <Router>
            <Switch>
                <Route path="/clientes" component={ClientComponent}/>
                <Route path="/pedido" component={ProductComponent}/>
                <Route path="/resumo" render={(props) => <CartComponent {...props} />}/>
            </Switch>
        </Router>
    ) 
}    


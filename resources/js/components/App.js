import React from 'react';
import './App.css';
import ProductComponent from './ProductComponent/ProductComponent';
import Login from './LoginComponent/Login'

export default class App extends React.Component { 
    constructor(props) {
        super(props)
        this.handleLoginChange = this.handleLoginChange.bind(this)
        this.state = {
            cpt: {name: Login, props: { onLoginChange: this.handleLoginChange }}
        }
    }
    handleLoginChange() {
        this.setState({
            cpt: {
                name: ProductComponent
            }
        })
    }
    render() {
        return React.createElement(this.state.cpt.name, this.state.cpt.props) 
    }    
}

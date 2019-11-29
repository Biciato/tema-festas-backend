import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ClientSelect from "./ClientSelect";
import "./ClientComponent.css";
import { Redirect } from "react-router-dom";
import axios from 'axios'

export default class ClientComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClientSelect = this.handleClientSelect.bind(this);
        this.state = { client: null };
    }
    componentDidMount() {
        if (localStorage.getItem('prods') !== null) {
            localStorage.removeItem('prods')
        }
    }
    handleClientSelect(client) {
        this.setState({ client });
    }
    handleClick() {
        if (this.state.client === null) {
            this.setState({warning: true})
        } else {
            axios.post('/create-order', {client: this.state.client})
                .then((response) => this.setState({
                    order: response.data.id
                }, () => this.setState({redirect: true})))
                .catch((error) => console.log(error) );
        }
    }
    render() {
        if (this.state.redirect) {
            return <Redirect push to={{
                        pathname: '/pedido',
                        state: {
                            client: this.state.client,
                            order: this.state.order
                        }
                    }}/>
        }
        return (
            <Row bsPrefix="row m-1">
                <Col bsPrefix="col text-center">
                    <h5 className="text-left mt-3" key={1}>
                        <img
                            src="/images/groupe-users.svg"
                            alt="user"
                            style={{
                                width: "8%",
                                margin: "0.2em 0.5em 0.4em 0"
                            }}
                        ></img>
                        Clientes
                    </h5>
                    <ClientSelect
                        warning={this.state.warning}
                        key={2}
                        onClientSelect={this.handleClientSelect}
                    />
                    <div style={{color: 'red', display: this.state.warning ? 'block' : 'none'}}>
                        Selecione um Cliente
                    </div>
                    <div onClick={this.handleClick}
                            className="footer mt-4"
                            key={3}>
                            Fazer Pedido
                    </div>
                </Col>
            </Row>
        );
    }
}

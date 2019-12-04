import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ClientSelect from "./ClientSelect";
import "./ClientComponent.css";
import axios from 'axios'

export default class ClientComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClientSelect = this.handleClientSelect.bind(this);
        this.state = { client: null };
    }
    componentDidMount() {
        axios.get('/api/clients')
                .then((response) => this.setState({ 
                    clients: response.data.map((item) => item.dsc_nome) 
                }));
    }
    handleClientSelect(client) {
        this.setState({ client }, () => this.setState({ warning: false }));
    }
    handleClick() {
        if (this.state.client === null) {
            this.setState({warning: true})
        } else {
            axios.post('/set-client', { 
                client: this.state.client 
            }).then((response) => 
                window.location.assign(`/pedido/${response.data}`
            ))
        }
    }
    render() {
        const warning = this.state.warning ? (
            <div style={{color: 'red'}}>
                Selecione um Cliente
            </div>
        ) : ''
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
                        clients={this.state.clients}
                        warning={this.state.warning}
                        key={2}
                        onClientSelect={this.handleClientSelect}
                    />
                    {warning}
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

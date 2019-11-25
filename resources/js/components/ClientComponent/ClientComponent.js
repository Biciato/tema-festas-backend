import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ClientSelect from "./ClientSelect";
import "./ClientComponent.css";
import { Link } from "react-router-dom";

export default class ClientComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClientSelect = this.handleClientSelect.bind(this);
        this.state = { client: null };
    }
    handleClientSelect(client) {
        this.setState({ client });
    }
    handleClick() {
        if (this.state.client === null) {
            this.setState({warning: true})
        } 
    }
    render() {
        return (
            <Row bsPrefix="row m-1">
                <Col>
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
                    <Link
                        onClick={this.handleClick}
                        className="footer text-center"
                        key={3}
                        to={location => ({
                            ...location,
                            pathname: this.state.client
                                ? "/pedido"
                                : "/clientes",
                            state: {
                                client: this.state.client
                            }
                        })}
                    >
                        Fazer Pedido
                    </Link>
                </Col>
            </Row>
        );
    }
}

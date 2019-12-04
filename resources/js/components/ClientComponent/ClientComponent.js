import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ClientSelect from "./ClientSelect";
import HeaderComponent from '../HeaderComponent'
import "./ClientComponent.css";
import axios from 'axios'
import Warning from "./Warning";
import Footer from "../Footer";

export default class ClientComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClientSelect = this.handleClientSelect.bind(this);
        this.handleMakeOrderClick = this.handleMakeOrderClick.bind(this);
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
    handleMakeOrderClick() {
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
        return (
            <Row bsPrefix="row m-1">
                <Col bsPrefix="col text-center">
                    <HeaderComponent src="groupe-users.svg" />
                    <ClientSelect
                        clients={this.state.clients}
                        warning={this.state.warning}
                        key={2}
                        onClientSelect={this.handleClientSelect}
                    />
                    <Warning warning={this.state.warning} />
                    <Footer onMakeOrderClick={this.handleMakeOrderClick}/>
                </Col>
            </Row>
        );
    }
}

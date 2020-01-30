import React from "react"
import { ClientSelect } from "./ClientSelect"
import { HeaderComponent } from './HeaderComponent'
import axios from 'axios'
import { Footer } from "./Footer"

export default class ClientComponent extends React.Component {
    constructor(props) {
        super(props)
        this.handleClientSelect = this.handleClientSelect.bind(this)
        this.handleMakeOrderClick = this.handleMakeOrderClick.bind(this)
        this.state = { client: null }
    }
    componentDidMount() {
        axios.get('/api/clients')
                .then((response) => this.setState({
                    clients: response.data.map((item) => item.dsc_nome)
                }))
    }
    handleClientSelect(client) {
        this.setState({ client }, () => this.setState({ warning: false }))
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
            <div style={{marginTop: '3em', display: 'flex', flexDirection: 'column'}}>
                <HeaderComponent src="groupe-users.svg"  title="Clientes"/>
                <ClientSelect clients={this.state.clients}
                                warning={this.state.warning}
                                onClientSelect={this.handleClientSelect}/>
                {this.state.warning && <div style={{color: 'red', padding: '1em 0.5em'}}>
                                            Selecione um Cliente
                                        </div>}
                <Footer onMakeOrderClick={this.handleMakeOrderClick} class="client"/>
            </div>
        )
    }
}

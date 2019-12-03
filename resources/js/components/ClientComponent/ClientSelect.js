import React from 'react'
import Select from 'react-select'
import { Clients } from '../resources/clients'

export default class ClientSelect extends React.Component {
    constructor(props) {
        super(props)
        this.handleClientSelect = this.handleClientSelect.bind(this)
    }
    handleClientSelect(client) {
        this.props.onClientSelect(client.value)
    }
    render() {
        const clients = this.props.clients ? this.props.clients : Clients
        const clientList = clients.map((client) => ({
            value: client.toUpperCase(),
            label: client.toUpperCase()
        }));
        return(
            <Select 
                options={clientList}
                className="align-left"
                styles={{
                    control: styles => ({
                      ...styles,
                      fontSize: '14px',
                      fontWeight: '600',
                      borderColor: this.props.warning ? 'red' : 'hsl(0,0%,80%)',
                      textAlign: 'left'
                    })              
                  }}
                defaultValue={{
                    value:'Selecione o cliente', 
                    label:'Selecione o cliente'
                }}
                onChange={this.handleClientSelect} />
        )
    }
}
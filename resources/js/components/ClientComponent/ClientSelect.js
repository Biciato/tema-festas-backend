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
        const clientList = Clients.map((client) => ({
            value: client.toUpperCase(),
            label: client.toUpperCase()
        }));
        return(
            <Select 
                options={clientList}
                styles={{
                    control: styles => ({
                      ...styles,
                      fontSize: '14px',
                      fontWeight: '600'
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
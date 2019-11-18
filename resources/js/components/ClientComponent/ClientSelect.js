import React from 'react'
import Select from 'react-select'

export default class ClientSelect extends React.Component {
    constructor(props) {
        super(props)
        this.handleClientSelect = this.handleClientSelect.bind(this)
    }
    handleClientSelect(client) {
        this.props.onClientSelect(client.value)
    }
    render() {
        const clientList = [...Array(26)].map((_, i) => ({
            value: `Cliente ${String.fromCharCode('A'.charCodeAt(0) + i)}`,
            label: `Cliente ${String.fromCharCode('A'.charCodeAt(0) + i)}`
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
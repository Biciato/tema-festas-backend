import React from 'react'
import Select from 'react-select'
import { Clients } from './resources/clients'

export default function ClientSelect(props) {
    const clients = props.clients || Clients
    return(
        <Select options={clients.map((client) => ({
                    value: client.toUpperCase(),
                    label: client.toUpperCase()
                }))}
                className="align-left"
                styles={{
                    control: styles => ({
                        ...styles,
                        fontSize: '14px',
                        fontWeight: '600',
                        borderColor: props.warning ? 'red' : 'hsl(0,0%,80%)',
                        textAlign: 'left'
                    })              
                    }}
                defaultValue={{
                    value:'Selecione o cliente', 
                    label:'Selecione o cliente'
                }}
                onChange={client => props.onClientSelect(client.value)}/>
    )
}
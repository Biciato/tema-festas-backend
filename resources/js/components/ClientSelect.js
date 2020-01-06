import React from 'react'
import Select from 'react-select'
import { Clients } from './resources/clients'

export default function ClientSelect(props) {
    const clients = props.clients || Clients
    return(
        <div style={{ display: 'inline-block' ,width: '-webkit-fill-available' ,margin: '1em 1em 0'}}>
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
        </div>
    )
}
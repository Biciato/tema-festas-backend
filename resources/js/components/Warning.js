import React from 'react'

export default function Warning(props) {
    if (props.warning) {
        return (
            <div style={{color: 'red'}}>
                Selecione um Cliente
            </div>
        )
    } else {
        return null
    }    
}
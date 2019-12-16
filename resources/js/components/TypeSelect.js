import React from "react"
import Select from "react-select"

export default function TypeSelect(props) {
    if (props.show) {
        return (
            <div style={{marginTop: '1em'}}>
                <Select defaultValue={{ value: "Subtipo", label: "Subtipo" }}
                        options={props.prodName.includes('ela') 
                                    ? [{ value: 'Número', label: 'Número' }]  
                                    : ["poa", "liso", "temas"].map(item => ({
                                        value: item,
                                        label: item
                                    }))}
                        onChange={type => props.onTypeChange(type.value)}
                        styles={{
                            control: styles => ({
                                ...styles,
                                fontSize: "14px",
                                fontWeight: "600",
                                margin: '1em'
                            })
                        }}/>
            </div>
        )
    } else { return null}
}

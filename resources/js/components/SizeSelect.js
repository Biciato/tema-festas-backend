import React from "react"
import Select from "react-select"
import { Products } from "./resources/products"

export const SizeSelect = props => (props.show && (
    <div style={{
            display: "inline-block",
            width: "-webkit-fill-available",
            margin: "0 1em 1em"
        }}>
        <Select onChange={size => props.onSizeChange(size.value)}
                defaultValue={{ value: "Tamanho", label: "Tamanho" }}
                options={Products.categories[0][
                    props.prodName
                ].size.map(item => ({ value: item.name, label: item.name }))}
                styles={{
                    control: styles => ({
                        ...styles,
                        fontSize: "14px",
                        fontWeight: "600"
                    })
                }}/>
    </div>
)) || null

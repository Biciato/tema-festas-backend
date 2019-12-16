import React from "react";
import Select from "react-select";
import { Products } from "./resources/products";

export default function SizeSelect(props) {
    if (props.show) {
        return (
            <div style={{marginTop: '1em'}}>
                <Select defaultValue={{ value: "Tamanho", label: "Tamanho" }}
                        options={Products.categories[0][props.prodName].size.map(
                            item => ({
                                value: item.name,
                                label: item.name
                            })
                        )}
                        onChange={size => props.onSizeChange(size.value)}
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
    } else { return null }
}

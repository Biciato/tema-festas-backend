import React from "react";
import { Products } from "./resources/products";
import Select from "react-select";

const prodList = Object.assign(
    {},
    Products.categories[0],
    Products.categories[1],
    Products.categories[2],
    Products.categories[3]
);

export default function ProductSelect(props) {
    return (
        <Select options={Object.keys(prodList).map(item => ({
                    value: item,
                    label: item
                }))}
                onChange={product => props.onProductChange(product.value)}
                defaultValue={{ value: "Produto", label: "Produto" }}
                styles={{
                    control: styles => ({
                        ...styles,
                        fontSize: "14px",
                        fontWeight: "600",
                        margin: '1em'
                    })
                }}
                key="select"/>
    )
}

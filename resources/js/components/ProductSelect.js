import React from "react";
import { Products } from "./resources/products";
import Select from "react-select";

const prodList = [0, 1, 2, 3].reduce(
    (acc, n) => [...acc, ...Object.keys(Products.categories[n])],
    []
);

export const ProductSelect = props =>
    <div style={{
            display: "inline-block",
            width: "-webkit-fill-available",
            margin: "1em"
        }}>
        <Select key="select"
                options={prodList.map(item => ({value:item, label:item}))}
                onChange={product => props.onProductChange(product.value)}
                defaultValue={{ value: "Produto", label: "Produto" }}
                styles={{
                    control: styles => ({
                        ...styles,
                        fontSize: "14px",
                        fontWeight: "600"
                    })
                }}/>
    </div>

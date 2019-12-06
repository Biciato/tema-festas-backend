import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import toCurrency from "../resources/currency";
import { Products } from "../resources/products";

export default function PriceComponent(props) {
    const handlePriceChange = e =>
        props.onPriceChange(`R$ ${toCurrency(e.target.value)}`);
    const getProdPrice = () => {
        if (props.prods[props.prodName].tipo_categoria === 0) {
            return props.prods[props.prodName].dados[props.size].valor_unitario;
        } else if (
            [1, 3].includes(props.prods[props.prodName].tipo_categoria)
        ) {
            return props.prods[props.prodName].valor_unitario;
        } else {
            return (
                "R$ " +
                (props.prods[props.prodName].dados[props.item]
                    ? props.prods[props.prodName].dados[props.item]
                          .valor_unitario
                    : Products.categories[2][props.prodName]
                          .find(item => item.name === props.item)
                          .price.toLocaleString("pt-br", {
                              minimumFractionDigits: 2
                          }))
            );
        }
    };
    if (props.show) {
        return (
            <InputGroup key="input-group" className="mt-3">
                <label
                    key="label"
                    style={{
                        width: "61%",
                        borderBottom: "1px solid #D7D7D7",
                        marginRight: "1em",
                        marginBottom: 0,
                        padding: "1em 0.5em 0.2em",
                        fontSize: "14px",
                        fontWeight: "normal"
                    }}
                >
                    Valor Geral
                </label>
                <FormControl
                    key="form-control"
                    value={getProdPrice()}
                    onChange={handlePriceChange}
                    style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        color: "#747474"
                    }}
                />
            </InputGroup>
        );
    } else {
        return null;
    }
}

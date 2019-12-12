import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import toCurrency from "./resources/currency";
import { Products } from "./resources/products";

export default function PriceComponent(props) {
    const handlePriceChange = e => props.onPriceChange(`R$ ${toCurrency(e.target.value)}`)
    const handlePriceChangeFromSubtypeList = e => 
        props.onPriceChangeFromSubtypeList(`R$ ${toCurrency(e.target.value)}`, props.item
    )
    const getProdPrice = () => {
        if (props.prods[props.prodName].tipo_categoria === 0) {
            return props.prods[props.prodName].dados[props.size].valor_unitario;
        } else if ([1, 3].includes(props.prods[props.prodName].tipo_categoria)) {
            return props.prods[props.prodName].valor_unitario;
        } else {
            return ("R$ " + ((props.prods[props.prodName].dados[props.item] 
                            && props.prods[props.prodName].dados[props.item].valor_unitario)
                            || (Products.categories[2][props.prodName].find(item => item.name === props.item)
                                    .price.toLocaleString("pt-br", {
                                        minimumFractionDigits: 2
                                    }))))
        }
    };
    if (props.show) {
        const handler = props.onPriceChange ? handlePriceChange : handlePriceChangeFromSubtypeList
        return (
            <InputGroup key="input-group" className={props.item ? 'mb-3' : 'mt-3'}>
                <label key="label"
                        style={{
                            width: "61%",
                            borderBottom: props.item ? 'none' : "1px solid #D7D7D7",
                            marginRight: "1em",
                            marginBottom: 0,
                            padding: props.item ? '0.5em 0.5em 0.2em' : "1em 0.5em 0.2em",
                            fontSize: "14px",
                            fontWeight: "normal",
                            color: props.item ? 'rgb(116, 116, 116)' : "",
                            borderTop: props.item ? '1px solid rgb(215, 215, 215)' : 'none'
                        }}>
                    {props.item ? 'Valor Unitário' : 'Valor Geral'}
                </label>
                <FormControl key="form-control"
                                value={getProdPrice()}
                                onChange={handler}
                                style={{ 
                                    borderRadius: "5px", 
                                    textAlign: "center", 
                                    color: "#747474", 
                                    backgroundColor: 'inherit'
                                }}/>
            </InputGroup>
        );
    } else { return null }
}

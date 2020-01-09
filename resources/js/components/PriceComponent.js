import React from "react";
import FormControl from "react-bootstrap/FormControl";
import toCurrency from "./resources/currency";
import { Products } from "./resources/products";

export default function PriceComponent(props) {
    const getProdCategory = prodName => [0, 1, 2, 3].find(item => Products.categories[item][prodName])
    const getProdPrice = (prodName, cat) => 
        [getProdPriceCat0, getProdPriceCat1Or3, getProdPriceCat2, getProdPriceCat1Or3][cat](prodName, cat)
    const getProdPriceCat0 = prodName => 
        _.get(
            props.prods, [props.prodName, 'dados', props.size, 'valor_unitario'],
            'R$ ' + Products.categories[0][prodName].size
                        .find((item) => item.name === props.size).price
                        .toLocaleString('pt-br', { minimumFractionDigits: 2 })
        )
    const getProdPriceCat1Or3 = (prodName, cat) => 
        _.get(
            props.prods, [props.prodName, 'valor_unitario'], 
            'R$ ' + Products.categories[cat][prodName].price.toLocaleString('pt-br', { minimumFractionDigits: 2 })
        )    
    const getProdPriceCat2 = prodName => 
        _.get(
            props.prods, [props.prodName, 'dados', props.subtype, 'valor_unitario'],
            'R$ ' + Products.categories[2][prodName]
                        .find((item) => item.name === props.subtype).price
                        .toLocaleString('pt-br', { minimumFractionDigits: 2 }) 
        )   
    const handlePriceChange = e => props.onPriceChange(`R$ ${toCurrency(e.target.value)}`)
    const handlePriceChangeFromSubtypeList = e => 
        props.onPriceChangeFromSubtypeList(`R$ ${toCurrency(e.target.value)}`, props.subtype)
    if (props.show) {
        const handler = props.onPriceChange ? handlePriceChange : handlePriceChangeFromSubtypeList
        const price = props.price || getProdPrice(props.prodName, getProdCategory(props.prodName))
        return (
            <div key="input-group" 
                        style={{
                            margin: '0 1em', 
                            height: '3em',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                <label key="label"
                        style={{
                            width: "12em",
                            fontSize: '14px',
                            marginTop: '0.5em',
                            color: props.color || 'inherit',
                            borderBottom: (props.borderBottom && '1px solid rgb(215, 215, 215)') || 'none',
                            ...props.labelStyle
                        }}>
                    {(props.uppercase && props.label.toUpperCase()) || props.label}
                </label>
                <FormControl key="form-control"
                                value={price}
                                onChange={handler}
                                style={{ 
                                    borderRadius: "5px", 
                                    textAlign: "center", 
                                    color: "#747474", 
                                    backgroundColor: 'inherit',
                                    display: props.priceInput ? '' : 'none',
                                    width: '6em'
                                }}/>
            </div>
        );
    } else { return null }
}

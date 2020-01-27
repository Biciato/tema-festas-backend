import React from "react";
import FormControl from "react-bootstrap/FormControl";
import toCurrency from "./resources/currency";
import { Products } from "./resources/products";
import './PriceComponent.css'

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
        return (
            <div key="input-group" className="price-input-group">
                <label key="label" className="price-label"
                        style={{
                            color: props.color || 'inherit',
                            borderBottom: (props.borderBottom && '1px solid rgb(215, 215, 215)') || 'none',
                            ...props.labelStyle
                        }}>
                    {(props.uppercase && props.label.toUpperCase()) || props.label}
                </label>
                <FormControl key="form-control"
                                bsPrefix="form-control price-form"
                                value={props.price || getProdPrice(props.prodName, getProdCategory(props.prodName))}
                                onChange={props.onPriceChange ? handlePriceChange : handlePriceChangeFromSubtypeList}
                                style={{ display: props.priceInput ? '' : 'none' }}/>
            </div>
        );
    } else { return null }
}

import React from "react"
import FormControl from 'react-bootstrap/FormControl';

export default function QuantityComponent(props) {
    const getProdQty = (item) => {
        if (props.prods[props.prodName].tipo_categoria === 0) {
            return getQtyCat0(item)            
        } else if (props.prods[props.prodName].dados[props.type][item]) {
            return props.prods[props.prodName].dados[props.type][item]
        } else if (props.prods[props.prodName] !== 'Etiquetas') {
            return props.prods[props.prodName].dados[item].quantidade
        } else if (props.prodName === 'Etiquetas') {
            return props.prods[props.prodName].dados[item]
        } else {
            return 0
        }        
    }
    const getQtyCat0 = (item) => 
        props.prods[props.prodName].dados[props.size][props.type][item]
            ? props.prods[props.prodName].dados[props.size][props.type][item]
            : 0
    const handlePlusQty = (item) => {
        handleQtyChange({
            target: {
                value: `${parseInt(getProdQty(item)) + 1}`,
            }
        }, item)
    }
    const handleMinusQty = (item) => {
        const value = parseInt(getProdQty(item)) - 1
        handleQtyChange({
            target: {
                value: value < 0 ? 0 : `${value}`,
            }
        }, item)
    }
    const handleQtyChange = (e, item) => {
        let qty = e.target.value.replace(/\D/g,'')
        if (qty.indexOf(0) === 0) { qty = qty.replace('0','') }
        const subtype = { name: item, qty }
        props.onQtyChange(subtype)
    }
    return (
        <div className="qty-div" 
                style={{display: 'flex', float: 'right', width: '33%', height: '100%'}}>
            <span onClick={() => handleMinusQty(props.item)}
                    key={'span-minus'}
                    style={{
                        fontSize: '30px',
                        display: 'inline-block',
                        verticalAlign: 'sub',
                        color: 'rgb(116, 116, 116)',
                        cursor: 'pointer'
                    }}>-</span>
            <FormControl key={(props.size ? props.size : '') + props.type + props.item + 'c-2'}
                            className="types-qty-input"
                            onChange={(e) => handleQtyChange(e, props.item)}
                            data={props.item + '-qty'}
                            value={getProdQty(props.item)}
                            style={{
                                border: 'none',
                                display: 'inline-block',
                                backgroundColor: 'inherit',
                                textAlign: 'center',
                                width: '73%',
                                height: '100%',
                                color: "rgb(116, 116, 116)"                             
                            }}/>
            <span onClick={() => handlePlusQty(props.item)}
                    key={'span-plus'}
                    style={{
                        fontSize: '30px',
                        display: 'inline-block',
                        verticalAlign: 'sub',
                        color: '#32338D',
                        cursor: 'pointer',
                        margin: 0,
                        padding: 0
                    }}>+</span>
        </div>
    )
}
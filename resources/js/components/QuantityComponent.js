import React from "react"
import FormControl from 'react-bootstrap/FormControl';

export default function QuantityComponent(props) {
    const getProdQty = (item) => {
        if (props.qty) {
            return props.qty
        } else {
            if (props.prods[props.prodName].tipo_categoria === 0) {
                return props.prods[props.prodName].dados[props.size][props.type]
                        && props.prods[props.prodName].dados[props.size][props.type][item] 
                        || 0           
            } else if (props.prods[props.prodName].tipo_categoria === 1) {
                return props.prods[props.prodName].dados[props.type][item] || 0
            } else if (props.prods[props.prodName].tipo_categoria === 2) {
                return props.prods[props.prodName].dados[item] 
                        && props.prods[props.prodName].dados[item].quantidade 
                        || 0
            } else if (props.prodName === 'Etiquetas') {
                return props.prods[props.prodName].dados[item] || 0
            } else {
                return 0
            }        
        }
    }
    const handlePlusQty = () => {
        handleQtyChange({ target: { value: `${parseInt(getProdQty(props.item)) + 1}`}})
    }
    const handleMinusQty = () => {
        const value = parseInt(getProdQty(props.item)) - 1
        handleQtyChange({ target: { value: value < 0 ? 0 : `${value}`}})
    }
    const handleQtyChange = (e) => {
        let qty = e.target.value.replace(/\D/g,'')
        if (qty.indexOf(0) === 0) { qty = qty.replace('0','') }
        const subtype = { name: props.item, qty }
        props.onQtyChange(subtype)
    }
    const spanStyle = {
        fontSize: '30px',
        display: 'inline-block',
        verticalAlign: 'sub',
        cursor: 'pointer',
        lineHeight: '1.2em'
    }
    const divStyle = (!props.qty && props.prods[props.prodName].tipo_categoria) === 2
                        ? { margin: '0.5em 0px 0 0.5em', height: '2.5em' }
                        : { margin: '0.5em 0 0.5em 0.5em'}
    return (
        <div style={divStyle}>
            <label key="c-0"
                    className="list-label"
                    style={{
                        fontSize: '14px',
                        fontWeight: 'normal',
                        marginRight: '1em',
                        marginBottom: 0,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxHeight: '70px',
                        paddingTop: '0.8em'
                    }}>
                        {props.item}
            </label>
            <div className="qty-div" 
                    style={{display: 'flex', float: 'right', width: '33%', height: '100%'}}>
                <span onClick={handleMinusQty}
                        key={'span-minus'}
                        style={{ ...spanStyle, color: 'rgb(116, 116, 116)'}}>
                            -
                </span>
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
                <span onClick={handlePlusQty}
                        key={'span-plus'}
                        style={{ ...spanStyle, color: '#32338D', margin: 0, padding: 0 }}>
                            +
                </span>
            </div>
        </div>
    )
}
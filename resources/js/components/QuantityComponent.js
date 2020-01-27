import React from "react"
import FormControl from 'react-bootstrap/FormControl';
import './QuantityComponent.css'

export const QuantityComponent = props => {
    const handlePlusQty = () => handleQtyChange({ target: { value: `${parseInt(props.qty) + 1}`}})
    const handleMinusQty = () =>
        handleQtyChange({ target: { value: `${props.qty > 0 ? (parseInt(props.qty) - 1) : 0}`}})
    const handleQtyChange = (e) => {
        let qty = e.target.value.replace(/\D/g,'')
        if (qty.indexOf(0) === 0 && qty.length > 1) { qty = qty.replace('0','') }
        if (qty === '') { qty = '0' }
        props.onQtyChange({ name: props.subtype, qty })
    }
    return (
        <div style={{ height: props.height || '4em'}} className="qty-cpt">
            <label key="c-0"
                    className="list-label"
                    style={{ borderBottom: (props.borderBottom && '1px solid rgb(215, 215, 215)') || 'none' }}>
                        {props.item || props.subtype}
            </label>
            <div className="qty-div">
                <span onClick={handleMinusQty} key="span-minus">-</span>
                <FormControl key={(props.size ? props.size : '') + props.type + props.subtype + 'c-2'}
                                className="types-qty-input"
                                onChange={(e) => handleQtyChange(e, props.subtype)}
                                data={props.subtype + '-qty'}
                                value={props.qty}
                                style={{ padding: props.padding ? '0.5em 0 0' : '' }}/>
                <span onClick={handlePlusQty} key="span-plus">+</span>
            </div>
        </div>
    )
}

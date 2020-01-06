import React from "react"
import FormControl from 'react-bootstrap/FormControl';

export default function QuantityComponent(props) {
    const handlePlusQty = () => {
        handleQtyChange({ target: { value: `${parseInt(props.qty) + 1}`}})
    }
    const handleMinusQty = () => {
        const value = parseInt(props.qty) - 1
        handleQtyChange({ target: { value: value < 0 ? '0' : `${value}`}})
    }
    const handleQtyChange = (e) => {
        let qty = e.target.value.replace(/\D/g,'')
        if (qty.indexOf(0) === 0) { qty = qty.replace('0','') }
        const subtype = { name: props.subtype, qty }
        props.onQtyChange(subtype)
    }
    const spanStyle = {
        fontSize: '30px',
        display: 'inline-block',
        verticalAlign: 'sub',
        cursor: 'pointer',
        lineHeight: '2em'
    }
    return (
        <div style={{ 
                height: props.height || '4em', 
                display: 'flex', 
                justifyContent: 'space-between',
                margin: '0 1em' 
            }}>
            <label key="c-0"
                    className="list-label"
                    style={{
                        fontSize: '14px',
                        fontWeight: 'normal',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        height: '100%',
                        lineHeight: '4em',
                        width: '12em',
                        borderBottom: (props.borderBottom && '1px solid rgb(215, 215, 215)') || 'none'
                    }}>
                        {props.item || props.subtype}
            </label>
            <div className="qty-div" 
                    style={{display: 'flex', width: '33%', height: '100%'}}>
                <span onClick={handleMinusQty}
                        key={'span-minus'}
                        style={{ ...spanStyle, color: 'rgb(116, 116, 116)'}}>
                            -
                </span>
                <FormControl key={(props.size ? props.size : '') + props.type + props.subtype + 'c-2'}
                                className="types-qty-input"
                                onChange={(e) => handleQtyChange(e, props.subtype)}
                                data={props.subtype + '-qty'}
                                value={props.qty}
                                style={{
                                    border: 'none',
                                    display: 'inline-block',
                                    backgroundColor: 'inherit',
                                    textAlign: 'center',
                                    width: '73%',
                                    height: '100%',
                                    color: "rgb(116, 116, 116)",
                                    padding: props.padding ? '0.5em 0 0' : ''                             
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
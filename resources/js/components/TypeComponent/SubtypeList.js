import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import { Types } from '../resources/types'
import { Products } from '../resources/products'
import './TypeList.css';
import PriceComponent from '../ProductComponent/PriceComponent';

export default function SubtypeList(props) {
    const getProdCategory = () => [0, 1, 2, 3].find(item => Products.categories[item][props.prodName])
    const getProdQty = (item) => {
        if (props.prods[props.prodName]) {
            if (props.prods[props.prodName].dados) {
                if (props.prods[props.prodName].dados[props.size] &&
                    props.prods[props.prodName].dados[props.size][props.type] &&
                        props.prods[props.prodName].dados[props.size][props.type][item]) {
                    return props.prods[props.prodName].dados[props.size][props.type][item]            
                } else if (props.prods[props.prodName].dados[props.type] &&
                            props.prods[props.prodName].dados[props.type][item]) {
                    return props.prods[props.prodName].dados[props.type][item]
                } else if (props.prods[props.prodName] !== 'Etiquetas' &&
                            props.prods[props.prodName].dados[item] && 
                            props.prods[props.prodName].dados[item].quantidade) {
                    return props.prods[props.prodName].dados[item].quantidade
                } else if (props.prodName === 'Etiquetas') {
                    if (props.prods[props.prodName].dados[item]) {
                        return props.prods[props.prodName].dados[item]
                    } else {
                        return 0
                    }
                } else {
                    return 0
                }
            } else {
                return 0
            }
        } else {
            return 0
        }        
    }
    const getTypes = () => {
        if ([0,1].includes(getProdCategory())) {
            return props.prodName.includes('ela') 
                        ? [...Array(10).keys()].map(x => ++x) 
                        : Types[props.type]
        } else if (props.prodName && props.prodName === 'Etiquetas') {
            return Products.categories[3].Etiquetas.names
        } else if (getProdCategory() === 2) {
            return Products.categories[2][props.prodName].map((item) => item.name)
        } else {
            return []
        }
    }
    const handlePriceChange = (price, item) => props.onPriceChange(price, item)
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
        props.onSubtypeChange(subtype)
    }
    
    if (props.show) {
        return getTypes().map((item, idx) => {
            return (
                <Row style={{ backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8') }}
                        key={idx + 'type'}>
                    <Col style={{display:'flex', justifyContent: 'space-between', flexWrap: 'wrap'}} 
                            key={'col' + idx}>
                        <div style={{margin: getProdCategory() === 2 
                                                ? '0.5em 0px 0 0.5em'
                                                : '0.5em 0 0.5em 0.5em',
                                    height: getProdCategory() === 2 
                                                ? '2.5em'
                                                : ''}}>
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
                                        {item}
                            </label>
                            <div className="qty-div" 
                                    key={idx + '-div'} 
                                    style={{display: 'flex', float: 'right', width: '33%', height: '100%'}}>
                                <span onClick={() => handleMinusQty(item)}
                                        key={'c-1-' + idx}
                                        style={{
                                            fontSize: '30px',
                                            display: 'inline-block',
                                            verticalAlign: 'sub',
                                            color: 'rgb(116, 116, 116)',
                                            cursor: 'pointer'
                                        }}>-</span>
                                <FormControl key={(props.size ? props.size : '') + props.type + item + 'c-2'}
                                                className="types-qty-input"
                                                onChange={(e) => handleQtyChange(e, item)}
                                                data={item + '-qty'}
                                                value={getProdQty(item)}
                                                style={{
                                                    border: 'none',
                                                    display: 'inline-block',
                                                    backgroundColor: 'inherit',
                                                    textAlign: 'center',
                                                    width: '73%'   ,
                                                    color: "rgb(116, 116, 116)"                             
                                                }}/>
                                <span onClick={() => handlePlusQty(item)}
                                        key={'b-1-' + idx}
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
                        </div>
                        <PriceComponent onPriceChangeFromSubtypeList={handlePriceChange}
                                        prods={props.prods}
                                        item={item}
                                        price={props.price}
                                        show={props.show === 'cat2' ? true : false}
                                        prodName={props.prodName}
                                        size={props.size}
                                        key="price-cpt"/>                       
                    </Col>
                </Row>
            )
        })
    } else {
        return null
    }
}

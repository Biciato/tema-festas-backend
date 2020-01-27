import React from 'react'
import { QuantityComponent } from './QuantityComponent'
import PriceComponent from './PriceComponent'
import TotalPricePerBlockComponent from "./TotalPricePerBlockComponent"
import TotalQtyPerBlockComponent from './TotalQtyPerBlockComponent'

export const ProdBlock = props =>
    <div id={props.prod} className="products" style={{ marginTop: "2em" }} key={props.prod}>
        <PriceComponent key="price-cpt"
                        show={true}
                        price={props.prod.valor_unitario || "1,00"}
                        label={props.prodName + ' ' + (props.size || '')}
                        labelStyle={{ fontWeight: 'bold', color: 'rgb(50, 51, 141)' }}
                        uppercase={true}
                        onPriceChange={(price) => props.onPriceChange(props.prodName, props.size || null, price)}
                        priceInput={props.prod.tipo_categoria !== 2}/>
        {(props.prod.tipo_categoria
            && Object.keys(props.prod.dados).filter((type) => type !== 'valor_unitario').map((type, idx) => {
                if (props.prod.tipo_categoria === 2) {
                    return (
                        <div style={{ backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8') }}
                                key={idx + 'type'}>
                            <QuantityComponent key={type + idx}
                                                qty={props.prod.dados[type].quantidade}
                                                height="3em"
                                                borderBottom={true}
                                                subtype={type}
                                                onQtyChange={(subtype) => props.onSubtypeChange(props.prodName, subtype)}/>
                            <PriceComponent price={props.prod.dados[type].valor_unitario}
                                            key={type + idx + 'price'}
                                            label="Valor Unitário"
                                            priceInput={true}
                                            color="rgb(116, 116, 116)"
                                            onPriceChange={(price) => props.onPriceChange(props.prodName, type, price)}
                                            show={true}/>
                        </div>
                    )
                } else if (props.prod.tipo_categoria === 1) {
                    return Object.keys(props.prod.dados[type]).map((subtype, idx) =>
                        <div style={{ backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8') }}
                                key={idx + 'type'}>
                            <QuantityComponent key={type + subtype + idx}
                                                qty={props.prod.dados[type][subtype]}
                                                subtype={`${type} ${subtype}`}
                                                onQtyChange={(subtype) => props.onSubtypeChange(props.prodName, type, subtype)}/>
                        </div>
                    )
                } else {
                    return (
                        <div style={{ backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8') }}
                                key={idx + 'type'}>
                            <QuantityComponent key={type}
                                                qty={props.prod.dados[type]}
                                                subtype={type}
                                                onQtyChange={(subtype) => props.onSubtypeChange(props.prodName, subtype)}/>
                        </div>
                    )
                }
            }))
            || Object.keys(props.prod).filter((type) => type !== 'valor_unitario').map((type) =>
                Object.keys(props.prod[type]).map((subtype, idx) =>
                    <div style={{ backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8') }}
                            key={idx + 'type'}>
                        <QuantityComponent key={type + subtype + idx}
                                            qty={props.prod[type][subtype]}
                                            subtype={`${type} ${subtype}`}
                                            onQtyChange={(subtype) => props.onSubtypeChange(props.prodName, props.size, type, subtype)}/>
                    </div>
                )
            )
        }
        <div key="cat3-div3"
                style={{
                    padding: "0.5em 0.1em",
                    height: "2.5em",
                    margin: "0 1em",
                    borderBottom: "1px solid #D7D7D7",
                    fontSize: "14px"
                }}>
            <TotalQtyPerBlockComponent prod={props.prod} key="total-qty"/>
            <TotalPricePerBlockComponent prod={props.prod} key="total-price"/>
        </div>
    </div>

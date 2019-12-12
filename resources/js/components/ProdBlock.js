import React from 'react'
import QuantityComponent from './QuantityComponent'
import PriceComponent from './PriceComponent'
import TotalPricePerBlockComponent from "./TotalPricePerBlockComponent"
import TotalQtyPerBlockComponent from './TotalQtyPerBlockComponent'

export default function ProdBlock(props) {
    return (
        <div id={props.prod}
                className="products"
                style={{
                    marginTop: "2em"
                }}
                data="3"
                key={props.prod}>
            <div style={{ padding: "0.1em", height: "2.5em", marginLeft: "0.8em" }}
                    key="cat3-div1">
                <span key="item-span"
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "0.4em",
                            display: "inline-block",
                            maxWidth: '60%',
                            color: "#32338D"
                        }}>
                    {Object.keys(props.prod)[0].toUpperCase()}
                </span>
                <PriceComponent key="price-cpt"/>
            </div>
            {Object.keys(props.prod).filter((type) => type !== 'valor_unitario').map((type, idx) => 
                Object.keys(props.prod[type]).map((subtype) => 
                    <QuantityComponent qty={props.prod[type][subtype]} key={type + subtype + idx}/>
                )                
            )}
            <div key="cat3-div3"
                    style={{
                        padding: "0.5em 0.1em",
                        height: "2.5em",
                        margin: "0 2em 0 1em",
                        borderBottom: "1px solid #D7D7D7",
                        fontSize: "14px"
                    }}>
                <TotalQtyPerBlockComponent prod={props.prod} key="total-qty"/>
                <TotalPricePerBlockComponent prod={props.prod} key="total-price"/>
            </div> 
        </div>
    )
}
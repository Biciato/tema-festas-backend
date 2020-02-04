import React from "react"
import { getTypes, getSubtypeQty } from './resources/product.functions'
import "./SubtypeList.css"
import { PriceComponent } from "./PriceComponent"
import { QuantityComponent } from "./QuantityComponent"

export const SubtypeList = props => props.show &&
    getTypes(props.prodName, props.type).map((subtype, idx) => (
        <div key={subtype + idx}
            style={{
                backgroundColor: idx % 2 === 0 ? "white" : "#F8F8F8",
                marginBottom: idx ===
                    getTypes(props.prodName, props.type).length - 1
                        ? "5em"
                        : ""
            }}>
            <QuantityComponent key={idx + "-div"}
                onQtyChange={subtype => props.onSubtypeChange(subtype)}
                subtype={subtype}
                height={props.show === "cat2" ? "3em" : ""}
                borderBottom={props.show === "cat2" ? true : false}
                qty={getSubtypeQty(
                    props.prods,
                    props.prodName,
                    props.size,
                    props.type,
                    subtype
                )}
                padding={props.show === "cat2" ? true : false}/>
            <PriceComponent key="price-cpt"
                onPriceChangeFromSubtypeList={(price, subtype) =>
                    props.onPriceChange(price, subtype)
                }
                prods={props.prods}
                subtype={subtype}
                show={props.show === "cat2" ? true : false}
                prodName={props.prodName}
                size={props.size}
                priceInput={true}
                label="Valor Unitário"/>
        </div>
    )) || null

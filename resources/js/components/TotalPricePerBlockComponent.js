import React from "react"

export default function TotalPricePerBlockComponent(props) {
    const getNormPrice = (price) => 
        price ? parseFloat(price.replace("R$", "").replace(/\./g,'').replace(",", ".").trim()) : 0
    const getTotal = () => {
        const prodTypes = {
            0: getTotalCat0(),
            1: getTotalCat1(),
            2: getTotalCat2(),
            3: getTotalCat3()
        }
        return prodTypes[props.prod.tipo_categoria || 0]
    }
    const getTotalCat0 = () => 
        (props.prod && (Object.keys(props.prod).filter((key) => key !== 'valor_unitario').reduce((oldType, type) => 
            Object.keys(props.prod[type]).reduce((oldSubtype, subtype) =>
                parseInt(props.prod[type][subtype]) + oldSubtype, 0
            ) + oldType, 0
        ) * getNormPrice(props.prod.valor_unitario))) || 0
    const getTotalCat1 = () =>
        (props.prod.dados && (Object.keys(props.prod.dados).reduce((oldType, type) => 
            Object.keys(props.prod.dados[type]).reduce((oldSubtype, subtype) =>
                parseInt(props.prod.dados[type][subtype]) + oldSubtype, 0
            ) + oldType, 0
        ) * getNormPrice(props.prod.valor_unitario))) || 0
    const getTotalCat2 = () =>
        (props.prod.dados && (Object.keys(props.prod.dados).reduce((oldSubtype, subtype) =>
                (parseInt(props.prod.dados[subtype].quantidade) 
                    * getNormPrice(props.prod.dados[subtype].valor_unitario)) 
                    + oldSubtype, 0))) || 0
    const getTotalCat3 = () =>
        (props.prod.dados && (Object.keys(props.prod.dados).reduce((oldSubtype, subtype) => 
            parseInt(props.prod.dados[subtype]) + oldSubtype, 0
        ) * getNormPrice(props.prod.valor_unitario))) || 0
    return (
        <>
            <span style={{ fontWeight: "normal", padding: "0.4em", marginLeft: '5%'}}>
                Total: R$
            </span>
            <span style={{ float: "right", color: "darkgray", marginLeft: "1em"}}>
                {getTotal(props.item).toLocaleString("pt-br", {
                    minimumFractionDigits: 2
                })}
            </span>
        </>
    )
}
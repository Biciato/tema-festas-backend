import React from 'react'

export default function TotalQtyComponent(props) {
    const getTotal = () => getTotalCat0() + getTotalCat1() + getTotalCat2() + getTotalCat3()
    const getTotalCat0 = () => 
        (Object.keys(props.prods).some((prod) => props.prods[prod].tipo_categoria === 0)
            && Object.keys(props.prods)
                .filter((prod) => props.prods[prod].tipo_categoria === 0)
                .reduce((oldProd, prod) => 
                    Object.keys(props.prods[prod].dados).reduce((oldSize, size) => 
                        Object.keys(props.prods[prod].dados[size])
                            .filter((key) => key !== 'valor_unitario')
                            .reduce((oldType, type) =>
                                Object.keys(props.prods[prod].dados[size][type]).reduce((oldSubtype, subtype) => 
                                    parseInt(props.prods[prod].dados[size][type][subtype]) + oldSubtype, 0
                                ) + oldType, 0    
                            ) + oldSize, 0
                    ) + oldProd, 0
                )) || 0    
    const getTotalCat1 = () =>
        (Object.keys(props.prods).some((prod) => props.prods[prod].tipo_categoria === 1)
            && Object.keys(props.prods)
                .filter((prod) => props.prods[prod].tipo_categoria === 1)
                .reduce((oldProd, prod) => 
                    Object.keys(props.prods[prod].dados).reduce((oldType, type) =>
                        Object.keys(props.prods[prod].dados[type]).reduce((oldSubtype, subtype) => 
                            parseInt(props.prods[prod].dados[type][subtype]) + oldSubtype, 0
                        ) + oldType, 0
                    ) + oldProd, 0
                )) || 0      
    const getTotalCat2 = () =>
        (Object.keys(props.prods).some((prod) => props.prods[prod].tipo_categoria === 2)
            && Object.keys(props.prods)
                .filter((prod) => props.prods[prod].tipo_categoria === 2)
                .reduce((oldProd, prod) => 
                    Object.keys(props.prods[prod].dados).reduce((oldSubtype, subtype) =>
                        parseInt(props.prods[prod].dados[subtype].quantidade) + oldSubtype, 0
                    ) + oldProd, 0
                )) || 0
    const getTotalCat3 = () =>
        (props.prods.Etiquetas && Object.keys(props.prods.Etiquetas.dados).reduce((oldSubtype, subtype) => 
            parseInt(props.prods.Etiquetas.dados[subtype]) + oldSubtype, 0
        )) || 0
    if (props.prods) {
        return (
            <div key="cart-div2-div1"
                    style={{
                        padding: "0.1em",
                        height: "2em",
                        color: "#32338D",
                        fontWeight: "bold",
                        margin: "1em 1em 0"
                    }}>
                <span key="cart-div2-div1-s1"> Quantidade: </span>
                <span key="cart-div2-div1-s2" id="totalQty" style={{ float: "right" }}>
                    {getTotal()}
                </span>
            </div>
        )
    } else { return null }
    
}
import React from "react";
import "./TotalComponent.css";

export const TotalComponent = props => {
    const getNormPrice = (price) =>
        price ? parseFloat(price.replace("R$", "").replace(/\./g,'').replace(",", ".").trim()) : 0
    const getTotal = () => getTotalCat0() + getTotalCat1() + getTotalCat2() + getTotalCat3()
    const getTotalCat0 = () =>
        (Object.keys(props.prods).some((prod) => props.prods[prod].tipo_categoria === 0)
            && Object.keys(props.prods)
                .filter((prod) => props.prods[prod].tipo_categoria === 0)
                .reduce((oldProd, prod) =>
                    Object.keys(props.prods[prod].dados).reduce((oldSize, size) =>
                        (getNormPrice(props.prods[prod].dados[size].valor_unitario) *
                        Object.keys(props.prods[prod].dados[size])
                            .filter((key) => key !== 'valor_unitario')
                            .reduce((oldType, type) =>
                                Object.keys(props.prods[prod].dados[size][type]).reduce((oldSubtype, subtype) =>
                                    parseInt(props.prods[prod].dados[size][type][subtype]) + oldSubtype, 0
                                ) + oldType, 0
                            )) + oldSize, 0
                    ) + oldProd, 0
                )) || 0
    const getTotalCat1 = () =>
        (Object.keys(props.prods).some((prod) => props.prods[prod].tipo_categoria === 1)
            && Object.keys(props.prods)
                .filter((prod) => props.prods[prod].tipo_categoria === 1)
                .reduce((oldProd, prod) =>
                    (getNormPrice(props.prods[prod].valor_unitario) *
                    Object.keys(props.prods[prod].dados).reduce((oldType, type) =>
                        Object.keys(props.prods[prod].dados[type]).reduce((oldSubtype, subtype) =>
                            parseInt(props.prods[prod].dados[type][subtype]) + oldSubtype, 0
                        ) + oldType, 0
                    )) + oldProd, 0
                )) || 0
    const getTotalCat2 = () =>
        Object.keys(props.prods).filter((prod) => props.prods[prod].tipo_categoria === 2)
                .reduce((oldProd, prod) => Object.keys(props.prods[prod].dados).reduce((oldSubtype, subtype) =>
                    (parseInt(props.prods[prod].dados[subtype].quantidade)
                        * getNormPrice(props.prods[prod].dados[subtype].valor_unitario))
                        + oldSubtype, 0
                ) + oldProd, 0) || 0
    const getTotalCat3 = () =>
        (props.prods.Etiquetas && (Object.keys(props.prods.Etiquetas.dados).reduce((oldSubtype, subtype) =>
            parseInt(props.prods.Etiquetas.dados[subtype]) + oldSubtype, 0
        ) * getNormPrice(props.prods.Etiquetas.valor_unitario))) || 0
    const handleClick = () =>
        parseFloat(getTotal()) > 0
            ? window.location.assign('/resumo')
            : null
    return (
        <div className={"footer-total" + (props.display ? " d-none" : "")}
                style={{ textAlign: "left" }}
                onClick={handleClick}>
            <img src="/images/shopping-bag-white.svg"
                    key="img"
                    alt="user"
                    style={{
                        width: "5%",
                        margin: "0.2em",
                        paddingBottom: "0.2em"
                    }} />
            <span key="s-1">Sacola:</span>
            <span style={{ float: "right" }} key="s-2">
                {'R$ ' + getTotal().toLocaleString('pt-br', {minimumFractionDigits: 2})}
            </span>
        </div>
    )
}

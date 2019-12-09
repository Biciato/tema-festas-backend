import React from "react";
import "./TotalComponent.css";
import { Products } from "./resources/products";

export default function TotalComponent(props) {
    const getTotalPrice = (props) => (
        getTotalCat0(props.prods) +
        getTotalCat1(props.prods) +
        getTotalCat2(props.prods) +
        getTotalCat3(props.prods)
    ).toLocaleString("pt-br", { minimumFractionDigits: 2 })
    const getTotalCat3 = (prods) => {
        if (prods.Etiquetas && prods.Etiquetas.valor_unitario) {
            let price = prods.Etiquetas.valor_unitario === 'R$ ' 
                            ? 'R$ 0' 
                            : prods.Etiquetas.valor_unitario;
            let normString = price.replace("R$", "");
            let normString2 = normString.replace(/\./g,'').replace(",", ".").trim();
            const unitPrice = parseFloat(normString2);
            const qty = Object.keys(prods.Etiquetas.dados).reduce((o, item) => 
                (parseInt(prods.Etiquetas.dados[item]) || 0) + o, 0
            )
            return unitPrice * qty;
        } else {
            return 0;
        }
    }
    const getTotalCat1 = (prods) => 
        getCat1Prods(prods).reduce((o, item) => (getCat1UnitPrice(item) * getCat1Qties(item)) + o, 0
    )
    const getCat1Prods = (prods) => Object.keys(prods).filter(item => Products.categories[1][item])
    const getCat1UnitPrice = (item) => {
        if (props.prods[item] && props.prods[item].valor_unitario) {
            let price = props.prods[item].valor_unitario === 'R$ ' 
                            ? 'R$ 0' 
                            : props.prods[item].valor_unitario
            let normString = price.replace("R$", "");
            let normString2 = normString.replace(/\./g,'').replace(",", ".").trim();
            return parseFloat(normString2);
        } else {
            return 0;
        }
    }
    const getCat1Qties = (item) =>
        (props.prods[item] && props.prods[item].dados) 
            ? Object.keys(props.prods[item].dados).reduce((old, i) =>
                Object.keys(props.prods[item].dados[i]).reduce((o, k) =>
                    (parseInt(props.prods[item].dados[i][k]) || 0) + o, 0
                ) + old, 0
            )
            : 0
    const getTotalCat2 = (prods) => 
        getCat2Prods(prods).reduce((o, item) => getCat2TotalPerProd(item) + o, 0)
    const getCat2Prods = (prods) => Object.keys(prods).filter(item => Products.categories[2][item])
    const getCat2TotalPerProd = (item) =>
        (props.prods[item] && props.prods[item].dados) 
            ? Object.keys(props.prods[item].dados).reduce((o, k) =>
                (parseInt(props.prods[item].dados[k].quantidade) ||
                    0) * getNormPrice(props.prods[item].dados[k].valor_unitario) + o,  0
            )
            : 0
    const getNormPrice = (price) => {
        let NormPrice = price === 'R$ ' ? 'R$ 0' : price
        let priceNorm = NormPrice.replace("R$", "");
        let priceNorm2 = priceNorm.replace(/\./g,'').replace(",", ".").trim();
        return parseFloat(priceNorm2);
    }
    const getTotalCat0 = (prods) =>
        prods 
            ? getCat0Prods(prods).reduce((o, item) => 
                getCat0TotalPerProd(item) + o, 0
            )
            : 0        
    const getCat0Prods = (prods) => Object.keys(prods).filter(item => Products.categories[0][item])
    const getCat0TotalPerProd = (item) =>
        props.prods[item].dados !== ""
            ? Object.keys(props.prods[item].dados).reduce(
                (o, k) => getCat0PerTypes(item, k) + o,
                0
            ) 
            : 0
    const getCat0PerTypes = (item, type) =>
        props.prods[item].dados[type] !== null
            ? Object.keys(props.prods[item].dados[type])
                .filter(item => item !== "valor_unitario")
                .reduce((old, key) =>
                    getCat0PerSubtypes(item, type, key) + old, 0
                )
            : 0
    const getCat0PerSubtypes = (item, type, subtype) => {
        let price = props.prods[item].dados[type].valor_unitario === 'R$ ' 
                        ? 'R$ 0' 
                        : props.prods[item].dados[type].valor_unitario
        let normString = typeof price === 'string' ? price.replace("R$", "") : 0
        let normString2 = typeof price === 'string' 
                            ? normString.replace(",", ".").replace(/\./g,'').trim() 
                            : 0
        if (props.prods[item].dados[type][subtype] !== null) {
            return (
                Object.keys(props.prods[item].dados[type][subtype])
                    .filter(st => props.prods[item].dados[type][subtype][st] !== "")
                    .reduce((o, k) =>
                        (parseInt(props.prods[item].dados[type][subtype][k]) || 0) + o, 0
                    ) * (parseInt(normString2) / 100)
            )
        } else {
            return 0;
        }
    }
    const handleClick = () => 
        parseFloat(getTotalPrice(props)) > 0 
            ? window.location.assign('/resumo') 
            : null
    const total = getTotalPrice(props)
    return (
        <div
            className={"footer-total" + (props.display ? " d-none" : "")}
            style={{ textAlign: "left" }}
            onClick={handleClick}
        >
            <img
                src="/images/shopping-bag-white.svg"
                key="img"
                alt="user"
                style={{
                    width: "5%",
                    margin: "0.2em",
                    paddingBottom: "0.2em"
                }}
            ></img>
            <span key="s-1">Sacola:</span>
            <span style={{ float: "right" }} key="s-2">
                R$ {total}
            </span>
        </div>
    )
}

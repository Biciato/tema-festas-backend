import React from "react"
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import AfterOrderComponent from "../AfterOrderComponent";
import NewProductComponent from "../NewProductComponent";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './CartComponent.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Products } from "../resources/products";

export default class CartComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handlePlusQty = this.handlePlusQty.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleMinusQty = this.handleMinusQty.bind(this);
        this.handleFinishOrder = this.handleFinishOrder.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.getTotalPricePerProduct = this.getTotalPricePerProduct.bind(this);
        this.getTotalQtyCat2 = this.getTotalQtyCat2.bind(this);
        this.getTotalPriceCat2 = this.getTotalPriceCat2.bind(this);
        this.getTotalQtyCat0 = this.getTotalQtyCat0.bind(this);
        this.getTotalPriceCat0 = this.getTotalPriceCat0.bind(this);
        this.mountCat0List = this.mountCat0List.bind(this);
        this.mountCat1List = this.mountCat1List.bind(this);
        this.mountCat2List = this.mountCat2List.bind(this);
        this.mountCat3List = this.mountCat3List.bind(this);
        this.mountProdList = this.mountProdList.bind(this);
        this.getTotalCat1Total = this.getTotalCat1Total.bind(this)
        this.getCat1UnitPriceTotal = this.getCat1UnitPriceTotal.bind(this)
        this.getCat1QtiesTotal = this.getCat1QtiesTotal.bind(this)
        this.getCat1QtiesTotal = this.getCat1QtiesTotal.bind(this)
        this.getCat2TotalPerProdTotal = this.getCat2TotalPerProdTotal.bind(this)
        this.getTotalCat0Total = this.getTotalCat0Total.bind(this)
        this.getCat0TotalPerProdTotal = this.getCat0TotalPerProdTotal.bind(this)
        this.getCat0PerTypesTotal = this.getCat0PerTypesTotal.bind(this)
        this.getCat0PerSubtypesTotal = this.getCat0PerSubtypesTotal.bind(this)
        this.getTotalQtyCat0Total = this.getTotalQtyCat0Total.bind(this)
        this.getTotalQtyTotal = this.getTotalQtyTotal.bind(this)
        this.state = {
            order: props.location.state.order,
            showAfterOrder: false,
            loader: false,
            redirect: props.location.state === undefined ? true : false,
            prods: this.getProds(props)
        };
    }
    componentDidMount() {
        this.setState({
            totalPrice: (
                this.getTotalCat0Total(this.state.prods) +
                this.getTotalCat1Total(this.state.prods) +
                this.getTotalCat2Total(this.state.prods) +
                this.getTotalCat3Total(this.state.prods)
            ).toLocaleString("pt-br", { minimumFractionDigits: 2 }),
            totalQty: (
                this.getTotalQtyCat0Total(this.state.prods) +
                this.getTotalQtyCat1Total(this.state.prods) +
                this.getTotalQtyCat2Total(this.state.prods) +
                this.getTotalQtyCat3Total(this.state.prods)
            )
        })
    }
    getTotalCat3Total(prods) {
        if (prods.Etiquetas && prods.Etiquetas.valor_unitario) {
            let price = prods.Etiquetas.valor_unitario === 'R$ ' ? 'R$ 0' : prods.Etiquetas.valor_unitario;
            let normString = price.replace("R$", "");
            let normString2 = normString.replace(/\./g,'').replace(",", ".").trim();
            const unitPrice = parseFloat(normString2);
            const qty = Object.keys(prods.Etiquetas.dados).reduce(
                (o, item) => (parseInt(prods.Etiquetas.dados[item]) || 0) + o,
                0
            );
            return unitPrice * qty;
        } else {
            return 0;
        }
    }
    getTotalCat1Total(prods) {
        return this.getCat1ProdsTotal(prods).reduce(
            (o, item) =>
                this.getCat1UnitPriceTotal(item) * this.getCat1QtiesTotal(item) + o,
            0
        );
    }
    getCat1ProdsTotal(prods) {
        return Object.keys(prods).filter(item => Products.categories[1][item]);
    }

    getCat1UnitPriceTotal(item) {
        if (this.state.prods[item] && this.state.prods[item].valor_unitario) {
            let price = this.state.prods[item].valor_unitario === 'R$ ' ? 'R$ 0' : this.state.prods[item].valor_unitario
            let normString = price.replace("R$", "");
            let normString2 = normString.replace(/\./g,'').replace(",", ".").trim();
            return parseFloat(normString2);
        } else {
            return 0;
        }
    }
    getCat1QtiesTotal(item) {
        if (this.state.prods[item] && this.state.prods[item].dados) {
            return Object.keys(this.state.prods[item].dados).reduce(
                (old, i) =>
                    Object.keys(this.state.prods[item].dados[i]).reduce(
                        (o, k) =>
                            (parseInt(this.state.prods[item].dados[i][k]) ||
                                0) + o,
                        0
                    ) + old,
                0
            );
        } else {
            return 0;
        }
    }
    getTotalCat2Total(prods) {
        return this.getCat2ProdsTotal(prods).reduce(
            (o, item) => this.getCat2TotalPerProdTotal(item) + o,
            0
        );
    }
    getCat2ProdsTotal(prods) {
        return Object.keys(prods).filter(item => Products.categories[2][item]);
    }
    getCat2TotalPerProdTotal(item) {
        if (this.state.prods[item] && this.state.prods[item].dados) {
            return Object.keys(this.state.prods[item].dados).reduce(
                (o, k) =>
                    (parseInt(this.state.prods[item].dados[k].quantidade) ||
                        0) *
                        this.getNormPrice(
                            this.state.prods[item].dados[k].valor_unitario
                        ) +
                    o,
                0
            );
        } else {
            return 0;
        }
    }
    getNormPrice(price) {
        let NormPrice = price === 'R$ ' ? 'R$ 0' : price
        let priceNorm = NormPrice.replace("R$", "");
        let priceNorm2 = priceNorm.replace(/\./g,'').replace(",", ".").trim();
        return parseFloat(priceNorm2);
    }
    getTotalCat0Total(prods) {
        if (prods) {
            return this.getCat0ProdsTotal(prods).reduce(
                (o, item) => this.getCat0TotalPerProdTotal(item) + o,
                0
            );
        }
    }
    getCat0ProdsTotal(prods) {
        return Object.keys(prods).filter(item => Products.categories[0][item]);
    }
    getCat0TotalPerProdTotal(item) {
        if (this.state.prods[item].dados !== "") {
            return Object.keys(this.state.prods[item].dados).reduce(
                (o, k) => this.getCat0PerTypesTotal(item, k) + o,
                0
            );
        } else {
            return 0;
        }
    }

    getCat0PerTypesTotal(item, type) {
        if (this.state.prods[item].dados[type] !== null) {
            return Object.keys(this.state.prods[item].dados[type])
                .filter(item => item !== "valor_unitario")
                .reduce(
                    (old, key) =>
                        this.getCat0PerSubtypesTotal(item, type, key) + old,
                    0
                );
        } else {
            return 0;
        }
    }

    getCat0PerSubtypesTotal(item, type, subtype) {
        let price = (this.state.prods[item].dados[type].valor_unitario === 'R$ '
                        ||  this.state.prods[item].dados[type].valor_unitario === '') ? 'R$ 0' : this.state.prods[item].dados[type].valor_unitario
        let normString = typeof price === 'string' ? price.replace("R$", "") : '0';
        let normString2 = typeof price === 'string' ? normString.replace(",", ".").replace(/\./g,'').trim() : '0';
        if (this.state.prods[item].dados[type][subtype] !== null) {
            return (
                Object.keys(this.state.prods[item].dados[type][subtype])
                    .filter(
                        st =>
                            this.state.prods[item].dados[type][subtype][st] !==
                            ""
                    )
                    .reduce(
                        (o, k) =>
                            (parseInt(
                                this.state.prods[item].dados[type][subtype][k]
                            ) || 0) + o,
                        0
                    ) * (parseInt(normString2) / 100)
            );
        } else {
            return 0;
        }
    }
    getTotalQtyCat0Total(prods) {
        return Object.keys(prods)
            .filter(el => prods[el].tipo_categoria === 0)
            .reduce(
                (old, key) =>
                    Object.keys(prods[key].dados).reduce(
                        (ol, ke) =>
                            Object.keys(prods[key].dados[ke])
                                .filter(
                                    e =>
                                        e !== "valor_unitario" ||
                                        prods[key].dados[ke][e] !== null
                                )
                                .reduce(
                                    (o, k) =>
                                        this.getTotalQtyCat0LastLevel(
                                            prods,
                                            key,
                                            ke,
                                            k
                                        ) + o,
                                    0
                                ) + ol,
                        0
                    ) + old,
                0
            );
    }
    getTotalQtyCat0LastLevel(prods, key, ke, k) {
        if (k !== "valor_unitario" && prods[key].dados[ke][k] !== null) {
            return Object.keys(prods[key].dados[ke][k]).reduce(
                (l, i) => prods[key].dados[ke][k][i] === '' 
                            ? 0
                            : (parseInt(prods[key].dados[ke][k][i]) || 0)
                     + l,
                0
            );
        } else {
            return 0;
        }
    }
    getTotalQtyCat1Total(prods) {
        return Object.keys(prods)
            .filter(el => prods[el].tipo_categoria === 1)
            .reduce(
                (old, key) =>
                    Object.keys(prods[key].dados).reduce(
                        (ol, ke) =>
                            Object.keys(prods[key].dados[ke]).reduce(
                                (o, k) =>
                                    (parseInt(prods[key].dados[ke][k]) || 0) +
                                    o,
                                0
                            ) + ol,
                        0
                    ) + old,
                0
            );
    }
    getTotalQtyCat2Total(prods) {
        return Object.keys(prods)
            .filter(el => prods[el].tipo_categoria === 2)
            .reduce(
                (old, key) =>
                    Object.keys(prods[key].dados).reduce(
                        (ol, ke) =>
                            (parseInt(prods[key].dados[ke].quantidade) || 0) +
                            ol,
                        0
                    ) + old,
                0
            );
    }

    getTotalQtyCat3Total(prods) {
        if (prods["Etiquetas"]) {
            return Object.keys(prods["Etiquetas"].dados).reduce(
                (old, key) =>
                    (parseInt(prods["Etiquetas"].dados[key]) || 0) + old,
                0
            );
        } else {
            return 0;
        }
    }
    getTotalQtyTotal() {
        if (this.state.prods !== null) {
            return (
                this.getTotalQtyCat0(this.props.prods) +
                this.getTotalQtyCat1(this.props.prods) +
                this.getTotalQtyCat2(this.props.prods) +
                this.getTotalQtyCat3(this.props.prods)
            );
        } else {
            return 0;
        }
    }
    moeda(i) {
        let v = i.replace('R$', '').trim().replace(/\D/g,'');
        v = (v/100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
        return v;
    }

    handlePriceChange(e, div, type2 = false) {
        const price = e.target.value.replace('R$', '').trim()
        e.target.value = 'R$ ' + this.moeda(price)
        this.setTotalQtyPerBlockOnChange(div, type2)
    }
    getProds(props) {
        if (localStorage.getItem("prods") !== null && Object.keys(localStorage.getItem('prods')).length !== 15) {
            return JSON.parse(localStorage.getItem("prods"))
        } else if (props.location && props.location.state && props.location.state.prods) {
            return props.location.state.prods
        } else {
            return {}
        }
    }
    mountCat0Json(toFn) {
        let json = {}
        for (let i of Array.from(Array(document.querySelectorAll('[data="0"]').length),(x,item)=>item)) {
            const el = document.querySelectorAll('[data="0"]')[i]
            const product = el.id.split('-')[0]
            const size = el.id.split('-')[1]
            let type = {}
            for (let e of Array.from(Array((el.children.length - 2)), (x, it)=>it+1)) {
                type = Object.assign({}, type, {
                    [el.children[e].children[0].innerHTML.trim().split(' ')[0]] :
                        Object.assign({}, type[el.children[e].children[0].innerHTML.trim().split(' ')[0]], {
                            [el.children[e].children[0].innerHTML.trim().split(' ')[1]] :
                                el.children[e].children[1].children[1].value
                        })
                })
            }
            json  = Object.assign({}, json, {
                [product]: {
                    tipo_categoria: 0,
                    dados: Object.assign({}, json[product] ? json[product].dados : {}, {
                        [size]: {
                            valor_unitario: toFn === 'ajax'
                                                ? document.querySelectorAll('[data="0"]')[i].children[0].children[1].value
                                                    .replace('R$','')
                                                    .replace(',','.')
                                                    .trim()
                                                : document.querySelectorAll('[data="0"]')[i].children[0].children[1].value,
                            ...type
                        }
                    })
                }
            })
        }
        return json
    }
    mountCat1Json(toFn) {
        let json = {}
        for (let i of Array.from(Array(document.querySelectorAll('[data="1"]').length),(x,item)=>item)) {
            const el = document.querySelectorAll('[data="1"]')[i]
            const product = el.id
            let type = {}
            for (let e of Array.from(Array((el.children.length - 2)), (x, it)=>it+1)) {
                type = Object.assign({}, type, {
                    [el.children[e].children[0].innerHTML.trim().split(' ')[0]] :
                        Object.assign({}, type[el.children[e].children[0].innerHTML.trim().split(' ')[0]], {
                            [el.children[e].children[0].innerHTML.trim().split(' ')[1]] :
                                el.children[e].children[1].children[1].value
                        })
                })
            }
            json  = Object.assign({}, json, {
                [product]: {
                    valor_unitario: toFn === 'ajax'
                                        ? document.querySelectorAll('[data="1"]')[i].children[0].children[1].value
                                            .replace('R$','')
                                            .replace(',','.')
                                            .trim()
                                        : document.querySelectorAll('[data="1"]')[i].children[0].children[1].value,
                    tipo_categoria: 1,
                    dados: Object.assign({}, json[product] ? json[product].dados : {}, {
                        ...type
                    })
                }
            })
        }
        return json
    }
    mountCat2Json(toFn) {
        let json = {}
        for (let i of Array.from(Array(document.querySelectorAll('[data="2"]').length),(x,item)=>item)) {
            const el = document.querySelectorAll('[data="2"]')[i]
            const product = el.id
            let types = {}
            Array.from(Array(el.children.length - 2), (x,i)=>i+1)
                .map((e) =>
                    types = Object.assign({}, types, {
                        [el.children[e].children[0].children[0].innerHTML] : {
                            quantidade: el.children[e].children[0].children[2].value,
                            valor_unitario: toFn === 'ajax'
                                                ? el.children[e].children[1].children[1].value
                                                    .replace('R$','')
                                                    .replace(',','.')
                                                    .trim()
                                                : el.children[e].children[1].children[1].value
                        }
                    })
                )
            json  = Object.assign({}, json, {
                [product]: {
                    tipo_categoria: 2,
                    dados: Object.assign({}, json[product] ? json[product].dados : {}, {
                        ...types
                    })
                }
            })
        }
        return json
    }
    mountCat3Json(toFn) {
        const el = document.querySelectorAll('[data="3"]')[0]
        if (el) {
            let types = {}
            Array.from(Array(el.children.length - 2), (x,i)=>i+1)
                .map((e) =>
                    types = Object.assign({}, types, {
                        [el.children[e].children[0].innerHTML] :
                            el.children[e].children[1].children[1].value
                    })
                )
            return {
                [el.id] : {
                    tipo_categoria: 3,
                    valor_unitario: toFn === 'ajax'
                                        ? el.children[0].children[1].value
                                            .replace('R$','')
                                            .replace(',','.')
                                            .trim()
                                        : el.children[0].children[1].value,
                    dados: {...types}
                }
            }
        }
    }
    handleBackClick() {
        this.setState({
            loader: false,
            showAfterOrder: false
        })
    }
    handleFinishOrder() {
        const total = document.getElementById('totalPrice').innerText
        if (parseInt(total.replace(',','').replace('R$','').trim()) > 0) {
            if (!this.state.loader) {
                this.setState({loader: true})
                axios.post('/get-order/' + this.state.order, {
                    order: {
                        ...this.mountCat0Json('ajax'),
                        ...this.mountCat1Json('ajax'),
                        ...this.mountCat2Json('ajax'),
                        ...this.mountCat3Json('ajax')
                    },
                    client: this.props.location.state.client,
                    total: total
                })
                .then(() => this.setState({
                                        showAfterOrder: true,
                                        cdt: 'ok'
                                    })
                )
                .catch(() => this.setState({
                                showAfterOrder: true,
                                cdt: 'err'
                            }) 
                );
            }
        }
    }

    handlePlusQty(item, div, type2 = false) {
        const value = parseInt(
            document.querySelectorAll(`[data="${item}"]`)[0].value
        );
        document.querySelectorAll(`[data="${item}"]`)[0].value = value + 1;
        this.setTotalQtyPerBlockOnChange(div, type2)
    }
    handleMinusQty(item, div, type2 = false) {
        const value = parseInt(
            document.querySelectorAll(`[data="${item}"]`)[0].value
        );
        if (value > 0) {
            document.querySelectorAll(`[data="${item}"]`)[0].value =
                value - 1;
            this.setTotalQtyPerBlockOnChange(div, type2)
        }
    }
    handleQtyChange(e, div, type2 = null) {
        let qty = e.target.value.replace(/\D/g,'')
        if (qty.indexOf(0) === 0) {
            qty = qty.replace('0','')
        }
        e.target.value = qty
        this.setTotalQtyPerBlockOnChange(div, type2)
    }
    getTotalQtyPerProduct(item) {
        if (item !== undefined) {
            return Object.keys(item).reduce((o, k) => parseInt(item[k]) + o, 0);
        }
    }
    getTotalQtyCat1(item) {
        if (item !== undefined) {
            return Object.keys(item).reduce((o, k) =>
                Object.keys(item[k]).reduce((old, i) => item[k][i] === '' ? 0 : parseInt(item[k][i]) + old, 0)
                + o, 0
            );
        }
    }
    getTotalPricePerProduct(item, price) {
        let priceNorm = typeof price === 'string' ? price.replace("R$", "") : 0;
        let priceNorm2 = typeof price === 'string' ? priceNorm.replace(/\./g,'').replace(",", ".").trim() : 0;
        return (
            this.getTotalQtyCat0(item) * parseFloat(priceNorm2)
        ).toLocaleString('pt-br', {
            minimumFractionDigits: 2
        });
    }
    getTotalQtyCat2(item) {
        if (item !== undefined) {
            return Object.keys(item).reduce(
                (o, k) => item[k].quantidade === '' ? 0 : parseInt(item[k].quantidade) + o,
                0
            );
        }
    }
    getTotalPriceCat2(item) {
        if (item !== undefined) {
            return Object.keys(item)
                .reduce(function(o, k) {
                    let priceNorm = item[k].valor_unitario.replace("R$", "");
                    let priceNorm2 = priceNorm.replace(/\./g,'').replace(",", ".").trim();
                    return (
                        parseInt(item[k].quantidade) * parseFloat(priceNorm2) +
                        o
                    );
                }, 0)
                .toLocaleString("pt-br", {
                    minimumFractionDigits: 2
                });
        }
    }
    getTotalQtyCat0(item) {
        if (item !== undefined) {
            return Object.keys(item)
                .filter(el => el !== "valor_unitario")
                .reduce(
                    (o, k) =>
                        Object.keys(item[k]).reduce(
                            (old, key) => item[k][key] === '' ? 0 : parseInt(item[k][key]) + old,
                            0
                        ) + o,
                    0
                );
        }
    }
    getTotalPriceCat0(item, price) {
        return this.getTotalQtyCat0(item) * parseFloat(price);
    }
    getTotalQty() {
        const list = document.getElementsByClassName('products')
        const listLength = list.length
        let qty = 0
        if (listLength === 1) {
            qty = list[0]
                        .children[(list[0].children.length) - 1]
                        .children[1]
                        .innerHTML
        } else {
            qty = Array.from(Array(listLength),(x,i)=>i)
                            .reduce((old, item) =>
                                parseInt(
                                    list[item]
                                        .children[(list[item].children.length) - 1]
                                        .children[1]
                                        .innerHTML
                                ) + old, 0
                            )
        }
        return qty
    }
    getTotalPrice() {
        const list = document.getElementsByClassName('products')
        const listLength = list.length
        let price = 0
        if (listLength === 1) {
            price = parseFloat(list[0]
                        .children[(list[0].children.length) - 1]
                        .children[3]
                        .innerHTML
                        .replace(/\./g,'')
                        .replace(',','.'))
        } else {
            price = Array.from(Array(listLength),(x,i)=>i)
                            .reduce((old, item) =>
                                parseFloat(
                                    list[item]
                                        .children[(list[item].children.length) - 1]
                                        .children[3]
                                        .innerHTML
                                        .replace(/\./g,'')
                                        .replace(',','.')
                                ) + old, 0
                            )
        }
        return price.toLocaleString(
            'pt-br',
            {
                minimumFractionDigits: 2,
                currency: 'BRL',
                style: 'currency'
            }
        )
    }
    mountCat0List(item) {
        if (this.state.prods[item].tipo_categoria === 0) {
            return Object.keys(this.state.prods[item].dados).map(i => (
                <div
                    id={`${item}-${i}`}
                    className="products"
                    data="0"
                    style={{
                        marginTop: "2em"
                    }}
                    key={"cat0-" + i}
                >
                    <div
                        style={{
                            padding: "0.1em",
                            height: "2.5em",
                            marginLeft: "0.8em"
                        }}
                        key="cat0-div1"
                    >
                        <span
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                padding: "0.4em",
                                display: "inline-block",
                                maxWidth: '10em',
                                color: "#32338D"
                            }}
                            key="cat0-div1-s1"
                        >
                            {" "}
                            {item.toUpperCase() + " " + i.toUpperCase()}{" "}
                        </span>{" "}
                        <input
                            style={{
                                float: "right",
                                border: "1px solid silver",
                                borderRadius: "5px",
                                padding: "0.4em",
                                color: "darkgray",
                                fontSize: '14px',
                                marginRight: "1em",
                                width: "8em",
                                textAlign: "center"
                            }}
                            onChange={(e) => this.handlePriceChange(e, `${item}-${i}`)}
                            defaultValue={
                                this.state.prods[item].dados[i].valor_unitario
                            }
                        />{" "}
                    </div>{" "}
                    {Object.keys(this.state.prods[item].dados[i])
                        .filter(i => i !== "valor_unitario")
                        .map(el =>
                            Object.keys(
                                this.state.prods[item].dados[i][el]
                            ).map((e, idx) => (
                                <div
                                    style={{
                                        padding: "0.2em 0.1em",
                                        height: "4em",
                                        fontSize: "14px",
                                        backgroundColor:
                                            idx % 2 === 0 ? "white" : "#F8F8F8",
                                        color: '#2B2B2B',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%'
                                    }}
                                    key={"cat0-div2-" + e}
                                >
                                    <span
                                        style={{
                                            fontWeight: 'normal',
                                            padding: "0.4em",
                                            marginLeft: "1em",
                                            display: "inline-block"
                                        }}
                                        className="types-list"
                                        key="cat0-div2-s1"
                                    >
                                        {" "}
                                        {el + " " + e}{" "}
                                    </span>{" "}
                                    <div style={{marginRight: '1em'}}>
                                        <span
                                            style={{
                                                fontSize: "30px",
                                                display: "inline-block",
                                                verticalAlign: "sub",
                                                color: 'rgb(116, 116, 116)',
                                                cursor: "pointer",
                                            }}
                                            key="cat0-div2-s2"
                                            onClick={() => this.handleMinusQty(`${item}-${i}-${el}-${e}`, `${item}-${i}`)}
                                        >
                                            {" "}
                                            -{" "}
                                        </span>{" "}
                                        <input
                                            style={{
                                                border: "none",
                                                display: "inline-block",
                                                width: "5em",
                                                backgroundColor: "inherit",
                                                textAlign: "center",
                                                color: 'rgb(116, 116, 116)'
                                            }}
                                            data={`${item}-${i}-${el}-${e}`}
                                            key="cat0-div2-i1"
                                            onChange={(e)=>this.handleQtyChange(e, `${item}-${i}`)}
                                            defaultValue={
                                                this.state.prods[item].dados[i][el][e] === '' ? '0' : this.state.prods[item].dados[i][el][e]
                                            }
                                        />{" "}
                                        <span
                                            style={{
                                                fontSize: "30px",
                                                display: "inline-block",
                                                verticalAlign: "sub",
                                                color: "#32338D",
                                                cursor: "pointer",
                                                margin: 0,
                                                padding: 0
                                            }}
                                            key="cat0-div2-s3"
                                            onClick={() => this.handlePlusQty(`${item}-${i}-${el}-${e}`, `${item}-${i}`)}
                                        >
                                            {" "}
                                            +{" "}
                                        </span>{" "}
                                    </div>
                                </div>
                            ))
                        )}{" "}
                    <div
                        style={{
                            padding: "0.5em 0.1em",
                            height: "2.5em",
                            margin: "0 1em",
                            borderBottom: "1px solid #D7D7D7",
                            fontSize: "14px",
                            display: 'flex'
                        }}
                        key="cat0-div3"
                    >
                        <div style={{
                            display: 'flex',
                            width: '50%',
                        }}>
                            <span
                                style={{
                                    fontWeight: "normal",
                                }}
                            >
                                {" "}
                                Quantidade:{" "}
                            </span>{" "}
                            <span  style={{color: 'rgb(116, 116, 116)', marginLeft: '0.5em'}}>
                                {" "}
                                {this.getTotalQtyCat0(
                                this.state.prods[item].dados[i])}{" "}
                            </span>{" "}
                        </div>
                        <div style={{
                            display: 'flex',
                            width: '50%',
                            justifyContent: 'flex-end'}}>
                            <span
                                style={{
                                    fontWeight: "normal"
                                }}
                            >
                                Total: R${" "}
                            </span>{" "}
                            <span
                                style={{
                                    float: "right",
                                    color: "darkgray",
                                    marginLeft: "1em",
                                    color: 'rgb(116, 116, 116)'
                                }}
                            >
                                {" "}
                                {this.getTotalPricePerProduct(
                                this.state.prods[item].dados[i],
                                this.state.prods[item].dados[i].valor_unitario
                            )}{" "}
                            </span>{" "}
                        </div>   
                    </div>{" "}
                </div>
            ));
        } else {
            return this.mountCat1List(item);
        }
    }
    mountCat1List(item) {
        if (this.state.prods[item].tipo_categoria === 1) {
            return (
                <div
                    className="products"
                    id={`${item}`}
                    style={{
                        marginTop: "2em"
                    }}
                    data="1"
                    key={"cat1" + item}
                >
                    <div
                        style={{
                            padding: "0.1em",
                            height: "2em",
                            marginLeft: "0.8em"
                        }}
                        key="cat1-div1"
                    >
                        <span
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                padding: "0.4em",
                                display: "inline-block",
                                maxWidth: '10em',
                                color: "#32338D"
                            }}
                        >
                            {" "}
                            {item.toUpperCase()}{" "}
                        </span>{" "}
                        <input
                            style={{
                                float: "right",
                                border: "1px solid silver",
                                borderRadius: "5px",
                                padding: "0.4em",
                                color: "darkgray",
                                marginRight: "1em",
                                width: "8em",
                                textAlign: "center",
                                fontSize: '14px'
                            }}
                            defaultValue={this.state.prods[item].valor_unitario}
                            onChange={(e) => this.handlePriceChange(e, `${item}`)}
                        />{" "}
                    </div>{" "}
                    {Object.keys(this.state.prods[item].dados).map(
                        (el) => (
                            Object.keys(
                                this.state.prods[item].dados[el]
                            ).map((e, idx) => (
                                <div
                                    style={{
                                        padding: "0.2em 0.1em",
                                        height: "4em",
                                        fontSize: "14px",
                                        backgroundColor:
                                            idx % 2 === 0 ? "white" : "#F8F8F8",
                                        color: '#2B2B2B',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%'
                                    }}
                                    key={"cat1-div2" + el + e}
                                >
                                    <span
                                        style={{
                                            fontWeight: 'normal',
                                            padding: "0.4em",
                                            marginLeft: "1em",
                                            display: "inline-block"
                                        }}
                                        className="types-list"
                                        key="cat1-div2-s1"
                                    >
                                        {" "}
                                        {`${el} ${e}`}{" "}
                                    </span>{" "}
                                    <div style={{marginRight: '1em'}}>
                                        <span
                                            style={{
                                                fontSize: "30px",
                                                display: "inline-block",
                                                verticalAlign: "sub",
                                                color: 'rgb(116, 116, 116)',
                                                cursor: "pointer"
                                            }}
                                            key="cat1-div2-s2"
                                            onClick={() => this.handleMinusQty(`${item}-${el}-${e}`, `${item}`)}
                                        >
                                            {" "}
                                            -{" "}
                                        </span>{" "}
                                        <input
                                            data={`${item}-${el}-${e}`}
                                            style={{
                                                border: "none",
                                                display: "inline-block",
                                                width: "5em",
                                                backgroundColor: "inherit",
                                                textAlign: "center",
                                                color: 'rgb(116, 116, 116)'
                                            }}
                                            key="cat1-div2-i"
                                            onChange={(e)=>this.handleQtyChange(e, `${item}`)}
                                            defaultValue={
                                                this.state.prods[item].dados[el][e] === '' ? '0' : this.state.prods[item].dados[el][e]
                                             }
                                        />{" "}
                                        <span
                                            style={{
                                                fontSize: "30px",
                                                display: "inline-block",
                                                verticalAlign: "sub",
                                                color: "#32338D",
                                                cursor: "pointer",
                                                margin: 0,
                                                padding: 0
                                            }}
                                            key="cat1-div2-s3"
                                            onClick={() => this.handlePlusQty(`${item}-${el}-${e}`, `${item}`)}
                                        >
                                            {" "}
                                            +{" "}
                                        </span>{" "}
                                    </div>
                                </div>
                            ))
                        )
                    )}{" "}
                    <div
                        style={{
                            padding: "0.5em 0.1em",
                            height: "2.5em",
                            margin: "0 1em",
                            borderBottom: "1px solid #D7D7D7",
                            fontSize: "14px",
                            display: 'flex'
                        }}
                        key="cat1-div3"
                    >
                        <div style={{
                            display: 'flex',
                            width: '50%',
                        }}>
                            <span
                                style={{
                                    fontWeight: "normal",
                                }}
                            >
                                {" "}
                                Quantidade:{" "}
                            </span>{" "}
                            <span  style={{color: 'rgb(116, 116, 116)', marginLeft: '0.5em'}}>
                                {" "}
                                {this.getTotalQtyCat1(
                                this.state.prods[item].dados
                            )}{" "}
                            </span>{" "}
                        </div>
                        <div style={{
                            display: 'flex',
                            width: '50%',
                            justifyContent: 'flex-end'}}>
                            <span
                                style={{
                                    fontWeight: "normal"
                                }}
                            >
                                Total: R${" "}
                            </span>{" "}
                            <span
                                style={{
                                    float: "right",
                                    color: "darkgray",
                                    marginLeft: "1em",
                                    color: 'rgb(116, 116, 116)'
                                }}
                            >
                                {" "}
                                {this.getTotalPricePerProduct(
                                this.state.prods[item].dados,
                                this.state.prods[item].valor_unitario
                            )}{" "}
                            </span>{" "}
                        </div>   
                    </div>{" "}
                </div>
            )
        } else {
            return this.mountCat2List(item);
        }
    }
    mountCat2List(item) {
        if (this.state.prods[item].tipo_categoria === 2) {
            return (
                <div
                    id={item}
                    className="products"
                    style={{
                        marginTop: "2em"
                    }}
                    data="2"
                    key={item}
                >
                    <div
                        style={{
                            padding: "0.1em",
                            height: "2em",
                            marginLeft: "0.8em",
                            display: "inline-block"
                        }}
                        key="cat2-div1"
                    >
                        <span
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                padding: "0.4em",
                                color: "#32338D"
                            }}
                        >
                            {" "}
                            {item.toUpperCase()}{" "}
                        </span>{" "}
                    </div>{" "}
                    {Object.keys(this.state.prods[item].dados).map((i, idx) => (
                        <div
                            style={{
                                padding: "0 1em 1em 0",
                                backgroundColor:
                                    idx % 2 === 0 ? "white" : "#F8F8F8",
                                color: '#2B2B2B'
                            }}
                            key={'cat2-div2-' + i}
                        >
                            <div
                                style={{
                                    padding: "0.7em 0.1em",
                                    height: "3em",
                                    fontSize: "14px"
                                }}
                                key="cat2-item-div1"
                            >
                                <span
                                    style={{
                                        fontWeight: 'normal',
                                        padding: "0.4em",
                                        marginLeft: "1em",
                                        display: "inline-block",
                                        borderBottom: "1px solid #D7D7D7"
                                    }}
                                    className="types-list-2"
                                    key={'cat2-div2-s1-' + item}
                                >
                                    {" "}
                                    {i}{" "}
                                </span>{" "}
                                <span
                                    style={{
                                        fontSize: "30px",
                                        display: "inline-block",
                                        verticalAlign: "sub",
                                        color: 'rgb(116, 116, 116)',
                                        cursor: "pointer"
                                    }}
                                    className="types-list-2-minus"
                                    key={'cat2-div2-s2-' + item}
                                    onClick={() => this.handleMinusQty(`${item}-${i}`, `${item}`, true)}
                                >
                                    {" "}
                                    -{" "}
                                </span>{" "}
                                <input
                                    className="qty-cat2"
                                    data={`${item}-${i}`}
                                    style={{
                                        border: "none",
                                        display: "inline-block",
                                        width: "5em",
                                        backgroundColor: "inherit",
                                        textAlign: "center",
                                        color: 'rgb(116, 116, 116)'
                                    }}
                                    onChange={(e)=>this.handleQtyChange(e, `${item}`, true)}
                                    defaultValue={
                                        this.state.prods[item].dados[i]
                                            .quantidade === '' ? '0' : this.state.prods[item].dados[i]
                                                                        .quantidade
                                    }
                                    key="cat2-div2-i1"
                                />
                                <span
                                    style={{
                                        fontSize: "30px",
                                        display: "inline-block",
                                        verticalAlign: "sub",
                                        color: "#32338D",
                                        cursor: "pointer",
                                        margin: 0,
                                        padding: 0
                                    }}
                                    key="cat2-div2-s2"
                                    onClick={() => this.handlePlusQty(`${item}-${i}`, `${item}`, true)}
                                >
                                    {" "}
                                    +{" "}
                                </span>{" "}
                            </div>{" "}
                            <div
                                style={{
                                    padding: "0.7em 0.1em",
                                    height: "3em",
                                    fontSize: "14px",
                                    backgroundColor:
                                        idx % 2 === 0 ? "white" : "#F8F8F8"
                                }}
                                key="cat2-item-div2"
                            >
                                <span
                                    style={{
                                        padding: "0.4em",
                                        marginLeft: "1em",
                                        display: "inline-block",
                                        color: "#747474",
                                        fontWeight: "normal"
                                    }}
                                >
                                    {" "}
                                    Valor Unitário{" "}
                                </span>{" "}
                                <input
                                    className="price-cat2"
                                    style={{
                                        float: "right",
                                        border: "1px solid silver",
                                        borderRadius: "5px",
                                        padding: "0.4em",
                                        color: 'rgb(116, 116, 116)',
                                        backgroundColor: "inherit",
                                        width: "8em",
                                        textAlign: "center"
                                    }}
                                    onChange={(e) => this.handlePriceChange(e, `${item}`, true)}
                                    defaultValue={
                                        this.state.prods[item].dados[i]
                                            .valor_unitario
                                    }
                                />{" "}
                            </div>{" "}
                        </div>
                    ))}{" "}
                    <div
                        style={{
                            padding: "0.5em 0.1em",
                            height: "2.5em",
                            margin: "0 1em",
                            borderBottom: "1px solid #D7D7D7",
                            fontSize: "14px",
                            display: 'flex'
                        }}
                        key="cat2-div3"
                    >
                        <div style={{
                            display: 'flex',
                            width: '50%',
                        }}>
                            <span
                                style={{
                                    fontWeight: "normal",
                                }}
                            >
                                {" "}
                                Quantidade:{" "}
                            </span>{" "}
                            <span  style={{color: 'rgb(116, 116, 116)', marginLeft: '0.5em'}}>
                                {" "}
                                {this.getTotalQtyCat2(
                                this.state.prods[item].dados
                            )}{" "}
                            </span>{" "}
                        </div>
                        <div style={{
                            display: 'flex',
                            width: '50%',
                            justifyContent: 'flex-end'}}>
                            <span
                                style={{
                                    fontWeight: "normal"
                                }}
                            >
                                Total: R${" "}
                            </span>{" "}
                            <span
                                style={{
                                    float: "right",
                                    color: "darkgray",
                                    marginLeft: "1em",
                                    color: 'rgb(116, 116, 116)'
                                }}
                            >
                                {" "}
                                {this.getTotalPriceCat2(
                                this.state.prods[item].dados
                            )}{" "}
                            </span>{" "}
                        </div>   
                    </div>{" "}
                </div>
            );
        } else {
            return this.mountCat3List(item);
        }
    }
    mountCat3List(item) {
        return (
            <div
                id={item}
                className="products"
                style={{
                    marginTop: "2em"
                }}
                data="3"
                key={item}
            >
                <div
                    style={{
                        padding: "0.1em",
                        height: "2.5em",
                        marginLeft: "0.8em"
                    }}
                    key="cat3-div1"
                >
                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            padding: "0.4em",
                            display: "inline-block",
                            maxWidth: '10em',
                            color: "#32338D"
                        }}
                    >
                        {" "}
                        {item.toUpperCase()}{" "}
                    </span>{" "}
                    <input
                        style={{
                            float: "right",
                            border: "1px solid silver",
                            borderRadius: "5px",
                            color: "darkgray",
                            fontSize: '14px',
                            marginRight: "1em",
                            padding: '0.4em',
                            width: "8em",
                            textAlign: "center"
                        }}
                        onChange={(e) => this.handlePriceChange(e, `${item}`)}
                        defaultValue={this.state.prods[item].valor_unitario}
                    />{" "}
                </div>{" "}
                {Object.keys(this.state.prods[item].dados).map((el, idx) => (
                    <div
                        style={{
                            padding: "0.2em 0.1em",
                            height: "4em",
                            fontSize: "14px",
                            backgroundColor: idx % 2 === 0 ? "white" : "#F8F8F8",
                            color: '#2B2B2B',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                        key={'cat3-div2' + el}
                    >
                        <span
                            style={{
                                fontWeight: 'normal',
                                padding: "0.4em",
                                marginLeft: "1em",
                                display: "inline-block",
                            }}
                            className="types-list"
                            key="cat3-s1"
                        >
                            {" "}
                            {el}{" "}
                        </span>{" "}
                        <div style={{marginRight: '1em'}}>
                            <span
                                style={{
                                    fontSize: "30px",
                                    display: "inline-block",
                                    verticalAlign: "sub",
                                    color: 'rgb(116, 116, 116)',
                                    cursor: "pointer",
                                }}
                                key="cat3-s2"
                                onClick={() => this.handleMinusQty(`${item}-${el}`, `${item}`)}
                            >
                                {" "}
                                -{" "}
                            </span>{" "}
                            <input
                                data={`${item}-${el}`}
                                style={{
                                    border: "none",
                                    display: "inline-block",
                                    width: "5em",
                                    backgroundColor: "inherit",
                                    textAlign: "center",
                                    color: 'rgb(116, 116, 116)'
                                }}
                                defaultValue={this.state.prods[item].dados[el] === '' ? '0' : this.state.prods[item].dados[el]}
                                onChange={(e)=>this.handleQtyChange(e, `${item}`)}
                                key="cat3-i1"
                            />
                            <span
                                style={{
                                    fontSize: "30px",
                                    display: "inline-block",
                                    verticalAlign: "sub",
                                    color: "#32338D",
                                    cursor: "pointer",
                                    margin: 0,
                                    padding: 0
                                }}
                                key="cat3-s3"
                                onClick={() => this.handlePlusQty(`${item}-${el}`, `${item}`)}
                            >
                                {" "}
                                +{" "}
                            </span>{" "}
                        </div>
                    </div>
                ))}{" "}
                <div
                    style={{
                        padding: "0.5em 0.1em",
                        height: "2.5em",
                        margin: "0 1em",
                        borderBottom: "1px solid #D7D7D7",
                        fontSize: "14px",
                        display: 'flex'
                    }}
                    key="cat3-div3"
                >
                    <div style={{
                        display: 'flex',
                        width: '50%',
                    }}>
                        <span
                            style={{
                                fontWeight: "normal",
                            }}
                        >
                            {" "}
                            Quantidade:{" "}
                        </span>{" "}
                        <span  style={{color: 'rgb(116, 116, 116)', marginLeft: '0.5em'}}>
                            {" "}
                            {this.getTotalQtyPerProduct(
                                this.state.prods[item].dados
                            )}{" "}
                        </span>{" "}
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '50%',
                        justifyContent: 'flex-end'}}>
                        <span
                            style={{
                                fontWeight: "normal"
                            }}
                        >
                            Total: R${" "}
                        </span>{" "}
                        <span
                            style={{
                                float: "right",
                                color: "darkgray",
                                marginLeft: "1em",
                                color: 'rgb(116, 116, 116)'
                            }}
                        >
                            {" "}
                            {this.getTotalPricePerProduct(
                                this.state.prods[item].dados,
                                this.state.prods[item].valor_unitario
                            ).toLocaleString("pt-br", {
                                minimumFractionDigits: 2
                            })}{" "}
                        </span>{" "}
                    </div>                    
                </div>{" "}
            </div>
        );
    }
    mountProdList() {
        return Object.keys(this.state.prods).map(item =>
            this.mountCat0List(item)
        )
    }
    setTotalQtyPerBlockOnChange(div, type2 = false) {
        let el = document.getElementById(div).children
        const length = el.length
        if (type2) {
            const qty = Array.from(Array(length),(x,i)=>i)
                            .reduce((old, item) =>
                                (el[item].children[0].children[2] &&
                                    el[item].children[0].children[2].value
                                        ? parseInt(el[item].children[0].children[2].value)
                                        : 0)
                            + old, 0)
            el[(length - 1)].children[0].children[1].innerHTML = qty
            this.setTotalPricePerBlockOnChange(div, qty, type2)

        } else {
            const qty = Array.from(Array(length),(x,i)=>i)
                            .reduce((old, item) =>
                                (el[item].children[1] &&
                                    el[item].children[1].children[1] &&
                                        el[item].children[1].children[1].value
                                        ? parseInt(el[item].children[1].children[1].value)
                                        : 0)
                            + old, 0)
            el[(length - 1)].children[0].children[1].innerHTML = qty
            this.setTotalPricePerBlockOnChange(div, qty)
        }
    }
    setTotalPricePerBlockOnChange(div, qty, type2 = false) {
        if (type2) {
            let el = document.getElementById(div).children
            const length = el.length - 2
            const price = Array.from(Array(length),(x,i)=>i + 1).reduce(function(old, item) {
                const q = parseInt(el[item].children[0].children[2].value)
                const normPrice = el[item].children[1].children[1].value.replace('R$','')
                const normPrice2 = normPrice.replace(/\./g,'').replace(',','.').trim()
                return (normPrice2 === '' ? 0 : (q * parseFloat(normPrice2))) + old
            }, 0)
            document.getElementById(div).children[length + 1].children[1].children[1].innerHTML =
                isNaN(price) ? 0 : price.toLocaleString(
                    'pt-br',
                    {minimumFractionDigits: 2}
                )
        } else {
            let el = document.getElementById(div).children[0].children[1]
            const length = document.getElementById(div).children.length
            const normPrice = el.value.replace('R$','')
            const normPrice2 = normPrice.replace(/\./g,'').replace(',','.').trim()
            const price = (parseFloat(normPrice2) * qty)
            document.getElementById(div).children[length - 1].children[1].children[1].innerHTML =
                isNaN(price) ? 0 : price.toLocaleString(
                    'pt-br',
                    {minimumFractionDigits: 2}
                )
        }
        this.setTotalQtyOnChange()
        this.setTotalPriceOnChange()
    }
    setTotalQtyOnChange() {
        const list = document.getElementsByClassName('products')
        const listLength = list.length
        let qty = 0
        if (listLength === 1) {
            qty = list[0]
                        .children[(list[0].children.length) - 1]
                        .children[0]
                        .children[1]
                        .innerHTML
        } else {
            qty = Array.from(Array(listLength),(x,i)=>i)
                            .reduce((old, item) =>
                                parseInt(
                                    list[item]
                                        .children[(list[item].children.length) - 1]
                                        .children[0]
                                        .children[1]
                                        .innerHTML
                                ) + old, 0
                            )
        }
        this.setState({totalQty: qty})
    }
    setTotalPriceOnChange() {
        const list = document.getElementsByClassName('products')
        const listLength = list.length
        let price = 0
        if (listLength === 1) {
            price = parseFloat(list[0]
                        .children[(list[0].children.length) - 1]
                        .children[1]
                        .children[1]
                        .innerHTML
                        .replace(/\./g,'')
                        .replace(',','.'))
        } else {
            price = Array.from(Array(listLength),(x,i)=>i)
                            .reduce((old, item) =>
                                parseFloat(
                                    list[item]
                                        .children[(list[item].children.length) - 1]
                                        .children[1]
                                        .children[1]
                                        .innerHTML
                                        .replace(/\./g,'')
                                        .replace(',','.')
                                ) + old, 0
                            )
        }
        const priceBr = price.toLocaleString(
            'pt-br',
            {
                minimumFractionDigits: 2
            }
        )
        this.setState({totalPrice: priceBr})
        localStorage.setItem('prods' , JSON.stringify({
            ...this.mountCat0Json('localStorage'),
            ...this.mountCat1Json('localStorage'),
            ...this.mountCat2Json('localStorage'),
            ...this.mountCat3Json('localStorage')
        }))
    }
    render() {
        if (this.state.redirect) {
            return <Redirect push to={{
                pathname: "/clientes"
            }} />;
        }
        
        return (
            <Row>
                <Col bsPrefix="col p-0">
                    <div style={{display: this.state.showAfterOrder ? 'none' : 'block'}}>
                        <NewProductComponent arrow={true}
                                                history={this.props.history}
                                                totalPrice={this.state.totalPrice}
                                                totalQty={this.state.totalQty}/>
                    </div>
                    <div
                        key="cart-div2"
                        className="init-div"
                        style={{
                            display: this.state.showSuccess ? "none" : "flex",
                            flexDirection: "column",
                            display: this.state.showAfterOrder ? 'none' : 'block',
                        }}
                    >
                        <h5
                            className="text-left mt-3"
                            key="cart-h5-1"
                            style={{
                                padding: "0 0.5em",
                                color: "#32338D"
                            }}
                        >
                            <img
                                src="/images/shopping-bag.svg"
                                alt="user"
                                style={{
                                    width: "5%",
                                    margin: "0 0.3em"
                                }}
                            >
                            </img>
                            Seu Pedido{" "}
                        </h5>{" "}
                        <h6
                            className="text-left ml-3 px-1"
                            key="cart-h6-1"
                            style={{
                                padding: "0 0.5em",
                                fontSize: "14px"
                            }}
                        >
                            Nº do pedido <span>{this.state.order}</span>{" "}
                        </h6>{" "}
                        {this.mountProdList()}{" "}
                        <div
                            style={{
                                padding: "0.1em",
                                height: "2em",
                                color: "#32338D",
                                fontWeight: "bold",
                                margin: "1em 1em 0 1em"
                            }}
                            key="cart-div2-div1"
                        >
                            <span key="cart-div2-div1-s1"> Quantidade: </span>{" "}
                            <span
                                key="cart-div2-div1-s2"
                                id="totalQty"
                                style={{
                                    float: "right"
                                }}
                            >
                                {" "}
                                {this.state.totalQty}{" "}
                            </span>{" "}
                        </div>{" "}
                        <div
                            style={{
                                padding: "0.1em",
                                height: "2em",
                                color: "#32338D",
                                fontWeight: "bold",
                                margin: "0em 1em 3em"
                            }}
                            key="cart-div2-div2"
                        >
                            <span key="cart-div2-div2-s1"> Valor: </span>{" "}
                            <span
                                id="totalPrice"
                                key="cart-div2-div2-s2"
                                style={{
                                    float: "right"
                                }}
                            >
                                {" "}
                                R$ {this.state.totalPrice}{" "}
                            </span>{" "}
                        </div>{" "}
                    </div>{" "}
                    <AfterOrderComponent show={this.state.showAfterOrder}
                                            cdt={this.state.cdt}
                                            onBackClick={this.handleBackClick}/>
                    <div
                        className="footer-cart text-center"
                        style={{
                            backgroundColor: "#32338D",
                            display: this.state.showAfterOrder ? 'none' : 'inline-block'
                        }}
                        onClick={this.handleFinishOrder}
                        key="cart-div-3"
                    >
                        {" "}
                        {
                            this.state.loader
                                ?  <Loader
                                        type="ThreeDots"
                                        color="white"
                                        height={25}
                                        width={25}
                                        timeout={3000} //3 secs

                                    />
                                : 'Finalizar Compra'
                        }
                    </div>{" "}
                </Col>
            </Row>
        );
    }
}
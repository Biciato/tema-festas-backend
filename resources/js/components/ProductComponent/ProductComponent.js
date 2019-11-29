import React from "react";
import ProductSelect from "./ProductSelect";
import SizeSelect from "./SizeSelect";
import TypeComponent from "../TypeComponent/TypeComponent";
import TotalComponent from "./TotalComponent";
import { Products } from "../resources/products";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NewProductComponent from "../NewProductComponent";
import { Redirect, Prompt } from 'react-router';

const e = React.createElement;

export default class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
        this.getCategorySet = this.getCategorySet.bind(this);
        this.getProdPrice = this.getProdPrice.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleSubtypeSet = this.handleSubtypeSet.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleCartClick = this.handleCartClick.bind(this);
        this.state = {
            order: (props.location && props.location.state && props.location.state.order)
                        ? props.location.state.order
                        : 'Sem número',
            redirect: (props.location.state === undefined
                        || !props.location.state.client)
                            ? 'clientes'
                            : false,
            prods: this.getProds(props),
            cpts: [
                {
                    name: NewProductComponent,
                    props: {
                        key: "new-product",
                        history: this.props.history
                    }
                },
                {
                    name: ProductSelect,
                    props: {
                        key: "product",
                        onProductChange: this.handleProductChange
                    }
                }
            ]
        }
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
    getCategorySet(categoryName) {
        return Object.keys(this.state.categorias).find(
            item => item === categoryName
        );
    }
    getProdCategory(prodName) {
        return [0, 1, 2, 3].find(item => Products.categories[item][prodName]);
    }
    getProdPrice(prodName, size = null) {
        if (this.getProdCategory(prodName) === 0) {
            return Products.categories[0][prodName].size.find(
                item => item.name === size
            ).price;
        } else {
            return Products.categories[this.getProdCategory(prodName)][
                prodName
            ].price.toLocaleString("pt-br", { minimumFractionDigits: 2 });
        }
    }

    handleProductChange(prodName) {
        const prevProds = this.state.prods[prodName]
            ? this.state.prods[prodName]
            : {};
        const prevDados =
            this.state.prods[prodName] && this.state.prods[prodName].dados
                ? this.state.prods[prodName].dados
                : {};
        let prods = Object.assign({}, this.state.prods, {
            [prodName]: Object.assign({}, prevProds, {
                tipo_categoria: this.getProdCategory(prodName),
                dados: Object.assign({}, prevDados)
            })
        });
        if (
            [1, 3].includes(prods[prodName].tipo_categoria) &&
            !this.state.prods[prodName]
        ) {
            prods[prodName].valor_unitario = this.getProdPrice(prodName);
        }
        const cpts = [
            this.state.cpts[0],
            this.state.cpts[1]
        ];
        let cpt = {};
        if (prods[prodName].tipo_categoria !== 0 || prodName.includes("ela")) {
            cpt = {
                name: TypeComponent,
                props: {
                    onPriceChange: this.handlePriceChange,
                    onSubtypeSet: this.handleSubtypeSet,
                    onTypeChange: this.handleTypeChange,
                    prods: this.state.prods,
                    prodName,
                    key: "type"
                }
            };
        } else {
            cpt = {
                name: SizeSelect,
                props: {
                    onSizeChange: this.handleSizeChange,
                    prodName,
                    key: "size"
                }
            };
        }
        cpts.push({ ...cpt });
        this.setState({ prods, cpts });
    }
    handleSizeChange(size, prodName) {
        const cpts = [
            this.state.cpts[0],
            this.state.cpts[1],
            this.state.cpts[2]
        ];
        cpts.push({
            name: TypeComponent,
            props: {
                key: "type",
                size,
                prodName,
                onPriceChange: this.handlePriceChange,
                onSubtypeSet: this.handleSubtypeSet,
                onTypeChange: this.handleTypeChange,
                prods: this.state.prods
            }
        });
        const prods = Object.assign({}, this.state.prods, {
            [prodName]: Object.assign({}, this.state.prods[prodName], {
                dados: Object.assign({}, this.state.prods[prodName].dados, {
                    [size]: this.state.prods[prodName].dados[size]
                        ? Object.assign(
                              {},
                              this.state.prods[prodName].dados[size]
                          )
                        : {
                              valor_unitario: this.getProdPrice(prodName, size)
                          }
                })
            })
        });
        this.setState({
            prods,
            cpts
        });
    }
    handlePriceChange(price, prodName, size = null) {
        let prods = this.state.prods
        if (size && prods[prodName] && prods[prodName].dados[size]) {
            prods[prodName].dados[size].valor_unitario = price
        } else if (prods[prodName]) {
            prods[prodName].valor_unitario = price
        }
        this.setState({prods})
    }
    handleTypeChange(type, prodName, size = null, price = null) {
        const cpts = [...this.state.cpts]
        cpts.pop()
        cpts.push({
            name: TypeComponent,
            props: {
                key: "type",
                size,
                prodName,
                onPriceChange: this.handlePriceChange,
                onSubtypeSet: this.handleSubtypeSet,
                onTypeChange: this.handleTypeChange,
                prods: this.state.prods
            }
        });
        let prods = Object.assign({}, this.state.prods);
        if (this.getProdCategory(prodName) === 0) {
            if (type !== undefined) {
                prods[prodName].dados[size] = Object.assign(
                    {},
                    this.state.prods[prodName].dados[size],
                    {
                        [type]: this.state.prods[prodName].dados[size][type]
                                    ? Object.assign(
                                        {},
                                        this.state.prods[prodName].dados[size][type]
                                    )
                                    : null
                    }
                );
            }
            if (price) {
                prods[prodName].dados[size].valor_unitario = price
            }
            this.setState({prods});
        } else if (this.getProdCategory(prodName) === 1 || this.getProdCategory(prodName) === 3) {
            const prevDados = this.state.prods[prodName].dados
                ? this.state.prods[prodName].dados
                : {};
            prods[prodName].dados = prevDados;
            if (price) {
                prods[prodName].valor_unitario = price
            }
            this.setState({prods, cpts});
        }
    }
    handleSubtypeSet(typeObj, prodName, size = null) {
        let prods = {};
        switch (this.getProdCategory(prodName)) {
            case 0:
                prods = Object.assign({}, this.state.prods, {
                    [prodName]: {
                        tipo_categoria: 0,
                        dados: Object.assign(
                            {},
                            this.state.prods[prodName].dados,
                            {
                                [size]: Object.assign(
                                    {},
                                    this.state.prods[prodName].dados[size],
                                    {
                                        valor_unitario: typeObj.price
                                            ? typeObj.price
                                            : this.state.prods[prodName].dados[
                                                  size
                                              ].valor_unitario,
                                        [typeObj.type]: Object.assign(
                                            {},
                                            this.state.prods[prodName].dados[
                                                size
                                            ][typeObj.type],
                                            {
                                                [Object.keys(
                                                    typeObj.subtype.subtypeObj
                                                )[0]]:
                                                    typeObj.subtype.subtypeObj[
                                                        Object.keys(
                                                            typeObj.subtype
                                                                .subtypeObj
                                                        )[0]
                                                    ].qty
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }
                });
                break;
            case 1:
                prods = Object.assign({}, this.state.prods, {
                    [prodName]: {
                        valor_unitario: typeObj.price
                            ? typeObj.price
                            : this.state.prods[prodName].dados.valor_unitario,
                        tipo_categoria: 1,
                        dados: Object.assign(
                            {},
                            this.state.prods[prodName].dados,
                            {
                                [typeObj.type]: Object.assign(
                                    {},
                                    this.state.prods[prodName].dados[
                                        typeObj.type
                                    ],
                                    {
                                        [Object.keys(
                                            typeObj.subtype.subtypeObj
                                        )[0]]:
                                            typeObj.subtype.subtypeObj[
                                                Object.keys(
                                                    typeObj.subtype.subtypeObj
                                                )[0]
                                            ].qty
                                    }
                                )
                            }
                        )
                    }
                });
                break;
            case 2:
                prods = Object.assign({}, this.state.prods, {
                    [prodName]: {
                        tipo_categoria: 2,
                        dados: Object.assign(
                            {},
                            this.state.prods[prodName].dados,
                            {
                                [Object.keys(typeObj.subtype.subtypeObj)[0]]: {
                                    quantidade:
                                        typeObj.subtype.subtypeObj[
                                            Object.keys(
                                                typeObj.subtype.subtypeObj
                                            )[0]
                                        ].qty,
                                    valor_unitario:
                                        typeObj.subtype.subtypeObj[
                                            Object.keys(
                                                typeObj.subtype.subtypeObj
                                            )[0]
                                        ].price
                                }
                            }
                        )
                    }
                });
                break;
            default:
                prods = Object.assign({}, this.state.prods, {
                    [prodName]: {
                        tipo_categoria: 3,
                        valor_unitario: typeObj.price
                            ? typeObj.price
                            : this.state.prods[prodName].valor_unitario,
                        dados: Object.assign(
                            {},
                            this.state.prods[prodName].dados,
                            {
                                [Object.keys(typeObj.subtype.subtypeObj)[0]]:
                                    typeObj.subtype.subtypeObj[
                                        Object.keys(
                                            typeObj.subtype.subtypeObj
                                        )[0]
                                    ].qty
                            }
                        )
                    }
                });
                break;
        }
        this.setState({ prods }, () => {
            const cpts = [...this.state.cpts]
            cpts.pop()
                cpts.push({
                name: TypeComponent,
                props: {
                    key: "type",
                    size,
                    prodName,
                    onPriceChange: this.handlePriceChange,
                    onSubtypeSet: this.handleSubtypeSet,
                    onTypeChange: this.handleTypeChange,
                    prods: this.state.prods
                }
            });
            this.setState({cpts})
        });
    }
    handleCartClick(totalQty, totalPrice) {
        if (parseFloat(totalPrice) > 0) {
            this.setState({
                totalQty: totalQty,
                totalPrice: totalPrice
            }, () => this.setState({redirect: 'resumo'}));
        }
    }

    render() {
        if (Object.keys(this.state.prods).length > 0) {
            localStorage.setItem('prods', JSON.stringify(this.state.prods))
        }
        if (this.state.redirect) {
            let prods = this.state.prods
            for (let i of Object.keys(this.state.prods)) {
                if (prods[i].tipo_categoria === 0) {
                    for (let el of Object.keys(prods[i].dados)) {
                        if (Object.keys(prods[i].dados[el]).length === 1 ) {
                            delete prods[i].dados[el]
                        } else {
                            for (let ob of Object.keys(prods[i].dados[el])) {
                                if (prods[i].dados[el][ob] === null) {
                                    delete prods[i].dados[el][ob]
                                    if (Object.keys(prods[i].dados[el]).length === 1 ) {
                                        delete prods[i].dados[el]
                                    }
                                } else {
                                    for (let obj of Object.keys(prods[i].dados[el][ob])) {
                                        if (prods[i].dados[el][ob][obj] === '') {
                                            delete prods[i].dados[el][ob][obj]
                                            if (Object.keys(prods[i].dados[el][ob]).length === 0 ) {
                                                delete prods[i].dados[el][ob]
                                            }
                                            if (Object.keys(prods[i].dados[el]).length === 1 ) {
                                                delete prods[i].dados[el]
                                            }
                                            if (Object.keys(prods[i].dados).length === 0 ) {
                                                delete prods[i]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (prods[i].tipo_categoria === 2) {
                     if (Object.keys(prods[i].dados).length === 0) {
                         delete prods[i]

                     } else {
                        for (let el of Object.keys(prods[i].dados)) {
                            if (prods[i].dados[el].quantidade === '0' || prods[i].dados[el].valor_unitario === 'R$ ') {
                                delete prods[i].dados[el]
                                if (Object.keys(prods[i].dados).length === 0) {
                                   delete prods[i]
                                }
                            }
                        }
                     }
                } else  {
                    if (Object.keys(prods[i].dados).length === 0 ) {
                        delete prods[i]
                    }
                }
            }
            return <Redirect push to={{
                pathname: `/${this.state.redirect}`,
                state: {
                    prods,
                    client: this.props.location.state.client,
                    order: this.state.order,
                    totalQty: this.state.totalQty,
                    totalPrice: this.state.totalPrice
                }
            }} />;
        }

        return e(
            Row,
            {bsPrefix: 'row'},
            e(
                Col,
                { key: 1 },
                this.state.cpts.map(item =>
                    e(item.name, item.props, item.children)
                ),
                e(TotalComponent, {
                    prods: this.state.prods,
                    key: 'total',
                    onCartClick: this.handleCartClick
                })
            ),
        );
    }
}

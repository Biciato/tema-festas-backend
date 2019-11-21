import React from "react";
import ProductSelect from "./ProductSelect";
import SizeSelect from "./SizeSelect";
import TypeComponent from "../TypeComponent/TypeComponent";
import TotalComponent from "./TotalComponent";
import { Products } from "../resources/products";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NewProductComponent from "../NewProductComponent";
import { Redirect } from 'react-router';

const e = React.createElement;

export default class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleSubtypeSet = this.handleSubtypeSet.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.getCategorySet = this.getCategorySet.bind(this);
        this.getProdPrice = this.getProdPrice.bind(this);
        this.handleCartClick = this.handleCartClick.bind(this);
        this.startNewOrder = this.startNewOrder.bind(this);
        this.state = {
            prods: {},
            cpts: [
                {
                    name: NewProductComponent,
                    props: {
                        key: "new-product"
                    }
                },
                {
                    name: ProductSelect,
                    props: {
                        key: "product",
                        onProductChange: this.handleProductChange
                    }
                },
                {
                    props: { key: "total" },
                    name: TotalComponent
                }
            ]
        };
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
            this.state.cpts[1],
            this.state.cpts[2]
        ];
        let cpt = {};
        if (prods[prodName].tipo_categoria !== 0 || prodName.includes("ela")) {
            cpt = {
                name: TypeComponent,
                props: {
                    onSubtypeSet: this.handleSubtypeSet,
                    onTypeChange: this.handleTypeChange,
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
            this.state.cpts[2],
            this.state.cpts[3]
        ];
        cpts.push({
            name: TypeComponent,
            props: {
                key: "type",
                size,
                prodName,
                onSubtypeSet: this.handleSubtypeSet,
                onTypeChange: this.handleTypeChange
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
    handleTypeChange(type, prodName, size = null) {
        let prod = Object.assign({}, this.state);
        if (this.getProdCategory(prodName) === 0) {
            prod.prods[prodName].dados[size] = Object.assign(
                {},
                this.state.prods[prodName].dados[size],
                {
                    [type]: null
                }
            );
            this.setState(prod);
        } else if (this.getProdCategory(prodName) === 1) {
            const prevDados = this.state.prods[prodName].dados
                ? this.state.prods[prodName].dados
                : {};
            prod.prods[prodName].dados = prevDados;
            this.setState(prod);
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
        const newCpts = this.state.cpts.map((e, i) =>
            i === 2
                ? {
                      name: TotalComponent,
                      props: {
                          key: "total",
                          prods,
                          onCartClick: this.handleCartClick
                      }
                  }
                : e
        );
        this.setState({ cpts: newCpts, prods });
    }
    handleCartClick(totalQty, totalPrice) {
        this.setState({ 
            totalQty: totalQty,
            totalPrice: totalPrice
        }, () => this.setState({redirect: true}));
    }
    handleModalClick(cdt) {
        let state = Object.assign({}, this.state);
        if (cdt === "accepted") {
            state.mdShow = false;
        } else if (cdt === "not_accepted") {
            state.mdShow = false;
        } else {
            state.mdShow = true;
        }
        this.setState(state, () => this.startNewOrder(cdt));
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
    startNewOrder(cdt) {
        if (cdt === "accepted") {
            this.setState({
                cpts: [
                    {
                        name: "div",
                        props: {
                            key: "div",
                            onClick: () => this.handleModalClick("start"),
                            style: {
                                textAlign: "end",
                                backgroundColor: "#F3F3F3",
                                margin: 0,
                                padding: "0.3em",
                                color: "#32338D",
                                cursor: "pointer",
                                fontSize: "12px"
                            }
                        },
                        children: [
                            e("span", { key: "span" }, "iniciar novo pedido"),
                            e("img", {
                                src: "/images/star.svg",
                                alt: "task",
                                style: {
                                    width: "4%",
                                    margin: "0.2em 0.4em 0.4em 0.3em"
                                }
                            })
                        ]
                    },
                    {
                        name: ProductSelect,
                        props: {
                            onProductChange: this.handleProductChange
                        }
                    },
                    {
                        name: TotalComponent,
                        props: {
                            prods: {}
                        }
                    }
                ],
                prods: {}
            });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={{
                pathname: "/resumo",
                state: { 
                    prods: this.state.prods,
                    totalPrice: this.state.totalPrice,
                    totalQty: this.state.totalQty 
                }
            }} />;
        }
        return e(
            Row,
            {bsPrefix: 'row no-gutters'},
            e(
                Col,
                { style: { padding: 0 }, key: 1 },
                this.state.cpts.map(item =>
                    e(item.name, item.props, item.children)
                )
            ),
        );
    }
}

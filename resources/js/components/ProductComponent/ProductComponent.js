import React from "react"
import ProductSelect from "./ProductSelect"
import SizeSelect from "./SizeSelect"
import TypeComponent from "../TypeComponent/TypeComponent"
import TotalComponent from "./TotalComponent"
import { Products } from "../resources/products"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import NewProductComponent from "../NewProductComponent"
import { Redirect } from 'react-router'

const e = React.createElement;

export default class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
        this.getCategorySet = this.getCategorySet.bind(this)
        this.getProdPrice = this.getProdPrice.bind(this)
        this.handleProductChange = this.handleProductChange.bind(this)
        this.handleSizeChange = this.handleSizeChange.bind(this)
        this.handleSubtypeSet = this.handleSubtypeSet.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleCartClick = this.handleCartClick.bind(this)
        this.mountCptFromResume = this.mountCptFromResume.bind(this);
        this.state = {
            redirect: (props.location.state === undefined 
                        || !props.location.state.client)
                            ? 'clientes' 
                            : false,
            prods: {},
            prodName: '',
            size: '',
            type: '',
            typeObj: {}
        };
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
        this.setState({ prodName, prods });
    }
    handleSizeChange(size, prodName) {
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
            prodName,
            size,
            prods
        });
    }
    handleTypeChange(type, prodName, size = null) {
        let prod = Object.assign({}, this.state);
        if (this.getProdCategory(prodName) === 0) {
            prod.prods[prodName].dados[size] = Object.assign(
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
            this.setState(prod);
        } else if (this.getProdCategory(prodName) === 1) {
            const prevDados = this.state.prods[prodName].dados
                ? this.state.prods[prodName].dados
                : {};
            prod.prods[prodName].dados = prevDados;
            this.setState({type, prodName, size});
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
        this.setState({ prodName, size, typeObj });
    }
    handleCartClick(totalQty, totalPrice) {
        this.setState({ 
            totalQty: totalQty,
            totalPrice: totalPrice
        }, () => this.setState({redirect: 'resumo'}));
    }
    mountCptFromResume() {
        return cpts = {

        }
    }
    
    render() {
        if (this.state.redirect) {
            return <Redirect push to={{
                pathname: `/${this.state.redirect}`,
                state: this.state.redirect === 'resumo' ? {
                    prods: this.state.prods,
                    client: this.props.location.state.client
                } : undefined
            }} />;
        }
        return (
            <Row>
                <Col>
                    <ProductSelect onProductChange={this.handleProductChange}/>
                    <SizeSelect prodName={this.state.prodName}
                                onSizeChange={this.handleSizeChange}/>
                    <TypeComponent size={this.state.size}
                                    prodName={this.state.prodName}
                                    type={this.state.type}
                                    prods={this.state.prods}
                                    onTypeChange={this.handleTypeChange}
                                    onSubtypeSet={this.handleSubtypeSet}/>
                    <TotalComponent prods={this.state.prods}
                                        key="total"
                                        onCartClick={this.handleCartClick}/>
                </Col>
            </Row>
        )
    }
}

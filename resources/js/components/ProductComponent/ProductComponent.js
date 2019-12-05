import React from "react";
import ProductSelect from "./ProductSelect";
import SizeSelect from "./SizeSelect";
import TypeSelect from "../TypeComponent/TypeSelect";
import TotalComponent from "./TotalComponent";
import { Products } from "../resources/products";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NewProductComponent from "../NewProductComponent";
import PriceComponent from "./PriceComponent";
import TypeList from '../TypeComponent/TypeList'
import axios from "axios";

const e = React.createElement;

export default class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
        this.cleanEmptyProds = this.cleanEmptyProds.bind(this);
        this.getCategorySet = this.getCategorySet.bind(this);
        this.getProdPrice = this.getProdPrice.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleSubtypeSet = this.handleSubtypeSet.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.state = { 
            prods: {},
            showTypeCpt: false
        }
    }
    cleanEmptyProds() {

    }
    componentDidMount() {
        axios.get('/get-client').then((response) => 
            response.data === 'error'
                ? window.location.assign('/clientes')
                : axios.get('/get-prods').then((response) => 
                    this.setState({prods: response.data})
                )
        )        
    }
    componentDidUpdate() {
        axios.post('/set-prods', { 
            prods: this.state.prods
        })
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
        if (!this.state.prods[prodName]) {
            let prodData = {}
            if ([0,2].includes(this.getProdCategory(prodName))) {
                prodData = {
                    dados: {},
                    tipo_categoria: this.getProdCategory(prodName)
                }
            } else {
                prodData = {
                    dados: {},
                    tipo_categoria: this.getProdCategory(prodName),
                    valor_unitario: 'R$ ' + this.getProdPrice(prodName)
                                                .toLocaleString('pt-br', {
                                                    minimumFractionDigits: 2
                                                })
                }
            }
            this.setState({
                prods: Object.assign({}, this.state.prods, {
                    [prodName]: prodData
                })
            })
        } 
        this.setState({prodName}, () =>
            this.setState({
                size: false,
                showTypeSelect: this.getProdCategory(prodName) !== 0
                    ? true
                    : false
            })
        )
    }
    handleSizeChange(size) {
        if (!this.state.prods[this.state.prodName][size]) {
            let prods = this.state.prods
            prods[this.state.prodName].dados = Object.assign(
                {}, 
                this.state.prods[this.state.prodName].dados, {
                [size]: {
                    valor_unitario: 'R$ ' + this.getProdPrice(this.state.prodName, size)
                                                .toLocaleString('pt-br', {
                                                    minimumFractionDigits: 2
                                                })
                }
            })
            this.setState({ prods })
        }
        this.setState({ showTypeSelect: true, size })
    }
    handlePriceChange(price, prodName, size = null) {
        let prods = Object.assign({}, this.state.prods)
        if (size && prods[prodName] && prods[prodName].dados[size]) {
            prods[prodName].dados[size].valor_unitario = price
        } else if (prods[prodName]) {
            prods[prodName].valor_unitario = price
        }
        this.setState({prods})
    }
    handleTypeChange(type, prodName, size = null, price = null) {
        let prods = this.state.prods
        if (size && !prods[prodName].dados[size][type]) {
            prods[prodName].dados[size] = Object.assign({}, prods[prodName].dados[size], {
                [type] : {}
            })
        } else {
            prods[prodName].dados = Object.assign({}, prods[prodName].dados, {
                [type] : {}
            })
        }
        this.setState({ prods })
    }
    handleSubtypeSet(prodName, size = null, type = null, subtype) {
        let prods = this.state.prods;
        switch (this.getProdCategory(prodName)) {
            case 0:
                prods[prodName].dados[size][type] = Object.assign(
                    {},
                    (prods[prodName].dados[size][type] 
                        ? prods[prodName].dados[size][type] : {}),
                    { ...subtype }
                )
                break;
            case 1:
                prods[prodName].dados[type] = Object.assign(
                    {},
                    (prods[prodName].dados[type] ? prods[prodName].dados[type] : {}),
                    { ...subtype }
                )
                break;
            case 2:
                prods[prodName].dados = Object.assign(
                    {}, 
                    prods[prodName].dados,
                    { [Object.keys(subtype)[0]]: { 
                        quantidade: subtype[Object.keys(subtype)[0]].quantidade,
                        valor_unitario: subtype[Object.keys(subtype)[0]].valor_unitario
                    }}
                )
                break; 
            default:
                prods[prodName].dados = Object.assign(
                    {},
                    (prods[prodName].dados ? prods[prodName].dados : {}),
                    { ...subtype }
                )
                break;
        }
        this.setState({ prods });
    }

    render() {
        if (Object.keys(this.state.prods).length > 0) {
            axios.post('/set-prods', { prods: this.state.prods })
        }
        return (
            <Row>
                <Col>
                    <NewProductComponent key="new-product"/>
                    <ProductSelect key="product-select" onProductChange={this.handleProductChange}/>
                    <SizeSelect key="size-select" 
                                prodName={this.state.prodName} 
                                onSizeChange={this.handleSizeChange}/>
                    <TypeSelect onTypeChange={this.handleTypeChange}
                                show={this.state.showTypeSelect}
                                key="type-select"/>
                    <PriceComponent onPriceChange={this.handlePriceChange}
                                    show={this.state.showPriceCpt}
                                    prodName={this.state.prodName}
                                    key="price-cpt"/>
                    <TypeList type={this.state.type}
                                key="typelist"
                                size={this.props.size ? this.props.size : 'has not'}
                                prodName={this.props.prodName}
                                prods={this.props.prods}
                                onSubtypeChange={this.handleSubtypeChange}/>
                    <TotalComponent key="total-cpt" prods={this.state.prods}/>
                </Col>
            </Row>
        )
    }
}

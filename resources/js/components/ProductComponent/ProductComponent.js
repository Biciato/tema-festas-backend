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
import SubtypeList from '../TypeComponent/SubtypeList'
import axios from "axios";

export default class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
        this.getProdPrice = this.getProdPrice.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleSubtypeSet = this.handleSubtypeSet.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.state = { prods: {} }
    }
    componentDidMount() {
        // Check if it've already has prods in Laravel's Session 
        axios.get('/get-client').then((response) => 
            response.data === 'error'
                ? window.location.assign('/clientes')
                : axios.get('/get-prods').then((response) => 
                    this.setState({prods: response.data})
                )
        )        
    }
    componentDidUpdate() {
        // Always keep prods obj updated on Laravel's session
        axios.post('/set-prods', { 
            prods: this.state.prods
        })
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
            return 'R$ ' + Products.categories[this.getProdCategory(prodName)][
                prodName
            ].price.toLocaleString("pt-br", { minimumFractionDigits: 2 });
        }
    }
    handleProductChange(prodName) {
        // reseting components 
        this.setState({
            showPriceCpt: false,
            showSizeSelect: false,
            showTypeSelect: false,
            showSubtypeList: false
        }, () => this.setProdName(prodName))        
    }
    handleSizeChange(size) {
        let prods = this.state.prods
        // update only new size in prods obj
        if (!this.state.prods[this.state.prodName].dados[size]) {
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
        }
        this.setState({ prods }, () => 
            this.setState({ 
                showTypeSelect: true, 
                showPriceCpt: true,
                size, 
                price: this.state.prods[this.state.prodName].dados[size].valor_unitario
            })
        )
    }
    handlePriceChange(price, item = null) {
        let prods = this.state.prods
        if ( this.getProdCategory(this.state.prodName) === 0 ) {
            prods[this.state.prodName].dados[this.state.size].valor_unitario = price
        } else if (this.getProdCategory(this.state.prodName) === 2 ) {
            prods[this.state.prodName].dados[item].valor_unitario = price.replace('R$ ', '')
        } else {
            prods[this.state.prodName].valor_unitario = price
        }
        this.setState({prods, price})
    }
    handleTypeChange(type) {
        let prods = this.state.prods
        // update only new type in prods obj
        if (this.getProdCategory(this.state.prodName) === 0
                && !prods[this.state.prodName].dados[this.state.size][type]) {
            prods[this.state.prodName].dados[this.state.size][type] = {}
        } else if (this.getProdCategory(this.state.prodName) === 1
                    && !prods[this.state.prodName].dados[type]) {
            prods[this.state.prodName].dados[type] = {}
        }
        this.setState({ prods, type }, () => this.setState({ showSubtypeList: true }))
    }    
    handleSubtypeSet(subtype) {
        let prods = this.state.prods;
        if (this.getProdCategory(this.state.prodName) === 0) {
            prods[this.state.prodName].dados[this.state.size][this.state.type] = 
                Object.assign(
                    {}, 
                    prods[this.state.prodName].dados[this.state.size][this.state.type], {
                        [subtype.name] : subtype.qty
                    }
                ) 
        } else if (this.getProdCategory(this.state.prodName) === 1) {
            prods[this.state.prodName].dados[this.state.type] = 
                Object.assign(
                    {}, 
                    prods[this.state.prodName].dados[this.state.type], {
                        [subtype.name] : subtype.qty
                    }
                ) 
        } else if (this.getProdCategory(this.state.prodName) === 2) {
            prods[this.state.prodName].dados[subtype.name] = {
                quantidade: subtype.qty,
                valor_unitario: prods[this.state.prodName].dados[subtype.name]
                                    && prods[this.state.prodName].dados[subtype.name].valor_unitario
                                    ? prods[this.state.prodName].dados[subtype.name].valor_unitario
                                    : Products.categories[2][this.state.prodName].find((item) => 
                                        item.name === subtype.name
                                    ).price.toLocaleString('pt-br', {minimumFractionDigits: 2})
            }
        } else {
            prods[this.state.prodName].dados[subtype.name] = subtype.qty
        }
        this.setState({ prods });
    }
    setStateFromProduct(prodName) {
        this.setState({
            showSizeSelect: this.getProdCategory(prodName) === 0 ? true : false,
            // shows type select only if prod is of 1's category because if it's of 0's category
            // it has to show size select first and if it's of 2 or 3 , they hasn't type
            showTypeSelect: this.getProdCategory(prodName) === 1 ? true : false,
            // setting this key thougth out function because there's a lot of conditions to show the cpt
            showPriceCpt: [0,2].includes(this.getProdCategory(prodName)) ? false : true,
            // setting this key thougth out function because there's a lot of conditions to show the cpt
            showSubtypeList: ((prodName === 'Etiquetas') || (this.getProdCategory(prodName) === 2))
                                ? (this.getProdCategory(prodName) === 2 ? 'cat2' : true)
                                : false,
            // We just can set price if it's of 1's or 3's category since they doesn't depend
            // on size and 2's category has individual prices
            price: [1 ,3].includes(this.getProdCategory(prodName)) ? this.getProdPrice(prodName) : false
        })
    }    
    setProdName(prodName) {
        this.setState({prodName}, () => this.setProds(prodName))
    }
    setProds(prodName) {
        if (this.state.prods[prodName]) {
            // We don't need update prod here
            return this.setStateFromProduct(prodName)
        }
        let prodData = {}
        if ([0,2].includes(this.getProdCategory(prodName))) {
            prodData = {
                dados: {},
                tipo_categoria: this.getProdCategory(prodName)
            }
        } else {
            // We can already set price since it doesn't depend on size
            prodData = {
                dados: {},
                tipo_categoria: this.getProdCategory(prodName),
                valor_unitario: this.getProdPrice(prodName)
                                        .toLocaleString('pt-br', {
                                            minimumFractionDigits: 2
                                        })
            }
        }
        this.setState({
            prods: Object.assign({}, this.state.prods, {
                [prodName]: prodData
            })
        }, () => this.setStateFromProduct(prodName))
    }
    render() {
        if (Object.keys(this.state.prods).length > 0) {
            axios.post('/set-prods', { prods: this.state.prods })
        }
        return (
            <Row>
                <Col bsPrefix="col mb-5">
                    <NewProductComponent key="new-product"/>
                    <ProductSelect key="product-select" onProductChange={this.handleProductChange}/>
                    <SizeSelect key="size-select" 
                                size={this.state.size}
                                prodName={this.state.prodName} 
                                onSizeChange={this.handleSizeChange}
                                show={this.state.showSizeSelect}/>
                    <TypeSelect onTypeChange={this.handleTypeChange}
                                prodName={this.state.prodName} 
                                show={this.state.showTypeSelect}
                                key="type-select"/>
                    <PriceComponent onPriceChange={this.handlePriceChange}
                                    prods={this.state.prods}
                                    show={this.state.showPriceCpt}
                                    prodName={this.state.prodName}
                                    size={this.state.size}
                                    key="price-cpt"/>
                    <SubtypeList type={this.state.type}
                                    price={this.state.price}
                                    show={this.state.showSubtypeList}
                                    key="typelist"
                                    size={this.state.size}
                                    prodName={this.state.prodName}
                                    prods={this.state.prods}
                                    onPriceChange={this.handlePriceChange}
                                    onSubtypeChange={this.handleSubtypeSet}/> 
                    <TotalComponent key="total-cpt" prods={this.state.prods}/>
                </Col>
            </Row>
        )
    }
}

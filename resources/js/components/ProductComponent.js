import React from "react";
import ProductSelect from "./ProductSelect";
import SizeSelect from "./SizeSelect";
import TypeSelect from "./TypeSelect";
import TotalComponent from "./TotalComponent";
import { Products } from "./resources/products";
import NewProductComponent from "./NewProductComponent";
import HeaderComponent from "./HeaderComponent";
import PriceComponent from "./PriceComponent";
import SubtypeList from './SubtypeList'
import axios from "axios";

export default class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
        this.getProdPrice = this.getProdPrice.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleSubtypeSet = this.handleSubtypeSet.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.mountCat0Prod = this.mountCat0Prod.bind(this)
        this.mountCat1Prod = this.mountCat1Prod.bind(this)
        this.mountCat2Prod = this.mountCat2Prod.bind(this)
        this.mountCat3Prod = this.mountCat3Prod.bind(this)
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
    getProdCategory() {
        return [0, 1, 2, 3].find(item => Products.categories[item][this.state.prodName]);
    }
    getProdPrice() {
        return this.state.price 
                || (this.getProdCategory() === 0 
                    && ('R$ ' + Products.categories[0][this.state.prodName].size.find(
                        item => item.name === this.state.size
                    ).price.toLocaleString("pt-br", { minimumFractionDigits: 2 })))
                || ('R$ ' + Products.categories[this.getProdCategory()][
                        this.state.prodName
                    ].price.toLocaleString("pt-br", { minimumFractionDigits: 2 }))
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
        this.setState({ 
            showTypeSelect: true, 
            showPriceCpt: true,
            size, 
        })           
    }
    handlePriceChange(price) {
        this.setState({price}, () =>
            this.state.prods[this.state.prodName] ? this.updateProdPrice() : null
        )
    }
    handleTypeChange(type) { 
        this.setState({ type }, () => this.setState({ showSubtypeList: true }))
    }    
    handleSubtypeSet(subtype) {
        const mounters = {
            0: () => this.mountCat0Prod(subtype),
            1: () => this.mountCat1Prod(subtype),
            2: () => this.mountCat2Prod(subtype),
            3: () => this.mountCat3Prod(subtype)
        }
        mounters[this.getProdCategory()]()
    }
    mountCat0Prod(subtype) {
        let prods = this.state.prods
        const prevDados = prods[this.state.prodName] && prods[this.state.prodName].dados
        const prevSizes = prevDados && prevDados[this.state.size]
        const prevTypes = prevSizes && prevSizes[this.state.type]
        prods = Object.assign({}, this.state.prods, {
            [this.state.prodName]: {
                tipo_categoria: 0,
                dados: Object.assign({}, (prevDados || {}), {
                    [this.state.size]: Object.assign({}, (prevSizes || {}), {
                        [this.state.type]: Object.assign({}, (prevTypes || {}), {
                            [subtype.name]: subtype.qty
                        }),
                        valor_unitario: this.getProdPrice() 
                    }),
                }) 
            }
        })
        this.setState({ prods }); 
    }
    mountCat1Prod(subtype) {
        let prods = this.state.prods
        const prevDados = prods[this.state.prodName] && prods[this.state.prodName].dados
        const prevTypes = prevSizes && prevSizes[this.state.type]
        prods = Object.assign({}, this.state.prods, {
            [this.state.prodName]: {
                tipo_categoria: 0,
                valor_unitario: this.getProdPrice(),
                dados: Object.assign({}, (prevDados || {}), {
                    [this.state.type]: Object.assign({}, (prevTypes || {}), {
                        [subtype.name]: subtype.qty
                    })                    
                }) 
            }
        })
        this.setState({ prods }); 
    }
    mountCat2Prod(subtype) {
        let prods = this.state.prods
        const prevDados = prods[this.state.prodName] && prods[this.state.prodName].dados
        const prevSizes = prevDados && prevDados[this.state.size]
        const prevTypes = prevSizes && prevSizes[this.state.type]
        prods = Object.assign({}, this.state.prods, {
            [this.state.prodName]: {
                tipo_categoria: 0,
                dados: Object.assign({}, (prevDados || {}), {
                    [this.state.size]: Object.assign({}, (prevSizes || {}), {
                        [this.state.type]: Object.assign({}, (prevTypes || {}), {
                            [subtype.name]: subtype.qty
                        })
                    }),
                }) 
            }
        })
        this.setState({ prods }); 
    }
    mountCat3Prod(subtype) {
        let prods = this.state.prods
        prods = Object.assign({}, this.state.prods, {
            [this.state.prodName]: {
                tipo_categoria: 0,
                valor_unitario: this.getProdPrice(),
                dados: Object.assign({}, (prevDados || {}), {
                    [subtype.name]: subtype.qty                     
                }) 
            }
        })
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
        this.setState({prodName}, () => this.setStateFromProduct(prodName))
    }
    updateProdPrice() {
        return this.state.prods[this.state.prodName].tipo_categoria === 0
                ? this.updateProdPriceCat0()
                : this.updateProdPriceCat1or3() 
    }
    updateProdPriceCat0() {
        let prods = this.state.prods
        prods[this.state.prodName].dados[this.state.size].valor_unitario = this.state.price
        this.setState({ prods })
    }
    updateProdPriceCat1or3() {
        let prods = this.state.prods
        prods[this.state.prodName].valor_unitario = this.state.price
        this.setState({ prods })
    }
    render() {
        if (Object.keys(this.state.prods).length > 0) {
            axios.post('/set-prods', { prods: this.state.prods })
        }
        return (
            <div style={{marginTop: '3em'}}>
                <NewProductComponent key="new-product"/>
                <HeaderComponent src="tasks-list.svg" title="Novo Pedido" key="header"/>
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
                                price={this.state.price}
                                prods={this.state.prods}
                                show={this.state.showPriceCpt}
                                prodName={this.state.prodName}
                                size={this.state.size}
                                label="Valor Geral"
                                priceInput={true}
                                borderBottom={true}
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
            </div>
        )
    }
}

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
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class ProductComponent extends React.Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
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
        axios.post('/set-prods', { prods: this.state.prods })
    } 
    closeModal() {
        this.setState({ zeroPrice: false })
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
    getProdCat2Price(subtype) {
        return this.state.price 
                || ('R$ ' + Products.categories[2][this.state.prodName]
                            .find((item) => item.name === subtype).price
                            .toLocaleString('pt-br', { minimumFractionDigits: 2 }))   
    }
    handleProductChange(prodName) {
        // reseting components 
        this.setState({
            showPriceCpt: false,
            showSizeSelect: false,
            showTypeSelect: false,
            showSubtypeList: false, 
            price: false
        }, () => this.setProdName(prodName))        
    }
    handleSizeChange(size) {
        this.setState({ 
            showTypeSelect: false, 
            showPriceCpt: true,
            size, 
            price: false
        }, () => this.setSize(size))           
    }
    handlePriceChange(price, subtype = null) {
        price === 'R$ 0,00' 
            ? this.setState({ zeroPrice: true })
            : this.setState({price}, () =>
                this.state.prods[this.state.prodName] ? this.updateProdPrice(price, subtype) : null
            )        
    }
    handleTypeChange(type) { 
        this.setState({ type }, () => this.setType(type))
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
    initializeProd() {
        if (!this.state.prods[this.state.prodName]) {
            this.setState({
                prods: Object.assign({}, this.state.prods, {
                    [this.state.prodName]: Object.assign({}, {
                        tipo_categoria: this.getProdCategory(), 
                        dados: {}
                    }, [1,3].includes(this.getProdCategory()) && {
                        valor_unitario: this.getProdPrice()
                    })
                })
            })
        }    
    }
    mountCat0Prod(subtype) {
        let prods = this.state.prods
        prods[this.state.prodName].dados[this.state.size][this.state.type][subtype.name] = subtype.qty
        this.setState({ prods }); 
    }
    mountCat1Prod(subtype) {
        let prods = this.state.prods
        prods[this.state.prodName].dados[this.state.type][subtype.name] = subtype.qty
        this.setState({ prods }); 
    }
    mountCat2Prod(subtype) {
        let prods = this.state.prods
        prods[this.state.prodName].dados[subtype.name] 
            ? prods[this.state.prodName].dados[subtype.name].quantidade = subtype.qty
            : prods[this.state.prodName].dados[subtype.name] = { 
                quantidade: subtype.qty,
                valor_unitario: this.getProdCat2Price(subtype.name)
            }
        this.setState({ prods }); 
    }
    mountCat3Prod(subtype) {
        let prods = this.state.prods
        prods[this.state.prodName].dados[subtype.name] = subtype.qty
        this.setState({ prods }); 
    }
    setStateFromProduct(prodName) {
        this.setState({
            showSizeSelect: this.getProdCategory(prodName) === 0 ? true : false,
            // shows type select only if prod is of 1's category because if it's of 0's category,
            // it has to show size select first and if it's of 2 or 3 , they hasn't type
            showTypeSelect: this.getProdCategory(prodName) === 1 ? true : false,
            // setting this key thougth out function because there's a lot of conditions to show the cpt
            showPriceCpt: [0,2].includes(this.getProdCategory(prodName)) ? false : true,
            showSubtypeList: ((prodName === 'Etiquetas') || (this.getProdCategory(prodName) === 2))
                                ? (this.getProdCategory(prodName) === 2 ? 'cat2' : true)
                                : false,
        }, () => this.initializeProd())
    }    
    setProdName(prodName) {
        this.setState({prodName}, () => this.setStateFromProduct(prodName))
    }
    setSize(size) {
        if (!this.state.prods[this.state.prodName].dados[size]) {
            let prods = this.state.prods
            prods[this.state.prodName].dados[size] = { valor_unitario: this.getProdPrice() }
            this.setState({ prods })
        }
        this.setState({ showTypeSelect: true, showSubtypeList: false })
    }
    setType(type) {
        if (this.getProdCategory() === 0 && !this.state.prods[this.state.prodName].dados[this.state.size][type]) {
            let prods = this.state.prods
            prods[this.state.prodName].dados[this.state.size][type] = {}
            this.setState({ prods })
        }
        if (this.getProdCategory() === 1 && !this.state.prods[this.state.prodName].dados[type]) {
            let prods = this.state.prods
            prods[this.state.prodName].dados[type] = {}
            this.setState({ prods })
        }
        this.setState({ showSubtypeList: true })
    }
    updateProdPrice(price, subtype) {
        return [
            () => this.updateProdPriceCat0(price), 
            () => this.updateProdPriceCat1or3(price), 
            (price, subtype) => this.updateProdPriceCat2(price, subtype), 
            () => this.updateProdPriceCat1or3(price)
        ][this.getProdCategory(this.state.prodName)](price, subtype)
    }
    updateProdPriceCat0(price) {
        let prods = this.state.prods
        prods[this.state.prodName].dados[this.state.size]  
            ? prods[this.state.prodName].dados[this.state.size].valor_unitario = price
            : null
        this.setState({ prods })
    }
    updateProdPriceCat2(price, subtype) {
        let prods = this.state.prods
        prods[this.state.prodName].dados[subtype] 
            ? prods[this.state.prodName].dados[subtype].valor_unitario = price
            : prods[this.state.prodName].dados[subtype] = { valor_unitario: price }
        this.setState({ prods })
    }
    updateProdPriceCat1or3(price) {
        let prods = this.state.prods
        prods[this.state.prodName].valor_unitario = price
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
                <Modal show={this.state.zeroPrice} onHide={this.closeModal} centered>
                    <Modal.Header bsPrefix="modal-header justify-content-center">
                        <Modal.Title>Aviso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-center">Valor não pode ser "R$ 0,00".</p>
                    </Modal.Body>
                    <Modal.Footer bsPrefix="modal-footer justify-content-center">
                        <Button variant="primary" onClick={this.closeModal}>Fechar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

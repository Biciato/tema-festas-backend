import React from "react"
import axios from 'axios'
import { AfterOrderComponent } from "./AfterOrderComponent";
import NewProductComponent from "./NewProductComponent";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './CartComponent.css'
import ProdBlock from "./ProdBlock"
import HeaderComponent from './HeaderComponent'
import Footer from './Footer'
import TotalQtyComponent from './TotalQtyComponent'
import TotalPriceComponent from './TotalPriceComponent'
import { Products } from "./resources/products";

export default class CartComponent extends React.Component {
    constructor(props) {
        super(props)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleSubtypeChange = this.handleSubtypeChange.bind(this)
        this.state = { showAfterOrder: false, loader: false }
    }    
    componentDidMount() {
        axios.get('/get-prods').then((response) => response.data.length === 0 
            ? window.location.assign('/clientes')
            : this.removeZeroQtyItems(response.data))
    }
    componentDidUpdate() {
        axios.post('/set-prods', { prods: this.state.prods })
    }   
    removeZeroQtyItems(prods) {
        Object.keys(prods).forEach((prod) => {
            const data = [
                () => this.filterProdsCat0(prods, prod),
                () => this.filterProdsCat1(prods, prod), 
                () => this.filterProdsCat2(prods, prod), 
                () => this.filterProdsCat3(prods ,prod)
            ][prods[prod].tipo_categoria]() 
            _.isEmpty(data) ? delete prods[prod] : prods[prod].dados = data
        })
        this.setState({ prods })
    } 
    filterProdsCat0(prods, item) {
        Object.keys(prods[item].dados).forEach((size) => {
            Object.keys(prods[item].dados[size]).filter((type) => type !== 'valor_unitario').forEach((type) => 
                prods[item].dados[size][type] = _.pickBy(prods[item].dados[size][type], (subtype) => !['',0,'0',null].includes(subtype))
            )
            prods[item].dados[size] = _.pickBy(prods[item].dados[size], (type) => !_.isEmpty(type))
        })
        return _.pickBy(prods[item].dados, (size) => size !== undefined && Object.keys(size).length > 1)
    }
    filterProdsCat1(prods, item) {
        Object.keys(prods[item].dados).forEach((type) => 
            prods[item].dados[type] = _.pickBy(prods[item].dados[type], (subtype) => !['',0,'0',null].includes(subtype))
        )
        return _.pickBy(prods[item].dados, (type) => !_.isEmpty(type))
    }
    filterProdsCat2(prods, item) {
        Object.keys(prods[item].dados).forEach((type) => 
            prods[item].dados[type] = _.pickBy(prods[item].dados[type], (subtype) => !['',0,'0',null].includes(subtype))
        )
        return _.pickBy(prods[item].dados, (type) => Object.keys(type).length > 1)
    }
    filterProdsCat3(prods, item) {
        return _.pickBy(prods[item].dados, (subtype) => !['',0,'0',null].includes(subtype))
    }
    getProdCategory(prodName) {
        return [0, 1, 2, 3].find(item => Products.categories[item][prodName]);
    }
    handlePriceChange(...data) {
        let prods = this.state.prods
        const updaters = [
            () => _.set(prods, [data[0], 'dados', data[1], 'valor_unitario'], data[2]),
            () => _.set(prods, [data[0], 'valor_unitario'], data[2]),
            () => _.set(prods, [data[0], 'dados', data[1], 'valor_unitario'], data[2]),
            () => _.set(prods, [data[0], 'valor_unitario'], data[2])
        ]
        updaters[this.getProdCategory(data[0])]()
        this.setState({ prods })
    }
    handleSubtypeChange(...data) {
        let prods = this.state.prods
        const updaters = [
            () => _.set(prods, [data[0], 'dados', data[1], data[2], data[3].name.split(' ')[1]], data[3].qty),
            () => _.set(prods, [data[0], 'dados', data[1], data[2].name], data[2].qty),
            () => _.set(prods, [data[0], 'dados', data[1].name, 'quantidade'], data[1].qty),
            () => _.set(prods, [data[0], 'dados', data[1].name], data[1].qty)
        ]
        updaters[this.getProdCategory(data[0])]()
        this.setState({ prods })
    }
    render() {       
        if (!this.state.prods) {
            return null
        }
        return (
            <div style={{marginTop: '3em'}}>
                <NewProductComponent arrow={true}
                                        totalPrice={this.state.totalPrice}
                                        totalQty={this.state.totalQty}/>
                <HeaderComponent src="shopping-bag.svg"  title="Seu Pedido"/>
                {Object.keys(this.state.prods).map((item, idx) => 
                    this.state.prods[item].tipo_categoria === 0 
                        ? Object.keys(this.state.prods[item].dados).map((size, idx) => 
                            <ProdBlock prod={this.state.prods[item].dados[size]} 
                                        prodName={item}
                                        size={size} 
                                        idx={idx}
                                        key={'prod-block-' + idx}
                                        onPriceChange={this.handlePriceChange}
                                        onSubtypeChange={this.handleSubtypeChange}/>
                        )
                        : <ProdBlock prod={this.state.prods[item]} 
                                        key={'prod-block-' + idx}
                                        idx={idx}
                                        prodName={item}
                                        onPriceChange={this.handlePriceChange}
                                        onSubtypeChange={this.handleSubtypeChange}/>
                )}
                <TotalQtyComponent prods={this.state.prods} key="total-qty-cpt"/>
                <TotalPriceComponent prods={this.state.prods} key="total-price-cpt"/>
                <AfterOrderComponent show={this.state.showAfterOrder}
                                        key="after-order-cpt"
                                        orderNumber={this.state.orderNumber}
                                        cdt={this.state.cdt}
                                        onBackClick={this.handleBackClick}/>
                <Footer onMakeOrderClick={this.handleMakeOrderClick} key="footer">
                    {this.state.loader
                        ?  <Loader type="ThreeDots"
                                    color="white"
                                    height={25}
                                    width={25}
                                    timeout={3000}/>
                        : 'Finalizar Pedido'}
                </Footer>
            </div>
        );
    }
}

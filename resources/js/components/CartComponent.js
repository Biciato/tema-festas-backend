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

export default class CartComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { showAfterOrder: false, loader: false }
    }    
    componentDidMount() {
        axios.get('/get-prods').then((response) => response.data.length === 0 
            ? window.location.assign('/clientes')
            : this.filterProds(response.data))
    }
    componentDidUpdate() {
        axios.post('/set-prods', { prods: this.state.prods })
    }   
    filterProds(prods) {
        const filtereds = Object.keys(prods).filter((item) => 
            [
                () => this.filterProdsCat0(prods, item),
                () => this.filterProdsCat1(prods, item), 
                () => this.filterProdsCat2(prods, item), 
                () => this.filterProdsCat3(prods ,item)
            ][prods[item].tipo_categoria]()
        )
        Object.keys(prods).forEach((prod) => !filtereds.includes(prod) && delete prods[prod])
        this.setState({ prods })
    } 
    filterProdsCat0(prods, item) {
        return !_.isArray(prods[item].dados) 
                && !_.isEmpty(Object.keys(prods[item].dados)
                    .filter((size) => 
                        this.filterCat0Sizes(Object.keys(prods[item].dados[size])
                            .filter((key) => key !== 'valor_unitario')
                            .filter((type) => 
                                this.filterCat0Types(Object.keys(prods[item].dados[size][type])
                                    .filter((subtype) => 
                                        this.filterCat0Subtypes(prods, item, size, type, subtype)
                                ))
                            )
                        )
                ))
    }
    filterCat0Subtypes(prods, item, size, type, subtype) {
        return !['',0,'0',null].includes(prods[item].dados[size][type][subtype])
    }
    filterCat0Types(arr) {
        return !_.isEmpty(arr)
    }
    filterCat0Sizes(arr) {
        return !_.isEmpty(arr) 
    }
    filterProdsCat1(prods, item) {
        return !_.isArray(prods[item].dados) 
                && !_.isEmpty(
                    Object.keys(prods[item].dados)
                            .filter((type) => 
                                this.filterCat1Types(Object.keys(prods[item].dados[type])
                                    .filter((subtype) => 
                                        this.filterCat1Subtypes(prods, item, type, subtype)
                            )))
        )
    }
    filterCat1Subtypes(prods, item, type, subtype) {
        return !['',0,'0',null].includes(prods[item].dados[type][subtype])
    }
    filterCat1Types(arr) {
        return !_.isEmpty(arr)
    }
    filterProdsCat2(prods, item) {
        return !_.isArray(prods[item].dados) 
            && !_.isEmpty(Object.keys(prods[item].dados)
                .filter((subtype) => !['',0,'0',null].includes(prods[item].dados[subtype].quantidade)))
    }
    filterProdsCat3(prods, item) {
        return !_.isArray(prods[item].dados) 
            && !_.isEmpty(
                    Object.keys(prods[item].dados)
                            .filter((subtype) => !['',0,'0',null].includes(prods[item].dados[subtype]))
                )
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
                                        key={'prod-block-' + idx}/>
                        )
                        : <ProdBlock prod={this.state.prods[item]} 
                                        key={'prod-block-' + idx}
                                        idx={idx}
                                        prodName={item}/>
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

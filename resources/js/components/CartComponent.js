import React from "react"
import axios from 'axios'
import AfterOrderComponent from "./AfterOrderComponent";
import NewProductComponent from "./NewProductComponent";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './CartComponent.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProdBlock from "./ProdBlock"
import HeaderComponent from './HeaderComponent'
import Footer from './Footer'
import TotalQtyComponent from './TotalQtyComponent'
import TotalPriceComponent from './TotalPriceComponent'

export default class CartComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAfterOrder: false,
            loader: false
        };
    }    
    componentDidMount() {
        axios.get('/get-prods').then((response) => response.data.length === 0 
            ? window.location.assign('/clientes')
            : this.setState({prods: response.data}))
    }
    componentDidUpdate() {
        axios.post('/set-prods', { 
            prods: this.state.prods
        })
    }    
    render() {       
        if (!this.state.prods) {
            return null
        }
        return (
            <Row>
                <Col bsPrefix="col p-0">
                    <div key="cart-div1" style={{display: this.state.showAfterOrder ? 'none' : 'block'}}>
                        <NewProductComponent arrow={true}
                                                totalPrice={this.state.totalPrice}
                                                totalQty={this.state.totalQty}/>
                    </div>
                    <div key="cart-div2"
                            className="init-div"
                            style={{
                                display: this.state.showSuccess ? "none" : "flex",
                                flexDirection: "column",
                                display: this.state.showAfterOrder ? 'none' : 'block',
                            }}>
                        <HeaderComponent src="shopping-bag.svg"  title="Seu Pedido"/>
                        {Object.keys(this.state.prods).map((item, idx) => 
                            this.state.prods[item].tipo_categoria === 0 
                                ? Object.keys(this.state.prods[item].dados).map((size, idx) => 
                                    <ProdBlock prod={this.state.prods[item].dados[size]} size={size} key={'prod-block-' + idx}/>
                                )
                                : <ProdBlock prod={this.state.prods[item]} key={'prod-block-' + idx}/>
                        )}
                        <TotalQtyComponent prods={this.state.prods} key="total-qty-cpt"/>
                        <TotalPriceComponent prods={this.state.prods} key="total-price-cpt"/>
                    </div>
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
                </Col>
            </Row>
        );
    }
}

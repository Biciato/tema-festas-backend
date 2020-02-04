import React from "react";
import axios from "axios";
import { AfterOrderComponent } from "./AfterOrderComponent";
import { NewProductComponent } from "./NewProductComponent";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ProdBlock } from "./ProdBlock";
import { HeaderComponent } from "./HeaderComponent";
import { Footer } from "./Footer";
import { TotalQtyComponent } from "./TotalQtyComponent";
import { TotalPriceComponent } from "./TotalPriceComponent";
import {
    removeZeroQtyItems,
    getProdCategory
} from "./resources/product.functions";
import { ModalZeroComponent } from "./ModalZeroPriceComponent";

export default class CartComponent extends React.Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.handleMakeOrderClick = this.handleMakeOrderClick.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleSubtypeChange = this.handleSubtypeChange.bind(this);
        this.state = { showAfterOrder: false, loader: false };
    }
    closeModal() { this.setState({ zeroConstraint: false })}
    componentDidMount() {
        axios.get("/get-prods")
                .then(response =>
                    response.data && Object.keys(response.data).length > 0
                        ? this.removeZeroQtyItems(response.data)
                        : window.location.assign("/clientes")
                );
    }
    componentDidUpdate() {
        axios.post("/set-prods", { prods: this.state.prods })
                .then(() => axios.get("/get-prods"));
    }
    handleMakeOrderClick() {
        this.state.loader &&
            this.setState({ loader: true }, () =>
                axios.post("/create-order", { order: this.state.prods })
                        .then(response =>
                            this.setState({
                                showAfterOrder: true,
                                cdt: "ok",
                                orderNumber: response.data
                            }))
                        .catch(() =>
                            this.setState({showAfterOrder: true, cdt: "err"}))
            );
    }
    handlePriceChange(...data) {
        if (data[2] === "R$ 0,00") {
            this.setState({
                zeroConstraint: { type: "Valor", value: data[2] }
            });
        } else {
            let prods = this.state.prods;
            const updaters = [
                () =>
                    _.set(
                        prods,
                        [data[0], "dados", data[1], "valor_unitario"],
                        data[2]
                    ),
                () => _.set(prods, [data[0], "valor_unitario"], data[2]),
                () =>
                    _.set(
                        prods,
                        [data[0], "dados", data[1], "valor_unitario"],
                        data[2]
                    ),
                () => _.set(prods, [data[0], "valor_unitario"], data[2])
            ];
            updaters[getProdCategory(data[0])]();
            this.setState({ prods });
        }
    }
    handleSubtypeChange(...data) {
        if (data[data.length - 1].qty === "0") {
            this.setState({ zeroConstraint: { type: "Quantidade", value: 0 } });
        } else {
            let prods = this.state.prods;
            const updaters = [
                () => _.set(
                        prods,
                        [
                            data[0],
                            "dados",
                            data[1],
                            data[2],
                            data[3].name.split(" ")[1]
                        ],
                        data[3].qty
                    ),
                () => _.set(
                        prods,
                        [data[0], "dados", data[1], data[2].name],
                        data[2].qty
                    ),
                () => _.set(
                        prods,
                        [data[0], "dados", data[1].name, "quantidade"],
                        data[1].qty
                    ),
                () => _.set(prods,[data[0],"dados",data[1].name],data[1].qty)
            ];
            updaters[getProdCategory(data[0])]();
            this.setState({ prods });
        }
    }
    removeZeroQtyItems(prods) {
        this.setState({ prods: { ...removeZeroQtyItems(prods) } });
    }
    render() {
        if (!this.state.prods) {
            return null;
        }
        return (
            <div>
                <div style={{ display: this.state.showAfterOrder && "none" }}>
                    <NewProductComponent arrow={true}
                                            totalPrice={this.state.totalPrice}
                                            totalQty={this.state.totalQty}/>
                    <HeaderComponent src="shopping-bag.svg"
                                        title="Seu Pedido"/>
                    {Object.keys(this.state.prods).map((item, idx) =>
                        this.state.prods[item].tipo_categoria === 0 ? (
                            Object.keys(this.state.prods[item].dados)
                                .map((size, idx) => (
                                <ProdBlock idx={idx}
                                        prod={this.state.prods[item].dados[size]}
                                        prodName={item}
                                        size={size}

                                        key={"prod-block-" + idx}
                                        onPriceChange={this.handlePriceChange}
                                        onSubtypeChange={this.handleSubtypeChange}/>
                            ))
                        ) : (
                            <ProdBlock prod={this.state.prods[item]}
                                    key={"prod-block-" + idx}
                                    idx={idx}
                                    prodName={item}
                                    onPriceChange={this.handlePriceChange}
                                    onSubtypeChange={this.handleSubtypeChange}/>
                        )
                    )}
                    <TotalQtyComponent prods={this.state.prods}
                                        key="total-qty-cpt"/>
                    <TotalPriceComponent prods={this.state.prods}
                                            key="total-price-cpt"/>
                    <Footer onMakeOrderClick={this.handleMakeOrderClick}
                            key="footer">
                        {this.state.loader ? (
                            <Loader type="ThreeDots"
                                    color="white"
                                    height={25}
                                    width={25}
                                    timeout={3000}/>
                        ) : ( "Finalizar Pedido" )}
                    </Footer>
                </div>
                <AfterOrderComponent show={this.state.showAfterOrder}
                                        key="after-order-cpt"
                                        orderNumber={this.state.orderNumber}
                                        cdt={this.state.cdt}/>
                <ModalZeroComponent show={this.state.zeroConstraint && true}
                                    type={
                                        this.state.zeroConstraint &&
                                        this.state.zeroConstraint.type
                                    }
                                    value={
                                        this.state.zeroConstraint &&
                                        this.state.zeroConstraint.value
                                    }
                                    onCloseModal={this.closeModal}/>
            </div>
        );
    }
}

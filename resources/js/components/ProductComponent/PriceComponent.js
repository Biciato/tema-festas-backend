import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import toCurrency from "../resources/currency";

export default class PriceComponent extends React.Component {
    constructor(props) {
        super(props)
        this.getProdCategory = this.getProdCategory.bind(this)
        this.getProdPrice = this.getProdPrice.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
    }
    getProdCategory() {
        return [0, 1, 2, 3].find((item) => 
            Products.categories[item][this.props.prodName]
        );
    }
    getProdPrice() {
        if (props.prods[props.prodName]) {
            if (this.getProdCategory() === 0) {
                if (props.prods[props.prodName].dados[props.size]) {
                    return props.prods[props.prodName].dados[props.size]
                        .valor_unitario;
                } else if (props.size) {
                    return Products.categories[0][props.prodName].size
                        .filter(item => item.name === props.size)
                        .map(item => item.price)
                        .shift();
                } else {
                    return 0;
                }
            } else if (this.getProdCategory() === 2) {
                return 0;
            } else {
                return props.prods[props.prodName].valor_unitario;
            }
        }
    }
    handlePriceChange(e) {
        this.setState({
            price: `R$ ${toCurrency(e.target.value)}`
        });
        this.props.onPriceChange(`R$ ${toCurrency(e.target.value)}`);
    }
    render() {
        return (
            <InputGroup key="input-group" className="mt-3">
                <label
                    key="label"
                    style={{
                        width: "61%",
                        borderBottom: "1px solid #D7D7D7",
                        marginRight: "1em",
                        marginBottom: 0,
                        padding: "1em 0.5em 0.2em",
                        fontSize: "14px",
                        fontWeight: "normal"
                    }}
                >
                    Valor Geral
                </label>
                <FormControl
                    key="form-control"
                    value={this.state.price}
                    onChange={this.handlePriceChange}
                    style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        color: "#747474"
                    }}
                />
            </InputGroup>
        );
    }
}

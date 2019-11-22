import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {
    Types
} from '../resources/types'
import {
    Products
} from '../resources/products'
import './TypeList.scss';

const e = React.createElement

export default class TypeList extends React.Component {
    constructor(props) {
        super(props)
        this.handleMinusQty = this.handleMinusQty.bind(this)
        this.handleQtyChange = this.handleQtyChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handlePlusQty = this.handlePlusQty.bind(this)
        this.state = {
            subtypeObj: {}
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.prods !== this.props.prods) {
            this.setState({
                subtypeObj: {}
            }, () => this.forceUpdate());
        }
    }
    handlePlusQty(item) {
        const value = parseInt(document.querySelectorAll(`[data="${item}-qty"]`)[0].value)
        document.querySelectorAll(`[data="${item}-qty"]`)[0].value = value + 1
        this.handleQtyChange({
            target: {
                value: document.querySelectorAll(`[data="${item}-qty"]`)[0].value,
                attributes: {
                    data: {
                        value: `${item}-qty`
                    }
                }
            }
      })
    }
    handleMinusQty(item) {
        const value = parseInt(document.querySelectorAll(`[data="${item}-qty"]`)[0].value)
        if (value > 0) {
            document.querySelectorAll(`[data="${item}-qty"]`)[0].value = value - 1
        }
        this.handleQtyChange({
            target: {
                value: document.querySelectorAll(`[data="${item}-qty"]`)[0].value,
                attributes: {
                    data: {
                        value: `${item}-qty`
                    }
                }
            }
        })
    }
    handleQtyChange(e) {
        let subtypeObj = {};
        if (this.getProdCategory() === 2) {
            const price = document.querySelectorAll(
                `[data="${e.target.attributes.data.value.replace('-qty', '')}"]`
            )[0].value;
            subtypeObj = {
                [e.target.attributes.data.value.replace('-qty', '')]: {
                    qty: e.target.value,
                    price: price.toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                        currency: 'BRL',
                        style: 'currency'
                    })
                }
            }
        } else {
            subtypeObj = {
                [e.target.attributes.data.value.replace('-qty', '')]: {
                    qty: e.target.value
                }
            }
        }
        this.setState({
                subtypeObj
            }, () =>
            this.props.onSubtypeChange({
                subtype: this.state
            })
        );
    }
    handlePriceChange(e) {
        const qty = document.querySelectorAll(
            `[data="${e.target.attributes.data.value}-qty"]`
        )[0].value;
        const price = e.target.value
        const subtypeObj = {
            [e.target.attributes.data.value]: {
                qty,
                price: this.moeda(price)
            }
        }
        this.setState({
                subtypeObj
            }, () =>
            qty === '' ?
            null :
            this.props.onSubtypeChange({
                subtype: this.state
            })
        );
    }
    moeda(v) {
        v = v.replace(/\D/g, "") // permite digitar apenas numero
        v = v.replace(/(\d{1})(\d{14})$/, "$1.$2") // coloca ponto antes dos ultimos digitos
        v = v.replace(/(\d{1})(\d{11})$/, "$1.$2") // coloca ponto antes dos ultimos 11 digitos
        v = v.replace(/(\d{1})(\d{8})$/, "$1.$2") // coloca ponto antes dos ultimos 8 digitos
        v = v.replace(/(\d{1})(\d{5})$/, "$1.$2") // coloca ponto antes dos ultimos 5 digitos
        v = v.replace(/(\d{1})(\d{1,2})$/, "$1,$2") // coloca virgula antes dos ultimos 2 digitos
        return v;
    }
    getProdCategory() {
        return [0, 1, 2, 3].find((item) => Products.categories[item][this.props.prodName]);
    }
    getItemPrice(item) {
        return Products.categories[2][this.props.prodName]
            .filter((i) => i.name === item)
            .map((i) => i.price)
            .shift();
    }

    render() {
        let types = [];
        switch (this.getProdCategory()) {
            case 2:
                types = Products.categories[2][this.props.prodName].map((item) => item.name)
                break
            case 3:
                types = Products.categories[3].Etiquetas.names;
                break
            default:
                types = this.props.prodName.includes('ela') ?
                    [...Array(10).keys()].map(x => ++x) :
                    Types[this.props.type];
        }
        if (types === undefined) {
            return null
        }
        return types.map((item, idx) => {
            return e(
                Row, {
                    key: idx,
                    style: {
                        backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8')
                    },
                },
                e(Col, null, [
                    e('label', {
                        variant: 'info',
                        key: 'c-0',
                        style: {
                            fontSize: '14px',
                            fontWeight: '600',
                            width: '60%',
                            marginRight: '1em',
                            marginBottom: 0,
                            padding: '0.2em 0.5em'
                        }
                    }, item),
                    e('span', {
                        onClick: () => this.handleMinusQty(item),
                        key: 'c-1',
                        style: {
                            fontSize: '30px',
                            display: 'inline-block',
                            verticalAlign: 'sub',
                            color: '#32338D',
                            cursor: 'pointer'
                        }
                    }, '-'),
                    e(FormControl, {
                        key: this.props.type + item + 'c-2',
                        min: 0,
                        onChange: this.handleQtyChange,
                        data: item + '-qty',
                        defaultValue: 0,
                        style: {
                            border: 'none',
                            display: 'inline-block',
                            width: '20%',
                            backgroundColor: 'inherit',
                            textAlign: 'center'
                        }
                    }),
                    e('span', {
                        onClick: () => this.handlePlusQty(item),
                        key: 'b-1',
                        style: {
                            fontSize: '30px',
                            display: 'inline-block',
                            verticalAlign: 'sub',
                            color: '#32338D',
                            cursor: 'pointer',
                            margin: 0,
                            padding: 0
                        }
                    }, '+'),
                    e(InputGroup, {
                        key: 'b-2',
                        size: 'sm',
                        className: this.getProdCategory() !== 2 ? 'd-none' : ''
                    }, [
                        e('label', {
                            key: 'c-1',
                            style: {
                                width: '61%',
                                marginRight: '1em',
                                marginBottom: 0,
                                padding: '0.2em 0.5em',
                                color: '#747474',
                                borderTop: '1px solid #D7D7D7',
                                paddingTop: '0.7em'
                            }
                        }, 'Valor Unitário'),
                        e(FormControl, {
                            key: 'c-2',
                            value: this.getProdCategory() === 2 ?
                                this.state.subtypeObj[item] ?
                                this.state.subtypeObj[item].price :
                                this.getItemPrice(item).toLocaleString('pt-br', {
                                    minimumFractionDigits: 2,
                                    currency: 'BRL',
                                    style: 'currency'
                                }) :
                                '0,00',
                            onChange: this.handlePriceChange,
                            data: item,
                            style: {
                                borderRadius: '5px',
                                backgroundColor: 'inherit',
                                textAlign: 'center',
                                color: '#747474'
                            }
                        })
                    ])
                ])
            )
        })
    }
}

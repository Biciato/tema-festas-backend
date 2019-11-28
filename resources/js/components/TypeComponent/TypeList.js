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
        let qty = e.target.value.replace(/\D/g,'')
        if (qty.indexOf(0) === 0) {
            qty = qty.replace('0','')
        }
        let subtypeObj = {};
        if (this.getProdCategory() === 2) {
            const price = document.querySelectorAll(
                `[data="${e.target.attributes.data.value.replace('-qty', '')}"]`
            )[0].value;
            subtypeObj = {
                [e.target.attributes.data.value.replace('-qty', '')]: {
                    qty,
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
                    qty
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
                price: 'R$ ' + this.moeda(price)
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
    moeda(i) {
        let v = i.replace('R$', '').trim().replace(/\D/g,'');
        v = (v/100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
        return v;
    }
    getProdCategory() {
        return [0, 1, 2, 3].find((item) => Products.categories[item][this.props.prodName]);
    }
    getItemPrice(item) {
        if (this.props.prods 
            && this.props.prodName
            && this.props.prods[this.props.prodName] 
            && this.props.prods[this.props.prodName].dados 
            && this.props.prods[this.props.prodName].dados[item]) {
                return this.props.prods[this.props.prodName].dados[item].valor_unitario
        }
        return Products.categories[2][this.props.prodName]
            .filter((i) => i.name === item)
            .map((i) => i.price)
            .shift();
    }
    getProdQty(item) {
        if (this.props.prods[this.props.prodName]) {
            if (this.props.prods[this.props.prodName].dados) {
                if (this.props.prods[this.props.prodName].dados[this.props.size] &&
                    this.props.prods[this.props.prodName].dados[this.props.size][this.props.type] &&
                        this.props.prods[this.props.prodName].dados[this.props.size][this.props.type][item]) {
                    return this.props.prods[this.props.prodName].dados[this.props.size][this.props.type][item]            
                } else if (this.props.prods[this.props.prodName].dados[this.props.type] &&
                            this.props.prods[this.props.prodName].dados[this.props.type][item]) {
                    return this.props.prods[this.props.prodName].dados[this.props.type][item]
                } else if (this.props.prods[this.props.prodName] !== 'Etiquetas' &&
                            this.props.prods[this.props.prodName].dados[item] && 
                            this.props.prods[this.props.prodName].dados[item].quantidade) {
                    return this.props.prods[this.props.prodName].dados[item].quantidade
                } else if (this.props.prodName === 'Etiquetas') {
                    if (this.props.prods[this.props.prodName].dados[item]) {
                        return this.props.prods[this.props.prodName].dados[item]
                    } else {
                        return 0
                    }
                } else {
                    return 0
                }
            } else {
                return 0
            }
        } else {
            return 0
        }        
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
                    key: idx + 'type',
                    style: {
                        backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8')
                    },
                },
                e(Col, {style:{display:'flex', justifyContent: 'space-between', flexWrap: 'wrap'}, key: 'col-' + idx }, [
                    e('label', {
                        variant: 'info',
                        className: 'list-label',
                        key: 'c-0',
                        style: {
                            fontSize: '14px',
                            fontWeight: '600',
                            marginRight: '1em',
                            marginBottom: 0,
                            padding: this.getProdCategory() !== 2 ? '6% 3%' : '6% 3% 1%',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxHeight: '70px'
                        }
                    }, item),
                    e('div', {className: 'qty-div', key: idx + '-div',style: {display: 'flex', float: 'right', width: '33%'}}, 
                        e('span', {
                            onClick: () => this.handleMinusQty(item),
                            key: 'c-1-' + idx,
                            style: {
                                fontSize: '30px',
                                display: 'inline-block',
                                verticalAlign: 'sub',
                                color: '#32338D',
                                cursor: 'pointer'
                            }
                        }, '-'),
                        e(FormControl, {
                            key: (this.props.size ? this.props.size : '') + this.props.type + item + 'c-2',
                            className: 'types-qty-input',
                            min: 0,
                            onChange: this.handleQtyChange,
                            data: item + '-qty',
                            value: this.getProdQty(item),
                            style: {
                                border: 'none',
                                display: 'inline-block',
                                backgroundColor: 'inherit',
                                textAlign: 'center',
                                width: '73%'                                
                            }
                        }),
                        e('span', {
                            onClick: () => this.handlePlusQty(item),
                            key: 'b-1-' + idx,
                            style: {
                                fontSize: '30px',
                                display: 'inline-block',
                                verticalAlign: 'sub',
                                color: '#32338D',
                                cursor: 'pointer',
                                margin: 0,
                                padding: 0
                            }
                        }, '+')
                    ),
                    e(InputGroup, {
                        key: 'b-2-' + idx,
                        size: 'sm',
                        style: {
                            marginBottom: '5%'
                        },
                        className: this.getProdCategory() !== 2 ? 'd-none' : ''
                    }, [
                        e('label', {
                            key: 'c-3-' + idx,
                            style: {
                                width: '61%',
                                marginRight: '1em',
                                fontSize: '14px',
                                marginBottom: 0,
                                padding: '0.2em 0.5em',
                                color: '#747474',
                                borderTop: '1px solid #D7D7D7',
                            }
                        }, 'Valor Unitário'),
                        e(FormControl, {
                            key: 'c-2-' + idx,
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

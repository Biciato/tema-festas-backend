import React from 'react';
import TypeSelect from './TypeSelect';
import TypeList from './TypeList';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Products } from '../resources/products';

const e = React.createElement;

export default class TypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubtypeChange = this.handleSubtypeChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.state = { 
      type: props.type ? props.type : 'não possui', 
      price: this.getProdPrice().toLocaleString('pt-br', {
        style: 'currency', 
        currency: 'BRL', 
        minimumFractionDigits: 2
      }) 
    };
  }
  componentDidUpdate(prevProps){
    if(prevProps.size !== this.props.size){
        this.setState({          
          price: this.getProdPrice().toLocaleString('pt-br', {
            style: 'currency', 
            currency: 'BRL', 
            minimumFractionDigits: 2
          }),
          type: this.state.type
        });
    }
  }
  moeda(i){
    let v = i.replace('R$', '').trim().replace(/\D/g,'');
    v = (v/100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    return v;
  }

  handleTypeChange(type) {
    this.setState({ 
      type }, 
      () => this.props.onTypeChange(type, this.props.prodName, this.props.size)
    );
  }
  handleSubtypeChange(subtype) {
    this.setState(subtype, () => {
      this.props.onSubtypeSet(this.state, this.props.prodName, this.props.size)
    });
  }
  handlePriceChange(e) {
    const price = 'R$ ' + this.moeda(e.target.value);
    this.setState({price}, ()=> this.props.onPriceChange(price, this.props.prodName, this.props.size)) 
  }
  getProdCategory() {
    return [0, 1, 2, 3].find((item) => 
      Products.categories[item][this.props.prodName]
    );
  }
  getProdPrice() {
    if (this.props.prods[this.props.prodName]) {
      if (this.getProdCategory() === 0) {
        if (this.props.prods[this.props.prodName].dados[this.props.size]) {
          return this.props.prods[this.props.prodName].dados[this.props.size].valor_unitario
        } else {
          return Products.categories[0][this.props.prodName].size
            .filter((item) => item.name === this.props.size)
            .map((item) => item.price)
            .shift();
        }
      } else if(this.getProdCategory() === 2) {
        return 0
      } else {
        return this.props.prods[this.props.prodName].valor_unitario 
      } 
    } else {
      switch (this.getProdCategory()) {
        case 0:
          return Products.categories[0][this.props.prodName].size
            .filter((item) => item.name === this.props.size)
            .map((item) => item.price)
            .shift();
        case 1:
          return Products.categories[1][this.props.prodName].price;
        case 2:
          return 0;
        default:
          return 1.50;
      }
    }
  }

  render() {
    let typeSelectProps = {
      onTypeChange: this.handleTypeChange,
      key: 2,
      prodName: this.props.prodName
    } 
    if (this.props.type) {
      typeSelectProps.type = this.props.type
    }
    return (
      e(Row, { bsPrefix: 'row mb-5 mt-3' + (this.props.display ? ' d-none' : '') },
        e(Col, null, [
          e(TypeSelect, typeSelectProps), 
          e(InputGroup, { 
              key: 3, 
              className: this.getProdCategory() === 2 ? 'd-none' : 'mt-3' 
            }, [
              e('label', {
                key: 'c-1',
                style: {
                  width: '61%',
                  borderBottom: '1px solid #D7D7D7',
                  marginRight: '1em',
                  marginBottom: 0,
                  padding: '1em 0.5em 0.2em',
                  fontSize: '14px',
                  fontWeight: 'normal'
                }
              }, 'Valor Geral'),
              e(FormControl, { 
                key: 'i-2', 
                value: this.state.price,
                onChange: this.handlePriceChange, 
                style: {
                  borderRadius: '5px',
                  textAlign: 'center',
                  color: '#747474'
                }
              })
            ]
          ),
          e(TypeList, {
            type: this.state.type,
            key: 4,
            size: this.props.size ? this.props.size : 'not has',
            prodName: this.props.prodName,
            prods: this.props.prods,
            onSubtypeChange: this.handleSubtypeChange
          })
        ])
      )
    )
  }
}

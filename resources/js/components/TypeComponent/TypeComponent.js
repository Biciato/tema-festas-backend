import React from 'react';
import TypeSelect from './TypeSelect';
import TypeList from './TypeList';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Products } from '../resources/products';
import toCurrency from '../resources/currency'

const e = React.createElement;

export default class TypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubtypeChange = this.handleSubtypeChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.state = { 
      type: props.type ? props.type : 'has not', 
      price: this.getProdPrice(props)
    };
  }
  componentDidUpdate(prevProps){
    if(prevProps !== this.props && this.props.prodName){
        this.setState({          
          price: this.getProdPrice(this.props).toLocaleString('pt-br', {
            style: 'currency', 
            currency: 'BRL', 
            minimumFractionDigits: 2
          }),
          type: this.state.type
        });
    }
  }

  handleTypeChange(type) {
    this.setState({ 
      type }, 
      () => this.props.onTypeChange(type, this.props.prodName, this.props.size)
    );
  }
  handleSubtypeChange(subtype) {
    this.setState(subtype, () => {
      this.props.onSubtypeSet(this.props.prodName, this.props.size, this.state.type, subtype)
    });
  }
  
  getProdCategory() {
    return [0, 1, 2, 3].find((item) => 
      Products.categories[item][this.props.prodName]
    );
  }
  getProdPrice(props) {
    if (props.prods[props.prodName]) {
      if (this.getProdCategory() === 0) {
        if (props.prods[props.prodName].dados[props.size]) {
          return props.prods[props.prodName].dados[props.size].valor_unitario
        } else if (props.size) {
          return Products.categories[0][props.prodName].size
            .filter((item) => item.name === props.size)
            .map((item) => item.price)
            .shift();
        } else {
          return 0
        }
      } else if(this.getProdCategory() === 2) {
        return 0
      } else {
        return props.prods[props.prodName].valor_unitario 
      } 
    } 
  }

  render() {
    if (this.props.showTypeCpt) {
      return (
        <Row bsPrefix="row mb-5 mt-3">
          <Col>
            <TypeSelect onTypeChange={this.handleTypeChange}
                        key="type-select"
                        prodName={this.props.prodName}/>
            
            <TypeList type={this.state.type}
                      key="typelist"
                      size={this.props.size ? this.props.size : 'has not'}
                      prodName={this.props.prodName}
                      prods={this.props.prods}
                      onSubtypeChange={this.handleSubtypeChange}/>
          </Col>
        </Row>
      )
    } else {
      return null
    }
  }
}

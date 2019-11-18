import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { Products } from '../resources/products'

const e = React.createElement

export default class SizeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { selectedOption: {value: 'Tamanho', label: 'Tamanho'}}
  }
  componentDidUpdate(prevProps){
    if(prevProps.prodName !== this.props.prodName){
        this.setState({          
          selectedOption: null
        });
    }
  }
  handleChange(size) {
    this.setState({selectedOption: [{
      label: size.value,
      value: size.value
    }]})
    this.props.onSizeChange(size.value, this.props.prodName);
  }
  getProdCategory() {
    return [0, 1, 2, 3].find((item) => Products.categories[item][this.props.prodName]);
  }
  prodHasSize(category) {
    return Products.categories[category][this.props.prodName].size ? true : false;
  }
  
  render() {
    const selectedOption = this.state.selectedOption;
    const sizeList = this.prodHasSize(this.getProdCategory())
      ? Products.categories[this.getProdCategory()][this.props.prodName].size
        .map((item => ({
          value: item.name,
          label: item.name
        })))
      : [{
        value: 'único',
        label: 'único'
      }]
    return (
      e(Row, { bsPrefix: 'row m-1' + (this.props.display ? ' d-none' : '')},
        e(Col, null,
          e(Select, {
            value: selectedOption,
            options: sizeList,
            onChange: this.handleChange,
            styles: {
              control: styles => ({
                ...styles,
                fontSize: '14px',
                fontWeight: '600'
              })              
            },
          })
        )
      )
    )
  }
}

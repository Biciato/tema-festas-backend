import React from 'react';
import {
  Products
} from '../resources/products';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';

const e = React.createElement

export default class ProductSelect extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.state = { prodSelected: 'Produto' }
  }
  
  handleChange(product) {
    this.setState({
      prodSelected: product
    })
    this.props.onProductChange(product.value)
  }
  render() {
    const prodList = Object.assign(
      {}, 
      Products.categories[0],
      Products.categories[1],
      Products.categories[2],
      Products.categories[3]
    )
    
    return (
      e(Row, {
          bsPrefix: 'row m-1' + (this.props.display ? ' d-none' : '')
        },
        e(Col, null, 
          e('h5', {className: "text-left mt-3", key: 1}, 
            e('img', {
              src: "/images/tasks-list.svg",
              alt: "task",
              style: {
                  width: '7%',
                  margin: '0.2em 0.4em 0.4em 0'
              }
            }), 
            'Novo Pedido'
          ),
          e(Select, {
            options: Object.keys(prodList).map((item) => ({value: item, label: item})),
            onChange: this.handleChange,
            defaultValue: { value: this.state.prodSelected, label: this.state.prodSelected},
            styles: {
              control: styles => ({
                ...styles,
                fontSize: '14px',
                fontWeight: '600'
              })              
            },
            key: 2
          })
        )
      )
    )
  }
}

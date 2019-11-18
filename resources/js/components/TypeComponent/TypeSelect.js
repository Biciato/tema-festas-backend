import React from 'react'
import Select from 'react-select'
import { Products } from '../resources/products'

const e = React.createElement

export default class TypeSelect extends React.Component {
  constructor(props) {
    super(props)
    this.handleTypeChange = this.handleTypeChange.bind(this)
  }
  handleTypeChange(subtype) {
    this.props.onTypeChange(subtype.value, this.props.prodName)
  }
  getProdCategory() {
    return [0, 1, 2, 3].filter((item) => Products.categories[item][this.props.prodName]).shift();
  }
  render() {
    const list = [0, 1].includes(this.getProdCategory()) 
      ? ['poa', 'liso', 'temas'].map((item) => ({
        value: item,
        label: item
      }))
      : [{
        value: 'Não Possui',
        label: 'Não Possui'
      }]
    return (
      e(Select, {
        className: 
          [2,3].includes(this.getProdCategory()) || this.props.prodName.includes('ela') 
            ? 'd-none' 
            : '',
        defaultValue: {value: 'Subtipo', label: 'Subtipo'},
        options: list,
        onChange: this.handleTypeChange,
        styles: {
          control: styles => ({
            ...styles,
            fontSize: '14px',
            fontWeight: '600'
          })              
        },
      })
    )
  }
}

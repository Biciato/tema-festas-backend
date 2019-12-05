import React from 'react';
import { Products } from '../resources/products';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import HeaderComponent from "../HeaderComponent";

const prodList = Object.assign(
  {}, 
  Products.categories[0],
  Products.categories[1],
  Products.categories[2],
  Products.categories[3]
) 

export default function ProductSelect(props) {  
  const handleChange = (product) => props.onProductChange(product.value)
  return (
    <Row bsPrefix="row mt-4">
      <Col>
        <HeaderComponent src="tasks-list.svg" title="Novo Pedido" key="header"/>
        <Select options={Object.keys(prodList).map((item) => ({value: item, label: item}))} 
                onChange={handleChange}
                defaultValue={{value: 'Produto', label: 'Produto'}}
                styles={{
                  control: styles => ({
                    ...styles,
                    fontSize: '14px',
                    fontWeight: '600'
                  })              
                }}
                key="select"/>
      </Col>
    </Row>
  )
}

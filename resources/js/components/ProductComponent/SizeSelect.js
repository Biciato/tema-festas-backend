import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { Products } from '../resources/products'

export default function SizeSelect(props) {
  const handleChange = (size) => props.onSizeChange(size.value)  
  if (props.show)  {
      return (
        <Row bsPrefix="row mt-3">
          <Col>
            <Select defaultValue={{value: 'Tamanho', label: 'Tamanho'}}
                      options={Products.categories[0][props.prodName].size
                                .map((item) => ({
                                  value: item.name,
                                  label: item.name
                                }))}
                      onChange={handleChange}
                      styles={{
                        control: styles => ({
                          ...styles,
                          fontSize: '14px',
                          fontWeight: '600'
                        })    
                      }}/>
          </Col>
        </Row>
      )
  } else {
    return null
  }
}

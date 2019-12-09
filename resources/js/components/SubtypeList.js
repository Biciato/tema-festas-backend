import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Types } from './resources/types'
import { Products } from './resources/products'
import './SubtypeList.css';
import PriceComponent from './PriceComponent';
import QuantityComponent from './QuantityComponent';

export default function SubtypeList(props) {
    const getProdCategory = () => [0, 1, 2, 3].find(item => Products.categories[item][props.prodName])
    const getTypes = () => {
        if ([0,1].includes(getProdCategory())) {
            return props.prodName.includes('ela') 
                        ? [...Array(10).keys()].map(x => ++x) 
                        : Types[props.type]
        } else if (props.prodName && props.prodName === 'Etiquetas') {
            return Products.categories[3].Etiquetas.names
        } else if (getProdCategory() === 2) {
            return Products.categories[2][props.prodName].map((item) => item.name)
        } else {
            return []
        }
    }
    const handlePriceChange = (price, item) => props.onPriceChange(price, item)
    const handleQtyChange = (subtype) => props.onSubtypeChange(subtype)
    if (props.show) {
        return getTypes().map((item, idx) => {
            return (
                <Row style={{ backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8') }}
                        key={idx + 'type'}>
                    <Col style={{display:'flex', justifyContent: 'space-between', flexWrap: 'wrap'}} 
                            key={'col' + idx}>
                        <div style={{margin: getProdCategory() === 2 
                                                ? '0.5em 0px 0 0.5em'
                                                : '0.5em 0 0.5em 0.5em',
                                    height: getProdCategory() === 2 
                                                ? '2.5em'
                                                : ''}}>
                            <label key="c-0"
                                    className="list-label"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 'normal',
                                        marginRight: '1em',
                                        marginBottom: 0,
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        maxHeight: '70px',
                                        paddingTop: '0.8em'
                                    }}>
                                        {item}
                            </label>
                        </div>
                        <QuantityComponent onQtyChange={handleQtyChange}
                                            prods={props.prods}
                                            prodName={props.prodName}
                                            item={item}
                                            key={idx + '-div'} 
                                            size={props.size}
                                            type={props.type}/>
                        <PriceComponent onPriceChangeFromSubtypeList={handlePriceChange}
                                        prods={props.prods}
                                        item={item}
                                        price={props.price}
                                        show={props.show === 'cat2' ? true : false}
                                        prodName={props.prodName}
                                        size={props.size}
                                        key="price-cpt"/>                       
                    </Col>
                </Row>
            )
        })
    } else {
        return null
    }
}

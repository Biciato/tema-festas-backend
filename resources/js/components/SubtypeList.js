import React from 'react';
import { Types } from './resources/types'
import { Products } from './resources/products'
import './SubtypeList.css';
import PriceComponent from './PriceComponent';
import QuantityComponent from './QuantityComponent';

export default function SubtypeList(props) {
    const getProdCategory = () => [...Array(4).keys()].find(item => Products.categories[item][props.prodName]) 
    const getSubtypeQty = (subtype) => 
        (_.get(props.prods[props.prodName], [
            ['dados', props.size, props.type, subtype],
            ['dados', props.type, subtype],
            ['dados', subtype, 'quantidade'],
            ['dados', subtype]
        ][getProdCategory()])) || 0
    const getTypes = () => (props.type && (getProdCategory() !== 2) && Types[props.type])
                            || (props.prodName.includes('ela') && [...Array(10).keys()].map(x => ++x))  
                            || (props.prodName === 'Etiquetas' && Products.categories[3].Etiquetas.names) 
                            || Products.categories[2][props.prodName].map((item) => item.name)
    if (props.show) {
        return getTypes().map((subtype, idx) => 
            (
                <div key={subtype + idx}    
                        style={{ 
                            backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8'),
                            marginBottom: idx === (getTypes().length - 1) ? '5em' : ''
                        }}>
                    <QuantityComponent onQtyChange={(subtype) => props.onSubtypeChange(subtype)}
                                        subtype={subtype}
                                        key={idx + '-div'} 
                                        height={props.show === 'cat2' ? '3em' : ''}
                                        borderBottom={props.show === 'cat2' ? true : false}
                                        qty={getSubtypeQty(subtype) }
                                        padding={props.show === 'cat2' ? true : false}/>
                    <PriceComponent onPriceChangeFromSubtypeList={(price, subtype) => props.onPriceChange(price, subtype)}
                                    prods={props.prods}
                                    subtype={subtype}
                                    price={props.price}
                                    show={props.show === 'cat2' ? true : false}
                                    prodName={props.prodName}
                                    size={props.size}
                                    priceInput={true}
                                    label="Valor Unitário"
                                    key="price-cpt"/>                       
                </div>
            )
        )
    } else { return null }
}

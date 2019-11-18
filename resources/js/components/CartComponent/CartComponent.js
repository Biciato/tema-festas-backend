import React from 'react'

const successDivStyle = {
    height: 'calc(100vh - 40px)',
    width: '100%',
    backgroundColor: '#32A1DD',
    color: 'white',
    textAlign: 'center',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '27px'
}

export default class CartComponent extends React.Component {
    constructor(props) {
        super(props)
        this.getTotalPricePerProduct = this.getTotalPricePerProduct.bind(this)
        this.getTotalQtyCat2 = this.getTotalQtyCat2.bind(this)
        this.getTotalPriceCat2 = this.getTotalPriceCat2.bind(this)
        this.getTotalQtyCat0 = this.getTotalQtyCat0.bind(this)
        this.getTotalPriceCat0 = this.getTotalPriceCat0.bind(this)
        this.handleFinishOrder = this.handleFinishOrder.bind(this)
        this.mountCat0List = this.mountCat0List.bind(this)
        this.mountCat1List = this.mountCat1List.bind(this)
        this.mountCat2List = this.mountCat2List.bind(this)
        this.mountCat3List = this.mountCat3List.bind(this)
        this.mountProdList = this.mountProdList.bind(this)
        this.state = {showSuccess: false}
    } 
    handleFinishOrder() {
        this.setState({showSuccess: true}, () => 
            setTimeout(() => this.setState({showSuccess: false}), 5000)
        )
    }
    getTotalQtyPerProduct(item) {
        if(item !== undefined) {
            return Object.keys(item).reduce((o, k) => parseInt(item[k]) + o, 0)
        } 
    }
    getTotalPricePerProduct(item, price) {
        console.log(price)
        return (this.getTotalQtyPerProduct(item) * parseFloat(price))
    }
    getTotalQtyCat2(item) {
        if(item !== undefined) {
            return Object.keys(item).reduce((o, k) => parseInt(item[k].quantidade) + o, 0)
        } 
    }
    getTotalPriceCat2(item) {
        if(item !== undefined) {
            return Object.keys(item).reduce((o, k) => 
                (parseInt(item[k].quantidade) * 
                    parseFloat(item[k].valor_unitario.replace(',','.'))) + o, 0
            )
        } 
    }
    getTotalQtyCat0(item) {
        if(item !== undefined) {
            return Object.keys(item).reduce((o, k) => 
                Object.keys(item[k]).reduce((old, key) => parseInt(item[k][key]) + old, 0) + o, 0
            )
        } 
    }
    getTotalPriceCat0(item, price) {
        return (this.getTotalQtyCat0(item) * parseFloat(price))
    }
    mountCat0List(item) {
        if(this.props.prods[item].tipo_categoria === 0) {
            return(
                Object.keys(this.props.prods[item].dados).map((i) =>
                    <div style={{marginTop: '1em'}}>
                        <div style={{padding: '0.1em', height: '2em', marginLeft: '0.8em'}}>
                            <span style={{fontSize: '16px',fontWeight: 'bold',padding: '0.4em'}}>
                                {item + ' ' + i}
                            </span>    
                            <span style={{
                                float: 'right',
                                border: '1px solid silver',                     
                                borderRadius: '5px',                  
                                padding: '0.4em',                    
                                color: 'darkgray',
                                marginRight: '1.5em'
                            }}>R$ {this.props.prods[item].dados[i].valor_unitario}</span>  
                        </div>
                        {Object.keys(this.props.prods[item].dados[i])
                            .filter((i) => i !== 'valor_unitario')
                            .map((el) =>
                                Object.keys(this.props.prods[item].dados[i][el]).map((e, idx) =>
                                    <div style={{
                                            padding: '0.7em 0.1em', 
                                            height: '4em',
                                            fontSize: '14px',
                                            backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8')}}>
                                        <span style={{
                                                fontWeight: 600,
                                                padding: '0.4em',
                                                marginLeft: '1em',
                                                display: 'inline-block',
                                                width: '56%',
                                            }}>{el + ' ' + e}</span>    
                                        <span style={{
                                            fontSize: '30px',
                                            display: 'inline-block',
                                            verticalAlign: 'sub',
                                            color: '#32338D',
                                            marginLeft: '5%'
                                        }}>-</span>
                                        <input style={{
                                                    border: 'none',
                                                    display: 'inline-block',
                                                    width: '20%',
                                                    backgroundColor: 'inherit',
                                                    textAlign: 'center'
                                                }}
                                                value={this.props.prods[item].dados[i][el][e]}/>
                                        <span style={{
                                            fontSize: '30px',
                                            display: 'inline-block',
                                            verticalAlign: 'sub',
                                            color: '#32338D',
                                            cursor: 'pointer',
                                            margin: 0,
                                            padding: 0
                                        }}>+</span>
                                    </div>
                                )
                                
                            )
                        }
                        <div style={{
                                padding: '0.1em', 
                                height: '2em',
                                margin: '0px 2em 0 1em',
                                borderBottom: '1px solid #D7D7D7',
                                fontSize: '14px'}}>
                            <span style={{fontWeight: 'bold',padding: '0.4em'}}>Quantidade: </span>
                            <span>{this.getTotalQtyPerProduct(this.props.prods[item].dados[i])}</span>    
                            <span style={{fontWeight: 'bold',padding: '0.4em'}}>
                                Total: R$ 
                            </span>  
                            <span style={{
                                float: 'right',
                                padding: '0.4em',                    
                                color: 'darkgray',
                                marginLeft: '1em'
                            }}>
                                {
                                    this.getTotalPricePerProduct(
                                        this.props.prods[item].dados[i], 
                                        this.props.prods[item].dados[i].valor_unitario)
                                }
                            </span> 
                        </div>
                    </div>
                )                   
            )
        } else {
            return this.mountCat1List(item)
        }
    }
    mountCat1List(item) {
        if(this.props.prods[item].tipo_categoria === 1) {
            return(
                Object.keys(this.props.prods[item].dados).map((i) =>
                    <div style={{marginTop: '1em'}}>
                        <div style={{padding: '0.1em', height: '2em', marginLeft: '0.8em'}}>
                            <span style={{fontSize: '16px',fontWeight: 'bold',padding: '0.4em'}}>
                                {item + ' ' + i}
                            </span>    
                            <span style={{
                                float: 'right',
                                border: '1px solid silver',                     
                                borderRadius: '5px',                  
                                padding: '0.4em',                    
                                color: 'darkgray',
                                marginRight: '1.5em'
                            }}>R$ {this.props.prods[item].dados[i].valor_unitario}</span>  
                        </div>                        
                        <div>
                            {Object.keys(this.props.prods[item].dados[i]).map((el, idx) =>
                                <div style={{
                                        padding: '0.7em 0.1em', 
                                        height: '4em',
                                        fontSize: '14px',
                                        backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8')}}>
                                    <span style={{
                                        fontWeight: 600,
                                        padding: '0.4em',
                                        marginLeft: '1em',
                                        width: '56%',
                                        display: 'inline-block'
                                    }}>{el}</span>    
                                    <span style={{
                                        fontSize: '30px',
                                        display: 'inline-block',
                                        verticalAlign: 'sub',
                                        color: '#32338D',
                                        marginLeft: '5%'
                                    }}>-</span>
                                    <input style={{
                                                border: 'none',
                                                display: 'inline-block',
                                                width: '20%',
                                                backgroundColor: 'inherit',
                                                textAlign: 'center'
                                            }}
                                            value={this.props.prods[item].dados[i][el]}/>
                                    <span style={{
                                        fontSize: '30px',
                                        display: 'inline-block',
                                        verticalAlign: 'sub',
                                        color: '#32338D',
                                        cursor: 'pointer',
                                        margin: 0,
                                        padding: 0
                                    }}>+</span>
                                </div>
                            )}
                        </div>
                        <div style={{
                                padding: '0.1em', 
                                height: '2em',
                                margin: '0px 2em 0 1em',
                                borderBottom: '1px solid #D7D7D7',
                                fontSize: '14px'}}>
                            <span style={{fontWeight: 'bold',padding: '0.4em'}}>Quantidade: </span>
                            <span>{this.getTotalQtyPerProduct(this.props.prods[item].dados[i])}</span>    
                            <span style={{fontWeight: 'bold',padding: '0.4em'}}>
                                Total: R$ 
                            </span>  
                            <span style={{
                                float: 'right',
                                padding: '0.4em',                    
                                color: 'darkgray',
                                marginLeft: '1em'
                            }}>
                                {
                                    this.getTotalPricePerProduct(
                                        this.props.prods[item].dados[i], 
                                        this.props.prods[item].dados[i].valor_unitario)
                                }
                            </span> 
                        </div>
                    </div>
                )                   
            )
        } else {
            return this.mountCat2List(item)
        }
    }
    mountCat2List(item) {
        if(this.props.prods[item].tipo_categoria === 2) {
            return(
                <div style={{marginTop: '1em'}}>
                    <div style={{padding: '0.1em', height: '2em', marginLeft: '0.8em'}}>
                        <span style={{fontSize: '16px',fontWeight: 'bold',padding: '0.4em'}}>
                            {item}
                        </span>    
                    </div>                    
                    {Object.keys(this.props.prods[item].dados).map((i, idx) =>
                        <div style={{
                            padding: '0 1em 1em 0', 
                            backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8')
                        }}>
                            <div style={{
                                    padding: '0.7em 0.1em', 
                                    height: '3em',
                                    fontSize: '14px',
                                }}>
                                <span style={{
                                    fontWeight: 600,
                                    padding: '0.4em',
                                    marginLeft: '1em',
                                    display: 'inline-block',
                                    width: '60%',
                                    borderBottom: '1px solid #D7D7D7'
                                }}>{i}</span>    
                                <span style={{
                                    fontSize: '30px',
                                    display: 'inline-block',
                                    verticalAlign: 'sub',
                                    color: '#32338D',
                                    marginLeft: '5%'
                                }}>-</span>
                                <input style={{
                                            border: 'none',
                                            display: 'inline-block',
                                            width: '20%',
                                            backgroundColor: 'inherit',
                                            textAlign: 'center'
                                        }}
                                        value={this.props.prods[item].dados[i].quantidade}/>
                                <span style={{
                                    fontSize: '30px',
                                    display: 'inline-block',
                                    verticalAlign: 'sub',
                                    color: '#32338D',
                                    cursor: 'pointer',
                                    margin: 0,
                                    padding: 0
                                }}>+</span>
                            </div>
                            <div style={{
                                        padding: '0.7em 0.1em', 
                                        height: '3em',
                                        fontSize: '14px',
                                        backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8')
                                    }}>
                                    <span style={{
                                        padding: '0.4em',
                                        marginLeft: '1em',
                                        display: 'inline-block',
                                        color: '#747474',
                                        fontWeight: 'normal'
                                    }}>Valor Unitário</span>    
                                    <input style={{
                                            float: 'right',
                                            border: '1px solid silver',                     
                                            borderRadius: '5px',                  
                                            padding: '0.4em',                    
                                            color: 'darkgray',
                                            marginRight: '1em',
                                            backgroundColor: 'inherit',
                                            width: '27%',
                                            textAlign: 'right'
                                        }}
                                        value={this.props.prods[item].dados[i].valor_unitario}/>
                                </div>
                        </div>
                    )}
                    <div style={{
                            padding: '0.1em', 
                            height: '2em',
                            margin: '0px 2em 0 1em',
                            borderBottom: '1px solid #D7D7D7',
                            fontSize: '14px'}}>
                        <span style={{fontWeight: 'bold',padding: '0.4em'}}>Quantidade: </span>
                        <span>{this.getTotalQtyPerProduct(this.props.prods[item].dados)}</span>    
                        <span style={{fontWeight: 'bold',padding: '0.4em'}}>
                            Total: R$ 
                        </span>  
                        <span style={{
                            float: 'right',
                            padding: '0.4em',                    
                            color: 'darkgray',
                            marginLeft: '1em'
                        }}>{this.getTotalPricePerProduct(this.props.prods[item].dados)}
                        </span> 
                    </div>
                </div>              
            )
        } else {
            return this.mountCat3List(item)
        }
    }
    mountCat3List(item) {
        return(
            <div style={{marginTop: '1em'}}>
                <div style={{padding: '0.1em', height: '2em', marginLeft: '0.8em'}}>
                    <span style={{fontSize: '16px',fontWeight: 'bold',padding: '0.4em'}}>{item}</span>    
                    <input style={{
                                float: 'right',
                                border: '1px solid silver',                     
                                borderRadius: '5px',                  
                                padding: '0.4em',                    
                                color: 'darkgray',
                                marginRight: '1.5em',
                            }}
                            value={this.props.prods[item].valor_unitario
                                    .toLocaleString('pt-br', {
                                        minimumFractionDigits: 2, 
                                        currency: 'BRL', 
                                        style: 'currency'
                                    })}/>  
                </div>
                {Object.keys(this.props.prods[item].dados).map((el, idx) =>
                    <div style={{
                            padding: '0.7em 0.1em', 
                            height: '4em',
                            fontSize: '14px',
                            backgroundColor: ((idx % 2) === 0 ? 'white' : '#F8F8F8')}}>
                        <span style={{
                                fontWeight: 600,
                                padding: '0.4em',
                                marginLeft: '1em',
                                display: 'inline-block',
                                width: '56%',
                            }}>{el}</span>    
                        <span style={{
                            fontSize: '30px',
                            display: 'inline-block',
                            verticalAlign: 'sub',
                            color: '#32338D',
                            marginLeft: '5%'
                        }}>-</span>
                        <input style={{
                                    border: 'none',
                                    display: 'inline-block',
                                    width: '20%',
                                    backgroundColor: 'inherit',
                                    textAlign: 'center'
                                }}
                                value={this.props.prods[item].dados[el]}/>
                        <span style={{
                            fontSize: '30px',
                            display: 'inline-block',
                            verticalAlign: 'sub',
                            color: '#32338D',
                            cursor: 'pointer',
                            margin: 0,
                            padding: 0
                        }}>+</span> 
                    </div>
                )}
                <div style={{
                        padding: '0.1em', 
                        height: '2em',
                        margin: '0 2em 0 1em',
                        borderBottom: '1px solid #D7D7D7',
                        fontSize: '14px'}}>
                    <span style={{fontWeight: 'bold',padding: '0.4em'}}>Quantidade: </span>
                    <span>{this.getTotalQtyPerProduct(this.props.prods[item].dados)}</span>    
                    <span style={{fontWeight: 'bold',padding: '0.4em'}}>
                        Total: R$ 
                    </span>  
                    <span style={{
                        float: 'right',
                        padding: '0.4em',                    
                        color: 'darkgray',
                        marginLeft: '1em'
                    }}>
                        {
                            this.getTotalPricePerProduct(
                                this.props.prods[item].dados, 
                                this.props.prods[item].valor_unitario).toLocaleString('pt-br', {minimumFractionDigits: 2})
                        }
                    </span> 
                </div>
            </div>
        )
    }
    mountProdList() {
        return Object.keys(this.props.prods).map((item) => 
            this.mountCat0List(item)
        )
    }
    render() {
        return(       
            <div style={{padding: 0, margin: 0}}>    
                <div style={{
                        ...successDivStyle,
                        display: this.state.showSuccess ? 'block' : 'none'}}>
                    <img src="/images/checked.svg" 
                                alt="user"
                                style={{
                                    width: '15%',
                                    margin: '5em auto 1em 0'
                                }}></img>
                    <p style={{width: '65%', margin: 'auto'}}>Pedido Realizado com sucesso!</p>
                </div>
                <div style={{
                        display: this.state.showSuccess ? 'none' : 'flex',
                        flexDirection: 'column'
                    }}> 
                    <h5 className="text-left mt-3" 
                        key="1" 
                        style={{padding: '0 0.5em'}}>
                            <img src="/images/shopping-bag.svg" 
                                alt="user"
                                style={{
                                    width: '5%',
                                    margin: '0 0.3em'
                                }}></img>
                            Seus itens
                    </h5>    
                    <h6 className="text-left ml-3 px-1" 
                        key="2" 
                        style={{padding: '0 0.5em',fontSize: '14px'}}>
                            Nº do pedido 8824
                        </h6> 
                    {this.mountProdList()}
                    <div style={{
                        padding: '0.1em', 
                        height: '2em', 
                        color: '#32338D', 
                        fontWeight: 'bold',
                        margin: '0px 2em 0 1em'}}>
                        <span>Quantidade:</span>    
                        <span style={{float: 'right'}}>{this.props.totalQty}</span>  
                    </div>
                    <div style={{
                        padding: '0.1em', 
                        height: '2em', 
                        color: '#32338D', 
                        fontWeight: 'bold',
                        margin: '0px 2em 0 1em'}}>
                        <span>Valor:</span>    
                        <span style={{float: 'right'}}>R$ {this.props.totalPrice}</span>  
                    </div>
                </div>
                <div className="footer" 
                        style={{
                            backgroundColor: this.state.showSuccess ? 'white' : '#32338D',
                            color: this.state.showSuccess ? '#32A1DD' : 'white'
                        }}
                        onClick={this.handleFinishOrder}>
                    {this.state.showSuccess ? 'Novo Pedido' : 'Finalizar a Compra'}
                </div>
            </div>
        )
    }
}
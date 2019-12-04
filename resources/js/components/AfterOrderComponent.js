import React from 'react'
import { Link } from 'react-router-dom'
import './AfterOrderComponent.css'

const successDivStyle = {
    height: "calc(100vh - 40px)",
    width: "100%",
    color: "white",
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "20px",
    lineHeight: "27px"
};

export default class AfterOrderComponent extends React.Component {
    constructor(props) {
        super(props)
        this.handleBackClick = this.handleBackClick.bind(this)
    }
    handleBackClick() {
        this.props.onBackClick()
    }
    render() {
        if (!this.props.show) {
            return null
        }
        return(
            <div style={{
                    ...successDivStyle, 
                    backgroundColor: this.props.cdt === 'ok' 
                        ? "#32A1DD"
                        : "#E33333"
                }}>
                <img
                    src={ this.props.cdt === 'ok' 
                            ? '/images/checked.svg'
                            : '/images/error.svg'
                        }
                    alt="user"
                    style={{
                        width: "15%",
                        margin: "5em auto 1em 0"
                    }}
                    key="cart-div1-img"
                ></img>{" "}
                <p
                    style={{
                        width: "65%",
                        margin: "auto",
                        display: this.props.cdt === 'ok' ? '' : 'none'
                    }}
                    key="cart-div1-p"
                >
                    Pedido Realizado com Sucesso!<br></br>
                    Número do Pedido: <span style={{fontStyle: 'normal'}}>{this.props.orderNumber}</span>
                </p>{" "}
                <p
                    style={{
                        width: "65%",
                        margin: "auto",
                        display: this.props.cdt === 'ok' ? 'none' : ''
                    }}
                    key="cart-div1-p-err"
                >
                    Ops, algo deu errado. Por favor, tente mais tarde
                            ou contate o suporte!
                </p>{" "}
                <p style={{display: this.props.cdt === 'ok' ? 'none' : ''}}>
                    Deseja Voltar ? <br></br><br></br><br></br>
                        <span onClick={this.handleBackClick} 
                                style={{
                                    cursor: 'pointer',
                                    color: 'red',                            
                                    backgroundColor: 'white',
                                    padding: '0.5em 1em',
                                    top: '0em'
                                }}>Voltar</span>
                </p>
                <a
                    className="footer-after text-center"
                    href="/clientes"
                    key="cart-div-3"
                    style={{
                        color: '#32A1DD',
                        backgroundColor: 'white'
                    }}
                >
                    {" "}
                    Novo Pedido
                </a>{" "}
            </div>
        )
    }
}
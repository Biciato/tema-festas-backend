import React from 'react'
import { Link } from 'react-router-dom'

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
                        margin: "auto"
                    }}
                    key="cart-div1-p"
                >
                    {this.props.cdt === 'ok' 
                        ? 'Pedido Realizado com sucesso!'
                        : `Ops, algo deu errado. Por favor, tente mais tarde
                            ou contate o suporte!`
                    }
                </p>{" "}
                <Link
                    className="footer text-center"
                    to="/clientes"
                    key="cart-div-3"
                    style={{
                        color: '#32A1DD',
                        backgroundColor: 'white'
                    }}
                >
                    {" "}
                    Novo Pedido
                </Link>{" "}
            </div>
        )
    }
}
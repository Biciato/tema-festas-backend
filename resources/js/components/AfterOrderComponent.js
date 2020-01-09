import React from 'react'
import './AfterOrderComponent.css'

export const AfterOrderComponent = (props) => {
    const handleBackClick = () => props.onBackClick() 
    return props.show && (
        <div style={{ 
                height: "calc(100vh - 40px)",
                width: "100%",
                color: "white",
                textAlign: "center",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "20px",
                lineHeight: "27px", 
                backgroundColor: props.cdt === 'ok' 
                    ? "#32A1DD"
                    : "#E33333"
            }}>
            <img src={ props.cdt === 'ok' ? '/images/checked.svg' : '/images/error.svg' }
                    alt="user"
                    style={{ width: "15%", margin: "5em auto 1em 0" }}
                    key="cart-div1-img" />
            <p style={{ width: "65%", margin: "auto", display: props.cdt === 'ok' ? '' : 'none' }}
                key="cart-div1-p">
                Pedido Realizado com Sucesso!<br></br>
                Número do Pedido: <span style={{fontStyle: 'normal'}}>{props.orderNumber}</span>
            </p>
            <p style={{ width: "65%", margin: "auto", display: props.cdt === 'ok' ? 'none' : '' }}
                key="cart-div1-p-err">
                Ops, algo deu errado. Por favor, tente mais tarde
                        ou contate o suporte!
            </p>
            <p style={{display: props.cdt === 'ok' ? 'none' : ''}}>
                Deseja Voltar ? <br></br><br></br><br></br>
                    <span onClick={handleBackClick} 
                            style={{
                                cursor: 'pointer',
                                color: 'red',                            
                                backgroundColor: 'white',
                                padding: '0.5em 1em',
                                top: '0em'
                            }}>Voltar</span>
            </p>
            <a className="footer-after text-center"
                href="/clientes"
                key="cart-div-3"
                style={{ color: '#32A1DD', backgroundColor: 'white' }}>
                Novo Pedido
            </a>
        </div>
    )
}
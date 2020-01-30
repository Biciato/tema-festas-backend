import React from 'react'
import './AfterOrderComponent.scss'
import axios from 'axios'

export const AfterOrderComponent = props => {
    const handleNewOrderClick = () => axios.get('/clean-session-client-prods').then(() =>
        window.location.assign('/clientes')
    )
    return (props.show && (
        <div style={{ backgroundColor: props.cdt === 'ok' ? "#32A1DD" : "#E33333" }} id="aoc">
            <img src={ props.cdt === 'ok' ? '/images/checked.svg' : '/images/error.svg' }
                    alt="user"
                    key="cart-div1-img" />
            <p style={{ display: props.cdt === 'ok' ? '' : 'none' }} key="cart-div1-p">
                Pedido Realizado com Sucesso!<br></br>
                Número do Pedido: <span style={{fontStyle: 'normal'}}>{props.orderNumber}</span>
            </p>
            <p style={{ display: props.cdt === 'ok' ? 'none' : '' }} key="cart-div1-p-err">
                Ops, algo deu errado. Por favor, tente mais tarde
                        ou contate o suporte!
            </p>
            <p style={{display: props.cdt === 'ok' ? 'none' : ''}}>
                Deseja Voltar ? <br></br><br></br><br></br>
                    <span onClick={() => window.history.back()} id="back-span">Voltar</span>
            </p>
            <a className="footer-after" key="cart-div-3" onClick={handleNewOrderClick}>
                Novo Pedido
            </a>
        </div>
    )) || null
}

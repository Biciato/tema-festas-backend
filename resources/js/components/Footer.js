import React from 'react'
import './Footer.scss'

export const Footer = props =>
    <div onClick={() => props.onMakeOrderClick()} className={`footer footer-${props.class}`}>
        Fazer Pedido
    </div>


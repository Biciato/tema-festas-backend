import React from 'react'
import './HeaderComponent.scss'

export const HeaderComponent = props =>
    <h5 id="header-cpt"><img src={`/images/${props.src}`} alt="user"/>{props.title}</h5>

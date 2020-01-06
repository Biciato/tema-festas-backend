import React from 'react'

export default function Footer(props) {
    const handleClick = () => {
        props.onMakeOrderClick()
    }
    return (
        <div onClick={handleClick}
                className="footer"
                key={3}>
                Fazer Pedido
        </div>
    )
}
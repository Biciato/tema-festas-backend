import React from 'react'

export default function HeaderComponent(props) {
    return (
        <h5 className="text-left mt-3" key={1}>
            <img
                src={`/images/${props.src}`}
                alt="user"
                style={{
                    width: "8%",
                    margin: "0.2em 0.5em 0.4em 0"
                }}
            ></img>
            {props.title}
        </h5>
    )
}
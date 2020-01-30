import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./NewComponent.scss";

export const NewProductComponent = props => {
    const [show, toggleModal] = useState(false);
    const closeModal = () => toggleModal(false);
    const newOrder = () =>
        axios .get("/clean-session-client-prods")
                .then(() => window.location.assign("/clientes"));
    const showModal = () => toggleModal(true);
    return (
        <div className="new-cp">
            <img src="/images/arrow.svg"
                    key="img1"
                    alt="star"
                    style={{ display: props.arrow && "inline" }}
                    onClick={() => window.history.back()}/>
            <span key="span" onClick={showModal}>
                iniciar novo pedido
            </span>
            <img src="/images/star.svg" key="img2" alt="star" />
            <div onClick={e => e.stopPropagation()} id="modal">
                <Modal key="modal" show={show} centered>
                    <Modal.Header key="mh" style={{ border: "none" }}>
                        <Modal.Title style={{width:"100%",textAlign:"center"}}>
                            <img src="/images/warning.svg"
                                    alt="warning"
                                    id="img-modal"/>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body key="mb" style={{ padding: 0 }}>
                        <p key="mbp1">
                            Você deseja realmente iniciar um novo pedido?
                        </p>
                        <p key="mbp2">
                            Isso irá limpar todos os campos preenchidos!
                        </p>
                    </Modal.Body>
                    <Modal.Footer key="mf" style={{ border: "none" }}>
                        <Button onClick={newOrder} key="mfb1">Sim</Button>
                        <Button onClick={closeModal} key="mfb2">Não</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

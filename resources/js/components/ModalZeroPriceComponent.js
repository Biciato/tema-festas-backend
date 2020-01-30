import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export const ModalZeroComponent = props => (
    <Modal show={props.show} centered>
        <Modal.Header bsPrefix="modal-header justify-content-center">
            <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="text-center">
                {props.type} não pode ser {props.value}.
            </p>
        </Modal.Body>
        <Modal.Footer bsPrefix="modal-footer justify-content-center">
            <Button variant="primary" onClick={() => props.onCloseModal()}>
                Fechar
            </Button>
        </Modal.Footer>
    </Modal>
);

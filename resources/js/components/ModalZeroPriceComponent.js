import React from "react"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export const ModalZeroPriceComponent = (props) => {
    return (
        <Modal show={this.state.zeroPrice} onHide={this.closeModal} centered>
            <Modal.Header bsPrefix="modal-header justify-content-center">
                <Modal.Title>Aviso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-center">Valor não pode ser "R$ 0,00".</p>
            </Modal.Body>
            <Modal.Footer bsPrefix="modal-footer justify-content-center">
                <Button variant="primary" onClick={this.closeModal}>Fechar</Button>
            </Modal.Footer>
        </Modal>
    )
}

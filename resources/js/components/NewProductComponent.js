import React from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './NewComponent.css'

export default class NewProductComponent extends React.Component {
    constructor(props) {
        super(props)
        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)
        this.state = {
            showModal: false,
        }
    }
    closeModal() {
        this.setState({ showModal: false })
    }
    goBack() {
        window.history.back()
    }
    newOrder() {
        axios.get('/clean-session-client-prods').then(() =>
            window.location.assign('/clientes')
        )
    }
    showModal() {
        this.setState({ showModal: true })
    }
    render() {
        return(
            <div className="new-cp">
                <img src="/images/arrow.svg"
                        key="img1"
                        alt="star"
                        style={{
                            width: "4%",
                            margin: "0.2em 0.4em 0.4em 0.3em",
                            float: 'left',
                            display: this.props.arrow ? 'inline' : 'none'
                        }}
                        onClick={this.goBack}>
                </img>
                <span key="span" onClick={this.showModal}>iniciar novo pedido</span>
                <img src="/images/star.svg"
                        key="img2"
                        alt="star"
                        style={{
                            width: "4%",
                            margin: "0.2em 0.4em 0.4em 0.3em"
                        }}>
                </img>
                <div onClick={e => e.stopPropagation()}>
                    <Modal key="modal"
                            show={this.state.showModal}
                            style={{
                                width: "90%",
                                top: "10%",
                                left: "5%"
                            }}>
                        <Modal.Header key="mh" style={{border: 'none'}}>
                            <Modal.Title    style={{
                                                width: "100%",
                                                textAlign: "center"
                                            }}>
                                <img src="/images/warning.svg"
                                        alt="warning"
                                        style={{
                                            width: "15%",
                                            margin: "0.2em",
                                            paddingBottom: "0.2em"
                                        }}>
                                </img>
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body key="mb" style={{ padding: 0}}>
                            <p key="mbp1"
                                style={{
                                    textAlign: "center",
                                    width: "60%",
                                    margin: "0.5em auto"
                                }}>
                                Você deseja realmente iniciar um novo pedido?
                            </p>
                            <p key="mbp2"
                                style={{
                                    textAlign: "center",
                                    fontSize: "12px"
                                }}>
                                Isso irá limpar todos os campos preenchidos!
                            </p>
                        </Modal.Body>

                        <Modal.Footer key="mf" style={{ border: "none" }}>
                            <Button onClick={this.newOrder}
                                    key="mfb1"
                                    style={{
                                        borderRadius: "5px",
                                        backgroundColor: "#328D3B",
                                        color: "white",
                                        border: "none",
                                        width: "100%",
                                        padding: "0.5em",
                                        fontStyle: "normal",
                                        fontWeight: "bold",
                                        fontSize: "20px",
                                        lineHeight: "27px"
                                    }}>
                                        Sim
                            </Button>
                            <Button onClick={this.closeModal}
                                    key="mfb2"
                                    style={{
                                        borderRadius: "5px",
                                        backgroundColor: "#E33333",
                                        color: "white",
                                        border: "none",
                                        width: "100%",
                                        padding: "0.5em",
                                        fontStyle: "normal",
                                        fontWeight: "bold",
                                        fontSize: "20px",
                                        lineHeight: "27px"
                                    }}>
                                        Não
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

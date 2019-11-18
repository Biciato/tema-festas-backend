import React from 'react'
// import axios from 'axios'
import './Login.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid #D7D7D7',
    width: '100%',
    padding: '0.5em',
    WebkitBorderRadius: 5,
        MozBorderRadius: 5,
            borderRadius: 5
}

const btnStyle = {
    fontStyle: 'normal' ,
    fontWeight: 'bold' ,
    fontSize: '20px' ,
    lineHeight: '27px' ,
    textAlign: 'center',
    backgroundColor: '#32338D',
    color: 'white',
    border: 'none',
    width: '100%',
    padding: '0.5em',
    marginTop: '1em' ,
    WebkitBordeRadius: '5px' ,
     MozBorderRadius: '5px' ,
          borderRadius: '5px'
}

export default class Login extends React.Component { 
    constructor(props) {
        super(props)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            email: '',
            password: ''
        }
    }
    handleEmailChange(event) {
        this.setState(Object.assign({}, this.state, {
            email: event.target.value
        }))
    }
    handlePasswordChange(event) {
        this.setState(Object.assign({}, this.state, {
            password: event.target.value
        }))
    }
    handleSubmit() {
        window.history.pushState(null, null, '/home')
        this.props.onLoginChange()
    }
    render() {
        return(
            <Row bsPrefix="row h-100" style={{backgroundColor: '#32A1DD'}}>
                <Col bsPrefix="col mt-5 text-center justify-content-center">
                    <img src="/images/logo.png" alt="logo" style={{width: '40%'}}></img>
                    <h5 className="text-light">
                        <img src="/images/user.svg" 
                                alt="user"
                                style={{
                                    width: '5%',
                                    margin: '0.2em'
                                }}>                            
                        </img>
                        Login
                    </h5>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="loginUser">
                            <Form.Control 
                                type="email" 
                                placeholder="Usuário" 
                                style={inputStyle}
                                onChange={this.handleEmailChange}/>
                        </Form.Group>    
                        <Form.Group controlId="loginPass">
                            <Form.Control 
                                type="password" 
                                placeholder="Senha"  
                                style={inputStyle}
                                onChange={this.handlePasswordChange}/>
                        </Form.Group>
                        <Button style={btnStyle} type="submit">
                            Entrar
                        </Button>
                    </Form>
                </Col>
            </Row>
        ) 
    }
}
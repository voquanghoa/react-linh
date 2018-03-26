import React, { Component } from 'react';
import {
    Form,
    Col,
    FormGroup,
    Button,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import './auth.css';
import Validator from './../../components/Validation/Validator';
import ValidCase from './../../components/Validation/ValidCase';
import { commonFunctions } from './../../utils/commonFunctions';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            valid: {},
            isSubmited: false,
            isErrorLogin: false,
        }
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.validatorCallBack = this.validatorCallBack.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleFirstNameChange(e) {
        this.setState({
            firstName: e.target.value
        })
    }

    handleLastNameChange(e) {
        this.setState({
            lastName: e.target.value
        })
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value,
        })
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value,
        })
    }

    /*
    ** Name: validatorCallBack
    ** Description: The idea is create the object to save valid object. And when submit is triggered, we check this object to show error message or pass.
    ** Reference: Component(Validator, Validation)
    ** Parameters: String(id), Boolean(isValid), String(message)
    ** Return: Object(valid)
    */
    validatorCallBack(id, isValid, message) {
        if(this.state.valid[id] !== isValid) {
            var validObject = this.state.valid;
            validObject[id] = isValid;
            this.setState({
                valid: validObject
            })
        }
    }

    handleRegister(e) {
        e.preventDefault();
        this.setState({ 
            isSubmited: true,
            isErrorLogin: false,
            errorMessage: "",
        });

        if(!commonFunctions.isValidForm(this.state.valid)) {
            return;
        }

        let options = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
        }
        
        this.props.userActions.registerUser(options).then(response => {
            if(response.status === "error" || !_.isEmpty(response.errors)) {
                let errorList = Object.keys(response.errors);
                if(errorList.length > 0) {
                    let errorMessage = "";
                    errorMessage = errorList[0] + " " + response.errors[errorList[0]][0];
                    this.setState({
                        isErrorLogin: true,
                        errorMessage
                    })
                }
            } else if(response.status === "success" || response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                this.props.history.push('/');
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return(
            <div className="login-container">
                <Form horizontal onSubmit={this.handleRegister}>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            First Name
                        </Col>
                        <Col sm={9}>
                            <FormControl 
                                type="text" 
                                placeholder="First Name"
                                value={this.state.firstName}
                                onChange={this.handleFirstNameChange}
                                disabled={true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            Last Name
                        </Col>
                        <Col sm={9}>
                            <FormControl 
                                type="text" 
                                placeholder="Last Name"
                                value={this.state.lastName}
                                onChange={this.handleLastNameChange}
                                disabled={true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            Email <span className="required">*</span>
                        </Col>
                        <Col sm={9}>
                            <FormControl 
                                type="text" 
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                            />
                            <Validator id="email" callBack={this.validatorCallBack} enabled={true}>
                                <ValidCase 
                                    hide={!this.state.isSubmited}
                                    valid={!_.isEmpty(this.state.email)}
                                    message="Please enter email"
                                />
                                <ValidCase 
                                    hide={!this.state.isSubmited}
                                    valid={commonFunctions.isEmail(this.state.email)}
                                    message={"Wrong email format"}
                                />
                            </Validator>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            Password <span className="required">*</span>
                        </Col>
                        <Col sm={9}>
                            <FormControl 
                                type="password" 
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                            />
                            <Validator id="password" callBack={this.validatorCallBack} enabled={true}>
                                <ValidCase 
                                    hide={!this.state.isSubmited}
                                    valid={!_.isEmpty(this.state.password)}
                                    message="Please enter password"
                                />
                                <ValidCase 
                                    hide={!this.state.isSubmited}
                                    valid={this.state.password.length > 7}
                                    message={"Password should be more than 8 characters"}
                                />
                            </Validator>
                        </Col>
                    </FormGroup>

                    { 
                        this.state.isErrorLogin && 
                            <FormGroup>
                                <Col smOffset={3} sm={9} className="error">
                                    {this.state.errorMessage}
                                </Col>
                            </FormGroup>
                    }
                    <FormGroup>
                        <Col smOffset={3} sm={9}>
                            <Button type="submit">Register</Button>
                            <Button bsStyle="link" onClick={() => {this.props.history.push("/login")}}>Login</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
	return {
		userActions: bindActionCreators(userActions, dispatch),
	}
}

export default connect(null, mapDispatchToProps)(Register);
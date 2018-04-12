import React, { Component } from 'react';
import {
    Form,
    Col,
    FormGroup,
    Button,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import {
    Route, 
    NavLink, 
    Switch,
} from 'react-router-dom';
import './auth.css';
import Validator from './../../components/Validation/Validator';
import ValidCase from './../../components/Validation/ValidCase';
import { commonFunctions } from './../../utils/commonFunctions';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';
import Register from './Register';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            valid: {},
            isSubmited: false,
            isErrorLogin: false,
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.validatorCallBack = this.validatorCallBack.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value,
            isErrorLogin: false,
        })
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value,
            isErrorLogin: false,
        })
    }

    validatorCallBack(id, isValid, message) {
        if(this.state.valid[id] !== isValid) {
            var validObject = this.state.valid;
            validObject[id] = isValid;
            this.setState({
                valid: validObject
            })
        }
    }

    handleLogin(e) {
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
            email: this.state.email,
            password: this.state.password,
        }
        this.props.userActions.loginUser(options).then(response => {
            if(response.errors) {
                this.setState({
                    isErrorLogin: true,
                    errorMessage: response.errors[0]
                })
            } else {
                localStorage.setItem('user', JSON.stringify(response.data));
                this.props.history.push('/books');
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return(
            <div className="login-container">
                <Form horizontal onSubmit={this.handleLogin}>
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
                            <Button type="submit">Sign in</Button>
                            <NavLink exact to="/register" activeClassName="selected" className="register-button">
                                Register
                            </NavLink>
                            
                        </Col>
                    </FormGroup>
                </Form>
                <Switch>
                    <Route path="/register" component={Register}/>
                </Switch>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
	return {
		userActions: bindActionCreators(userActions, dispatch),
	}
}

export default connect(null, mapDispatchToProps)(Login);
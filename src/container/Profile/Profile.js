import React, { Component } from 'react';
import {
    Form,
    Col,
    FormGroup,
    Button,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import './profile.css';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../../actions/userActions';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            isErrorLogin: false,
            errorMessage: "",
        }
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    componentWillMount() {
        let user = localStorage.getItem('user');
        if(user) {
            user = JSON.parse(user);
            this.setState({
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
            })
        }
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

    handleLogOut() {
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        this.props.history.push('/login');
    }

    handleUpdateProfile(e) {
        e.preventDefault();
        this.setState({ 
            isErrorLogin: false,
            errorMessage: "",
        });

        let options = {
            user: {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
            }
        }
        
        this.props.userActions.updateProfile(options).then(response => {
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
                <Form horizontal onSubmit={this.handleUpdateProfile}>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            First Name
                        </Col>
                        <Col sm={9}>
                            <FormControl 
                                type="text" 
                                placeholder="First Name"
                                value={this.state.firstName ? this.state.firstName : ""}
                                onChange={this.handleFirstNameChange}
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
                                value={this.state.lastName ? this.state.lastName : ""}
                                onChange={this.handleLastNameChange}
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
                                disabled={true}
                            />
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
                            <Button type="submit">Save</Button>
                            <Button bsStyle="link" onClick={this.handleLogOut}>Logout</Button>
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

export default connect(null, mapDispatchToProps)(Profile);
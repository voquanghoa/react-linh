import React, { Component, Fragment } from 'react';
import {
  Route, 
  NavLink, 
  Switch,
} from 'react-router-dom';
import {
    Popover,
    Button,
    OverlayTrigger
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BookList from './Book/BookList';
import Profile from './Profile/Profile';
import './app.css';
import * as userActions from './../actions/userActions';
import _ from 'lodash';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.viewProfile = this.viewProfile.bind(this);
    }

    componentDidMount() {
        //Not normal thing to do here
        //Because getUserProfile get user from localstorage, not api
        if(!this.props.user || _.isEmpty(this.props.user)) {
            let user = localStorage.getItem('user');
            if(!user) {
                this.props.userActions.logOut();
                this.props.history.push('/login');
            }
            this.props.userActions.getUserProfile();
        }
    }

    handleLogout() {
        //Right now, Do something simple
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        this.props.history.push('/login');
    }

    viewProfile() {
        this.props.history.push('/profile');
    }

    render() {
        const popoverClickRootClose = (
            <Popover id="popover-trigger-click-root-close">
                <div>
                    <Button 
                        bsStyle="link" 
                        onClick={this.viewProfile}
                    >
                        View
                    </Button>
                </div>
                <div>
                    <Button bsStyle="link" onClick={this.handleLogout}>Logout</Button>
                </div>
            </Popover>
        );

        const { user } = this.props;
        return(
            <Fragment>
                <div className="navbar navbar-default" style={{marginBottom: '0px'}}>
                    <div className="header">
                        <div className="navbar-header pull-left">
                            <ul className="nav navbar-nav">
                                <li>
                                    <NavLink exact to="/" activeClassName="selected">
                                        Books
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="navbar-header pull-right">
                            <ul className="nav navbar-nav">
                                <li>
                                    <OverlayTrigger
                                        trigger="click"
                                        rootClose
                                        placement="bottom"
                                        overlay={popoverClickRootClose}
                                    >
                                        <div className="profile">
                                            <i className="fas fa-user-circle avatar-icon"></i>
                                            { user && ((!user.first_name && !user.last_name) || (_.isEmpty(user.first_name) && _.isEmpty(user.last_name))) ?
                                                <span>Anonymous</span>:
                                                <span>{user && user.first_name ? user.first_name: ""} {user && user.last_name ? user.last_name: ""}</span>
                                            }
                                        </div>
                                    </OverlayTrigger>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <Switch>
                        <Route exact path="/" component={BookList}/>
                        <Route path="/profile" component={Profile}/>
                        <Route path="*" component={BookList}/>
                    </Switch>
                </div>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
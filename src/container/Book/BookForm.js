import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Modal,
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Validator from './../../components/Validation/Validator';
import ValidCase from './../../components/Validation/ValidCase';
import _ from 'lodash';
import './BookForm.css';
import { commonFunctions } from './../../utils/commonFunctions';
import * as bookActions from './../../actions/bookActions';
import {
    NotificationContainer,
    NotificationManager
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export const Actions = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    VIEW: 'VIEW',
}

class BookForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmited: false,
            id: "",
            title: "",
            author: "",
            description: "",
            valid: {},
            action: "",
        };
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.validatorCallBack = this.validatorCallBack.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isShow) {
            if(nextProps.book) {
                //Always get book detail before editing or viewing
                this.props.bookActions.getBookDetail(nextProps.book.id).then(response => {
                    if(response.errors) {
                        NotificationManager.error(response.errors[0], 'Errors');
                    } else {
                        this.setState({
                            id: response.id,
                            title: response.title,
                            author: response.author,
                            description: response.description,
                            action: this.props.action,
                        })
                    }
                })
            } else {
                this.setState({
                    id: "",
                    title: "",
                    author: "",
                    description: "",
                    action: Actions.ADD,
                })
            }
        }
    }

    handleTitleChange(e) {
        this.setState({
            title: e.target.value
        })
    }

    handleAuthorChange(e) {
        this.setState({
            author: e.target.value
        })
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value
        })
    }

    handleHide(e) {
        if(this.props.closeCallBack) {
            this.props.closeCallBack();
        }
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

    handleClose(e) {
        this.setState({
            isSubmited: false,
        })
        if(this.props.closeCallBack) {
            this.props.closeCallBack();
        }
    }

    handleEdit() {
        this.setState({
            action: Actions.EDIT,
        })
    }

    handleSave() {
        this.setState({ 
            isSubmited: true,
            isErrorLogin: false,
            errorMessage: "",
        });

        //Right here, we check valid object
        //Take a look Validation and Validator
        if(!commonFunctions.isValidForm(this.state.valid)) {
            return;
        }

        let options = {
            id: this.state.id,
            title: this.state.title,
            author: this.state.author,
            description: this.state.description,
        }

        if(this.props.saveCallBack) {
            this.props.saveCallBack(this.state.action, options);
            this.setState({
                isSubmited: false,
            })
        }
    }

    render() {
        const { 
            isShow,
        } = this.props;
        return(
            <React.Fragment>
                <Modal
                    show={isShow}
                    onHide={this.handleHide}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            { this.state.action === Actions.ADD &&
                                <p>Add New Book</p>
                            }
                            { this.state.action  === Actions.EDIT &&
                                <p>Edit Book</p>
                            }
                            { this.state.action  === Actions.VIEW && 
                                <p>Book Detail</p>
                            }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>
                                Title <span className="required">*</span>
                            </ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="title"
                                    value={this.state.title}
                                    onChange={this.handleTitleChange}
                                    disabled={this.state.action === Actions.VIEW}
                                />
                                <Validator id="title" callBack={this.validatorCallBack} enabled={true}>
                                    <ValidCase 
                                        hide={!this.state.isSubmited}
                                        valid={!_.isEmpty(this.state.title)}
                                        message="Please enter title"
                                    />
                                </Validator>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>
                                Author <span className="required">*</span>
                            </ControlLabel>
                            <FormControl 
                                type="text" 
                                placeholder="Author"
                                value={this.state.author}
                                onChange={this.handleAuthorChange}
                                disabled={this.state.action === Actions.VIEW}
                            />
                            <Validator id="author" callBack={this.validatorCallBack} enabled={true}>
                                <ValidCase 
                                    hide={!this.state.isSubmited}
                                    valid={!_.isEmpty(this.state.author)}
                                    message="Please enter author"
                                />
                            </Validator>
                        </FormGroup>
                        <FormGroup >
                            <ControlLabel>
                                Textarea <span className="required">*</span>
                            </ControlLabel>
                            
                            <FormControl 
                                componentClass="textarea" 
                                placeholder="Description" 
                                value={this.state.description}
                                onChange={this.handleDescriptionChange}
                                disabled={this.state.action === Actions.VIEW}
                            />
                            <Validator id="description" callBack={this.validatorCallBack} enabled={true}>
                                <ValidCase 
                                    hide={!this.state.isSubmited}
                                    valid={!_.isEmpty(this.state.description)}
                                    message="Please enter description"
                                />
                            </Validator>
                        </FormGroup>
                        { 
                            !_.isEmpty(this.props.errorMessage) && 
                                <FormGroup>
                                    <ControlLabel className="error">
                                        {this.props.errorMessage}
                                    </ControlLabel>
                                </FormGroup>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        { this.state.action  === Actions.VIEW &&
                            <Button onClick={this.handleEdit}>Edit</Button>
                        }
                        { (this.state.action  === Actions.EDIT || this.state.action  === Actions.ADD) && 
                            <Button onClick={this.handleSave}>Save</Button>
                        }
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <NotificationContainer />
            </React.Fragment>
        )
    }
}

BookForm.propTypes = {
    //show or hide Modal
    isShow: PropTypes.bool,
    //when hit close it call function from father to notice close modal
    closeCallBack: PropTypes.func,
    //after passing when submit, call function from father to call Api
    saveCallBack: PropTypes.func,
    //devide ADD, EDIT, VIEW
    action: PropTypes.string,
    //selected book(EDIT, VIEW), null(ADD)
    book: PropTypes.shape({
        id: PropTypes.number,
        author: PropTypes.string,
        description: PropTypes.string,
        title: PropTypes.string,
    }),
}

BookForm.defaultProps = {
    isShow: false,
    action: Actions.VIEW,
    book: null,
}

function mapDispatchToProps(dispatch) {
    return {
        bookActions: bindActionCreators(bookActions, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(BookForm);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    PageHeader,
    Button,
    Table,
    Modal
} from 'react-bootstrap';
import {
    NotificationContainer,
    NotificationManager
} from 'react-notifications';    
import * as bookActions from './../../actions/bookActions';
import './bookList.css';
import BookForm, { Actions } from './BookForm';
import _ from 'lodash';

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            selectedBook: null,
            action: "",
            errorMessage: "",
            isShowConfirm: false,
        };
        this.handleCloseForm = this.handleCloseForm.bind(this);
        this.handleSaveForm = this.handleSaveForm.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    componentDidMount() {
        let user = localStorage.getItem('user');
        if(user) {
            this.loadBookList();
        }
    }

    handleAction(e, book, action) {
        e.stopPropagation();
        this.setState({
            isShow: true,
            action,
            selectedBook: book,
            errorMessage: "",
        })
    }

    handleCloseForm() {
        this.setState({ 
            isShow: false 
        });
    }

    //Handle when submit form
    handleSaveForm(action, book) {
        switch (action) {
            case Actions.ADD: {
                this.props.bookActions.addBook(book).then(response => {
                    if(response.errors) {
                        this.setState({
                            errorMessage: response.errors[0],
                        })
                    } else {
                        this.loadBookList();
                        this.setState({
                            isShow: false,
                            errorMessage: "",
                        }, () => {
                            NotificationManager.success('Add successfully', 'Add book');
                        })
                    }
                })
                break;
            }
            case Actions.EDIT: {
                this.props.bookActions.editBook(book.id, book).then(response => {
                    if(response.errors) {
                        this.setState({
                            errorMessage: response.errors[0],
                        })
                    } else {
                        this.loadBookList();
                        this.setState({
                            isShow: false,
                            errorMessage: "",
                        }, () => {
                            NotificationManager.success('Edit successfully', 'Edit book');
                        })
                    }
                })
                break;
            }
            default:
                break;
        }
    }

    loadBookList() {
        this.props.bookActions.getBookList();
    }

    handleOpenConfirmForm(e, book) {
        e.stopPropagation();
        this.setState({
            isShowConfirm: true,
            selectedBook: book,
        })
    }

    handleDeleteClick() {
        this.props.bookActions.deleteBook(this.state.selectedBook.id).then(response => {
            if(response.errors) {
                NotificationManager.error(response.errors[0], 'Errors');
                this.setState({
                    errorMessage: response.errors[0],
                })
            } else {
                this.loadBookList();
                this.setState({
                    isShowConfirm: false,
                    errorMessage: "",
                    selectedBook: null,
                }, () => {
                    NotificationManager.success('Delele successfully', 'Delete book');
                })
            }
        })
    }
    

    render() {
        return(
            <div className="book-container">
                <PageHeader>
                    Library <small>Book List</small>
                    <Button 
                        className="add-button"
                        onClick={(e) => {this.handleAction(e, null, Actions.ADD)}}
                    >
                        Add New
                    </Button>
                </PageHeader>
                <div className="list">
                    <Table bordered hover striped>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                _.map(this.props.books, (book, index) => {
                                    return (
                                        <tr key={index} onClick={(e) => { this.handleAction(e, book, Actions.VIEW)}}>
                                            <td>
                                                {index}
                                            </td>
                                            <td>
                                                {book.title}
                                            </td>
                                            <td>
                                                {book.author}
                                            </td>
                                            <td>
                                                <Button className="edit-button" onClick={(e) => {this.handleAction(e, book, Actions.EDIT)}}>
                                                    <i className="fas fa-edit"></i> Edit
                                                </Button>
                                                <Button onClick={(e) => {this.handleOpenConfirmForm(e, book)}}>
                                                    <i className="fas fa-trash-alt"></i> Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                <BookForm
                    isShow={this.state.isShow}
                    closeCallBack={this.handleCloseForm}
                    saveCallBack={this.handleSaveForm}
                    action={this.state.action}
                    book={this.state.selectedBook}
                    errorMessage={this.state.errorMessage}
                />
                <NotificationContainer />
                <Modal
                    show={this.state.isShowConfirm}
                    aria-labelledby="contained-modal-title"
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            Confirm
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Do you want to delete this book?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleDeleteClick} bsStyle="danger">Delete</Button>
                        <Button onClick={() => {this.setState({ isShowConfirm: false})}}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        books: state.books,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        bookActions: bindActionCreators(bookActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookList);
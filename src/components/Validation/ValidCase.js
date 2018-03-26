import React, { Component } from 'react';

export default class ValidCase extends Component {
    render() {
        const { valid, hide, message } = this.props;
        if( !valid && !hide ) {
            return(
                <p style={{color: 'red'}}>
                    {message}
                </p>
            )
        }
        return null;
    }
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HelpBlock } from 'react-bootstrap';

export default class Validator extends Component {
    render() {
        const { 
            enabled, 
            children, 
            id,
            callBack,
            styleClass,
            isMultiShow,
        } = this.props;

        if(enabled) {
            let messages = [];
            const showingChild = React.Children.map(children, 
                (child) => {
                    if(!child.props.valid) {
                        messages.push(child.props.messages);
                        if(((messages.length > 1 && isMultiShow) || messages.length === 1) && !child.props.hide) {
                            return React.cloneElement(child, {});
                        }
                    }
                    return null;
                }
            )
            if(id && callBack) {
                setTimeout(() => {
                    callBack(id, messages.length === 0, messages);
                }, 10);
            }
            return(
                showingChild && showingChild.length > 0 ? 
                    <HelpBlock className={styleClass}>
                        {
                            showingChild
                        }
                    </HelpBlock> 
                    : null
            )
        }
        
        callBack(id, true, null);
        return null;
    }
}

Validator.propTypes = {
    //enable validation
    enabled: PropTypes.bool,
    //string come from child ValidCase 
    id: PropTypes.string,
    //callBack function to build valid object
    callBack: PropTypes.func,
    //className
    styleClass: PropTypes.string,
    //show multi message or just single message errors
    isMultiShow: PropTypes.bool,
    //children element ValidCase
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
}

Validator.defaultProps = {
    enabled: false,
    isMultiShow: false,
    styleClass: "",
}
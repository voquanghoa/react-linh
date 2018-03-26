import _ from 'lodash';

export const commonFunctions = {
    isValidForm: function(data) {
        let object = _.find(_.keys(data), (item) => {
            return data[item] === false;
        });
        if(_.isUndefined(object)) {
            return true;
        }
        return false;
    },
    isEmail: function(data) {
        var regrex = /^(([^<>().,;:\s@"]+(.[^<>().,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regrex.test(data)) {
            return true;
        }
        return false;
    }
}
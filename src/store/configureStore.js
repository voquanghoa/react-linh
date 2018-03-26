import { 
    createStore, 
    applyMiddleware, 
    combineReducers, 
    compose 
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import bookReducer from './../reducers/bookReducer';
import userReducer from './../reducers/userReducer';

const rootReducer = combineReducers({
    books: bookReducer,
    user: userReducer
})

const logger = createLogger();

export default function configureStore() {
    return createStore(
        rootReducer,
        compose(
            applyMiddleware(thunkMiddleware, logger)
        )
    )
}
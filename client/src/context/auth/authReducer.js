import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';

export default (state, action) => {
    switch(action.type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            }
        case AUTH_ERROR:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            }
        case REGISTER_SUCCESS:
            // The token is stored in the localStorage of the browser
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case LOGIN_SUCCESS:
            // The token is stored in the localStorage of the browser
            localStorage.setItem('token', action.payload.token);
            // REALLY IMPORTANT TO UNDERSTAND THIS SYNTAX. Here, we return an object. First, the original state of the AuthState.js is 
            // spreaded, in other words, the object is spreaded and all its variables put inside this return object. Then, by adding variables
            // we could add extra variables to that original object, and return one with more parameters. However, by adding variables with the 
            // same name as the spreaded ones, we can override them. So "isAuthenticated" and "loading" are overriding the values spreaded 
            // by ...state. In general the original state always needs to be spreaded. The action.payload is only the token, so we can do
            // either token: action.payload.token, or just spread the whole action.payload into the object. 
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            }
        case LOGIN_FAIL:
        localStorage.removeItem('token');
        return {
            ...state,
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
            error: action.payload
        }
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}